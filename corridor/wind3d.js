/* MotorSpace gallery homepage: the wind tunnel in 3D (主人 2026-10-24: 「把它变成 3D 的，从网上下免费的 3D 模型，加风的感觉，
   同时也有变色的效果，点到哪颜色会变一下」). Replaces wind.js (the 2D Xiaomi-configurator pictures, which could not go live).
   The car is a glTF model (site/windtunnel3d/model/su7u.glb: "2025 Xiaomi SU7 Ultra" by Dave Love SketchFab, CC BY 4.0, livery removed,
   see dev/windtunnel/su7u-3d/), drawn with three.js (site/vendor/three/, loaded only when the section comes near; the page's
   <script type="importmap"> maps "three" and "three/addons/" to it). What stays from the 2D piece: the streamlines on a 2D canvas
   over the car (its silhouette now comes from a small mask render of the model, so the air follows the car as it turns), the light
   under the pointer that shows the next paint, the click that floods the car with it, the chips and the readout.
   What is new: the body paint is a real material (clear coat; chrome is metal 1 / roughness 0.05 mirroring the studio), the light is a
   screen-space mix inside the paint shader (uLens), and the floor shows a soft shadow and a fading reflection (a mirrored copy of the
   car, desktop only). The car turns all the way round under a drag (主人 2026-10-24: 「按住哪里就跟着转，可以 360 度」; mouse: up/down
   also tilts the view a little), keeps spinning a moment after a flick, and some seconds after the pointer has gone it comes back to
   the side view and sways again. The reflections come from a small studio built here (a dark room, a softbox overhead, long strip
   lights along both sides), so the paint reads like the old configurator pictures rather than the flat grey of a generic room.
   MSWind3D.mount(root, { base, lang }) works inside root; destroy() takes everything down. base = URL of site/windtunnel3d/. */
(function () {
  'use strict';
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches, STILL = false;
  var FINE = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  // desktops get the finer model (8.5 MB: 365k triangles, 1024 px textures); phones and tablets the lighter one (4.4 MB)
  var HD = FINE && Math.min(screen.width, screen.height) >= 700;
  var TXS = { zh: { body: '车身', lens: '光圈里' }, pl: { body: 'Lakier', lens: 'W świetle' }, en: { body: 'Body', lens: 'In the light' } };
  var VENDOR = null;  // set from base: ../vendor/three/

  function mount(root, o) {
  var BASE = o.base, LANG = o.lang in TXS ? o.lang : 'pl', tx = TXS[LANG];
  STILL = !!o.still;                 // poster mode: no light, no sway (the static picture is shot from this)
  VENDOR = o.vendor || (BASE + '../vendor/three/');
  VENDOR = new URL(VENDOR, document.baseURI).href;   // import() in a classic script resolves against the script's URL, not the page's
  function $(c) { return root.querySelector('.' + c); }
  var stage = $('wt-stage'), gl = $('wt3-gl'), glow = $('wt-glow'), poster = $('wt3-poster');
  var cv = $('wt-flow'), ctx = cv.getContext('2d');
  var chipsEl = $('wt-paints'), readout = $('wt-readout');
  var offs = [], dead = false;
  function on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); offs.push(function () { el.removeEventListener(ev, fn, opt); }); }

  /* ---------- state ---------- */
  var T = null, renderer = null, scene = null, cam = null, grp = null, car = null, mirror = null, floorShadow = null, fade = null;
  var paintMat = null, mirrorPaints = [], lensU = null, maskRT = null, maskMat = null, maskBuf = null;
  var paints = [], base = 0, lens = 1, chips = [];
  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0, cw = 0, ch = 0, s = 1, sc = 1, R = 100, GROUND = 0, IW = 1974;
  var roof = null, sill = null, MASKW = 0, MASKH = 0, maskDue = true, lastMaskYaw = 1e9, lastMaskT = 0;
  var STEP = 5, lanes = [], dashes = [], alive = 0;
  var P = { x: 0, y: 0, in: false, t: -1e9, touch: false, down: null };
  // the turn: spin is the user's (unbounded, radians; a drag sets it, a flick leaves spinV to run down), off the small sway / pointer
  // lean on top of it, tilt the user's view height (mouse drags only)
  var spin = 0, spinV = 0, off = 0, tilt = 0, turned = false;
  var Ls = { x: 0, y: 0, r: 0 };
  var F = { x: 0, y: 0, p: 0 };
  var yaw = 0, yawT = 0, pitch = 0, pitchT = 0, camD = 16;
  var flow = 0.4, clock = 0, last = 0, raf = 0, running = false, visible = false;
  var splash = null, swapping = false, tint = '255,255,255';

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rgb(hex) { var n = parseInt(hex.slice(1), 16); return (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255); }
  function nextPaint(i) { return (i + 1) % paints.length; }

  /* ---------- three: scene, materials, the paint shader ---------- */
  // the studio the paint reflects (fixed in the world, so the highlights travel over the body as it turns): a near-black room and
  // floor, a big softbox overhead (roof, bonnet, shoulders), two long strips per side at 1.6 m and 2.8 m (the sharp lines along
  // the doors), dim panels at both ends. Colours above 1 are light (the PMREM render is HDR).
  function studio() {
    var env = new T.Scene(), box = new T.BoxGeometry(1, 1, 1), pl = new T.PlaneGeometry(1, 1);
    var room = new T.Mesh(box, new T.MeshBasicMaterial({ color: 0x0b0c0f, side: T.BackSide }));
    room.scale.set(34, 16, 34); room.position.y = 7.9; env.add(room);
    var floor = new T.Mesh(pl, new T.MeshBasicMaterial({ color: 0x060607 }));
    floor.scale.set(34, 34, 1); floor.rotation.x = -Math.PI / 2; env.add(floor);
    function panel(w, h, k, x, y, z, rx, ry) {
      var m = new T.MeshBasicMaterial({ side: T.DoubleSide }); m.color.setScalar(k);
      var q = new T.Mesh(pl, m); q.scale.set(w, h, 1); q.position.set(x, y, z); q.rotation.set(rx || 0, ry || 0, 0, 'YXZ'); env.add(q);
    }
    panel(13, 5, 5.5, 0, 7.5, 0, Math.PI / 2);                                            // overhead softbox
    [-1, 1].forEach(function (sd) {
      panel(22, 0.32, 14, 0, 1.6, sd * 9.5, 0, 0);                                         // the long strips along each side
      panel(22, 0.22, 9, 0, 2.8, sd * 9.5, 0, 0);
      panel(4.5, 2.4, 1.4, sd * 11, 2.2, 0, 0, Math.PI / 2);                               // the ends (nose / tail when side-on)
    });
    panel(16, 1.4, 0.2, 0, 0.55, 9.6, 0, 0);                                               // a faint low band: the sills don't drown
    return env;
  }
  function setupScene(mods, gltf) {
    T = mods.THREE;
    renderer = new T.WebGLRenderer({ canvas: gl, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: STILL });
    renderer.toneMapping = T.NeutralToneMapping; renderer.toneMappingExposure = 1.0;   // keeps the paint's own hue (ACES bleached the yellow)
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.shadowMap.enabled = FINE; renderer.shadowMap.type = T.VSMShadowMap;
    scene = new T.Scene();
    var pm = new T.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(studio(), 0.02).texture; pm.dispose();
    cam = new T.PerspectiveCamera(18, 2, 0.5, 80);

    car = gltf.scene;
    var box0 = new T.Box3().setFromObject(car);
    car.position.set(-(box0.min.x + box0.max.x) / 2, -box0.min.y, -(box0.min.z + box0.max.z) / 2);
    grp = new T.Group(); grp.add(car); grp.rotation.y = -Math.PI / 2;   // the model's nose is -Z; on screen the nose is right (+X)
    scene.add(grp);

    // materials: the body paint becomes ours; wheels/glass/lights are plain in the file (the author styled them on Sketchfab only)
    var dark = function (hex, met, rou) { return new T.MeshStandardMaterial({ color: hex, metalness: met, roughness: rou }); };
    var gloss = function (hex, met, rou, cc) { return new T.MeshPhysicalMaterial({ color: hex, metalness: met, roughness: rou, clearcoat: cc, clearcoatRoughness: 0.06 }); };
    // as on the configurator pictures: gloss-black forged wheels, yellow calipers, dark discs, black carbon
    var rim = gloss(0x0c0d10, 0.4, 0.32, 0.7), caliper = gloss(0xe0a800, 0.05, 0.32, 1), disc = dark(0x3b3d42, 0.9, 0.42), tyre = dark(0x141416, 0, 0.86);
    var carbon = gloss(0x0b0c0e, 0, 0.7, 0.2), blackGloss = gloss(0x08090b, 0.1, 0.2, 1);
    // the glass dark enough that the race car's roll cage behind it is a shadow, not a drawing
    var glass = new T.MeshPhysicalMaterial({ color: 0x030406, metalness: 0.1, roughness: 0.03, transparent: true, opacity: 0.92, envMapIntensity: 1.5 });
    var lampGlass = new T.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.02, transparent: true, opacity: 0.32, envMapIntensity: 1.6 });
    var tail = new T.MeshStandardMaterial({ color: 0x8a0010, emissive: 0xff1a2a, emissiveIntensity: 1.6, roughness: 0.3 });
    var lamp = new T.MeshStandardMaterial({ color: 0xdfe6f2, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.2 });
    paintMat = new T.MeshPhysicalMaterial({ color: 0xf1c40f, metalness: 0, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.1 });
    lensU = { uLens: { value: new T.Vector3(-1e4, -1e4, 0) }, uColB: { value: new T.Color(0xffffff) }, uMetB: { value: 1 }, uRouB: { value: 0.05 }, uCcB: { value: 0 } };
    paintMat.onBeforeCompile = function (sh) {
      Object.assign(sh.uniforms, lensU);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uLens; uniform vec3 uColB; uniform float uMetB; uniform float uRouB; uniform float uCcB; float mL = 0.0;')
        .replace('#include <color_fragment>', '#include <color_fragment>\n{ float dL = distance(gl_FragCoord.xy, uLens.xy); mL = 1.0 - smoothstep(uLens.z * 0.78, uLens.z, dL); diffuseColor.rgb = mix(diffuseColor.rgb, uColB, mL); }')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n{ float dL2 = distance(gl_FragCoord.xy, uLens.xy); float rim = smoothstep(uLens.z * 0.84, uLens.z * 0.97, dL2) * (1.0 - smoothstep(uLens.z * 0.97, uLens.z * 1.1, dL2)); totalEmissiveRadiance += vec3(0.95, 0.97, 1.0) * (rim * 0.55 + mL * 0.06) * step(0.5, uLens.z); }')
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, uRouB, mL);')
        .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, uMetB, mL);')
        .replace('material.clearcoat = clearcoat;', 'material.clearcoat = mix(clearcoat, uCcB, mL);');
    };
    paintMat.customProgramCacheKey = function () { return 'msw3-paint'; };
    // material names from the file: rim, disc, tyre, the two caliper parts; Carbon_Fiber also has the wing endplates (the "MOD"
    // lettering is pressed flat in dev/windtunnel/su7u-3d/tools/process.mjs), Procedural_Carbon_Fiber is the wing blade
    var SWAP = { BODY_PAINT: paintMat, '0000017412EE1538_WHEEL': rim, '000001740F6741B8': disc, '00000174093DB1B8': tyre,
      'black.001': caliper, '0000017408DD5278_SECONDARY': caliper, Carbon_Fiber: carbon, Procedural_Carbon_Fiber: carbon, Black_glossy: blackGloss,
      Window: glass, HeadLight_Glass: lampGlass, 'HeadLight_Glass.001': lampGlass, 'LEGO_Trans-Red': tail, Lamp: lamp };
    car.traverse(function (m) {
      if (!m.isMesh) return;
      var n = m.material && m.material.name, r = SWAP[n]; m.userData.srcMat = n;
      if (r) m.material = r; else if (m.material) { m.material.envMapIntensity = 0.9; }
      if (n === 'material') m.visible = false;   // four small white squares stuck on the side windows (race-car stickers)
      m.castShadow = FINE && n !== 'Window'; m.receiveShadow = false;
      if (n === 'Window' || n === 'HeadLight_Glass' || n === 'HeadLight_Glass.001') m.renderOrder = 2;
    });

    // the model has no floor pan, so a reflection (seen from above = the car from below) would look into the cabin: a dark pan
    var pan = new T.Mesh(new T.BoxGeometry(1.7, 0.34, 4.2), new T.MeshBasicMaterial({ color: 0x050506 }));
    pan.position.set(0, 0.26 - car.position.y, 0); pan.castShadow = false; car.add(pan);
    // floor: a soft shadow (shadow map on desktop; a dark blob otherwise) and a fading mirror image of the car
    var floorGeo = new T.PlaneGeometry(40, 40);
    if (FINE) {
      floorShadow = new T.Mesh(floorGeo, new T.ShadowMaterial({ opacity: 0.55 }));
      floorShadow.rotation.x = -Math.PI / 2; floorShadow.receiveShadow = true; floorShadow.position.y = 0.002; scene.add(floorShadow);
      var key = new T.DirectionalLight(0xffffff, 1.6); key.position.set(2.5, 9, 4); key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 7; key.shadow.blurSamples = 10;
      key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 3; key.shadow.camera.bottom = -3; key.shadow.camera.near = 2; key.shadow.camera.far = 20;
      key.shadow.bias = -0.0004;
      scene.add(key);
      // the mirror image: the same meshes with their own dimmed, opaque materials (one shared clone per source material)
      mirror = car.clone(true); mirrorPaints = [];
      var mirrorOf = new Map();
      mirror.traverse(function (m) {
        if (!m.isMesh) return;
        m.castShadow = false;
        var src = m.material, mm = mirrorOf.get(src);
        if (!mm) {
          mm = src.clone();
          if (mm.color) mm.color.multiplyScalar(0.38);
          if (mm.emissive) mm.emissiveIntensity = (mm.emissiveIntensity || 1) * 0.5;
          mm.envMapIntensity = (src.envMapIntensity || 1) * 0.4;
          if (src === paintMat) { mm.onBeforeCompile = paintMat.onBeforeCompile; mm.customProgramCacheKey = function () { return 'msw3-paint-mirror'; }; mirrorPaints.push(mm); }
          mirrorOf.set(src, mm);
        }
        m.material = mm;
      });
      var mg = new T.Group(); mg.add(mirror); mg.scale.y = -1; mg.position.y = 0; mirror.position.copy(car.position);
      mg.rotation.y = grp.rotation.y; scene.add(mg); mirror.userData.holder = mg;
      // a dark plane a hair above the floor hides the mirror image except right under the car, where it shows through at
      // about half strength and dies out within a couple of metres towards the camera (the plane is 40 m deep: the stage's
      // lower edge looks at the floor 8 m in front of the car)
      var FD = 40, fc = document.createElement('canvas'); fc.width = 4; fc.height = 1024;
      var g2 = fc.getContext('2d'), img = g2.createImageData(4, 1024);
      for (var row = 0; row < 1024; row++) {
        var z = (0.5 - row / 1023) * FD * -1;            // texture top = far side (-z); bottom = towards the camera (+z)
        var al = z < -1.3 ? 1 : z < 1.3 ? 0.5 : z < 3.6 ? 0.5 + 0.5 * (z - 1.3) / 2.3 : 1;
        al = Math.min(1, al + (z > -1.3 && z < 1.3 ? 0.18 * Math.abs(z) / 1.3 : 0));
        for (var c = 0; c < 4; c++) { var o = (row * 4 + c) * 4; img.data[o] = 0; img.data[o + 1] = 0; img.data[o + 2] = 0; img.data[o + 3] = Math.round(al * 255); }
      }
      g2.putImageData(img, 0, 0);
      var ft = new T.CanvasTexture(fc);
      fade = new T.Mesh(new T.PlaneGeometry(FD, FD), new T.MeshBasicMaterial({ map: ft, transparent: true, depthWrite: false }));
      fade.rotation.x = -Math.PI / 2; fade.position.y = 0.004; fade.renderOrder = 1; scene.add(fade);
    } else {
      var bc = document.createElement('canvas'); bc.width = 256; bc.height = 128;
      var g3 = bc.getContext('2d'), rg = g3.createRadialGradient(128, 64, 10, 128, 64, 120);
      rg.addColorStop(0, 'rgba(0,0,0,0.9)'); rg.addColorStop(0.5, 'rgba(0,0,0,0.45)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
      g3.fillStyle = rg; g3.fillRect(0, 0, 256, 128);
      var bt = new T.CanvasTexture(bc);
      floorShadow = new T.Mesh(new T.PlaneGeometry(6.4, 3.2), new T.MeshBasicMaterial({ map: bt, transparent: true, depthWrite: false }));
      floorShadow.rotation.x = -Math.PI / 2; floorShadow.position.y = 0.002; scene.add(floorShadow);
    }
    if (STILL && mirror) { mirror.userData.holder.visible = false; fade.visible = false; }   // the poster: car and shadow on nothing
    scene.add(new T.HemisphereLight(0xcfd8ea, 0x15161a, 0.35));

    // the silhouette mask: the car alone, flat white, on a small render target
    maskMat = new T.MeshBasicMaterial({ color: 0xffffff });
    maskRT = new T.WebGLRenderTarget(4, 4, { depthBuffer: true });
    applyPaint(base); setLensPaint(lens);
  }
  function applyPaint(i) {
    var p = paints[i];
    paintMat.color.set(p.color); paintMat.metalness = p.metal; paintMat.roughness = p.rough; paintMat.clearcoat = p.clearcoat;
    paintMat.specularIntensity = p.spec != null ? p.spec : 1;   // the base coat's own sheen (dark paints: mostly the clear coat shines)
    paintMat.envMapIntensity = p.id === 'chrome' ? 1.15 : 1;
    paintMat.needsUpdate = true;
    mirrorPaints.forEach(function (mm) { mm.color.copy(paintMat.color).multiplyScalar(0.38); mm.specularIntensity = paintMat.specularIntensity; mm.metalness = p.metal; mm.roughness = p.rough; mm.clearcoat = p.clearcoat; mm.envMapIntensity = paintMat.envMapIntensity * 0.4; mm.needsUpdate = true; });
  }
  function setLensPaint(i) {
    var p = paints[i];
    lensU.uColB.value.set(p.color); lensU.uMetB.value = p.metal; lensU.uRouB.value = p.rough; lensU.uCcB.value = p.clearcoat;
  }

  /* ---------- the silhouette -> streamlines (as in wind.js, the profile read from the mask render) ---------- */
  function renderMask() {
    MASKW = Math.max(64, Math.round(W / 4)); MASKH = Math.max(32, Math.round(H / 4));
    if (maskRT.width !== MASKW || maskRT.height !== MASKH) { maskRT.setSize(MASKW, MASKH); maskBuf = new Uint8Array(MASKW * MASKH * 4); }
    var hid = [floorShadow, fade, mirror && mirror.userData.holder].filter(Boolean), vis = hid.map(function (m) { return m.visible; });
    hid.forEach(function (m) { m.visible = false; });
    var bg = scene.background, env = scene.environment; scene.environment = null;
    scene.overrideMaterial = maskMat;
    var oldTM = renderer.toneMapping; renderer.toneMapping = T.NoToneMapping;
    renderer.setRenderTarget(maskRT); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(scene, cam);
    renderer.readRenderTargetPixels(maskRT, 0, 0, MASKW, MASKH, maskBuf);
    renderer.setRenderTarget(null); scene.overrideMaterial = null; scene.environment = env; scene.background = bg; renderer.toneMapping = oldTM;
    hid.forEach(function (m, i) { m.visible = vis[i]; });
    // columns -> roof (first opaque row from the top) and sill (last), in stage px; the target's rows run bottom-up
    roof = new Float32Array(MASKW); sill = new Float32Array(MASKW);
    var k = W / MASKW, first = -1, lastCol = -1, minY = 1e9, maxY = -1;
    for (var x = 0; x < MASKW; x++) {
      roof[x] = sill[x] = -1;
      for (var y = 0; y < MASKH; y++) { var row = MASKH - 1 - y; if (maskBuf[(row * MASKW + x) * 4 + 3] > 100) { roof[x] = y * k; break; } }
      for (y = MASKH - 1; y >= 0; y--) { row = MASKH - 1 - y; if (maskBuf[(row * MASKW + x) * 4 + 3] > 100) { sill[x] = y * k; break; } }
      if (roof[x] >= 0) { if (first < 0) first = x; lastCol = x; minY = Math.min(minY, roof[x]); maxY = Math.max(maxY, sill[x]); }
    }
    if (first < 0) return;
    cx = first * k; cw = (lastCol - first + 1) * k; cy = minY; ch = maxY - minY; GROUND = maxY;
    s = cw / IW; sc = cw / 1100; R = cw * (W < 700 ? 0.2 : 0.14);
    glow.style.cssText = 'left:' + (cx + cw * 0.5).toFixed(1) + 'px;top:' + GROUND.toFixed(1) + 'px;width:' + (cw * 1.5).toFixed(1) + 'px;height:' + (ch * 0.9).toFixed(1) + 'px';
    buildLanes();
    if (!F.x) { F.x = W * 0.5; F.y = cy + ch * 0.4; }
  }
  function roofAtPx(x) { var i = Math.round(x / (W / MASKW)); return roof && i >= 0 && i < MASKW ? roof[i] : -1; }
  function sillAtPx(x) { var i = Math.round(x / (W / MASKW)); return sill && i >= 0 && i < MASKW ? sill[i] : -1; }
  function lift(x) { var r = roofAtPx(x); return r < 0 ? 0 : Math.max(0, GROUND - r) / s; }   // body height above the ground, in image units
  function boxBlur(a, r) {
    var n = a.length, out = new Float32Array(n);
    for (var i = 0; i < n; i++) { var sum = 0, c = 0; for (var j = i - r; j <= i + r; j++) if (j >= 0 && j < n) { sum += a[j]; c++; } out[i] = sum / c; }
    return out;
  }
  function buildLanes() {
    var n = Math.ceil(W / STEP) + 2, raw = new Float32Array(n), e = new Float32Array(n), k, a;
    for (k = 0; k < n; k++) raw[k] = lift(k * STEP);
    var up = Math.exp(-STEP / (210 * s)), down = Math.exp(-STEP / (300 * s));
    for (a = 0, k = 0; k < n; k++) { a = Math.max(raw[k], a * up); e[k] = a; }
    for (a = 0, k = n - 1; k >= 0; k--) { a = Math.max(raw[k], a * down); e[k] = Math.max(e[k], a); }
    var r = Math.max(2, Math.round(24 * s / STEP));
    e = boxBlur(boxBlur(boxBlur(e, r), r), r);
    lanes = [];
    var N = 15, i;
    for (i = 0; i < N; i++) lanes.push(lane(e, 8 + 470 * Math.pow(i / (N - 1), 1.45), false));
    [110, 165, 220, 275].forEach(function (h) { lanes.push(lane(e, h, true)); });
  }
  function lane(e, h, side) {
    var ys = new Float32Array(e.length), D = 380, w = 1 / (1 + (h / D) * (h / D));
    for (var k = 0; k < e.length; k++) ys[k] = GROUND - (side ? h + 0.05 * e[k] : h + 12 + e[k] * w) * s;
    return { ys: ys, side: side };
  }
  function laneY(l, x) { var f = clamp(x / STEP, 0, l.ys.length - 1.001), k = f | 0, t = f - k; return l.ys[k] + (l.ys[k + 1] - l.ys[k]) * t; }
  function sideEnv(x) { var nose = cx + cw; return clamp((nose + 30 * sc - x) / (90 * sc), 0, 1) * clamp((x - cx + 40 * sc) / (160 * sc), 0, 1); }

  /* ---------- layout ---------- */
  function layout() {
    var r = stage.getBoundingClientRect();
    W = Math.max(1, r.width);
    var compact = window.innerHeight > window.innerWidth * 1.05;
    root.classList.toggle('is-compact', compact);
    if (compact) { H = Math.round(Math.min(W * 0.97, 1180) * 600 / IW * 2.6); stage.style.height = H + 'px'; }
    else { stage.style.height = ''; H = Math.max(1, stage.getBoundingClientRect().height); }
    DPR = Math.min(FINE ? 2 : 1.5, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    if (!renderer) return;
    renderer.setPixelRatio(DPR); renderer.setSize(W, H, false);
    cam.aspect = W / H; cam.updateProjectionMatrix();
    // side-on, the car (5.3 m) fills about 84% of the stage width (97% on phones; at most 1260 px), and never more
    // than half of its height, so the air above it and the reflection below keep their room
    var tn = Math.tan(cam.fov * Math.PI / 360), frac = W < 700 ? 0.97 : Math.min(0.84, 1260 / W);
    camD = Math.max(3.0 / (frac * tn * cam.aspect), 1.3 / (0.5 * 2 * tn));   // 3.0: half the length, plus the near corners' perspective
    maskDue = true;
  }
  function placeCamera() {
    var el = 0.085 + pitch + tilt;   // elevation: a touch above the belt line, so the roof shows and the car reads as a solid
    cam.position.set(0, camD * Math.sin(el) + 0.55, camD * Math.cos(el));
    cam.lookAt(0, 0.6, 0);
  }

  /* ---------- the light ---------- */
  var shown = { x: -1, y: -1, r: -1 };
  function updateLight(dt, now) {
    var tx_, ty, tr, k = REDUCE ? 1 : 1 - Math.exp(-dt * 9), kr = REDUCE ? 1 : 1 - Math.exp(-dt * 7);
    var px = P.x - cx, py = P.y - cy;
    if (P.in) {
      var over = px > -R * .4 && px < cw + R * .3 && py > -R * .5 && py < ch + R * .2;
      tx_ = over ? px : Ls.x; ty = over ? py : Ls.y; tr = over ? R : 0;
    } else if (now - P.t < (P.touch ? 1400 : 1600)) { tx_ = Ls.x; ty = Ls.y; tr = P.touch ? R : 0; }
    else if (STILL) { tx_ = Ls.x; ty = Ls.y; tr = 0; }
    else if (REDUCE) { tx_ = cw * 0.66; ty = ch * 0.42; tr = R; }
    else { var t = clock * 0.42; tx_ = cw * (0.53 + 0.37 * Math.sin(t)); ty = ch * (0.47 + 0.1 * Math.sin(t * 2 + 0.6)); tr = R * 0.95; }
    if (swapping || splash || (P.down && P.down.moved) || Math.abs(spinV) > 0.4) tr = 0;
    if (Ls.r < 0.5 && tr > 0) { Ls.x = tx_; Ls.y = ty; }
    Ls.x += (tx_ - Ls.x) * k; Ls.y += (ty - Ls.y) * k; Ls.r += (tr - Ls.r) * kr;
    if (Ls.r < 0.5 && tr === 0) Ls.r = 0;
    if (!splash) lensU.uLens.value.set((cx + Ls.x) * DPR, (H - (cy + Ls.y)) * DPR, Ls.r * DPR);
    stage.style.setProperty('--lo', clamp(Ls.r / R, 0, 1).toFixed(3));
  }

  /* ---------- repaint: the light grows until it covers the car, then the body takes the paint ---------- */
  function commit(i, x, y) {
    if (splash || swapping || i === base || !paints.length) return;
    if (x == null) { if (Ls.r > R * 0.3) { x = Ls.x; y = Ls.y; } else { x = cw * 0.9; y = ch * 0.6; } }
    var r0 = i === lens ? Ls.r : 0;
    var r1 = Math.hypot(Math.max(x, cw - x), Math.max(y, ch - y)) * 1.25 + 20;
    setLensPaint(i);
    splash = { i: i, x: x, y: y, r0: r0, r1: r1, t0: 0, dur: REDUCE ? 1 : 900 };
    gust(i, cy + y);
  }
  function runSplash(now) {
    if (!splash) return;
    if (!splash.t0) splash.t0 = now;
    var p = clamp((now - splash.t0) / splash.dur, 0, 1), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    lensU.uLens.value.set((cx + splash.x) * DPR, (H - (cy + splash.y)) * DPR, (splash.r0 + (splash.r1 - splash.r0) * e) * DPR);
    if (p < 1) return;
    var sp = splash; splash = null;
    base = sp.i; lens = nextPaint(base);
    applyPaint(base); setLensPaint(lens);
    Ls.r = 0; lensU.uLens.value.set(-1e4, -1e4, 0);
    syncUI();
  }

  /* ---------- streaks (wind.js) ---------- */
  function pickLane() {
    var tot = 0, wts = [], i;
    for (i = 0; i < lanes.length; i++) {
      var d = laneY(lanes[i], F.x) - F.y, wt = (lanes[i].side ? 0.35 : 1) * (0.3 + 3 * F.p * Math.exp(-d * d / (2 * 95 * 95 * sc * sc)));
      wts.push(wt); tot += wt;
    }
    var r = Math.random() * tot;
    for (i = 0; i < lanes.length; i++) { r -= wts[i]; if (r <= 0) return i; }
    return lanes.length - 1;
  }
  function spawn(d, opt) {
    opt = opt || {};
    d.lane = opt.lane != null ? opt.lane : pickLane();
    d.len = (50 + 240 * Math.random() * Math.random()) * sc * (opt.long || 1);
    d.v = (650 + 850 * Math.random()) * sc * (opt.fast || 1);
    d.x = opt.x != null ? opt.x : (Math.random() < 0.55 ? W + Math.random() * W * 0.25 : F.x - 80 * sc + Math.random() * (W - F.x + 80 * sc));
    d.a = opt.a || (0.3 + 0.6 * Math.random());
    d.tint = opt.tint != null ? opt.tint : Math.random() < 0.4;
    d.col = d.tint ? tint : '255,255,255';
    d.w = Math.random() < 0.18 ? 1.5 : 1;
    d.age = 0; d.burst = !!opt.burst;
    if (!d.on) alive++;
    d.on = true;
  }
  function gust(i, y) {
    if (REDUCE || !lanes.length) return;
    var col = rgb(paints[i].glow || '#ffffff'), n = 0;
    for (var k = 0; k < dashes.length && n < 26; k++) if (!dashes[k].on) {
      var best = 0, bd = 1e9;
      for (var j = 0; j < lanes.length; j++) { var d = Math.abs(laneY(lanes[j], W * 0.5) - y) + Math.random() * 120 * sc; if (d < bd) { bd = d; best = j; } }
      spawn(dashes[k], { lane: best, x: cx + cw * (0.3 + 0.8 * Math.random()), a: 0.6 + 0.4 * Math.random(), fast: 1.5, long: 1.6, tint: true, burst: true });
      dashes[k].col = col; n++;
    }
    flow = 1;
  }
  function drawFlow(dt) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    if (!lanes.length) return;
    var fx, fy, fp;
    if (P.in) { fx = P.x; fy = P.y; fp = 1; } else { fx = cx + Ls.x; fy = cy + Ls.y; fp = 0.75 * clamp(Ls.r / R, 0, 1); }
    var kf = REDUCE ? 1 : 1 - Math.exp(-dt * 6);
    F.x += (fx - F.x) * kf; F.y += (fy - F.y) * kf; F.p += (fp - F.p) * (REDUCE ? 1 : 1 - Math.exp(-dt * 3));
    flow += ((0.35 + 0.65 * F.p) - flow) * (1 - Math.exp(-dt * 1.5));
    var sig = 110 * sc, i, k, l;
    var fxN = clamp(F.x / W, 0.14, 0.86);
    ctx.lineWidth = 0.8;
    for (i = 0; i < lanes.length; i++) {
      l = lanes[i]; if (l.side) continue;
      var d0 = laneY(l, F.x) - F.y, near = Math.exp(-d0 * d0 / (2 * sig * sig)) * F.p;
      var a = 0.035 + 0.17 * near, g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.12, 'rgba(255,255,255,' + (a * 0.55).toFixed(3) + ')');
      g.addColorStop(fxN, 'rgba(' + (near > 0.4 ? tint : '255,255,255') + ',' + a.toFixed(3) + ')');
      g.addColorStop(0.88, 'rgba(255,255,255,' + (a * 0.55).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g;
      ctx.beginPath(); ctx.moveTo(0, l.ys[0]);
      for (k = 1; k < l.ys.length; k++) ctx.lineTo(k * STEP, l.ys[k]);
      ctx.stroke();
    }
    if (!REDUCE) {
      var want = Math.round(14 + 48 * flow), budget = 3;
      for (i = 0; i < dashes.length && alive < want && budget > 0; i++) if (!dashes[i].on) { spawn(dashes[i]); budget--; }
      for (i = 0; i < dashes.length; i++) {
        var dd = dashes[i]; if (!dd.on) continue;
        dd.x -= dd.v * dt; dd.age += dt;
        var tail = dd.x + dd.len;
        if (tail < 0) { dd.on = false; alive--; continue; }
        l = lanes[dd.lane];
        var hy = laneY(l, dd.x), dy = hy - F.y, dx = dd.x - F.x;
        var nr = F.p * Math.exp(-dy * dy / (2 * sig * sig * 1.2) - dx * dx / (2 * 400 * 400 * sc * sc));
        var al = dd.a * (dd.burst ? 1 : 0.28 + 0.95 * nr) * Math.min(1, dd.age / 0.18);
        if (l.side) al *= 0.55 * sideEnv(dd.x);
        if (al < 0.012) continue;
        al = Math.min(1, al);
        ctx.beginPath(); ctx.moveTo(dd.x, hy);
        var k0 = Math.max(0, Math.floor(dd.x / STEP) + 1), k1 = Math.min(l.ys.length - 1, Math.ceil(tail / STEP));
        for (k = k0; k <= k1; k++) ctx.lineTo(k * STEP, l.ys[k]);
        if (al > 0.3) {
          var gh = ctx.createLinearGradient(dd.x, 0, dd.x + dd.len * 0.6, 0);
          gh.addColorStop(0, 'rgba(' + dd.col + ',' + (al * 0.2).toFixed(3) + ')'); gh.addColorStop(1, 'rgba(' + dd.col + ',0)');
          ctx.strokeStyle = gh; ctx.lineWidth = dd.w + 3; ctx.stroke();
        }
        var gr = ctx.createLinearGradient(dd.x, 0, tail, 0);
        gr.addColorStop(0, 'rgba(' + dd.col + ',' + al.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(' + dd.col + ',0)');
        ctx.strokeStyle = gr; ctx.lineWidth = dd.w; ctx.stroke();
      }
    }
    // the light itself: a soft pool around the lens, in the next paint's glow colour (the canvas is screen-blended)
    if (Ls.r > 0.5 && !splash) {
      var lx = cx + Ls.x, ly = cy + Ls.y, lr = Ls.r * 1.7, lg = ctx.createRadialGradient(lx, ly, Ls.r * 0.3, lx, ly, lr);
      lg.addColorStop(0, 'rgba(' + tint + ',0.16)'); lg.addColorStop(0.55, 'rgba(' + tint + ',0.05)'); lg.addColorStop(1, 'rgba(' + tint + ',0)');
      ctx.fillStyle = lg; ctx.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
    }
    ctx.globalCompositeOperation = 'destination-out';
    var e1 = ctx.createLinearGradient(0, 0, 0, 70);
    e1.addColorStop(0, 'rgba(0,0,0,1)'); e1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = e1; ctx.fillRect(0, 0, W, 70);
    var ew = Math.min(140, W * 0.1), e2 = ctx.createLinearGradient(0, 0, ew, 0);
    e2.addColorStop(0, 'rgba(0,0,0,1)'); e2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = e2; ctx.fillRect(0, 0, ew, H);
    var e3 = ctx.createLinearGradient(W - ew, 0, W, 0);
    e3.addColorStop(0, 'rgba(0,0,0,0)'); e3.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = e3; ctx.fillRect(W - ew, 0, ew, H);
  }

  /* ---------- the turn: drag = any angle; otherwise a lean after the pointer, and a sway when nobody is there ---------- */
  var TAU = Math.PI * 2;
  function updateTurn(dt, now) {
    var dragging = P.down && P.down.moved;
    if (!dragging && spinV) {                                   // after a flick: the spin runs down
      spin += spinV * dt; spinV *= Math.exp(-dt * 2.4); if (Math.abs(spinV) < 0.02) spinV = 0;
    }
    // some seconds after the pointer has gone (or a touch has ended), back to the side view (the nearest whole turn)
    if (turned && !P.down && !spinV && !P.in && now - P.t > (P.touch ? 5000 : 6000)) {
      var home = Math.round(spin / TAU) * TAU, kb = REDUCE ? 1 : 1 - Math.exp(-dt * 1.6);
      spin += (home - spin) * kb; tilt += (0 - tilt) * kb;
      if (Math.abs(home - spin) < 0.002) { yaw -= home; spin = 0; tilt = 0; turned = false; }   // same angle, counted from 0 again
    }
    var offT;
    if (dragging) { offT = off; pitchT = 0; }
    else if (P.in && FINE) { offT = -(P.x / W - 0.5) * (turned ? 0.25 : 0.6); pitchT = (P.y / H - 0.5) * 0.08; }
    else if (turned || REDUCE || STILL) { offT = turned ? 0 : -0.1; pitchT = 0; }
    else { offT = -0.1 + 0.16 * Math.sin(clock * 0.27); pitchT = 0.02 * Math.sin(clock * 0.19 + 1); }
    var k = REDUCE ? 1 : 1 - Math.exp(-dt * 3.2);
    off += (offT - off) * k; pitch += (pitchT - pitch) * k;
    yawT = spin + off;
    yaw += (yawT - yaw) * (dragging || spinV ? 1 - Math.exp(-dt * 22) : k);
    grp.rotation.y = -Math.PI / 2 + yaw;
    if (mirror) mirror.userData.holder.rotation.y = grp.rotation.y;
    placeCamera();
    if (maskDue || (Math.abs(yaw - lastMaskYaw) > 0.006 && now - lastMaskT > 90)) { renderMask(); lastMaskYaw = yaw; lastMaskT = now; maskDue = false; }
  }

  /* ---------- loop ---------- */
  function frame(now) {
    raf = 0;
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now; clock += dt;
    updateTurn(dt, now);
    updateLight(dt, now);
    runSplash(now);
    renderer.render(scene, cam);
    drawFlow(dt);
    if (running && visible) raf = requestAnimationFrame(frame);
  }
  function play() { if (running && visible && !raf) { last = 0; raf = requestAnimationFrame(frame); } }

  /* ---------- input ---------- */
  function local(e) { var r = stage.getBoundingClientRect(); P.x = e.clientX - r.left; P.y = e.clientY - r.top; }
  function onBody(x, y) { var r = roofAtPx(x); return r >= 0 && y >= r - 10 && y <= sillAtPx(x) + 4; }
  // press anywhere on the stage and drag: the car turns with the hand (a stage width ≈ 0.9 of a turn), all the way round; a mouse
  // drag up/down also raises or lowers the view a little. A press that doesn't move is a click: on the body it repaints the car.
  // On touch screens the stage keeps touch-action: pan-y, so an upright swipe still scrolls the page.
  on(stage, 'pointermove', function (e) {
    local(e); P.in = true; P.t = performance.now(); P.touch = e.pointerType !== 'mouse';
    var d = P.down;
    if (d) {
      if (!d.moved && Math.hypot(P.x - d.x, P.y - d.y) > 6) { d.moved = true; turned = true; spinV = 0; stage.classList.add('is-drag'); }
      if (d.moved) {
        var now = performance.now(), prev = spin;
        spin = d.spin0 + (P.x - d.x) / W * TAU * 0.9;
        if (!P.touch) tilt = clamp(d.tilt0 + (P.y - d.y) / H * 0.7, -0.05, 0.34);
        var dt = Math.max(0.008, (now - d.t) / 1000); d.v = d.v * 0.4 + 0.6 * (spin - prev) / dt; d.t = now;
      }
    }
    stage.classList.toggle('is-over', !(d && d.moved) && onBody(P.x, P.y));
  }, { passive: true });
  on(stage, 'pointerdown', function (e) {
    if (e.button > 0) return;
    local(e); P.in = true; P.t = performance.now(); P.touch = e.pointerType !== 'mouse';
    P.down = { x: P.x, y: P.y, moved: false, spin0: spin, tilt0: tilt, t: P.t, v: 0 }; spinV = 0;
    if (!P.touch && stage.setPointerCapture) try { stage.setPointerCapture(e.pointerId); } catch (x) {}
  });
  on(stage, 'pointerup', function (e) {
    local(e);
    var d = P.down; P.down = null; stage.classList.remove('is-drag');
    if (d && d.moved) { if (performance.now() - d.t < 90) spinV = clamp(d.v, -9, 9); }
    else if (d && onBody(P.x, P.y)) commit(lens, P.x - cx, P.y - cy);
    var r = stage.getBoundingClientRect();
    if (e.pointerType !== 'mouse' || e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { P.in = false; }
    P.t = performance.now();
  });
  function out() { if (P.down && P.down.moved && !P.touch) return; P.in = false; P.down = null; P.t = performance.now(); stage.classList.remove('is-over', 'is-drag'); }
  on(stage, 'pointerleave', out); on(stage, 'pointercancel', out);

  /* ---------- chips ---------- */
  function buildChips() {
    chipsEl.setAttribute('aria-label', tx.body);
    paints.forEach(function (p, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'wt-chip'; b.title = p[LANG] || p.en; b.setAttribute('aria-label', p[LANG] || p.en);
      b.style.setProperty('--sw', p.sw);
      b.appendChild(document.createElement('i'));
      b.addEventListener('click', function () { commit(i); });
      chipsEl.appendChild(b); chips.push(b);
    });
  }
  function syncUI() {
    chips.forEach(function (b, i) {
      b.classList.toggle('is-base', i === base); b.classList.toggle('is-lens', i === lens);
      b.setAttribute('aria-pressed', i === base ? 'true' : 'false');
    });
    tint = rgb(paints[lens].glow || '#ffffff');
    readout.innerHTML = tx.body + ' <b>' + (paints[base][LANG] || paints[base].en) + '</b><span class="wt-sep" aria-hidden="true"></span>' + tx.lens + ' <b>' + (paints[lens][LANG] || paints[lens].en) + '</b>';
  }

  /* ---------- start: only once the section comes near ---------- */
  for (var n = 0; n < 110; n++) dashes.push({ on: false });
  layout();
  var ro = window.ResizeObserver ? new ResizeObserver(function () { layout(); }) : null;
  if (ro) ro.observe(stage); else on(window, 'resize', layout);
  on(document, 'visibilitychange', function () { visible = visible && !document.hidden; play(); });
  var seen = new IntersectionObserver(function (es) { visible = es[es.length - 1].isIntersecting && !document.hidden; play(); });
  seen.observe(stage);
  var started = false;
  function webgl() { try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  var near = new IntersectionObserver(function (es) {
    if (started || !es[es.length - 1].isIntersecting) return;
    started = true; near.disconnect();
    if (!webgl()) { root.classList.add('is-static'); return; }     // no WebGL: the poster picture stays
    var mods = {};
    Promise.all([
      fetch(BASE + 'paints.json').then(function (r) { return r.json(); }),
      import(VENDOR + 'three.module.min.js').then(function (m) { mods.THREE = m; }),
      import(VENDOR + 'loaders/GLTFLoader.js').then(function (m) { mods.GLTFLoader = m.GLTFLoader; }),
      import(VENDOR + 'libs/meshopt_decoder.module.js').then(function (m) { mods.MeshoptDecoder = m.MeshoptDecoder; })
    ]).then(function (res) {
      if (dead) return;
      paints = res[0].paints; base = 0; lens = 1;
      var loader = new mods.GLTFLoader(); loader.setMeshoptDecoder(mods.MeshoptDecoder);
      return loader.loadAsync(BASE + (HD ? 'model/su7u-hd.glb' : 'model/su7u.glb')).then(function (gltf) {
        if (dead) return;
        setupScene(mods, gltf); buildChips(); syncUI(); layout(); placeCamera(); renderMask();
        root.classList.add('is-ready'); running = true; play();
      });
    }).catch(function (err) { try { console.warn('[wind3d]', err); } catch (x) {} root.classList.add('is-static'); });
  }, { rootMargin: '900px 0px' });
  near.observe(root);

  root.__wt3 = { dbg: function () { return { T: T, scene: scene, cam: cam, car: car, W: W, H: H }; }, onBody: onBody, state: function () { return { base: base, lens: lens, cx: cx, cw: cw, cy: cy, ch: ch, R: R, yaw: yaw, spin: spin, tilt: tilt, Ls: Ls, splash: !!splash, hd: HD }; } };
  return { destroy: function () {
    dead = true; running = false; if (raf) cancelAnimationFrame(raf);
    near.disconnect(); seen.disconnect(); if (ro) ro.disconnect();
    offs.forEach(function (f) { f(); });
    chipsEl.innerHTML = '';
    if (renderer) { renderer.dispose(); if (maskRT) maskRT.dispose(); }
  } };
  }

  window.MSWind3D = { mount: mount };
})();
