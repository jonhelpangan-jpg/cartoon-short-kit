// framing.js: house camera framing for vertical 9:16 shorts (standalone, no dependencies).
// import { frame, FRAMING } from './framing.js';
/** Subjects fill the frame, slightly low eye-level camera, long lens so the background compresses and blurs.
 *  `eye` = [x, y, z] of the character's eyes; `dir` = [dx, dz] from subject toward the camera.
 *  kind: 'cu' (face), 'mcu' (head + chest), 'ms' (to the waist), 'full' (whole body), 'two' (two characters ~1.4 m apart).
 *  Returns a camera key {f, pos, look, fov} for camFromKeys(), plus the recommended lens blur {focus, cinf} for dofAt(). */
export const FRAMING = { cu: [1.5, 26, -0.02, 0.0, 20], mcu: [2.3, 28, -0.08, -0.06, 18], ms: [3.1, 30, -0.22, -0.2, 16], full: [5.0, 32, -0.45, -0.55, 12], two: [4.2, 32, -0.25, -0.3, 14] };
export const frame = (eye, kind = 'mcu', dir = [0, 1], { side = 0, f } = {}) => {
  const [d, fov, camDy, lookDy, cinf] = FRAMING[kind], l = Math.hypot(dir[0], dir[1]) || 1, ux = dir[0] / l, uz = dir[1] / l;
  const pos = [eye[0] + ux * d - uz * side, eye[1] + camDy, eye[2] + uz * d + ux * side];
  const look = [eye[0], eye[1] + lookDy, eye[2]];
  return { f, pos, look, fov, focus: d, cinf };
};

// ---------- shot grammar: varied camera setups (all return camera keys {f, pos, look, fov, roll?} for camFromKeys) ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], addv = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const norm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
/** over the shoulder of A (eye position) looking at B; side +1 = A's right shoulder in frame-left */
export const overShoulder = (eyeA, eyeB, { f, side = 1, back = 1.0, fov = 32 } = {}) => {
  const d = norm(sub(eyeA, eyeB)), right = norm([d[2], 0, -d[0]]);
  return { f, pos: addv(addv(addv(eyeA, d, back), right, 0.45 * side), [0, 1, 0], 0.12), look: addv(eyeB, [0, -0.05, 0]), fov };
};
/** straight down from above (map / helpless / overwhelmed moments). Indoors keep h below the ceiling (about 2.8-3.1). */
export const topDown = (p, { f, h = 5.5, fov = 40, roll = 0 } = {}) => ({ f, pos: [p[0] + 0.01, p[1] + h, p[2] + 0.02], look: [p[0], p[1], p[2]], fov, roll });
/** worm's-eye: camera near the ground looking up at the character (power, awe, menace) */
export const worm = (eye, dir = [0, 1], { f, d = 1.6, fov = 40 } = {}) => { const l = Math.hypot(dir[0], dir[1]) || 1;
  return { f, pos: [eye[0] + dir[0] / l * d, 0.22, eye[2] + dir[1] / l * d], look: [eye[0], eye[1] + 0.1, eye[2]], fov }; };
/** tilted horizon for tension: wraps any key */
export const dutch = (key, deg = 12) => ({ ...key, roll: (key.roll || 0) + deg });
/** point of view: from just in front of a character's eyes toward a target (the camera starts outside the head) */
export const pov = (eye, target, { f, fov = 50, ahead = 0.4 } = {}) => { const d = norm(sub(target, eye)); return { f, pos: addv(eye, d, ahead), look: target, fov }; };
/** through a foreground object: camera sits just behind `fg` (bars, leaves, doorway) looking at the subject */
export const through = (fg, subject, { f, behind = 0.6, fov = 32 } = {}) => { const d = norm(sub(fg, subject)); return { f, pos: addv(fg, d, behind), look: subject, fov }; };
/** tracking alongside a moving subject: pass the subject position at this frame */
export const track = (p, { f, side = [1, 0.6], d = 2.6, h = 1.3, lead = 0.6, dirX = 1, fov = 36 } = {}) => { const l = Math.hypot(side[0], side[1]) || 1;
  return { f, pos: [p[0] + side[0] / l * d, h, p[2] + side[1] / l * d], look: [p[0] + lead * dirX, p[1] + 1.15, p[2]], fov }; };
/** dolly zoom ("vertigo"): keeps the subject the same size while the background stretches. Returns two keys. */
export const dollyZoom = (eye, dir = [0, 1], { f0, f1, d0 = 1.6, d1 = 4.5, fov0 = 50 } = {}) => {
  const l = Math.hypot(dir[0], dir[1]) || 1, ux = dir[0] / l, uz = dir[1] / l, w = 2 * d0 * Math.tan(fov0 * Math.PI / 360);
  const fov1 = 360 / Math.PI * Math.atan(w / (2 * d1));
  return [{ f: f0, pos: [eye[0] + ux * d0, eye[1], eye[2] + uz * d0], look: eye, fov: fov0 }, { f: f1, pos: [eye[0] + ux * d1, eye[1], eye[2] + uz * d1], look: eye, fov: fov1, ease: 'smooth' }];
};
export const SHOT_TYPES = ['cu', 'mcu', 'ms', 'full', 'two', 'wide', 'ots', 'top', 'worm', 'dutch', 'pov', 'through', 'track', 'insert', 'dolly'];
/** plan check: list of {id, type}. Warns when neighbours repeat a type and reports how many different types are used. */
export const checkVariety = (plan, minTypes = 6) => {
  const warn = []; for (let i = 1; i < plan.length; i++) if (plan[i].type === plan[i - 1].type) warn.push(`${plan[i - 1].id} -> ${plan[i].id}: both '${plan[i].type}'`);
  const used = new Set(plan.map((p) => p.type)); if (used.size < minTypes) warn.push(`only ${used.size} shot types (want ${minTypes}+)`);
  return { ok: !warn.length, used: [...used], warn };
};
