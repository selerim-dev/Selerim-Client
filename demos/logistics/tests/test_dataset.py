import copy
import hashlib
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path
from selerim_demo.generate import generate
from selerim_demo.evaluate import score


class DatasetTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root=Path(self.temp.name)/'fixture'
        self.manifest=generate(self.root)
        self.expected=json.loads((self.root/'evaluation/expected.json').read_text())

    def test_counts_and_database_integrity(self):
        self.assertEqual(self.manifest['counts'], {'shipments':50,'documents':40,'clean_documents':30,'missing_documents':65,'document_findings':11})
        with sqlite3.connect(self.root/'inputs/records.sqlite') as db:
            self.assertEqual(db.execute('PRAGMA integrity_check').fetchone()[0],'ok')
            rows=db.execute('SELECT job_id,contact_email FROM shipments').fetchall()
        self.assertEqual(len(rows),50)
        self.assertEqual(len({r[0] for r in rows}),1)
        self.assertTrue(all(r[1].endswith('@example.invalid') for r in rows))

    def test_reproducibility_and_seed_variation(self):
        other=Path(self.temp.name)/'repeat'
        self.assertEqual(generate(other),self.manifest)
        for p in self.root.rglob('*'):
            if p.is_file():self.assertEqual(p.read_bytes(),(other/p.relative_to(self.root)).read_bytes())
        changed=generate(Path(self.temp.name)/'changed',seed=43)
        self.assertNotEqual(changed['inputs']['shipments.json'],self.manifest['inputs']['shipments.json'])

    def test_no_overwrite(self):
        with self.assertRaises(FileExistsError):generate(self.root)
        self.assertEqual(json.loads((self.root/'manifest.json').read_text()),self.manifest)

    def test_split_and_oracle_isolation(self):
        split=json.loads((self.root/'evaluation/split.json').read_text())
        self.assertEqual((len(split['train']),len(split['heldout'])),(40,10))
        self.assertFalse(set(split['train']) & set(split['heldout']))
        for d in self.expected['documents']:
            if d['shipment_id']:self.assertIn(d['shipment_id'],split[d['split']])
        inbox=json.loads((self.root/'inputs/inbox.json').read_text())
        for d in inbox:
            self.assertFalse({'findings','clean','expected_fields','split'} & d.keys())
            self.assertTrue((self.root/'inputs'/d['attachment']).is_file())
        self.assertEqual(self.expected['documents'][38]['sha256'],self.expected['documents'][0]['sha256'])
        self.assertEqual(self.expected['documents'][29]['split'],'heldout')

    def test_gap_oracle_independently(self):
        gaps={(g['shipment_id'],g['document_type']) for g in self.expected['missing_documents']}
        expected={(f'SYN-SHP-{i:04d}',kind) for i in range(19,51) for kind in ['BOL','POD']}
        expected.add(('SYN-SHP-0015','POD'))
        self.assertEqual(gaps,expected)
        for relative,checksum in self.manifest['inputs'].items():
            self.assertEqual(hashlib.sha256((self.root/'inputs'/relative).read_bytes()).hexdigest(),checksum)

    def test_scorer_negative_controls(self):
        # Oracle replay validates the scorer, not agent accuracy.
        self.assertTrue(score(self.expected,self.expected)['passed'])
        mutations=[lambda p:p['documents'][0].update(shipment_id='wrong'),
                   lambda p:p['documents'][0].update(type='wrong'),
                   lambda p:p['documents'][4].update(findings=[]),
                   lambda p:p['documents'][0].update(findings=['unmatched']),
                   lambda p:p['missing_documents'].pop(),
                   lambda p:p['missing_documents'].append({'shipment_id':'unknown','document_type':'POD'})]
        for mutate in mutations:
            predicted=copy.deepcopy(self.expected);mutate(predicted)
            self.assertFalse(score(self.expected,predicted)['passed'])
        invalid=copy.deepcopy(self.expected);invalid['documents'].append(invalid['documents'][0])
        with self.assertRaises(ValueError):score(self.expected,invalid)
        for split in ['train','heldout']:
            subset={k:[d for d in self.expected[k] if d['split']==split] for k in ['documents','missing_documents']}
            self.assertTrue(score(self.expected,subset,split)['passed'])


if __name__=='__main__':unittest.main()
