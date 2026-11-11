# cartoon-short-kit: house rules for making videos

- **Original files stay untouched.** The house style lives only in separate files: `stick.js` (2D characters + face painter), `rig3d.js` (3D characters), `scenes.js` (location library),
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
- **Captions (house style):** always make a captioned version too, in the original phrase style: short phrases of
  1-3 words in bold UPPERCASE, white with a dark outline, the spoken word highlighted in yellow, low in the frame.
  Use `tools/captions.py` (copy it into the project; it reads `work/words.json`, splits phrases automatically and
  writes `frames_cap/`). `CAP_STYLE=word` gives the one-word-at-a-time style instead.
- **Camera & animation (house style):**
  - Characters fill the frame: mostly medium close-ups and medium shots (`frame()` in `framing.js`, kinds `cu`, `mcu`, `ms`,
    `two`), with a camera at or slightly below eye level and a long lens (fov 26-32) so the background compresses.
  - Strong background blur on every non-wide shot (`cinf` 14-20, focus on the eyes). Wide/establishing shots only
    where the story needs geography, and keep them short.
  - Bright, sunny, saturated daylight by default (sat about 1.15-1.2, warm sun, soft shadows); switch light only for story beats.
  - Lively characters: idle sway and blinks always, an expression change or pose on every stressed word, anticipation and
    overshoot on actions. Prefer a cut or whip to a new close framing every 1-3 s over long slow wide moves.
- **A different world for every story (house rule):**
  - Build each story's locations to fit it. Start from `scenes.js` (beach, school, forest, subway, desert, space,
    market, snow) and add new scenes to that library whenever a story needs a new place, so it keeps growing.
  - Never use the same main location as either of the last two videos (the old town street included). Give each
    story its own palette and time of day (`SCENE_LIGHTS` has a starting preset per scene).
- **Camera variety (house rule):** every short uses at least 6-8 different setups from `framing.js`: close-ups, over-the-shoulder
  (`overShoulder`), top-down (`topDown`), worm's-eye (`worm`), tilted (`dutch`), point of view (`pov`), through a foreground
  object (`through`), tracking (`track`), inserts on hands/objects, and one dolly zoom (`dollyZoom`) on the biggest surprise.
  Put the shot type in work/PLAN.md and run `checkVariety()` before the full render: no two neighbouring shots may share a type.
