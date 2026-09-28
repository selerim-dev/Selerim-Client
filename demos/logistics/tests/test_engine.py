import json
import sqlite3
import tempfile
import unittest
from pathlib import Path
from selerim_demo.generate import generate
from selerim_demo.engine import Engine
from selerim_demo.evaluate import score


class EngineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        generate(self.root / 'fixture')
        self.inputs = self.root / 'fixture/inputs'
        self.engine = Engine(self.inputs, self.root / 'state.sqlite')

    def test_actual_parser_against_oracle(self):
        expected = json.loads((self.root / 'fixture/evaluation/expected.json').read_text())
        result = self.engine.process()
        self.assertTrue(score(expected, result)['passed'])
        for doc, predicted in zip(expected['documents'], result['documents']):
            self.assertEqual(doc['expected_fields'], predicted['fields'])
        self.assertEqual(len(self.engine.snapshot()['outbox']), 0)
        self.assertTrue(self.engine.verify_log())

    def test_approval_gate_and_replay(self):
        self.engine.process()
        draft = self.engine.snapshot()['drafts'][0]['id']
        with self.assertRaises(ValueError): self.engine.act(draft, 'send')
        self.assertFalse(self.engine.snapshot()['outbox'])
        self.engine.act(draft, 'approve')
        self.assertFalse(self.engine.snapshot()['outbox'])
        self.engine.act(draft, 'send')
        self.engine.act(draft, 'send')
        snapshot = self.engine.snapshot()
        self.assertEqual(len(snapshot['outbox']), 1)
        actions = [e['action'] for e in snapshot['events']]
        self.assertLess(actions.index('human_approved'), actions.index('fake_outbox_written'))
        self.assertIn('action_denied', actions)
        self.assertTrue(self.engine.verify_log())

    def test_rejection_blocks_send_and_audit_is_append_only(self):
        self.engine.process()
        draft = self.engine.snapshot()['drafts'][0]['id']
        self.engine.act(draft, 'reject')
        with self.assertRaises(ValueError): self.engine.act(draft, 'send')
        with self.engine.connect() as db:
            with self.assertRaises(sqlite3.IntegrityError): db.execute('DELETE FROM events')
            with self.assertRaises(sqlite3.IntegrityError): db.execute("UPDATE events SET action='fake'")

    def test_reprocessing_and_restart_are_idempotent(self):
        first = self.engine.process()
        count = len(self.engine.snapshot()['events'])
        self.assertEqual(first, self.engine.process())
        again = Engine(self.inputs, self.root / 'state.sqlite')
        self.assertEqual(first, again.process())
        self.assertEqual(count, len(again.snapshot()['events']))

    def test_scope_and_snapshot_protection(self):
        inbox = json.loads((self.inputs / 'inbox.json').read_text())
        inbox[0]['attachment'] = '../evaluation/expected.json'
        (self.inputs / 'inbox.json').write_text(json.dumps(inbox))
        with self.assertRaises(ValueError): self.engine.process()
        self.assertEqual(self.engine.snapshot()['events'][-1]['action'], 'scope_denied')
        self.assertFalse(self.engine.snapshot()['outbox'])
        (self.inputs / 'job.json').write_text('{}')
        with self.assertRaises(ValueError): self.engine.process()

    def test_cross_job_denied(self):
        inbox = json.loads((self.inputs / 'inbox.json').read_text())
        inbox[0]['job_id'] = 'other-job'
        (self.inputs / 'inbox.json').write_text(json.dumps(inbox))
        with self.assertRaises(ValueError): self.engine.process()
        self.assertFalse(self.engine.snapshot()['documents'])

    def test_changed_evidence_invalidates_approval(self):
        inbox = json.loads((self.inputs / 'inbox.json').read_text())
        # Start before shipment 1's POD arrives, approve its missing-POD draft.
        (self.inputs / 'inbox.json').write_text(json.dumps([d for d in inbox if d['document_id'] != 'DOC-002']))
        self.engine.process()
        draft = next(d for d in self.engine.snapshot()['drafts'] if d['shipment'] == 'SYN-SHP-0001')
        self.engine.act(draft['id'], 'approve')
        (self.inputs / 'inbox.json').write_text(json.dumps(inbox))
        with self.assertRaises(ValueError): self.engine.act(draft['id'], 'send')
        self.assertFalse(self.engine.snapshot()['outbox'])
        self.assertIn('draft_invalidated', [e['action'] for e in self.engine.snapshot()['events']])

    def test_llm_draft_still_requires_approval_and_is_not_regenerated(self):
        calls = []
        def draft(shipment, issues):
            calls.append(shipment)
            return 'Synthetic AI draft for ' + shipment, {'provider': 'mock'}
        engine = Engine(self.inputs, self.root / 'llm.sqlite', draft)
        engine.process()
        self.assertEqual(len(calls), 38)
        self.assertTrue(all(d['status'] == 'pending' for d in engine.snapshot()['drafts']))
        engine.process()
        self.assertEqual(len(calls), 38)
        with self.assertRaises(ValueError): engine.act(1, 'send')
        self.assertFalse(engine.snapshot()['outbox'])

    def test_llm_failure_records_failure_without_fake_success(self):
        def fail(shipment, issues):
            raise ValueError('LLM drafting failed')
        engine = Engine(self.inputs, self.root / 'failed.sqlite', fail)
        with self.assertRaises(ValueError): engine.process()
        self.assertFalse(engine.snapshot()['drafts'])
        self.assertFalse(engine.snapshot()['outbox'])
        self.assertEqual(engine.snapshot()['events'][-1]['action'], 'llm_draft_failed')

    def test_heldout_job_has_no_training_inputs(self):
        import shutil
        expected = json.loads((self.root / 'fixture/evaluation/expected.json').read_text())
        split = json.loads((self.root / 'fixture/evaluation/split.json').read_text())
        target = self.root / 'heldout-inputs'
        target.mkdir(); (target / 'documents').mkdir()
        for name in ('job.json', 'records.sqlite'):
            shutil.copyfile(self.inputs / name, target / name)
        with sqlite3.connect(target / 'records.sqlite') as db:
            db.executemany('DELETE FROM shipments WHERE shipment_id=?', [(s,) for s in split['train']])
        selected = {d['document_id'] for d in expected['documents'] if d['split'] == 'heldout'}
        inbox = [d for d in json.loads((self.inputs / 'inbox.json').read_text()) if d['document_id'] in selected]
        (target / 'inbox.json').write_text(json.dumps(inbox))
        for d in inbox: shutil.copyfile(self.inputs / d['attachment'], target / d['attachment'])
        engine = Engine(target, self.root / 'heldout.sqlite')
        self.assertTrue(score(expected, engine.process(), 'heldout')['passed'])
