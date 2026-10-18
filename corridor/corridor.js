/* MotorSpace · corridor gallery (prototype, 2026-10-17)
   Motion engine, speed curve and frame pull/push curves are carried over 1:1 from the
   "Endless Corridor" demo (~/Desktop/抖音AI学习/demos/longue/index.html). Changed for the site:
   car photos (16:10 only), the info panel (model, year · mileage, price, inquiry), a cool
   showroom palette, a search console in the middle (opts.heroEl fades out while a car is shown),
   wheel/touch scroll left to the page, auto-pull off unless opts.auto.
   Same rule as the demo: no preserve-3d. Every element carries its own perspective() and the
   stacking order is set by hand — a shared 3D context flickers on real GPUs. */
(function () {
  'use strict';
  var P = 1000;             // perspective
  var W = 600;              // corridor half-width
  var HC = 540;             // ceiling / floor distance from eye level
  var V0 = 336;             // walking speed, px/s
  var PX_PER_M = 46;
  var LPITCH = 870, LH = 506;
  var DEPTH = 17000, BEHIND = 900;
  var BRONZE = 7, MAT = 22;  // frame and mat widths (names kept from the demo)
  var A = 1.6;               // every photo is 16:10
  function frameSize(a) { return a < 1 ? { w: Math.round(576 * a) + 58, h: 634 } : { w: 680, h: Math.round(622 / a) + 58 }; }
  var REST_WIDE = { X: -172, Y: 9, d: 1000 };

  var PULL = {
    X: [[0, 0], [0.25, 0.02], [0.45, 0.08], [0.65, 0.23], [0.85, 0.39], [1.05, 0.68], [1.25, 0.85], [1.5, 0.96], [1.75, 1]],
    D: [[0, 0], [0.55, 0], [0.65, 0.04], [0.85, 0.37], [1.05, 0.73], [1.25, 0.9], [1.5, 0.99], [1.75, 1]],
    R: [[0, 0], [0.3, 0.06], [0.65, 0.15], [0.85, 0.28], [1.05, 0.5], [1.25, 0.76], [1.4, 0.93], [1.55, 1]],
    S: [[0, 0], [0.6, 0.1], [1.0, 0.55], [1.3, 0.9], [1.6, 1]],
    M: [[0.05, 0], [0.4, 1]],
    dur: 1.75
  };
  var PUSH = {
    X: [[0, 0], [0.15, 0.04], [0.25, 0.09], [0.35, 0.17], [0.45, 0.28], [0.55, 0.43], [0.65, 0.63], [0.75, 0.77], [0.85, 0.9], [1.0, 0.97], [1.2, 1]],
    D: [[0, 0], [0.05, 0.01], [0.15, 0.04], [0.25, 0.09], [0.35, 0.13], [0.45, 0.27], [0.55, 0.4], [0.65, 0.6], [0.75, 0.75], [0.85, 0.88], [1.0, 0.97], [1.2, 1]],
    R: [[0, 0], [0.25, 0.05], [0.35, 0.15], [0.45, 0.41], [0.55, 0.61], [0.65, 0.71], [0.75, 0.84], [0.85, 0.88], [1.0, 0.95], [1.2, 1]],
    S: [[0, 0], [0.3, 0.1], [0.6, 0.5], [0.9, 0.9], [1.1, 1]],
    M: [[0.7, 1], [1.1, 0]],
    dur: 1.2
  };
  var BACK_SLOW = 1.25;   // the car goes back to the wall a quarter slower than the demo, so it reads as one smooth glide (主人 2026-10-17: 丝滑)
  var CYCLE_WALK = 5.6, CYCLE_HOLD = 3.6;   // walk a bit longer than the demo (4.4) so the search sits in the middle longer

  function clamp(v, a, b) { a = a == null ? 0 : a; b = b == null ? 1 : b; return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeIO(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function smooth(t) { t = clamp(t); return t * t * (3 - 2 * t); }
  function mod(a, n) { return ((a % n) + n) % n; }
  function hash(n) { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967296; }
  function monotone(pts) {   // Fritsch–Carlson
    var n = pts.length, xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var dx = [], m = [], tg = new Array(n), i;
    for (i = 0; i < n - 1; i++) { dx[i] = xs[i + 1] - xs[i]; m[i] = (ys[i + 1] - ys[i]) / dx[i]; }
    tg[0] = m[0]; tg[n - 1] = m[n - 2];
    for (i = 1; i < n - 1; i++) tg[i] = (m[i - 1] * m[i] <= 0) ? 0 : 3 * (dx[i - 1] + dx[i]) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
    return function (x) {
      if (x <= xs[0]) return ys[0];
      if (x >= xs[n - 1]) return ys[n - 1];
      var j = 0; while (x > xs[j + 1]) j++;
      var h = dx[j], s = (x - xs[j]) / h, s2 = s * s, s3 = s2 * s;
      return (2 * s3 - 3 * s2 + 1) * ys[j] + (s3 - 2 * s2 + s) * h * tg[j] + (-2 * s3 + 3 * s2) * ys[j + 1] + (s3 - s2) * h * tg[j + 1];
    };
  }
  [PULL, PUSH].forEach(function (C) { ['X', 'D', 'R', 'S', 'M'].forEach(function (k) { C[k] = monotone(C[k]); }); });
  // 主人 2026-10-17: on a big screen the two cars nearest the visitor came right up, huge and stretched, then were cut off.
  // Now a car fades out gradually as it comes close: fully there while the middle of its photo is NEAR_FADE[1] or more in
  // front of the camera, gone by NEAR_FADE[0].
  var NEAR_FADE = [880, 1780];   // 主人 22:15「再晚一点点」: was [1000, 2000]
  function nearFade(d) { return smooth((d - NEAR_FADE[0]) / (NEAR_FADE[1] - NEAR_FADE[0])); }
  function fogAt(d) { return clamp(1 - Math.exp(-Math.max(0, d - 1200) / 2600), 0, 0.97); }
  // speed: sprint for 0.55 s before a pull, brake while the frame stops, recover after it goes back
  function speedMul(t, pullAt, pushAt) {
    var m = 1;
    if (pullAt != null && t >= pullAt - 0.55) {
      var at = function (x) {
        return x < pullAt + 0.55 ? 1 + 0.8 * smooth((x - (pullAt - 0.55)) / 1.1)
          : x < pullAt + 1.05 ? 1.8
          : 0.12 + 1.68 * Math.exp(-(x - pullAt - 1.05) / 1.35);
      };
      m = at(t);
      if (pushAt != null && t >= pushAt) { var m0 = at(pushAt); m = m0 + (1 - m0) * smooth((t - pushAt) / 1.1); }
    }
    return m;
  }
  function sway(u) {
    var ramp = smooth(u / 1.2);
    return { ry: -1.2 * Math.sin(u * 2 * Math.PI / 6.8) * ramp, rx: 0.6 * Math.sin(u * 2 * Math.PI / 4.6) * ramp,
      X: 4 * Math.sin(u * 2 * Math.PI / 6.8 + 0.6) * ramp, Y: 3 * Math.sin(u * 2 * Math.PI / 5.3) * ramp };
  }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function pad2(n) { return String(n).padStart(2, '0'); }

  // cool showroom greys instead of the demo's warm bronze
  var LEN = 25000, NEAR = 120;
  var WALL = [[NEAR, 'rgb(11,12,14)'], [900, 'rgb(15,16,19)'], [1800, 'rgb(18,19,22)'], [3500, 'rgb(21,22,25)'], [6000, 'rgb(25,26,30)'], [12000, 'rgb(31,33,37)'], [LEN, 'rgb(35,37,42)']];
  var CEIL = [[NEAR, 'rgb(0,0,0)'], [1500, 'rgb(3,3,4)'], [3000, 'rgb(6,7,8)'], [7000, 'rgb(15,16,19)'], [14000, 'rgb(29,31,35)'], [LEN, 'rgb(35,37,42)']];
  var FLOOR = [[NEAR, 'rgb(2,2,3)'], [1200, 'rgb(6,6,8)'], [2500, 'rgb(11,12,14)'], [5000, 'rgb(17,18,21)'], [10000, 'rgb(26,28,32)'], [LEN, 'rgb(35,37,42)']];

  function mount(root, opts) {
    opts = opts || {};
    var items = opts.items || [], L = opts.labels || {}, heroEl = opts.heroEl || null, dockEl = opts.dockEl || null, AUTO = !!opts.auto;
    var N = Math.max(1, items.length);
    // panels are turned this far off the wall towards the visitor: less sideways squash on the photos
    var TH = (opts.angle != null ? opts.angle : 24), SIN = Math.sin(TH * Math.PI / 180), COS = Math.cos(TH * Math.PI / 180), RY = 90 - TH;
    root.classList.add('msc-root', 'msc-loading');
    root.innerHTML =
      '<div class="msc-view"><div class="msc-stage"><div class="msc-world"></div></div><div class="msc-haze"></div><div class="msc-vignette"></div></div>' +
      '<aside class="msc-info" aria-live="polite">' +
        '<div class="msc-info-big"></div><div class="msc-info-rule"></div><div class="msc-info-no"></div>' +
        '<div class="msc-info-body"><h2 class="msc-info-title"></h2><div class="msc-info-meta"></div>' +
          '<div class="msc-info-price"><span></span><b></b></div><div class="msc-info-tags"></div>' +
          '<div class="msc-info-cta"><button type="button" class="msc-btn msc-btn-primary" data-act="ask" data-magnet="0.35"></button><a class="msc-btn" data-act="details"></a></div>' +
          '<p class="msc-info-note"></p><button type="button" class="msc-info-close" data-act="close"></button></div>' +
      '</aside>' +
      '<div class="msc-bar"><span class="msc-bar-hint"></span><span class="msc-bar-mid"><i></i><span class="msc-mode"></span></span>' +
        '<span class="msc-bar-end"><span class="msc-dist"></span><button type="button" class="msc-credits-btn" data-act="credits"></button></span></div>';
    var view = root.querySelector('.msc-view'), stage = root.querySelector('.msc-stage'), world = root.querySelector('.msc-world');
    var info = root.querySelector('.msc-info');
    function q(s) { return root.querySelector(s); }
    function mk(cls, parent) { var e = document.createElement('div'); e.className = cls; (parent || world).appendChild(e); return e; }

    // ---------- the corridor: walls, ceiling and floor are fixed 2D triangles (the camera never turns) ----------
    (function () {
      // the triangles live in a box 3000px bigger on every side, so a phone (which sees more than the
      // 1920×1080 stage) still gets walls, ceiling and floor all the way to its edges
      var O = 3000;
      var corr = document.createElement('div'); corr.className = 'msc-corr'; corr.style.inset = -O + 'px';
      stage.insertBefore(corr, world);
      function stops(arr, pos) { return arr.map(function (x) { return x[1] + ' ' + (pos(x[0]) + O).toFixed(1) + 'px'; }).join(','); }
      function wx(d) { return 960 - W * P / d; }
      function cy(d) { return 540 - HC * P / d; }
      function pt(x, y) { return (x + O) + 'px ' + (y + O) + 'px'; }
      function tri(a, b, c, bg) { var e = document.createElement('div'); e.style.cssText = 'position:absolute;inset:0;background:' + bg + ';clip-path:polygon(' + pt(a[0], a[1]) + ',' + pt(b[0], b[1]) + ',' + pt(c[0], c[1]) + ')'; corr.appendChild(e); }
      var B = 6000, V = B * HC / W;
      tri([960, 540], [960 - B, 540 - V], [960 - B, 540 + V], 'linear-gradient(to right,' + stops(WALL, wx) + ')');
      tri([960, 540], [960 + B, 540 - V], [960 + B, 540 + V], 'linear-gradient(to left,' + stops(WALL, wx) + ')');
      tri([960, 540], [960 - B, 540 - V], [960 + B, 540 - V], 'linear-gradient(to bottom,' + stops(CEIL, cy) + ')');
      tri([960, 540], [960 - B, 540 + V], [960 + B, 540 + V], 'linear-gradient(to top,' + stops(FLOOR, cy) + ')');
      var sheen = mk('msc-plane'); sheen.style.cssText += 'width:260px;height:9000px;background:linear-gradient(90deg,rgba(230,238,248,0),rgba(230,238,248,.035) 35%,rgba(230,238,248,.05) 50%,rgba(230,238,248,.035) 65%,rgba(230,238,248,0));-webkit-mask-image:linear-gradient(180deg,#000,rgba(0,0,0,.4) 50%,transparent);mask-image:linear-gradient(180deg,#000,rgba(0,0,0,.4) 50%,transparent);transform:perspective(' + P + 'px) translate3d(-130px,' + (HC - 2) + 'px,' + (P - 700) + 'px) rotateX(-90deg)';
      var line = mk('msc-plane'); line.style.cssText += 'width:10px;height:9000px;background:linear-gradient(180deg,rgba(230,238,248,.12),rgba(230,238,248,.05) 45%,rgba(230,238,248,0));transform:perspective(' + P + 'px) translate3d(-5px,' + (HC - 1) + 'px,' + (P - 700) + 'px) rotateX(-90deg)';
    })();

    // ceiling light strips, also 2D (sub-pixel 3D strips flicker)
    var LOFF = 300;
    var NL = Math.ceil((DEPTH + BEHIND) / LPITCH) + 1;
    var NEAR_CLIP = 300, LAMP_CORE = 4, LAMP_GLOW = 22;
    var lights = [];
    var lampLayer = document.createElement('div'); lampLayer.className = 'msc-lamps';
    stage.insertBefore(lampLayer, world);
    for (var li = 0; li < NL; li++) { var sp0 = mk('msc-spill', lampLayer), st0 = mk('msc-strip', lampLayer); lights.push({ sp: sp0, st: st0 }); }

    // ---------- the walls: one car after another, gaps 150–480 ----------
    var NP = 32;
    var WALLS = [{ side: -1, pool: [], cur: 0 }, { side: 1, pool: [], cur: 0 }];
    // left wall: cars photographed nose-left; right wall: nose-right. Either way the nose points at the visitor walking in
    var ORD = {};
    function makeOrder() {
      var all = Array.from({ length: N }, function (_, i) { return i; }).sort(function (a, b) { return hash(a * 977 + 3) - hash(b * 977 + 3); });
      var left = all.filter(function (i) { return (items[i] || {}).facing !== 'right'; }), right = all.filter(function (i) { return (items[i] || {}).facing === 'right'; });
      ORD[-1] = left.length ? left : all; ORD[1] = right.length ? right : all;
    }
    makeOrder();
    var dimsCache = new Map();
    function slotDims(side, k) {
      var key = side + ':' + k, r = dimsCache.get(key);
      if (r) return r;
      var g = 2 * k + (side > 0 ? 1 : 0);
      var H = Math.round(340 + 80 * hash(g * 53 + 11));
      var gap = Math.round(GAP0 + GAPR * hash(g * 19 + 3));
      r = { a: A, H: H, L: Math.round(H * A), gap: gap }; dimsCache.set(key, r); return r;
    }
    var GAP0 = opts.gap0 != null ? opts.gap0 : 360, GAPR = opts.gapR != null ? opts.gapR : 300;
    var LAY = {};
    function resetLayout(side, base) { LAY[side] = { kmin: 0, kmax: 0, pos: new Map([[0, base]]) }; }
    resetLayout(-1, 1096); resetLayout(1, 870);
    function slotS(side, k) {
      var Ly = LAY[side], n;
      while (k > Ly.kmax) { n = Ly.kmax + 1; var dn = slotDims(side, n); Ly.pos.set(n, Ly.pos.get(Ly.kmax) + slotDims(side, Ly.kmax).L / 2 + dn.gap + dn.L / 2); Ly.kmax = n; }
      while (k < Ly.kmin) { n = Ly.kmin - 1; var dm = slotDims(side, Ly.kmin); Ly.pos.set(n, Ly.pos.get(Ly.kmin) - dm.L / 2 - dm.gap - slotDims(side, n).L / 2); Ly.kmin = n; }
      return Ly.pos.get(k);
    }
    function firstVisible(wl, C) {
      var k = wl.cur, sd = wl.side;
      while (slotS(sd, k) + slotDims(sd, k).L / 2 < C - BEHIND) k++;
      while (slotS(sd, k - 1) + slotDims(sd, k - 1).L / 2 >= C - BEHIND) k--;
      return (wl.cur = k);
    }
    function slotInfo(side, k) {
      var g = 2 * k + (side > 0 ? 1 : 0), d = slotDims(side, k);
      var ord = ORD[side], pi = ord[mod(k, ord.length)];
      return { side: side, k: k, g: g, pi: pi, a: d.a, H: d.H, L: d.L, y0: Math.round((hash(g * 31 + 5) - 0.5) * 18), key: side + ':' + k };
    }
    WALLS.forEach(function (wl) {
      for (var j = 0; j < NP; j++) {
        var e = mk('msc-panel'), inn = mk('msc-in', e);
        var p = { e: e, inn: inn, ph: mk('msc-ph', inn), refl: mk('msc-refl', inn), cap: mk('msc-cap', inn), fog: mk('msc-fog', inn), k: null, info: null, side: wl.side, lv: -1, z: -1 };
        wl.pool.push(p);
      }
    });
    var hoverP = null;
    function itemAt(pi) { return items[pi] || {}; }
    function assign(p, side, k) {
      var s = slotInfo(side, k), it = itemAt(s.pi);
      p.e.classList.remove('is-hover'); if (hoverP === p) hoverP = null;
      p.k = k; p.info = s;
      p.ph.style.backgroundImage = 'url("' + it.photo + '")';
      p.refl.style.backgroundImage = 'url("' + (it.small || it.photo) + '")';
      p.e.style.width = s.L + 'px'; p.e.style.height = s.H + 'px'; p.inn.style.width = s.L + 'px'; p.inn.style.left = '0px'; p.lv = s.L;
      p.refl.style.top = (s.H + 3) + 'px'; p.refl.style.height = Math.round(s.H * 0.4) + 'px';
      p.cap.style.top = (s.H + 16) + 'px';
      p.cap.textContent = pad2(s.pi + 1) + ' · ' + (it.title || '');
    }
    // a panel is hinged on the wall at its near end and turned TH degrees towards the corridor;
    // u runs along the panel from the hinge (0) to the far end (L)
    function hingeD(si, C) { return slotS(si.side, si.k) - si.L / 2 - C; }
    function slotPose(si, C) {
      var h = si.L / 2;
      return { X: si.side * (W - 2 - h * SIN), Y: si.y0, d: hingeD(si, C) + h * COS, ry: si.side > 0 ? -RY : RY, w: si.L, h: si.H };
    }

    // the framed car that comes off the wall (two, so one can go back while the next comes out)
    var spots = [0, 1].map(function () {
      var e = mk('msc-spot');
      var o = { e: e, frame: mk('msc-frame', e), mat: mk('msc-mat', e), ph: mk('msc-ph', e), fog: mk('msc-fog', e), br: ['tl', 'tr', 'bl', 'bnr'].map(function (c) { return mk('msc-br ' + c, e); }), s: null };
      return o;
    });

    // ---------- state ----------
    var READY = false;
    function go() { if (READY) return; READY = true; root.classList.remove('msc-loading'); }
    Promise.all(items.slice(0, 12).map(function (it) { return new Promise(function (r) { var im = new Image(); im.onload = im.onerror = r; im.src = it.photo; }); })).then(go);
    setTimeout(go, 3500);

    var S = { C: 182 * PX_PER_M, t: 0, active: [], pullAt: null, pushAt: null, nextPull: 3.4, manualV: 0, lastInput: -99, paused: false, base: 1, side: -1, hold: false };
    var REST = REST_WIDE;

    function spotPose(a, t, C) {
      var src = slotPose(a.info, C), fs = frameSize(a.info.a);
      var frame = { X: REST.X, Y: REST.Y, d: REST.d, w: fs.w, h: fs.h };
      var u = t - a.t0, pX, pD, pR, pS, pM, sw = { ry: 0, rx: 0, X: 0, Y: 0 };
      if (a.phase === 'pull') { pX = PULL.X(u); pD = PULL.D(u); pR = PULL.R(u); pS = PULL.S(u); pM = PULL.M(u); }
      else if (a.phase === 'hold') { pX = pD = pR = pS = pM = 1; sw = sway(u); }
      else if (a.back) {
        var e = easeIO(clamp(u / a.back.dur)), f = a.back.from;
        return { X: lerp(f.X, src.X, e), Y: lerp(f.Y, src.Y, e), d: lerp(f.d, src.d, e), ry: lerp(f.ry, src.ry, e), rx: lerp(f.rx || 0, 0, e),
          w: lerp(f.w, src.w, e), h: lerp(f.h, src.h, e), m: lerp(f.m, 0, e), u: 0.2 + e };
      }
      else {
        u = u / BACK_SLOW; pX = PUSH.X(u); pD = PUSH.D(u); pR = PUSH.R(u); pS = PUSH.S(u); pM = PUSH.M(u);
        var hs = a.holdSway || { ry: 0, rx: 0, X: 0, Y: 0 };
        sw = { ry: hs.ry * (1 - pR), rx: hs.rx * (1 - pR), X: hs.X * (1 - pX), Y: hs.Y * (1 - pX) };
        return { X: lerp(frame.X, src.X, pX) + sw.X, Y: lerp(frame.Y, src.Y, pX) + sw.Y, d: lerp(frame.d, src.d, pD),
          ry: lerp(0, src.ry, pR) + sw.ry, rx: sw.rx, w: lerp(fs.w, src.w, pS), h: lerp(fs.h, src.h, pS), m: pM, u: u };
      }
      return { X: lerp(src.X, frame.X, pX) + sw.X, Y: lerp(src.Y, frame.Y, pX) + sw.Y, d: lerp(src.d, frame.d, pD),
        ry: lerp(src.ry, 0, pR) + sw.ry, rx: sw.rx, w: lerp(src.w, fs.w, pS), h: lerp(src.h, fs.h, pS), m: pM, u: u };
    }

    // ---------- interaction ----------
    function startPull(si, t) {
      S.active.forEach(function (a) { if (a.phase !== 'push') startPush(a, t); });
      S.active.push({ info: si, phase: 'pull', t0: t });
      S.pullAt = t; S.pushAt = null;
    }
    function startPush(a, t) {
      if (a.phase === 'push') return;
      var u = a.phase === 'hold' ? t - a.t0 : 0;
      a.holdSway = a.phase === 'hold' ? sway(u) : { ry: 0, rx: 0, X: 0, Y: 0 };
      // a car still on its way out goes back from wherever it is, on one eased curve (no jump)
      if (a.phase === 'pull') { a.back = { from: spotPose(a, t, S.C), dur: 0.55 + 0.6 * clamp((t - a.t0) / PULL.dur) }; a.phase = 'push'; a.t0 = t; }
      else { a.phase = 'push'; a.t0 = t; }
      S.pushAt = t;
      S.nextPull = t + CYCLE_WALK;
    }
    function pushAll() { S.active.forEach(function (a) { startPush(a, S.t); }); }
    function stageXY(cx, cy) { var r = stage.getBoundingClientRect(), k = r.width / 1920; return { x: (cx - r.left) / k, y: (cy - r.top) / k }; }
    // which panel is under the pointer: invert the perspective onto the wall plane (more reliable than 3D hit-testing)
    function pickPanel(cx, cy) {
      var pt = stageXY(cx, cy), m = (pt.x - 960) / P, best = null, bestD = 1e9;
      for (var w = 0; w < 2; w++) {
        var wl = WALLS[w], side = wl.side, den = m * COS + side * SIN;
        if (Math.abs(den) < 1e-6) continue;
        for (var j = 0; j < wl.pool.length; j++) {
          var p = wl.pool[j];
          if (!p.info || p.e.style.visibility !== 'visible' || (p.nf != null && p.nf < 0.35)) continue;   // a car fading out is not picked
          var s = p.info, a0 = hingeD(s, S.C), u = (side * (W - 2) - m * a0) / den;
          if (u < s.L - p.lv || u > s.L) continue;
          var d = a0 + u * COS, Y = (pt.y - 540) * d / P;
          if (d > 0 && d < bestD && Y >= s.y0 - s.H / 2 && Y <= s.y0 + s.H / 2) { bestD = d; best = p; }
        }
      }
      return best;
    }
    function pickSpot(cx, cy) {
      for (var i = 0; i < spots.length; i++) {
        var sp = spots[i]; if (sp.e.style.display === 'none') continue;
        var r = sp.e.getBoundingClientRect();
        if (cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom) return sp;
      }
      return null;
    }
    function showing() { return S.active.some(function (a) { return a.phase !== 'push'; }); }
    function overUI(target) { return !!(target && target.closest && target.closest('.msc-info, .msc-bar, .msc-credits, .msc-hero-live, .kt-nav, a, button, input, select, textarea, label')); }
    function updateHover(cx, cy, target) {
      var sp = null, p = null;
      if (!overUI(target)) { sp = pickSpot(cx, cy); p = sp || showing() ? null : pickPanel(cx, cy); }
      if (p !== hoverP) { if (hoverP) hoverP.e.classList.remove('is-hover'); if (p) p.e.classList.add('is-hover'); hoverP = p; }
      root.style.cursor = p ? 'pointer' : '';
    }
    var lastDrag = 0, drag = null;
    var host = opts.eventRoot || root;
    function onClick(ev) {
      if (overUI(ev.target)) return;
      if (lastDrag > 6) return;
      // 主人 2026-10-17: 点开一台车后，再点旁边空白处，它就丝滑地退回墙上
      if (showing()) { if (!pickSpot(ev.clientX, ev.clientY)) { pushAll(); S.lastInput = S.t; } return; }
      var p = pickPanel(ev.clientX, ev.clientY);
      if (p) {
        if (S.active.some(function (a) { return a.info.key === p.info.key; })) return;
        S.lastInput = S.t; startPull(p.info, S.t); return;
      }
      pushAll();
    }
    function onDown(e) { if (e.pointerType === 'mouse' && e.button === 0 && !overUI(e.target)) { drag = { y: e.clientY, moved: 0 }; lastDrag = 0; } }
    function onMove(e) {
      if (!drag) { if (e.pointerType === 'mouse') updateHover(e.clientX, e.clientY, e.target); return; }
      var dy = drag.y - e.clientY; drag.y = e.clientY; drag.moved += Math.abs(dy);
      if (drag.moved > 6) { S.manualV += dy * 40; S.lastInput = S.t; }
    }
    function onUp() { if (drag) lastDrag = drag.moved; drag = null; }
    function onLeave() { if (hoverP) { hoverP.e.classList.remove('is-hover'); hoverP = null; } root.style.cursor = ''; }
    function typing(t) { return t && t.closest && t.closest('input, select, textarea, [role="dialog"]'); }
    function onKey(e) {
      if (creditsEl && creditsEl.classList.contains('is-on')) { if (e.key === 'Escape') openCredits(false); return; }
      if (e.key === 'Escape' && S.active.length && !typing(e.target)) { pushAll(); S.lastInput = S.t; }
    }
    host.addEventListener('click', onClick);
    host.addEventListener('pointerdown', onDown);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('keydown', onKey);
    // auto-pull waits while the visitor is using the search
    var heroBusy = false;
    if (heroEl) {
      heroEl.addEventListener('pointerenter', function () { heroBusy = true; });
      heroEl.addEventListener('pointerleave', function () { heroBusy = false; });
    }

    info.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var a = S.active.find(function (x) { return x.phase !== 'push'; }) || S.active[0];
      var it = a ? itemAt(a.info.pi) : null;
      if (b.dataset.act === 'close') { e.preventDefault(); pushAll(); S.lastInput = S.t; }
      else if (b.dataset.act === 'ask' && it) { e.preventDefault(); if (opts.onInquiry) opts.onInquiry(it); }
    });
    var creditsEl = null;
    function openCredits(open) {
      if (!creditsEl) {
        creditsEl = document.createElement('div');
        creditsEl.className = 'msc-credits'; creditsEl.setAttribute('role', 'dialog'); creditsEl.setAttribute('aria-modal', 'true');
        document.body.appendChild(creditsEl);
        creditsEl.addEventListener('click', function (e) { if (e.target === creditsEl || e.target.closest('.msc-credits-x')) openCredits(false); });
      }
      if (open) {
        creditsEl.innerHTML = '<button type="button" class="msc-credits-x">' + esc(L.close) + ' · ESC</button><div class="msc-credits-wrap"><h3>' + esc(L.creditsTitle) + '</h3><p class="msc-credits-sub">' + esc(L.creditsSub) + '</p><ol class="msc-credits-list"><li><span>…</span></li></ol></div>';
        (opts.credits ? Promise.resolve(opts.credits) : fetch(opts.creditsUrl || 'corridor/photos.json').then(function (r) { return r.json(); })).then(function (list) {
          var byFile = {}; items.forEach(function (it, i) { byFile[(it.photo || '').split('/').pop()] = { n: i + 1, title: it.title }; });
          creditsEl.querySelector('.msc-credits-list').innerHTML = list.map(function (p) {
            var it = byFile[p.file] || { n: '—', title: p.title };
            return '<li><b>' + esc(pad2(it.n)) + '</b><span>' + esc(it.title) + '</span><a href="' + esc(p.source) + '" target="_blank" rel="noopener">' + esc(p.artist) + ' · ' + esc(p.license) + '</a></li>';
          }).join('');
        }).catch(function () { creditsEl.querySelector('.msc-credits-list').innerHTML = '<li><b>—</b><span>photos.json</span></li>'; });
      }
      creditsEl.classList.toggle('is-on', open);
    }
    q('.msc-bar').addEventListener('click', function (e) { if (e.target.closest('[data-act="credits"]')) { e.preventDefault(); openCredits(true); } });

    function autoplay(t) {
      var manual = t - S.lastInput < 2.5;
      var focusInHero = heroEl && heroEl.contains(document.activeElement);
      if (!AUTO || S.paused || manual || heroBusy || focusInHero || (opts.isBusy && opts.isBusy())) {
        if (S.nextPull < t + 1.2) S.nextPull = t + 1.2;
        return;
      }
      var holding = S.active.find(function (a) { return a.phase === 'hold'; });
      if (holding && t - holding.t0 > CYCLE_HOLD && !infoHover) startPush(holding, t);
      if (!S.active.some(function (a) { return a.phase !== 'push'; }) && t >= S.nextPull) {
        S.side = -S.side;
        var side = S.side, wl = WALLS[side > 0 ? 1 : 0], k = firstVisible(wl, S.C);
        while (slotS(side, k + 1) - S.C < 4950) k++;
        if (Math.abs(slotS(side, k + 1) - S.C - 4950) < Math.abs(slotS(side, k) - S.C - 4950)) k++;
        startPull(slotInfo(side, k), t);
      }
    }
    var infoHover = false;
    info.addEventListener('pointerenter', function () { infoHover = true; });
    info.addEventListener('pointerleave', function () { infoHover = false; });

    // ---------- layout: the 1920×1080 stage covers the section ----------
    var VW = 0, VH = 0, portrait = false;
    var dockTop = 1e9, infoH = 0;
    function layout() {
      VW = root.clientWidth; VH = root.clientHeight;
      if (!VW || !VH) return;
      portrait = VW / VH < 1;
      // wide screens: the stage covers the section. Tall screens: pull the camera back so both walls
      // stay in view, and lift the vanishing point so the search below does not hide the cars
      var k = portrait ? VW / 1040 : Math.max(VW / 1920, VH / 1080), cy = portrait ? 0.3 : 0.5;
      stage.style.transform = 'scale(' + k + ')';
      stage.style.top = (cy * 100) + '%';
      root.style.setProperty('--vy', (cy * 100 - 1) + '%');
      var u = portrait ? VW / 820 : Math.min(VW / 1920, VH / 1080);
      root.style.setProperty('--u', u + 'px');
      root.classList.toggle('is-portrait', portrait);
      if (portrait) {
        // the frame sits at 31% of the height, but never under the (two-row) phone nav
        var navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--msc-nav-h')) || 60;
        var fs = frameSize(A), d = fs.w * P / (0.9 * VW / k), target = Math.max(0.31 * VH, navH + 0.45 * VW * fs.h / fs.w + 14);
        REST = { X: 0, Y: (target - cy * VH) / k * d / P, d: d };
        root.style.setProperty('--frame-bottom', Math.round(target + fs.h * P / d * k / 2) + 'px');
      } else REST = REST_WIDE;
      infoDirty = true;
      if (heroEl && dockEl) {
        // wide screens: the search rests just below the band where the wall photos are (stage y 748),
        // so it never sits on a picture (主人 2026-10-17: 搜索栏做小一点，不要跟图片重叠)
        var prev = heroEl.style.getPropertyValue('--show');
        heroEl.style.setProperty('--show', '0');
        if (portrait) heroEl.style.top = '';
        else {
          var hh = heroEl.offsetHeight, top = VH / 2 + 208 * k;
          heroEl.style.top = Math.round(Math.max(VH * 0.5, Math.min(top, VH - 64 - hh))) + 'px';
        }
        var rr = root.getBoundingClientRect(), dr = dockEl.getBoundingClientRect();
        heroEl.style.setProperty('--show', prev || '0');
        // while a car is shown the search glides down to the bottom of the screen
        dockTop = VH - (portrait ? 64 : 84) - dr.height;
        heroEl.style.setProperty('--dock-dy', Math.max(0, dockTop - (dr.top - rr.top)) + 'px');
      }
    }
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(root); else window.addEventListener('resize', layout);
    layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    // ---------- labels ----------
    var lastInfoKey = null, infoDirty = false;
    function fbPx() { return parseFloat(root.style.getPropertyValue('--frame-bottom')) || VH * 0.52; }
    function applyLabels() {
      q('.msc-bar-hint').textContent = L.hint || ''; hintBack = null;
      q('.msc-credits-btn').textContent = L.credits || '';
      q('[data-act="ask"]').textContent = L.ask || '';
      q('[data-act="close"]').textContent = (L.close || '') + ' ✕';
      q('.msc-info-note').textContent = L.photoNote || '';
      lastInfoKey = null;
    }
    applyLabels();
    function setInfo(si) {
      if (lastInfoKey === si.key) return; lastInfoKey = si.key; infoDirty = true;
      var it = itemAt(si.pi), n = pad2(si.pi + 1);
      q('.msc-info-big').textContent = n;
      q('.msc-info-no').textContent = n + ' / ' + pad2(N) + ' · ' + (it.status || '');
      q('.msc-info-title').textContent = it.title || '';
      q('.msc-info-meta').textContent = it.meta || '';
      q('.msc-info-price span').textContent = it.priceLabel || '';
      q('.msc-info-price b').textContent = it.price || '';
      q('.msc-info-tags').innerHTML = (it.tags || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('');
      var det = q('[data-act="details"]'); det.textContent = (L.details || '') + ' →'; det.href = it.href || '#';
      // a car page: the photo on show grows into the page's hero (motion.js, 主人 2026-10-17 动效 6)
      if (it.carPage) det.setAttribute('data-car-link', '.msc-spot .msc-ph'); else det.removeAttribute('data-car-link');
    }

    // ---------- every frame ----------
    var $dist = q('.msc-dist'), $mode = q('.msc-mode'), $hint = q('.msc-bar-hint'), hintBack = null;
    function render() {
      var t = S.t, C = S.C, i, j;
      var lk0 = Math.ceil((C - BEHIND - LOFF) / LPITCH);
      for (i = 0; i < NL; i++) {
        var kk = lk0 + i, Lt = lights[mod(kk, NL)], d = kk * LPITCH + LOFF - C;
        if (d < 700) { Lt.st.style.visibility = Lt.sp.style.visibility = 'hidden'; continue; }
        var o = 1 - fogAt(d) * 0.92, sc = P / d;
        var y = 540 - LH * sc, w = 712 * sc, ch = LAMP_CORE * sc, hv = Math.max(ch, 1.25), ov = o * Math.min(1, ch / 1.25) * Math.min(1, Math.pow(2200 / d, 1.5));
        Lt.st.style.cssText = 'visibility:visible;opacity:' + ov.toFixed(3) + ';width:' + w.toFixed(2) + 'px;height:' + hv.toFixed(2) + 'px;transform:translate(' + (960 - w / 2).toFixed(2) + 'px,' + (y - hv / 2).toFixed(2) + 'px);box-shadow:0 0 ' + (LAMP_GLOW * sc).toFixed(1) + 'px ' + (LAMP_GLOW * 0.15 * sc).toFixed(2) + 'px rgba(205,222,240,.22)';
        var g0 = 540 - LH * P / (d - 200), g1 = 540 - LH * P / (d + 200), gw = 940 * sc;
        Lt.sp.style.cssText = 'visibility:visible;opacity:' + o.toFixed(3) + ';width:' + gw.toFixed(2) + 'px;height:' + Math.max(1, g1 - g0).toFixed(2) + 'px;transform:translate(' + (960 - gw / 2).toFixed(2) + 'px,' + g0.toFixed(2) + 'px)';
      }
      var hidden = new Set(S.active.map(function (a) { return a.info.key; }));
      for (var wi = 0; wi < 2; wi++) {
        var wl = WALLS[wi], k0 = firstVisible(wl, C), kEnd = k0;
        while (kEnd < k0 + NP && slotS(wl.side, kEnd) - slotDims(wl.side, kEnd).L / 2 < C + DEPTH) kEnd++;
        for (j = 0; j < NP; j++) {
          var k = k0 + j, p = wl.pool[mod(k, NP)];
          if (k >= kEnd) { p.e.style.visibility = 'hidden'; continue; }
          if (p.k !== k) assign(p, wl.side, k);
          var s = p.info, a0 = hingeD(s, C), dFar = a0 + s.L * COS, dc = a0 + s.L / 2 * COS, nf = nearFade(dc);
          // only the part of the panel at least NEAR_CLIP in front of the camera is drawn
          var lv = Math.max(0, Math.min(s.L, s.L - (NEAR_CLIP - a0) / COS));
          if (hidden.has(s.key) || dFar < 560 || lv <= 0 || nf < 0.005) { p.e.style.visibility = 'hidden'; p.nf = 0; continue; }
          if (Math.abs(nf - (p.nf == null ? -1 : p.nf)) > 0.002) { p.nf = nf; p.e.style.opacity = nf >= 0.998 ? '' : nf.toFixed(3); }
          if (lv !== p.lv) { p.lv = lv; p.e.style.width = lv + 'px'; p.e.style.overflow = lv < s.L ? 'hidden' : 'visible'; p.inn.style.left = (wl.side > 0 ? 0 : lv - s.L) + 'px'; }
          // the element's origin: the far end on the right wall, the first drawn point on the left wall
          var u0 = wl.side > 0 ? s.L : s.L - lv, ox = wl.side * (W - 2 - u0 * SIN), od = a0 + u0 * COS;
          p.e.style.transform = 'perspective(' + P + 'px) translate3d(' + ox.toFixed(2) + 'px,' + (s.y0 - s.H / 2) + 'px,' + (P - od).toFixed(2) + 'px) rotateY(' + (wl.side > 0 ? -RY : RY) + 'deg)';
          var z = 10 + Math.max(0, Math.round((40000 - dc) / 8));
          if (z !== p.z) { p.z = z; p.e.style.zIndex = String(z); }
          p.fog.style.opacity = Math.max(fogAt(dc), (1 - nf) * 0.6).toFixed(3);   // a fading car also sinks into the dark
          p.e.style.visibility = 'visible';
        }
      }
      var heroO = 1, infoO = 0, infoFor = null;
      spots.forEach(function (sp, i2) {
        var a = S.active[i2];
        if (!a) { sp.e.style.display = 'none'; return; }
        sp.e.style.display = 'block';
        var qp = spotPose(a, t, C), w2 = qp.w, h2 = qp.h, m = qp.m;
        sp.e.style.width = w2 + 'px'; sp.e.style.height = h2 + 'px';
        sp.e.style.left = (-w2 / 2) + 'px'; sp.e.style.top = (-h2 / 2) + 'px';
        sp.e.style.transformOrigin = '50% 50%';
        var other = S.active[1 - i2];
        sp.e.style.zIndex = String(60000 + (qp.d < (other ? spotPose(other, t, C).d : 1e9) ? 1 : 0));
        sp.e.style.transform = 'perspective(' + P + 'px) translate3d(' + qp.X + 'px,' + qp.Y + 'px,' + (P - qp.d) + 'px) rotateY(' + qp.ry + 'deg) rotateX(' + qp.rx + 'deg)';
        sp.frame.style.opacity = m; sp.mat.style.opacity = m;
        var slotF = nearFade(hingeD(a.info, C) + a.info.L / 2 * COS), gone = a.phase === 'push' ? clamp((qp.u || 0) / 1.2) : a.phase === 'pull' ? 1 - clamp((t - a.t0) / 0.5) : 0;
        sp.e.style.opacity = slotF >= 0.998 || !gone ? '' : lerp(1, slotF, gone).toFixed(3);
        sp.mat.style.inset = (BRONZE * m) + 'px';
        sp.ph.style.inset = ((BRONZE + MAT) * m) + 'px';
        if (sp.s !== a.info.key) {   // the car off the wall gets the 1920 photo on top of the wall one, which shows until it arrives
          sp.s = a.info.key; var it2 = itemAt(a.info.pi);
          sp.ph.style.backgroundImage = (it2.hd ? 'url("' + it2.hd + '"), ' : '') + 'url("' + it2.photo + '")';
        }
        sp.fog.style.opacity = fogAt(qp.d).toFixed(3);
        var u = qp.u != null ? qp.u : t - a.t0, hO = 1, iO = 0, bO = 0;
        if (a.phase === 'pull') { hO = 1 - smooth((u - 0.8) / 0.45); iO = smooth((u - 0.3) / 0.4); bO = smooth((u - 1.4) / 0.15); }
        else if (a.phase === 'hold') { hO = 0; iO = 1; bO = 1; }
        else { hO = smooth((u - 0.55) / 0.4); iO = 1 - smooth((u - 0.1) / 0.25); bO = 1 - smooth((u - 0.25) / 0.1); }
        // the search clears out of the way as soon as a car starts coming off the wall
        if (a.phase === 'pull') hO = Math.min(hO, 1 - smooth(u / 0.45));
        heroO = Math.min(heroO, hO);
        if (iO > infoO) { infoO = iO; infoFor = a.info; }
        sp.br.forEach(function (b) { b.style.opacity = bO.toFixed(3); });
      });
      if (heroEl) {
        var show = 1 - heroO;
        heroEl.style.setProperty('--show', show.toFixed(3));
        heroEl.classList.toggle('is-docked', show > 0.5);
        // the search never disappears while a car is out (主人 2026-10-17); on a short phone the details drop
        // their small print instead (is-tight, set below) so they don't run into it
        var fade = !dockEl;
        if (fade) { heroEl.style.opacity = heroO.toFixed(3); heroEl.style.visibility = heroO < 0.01 ? 'hidden' : ''; }
        else if (heroEl.style.opacity) { heroEl.style.opacity = ''; heroEl.style.visibility = ''; }
      }
      if (infoFor) setInfo(infoFor);
      if (infoDirty) {
        infoDirty = false; root.classList.remove('is-tight'); infoH = info.offsetHeight;
        root.classList.toggle('is-tight', !!(portrait && dockEl && fbPx() + 22 + infoH > dockTop - 12));
      }
      info.style.opacity = infoO.toFixed(3);
      info.style.transform = portrait ? 'translateY(' + ((1 - infoO) * 14).toFixed(1) + 'px)' : 'translateX(' + ((1 - infoO) * 14).toFixed(1) + 'px)';
      info.style.visibility = infoO < 0.01 ? 'hidden' : 'visible';
      info.classList.toggle('is-live', infoO > 0.5);
      root.classList.toggle('is-viewing', infoO > 0.5);
      $dist.textContent = Math.round(C / PX_PER_M) + ' m';
      var hb = infoO > 0.5; if (hb !== hintBack) { hintBack = hb; $hint.textContent = (hb ? L.back : L.hint) || L.hint || ''; }
      $mode.textContent = S.active.some(function (a) { return a.phase === 'hold'; }) ? (L.viewing || '') : (t - S.lastInput < 2.5 ? (L.manual || '') : (L.walking || ''));
    }

    // ---------- main loop: runs only while the section is on screen ----------
    var raf = 0, last = 0, onScreen = true, destroyed = false;
    function frame(now) {
      raf = 0;
      if (destroyed) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      if (READY) {
        S.t += dt;
        autoplay(S.t);
        S.active = S.active.filter(function (a) { return !(a.phase === 'push' && S.t - a.t0 > (a.back ? a.back.dur : PUSH.dur * BACK_SLOW) + 0.05); });
        S.active.forEach(function (a) { if (a.phase === 'pull' && S.t - a.t0 >= PULL.dur) { a.phase = 'hold'; a.t0 = S.t; } });
        var manual = S.t - S.lastInput < 2.5;
        S.base = lerp(S.base, (S.paused || manual) ? 0 : 1, 1 - Math.exp(-dt * 2.2));
        var m = speedMul(S.t, S.pullAt, S.pushAt);
        S.manualV *= Math.exp(-dt * 2.6);
        S.C += (V0 * m * S.base + S.manualV) * dt;
      }
      render();
      schedule();
    }
    function schedule() { if (!raf && onScreen && !document.hidden && !destroyed) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = 0; }
    var io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(function (es) { onScreen = es[0].isIntersecting; if (onScreen) schedule(); else stop(); }) : null;
    if (io) io.observe(root);
    function vis() { if (document.hidden) stop(); else schedule(); }
    document.addEventListener('visibilitychange', vis);
    schedule();

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) S.paused = true;

    return {
      update: function (newItems, newLabels) {
        if (newLabels) { L = newLabels; applyLabels(); }
        if (newItems) {
          var changed = newItems.length !== items.length;
          items = newItems; N = Math.max(1, items.length);
          if (changed) { makeOrder(); S.active = []; }
          WALLS.forEach(function (wl) { wl.pool.forEach(function (p) { p.k = null; }); });
          spots.forEach(function (sp) { sp.s = null; });
          lastInfoKey = null;
        }
      },
      close: function () { pushAll(); },
      setAuto: function (v) { AUTO = !!v; },
      state: S,
      destroy: function () {
        destroyed = true; stop();
        host.removeEventListener('click', onClick); host.removeEventListener('pointerdown', onDown);
        host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('pointerup', onUp); document.removeEventListener('keydown', onKey);
        document.removeEventListener('visibilitychange', vis);
        if (ro) ro.disconnect(); if (io) io.disconnect();
        if (creditsEl) creditsEl.remove();
        root.innerHTML = '';
      }
    };
  }

  window.MSCorridor = { mount: mount };
})();
