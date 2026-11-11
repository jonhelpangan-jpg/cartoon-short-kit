// scenes.js: a library of complete 3D locations (our own designs) for the cartoon-short-kit engine.
// Each scene builds into its own group at an origin, with its own painted textures, props, a suggested light preset
// and named "spots" (character marks + a default establishing view). Self-contained: only needs three.js.
//   import { buildScene, SCENE_LIGHTS } from './scenes.js';
//   const beach = buildScene('beach', scene, [4000, 0, 0]);   // -> { group, spots, light, tick(f) }
//   beach.spots.a  -> [x, y, z] world position for a character;  beach.spots.view -> { pos, look }
// Scenes: beach, school, forest, subway, desert, space, market, snow.
import * as THREE from './lib/three.module.js';

const grad = (() => { const n = 16, d = new Uint8Array(n * 4); for (let i = 0; i < n; i++) { const t = i / (n - 1), v = Math.round(255 * (0.5 + 0.5 * Math.pow(t, 0.8))); d.set([v, v, v, 255], i * 4); } const t = new THREE.DataTexture(d, n, 1); t.minFilter = t.magFilter = THREE.LinearFilter; t.needsUpdate = true; return t; })();
const toon = (color, extra = {}) => new THREE.MeshToonMaterial({ gradientMap: grad, color, ...extra });
const rng = (seed) => { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
const tex = (c, rx = 1, ry = 1) => { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;
const speck = (g, w, h, r, n, cols, s0 = 1, s1 = 3) => { for (let i = 0; i < n; i++) { g.fillStyle = cols[(r() * cols.length) | 0]; g.beginPath(); g.ellipse(r() * w, r() * h, s0 + r() * s1, s0 + r() * s1 * 0.7, r() * 3, 0, 7); g.fill(); } };
const tbox = (w, h, d, t = 2) => { const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv; const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / t, uv.getY(i) * dims[f][1] / t); } return g; };

// ---------- painters ----------
const PT = {
  sand: (seed = 1, hue = 42, l = 74) => { const [c, g] = cv(512, 512), r = rng(seed); g.fillStyle = hsl(hue, 55, l); g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 120; i++) { g.strokeStyle = hsl(hue, 45, l - 6 - r() * 6, .45); g.lineWidth = 3; g.beginPath(); const x = r() * 512, y = r() * 512; g.moveTo(x, y); g.quadraticCurveTo(x + 40, y - 8, x + 80, y); g.stroke(); }
    speck(g, 512, 512, r, 900, [hsl(hue, 40, l - 12), hsl(hue, 60, l + 8), hsl(hue - 10, 30, l - 20)], 0.6, 1.4); return c; },
  grass: (seed = 2, hue = 95) => { const [c, g] = cv(512, 512), r = rng(seed); g.fillStyle = hsl(hue, 42, 42); g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) { g.fillStyle = hsl(hue - 10 + r() * 20, 40, 36 + r() * 14, .5); g.beginPath(); g.ellipse(r() * 512, r() * 512, 20 + r() * 50, 12 + r() * 30, r() * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 1400; i++) { const x = r() * 512, y = r() * 512; g.strokeStyle = hsl(hue - 15 + r() * 30, 45, 28 + r() * 25, .9); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + r() * 4 - 2, y - 5 - r() * 7); g.stroke(); } return c; },
  tiles: (seed = 3, a = '#e8e4dc', b = '#d4cec2', n = 4, grout = '#9a948a') => { const [c, g] = cv(512, 512), r = rng(seed); g.fillStyle = grout; g.fillRect(0, 0, 512, 512); const s = 512 / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { g.fillStyle = (x + y) % 2 ? a : b; g.fillRect(x * s + 3, y * s + 3, s - 6, s - 6); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x * s + 6, y * s + 6, s - 12, 6); } speck(g, 512, 512, r, 120, ['rgba(0,0,0,.08)'], 1, 4); return c; },
  planks: (seed = 4, hue = 30, l = 52) => { const [c, g] = cv(512, 512), r = rng(seed), n = 8, w = 512 / n;
    for (let i = 0; i < n; i++) { const L = l + r() * 10; g.fillStyle = hsl(hue, 40, L); g.fillRect(i * w, 0, w, 512); for (let k = 0; k < 12; k++) { g.strokeStyle = hsl(hue - 4, 40, L - 10 - r() * 8, .5); g.lineWidth = 1 + r() * 2; g.beginPath(); const x = i * w + 4 + r() * (w - 8); g.moveTo(x, 0); g.bezierCurveTo(x + r() * 6 - 3, 170, x + r() * 6 - 3, 340, x, 512); g.stroke(); }
      g.fillStyle = 'rgba(30,18,10,.9)'; g.fillRect(i * w, 0, 3, 512); } return c; },
  lockers: (col = '#3a7ad8') => { const [c, g] = cv(256, 512); g.fillStyle = col; g.fillRect(0, 0, 256, 512); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 6; g.strokeRect(6, 6, 244, 500);
    for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(70, 40 + i * 16, 116, 6); } g.fillStyle = '#d8dce4'; g.fillRect(200, 240, 22, 50); return c; },
  panel: (seed = 5, base = '#9aa6b8') => { const [c, g] = cv(512, 512), r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 2; x++) { g.strokeStyle = 'rgba(20,24,40,.5)'; g.lineWidth = 5; g.strokeRect(x * 256 + 8, y * 128 + 8, 240, 112); for (const [dx, dy] of [[18, 18], [222, 18], [18, 102], [222, 102]]) { g.fillStyle = 'rgba(30,34,50,.6)'; g.beginPath(); g.arc(x * 256 + 8 + dx, y * 128 + 8 + dy, 5, 0, 7); g.fill(); } }
    speck(g, 512, 512, r, 80, ['rgba(255,255,255,.12)'], 2, 6); return c; },
  products: (seed = 6) => { const [c, g] = cv(512, 256), r = rng(seed), cols = ['#e84a3a', '#f2c230', '#3ab06a', '#3a7ad8', '#e87ab0', '#8a5ad0', '#f08a3a', '#f4f1ea'];
    g.fillStyle = '#c8c4bc'; g.fillRect(0, 0, 512, 256); let x = 4;
    while (x < 508) { const w = 24 + r() * 30, h = 80 + r() * 150, col = cols[(r() * cols.length) | 0]; g.fillStyle = col; g.fillRect(x, 256 - h, w - 4, h); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x + 4, 256 - h * 0.6, w - 12, h * 0.15); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + w - 8, 256 - h, 4, h); x += w; }
    return c; },
  cabin: (seed = 7) => { const [c, g] = cv(256, 256), r = rng(seed); for (let i = 0; i < 8; i++) { g.fillStyle = hsl(22 + r() * 8, 45, 30 + r() * 10); g.fillRect(0, i * 32, 256, 30); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(0, i * 32 + 28, 256, 4); } return c; },
  adobe: (seed = 8) => { const [c, g] = cv(256, 256), r = rng(seed); g.fillStyle = '#d8946a'; g.fillRect(0, 0, 256, 256); speck(g, 256, 256, r, 60, ['rgba(170,90,50,.35)', 'rgba(255,220,180,.3)'], 6, 20); return c; },
  stars: (seed = 9) => { const [c, g] = cv(512, 512), r = rng(seed); g.fillStyle = '#05061a'; g.fillRect(0, 0, 512, 512); for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(255,255,255,${.4 + r() * .6})`; g.beginPath(); g.arc(r() * 512, r() * 512, .6 + r() * 1.8, 0, 7); g.fill(); }
    const gr = g.createRadialGradient(330, 300, 10, 330, 300, 150); gr.addColorStop(0, '#7ac0ff'); gr.addColorStop(0.7, '#2a5ab8'); gr.addColorStop(1, 'rgba(10,20,60,0)'); g.fillStyle = gr; g.beginPath(); g.arc(330, 300, 150, 0, 7); g.fill();
    g.fillStyle = '#5ab070'; g.beginPath(); g.ellipse(300, 260, 50, 30, 0.4, 0, 7); g.fill(); return c; },
  screen: (kind = 'chart') => { const [c, g] = cv(512, 300); g.fillStyle = '#0c1a2a'; g.fillRect(0, 0, 512, 300); g.strokeStyle = '#3af0c8'; g.lineWidth = 4;
    if (kind === 'chart') { g.beginPath(); for (let i = 0; i < 40; i++) g.lineTo(i * 13, 150 + Math.sin(i * 0.6) * 60 + Math.sin(i * 1.7) * 20); g.stroke(); }
    else { for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(256, 150, 30 + i * 30, 0, 7); g.stroke(); } g.fillStyle = '#ff5a5a'; g.beginPath(); g.arc(320, 110, 8, 0, 7); g.fill(); } return c; },
  sign: (text, bg = '#d84a3a', fg = '#ffffff') => { const [c, g] = cv(512, 128); g.fillStyle = bg; g.fillRect(0, 0, 512, 128); g.strokeStyle = fg; g.lineWidth = 8; g.strokeRect(10, 10, 492, 108);
    g.fillStyle = fg; g.font = 'bold 70px DejaVu Sans, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 68); return c; },
};

// suggested light presets per scene (same fields the stories' LIGHTS use)
export const SCENE_LIGHTS = {
  beach: { az: 200, el: 55, sky: '#c8e4ff', ground: '#c8a878', hemi: 1.0, sun: '#fff4e0', sunI: 2.9, fog: '#cfe8ff', fogNear: 60, fogFar: 700, skyTop: '#2f8ae8', skyHor: '#bfe6ff', sat: 1.2, vig: 0.18, shadowExt: 10 },
  school: { az: 150, el: 70, sky: '#fff6e8', ground: '#8a8070', hemi: 1.3, sun: '#fff8ec', sunI: 1.2, fog: '#e8e0d4', fogNear: 25, fogFar: 160, skyTop: '#9ab4d8', skyHor: '#e8eef6', sat: 1.12, vig: 0.24, shadowExt: 8 },
  forest: { az: 230, el: 30, sky: '#d8ecc8', ground: '#4a5a30', hemi: 1.0, sun: '#ffe8b8', sunI: 2.4, fog: '#a8c89a', fogNear: 15, fogFar: 140, skyTop: '#6aa8d8', skyHor: '#d8eccc', sat: 1.15, vig: 0.28, shadowExt: 12 },
  subway: { az: 160, el: 80, sky: '#e8f4ff', ground: '#5a6070', hemi: 1.3, sun: '#f0f8ff', sunI: 1.0, fog: '#1a2030', fogNear: 20, fogFar: 120, skyTop: '#0a0e18', skyHor: '#1a2030', sat: 1.08, vig: 0.3, shadowExt: 6 },
  desert: { az: 250, el: 22, sky: '#ffd8a8', ground: '#a8603a', hemi: 0.95, sun: '#ffc888', sunI: 3.0, fog: '#f8c890', fogNear: 80, fogFar: 800, skyTop: '#3a7ad8', skyHor: '#ffd8a0', sat: 1.2, gain: '#fff4e4', vig: 0.22, shadowExt: 12 },
  space: { az: 120, el: 60, sky: '#b8d0ff', ground: '#3a4058', hemi: 1.15, sun: '#d8e8ff', sunI: 1.3, fog: '#101428', fogNear: 20, fogFar: 140, skyTop: '#05061a', skyHor: '#101428', sat: 1.1, vig: 0.32, shadowExt: 6 },
  market: { az: 160, el: 80, sky: '#ffffff', ground: '#8a8a80', hemi: 1.35, sun: '#ffffff', sunI: 1.0, fog: '#e8ecee', fogNear: 25, fogFar: 160, skyTop: '#a8b8c8', skyHor: '#eef2f4', sat: 1.15, vig: 0.2, shadowExt: 8 },
  snow: { az: 210, el: 25, sky: '#d8e4ff', ground: '#c8d0e0', hemi: 1.15, sun: '#fff0e0', sunI: 2.2, fog: '#d8e4f4', fogNear: 40, fogFar: 400, skyTop: '#5a8ad0', skyHor: '#e4ecf8', sat: 1.1, vig: 0.22, shadowExt: 10 },
};

export function buildScene(name, scene, origin = [0, 0, 0], opts = {}) {
  const G = new THREE.Group(); G.position.set(...origin); scene.add(G);
  const add = (geo, m, x = 0, y = 0, z = 0, parent = G, o = {}) => { const me = new THREE.Mesh(geo, m); me.position.set(x, y, z); me.castShadow = o.cast ?? true; me.receiveShadow = true; parent.add(me); return me; };
  const grp = (x = 0, y = 0, z = 0, parent = G) => { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g; };
  const ground = (m, size = 400) => { const p = add(new THREE.PlaneGeometry(size, size), m, 0, 0.002, 0, G, { cast: false }); p.rotation.x = -Math.PI / 2; return p; };
  const room = (w, h, d, wallM, floorM, ceilM, open = 'front') => { add(tbox(w, 0.1, d), floorM, 0, -0.05, 0, G, { cast: false }); add(tbox(w, 0.1, d), ceilM, 0, h + 0.05, 0, G, { cast: false });
    add(tbox(w, h, 0.12), wallM, 0, h / 2, -d / 2, G, { cast: false }); add(tbox(0.12, h, d), wallM, -w / 2, h / 2, 0, G, { cast: false }); add(tbox(0.12, h, d), wallM, w / 2, h / 2, 0, G, { cast: false });
    if (open !== 'front') add(tbox(w, h, 0.12), wallM, 0, h / 2, d / 2, G, { cast: false }); };
  const r = rng(opts.seed || name.length * 17);
  const S = { group: G, spots: {}, light: SCENE_LIGHTS[name], tick: () => {} };
  const P0 = (x, y, z) => [origin[0] + x, origin[1] + y, origin[2] + z];
  switch (name) {
    case 'beach': {
      ground(toon('#ffffff', { map: tex(PT.sand(11), 60, 60) }));
      const seaU = { t: { value: 0 } };
      const sea = add(new THREE.PlaneGeometry(400, 160, 1, 1), new THREE.ShaderMaterial({ uniforms: seaU,
        vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
        fragmentShader: 'uniform float t; varying vec3 vW; void main(){ float d=clamp((-vW.z)/80.,0.,1.); vec3 c=mix(vec3(.35,.82,.86),vec3(.12,.45,.72),d); float s=smoothstep(.93,.98,sin(vW.x*.6+t*1.5+sin(vW.z*.9)*2.)*.5+.5); c=mix(c,vec3(1.),s*.5*(1.-d)); gl_FragColor=vec4(c,1.); }' }), 0, 0.03, -86, G, { cast: false });
      sea.rotation.x = -Math.PI / 2; S.tick = (f) => { seaU.t.value = f / 30; };
      const foam = add(new THREE.PlaneGeometry(400, 1.2), toon('#f4fbff'), 0, 0.04, -6.2, G, { cast: false }); foam.rotation.x = -Math.PI / 2;
      // boardwalk + railing
      add(tbox(60, 0.25, 3, 1), toon('#ffffff', { map: tex(PT.planks(12, 32, 58), 1, 1) }), 0, 0.3, 9, G);
      for (let x = -29; x <= 29; x += 2) add(new THREE.CylinderGeometry(0.06, 0.06, 1, 8), toon('#f4f1ea'), x, 0.92, 10.4, G);
      add(tbox(60, 0.08, 0.1, 1), toon('#f4f1ea'), 0, 1.4, 10.4, G);
      // umbrellas, towels, ball, lifeguard tower, palms
      const umb = (x, z, col) => { const g = grp(x, 0, z); add(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 8), toon('#f4f1ea'), 0, 1.1, 0, g); const c = add(new THREE.ConeGeometry(1.3, 0.55, 12, 1, true), toon(col, { side: THREE.DoubleSide }), 0, 2.2, 0, g); c.rotation.z = 0.1;
        const tw = add(new THREE.BoxGeometry(0.9, 0.02, 1.8), toon(col === '#e84a3a' ? '#f2c230' : '#e84a3a'), 0.8, 0.02, 0.6, g, { cast: false }); tw.rotation.y = 0.3; };
      [[-6, 0, '#e84a3a'], [-1.5, 1.5, '#3a8ad8'], [4, -0.5, '#f2c230'], [9, 1, '#3ab06a'], [-11, 1.2, '#e87ab0']].forEach(([x, z, c]) => umb(x, z, c));
      const ball = grp(1.5, 0.22, 2.6); ['#e84a3a', '#f4f1ea', '#3a8ad8', '#f2c230'].forEach((c, i) => add(new THREE.SphereGeometry(0.22, 16, 12, i * Math.PI / 2, Math.PI / 2), toon(c), 0, 0, 0, ball));
      { const g = grp(13, 0, -2); for (const [x, z] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) add(new THREE.CylinderGeometry(0.07, 0.07, 2.6, 8), toon('#f4f1ea'), x, 1.3, z, g);
        add(tbox(2.2, 1.3, 2.2, 1), toon('#e84a3a'), 0, 3.2, 0, g); add(new THREE.ConeGeometry(1.8, 0.8, 4), toon('#f4f1ea'), 0, 4.25, 0, g).rotation.y = Math.PI / 4;
        const sg = add(new THREE.PlaneGeometry(1.6, 0.4), toon('#ffffff', { map: tex(PT.sign('LIFEGUARD')) }), 0, 3.2, 1.11, g, { cast: false }); }
      const palm = (x, z, h) => { const g = grp(x, 0, z); let px = 0, py = 0; for (let i = 0; i < 7; i++) { const seg = add(new THREE.CylinderGeometry(0.16 - i * 0.012, 0.18 - i * 0.012, h / 7, 8), toon(i % 2 ? '#a8784a' : '#8a603a'), px, py + h / 14, 0, g); seg.rotation.z = -0.06 * i; px += Math.sin(0.06 * i) * h / 7; py += h / 7; }
        for (let k = 0; k < 7; k++) { const lf = add(new THREE.ConeGeometry(0.35, 2.4, 4), toon(k % 2 ? '#3a9a4a' : '#4ab05a'), px, py + 0.1, 0, g); lf.rotation.set(Math.cos(k * 0.9) * 1.2, k * 0.9, Math.PI / 2 + 0.5); lf.scale.set(1, 1, 0.25); }
        add(new THREE.SphereGeometry(0.14, 10, 8), toon('#6a4a2a'), px, py - 0.1, 0.12, g); };
      [[-15, 6, 6], [16, 7, 7], [-20, 3, 5.5], [21, 4, 6.5]].forEach(([x, z, h]) => palm(x, z, h));
      for (let i = 0; i < 10; i++) { const h = add(new THREE.SphereGeometry(30 + r() * 30, 18, 10), toon(i % 2 ? '#8ab86a' : '#9ac878'), -200 + i * 45, -14, 120 + r() * 60, G, { cast: false }); h.scale.y = 0.5; }
      Object.assign(S.spots, { a: P0(-0.6, 0, 2.2), b: P0(0.6, 0, 2.4), c: P0(-3.5, 0, 0.5), board: P0(0, 0.42, 9), sea: P0(0, 0, -5.5), view: { pos: P0(3.5, 1.4, 7.5), look: P0(-1, 1.0, -2) } });
      break;
    }
    case 'school': {
      const W = 4.2, H = 3.0, D = 26, wallM = toon('#f2e6c8'), floorM = toon('#ffffff', { map: tex(PT.tiles(21, '#d8dce4', '#b8c0cc', 6, '#8a929e'), 4, 24) });
      room(W, H, D, wallM, floorM, toon('#f4f4f0'), 'front'); G.children.forEach((m) => { if (m.position.z === -D / 2) m.position.z = -D / 2; });
      add(tbox(0.13, 1.0, D, 2), toon('#3a7ad8'), -W / 2 + 0.01, 0.5, 0, G, { cast: false }); add(tbox(0.13, 1.0, D, 2), toon('#3a7ad8'), W / 2 - 0.01, 0.5, 0, G, { cast: false });
      const lockM = [toon('#ffffff', { map: tex(PT.lockers('#3a7ad8')) }), toon('#ffffff', { map: tex(PT.lockers('#e84a3a')) })];
      for (let i = 0; i < 20; i++) { const z = -11 + i * 0.6; if (Math.abs(z - 2) < 1.4) continue; const l = add(tbox(0.45, 1.9, 0.56, 4), toon('#3a7ad8'), -W / 2 + 0.3, 0.95, z, G);
        const face = add(new THREE.PlaneGeometry(0.55, 1.85), lockM[i % 5 === 0 ? 1 : 0], -W / 2 + 0.54, 0.95, z, G, { cast: false }); face.rotation.y = Math.PI / 2; }
      for (const z of [2, -8]) { add(tbox(0.12, 2.2, 1.1, 1), toon('#8a5a34'), W / 2 - 0.06, 1.1, z, G); const s = add(new THREE.PlaneGeometry(0.9, 0.3), toon('#ffffff', { map: tex(PT.sign(z === 2 ? 'ROOM 12' : 'LIBRARY', '#2a3a5a')) }), W / 2 - 0.13, 2.45, z, G, { cast: false }); s.rotation.y = -Math.PI / 2; }
      { const b = add(new THREE.PlaneGeometry(2.2, 1.1), toon('#c8945a'), W / 2 - 0.08, 1.6, -3.5, G, { cast: false }); b.rotation.y = -Math.PI / 2;
        for (let i = 0; i < 6; i++) { const p = add(new THREE.PlaneGeometry(0.4, 0.3), toon(['#f4f1ea', '#f2c230', '#8ad0ff', '#ffb0c8'][i % 4]), W / 2 - 0.09, 1.4 + (i % 2) * 0.4, -4.3 + (i >> 1) * 0.55, G, { cast: false }); p.rotation.set(0, -Math.PI / 2, (r() - 0.5) * 0.3); } }
      for (let i = 0; i < 8; i++) add(new THREE.BoxGeometry(0.5, 0.05, 1.4), new THREE.MeshBasicMaterial({ color: '#fffbe8' }), 0, H - 0.03, -11 + i * 3.2, G, { cast: false });
      add(new THREE.PlaneGeometry(1.6, 1.2), new THREE.MeshBasicMaterial({ color: '#cfe8ff' }), 0, 1.6, -D / 2 + 0.07, G, { cast: false });
      Object.assign(S.spots, { a: P0(-0.4, 0, 3.5), b: P0(0.5, 0, 3.0), c: P0(0, 0, -4), door: P0(W / 2 - 0.4, 0, 2), view: { pos: P0(0.9, 1.5, 9), look: P0(-0.3, 1.2, -4) } });
      break;
    }
    case 'forest': {
      ground(toon('#ffffff', { map: tex(PT.grass(31, 100), 60, 60) }));
      const path = add(new THREE.PlaneGeometry(2.4, 60), toon('#ffffff', { map: tex(PT.sand(32, 30, 48), 1, 20) }), 0, 0.01, -10, G, { cast: false }); path.rotation.x = -Math.PI / 2;
      const pine = (x, z, h) => { const g = grp(x, 0, z); add(new THREE.CylinderGeometry(0.16, 0.24, h * 0.35, 8), toon('#6a4a32'), 0, h * 0.17, 0, g);
        for (let i = 0; i < 3; i++) add(new THREE.ConeGeometry(h * (0.32 - i * 0.07), h * 0.38, 9), toon(i % 2 ? '#2f6a3a' : '#3a7a42'), 0, h * (0.36 + i * 0.2), 0, g); };
      const round = (x, z, h) => { const g = grp(x, 0, z); add(new THREE.CylinderGeometry(0.14, 0.2, h, 8), toon('#7a5638'), 0, h / 2, 0, g); add(new THREE.SphereGeometry(h * 0.42, 14, 10), toon(r() < 0.5 ? '#5a9a3a' : '#6aa848'), 0, h + h * 0.2, 0, g); };
      for (let i = 0; i < 90; i++) { const x = (r() - 0.5) * 70, z = -r() * 60 + 15; if (Math.abs(x) < 2.6 && z < 12) continue; (i % 3 ? pine : round)(x, z, 4 + r() * 5); }
      for (let i = 0; i < 14; i++) { const rk = add(new THREE.DodecahedronGeometry(0.3 + r() * 0.6, 0), toon('#8a8a90'), (r() - 0.5) * 16, 0.15, -r() * 20 + 6, G); rk.scale.y = 0.6; }
      { const log = add(new THREE.CylinderGeometry(0.3, 0.3, 3, 14), toon('#7a5638'), 2.6, 0.3, 1.5, G); log.rotation.z = Math.PI / 2; log.rotation.y = 0.4; }
      for (let i = 0; i < 6; i++) { const g = grp(-2.2 + r() * 0.8, 0, 1 + r() * 2); add(new THREE.CylinderGeometry(0.03, 0.04, 0.16, 8), toon('#f4f1ea'), 0, 0.08, 0, g); add(new THREE.SphereGeometry(0.09, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), toon('#e84a3a'), 0, 0.16, 0, g); }
      Object.assign(S.spots, { a: P0(-0.4, 0, 2.5), b: P0(0.5, 0, 2.2), c: P0(0, 0, -3), log: P0(2.6, 0, 1.5), view: { pos: P0(2.2, 1.3, 8), look: P0(-0.5, 1.6, -4) } });
      break;
    }
    case 'subway': {
      const W = 2.9, H = 2.4, D = 16, panel = toon('#ffffff', { map: tex(PT.panel(41, '#c8d0dc'), 2, 1) });
      room(W, H, D, panel, toon('#ffffff', { map: tex(PT.tiles(42, '#4a5060', '#3a4050', 8, '#2a2e38'), 3, 16) }), toon('#e4e8ee'), 'closed');
      const seatM = toon('#3a7ad8'), poleM = toon('#d8dce4');
      for (const s of [-1, 1]) { for (let i = 0; i < 6; i++) { const z = -6 + i * 2.2; add(tbox(0.5, 0.1, 1.9, 1), seatM, s * (W / 2 - 0.35), 0.48, z, G); add(tbox(0.1, 0.5, 1.9, 1), seatM, s * (W / 2 - 0.12), 0.75, z, G); }
        for (let i = 0; i < 7; i++) { const w = add(new THREE.PlaneGeometry(1.3, 0.75), new THREE.MeshBasicMaterial({ color: '#1a2438' }), s * (W / 2 - 0.07), 1.45, -6.6 + i * 2.2, G, { cast: false }); w.rotation.y = -s * Math.PI / 2; } }
      for (let i = 0; i < 6; i++) add(new THREE.CylinderGeometry(0.03, 0.03, H, 10), poleM, 0, H / 2, -6 + i * 2.4, G);
      add(new THREE.CylinderGeometry(0.025, 0.025, D - 1, 8), poleM, 0, H - 0.25, 0, G).rotation.x = Math.PI / 2;
      for (let i = 0; i < 8; i++) add(new THREE.BoxGeometry(0.35, 0.03, 1.6), new THREE.MeshBasicMaterial({ color: '#f4fbff' }), 0, H - 0.02, -6.5 + i * 2, G, { cast: false });
      const streaks = []; for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { const m = add(new THREE.PlaneGeometry(0.9, 0.06), new THREE.MeshBasicMaterial({ color: '#ffe8a0' }), s * (W / 2 - 0.06), 1.3 + (i % 3) * 0.18, 0, G, { cast: false }); m.rotation.y = -s * Math.PI / 2; m.userData.s = i * 2.7; streaks.push(m); }
      S.tick = (f) => streaks.forEach((m) => { m.position.z = ((m.userData.s * 3 + f * 0.9) % 16) - 8; });
      { const mp = add(new THREE.PlaneGeometry(1.4, 0.35), toon('#ffffff', { map: tex(PT.sign('LINE 7 ▸ DOWNTOWN', '#2a2e38', '#f2c230')) }), 0, H - 0.4, -D / 2 + 0.08, G, { cast: false }); }
      Object.assign(S.spots, { a: P0(-0.35, 0, 1), b: P0(0.4, 0, 0.4), seatL: P0(-(W / 2 - 0.35), 0.5, 1.6), seatR: P0(W / 2 - 0.35, 0.5, -0.6), view: { pos: P0(0.7, 1.45, 6.5), look: P0(-0.2, 1.2, -2) } });
      break;
    }
    case 'desert': {
      ground(toon('#ffffff', { map: tex(PT.sand(51, 28, 64), 50, 50) }));
      const mesa = (x, z, w, h) => { const g = grp(x, 0, z); add(tbox(w, h, w * 0.7, 6), toon('#c86a3a'), 0, h / 2, 0, g, { cast: false }); add(tbox(w * 1.05, h * 0.1, w * 0.75, 6), toon('#a8502a'), 0, h * 0.95, 0, g, { cast: false }); };
      [[-80, -160, 60, 40], [40, -200, 80, 55], [150, -140, 50, 35], [-180, -120, 40, 28]].forEach((a) => mesa(...a));
      const cactus = (x, z, h) => { const g = grp(x, 0, z), cm = toon('#4a9a4a'); add(new THREE.CapsuleGeometry(0.22, h, 6, 12), cm, 0, h / 2 + 0.2, 0, g);
        for (const s of [-1, 1]) { const y = h * (0.45 + 0.15 * s); add(new THREE.CapsuleGeometry(0.13, 0.35, 6, 10), cm, s * 0.35, y, 0, g).rotation.z = Math.PI / 2; add(new THREE.CapsuleGeometry(0.13, 0.5, 6, 10), cm, s * 0.52, y + 0.3, 0, g); } };
      for (let i = 0; i < 22; i++) { const x = (r() - 0.5) * 60, z = -r() * 50 + 6; if (Math.abs(x) < 3 && z > -8) continue; cactus(x, z, 1.2 + r() * 1.6); }
      const adobe = (x, z, w, h, d) => { const g = grp(x, 0, z), am = toon('#ffffff', { map: tex(PT.adobe(52), 1, 1) }); add(tbox(w, h, d, 2), am, 0, h / 2, 0, g);
        for (let i = 0; i < 5; i++) add(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6), toon('#6a4a32'), -w / 2 + 0.4 + i * (w - 0.8) / 4, h - 0.25, d / 2 + 0.2, g).rotation.x = Math.PI / 2;
        add(tbox(0.9, 1.7, 0.06, 1), toon('#3a7ad8'), 0, 0.85, d / 2 + 0.03, g, { cast: false }); add(tbox(0.6, 0.6, 0.06, 1), toon('#2a2430'), w * 0.3, h * 0.55, d / 2 + 0.03, g, { cast: false }); };
      adobe(-5, -4, 4, 3, 4); adobe(5, -6, 5, 3.4, 4); adobe(-12, -9, 4, 2.8, 4);
      { const g = grp(2.6, 0, 1.5); add(new THREE.CylinderGeometry(0.05, 0.05, 2.2, 8), toon('#6a4a32'), 0, 1.1, 0, g); add(new THREE.PlaneGeometry(1.3, 0.4), toon('#ffffff', { map: tex(PT.sign('WELCOME', '#a8502a', '#fff4e0')), side: THREE.DoubleSide }), 0, 1.9, 0.03, g, { cast: false }); }
      { const tw = grp(-2.5, 0.3, 3); add(new THREE.IcosahedronGeometry(0.45, 0), toon('#b8945a', { wireframe: false }), 0, 0, 0, tw); }
      Object.assign(S.spots, { a: P0(-0.5, 0, 3), b: P0(0.6, 0, 2.6), c: P0(0, 0, -1.5), view: { pos: P0(3, 1.3, 9), look: P0(-1, 1.5, -6) } });
      break;
    }
    case 'space': {
      const W = 6, H = 3.2, D = 10, wallM = toon('#ffffff', { map: tex(PT.panel(61, '#a8b4c8'), 2, 1) });
      room(W, H, D, wallM, toon('#ffffff', { map: tex(PT.panel(62, '#5a6478'), 3, 5) }), toon('#c8d0e0'), 'front');
      const win = add(new THREE.CircleGeometry(1.15, 48), new THREE.MeshBasicMaterial({ map: tex(PT.stars(63)) }), 0, 1.7, -D / 2 + 0.08, G, { cast: false });
      add(new THREE.TorusGeometry(1.2, 0.12, 12, 48), toon('#e8ecf4'), 0, 1.7, -D / 2 + 0.12, G);
      for (const s of [-1, 1]) { const c = grp(s * 2.0, 0, -3.6); add(tbox(1.4, 0.9, 0.7, 1), toon('#e8ecf4'), 0, 0.45, 0, c); const sc = add(new THREE.PlaneGeometry(1.1, 0.5), new THREE.MeshBasicMaterial({ map: tex(PT.screen(s < 0 ? 'chart' : 'radar')) }), 0, 1.25, -0.1, c, { cast: false }); sc.rotation.x = -0.3;
        add(tbox(1.2, 0.6, 0.06, 1), toon('#2a3040'), 0, 1.25, -0.14, c).rotation.x = -0.3; for (let i = 0; i < 5; i++) add(new THREE.CylinderGeometry(0.04, 0.04, 0.03, 10), new THREE.MeshBasicMaterial({ color: ['#ff5a5a', '#3af0c8', '#f2c230'][i % 3] }), -0.45 + i * 0.22, 0.92, 0.2, c, { cast: false }); }
      for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(W - 0.6, 0.04, 0.12), new THREE.MeshBasicMaterial({ color: '#8ad8ff' }), 0, H - 0.03, -4 + i * 2.6, G, { cast: false });
      for (const s of [-1, 1]) for (let i = 0; i < 4; i++) add(new THREE.CylinderGeometry(0.08, 0.08, H, 10), toon('#e8ecf4'), s * (W / 2 - 0.25), H / 2, -4 + i * 2.6, G);
      { const pl = add(new THREE.CylinderGeometry(0.12, 0.16, 0.25, 12), toon('#c86a3a'), 2.6, 1.0, 1, G); add(new THREE.SphereGeometry(0.25, 12, 10), toon('#4ab05a'), 2.6, 1.3, 1, G); }
      Object.assign(S.spots, { a: P0(-0.5, 0, 0.5), b: P0(0.6, 0, 0.2), window: P0(0, 0, -3.8), view: { pos: P0(1.6, 1.5, 4.2), look: P0(-0.3, 1.4, -4) } });
      break;
    }
    case 'market': {
      const W = 14, H = 3.6, D = 22; room(W, H, D, toon('#f4f1ea'), toon('#ffffff', { map: tex(PT.tiles(71, '#f4f4f0', '#e4e4de', 4, '#c8c8c0'), 7, 11) }), toon('#f8f8f4'), 'front');
      const shelfM = toon('#ffffff', { map: tex(PT.products(72), 3, 1) }), shelfM2 = toon('#ffffff', { map: tex(PT.products(73), 3, 1) });
      for (const x of [-4.5, -1.5, 1.5, 4.5]) for (const s of [-1, 1]) { const sh = grp(x + s * 0.35, 0, -2); add(tbox(0.12, 2.0, 12, 2), toon('#d8dce4'), 0, 1.0, 0, sh);
        for (let k = 0; k < 4; k++) { add(tbox(0.55, 0.04, 12, 2), toon('#e8ecf0'), s * 0.3, 0.15 + k * 0.5, 0, sh); const face = add(new THREE.PlaneGeometry(12, 0.42), k % 2 ? shelfM : shelfM2, s * 0.56, 0.38 + k * 0.5, 0, sh, { cast: false }); face.rotation.y = s * Math.PI / 2; } }
      for (let i = 0; i < 4; i++) { const sg = add(new THREE.PlaneGeometry(1.6, 0.4), toon('#ffffff', { map: tex(PT.sign(['SNACKS', 'FRUIT', 'BAKERY', 'DRINKS'][i], ['#e84a3a', '#3ab06a', '#f08a3a', '#3a7ad8'][i])) }), -4.5 + i * 3, 3.0, 4.2, G, { cast: false }); }
      { const ck = grp(3, 0, 6.5); add(tbox(2.2, 0.95, 0.8, 1), toon('#3a7ad8'), 0, 0.47, 0, ck); add(tbox(2.2, 0.05, 0.85, 1), toon('#2a2e38'), 0, 0.97, 0, ck); add(tbox(0.4, 0.3, 0.3, 1), toon('#2a2e38'), 0.6, 1.15, 0, ck); }
      const cart = (x, z, ry) => { const g = grp(x, 0, z); g.rotation.y = ry; const m = toon('#c8ccd4');
        for (const [w, h, d, px, py, pz] of [[0.6, 0.02, 0.9, 0, 0.55, 0], [0.02, 0.4, 0.9, -0.3, 0.75, 0], [0.02, 0.4, 0.9, 0.3, 0.75, 0], [0.6, 0.4, 0.02, 0, 0.75, 0.45], [0.6, 0.4, 0.02, 0, 0.75, -0.45]]) add(new THREE.BoxGeometry(w, h, d), m, px, py, pz, g);
        for (const [px, pz] of [[-0.25, -0.4], [0.25, -0.4], [-0.25, 0.4], [0.25, 0.4]]) add(new THREE.SphereGeometry(0.06, 8, 6), toon('#2a2e38'), px, 0.06, pz, g); add(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 6), toon('#e84a3a'), 0, 1.0, 0.5, g).rotation.z = Math.PI / 2; };
      cart(-0.2, 3.2, 0.3); cart(5.6, 5.4, -0.6);
      for (let i = 0; i < 12; i++) add(new THREE.BoxGeometry(0.3, 0.04, 2.2), new THREE.MeshBasicMaterial({ color: '#ffffff' }), -6 + (i % 4) * 4, H - 0.02, -8 + Math.floor(i / 4) * 6, G, { cast: false });
      Object.assign(S.spots, { a: P0(0.4, 0, 3.6), b: P0(-0.6, 0, 3.2), aisle: P0(0, 0, -2), view: { pos: P0(1.2, 1.5, 9), look: P0(-0.2, 1.2, -3) } });
      break;
    }
    case 'snow': {
      ground(toon('#ffffff', { map: tex(PT.sand(81, 215, 92), 40, 40) }));
      const pineS = (x, z, h) => { const g = grp(x, 0, z); add(new THREE.CylinderGeometry(0.14, 0.2, h * 0.3, 8), toon('#6a4a32'), 0, h * 0.15, 0, g);
        for (let i = 0; i < 3; i++) { const y = h * (0.32 + i * 0.2); add(new THREE.ConeGeometry(h * (0.3 - i * 0.07), h * 0.35, 9), toon('#2f5a42'), 0, y, 0, g); add(new THREE.ConeGeometry(h * (0.2 - i * 0.05), h * 0.15, 9), toon('#f4f8ff'), 0, y + h * 0.12, 0, g); } };
      for (let i = 0; i < 60; i++) { const x = (r() - 0.5) * 80, z = -r() * 60 + 12; if (Math.abs(x) < 9 && z > -10) continue; pineS(x, z, 4 + r() * 5); }
      const cabin = (x, z, rot) => { const g = grp(x, 0, z); g.rotation.y = rot; add(tbox(4, 2.6, 3.6, 2), toon('#ffffff', { map: tex(PT.cabin(82), 1, 1) }), 0, 1.3, 0, g);
        for (const s of [-1, 1]) { const rf = add(tbox(2.6, 0.2, 4.2, 2), toon('#7a3a2a'), s * 1.05, 3.2, 0, g); rf.rotation.z = -s * 0.65; const sn = add(tbox(2.6, 0.18, 4.25, 2), toon('#f4f8ff'), s * 1.08, 3.33, 0, g); sn.rotation.z = -s * 0.65; }
        add(tbox(0.9, 1.7, 0.06, 1), toon('#5a3a24'), 0, 0.85, 1.82, g, { cast: false }); for (const s of [-1, 1]) add(new THREE.PlaneGeometry(0.6, 0.6), new THREE.MeshBasicMaterial({ color: '#ffd88a' }), s * 1.2, 1.5, 1.82, g, { cast: false });
        add(tbox(0.5, 1.4, 0.5, 1), toon('#8a8a90'), 1.1, 3.6, -0.8, g); };
      cabin(-6, -5, 0.4); cabin(6, -7, -0.3); cabin(-1, -14, 0);
      { const sm = grp(2.2, 0, 1.4); [[0.45, 0.4], [0.33, 1.05], [0.24, 1.55]].forEach(([rr, y]) => add(new THREE.SphereGeometry(rr, 18, 12), toon('#f8fbff'), 0, y, 0, sm));
        const nose = add(new THREE.ConeGeometry(0.05, 0.25, 8), toon('#f08a3a'), 0, 1.55, 0.3, sm); nose.rotation.x = Math.PI / 2; for (const s of [-1, 1]) add(new THREE.SphereGeometry(0.03, 8, 6), toon('#2a2430'), s * 0.08, 1.63, 0.21, sm);
        add(new THREE.TorusGeometry(0.28, 0.06, 8, 20), toon('#e84a3a'), 0, 1.3, 0, sm).rotation.x = Math.PI / 2; add(new THREE.CylinderGeometry(0.18, 0.2, 0.3, 14), toon('#2a2430'), 0, 1.85, 0, sm); }
      for (let i = 0; i < 4; i++) { const g = grp(-3 + i * 2.6, 0, 3.2); add(new THREE.CylinderGeometry(0.05, 0.06, 2.6, 8), toon('#2a2e38'), 0, 1.3, 0, g); add(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshBasicMaterial({ color: '#ffe0a0' }), 0, 2.65, 0, g, { cast: false }); }
      const flakes = []; for (let i = 0; i < 160; i++) { const m = add(new THREE.SphereGeometry(0.025, 6, 4), new THREE.MeshBasicMaterial({ color: '#ffffff' }), (r() - 0.5) * 14, r() * 6, (r() - 0.5) * 10, G, { cast: false }); m.userData.v = 0.4 + r() * 0.5; m.userData.p = r() * 6; m.userData.ndSkip = true; flakes.push(m); }
      S.tick = (f) => flakes.forEach((m) => { m.position.y = 6 - ((f / 30 * m.userData.v + m.userData.p) % 6); m.position.x += Math.sin(f * 0.05 + m.userData.p) * 0.002; });
      Object.assign(S.spots, { a: P0(-0.5, 0, 2.2), b: P0(0.6, 0, 2.0), c: P0(0, 0, -2), snowman: P0(2.2, 0, 1.4), view: { pos: P0(3, 1.4, 8.5), look: P0(-0.5, 1.4, -4) } });
      break;
    }
    default: throw new Error('unknown scene ' + name);
  }
  G.updateMatrixWorld(true);
  return S;
}
export const SCENE_NAMES = ['beach', 'school', 'forest', 'subway', 'desert', 'space', 'market', 'snow'];
