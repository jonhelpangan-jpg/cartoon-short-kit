# cartoon-short-kit

Audio in, finished vertical cartoon short out. Flat 2D bean-head cards in an inked, painted 3D world
(three.js, runs in the browser or headless Chromium), with a synthesized music bed and sound effects.

## Live preview

Open `index.html` through GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root).
It plays the worked example "The Soldier Who Never Left" (592 frames, 19.7 s). Use the slider to scrub.
You can also load a voiceover file to play alongside it. Rendering is heavy, so slower devices may skip frames.

## Layout

| Path | Purpose |
|---|---|
| `index.html`, `main.js`, `paint.js`, `motion.js`, `roman.js`, `story.js`, `toon.js`, `toonbase.js`, `lib/` | The runnable preview (three.js r160, engine, example story) |
| `example/soldier/` | Original example `story.js` and `audio.py` sound cue table |
| `tools/` | `setup.sh`, `timing.py`, `render.mjs`, `sheet.py`, `finish.sh` for building real videos |
| `vendor/toon.ts` | Pen / head / face library (see Credits) |
| `SKILL.md` | Instructions for the Claude "cartoon-audio-short" skill |

`toon.js` is `toonbase.js` + `roman.js` joined together. After editing `roman.js`, rebuild it with
`cat toonbase.js roman.js > toon.js`.

## Credits

- [mromidev/claude-animated-shorts](https://github.com/mromidev/claude-animated-shorts) (MIT): `toon.ts`, look values and readability rules.
- [three.js](https://threejs.org) r160 (MIT).

## License

MIT, see `LICENSE`. Third-party code keeps its own MIT license.
