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
