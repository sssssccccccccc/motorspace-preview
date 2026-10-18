/* Motorspace gallery homepage: the about paragraph as particle text.
   主人 2026-10-17: 「执行下面代码，在图2的地方」— react-bits ParticleText (particleSize 3, density 5, shape square, intro scan,
   scatter 120, gatherDuration 1800, stagger 240, clickBurst, burstStrength .8, pointerRepel 24, repelRadius 90, idleDrift 0,
   trigger hover, highlightMode motion, glow off). The paragraph keeps its own white, size and weight (600, clamp(30px,4.3vw,58px));
   the demo's green becomes the warm white of the corridor lights. The demo's particle size and spacing are for its 128px
   letters, so they are scaled to the paragraph's size and the words still read.
   As the paragraph comes into view a scan line sweeps across it and the letters gather out of squares behind it; the mouse
   pushes the squares aside, a click (a tap on phones) bursts them, and coming onto the paragraph with the mouse scans it again.
   The paragraph is React's and nothing inside it changes: a canvas lies over it (it never takes the mouse), and while it is
   there the visible letters are hidden with CSS. The screen-reader copy stays. The letters brightening as you scroll give way
   to this here. Reduced motion: the paragraph stays as it was. */
(function () {
  'use strict';
  var mm = window.matchMedia ? function (q) { return window.matchMedia(q).matches; } : function () { return false; };
  if (mm('(prefers-reduced-motion: reduce)') || !window.IntersectionObserver || !window.ResizeObserver || !window.MutationObserver) return;
  var FINE = mm('(hover: hover) and (pointer: fine)');
  var O = { size: 3, density: 5, ref: 128, gather: 1800, stagger: 240, burst: 0.8, repel: 24, radius: 90 };
  var WARM = [255, 210, 168];   // the corridor lights' warm white, instead of the demo green
  var INK = 130;                 // how much of a cell must be ink (of 255) for it to hold a square
  var TONES = 12, FADES = 8, HEAT_RANGE = 36, HEAT_DEADZONE = 3, SPRING = 18, DAMPING = 7.5, FLOOR = 0.35;
  var SCAN_FADE = [0, 0.12, 0.42, 0.78, 1, 0.78, 0.42, 0.12, 0];
  var PICK = '.kt-about .kt-sw';

  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function fadeAlpha(l) { return 0.35 + 0.65 * l / (FADES - 1); }

  var css = document.createElement('style');
  css.textContent = '[data-mpt-host]{position:relative}' +
    '.mpt{position:absolute;left:0;top:0;z-index:1;pointer-events:none}' +
    '.kt-sw[data-mpt-on]>[aria-hidden="true"]{visibility:hidden}';
  document.head.appendChild(css);

  function make(p) {
    var host = p.parentNode, cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    if (!host || !ctx) return;
    cv.className = 'mpt'; cv.setAttribute('aria-hidden', 'true');
    host.setAttribute('data-mpt-host', '');
    var parts = [], buckets = [], palette = [], size = 1, dpr = 1, raf = 0, last = 0, key = '', text = '';
    var started = false, gathering = false, bursting = false, visible = false, t0 = 0, doneAt = 0;
    var scan = { from: 0, to: 0, top: 0, bottom: 0, dur: 1 }, ptr = { on: false, x: 0, y: 0, sx: 0, sy: 0 };
    for (var b = 0; b < TONES * FADES; b++) buckets.push([]);

    // every letter drawn where the browser put it, so small that one pixel is one square's cell: the pixel's alpha is how
    // much of the cell is ink. A cell with enough ink holds a square.
    function build() {
      var pr = p.getBoundingClientRect();
      if (!pr.width || !pr.height) return false;
      var cs = getComputedStyle(p), fs = parseFloat(cs.fontSize), k = fs / O.ref;
      var step = Math.max(1.6, O.density * k);
      size = Math.max(1, O.size * k);
      // room around the paragraph for the scan line and the burst, but never past the window's sides
      var pad = Math.ceil(Math.max(120, fs * 2)), padY = Math.ceil(Math.max(120, pr.height * 0.3 + 24));
      var padL = Math.max(0, Math.min(pad, pr.left)), padR = Math.max(0, Math.min(pad, document.documentElement.clientWidth - pr.right));
      var W = Math.ceil(pr.width + padL + padR), H = Math.ceil(pr.height + padY * 2);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (cv.parentNode !== host) host.appendChild(cv);
      cv.style.left = '0px'; cv.style.top = '0px';
      var cr = cv.getBoundingClientRect();
      cv.style.left = (pr.left - cr.left - padL).toFixed(2) + 'px'; cv.style.top = (pr.top - cr.top - padY).toFixed(2) + 'px';
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);

      var gw = Math.ceil(W / step), gh = Math.ceil(H / step), off = document.createElement('canvas');
      off.width = gw; off.height = gh;
      var o = off.getContext('2d', { willReadFrequently: true });
      if (!o) return false;
      o.setTransform(1 / step, 0, 0, 1 / step, 0, 0);
      o.fillStyle = '#fff'; o.textBaseline = 'alphabetic';
      var shown = p.querySelector('[aria-hidden="true"]') || p;
      var walk = document.createTreeWalker(shown, NodeFilter.SHOW_TEXT, null), node, range = document.createRange();
      var font = '', asc = fs * 0.8, desc = fs * 0.2;
      while ((node = walk.nextNode())) {
        var ns = getComputedStyle(node.parentElement), f = ns.fontStyle + ' ' + ns.fontWeight + ' ' + ns.fontSize + ' ' + ns.fontFamily;
        if (f !== font) {
          o.font = font = f;
          var met = o.measureText('Hg');
          asc = met.fontBoundingBoxAscent || parseFloat(ns.fontSize) * 0.8; desc = met.fontBoundingBoxDescent || parseFloat(ns.fontSize) * 0.2;
        }
        var s = node.nodeValue;
        for (var i = 0; i < s.length; i++) {
          var n = s.codePointAt(i) > 0xffff ? 2 : 1, ch = s.substr(i, n);
          if (!/\s/.test(ch)) {
            range.setStart(node, i); range.setEnd(node, i + n);
            var r = range.getClientRects()[0];
            if (r && r.width) o.fillText(ch, r.left - pr.left + padL, r.top - pr.top + padY + (r.height - asc - desc) / 2 + asc);
          }
          i += n - 1;
        }
      }
      var data = o.getImageData(0, 0, gw, gh).data, next = [];
      for (var gy = 0; gy < gh; gy++) {
        for (var gx = 0; gx < gw; gx++) {
          if (data[(gy * gw + gx) * 4 + 3] <= INK) continue;
          var j = next.length, tx = (gx + 0.5) * step, ty = (gy + 0.5) * step;
          next.push({ x: tx, y: ty, tx: tx, ty: ty, sx: tx, sy: ty, delay: 0, ox: 0, oy: 0, vx: 0, vy: 0,
            seed: ((j * 9301 + 49297) % 233280) / 233280, depth: 0.45 + (((j * 233 + 97) % 1000) / 1000) * 0.9 });
        }
      }
      parts = next;
      bursting = false;
      var from = String(cs.color).match(/[\d.]+/g) || [245, 245, 247];
      palette = [];
      for (var t = 0; t < TONES; t++) {
        var u = t / (TONES - 1);
        palette.push('rgb(' + [0, 1, 2].map(function (c) { return Math.round(+from[c] + (WARM[c] - from[c]) * u); }).join(',') + ')');
      }
      p.setAttribute('data-mpt-on', '');
      return true;
    }

    // the scan: a line runs from the first letter to the last, and each square flies in from just behind it
    function intro() {
      if (!parts.length) return;
      var l = Infinity, rt = -Infinity, top = Infinity, bot = -Infinity;
      parts.forEach(function (q) { l = Math.min(l, q.tx); rt = Math.max(rt, q.tx); top = Math.min(top, q.ty); bot = Math.max(bot, q.ty); });
      var tall = Math.max(1, bot - top);
      scan.from = l - 24; scan.to = rt + 24; scan.top = top - tall * 0.3; scan.bottom = bot + tall * 0.3; scan.dur = Math.max(200, O.gather * 0.8);
      parts.forEach(function (q) {
        q.sx = q.tx + 3 + q.seed * 8;
        q.sy = scan.top + ((q.seed * 7.31 + q.depth * 3.7) % 1) * (scan.bottom - scan.top);
        q.delay = (q.tx - scan.from) / Math.max(1, scan.to - scan.from) * scan.dur + q.seed * O.stagger * 0.15;
        if (!started) { q.x = q.sx; q.y = q.sy; }
      });
      started = true; gathering = true; t0 = performance.now();
      wake();
    }

    function burst(x, y) {
      if (!started || !parts.length) return;
      var R = 90 + 70 * Math.sqrt(O.burst) + O.radius * 0.25;
      parts.forEach(function (q) {
        var dx = q.x - x, dy = q.y - y, d = Math.hypot(dx, dy);
        if (d > R) return;
        var fall = 1 - d / R, power = 950 * O.burst * (0.2 + 0.8 * fall * fall) * (0.65 + q.depth * 0.45);
        var a = Math.atan2(dy, dx) + (q.seed - 0.5) * 0.9;
        q.vx += Math.cos(a) * power; q.vy += Math.sin(a) * power;
      });
      bursting = true;
      wake();
    }

    function step(now) {
      var dt = last ? Math.min(0.05, Math.max(0, (now - last) / 1000)) : 1 / 60;
      last = now;
      var frames = Math.max(dt * 60, 0.001), follow = 1 - Math.pow(0.78, frames), chase = 1 - Math.pow(0.82, frames);
      ptr.sx += (ptr.x - ptr.sx) * chase; ptr.sy += (ptr.y - ptr.sy) * chase;
      var repel = ptr.on && started, floor = gathering ? FLOOR : 0, complete = true, moving = false, settling = false;
      for (var b = 0; b < buckets.length; b++) buckets[b].length = 0;
      for (var i = 0; i < parts.length; i++) {
        var q = parts[i], bx = q.tx, by = q.ty, prog = 1, hidden = !started;
        if (gathering) {
          var local = (now - t0 - q.delay) / (O.gather * 0.4);
          prog = clamp(local, 0, 1);
          if (local < 0) hidden = true;
          var e = easeOut(prog);
          bx = q.sx + (q.tx - q.sx) * e; by = q.sy + (q.ty - q.sy) * e;
          if (prog < 1) complete = false;
        }
        if (bursting) {
          q.vx += (-SPRING * q.ox - DAMPING * q.vx) * dt; q.vy += (-SPRING * q.oy - DAMPING * q.vy) * dt;
          q.ox += q.vx * dt; q.oy += q.vy * dt;
          if (Math.abs(q.ox) + Math.abs(q.oy) > 0.05 || Math.abs(q.vx) + Math.abs(q.vy) > 1) settling = true;
          else { q.ox = q.oy = q.vx = q.vy = 0; }
          bx += q.ox; by += q.oy;
        }
        if (repel) {
          var dx = bx - ptr.sx, dy = by - ptr.sy, d = Math.hypot(dx, dy);
          if (d > 0 && d < O.radius) { var force = Math.pow(1 - d / O.radius, 2) * O.repel; bx += dx / d * force; by += dy / d * force; }
        }
        var mx = (bx - q.x) * follow, my = (by - q.y) * follow;
        q.x += mx; q.y += my;
        if (Math.abs(mx) + Math.abs(my) > 0.02) moving = true;
        if (hidden) continue;
        var heat = clamp((Math.hypot(q.x - q.tx, q.y - q.ty) - HEAT_DEADZONE) / HEAT_RANGE, 0, 1);
        buckets[Math.round((floor + (1 - floor) * prog) * (FADES - 1)) * TONES + Math.round(heat * (TONES - 1))].push(q);
      }
      if (gathering && complete) { gathering = false; doneAt = now; }
      if (bursting && !settling) bursting = false;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, cv.width, cv.height);
      // squares on whole device pixels, so the letters at rest are an even grid of crisp dots
      var sz = Math.max(1, Math.round(size * dpr)), half = sz / 2;
      for (var f = 0; f < FADES; f++) {
        ctx.globalAlpha = fadeAlpha(f);
        for (var t = 0; t < TONES; t++) {
          var g = buckets[f * TONES + t];
          if (!g.length) continue;
          ctx.fillStyle = palette[t];
          ctx.beginPath();
          for (var m = 0; m < g.length; m++) ctx.rect(Math.round(g[m].x * dpr - half), Math.round(g[m].y * dpr - half), sz, sz);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      var scanning = drawScan(now);
      return gathering || moving || repel || bursting || scanning;
    }

    function drawScan(now) {
      var prog = (now - t0) / scan.dur;
      if (!started || prog < 0 || prog > 1.3) return false;
      var x = (scan.from + (scan.to - scan.from) * clamp(prog, 0, 1)) * dpr;
      var grad = ctx.createLinearGradient(0, scan.top * dpr, 0, scan.bottom * dpr);
      SCAN_FADE.forEach(function (lv, i) { grad.addColorStop(i / (SCAN_FADE.length - 1), 'rgba(' + WARM.join(',') + ',' + lv + ')'); });
      ctx.globalAlpha = clamp(prog / 0.08, 0, 1) * clamp((1.3 - prog) / 0.3, 0, 1) * 0.85;
      ctx.fillStyle = grad;
      ctx.fillRect(x - 0.75 * dpr, scan.top * dpr, 1.5 * dpr, (scan.bottom - scan.top) * dpr);
      ctx.globalAlpha = 1;
      return true;
    }

    function frame(now) {
      raf = 0;
      if (step(now) && visible) raf = requestAnimationFrame(frame);
    }
    function wake() {
      if (raf || !visible) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    }

    // a new language re-scans the paragraph; a new size just re-lays the squares
    var pend = 0;
    function relay() {
      pend = 0;
      var r = p.getBoundingClientRect(), now = (p.querySelector('.kt-sr') || p).textContent;
      var k = Math.round(r.width) + 'x' + Math.round(r.height) + '@' + document.documentElement.clientWidth + ':' + now;
      if (k === key) return;
      var changed = key && now !== text;
      key = k; text = now;
      if (!build()) return;
      if (started && (changed || gathering)) { started = false; intro(); }
      else { last = 0; step(performance.now()); wake(); }
    }
    function later() { if (!pend) pend = requestAnimationFrame(relay); }
    relay();
    new ResizeObserver(later).observe(p);
    window.addEventListener('resize', later);
    new MutationObserver(later).observe(p, { childList: true, subtree: true, characterData: true });

    new IntersectionObserver(function (es) {
      visible = es[es.length - 1].isIntersecting;
      wake();
    }, { rootMargin: '200px 0px' }).observe(p);
    var first = new IntersectionObserver(function (es) {
      if (!es[es.length - 1].isIntersecting) return;
      first.disconnect();
      visible = true;
      intro();
    }, { rootMargin: '0px 0px -12% 0px' });
    first.observe(p);

    function at(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    function move(e) {
      if (e.pointerType !== 'mouse') return;
      var a = at(e);
      ptr.x = a[0]; ptr.y = a[1];
      if (!ptr.on) { ptr.sx = ptr.x; ptr.sy = ptr.y; }
      ptr.on = true;
      wake();
    }
    if (FINE) {
      p.addEventListener('pointerenter', function (e) {
        move(e);
        if (e.pointerType === 'mouse' && started && !gathering && performance.now() - doneAt > 600) intro();
      });
      p.addEventListener('pointermove', move);
      p.addEventListener('pointerleave', function () { ptr.on = false; wake(); });
      p.addEventListener('pointerdown', function (e) { if (e.button === 0) { var a = at(e); burst(a[0], a[1]); } });
    } else {
      // a tap, not the start of a scroll
      p.addEventListener('click', function (e) { var a = at(e); burst(a[0], a[1]); });
    }
  }

  var tries = 0;
  function init() {
    var list = document.querySelectorAll(PICK);
    if (!list.length) { if (++tries < 20) setTimeout(init, 500); return; }
    Array.prototype.forEach.call(list, make);
  }
  function start() { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init, init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
