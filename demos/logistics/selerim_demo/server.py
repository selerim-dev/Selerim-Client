"""Loopback-only approval queue. Synthetic data and local fake outbox only."""
import argparse
import html
import json
import secrets
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse
from .engine import Engine, digest
from .drafting import OpenAIDrafter


def esc(value):
    return html.escape(str(value), quote=True)


STYLE = '''*{box-sizing:border-box}body{margin:0;background:#f2f0fb;color:#19182d;font:16px system-ui,sans-serif;line-height:1.6}header{padding:24px 5%;background:#19182d;color:white}header p{color:#cbc6e5}main{max-width:1200px;margin:auto;padding:30px 24px}h1{font-size:36px;letter-spacing:-1.5px;margin:0}h2{font-size:26px}nav{display:flex;gap:24px;flex-wrap:wrap}a{color:#5141aa}header a{color:#d7d1ff}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:24px 0}.stat,article{background:white;border:1px solid #d8d3e9;border-radius:16px;padding:24px}.stat strong{font-size:32px;display:block}article{margin:16px 0}article:target{outline:3px solid #6553af}.badge{display:inline-block;background:#ece8fa;border-radius:8px;padding:4px 10px;font-size:13px;font-weight:650}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.7 ui-monospace,monospace}button{padding:12px 18px;border:0;border-radius:8px;background:#352765;color:white;cursor:pointer;font:inherit}button.secondary{background:#ebe7f5;color:#31265a}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #795bc7;outline-offset:3px}form{display:inline-block;margin:5px}summary{cursor:pointer;padding:8px 0;font-weight:650}.notice{border-left:4px solid #7764b3;padding:12px 20px;background:#e7e2f5}.table{overflow:auto}table{border-collapse:collapse;width:100%;font-size:13px}td,th{text-align:left;padding:12px;border-bottom:1px solid #ddd6ee;vertical-align:top}td:last-child{min-width:260px;overflow-wrap:anywhere}small{color:#565169}.empty{padding:30px;background:white;border-radius:12px}@media(max-width:650px){.stats{grid-template-columns:repeat(2,1fr)}h1{font-size:29px}main{padding:20px 14px}article{padding:18px}}'''


def render(engine, token, error=''):
    error = error or engine.watch_error or ''
    data = engine.snapshot()
    docs = [json.loads(d['result']) for d in data['documents']]
    active = [d for d in data['drafts'] if d['status'] in ('pending', 'approved')]
    def form(action, label, draft_id=''):
        return f'<form method="post" action="/action"><input type="hidden" name="token" value="{token}"><input type="hidden" name="action" value="{action}"><input type="hidden" name="draft" value="{draft_id}"><button>{label}</button></form>'
    queue = ''
    for d in active:
        buttons = (form('approve', 'Approve draft', d['id']) + form('reject', 'Reject draft', d['id'])) if d['status'] == 'pending' else form('send', 'Send to local fake outbox', d['id'])
        sources = ' · '.join(f'<a href="/document?id={esc(doc["document_id"])}">{esc(doc["document_id"])}</a>' for doc in docs if doc['shipment_id'] == d['shipment'])
        queue += f'<article id="draft-{d["id"]}"><span class="badge">{esc(d["status"])}</span><h3>{esc(d["shipment"])}</h3><p>To: {esc(d["recipient"])}</p><pre>{esc(d["body"])}</pre><p>Source PDFs: {sources or "None received"}</p>{buttons}</article>'
    documents = ''.join(f'<tr><td><a href="/document?id={esc(d["document_id"])}">{esc(d["document_id"])}</a></td><td>{esc(d["type"] or "Unreadable")}</td><td>{esc(d["shipment_id"] or "Human review required")}</td><td>{esc(", ".join(d["findings"]) or "Clean match")}</td></tr>' for d in docs)
    events = ''.join(f'<tr><td>{e["id"]}</td><td>{esc(e["at"])}</td><td>{esc(e["action"])}</td><td>{esc(e["subject"])}</td><td>{esc(e["detail"])}</td></tr>' for e in reversed(data['events']))
    outbox = ''.join(f'<article><h3>Draft {o["draft_id"]} · simulated send</h3><p>{esc(o["recipient"])}</p><pre>{esc(o["body"])}</pre></article>' for o in data['outbox'])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Shipment document agent · Selerim concept</title><style>{STYLE}</style></head><body><header><a href="#main">Skip to content</a><p>SELERIM / CONCEPT BUILD / FICTIONAL DATA ONLY</p><h1>Shipment document agent</h1><p>Documents in. Gaps surfaced. You decide what goes out.</p><nav aria-label="Demo sections"><a href="#queue">Approval queue</a><a href="#documents">Documents</a><a href="#outbox">Fake outbox</a><a href="#audit">Activity log</a></nav></header><main id="main"><p class="notice">Local concept demo. Read-only job folder. Deterministic parsing. Drafting: {'OpenAI (human review required)' if engine.drafter else 'offline templates (no LLM active)'}. OCR is not enabled. No external email is sent. This is not client work.</p>{f'<p role="alert">{esc(error)}</p>' if error else ''}<div class="stats"><div class="stat"><strong>{len(docs)}</strong>Documents processed</div><div class="stat"><strong>{sum(bool(d['findings']) for d in docs)}</strong>Flagged documents</div><div class="stat"><strong>{len(active)}</strong>Drafts to review</div><div class="stat"><strong>{len(data['outbox'])}</strong>Simulated sends</div></div>{form('process','Check inbox folder')} <a href="/">Refresh results</a><p><small>Job: {esc(engine.job_id)} · watcher checks every 2 seconds · refresh to see new arrivals</small></p><section id="queue"><h2>Human approval queue</h2><p>Review the source documents and exact message. Approval and sending are separate actions. Changed evidence invalidates a pending approval.</p>{queue or '<p class="empty">No pending drafts. Check the inbox to begin.</p>'}</section><section id="documents"><h2>Document review</h2><p>Unknown references, missing IDs and unreadable PDFs remain here for human investigation.</p><div class="table"><table><thead><tr><th>Document</th><th>Type</th><th>Shipment</th><th>Finding</th></tr></thead><tbody>{documents}</tbody></table></div></section><section id="outbox"><h2>Local fake outbox</h2><p>These are local database records. They are never delivered to an email provider.</p>{outbox or '<p class="empty">Empty. No approved messages have been sent.</p>'}</section><section id="audit"><h2>Activity log</h2><p>Hash chain: {'valid' if engine.verify_log() else 'INVALID'} · {len(data['events'])} events. Append-only database rules; not an independently secured audit service.</p><details><summary>Show complete activity log</summary><div class="table"><table><thead><tr><th>Event</th><th>Time (UTC)</th><th>Action</th><th>Subject</th><th>Details</th></tr></thead><tbody>{events}</tbody></table></div></details></section></main></body></html>'''


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
                return self.reply(200, render(engine, token))
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
            self.send_header('Location', '/')
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
