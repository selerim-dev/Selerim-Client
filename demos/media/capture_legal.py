"""Capture legal concept states (full page) plus element boxes for promo_legal.py.

Run against a fresh local server:  python capture_legal.py OUT_DIR [SCALE]
"""
import json
import sys

from playwright.sync_api import sync_playwright

OUT = sys.argv[1]
SCALE = float(sys.argv[2]) if len(sys.argv) > 2 else 3
U = 'http://127.0.0.1:8094'
M1 = '/?view=review&matter=SYN-MAT-001&q='
boxes = {}


def rect(pg, sel):
    r = pg.locator(sel).first.bounding_box()
    return [round(r['x'], 1), round(r['y'], 1), round(r['x'] + r['width'], 1), round(r['y'] + r['height'], 1)]


def shot(pg, name, **sels):
    pg.evaluate('window.scrollTo(0, 0)')
    pg.wait_for_timeout(350)
    pg.screenshot(path=f'{OUT}/{name}.png', full_page=True)
    boxes[name] = {'_height': pg.evaluate('document.documentElement.scrollHeight')}
    for k, sel in sels.items():
        try:
            boxes[name][k] = rect(pg, sel)
        except Exception as e:
            print('miss', name, k, str(e)[:80])
    print(name, boxes[name], flush=True)


def go(pg, path):
    pg.goto(U + path)
    pg.wait_for_load_state('networkidle')


BRIEF = dict(strip='.summary-strip', index='a[href*="matter=SYN-MAT-001"]', brief='section.brief', summary='ol.summary',
             s1='ol.summary > li:nth-child(1)', s3='ol.summary > li:nth-child(3)', s6='ol.summary > li:nth-child(6)',
             cite3='a.citation[href*="line=7"]', cite6='a.citation[href*="LETTER"]', paper='.source-paper',
             highlight='.source-line.highlight', attest='label.attestation', approve='button:has-text("Approve intake summary")',
             inbox='button:has-text("Check intake inbox")', status='text=Awaiting review', heading='h1')

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome')
    pg = b.new_page(viewport={'width': 1440, 'height': 900}, device_scale_factor=SCALE)
    go(pg, M1)
    shot(pg, 'desk', **BRIEF)
    pg.hover('button:has-text("Check intake inbox")')
    shot(pg, 'desk_inboxhover', inbox='button:has-text("Check intake inbox")')
    go(pg, '/?view=review&matter=SYN-MAT-001&source=FORM&page=1&line=7&q=')
    shot(pg, 'cite_req', **BRIEF)
    go(pg, '/?view=review&matter=SYN-MAT-001&source=LETTER&page=1&line=5&q=')
    shot(pg, 'cite_letter', **BRIEF)
    go(pg, '/?view=incomplete')
    shot(pg, 'incomplete', strip='.summary-strip', index='a[href*="matter=SYN-MAT-003"]', issue='text=items to resolve',
         issue2='text=Contact email missing', route='button:has-text("Route to follow-up")', status='text=Needs information >> nth=-1',
         heading='h1', nav='a.navitem:has-text("Needs information")')
    pg.hover('button:has-text("Route to follow-up")')
    shot(pg, 'incomplete_routehover', route='button:has-text("Route to follow-up")')
    pg.click('button:has-text("Route to follow-up")')
    pg.wait_for_load_state('networkidle')
    shot(pg, 'routed', toast='text=Routed to the local follow-up queue', queued='text=Follow-up queue', issue='text=items to resolve')
    go(pg, M1)
    pg.check('label.attestation input')
    shot(pg, 'attested', attest='label.attestation', approve='button:has-text("Approve intake summary")')
    pg.hover('button:has-text("Approve intake summary")')
    shot(pg, 'attested_hover', approve='button:has-text("Approve intake summary")')
    pg.click('button:has-text("Approve intake summary")')
    pg.wait_for_load_state('networkidle')
    shot(pg, 'approved', file='button:has-text("File")', toast='text=Summary approved', status='text=Reviewed >> nth=0')
    pg.hover('button:has-text("File")')
    shot(pg, 'approved_filehover', file='button:has-text("File")')
    pg.click('button:has-text("File")')
    pg.wait_for_load_state('networkidle')
    shot(pg, 'filed_action', toast='text=filed locally', filedlocal='text=Filed locally >> nth=-1')
    go(pg, '/?view=filed')
    shot(pg, 'filed', heading='h1', nav='a.navitem:has-text("Filed")')
    go(pg, '/?view=activity')
    shot(pg, 'activity', title='text=Every decision leaves a trace', r_final='text=human finalized', r_appr='text=human approved',
         nav='a.navitem:has-text("Activity")')
    b.close()
json.dump(boxes, open(f'{OUT}/boxes.json', 'w'), indent=1)
