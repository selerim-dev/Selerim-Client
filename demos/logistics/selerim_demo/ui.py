"""Server-rendered document operations workspace; no client-side state authority."""
import html
import json
import sqlite3
from urllib.parse import urlencode
from pathlib import Path


def e(value):
    return html.escape(str(value), quote=True)


def render(engine, token, error='', params=None):
    params = params or {}
    tab = params.get('view', ['review'])[0]
    if tab not in ('review', 'documents', 'outbox', 'audit'):
        tab = 'review'
    query = params.get('q', [''])[0][:100]
    data = engine.snapshot()
    docs = [json.loads(d['result']) for d in data['documents']]
    pending = [d for d in data['drafts'] if d['status'] in ('pending', 'approved')]
    candidates = [d for d in data['drafts'] if d['status'] not in ('rejected', 'stale')]
    candidates.sort(key=lambda d: (d['status'] == 'sent', d['id']))
    candidates = [d for d in candidates if query.lower() in (d['shipment'] + d['body']).lower()]
    selected = next((d for d in candidates if str(d['id']) == params.get('draft', [''])[0]), candidates[0] if candidates else None)
    def url(**values):
        return '/?' + urlencode(values)
    def action(action_name, label, draft='', secondary=False):
        return f'<form method="post" action="/action"><input type="hidden" name="token" value="{e(token)}"><input type="hidden" name="action" value="{action_name}"><input type="hidden" name="draft" value="{draft}"><button class="button {"secondary" if secondary else ""}">{label}</button></form>'
    def badge(status):
        return f'<span class="status {e(status)}">{e({"pending":"Needs approval","approved":"Approved","sent":"Sent to demo outbox"}.get(status,status))}</span>'
    nav = ''.join(f'<a class="navitem {"current" if key == tab else ""}" href="{url(view=key)}" {"aria-current=page" if key == tab else ""}><span class="navicon" aria-hidden="true">{icon}</span>{name}<span class="navcount">{count}</span></a>' for key, name, icon, count in [('review','Review queue','◫',len(pending)),('documents','Documents','▤',len(docs)),('outbox','Demo outbox','↗',len(data['outbox'])),('audit','Activity log','≋',len(data['events']))])
    finding_labels = {'mismatch:pieces':'Piece count does not match', 'mismatch:carrier':'Carrier does not match', 'mismatch:weight_lb':'Weight does not match', 'missing_field:received_by':'Delivery recipient missing', 'missing_field:carrier':'Carrier missing', 'missing_field:shipment_id':'Shipment reference missing', 'unmatched':'No matching shipment', 'duplicate':'Duplicate document', 'unreadable':'Document cannot be read'}
    if tab == 'review':
        rows = ''
        for d in candidates:
            related = [doc for doc in docs if doc['shipment_id'] == d['shipment']]
            findings = [f for doc in related for f in doc['findings'] if f != 'duplicate']
            label = finding_labels.get(findings[0], findings[0]) if findings else ('Document follow-up' if related else 'BOL + POD missing')
            rows += f'<a class="queue-row {"selected" if selected and selected["id"] == d["id"] else ""}" href="{e(url(view="review", draft=d["id"], q=query))}" {"aria-current=true" if selected and selected["id"] == d["id"] else ""}><span class="row-top"><strong>{e(d["shipment"].replace("SYN-", ""))}</strong><span class="row-dot {e(d["status"])}" aria-label="{e(d["status"])}"></span></span><span>{e(label)}</span><small>{len(related)} source documents <span aria-hidden="true">↗</span></small></a>'
        queue = f'<section class="queue"><div class="panel-title"><h2>Shipment queue</h2><span>{len(candidates):02d}</span></div><form class="search" method="get"><input type="hidden" name="view" value="review"><label class="sr-only" for="search">Search shipment or finding</label><input id="search" name="q" placeholder="Find a shipment or finding…" value="{e(query)}"><button aria-label="Search">⌕</button></form><div class="queue-scroll">{rows or "<p class=empty>No matching shipments.</p>"}</div></section>'
        if selected:
            d = selected
            with sqlite3.connect((engine.inputs / 'records.sqlite').as_uri() + '?mode=ro', uri=True) as records:
                records.row_factory = sqlite3.Row
                record = records.execute('SELECT * FROM shipments WHERE shipment_id=? AND job_id=?', (d['shipment'], engine.job_id)).fetchone()
                expected = dict(record) if record else {}
            related = [doc for doc in docs if doc['shipment_id'] == d['shipment']]
            source = next((doc for doc in related if doc['document_id'] == params.get('doc', [''])[0]), next((doc for doc in related if doc['findings']), related[0] if related else None))
            tabs = ''.join(f'<a class="doc-tab {"active" if source and source["document_id"] == doc["document_id"] else ""}" href="{e(url(view="review",draft=d["id"],doc=doc["document_id"],q=query))}">{e(doc["type"] or "PDF")} <small>{e(doc["document_id"])}</small></a>' for doc in related)
            if source:
                fields = ''.join(f'<div class="paper-field {"flag" if "mismatch:"+key in source["findings"] else ""}"><dt>{e(key.replace("_"," "))}</dt><dd>{e(value)}</dd></div>' for key,value in source['fields'].items())
                flags = ''.join(f'<p class="finding"><span aria-hidden="true">!</span>{e(finding_labels.get(f,f))}</p>' for f in source['findings'])
                comparisons = ''.join(f'<div class="comparison"><span>SHIPMENT RECORD · {e(key.replace("_", " ").upper())}</span><strong>{e(expected.get(key, "Unavailable"))}</strong></div>' for key in source['fields'] if 'mismatch:' + key in source['findings'])
                flags += comparisons
                paper = f'<div class="doc-toolbar"><span>EXTRACTED DOCUMENT VIEW</span><a href="/document?id={e(source["document_id"])}" target="_blank" rel="noopener">Original PDF ↗</a></div><div class="paper"><div class="paper-top"><span>SELERIM<br><small>SYNTHETIC FREIGHT</small></span><span class="paper-symbol" aria-hidden="true">▥</span></div><p class="paper-kicker">{e(source["document_id"])} / FICTIONAL DOCUMENT</p><h3>{"Bill of lading" if source["type"] == "BOL" else "Proof of delivery"}</h3><dl>{fields}</dl><div class="paper-foot">Text extracted from source PDF<br>Fictional data · not a shipping instrument</div></div><div class="findings">{flags or "<p class=clean>✓ No discrepancies detected in this document</p>"}</div>'
            else:
                paper = '<div class="missing-doc"><span aria-hidden="true">▤</span><h3>The paperwork hasn’t arrived.</h3><p>No BOL or POD is linked to this shipment. A follow-up is ready for your review.</p><div class="missing-slot">01 <strong>Bill of lading</strong><span>Missing</span></div><div class="missing-slot">02 <strong>Proof of delivery</strong><span>Missing</span></div></div>'
            buttons = action('approve','Approve this draft <span aria-hidden="true">↗</span>',d['id']) + action('reject','Reject draft',d['id'],True) if d['status']=='pending' else (action('send','Send to demo outbox ↗',d['id']) if d['status']=='approved' else '<p class="sent-note">✓ Recorded in the local demo outbox.</p>')
            events = [event for event in data['events'] if (event['subject'] == str(d['id']) and ('draft' in event['action'] or event['action'].startswith(('human_', 'fake_', 'send_', 'action_'))))]
            trail = ''.join(f'<li><span class="trail-dot"></span><div>{e(event["action"].replace("_"," ").capitalize())}<small>{e(event["at"][11:19])} UTC</small></div></li>' for event in events[-4:])
            detail = f'<section class="document-panel"><div class="panel-title"><h2>Source evidence</h2><span>{len(related)} FILES</span></div><div class="doc-tabs">{tabs}</div><div class="document-scroll">{paper}</div></section><section class="decision"><div class="panel-title"><h2>Review & approve</h2><span class="step-number">03</span></div><div class="decision-scroll"><div class="decision-heading">{badge(d["status"])}<h3>A follow-up.<br><em>Your final say.</em></h3><p>Review the evidence and exact message before approving.</p></div><div class="message"><div class="message-label">OUTBOUND DRAFT <span>{"AI-assisted" if engine.drafter else "Template"}</span></div><p class="recipient"><span>To</span> {e(d["recipient"])}</p><pre>{e(d["body"])}</pre></div><div class="approval-actions">{buttons}</div><p class="gate-note">◇ Approval unlocks a separate send action. Delivery stays in the local demo outbox.</p><h4 class="trail-heading">DECISION TRAIL</h4><ol class="trail">{trail}</ol></div></section>'
        else:
            detail = '<section class="document-panel empty"><h2>No shipment selected</h2><p>Check the inbox or adjust your search to begin.</p></section>'
        content = f'<div class="workspace">{queue}{detail}</div>'
    elif tab == 'documents':
        rows = ''.join(f'<tr><td><a href="/document?id={e(d["document_id"])}" target="_blank" rel="noopener">{e(d["document_id"])} ↗</a></td><td>{e(d["type"] or "Unreadable")}</td><td>{e(d["shipment_id"] or "Unmatched — manual review")}</td><td>{e(" · ".join(finding_labels.get(f,f) for f in d["findings"]) or "Clean match")}</td></tr>' for d in docs)
        content = f'<section class="full-panel"><div class="section-intro"><p class="eyebrow">SOURCE REGISTER</p><h2>Every document. Accounted for.</h2><p>Unmatched and unreadable files stay visible for manual investigation.</p></div><div class="table-wrap"><table><thead><tr><th>Source</th><th>Type</th><th>Shipment</th><th>Review finding</th></tr></thead><tbody>{rows}</tbody></table></div></section>'
    elif tab == 'outbox':
        rows = ''.join(f'<article class="outbox-message"><div><span class="status sent">Simulated send</span><h3>Draft {o["draft_id"]}</h3><p>{e(o["recipient"])}</p><small>{e(o["created_at"])}</small></div><pre>{e(o["body"])}</pre></article>' for o in data['outbox'])
        content = f'<section class="full-panel"><div class="section-intro"><p class="eyebrow">AFTER YOUR APPROVAL</p><h2>Sent. To the demo outbox.</h2><p>Local records only. No message leaves this application.</p></div>{rows or "<p class=empty>The outbox is empty. Approve a draft, then send it here.</p>"}</section>'
    else:
        rows = ''.join(f'<tr><td class="mono">{event["id"]:03d}</td><td class="mono">{e(event["at"][11:19])}<small> UTC</small></td><td><strong>{e(event["action"].replace("_"," "))}</strong></td><td class="mono">{e(event["subject"])}</td><td><details><summary>Event details</summary><pre>{e(event["detail"])}</pre><small>{e(event["at"])}</small></details></td></tr>' for event in reversed(data['events']))
        content = f'<section class="full-panel"><div class="section-intro"><p class="eyebrow">TRACEABLE BY DESIGN</p><h2>The record behind every action.</h2><p><span class="status">Hash chain {"verified" if engine.verify_log() else "INVALID"}</span> {len(data["events"])} append-only local events. Not an independently secured audit archive.</p></div><div class="table-wrap"><table><thead><tr><th>Event</th><th>Time</th><th>Action</th><th>Subject</th><th>Evidence</th></tr></thead><tbody>{rows}</tbody></table></div></section>'
    title = {'review':'Shipment review','documents':'Document register','outbox':'Demo outbox','audit':'Activity log'}[tab]
    css = (Path(__file__).parent / 'workspace.css').read_text()
    error = error or engine.watch_error or ''
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{title} · Selerim</title><style>{css}</style></head><body><a class="skip" href="#main">Skip to workspace</a><aside class="sidebar"><a class="brand" href="/">selerim<em>studio</em></a><div class="product"><span class="product-icon">↗</span><div>Freight desk<small>DOCUMENT OPERATIONS</small></div></div><p class="nav-label">WORKSPACE</p><nav aria-label="Workspace">{nav}</nav><div class="sidebar-bottom"><span class="small-dot"></span> Local environment<p>One job. Scoped access.<br>Human control.</p><span class="concept-label">CONCEPT BUILD / 01</span></div></aside><main id="main"><header class="topbar"><div class="breadcrumb">Concepts <span>/</span> Logistics <span>/</span> <strong>{title}</strong></div><span class="demo-badge">FICTIONAL DATA ONLY</span></header><div class="page-heading"><div><p class="eyebrow">OPERATIONS, WITH OVERSIGHT</p><h1>{title}<span>.</span></h1></div><div class="heading-actions"><a class="refresh" href="{e(url(view=tab))}" aria-label="Refresh workspace">↻</a>{action('process','Check inbox <span aria-hidden="true">↙</span>')}</div></div><div class="summary-strip"><span><strong>{len(docs):02d}</strong> documents received</span><span><strong>{len(pending):02d}</strong> awaiting review</span><span><strong>{len(data["outbox"]):02d}</strong> simulated sends</span><span class="scope"><span class="small-dot"></span> Read-only source access</span></div>{f'<p class="alert" role="alert">{e(error)}</p>' if error else ''}{content}<footer class="workspace-footer"><span>SYNTHETIC DEMO · {"AI DRAFTING" if engine.drafter else "TEMPLATE DRAFTING — NO LLM ACTIVE"}</span><span>No external email · OCR not enabled <span aria-hidden="true">◇</span></span></footer></main></body></html>'''
