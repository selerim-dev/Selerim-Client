"""Render the logistics product-demo walkthrough from logistics-recut.json.

Visuals: 2x captures of the real local app (capture_logistics.py writes PNGs and
element boxes to generated/cap2/). The app sits in a framed window; a locked
camera cuts between element-fitted zooms, a pointer drives real hover/click
states, and highlights attach to captured element boxes.
Narration: Chatterbox TTS (MIT, local), cached per sentence in generated/voice/.

  pip install chatterbox-tts "setuptools<81" pillow imageio-ffmpeg soundfile
  python recut_logistics.py [--ref voice.wav] [--only-audio]
"""
import argparse
import hashlib
import json
import math
import re
import subprocess
import tempfile
from pathlib import Path

import imageio_ffmpeg
import numpy as np
import soundfile as sf
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
CAP = HERE / 'generated' / 'cap2'
CACHE = HERE / 'generated' / 'voice'
OUT = ROOT / 'agency-website/public/demos'
FF = imageio_ffmpeg.get_ffmpeg_exe()

W, H, FPS, SR = 1920, 1280, 30, 24000       # output; site player is 3:2
WIN = (240, 190)                            # app window origin in logical px (app is 1440x900 CSS px)
ACCENT, INK, MUTED, BG = (111, 84, 152), (29, 26, 36), (110, 104, 120), (246, 245, 248)
SENT_GAP, BEAT_GAP, SCENE_GAP, LEAD_IN, TAIL = 0.16, 0.26, 0.55, 0.3, 2.2
MOVE, STATE_FADE, CARD_FADE, HL_FADE, CURSOR_MOVE = 0.62, 0.16, 0.32, 0.18, 0.55
MAX_ZOOM = 2.1


def font(name, size, weight=None):
    f = ImageFont.truetype(str(HERE / 'fonts' / name), size)
    if weight:
        f.set_variation_by_axes([weight])
    return f


def ease(t):
    t = min(max(t, 0.0), 1.0)
    return 4 * t ** 3 if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


# ---------- composition ----------

def canvas(shot):
    """App capture in a rounded, shadowed window on a soft backdrop, at 2x."""
    yy, xx = np.mgrid[0:H * 2, 0:W * 2]
    g = ((xx / (W * 2)) * 0.45 + (yy / (H * 2)) * 0.55)[..., None]
    top, bottom = np.array([236, 232, 245]), np.array([249, 248, 251])
    im = Image.fromarray((top * (1 - g) + bottom * g).astype(np.uint8))
    x, y, w, h = WIN[0] * 2, WIN[1] * 2, 2880, 1800
    shadow = Image.new('L', im.size, 0)
    ImageDraw.Draw(shadow).rounded_rectangle((x, y + 36, x + w, y + h + 36), 40, fill=70)
    im.paste((40, 30, 60), (0, 0), shadow.filter(ImageFilter.GaussianBlur(60)))
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w - 1, h - 1), 28, fill=255)
    im.paste(shot, (x, y), mask)
    ImageDraw.Draw(im).rounded_rectangle((x, y, x + w - 1, y + h - 1), 28, outline=(222, 218, 230), width=2)
    return im


def title_card():
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((160, 400), 'SELERIM STUDIO  ·  CONCEPT 01  ·  LOGISTICS', font=font('InterTight.woff2', 28, 560), fill=MUTED)
    big = font('InterTight.woff2', 138, 600)
    d.text((152, 462), 'Shipment document', font=big, fill=INK)
    d.text((152, 622), 'agent', font=big, fill=INK)
    d.text((152 + d.textlength('agent', font=big), 622), '.', font=big, fill=ACCENT)
    d.text((160, 826), 'Paperwork matched. A person stays in charge.', font=font('InstrumentSerif-Italic.woff2', 60), fill=MUTED)
    return im


RESULTS = [('30/30', 'clean documents matched'), ('11/11', 'planted document issues caught'),
           ('65/65', 'missing-document gaps caught'), ('0', 'false positives')]


def results_layers():
    base = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(base)
    d.text((160, 200), 'MEASURED ON FICTIONAL TEST FIXTURES', font=font('InterTight.woff2', 28, 560), fill=MUTED)
    d.text((152, 250), 'What the agent caught.', font=font('InterTight.woff2', 96, 600), fill=INK)
    layers = []
    for i, (n, label) in enumerate(RESULTS):
        layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ld = ImageDraw.Draw(layer)
        y = 452 + i * 158
        ld.line((160, y - 24, W - 160, y - 24), fill=(222, 219, 228, 255), width=2)
        ld.text((160, y), n, font=font('InterTight.woff2', 100, 600), fill=ACCENT + (255,))
        ld.text((560, y + 30), label, font=font('InterTight.woff2', 52, 420), fill=INK + (255,))
        layers.append(layer)
    foot = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(foot).text((160, 1110), 'Deterministic results on fictional data — not a promise about your operation.',
                              font=font('InstrumentSerif-Italic.woff2', 48), fill=MUTED + (255,))
    return base, layers + [foot]


def end_card():
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((160, 330), 'Less paperwork.', font=font('InterTight.woff2', 128, 600), fill=INK)
    d.text((160, 476), 'More possibility.', font=font('InstrumentSerif-Italic.woff2', 138), fill=INK)
    d.text((166, 706), 'Start with a two-week audit of one workflow.', font=font('InterTight.woff2', 56, 420), fill=INK)
    pill = font('InterTight.woff2', 44, 560)
    label = 'Get an AI opportunity audit'
    w = d.textlength(label, font=pill)
    d.rounded_rectangle((160, 826, 160 + w + 96, 930), radius=52, fill=ACCENT)
    d.text((208, 850), label, font=pill, fill=(255, 255, 255))
    d.text((166, 1010), 'selerim.com', font=font('InterTight.woff2', 40, 500), fill=MUTED)
    return im


# ---------- narration ----------

def sentences(text):
    return [s for s in re.split(r'(?<=[.!?])\s+', text.strip()) if s]


def clip_key(text, cfg, ref):
    gen = {k: v for k, v in cfg.items() if k != 'tempo'}
    return hashlib.sha1(json.dumps([text, gen, str(ref)]).encode()).hexdigest()[:16]


class Voice:
    def __init__(self, cfg, ref):
        self.cfg, self.ref, self.model = cfg, ref, None

    def clip(self, text):
        key = clip_key(text, self.cfg, self.ref)
        path = CACHE / f'{key}.wav'
        if not path.exists():
            if self.model is None:
                import torch
                from chatterbox.tts import ChatterboxTTS
                self.torch = torch
                self.model = ChatterboxTTS.from_pretrained(device='mps' if torch.backends.mps.is_available() else 'cpu')
            retry = path.with_suffix('.retry')
            self.torch.manual_seed(int(key[:8], 16) + (int(retry.read_text()) if retry.exists() else 0))
            wav = self.model.generate(text, audio_prompt_path=self.ref, exaggeration=self.cfg['exaggeration'],
                                      cfg_weight=self.cfg['cfg'], temperature=self.cfg['temperature'])
            CACHE.mkdir(parents=True, exist_ok=True)
            raw = path.with_suffix('.raw.wav')
            sf.write(raw, wav.squeeze(0).cpu().numpy(), self.model.sr)
            subprocess.run([FF, '-y', '-loglevel', 'error', '-i', str(raw), '-af',
                            'silenceremove=start_periods=1:start_threshold=-45dB,'
                            'areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', '-ar', str(SR), '-ac', '1', str(path)], check=True)
            raw.unlink()
            print('  voiced:', text[:60], flush=True)
        if self.cfg.get('tempo', 1.0) != 1.0:
            out = subprocess.run([FF, '-loglevel', 'error', '-i', str(path), '-af', f'atempo={self.cfg["tempo"]}',
                                  '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], check=True, capture_output=True).stdout
            return np.frombuffer(out, np.float32).copy()
        audio, sr = sf.read(path, dtype='float32')
        return audio


def caption_chunks(text, start, end, limit=12):
    chunks = [text]
    while True:
        longest = max(chunks, key=lambda c: len(c.split()))
        if len(longest.split()) <= limit:
            break
        cuts = [m.end() for m in re.finditer(r' — |: |; |, ', longest)]
        if not cuts:
            break
        cut = min(cuts, key=lambda c: abs(c - len(longest) / 2))
        i = chunks.index(longest)
        chunks[i:i + 1] = [longest[:cut].rstrip(), longest[cut:].lstrip()]
    total, t, out = sum(len(c) for c in chunks), start, []
    for c in chunks:
        e = t + (end - start) * len(c) / total
        out.append((t, e, c))
        t = e
    return out


def stamp(s):
    ms = round(s * 1000)
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d}.{ms % 1000:03d}'


# ---------- camera & geometry (logical 1920x1280 space) ----------

FULL = np.array([0.0, 0.0, W, H])


def union(boxes):
    b = np.array(boxes, float)
    return np.array([b[:, 0].min(), b[:, 1].min(), b[:, 2].max(), b[:, 3].max()]) + [WIN[0], WIN[1], WIN[0], WIN[1]]


def fit(box, margin=70):
    x0, y0, x1, y1 = box
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    w = max(x1 - x0 + 2 * margin, (y1 - y0 + 2 * margin) * W / H, W / MAX_ZOOM)
    w = min(w, W)
    h = w * H / W
    cx, cy = min(max(cx, w / 2), W - w / 2), min(max(cy, h / 2), H - h / 2)
    return np.array([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2])


def lerp_cam(a, b, t):
    """Interpolate centre linearly and width in log space, so zooms feel even."""
    ca, cb = (a[:2] + a[2:]) / 2, (b[:2] + b[2:]) / 2
    wa, wb = a[2] - a[0], b[2] - b[0]
    w = math.exp(math.log(wa) + (math.log(wb) - math.log(wa)) * t)
    c = ca + (cb - ca) * t
    w = min(w, W)
    h = w * H / W
    c = np.clip(c, [w / 2, h / 2], [W - w / 2, H - h / 2])
    return np.array([c[0] - w / 2, c[1] - h / 2, c[0] + w / 2, c[1] + h / 2])


def to_screen(box, cam):
    s = W / (cam[2] - cam[0])
    return [(box[0] - cam[0]) * s, (box[1] - cam[1]) * s, (box[2] - cam[0]) * s, (box[3] - cam[1]) * s]


# ---------- overlay drawing ----------

LABEL_FONT = None


def pointer(d, x, y, s, press):
    s *= 0.86 if press else 1.0
    pts = [(0, 0), (0, 25), (6.5, 19.5), (11, 29.5), (15.5, 27.5), (11.2, 18), (19, 18)]
    pts = [(x + px * s, y + py * s) for px, py in pts]
    d.polygon([(px + 1.5 * s, py + 2 * s) for px, py in pts], fill=(0, 0, 0, 60))
    d.polygon(pts, fill=(255, 255, 255, 255), outline=(18, 18, 22, 255), width=max(1, round(1.4 * s)))


def draw_overlays(frame, cam, hl, cursor, click_age):
    global LABEL_FONT
    LABEL_FONT = LABEL_FONT or font('InterTight.woff2', 30, 580)
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if hl:
        box, label, alpha = hl
        r = [round(v) for v in to_screen(box, cam)]
        r = [r[0] - 8, r[1] - 8, r[2] + 8, r[3] + 8]
        dim = Image.new('L', (W, H), int(46 * alpha))
        ImageDraw.Draw(dim).rounded_rectangle(r, radius=14, fill=0)
        layer.paste(INK + (255,), (0, 0), dim)
        d.rounded_rectangle(r, radius=14, outline=ACCENT + (int(255 * alpha),), width=4)
        if label:
            tw = d.textlength(label, font=LABEL_FONT)
            lx = round(min(max(r[2] - tw - 40, 24), W - tw - 64))
            ly = r[1] - 66 if r[1] > 90 else r[3] + 16
            d.rounded_rectangle((lx, ly, lx + tw + 40, ly + 50), radius=25, fill=ACCENT + (int(255 * alpha),))
            d.text((lx + 20, ly + 8), label, font=LABEL_FONT, fill=(255, 255, 255, int(255 * alpha)))
    if cursor is not None:
        (x, y), s = cursor
        if click_age is not None and click_age < 0.5:
            k = click_age / 0.5
            rad = 10 + 38 * k
            d.ellipse((x - rad, y - rad, x + rad, y + rad), outline=ACCENT + (int(230 * (1 - k)),), width=5)
        pointer(d, x, y, s, click_age is not None and click_age < 0.14)
    return Image.alpha_composite(frame.convert('RGBA'), layer).convert('RGB')


# ---------- build ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ref', help='reference voice clip for Chatterbox (omit for its default voice)')
    ap.add_argument('--only-audio', action='store_true')
    ap.add_argument('--silent', action='store_true', help='estimate timing without TTS (visual checks)')
    ap.add_argument('--stills', help='comma-separated seconds; write PNGs to generated/stills instead of video')
    args = ap.parse_args()
    spec = json.loads((HERE / 'logistics-recut.json').read_text())
    vcfg = spec['voice']
    voice = Voice(vcfg, args.ref or vcfg.get('ref'))
    if args.silent:
        voice.clip = lambda text: np.zeros(int(len(text.split()) / 2.9 * SR), np.float32)
    boxes = json.loads((CAP / 'boxes.json').read_text())

    def box_of(state, keys):
        keys = [keys] if isinstance(keys, str) else keys
        found = []
        for k in keys:
            b = boxes.get(state, {}).get(k) or spec['nav'].get(k)
            if b is None:  # hover/result states share geometry with their base state
                b = next((v[k] for v in boxes.values() if k in v), None)
            found.append(b)
        return union(found)

    # ---- narration + timeline ----
    audio, t = [np.zeros(int(LEAD_IN * SR), np.float32)], LEAD_IN
    beats, cues, transcript = [], [], []
    for si, scene in enumerate(spec['scenes']):
        if si:
            audio.append(np.zeros(int(SCENE_GAP * SR), np.float32))
            t += SCENE_GAP
        transcript += [f'## {stamp(t)} — {scene["title"]}', '']
        texts = []
        for bi, beat in enumerate(scene['beats']):
            if bi:
                audio.append(np.zeros(int(BEAT_GAP * SR), np.float32))
                t += BEAT_GAP
            spoken = sentences(beat.get('say', beat['text']))
            start = t
            spans = []
            for k, s in enumerate(spoken):
                if k:
                    audio.append(np.zeros(int(SENT_GAP * SR), np.float32))
                    t += SENT_GAP
                clip = voice.clip(s)
                spans.append((t, t + len(clip) / SR))
                audio.append(clip)
                t += len(clip) / SR
            if 'say' in beat:
                cues += caption_chunks(beat['text'], start, t)
            else:
                for s, (a, b) in zip(sentences(beat['text']), spans):
                    cues += caption_chunks(s, a, b)
            beats.append(dict(beat, start=start, end=t))
            texts.append(beat['text'])
        transcript += [' '.join(texts), '']
        print(f'{scene["title"]:34s} {t:6.1f}s', flush=True)
    total = t + TAIL
    audio.append(np.zeros(int(TAIL * SR), np.float32))
    audio = np.concatenate(audio)
    peak = np.abs(audio).max()
    audio *= 0.89 / peak if peak else 1

    vtt = ['WEBVTT', '']
    for a, b, text in cues:
        vtt += [f'{stamp(a)} --> {stamp(b)}', text, '']
    if args.only_audio:
        tmp = Path(tempfile.mkdtemp()) / 'voice.wav'
        sf.write(tmp, audio, SR)
        print('audio only:', tmp, f'{total:.1f}s')
        return

    # ---- event lists: (time, value) ----
    def at_time(beat, at):
        if isinstance(at, str):
            return beat['start'] + (beat['end'] - beat['start']) * beat['text'].index(at) / len(beat['text'])
        return beat['start'] + at

    scene_ev, cam_ev, hl_ev, cur_ev, clicks = [], [], [], [], []
    state, cam, cursor = None, FULL, None
    for i, beat in enumerate(beats):
        t0 = 0.0 if i == 0 else beat['start'] - BEAT_GAP / 2
        if 'card' in beat:
            scene_ev.append((t0, ('card', beat['card'], beat.get('reveal', 0), beat['start'])))
            hl_ev.append((t0, None))
            state = None
            continue
        entering = state is None
        if 'state' in beat or entering:
            state = beat.get('state', state)
            scene_ev.append((t0, ('app', state)))
        steps = [dict(at=t0, **{k: beat[k] for k in ('cam', 'hl', 'label') if k in beat})]
        steps += [dict(at=at_time(beat, s['at']), **{k: s[k] for k in ('cam', 'hl', 'label') if k in s}) for s in beat.get('then', [])]
        for s in steps:
            moved = False
            if 'cam' in s:
                new = FULL if s['cam'] == 'full' else fit(box_of(state, s['cam']))
                if entering:  # arrive from a card with a gentle pull-out
                    cam_ev.append((s['at'] - 1e-3, new + np.array([96, 64, -96, -64]), 0.0))
                    entering = False
                moved = not np.allclose(new, cam)
                cam = new
                cam_ev.append((s['at'], cam, MOVE))
            hl = (box_of(state, s['hl']), s.get('label')) if 'hl' in s else None
            prev = hl_ev[-1][1] if hl_ev else None
            same = prev is not None and hl is not None and np.allclose(prev[0], hl[0]) and prev[1] == hl[1] and not moved
            if not same:
                hl_ev.append((s['at'] + (MOVE * 0.8 if moved else 0.05), hl))
        for c in beat.get('cursor', []):
            ct = at_time(beat, c['at'])
            if 'to' in c:
                b = box_of(state, c['to'])
                target = np.array([(b[0] + b[2]) / 2, (b[1] + b[3]) / 2 + 4])
                cur_ev.append((ct, target, 0.0 if c.get('jump') else CURSOR_MOVE))
                ct += CURSOR_MOVE
            if 'state' in c:
                if c.get('click'):
                    clicks.append(ct)
                    ct += 0.1
                scene_ev.append((ct, ('app', c['state'])))
                state = c['state']

    def last(events, t):
        idx = -1
        for k, e in enumerate(events):
            if e[0] <= t:
                idx = k
        return idx

    # ---- assets ----
    shots = {}

    def app_canvas(name):
        if name not in shots:
            shots[name] = canvas(Image.open(CAP / f'{name}.png').convert('RGB'))
        return shots[name]

    cards = {'title': title_card(), 'end': end_card()}
    res_base, res_layers = results_layers()
    reveal_times = {}
    for i, beat in enumerate(beats):
        if beat.get('card') == 'results':
            prev = beats[i - 1].get('reveal', -1) if beats[i - 1].get('card') == 'results' else -1
            for r in range(prev + 1, beat['reveal'] + 1):
                reveal_times[r] = beat['start'] + 0.12 * (r - prev - 1)

    render_cache = {}

    def scene_frame(ev, t, camv):
        kind = ev[1][0]
        if kind == 'card':
            name = ev[1][1]
            if name != 'results':
                return cards[name]
            frame = res_base.convert('RGBA')
            for r, layer in enumerate(res_layers):
                if r in reveal_times and t >= reveal_times[r]:
                    a = ease((t - reveal_times[r]) / 0.3)
                    frame = Image.alpha_composite(frame, layer if a >= 1 else Image.blend(Image.new('RGBA', (W, H), (0, 0, 0, 0)), layer, a))
            return frame.convert('RGB')
        key = (ev[1][1], tuple(np.round(camv, 2)))
        if key not in render_cache:
            if len(render_cache) > 6:
                render_cache.clear()
            render_cache[key] = app_canvas(ev[1][1]).resize((W, H), Image.BICUBIC, box=tuple(camv * 2))
        return render_cache[key]

    starts = []
    for k, (tk, target, dur) in enumerate(cam_ev):
        if k == 0:
            starts.append(target)
        else:
            tp, tgt_p, dur_p = cam_ev[k - 1]
            starts.append(lerp_cam(starts[k - 1], tgt_p, ease((tk - tp) / dur_p) if dur_p else 1.0))

    def camera(t):
        k = last(cam_ev, t)
        if k < 0:
            return FULL
        tk, target, dur = cam_ev[k]
        return lerp_cam(starts[k], target, ease((t - tk) / dur) if dur else 1.0)

    def cursor_at(t):
        k = last(cur_ev, t)
        if k < 0:
            return None
        t0, target, dur = cur_ev[k]
        src = cur_ev[k - 1][1] if k else target
        p = ease((t - t0) / dur) if dur else 1.0
        return src + (target - src) * p

    # ---- render ----
    if args.stills:
        still_dir = HERE / 'generated' / 'stills'
        still_dir.mkdir(parents=True, exist_ok=True)
        render_times = [float(x) for x in args.stills.split(',')]
    else:
        render_times = None
    def compose(t):
        camv = camera(t)
        k = last(scene_ev, t)
        ev = scene_ev[k]
        frame = scene_frame(ev, t, camv)
        if k > 0:
            prev = scene_ev[k - 1]
            fade = CARD_FADE if 'card' in (ev[1][0], prev[1][0]) else STATE_FADE
            if t - ev[0] < fade:
                frame = Image.blend(scene_frame(prev, t, camv), frame, ease((t - ev[0]) / fade))
        if ev[1][0] == 'app':
            hk = last(hl_ev, t)
            hl = None
            if hk >= 0 and hl_ev[hk][1]:
                hl = (*hl_ev[hk][1], ease((t - hl_ev[hk][0]) / HL_FADE))
            pos = cursor_at(t)
            cur = None
            if pos is not None:
                zoom = W / (camv[2] - camv[0])
                sx, sy = to_screen([pos[0], pos[1], 0, 0], camv)[:2]
                cur = ((sx, sy), 1.5 * (1 + 0.45 * (zoom - 1)))
            ck = [c for c in clicks if 0 <= t - c < 0.5]
            frame = draw_overlays(frame, camv, hl, cur, (t - ck[-1]) if ck else None)
        return frame

    if render_times:
        for t in render_times:
            compose(t).save(still_dir / f'{t:06.1f}.png')
        print('stills', render_times, 'total', round(total, 1))
        return

    tmp = Path(tempfile.mkdtemp())
    wav = tmp / 'voice.wav'
    sf.write(wav, audio, SR)
    mp4 = OUT / 'logistics-walkthrough.mp4'
    enc = subprocess.Popen([FF, '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                            '-r', str(FPS), '-i', '-', '-i', str(wav), '-c:v', 'libx264', '-preset', 'slow', '-crf', '24',
                            '-tune', 'animation', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest',
                            '-movflags', '+faststart', str(mp4)], stdin=subprocess.PIPE)
    frames = math.ceil(total * FPS)
    for n in range(frames):
        frame = compose(n / FPS)
        enc.stdin.write(frame.tobytes())
        if n % (FPS * 10) == 0:
            print(f'frame {n}/{frames}', flush=True)
    enc.stdin.close()
    assert enc.wait() == 0

    (OUT / 'logistics-captions.vtt').write_text('\n'.join(vtt))
    head = ['# Logistics concept walkthrough', '',
            'Narrated product tour of the local concept application. Fictional data; deterministic baseline. Synthetic voice.', '']
    (OUT / 'logistics-transcript.txt').write_text('\n'.join(head + transcript))
    poster = app_canvas('case').resize((1200, 800), Image.LANCZOS)
    poster.save(OUT / 'logistics-poster.jpg', quality=88)
    poster.save(OUT / 'logistics-poster.webp', quality=82)
    print(f'logistics duration {total:.1f}s')


if __name__ == '__main__':
    main()
