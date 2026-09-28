"""Selerim Freight: a document-first, keyboard-friendly review workspace."""
import html
import json
import sqlite3
from urllib.parse import urlencode


def e(value):
    return html.escape(str(value), quote=True)


def icon(name, size=18):
    paths = {
        'inbox': '<path d="M4 4h16v16H4zM4 14h5l2 3h2l2-3h5"/>',
        'file': '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
        'send': '<path d="m3 11 18-8-8 18-2-8-8-2ZM11 13l10-10"/>',
        'activity': '<path d="M3 12h4l3-7 4 14 3-7h4"/>',
        'search': '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
        'shield': '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
        'check': '<path d="m5 12 4 4L19 6"/>',
        'arrow': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
        'external': '<path d="M14 3h7v7m0-7L10 14M10 5H4v16h16v-6"/>',
        'refresh': '<path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5"/>',
        'chevron': '<path d="m9 5 7 7-7 7"/>',
        'alert': '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 3v1"/>',
        'close': '<path d="m6 6 12 12M6 18 18 6"/>',
        'spark': '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
        'grid': '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/>',
    }
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths.get(name, paths["file"])}</svg>'


LABELS = {
    'mismatch:pieces': 'Piece count discrepancy', 'mismatch:carrier': 'Carrier discrepancy',
    'mismatch:weight_lb': 'Weight discrepancy', 'missing_field:received_by': 'Recipient missing',
    'missing_field:carrier': 'Carrier missing', 'missing_field:shipment_id': 'Reference missing',
    'unmatched': 'No matching shipment', 'duplicate': 'Duplicate document',
    'unreadable': 'Document unreadable',
}


def render(engine, token, error='', params=None):
    params = params or {}
    tab = params.get('view', ['review'])[0]
    if tab not in ('review', 'documents', 'outbox', 'audit'):
        tab = 'review'
    query = params.get('q', [''])[0][:100]
    state = params.get('state', ['pending'])[0]
    if state not in ('pending', 'approved', 'sent', 'all'):
        state = 'pending'
    data = engine.snapshot()
    docs = [json.loads(d['result']) for d in data['documents']]
    counts = {status: sum(d['status'] == status for d in data['drafts']) for status in ('pending', 'approved', 'sent')}
    counts['all'] = len(data['drafts'])
    candidates = [d for d in data['drafts'] if (state == 'all' or d['status'] == state)
                  and query.lower() in (d['shipment'] + d['body']).lower()]
    selected = next((d for d in candidates if str(d['id']) == params.get('draft', [''])[0]), candidates[0] if candidates else None)

    def url(**values):
        return '/?' + urlencode(values)

    def action(action_name, label, draft='', secondary=False):
        return f'<form method="post" action="/action"><input type="hidden" name="token" value="{e(token)}"><input type="hidden" name="action" value="{action_name}"><input type="hidden" name="draft" value="{draft}"><button class="button {"secondary" if secondary else ""}">{label}</button></form>'

    def badge(status):
        return f'<span class="status {e(status)}"><i></i>{e({"pending":"Needs review","approved":"Ready to send","sent":"Demo sent"}.get(status,status))}</span>'

    nav = ''.join(f'<a class="navitem {"current" if key == tab else ""}" href="{url(view=key)}" aria-label="{name}" {"aria-current=page" if key == tab else ""}>{icon(symbol)}<span>{name}</span><span class="navcount">{count}</span></a>'
                  for key, name, symbol, count in [('review','Review queue','inbox',counts['pending']),('documents','Documents','file',len(docs)),('outbox','Demo outbox','send',len(data['outbox'])),('audit','Activity log','activity',len(data['events']))])
    finding_labels = LABELS
    if tab == 'review':
        rows = ''
        for d in candidates:
            related = [doc for doc in docs if doc['shipment_id'] == d['shipment']]
            findings = [f for doc in related for f in doc['findings'] if f != 'duplicate']
            label = LABELS.get(findings[0], findings[0]) if findings else ('Missing document' if related else 'Missing BOL & POD')
            rows += f'''<a class="queue-row {"selected" if selected and selected["id"] == d["id"] else ""}" data-case href="{e(url(view='review',draft=d['id'],q=query,state=state))}" {"aria-current=true" if selected and selected["id"] == d["id"] else ""}>
              <span class="row-top"><strong>{e(d['shipment'].replace('SYN-', ''))}</strong><span class="row-dot {e(d['status'])}" aria-label="{e(d['status'])}"></span></span>
              <span class="row-reason">{e(label)}</span><span class="row-bottom"><span>{len(related)} document{'s' if len(related) != 1 else ''}</span><span class="row-arrow">{icon('arrow',14)}</span></span></a>'''
        filters = ''.join(f'<a class="queue-filter {"active" if state==key else ""}" href="{e(url(view="review",state=key,q=query))}" {"aria-current=true" if state==key else ""}>{label}<span>{counts[key]}</span></a>' for key,label in [('pending','Review'),('approved','Ready'),('sent','Sent')])
        queue = f'''<section class="queue"><div class="panel-title"><h2>Shipment queue</h2><span class="keyboard-hint">J / K</span></div>
          <form class="search" method="get">{icon('search',16)}<input type="hidden" name="view" value="review"><input type="hidden" name="state" value="{state}"><label class="sr-only" for="search">Search shipment or finding</label><input id="search" name="q" placeholder="Search shipments…" value="{e(query)}"><button aria-label="Search shipments">↵</button></form>
          <nav class="queue-filters" aria-label="Queue status">{filters}</nav><div class="queue-scroll">{rows or '<div class="empty"><span class="empty-symbol">✓</span><h3>All clear here.</h3><p>No shipments match this view.</p><a href="/?view=review">Return to review queue →</a></div>'}</div>
          <div class="queue-foot"><span>{len(candidates)} shipments in view</span><a href="/?view=review&state=all">Show all {icon('arrow',12)}</a></div></section>'''
        if selected:
            d = selected
            with sqlite3.connect((engine.inputs / 'records.sqlite').as_uri() + '?mode=ro', uri=True) as records:
                records.row_factory = sqlite3.Row
                record = records.execute('SELECT * FROM shipments WHERE shipment_id=? AND job_id=?', (d['shipment'], engine.job_id)).fetchone()
                expected = dict(record) if record else {}
            related = [doc for doc in docs if doc['shipment_id'] == d['shipment']]
            source = next((doc for doc in related if doc['document_id'] == params.get('doc', [''])[0]), next((doc for doc in related if doc['findings']), related[0] if related else None))
            related_findings = [f for doc in related for f in doc['findings'] if f != 'duplicate']
            case_title = LABELS.get(related_findings[0], related_findings[0]) if related_findings else 'Missing shipment documents'
            current_index = next(i for i, row in enumerate(candidates) if row['id'] == d['id'])
            next_case = candidates[current_index + 1] if current_index + 1 < len(candidates) else None
            next_link = f'<a class="next-case" href="{e(url(view="review",draft=next_case["id"],state=state,q=query))}" aria-label="Next shipment">Next {icon("arrow",16)}</a>' if next_case else '<span class="next-case disabled">Last in view</span>'
            stages = ''.join(f'<li class="{"complete" if i < stage else "active" if i == stage else ""}"><span>{icon("check",12) if i < stage else i+1}</span>{label}</li>' for i,label in enumerate(['Analyzed','Draft prepared','Your approval','Demo outbox']) for stage in [3 if d['status']=='sent' else 2 if d['status']=='approved' else 1])
            case_head = f'''<div class="case-heading"><div><p class="case-eyebrow">{icon('file',14)} {e(d['shipment'])}<span>/</span> {e(expected.get('carrier','Shipment record'))}</p><h2>{e(case_title)}</h2></div>{next_link}</div><ol class="pipeline" aria-label="Review progress">{stages}</ol>'''
            tabs = ''.join(f'<a class="doc-tab {"active" if source and source["document_id"] == doc["document_id"] else ""}" href="{e(url(view="review",draft=d["id"],doc=doc["document_id"],q=query,state=state))}">{icon("file",14)}{e(doc["type"] or "PDF")}<small>{e(doc["document_id"])}</small></a>' for doc in related)
            if source:
                ordered_keys = ['shipment_id','carrier','pieces','weight_lb','received_by']
                fields = ''.join(f'<div class="paper-field {"flag" if "mismatch:"+key in source["findings"] else ""}"><dt>{e(key.replace("_"," "))}</dt><dd>{e(source["fields"][key])}{icon("alert",13) if "mismatch:"+key in source["findings"] else ""}</dd></div>' for key in ordered_keys if key in source['fields'])
                flags = ''.join(f'<div class="finding">{icon("alert",16)}<div><strong>{e(LABELS.get(f,f))}</strong><p>Review against the shipment record before sending.</p></div></div>' for f in source['findings'] if f != 'duplicate')
                comparisons = ''.join(f'<div class="comparison"><div><span>ON DOCUMENT</span><strong class="incorrect">{e(value)}</strong></div>{icon("arrow",16)}<div><span>SHIPMENT RECORD</span><strong>{e(expected.get(key,"Unavailable"))}</strong></div></div>' for key,value in source['fields'].items() if 'mismatch:' + key in source['findings'])
                paper = f'''<div class="evidence-summary">{flags or '<div class="clean">'+icon('check',16)+' Document fields match the shipment record.</div>'}{comparisons}</div><div class="document-scroll"><div class="doc-toolbar"><span>EXTRACTED VIEW <i>•</i> {e(source['document_id'])}</span><a href="/document?id={e(source['document_id'])}" target="_blank" rel="noopener">Open PDF {icon('external',13)}</a></div>
                <div class="paper"><div class="paper-top"><div class="paper-brand">{icon('grid',23)}<span>SELERIM<small>SYNTHETIC FREIGHT</small></span></div><span class="document-code">{e(source['type'])}<small>01 / 01</small></span></div><div class="paper-title"><p>SHIPMENT DOCUMENT</p><h3>{'Bill of lading' if source['type']=='BOL' else 'Proof of delivery'}</h3><span>{e(source['document_id'])} <i>·</i> Fictional data</span></div><dl>{fields}</dl><div class="paper-foot"><span>Extracted from the original PDF.<br>Not a shipping instrument.</span><div class="barcode" aria-hidden="true"></div></div></div>
                </div>'''
            else:
                paper = f'''<div class="missing-doc"><div class="empty-illustration" aria-hidden="true"><span>{icon('file',42)}</span><span>{icon('file',42)}</span><b>?</b></div><p class="eyebrow">AWAITING PAPERWORK</p><h3>A shipment.<br><em>Without its documents.</em></h3><p>No BOL or POD is linked to this shipment. Review the prepared follow-up to request them.</p><div class="missing-slot">{icon('file',17)}<strong>Bill of lading</strong><span>Missing</span></div><div class="missing-slot">{icon('file',17)}<strong>Proof of delivery</strong><span>Missing</span></div></div>'''
            events = [event for event in data['events'] if event['subject']==str(d['id']) and ('draft' in event['action'] or event['action'].startswith(('human_','fake_','send_','action_')))]
            trail = ''.join(f'<li><span class="trail-dot"></span><div>{e(event["action"].replace("_"," ").capitalize())}<time>{e(event["at"][11:19])} UTC</time></div></li>' for event in events[-4:])
            if d['status']=='pending':
                buttons = action('approve','Approve draft '+icon('arrow',16),d['id']) + action('reject','Reject',d['id'],True)
                gate = 'Approval is required. Nothing is sent yet.'
            elif d['status']=='approved':
                buttons = action('send','Send to demo outbox '+icon('send',16),d['id'])
                gate = 'Approved by the local operator. No external delivery.'
            else:
                buttons = '<a class="button" href="/?view=review">Review next shipment '+icon('arrow',16)+'</a>'
                gate = 'Recorded locally. No email was delivered.'
            detail = f'''<div class="case-workspace">{case_head}<div class="case-columns"><section class="document-panel"><div class="panel-title"><h3>Source evidence</h3><span>{len(related)} DOCUMENTS</span></div><div class="doc-tabs">{tabs or '<span class="no-docs">No source files</span>'}</div>{paper}</section>
              <section class="decision"><div class="panel-title"><h3>Review follow-up</h3>{badge(d['status'])}</div><div class="decision-scroll"><div class="draft-intro"><span class="draft-icon">{icon('spark',20)}</span><div><strong>A draft. You decide.</strong><p>{'AI-assisted wording' if engine.drafter else 'Prepared from the detected findings'}</p></div></div><div class="message"><div class="message-label"><span>{icon('send',14)} FOLLOW-UP EMAIL</span><span class="template-label">{'AI draft' if engine.drafter else 'Template draft'}</span></div><div class="recipient"><span>To</span>{e(d['recipient'])}</div><pre>{e(d['body'])}</pre></div><details class="decision-history"><summary>Decision history <span>{len(events)}</span>{icon('chevron',14)}</summary><ol class="trail">{trail}</ol></details></div><div class="decision-footer"><div class="approval-actions">{buttons}</div><p>{icon('shield',14)}{gate}</p></div></section></div></div>'''
        else:
            detail = f'<section class="case-workspace empty-workspace"><div class="empty-illustration">{icon("check",50)}</div><p class="eyebrow">A LITTLE LESS TO DO</p><h2>A clear view.<br><em>A clear next step.</em></h2><p>Choose another queue or adjust your search.</p><a class="button secondary" href="/?view=review&state=all">See every shipment {icon("arrow",16)}</a></section>'
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
    title = {'review':'The exception desk','documents':'Document register','outbox':'Demo outbox','audit':'Activity log'}[tab]
    description = {'review':'The paperwork is sorted. The next move is yours.', 'documents':'Every source, every match, every open question.', 'outbox':'Human-approved follow-ups. Recorded locally.', 'audit':'A clear record of what happened, and why.'}[tab]
    error = error or engine.watch_error or ''
    notice = {'approved':'Draft approved. Sending is a separate action.', 'sent':'Recorded in the demo outbox. No external email sent.', 'rejected':'Draft rejected. It cannot be sent.', 'processed':'Inbox checked. The workspace is up to date.'}.get(params.get('notice',[''])[0])
    alert = f'<div class="toast error" role="alert">{icon("alert",18)}{e(error)}</div>' if error else (f'<div class="toast" role="status">{icon("check",18)}{notice}<button data-dismiss aria-label="Dismiss notification">{icon("close",16)}</button></div>' if notice else '')
    commands = ''.join(f'<a href="{url(view=key)}">{icon(symbol)}{label}{icon("arrow",14)}</a>' for key,label,symbol in [('review','Open review queue','inbox'),('documents','Browse documents','file'),('outbox','Open demo outbox','send'),('audit','Inspect activity log','activity')])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{title} · Selerim Freight</title><link rel="stylesheet" href="/assets/workspace.css"><script src="/assets/workspace.js" defer></script></head><body>
      <a class="skip" href="#main">Skip to workspace</a><aside class="sidebar"><a class="brand" href="/" aria-label="Selerim studio home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>selerim<em>studio</em></span></a>
      <div class="workspace-name"><span class="workspace-monogram">S</span><div>Freight operations<small>Selerim concept studio</small></div><span class="workspace-lock">{icon('shield',14)}</span></div>
      <button class="command-launch js-only" data-command>{icon('search',16)}<span>Jump to…</span><kbd>⌘ K</kbd></button><p class="nav-label">WORKSPACE</p><nav aria-label="Workspace">{nav}</nav>
      <div class="studio-note"><span class="note-orbit" aria-hidden="true">{icon('spark',22)}</span><p>Less paperwork.<br><em>More possibility.</em></p><span>AI integration, thoughtfully built.</span></div>
      <div class="sidebar-bottom"><div class="environment"><i></i><span>Local demo</span><span class="env-tag">01</span></div><div class="operator"><span class="avatar">DM</span><div>Demo operator<small>Human review required</small></div>{icon('shield',15)}</div></div></aside>
      <main id="main"><header class="topbar"><div class="breadcrumb">{icon('grid',14)}<span>Concept studio</span><i>/</i><strong>Logistics</strong></div><div class="topbar-end"><span class="demo-badge"><i></i>Fictional data</span><span class="vertical-line"></span><span class="concept-number">CONCEPT 01</span></div></header>
      <div class="page-heading"><div><p class="eyebrow">DOCUMENT INTELLIGENCE / HUMAN OVERSIGHT</p><h1>{title}<span>.</span></h1><p class="page-description">{description}</p></div><div class="heading-actions"><a class="icon-button" href="{e(url(view=tab,state=state))}" aria-label="Refresh workspace">{icon('refresh',17)}</a>{action('process',icon('inbox',16)+' Check inbox')}</div></div>
      <div class="summary-strip"><span><span class="metric-icon">{icon('file',16)}</span><strong>{len(docs)}</strong> documents analyzed</span><span><span class="metric-dot amber"></span><strong>{counts['pending']}</strong> need your review</span><span><span class="metric-dot green"></span><strong>{len(data['outbox'])}</strong> demo sends</span><span class="scope">{icon('shield',14)} Scoped access · approval before send</span></div>
      {alert}{content}<footer class="workspace-footer"><span><i></i> CONCEPT BUILD · SYNTHETIC DATA ONLY</span><span>{'AI drafting enabled' if engine.drafter else 'Template mode · no LLM active'}<b>·</b>No external email<b>·</b>OCR not enabled</span></footer></main>
      <dialog class="command-dialog" aria-labelledby="command-title"><div class="command-top"><h2 id="command-title">Where would you like to go?</h2><button class="icon-button" data-close aria-label="Close command menu">{icon('close',18)}</button></div><form action="/" method="get" class="command-search">{icon('search',20)}<input type="hidden" name="view" value="review"><input type="hidden" name="state" value="all"><label class="sr-only" for="command-search">Find a shipment</label><input id="command-search" name="q" placeholder="Find a shipment or finding…"><button class="icon-button" aria-label="Find shipment">{icon('arrow',18)}</button></form><p class="nav-label">QUICK NAVIGATION</p><nav>{commands}</nav><div class="command-foot"><span><kbd>J</kbd> <kbd>K</kbd> move between shipments</span><span><kbd>Esc</kbd> close</span></div></dialog></body></html>'''
