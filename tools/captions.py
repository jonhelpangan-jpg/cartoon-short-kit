#!/usr/bin/env python3
"""Burn captions onto frames/ -> frames_cap/.
House style (default): ONE word at a time, Title Case, heavy white letters with a thick black outline,
a quick pop-in (scale 1.18 -> 1.0 over 4 frames), centred in the lower part of the frame.
  python3 captions.py                 # uses work/words.json from timing.py
  CAP_Y=1580 CAP_SIZE=150 python3 captions.py
Word timings come from timing.py (estimated within each phrase unless whisper was available)."""
import json, os, re
from PIL import Image, ImageDraw, ImageFont

W = json.load(open('work/words.json')); FPS = 30
Y = int(os.environ.get('CAP_Y', 1580)); SIZE = int(os.environ.get('CAP_SIZE', 150))
FONTS = ['/usr/share/fonts/opentype/inter/InterDisplay-Black.otf', '/usr/share/fonts/opentype/inter/Inter-Black.otf',
         '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']
FONT = next(f for f in FONTS if os.path.exists(f))
_cache = {}
def font(sz):
    if sz not in _cache: _cache[sz] = ImageFont.truetype(FONT, sz)
    return _cache[sz]

def title(w):
    w = re.sub(r'[.,!?;:"]+', '', w)
    return w[:1].upper() + w[1:].lower() if w else w

# each word shows from its start until the next word starts (or 0.4 s after it ends at a pause)
spans = []
for i, w in enumerate(W):
    nxt = W[i + 1]['s'] if i + 1 < len(W) else w['e'] + 0.5
    spans.append((w['s'] - 0.04, min(nxt - 0.04, w['e'] + 0.4), title(w['w'])))

os.makedirs('frames_cap', exist_ok=True)
N = len([f for f in os.listdir('frames') if f.endswith('.jpg')])
for f in range(N):
    im = Image.open(f'frames/f{f:04d}.jpg').convert('RGB'); t = f / FPS
    sp = next((x for x in spans if x[0] <= t < x[1]), None)
    if sp and sp[2]:
        k = (t - sp[0]) * FPS                                  # frames since the word appeared
        scale = 1.0 + 0.18 * max(0.0, 1 - k / 4) ** 2
        sz = int(SIZE * scale); fnt = font(sz); d = ImageDraw.Draw(im)
        while d.textlength(sp[2], font=fnt) > 980 and sz > 60: sz -= 6; fnt = font(sz)
        d.text((540, Y), sp[2], font=fnt, fill='#ffffff', stroke_width=max(8, sz // 9), stroke_fill='#0c0a10', anchor='mm')
    im.save(f'frames_cap/f{f:04d}.jpg', quality=95)
print('captioned', N, 'frames,', len(spans), 'words')
