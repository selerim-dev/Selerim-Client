"""Matter-scoped extraction with source-linked factual summaries and review gates.

No network, no legal reasoning, no evaluation-label access. Source files remain
in the read-only inputs. SQLite retains only allowed fields, citations, hashes,
review decisions and audit metadata; it does not duplicate PDF/email bodies.
"""
import hashlib
import io
import json
import re
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


FIELDS = {
    'intake_form': ('matter_id', 'company', 'contact_name', 'contact_email', 'request', 'requested_by', 'counterparty'),
    'engagement_letter': ('matter_id', 'company', 'scope', 'signed'),
}
TITLES = {'INTAKE FORM': 'intake_form', 'CLIENT INTAKE QUESTIONNAIRE': 'intake_form',
          'ENGAGEMENT LETTER': 'engagement_letter', 'ENGAGEMENT AGREEMENT': 'engagement_letter'}


def extract(payload, doc_id, matter):
    result = {'id': doc_id, 'type': 'unsupported', 'fields': {}, 'citations': {}, 'issues': []}
    try:
        pdf = PdfReader(io.BytesIO(payload), strict=True)
        if not 0 < len(pdf.pages) <= 10:
            raise ValueError('Unsupported page count')
        pages = [(i+1, (page.extract_text() or '').splitlines()) for i,page in enumerate(pdf.pages)]
        kinds = {TITLES[line.strip()] for _,lines in pages for line in lines if line.strip() in TITLES}
        if len(kinds) != 1:
            raise ValueError('Unsupported or ambiguous classification')
        result['type'] = kinds.pop()
        for page, lines in pages:
            for number, line in enumerate(lines, 1):
                if ':' not in line:
                    continue
                key,value = line.split(':', 1)
                key, value = key.strip(), value.strip()
                if key not in FIELDS[result['type']] or not value:
                    continue
                if key in result['fields']:
                    raise ValueError('Repeated field is ambiguous')
                result['fields'][key] = value
                result['citations'][key] = {'document': doc_id, 'page': page, 'line': number, 'quote': line}
        if result['fields'].get('matter_id') != matter:
            # Do not retain or summarize a different matter's extracted information.
            result['fields'], result['citations'] = {}, {}
            result['issues'] = ['scope_mismatch:' + doc_id]
    except Exception:
        result.update(type='unsupported', fields={}, citations={}, issues=['unsupported:' + doc_id])
    return result


def analyze(matter, documents):
    issues = [issue for doc in documents for issue in doc['issues']]
    by_kind = {}
    for kind, required in FIELDS.items():
        matches = [d for d in documents if d['type']==kind and not d['issues']]
        if not matches:
            issues.append('missing_document:' + kind)
            continue
        if len(matches) != 1:
            issues.append('ambiguous_document:' + kind)
            continue
        doc = by_kind[kind] = matches[0]
        issues.extend('missing_field:' + kind + '.' + key for key in required if key not in doc['fields'])
    form, letter = by_kind.get('intake_form'), by_kind.get('engagement_letter')
    if letter and letter['fields'].get('signed') != 'yes':
        issues.append('unsigned:engagement_letter')
    if form and letter and form['fields'].get('company') != letter['fields'].get('company'):
        issues.append('conflict:company')
    summary = []
    # Factual, extractive sentences only; each sentence has a verifiable source.
    specs = [('intake_form','company','The intake identifies the organization as {}.'),
             ('intake_form','contact_name','The named intake contact is {}.'),
             ('intake_form','request','The stated request is: {}.'),
             ('intake_form','counterparty','The named counterparty is {}.'),
             ('intake_form','requested_by','The requested review date is {}.'),
             ('engagement_letter','scope','The engagement letter states the scope as: {}.')]
    for kind,key,template in specs:
        doc = by_kind.get(kind)
        if doc and key in doc['fields']:
            summary.append({'text': template.format(doc['fields'][key]), 'source': doc['citations'][key]})
    return {'matter_id': matter, 'company': form['fields'].get('company', matter) if form else matter,
            'documents': documents, 'issues': sorted(set(issues)), 'summary': summary,
            'route': 'incomplete' if issues else 'attorney_review'}


class Engine:
    def __init__(self, inputs, state, brief_writer=None):
        self.inputs = Path(inputs).resolve(strict=True)
        self.state = Path(state).resolve()
        if self.state == self.inputs or self.inputs in self.state.parents:
            raise ValueError('State must be outside read-only inputs')
        self.state.parent.mkdir(parents=True, exist_ok=True)
        self.lock = threading.RLock()
        self.brief_writer = brief_writer
        self.job = json.loads(self.read('job.json'))
        if self.job.get('synthetic') is not True:
            raise ValueError('Fictional inputs required')
        self.job_id = self.job['job_id']
        self.fingerprint = digest(self.read('job.json'))
        with self.connect() as db:
            db.executescript('''
            CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY,value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS matters (id TEXT PRIMARY KEY, version TEXT NOT NULL,
              result TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','approved','finalized','returned')));
            CREATE TABLE IF NOT EXISTS sources (matter TEXT NOT NULL REFERENCES matters(id),
              id TEXT NOT NULL,path TEXT NOT NULL,hash TEXT NOT NULL, PRIMARY KEY(matter,id));
            CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY,at TEXT NOT NULL,job TEXT NOT NULL,
              action TEXT NOT NULL,subject TEXT NOT NULL,detail TEXT NOT NULL,previous TEXT NOT NULL,hash TEXT NOT NULL);
            CREATE TRIGGER IF NOT EXISTS no_event_update BEFORE UPDATE ON events BEGIN SELECT RAISE(ABORT,'append-only audit'); END;
            CREATE TRIGGER IF NOT EXISTS no_event_delete BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT,'append-only audit'); END;
            ''')
            current = dict(db.execute('SELECT key,value FROM meta'))
            writer_mode = getattr(brief_writer,'model','deterministic') if brief_writer else 'deterministic'
            if current and current.get('writer','deterministic') != writer_mode:
                raise ValueError('Summary mode changed; use a fresh state database')
            if current and (current.get('job') != self.job_id or current.get('fingerprint') != self.fingerprint):
                raise ValueError('State belongs to another job; use a fresh state database')
            if not current:
                db.executemany('INSERT INTO meta VALUES (?,?)', [('job',self.job_id),('fingerprint',self.fingerprint),('writer',writer_mode)])
                self.event(db,'job_opened',self.job_id,{'synthetic':True,'mode':'deterministic-extraction'})

    def read(self, relative, matter=None):
        if not isinstance(relative, str) or Path(relative).is_absolute() or '..' in Path(relative).parts:
            raise ValueError('Source outside scope')
        target = self.inputs / relative
        resolved = target.resolve(strict=True)
        root = self.inputs / 'matters' / matter if matter else self.inputs
        if not resolved.is_relative_to(root) or any(p.is_symlink() for p in (target,*target.parents) if p != self.inputs.parent):
            raise ValueError('Source outside matter scope or symlinked')
        if resolved.stat().st_size > 5_000_000:
            raise ValueError('Source exceeds size limit')
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

    def event(self, db, action, matter, details):
        previous = db.execute('SELECT hash FROM events ORDER BY id DESC LIMIT 1').fetchone()
        values = [datetime.now(timezone.utc).isoformat(),self.job_id,action,matter,encoded(details),previous[0] if previous else '0'*64]
        db.execute('INSERT INTO events(at,job,action,subject,detail,previous,hash) VALUES (?,?,?,?,?,?,?)',values+[digest(encoded(values).encode())])

    def process(self):
        with self.lock, self.connect() as db:
            if digest(self.read('job.json')) != self.fingerprint:
                raise ValueError('Job configuration changed; use a fresh job')
            entries = json.loads(self.read('inbox.json'))
            ids = [m['matter_id'] for m in entries]
            if len(ids) != len(set(ids)) or any(not re.fullmatch(r'SYN-MAT-\d{3}',m) for m in ids):
                raise ValueError('Invalid or duplicate matter IDs')
            stored = {r['id']:r['version'] for r in db.execute('SELECT id,version FROM matters')}
            if set(stored)-set(ids):
                raise ValueError('Inbox is append-only; source removal requires a fresh job')
            # Validate every source before committing any new material or authorizing a decision.
            batches = []
            for entry in entries:
                matter = entry['matter_id']
                documents = entry['documents']
                doc_ids = [d['id'] for d in documents]
                if len(doc_ids)!=len(set(doc_ids)) or any(not re.fullmatch(r'[A-Z][A-Z0-9_-]{0,30}',d) or d=='EMAIL' for d in doc_ids):
                    raise ValueError('Invalid or duplicate document IDs')
                files = [('EMAIL',entry['email'])] + [(d['id'],d['path']) for d in documents]
                payloads = [(doc,path,self.read(path,matter)) for doc,path in files]
                version = digest(encoded({'entry':entry,'hashes':[digest(p) for _,_,p in payloads]}).encode())
                if matter in stored and stored[matter] != version:
                    self.event(db,'changed_source_blocked',matter,{'requires':'fresh-job-and-review'})
                    db.commit()
                    raise ValueError('Source changed after review preparation; use a fresh state database')
                if matter not in stored:
                    batches.append((matter,version,payloads))
            for matter,version,payloads in batches:
                docs = [extract(payload,doc,matter) for doc,_,payload in payloads if doc!='EMAIL']
                result = analyze(matter,docs)
                if self.brief_writer:
                    result['summary'] = self.brief_writer(matter,result['summary'])
                    result['summary_mode'] = 'ai-prioritized verified extracts'
                else:
                    result['summary_mode'] = 'deterministic extracts'
                db.execute("INSERT INTO matters VALUES (?,?,?,'pending')",(matter,version,encoded(result)))
                for doc,path,payload in payloads:
                    db.execute('INSERT INTO sources VALUES (?,?,?,?)',(matter,doc,path,digest(payload)))
                    self.event(db,'source_received',matter,{'document':doc,'sha256':digest(payload)})
                self.event(db,'intake_prepared',matter,{'route':result['route'],'issues':result['issues'],
                      'sentences':len(result['summary']),'source_linked':True,'no_legal_advice':True})
        return self.snapshot()

    def source(self, matter, document):
        with self.lock, self.connect() as db:
            row = db.execute('SELECT path,hash FROM sources WHERE matter=? AND id=?',(matter,document)).fetchone()
            if not row:
                raise ValueError('Source not found in this matter')
            result = json.loads(db.execute('SELECT result FROM matters WHERE id=?',(matter,)).fetchone()[0])
            document_result = next((d for d in result['documents'] if d['id']==document), None)
            if document_result and any(issue.startswith('scope_mismatch:') for issue in document_result['issues']):
                self.event(db,'source_scope_denied',matter,{'document':document})
                db.commit()
                raise ValueError('Document references a different matter; source access blocked')
            payload = self.read(row['path'],matter)
            if digest(payload)!=row['hash']:
                raise ValueError('Source changed; review is blocked')
            self.event(db,'source_viewed',matter,{'document':document})
            return payload

    def act(self, matter, action):
        if action not in ('approve','finalize','return'):
            raise ValueError('Unknown action')
        with self.lock:
            self.process()
            with self.connect() as db:
                db.execute('BEGIN IMMEDIATE')
                row = db.execute('SELECT * FROM matters WHERE id=?',(matter,)).fetchone()
                if not row:
                    raise ValueError('Unknown matter')
                result = json.loads(row['result'])
                if action=='finalize' and row['status']=='finalized':
                    return  # Idempotent, never creates another record.
                needed = 'approved' if action=='finalize' else 'pending'
                if row['status']!=needed or (action in ('approve','finalize') and result['issues']):
                    self.event(db,'decision_blocked',matter,{'action':action,'status':row['status'],'incomplete':bool(result['issues'])})
                    db.commit()
                    raise ValueError('Complete evidence and the required human review state are necessary')
                status = {'approve':'approved','finalize':'finalized','return':'returned'}[action]
                db.execute('UPDATE matters SET status=? WHERE id=?',(status,matter))
                self.event(db,'human_'+status,matter,{'actor':'local-demo-reviewer','version':row['version'],
                      'external_delivery':False,'client_acceptance':False})

    def snapshot(self):
        with self.lock, self.connect() as db:
            return [dict(json.loads(r['result']),status=r['status'],version=r['version']) for r in db.execute('SELECT * FROM matters ORDER BY id')]

    def events(self, matter=None):
        with self.lock, self.connect() as db:
            return [dict(r) for r in db.execute('SELECT * FROM events WHERE subject=? ORDER BY id DESC',(matter,))] if matter else [dict(r) for r in db.execute('SELECT * FROM events ORDER BY id DESC')]

    def verify_log(self):
        previous = '0'*64
        for row in reversed(self.events()):
            values = [row[k] for k in ('at','job','action','subject','detail','previous')]
            if row['previous']!=previous or digest(encoded(values).encode())!=row['hash']:
                return False
            previous=row['hash']
        return True
