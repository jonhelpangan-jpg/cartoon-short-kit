# House style (separate add-on files)

The original kit files are unchanged. The house style is three add-on files:

| File | What it does |
|---|---|
| `stick.js` | "Stick" characters: big round white heads, pill-shaped bodies, thin stick arms and legs, dark mitten hands. Adds a modern cast (`hero`, `pj`, `rain`, townsfolk) and `figureFront()`. |
| `framing.js` | `frame(eye, kind, dir)` gives close, long-lens framings (`cu`, `mcu`, `ms`, `full`, `two`) with a recommended background blur. |
| `tools/captions.py` | Captions one word at a time, Title Case, heavy white letters with a thick black outline and a pop-in. |

## Using it in a project

```bash
cp stick.js framing.js <project>/web/
cat <project>/web/toonbase.js <project>/web/roman.js <project>/web/stick.js > <project>/web/toon.js
cp tools/captions.py <project>/
```

```js
// story.js
import { frame } from './framing.js';
// characters: T.figureFront(p, 'rain', { expr: 'grin', R: 'wave' })
// set T.STYLE.mode = 'bean' to fall back to the original bean heads
```

Outfit options used by the stick style: `tunic`, `dress`, `hair`, `curls`, `hairStyle` (`bun`, `long`, `bald`), `cap`,
`boots`, `belt`, `moustache`, `detail` (`buttons`, `stripes`, `pocket`). Per-frame options: `umbrella`, `drop`, `gloves`, `glow`.
