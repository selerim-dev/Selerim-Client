# Concept walkthrough assets

Logistics: 3:24. Legal: 3:36. Captured from the actual local application states
with fictional fixtures, narrated using macOS Samantha synthetic voice.
These are narrated slide tours, not continuous screen recordings, Loom uploads,
or live-model demonstrations. MP4, JPEG posters, English VTT captions and plain
text transcripts live in `agency-website/public/demos/`.

`narration.json` contains the six chapters per demo. `build.py` assembles captures
from ignored `generated/` using macOS `say` and `imageio-ffmpeg`. Regeneration
requires fresh browser captures; generated source captures are not committed.
Both output MP4s have been fully decoded and browser playback verified.
