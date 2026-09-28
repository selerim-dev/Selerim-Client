"""Run actual extraction in isolated train/held-out jobs; evaluate against separate labels."""
import argparse
import json
import shutil
from pathlib import Path
from .engine import Engine
from .generate import dump


def isolated_inputs(dataset, output, split):
    root=Path(dataset)
    ids=set(json.loads((root/'evaluation/split.json').read_text())[split])
    destination=Path(output)
    destination.mkdir(parents=True,exist_ok=False)
    shutil.copy2(root/'inputs/job.json',destination/'job.json')
    inbox=[row for row in json.loads((root/'inputs/inbox.json').read_text()) if row['matter_id'] in ids]
    dump(destination/'inbox.json',inbox)
    for entry in inbox:
        matter=entry['matter_id']
        shutil.copytree(root/'inputs/matters'/matter,destination/'matters'/matter)
    return destination


def score(expected, actual):
    errors=[]
    by_id={m['matter_id']:m for m in actual}
    if len(by_id)!=len(actual) or set(by_id)!={m['matter_id'] for m in expected}:
        errors.append('Matter ID coverage differs')
    fields=correct_fields=documents=correct_types=sentences=linked=0
    for want in expected:
        got=by_id.get(want['matter_id'],{})
        docs={d['id']:d for d in got.get('documents',[])}
        if set(docs)!={d['id'] for d in want['documents']}:
            errors.append(want['matter_id']+': document coverage differs')
        for doc in want['documents']:
            documents+=1
            observed=docs.get(doc['id'],{})
            correct_types+=observed.get('type')==doc['type']
            if observed.get('fields')!=doc['fields']:
                errors.append(want['matter_id']+'/'+doc['id']+': extracted fields differ')
            for key,value in doc['fields'].items():
                fields+=1
                correct_fields+=observed.get('fields',{}).get(key)==value
        if got.get('route')!=want['route'] or got.get('issues')!=want['issues']:
            errors.append(want['matter_id']+': routing/findings differ')
        for sentence in got.get('summary',[]):
            sentences+=1
            source=sentence.get('source',{})
            doc=docs.get(source.get('document'),{})
            linked+=source in doc.get('citations',{}).values() and bool(source.get('quote')) and bool(sentence.get('text'))
        expected_sentences=sum(len(set(d['fields']) & ({'company','contact_name','request','counterparty','requested_by'} if d['type']=='intake_form' else {'scope'})) for d in want['documents'])
        if len(got.get('summary',[]))!=expected_sentences:
            errors.append(want['matter_id']+': summary coverage differs')
    if correct_types!=documents:
        errors.append('Classification differs')
    if sentences!=linked:
        errors.append('Unlinked summary statements')
    return {'passed':not errors,'matters':len(expected),'documents':documents,'correct_classifications':correct_types,
            'fields':fields,'correct_fields':correct_fields,'sentences':sentences,'linked_sentences':linked,'errors':errors}


def evaluate(dataset, output):
    output=Path(output)
    output.mkdir(parents=True,exist_ok=False)
    oracle=json.loads((Path(dataset)/'evaluation/expected.json').read_text())
    reports={}
    for split in ('train','heldout'):
        inputs=isolated_inputs(dataset,output/split/'inputs',split)
        engine=Engine(inputs,output/split/'state.sqlite')
        actual=engine.process()
        reports[split]=score([r for r in oracle if r['split']==split],actual)
        reports[split]['audit_chain_verified']=engine.verify_log()
        dump(output/split/'predictions.json',actual)
    dump(output/'report.json',reports)
    return reports


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dataset',required=True)
    parser.add_argument('--output',required=True)
    args=parser.parse_args()
    reports=evaluate(args.dataset,args.output)
    print(json.dumps(reports,indent=2))
    raise SystemExit(0 if all(r['passed'] for r in reports.values()) else 1)
