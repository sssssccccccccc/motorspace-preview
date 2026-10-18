/* MotorSpace · small UI motion helpers for the gallery homepage prototype.
   window.MSUI.magnet()        main buttons marked [data-magnet] move toward the pointer inside their box and ease back
   window.MSUI.navPill(navEl)  a capsule behind the nav links that follows the link you point at. Since 2026-10-17 it is
                               gooey (react-bits GooeyNav): it bursts into droplets that fly to the next link and run
                               together again, leans a little toward the pointer, and rests on the section you are in
   Both return a function that removes their listeners. Hover-capable mice only for the magnet;
   reduced-motion visitors get no movement. */
(function () {
  function noop() {}
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // magnetic CTA (finesse-ui recipe): inside its own box the button moves toward the pointer by 0.35 of the
  // offset from its centre, and eases back to rest when the pointer leaves. Keep it to 1-2 main buttons.
  function magnet() {
    if (!fine || still) return noop;
    var cur = null;
    function release(el) { el._mgx = el._mgy = 0; el.style.transform = ''; el.classList.remove('is-magnet'); }
    function move(e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-magnet]') : null;
      if (el !== cur) { if (cur) release(cur); cur = el; }
      if (!el) return;
      var r = el.getBoundingClientRect(), ox = el._mgx || 0, oy = el._mgy || 0;   // measure from where it rests
      var k = parseFloat(el.getAttribute('data-magnet')) || 0.35;
      var tx = (e.clientX - (r.left - ox) - r.width / 2) * k, ty = (e.clientY - (r.top - oy) - r.height / 2) * k;
      el._mgx = tx; el._mgy = ty; el.classList.add('is-magnet');
      el.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px)';
    }
    function out() { if (cur) { release(cur); cur = null; } }
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', out);
    window.addEventListener('scroll', out, { passive: true });
    return function () { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', out); window.removeEventListener('scroll', out); out(); };
  }

  function plainPill(nav) {
    var pill = nav.querySelector('.msc-nav-pill'); if (!pill) return noop;
    var on = null, hideT = 0;
    function place(a, jump) {
      // the capsule takes the link's own box, which is its text plus a fixed padding
      if (jump) { pill.classList.add('no-anim'); void pill.offsetWidth; }
      pill.style.width = a.offsetWidth + 'px'; pill.style.transform = 'translateX(' + a.offsetLeft + 'px)';
      if (jump) { void pill.offsetWidth; pill.classList.remove('no-anim'); }
    }
    function enter(e) {
      var a = e.target.closest && e.target.closest('a'); if (!a || !nav.contains(a)) return;
      clearTimeout(hideT);
      var first = !nav.classList.contains('has-pill');
      place(a, first);
      nav.classList.add('has-pill');
      if (on && on !== a) on.classList.remove('is-on'); on = a; a.classList.add('is-on');
    }
    function leave() {
      hideT = setTimeout(function () { nav.classList.remove('has-pill'); if (on) on.classList.remove('is-on'); on = null; }, 60);
    }
    function blur(e) { if (!nav.contains(e.relatedTarget)) leave(); }
    nav.addEventListener('pointerover', enter);
    nav.addEventListener('pointerleave', leave);
    nav.addEventListener('focusin', enter);
    nav.addEventListener('focusout', blur);
    return function () {
      nav.removeEventListener('pointerover', enter); nav.removeEventListener('pointerleave', leave);
      nav.removeEventListener('focusin', enter); nav.removeEventListener('focusout', blur); clearTimeout(hideT);
    };
  }

  // ---- gooey capsule (主人 2026-10-17:「之前那个磁吸换成这个黏糊糊…就是那个磁吸加上这个一起」) ----
  // react-bits GooeyNav, settings as given: particleCount 15, spread 56, animationTime 600, timeVariance 300, gooeyness .5,
  // wobble .5, hoverEffect on, frame on, dark theme. The capsule and its droplets are drawn as one soft shape in WebGL2
  // (signed distances blended with a smooth minimum), so they pull apart and run together like liquid; a copy of the
  // labels in the background colour, clipped to that shape, keeps the text readable on the white.
  // Ours on top of the original: the capsule still follows the pointer (the earlier "magnet"), leans a little toward it
  // inside the link, and when the pointer leaves it flows back to the link of the section on screen (or melts away
  // over the first screen); the faint hover capsule marks that section while you point elsewhere.
  var GOO = { particleCount: 15, spread: 56, animationTime: 600, timeVariance: 300, gooeyness: 0.5, wobble: 0.5, hoverEffect: true };
  var MAX_DROPS = 32, MAX_PILLS = 4, BELOW = 72;
  var GOO_VERT = '#version 300 es\nin vec2 aPosition;\nvoid main() { gl_Position = vec4(aPosition, 0.0, 1.0); }\n';
  var GOO_FRAG = '#version 300 es\nprecision highp float;\n' +
    'uniform vec2 uSize; uniform float uRatio; uniform vec4 uPills[' + MAX_PILLS + ']; uniform vec4 uHover; uniform vec4 uDrops[' + MAX_DROPS + '];\n' +
    'uniform vec2 uTails[' + MAX_DROPS + ']; uniform int uCount; uniform float uSmooth; uniform vec3 uPill; uniform vec4 uHoverColor; uniform float uShadow;\n' +
    'out vec4 outColor;\n' +
    'float sdPill(vec2 p, vec4 box) { vec2 e = max(box.zw, vec2(0.0)); float r = min(e.x, e.y); vec2 q = abs(p - box.xy) - e + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }\n' +
    'float sdCapsule(vec2 p, vec2 a, vec2 b, float r) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0); return length(pa - ba * h) - r; }\n' +
    'float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }\n' +
    'float field(vec2 p) { float d = 1e5;\n' +
    '  for (int i = 0; i < ' + MAX_PILLS + '; i++) { vec4 b = uPills[i]; if (b.z <= 0.0) continue; d = smin(d, sdPill(p, b), uSmooth); }\n' +
    '  for (int i = 0; i < ' + MAX_DROPS + '; i++) { if (i >= uCount) break; vec4 o = uDrops[i]; if (o.z <= 0.0) continue; float e = sdCapsule(p, o.xy, o.xy - uTails[i], o.z); if (e > d + uSmooth) continue; d = smin(d, e, uSmooth); }\n' +
    '  return d; }\n' +
    'void main() { vec2 p = vec2(gl_FragCoord.x, uSize.y * uRatio - gl_FragCoord.y) / uRatio; float d = field(p);\n' +
    '  float aa = max(fwidth(d), 0.35); float body = clamp(0.5 - d / aa, 0.0, 1.0);\n' +
    '  vec2 g = vec2(dFdx(d), -dFdy(d)); vec2 n = length(g) > 0.0001 ? normalize(g) : vec2(0.0, 1.0);\n' +
    '  float rim = (1.0 - smoothstep(0.0, 1.6, -d)) * max(0.0, -n.y) * 0.3;\n' +
    '  vec3 fill = mix(uPill, vec3(1.0), rim) * (1.0 - 0.06 * max(0.0, n.y) * (1.0 - smoothstep(0.0, 6.0, -d)));\n' +
    '  float lifted = field(p - vec2(0.0, 3.0)); float shadow = (1.0 - smoothstep(-3.0, 9.0, lifted)) * uShadow * (1.0 - body);\n' +
    '  float hov = clamp(0.5 - sdPill(p, uHover) / aa, 0.0, 1.0) * uHoverColor.a;\n' +
    '  vec4 c = vec4(0.0, 0.0, 0.0, shadow); c = vec4(uHoverColor.rgb * hov, hov) + c * (1.0 - hov); c = vec4(fill * body, body) + c * (1.0 - body);\n' +
    '  outColor = c; }\n';

  function rgbOf(css) { var m = /rgba?\(([^)]+)\)/.exec(css || ''); if (!m) return [0.96, 0.96, 0.97]; var v = m[1].split(',').map(parseFloat); return [v[0] / 255, v[1] / 255, v[2] / 255]; }
  function c01(v) { return Math.min(1, Math.max(0, v)); }
  function travelEase(t) { var x = c01(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function bez(a, b, c, d, t) { var u = 1 - t; return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d; }
  function pillPath(x, y, w, h) {
    if (w <= 0.5 || h <= 0.5) return '';
    var r = Math.min(w, h) / 2;
    return 'M' + (x + r) + ',' + y + 'H' + (x + w - r) + 'A' + r + ',' + r + ' 0 0 1 ' + (x + w) + ',' + (y + r) + 'V' + (y + h - r) + 'A' + r + ',' + r + ' 0 0 1 ' + (x + w - r) + ',' + (y + h) +
      'H' + (x + r) + 'A' + r + ',' + r + ' 0 0 1 ' + x + ',' + (y + h - r) + 'V' + (y + r) + 'A' + r + ',' + r + ' 0 0 1 ' + (x + r) + ',' + y + 'Z';
  }

  function gooeyNav(nav) {
    var head = nav.closest('.msc-nav') || nav.parentNode;
    if (!head || !window.WebGL2RenderingContext) return null;
    var canvas = document.createElement('canvas'); canvas.className = 'msc-goo-canvas'; canvas.setAttribute('aria-hidden', 'true');
    var gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    function sh(type, src) { var x = gl.createShader(type); gl.shaderSource(x, src); gl.compileShader(x); return x; }
    var prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, GOO_VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, GOO_FRAG)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    var U = {}; ['uSize', 'uRatio', 'uPills', 'uHover', 'uDrops', 'uTails', 'uCount', 'uSmooth', 'uPill', 'uHoverColor', 'uShadow'].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPosition');

    var rim = document.createElement('div'); rim.className = 'msc-goo-rim'; rim.setAttribute('aria-hidden', 'true');
    var ink = document.createElement('div'); ink.className = 'msc-goo-ink'; ink.setAttribute('aria-hidden', 'true');
    head.appendChild(rim); head.appendChild(canvas); nav.appendChild(ink);
    head.classList.add('msc-goo-on');

    var links = [], twins = [], rects = [], spots = [], view = { w: 0, h: 0 }, off = { x: 0, y: 0 }, ratio = 1;
    var pills = new Map(), drops = [], target = -1, active = -1, hoverI = -1;
    var ghost = { x: 0, y: 0, w: 0, h: 0, alpha: 0, index: -1 };
    var lean = { x: 0, y: 0, gx: 0, gy: 0, i: -1 };   // the magnet: how far the capsule leans toward the pointer
    var pillData = new Float32Array(MAX_PILLS * 4), dropData = new Float32Array(MAX_DROPS * 4), tailData = new Float32Array(MAX_DROPS * 2);
    var ink3 = [0.96, 0.96, 0.97], raf = 0, last = 0, dead = false;

    // the labels again, in the background colour, exactly over the real ones; shown only inside the white shape
    function copyLabels() {
      links = Array.prototype.filter.call(nav.children, function (a) { return a.tagName === 'A'; });
      ink.textContent = '';
      twins = links.map(function (a) { var t = document.createElement('a'); t.textContent = a.textContent; t.tabIndex = -1; ink.appendChild(t); return t; });
    }

    function measure() {
      var hb = head.getBoundingClientRect(), nb = nav.getBoundingClientRect();
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      view.w = hb.width; view.h = hb.height + BELOW;
      canvas.style.width = view.w + 'px'; canvas.style.height = view.h + 'px';
      var cw = Math.max(1, Math.round(view.w * ratio)), ch = Math.max(1, Math.round(view.h * ratio));
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      // canvas space = the bar's own box; the label copy lives in the links row, which may scroll sideways on phones
      off.x = nb.left + nav.clientLeft - nav.scrollLeft - hb.left; off.y = nb.top + nav.clientTop - hb.top;
      ink.style.width = nav.scrollWidth + 'px'; ink.style.height = nav.clientHeight + 'px';
      rects = links.map(function (a, i) {
        var r = a.getBoundingClientRect(), t = twins[i];
        t.style.width = a.offsetWidth + 'px'; t.style.height = a.offsetHeight + 'px'; t.style.left = a.offsetLeft + 'px'; t.style.top = a.offsetTop + 'px';
        return { x: r.left - hb.left - (a._lx || 0), y: r.top - hb.top - (a._ly || 0), w: r.width, h: r.height };
      });
      if (rects.length) {   // the frame round the links (one row only)
        var x0 = rects[0].x, x1 = rects[rects.length - 1].x + rects[rects.length - 1].w, pad = 4;
        rim.style.left = (x0 - pad) + 'px'; rim.style.top = (rects[0].y - pad) + 'px'; rim.style.width = (x1 - x0 + pad * 2) + 'px'; rim.style.height = (rects[0].h + pad * 2) + 'px';
      }
      ink3 = rgbOf(links[0] && getComputedStyle(links[0]).color);
    }

    function pill(i) { if (!pills.has(i)) pills.set(i, { mass: 0, scale: 0, velocity: 0, outgoing: 0 }); return pills.get(i); }
    function shape(i, amount) {
      var r = rects[i]; if (!r || amount <= 0.002) return null;
      var h = r.h * Math.min(1.08, 0.42 + 0.58 * Math.sqrt(Math.max(0, amount))), w = Math.max(h, r.w * Math.pow(Math.max(0, amount), 0.75));
      var lx = lean.i === i ? lean.x : 0, ly = lean.i === i ? lean.y : 0;
      return { x: r.x + r.w / 2 - w / 2 + lx, y: r.y + r.h / 2 - h / 2 + ly, w: w, h: h };
    }
    function plan(d, i, now, fresh) {
      var r = rects[i]; if (!r) return;
      var reach = GOO.spread, ex = r.x + r.w / 2 + (Math.random() - 0.5) * r.w * 0.45, ey = r.y + r.h / 2 + (Math.random() - 0.5) * r.h * 0.2;
      var base = GOO.animationTime / 1000, vary = (Math.random() - 0.5) * (GOO.timeVariance / 1000);
      var dur = Math.max(0.15, base * (0.62 + Math.random() * 0.32) + vary * 0.6), out = Math.random() * Math.PI * 2, into = Math.random() * Math.PI * 2;
      var burst = reach * (0.7 + Math.random() * 0.6), swing = reach * (0.55 + Math.random() * 0.55), carry = Math.min(dur / 3, 0.12);
      d.index = i; d.start = now; d.duration = dur;
      d.path = [d.x, d.y, fresh ? d.x + Math.cos(out) * burst * 1.6 : d.x + d.vx * carry, fresh ? d.y + Math.sin(out) * burst * 1.6 : d.y + d.vy * carry,
        ex + Math.cos(into) * swing * 1.5, ey + Math.sin(into) * swing * 1.5, ex, ey];
    }
    function emit(from, to, now) {
      var src = pills.get(from), r = rects[from];
      if (!src || !r || !rects[to]) return;
      var avail = src.mass - src.outgoing; if (avail <= 0.002) return;
      var count = Math.min(MAX_DROPS - drops.length, Math.max(1, Math.round(GOO.particleCount * avail)));
      var win = GOO.animationTime / 1000 * 0.16;
      for (var k = 0; k < count; k++) {
        var mass = avail / count; src.outgoing += mass;
        drops.push({ x: r.x + r.w / 2 + (Math.random() - 0.5) * r.w * 0.6, y: r.y + r.h / 2 + (Math.random() - 0.5) * r.h * 0.3, vx: 0, vy: 0, mass: mass,
          size: 0.8 + Math.random() * 0.4, given: 0, source: from, index: to, leave: now + Math.random() * win * 1000, emerged: 0, absorbed: 0, state: 'waiting' });
      }
    }

    // the white shape's outline, row by row, for the label copy's clip (in the copy's own coordinates)
    function trace(boxes, blobs, smooth, w, h) {
      function field(x, y) {
        var d = 1e5, k;
        function merge(v) { var q = c01(0.5 + 0.5 * (v - d) / smooth); d = v + (d - v) * q - smooth * q * (1 - q); }
        for (k = 0; k < boxes.length; k++) {
          var b = boxes[k], r = Math.min(b.hw, b.hh), qx = Math.abs(x - b.cx) - b.hw + r, qy = Math.abs(y - b.cy) - b.hh + r;
          merge(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r);
        }
        for (k = 0; k < blobs.length; k++) {
          var o = blobs[k], px = x - o.x, py = y - o.y, bx = -o.tx, by = -o.ty, span = bx * bx + by * by;
          var t = span > 0.0001 ? c01((px * bx + py * by) / span) : 0, v = Math.hypot(px - bx * t, py - by * t) - o.r;
          if (v > d + smooth) continue; merge(v);
        }
        return d;
      }
      var parts = [], step = 2;
      for (var y = 0; y < h; y++) {
        var cy = y + 0.5, prev = field(0, cy), start = prev < 0 ? 0 : null;
        for (var x = step; x <= w + step; x += step) {
          var v = field(Math.min(x, w), cy);
          if ((prev < 0) !== (v < 0)) {
            var cross = x - step + step * prev / (prev - v);
            if (v < 0) start = cross; else if (start !== null) { parts.push('M' + start.toFixed(1) + ',' + y + 'H' + cross.toFixed(1) + 'V' + (y + 1) + 'H' + start.toFixed(1) + 'Z'); start = null; }
          }
          prev = v;
        }
        if (start !== null) parts.push('M' + start.toFixed(1) + ',' + y + 'H' + w + 'V' + (y + 1) + 'H' + start.toFixed(1) + 'Z');
      }
      return parts.join('');
    }

    function render() {
      var hgt = (rects[target] || rects[0] || { h: 38 }).h, smooth = hgt * (0.18 + 0.5 * c01(GOO.gooeyness));
      var boxes = [], blobs = [];
      pills.forEach(function (st, i) { var b = shape(i, st.scale); if (b) boxes.push({ cx: b.x + b.w / 2, cy: b.y + b.h / 2, hw: b.w / 2, hh: b.h / 2 }); });
      drops.forEach(function (d) {
        if (d.state === 'waiting') return;
        var rad = 0.26 * hgt * d.size * Math.min(d.emerged, 1 - d.absorbed); if (rad <= 0.05) return;
        var sp = Math.hypot(d.vx, d.vy), len = Math.min(rad * 1.1, sp * 0.018);
        blobs.push({ x: d.x, y: d.y, r: rad, tx: sp > 0.01 ? d.vx / sp * len : 0, ty: sp > 0.01 ? d.vy / sp * len : 0 });
      });
      // label copy clip, moved into the links row's coordinates
      var lb = boxes.map(function (b) { return { cx: b.cx - off.x, cy: b.cy - off.y, hw: b.hw, hh: b.hh }; });
      var lo = blobs.map(function (o) { return { x: o.x - off.x, y: o.y - off.y, r: o.r, tx: o.tx, ty: o.ty }; });
      var path = lb.length === 1 && !lo.length ? pillPath(lb[0].cx - lb[0].hw, lb[0].cy - lb[0].hh, lb[0].hw * 2, lb[0].hh * 2) : (lb.length || lo.length ? trace(lb, lo, smooth, nav.scrollWidth, nav.clientHeight) : '');
      ink.style.clipPath = "path('" + (path || 'M0,0Z') + "')";

      var n = 0;
      boxes.forEach(function (b) { if (n >= MAX_PILLS) return; pillData[n * 4] = b.cx; pillData[n * 4 + 1] = b.cy; pillData[n * 4 + 2] = b.hw; pillData[n * 4 + 3] = b.hh; n++; });
      pillData.fill(0, n * 4);
      var c = 0;
      blobs.forEach(function (o) { if (c >= MAX_DROPS) return; dropData[c * 4] = o.x; dropData[c * 4 + 1] = o.y; dropData[c * 4 + 2] = o.r; dropData[c * 4 + 3] = 0; tailData[c * 2] = o.tx; tailData[c * 2 + 1] = o.ty; c++; });
      gl.viewport(0, 0, canvas.width, canvas.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(U.uSize, view.w, view.h); gl.uniform1f(U.uRatio, canvas.width / Math.max(1, view.w));
      gl.uniform4fv(U.uPills, pillData); gl.uniform4f(U.uHover, ghost.x, ghost.y, ghost.w / 2, ghost.h / 2);
      gl.uniform4fv(U.uDrops, dropData); gl.uniform2fv(U.uTails, tailData); gl.uniform1i(U.uCount, c);
      gl.uniform1f(U.uSmooth, smooth); gl.uniform3f(U.uPill, ink3[0], ink3[1], ink3[2]);
      gl.uniform4f(U.uHoverColor, ink3[0], ink3[1], ink3[2], 0.08 * ghost.alpha); gl.uniform1f(U.uShadow, 0.4);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function frame(now) {
      raf = 0;
      var dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
      for (var i = drops.length - 1; i >= 0; i--) {
        var d = drops[i];
        if (d.state === 'waiting') { if (now < d.leave) continue; d.state = 'flying'; plan(d, d.index, now, true); }
        if (d.state === 'flying') {
          d.emerged = Math.min(1, d.emerged + dt / 0.09);
          var src = pills.get(d.source);
          if (src && d.given < d.mass) { var stp = Math.min(d.mass * (dt / 0.09), d.mass - d.given); src.mass = Math.max(0, src.mass - stp); src.outgoing = Math.max(0, src.outgoing - stp); d.given += stp; }
          var t = c01((now - d.start) / 1000 / d.duration), e = travelEase(t), P = d.path;
          var x = bez(P[0], P[2], P[4], P[6], e), y = bez(P[1], P[3], P[5], P[7], e);
          if (dt > 0) { d.vx = (x - d.x) / dt; d.vy = (y - d.y) / dt; }
          d.x = x; d.y = y;
          if (t >= 1) d.state = 'absorbing';
        }
        if (d.state === 'absorbing') {
          var a = Math.min(1 - d.absorbed, dt / 0.12); d.absorbed += a; d.vx *= 0.8; d.vy *= 0.8;
          if (d.index >= 0) { var host = pill(d.index); host.mass = Math.min(1, host.mass + d.mass * a); }
          if (d.absorbed >= 1) drops.splice(i, 1);
        }
      }
      // every capsule is a spring toward its share of the liquid; wobble lets it overshoot and jiggle
      var zeta = still ? 1 : 1 - 0.72 * c01(GOO.wobble), om = 26, steps = Math.max(1, Math.ceil(dt / (1 / 240))), hh = dt / steps;
      pills.forEach(function (st, k) {
        for (var s = 0; s < steps; s++) { st.velocity += (om * om * (st.mass - st.scale) - 2 * zeta * om * st.velocity) * hh; st.scale += st.velocity * hh; }
        if (k !== target && st.mass <= 0.002 && st.outgoing <= 0.002 && Math.abs(st.scale) < 0.004 && Math.abs(st.velocity) < 0.05) pills.delete(k);
      });
      // the magnet: ease toward where the pointer pulls, back to centre when it lets go
      var kl = 1 - Math.exp(-dt / 0.09);
      lean.x += (lean.gx - lean.x) * kl; lean.y += (lean.gy - lean.y) * kl;
      links.forEach(function (l, j) {
        var on = lean.i === j, lx = on ? lean.x * 0.45 : 0, ly = on ? lean.y * 0.45 : 0;
        if ((l._lx || 0) !== lx || (l._ly || 0) !== ly) {
          l._lx = lx; l._ly = ly; var tf = lx || ly ? 'translate(' + lx.toFixed(2) + 'px,' + ly.toFixed(2) + 'px)' : '';
          l.style.transform = tf; if (twins[j]) twins[j].style.transform = tf;
        }
      });
      // the faint capsule: the section you are in, while the white one is somewhere else
      var gi = GOO.hoverEffect && active >= 0 && active !== target ? active : -1;
      if (gi >= 0 && rects[gi]) {
        var r = rects[gi], kg = ghost.alpha < 0.01 ? 1 : 1 - Math.exp(-dt / 0.06);
        ghost.x += (r.x + r.w / 2 - ghost.x) * kg; ghost.y += (r.y + r.h / 2 - ghost.y) * kg; ghost.w += (r.w - ghost.w) * kg; ghost.h += (r.h - ghost.h) * kg;
      }
      ghost.alpha += ((gi >= 0 ? 1 : 0) - ghost.alpha) * (1 - Math.exp(-dt / 0.08));
      render();
      var host2 = pills.get(target), moving = drops.length > 0 || Math.abs(lean.gx - lean.x) + Math.abs(lean.gy - lean.y) > 0.05 || Math.abs((gi >= 0 ? 1 : 0) - ghost.alpha) > 0.003;
      pills.forEach(function (st) { if (Math.abs(st.mass - st.scale) > 0.0008 || Math.abs(st.velocity) > 0.004) moving = true; });
      if (target < 0 && pills.size) moving = true;
      if (moving && !dead) raf = requestAnimationFrame(frame);
      else if (host2) { host2.mass = host2.scale = 1; host2.velocity = 0; render(); }
    }
    function wake() { if (raf || dead) return; last = performance.now(); raf = requestAnimationFrame(frame); }

    function settle(i) {
      pills.clear(); drops.length = 0; target = i;
      if (i >= 0) { var st = pill(i); st.mass = st.scale = 1; st.velocity = 0; }
      render();
    }
    function go(i) {
      if (i === target) return;
      if (still) { settle(i); return; }
      var now = performance.now(), had = target;
      target = i;
      if (i < 0) {   // nothing to rest on: the liquid melts away where it is
        pills.forEach(function (st) { st.mass = 0; st.outgoing = 0; });
        drops.forEach(function (d) { d.index = -1; if (d.state !== 'absorbing') { d.state = 'absorbing'; } });
        wake(); return;
      }
      var live = 0; pills.forEach(function (st) { live += st.mass; });
      if (had < 0 || live < 0.05) {   // from nothing: the capsule wells up out of the link
        drops.length = 0; pills.forEach(function (st) { st.mass = 0; st.outgoing = 0; });
        pill(i).mass = 1; wake(); return;
      }
      pill(i);
      drops.forEach(function (d) {
        d.index = i;
        if (d.state === 'flying') plan(d, i, now, false);
        if (d.state === 'absorbing') { d.state = 'flying'; d.mass *= 1 - d.absorbed; d.absorbed = 0; plan(d, i, now, false); }
      });
      Array.from(pills.keys()).forEach(function (from) { if (from !== i) emit(from, i, now); });
      wake();
    }
    function rest() { return hoverI >= 0 ? hoverI : active; }

    // the section on screen, from the links that point into this page
    function spy() {
      var mid = (window.innerHeight || 800) * 0.35, found = -1;
      spots.forEach(function (s) { var r = s.el.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) found = s.i; });
      if (found !== active) {
        active = found;
        // phones: the links are a row you swipe; bring the section's link into view so its capsule can be seen
        var a = links[found];
        if (a && hoverI < 0 && nav.scrollWidth > nav.clientWidth + 1) {
          var to = clamp(a.offsetLeft - (nav.clientWidth - a.offsetWidth) / 2, 0, nav.scrollWidth - nav.clientWidth);
          if (Math.abs(to - nav.scrollLeft) > 2) nav.scrollTo({ left: to, behavior: still ? 'auto' : 'smooth' });
        }
        if (hoverI < 0) go(rest()); else wake();
      }
    }
    function findSpots() {
      spots = [];
      links.forEach(function (a, i) {
        var h = a.getAttribute('href') || '';
        if (h.length > 1 && h.charAt(0) === '#') { var el = document.getElementById(decodeURIComponent(h.slice(1))); if (el) spots.push({ i: i, el: el }); }
      });
    }

    function idx(e) { var a = e.target.closest && e.target.closest('a'); return a && a.parentNode === nav ? links.indexOf(a) : -1; }
    function over(e) { var i = idx(e); if (i < 0) return; hoverI = i; if (lean.i !== i) { lean.i = i; lean.x = lean.y = lean.gx = lean.gy = 0; } go(i); }
    function move(e) {
      if (!fine || still) return;
      var i = idx(e); if (i < 0 || !rects[i]) return;
      var r = rects[i], hb = head.getBoundingClientRect();
      lean.i = i;
      lean.gx = clamp((e.clientX - hb.left - (r.x + r.w / 2)) * 0.22, -9, 9);
      lean.gy = clamp((e.clientY - hb.top - (r.y + r.h / 2)) * 0.3, -5, 5);
      wake();
    }
    function leave() { hoverI = -1; lean.gx = lean.gy = 0; go(rest()); wake(); }
    function focusIn(e) { var i = idx(e); if (i >= 0) { hoverI = i; go(i); } }
    function focusOut(e) { if (!nav.contains(e.relatedTarget)) leave(); }

    var sraf = 0;
    function onScroll() { if (!sraf) sraf = requestAnimationFrame(function () { sraf = 0; spy(); }); }
    function refresh() { measure(); if (!drops.length) settle(target); else render(); wake(); }
    function relabel() { copyLabels(); findSpots(); refresh(); }
    function rowScroll() { measure(); render(); }

    copyLabels(); findSpots(); measure(); settle(-1); spy();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!dead) refresh(); });
    var ro = window.ResizeObserver ? new ResizeObserver(refresh) : null;
    if (ro) { ro.observe(head); ro.observe(nav); }
    var mo = new MutationObserver(function (ms) {
      // new labels (language switch); the bar's colour scheme (dark / light) changes the capsule colour
      if (ms.some(function (m) { return m.type !== 'attributes' && !ink.contains(m.target) && m.target !== ink; })) relabel();
      else { ink3 = rgbOf(links[0] && getComputedStyle(links[0]).color); render(); }
    });
    mo.observe(nav, { childList: true, subtree: true, characterData: true });
    mo.observe(head, { attributes: true, attributeFilter: ['class'] });
    nav.addEventListener('pointerover', over); nav.addEventListener('pointermove', move, { passive: true }); nav.addEventListener('pointerleave', leave);
    nav.addEventListener('focusin', focusIn); nav.addEventListener('focusout', focusOut); nav.addEventListener('scroll', rowScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', refresh);
    return function () {
      dead = true; if (raf) cancelAnimationFrame(raf); if (ro) ro.disconnect(); mo.disconnect();
      nav.removeEventListener('pointerover', over); nav.removeEventListener('pointermove', move); nav.removeEventListener('pointerleave', leave);
      nav.removeEventListener('focusin', focusIn); nav.removeEventListener('focusout', focusOut); nav.removeEventListener('scroll', rowScroll);
      window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', refresh);
      links.forEach(function (l) { l.style.transform = ''; l._lx = l._ly = 0; });
      canvas.remove(); ink.remove(); rim.remove(); head.classList.remove('msc-goo-on');
      gl.deleteBuffer(buf); gl.deleteProgram(prog);
    };
  }

  function navPill(nav) {
    if (!nav) return noop;
    return gooeyNav(nav) || plainPill(nav);
  }

  window.MSUI = { magnet: magnet, navPill: navPill };
})();
