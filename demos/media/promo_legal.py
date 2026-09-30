"""Music-driven promo for the legal intake concept (no narration).

Same toolkit as promo_logistics.py, different language: ivory / ink-blue / olive,
serif-led type, tilted page scrolls, a split-screen source link and page-turn
transitions. Visuals are 3x full-page captures of the real local app
(capture_legal.py generated/lcap3 3). Music: "Party Pop" by AtlasAudio,
Pixabay Content License.

  python promo_legal.py --music path/to/atlasaudio-party-pop-606271.mp3 [--stills 3,10]
"""
import argparse
import json
import math
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from promo_logistics import (FF, FPS, H, HERE, OUT, W, Popups, Track, cam_lerp, clamp, font, in_out, logo,
                             out_back, out_cubic, paste_sprite, pointer_sprite, rise, sans, serif_i, shadowed, stamp,
                             text_line)

Image.MAX_IMAGE_PIXELS = None
CAP = HERE / 'generated' / 'lcap3'
BPM, FIRST_BEAT = 143.55, 0.906
BEAT = 60 / BPM
BAR = 4 * BEAT
CAPX = 3

IVORY = (244, 242, 236)
PAPER = (251, 249, 243)
INKBLUE = (36, 55, 70)
DEEP = (22, 35, 46)
OLIVE = (92, 107, 78)
OLIVE_LT = (176, 190, 150)
INK = (28, 30, 34)
MUTED = (104, 108, 112)


def serif(size):
    return font('InstrumentSerif.woff2', size)


def ivory_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    g = (xx / W * 0.35 + yy / H * 0.65)[..., None]
    return Image.fromarray((np.array([246, 244, 238]) * (1 - g) + np.array([236, 233, 223]) * g).astype(np.uint8))


def ink_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - W * 0.62) / (W * 0.6)) ** 2 + ((yy - H * 0.35) / (H * 0.7)) ** 2)
    base = np.array(DEEP, np.float32) + np.exp(-d ** 2 * 1.4)[..., None] * np.array([26, 36, 40], np.float32)
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))


def pill(text, dark=True, size=38, dot=OLIVE_LT):
    f = sans(size, 580)
    tw = ImageDraw.Draw(Image.new('L', (1, 1))).textlength(text, font=f)
    w, h = int(tw + size * 2.4), int(size * 2.05)
    im = Image.new('RGB', (w, h), INKBLUE if dark else PAPER)
    d = ImageDraw.Draw(im)
    r = size * 0.24
    d.ellipse((size * 0.8 - r, h / 2 - r, size * 0.8 + r, h / 2 + r), fill=dot if dark else OLIVE)
    d.text((size * 1.45, h / 2), text, font=f, fill=IVORY if dark else INK, anchor='lm')
    return shadowed(im, radius=h // 2, blur=26, alpha=90, pad=50)


def note(eyebrow, lines, width=780, italic_last=True):
    """Paper memo card: small caps eyebrow, serif lines, olive rule."""
    fe = sans(24, 620)
    h = 84 + 72 * len(lines) + 30
    im = Image.new('RGB', (width, h), PAPER)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, 8, h), fill=OLIVE)
    d.text((48, 48), eyebrow.upper(), font=fe, fill=OLIVE, anchor='lm')
    for i, line in enumerate(lines):
        f = serif_i(62) if italic_last and i == len(lines) - 1 and len(lines) > 1 else serif(62)
        d.text((46, 84 + i * 72), line, font=f, fill=OLIVE if f is not None and italic_last and i == len(lines) - 1 and len(lines) > 1 else INK)
    return shadowed(im, radius=6, blur=38, alpha=120, pad=80)


def project(center, w, h, ry=0.0, rx=0.0, rz=0.0, f=2600.0):
    ry, rx, rz = math.radians(ry), math.radians(rx), math.radians(rz)
    pts = []
    for px, py in ((-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)):
        x, y = px * math.cos(rz) - py * math.sin(rz), px * math.sin(rz) + py * math.cos(rz)
        z = 0.0
        y, z = y * math.cos(rx) - z * math.sin(rx), y * math.sin(rx) + z * math.cos(rx)
        x, z = x * math.cos(ry) + z * math.sin(ry), -x * math.sin(ry) + z * math.cos(ry)
        k = f / (f + z)
        pts.append((center[0] + x * k, center[1] + y * k))
    return pts


def warp(frame, img, quad, radius=24, shadow=True):
    sw, sh = img.size
    A, B = [], []
    for (x, y), (X, Y) in zip(quad, [(0, 0), (sw, 0), (sw, sh), (0, sh)]):
        A += [[x, y, 1, 0, 0, 0, -X * x, -X * y], [0, 0, 0, x, y, 1, -Y * x, -Y * y]]
        B += [X, Y]
    coeffs = np.linalg.solve(np.array(A), np.array(B))
    rgba = img.convert('RGBA')
    m = Image.new('L', img.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, sw - 1, sh - 1), radius, fill=255)
    rgba.putalpha(m)
    if shadow:
        s = Image.new('L', (W, H), 0)
        ImageDraw.Draw(s).polygon([(x, y + 44) for x, y in quad], fill=150)
        frame.paste((6, 12, 18), (0, 0), s.filter(ImageFilter.GaussianBlur(46)))
    frame.alpha_composite(rgba.transform((W, H), Image.PERSPECTIVE, tuple(coeffs), Image.BICUBIC))


class Page:
    def __init__(self):
        self.boxes = json.loads((CAP / 'boxes.json').read_text())
        self.cache = {}

    def height(self, state):
        return self.boxes[state]['_height']

    def level(self, state, lv):
        key = (state, lv)
        if key not in self.cache:
            full = Image.open(CAP / f'{state}.png').convert('RGB')
            self.cache[key] = full if lv == CAPX else full.resize((1440 * lv, round(full.height / CAPX * lv)), Image.LANCZOS)
        return self.cache[key]

    def box(self, state, key):
        return self.boxes[state][key]

    def union(self, boxes):
        b = np.array(boxes, float)
        return [b[:, 0].min(), b[:, 1].min(), b[:, 2].max(), b[:, 3].max()]

    def crop(self, state, box, scale):
        x0, y0, x1, y1 = [v * CAPX for v in box]
        im = self.level(state, CAPX).crop((round(x0), round(y0), round(x1), round(y1)))
        return im.resize((round((x1 - x0) / CAPX * scale), round((y1 - y0) / CAPX * scale)), Image.LANCZOS)

    @staticmethod
    def screen(cam, x, y):
        cx, cy, z = cam
        return W / 2 + (x - cx) * z, H / 2 + (y - cy) * z

    def draw_flat(self, frame, state, cam, ring=None):
        cx, cy, z = cam
        ph = self.height(state)
        x0, y0 = self.screen(cam, 0, 0)
        x1, y1 = self.screen(cam, 1440, ph)
        if x0 > -60 or x1 < W + 60:
            sh = Image.new('L', (W, H), 0)
            ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + 26 * z, x1, y1 + 26 * z), 14 * z, fill=140)
            frame.paste((6, 12, 18), (0, 0), sh.filter(ImageFilter.GaussianBlur(40)))
        vx0, vy0, vx1, vy1 = max(x0, 0), max(y0, 0), min(x1, W), min(y1, H)
        if vx1 <= vx0 or vy1 <= vy0:
            return
        lv = min(CAPX, max(1, math.ceil(z - 0.05)))
        src = self.level(state, lv)
        box = ((vx0 - x0) / z * lv, (vy0 - y0) / z * lv, (vx1 - x0) / z * lv, (vy1 - y0) / z * lv)
        ix0, iy0 = round(vx0), round(vy0)
        size = (round(vx1) - ix0, round(vy1) - iy0)
        img = src.resize(size, Image.BICUBIC, box=box, reducing_gap=2.0)
        mask = Image.new('L', (W, H), 0)
        ImageDraw.Draw(mask).rounded_rectangle((x0, y0, x1, y1), 14 * z, fill=255)
        frame.paste(img, (ix0, iy0), mask.crop((ix0, iy0, ix0 + size[0], iy0 + size[1])))
        if ring:
            b, a = ring
            r = [*self.screen(cam, b[0], b[1]), *self.screen(cam, b[2], b[3])]
            r = [r[0] - 10, r[1] - 10, r[2] + 10, r[3] + 10]
            shade = Image.new('L', (W, H), int(80 * a))
            ImageDraw.Draw(shade).rounded_rectangle(r, 12, fill=0)
            frame.paste(DEEP, (0, 0), Image.fromarray(np.minimum(np.array(shade), np.array(mask))))
            ImageDraw.Draw(frame).rounded_rectangle(r, 12, outline=OLIVE + (int(255 * a),), width=5)


class PageScene:
    def __init__(self, page, state, cam):
        self.page = page
        self.states = [(0.0, state)]
        self.cam = Track(cam, cam_lerp)
        self.cursor = None
        self.clicks, self.rings = [], []
        self.popups = Popups()

    def state_at(self, t):
        return [s for ts, s in self.states if ts <= t][-1]

    def move(self, t, xy, dur=0.5, hover=None):
        if self.cursor is None:
            self.cursor = Track(xy)
        else:
            self.cursor.to(t, xy, dur)
        if hover:
            self.states.append((t + dur, hover))
        return self

    def click(self, t, state):
        self.clicks.append(t)
        self.states.append((t + 0.08, state))
        return self

    def ring(self, t_in, t_out, box):
        self.rings.append((t_in, t_out, box))
        return self

    def render(self, t, bg):
        frame = bg.copy().convert('RGBA')
        cam = tuple(self.cam(t))
        ring = None
        for t_in, t_out, b in self.rings:
            if t_in <= t <= t_out + 0.2:
                ring = (b, clamp((t - t_in) / 0.2) * (1 - clamp((t - t_out) / 0.2)))
        self.page.draw_flat(frame, self.state_at(t), cam, ring)
        if self.cursor is not None:
            x, y = self.cursor(t)
            sx, sy = self.page.screen(cam, x, y)
            recent = [c for c in self.clicks if 0 <= t - c < 0.45]
            if recent:
                k = (t - recent[-1]) / 0.45
                r = 12 + 44 * out_cubic(k)
                ImageDraw.Draw(frame).ellipse((sx - r, sy - r, sx + r, sy + r), outline=OLIVE + (int(255 * (1 - k)),), width=6)
            sp, off = pointer_sprite(clamp(cam[2] * 0.75, 1.1, 2.2) * (0.86 if recent and t - recent[-1] < 0.12 else 1))
            frame.alpha_composite(sp, (round(sx - off), round(sy - off)))
        self.popups.draw(frame, t)
        return frame


def center_of(b, dy=0):
    return ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2 + dy)


def build(page):
    ivory, ink = ivory_bg(), ink_bg()
    scenes, captions = [], []

    def cap(t, dur, text):
        base = sum(d for d, _ in scenes[:-1])
        captions.append((base + t, base + t + dur, text))

    # A — hook: stacked papers + counting serif lines (3 bars)
    form_paper = page.crop('cite_req', page.box('cite_req', 'paper'), 0.95)
    letter_paper = page.crop('cite_letter', page.box('cite_letter', 'paper'), 0.95)
    card1 = page.crop('desk', page.box('desk', 'index'), 1.6)
    card3 = page.crop('incomplete', page.box('incomplete', 'index'), 1.6)
    papers = [(shadowed(letter_paper, 8, 34, 120, 70).rotate(-9, Image.BICUBIC, expand=True), (1390, 660)),
              (shadowed(form_paper, 8, 34, 120, 70).rotate(5, Image.BICUBIC, expand=True), (1480, 700)),
              (shadowed(card3, 6, 26, 110, 50).rotate(-4, Image.BICUBIC, expand=True), (1330, 1080)),
              (shadowed(card1, 6, 26, 110, 50).rotate(3, Image.BICUBIC, expand=True), (1560, 250))]

    def hook(t):
        f = ivory.copy().convert('RGBA')
        for i, (sp, (x, y)) in enumerate(papers):
            p = out_cubic((t - 0.15 - i * BEAT) / 0.55)
            paste_sprite(f, sp, x + (1 - p) * 420, y + (1 - p) * 40, 1, p)
        n = round(30 * out_cubic((t - 0.1) / (2 * BEAT)))
        p, dy = rise(t, 0.05)
        text_line(f, f'{n} new matters.', 150, 470 + dy, serif(150), INK, 'lm', p)
        p, dy = rise(t, BAR)
        m = round(86 * out_cubic((t - BAR) / (2 * BEAT)))
        text_line(f, f'{m} attachments.', 150, 640 + dy, serif(150), INK, 'lm', p)
        p, dy = rise(t, 2 * BAR)
        text_line(f, 'Who reads it all first?', 156, 820 + dy, serif_i(120), OLIVE, 'lm', p)
        return f
    scenes.append((3 * BAR, hook))
    cap(0.1, 3 * BAR - 0.2, '30 new matters. 86 attachments. Who reads it all first?')

    # B — title on ink-blue (2 bars)
    lg = logo(58)
    concept = pill('Concept build · Fictional data', True, 28)

    def title(t):
        f = ink.copy().convert('RGBA')
        p, dy = rise(t, 0)
        paste_sprite(f, lg, 160 + lg.width / 2, 330 + dy, 1, p)
        p, dy = rise(t, BEAT)
        text_line(f, 'The matter room.', 150, 540 + dy, serif(190), IVORY, 'lm', p)
        p, dy = rise(t, 2 * BEAT)
        text_line(f, 'Legal intake, organized. Every statement sourced.', 158, 700 + dy, sans(52, 440), (200, 208, 212), 'lm', p)
        p, dy = rise(t, 3 * BEAT)
        paste_sprite(f, concept, 158 + concept.width / 2 - 50, 840 + dy, 1, p)
        return f
    scenes.append((2 * BAR, title))
    cap(0, 2 * BAR, 'Selerim studio — The matter room. Legal intake, organized. Every statement sourced. Concept build, fictional data.')

    # C — tilted scroll down the real page, then land flat on the brief (4 bars)
    chips = Popups()
    chips.add(1.0, 3.2, pill('30 matters organized', False, 40), 520, 1110)
    chips.add(1.0 + BEAT, 3.2, pill('12 need information', False, 40, OLIVE), 1100, 1110)
    desk = page.level('desk', 2)
    land = (720, 1060, 1.02)

    def showcase(t):
        f = ink.copy().convert('RGBA')
        end = 3 * BAR
        if t < end:
            p = in_out(t / end)
            sy = 0 + 520 * p
            src = desk.crop((0, round(sy * 2), 2880, round((sy + 1000) * 2)))
            quad = project((W / 2, H / 2 + 40), 1440 * (0.82 + 0.2 * p), 1000 * (0.82 + 0.2 * p),
                           ry=-16 * (1 - p) - 6, rx=22 * (1 - p) + 6, rz=-4 * (1 - p))
            warp(f, src, quad, radius=20)
        else:
            k = out_cubic((t - end) / 0.6)
            page.draw_flat(f, 'desk', cam_lerp(np.array([720, 1020, 0.95]), np.array(land), k))
        chips.draw(f, t)
        return f
    scenes.append((4 * BAR, showcase))
    cap(0.9, 2.5, '30 matters organized. 12 need information.')

    # D — split screen: statement -> exact source line (5 bars)
    s3 = page.box('cite_req', 's3')
    s6 = page.box('cite_letter', 's6')
    papr = page.box('cite_req', 'paper')
    left_scale, right_scale = 1.3, 1.25
    left = {'req': page.crop('cite_req', s3, left_scale), 'let': page.crop('cite_letter', s6, left_scale)}
    right = {'plain': page.crop('desk', papr, right_scale), 'req': page.crop('cite_req', papr, right_scale),
             'let_plain': page.crop('cite_req', papr, right_scale),
             'let': page.crop('cite_letter', page.box('cite_letter', 'paper'), right_scale)}
    L = {k: shadowed(v, 10, 30, 110, 60) for k, v in left.items()}
    R = {k: shadowed(v, 10, 40, 140, 70) for k, v in right.items()}
    lx, ly, rx_, ry_ = 480, 520, 1370, 660

    def anchor_left(b, sub):
        # CSS box `sub` inside crop `b`, to screen coords of the left sprite centre
        ox = lx - left['req'].width / 2 + (sub[0] - b[0]) * left_scale
        oy = ly - left['req'].height / 2 + (sub[1] - b[1]) * left_scale
        return ox + (sub[2] - sub[0]) * left_scale / 2, oy + (sub[3] - sub[1]) * left_scale / 2

    lpap = page.box('cite_letter', 'paper')

    def anchor_right(sub, second=False):
        pb, img = (lpap, right['let']) if second else (papr, right['req'])
        ox = rx_ - img.width / 2 + (sub[0] - pb[0]) * right_scale
        oy = ry_ - img.height / 2 + (sub[1] - pb[1]) * right_scale
        return ox, oy + (sub[3] - sub[1]) * right_scale / 2

    note_a = note('Every claim, its source', ['Click a statement.', 'See the exact line.'], 700)
    chip_letter = pill('Engagement letter · page 1, line 5', True, 36)
    swap = 2.5 * BAR

    def split(t):
        f = ivory.copy().convert('RGBA')
        second = t >= swap
        lt = t - swap if second else t
        kL, kR = ('let', 'let') if second else ('req', 'req')
        pin = out_cubic(lt / 0.45)
        paste_sprite(f, L[kL], lx - (1 - pin) * 120, ly, 1, pin)
        lit = lt > 1.0
        plain = 'let_plain' if second else 'plain'
        a_lit = clamp((lt - 1.0) / 0.2) if lit else 0.0
        base_a = out_cubic(t / 0.5) if not second else 1.0
        if a_lit < 1:
            paste_sprite(f, R[plain], rx_ + (1 - out_cubic(t / 0.5)) * 160 if not second else rx_, ry_, 1, base_a * (1 - a_lit) if second else base_a)
        if lit:
            paste_sprite(f, R[kR], rx_, ry_, 1, a_lit)
            hb = page.box('cite_letter' if second else 'cite_req', 'highlight')
            cb = page.box('cite_letter' if second else 'cite_req', 'cite6' if second else 'cite3')
            a = anchor_left(s6 if second else s3, cb)
            b_ = anchor_right(hb, second)
            prog = out_cubic((lt - 1.0) / 0.5)
            d = ImageDraw.Draw(f)
            pts = []
            for i in range(41):
                u = i / 40 * prog
                x = (1 - u) ** 3 * a[0] + 3 * (1 - u) ** 2 * u * (a[0] + 260) + 3 * (1 - u) * u ** 2 * (b_[0] - 260) + u ** 3 * b_[0]
                y = (1 - u) ** 3 * a[1] + 3 * (1 - u) ** 2 * u * a[1] + 3 * (1 - u) * u ** 2 * b_[1] + u ** 3 * b_[1]
                pts.append((x, y))
            d.line(pts, fill=OLIVE + (255,), width=5, joint='curve')
            d.ellipse((a[0] - 9, a[1] - 9, a[0] + 9, a[1] + 9), fill=OLIVE)
            if prog >= 1:
                d.ellipse((b_[0] - 9, b_[1] - 9, b_[0] + 9, b_[1] + 9), fill=OLIVE)
        # cursor clicks the citation chip
        cb = page.box('cite_letter' if second else 'cite_req', 'cite6' if second else 'cite3')
        cx, cy = anchor_left(s6 if second else s3, cb)
        k = out_cubic((lt - 0.35) / 0.5)
        px, py = cx + 260 * (1 - k), cy + 180 * (1 - k)
        if 0.85 <= lt < 1.3:
            r = 12 + 40 * out_cubic((lt - 0.85) / 0.45)
            ImageDraw.Draw(f).ellipse((px - r, py - r, px + r, py + r), outline=OLIVE + (int(255 * (1 - (lt - 0.85) / 0.45)),), width=6)
        sp, off = pointer_sprite(1.7)
        f.alpha_composite(sp, (round(px - off), round(py - off)))
        if not second:
            p = out_back((t - 1.6) / 0.42)
            if t > 1.6:
                a2 = clamp((t - 1.6) * 2.5) * (1 - clamp((t - swap + 0.25) / 0.25))
                paste_sprite(f, note_a, 480, 1000, 0.7 + 0.3 * p, a2)
        else:
            p = out_back((lt - 1.4) / 0.42)
            if lt > 1.4:
                paste_sprite(f, chip_letter, 480, 880, 0.7 + 0.3 * p, clamp((lt - 1.4) * 2.5))
        return f
    scenes.append((5 * BAR, split))
    cap(0.5, swap - 0.6, 'Every claim, its source: click a statement, see the exact line.')
    cap(swap + 1.2, 5 * BAR - swap - 1.2, 'The engagement letter statement links to page 1, line 5.')

    # E — needs information: flag, then route (4 bars)
    iss = page.union([page.box('incomplete', 'issue'), page.box('incomplete', 'issue2')])
    iss = [iss[0] - 44, iss[1] - 24, 730, iss[3] + 20]
    route = page.box('incomplete', 'route')
    e = PageScene(page, 'incomplete', (*center_of(page.union([iss, route]), 10), 1.75))
    e.ring(0.25, 2.2, iss)
    e.popups.add(0.4, 2.3, note('Needs information', ['Contact email missing.', 'Flagged, not guessed.'], 740), 1330, 560)
    e.move(0, (900, 1700)).move(1.9, center_of(route, 2), 0.5, 'incomplete_routehover').click(2.7, 'routed')
    toast = page.box('routed', 'toast')
    e.cam.to(3.05, (*center_of(toast, 70), 2.2), 0.55)
    e.ring(3.6, 4 * BAR, toast)
    e.popups.add(3.75, 4 * BAR, pill('Routed for follow-up · no email sent', True, 38), 960, 1080)
    scenes.append((4 * BAR, lambda t, s=e: s.render(t, ivory)))
    cap(0.4, 2.2, 'Needs information: contact email missing. Flagged, not guessed.')
    cap(3.7, 4 * BAR - 3.7, 'Routed to the local follow-up queue. No email sent.')

    # F — the review gate: attest, approve, file (6 bars)
    att = page.box('attested', 'attest')
    appr = page.box('attested', 'approve')
    gate = page.union([att, appr])
    g = PageScene(page, 'desk', (*center_of(gate, -10), 2.35))
    g.popups.add(0.2, 1.6, pill('A person reviews first', True, 40), 960, 330)
    g.move(0, (560, 1500)).move(0.45, (att[0] + 8, att[1] + 9), 0.5).click(1.1, 'attested')
    g.move(1.5, center_of(appr, 2), 0.45, 'attested_hover').click(2.3, 'approved')
    t_toast = page.box('approved', 'toast')
    g.cam.to(2.6, (*center_of(t_toast, 60), 2.1), 0.5)
    g.ring(3.1, 4.6, t_toast)
    g.popups.add(3.2, 4.6, pill('Approved · filing is a separate step', True, 40), 960, 1020)
    fbtn = page.box('approved', 'file')
    g.cam.to(4.7, (*center_of(fbtn, -30), 2.35), 0.5)
    g.move(4.8, center_of(fbtn, 2), 0.5, 'approved_filehover').click(5.7, 'filed_action')
    g.cam.to(6.1, (430, 1250, 1.08), 0.6)
    g.ring(6.8, 6 * BAR, page.box('filed_action', 'filedlocal'))
    g.popups.add(6.9, 6 * BAR, note('Filed locally', ['Not client acceptance.', 'Nothing sent.'], 700), 1330, 700)
    scenes.append((6 * BAR, lambda t, s=g: s.render(t, ivory)))
    cap(0.2, 1.4, 'A person reviews first.')
    cap(3.1, 1.5, 'Approved — filing is a separate step.')
    cap(6.8, 6 * BAR - 6.8, 'Filed locally. Not client acceptance. Nothing sent.')

    # G — activity log on a tilted pan (3 bars)
    act = page.level('activity', 2)
    memo = note('Activity log', ['Every decision', 'leaves a trace.'], 640)

    def activity(t):
        f = ink.copy().convert('RGBA')
        p = in_out(t / (3 * BAR))
        sy = 330 + 260 * p
        src = act.crop((0, round(sy * 2), 2880, round((sy + 900) * 2)))
        quad = project((W / 2 + 180, H / 2 + 30), 1440 * 1.05, 900 * 1.05, ry=18 - 8 * p, rx=-8 + 4 * p, rz=2)
        warp(f, src, quad, radius=20)
        pp = out_back((t - 0.5) / 0.42)
        if t > 0.5:
            paste_sprite(f, memo, 470, 930, 0.7 + 0.3 * pp, clamp((t - 0.5) * 2.5))
        return f
    scenes.append((3 * BAR, activity))
    cap(0.5, 3 * BAR - 0.6, 'Activity log: every decision leaves a trace.')

    # H — measured results (4 bars)
    stats = [(18, 18, 'documents classified'), (100, 100, 'fields extracted'), (58, 58, 'source-linked statements'),
             (12, 12, 'incomplete matters routed')]

    def results(t):
        f = ink.copy().convert('RGBA')
        p, dy = rise(t, 0)
        text_line(f, 'HELD-OUT FICTIONAL MATTERS', 170, 200 + dy, sans(28, 620), OLIVE_LT, 'lm', p)
        for i, (n, of, label) in enumerate(stats):
            t_i = 0.3 + i * 2 * BEAT
            p, dy = rise(t, t_i)
            if p <= 0:
                continue
            v = round(n * out_cubic((t - t_i) / 0.7))
            y = 360 + i * 175 + dy
            text_line(f, f'{v}/{of}', 170, y, serif(170), IVORY, 'lm', p)
            text_line(f, label, 700, y + 10, sans(54, 440), (190, 200, 205), 'lm', p)
        p, dy = rise(t, 0.3 + 8 * BEAT)
        text_line(f, '12/12 from the full fixture. Deterministic text-PDF results — not legal or model accuracy.', 174, 1135 + dy,
                  serif_i(40), (170, 182, 188), 'lm', p)
        return f
    scenes.append((4 * BAR, results))
    cap(0.3, 4 * BAR - 0.4, 'On held-out fictional matters: 18/18 documents classified, 100/100 fields extracted, 58/58 source-linked statements; 12/12 incomplete matters routed in the full fixture.')

    # I — end card (4 bars)
    lg_dark = logo(54, dark=False)
    cta = Image.new('RGB', (780, 108), INKBLUE)
    ImageDraw.Draw(cta).text((390, 54), 'Get an AI opportunity audit', font=sans(44, 600), fill=IVORY, anchor='mm')
    cta = shadowed(cta, radius=54, blur=30, alpha=90, pad=60)

    def end(t):
        f = ivory.copy().convert('RGBA')
        p, dy = rise(t, 0)
        text_line(f, 'A little order.', 150, 420 + dy, serif(170), INK, 'lm', p)
        p, dy = rise(t, BEAT)
        text_line(f, 'A clearer perspective.', 150, 590 + dy, serif_i(170), OLIVE, 'lm', p)
        p, dy = rise(t, 2 * BEAT)
        text_line(f, 'Start with a two-week audit of one workflow.', 160, 770 + dy, sans(54, 460), INK, 'lm', p)
        p = out_back((t - 3 * BEAT) / 0.45)
        paste_sprite(f, cta, 160 + 390, 905, 0.7 + 0.3 * p, clamp((t - 3 * BEAT) / 0.2))
        p, dy = rise(t, 4 * BEAT)
        paste_sprite(f, lg_dark, 160 + lg_dark.width / 2, 1100 + dy, 1, p)
        text_line(f, 'selerim.com', W - 170, 1110 + dy, sans(40, 520), MUTED, 'rm', p)
        return f
    scenes.append((4 * BAR, end))
    cap(0, 4 * BAR, 'A little order. A clearer perspective. Start with a two-week audit of one workflow — get an AI opportunity audit at selerim.com.')
    return scenes, captions


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--music', required=True)
    ap.add_argument('--stills')
    args = ap.parse_args()
    page = Page()
    scenes, captions = build(page)
    starts = np.cumsum([0] + [d for d, _ in scenes])
    total = float(starts[-1])
    XF = 0.34

    def compose(t):
        i = min(int(np.searchsorted(starts, t, side='right')) - 1, len(scenes) - 1)
        local = t - starts[i]
        frame = scenes[i][1](local).convert('RGB')
        if i > 0 and local < XF:  # page turn: the next scene pushes up from below
            p = in_out(local / XF)
            prev = scenes[i - 1][1](scenes[i - 1][0] - 1e-3).convert('RGB')
            canvas = Image.new('RGB', (W, H))
            off = round(H * p)
            canvas.paste(prev, (0, -round(off * 0.35)))
            shade = Image.new('L', (W, H), int(90 * p))
            canvas.paste((0, 0, 0), (0, 0), shade)
            canvas.paste(frame, (0, H - off))
            frame = canvas
        return frame

    if args.stills:
        outdir = HERE / 'generated' / 'legal-stills'
        outdir.mkdir(parents=True, exist_ok=True)
        for t in [float(x) for x in args.stills.split(',')]:
            compose(t).save(outdir / f'{t:05.1f}.png')
        print('total', round(total, 1))
        return

    tmp = Path(tempfile.mkdtemp())
    music = tmp / 'music.wav'
    subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', str(FIRST_BEAT), '-t', f'{total:.3f}', '-i', args.music,
                    '-af', f'afade=t=in:st=0:d=0.2,afade=t=out:st={total - 2.6:.3f}:d=2.6,volume=0.45,alimiter=limit=0.89',
                    '-ar', '48000', '-ac', '2', str(music)], check=True)
    mp4 = OUT / 'legal-walkthrough.mp4'
    enc = subprocess.Popen([FF, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                            '-r', str(FPS), '-i', '-', '-i', str(music), '-c:v', 'libx264', '-preset', 'slow', '-crf', '22',
                            '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart',
                            str(mp4)], stdin=subprocess.PIPE)
    frames = math.ceil(total * FPS)
    for n in range(frames):
        enc.stdin.write(compose(n / FPS).tobytes())
        if n % (FPS * 5) == 0:
            print(f'frame {n}/{frames}', flush=True)
    enc.stdin.close()
    assert enc.wait() == 0

    vtt = ['WEBVTT', '', f'{stamp(0)} --> {stamp(2.0)}', '[Upbeat instrumental music]', '']
    for a, b, text in captions:
        vtt += [f'{stamp(a)} --> {stamp(b)}', text, '']
    (OUT / 'legal-captions.vtt').write_text('\n'.join(vtt))
    lines = ['# Legal concept walkthrough', '',
             'Music-only product tour of the local concept application (no narration). Fictional data; deterministic baseline.',
             'Music: "Party Pop" by AtlasAudio (Pixabay Content License).', '', '## On-screen text', '']
    lines += [f'- {stamp(a)[3:8]} — {text}' for a, b, text in captions]
    (OUT / 'legal-transcript.txt').write_text('\n'.join(lines) + '\n')
    poster = compose(starts[3] + 1.3)
    poster.resize((1200, 800), Image.LANCZOS).save(OUT / 'legal-poster.jpg', quality=88)
    poster.resize((1200, 800), Image.LANCZOS).save(OUT / 'legal-poster.webp', quality=82)
    print(f'legal promo {total:.1f}s')


if __name__ == '__main__':
    main()
