"""Music-driven product promo for the logistics concept (no narration).

Visuals come from 3x captures of the real local app (capture_logistics.py ...
generated/cap3 3). Scenes are cut on the bar grid of the music track; text
popups carry the story. Music: "Upbeat" by Sub_Clair, Pixabay Content License.

  python promo_logistics.py --music path/to/sub_clair-upbeat-571898.mp3 [--stills 3,10,20]
"""
import argparse
import json
import math
import subprocess
import tempfile
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
CAP = HERE / 'generated' / 'cap3'
OUT = ROOT / 'agency-website/public/demos'
FF = imageio_ffmpeg.get_ffmpeg_exe()

W, H, FPS = 1920, 1280, 30
BPM, FIRST_BEAT = 117.5, 1.81           # track tempo and first detected beat (s)
BEAT = 60 / BPM
BAR = 4 * BEAT
CAPX = 3                                 # capture device scale factor

ACCENT = (111, 84, 152)
LILAC = (190, 170, 232)
INK = (29, 26, 36)
WHITE = (255, 255, 255)
MUTED_DARK = (170, 162, 190)
LIGHT_BG = (246, 245, 248)


# ---------- helpers ----------

def clamp(x, a=0.0, b=1.0):
    return min(max(x, a), b)


def in_out(t):
    t = clamp(t)
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def out_cubic(t):
    return 1 - (1 - clamp(t)) ** 3


def out_back(t, s=1.6):
    t = clamp(t) - 1
    return 1 + (s + 1) * t ** 3 + s * t ** 2


def font(name, size, weight=None):
    f = ImageFont.truetype(str(HERE / 'fonts' / name), size)
    if weight:
        f.set_variation_by_axes([weight])
    return f


def sans(size, weight=560):
    return font('InterTight.woff2', size, weight)


def serif_i(size):
    return font('InstrumentSerif-Italic.woff2', size)


def dark_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    base = np.array([16, 13, 24], np.float32) * (1 - yy[..., None] / H * 0.3) + np.array([30, 22, 46], np.float32) * (yy[..., None] / H * 0.3)
    d = np.sqrt(((xx - W * 0.5) / (W * 0.55)) ** 2 + ((yy - H * 0.55) / (H * 0.6)) ** 2)
    glow = np.exp(-d ** 2 * 1.6)[..., None] * np.array([70, 48, 110], np.float32)
    return Image.fromarray(np.clip(base + glow, 0, 255).astype(np.uint8))


def light_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    g = (xx / W * 0.4 + yy / H * 0.6)[..., None]
    return Image.fromarray((np.array([236, 231, 246]) * (1 - g) + np.array([250, 249, 252]) * g).astype(np.uint8))


def shadowed(img, radius=22, blur=34, alpha=120, pad=70, glow=None):
    """RGBA sprite: rounded image with soft drop shadow (and optional colour glow)."""
    w, h = img.size
    pad = max(pad, int(blur * 2.6 + blur // 3 + 8))  # keep the whole blur tail inside the sprite
    out = Image.new('RGBA', (w + 2 * pad, h + 2 * pad), (0, 0, 0, 0))
    sh = Image.new('L', out.size, 0)
    ImageDraw.Draw(sh).rounded_rectangle((pad, pad + blur // 3, pad + w, pad + h + blur // 3), radius, fill=alpha)
    out.paste(glow or (0, 0, 0), (0, 0), sh.filter(ImageFilter.GaussianBlur(blur)))
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), radius, fill=255)
    out.paste(img.convert('RGB'), (pad, pad), mask)
    return out


def paste_sprite(frame, sprite, cx, cy, scale=1.0, alpha=1.0):
    if alpha <= 0.001 or scale <= 0.01:
        return
    sp = sprite
    if abs(scale - 1) > 1e-3:
        sp = sprite.resize((max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale))), Image.BICUBIC)
    if alpha < 0.999:
        a = sp.getchannel('A').point(lambda v: int(v * alpha))
        sp = sp.copy()
        sp.putalpha(a)
    frame.alpha_composite(sp, (round(cx - sp.width / 2), round(cy - sp.height / 2)))


# ---------- sprites ----------

def chip(text, dot=ACCENT, size=36):
    f = sans(size, 600)
    tw = ImageDraw.Draw(Image.new('L', (1, 1))).textlength(text, font=f)
    w, h = int(tw + size * 2.4), int(size * 2.1)
    im = Image.new('RGB', (w, h), WHITE)
    d = ImageDraw.Draw(im)
    r = size * 0.26
    d.ellipse((size * 0.8 - r, h / 2 - r, size * 0.8 + r, h / 2 + r), fill=dot)
    d.text((size * 1.45, h / 2), text, font=f, fill=INK, anchor='lm')
    return shadowed(im, radius=h // 2, blur=26, alpha=110, pad=50)


def card(eyebrow, lines, width=760, accent_line=None):
    fe, fl = sans(26, 640), sans(52, 600)
    h = 76 + 70 * len(lines) + 34
    im = Image.new('RGB', (width, h), WHITE)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((44, 44, 56, 56), 3, fill=ACCENT)
    d.text((72, 50), eyebrow.upper(), font=fe, fill=ACCENT, anchor='lm')
    for i, line in enumerate(lines):
        d.text((44, 92 + i * 70), line, font=fl, fill=ACCENT if i == accent_line else INK)
    return shadowed(im, radius=26, blur=40, alpha=130, pad=80)


def float_crop(shot, box, scale=1.0, rot=0.0):
    x0, y0, x1, y1 = [v * CAPX for v in box]
    im = shot.crop((round(x0), round(y0), round(x1), round(y1)))
    im = im.resize((round(im.width / CAPX * scale), round(im.height / CAPX * scale)), Image.LANCZOS)
    sp = shadowed(im, radius=18, blur=30, alpha=150, pad=60)
    return sp.rotate(rot, resample=Image.BICUBIC, expand=True) if rot else sp


def logo(size=64, dark=True):
    fg = WHITE if dark else INK
    fw, fs = sans(size, 640), serif_i(int(size * 1.05))
    d0 = ImageDraw.Draw(Image.new('L', (1, 1)))
    w1, w2 = d0.textlength('selerim', font=fw), d0.textlength('studio', font=fs)
    bw = size * 0.16
    im = Image.new('RGBA', (int(size * 0.9 + w1 + w2 + 10), int(size * 1.5)), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    base = size * 1.18
    for i, hgt in enumerate((0.55, 0.95, 0.72)):
        x = i * bw * 1.7
        d.rounded_rectangle((x, base - size * hgt, x + bw, base), bw / 2, fill=ACCENT if i != 1 else LILAC)
    d.text((size * 0.78, base), 'selerim', font=fw, fill=fg, anchor='ls')
    d.text((size * 0.78 + w1 + 4, base), 'studio', font=fs, fill=fg, anchor='ls')
    return im


def pointer_sprite(scale):
    s = scale * 2
    w, h = int(34 * s), int(44 * s)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pts = [(0, 0), (0, 25), (6.5, 19.5), (11, 29.5), (15.5, 27.5), (11.2, 18), (19, 18)]
    o = 3 * s
    d.polygon([(o + x * s + 1.5 * s, o + y * s + 2.2 * s) for x, y in pts], fill=(0, 0, 0, 90))
    d.polygon([(o + x * s, o + y * s) for x, y in pts], fill=WHITE + (255,), outline=(18, 18, 22, 255), width=max(1, round(1.5 * s)))
    return im.resize((w // 2, h // 2), Image.LANCZOS), o / 2


# ---------- app window renderer ----------

class App:
    def __init__(self):
        self.boxes = json.loads((CAP / 'boxes.json').read_text())
        self.levels = {}
        self.nav = {'outbox_nav': [16, 352, 211, 392], 'audit_nav': [16, 396, 211, 436]}

    def level(self, state, lv):
        key = (state, lv)
        if key not in self.levels:
            full = Image.open(CAP / f'{state}.png').convert('RGB')
            self.levels[key] = full if lv == CAPX else full.resize((1440 * lv, 900 * lv), Image.LANCZOS)
        return self.levels[key]

    def box(self, key, state=None):
        if key in self.nav:
            return self.nav[key]
        if state and key in self.boxes.get(state, {}):
            return self.boxes[state][key]
        return next(v[key] for v in self.boxes.values() if key in v)

    def union(self, keys, state=None):
        b = np.array([self.box(k, state) for k in keys], float)
        return [b[:, 0].min(), b[:, 1].min(), b[:, 2].max(), b[:, 3].max()]

    @staticmethod
    def screen(cam, x, y):
        cx, cy, z = cam
        return W / 2 + (x - cx) * z, H / 2 + (y - cy) * z

    def draw_flat(self, frame, state, cam, dim=None):
        """Window at camera (cx, cy, z): CSS point (cx, cy) lands mid-frame, z px per CSS px."""
        cx, cy, z = cam
        x0, y0 = self.screen(cam, 0, 0)
        x1, y1 = self.screen(cam, 1440, 900)
        # shadow + glow (only visible when the window edge is on screen)
        if x0 > -80 or y0 > -80 or x1 < W + 80 or y1 < H + 80:
            sh = Image.new('L', (W, H), 0)
            ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + 30 * z, x1, y1 + 30 * z), 18 * z, fill=150)
            frame.paste((8, 4, 16), (0, 0), sh.filter(ImageFilter.GaussianBlur(40)))
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
        if dim:
            box_s, a = dim
            r = [*self.screen(cam, box_s[0], box_s[1]), *self.screen(cam, box_s[2], box_s[3])]
            r = [r[0] - 10, r[1] - 10, r[2] + 10, r[3] + 10]
            shade = Image.new('L', (W, H), int(90 * a))
            ImageDraw.Draw(shade).rounded_rectangle(r, 16, fill=0)
            vis = Image.new('L', (W, H), 0)
            vis.paste(mask)
            frame.paste((12, 8, 20), (0, 0), Image.fromarray(np.minimum(np.array(shade), np.array(vis))))
            d = ImageDraw.Draw(frame)
            d.rounded_rectangle(r, 16, outline=LILAC + (int(255 * a),), width=5)

    def draw_tilt(self, frame, state, center, scale, rot_y, rot_x):
        src = self.level(state, 2)
        w, h = 1440 * scale, 900 * scale
        f = 2600.0
        ry, rx = math.radians(rot_y), math.radians(rot_x)
        pts = []
        for px, py in ((-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)):
            x, y, zz = px, py, 0.0
            y, zz = y * math.cos(rx) - zz * math.sin(rx), y * math.sin(rx) + zz * math.cos(rx)
            x, zz = x * math.cos(ry) + zz * math.sin(ry), -x * math.sin(ry) + zz * math.cos(ry)
            k = f / (f + zz)
            pts.append((center[0] + x * k, center[1] + y * k))
        sw, shh = src.size
        A, B = [], []
        for (x, y), (X, Y) in zip(pts, [(0, 0), (sw, 0), (sw, shh), (0, shh)]):
            A += [[x, y, 1, 0, 0, 0, -X * x, -X * y], [0, 0, 0, x, y, 1, -Y * x, -Y * y]]
            B += [X, Y]
        coeffs = np.linalg.solve(np.array(A), np.array(B))
        rgba = src.convert('RGBA')
        m = Image.new('L', src.size, 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, sw - 1, shh - 1), 28, fill=255)
        rgba.putalpha(m)
        warped = rgba.transform((W, H), Image.PERSPECTIVE, tuple(coeffs), Image.BICUBIC)
        glow = Image.new('L', (W, H), 0)
        ImageDraw.Draw(glow).polygon([(x, y + 40) for x, y in pts], fill=170)
        frame.paste((10, 5, 18), (0, 0), glow.filter(ImageFilter.GaussianBlur(50)))
        frame.alpha_composite(warped)


# ---------- keyframe tracks ----------

class Track:
    """Piecewise eased moves: [(t, value, duration)]; holds between moves (no drift)."""

    def __init__(self, first, lerp=None):
        self.keys = [(-1e9, np.array(first, float), 0.0)]
        self.lerp = lerp or (lambda a, b, p: a + (b - a) * p)

    def to(self, t, value, dur=0.6):
        self.keys.append((t, np.array(value, float), dur))
        return self

    def __call__(self, t):
        cur = self.keys[0][1]
        for tk, v, dur in self.keys[1:]:
            if t < tk:
                break
            p = in_out((t - tk) / dur) if dur else 1.0
            cur = self.lerp(cur, v, p) if p < 1 else v
            if p < 1:
                return cur
        return cur


def cam_lerp(a, b, p):
    z = math.exp(math.log(a[2]) + (math.log(b[2]) - math.log(a[2])) * p)
    return np.array([a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, z])


# ---------- scenes ----------

class Popups:
    def __init__(self):
        self.items = []

    def add(self, t_in, t_out, sprite, x, y):
        self.items.append((t_in, t_out, sprite, x, y))
        return self

    def draw(self, frame, t):
        for t_in, t_out, sp, x, y in self.items:
            if t < t_in or t > t_out + 0.25:
                continue
            p_in = (t - t_in) / 0.42
            s = out_back(p_in) if p_in < 1 else 1.0
            a = clamp(p_in * 2.5)
            if t > t_out:
                q = (t - t_out) / 0.25
                s, a = 1 - 0.06 * q, 1 - q
            paste_sprite(frame, sp, x, y + (1 - clamp(p_in)) * 30, 0.7 + 0.3 * s if p_in < 1 else s, a)


class AppScene:
    def __init__(self, app, dur, state, cam):
        self.app, self.dur = app, dur
        self.states = [(0.0, state)]
        self.cam = Track(cam, cam_lerp)
        self.cursor = None
        self.clicks = []
        self.highlights = []
        self.popups = Popups()
        self.tilt = None

    def state_at(self, t):
        return [s for ts, s in self.states if ts <= t][-1]

    def to_state(self, t, state):
        self.states.append((t, state))
        return self

    def move(self, t, key_or_xy, dur=0.55, state=None):
        xy = key_or_xy
        if isinstance(key_or_xy, str):
            b = self.app.box(key_or_xy, state)
            xy = ((b[0] + b[2]) / 2, (b[1] + b[3]) / 2 + 3)
        if self.cursor is None:
            self.cursor = Track(xy)
        else:
            self.cursor.to(t, xy, dur)
        return self

    def click(self, t, new_state):
        self.clicks.append(t)
        return self.to_state(t + 0.08, new_state)

    def highlight(self, t_in, t_out, keys, state=None):
        self.highlights.append((t_in, t_out, self.app.union(keys, state)))
        return self

    def render(self, t, bg):
        frame = bg.copy().convert('RGBA')
        state = self.state_at(t)
        if self.tilt and t < self.tilt['end']:
            p = out_cubic(t / self.tilt['end'])
            k = self.tilt
            flat = self.cam(self.tilt['end'])
            # start tilted/small, land exactly where the flat camera places the window
            cx, cy = W / 2 + (720 - flat[0]) * flat[2], H / 2 + (450 - flat[1]) * flat[2]
            center = (cx, cy + (1 - p) * 240)
            self.app.draw_tilt(frame, state, center, flat[2] * (k['scale'] + (1 - k['scale']) * p),
                               k['ry'] * (1 - p), k['rx'] * (1 - p))
            if p > 0.97:
                frame = bg.copy().convert('RGBA')
                self.app.draw_flat(frame, state, flat)
            return frame
        cam = tuple(self.cam(t))
        dim = None
        for t_in, t_out, box in self.highlights:
            if t_in <= t <= t_out + 0.2:
                a = clamp((t - t_in) / 0.2) * (1 - clamp((t - t_out) / 0.2))
                dim = (box, a)
        self.app.draw_flat(frame, state, cam, dim)
        if self.cursor is not None:
            x, y = self.cursor(t)
            sx, sy = self.app.screen(cam, x, y)
            recent = [c for c in self.clicks if 0 <= t - c < 0.5]
            if recent:
                k = (t - recent[-1]) / 0.5
                d = ImageDraw.Draw(frame)
                r = 12 + 46 * out_cubic(k)
                d.ellipse((sx - r, sy - r, sx + r, sy + r), outline=LILAC + (int(255 * (1 - k)),), width=6)
            pressed = recent and t - recent[-1] < 0.12
            sp, off = pointer_sprite(clamp(cam[2] * 0.75, 1.1, 2.2) * (0.86 if pressed else 1))
            frame.alpha_composite(sp, (round(sx - off), round(sy - off)))
        self.popups.draw(frame, t)
        return frame


def text_line(frame, text, x, y, f, fill, anchor='mm', alpha=1.0):
    if alpha <= 0:
        return
    layer = Image.new('RGBA', frame.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((x, y), text, font=f, fill=fill + (int(255 * alpha),), anchor=anchor)
    frame.alpha_composite(layer)


def rise(t, t0, d=0.45):
    p = out_cubic((t - t0) / d)
    return p, (1 - p) * 36


# ---------- build ----------

def build(app):
    dark, light = dark_bg(), light_bg()
    scenes, captions = [], []

    def cap(t, dur, text):  # t is local to the most recently added scene
        base = sum(d for d, _ in scenes[:-1])
        captions.append((base + t, base + t + dur, text))

    # A — hook: typed question over floating UI cards (2 bars)
    loaded, case = app.level('loaded', CAPX), app.level('case', CAPX)
    floats = [
        (float_crop(loaded, app.box('row0008', 'loaded'), 1.5, 6), (330, 250), (360, 280)),
        (float_crop(case, [528, 518, 1056, 631], 1.25, -4), (1520, 230), (1490, 250)),
        (float_crop(case, [1094, 544, 1397, 760], 1.1, 5), (1600, 980), (1570, 960)),
        (float_crop(case, [529, 671, 1055, 880], 0.9, -7), (320, 1010), (345, 990)),
    ]
    q1, q2 = 'Still matching shipping paperwork', 'to shipments by hand?'
    big = sans(92, 640)

    def hook(t):
        f = dark.copy().convert('RGBA')
        for i, (sp, a, b) in enumerate(floats):
            p = out_cubic((t - 0.1 - i * 0.12) / 0.8)
            drift = t / (2 * BAR)
            x, y = a[0] + (b[0] - a[0]) * drift, a[1] + (b[1] - a[1]) * drift
            paste_sprite(f, sp, x, y + (1 - p) * 60, 0.9 + 0.1 * p, p * 0.92)
        n = int(clamp((t - 0.25) / 2.3) * (len(q1) + len(q2)))
        l1, l2 = q1[:n], q2[:max(0, n - len(q1))]
        text_line(f, l1, 190, 560, big, WHITE, 'lm')
        text_line(f, l2, 190, 680, big, LILAC, 'lm')
        caret_on = (t // (BEAT / 2)) % 2 == 0 or n < len(q1) + len(q2)
        if caret_on:
            d0 = ImageDraw.Draw(Image.new('L', (1, 1)))
            line_y, txt = (560, l1) if n <= len(q1) else (680, l2)
            cx = 190 + d0.textlength(txt, font=big) + 8
            ImageDraw.Draw(f).rectangle((cx, line_y - 50, cx + 7, line_y + 50), fill=LILAC)
        return f
    scenes.append((2 * BAR, hook))
    cap(0.3, 2 * BAR - 0.4, 'Still matching shipping paperwork to shipments by hand?')

    # B — title reveal (2 bars)
    lg = logo(62)
    chip_concept = chip('Concept build · Fictional data', LILAC, 28)

    def title(t):
        f = dark.copy().convert('RGBA')
        p, dy = rise(t, 0.0)
        paste_sprite(f, lg, 190 + lg.width / 2, 330 + dy, 1, p)
        p, dy = rise(t, BEAT)
        text_line(f, 'Shipment document agent', 184, 520 + dy, sans(128, 640), WHITE, 'lm', p)
        p, dy = rise(t, 2 * BEAT)
        text_line(f, 'Paperwork matched. A person stays in charge.', 190, 650 + dy, serif_i(66), MUTED_DARK, 'lm', p)
        p, dy = rise(t, 3 * BEAT)
        paste_sprite(f, chip_concept, 190 + chip_concept.width / 2 - 50, 800 + dy, 1, p)
        return f
    scenes.append((2 * BAR, title))
    cap(0, 2 * BAR, 'Selerim studio — Shipment document agent. Paperwork matched. A person stays in charge. Concept build, fictional data.')

    # C — inbox: window swoops in, click Check inbox, counts pop (3 bars)
    full = (720, 450, 1.12)
    c = AppScene(app, 3 * BAR, 'empty', full)
    c.tilt = dict(end=1.1, scale=0.62, ry=24, rx=12)
    c.move(0, (1300, 700)).move(1.3, 'inbox', 0.6).to_state(1.95, 'empty_hover').click(2.3, 'loaded')
    strip = app.box('strip', 'loaded')
    c.cam.to(2.55, ((strip[0] + strip[2]) / 2 - 60, 330, 1.5), 0.7)
    c.highlight(3.2, 3 * BAR, ['strip'], 'loaded')
    c.popups.add(3.3, 3 * BAR, chip('40 documents read', ACCENT, 44), 700, 1130)
    c.popups.add(3.3 + BEAT, 3 * BAR, chip('38 exceptions flagged', (214, 158, 46), 44), 1240, 1130)
    scenes.append((3 * BAR, lambda t, s=c: s.render(t, dark)))
    cap(2.3, 3 * BAR - 2.3, 'Check inbox: 40 documents read, 38 exceptions flagged.')

    # D — the mismatch, then the source link (3 bars)
    comp = app.box('comparison', 'case')
    d = AppScene(app, 3 * BAR, 'case', ((comp[0] + comp[2]) / 2, (comp[1] + comp[3]) / 2 + 60, 2.1))
    d.highlight(0.25, 3.0, ['comparison'], 'case')
    d.popups.add(0.55, 3.0, card('Weight mismatch', ['3,215 lb on the paperwork.', '2,715 lb on the record.'], 780, 0), 960, 1030)
    pdf = app.box('openpdf', 'case')
    d.cam.to(3.1, ((pdf[0] + pdf[2]) / 2 - 150, (pdf[1] + pdf[3]) / 2 + 20, 2.6), 0.6)
    d.move(0, (900, 760)).move(3.2, 'openpdf', 0.55).to_state(3.75, 'case_pdfhover')
    d.highlight(3.8, 3 * BAR, ['openpdf'], 'case')
    d.popups.add(4.0, 3 * BAR, chip('Linked to the source PDF', ACCENT, 40), 960, 1010)
    scenes.append((3 * BAR, lambda t, s=d: s.render(t, dark)))
    cap(0.5, 2.6, 'Weight mismatch: 3,215 lb on the paperwork, 2,715 lb on the record.')
    cap(3.9, 2.2, 'Linked to the source PDF.')

    # E — no guessing (2 bars)
    rows = app.union(['d037', 'd038'], 'docs')
    e = AppScene(app, 2 * BAR, 'docs', ((rows[0] + rows[2]) / 2, (rows[1] + rows[3]) / 2 + 40, 1.45))
    e.highlight(0.2, 2 * BAR, ['d037', 'd038'], 'docs')
    e.popups.add(0.45, 2 * BAR, card('No matching shipment?', ['It goes to a person.', 'Nothing gets guessed.'], 720, 1), 960, 1020)
    scenes.append((2 * BAR, lambda t, s=e: s.render(t, dark)))
    cap(0.4, 2 * BAR - 0.5, 'No matching shipment? It goes to a person. Nothing gets guessed.')

    # F — approve is its own decision (3 bars)
    ap = app.union(['approve', 'reject'], 'case')
    f_ = AppScene(app, 3 * BAR, 'case', ((ap[0] + ap[2]) / 2 - 170, (ap[1] + ap[3]) / 2 - 30, 2.9))
    f_.move(0, (1100, 700)).move(0.5, 'approve', 0.6, 'case').to_state(1.12, 'case_approvehover').click(1.55, 'approved')
    f_.popups.add(0.25, 1.5, chip('A person decides', ACCENT, 40), 700, 330)
    toast = app.box('toast', 'approved')
    f_.cam.to(2.0, ((toast[0] + toast[2]) / 2, (toast[1] + toast[3]) / 2 + 120, 2.2), 0.65)
    f_.highlight(2.6, 3 * BAR, ['toast'], 'approved')
    f_.popups.add(2.8, 3 * BAR, chip('Approving never sends', (214, 158, 46), 44), 960, 760)
    scenes.append((3 * BAR, lambda t, s=f_: s.render(t, dark)))
    cap(0.25, 1.4, 'A person decides.')
    cap(2.8, 3 * BAR - 2.8, 'Draft approved. Approving never sends — sending is a separate action.')

    # G — send to the demo outbox (3 bars)
    sd = app.box('send', 'approved')
    g = AppScene(app, 3 * BAR, 'approved', ((sd[0] + sd[2]) / 2 - 170, (sd[1] + sd[3]) / 2 - 40, 2.7))
    g.move(0, (1150, 690)).move(0.3, 'send', 0.55, 'approved').to_state(0.88, 'approved_sendhover').click(1.25, 'sent')
    panel = app.union(['recipient', 'actions'], 'sent')
    g.cam.to(1.7, ((panel[0] + panel[2]) / 2 - 240, (panel[1] + panel[3]) / 2, 1.45), 0.7)
    g.move(1.7, (1245, 740), 0.7)
    g.highlight(2.4, 3 * BAR, ['recipient'], 'sent')
    g.popups.add(2.55, 3 * BAR, card('Sent to a demo outbox', ['No real email leaves.', 'Every recipient is .invalid'], 760, 1), 700, 640)
    scenes.append((3 * BAR, lambda t, s=g: s.render(t, dark)))
    cap(2.5, 3 * BAR - 2.5, 'Sent to a demo outbox. No real email leaves — every recipient is on a non-deliverable .invalid domain.')

    # H — every action logged (2 bars)
    lg_rows = app.union(['chain', 'r1', 'r2'], 'audit')
    h = AppScene(app, 2 * BAR, 'audit', ((lg_rows[0] + lg_rows[2]) / 2, (lg_rows[1] + lg_rows[3]) / 2 + 60, 1.35))
    h.highlight(0.2, 2 * BAR, ['r1', 'r2'], 'audit')
    h.popups.add(0.4, 2 * BAR, card('Activity log', ['Every action, logged.'], 640), 1320, 900)
    scenes.append((2 * BAR, lambda t, s=h: s.render(t, dark)))
    cap(0.4, 2 * BAR - 0.5, 'Activity log: every action, logged.')

    # I — results count up on the beat (3 bars)
    stats = [(30, 30, 'clean documents matched'), (11, 11, 'planted issues caught'), (65, 65, 'missing-document gaps caught'), (0, None, 'false positives')]

    def results(t):
        f = dark.copy().convert('RGBA')
        p, dy = rise(t, 0.0)
        text_line(f, 'ON FICTIONAL TEST FIXTURES', 200, 230 + dy, sans(28, 620), LILAC, 'lm', p)
        for i, (n, of, label) in enumerate(stats):
            t_i = 0.35 + i * 2 * BEAT
            p, dy = rise(t, t_i)
            if p <= 0:
                continue
            k = out_cubic((t - t_i) / 0.8)
            val = f'{round(n * k)}/{of}' if of else f'{round(n * k)}'
            y = 380 + i * 180 + dy
            text_line(f, val, 200, y, sans(128, 680), WHITE, 'lm', p)
            text_line(f, label, 640, y + 12, sans(56, 460), MUTED_DARK, 'lm', p)
        p, dy = rise(t, 0.35 + 8 * BEAT)
        text_line(f, 'Deterministic results on fictional data — not a promise about your operation.', 204, 1140 + dy, serif_i(44), MUTED_DARK, 'lm', p)
        return f
    scenes.append((3 * BAR, results))
    cap(0.3, 3 * BAR - 0.4, 'On fictional test fixtures: 30/30 clean documents matched, 11/11 planted issues caught, 65/65 missing-document gaps caught, 0 false positives.')

    # J — end card (3 bars)
    lg_dark = logo(56, dark=False)
    cta = Image.new('RGB', (760, 108), ACCENT)
    ImageDraw.Draw(cta).text((380, 54), 'Get an AI opportunity audit', font=sans(44, 600), fill=WHITE, anchor='mm')
    cta = shadowed(cta, radius=54, blur=30, alpha=90, pad=60, glow=ACCENT)

    def end(t):
        f = light.copy().convert('RGBA')
        p, dy = rise(t, 0.0)
        text_line(f, 'Less paperwork.', 184, 420 + dy, sans(140, 640), INK, 'lm', p)
        p, dy = rise(t, BEAT)
        text_line(f, 'More possibility.', 184, 580 + dy, serif_i(150), INK, 'lm', p)
        p, dy = rise(t, 2 * BEAT)
        text_line(f, 'Start with a two-week audit of one workflow.', 192, 750 + dy, sans(54, 460), INK, 'lm', p)
        p = out_back((t - 3 * BEAT) / 0.45)
        paste_sprite(f, cta, 192 + 380, 890, 0.7 + 0.3 * p, clamp((t - 3 * BEAT) / 0.2))
        p, dy = rise(t, 4 * BEAT)
        paste_sprite(f, lg_dark, 192 + lg_dark.width / 2, 1090 + dy, 1, p)
        text_line(f, 'selerim.com', W - 180, 1100 + dy, sans(40, 520), (110, 104, 120), 'rm', p)
        return f
    scenes.append((3 * BAR, end))
    cap(0, 3 * BAR, 'Less paperwork. More possibility. Start with a two-week audit of one workflow — get an AI opportunity audit at selerim.com.')
    return scenes, captions


def stamp(s):
    ms = round(s * 1000)
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d}.{ms % 1000:03d}'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--music', required=True)
    ap.add_argument('--stills')
    args = ap.parse_args()
    app = App()
    scenes, captions = build(app)
    starts = np.cumsum([0] + [d for d, _ in scenes])
    total = float(starts[-1])
    XF = 0.3

    def compose(t):
        i = min(int(np.searchsorted(starts, t, side='right')) - 1, len(scenes) - 1)
        local = t - starts[i]
        frame = scenes[i][1](local)
        if i > 0 and local < XF:  # zoom-through transition on the downbeat
            p = in_out(local / XF)
            prev = scenes[i - 1][1](scenes[i - 1][0] - 1e-3).convert('RGB')
            s = 1 + 0.12 * p
            prev = prev.resize((round(W * s), round(H * s)), Image.BILINEAR).crop(
                (round((W * s - W) / 2), round((H * s - H) / 2), round((W * s - W) / 2) + W, round((H * s - H) / 2) + H))
            s2 = 0.94 + 0.06 * p
            cur = frame.convert('RGB')
            small = cur.resize((round(W * s2), round(H * s2)), Image.BILINEAR)
            canvas = cur.copy()
            canvas.paste(small, ((W - small.width) // 2, (H - small.height) // 2))
            frame = Image.blend(prev, canvas, p)
        return frame.convert('RGB')

    if args.stills:
        outdir = HERE / 'generated' / 'promo-stills'
        outdir.mkdir(parents=True, exist_ok=True)
        for t in [float(x) for x in args.stills.split(',')]:
            compose(t).save(outdir / f'{t:05.1f}.png')
        print('total', round(total, 1))
        return

    tmp = Path(tempfile.mkdtemp())
    music = tmp / 'music.wav'
    subprocess.run([FF, '-y', '-loglevel', 'error', '-ss', str(FIRST_BEAT), '-t', f'{total:.3f}', '-i', args.music,
                    '-af', f'afade=t=in:st=0:d=0.25,afade=t=out:st={total - 2.6:.3f}:d=2.6,volume=0.55,alimiter=limit=0.89',
                    '-ar', '48000', '-ac', '2', str(music)], check=True)
    mp4 = OUT / 'logistics-walkthrough.mp4'
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
    (OUT / 'logistics-captions.vtt').write_text('\n'.join(vtt))
    lines = ['# Logistics concept walkthrough', '',
             'Music-only product tour of the local concept application (no narration). Fictional data; deterministic baseline.',
             'Music: "Upbeat" by Sub_Clair (Pixabay Content License).', '', '## On-screen text', '']
    lines += [f'- {stamp(a)[3:8]} — {text}' for a, b, text in captions]
    (OUT / 'logistics-transcript.txt').write_text('\n'.join(lines) + '\n')
    poster = compose(starts[3] + 1.2)
    poster.resize((1200, 800), Image.LANCZOS).save(OUT / 'logistics-poster.jpg', quality=88)
    poster.resize((1200, 800), Image.LANCZOS).save(OUT / 'logistics-poster.webp', quality=82)
    print(f'logistics promo {total:.1f}s')


if __name__ == '__main__':
    main()
