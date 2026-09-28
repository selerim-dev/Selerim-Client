"""Single-host WSGI gateway for isolated, access-controlled fictional demo sessions.

Requires a persistent local volume; intentionally refuses ephemeral/serverless
storage. Run one DEMO_KIND per hostname. No upload or real email endpoints.
"""
import fcntl
import hashlib
import hmac
import html
import json
import os
import re
import secrets
import sqlite3
import time
from contextlib import contextmanager
from http.cookies import SimpleCookie
from pathlib import Path
from urllib.parse import parse_qs, urlparse, urlencode
from demos.legal.legal_demo.engine import Engine as LegalEngine
from demos.legal.legal_demo.drafting import OpenAIBrief
from demos.legal.legal_demo.ui import render as legal_render
from demos.logistics.selerim_demo.engine import Engine as FreightEngine
from demos.logistics.selerim_demo.ui import render as freight_render
from demos.logistics.selerim_demo.drafting import OpenAIDrafter

BASE=Path(__file__).resolve().parents[1]
COOKIE='__Host-selerim_demo'
TTL=8*3600


class Gateway:
    def __init__(self,kind,inputs,state,origin,access_key,secret,model=None,testing=False):
        if kind not in ('legal','logistics') or len(access_key)<24 or len(secret)<32:
            raise ValueError('Valid demo kind and strong authentication configuration required')
        parsed=urlparse(origin)
        if parsed.scheme!='https' and not (testing and parsed.hostname=='127.0.0.1'):
            raise ValueError('A public HTTPS origin is required')
        if parsed.path or parsed.query or parsed.fragment or parsed.username:
            raise ValueError('Origin must contain only scheme and hostname')
        self.kind,self.inputs,self.root=kind,Path(inputs).resolve(strict=True),Path(state).resolve()
        if self.root==self.inputs or self.inputs in self.root.parents:
            raise ValueError('Session storage must be separate from inputs')
        self.root.mkdir(parents=True,exist_ok=True,mode=0o700)
        self.origin,self.host,self.access,self.secret,self.model=origin,parsed.netloc,access_key,secret.encode(),model
        self.db=self.root/'gateway.sqlite'
        with sqlite3.connect(self.db) as db:
            db.executescript('CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,expires INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY,count INTEGER NOT NULL,until INTEGER NOT NULL);')

    def sign(self,value):
        return hmac.new(self.secret,value.encode(),hashlib.sha256).hexdigest()

    def session(self,env):
        cookie=SimpleCookie()
        try:
            cookie.load(env.get('HTTP_COOKIE',''))
            value=cookie[COOKIE].value
            sid,expires,signature=value.split('.')
            if not re.fullmatch('[a-f0-9]{32}',sid) or not expires.isdigit() or int(expires)<time.time():
                return None
            if not hmac.compare_digest(signature,self.sign(sid+'.'+expires)):
                return None
            with sqlite3.connect(self.db) as db:
                valid=db.execute('SELECT 1 FROM sessions WHERE id=? AND expires=?',(sid,int(expires))).fetchone()
            return sid if valid else None
        except (KeyError,ValueError):
            return None

    def login(self,key,remote):
        bucket=self.sign('rate:'+remote)
        now=int(time.time())
        with sqlite3.connect(self.db,timeout=15) as db:
            db.execute('BEGIN IMMEDIATE')
            row=db.execute('SELECT count,until FROM attempts WHERE id=?',(bucket,)).fetchone()
            count=row[0] if row and row[1]>now else 0
            if count>=5:
                return None
            db.execute('INSERT OR REPLACE INTO attempts VALUES (?,?,?)',(bucket,count+1,now+900))
            if not hmac.compare_digest(key,self.access):
                return None
            db.execute('DELETE FROM attempts WHERE id=?',(bucket,))
            sid=secrets.token_hex(16)
            expires=now+TTL
            db.execute('INSERT INTO sessions VALUES (?,?)',(sid,expires))
        value=sid+'.'+str(expires)
        return value+'.'+self.sign(value)

    @contextmanager
    def engine(self,sid):
        # flock serializes requests across Gunicorn worker processes, not just threads.
        with (self.root/(sid+'.lock')).open('a') as lock:
            fcntl.flock(lock,fcntl.LOCK_EX)
            if self.kind=='legal':
                engine=LegalEngine(self.inputs,self.root/(sid+'.sqlite'),OpenAIBrief(self.model) if self.model else None)
            else:
                engine=FreightEngine(self.inputs,self.root/(sid+'.sqlite'),OpenAIDrafter(self.model) if self.model else None)
            engine.process()
            yield engine

    def __call__(self,env,start):
        def reply(status,body,kind='text/html; charset=utf-8',extra=()):
            body=body.encode() if isinstance(body,str) else body
            headers=[('Content-Type',kind),('Content-Length',str(len(body))),('Cache-Control','no-store'),('X-Content-Type-Options','nosniff'),('Referrer-Policy','same-origin'),('Strict-Transport-Security','max-age=31536000'),('Content-Security-Policy',"default-src 'none'; style-src 'self'; script-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")]
            start(status,headers+list(extra));return [body]
        def redirect(url,cookie=None):
            extra=[('Location',url)]
            if cookie is not None:
                extra.append(('Set-Cookie',f'{COOKIE}={cookie}; Path=/; Max-Age={TTL if cookie else 0}; Secure; HttpOnly; SameSite=Strict'))
            return reply('303 See Other','',extra=extra)
        if env.get('HTTP_HOST')!=self.host:
            return reply('403 Forbidden','Invalid host')
        method,path=env.get('REQUEST_METHOD','GET'),env.get('PATH_INFO','/')
        if method not in ('GET','POST'):
            return reply('405 Method Not Allowed','Method not supported')
        values={}
        if method=='POST':
            if env.get('HTTP_ORIGIN')!=self.origin:
                return reply('403 Forbidden','Invalid origin')
            try:
                length=int(env.get('CONTENT_LENGTH','0'))
                if not 0<length<=4096:
                    return reply('413 Payload Too Large','Invalid body size')
                values=parse_qs(env['wsgi.input'].read(length).decode())
            except (ValueError,UnicodeError):
                return reply('400 Bad Request','Invalid request')
        if path=='/login' and method=='POST':
            cookie=self.login(values.get('access',[''])[0],env.get('REMOTE_ADDR','unknown'))
            return redirect('/',cookie) if cookie else reply('403 Forbidden','Access denied or temporarily rate limited. Return to the sign-in page and retry later.')
        sid=self.session(env)
        if not sid:
            if path not in ('/','/login') or method!='GET':
                return reply('401 Unauthorized','Sign in to access this concept build')
            return reply('200 OK','<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Selerim concept access</title><h1>Selerim concept studio</h1><p>Private demonstration. Fictional data only.</p><form method="post" action="/login"><label>Demo access key <input type="password" name="access" required autocomplete="current-password" maxlength="256"></label><button>Open the demo</button></form></html>')
        csrf=self.sign('csrf:'+sid)
        if method=='POST':
            if not hmac.compare_digest(values.get('token',[''])[0],csrf):
                return reply('403 Forbidden','Invalid action token')
            if path=='/logout':
                with sqlite3.connect(self.db) as db:
                    db.execute('DELETE FROM sessions WHERE id=?',(sid,))
                return redirect('/', '')
            if path!='/action':
                return reply('404 Not Found','Not found')
        assets={'/assets/inter-tight.woff2':(BASE/'logistics/selerim_demo/assets/inter-tight.woff2','font/woff2'),'/assets/instrument-serif.woff2':(BASE/'logistics/selerim_demo/assets/instrument-serif.woff2','font/woff2'),'/assets/instrument-serif-italic.woff2':(BASE/'logistics/selerim_demo/assets/instrument-serif-italic.woff2','font/woff2')}
        assets.update({'/assets/legal.css':(BASE/'legal/legal_demo/legal.css','text/css'),'/assets/workspace.css':(BASE/'logistics/selerim_demo/workspace.css','text/css'),'/assets/workspace.js':(BASE/('legal/legal_demo/reader.js' if self.kind=='legal' else 'logistics/selerim_demo/assets/workspace.js'),'text/javascript')})
        if method=='GET' and path in assets:
            file,kind=assets[path];return reply('200 OK',file.read_bytes(),kind)
        try:
            with self.engine(sid) as engine:
                params=parse_qs(env.get('QUERY_STRING',''))
                if method=='POST':
                    action=values.get('action',[''])[0]
                    if action=='process':
                        return redirect('/')
                    if self.kind=='legal':
                        matter=values.get('matter',[''])[0]
                        if action=='approve' and values.get('reviewed',[''])[0]!='yes':
                            raise ValueError('Source-review attestation required')
                        engine.act(matter,action)
                        return redirect('/?'+urlencode({'matter':matter,'view':{'return':'incomplete','finalize':'filed'}.get(action,'review')}))
                    draft=int(values.get('draft',['0'])[0]);engine.act(draft,action)
                    return redirect('/?'+urlencode({'draft':draft,'state':{'approve':'approved','send':'sent','reject':'pending'}[action]}))
                if path=='/':
                    render=legal_render if self.kind=='legal' else freight_render
                    body=render(engine,csrf,params=params)
                    logout=f'<form method="post" action="/logout"><input type="hidden" name="token" value="{csrf}"><button>End private demo session</button></form>'
                    body=body.replace('</footer>',logout+'</footer>').replace('Local session · no authentication','Authenticated demo session')
                    return reply('200 OK',body)
                if path=='/source' and self.kind=='legal':
                    doc=params.get('document',[''])[0]
                    return reply('200 OK',engine.source(params.get('matter',[''])[0],doc),'text/plain; charset=utf-8' if doc=='EMAIL' else 'application/pdf')
                if path=='/document' and self.kind=='logistics':
                    with engine.connect() as db:
                        row=db.execute('SELECT result,hash FROM documents WHERE id=?',(params.get('id',[''])[0],)).fetchone()
                        if not row: raise ValueError('Source not found')
                        payload=engine.read(json.loads(row['result'])['attachment'])
                        if hashlib.sha256(payload).hexdigest()!=row['hash']: raise ValueError('Source changed')
                        engine.event(db,'source_viewed',params['id'][0],{'actor':'authenticated-demo-session'})
                    return reply('200 OK',payload,'application/pdf')
                return reply('404 Not Found','Not found')
        except (ValueError,KeyError,OSError):
            return reply('409 Conflict','The operation could not be completed. Review the session and source configuration before retrying.')


def create_app():
    if os.environ.get('VERCEL'):
        raise RuntimeError('Persistent session storage is required; this gateway cannot use Vercel ephemeral disk')
    return Gateway(os.environ['DEMO_KIND'],os.environ['DEMO_INPUTS'],os.environ['DEMO_STATE_DIR'],os.environ['DEMO_ORIGIN'],os.environ['DEMO_ACCESS_KEY'],os.environ['DEMO_SESSION_SECRET'],os.environ.get('DEMO_LLM_MODEL'))
