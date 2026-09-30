"""Transcribe each cached narration clip and flag any that drift from the script.

Chatterbox occasionally drops or repeats words. Flagged clips are deleted with
--delete so the next recut_logistics.py run regenerates them with a new seed.
  pip install faster-whisper
"""
import argparse
import difflib
import hashlib
import json
import re
from pathlib import Path

from faster_whisper import WhisperModel

from recut_logistics import clip_key

HERE = Path(__file__).resolve().parent
CACHE = HERE / 'generated' / 'voice'
NUM = {'3,215': 'three thousand two hundred fifteen', '2,715': 'two thousand seven hundred fifteen',
       '50': 'fifty', '40': 'forty', '30': 'thirty', '11': 'eleven', '65': 'sixty five'}


def norm(s):
    s = s.lower().replace('-', ' ').replace("'", '')
    return re.sub(r'[^a-z ]', ' ', s).split()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--delete', action='store_true')
    ap.add_argument('--min', type=float, default=0.9)
    ap.add_argument('--ref')
    args = ap.parse_args()
    spec = json.loads((HERE / 'logistics-recut.json').read_text())
    model = WhisperModel('small.en', compute_type='int8')
    bad = 0
    for scene in spec['scenes']:
        for beat in scene['beats']:
            for s in [x for x in re.split(r'(?<=[.!?])\s+', beat.get('say', beat['text']).strip()) if x]:
                key = clip_key(s, spec['voice'], args.ref or spec['voice'].get('ref'))
                path = CACHE / f'{key}.wav'
                if not path.exists():
                    print('missing', s)
                    continue
                heard = ' '.join(seg.text for seg in model.transcribe(str(path), language='en')[0])
                for k, v in NUM.items():
                    heard = heard.replace(k, v)
                ratio = difflib.SequenceMatcher(None, norm(s), norm(heard)).ratio()
                flag = ratio < args.min
                bad += flag
                print(f'{"BAD " if flag else "ok  "}{ratio:.2f}  {s}\n{"":10s}{heard.strip()}' if flag else f'ok   {ratio:.2f}  {s[:70]}')
                if flag and args.delete:
                    retry = path.with_suffix('.retry')
                    retry.write_text(str(int(retry.read_text()) + 1 if retry.exists() else 1))
                    path.unlink()
    print('flagged', bad)


if __name__ == '__main__':
    main()
