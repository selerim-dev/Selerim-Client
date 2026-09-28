"""Assemble narrated tours from genuine browser-captured interface states.
Requires macOS say and imageio-ffmpeg. No claim of live-model or continuous video capture.
"""
import json
import re
import shutil
import subprocess
import wave
from pathlib import Path
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[2]
WORK=Path(__file__).parent/'generated'
OUT=ROOT/'agency-website/public/demos'
FF=imageio_ffmpeg.get_ffmpeg_exe()

def run(*args):subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
def stamp(seconds):
    ms=round(seconds*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d}.{ms%1000:03d}'

for kind,chapters in json.loads((Path(__file__).parent/'narration.json').read_text()).items():
    cursor=0;vtt=['WEBVTT',''];transcript=[f'# {kind.title()} concept walkthrough','', 'Narrated tour of captured application states. Fictional data; deterministic baseline. Synthetic voice.',''];clips=[]
    for i,chapter in enumerate(chapters,1):
        stem=WORK/f'{kind}-{i:02d}'
        text=stem.with_suffix('.txt');text.write_text(chapter['text'])
        run('say','-v','Samantha','-r','135','-f',str(text),'-o',str(stem.with_suffix('.aiff')))
        run(FF,'-y','-i',str(stem.with_suffix('.aiff')),'-ar','24000','-ac','1',str(stem.with_suffix('.wav')))
        with wave.open(str(stem.with_suffix('.wav'))) as wav:duration=wav.getnframes()/wav.getframerate()
        clip=stem.with_suffix('.mp4');clips.append(clip)
        run(FF,'-y','-loop','1','-framerate','15','-i',str(stem.with_suffix('.png')),'-i',str(stem.with_suffix('.wav')),'-t',str(duration+1.5),'-c:v','libx264','-preset','fast','-crf','26','-pix_fmt','yuv420p','-af','apad','-c:a','aac','-b:a','96k','-movflags','+faststart',str(clip))
        sentences=re.split(r'(?<=[.!?])\s+',chapter['text']);total=sum(len(s.split()) for s in sentences)
        t=cursor
        for sentence in sentences:
            end=t+duration*len(sentence.split())/total
            vtt += [f'{stamp(t)} --> {stamp(end)}',sentence,''];t=end
        transcript += [f'## {stamp(cursor)} — {chapter["title"]}','',chapter['text'],'']
        cursor+=duration+1.5
        print(kind,i,round(cursor,1),flush=True)
    manifest=WORK/f'{kind}-concat.txt';manifest.write_text(''.join(f"file '{p}'\n" for p in clips))
    run(FF,'-y','-f','concat','-safe','0','-i',str(manifest),'-c','copy','-movflags','+faststart',str(OUT/f'{kind}-walkthrough.mp4'))
    (OUT/f'{kind}-captions.vtt').write_text('\n'.join(vtt))
    (OUT/f'{kind}-transcript.txt').write_text('\n'.join(transcript))
    run(FF,'-y','-i',str(WORK/f'{kind}-01.png'),'-vf','scale=1200:-2','-q:v','3',str(OUT/f'{kind}-poster.jpg'))
    print(kind,'duration',round(cursor,1),'seconds',flush=True)
