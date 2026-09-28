import io
import re
import tempfile
import unittest
from pathlib import Path
from urllib.parse import urlencode
from demos.hosting.app import Gateway,COOKIE
from demos.legal.legal_demo.generate import generate


class GatewayTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        generate(self.root/'fixture')
        self.app=Gateway('legal',self.root/'fixture/inputs',self.root/'state','https://legal.example.invalid','a'*32,'s'*48)
    def tearDown(self):self.temp.cleanup()
    def call(self,path='/',method='GET',values=None,cookie='',origin='https://legal.example.invalid'):
        data=urlencode(values or {}).encode();out={}
        env={'HTTP_HOST':'legal.example.invalid','PATH_INFO':path,'REQUEST_METHOD':method,'HTTP_ORIGIN':origin,'CONTENT_LENGTH':str(len(data)),'wsgi.input':io.BytesIO(data),'HTTP_COOKIE':cookie,'REMOTE_ADDR':'127.0.0.1'}
        def start(status,headers):out.update(status=int(status[:3]),headers=dict(headers))
        out['body']=b''.join(self.app(env,start)).decode(errors='replace');return out
    def login(self):
        result=self.call('/login','POST',{'access':'a'*32})
        self.assertEqual(result['status'],303)
        self.assertIn('Secure; HttpOnly; SameSite=Strict',result['headers']['Set-Cookie'])
        return result['headers']['Set-Cookie'].split(';')[0]
    def test_auth_assets_and_cookie_tamper(self):
        self.assertEqual(self.call('/assets/legal.css')['status'],401)
        self.assertEqual(self.call('/login','POST',{'access':'a'*32},origin='https://evil.invalid')['status'],403)
        cookie=self.login()
        self.assertEqual(self.call(cookie=cookie)['status'],200)
        self.assertEqual(self.call('/assets/legal.css',cookie=cookie+'x')['status'],401)
    def test_independent_sessions_csrf_approval_and_logout(self):
        first,second=self.login(),self.login()
        page=self.call(cookie=first)['body'];token=re.search('name="token" value="([^"]+)"',page).group(1)
        values={'token':token,'matter':'SYN-MAT-001','action':'approve','reviewed':'yes'}
        self.assertEqual(self.call('/action','POST',values,second)['status'],403)
        self.assertEqual(self.call('/action','POST',values,first)['status'],303)
        self.assertIn('File reviewed intake',self.call(cookie=first)['body'])
        self.assertIn('Approve intake summary',self.call(cookie=second)['body'])
        self.assertEqual(self.call('/logout','POST',{'token':token},first)['status'],303)
        self.assertEqual(self.call('/assets/legal.css',cookie=first)['status'],401)
    def test_login_throttles_and_requires_https(self):
        for _ in range(5):self.assertEqual(self.call('/login','POST',{'access':'wrong'})['status'],403)
        self.assertEqual(self.call('/login','POST',{'access':'a'*32})['status'],403)
        with self.assertRaises(ValueError):Gateway('legal',self.root/'fixture/inputs',self.root/'bad','http://public.invalid','a'*32,'s'*48)
