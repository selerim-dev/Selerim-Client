"""Local synthetic logistics processor. Never reads the evaluation answer key."""
import hashlib
import io
import json
import sqlite3
import threading
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from pypdf import PdfReader


def encoded(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'))


def digest(value):
    return hashlib.sha256(value).hexdigest()


class Engine:
    def __init__(self, inputs, state, drafter=None):
        self.inputs = Path(inputs).resolve(strict=True)
        self.state = Path(state).resolve()
        if self.state == self.inputs or self.inputs in self.state.parents:
            raise ValueError('State must be outside the read-only input directory')
        self.state.parent.mkdir(parents=True, exist_ok=True)
        self.lock = threading.RLock()
        self.drafter = drafter
        self.watch_error = None
        self.job = json.loads(self.read('job.json'))
        if self.job.get('synthetic') is not True:
            raise ValueError('This demo accepts synthetic jobs only')
        self.job_id = self.job['job_id']
        with self.connect() as db:
            db.executescript('''
            CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, hash TEXT NOT NULL, result TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY, shipment TEXT NOT NULL, version TEXT NOT NULL,
              body TEXT NOT NULL, recipient TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected','stale','sent')),
              UNIQUE(shipment,version));
            CREATE TABLE IF NOT EXISTS outbox (draft_id INTEGER PRIMARY KEY REFERENCES drafts(id), recipient TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, at TEXT NOT NULL, job TEXT NOT NULL, action TEXT NOT NULL,
              subject TEXT NOT NULL, detail TEXT NOT NULL, previous TEXT NOT NULL, hash TEXT NOT NULL);
            CREATE TRIGGER IF NOT EXISTS no_event_update BEFORE UPDATE ON events BEGIN SELECT RAISE(ABORT,'append-only audit'); END;
            CREATE TRIGGER IF NOT EXISTS no_event_delete BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT,'append-only audit'); END;
            ''')
            current = dict(db.execute('SELECT key,value FROM meta'))
            fingerprint = digest(self.read('records.sqlite') + self.read('job.json'))
            if current and (current.get('job') != self.job_id or current.get('fingerprint') != fingerprint):
                raise ValueError('State belongs to another job or records snapshot; create a fresh state database')
            if not current:
                db.executemany('INSERT INTO meta VALUES (?,?)', [('job', self.job_id), ('fingerprint', fingerprint)])
                self.event(db, 'job_opened', self.job_id, {'synthetic': True, 'transport': 'local-fake-outbox'})
            self.fingerprint = fingerprint

    def read(self, relative):
        path = self.inputs / relative
        resolved = path.resolve(strict=True)
        if not resolved.is_relative_to(self.inputs) or any(p.is_symlink() for p in [path, *path.parents] if p != self.inputs.parent):
            raise ValueError('Attachment outside job scope or symlinked')
        if resolved.stat().st_size > 5_000_000:
            raise ValueError('Input exceeds demo size limit')
        return resolved.read_bytes()

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.state, timeout=15)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys=ON')
        try:
            with db:
                yield db
        finally:
            db.close()

    def event(self, db, action, subject, detail):
        previous = db.execute('SELECT hash FROM events ORDER BY id DESC LIMIT 1').fetchone()
        values = [datetime.now(timezone.utc).isoformat(), self.job_id, action, str(subject), encoded(detail), previous[0] if previous else '0'*64]
        db.execute('INSERT INTO events(at,job,action,subject,detail,previous,hash) VALUES (?,?,?,?,?,?,?)', values + [digest(encoded(values).encode())])

    def process(self):
        with self.lock, self.connect() as db:
            if digest(self.read('records.sqlite') + self.read('job.json')) != self.fingerprint:
                self.event(db, 'scope_denied', self.job_id, {'reason': 'Records/config changed'})
                db.commit()
                raise ValueError('Records/config changed: start a new job')
            uri = (self.inputs / 'records.sqlite').as_uri() + '?mode=ro'
            with sqlite3.connect(uri, uri=True) as source:
                source.row_factory = sqlite3.Row
                shipments = {s['shipment_id']: dict(s) for s in source.execute('SELECT * FROM shipments WHERE job_id=?', (self.job_id,))}
            entries = json.loads(self.read('inbox.json'))
            ids = [entry['document_id'] for entry in entries]
            if len(ids) != len(set(ids)):
                raise ValueError('Duplicate inbox document IDs')
            existing = {row['id']: dict(row) for row in db.execute('SELECT * FROM documents')}
            if set(existing) - set(ids):
                raise ValueError('Inbox events are append-only; use a new job to remove input')
            hashes = {v['hash']: k for k, v in reversed(list(existing.items()))}
            for entry in entries:
                doc_id = entry['document_id']
                if entry['job_id'] != self.job_id:
                    self.event(db, 'scope_denied', doc_id, {'reason': 'Job mismatch'})
                    db.commit()
                    raise ValueError('Document belongs to another job')
                try:
                    payload = self.read(entry['attachment'])
                except (ValueError, OSError) as exc:
                    self.event(db, 'scope_denied', doc_id, {'reason': str(exc)})
                    db.commit()
                    raise ValueError('Attachment cannot be read within job scope') from exc
                checksum = digest(payload)
                if doc_id in existing:
                    if existing[doc_id]['hash'] != checksum:
                        raise ValueError('Document changed after ingestion; use a new document ID')
                    continue
                self.event(db, 'document_received', doc_id, {'sha256': checksum, 'attachment': entry['attachment']})
                fields, kind, findings, duplicate = {}, None, [], hashes.get(checksum)
                if duplicate:
                    original = json.loads(db.execute('SELECT result FROM documents WHERE id=?', (duplicate,)).fetchone()[0])
                    fields, kind = original['fields'], original['type']
                    findings = ['duplicate']
                    self.event(db, 'duplicate_detected', doc_id, {'original': duplicate})
                else:
                    try:
                        reader = PdfReader(io.BytesIO(payload), strict=True)
                        if len(reader.pages) > 10:
                            raise ValueError('Too many pages')
                        text = '\n'.join(page.extract_text() or '' for page in reader.pages)
                        lines = text.splitlines()
                        kind = next((s.strip() for s in lines if s.strip() in ('BOL', 'POD')), None)
                        if not kind:
                            raise ValueError('No supported document type')
                        for line in lines:
                            if ': ' in line:
                                key, value = line.split(': ', 1)
                                if key in {'shipment_id', 'carrier', 'pieces', 'weight_lb', 'received_by'}:
                                    if key in fields:
                                        raise ValueError('Ambiguous repeated field')
                                    fields[key] = int(value) if key in {'pieces', 'weight_lb'} else value.strip()
                        self.event(db, 'document_parsed', doc_id, {'type': kind, 'fields': fields, 'parser': 'deterministic-text-pdf'})
                    except Exception:
                        kind, fields, findings = None, {}, ['unreadable']
                        self.event(db, 'parse_failed', doc_id, {'route': 'human_review', 'ocr': 'not-enabled'})
                match = fields.get('shipment_id') if fields.get('shipment_id') in shipments else None
                if kind and not duplicate:
                    findings.extend('missing_field:' + key for key in self.job['required_fields'][kind] if fields.get(key) in (None, ''))
                    if not match:
                        findings.append('unmatched')
                    else:
                        findings.extend('mismatch:' + key for key in ('carrier', 'pieces', 'weight_lb')
                                        if key in fields and fields[key] != shipments[match][key])
                self.event(db, 'document_matched' if match else 'document_routed_to_review', doc_id, {'shipment_id': match})
                if findings:
                    self.event(db, 'document_flagged', doc_id, {'findings': findings})
                result = {'document_id': doc_id, 'type': kind, 'shipment_id': match, 'findings': findings,
                          'fields': fields, 'duplicate_of': duplicate, 'attachment': entry['attachment']}
                db.execute('INSERT INTO documents VALUES (?,?,?)', (doc_id, checksum, encoded(result)))
                hashes.setdefault(checksum, doc_id)
            documents = [json.loads(row[0]) for row in db.execute('SELECT result FROM documents ORDER BY id')]
            present = {(d['shipment_id'], d['type']) for d in documents if d['shipment_id'] and not d['duplicate_of']}
            gaps = [{'shipment_id': s, 'document_type': kind} for s in sorted(shipments) for kind in self.job['required_documents'] if (s, kind) not in present]
            new_gaps = encoded(gaps)
            old = db.execute("SELECT value FROM meta WHERE key='gaps'").fetchone()
            if not old or old[0] != new_gaps:
                self.event(db, 'completeness_checked', self.job_id, {'missing_documents': gaps, 'as_of': self.job['as_of']})
                db.execute("INSERT OR REPLACE INTO meta VALUES ('gaps',?)", (new_gaps,))
            for shipment, record in shipments.items():
                issues = sorted([f"Missing {g['document_type']}" for g in gaps if g['shipment_id'] == shipment] +
                                [f"{d['document_id']}: {finding}" for d in documents if d['shipment_id'] == shipment
                                 for finding in d['findings'] if finding != 'duplicate'])
                version = digest(encoded(issues).encode()) if issues else None
                stale = db.execute("SELECT id FROM drafts WHERE shipment=? AND status IN ('pending','approved') AND version != ?", (shipment, version or '')).fetchall()
                for row in stale:
                    db.execute("UPDATE drafts SET status='stale' WHERE id=?", (row[0],))
                    self.event(db, 'draft_invalidated', row[0], {'reason': 'Document evidence changed; fresh review required'})
                if not issues or db.execute('SELECT id FROM drafts WHERE shipment=? AND version=?', (shipment, version)).fetchone():
                    continue
                body = f"SYNTHETIC DEMO — follow-up for {shipment}\n\nPlease review these document gaps:\n" + '\n'.join('- ' + issue for issue in issues) + '\n\nPlease provide corrected or missing documents. Thank you.'
                drafting = {'provider': 'template'}
                if self.drafter:
                    self.event(db, 'llm_draft_requested', shipment, {'synthetic': True, 'fields': ['shipment_id', 'issues']})
                    try:
                        body, drafting = self.drafter(shipment, issues)
                    except ValueError:
                        self.event(db, 'llm_draft_failed', shipment, {'fallback': 'none', 'approval': 'not-created'})
                        db.commit()
                        raise
                row = db.execute("INSERT INTO drafts(shipment,version,body,recipient,status) VALUES (?,?,?,?,'pending')", (shipment, version, body, record['contact_email']))
                self.event(db, 'draft_queued', row.lastrowid, {'shipment_id': shipment, 'version': version, 'drafting': drafting, 'issues': issues})
            return {'documents': documents, 'missing_documents': gaps}

    def act(self, draft_id, action):
        if action not in ('approve', 'reject', 'send'):
            raise ValueError('Unknown action')
        with self.lock:
            self.process()  # invalidate stale approvals before any mutation
            with self.connect() as db:
                db.execute('BEGIN IMMEDIATE')
                draft = db.execute('SELECT * FROM drafts WHERE id=?', (draft_id,)).fetchone()
                if not draft:
                    self.event(db, 'action_denied', draft_id, {'action': action, 'reason': 'Unknown draft'})
                    db.commit()
                    raise ValueError('Unknown draft')
                if action == 'send' and draft['status'] == 'sent':
                    self.event(db, 'send_replay_ignored', draft_id, {})
                    return
                needed = 'approved' if action == 'send' else 'pending'
                if draft['status'] != needed:
                    self.event(db, 'action_denied', draft_id, {'action': action, 'status': draft['status']})
                    db.commit()
                    raise ValueError(f'{action} requires a {needed} draft')
                if action == 'send':
                    if not draft['recipient'].endswith('@example.invalid'):
                        self.event(db, 'action_denied', draft_id, {'reason': 'Non-synthetic recipient'})
                        db.commit()
                        raise ValueError('Only synthetic recipients permitted')
                    db.execute('INSERT INTO outbox VALUES (?,?,?,?)', (draft_id, draft['recipient'], draft['body'], datetime.now(timezone.utc).isoformat()))
                status = {'approve': 'approved', 'reject': 'rejected', 'send': 'sent'}[action]
                db.execute('UPDATE drafts SET status=? WHERE id=?', (status, draft_id))
                self.event(db, 'fake_outbox_written' if action == 'send' else 'human_' + status, draft_id,
                           {'actor': 'local-demo-operator', 'version': draft['version'], 'external_delivery': False})

    def snapshot(self):
        with self.lock, self.connect() as db:
            return {key: [dict(row) for row in db.execute('SELECT * FROM ' + key + ' ORDER BY id' if key != 'outbox' else 'SELECT * FROM outbox ORDER BY draft_id')]
                    for key in ('documents', 'drafts', 'events', 'outbox')}

    def verify_log(self):
        previous = '0' * 64
        for event in self.snapshot()['events']:
            values = [event[k] for k in ('at', 'job', 'action', 'subject', 'detail', 'previous')]
            if event['previous'] != previous or digest(encoded(values).encode()) != event['hash']:
                return False
            previous = event['hash']
        return True
