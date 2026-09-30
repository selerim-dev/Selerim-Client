# Concept walkthrough assets

Published videos (in `agency-website/public/demos/`, with posters, VTT captions
and on-screen-text transcripts) are music-only product tours, no narration:

- Logistics, 0:53: `promo_logistics.py`, music "Upbeat" by Sub_Clair.
- Legal, 0:58: `promo_legal.py`, music "Party Pop" by AtlasAudio.

Both tracks are under the Pixabay Content License and are not Content ID
registered. Visuals are 3x captures of the real local apps with fictional
fixtures: `capture_logistics.py generated/cap3 3` (server on :8093) and
`capture_legal.py generated/lcap3 3` (server on :8094), each against a fresh
state database. Captures and music live in ignored `generated/`. Render with
`--music <mp3>`; `--stills 3,10,20` previews frames.

Older variants kept for reference: `build.py` + `narration.json` (macOS voice
slide tours) and the narrated logistics recut below.

## Logistics product tour (v3)

`capture_logistics.py` drives the local logistics server with Playwright at 2x
and writes each UI state plus element boxes to `generated/cap2/`.
`recut_logistics.py` reads `logistics-recut.json` (script beats, camera,
highlights, pointer and click states), voices each sentence with Chatterbox
(cached in `generated/voice/`), and renders MP4, VTT, transcript and posters.
`check_voice.py --delete` transcribes every clip with faster-whisper and queues
drifted takes for regeneration. `--silent --stills 5,20` previews frames.
