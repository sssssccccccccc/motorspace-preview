/* MotorSpace gallery homepage: the wind tunnel, as a section between the import steps and the cars in Poland
   (主人 2026-10-18: 「风洞用 B 版（车头朝右、镜面镀铬），放在进口流程和现车之间，上线前再换图」).
   The same piece as the standalone prototype site/windtunnel/ (wt.js; how it works is described there and in
   dev/windtunnel/README.md), made mountable: MSWind.mount(root, { base, lang }) works inside root only, loads
   ultra-right.json and the pictures only when the section comes near, and destroy() takes everything down again.
   base is the URL of site/windtunnel/ ('windtunnel/' or '../windtunnel/').
   Public preview: the car is the SU7 Ultra photo set (Daniel Lu, Wikimedia Commons, CC BY-SA 4.0). */
(function () {
  'use strict';
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var TXS = { zh: { body: '车身', lens: '光圈里' }, pl: { body: 'Lakier', lens: 'W świetle' }, en: { body: 'Body', lens: 'In the light' } };

  function mount(root, o) {
  var BASE = o.base, LANG = o.lang in TXS ? o.lang : 'pl', tx = TXS[LANG];
  function $(c) { return root.querySelector('.' + c); }
  var stage = $('wt-stage'), car = $('wt-car'), carIn = $('wt-car-in'), refl = $('wt-refl'), glow = $('wt-glow'), sweep = $('wt-sweep');
  var imgBase = $('wt-base'), imgSplash = $('wt-splash'), imgLens = $('wt-lens');
  var cv = $('wt-flow'), ctx = cv.getContext('2d');
  var chipsEl = $('wt-paints'), readout = $('wt-readout');
  var offs = [], dead = false;
  function on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); offs.push(function () { el.removeEventListener(ev, fn, opt); }); }

  var IW = 1974, IH = 600, FRONT = [1588, 577], REAR = [420, 580], MIR = false;
  var GROUND = FRONT[1], TILT = 0, NOSEF = IW;
  var C0 = REAR, C1 = FRONT;
  var paints = [], base = 0, lens = 1, chips = [];
  var roof = null, sill = null, PSTEP = 3;

  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0, cw = 0, ch = 0, s = 1, sc = 1, R = 100;
  var STEP = 5, lanes = [], dashes = [], alive = 0;
  var P = { x: 0, y: 0, in: false, t: -1e9, touch: false, down: null };
  var Ls = { x: 0, y: 0, r: 0 };
  var F = { x: 0, y: 0, p: 0 };
  var flow = 0.4, clock = 0, last = 0, raf = 0, running = false, visible = false;
  var splash = null, swapping = false, tint = '255,255,255';

  /* ---------- helpers ---------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function rgb(hex) { var n = parseInt(hex.slice(1), 16); return (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255); }
  function file(i) { return BASE + 'img/' + paints[i].file; }
  function nextPaint(i) { return (i + 1) % paints.length; }
  function decoded(img) { return img.decode ? img.decode().catch(function () {}) : Promise.resolve(); }

  /* ---------- car silhouette -> streamlines ---------- */
  function readRoof(img) {
    var w = Math.round(IW / PSTEP), h = Math.round(IH / PSTEP), c = document.createElement('canvas');
    c.width = w; c.height = h;
    var g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, w, h);
    var a = g.getImageData(0, 0, w, h).data;
    roof = new Float32Array(w); sill = new Float32Array(w);
    var first = -1, lastCol = -1;
    for (var x = 0; x < w; x++) {
      roof[x] = sill[x] = -1;
      for (var y = 0; y < h; y++) if (a[(y * w + x) * 4 + 3] > 110) { roof[x] = y * PSTEP; break; }
      for (y = h - 1; y >= 0; y--) if (a[(y * w + x) * 4 + 3] > 110) { sill[x] = y * PSTEP; break; }
      if (roof[x] >= 0) { if (first < 0) first = x; lastCol = x; }
    }
    NOSEF = MIR ? IW - first * PSTEP : lastCol * PSTEP;
  }
  function roofAt(xi) { var i = Math.round(xi / PSTEP); return roof && i >= 0 && i < roof.length ? roof[i] : -1; }
  function sillAt(xi) { var i = Math.round(xi / PSTEP); return sill && i >= 0 && i < sill.length ? sill[i] : -1; }
  // body height above the ground at a flow-space image column (flow space has the nose on the right)
  function lift(xf) { var r = roofAt(MIR ? IW - xf : xf); return r < 0 ? 0 : Math.max(0, GROUND - r); }
  function cxF() { return MIR ? W - cx - cw : cx; }                 // the car's left edge in flow space
  function boxBlur(a, r) {
    var n = a.length, out = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var sum = 0, c = 0;
      for (var j = i - r; j <= i + r; j++) if (j >= 0 && j < n) { sum += a[j]; c++; }
      out[i] = sum / c;
    }
    return out;
  }
  function buildLanes() {
    var n = Math.ceil(W / STEP) + 2, raw = new Float32Array(n), e = new Float32Array(n), k, a;
    var c0 = cxF();
    for (k = 0; k < n; k++) raw[k] = lift((k * STEP - c0) / s);
    // air starts to climb well ahead of the nose (right) and settles slowly in the wake (left)
    var up = Math.exp(-STEP / (210 * s)), down = Math.exp(-STEP / (300 * s));
    for (a = 0, k = 0; k < n; k++) { a = Math.max(raw[k], a * up); e[k] = a; }
    for (a = 0, k = n - 1; k >= 0; k--) { a = Math.max(raw[k], a * down); e[k] = Math.max(e[k], a); }
    var r = Math.max(2, Math.round(24 * s / STEP));
    e = boxBlur(boxBlur(boxBlur(e, r), r), r);
    lanes = [];
    // over the roof: dense next to the body, spreading out and straightening further up
    var N = 15, i;
    for (i = 0; i < N; i++) lanes.push(lane(e, 8 + 470 * Math.pow(i / (N - 1), 1.45), false));
    // along the doors: these pass over the body side, so they only show from the nose back
    [110, 165, 220, 275].forEach(function (h) { lanes.push(lane(e, h, true)); });
  }
  function lane(e, h, side) {
    // far from the car a lane sits h above the ground; near it, it is lifted by the body under it.
    // w(h) = 1/(1+(h/D)^2) with D >= half the roof height keeps every lane clear of the body and the lanes from crossing
    var ys = new Float32Array(e.length), D = 380, w = 1 / (1 + (h / D) * (h / D));
    for (var k = 0; k < e.length; k++) ys[k] = cy + (GROUND - (side ? h + 0.05 * e[k] : h + 12 + e[k] * w)) * s;
    return { ys: ys, side: side };
  }
  function laneY(l, x) {
    var f = clamp(x / STEP, 0, l.ys.length - 1.001), k = f | 0, t = f - k;
    return l.ys[k] + (l.ys[k + 1] - l.ys[k]) * t;
  }
  function sideEnv(x) {      // side streams exist from just ahead of the nose back past the tail
    var nose = cxF() + NOSEF * s;
    return clamp((nose + 30 * sc - x) / (90 * sc), 0, 1) * clamp((x - cxF() + 40 * sc) / (160 * sc), 0, 1);
  }

  /* ---------- layout ---------- */
  function layout() {
    var r = stage.getBoundingClientRect();
    W = Math.max(1, r.width);
    var narrow = W < 700;
    // portrait screens: the stage is only as tall as the car needs, and the column is centred,
    // instead of one tall stage with the car lost at the bottom
    var compact = window.innerHeight > window.innerWidth * 1.05;
    root.classList.toggle('is-compact', compact);
    if (compact) {
      cw = narrow ? W * 0.97 : Math.min(1180, W * 0.86);
      H = Math.round(cw * IH / IW * 2.15);   // a little tighter than the standalone page: here a caption follows
      stage.style.height = H + 'px';
    } else {
      stage.style.height = '';
      H = Math.max(1, stage.getBoundingClientRect().height);
      cw = narrow ? W * 0.97 : Math.min(1180, W * 0.86, H * 0.6 * IW / IH);
    }
    ch = cw * IH / IW; s = cw / IW; sc = cw / 1100;
    cx = (W - cw) / 2;
    cy = Math.max(H * 0.1, (H - ch * 1.3) * 0.62);
    R = cw * (narrow ? 0.2 : 0.14);
    // turn the box so the tyre-contact line is level inside .wt-refl, mirror there, turn the picture back
    var ox = C0[0] * s, oy = C0[1] * s, span = Math.hypot(C1[0] - C0[0], C1[1] - C0[1]) * s;
    car.classList.add('is-placed');
    car.style.cssText = 'left:' + cx.toFixed(1) + 'px;top:' + cy.toFixed(1) + 'px;width:' + cw.toFixed(1) + 'px;height:' + ch.toFixed(1) + 'px';
    car.style.setProperty('--tilt', TILT.toFixed(3) + 'deg');
    car.style.setProperty('--ox', ox.toFixed(1) + 'px'); car.style.setProperty('--oy', oy.toFixed(1) + 'px');
    car.style.setProperty('--sx0', (ox + span / 2).toFixed(1) + 'px');
    car.style.setProperty('--sw0', (span * 1.32).toFixed(1) + 'px'); car.style.setProperty('--sh0', (ch * 0.13).toFixed(1) + 'px');
    refl.style.webkitBoxReflect = 'below ' + (2 * (oy - ch) + 1).toFixed(1) + 'px linear-gradient(transparent 58%, rgba(0,0,0,.26))';
    glow.style.cssText = 'left:' + (cx + cw * 0.5).toFixed(1) + 'px;top:' + (cy + oy + (C1[1] - C0[1]) * s * 0.5).toFixed(1) + 'px;width:' + (cw * 1.5).toFixed(1) + 'px;height:' + (ch * 0.9).toFixed(1) + 'px';
    DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    if (roof) buildLanes();
    if (!F.x) { F.x = W * 0.5; F.y = cy + ch * 0.4; }
  }

  /* ---------- the light ---------- */
  function setVar(name, v) { carIn.style.setProperty(name, v); }
  var shown = { x: -1, y: -1, r: -1 };
  function updateLight(dt, now) {
    var tx_, ty, tr, k = REDUCE ? 1 : 1 - Math.exp(-dt * 9), kr = REDUCE ? 1 : 1 - Math.exp(-dt * 7);
    var px = P.x - cx, py = P.y - cy;
    if (P.in) {
      var over = px > -R * .4 && px < cw + R * .3 && py > -R * .5 && py < ch + R * .2;
      tx_ = over ? px : Ls.x; ty = over ? py : Ls.y; tr = over ? R : 0;
    } else if (now - P.t < (P.touch ? 1400 : 1600)) {
      tx_ = Ls.x; ty = Ls.y; tr = P.touch ? R : 0;           // finger lifted: hold the light a moment
    } else if (REDUCE) {
      tx_ = cw * 0.66; ty = ch * 0.42; tr = R;
    } else {                                                 // nobody here: the light walks along the body
      var t = clock * 0.42;
      tx_ = cw * (0.53 + 0.37 * Math.sin(t)); ty = ch * (0.47 + 0.1 * Math.sin(t * 2 + 0.6)); tr = R * 0.95;
    }
    if (swapping) tr = 0;
    if (Ls.r < 0.5 && tr > 0) { Ls.x = tx_; Ls.y = ty; }     // a light that was off starts where it should be
    Ls.x += (tx_ - Ls.x) * k; Ls.y += (ty - Ls.y) * k; Ls.r += (tr - Ls.r) * kr;
    if (Ls.r < 0.5 && tr === 0) Ls.r = 0;
    if (Math.abs(Ls.x - shown.x) > 0.2 || Math.abs(Ls.y - shown.y) > 0.2 || Math.abs(Ls.r - shown.r) > 0.2) {
      shown.x = Ls.x; shown.y = Ls.y; shown.r = Ls.r;
      setVar('--lx', Ls.x.toFixed(1) + 'px'); setVar('--ly', Ls.y.toFixed(1) + 'px'); setVar('--lr', Ls.r.toFixed(1) + 'px');
      setVar('--lo', clamp(Ls.r / R, 0, 1).toFixed(3));
      // chrome strip lights: their screen position runs 1.6x the light's, from off one end of the car to the other
      var g = clamp(0.5 + 1.6 * (Ls.x / cw - 0.5), -0.25, 1.25);
      setVar('--gp', ((1.398 - g) / 2 * 100).toFixed(2) + '%');
      imgLens.classList.toggle('is-on', Ls.r > 0.5);
    }
  }

  /* ---------- repaint ---------- */
  function commit(i, x, y) {
    if (splash || swapping || i === base || !paints.length) return;
    if (x == null) {                                   // from a chip: start at the light if it is on the car, else at the nose
      if (Ls.r > R * 0.3) { x = Ls.x; y = Ls.y; } else { x = cw * (MIR ? 0.1 : 0.9); y = ch * 0.6; }
    }
    var r0 = i === lens ? Ls.r * 0.5 : 0;
    var r1 = Math.hypot(Math.max(x, cw - x), Math.max(y, ch - y)) * 1.25 + 20;
    imgSplash.src = file(i);
    splash = { i: i, x: x, y: y, r0: r0, r1: r1, t0: 0, dur: REDUCE ? 1 : 950, ready: false };
    decoded(imgSplash).then(function () { if (splash) splash.ready = true; });
    gust(i, cy + y);
    sweep.classList.remove('is-now');
  }
  function runSplash(now) {
    if (!splash || !splash.ready) return;
    if (!splash.t0) {
      splash.t0 = now;
      setVar('--sx', splash.x.toFixed(1) + 'px'); setVar('--sy', splash.y.toFixed(1) + 'px');
      imgSplash.classList.add('is-on');
    }
    var p = clamp((now - splash.t0) / splash.dur, 0, 1), e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    setVar('--sr', (splash.r0 + (splash.r1 - splash.r0) * e).toFixed(1) + 'px');
    if (p < 1) return;
    var sp = splash; splash = null; swapping = true;
    imgBase.src = file(sp.i);
    decoded(imgBase).then(function () {
      imgSplash.classList.remove('is-on'); setVar('--sr', '0px');
      base = sp.i; lens = nextPaint(base);
      Ls.r = 0; shown.r = -1;
      imgLens.src = file(lens);
      return decoded(imgLens);
    }).then(function () {
      swapping = false; syncUI();
      if (!REDUCE) { void sweep.offsetWidth; sweep.classList.add('is-now'); }    // fresh paint catches the light once
    });
  }

  /* ---------- streaks ---------- */
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
  function gust(i, y) {       // a repaint pushes a burst of streaks in the new colour past the car
    if (REDUCE || !lanes.length) return;
    var col = rgb(paints[i].glow || '#ffffff'), n = 0;
    for (var k = 0; k < dashes.length && n < 26; k++) if (!dashes[k].on) {
      var best = 0, bd = 1e9;
      for (var j = 0; j < lanes.length; j++) {
        var d = Math.abs(laneY(lanes[j], W * 0.5) - y) + Math.random() * 120 * sc;
        if (d < bd) { bd = d; best = j; }
      }
      spawn(dashes[k], { lane: best, x: cxF() + cw * (0.3 + 0.8 * Math.random()), a: 0.6 + 0.4 * Math.random(), fast: 1.5, long: 1.6, tint: true, burst: true });
      dashes[k].col = col; n++;
    }
    flow = 1;
  }
  function drawFlow(dt) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    if (MIR) ctx.setTransform(-DPR, 0, 0, DPR, W * DPR, 0);         // draw in flow space, mirrored onto the screen
    if (!lanes.length) return;
    // the streaks gather at the pointer, or at the light when nobody is pointing
    var fx, fy, fp;
    if (P.in) { fx = P.x; fy = P.y; fp = 1; } else { fx = cx + Ls.x; fy = cy + Ls.y; fp = 0.75 * clamp(Ls.r / R, 0, 1); }
    if (MIR) fx = W - fx;
    var kf = REDUCE ? 1 : 1 - Math.exp(-dt * 6);
    F.x += (fx - F.x) * kf; F.y += (fy - F.y) * kf; F.p += (fp - F.p) * (REDUCE ? 1 : 1 - Math.exp(-dt * 3));
    flow += ((0.35 + 0.65 * F.p) - flow) * (1 - Math.exp(-dt * 1.5));
    var sig = 110 * sc, i, k, l;

    // 1. the standing smoke lines
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

    // 2. the moving streaks
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
        if (al > 0.3) {          // bright streaks get a soft halo
          var gh = ctx.createLinearGradient(dd.x, 0, dd.x + dd.len * 0.6, 0);
          gh.addColorStop(0, 'rgba(' + dd.col + ',' + (al * 0.2).toFixed(3) + ')');
          gh.addColorStop(1, 'rgba(' + dd.col + ',0)');
          ctx.strokeStyle = gh; ctx.lineWidth = dd.w + 3; ctx.stroke();
        }
        var gr = ctx.createLinearGradient(dd.x, 0, tail, 0);
        gr.addColorStop(0, 'rgba(' + dd.col + ',' + al.toFixed(3) + ')');
        gr.addColorStop(1, 'rgba(' + dd.col + ',0)');
        ctx.strokeStyle = gr; ctx.lineWidth = dd.w; ctx.stroke();
      }
    }

    // 3. soften the canvas edges so nothing ends in a hard line
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

  /* ---------- loop ---------- */
  function frame(now) {
    raf = 0;
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now; clock += dt;
    updateLight(dt, now);
    runSplash(now);
    drawFlow(dt);
    if (running && visible) raf = requestAnimationFrame(frame);
  }
  function play() { if (running && visible && !raf) { last = 0; raf = requestAnimationFrame(frame); } }

  /* ---------- input ---------- */
  function local(e) { var r = stage.getBoundingClientRect(); P.x = e.clientX - r.left; P.y = e.clientY - r.top; }
  function onBody(x, y) {   // car px; inside the silhouette (a little forgiving)
    var xi = x / s, yi = y / s, r = roofAt(xi);
    return xi >= 0 && xi < IW && r >= 0 && yi >= r - 10 && yi <= sillAt(xi) + 4;
  }
  on(stage, 'pointermove', function (e) {
    local(e); P.in = true; P.t = performance.now(); P.touch = e.pointerType !== 'mouse';
    if (P.down && Math.hypot(P.x - P.down.x, P.y - P.down.y) > 10) P.down.moved = true;
    stage.classList.toggle('is-over', onBody(P.x - cx, P.y - cy));
  }, { passive: true });
  on(stage, 'pointerdown', function (e) {
    local(e); P.in = true; P.t = performance.now(); P.touch = e.pointerType !== 'mouse';
    P.down = { x: P.x, y: P.y, moved: false };
  });
  on(stage, 'pointerup', function (e) {
    local(e);
    var d = P.down; P.down = null;
    if (d && !d.moved && onBody(P.x - cx, P.y - cy)) commit(lens, P.x - cx, P.y - cy);
    if (e.pointerType !== 'mouse') { P.in = false; P.t = performance.now(); }
  });
  function out(e) { P.in = false; P.down = null; P.t = performance.now(); stage.classList.remove('is-over'); }
  on(stage, 'pointerleave', out);
  on(stage, 'pointercancel', out);

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
    carIn.classList.toggle('is-chrome', paints[base].id === 'chrome');
    carIn.classList.toggle('is-chrome-lens', paints[lens].id === 'chrome');
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
  var near = new IntersectionObserver(function (es) {
    if (started || !es[es.length - 1].isIntersecting) return;
    started = true; near.disconnect();
    imgBase.src = BASE + 'img/su7r-yellow.webp';
    fetch(BASE + 'img/ultra-right.json').then(function (r) { return r.json(); }).then(function (data) {
      if (dead) return;
      IW = data.w; IH = data.h; FRONT = data.front; REAR = data.rear; MIR = data.nose === 'left';
      GROUND = Math.max(FRONT[1], REAR[1]);
      C0 = FRONT[0] < REAR[0] ? FRONT : REAR; C1 = C0 === FRONT ? REAR : FRONT;
      TILT = Math.atan2(C1[1] - C0[1], C1[0] - C0[0]) * 180 / Math.PI;
      paints = data.paints; base = 0; lens = 1;
      if (new URL(file(0), location.href).href !== imgBase.src) imgBase.src = file(0);
      buildChips(); syncUI();
      imgLens.src = file(lens);
      paints.forEach(function (p, i) { if (i > 1) { var im = new Image(); im.src = file(i); } });
      return Promise.all([decoded(imgBase), decoded(imgLens)]);
    }).then(function () {
      if (dead) return;
      readRoof(imgBase); layout(); root.classList.add('is-ready'); running = true; play();
    });
  }, { rootMargin: '900px 0px' });
  near.observe(root);

  return { destroy: function () {
    dead = true; running = false; if (raf) cancelAnimationFrame(raf);
    near.disconnect(); seen.disconnect(); if (ro) ro.disconnect();
    offs.forEach(function (f) { f(); });
    chipsEl.innerHTML = '';
  } };
  }

  window.MSWind = { mount: mount };
})();
