"""An evidence-led intake reading room, sharing Selerim's approval UI primitives."""
import html
import io
from urllib.parse import urlencode
from pypdf import PdfReader
from pypdf.errors import PdfReadError
from demos.logistics.selerim_demo.ui import icon


def e(value):
    return html.escape(str(value), quote=True)


def href(**args):
    return '/?' + urlencode(args)


LABELS = {'intake_form':'Intake questionnaire', 'engagement_letter':'Engagement letter','unsupported':'Unclassified document'}
ISSUES = {'missing_document:engagement_letter':'Engagement letter not received',
          'missing_field:intake_form.contact_email':'Contact email missing from intake form',
          'unsigned:engagement_letter':'Engagement letter marked unsigned',
          'conflict:company':'Company names differ across documents'}
STATUS = {'pending':'Awaiting review','approved':'Reviewed','finalized':'Filed locally','returned':'Follow-up queue'}


def render(engine, token, params=None, error=''):
    params=params or {}
    view=params.get('view',['review'])[0]
    if view not in ('review','incomplete','filed','activity'):
        view='review'
    query=params.get('q',[''])[0][:100]
    matters=engine.snapshot()
    counts={'review':sum(m['status'] in ('pending','approved') for m in matters),
            'incomplete':sum(m['route']=='incomplete' for m in matters),
            'filed':sum(m['status']=='finalized' for m in matters)}
    candidates=[m for m in matters if (view=='review' and m['status'] in ('pending','approved') or
                 view=='incomplete' and m['route']=='incomplete' or view=='filed' and m['status']=='finalized')
                and query.lower() in (m['matter_id']+m['company']).lower()]
    selected=next((m for m in candidates if m['matter_id']==params.get('matter',[''])[0]),candidates[0] if candidates else None)
    nav=''.join(f'<a href="{href(view=key)}" class="navitem {"current" if key==view else ""}" aria-label="{label}" {"aria-current=page" if key==view else ""}>{icon(symbol)}<span>{label}</span><b>{count}</b></a>' for key,label,symbol,count in [('review','Review desk','inbox',counts['review']),('incomplete','Needs information','file',counts['incomplete']),('filed','Filed intakes','check',counts['filed']),('activity','Activity log','activity','')])
    rows=''
    for m in candidates:
        active=selected and selected['matter_id']==m['matter_id']
        rows+=f'''<a class="queue-row {"selected" if active else ""}" data-case href="{e(href(view=view,matter=m['matter_id'],q=query))}" {"aria-current=true" if active else ""}><span class="queue-id">{m['matter_id'].replace('SYN-','')}<i class="dot {"amber" if m['issues'] else "sage"}"></i></span><strong>{e(m['company'].replace(' (fictional)',''))}</strong><span class="queue-meta">{len(m['issues']) if m['issues'] else len(m['documents'])} {"open item" if len(m['issues'])==1 else "open items" if m['issues'] else "source documents"}<span>{icon('arrow',13)}</span></span></a>'''
    queue=f'''<section class="queue" aria-label="Matter queue"><div class="queue-heading"><h2>Your matter index</h2><span>{len(candidates):02d}</span></div><form method="get" class="search">{icon('search',16)}<input type="hidden" name="view" value="{view}"><label class="sr-only" for="search">Search matters</label><input id="search" name="q" value="{e(query)}" placeholder="Find a matter…"><button aria-label="Search matters">↵</button></form><div class="queue-scroll">{rows or '<div class="empty-small">No matters in this view.<br><a href="/">Return to review desk →</a></div>'}</div><div class="queue-foot"><span>SCROLL TO EXPLORE</span><span>J / K {icon('arrow',12)}</span></div></section>'''
    def action(name,label,matter,secondary=False,attest=False):
        checkbox='<label class="attestation"><input type="checkbox" name="reviewed" value="yes" required><span>I reviewed the source documents and intake summary.</span></label>' if attest else ''
        return f'<form method="post" action="/action">{checkbox}<input type="hidden" name="token" value="{e(token)}"><input type="hidden" name="action" value="{name}"><input type="hidden" name="matter" value="{matter}"><button class="button {"secondary" if secondary else ""}">{label} {icon("arrow",16)}</button></form>'
    if view=='activity':
        events=engine.events()
        audit=''.join(f'<tr><td class="mono">{row["id"]:03d}</td><td>{e(row["action"].replace("_"," "))}</td><td class="mono">{e(row["subject"])}</td><td><time>{e(row["at"][11:19])} UTC</time><details><summary>Event details</summary><pre>{e(row["detail"])}</pre></details></td></tr>' for row in events)
        content=f'<section class="activity"><p class="eyebrow">THE RECORD BEHIND THE REVIEW</p><h2>Every decision leaves a trace.</h2><p>{len(events)} events · Hash chain {"verified" if engine.verify_log() else "INVALID"}. Local append-only records.</p><div class="table-wrap"><table><thead><tr><th>Event</th><th>Action</th><th>Matter</th><th>Time & detail</th></tr></thead><tbody>{audit}</tbody></table></div></section>'
    elif selected:
        m=selected
        matter=m['matter_id']
        source_id=params.get('source',[''])[0]
        if source_id not in ['EMAIL']+[d['id'] for d in m['documents']]:
            source_id=m['documents'][0]['id'] if m['documents'] else 'EMAIL'
        try:
            focus_page=max(1,int(params.get('page',['1'])[0]))
            focus_line=max(0,int(params.get('line',['0'])[0]))
        except ValueError:
            focus_page,focus_line=1,0
        sources=''.join(f'<a class="source-tab {"active" if d["id"]==source_id else ""}" href="{e(href(view=view,matter=matter,source=d["id"],q=query))}#evidence">{icon("file",14)}{LABELS.get(d["type"],"Document")}<span>{d["id"]}</span></a>' for d in m['documents'])
        sources+=f'<a class="source-tab {"active" if source_id=="EMAIL" else ""}" href="{e(href(view=view,matter=matter,source="EMAIL",q=query))}#evidence">{icon("inbox",14)}Intake email<span>EMAIL</span></a>'
        # Source retrieval is scoped by BOTH matter and document, verified against ingested hashes.
        try:
            payload=engine.source(matter,source_id)
            if source_id=='EMAIL':
                pages=[payload.decode().splitlines()]
            else:
                pages=[(p.extract_text() or '').splitlines() for p in PdfReader(io.BytesIO(payload)).pages]
            paragraphs=''.join(f'<section class="source-page"><p class="page-number">PAGE {page:02d}</p>'+''.join(f'<p class="source-line {"highlight" if page==focus_page and line==focus_line else ""}" id="source-{page}-{line}"><span>{line:02d}</span><mark>{e(text) or "&nbsp;"}</mark></p>' for line,text in enumerate(lines,1))+'</section>' for page,lines in enumerate(pages,1))
        except (ValueError,OSError,UnicodeError,PdfReadError):
            paragraphs='<p class="source-error">Source unavailable or changed. Start a fresh review before approving.</p>'
        brief=''
        for i,sentence in enumerate(m['summary'],1):
            s=sentence['source']
            url=href(view=view,matter=matter,source=s['document'],page=s['page'],line=s['line'],q=query)+'#evidence'
            brief+=f'<li><span class="sentence-number">{i:02d}</span><div><p>{e(sentence["text"])}</p><a class="citation" href="{e(url)}" aria-label="Source for summary statement {i}: {s["document"]}, page {s["page"]}, line {s["line"]}">{icon("external",12)}{s["document"]} · p{s["page"]}:{s["line"]}</a></div></li>'
        issues=''.join(f'<li>{icon("alert",15)}<span>{e(ISSUES.get(issue,issue.replace("_"," ")))}</span></li>' for issue in m['issues'])
        completeness=f'<div class="completeness {"incomplete" if issues else "complete"}"><div>{icon("alert" if issues else "check",17)}<strong>{str(len(m["issues"]))+" items to resolve" if issues else "Required intake fields are present"}</strong></div>{"<ul>"+issues+"</ul>" if issues else "<p>Ready for your review. This is not a conflict check or client acceptance.</p>"}</div>'
        if m['status']=='pending' and m['issues']:
            decision=action('return','Route to follow-up',matter)+ '<p class="decision-note">Keeps this intake in the local follow-up queue. No message is sent.</p>'
        elif m['status']=='pending':
            decision=action('approve','Approve intake summary',matter,attest=True)+'<p class="decision-note">Attorney review gate · filing is a separate step.</p>'
        elif m['status']=='approved':
            decision=action('finalize','File reviewed intake',matter)+'<p class="decision-note">Saves the reviewed intake locally. Does not accept the client.</p>'
        else:
            decision=f'<div class="decision-done">{icon("check",20)}<div><strong>{STATUS[m["status"]]}</strong><p>{"Awaiting corrected materials in a fresh review." if m["status"]=="returned" else "Reviewed by the local demo operator. No external action."}</p></div></div>'
        events=engine.events(matter)
        trail=''.join(f'<li><span>{e(row["action"].replace("_"," "))}</span><time>{e(row["at"][11:19])}</time></li>' for row in events if row['action'].startswith(('human_','intake_','decision_')))
        company=m['company'].replace(' (fictional)','')
        content=f'''<div class="workspace">{queue}<section class="matter"><header class="matter-heading"><div><p class="eyebrow">{matter} <span>/</span> INTAKE BRIEF</p><h2>{e(company)}</h2><p class="matter-sub">Commercial intake <span>·</span> Fictional organization</p></div><span class="badge {"amber" if m['issues'] else "sage"}">{"Needs information" if m['issues'] and m['status']=='pending' else STATUS[m['status']]}</span></header><div class="reading-room"><section class="brief" id="brief"><div class="section-label"><span>01 — INTAKE MEMORANDUM</span><span class="source-count">{len(m['summary'])} sourced statements</span></div><h3>At a glance.</h3><p class="brief-caption">A factual extract of the submitted materials. Select a source to inspect the exact line.</p><ol class="summary">{brief or '<li>No supported facts extracted. Manual review required.</li>'}</ol>{completeness}<details class="decision-history"><summary>Review history {icon('chevron',13)}</summary><ul>{trail}</ul></details><div class="decision">{decision}</div></section><aside class="evidence" id="evidence" aria-label="Source evidence"><div class="section-label"><span>02 — THE RECORD</span><a class="back-to-brief" href="#brief">Back to brief {icon('arrow',12)}</a></div><div class="source-tabs">{sources}</div><div class="evidence-toolbar"><span>{source_id} <i>·</i> EXTRACTED TEXT</span><a href="/source?{e(urlencode({'matter':matter,'document':source_id}))}" target="_blank" rel="noopener">Open original {icon('external',12)}</a></div><div class="source-paper"><div class="paper-letterhead"><span>SELERIM <i>/</i> CONCEPT STUDIO</span><b>Fictional<br>materials only</b></div>{paragraphs}<div class="paper-footer">A source, not a conclusion.<span>MATTER-SCOPED</span></div></div><div class="source-boundary">{icon('shield',15)}<p>Only this matter’s sources are loaded. Claims stay linked to the submitted text.</p></div></aside></div></section></div>'''
    else:
        content=f'<div class="workspace">{queue}<section class="empty"><p class="eyebrow">SPACE TO THINK</p><h2>A clear desk.<br><em>A considered next step.</em></h2><p>No matters match this view.</p><a class="button secondary" href="/">Return to review desk {icon("arrow",16)}</a></section></div>'
    notice={'approved':'Summary approved. File it when you are ready.','finalized':'Reviewed intake filed locally. No client acceptance or external action.','returned':'Routed to the local follow-up queue. No email sent.','processed':'Inbox checked. New fictional matters are ready.'}.get(params.get('notice',[''])[0])
    alert=f'<div class="toast {"error" if error else ""}" role="{"alert" if error else "status"}">{icon("alert" if error else "check",18)}{e(error or notice)}<button data-dismiss aria-label="Dismiss notification">{icon("close",16)}</button></div>' if error or notice else ''
    commands=''.join(f'<a href="{href(view=key)}">{icon(symbol)}{name}{icon("arrow",14)}</a>' for key,name,symbol in [('review','Review desk','inbox'),('incomplete','Needs information','file'),('filed','Filed intakes','check'),('activity','Activity log','activity')])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>The matter room · Selerim</title><link rel="stylesheet" href="/assets/legal.css"><script src="/assets/workspace.js" defer></script></head><body><a class="skip" href="#main">Skip to review desk</a><header class="masthead"><a class="brand" href="/" aria-label="Selerim studio home"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>selerim<em>studio</em></a><span class="edition">THE MATTER ROOM <i>/</i> LEGAL INTAKE</span><button class="command-launch js-only" data-command aria-label="Find a matter">{icon('search',16)}<span>Find a matter</span><kbd>⌘ K</kbd></button><span class="reviewer">DR<span>Demo reviewer</span></span></header><div class="navigation"><nav aria-label="Workspace">{nav}</nav><span class="session-status"><i></i> Local concept · fictional data</span></div><main id="main"><header class="topbar"><div>{icon('grid',15)}<span>Concept studio</span><i>/</i><strong>Legal intake</strong></div><span class="concept-badge"><i></i> FICTIONAL DATA <b>02</b></span></header><div class="page-heading"><div><p class="eyebrow">DOCUMENT ORGANIZATION. HUMAN JUDGMENT.</p><h1>A little order.<br><em>A clearer perspective.</em></h1><p>Every matter, considered. Every statement, sourced.</p></div>{action('process','Check intake inbox','')}</div><div class="summary-strip"><span><b>{len(matters):02d}</b> fictional matters</span><span><i class="dot amber"></i><b>{counts['incomplete']:02d}</b> need information</span><span><i class="dot sage"></i><b>{sum(m['route']=='attorney_review' for m in matters):02d}</b> complete intakes</span><span class="boundary">{icon('shield',14)} No autonomous legal advice</span></div>{alert}{content}<footer><span>CONCEPT BUILD / FICTIONAL DATA ONLY</span><span>{'Verified extraction · AI source ordering enabled' if engine.brief_writer else 'Deterministic extraction · No LLM active'} · No external delivery</span></footer></main><dialog class="command-dialog" aria-labelledby="command-title"><div class="command-top"><h2 id="command-title">Find your next matter.</h2><button data-close class="icon-button" aria-label="Close command menu">{icon('close',18)}</button></div><form action="/" method="get" class="command-search">{icon('search',20)}<label class="sr-only" for="command-search">Find a matter</label><input id="command-search" name="q" placeholder="Company or matter number…"><button class="icon-button" aria-label="Find matter">{icon('arrow',18)}</button></form><nav>{commands}</nav><div class="command-foot"><span>J / K to move between matters</span><span>Esc to close</span></div></dialog></body></html>'''
