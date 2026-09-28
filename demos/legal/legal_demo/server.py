"""Loopback-only fictional legal intake demo. No authentication or production hosting."""
import argparse
import secrets
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse
from .engine import Engine
from .ui import render

BASE=Path(__file__).parent
SHARED=BASE.parents[1] / 'logistics/selerim_demo/assets'


def make_server(engine, port=8092):
    token=secrets.token_urlsafe(32)
    class Handler(BaseHTTPRequestHandler):
        def allowed_host(self):
            return self.headers.get('Host') in (f'127.0.0.1:{self.server.server_port}',f'localhost:{self.server.server_port}')

        def reply(self,status,payload,kind='text/html; charset=utf-8'):
            body=payload.encode() if isinstance(payload,str) else payload
            self.send_response(status)
            for key,value in [('Content-Type',kind),('Content-Length',str(len(body))),('Cache-Control','no-store'),
                 ('X-Content-Type-Options','nosniff'),('Referrer-Policy','same-origin'),
                 ('Content-Security-Policy',"default-src 'none'; style-src 'self'; script-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")]:
                self.send_header(key,value)
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if not self.allowed_host():
                return self.reply(403,'Invalid host')
            url=urlparse(self.path)
            params=parse_qs(url.query)
            assets={'/assets/legal.css':(BASE/'legal.css','text/css; charset=utf-8'),
                    '/assets/workspace.js':(BASE/'reader.js','text/javascript; charset=utf-8'),
                    **{'/assets/'+name:(SHARED/name,'font/woff2') for name in ('inter-tight.woff2','instrument-serif.woff2','instrument-serif-italic.woff2')}}
            if url.path in assets:
                path,kind=assets[url.path]
                return self.reply(200,path.read_bytes(),kind)
            if url.path=='/':
                return self.reply(200,render(engine,token,params))
            if url.path=='/source':
                matter=params.get('matter',[''])[0]
                document=params.get('document',[''])[0]
                try:
                    payload=engine.source(matter,document)
                except (ValueError,OSError):
                    return self.reply(404,'Source not available in this matter or has changed')
                return self.reply(200,payload,'text/plain; charset=utf-8' if document=='EMAIL' else 'application/pdf')
            return self.reply(404,'Not found')

        def do_POST(self):
            if not self.allowed_host() or self.path!='/action':
                return self.reply(403,'Invalid request')
            origin=self.headers.get('Origin')
            if origin and origin not in (f'http://127.0.0.1:{self.server.server_port}',f'http://localhost:{self.server.server_port}'):
                return self.reply(403,'Invalid origin')
            try:
                length=int(self.headers.get('Content-Length','0'))
                if not 0 < length <=4096:
                    return self.reply(413,'Invalid request size')
                values=parse_qs(self.rfile.read(length).decode())
                if not secrets.compare_digest(values.get('token',[''])[0],token):
                    return self.reply(403,'Invalid action token')
                action=values.get('action',[''])[0]
                matter=values.get('matter',[''])[0]
                if action=='process':
                    engine.process()
                else:
                    if action=='approve' and values.get('reviewed',[''])[0]!='yes':
                        raise ValueError('Confirm you reviewed the source documents and summary')
                    engine.act(matter,action)
            except (ValueError,KeyError,OSError) as exc:
                return self.reply(409,render(engine,token,error=str(exc)))
            view={'finalize':'filed','return':'incomplete'}.get(action,'review')
            notice={'approve':'approved','finalize':'finalized','return':'returned','process':'processed'}[action]
            self.send_response(303)
            self.send_header('Location','/?'+urlencode({'view':view,'matter':matter,'notice':notice}))
            self.end_headers()
    return ThreadingHTTPServer(('127.0.0.1',port),Handler)


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inputs',required=True)
    parser.add_argument('--state',required=True)
    parser.add_argument('--port',type=int,default=8092)
    args=parser.parse_args()
    engine=Engine(args.inputs,args.state)
    engine.process()
    server=make_server(engine,args.port)
    print(f'Fictional legal intake: http://127.0.0.1:{server.server_port}',flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
