"""Loopback-only approval queue. Synthetic data and local fake outbox only."""
import argparse
import json
import secrets
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse
from .engine import Engine, digest
from .drafting import OpenAIDrafter
from .ui import render


def make_server(engine, port):
    token = secrets.token_urlsafe(32)
    class Handler(BaseHTTPRequestHandler):
        def allowed_host(self):
            return self.headers.get('Host') in (f'127.0.0.1:{self.server.server_port}', f'localhost:{self.server.server_port}')

        def reply(self, status, payload, kind='text/html; charset=utf-8'):
            body = payload.encode() if isinstance(payload, str) else payload
            self.send_response(status)
            self.send_header('Content-Type', kind)
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            if not self.allowed_host():
                return self.reply(403, 'Invalid host')
            path = urlparse(self.path)
            if path.path == '/':
                return self.reply(200, render(engine, token, params=parse_qs(path.query)))
            if path.path == '/document':
                doc_id = parse_qs(path.query).get('id', [''])[0]
                with engine.lock, engine.connect() as db:
                    row = db.execute('SELECT result,hash FROM documents WHERE id=?', (doc_id,)).fetchone()
                    if not row:
                        return self.reply(404, 'Document not found')
                    try:
                        payload = engine.read(json.loads(row[0])['attachment'])
                    except (ValueError, OSError):
                        return self.reply(409, 'Source is no longer available within this job')
                    if digest(payload) != row[1]:
                        return self.reply(409, 'Source changed after ingestion; review the new version in a fresh job')
                    engine.event(db, 'source_viewed', doc_id, {'actor': 'local-demo-operator'})
                    return self.reply(200, payload, 'application/pdf')
            return self.reply(404, 'Not found')

        def do_POST(self):
            if not self.allowed_host() or self.path != '/action':
                return self.reply(403, 'Invalid request')
            origin = self.headers.get('Origin')
            if origin and origin not in (f'http://127.0.0.1:{self.server.server_port}', f'http://localhost:{self.server.server_port}'):
                return self.reply(403, 'Invalid origin')
            try:
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= 4096:
                    return self.reply(413, 'Invalid request size')
                values = parse_qs(self.rfile.read(length).decode())
                if not secrets.compare_digest(values.get('token', [''])[0], token):
                    return self.reply(403, 'Invalid action token')
                action = values.get('action', [''])[0]
                if action == 'process':
                    engine.process()
                    engine.watch_error = None
                else:
                    engine.act(int(values.get('draft', ['0'])[0]), action)
            except (ValueError, KeyError) as exc:
                return self.reply(409, render(engine, token, str(exc)))
            self.send_response(303)
            self.send_header('Location', '/?draft=' + str(int(values.get('draft', ['0'])[0] or '0')) if action != 'process' else '/')
            self.end_headers()
    return ThreadingHTTPServer(('127.0.0.1', port), Handler)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--inputs', required=True)
    p.add_argument('--state', required=True)
    p.add_argument('--port', type=int, default=8091)
    p.add_argument('--no-watch', action='store_true')
    p.add_argument('--llm-model', help='Explicit OpenAI model ID; omitted means offline templates')
    args = p.parse_args()
    engine = Engine(args.inputs, args.state, OpenAIDrafter(args.llm_model) if args.llm_model else None)
    stop = threading.Event()
    def watch():
        last_error = None
        while not stop.is_set():
            if engine.watch_error:
                stop.wait(2)
                continue
            try:
                engine.process()
                last_error = None
            except Exception as exc:
                engine.watch_error = 'Watcher paused. ' + str(exc) + '. Resolve the input/configuration issue, then click Check inbox folder to resume.'
                if str(exc) != last_error:
                    print('Watcher paused for input error:', exc, flush=True)
                    last_error = str(exc)
            stop.wait(2)
    server = make_server(engine, args.port)
    if not args.no_watch:
        threading.Thread(target=watch, daemon=True).start()
    print(f'Synthetic local demo: http://127.0.0.1:{server.server_port}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        stop.set()
        server.server_close()


if __name__ == '__main__':
    main()
