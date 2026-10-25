/* MotorSpace · motion layer for the gallery homepage prototype (主人 2026-10-17: 1 到 6 都做).
   window.MSMotion.init({ base, cut, carUrls }) after the page has rendered; returns destroy().
   1 journey   the China -> Poland route is a top-down aerial strip with a container train that keeps running left to
               right on its own (Blender renders, make_freight.py); its headlight glows ahead, mist drifts over the ground,
               the stops light up as it passes
   2 torch     on a mouse, a soft light follows the pointer over the page background and shows a faint floor grid
   3 tilt      the order cases and the stock cards lean toward the pointer, the car inside shifts a little the other way
               and a highlight follows the pointer (replaces the site's small 3-5 degree glare tilt)
   4 numbers   the stats row rolls in slower and one after another, with a light passing over each number
   5 wordmark  the big MOTORSPACE at the bottom fills from outline to solid as you reach the end of the page
   6 car pages a link marked [data-car-link] names the photo it came from (view-transition-name), so on browsers with
               cross-document View Transitions the photo grows into the car page's hero instead of a hard cut
   No libraries. Reduced motion: everything sits in its final state. */
(function () {
  'use strict';
  var mm = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  var REDUCE = mm('(prefers-reduced-motion: reduce)'), FINE = mm('(hover: hover) and (pointer: fine)');
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var NS = 'http://www.w3.org/2000/svg';
  function noop() {}

  // ---- 1 · the journey: a container train crossing a top-down aerial strip, China on the left, Poland on the right ----
  // (主人 2026-10-17: 参考 motionsites logistics-freight，12–16 周那条线改成这种，火车横向; then 火车更真、大一点点、
  // 不跟着滚动，自己一直开). The ground, the train and the mist are renders (blender/freight.py, make_freight.py). The
  // train runs on its own at a steady pace, leaves on the right and comes back in from the left; each stop lights up as
  // the locomotive passes it and they all go dark again for the next run. The week counter and the four steps under it
  // still follow the scroll (the site's own journey).
  var ZOOM = 1.2;      // the strip shows the ground a little closer than rendered: a bigger train, the same proportions
  var SPEED = 13;      // metres per second (about 47 km/h)
  function journey(root, o) {
    var sec = root.querySelector('.kt-journey'), F = o.cut && o.cut.freight; if (!sec || !F) return noop;
    var track = sec.querySelector('.kt-journey-track');
    if (!track) return noop;
    var dir = o.base + 'img/freight/';
    var band = document.createElement('div'); band.className = 'mfr'; band.setAttribute('aria-hidden', 'true');
    band.innerHTML = '<div class="mfr-ground"></div><div class="mfr-beam"></div><img class="mfr-train" alt="" decoding="async" draggable="false">' +
      '<div class="mfr-mist"></div><div class="mfr-mist mfr-mist-2"></div><div class="mfr-shade"></div>';
    band.querySelector('.mfr-ground').style.backgroundImage = 'url("' + dir + 'terrain.webp")';
    Array.prototype.forEach.call(band.querySelectorAll('.mfr-mist'), function (m) { m.style.backgroundImage = 'url("' + dir + 'mist.webp")'; });
    var train = band.querySelector('.mfr-train'), beam = band.querySelector('.mfr-beam');
    train.src = dir + 'train.webp';
    track.insertBefore(band, track.firstChild);
    sec.classList.add('mfr-on');
    track.style.setProperty('--mfr-zoom', ZOOM);
    // live list, and a data attribute rather than a class: the journey component re-renders its stops and rewrites their class
    var stops = sec.getElementsByClassName('kt-stop');
    function lit(fn) { Array.prototype.forEach.call(stops, fn); }
    var GROUND = F.terrain.h / F.ppm, TW = F.train.w / F.ppm, TH = F.train.h / F.ppm;   // metres: strip depth, train image
    var raf = 0, vis = true, io = null, prev = 0;
    var m = REDUCE ? null : -6;   // metres the nose has come in past the left edge (starts just out of sight)
    function frame(now) {
      raf = 0;
      var w = track.clientWidth, h = track.clientHeight, ppm = h / GROUND * ZOOM, tw = TW * ppm, th = TH * ppm;
      var dt = prev ? Math.min(0.05, (now - prev) / 1000) : 0; prev = now;
      if (m === null) m = w * 0.62 / ppm;                 // reduced motion: parked a little past the middle
      else if (!REDUCE) {
        m += SPEED * dt;
        if ((m - TW) * ppm > w + 2 * ppm) { m = -6; lit(function (s) { s.removeAttribute('data-mfr-lit'); }); }   // gone: next run
      }
      var x = m * ppm;
      train.style.width = tw.toFixed(1) + 'px'; train.style.height = th.toFixed(1) + 'px';
      // the picture has a metre of room in front of the nose
      train.style.transform = 'translate3d(' + (x - tw + ppm).toFixed(1) + 'px,' + ((h - th) / 2).toFixed(1) + 'px,0)';
      beam.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + (h / 2).toFixed(1) + 'px,0)';
      lit(function (s) { if (!s.hasAttribute('data-mfr-lit') && s.offsetLeft <= x) s.setAttribute('data-mfr-lit', ''); });
      track.style.setProperty('--mfr-ppm', ppm.toFixed(3));
      track.style.setProperty('--mfr-h', h + 'px');
      if (vis && !REDUCE) raf = requestAnimationFrame(frame);
    }
    if (window.IntersectionObserver) {
      io = new IntersectionObserver(function (es) { vis = es[0].isIntersecting; prev = 0; if (vis && !raf) raf = requestAnimationFrame(frame); }, { rootMargin: '120px 0px' });
      io.observe(sec);
    }
    function resize() { if (!raf) frame(performance.now()); }
    window.addEventListener('resize', resize);
    train.addEventListener('load', resize);
    raf = requestAnimationFrame(frame);
    return function () {
      if (raf) cancelAnimationFrame(raf); if (io) io.disconnect(); window.removeEventListener('resize', resize);
      lit(function (s) { s.removeAttribute('data-mfr-lit'); });
      band.remove(); sec.classList.remove('mfr-on');
    };
  }

  // ---- 2 · the torch: a light behind the page that follows the mouse ----
  function torch() {
    if (!FINE || REDUCE) return noop;
    var el = document.createElement('div'); el.className = 'mfx-torch'; el.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(el, document.body.firstChild);
    document.documentElement.classList.add('mfx-has-torch');
    var x = -1000, y = -1000, tx = x, ty = y, on = 0, ton = 0, raf = 0;
    function frame() {
      raf = 0;
      x += (tx - x) * 0.16; y += (ty - y) * 0.16; on += (ton - on) * 0.08;
      el.style.setProperty('--x', x.toFixed(1) + 'px'); el.style.setProperty('--y', y.toFixed(1) + 'px'); el.style.opacity = on.toFixed(3);
      if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3 || Math.abs(ton - on) > 0.004) raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    function move(e) {
      if (x < -900) { x = e.clientX; y = e.clientY; }
      tx = e.clientX; ty = e.clientY;
      // the hero has its own lights; the torch rests while the pointer is over it
      ton = e.target && e.target.closest && e.target.closest('.msc') ? 0 : 1; kick();
    }
    function leave() { ton = 0; kick(); }
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return function () {
      window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave);
      if (raf) cancelAnimationFrame(raf); el.remove(); document.documentElement.classList.remove('mfx-has-torch');
    };
  }

  // ---- 3 · tilt: cards lean toward the pointer, the car shifts against it, a highlight follows ----
  function tilt(root) {
    if (!FINE || REDUCE) return noop;
    var MAX = 7, cards = [], offs = [];
    function bind(el) {
      if (el.__mfxTilt) return; el.__mfxTilt = true;
      var spec = document.createElement('span'); spec.className = 'mfx-spec'; spec.setAttribute('aria-hidden', 'true'); el.appendChild(spec);
      var s = { rx: 0, ry: 0, gx: 50, gy: 30, trx: 0, try_: 0, tgx: 50, tgy: 30, raf: 0, over: false };
      function frame() {
        s.raf = 0;
        s.rx += (s.trx - s.rx) * 0.14; s.ry += (s.try_ - s.ry) * 0.14; s.gx += (s.tgx - s.gx) * 0.2; s.gy += (s.tgy - s.gy) * 0.2;
        el.style.setProperty('--mrx', s.rx.toFixed(2) + 'deg'); el.style.setProperty('--mry', s.ry.toFixed(2) + 'deg');
        el.style.setProperty('--mpx', (s.ry / MAX).toFixed(3)); el.style.setProperty('--mpy', (-s.rx / MAX).toFixed(3));
        el.style.setProperty('--mgx', s.gx.toFixed(1) + '%'); el.style.setProperty('--mgy', s.gy.toFixed(1) + '%');
        var busy = Math.abs(s.trx - s.rx) + Math.abs(s.try_ - s.ry) > 0.02;
        if (busy || s.over) s.raf = requestAnimationFrame(frame);
        else if (!s.over) el.classList.remove('mfx-tilt');
      }
      function kick() { if (!s.raf) s.raf = requestAnimationFrame(frame); }
      function move(e) {
        if (el.classList.contains('is-open')) return;
        var r = el.getBoundingClientRect(), nx = clamp((e.clientX - r.left) / r.width, 0, 1), ny = clamp((e.clientY - r.top) / r.height, 0, 1);
        s.over = true; s.trx = (0.5 - ny) * MAX; s.try_ = (nx - 0.5) * MAX; s.tgx = nx * 100; s.tgy = ny * 100;
        el.classList.add('mfx-tilt'); kick();
      }
      function leave() { s.over = false; s.trx = 0; s.try_ = 0; kick(); }
      // a stock card sits under its car-page link, so the wrapper hears the pointer for both
      var host = el.closest('.mfx-stocklink') || el;
      host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
      cards.push(el);
      offs.push(function () { host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); if (s.raf) cancelAnimationFrame(s.raf); spec.remove(); el.classList.remove('mfx-tilt'); el.__mfxTilt = false; });
    }
    function scan() { Array.prototype.forEach.call(root.querySelectorAll('.kt-box, .kt-stock'), bind); }
    scan();
    var mo = new MutationObserver(scan); mo.observe(root, { childList: true, subtree: true });
    return function () { mo.disconnect(); offs.forEach(function (f) { f(); }); };
  }

  // ---- the car-page link over a stock card covers the photo and the name, never the buttons ----
  function stockLinks(root) {
    var raf = 0;
    function fit() {
      raf = 0;
      Array.prototype.forEach.call(root.querySelectorAll('.mfx-stocklink'), function (w) {
        var act = w.querySelector('.kt-stock-actions'), a = w.querySelector('.mfx-stocklink-a');
        if (act && a) a.style.bottom = Math.max(0, w.getBoundingClientRect().bottom - act.getBoundingClientRect().top + 6) + 'px';
      });
    }
    function on() { if (!raf) raf = requestAnimationFrame(fit); }
    fit(); window.addEventListener('resize', on);
    var ro = window.ResizeObserver ? new ResizeObserver(on) : null;
    if (ro) Array.prototype.forEach.call(root.querySelectorAll('.mfx-stocklink'), function (w) { ro.observe(w); });
    return function () { window.removeEventListener('resize', on); if (ro) ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }

  // ---- 4 · the stats: roll in one after another, then a light passes over the numbers ----
  function stats(root) {
    var row = root.querySelector('.kt-stats'); if (!row) return noop;
    row.classList.add('mfx-stats');
    if (REDUCE || !window.IntersectionObserver) { row.classList.add('mfx-in'); return noop; }
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { row.classList.add('mfx-in'); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(row);
    return function () { io.disconnect(); row.classList.remove('mfx-stats', 'mfx-in'); };
  }

  // ---- 5 · the wordmark at the bottom fills in as the page ends ----
  function wordmark(root) {
    var marks = Array.prototype.slice.call(root.querySelectorAll('.kt-footer-mark'));
    if (!marks.length) return noop;
    marks.forEach(function (mark) {
      mark.classList.add('mfx-mark');
      if (mark.querySelector('img')) mark.classList.add('mfx-image');
      else mark.setAttribute('data-word', mark.textContent);
    });
    function fill(p) { marks.forEach(function (mark) { mark.style.setProperty('--fill', p); }); }
    if (REDUCE) { fill(1); return noop; }
    var raf = 0;
    function frame() {
      raf = 0;
      var r = (marks[0].closest('footer') || marks[0]).getBoundingClientRect(), vh = window.innerHeight || 800, y = window.scrollY;
      // 0 when the footer comes up from the bottom of the screen, 1 when the page can scroll no further
      var start = y + r.top - vh, end = document.documentElement.scrollHeight - vh;
      var p = end > start + 1 ? clamp((y - start) / (end - start), 0, 1) : 1;
      fill(p.toFixed(3));
    }
    function on() { if (!raf) raf = requestAnimationFrame(frame); }
    window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on); frame();
    return function () { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); marks.forEach(function (mark) { mark.classList.remove('mfx-mark', 'mfx-image'); }); };
  }

  // ---- 6 · the photo a car link came from grows into the car page (cross-document View Transitions) ----
  function carLinks() {
    function click(e) {
      var a = e.target.closest && e.target.closest('a[data-car-link]');
      if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
      clear();
      var from = a.getAttribute('data-car-link'), ph = from ? document.querySelector(from) : null;
      if (ph) ph.style.viewTransitionName = 'ms-car';
    }
    function clear() { Array.prototype.forEach.call(document.querySelectorAll('[style*="view-transition-name"]'), function (n) { if (n.style.viewTransitionName === 'ms-car') n.style.viewTransitionName = ''; }); }
    function back(e) { if (e.persisted) clear(); }
    document.addEventListener('click', click); window.addEventListener('pageshow', back);
    return function () { document.removeEventListener('click', click); window.removeEventListener('pageshow', back); };
  }

  // ---- an opened case: the drawn car takes the colour picked under it (the case itself keeps its own paint) ----
  function paints(root, o) {
    var P = o.cut && o.cut.paints; if (!P || !window.MutationObserver) return noop;
    function sync() {
      Array.prototype.forEach.call(root.querySelectorAll('.kt-order'), function (sec) {
        var img = sec.querySelector('.kt-order-bay img.kt-car-photo'), sw = sec.querySelectorAll('.kt-swatch'), i = 0;
        if (!img || !/\/car\/box-/.test(img.src) || sw.length !== P.length) return;
        for (var k = 0; k < sw.length; k++) if (sw[k].getAttribute('aria-pressed') === 'true') i = k;
        var src = new URL(o.base + 'img/' + P[i], location.href).href;
        if (img.src !== src) img.src = src;
      });
    }
    var mo = new MutationObserver(sync);
    mo.observe(root === document ? document.body : root, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-pressed', 'src'] });
    sync();
    return function () { mo.disconnect(); };
  }

  window.MSMotion = {
    init: function (o) {
      o = o || {}; var root = o.root || document;
      var offs = [journey(root, o), torch(), tilt(root), stockLinks(root), stats(root), wordmark(root), carLinks(), paints(root, o)];
      return function () { offs.forEach(function (f) { f(); }); };
    }
  };
})();
