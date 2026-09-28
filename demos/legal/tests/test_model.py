import json
import os
import unittest
from unittest.mock import patch
from demos.legal.legal_demo.drafting import OpenAIBrief

class Response:
    def __init__(self,order):self.order=order
    def __enter__(self):return self
    def __exit__(self,*args):pass
    def read(self,*args):return json.dumps({'status':'completed','output':[{'type':'message','content':[{'type':'output_text','text':json.dumps({'order':self.order})}]}]}).encode()

class ModelTests(unittest.TestCase):
    def test_exact_citations_preserved_and_no_tools(self):
        summary=[{'text':'Fictional request.','source':{'document':'FORM','line':7}}, {'text':'Fictional company.','source':{'document':'FORM','line':4}}]
        def provider(req,timeout):
            data=json.loads(req.data)
            self.assertFalse(data['store']);self.assertNotIn('tools',data)
            self.assertNotIn('evaluation',data['input'])
            return Response([1,0])
        with patch.dict(os.environ,{'OPENAI_API_KEY':'unit-test-only'}),patch('urllib.request.urlopen',provider):
            self.assertEqual(OpenAIBrief('test-model')('SYN-MAT-001',summary),list(reversed(summary)))
    def test_missing_repeated_or_foreign_indexes_fail(self):
        with patch.dict(os.environ,{'OPENAI_API_KEY':'unit-test-only'}):
            for order in ([],[1],[0,0],[True]):
                with patch('urllib.request.urlopen',return_value=Response(order)),self.assertRaises(ValueError):
                    OpenAIBrief('test-model')('SYN-MAT-001',[{'text':'Fictional.','source':{}}])
