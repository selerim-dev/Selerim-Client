import io
import json
import unittest
from unittest.mock import patch
from selerim_demo.drafting import OpenAIDrafter


class DraftingTests(unittest.TestCase):
    def test_missing_key_fails_explicitly(self):
        with patch.dict('os.environ',{},clear=True):
            with self.assertRaises(ValueError): OpenAIDrafter('test-model')

    def test_only_scoped_synthetic_facts_sent_and_no_tools(self):
        result={'status':'completed','id':'fake-id','output':[{'type':'message','content':[{'type':'output_text','text':'Please supply the missing POD.'}]}]}
        with patch.dict('os.environ',{'OPENAI_API_KEY':'test-only'}),patch('urllib.request.urlopen',return_value=io.BytesIO(json.dumps(result).encode())) as call:
            body,meta=OpenAIDrafter('test-model')('SYN-SHP-0001',['Missing POD'])
            payload=json.loads(call.call_args.args[0].data)
            self.assertFalse(payload['store'])
            self.assertNotIn('tools',payload)
            self.assertEqual(set(json.loads(payload['input'])),{'synthetic','shipment_id','issues'})
            self.assertIn('AI-generated',body)
            self.assertEqual(meta['provider'],'openai')

    def test_failure_never_becomes_an_approved_draft(self):
        with patch.dict('os.environ',{'OPENAI_API_KEY':'test-only'}),patch('urllib.request.urlopen',side_effect=Exception('sensitive provider detail')):
            with self.assertRaisesRegex(ValueError,'LLM drafting failed') as caught:
                OpenAIDrafter('test-model')('SYN-SHP-0001',['Missing POD'])
            self.assertNotIn('sensitive',str(caught.exception))
