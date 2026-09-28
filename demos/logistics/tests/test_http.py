import http.client
import re
import tempfile
import threading
import unittest
from pathlib import Path
from urllib.parse import urlencode
from selerim_demo.generate import generate
from selerim_demo.engine import Engine
from selerim_demo.server import make_server


class HTTPTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory(); self.addCleanup(self.temp.cleanup)
        root=Path(self.temp.name); generate(root/'fixture')
        self.engine=Engine(root/'fixture/inputs',root/'state.sqlite'); self.engine.process()
        self.server=make_server(self.engine,0)
        threading.Thread(target=self.server.serve_forever,daemon=True).start()
        self.addCleanup(self.server.server_close);self.addCleanup(self.server.shutdown)

    def request(self,method,path,body='',headers=None):
        c=http.client.HTTPConnection('127.0.0.1',self.server.server_port)
        c.request(method,path,body,headers or {})
        response=c.getresponse();data=response.read().decode();status=response.status;c.close()
        return status,data

    def test_browser_action_security_and_flow(self):
        status,page=self.request('GET','/')
        self.assertEqual(status,200)
        token=re.search('name="token" value="([^"]+)"',page)[1]
        draft=self.engine.snapshot()['drafts'][0]['id']
        def post(action,secret=token,origin=None):
            return self.request('POST','/action',urlencode({'token':secret,'draft':draft,'action':action}),
                                {'Content-Type':'application/x-www-form-urlencoded',**({'Origin':origin} if origin else {})})[0]
        self.assertEqual(post('approve','wrong'),403)
        self.assertEqual(post('approve',origin='https://evil.invalid'),403)
        self.assertEqual(post('send'),409)
        self.assertEqual(post('approve'),303)
        self.assertEqual(post('send'),303)
        self.assertEqual(post('send'),303)
        self.assertEqual(len(self.engine.snapshot()['outbox']),1)
        self.assertEqual(self.request('GET','/',headers={'Host':'evil.invalid'})[0],403)
        self.assertEqual(self.request('GET','/document?id=../../private')[0],404)
