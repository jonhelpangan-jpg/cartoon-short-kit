#!/usr/bin/env python3
"""Burn captions onto frames/ -> frames_cap/.  Reads work/words.json (from timing.py).

CAP_STYLE=phrase (default, the original house captions): short phrases of 1-3 words in bold UPPERCASE,
  white with a dark outline, the word being spoken in yellow. Phrases break at punctuation and are split
  into balanced chunks of 2-3 words automatically (no hand-made chunk list needed).
CAP_STYLE=word: ONE word at a time, Title Case, heavy white with a thick black outline and a pop-in.

  python3 captions.py                       # phrase style
  CAP_STYLE=word python3 captions.py        # one-word style
  CAP_Y=1560 CAP_SIZE=80 python3 captions.py
Word timings are estimated inside each phrase unless whisper was available to timing.py."""
import json, os, re
from PIL import Image, ImageDraw, ImageFont

W = json.load(open('work/words.json')); FPS = 30
STYLE = os.environ.get('CAP_STYLE', 'phrase')
Y = int(os.environ.get('CAP_Y', 1560 if STYLE == 'phrase' else 1580))
SIZE = int(os.environ.get('CAP_SIZE', 80 if STYLE == 'phrase' else 150))
FONTS = {'phrase': ['/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'],
         'word': ['/usr/share/fonts/opentype/inter/InterDisplay-Black.otf', '/usr/share/fonts/opentype/inter/Inter-Black.otf']}
FONT = next((f for f in FONTS[STYLE] + ['/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'] if os.path.exists(f)))
_cache = {}
def font(sz):
    if sz not in _cache: _cache[sz] = ImageFont.truetype(FONT, sz)
    return _cache[sz]

FUNC = {'a', 'an', 'the', 'to', 'of', 'in', 'at', 'on', 'and', 'or', 'but', 'than', 'your', 'you', 'my', 'is', 'are',
        'be', 'by', 'for', 'with', 'from', 'that', 'if', 'it', 'its', "it's", 'so', 'as', 'before', 'after', 'could', 'would', 'can'}
def chunks_auto(words):
    """phrase chunks: break at punctuation; keep short phrases whole (<= 4 words, <= 22 letters);
    otherwise chunks of ~2-3 words that never end on a small function word and never leave a lone word"""
    out, seg = [], []
    clean = lambda i: re.sub(r"[^a-z']", '', words[i]['w'].lower())
    def flush(seg):
        if not seg: return
        if len(seg) <= 4 and sum(len(words[i]['w']) for i in seg) <= 22: out.append(seg); return
        cur = []
        for k, i in enumerate(seg):
            cur.append(i); rest = len(seg) - k - 1
            if rest == 0: break
            if len(cur) >= 3 or (len(cur) == 2 and sum(len(words[j]['w']) for j in cur) >= 14):
                if clean(cur[-1]) in FUNC and len(cur) < 4: continue
                if rest == 1: continue
                out.append(cur); cur = []
        if cur: out.append(cur)
    for i, w in enumerate(words):
        seg.append(i)
        if re.search(r'[.,?!;:]$', w['w']) or i == len(words) - 1: flush(seg); seg = []
    return out

os.makedirs('frames_cap', exist_ok=True)
N = len([f for f in os.listdir('frames') if f.endswith('.jpg')])

if STYLE == 'word':
    def title(w):
        w = re.sub(r'[.,!?;:"]+', '', w); return w[:1].upper() + w[1:].lower() if w else w
    spans = []
    for i, w in enumerate(W):
        nxt = W[i + 1]['s'] if i + 1 < len(W) else w['e'] + 0.5
        spans.append((w['s'] - 0.04, min(nxt - 0.04, w['e'] + 0.4), title(w['w'])))
    for f in range(N):
        im = Image.open(f'frames/f{f:04d}.jpg').convert('RGB'); t = f / FPS
        sp = next((x for x in spans if x[0] <= t < x[1]), None)
        if sp and sp[2]:
            k = (t - sp[0]) * FPS; sz = int(SIZE * (1.0 + 0.18 * max(0.0, 1 - k / 4) ** 2)); fnt = font(sz); d = ImageDraw.Draw(im)
            while d.textlength(sp[2], font=fnt) > 980 and sz > 60: sz -= 6; fnt = font(sz)
            d.text((540, Y), sp[2], font=fnt, fill='#ffffff', stroke_width=max(8, sz // 9), stroke_fill='#0c0a10', anchor='mm')
        im.save(f'frames_cap/f{f:04d}.jpg', quality=95)
    print('captioned', N, 'frames,', len(spans), 'words (word style)')
else:
    chunks = chunks_auto(W); spans = []
    for k, c in enumerate(chunks):
        s = W[c[0]]['s']; e = W[c[-1]]['e']; nxt = W[chunks[k + 1][0]]['s'] if k + 1 < len(chunks) else e + 0.5
        spans.append((s - 0.05, min(nxt, e + 0.45), c))
    fnt = font(SIZE)
    for f in range(N):
        im = Image.open(f'frames/f{f:04d}.jpg').convert('RGB'); t = f / FPS
        sp = next((x for x in spans if x[0] <= t < x[1]), None)
        if sp:
            d = ImageDraw.Draw(im); words = [W[i]['w'].upper() for i in sp[2]]
            widths = [d.textlength(w, font=fnt) for w in words]; gap = 24
            tot = sum(widths) + gap * (len(words) - 1)
            lines = [list(range(len(words)))] if tot < 1000 else [list(range(len(words) - 1)), [len(words) - 1]]
            active = max([i for i in sp[2] if W[i]['s'] - 0.03 <= t] or [-1])
            for li, ln in enumerate(lines):
                lw = sum(widths[j] for j in ln) + gap * (len(ln) - 1); x = (1080 - lw) / 2; y = Y + li * 100
                for j in ln:
                    d.text((x, y), words[j], font=fnt, fill='#ffe14a' if sp[2][j] == active else '#ffffff', stroke_width=11, stroke_fill='#1a1020', anchor='lm')
                    x += widths[j] + gap
        im.save(f'frames_cap/f{f:04d}.jpg', quality=95)
    print('captioned', N, 'frames,', len(chunks), 'phrases (phrase style)')
