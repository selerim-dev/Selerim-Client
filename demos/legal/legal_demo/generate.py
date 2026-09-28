"""Generate 30 fictional intake emails and text-PDF attachments, plus a separate oracle."""
import argparse
import hashlib
import json
import random
from pathlib import Path
from demos.logistics.selerim_demo.generate import pdf_bytes


def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + '\n')


def generate(output, seed=73):
    root = Path(output)
    root.mkdir(parents=True, exist_ok=False)
    inputs = root / 'inputs'
    inputs.mkdir()
    rng = random.Random(seed)
    inbox, answers = [], []
    names = ['Alder Quay', 'Morrow Field', 'Cedar Transit', 'Northline Foundry', 'Juniper Works',
             'Harbor Thread', 'Stillwater Freight', 'Copper Meadow', 'Westward Supply', 'Linden Forge']
    requests = ['Review a supplier agreement before renewal', 'Review a proposed distribution agreement',
                'Review a warehouse services agreement', 'Review a commercial software subscription',
                'Review proposed consulting terms']
    missing_letters = {4, 9, 16, 24}
    missing_contacts = {3, 11, 21}
    unsigned = {6, 14, 27}
    conflicts = {8, 30}
    for n in range(1, 31):
        matter = f'SYN-MAT-{n:03d}'
        company = f'{names[(n-1) % 10]} {"LLC" if n <= 10 else "Group" if n <= 20 else "Co"} (fictional)'
        contact = f'Fictional Contact {n:02d}'
        email = f'intake{n:02d}@example.invalid'
        request = requests[rng.randrange(len(requests))]
        email_text = '\n'.join(['SYNTHETIC INTAKE EMAIL - NOT A REAL CLIENT', f'Matter: {matter}',
            f'From: {email}', f'Subject: Intake request / {company}', '',
            'Please find the intake materials attached for review.',
            'This fictional message does not establish an attorney-client relationship.'])
        paths = inputs / 'matters' / matter
        paths.mkdir(parents=True)
        (paths / 'email.txt').write_text(email_text + '\n')
        form = {'matter_id': matter, 'company': company, 'contact_name': contact,
                'contact_email': email, 'request': request, 'requested_by': f'2026-10-{rng.randrange(12,29):02d}',
                'counterparty': f'Fictional Counterparty {n:02d}'}
        if n in missing_contacts:
            del form['contact_email']
        letter = {'matter_id': matter, 'company': company, 'scope': 'Initial document review only',
                  'signed': 'no' if n in unsigned else 'yes'}
        if n in conflicts:
            letter['company'] = f'Different Fictional Entity {n:02d}'
        documents, expected_docs, gaps = [], [], []
        for kind, fields in [('intake_form', form), ('engagement_letter', letter)]:
            if kind == 'engagement_letter' and n in missing_letters:
                gaps.append('missing_document:engagement_letter')
                continue
            doc = 'FORM' if kind == 'intake_form' else 'LETTER'
            # Held-out forms vary field order, spacing, and supported heading aliases.
            title = ('CLIENT INTAKE QUESTIONNAIRE' if n % 3 == 0 else 'INTAKE FORM') if doc == 'FORM' else ('ENGAGEMENT AGREEMENT' if n % 3 == 0 else 'ENGAGEMENT LETTER')
            pairs = list(fields.items())
            if n % 3 == 0:
                rng.shuffle(pairs)
            lines = ['SYNTHETIC DEMO - NOT A REAL LEGAL DOCUMENT', title, ''] + [f'{k}: {v}' for k,v in pairs]
            (paths / f'{doc}.pdf').write_bytes(pdf_bytes(lines))
            documents.append({'id': doc, 'path': f'matters/{matter}/{doc}.pdf'})
            expected_docs.append({'id': doc, 'type': kind, 'fields': fields})
        if n in missing_contacts:
            gaps.append('missing_field:intake_form.contact_email')
        if n in unsigned:
            gaps.append('unsigned:engagement_letter')
        if n in conflicts:
            gaps.append('conflict:company')
        inbox.append({'matter_id': matter, 'received_at': f'2026-09-28T09:{n:02d}:00Z',
                      'email': f'matters/{matter}/email.txt', 'documents': documents})
        answers.append({'matter_id': matter, 'split': 'heldout' if n % 3 == 0 else 'train',
                        'documents': expected_docs, 'issues': sorted(gaps),
                        'route': 'incomplete' if gaps else 'attorney_review'})
    dump(inputs / 'job.json', {'job_id': f'synthetic-legal-{seed}', 'synthetic': True,
         'policy': 'Local fictional intake only. No autonomous legal advice or client acceptance.'})
    dump(inputs / 'inbox.json', inbox)
    dump(root / 'evaluation/expected.json', answers)
    dump(root / 'evaluation/split.json', {split: [m['matter_id'] for m in answers if m['split']==split] for split in ('train','heldout')})
    dump(root / 'manifest.json', {str(p.relative_to(inputs)): hashlib.sha256(p.read_bytes()).hexdigest()
                                for p in sorted(inputs.rglob('*')) if p.is_file()})
    return root


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    parser.add_argument('--seed', type=int, default=73)
    args = parser.parse_args()
    print(generate(args.output, args.seed))
