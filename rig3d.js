// rig3d.js: fully 3D cartoon characters (our own design) for the cartoon-short-kit engine.
// Sphere head with a painted-on face (the kit's face drawings), capsule body, jointed tube limbs (2-bone IK),
// sphere mitten hands, 3D hair / hats / glasses. Posed per frame from the same option names as the 2D cards.
//   import { Char3D, OUTFITS3D } from './rig3d.js';
//   const c = new Char3D(scene, T, 'kid');  c.pose({ x, y, z, yaw, expr, blink, look, L, R, tilt, headTilt, step, bob });
import * as THREE from './lib/three.module.js';

const grad3 = (() => { const n = 16, d = new Uint8Array(n * 4); for (let i = 0; i < n; i++) { const t = i / (n - 1), v = Math.round(255 * (0.5 + 0.5 * Math.pow(t, 0.8))); d.set([v, v, v, 255], i * 4); } const t = new THREE.DataTexture(d, n, 1); t.minFilter = t.magFilter = THREE.LinearFilter; t.needsUpdate = true; return t; })();
// LOOK: house default is a 2D cartoon look on 3D rigs ("2D look, 3D motion"): flat colour with one hard shadow tone and
// bean-shaped heads. Set LOOK.flat = false / LOOK.bean = false before creating characters for smooth 3D shading / round heads.
export const LOOK = { flat: true, bean: true };
const gradFlat = (() => { const d = new Uint8Array([150, 150, 150, 255, 255, 255, 255, 255]); const t = new THREE.DataTexture(d, 2, 1); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const mat = (color, extra = {}) => new THREE.MeshToonMaterial({ gradientMap: LOOK.flat ? gradFlat : grad3, color, ...extra });
const Y = new THREE.Vector3(0, 1, 0), tv = new THREE.Vector3(), tq = new THREE.Quaternion();
const D = { hip: 0.5, bodyR: 0.19, bodyLen: 0.24, headR: 0.265, arm: 0.215, leg: 0.255, limbR: 0.026, legR: 0.03, handR: 0.048 };
D.bodyMid = D.hip + D.bodyR + D.bodyLen / 2 - 0.05; D.top = D.bodyMid + D.bodyLen / 2 + D.bodyR; D.headY = D.top + D.headR * 0.78;
export const EYE_Y = D.headY + 0.02;   // eye height (m), close to the 2D cards' 1.32 m

export const OUTFITS3D = {
  kid: { skin: '#e8b48a', shirt: '#2f9a8a', pants: '#2a3348', hair: '#3b2a20', detail: 'collar', shoes: '#2b2533' },
  gran: { skin: '#f0caa8', shirt: '#8a5aa8', pants: '#4a3a5a', hair: '#e8e4dc', hairStyle: 'bun', glasses: true, detail: 'buttons', shoes: '#3a2a24' },
  baker: { skin: '#a8714c', shirt: '#f2efe6', pants: '#3a3a44', hat: 'beanie', hatColor: '#e05a3a', apron: '#f6c64a', shoes: '#2b2533' },
  boss: { skin: '#d8a27c', shirt: '#2f4a7a', pants: '#1f2638', hair: '#1e1714', moustache: '#2a1e18', detail: 'tie', tie: '#c83a3a', shoes: '#1a1820' },
  rain: { skin: '#f3cfae', shirt: '#f2c230', pants: '#f2c230', hair: '#c8452a', hairStyle: 'curls', detail: 'buttons', shoes: '#2f6fb0', coat: true },
  sprinter: { skin: '#c98a5e', shirt: '#e8423a', stripes: '#ffffff', stripeCount: 1, pants: '#e8423a', hair: '#24180f', hairStyle: 'spiky', headband: '#ffffff', detail: 'zip', shoes: '#f4f1ea', sleeves: '#e8423a' },
  ranger: { skin: '#e8c09a', shirt: '#6a7a4a', pants: '#3a3a30', hair: '#6a4a30', earDefenders: '#f2a23a', glasses: 'safety', detail: 'buttons', shoes: '#2b2533' },
  trav: { skin: '#c8946a', shirt: '#d8a23a', pants: '#3a5a8a', hair: '#2a1e18', hairStyle: 'curls', detail: 'collar', shoes: '#f4f1ea' },
  oldme: { skin: '#e2b896', shirt: '#d8a23a', pants: '#3a4a6a', hair: '#f4f1ea', hairStyle: 'sides', moustache: '#f4f1ea', glasses: true, detail: 'collar', shoes: '#5a4030' },
  sci1: { skin: '#e8c4a0', shirt: '#f4f4f0', pants: '#f4f4f0', coat: true, hair: '#2a2220', glasses: 'shades', detail: 'buttons', shoes: '#1a1820' },
  sci2: { skin: '#9a6a48', shirt: '#f4f4f0', pants: '#f4f4f0', coat: true, hair: '#1a1614', hairStyle: 'bun', glasses: 'shades', detail: 'buttons', shoes: '#1a1820' },
  mind: { skin: '#e0b08a', shirt: '#3f8a5a', pants: '#2a3348', hair: '#3b2a20', glasses: true, detail: 'hood', shoes: '#2b2533' },
  friend: { skin: '#8a5a3c', shirt: '#e8e4dc', stripes: '#3a6ab0', pants: '#4a4a58', hat: 'beanie', hatColor: '#e0a030', shoes: '#f4f1ea' },
  cowork: { skin: '#f0caa8', shirt: '#d8e4f0', pants: '#3a3f4a', hair: '#c89a5a', detail: 'tie', tie: '#3a5aa8', shoes: '#1a1820' },
  fz1: { skin: '#e8cdb4', shirt: '#6f7f98', pants: '#3a3f4a', hair: '#4a3a30', detail: 'collar' },
  fz2: { skin: '#c99a78', shirt: '#8f7f70', pants: '#3a3430', hat: 'cap', hatColor: '#5a6070' },
  fz3: { skin: '#f0d0b8', shirt: '#6a7a6a', pants: '#3a4038', hair: '#8a8070', detail: 'buttons' },
  fz4: { skin: '#d8b090', shirt: '#9a7478', pants: '#9a7478', hair: '#3a2a24', hairStyle: 'bun', coat: true },
  fz5: { skin: '#a8785a', shirt: '#707494', pants: '#2e3040', hair: '#1a1614', detail: 'collar' },
  fz6: { skin: '#ecd2bc', shirt: '#7a8e96', pants: '#3a4448', hair: '#b0a090', moustache: '#9a9080', detail: 'tie', tie: '#6a5a5a' },
  waiter: { skin: '#b07a52', shirt: '#f4f1ea', vest: '#2a2630', pants: '#2a2630', hair: '#1e1714', detail: 'bowtie', shoes: '#1a1820' },
};

/** shirt texture: base colour, optional stripes, pants band on the lower part */
const shirtTex = (o) => {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = o.shirt; g.fillRect(0, 0, 256, 256);
  if (o.stripes && o.stripeCount === 1) { g.fillStyle = o.stripes; g.fillRect(0, 70, 256, 22); }
  else if (o.stripes) for (let i = 0; i < 9; i++) { g.fillStyle = o.stripes; g.fillRect(0, 24 + i * 26, 256, 12); }
  if (o.vest) { g.fillStyle = o.vest; g.fillRect(0, 0, 100, 256); g.fillRect(156, 0, 100, 256); }
  const pantsTop = o.coat ? 256 : 256 * 0.70; g.fillStyle = o.pants || o.shirt; g.fillRect(0, pantsTop, 256, 256 - pantsTop);
  if (!o.coat) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, pantsTop - 6, 256, 8); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; return t;
};

export class Char3D {
  constructor(scene, T, key, opts = {}) {
    const o = typeof key === 'string' ? OUTFITS3D[key] : key; this.o = o; this.T = T;
    this.root = new THREE.Group(); scene.add(this.root);
    this.upper = new THREE.Group(); this.upper.position.y = D.hip; this.root.add(this.upper);   // pivots at the hips
    const add = (geo, m, parent, x = 0, y = 0, z = 0) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.castShadow = true; me.receiveShadow = false; parent.add(me); return me; };
    // body: capsule with shirt/pants texture (v runs bottom -> top)
    const bodyGeo = new THREE.CapsuleGeometry(D.bodyR, D.bodyLen, 10, 28);
    { const uv = bodyGeo.attributes.uv, pos = bodyGeo.attributes.position, h = D.bodyLen + 2 * D.bodyR; for (let i = 0; i < uv.count; i++) uv.setY(i, (pos.getY(i) + h / 2) / h); }
    this.body = add(bodyGeo, mat('#ffffff', { map: shirtTex(o) }), this.upper, 0, D.bodyMid - D.hip, 0); this.body.scale.set(1.04, 1, 0.86);
    const bodyTopY = D.top - D.hip;
    const front = (y) => D.bodyR * 0.86 * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(y - (D.bodyMid - D.hip)) - D.bodyLen / 2) / D.bodyR, 2)));
    if (o.detail === 'buttons') for (let i = 0; i < 3; i++) { const y = bodyTopY - 0.12 - i * 0.1; add(new THREE.SphereGeometry(0.014, 8, 6), mat('#3a2a24'), this.upper, 0, y, front(y) + 0.004); }
    if (o.detail === 'collar' || o.detail === 'tie' || o.detail === 'buttons') for (const s of [-1, 1]) { const cl = add(new THREE.ConeGeometry(0.055, 0.09, 3), mat(o.detail === 'tie' ? '#f4f1ea' : o.shirt), this.upper, s * 0.05, bodyTopY - 0.07, front(bodyTopY - 0.07) - 0.01); cl.rotation.set(Math.PI, 0, s * 0.5); cl.scale.z = 0.4; }
    if (o.detail === 'tie') { const y = bodyTopY - 0.17; const tie = add(new THREE.ConeGeometry(0.04, 0.2, 4), mat(o.tie), this.upper, 0, y, front(y) + 0.01); tie.rotation.x = Math.PI; tie.scale.z = 0.3; }
    if (o.detail === 'hood') { const hd = add(new THREE.TorusGeometry(0.15, 0.05, 10, 24), mat(o.shirt), this.upper, 0, bodyTopY - 0.02, -0.08); hd.rotation.x = Math.PI / 2 - 0.4; hd.scale.set(1.1, 1, 0.7);
      for (const s2 of [-1, 1]) add(new THREE.CylinderGeometry(0.006, 0.006, 0.14, 6), mat('#f4f1ea'), this.upper, s2 * 0.04, bodyTopY - 0.12, front(bodyTopY - 0.12) + 0.008); }
    if (o.detail === 'zip') { const y = bodyTopY - 0.2; add(new THREE.BoxGeometry(0.012, 0.32, 0.01), mat('#d8d8d8'), this.upper, 0, y, front(y) + 0.004); }
    if (o.detail === 'bowtie') for (const s2 of [-1, 1]) { const y = bodyTopY - 0.06; const b = add(new THREE.ConeGeometry(0.035, 0.06, 4), mat('#c83a3a'), this.upper, s2 * 0.028, y, front(y) + 0.012); b.rotation.z = s2 * Math.PI / 2; b.scale.z = 0.5; }
    this.medal = new THREE.Group(); this.medal.visible = false; this.upper.add(this.medal);
    { const y = bodyTopY - 0.2; for (const s2 of [-1, 1]) { const r = add(new THREE.BoxGeometry(0.03, 0.2, 0.006), mat('#2f6fd0'), this.medal, s2 * 0.05, y + 0.1, front(y + 0.1) + 0.006); r.rotation.z = s2 * -0.35; }
      add(new THREE.CylinderGeometry(0.05, 0.05, 0.012, 24), mat('#f0bf3a'), this.medal, 0, y, front(y) + 0.012).rotation.x = Math.PI / 2; }
    if (o.apron) { const y = D.bodyMid - D.hip - 0.02; const ap = add(new THREE.CylinderGeometry(D.bodyR * 1.07, D.bodyR * 1.1, 0.36, 24, 1, true, -0.9, 1.8), mat(o.apron, { side: THREE.DoubleSide }), this.upper, 0, y, 0); ap.scale.set(1.04, 1, 0.9); ap.rotation.y = Math.PI / 2 - Math.PI / 2; }
    // head (yaw / tilt pivot at the neck)
    this.neck = new THREE.Group(); this.neck.position.y = bodyTopY - 0.02; this.upper.add(this.neck);
    const hy = D.headY - D.top + 0.02;
    this.head = add(new THREE.SphereGeometry(D.headR, 40, 28), mat(o.skin), this.neck, 0, hy, 0); this.head.receiveShadow = false;
    // painted face: a thin sphere shell over the front of the head, planar-mapped from the front
    const R = D.headR * 1.006, fg = new THREE.SphereGeometry(R, 48, 32, Math.PI / 2 - 1.15, 2.3, 0.35, 1.75);
    { const uv = fg.attributes.uv, pos = fg.attributes.position, k = 0.92; for (let i = 0; i < uv.count; i++) uv.setXY(i, 0.5 + pos.getX(i) / (2 * R * k), 0.5 + pos.getY(i) / (2 * R * k)); }
    this.faceC = document.createElement('canvas'); this.faceC.width = this.faceC.height = 512;
    this.faceT = new THREE.CanvasTexture(this.faceC); this.faceT.colorSpace = THREE.SRGBColorSpace; this.faceT.anisotropy = 4;
    this.face = add(fg, mat('#ffffff', { map: this.faceT, transparent: true, alphaTest: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }), this.neck, 0, hy, 0); this.face.castShadow = false; this.face.receiveShadow = false;
    this.faceKey = '';
    // hair / hats / glasses
    const hairM = mat(o.hair || '#3b2a20');
    if (o.hair && o.hairStyle !== 'curls' && o.hairStyle !== 'none' && o.hairStyle !== 'sides') { const cap = add(new THREE.SphereGeometry(D.headR * 1.035, 36, 20, 0, Math.PI * 2, 0, 1.25), hairM, this.neck, 0, hy, 0); cap.rotation.x = -0.42; }
    if (o.hairStyle === 'sides') for (const s2 of [-1, 1]) { const t = add(new THREE.SphereGeometry(0.1, 14, 10), hairM, this.neck, s2 * D.headR * 0.92, hy + 0.02, -0.06); t.scale.set(0.7, 1.1, 1.3); }
    if (o.hairStyle === 'bun') add(new THREE.SphereGeometry(0.09, 20, 14), hairM, this.neck, 0, hy + D.headR * 0.95, -0.08);
    if (o.hairStyle === 'curls') { for (let i = 0; i < 26; i++) { const th = 0.15 + (i % 13) / 12 * 1.15, ph = (i < 13 ? 0 : 0.24) + (i % 13) * 0.48 + Math.PI * 0.95; const r = D.headR * 1.0;
        const x = r * Math.sin(th) * Math.cos(ph), y = r * Math.cos(th) * 0.95, z = r * Math.sin(th) * Math.sin(ph); if (z > 0.11 && y < 0.2) continue; add(new THREE.SphereGeometry(0.07, 14, 10), hairM, this.neck, x, hy + y, z); }
      add(new THREE.SphereGeometry(D.headR * 1.04, 30, 16, 0, Math.PI * 2, 0, 1.3), hairM, this.neck, 0, hy, 0).rotation.x = -0.5;
      for (let i = 0; i < 7; i++) { const a2 = -0.9 + i * 0.3; add(new THREE.SphereGeometry(0.068, 14, 10), hairM, this.neck, Math.sin(a2) * D.headR * 0.85, hy + D.headR * (0.55 + 0.25 * Math.cos(a2)), Math.cos(a2) * D.headR * 0.62); } }
    if (o.hat === 'beanie') { const b = add(new THREE.SphereGeometry(D.headR * 1.06, 32, 18, 0, Math.PI * 2, 0, 1.0), mat(o.hatColor), this.neck, 0, hy, 0); b.rotation.x = -0.3;
      add(new THREE.TorusGeometry(D.headR * 0.9, 0.035, 10, 32), mat(o.hatColor), this.neck, 0, hy + 0.15, -0.05).rotation.x = Math.PI / 2 + 0.3; add(new THREE.SphereGeometry(0.05, 12, 8), mat('#f4f1ea'), this.neck, 0, hy + D.headR * 1.05, -0.02); }
    if (o.headband) add(new THREE.TorusGeometry(D.headR * 0.995, 0.028, 10, 40), mat(o.headband), this.neck, 0, hy + 0.1, -0.02).rotation.x = Math.PI / 2 + 0.12;
    if (o.earDefenders) { for (const s2 of [-1, 1]) { const e = add(new THREE.CylinderGeometry(0.075, 0.075, 0.06, 20), mat(o.earDefenders), this.neck, s2 * D.headR * 0.98, hy, 0); e.rotation.z = Math.PI / 2; }
      const band = add(new THREE.TorusGeometry(D.headR * 1.04, 0.018, 8, 32, Math.PI), mat('#2b2533'), this.neck, 0, hy, 0); band.rotation.y = 0; }
    if (o.glasses === 'safety') { const g = add(new THREE.CylinderGeometry(D.headR * 1.02, D.headR * 1.02, 0.07, 30, 1, true, -0.75, 1.5), new THREE.MeshToonMaterial({ gradientMap: grad3, color: '#bfe8ff', transparent: true, opacity: 0.45, side: THREE.DoubleSide }), this.neck, 0, hy + 0.025, 0); g.rotation.y = Math.PI / 2 - Math.PI / 2; }
    if (o.hairStyle === 'spiky') { for (let i = 0; i < 9; i++) { const a = -1.2 + i * 0.3, sp = add(new THREE.ConeGeometry(0.06, 0.16, 6), hairM, this.neck, Math.sin(a) * 0.16, hy + D.headR * 0.86 + Math.cos(a * 1.4) * 0.02, -0.04 - Math.abs(a) * 0.03); sp.rotation.set(-0.5, 0, -a * 0.6); } }
    if (o.hat === 'cap') { const cm = mat(o.hatColor || '#5a6070'); const c = add(new THREE.SphereGeometry(D.headR * 1.05, 32, 16, 0, Math.PI * 2, 0, 1.25), cm, this.neck, 0, hy, 0); c.rotation.x = -0.2;
      const br = add(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 24, 1, false, 0, Math.PI), cm, this.neck, 0, hy + 0.1, D.headR * 0.78); br.rotation.y = Math.PI / 2; br.scale.set(1, 1, 0.75); }
    if (o.glasses === 'shades') { for (const s2 of [-1, 1]) { const g = add(new THREE.CylinderGeometry(0.052, 0.052, 0.012, 24), mat('#141218'), this.neck, s2 * 0.068, hy + 0.022, D.headR * 0.97); g.rotation.set(Math.PI / 2, 0, 0); g.rotation.y = s2 * 0.26; }
      add(new THREE.CylinderGeometry(0.005, 0.005, 0.04, 6), mat('#141218'), this.neck, 0, hy + 0.03, D.headR * 1.0).rotation.z = Math.PI / 2; }
    if (o.glasses && o.glasses !== 'safety' && o.glasses !== 'shades') { for (const s of [-1, 1]) { const g = add(new THREE.TorusGeometry(0.05, 0.007, 8, 28), mat('#2b2533'), this.neck, s * 0.068, hy + 0.022, D.headR * 0.975); g.rotation.y = s * 0.26; }
      add(new THREE.CylinderGeometry(0.005, 0.005, 0.04, 6), mat('#2b2533'), this.neck, 0, hy + 0.03, D.headR * 1.0).rotation.z = Math.PI / 2; }
    if (o.moustache) for (const s of [-1, 1]) { const m = add(new THREE.SphereGeometry(0.045, 14, 10), mat(o.moustache), this.neck, s * 0.04, hy - 0.06, D.headR * 0.93); m.scale.set(1.3, 0.55, 0.6); m.rotation.z = s * -0.25; }
    // limbs (tubes placed between joints every frame) + mitten hands + shoes
    const limbM = mat(o.sleeves || (o.coat ? o.shirt : o.skin)), legM = mat(o.pants || '#2a3348'), handM = mat(o.skin), shoeM = mat(o.shoes || '#2b2533');
    const tube = (r, m, parent) => add(new THREE.CylinderGeometry(r, r, 1, 12), m, parent);
    this.arms = [-1, 1].map((s) => ({ s, a: tube(D.limbR, limbM, this.upper), b: tube(D.limbR, o.sleeves ? mat(o.sleeves) : mat(o.skin), this.upper), j: add(new THREE.SphereGeometry(D.limbR, 10, 8), limbM, this.upper), h: add(new THREE.SphereGeometry(D.handR, 16, 12), handM, this.upper) }));
    this.legs = [-1, 1].map((s) => ({ s, a: tube(D.legR, legM, this.root), b: tube(D.legR, legM, this.root), j: add(new THREE.SphereGeometry(D.legR, 10, 8), legM, this.root), f: add(new THREE.SphereGeometry(0.06, 16, 10), shoeM, this.root) }));
    this.legs.forEach((l) => l.f.scale.set(0.9, 0.55, 1.5));
    this.umb = new THREE.Group(); this.umb.visible = false; this.upper.add(this.umb);
    this.umbMat = mat('#3a6ab0', { side: THREE.DoubleSide });
    add(new THREE.CylinderGeometry(0.008, 0.008, 0.85, 8), mat('#2b2533'), this.umb, 0, 0.42, 0);
    add(new THREE.ConeGeometry(0.62, 0.26, 10, 1, true), this.umbMat, this.umb, 0, 0.92, 0);
    add(new THREE.SphereGeometry(0.02, 8, 6), mat('#2b2533'), this.umb, 0, 1.06, 0);
    this.drop = add(new THREE.SphereGeometry(0.035, 16, 12), new THREE.MeshToonMaterial({ gradientMap: grad3, color: '#8fd4ff', transparent: true, opacity: 0.85 }), this.upper);
    this.drop.scale.set(1, 1.25, 1); this.drop.visible = false;
    this.prop = null;
  }
  setVisible(v) { this.root.visible = v; }
  /** world position of a hand (side -1 = L, +1 = R) after pose(); use it to put props in a hand */
  handWorld(side = 1) { return this.arms[side < 0 ? 0 : 1].h.getWorldPosition(new THREE.Vector3()); }
  /** place a tube mesh between two points (in the mesh parent's space) */
  static seg(m, A, B) { tv.subVectors(B, A); const L = tv.length(); m.position.addVectors(A, B).multiplyScalar(0.5); m.scale.set(1, Math.max(0.001, L), 1); m.quaternion.setFromUnitVectors(Y, tv.normalize()); }
  /** 2-bone IK: elbow/knee position for shoulder S -> target T with bone lengths a, b and a pole direction P */
  static ik(S, T, a, b, P) {
    const d = Math.min(a + b - 1e-3, Math.max(0.02, S.distanceTo(T))), dir = new THREE.Vector3().subVectors(T, S).normalize();
    const t = S.clone().addScaledVector(dir, d);   // clamped target
    const x = (a * a - b * b + d * d) / (2 * d), h = Math.sqrt(Math.max(0, a * a - x * x));
    const perp = P.clone().addScaledVector(dir, -P.dot(dir)).normalize();
    return [S.clone().addScaledVector(dir, x).addScaledVector(perp, h), t];
  }
  drawFace(expr, blink, look, glow = 0) {
    const key = `${expr}|${blink}|${look}|${glow}`; if (key === this.faceKey) return; this.faceKey = key;
    const g = this.faceC.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 512, 512);
    this.T.drawFace3D(g, expr, look, blink, this.o.skin, glow); this.faceT.needsUpdate = true;
  }
  /** hand target (shoulder space: +x = character's left when facing the camera / screen right, +y up, +z forward) */
  handTarget(pose, s, o) {
    const head = new THREE.Vector3(0, D.headY - (D.top - 0.07), 0.0);
    switch (pose) {
      case 'up': return [s * 0.13, 0.38, 0.06];
      case 'wave': return [s * (0.24 + 0.05 * Math.sin(o.wv || 0)), 0.28, 0.08];
      case 'point': return [s * 0.38, 0.06, 0.14];
      case 'hip': return [s * 0.03, -0.22, -0.02];
      case 'reach': return [s * 0.22, 0.12 + (o.lift || 0) * 0.15, 0.34];
      case 'cheek': return [s * 0.17 - s * 0.19, head.y - 0.06, 0.15];
      case 'temple': return [s * 0.2 - s * 0.19, head.y + 0.06, 0.1];
      case 'show': return [s * 0.16, -0.02, 0.3];
      case 'thumb': return [s * 0.2, -0.04, 0.24];
      case 'belly': return [-s * 0.12, -0.24, 0.2];
      case 'snap': return [s * 0.2, 0.26, 0.16];
      case 'guard': return [-s * 0.06, 0.18, 0.28];
      case 'punch': return [-s * 0.02, 0.06, 0.44];
      case 'hold': return [s * 0.02, -0.06, 0.28];
      case 'umb': return [s * 0.1, -0.12, 0.2];
      case 'selfie': return [s * 0.05, 0.2, 0.33];
      case 'pocket': return [s * 0.02, -0.3, 0.1];
      case 'run': { const k = s < 0 ? (o.swL || 0) : (o.swR || 0); return [s * 0.04, -0.12 + 0.1 * k, 0.26 * k]; }
      case 'swing': { const k = s < 0 ? (o.swL || 0) : (o.swR || 0); return [s * 0.05, -0.36 + 0.06 * Math.abs(k), 0.2 * k]; }
      default: return [s * 0.07, -0.4, 0.03];
    }
  }
  pose(o = {}) {
    const { x = 0, y = 0, z = 0, yaw = 0, expr = 'neutral', blink = 0, look = 0, L = 'hang', R = 'hang', tilt = 0, headTilt = 0, headYaw = 0, lean = 0, step = 0, bob = 0, sit = 0, squash = 0, medal = false, crouch = 0, roll = 0, umbrella = null, drop = false } = o;
    this.root.position.set(x, y, z); this.root.rotation.set(0, yaw, roll);
    const ph = step * Math.PI * 2, walking = !!step;
    this.upper.position.y = D.hip + bob + (walking ? 0.02 * Math.abs(Math.sin(ph)) : 0) - sit * (D.hip - 0.2) - crouch * 0.22;
    this.medal.visible = !!medal;
    const B = LOOK.bean ? [0.94, 1.12, 0.94] : [1, 1, 1]; this.neck.scale.set(B[0] * (1 + squash * 0.22), B[1] * (1 - squash * 0.16), B[2] * (1 - squash * 0.1));
    this.upper.rotation.set((lean + crouch * 35) * Math.PI / 180, 0, -tilt * Math.PI / 180);
    this.neck.rotation.set(0, headYaw + (o.facing || 0) * 0.35, -headTilt * Math.PI / 180);
    this.drawFace(expr, blink, look, o.glow || 0);
    // arms
    for (const A of this.arms) {
      const S = new THREE.Vector3(A.s * (D.bodyR * 1.0), D.top - D.hip - 0.13, 0);
      const t = this.handTarget(A.s < 0 ? L : R, A.s, o), T_ = S.clone().add(new THREE.Vector3(...t));
      const pole = new THREE.Vector3(A.s * 0.8, -0.6, -0.5).normalize();
      const [E, Hh] = Char3D.ik(S, T_, D.arm, D.arm, pole);
      Char3D.seg(A.a, S, E); Char3D.seg(A.b, E, Hh); A.j.position.copy(E); A.h.position.copy(Hh);
    }
    const rh = this.arms[1].h.position;
    this.umb.visible = !!umbrella; if (umbrella) { this.umbMat.color.set(umbrella); this.umb.position.set(rh.x, rh.y - 0.05, rh.z); }
    this.drop.visible = !!drop; if (drop) this.drop.position.set(rh.x, rh.y + 0.08, rh.z + 0.02);
    this.root.updateMatrixWorld(true);
    // legs (feet planted; walking swings them in z and lifts)
    for (const Lg of this.legs) {
      const Hp = new THREE.Vector3(Lg.s * 0.075, this.upper.position.y - 0.02, 0);
      const sw = walking ? Math.sin(ph + (Lg.s > 0 ? Math.PI : 0)) : 0, lift = walking ? Math.max(0, Math.cos(ph + (Lg.s > 0 ? Math.PI : 0))) * 0.07 : 0;
      const F = sit ? new THREE.Vector3(Lg.s * 0.11, 0.035, 0.42 * sit) : crouch ? new THREE.Vector3(Lg.s * 0.1, 0.035, Lg.s > 0 ? 0.22 : -0.22) : new THREE.Vector3(Lg.s * 0.09, 0.035 + lift, 0.17 * sw);
      const [K] = Char3D.ik(Hp, F, D.leg, D.leg, new THREE.Vector3(0, 0, 1));
      Char3D.seg(Lg.a, Hp, K); Char3D.seg(Lg.b, K, F); Lg.j.position.copy(K); Lg.f.position.set(F.x, F.y, F.z + 0.04);
    }
  }
}
