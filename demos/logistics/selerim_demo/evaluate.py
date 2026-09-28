"""Score fixture findings. This does not execute an agent or verify approval gates."""
import argparse
import json


def score(expected, predictions, split='all'):
    docs = [d for d in expected['documents'] if split == 'all' or d['split'] == split]
    rows = predictions['documents']
    ids = [d['document_id'] for d in rows]
    if len(ids) != len(set(ids)) or set(ids) != {d['document_id'] for d in docs}:
        raise ValueError('Require exactly one prediction per document in the selected split')
    lookup = {d['document_id']: d for d in rows}
    wanted = {(d['document_id'], f) for d in docs for f in d['findings']}
    actual = {(d['document_id'], f) for d in rows for f in d['findings']}
    gaps = {(g['shipment_id'], g['document_type']) for g in expected['missing_documents'] if split == 'all' or g['split'] == split}
    reported = {(g['shipment_id'], g['document_type']) for g in predictions['missing_documents']}
    wrong = [d['document_id'] for d in docs if any(lookup[d['document_id']].get(k) != d[k] for k in ['shipment_id', 'type'])]
    clean = [d for d in docs if d['clean']]
    result = {'documents':len(docs), 'clean_documents':len(clean),
              'clean_matches':sum(lookup[d['document_id']].get('shipment_id') == d['shipment_id'] for d in clean),
              'incorrect_match_or_type':wrong, 'missed_findings':sorted(wanted-actual),
              'unexpected_findings':sorted(actual-wanted), 'missed_gaps':sorted(gaps-reported),
              'unexpected_gaps':sorted(reported-gaps)}
    result['passed'] = not any(result[k] for k in ['incorrect_match_or_type','missed_findings','unexpected_findings','missed_gaps','unexpected_gaps'])
    return result


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--expected',required=True)
    p.add_argument('--predictions',required=True)
    p.add_argument('--split',choices=['all','train','heldout'],default='all')
    args=p.parse_args()
    try:
        with open(args.expected) as f: expected=json.load(f)
        with open(args.predictions) as f: predictions=json.load(f)
        result=score(expected,predictions,args.split)
    except (ValueError,KeyError,TypeError) as exc:
        p.error(str(exc))
    print(json.dumps(result,indent=2))
    raise SystemExit(0 if result['passed'] else 1)


if __name__ == '__main__':
    main()
