# House style (separate add-on files)

The original kit files are unchanged. The house style is three add-on files:

| File | What it does |
|---|---|
| `stick.js` | "Stick" characters: big round white heads, pill-shaped bodies, thin stick arms and legs, dark mitten hands. Adds a modern cast (`hero`, `pj`, `rain`, townsfolk) and `figureFront()`. |
| `framing.js` | `frame(eye, kind, dir)` gives close, long-lens framings (`cu`, `mcu`, `ms`, `full`, `two`) with a recommended background blur. |
| `rig3d.js` | **Fully 3D characters** (`Char3D`): sphere head with a painted-on face (all the kit's expressions, blinks and `look`), capsule body with shirt/pants, jointed tube arms and legs (2-bone IK, walk cycles), mitten hands, 3D hair, hats, glasses and moustaches. Pose options match the 2D cards (`expr`, `L`/`R` arm poses, `tilt`, `headTilt`, `step`, ...). Needs `drawFace3D` from `stick.js`. |
| `tools/captions.py` | Captions. Default: the original phrase style (1-3 words, bold uppercase, spoken word in yellow), split automatically. `CAP_STYLE=word`: one word at a time with a pop-in. |

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

## 3D characters (rig3d.js)

1. Copy `rig3d.js` and `stick.js` into `<project>/web/` and build `toon.js` from `toonbase.js + roman.js + stick.js`.
2. In the project's own copy of `main.js` (never the repo's), import the rig and route 3D actors in `drawActors`:

```js
import { Char3D } from './rig3d.js';
const rigs = {};
function drawActors(all, cam) {
  Object.values(rigs).forEach((r) => r.setVisible(false));
  const list = all.filter((a) => !a.c3d);
  all.filter((a) => a.c3d).forEach((a) => {
    const id = a.id || a.c3d, r = rigs[id] || (rigs[id] = new Char3D(scene, T, a.c3d)); r.setVisible(true);
    const yaw = a.yaw ?? (Math.atan2(cam.position.x - a.x, cam.position.z - a.z) + (a.turn || 0));
    r.pose({ ...a.o, x: a.x, y: a.y, z: a.z, yaw });
  });
  // ...the original card code continues with `list`
```

3. In `story.js`, return 3D actors as `{ c3d: 'kid', id: 'kid', x, y, z, turn, o: { expr, L, R, step, ... } }`.
   Outfits live in `OUTFITS3D` (`skin`, `shirt`, `pants`, `stripes`, `coat`, `hair`, `hairStyle` (`bun`, `curls`),
   `hat` (`beanie`), `hatColor`, `glasses`, `moustache`, `detail` (`collar`, `buttons`, `tie`), `apron`, `shoes`).
   `EYE_Y` gives the eye height for camera framing.
