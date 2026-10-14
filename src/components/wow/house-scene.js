import * as THREE from 'three';

const C = {
  wall: 0xeef2f6, slab: 0xc9d3dd, plinth: 0x123a61, edge: 0x0a2a4a,
  blue: 0x005696, orange: 0xf26722, white: 0xffffff, glass: 0x7fb6e0, timber: 0xc79a6b, dim: 0x13283f,
};

export function createHouse(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  const dprCap = innerWidth < 768 ? 1.25 : 1.5;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
  const target = new THREE.Vector3(1.6, 3.1, 0);
  const camDir = new THREE.Vector3(0.62, 0.42, 0.92).normalize();
  let camDist = 30;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x1b3554, 1.4));
  const sun = new THREE.DirectionalLight(0xffffff, 1.9);
  sun.position.set(7, 14, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 });
  sun.shadow.bias = -0.0008;
  scene.add(sun);

  const groups = { base: [], refurbishments: [], extensions: [], 'loft-conversion': [] };
  const mats = { refurbishments: [], extensions: [], 'loft-conversion': [], base: [] };
  const parts = []; // { obj, final:Vector3, order, from }
  const edgeMat = new THREE.LineBasicMaterial({ color: C.edge, transparent: true, opacity: 0.5 });
  const disposables = [edgeMat];

  const mat = (g, color, extra = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...extra });
    m.userData.base = new THREE.Color(color);
    mats[g].push(m); disposables.push(m);
    return m;
  };
  const add = (g, geo, m, x, y, z, { order = 0, from = 'drop', edges = true, rot = null, shadow = true } = {}) => {
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    if (rot) mesh.rotation.set(...rot);
    mesh.castShadow = shadow; mesh.receiveShadow = true;
    if (edges) { const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), edgeMat); mesh.add(e); disposables.push(e.geometry); }
    disposables.push(geo);
    scene.add(mesh);
    groups[g].push(mesh);
    parts.push({ obj: mesh, final: mesh.position.clone(), rot: mesh.rotation.clone(), order, from });
    return mesh;
  };
  const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

  /* ---------- base: plinth + shell ---------- */
  const mPl = mat('base', C.plinth), mWall = mat('base', C.wall), mSlab = mat('base', C.slab);
  add('base', box(12.4, 0.3, 7.2), mPl, 1.6, -0.15, 0, { order: 0, from: 'none', edges: false });
  add('base', box(6, 0.12, 4), mSlab, 0, 0.06, 0, { order: 1 });
  add('base', box(6.2, 5.2, 0.2), mWall, 0, 2.6, -2.1, { order: 1 });
  add('base', box(0.2, 5.2, 4.2), mWall, -3.1, 2.6, 0, { order: 2 });
  add('base', box(0.2, 5.2, 4.2), mWall, 3.1, 2.6, 0, { order: 2 });
  add('base', box(6, 0.16, 4), mSlab, 0, 2.6, 0, { order: 3 });
  add('base', box(0.12, 2.44, 4), mWall, 0.2, 3.9, 0, { order: 4 }); // first-floor partition

  /* ---------- refurbishments: kitchen, stairs, bathroom, bedroom ---------- */
  const R = 'refurbishments';
  const mUnit = mat(R, C.blue), mTop = mat(R, C.white, { roughness: 0.4 }), mSan = mat(R, C.white, { roughness: 0.3 }), mWood = mat(R, C.timber), mOr = mat(R, C.orange);
  add(R, box(3.6, 0.86, 0.62), mUnit, -1.1, 0.55, -1.65, { order: 5 });
  add(R, box(3.66, 0.06, 0.68), mTop, -1.1, 1.01, -1.63, { order: 5 });
  add(R, box(3.6, 0.7, 0.36), mUnit, -1.1, 1.95, -1.82, { order: 6 });
  add(R, box(1.7, 0.86, 0.9), mUnit, -1.2, 0.55, 0.3, { order: 6 });
  add(R, box(1.8, 0.06, 1.0), mTop, -1.2, 1.01, 0.3, { order: 6 });
  for (let i = 0; i < 9; i++) add(R, box(0.9, 0.29, 0.4), mWood, 2.5, 0.27 + i * 0.29, 1.6 - i * 0.4, { order: 7 + i * 0.12, edges: true });
  add(R, box(1.7, 0.55, 0.8), mSan, -2.1, 2.96, -1.55, { order: 8 });
  add(R, box(0.9, 0.8, 0.45), mSan, -0.6, 3.08, -1.8, { order: 8 });
  add(R, box(0.04, 1.4, 1.6), mat(R, C.glass, { transparent: true, opacity: 0.45, roughness: 0.1 }), -1.15, 3.4, -1.3, { order: 9, edges: true, shadow: false });
  add(R, box(1.7, 0.42, 2.1), mOr, 1.5, 2.9, -0.8, { order: 9 });
  add(R, box(1.8, 0.9, 0.12), mWood, 1.5, 3.2, -1.9, { order: 9 });

  /* ---------- extension (single storey, right side) ---------- */
  const E = 'extensions';
  const mExW = mat(E, C.white), mExR = mat(E, C.blue), mGl = mat(E, C.glass, { transparent: true, opacity: 0.35, roughness: 0.05 });
  add(E, box(3.2, 0.12, 3.6), mSlab, 4.8, 0.06, -0.2, { order: 10, from: 'slide' });
  add(E, box(3.2, 2.8, 0.2), mExW, 4.8, 1.4, -2.1, { order: 10, from: 'slide' });
  add(E, box(0.2, 2.8, 3.8), mExW, 6.5, 1.4, -0.2, { order: 11, from: 'slide' });
  add(E, box(3.7, 0.22, 4.1), mExR, 4.85, 2.92, -0.15, { order: 12, from: 'slide' });
  add(E, box(3.1, 2.6, 0.04), mGl, 4.85, 1.42, 1.65, { order: 12, from: 'slide', shadow: false });
  for (let i = 0; i < 4; i++) add(E, box(0.07, 2.6, 0.08), mExR, 3.35 + i * 1.0, 1.42, 1.66, { order: 12.5, from: 'slide' });
  add(E, box(1.6, 0.08, 0.9), mat(E, C.timber), 4.9, 0.8, -0.4, { order: 12.5, from: 'slide' });
  add(E, box(0.08, 0.72, 0.8), mat(E, C.timber), 4.9, 0.4, -0.4, { order: 12.5, from: 'slide' });

  /* ---------- loft conversion: gables, roof, dormer, chimney ---------- */
  const L = 'loft-conversion';
  const mRoof = mat(L, C.orange), mGable = mat(L, C.wall), mDorm = mat(L, C.white), mCap = mat(L, C.blue), mDGl = mat(L, C.glass, { transparent: true, opacity: 0.6, roughness: 0.05 });
  const ridgeH = 2.5, half = 2.25;
  const tri = new THREE.Shape(); tri.moveTo(-half + 0.15, 0); tri.lineTo(half - 0.15, 0); tri.lineTo(0, ridgeH - 0.1); tri.closePath();
  const gableGeo = () => new THREE.ExtrudeGeometry(tri, { depth: 0.2, bevelEnabled: false });
  add(L, gableGeo(), mGable, -3.2, 5.2, 0, { order: 13, rot: [0, Math.PI / 2, 0] });
  add(L, gableGeo(), mGable, 3.0, 5.2, 0, { order: 13, rot: [0, Math.PI / 2, 0] });
  const slope = Math.hypot(half, ridgeH) + 0.35, ang = Math.atan2(ridgeH, half);
  add(L, box(6.8, 0.16, slope), mRoof, 0, 5.2 + ridgeH / 2, -half / 2 - 0.05, { order: 14, rot: [-ang, 0, 0] });
  add(L, box(6.8, 0.16, slope), mRoof, 0, 5.2 + ridgeH / 2, half / 2 + 0.05, { order: 14, rot: [ang, 0, 0] });
  // dormer on the front slope
  add(L, box(2.0, 1.25, 1.5), mDorm, 0.9, 6.15, 0.75, { order: 15 });
  add(L, box(2.2, 0.14, 1.75), mCap, 0.9, 6.83, 0.82, { order: 15.4 });
  add(L, box(1.5, 0.8, 0.04), mDGl, 0.9, 6.15, 1.51, { order: 15.6, shadow: false });
  add(L, box(0.5, 1.5, 0.5), mRoof, -1.7, 7.35, -0.5, { order: 16 });
  add(L, box(0.66, 0.14, 0.66), mCap, -1.7, 8.15, -0.5, { order: 16.3 });


  /* ---------- framing ---------- */
  const bounds = new THREE.Box3(new THREE.Vector3(-3.4, -0.3, -2.4), new THREE.Vector3(6.7, 8.3, 2.4));
  const resize = () => {
    const w = canvas.clientWidth || 800, h = canvas.clientHeight || 620;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // fit the bounds' bounding sphere
    const r = bounds.getBoundingSphere(new THREE.Sphere()).radius;
    const fitH = r / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitW = fitH / Math.min(1, camera.aspect);
    camDist = Math.max(fitH, fitW) * 0.78;
    setCam(1);
    render();
  };
  const setCam = (k) => {
    camera.position.copy(target).addScaledVector(camDir, camDist * k);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  };
  const render = () => renderer.render(scene, camera);

  resize();
  renderer.compile(scene, camera);

  const offsetFor = (p) => {
    if (p.from === 'none') return new THREE.Vector3();
    if (p.from === 'slide') return new THREE.Vector3(5, 0.6, 0);
    return new THREE.Vector3(0, 5 + p.order * 0.15, 0);
  };

  const api = {
    reset() {
      parts.forEach((p) => {
        p.obj.position.copy(p.final).add(offsetFor(p));
        p.obj.rotation.copy(p.rot);
        p.obj.visible = p.from === 'none';
        p.obj.scale.setScalar(1);
      });
      setCam(1.12);
      render();
    },
    assemble(gsap, onDone) {
      const tl = gsap.timeline({ onUpdate: render, onComplete: () => { render(); onDone(); } });
      const camK = { k: 1.12 };
      tl.to(camK, { k: 1, duration: 2.6, ease: 'power2.out', onUpdate: () => setCam(camK.k) }, 0);
      parts.filter((p) => p.from !== 'none').sort((a, b) => a.order - b.order).forEach((p, i) => {
        const t = 0.05 + p.order * 0.085;
        tl.set(p.obj, { visible: true }, t);
        tl.to(p.obj.position, { x: p.final.x, y: p.final.y, z: p.final.z, duration: 0.9, ease: p.from === 'slide' ? 'power3.out' : 'back.out(1.1)' }, t);
      });
      return tl;
    },
    settle() {
      parts.forEach((p) => { p.obj.position.copy(p.final); p.obj.rotation.copy(p.rot); p.obj.visible = true; });
      setCam(1); render();
    },
    highlight(slug, gsap) {
      const dimC = new THREE.Color(C.dim);
      ['refurbishments', 'extensions', 'loft-conversion'].forEach((g) => {
        const on = !slug || slug === g;
        mats[g].forEach((m) => {
          const target = m.userData.base.clone().lerp(dimC, on ? 0 : 0.72);
          gsap.to(m.color, { r: target.r, g: target.g, b: target.b, duration: 0.3, onUpdate: render });
        });
      });
      const dimBase = !!slug;
      mats.base.forEach((m) => {
        const target = m.userData.base.clone().lerp(dimC, dimBase ? 0.6 : 0);
        gsap.to(m.color, { r: target.r, g: target.g, b: target.b, duration: 0.3, onUpdate: render });
      });
    },
    anchor(slug) {
      const pick = { refurbishments: groups[R][3], extensions: groups[E][3], 'loft-conversion': groups[L][4] }[slug];
      if (!pick) return null;
      const v = new THREE.Box3().setFromObject(pick).getCenter(new THREE.Vector3());
      if (slug === 'refurbishments') v.y += 0.6;
      if (slug === 'extensions') v.y += 0.3;
      if (slug === 'loft-conversion') v.y += 0.9;
      v.project(camera);
      return { x: (v.x + 1) / 2, y: (1 - v.y) / 2 };
    },
    resize,
    dispose() { disposables.forEach((d) => d.dispose?.()); renderer.dispose(); },
  };
  api.reset();
  return api;
}
