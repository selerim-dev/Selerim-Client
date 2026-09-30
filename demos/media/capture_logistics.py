import json, sys
from playwright.sync_api import sync_playwright
OUT=sys.argv[1]; SCALE=float(sys.argv[2]) if len(sys.argv) > 2 else 2; U='http://127.0.0.1:8093'
boxes={}
def rect(pg, sel=None, text=None):
    el = pg.locator(sel) if sel else pg.get_by_text(text, exact=False)
    el = el.first
    r = el.bounding_box()
    return [round(r['x'],1), round(r['y'],1), round(r['x']+r['width'],1), round(r['y']+r['height'],1)]
def shot(pg, name, **sels):
    pg.wait_for_timeout(400)
    pg.screenshot(path=f'{OUT}/{name}.png')
    boxes[name] = {}
    for k, v in sels.items():
        try: boxes[name][k] = rect(pg, **v) if isinstance(v, dict) else rect(pg, v)
        except Exception as e: print('miss', name, k, e)
    print(name, boxes[name], flush=True)
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    pg = b.new_page(viewport={'width':1440,'height':900}, device_scale_factor=SCALE)
    pg.goto(U+'/'); pg.wait_for_load_state('networkidle')
    shot(pg, 'empty', inbox='button:has-text("Check inbox")')
    pg.hover('button:has-text("Check inbox")'); shot(pg, 'empty_hover', inbox='button:has-text("Check inbox")')
    pg.click('button:has-text("Check inbox")'); pg.wait_for_load_state('networkidle')
    shot(pg, 'loaded', inbox='button:has-text("Check inbox")', strip='.summary-strip', queue='section.queue', row0008='a.queue-row:has-text("SHP-0008")', badge='.demo-badge')
    pg.goto(U+'/?view=review&draft=3&q=&state=pending'); pg.wait_for_load_state('networkidle')
    D = dict(badge='.demo-badge', strip='.summary-strip', queue='section.queue', row0008='a.queue-row.selected', evidence='.evidence-summary',
             comparison='.comparison', openpdf='a:has-text("Open PDF")', paper='.paper', message='.message', recipient='.recipient',
             actions='.decision-footer', approve='button:has-text("Approve draft")', reject='button:has-text("Reject")', pipeline='ol.pipeline',
             casehead='.case-heading', workspace='.workspace')
    shot(pg, 'case', **D)
    pg.hover('a:has-text("Open PDF")'); shot(pg, 'case_pdfhover', openpdf='a:has-text("Open PDF")')
    pg.hover('button:has-text("Approve draft")'); shot(pg, 'case_approvehover', approve='button:has-text("Approve draft")')
    pg.click('button:has-text("Approve draft")'); pg.wait_for_load_state('networkidle')
    shot(pg, 'approved', toast={'text':'Sending is a separate action'}, actions='.decision-footer', send='button:has-text("Send")', pipeline='ol.pipeline', message='.message')
    pg.mouse.move(1300, 700)
    pg.hover('button:has-text("Send")'); shot(pg, 'approved_sendhover', send='button:has-text("Send")')
    pg.click('button:has-text("Send")'); pg.wait_for_load_state('networkidle')
    shot(pg, 'sent', toast={'text':'No external email sent'}, actions='.decision-footer', recipient='.recipient', pipeline='ol.pipeline', strip='.summary-strip')
    pg.mouse.move(700, 450)
    pg.goto(U+'/?view=documents'); pg.wait_for_load_state('networkidle')
    pg.locator('tr:has-text("DOC-030")').first.scroll_into_view_if_needed()
    pg.evaluate("window.scrollTo(0, document.querySelector('tr:has(a[href*=\"DOC-030\"])') ? 0 : 0)")
    y = pg.evaluate("(()=>{const r=[...document.querySelectorAll('tr')].find(t=>t.innerText.includes('DOC-029'));return r.getBoundingClientRect().top+window.scrollY-300})()")
    pg.evaluate(f"window.scrollTo(0,{y})")
    shot(pg, 'docs', d037='tr:has-text("DOC-037")', d038='tr:has-text("DOC-038")', d030='tr:has-text("DOC-030")', d040='tr:has-text("DOC-040")')
    pg.goto(U+'/?view=outbox'); pg.wait_for_load_state('networkidle')
    shot(pg, 'outbox', entry={'text':'Simulated send'}, body={'text':'Please review these document gaps'})
    pg.goto(U+'/?view=audit'); pg.wait_for_load_state('networkidle')
    shot(pg, 'audit', r1='tbody tr >> nth=0', r2='tbody tr >> nth=1', chain={'text':'Hash chain verified'})
    b.close()
json.dump(boxes, open(f'{OUT}/boxes.json','w'), indent=1)
