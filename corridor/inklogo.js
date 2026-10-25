/* MotorSpace · hover ink on the logo (主人 2026-10-17: 「https://motionsites.ai/?prompt=hover-ink 我希望在我的 logo 处也有这一特效」).
   Moving the mouse over the logo leaves a trail of ink: ragged blobs with a few splashes that bloom under the pointer and
   draw back once it moves on. Inside the ink the logo shows in another material (dark chrome, champagne, blue steel;
   the next one each time the pointer comes back). The ink is the page's warm white, so on the dark nav it reads the way
   the black ink reads on the reference's white page.
   Self-starting on gallery, car-page and standard navigation logos; only with a fine pointer that can hover, and not
   when the visitor asked for reduced motion. One canvas over the logo, drawn only while some ink is alive. */
(function () {
  'use strict';
  var mm = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  if (mm('(prefers-reduced-motion: reduce)') || !mm('(hover: hover) and (pointer: fine)')) return;

  var SEL = '.msc-nav-logo, .cp-logo, .kt-nav > .kt-logo, .kt-menu .kt-logo';
  var INK = '#f3eee6';
  var LIFE = 1150, GROW = 150, HOLD = 380;    // ms: a blob blooms, holds, then draws back
  // vertical bands of each material over the glyph height (a horizon line, like chrome reflecting the sky and the road)
  var MATERIALS = [
    [[0, '#fbfcfe'], [0.34, '#b7bdc6'], [0.47, '#262a31'], [0.56, '#565c65'], [0.78, '#d9dde3'], [1, '#6f757e']],
    [[0, '#fff6df'], [0.34, '#d9b06a'], [0.48, '#4f3514'], [0.57, '#8f6a33'], [0.8, '#f0d39a'], [1, '#8a642f']],
    [[0, '#eef6ff'], [0.34, '#8fb2da'], [0.48, '#15283e'], [0.57, '#3e6690'], [0.8, '#c3daf2'], [1, '#4a6f96']]
  ];
  var nextMaterial = 0;

  function Ink(a) {
    this.a = a; this.pts = []; this.raf = 0; this.mat = 0; this.last = null; this.ready = false;
    var c = this.c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText = 'position:absolute;z-index:2;pointer-events:none;left:0;top:0;';
    if (getComputedStyle(a).position === 'static') a.style.position = 'relative';
    a.appendChild(c);
    this.mask = document.createElement('canvas'); this.tmp = document.createElement('canvas');
    var self = this;
    a.addEventListener('pointerenter', function (e) { self.enter(e); });
    a.addEventListener('pointermove', function (e) { self.move(e); });
    a.addEventListener('pointerleave', function () { self.last = self.pointer = null; });
    // A first hover can arrive before the PNG finishes loading. Retry on load;
    // resize also covers responsive nav layouts and changes of screen/DPR.
    Array.prototype.forEach.call(a.querySelectorAll('img'), function (img) {
      img.addEventListener('load', function () { self.layout(); });
    });
    if (window.ResizeObserver) {
      this.ro = new ResizeObserver(function () { self.layout(); }); this.ro.observe(a);
    }
    window.addEventListener('resize', function () { self.layout(); });
  }

  // Draw the image's alpha at its rendered position, in device pixels. Its RGB
  // is irrelevant: paint() uses destination-in to cut each metal to this shape.
  // Inline SVG alone and the old SVG + <b> word remain supported.
  Ink.prototype.layout = function () {
    var a = this.a, bitmap = a.querySelector('img'), svg = a.querySelector('svg'), b = bitmap ? null : a.querySelector('b');
    this.ready = false; this.laying = false;
    var revision = this.revision = (this.revision || 0) + 1;
    if (bitmap ? !bitmap.complete || !bitmap.naturalWidth : !svg) return false;
    var art = bitmap || svg, ar = a.getBoundingClientRect(), sr = art.getBoundingClientRect(), br = b ? b.getBoundingClientRect() : sr;
    if (!sr.width || !sr.height) return false;
    var gx = Math.min(sr.left, br.left), gy = Math.min(sr.top, br.top), gw = Math.max(sr.right, br.right) - gx, gh = Math.max(sr.bottom, br.bottom) - gy;
    var R = this.R = Math.max(12, sr.height * 0.66), PAD = this.PAD = Math.ceil(R * 2.1), dpr = this.dpr = Math.max(1, window.devicePixelRatio || 1);
    var W = gw + PAD * 2, H = gh + PAD * 2;
    this.W = W; this.H = H; this.gy = PAD; this.gh = gh;
    var c = this.c;
    c.width = this.mask.width = this.tmp.width = Math.round(W * dpr); c.height = this.mask.height = this.tmp.height = Math.round(H * dpr);
    c.style.width = W + 'px'; c.style.height = H + 'px';
    c.style.left = (gx - ar.left - a.clientLeft - PAD) + 'px'; c.style.top = (gy - ar.top - a.clientTop - PAD) + 'px';
    var ox = gx - PAD, oy = gy - PAD;
    var g = document.createElement('canvas'); g.width = c.width; g.height = c.height;
    var gc = g.getContext('2d'); gc.scale(dpr, dpr); gc.fillStyle = '#fff';
    gc.imageSmoothingQuality = 'high';
    var self = this;
    function finish() {
      if (self.revision !== revision) return;
      self.glyphs = g; self.paint(); self.ready = true; self.laying = false;
      self.pts = []; self.last = null;
      if (self.pointer) self.move(self.pointer);
    }
    if (bitmap) {
      gc.drawImage(bitmap, sr.left - ox, sr.top - oy, sr.width, sr.height);
      finish(); return true;
    }
    // the word, letter by letter where the browser put each one (keeps the letter-spacing exact)
    if (b && b.firstChild && b.firstChild.nodeType === 3) {
    var cs = getComputedStyle(b), node = b.firstChild, text = node.textContent, range = document.createRange();
    gc.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
    var m = gc.measureText(text), asc = m.fontBoundingBoxAscent || parseFloat(cs.fontSize) * 0.8, desc = m.fontBoundingBoxDescent || parseFloat(cs.fontSize) * 0.2;
    for (var i = 0; i < text.length; i++) {
      if (text[i] === ' ') continue;
      range.setStart(node, i); range.setEnd(node, i + 1);
      var r = range.getBoundingClientRect();
      gc.fillText(text[i], r.left - ox, r.top - oy + (r.height - asc - desc) / 2 + asc);
    }
    }
    // the mark: the inline svg drawn white at its size
    var ss = getComputedStyle(svg), clone = svg.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); clone.setAttribute('width', sr.width); clone.setAttribute('height', sr.height);
    clone.setAttribute('fill', b ? 'none' : ss.fill); clone.setAttribute('stroke', b ? '#fff' : ss.stroke); clone.setAttribute('color', ss.color);
    clone.setAttribute('stroke-width', parseFloat(ss.strokeWidth) || 1.6);
    clone.setAttribute('stroke-linejoin', 'round'); clone.setAttribute('stroke-linecap', 'round');
    var img = new Image();
    img.onload = function () { gc.drawImage(img, sr.left - ox, sr.top - oy, sr.width, sr.height); finish(); };
    img.onerror = function () { if (self.revision === revision) self.laying = false; };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    return true;
  };

  // one material, pre-drawn: a dark rim around the glyphs (so the light bands still read on the white ink), then the
  // glyphs filled with the bands
  Ink.prototype.paint = function () {
    var g = this.glyphs, d = this.dpr, w = g.width, h = g.height;
    this.layers = MATERIALS.map(function (bands) {
      var L = document.createElement('canvas'); L.width = w; L.height = h; var lc = L.getContext('2d');
      var rim = document.createElement('canvas'); rim.width = w; rim.height = h; var rc = rim.getContext('2d');
      for (var k = 0; k < 8; k++) { var an = k / 8 * Math.PI * 2; rc.drawImage(g, Math.cos(an) * 1.1 * d, Math.sin(an) * 1.1 * d); }
      rc.globalCompositeOperation = 'source-in'; rc.fillStyle = 'rgba(12,13,16,.78)'; rc.fillRect(0, 0, w, h);
      lc.shadowColor = 'rgba(10,11,14,.45)'; lc.shadowBlur = 3 * d; lc.shadowOffsetY = 1.2 * d; lc.drawImage(rim, 0, 0); lc.shadowColor = 'transparent';
      var f = document.createElement('canvas'); f.width = w; f.height = h; var fc = f.getContext('2d');
      var y0 = this.gy * d, y1 = (this.gy + this.gh) * d, gr = fc.createLinearGradient(0, y0, 0, y1);
      bands.forEach(function (s) { gr.addColorStop(s[0], s[1]); });
      fc.fillStyle = gr; fc.fillRect(0, 0, w, h);
      fc.globalCompositeOperation = 'destination-in'; fc.drawImage(g, 0, 0);
      lc.drawImage(f, 0, 0);
      return L;
    }, this);
  };

  Ink.prototype.enter = function (e) {
    var now = performance.now();
    if (now - (this.entered || -1e4) > 60) { this.mat = nextMaterial; nextMaterial = (nextMaterial + 1) % MATERIALS.length; }   // pointerover and pointerenter of one move count once
    this.entered = now;
    this.pointer = { clientX: e.clientX, clientY: e.clientY };
    if (!this.ready && !this.laying) { this.laying = true; var self = this; (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { self.layout(); }); }
    else if (this.ready && !this.pts.length) this.layout();   // the nav may have changed size since the last time
    this.last = null; this.move(e);
  };

  Ink.prototype.move = function (e) {
    this.pointer = { clientX: e.clientX, clientY: e.clientY };
    if (!this.ready) return;
    var r = this.c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now(), R = this.R;
    var from = this.last || { x: x, y: y }, dx = x - from.x, dy = y - from.y, dist = Math.hypot(dx, dy), step = R * 0.32;
    var n = Math.max(1, Math.floor(dist / step));
    for (var i = 1; i <= n; i++) this.add(from.x + dx * i / n, from.y + dy * i / n, now - (n - i) * 6);
    this.last = { x: x, y: y };
    if (this.pts.length > 160) this.pts.splice(0, this.pts.length - 160);
    if (!this.raf) { var self = this; this.raf = requestAnimationFrame(function (t) { self.frame(t); }); }
  };

  Ink.prototype.add = function (x, y, t) {
    var R = this.R, rnd = Math.random;
    this.pts.push({ x: x, y: y, t: t, r: R * (0.78 + rnd() * 0.34), p: [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28] });
    if (rnd() < 0.16) {   // a splash: a few drops thrown off to the side
      for (var k = 0, n = 1 + Math.floor(rnd() * 3); k < n; k++) {
        var an = rnd() * 6.28, d = R * (1.05 + rnd() * 0.75);
        this.pts.push({ x: x + Math.cos(an) * d, y: y + Math.sin(an) * d * 0.8, t: t + 40, r: R * (0.1 + rnd() * 0.16), p: [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28], drop: true });
      }
    }
  };

  function size(age) {   // 0..1 of the blob's full radius over its life
    if (age < GROW) { var u = age / GROW; return 1 - (1 - u) * (1 - u) * (1 - u); }
    if (age < HOLD) return 1;
    var v = Math.min(1, (age - HOLD) / (LIFE - HOLD)); return 1 - v * v;
  }

  Ink.prototype.frame = function (now) {
    this.raf = 0;
    var pts = this.pts = this.pts.filter(function (p) { return now - p.t < LIFE; });
    var d = this.dpr, m = this.mask.getContext('2d'), o = this.c.getContext('2d'), t = now / 1000;
    m.setTransform(d, 0, 0, d, 0, 0); m.clearRect(0, 0, this.W, this.H); m.fillStyle = '#fff';
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i], s = size(now - p.t); if (s <= 0.02) continue;
      var r = p.r * s, N = p.drop ? 12 : 26;
      m.beginPath();
      for (var k = 0; k <= N; k++) {   // a ragged edge that keeps creeping, like ink soaking in
        var a = k / N * Math.PI * 2;
        var rr = r * (1 + 0.11 * Math.sin(3 * a + p.p[0] + t * 0.9) + 0.07 * Math.sin(5 * a + p.p[1] - t * 1.3) + 0.05 * Math.sin(11 * a + p.p[2]));
        var px = p.x + Math.cos(a) * rr, py = p.y + Math.sin(a) * rr * 0.86;
        if (k) m.lineTo(px, py); else m.moveTo(px, py);
      }
      m.fill();
    }
    var w = this.c.width, h = this.c.height;
    o.globalCompositeOperation = 'source-over'; o.clearRect(0, 0, w, h);
    if (pts.length && this.layers) {
      o.drawImage(this.mask, 0, 0); o.globalCompositeOperation = 'source-in'; o.fillStyle = INK; o.fillRect(0, 0, w, h);
      // the logo in this pass's material, with a slow sheen across it, only where the ink is
      var tc = this.tmp.getContext('2d');
      tc.globalCompositeOperation = 'source-over'; tc.clearRect(0, 0, w, h); tc.drawImage(this.layers[this.mat], 0, 0);
      var sx = ((t * 0.35) % 1.6 - 0.3) * w, sh = tc.createLinearGradient(sx - 0.12 * w, 0, sx + 0.12 * w, h * 0.4);
      sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, 'rgba(255,255,255,.45)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
      tc.globalCompositeOperation = 'source-atop'; tc.fillStyle = sh; tc.fillRect(0, 0, w, h);
      tc.globalCompositeOperation = 'destination-in'; tc.drawImage(this.mask, 0, 0);
      o.globalCompositeOperation = 'source-over'; o.drawImage(this.tmp, 0, 0);
    }
    if (pts.length) { var self = this; this.raf = requestAnimationFrame(function (tt) { self.frame(tt); }); }
  };

  // start on first contact, so a nav drawn later by the page's scripts is covered too
  document.addEventListener('pointerover', function (e) {
    var a = e.target.closest && e.target.closest(SEL);
    if (!a || a.__ink) return;
    a.__ink = new Ink(a); a.__ink.enter(e);
  }, { passive: true });
})();
