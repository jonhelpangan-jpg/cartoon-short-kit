# cartoon-short-kit: house rules for making videos

- **Original files stay untouched.** The house style lives only in separate files: `stick.js` (2D characters + face painter), `rig3d.js` (3D characters),
  `framing.js` (camera framings) and `tools/captions.py` (captions). Never edit `main.js`, `motion.js`, `roman.js`,
  `paint.js` or `toon.js` in this repo for style changes.
- **Character style:** every new video uses the "stick" style (big round white heads, pill-shaped bodies,
  thin stick arms and legs, dark mitten hands). After running the skill's `setup.sh`, copy this repo's `stick.js`
  and `framing.js` into the project's `web/` folder, build `cat web/toonbase.js web/roman.js web/stick.js > web/toon.js`,
  and draw characters with `T.figureFront(p, outfitKey, opts)` (same options as `romanFront`).
- **3D characters (preferred look):** build the cast as fully 3D characters with `rig3d.js` (see STYLE.md): sphere heads
  with painted faces, varied skin tones, 3D bodies and limbs, real light and shadow. Use the 2D stick cards only for crowds
  far in the background or when asked. Light scenes warm and soft, with angled cameras so the 3D sets read as 3D.
- Design each video's characters to fit its story (outfits, hair, hats, props), and send a character sheet before the full render.
- Never copy another creator's character attire or designs; keep outfits original.
- **Captions (house style):** always make a captioned version too: ONE word at a time, Title Case, heavy white
  letters with a thick black outline and a quick pop-in, centred low in the frame. Use `tools/captions.py`
  (copy it into the project; it reads `work/words.json` and writes `frames_cap/`).
- **Camera & animation (house style):**
  - Characters fill the frame: mostly medium close-ups and medium shots (`frame()` in `framing.js`, kinds `cu`, `mcu`, `ms`,
    `two`), with a camera at or slightly below eye level and a long lens (fov 26-32) so the background compresses.
  - Strong background blur on every non-wide shot (`cinf` 14-20, focus on the eyes). Wide/establishing shots only
    where the story needs geography, and keep them short.
  - Bright, sunny, saturated daylight by default (sat about 1.15-1.2, warm sun, soft shadows); switch light only for story beats.
  - Lively characters: idle sway and blinks always, an expression change or pose on every stressed word, anticipation and
    overshoot on actions. Prefer a cut or whip to a new close framing every 1-3 s over long slow wide moves.
