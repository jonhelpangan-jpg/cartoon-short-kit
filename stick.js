// stick.js: the house "stick" character style, kept separate from the original files.
// Build a project's toon.js as:  cat toonbase.js roman.js stick.js > toon.js
// (it shares the module scope of toonbase.js + roman.js, like roman.js does with toonbase.js).
// Stories draw characters with T.figureFront(p, outfitKey, opts): the same options as romanFront.

// extra outfits for the modern cast (detail = buttons | stripes | pocket)
Object.assign(OUTFITS, {
  hero: { tunic: "#2f7fd0", skin: SKIN, hair: "#3b2a20", detail: "pocket" },
  pj: { tunic: "#6f9be0", skin: SKIN, hair: "#3b2a20", detail: "stripes" },
  rain: { tunic: "#f2c230", dress: "#f2c230", skin: SKIN, hair: "#c8452a", curls: true, boots: "#2f6fb0", detail: "buttons" },
  fz1: { tunic: "#6f7f98", skin: "#e8cdb4", hair: "#4a3a30" },
  fz2: { tunic: "#8f7f70", skin: "#c99a78", hair: "#2a2220", cap: "#5a6070" },
  fz4: { tunic: "#9a7478", skin: "#d8b090", hair: "#3a2a24", dress: "#8a6a78" },
});

// ---------------- "stick" style: big round white head, pill body, stick limbs, dark mitt hands (our own design) ----------------
export const STYLE = { mode: "stick" };   // "stick" (house style) or "bean" (original)
const SINK = "#2b2533", HEADW = "#fbfbf9";
export const stickFront = (p, key, opts = {}) => {
  const O = typeof key === "string" ? OUTFITS[key] : key;
  const { expr = "neutral", blink = 0, look = 0, facing = 0, seed = 3, L = "hang", R = "hang", tilt = 0, headTilt = 0, bob = 0, step = 0, light = rad(-120) } = opts;
  const lid = lidOf(blink), thick = thickAngle(light), cx = 300, sole = 975;
  const legL = 222, torsoH = 236, tw = 74, hr = 146;
  const torsoBot = sole - legL - bob * 400, torsoTop = torsoBot - torsoH, hc = torsoTop - hr * 0.86, chin = hc + hr * 0.95, hipY = torsoBot - 12;
  p.rot = null;
  // ---- legs (thin lines, slight knee bend, small flat feet) ----
  for (const side of [-1, 1]) {
    const up = step ? Math.max(0, Math.sin(Math.PI * 2 * (step + (side > 0 ? 0.5 : 0)))) * 40 : 0;
    const hx = cx + side * 26, fx = cx + side * 34, fy = sole - 6 - up;
    p.stroke(curve([hx, hipY], [hx + side * 10 + (up ? side * 16 : 0), (hipY + fy) / 2], [fx, fy]), 11, SINK);
    const dir = facing || side; p.stroke([[fx - dir * 4, fy + 2], [fx + dir * 22, fy + 3]], 12, O.boots || SINK);
  }
  // ---- upper body (tilts about the hips) ----
  p.rot = tilt ? [rad(tilt), cx, hipY] : null;
  const flare = O.dress ? 24 : 0;
  const body = rrect(cx - tw, torsoTop, cx + tw, torsoBot, 62, 10).map(([x, y]) => [x + Math.sign(x - cx) * flare * Math.max(0, (y - torsoTop) / torsoH - 0.35), y]);
  p.gradFill(body, O.tunic, mul(O.tunic, SH_CLOTH), light);
  p.clip(body, () => {
    p.stroke([[cx - 30, torsoTop + 6], [cx, torsoTop + 40], [cx + 30, torsoTop + 6]], 5, mul(O.tunic, [0.6, 0.6, 0.65]));     // collar
    if (O.detail === "buttons") for (let i = 0; i < 4; i++) p.dot(cx + 3, torsoTop + 70 + i * 42, 6, mul(O.tunic, [0.55, 0.5, 0.45]));
    if (O.detail === "stripes") for (let i = 0; i < 6; i++) p.band([[cx - 90, torsoTop + 40 + i * 38], [cx + 90, torsoTop + 40 + i * 38]], mix(O.tunic, "#ffffff", 0.45), 9, 0);
    if (O.detail === "pocket") p.poly(rrect(cx - 45, torsoBot - 95, cx + 45, torsoBot - 40, 10), mul(O.tunic, [0.85, 0.85, 0.9]), 4);
    if (O.belt) p.band([[cx - 90, torsoBot - 40], [cx + 90, torsoBot - 40]], O.belt, 16, 3);
  });
  p.inkRing(body, 8, thick);
  // ---- arms ----
  const S = (s) => [cx + s * (tw - 8), torsoTop + 46];
  const arm = (s, pose) => {
    const [sx, sy] = S(s), P = (dx, dy) => [sx + s * dx, sy + dy];
    switch (pose) {
      case "up": return { e: P(36, -60), h: P(46, -150) };
      case "wave": return { e: P(46, -30), h: P(72 + 14 * Math.sin(opts.wv || 0), -122) };
      case "point": return { e: P(62, 4), h: P(132, -8), finger: true };
      case "hip": return { e: P(46, 60), h: P(4, 118) };
      case "reach": { const lf = (opts.lift || 0) * 60; return { e: P(62, -20 - lf * 0.5), h: P(128, -78 - lf) }; }
      case "cheek": return { e: P(44, 40), h: [cx + s * (hr * 0.86), hc + 46], face: true };
      case "temple": return { e: P(58, -14), h: [cx + s * (hr + 6), hc - 18], face: true, swirl: true };
      case "show": return { e: P(52, 52), h: P(76, -8) };
      case "umb": return { e: P(30, 54), h: P(22, 20) };
      case "thumb": return { e: P(42, 44), h: P(72, -6), thumb: true };
      case "belly": return { e: P(26, 80), h: [cx + s * 18, torsoTop + 150] };
      case "snap": return { e: P(52, -24), h: P(58, -112), snap: true };
      case "guard": return { e: P(30, 70), h: [cx + s * 46, hc + 92], face: true };
      case "punch": return { e: P(70, -2), h: P(150, -6) };
      case "windup": return { e: P(30, 40), h: P(12, -14) };
      case "lift": return { e: P(30, -50), h: P(18, -150) };
      case "swing": { const k = s < 0 ? (opts.swL || 0) : (opts.swR || 0); return { e: P(16 + 8 * k, 64), h: P(14 + 40 * k, 136 - 30 * Math.abs(k)) }; }
      default: return { e: P(10, 70), h: P(8, 148) };
    }
  };
  const arms = [arm(-1, L), arm(1, R)];
  const drawArm = (a, s) => {
    p.stroke(curve(S(s), a.e, a.h), 10, SINK);
    const [hx, hy] = a.h;
    if (opts.gloves) p.ell(hx, hy, 22, 20, "#d62f2f", 6);
    else { p.ell(hx, hy, 20, 18, SINK, 0); p.ell(hx - 5, hy - 6, 5, 4, "#5a5266", 0); }
    if (a.finger) { const dx = a.h[0] - a.e[0], dy = a.h[1] - a.e[1], l = Math.hypot(dx, dy); p.stroke([[hx, hy], [hx + dx / l * 22, hy + dy / l * 22]], 7, SINK); }
    if (a.thumb) p.stroke([[hx, hy], [hx + s * 6, hy - 24]], 7, SINK);
    if (a.snap) p.stroke([[hx, hy], [hx + s * 4, hy - 22]], 6, SINK);
    if (opts.drop && (s > 0) && (R === "show" || R === "reach")) { const dx = hx, dy = hy - 40; p.poly([[dx, dy - 46], [dx + 22, dy - 4], [dx + 19, dy + 16], [dx, dy + 26], [dx - 19, dy + 16], [dx - 22, dy - 4]], "#8fd4ff", 5); p.ell(dx - 7, dy + 4, 5, 8, "#ffffff", 0); }
  };
  arms.forEach((a, i) => { if (!a.face) drawArm(a, i ? 1 : -1); });
  // ---- head ----
  const [cpx, cpy] = rotAbout([cx, chin], rad(tilt), [cx, hipY]);
  const Ah = tilt + headTilt;
  p.rot = Ah ? [rad(Ah), cx, chin, cpx - cx, cpy - chin] : null;
  if (opts.umbrella) { const ux = arms[1].h[0], top = hc - hr * 2.0, w = hr * 1.75;
    p.stroke([[ux, arms[1].h[1]], [ux, top + 10]], 6, SINK);
    const can = ellPts(ux, top + hr * 0.5, w, hr * 0.62, 180, 360, 0, 40); for (let i = 6; i >= 0; i--) can.push([ux - w + i * w / 3, top + hr * 0.5 + (i % 2 ? 0 : 18)]);
    p.poly(can, opts.umbrella, 8); for (let i = 1; i < 6; i++) p.stroke([[ux, top - hr * 0.1], [ux - w + i * w / 3, top + hr * 0.5]], 3, mul(opts.umbrella, [0.7, 0.7, 0.7])); p.dot(ux, top - hr * 0.12, 7, SINK); }
  const H = { a: hr, b: hr * 1.04, nTop: 2.15, nBot: 2.3, egg: 0.06, asym: 0.02 * facing, rot: 0, noise: 0.004, seed };
  const hp = blobPts(cx, hc, H);
  if (O.hairStyle === "long") p.poly(blobPts(cx, hc + 30, { ...H, a: hr * 1.12, b: hr * 1.2 }), O.hair, 8);
  p.shadedFill(hp, HEADW, mul(HEADW, [0.86, 0.87, 0.93]), light, hr);
  p.inkRing(hp, 12, thick);
  // hair / headwear on top of the white head
  if (O.hair && O.hairStyle !== "bald") {
    if (O.curls) { for (let i = 0; i < 13; i++) { const a = Math.PI * (1.0 + i / 12), r = 1.0; p.ell(cx + Math.cos(a) * hr * r, hc - 0.18 * hr + Math.sin(a) * hr * 0.98 * r, 32, 32, O.hair, 7); }
      for (const s2 of [-1, 1]) for (let k = 0; k < 2; k++) p.ell(cx + s2 * hr * 1.0, hc + (0.05 + k * 0.32) * hr, 27, 29, O.hair, 7); }
    else { const cap = ellPts(cx, hc - hr * 0.08, hr * 1.03, hr * 0.98, 190, 350, 0, 40); const fr = []; for (let i = 0; i <= 8; i++) { const x = cx + hr * 0.98 - i * hr * 0.245; fr.push([x, hc - hr * 0.38 + (i % 2 ? 16 : 0) + Math.abs(i - 4) * -6]); }
      p.poly([...cap, ...fr], O.hair, 7);
      if (O.hairStyle === "bun") p.ell(cx, hc - hr * 1.08, 34, 30, O.hair, 7); }
  }
  if (O.cap) { const cap = ellPts(cx, hc - hr * 0.2, hr * 1.02, hr * 0.92, 180, 360, 0, 40); cap.push([cx + hr * 1.02, hc - hr * 0.2]); p.poly(cap, O.cap, 7);
    p.poly([[cx + facing * 10 - hr * 0.2 + (facing || 1) * hr * 0.6, hc - hr * 0.22], [cx + (facing || 1) * hr * 1.45, hc - hr * 0.16], [cx + (facing || 1) * hr * 1.4, hc - hr * 0.06], [cx + (facing || 1) * hr * 0.3, hc - hr * 0.1]], mul(O.cap, [0.8, 0.8, 0.8]), 6); }
  faceFront(p, cx, hc + 10, hr * 2.0, expr, facing, look, lid, false, HEADW, O.moustache, false);
  if (opts.glow) { const g0 = opts.glow, u = hr * 2.0 / 100; for (const s of [-1, 1]) { const x = cx + 7 * u * facing + s * 13 * u;
      p.ell(x, hc + 10, 15 * u, 13 * u, `rgba(120,236,255,${(0.45 * g0).toFixed(3)})`, 0); p.ell(x, hc + 10, 8.5 * u, 8 * u, `rgba(150,245,255,${g0.toFixed(3)})`, 0); p.ell(x, hc + 10, 4 * u, 4 * u, `rgba(255,255,255,${g0.toFixed(3)})`, 0); } }
  arms.forEach((a, i) => { if (a.face) drawArm(a, i ? 1 : -1); });
  if (arms.some((a) => a.swirl)) { const a = arms.find((x) => x.swirl), [hx, hy] = a.h, ph = opts.swirl || 0, pts = [];
    for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 4 + ph, r = 8 + i * 1.4; pts.push([hx + Math.cos(t) * r, hy - 80 + Math.sin(t) * r]); }
    p.stroke(pts, 6, "#ffffff"); p.stroke(pts, 3, INK); }
  p.rot = null;
};

/** draw a character in the current STYLE (stick by default, "bean" falls back to the original romanFront) */
export const figureFront = (p, key, opts = {}) => (STYLE.mode === "stick" ? stickFront(p, key, opts) : romanFront(p, key, opts));

/** paint a face (eyes, brows, mouth) on a 512x512 canvas for the 3D characters (rig3d.js); transparent background */
export const drawFace3D = (g, expr = "neutral", look = 0, blink = 0, skin = SKIN) => {
  const p = new Pen(g); faceFront(p, 256, 240, 500, expr, 0, look, lidOf(blink), false, skin, null, false);
};

// ---------------- extra effects (hand, trophy, confetti, shards, wind) ----------------
/** reaching arm entering from screen-right, open palm up at (300, 540) */
export const fxHand = (p, sleeve = "#2f7fd0", skin = SKIN) => {
  p.band([[640, 600], [470, 572], [352, 556]], sleeve, 64, 6, "butt");
  p.band([[360, 556], [338, 552]], mix(sleeve, "#ffffff", 0.25), 66, 6, "butt");
  const palm = [[250, 540], [262, 520], [300, 512], [338, 520], [348, 540], [330, 566], [270, 566]];
  for (let i = 0; i < 4; i++) p.ell(236 + i * 2, 526 + i * 12, 22, 10, skin, 6);
  p.poly(palm, skin, 7);
  p.ell(300, 508, 12, 26, skin, 6, 0, 360, -0.6);
  p.stroke([[276, 548], [320, 548]], 4, mul(skin, [0.8, 0.7, 0.7]));
};
/** gold trophy, base on the sole line (975) */
export const fxTrophy = (p) => {
  p.poly(rrect(220, 930, 380, 975, 8), "#6b4a2e", 8);
  p.poly([[270, 930], [330, 930], [314, 860], [286, 860]], "#e6b23a", 8);
  for (const s of [-1, 1]) p.stroke(ellPts(300 + s * 92, 760, 40, 44, s > 0 ? -90 : 90, s > 0 ? 90 : 270, 0, 20), 16);
  for (const s of [-1, 1]) p.stroke(ellPts(300 + s * 92, 760, 40, 44, s > 0 ? -90 : 90, s > 0 ? 90 : 270, 0, 20), 9, "#f2c84a");
  const cup = [[190, 690], [410, 690], [400, 760], [360, 840], [300, 868], [240, 840], [200, 760]];
  p.poly(cup, "#f2c84a", 9);
  p.stroke([[232, 712], [244, 790]], 12, "#fff3b8");
  p.dot(300, 760, 20, "#fff3b8");
};
/** confetti layer: t = time in s, seed per layer. Pieces drift down and spin. */
export const fxConfetti = (p, t, seed = 1) => {
  const cols = ["#ff5a5a", "#ffd23a", "#4ad08a", "#4aa8ff", "#c86aff", "#ff9a3a"];
  for (let i = 0; i < 46; i++) {
    const r1 = Math.sin(i * 12.9898 + seed * 78.2) * 43758.5453, a = r1 - Math.floor(r1), r2 = Math.sin(i * 4.1 + seed * 9.7) * 9631.3, b = r2 - Math.floor(r2);
    const y = ((b * 1000 + t * (180 + a * 120)) % 1100) - 80, x = a * 600 + Math.sin(t * 2 + i) * 24, rot = t * (3 + a * 4) + i, w = 12 + a * 8;
    const pts = [[-w, -6], [w, -6], [w, 6], [-w, 6]].map(([px, py]) => [x + px * Math.cos(rot) - py * Math.sin(rot) * Math.abs(Math.cos(t * 5 + i)), y + px * Math.sin(rot) + py * Math.cos(rot)]);
    p.poly(pts, cols[i % cols.length], 3);
  }
};
/** shards bursting from the centre (300, 500), k 0..1 */
export const fxShards = (p, k) => {
  const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - k * k);
  for (let i = 0; i < 26; i++) {
    const a = i * 2.39996, d = (60 + (i % 5) * 40) * (0.3 + k * 1.6), sz = 26 + (i % 4) * 12, rot = a + k * (4 + i % 3);
    const x = 300 + Math.cos(a) * d * 0.9, y = 520 + Math.sin(a) * d * 1.3 + k * k * 180;
    const pts = [[0, -sz], [sz * 0.7, sz * 0.4], [-sz * 0.5, sz * 0.6]].map(([px, py]) => [x + px * Math.cos(rot) - py * Math.sin(rot), y + px * Math.sin(rot) + py * Math.cos(rot)]);
    p.poly(pts, "#e9feff", 5);
  }
  g.restore();
};
/** wind / speed lines, t 0..1 phase */
export const fxWind = (p, t) => {
  for (let i = 0; i < 7; i++) { const y = 180 + i * 110, x0 = ((t * 900 + i * 230) % 900) - 300, L = 120 + (i % 3) * 60;
    p.stroke([[x0, y], [x0 + L, y + 6]], 18, "#ffffff"); p.stroke([[x0 + 6, y + 1], [x0 + L - 6, y + 5]], 5, INK); }
};
