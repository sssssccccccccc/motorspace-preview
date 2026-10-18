/* Motorspace gallery homepage: a second picture shown through a soft circle that follows the mouse.
   From motionsites「interactive-discovery」(主人 2026-10-18): the circle has the reference's radius (260) and its six
   steps of opacity, and eases after the cursor by a tenth a frame. As in the reference, only the circle under the mouse
   changes: no trail, nothing moves by itself, and the circle follows the cursor even when it is just outside, so it
   slides off the edges instead of popping (主人: 「人家那种是鼠标点到哪里，哪个地方就有一点点变化」).
   Without a mouse (phones, tablets) nobody could ever see the second picture, so there the circle wanders slowly
   across while the place is on screen, and a tap brings it to the finger.
   Used by branchfoot.js (the footer's rock grows moss and flowers).

   MSReveal(host, layer, opts)  host: the element the circle belongs to; layer: the picture to show (its mask is
   rewritten every frame, in its own px, so it should cover the host). opts: radius(w, h) -> px; band(w, h) -> [y0, y1]
   where the circle wanders on a touch screen. Returns { measure } to call when the band moves.
   Reduced motion: the circle sits at the cursor (or the finger) at once, and does not wander. */
(function () {
  'use strict';
  var mm = window.matchMedia ? function (q) { return window.matchMedia(q).matches; } : function () { return false; };
  var REDUCE = mm('(prefers-reduced-motion: reduce)'), FINE = mm('(hover: hover) and (pointer: fine)');
  var STOPS = [[0, 1], [0.4, 1], [0.6, 0.75], [0.75, 0.4], [0.88, 0.12], [1, 0]];
  var NONE = 'linear-gradient(transparent, transparent)';
  var FAR = -1e5;

  function grad(x, y, r) {
    var s = 'radial-gradient(circle ' + Math.max(1, r).toFixed(1) + 'px at ' + x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
    for (var i = 0; i < STOPS.length; i++) s += ',rgba(0,0,0,' + STOPS[i][1] + ') ' + (STOPS[i][0] * 100) + '%';
    return s + ')';
  }

  // one cursor for every circle on the page
  var cursor = { x: FAR, y: FAR, known: false }, all = [];
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    cursor.x = e.clientX; cursor.y = e.clientY;
    var first = !cursor.known; cursor.known = true;
    for (var i = 0; i < all.length; i++) all[i].follow(first);
  }, { passive: true });
  // the page moves under a still cursor while scrolling with the wheel
  window.addEventListener('scroll', function () {
    if (cursor.known) for (var i = 0; i < all.length; i++) all[i].follow(false);
  }, { passive: true });

  window.MSReveal = function (host, layer, o) {
    layer.style.webkitMaskImage = NONE; layer.style.maskImage = NONE;
    layer.style.webkitMaskRepeat = 'no-repeat'; layer.style.maskRepeat = 'no-repeat';
    var W = 0, H = 0, B = [0, 0], raf = 0, last = 0, visible = false, shown = '';
    var aim = { x: FAR, y: FAR }, head = { x: FAR, y: FAR };
    var wander = null, t0 = 0, tapUntil = 0;

    function measure() {
      var r = layer.getBoundingClientRect(); W = r.width; H = r.height; B = o.band(W, H);
      if (cursor.known) follow(false); else wake();
    }

    function frame(now) {
      raf = 0;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60; last = now;
      if (wander && now > tapUntil) { var p = wander((now - t0) / 1000); aim.x = p.x; aim.y = p.y; }
      if (REDUCE) { head.x = aim.x; head.y = aim.y; }
      else {
        var k = 1 - Math.pow(0.9, dt * 60);
        head.x += (aim.x - head.x) * k; head.y += (aim.y - head.y) * k;
      }
      var r = o.radius(W, H);
      var m = head.x > -r && head.x < W + r && head.y > -r && head.y < H + r ? grad(head.x, head.y, r) : NONE;
      if (m !== shown) { layer.style.webkitMaskImage = m; layer.style.maskImage = m; shown = m; }
      var moving = Math.abs(aim.x - head.x) > 0.2 || Math.abs(aim.y - head.y) > 0.2;
      if (visible && (moving || wander)) raf = requestAnimationFrame(frame);
    }
    function wake() { if (!raf && visible) { last = 0; raf = requestAnimationFrame(frame); } }

    function follow(first) {
      var r = layer.getBoundingClientRect();
      aim.x = cursor.x - r.left; aim.y = cursor.y - r.top;
      if (first) { head.x = aim.x; head.y = aim.y; }       // the first move puts it there, it does not fly in
      wake();
    }
    all.push({ follow: follow });

    // touch: a tap brings the circle to the finger for a while
    host.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      var r = layer.getBoundingClientRect();
      aim.x = e.clientX - r.left; aim.y = e.clientY - r.top;
      if (head.x === FAR) { head.x = aim.x; head.y = aim.y; }
      tapUntil = performance.now() + 2600; wake();
    }, { passive: true });

    // no mouse: wander slowly while it shows, so a phone sees the second picture too
    function startWander() {
      wander = function (t) { return { x: W * (0.5 + 0.36 * Math.sin(t * 0.31)), y: B[0] + (B[1] - B[0]) * (0.5 + 0.4 * Math.sin(t * 0.47 + 1.3)) }; };
      t0 = performance.now();
      var p = wander(0); head.x = p.x; head.y = p.y; wake();
    }

    var started = false;
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      visible = e.isIntersecting;
      if (visible && !started && !FINE && !REDUCE && (e.intersectionRatio >= 0.34 || e.intersectionRect.height > window.innerHeight * 0.45)) {
        started = true; measure(); startWander();
      }
      if (visible) { if (cursor.known) follow(false); wake(); }
    }, { threshold: [0, 0.35] }).observe(host);
    measure();
    window.addEventListener('resize', measure);
    return { measure: measure };
  };
})();
