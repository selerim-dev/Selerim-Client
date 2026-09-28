import copy
import io
import json
import re
import sqlite3
import tempfile
import threading
import unittest
from http.client import HTTPConnection
from pathlib import Path
from urllib.parse import urlencode
from pypdf import PdfReader
from demos.legal.legal_demo.generate import generate
from demos.legal.legal_demo.engine import Engine, extract
from demos.legal.legal_demo.evaluate import score, isolated_inputs
from demos.legal.legal_demo.server import make_server
from demos.logistics.selerim_demo.generate import pdf_bytes


class LegalTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory()
        self.root=Path(self.tmp.name)
        self.dataset=generate(self.root/'dataset')
        self.inputs=self.dataset/'inputs'
        self.engine=Engine(self.inputs,self.root/'runtime.sqlite')
        self.actual=self.engine.process()
        self.expected=json.loads((self.dataset/'evaluation/expected.json').read_text())

    def tearDown(self):
        self.tmp.cleanup()

    def test_dataset_deterministic_counts_and_no_overwrite(self):
        other=generate(self.root/'second')
        self.assertEqual((self.dataset/'manifest.json').read_bytes(),(other/'manifest.json').read_bytes())
        self.assertEqual(len(self.actual),30)
        self.assertEqual(sum(len(m['documents']) for m in self.actual),56)
        self.assertEqual(sum(m['route']=='incomplete' for m in self.actual),12)
        self.assertEqual(len(list(self.inputs.rglob('email.txt'))),30)
        with self.assertRaises(FileExistsError):
            generate(self.dataset)

    def test_actual_parser_against_independent_oracle(self):
        result=score(self.expected,self.actual)
        self.assertTrue(result['passed'],result)
        self.assertEqual(result['fields'],result['correct_fields'])
        self.assertEqual(result['documents'],56)

    def test_heldout_inputs_physically_isolated(self):
        isolated=isolated_inputs(self.dataset,self.root/'heldout','heldout')
        self.assertFalse((isolated/'evaluation').exists())
        self.assertFalse((isolated/'matters/SYN-MAT-001').exists())
        engine=Engine(isolated,self.root/'heldout.sqlite')
        actual=engine.process()
        self.assertEqual(len(actual),10)
        self.assertTrue(score([r for r in self.expected if r['split']=='heldout'],actual)['passed'])

    def test_scorer_rejects_wrong_classification_field_route_and_missing_citation(self):
        mutations=[lambda m:m['documents'][0].update(type='wrong'),
                   lambda m:m['documents'][0]['fields'].update(company='Wrong'),
                   lambda m:m.update(route='incomplete'),
                   lambda m:m['summary'][0].update(source={}),
                   lambda m:m.update(summary=[])]
        for mutation in mutations:
            actual=copy.deepcopy(self.actual)
            mutation(actual[0])
            self.assertFalse(score(self.expected,actual)['passed'])

    def test_every_summary_claim_has_exact_source_line_and_field(self):
        for matter in self.actual:
            for sentence in matter['summary']:
                source=sentence['source']
                payload=self.engine.source(matter['matter_id'],source['document'])
                page=PdfReader(io.BytesIO(payload)).pages[source['page']-1]
                line=page.extract_text().splitlines()[source['line']-1]
                self.assertEqual(line,source['quote'])
                value=line.split(':',1)[1].strip()
                self.assertIn(value,sentence['text'])
        self.assertTrue(self.engine.verify_log())

    def test_finalize_gate_incomplete_route_and_replay(self):
        with self.assertRaises(ValueError):
            self.engine.act('SYN-MAT-001','finalize')
        for action in ('approve','finalize'):
            with self.assertRaises(ValueError):
                self.engine.act('SYN-MAT-003',action)
        self.engine.act('SYN-MAT-003','return')
        self.engine.act('SYN-MAT-001','approve')
        self.engine.act('SYN-MAT-001','finalize')
        self.engine.act('SYN-MAT-001','finalize')
        states={m['matter_id']:m['status'] for m in self.engine.snapshot()}
        self.assertEqual(states['SYN-MAT-001'],'finalized')
        self.assertEqual(states['SYN-MAT-003'],'returned')
        self.assertEqual(sum(r['action']=='human_finalized' for r in self.engine.events()),1)
        self.assertTrue(self.engine.verify_log())

    def test_source_change_blocks_existing_approval(self):
        self.engine.act('SYN-MAT-001','approve')
        source=self.inputs/'matters/SYN-MAT-001/FORM.pdf'
        source.write_bytes(source.read_bytes()+b'\nchanged')
        with self.assertRaises(ValueError):
            self.engine.act('SYN-MAT-001','finalize')
        with self.assertRaises(ValueError):
            self.engine.source('SYN-MAT-001','FORM')
        self.assertEqual(self.engine.snapshot()[0]['status'],'approved')

    def test_matter_paths_and_symlinks_are_rejected(self):
        with self.assertRaises(ValueError):
            self.engine.read('matters/SYN-MAT-002/FORM.pdf','SYN-MAT-001')
        with self.assertRaises(ValueError):
            self.engine.source('SYN-MAT-001','../SYN-MAT-002/FORM')
        link=self.inputs/'matters/SYN-MAT-001/linked.pdf'
        link.symlink_to(self.inputs/'matters/SYN-MAT-002/FORM.pdf')
        with self.assertRaises(ValueError):
            self.engine.read('matters/SYN-MAT-001/linked.pdf','SYN-MAT-001')

    def test_foreign_reference_and_unsupported_documents_do_not_leak_fields(self):
        payload=pdf_bytes(['INTAKE FORM','matter_id: SYN-MAT-002','company: FOREIGN SECRET'])
        result=extract(payload,'FORM','SYN-MAT-001')
        self.assertEqual(result['fields'],{})
        self.assertEqual(result['citations'],{})
        self.assertEqual(result['issues'],['scope_mismatch:FORM'])
        unknown=extract(pdf_bytes(['RANDOM DOCUMENT','secret: NOT RETAINED']),'OTHER','SYN-MAT-001')
        self.assertEqual(unknown['type'],'unsupported')
        repeated=extract(pdf_bytes(['INTAKE FORM','matter_id: SYN-MAT-001','company: A','company: B']),'FORM','SYN-MAT-001')
        self.assertEqual(repeated['fields'],{})

    def test_foreign_matter_attachment_cannot_be_served(self):
        path=self.inputs/'matters/SYN-MAT-001/FORM.pdf'
        path.write_bytes(pdf_bytes(['INTAKE FORM','matter_id: SYN-MAT-002','company: FOREIGN SECRET']))
        engine=Engine(self.inputs,self.root/'foreign-review.sqlite')
        results=engine.process()
        self.assertEqual(results[0]['route'],'incomplete')
        self.assertNotIn('FOREIGN SECRET',json.dumps(results[0]))
        with self.assertRaises(ValueError):
            engine.source('SYN-MAT-001','FORM')
        self.assertTrue(engine.verify_log())

    def test_minimal_retention_and_append_only_log(self):
        with self.engine.connect() as db:
            result=db.execute('SELECT result FROM matters LIMIT 1').fetchone()[0]
            self.assertNotIn('Please find the intake materials',result)
            self.assertNotIn('%PDF',result)
            with self.assertRaises(sqlite3.IntegrityError):
                db.execute('DELETE FROM events')
            with self.assertRaises(sqlite3.IntegrityError):
                db.execute("UPDATE events SET action='altered'")
        self.assertTrue(self.engine.verify_log())

    def test_restart_is_idempotent_and_job_cannot_be_swapped(self):
        before=len(self.engine.events())
        self.engine.process()
        restarted=Engine(self.inputs,self.root/'runtime.sqlite')
        restarted.process()
        self.assertEqual(len(restarted.events()),before)
        job=self.inputs/'job.json'
        data=json.loads(job.read_text());data['job_id']='foreign-job';job.write_text(json.dumps(data))
        with self.assertRaises(ValueError):
            Engine(self.inputs,self.root/'runtime.sqlite')

    def test_http_guards_attestation_and_two_step_review(self):
        server=make_server(self.engine,0)
        thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
        port=server.server_port
        def request(method,path,body=None,headers=None):
            connection=HTTPConnection('127.0.0.1',port)
            connection.request(method,path,body,headers or {})
            response=connection.getresponse()
            result=(response.status,dict(response.getheaders()),response.read().decode(errors='replace'))
            connection.close()
            return result
        try:
            status,headers,page=request('GET','/')
            self.assertEqual(status,200)
            self.assertIn("script-src 'self'",headers['Content-Security-Policy'])
            self.assertEqual(headers['Referrer-Policy'],'same-origin')
            token=re.search('name="token" value="([^"]+)"',page).group(1)
            self.assertEqual(request('GET','/',headers={'Host':'evil.invalid'})[0],403)
            form={'token':token,'matter':'SYN-MAT-001','action':'approve'}
            self.assertEqual(request('POST','/action',urlencode(form))[0],409)
            form['reviewed']='yes'
            self.assertEqual(request('POST','/action',urlencode(form),{'Origin':'https://evil.invalid'})[0],403)
            self.assertEqual(request('POST','/action',urlencode(dict(form,token='wrong')))[0],403)
            self.assertEqual(request('POST','/action',urlencode(dict(form,action='finalize')))[0],409)
            self.assertEqual(request('POST','/action',urlencode(form),{'Origin':f'http://127.0.0.1:{port}'})[0],303)
            status,headers,_=request('POST','/action',urlencode(dict(form,action='finalize')))
            self.assertEqual(status,303)
            self.assertIn('view=filed',headers['Location'])
            self.assertEqual(request('GET','/source?matter=SYN-MAT-001&document=../../job')[0],404)
            status,_,page=request('GET','/?q=%3Cscript%3Ealert(1)%3C/script%3E')
            self.assertEqual(status,200)
            self.assertNotIn('<script>alert(1)</script>',page)
            self.assertEqual(request('GET','/assets/../engine.py')[0],404)
            self.assertEqual(request('GET','/assets/legal.css')[0],200)
        finally:
            server.shutdown();server.server_close();thread.join()


if __name__=='__main__':
    unittest.main()
