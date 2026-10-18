/* MotorSpace · "hand-over" band for the gallery homepage prototype (styles in touch.css, pictures from
   dev/corridor/make_touch3d.py: img/touch-robot.webp, img/touch-human.webp, img/touch.json).
   window.MSTouch.mount(sectionEl, { base: 'corridor/' }) -> { destroy }
   - sectionEl holds a .mst-stage; the two hands are placed in it by touch.json (one shared frame)
   - once the hands are well in view they glide in slowly from both sides along their own reach (about 4 s) and stop
     with a small gap (as in the fresco); then a soft light comes on in it, slow rings go out and fine dust is drawn
     in (no rainbow halo: 主人 2026-10-17 不要彩虹光圈); it plays again after the band has left the screen
   - a mouse makes the hands lean towards it a little and, near the fingertips, makes the light stronger;
     a click or tap anywhere on the band sends out a ring and blows the dust outwards
   - the canvas only runs while the band is on screen; reduced motion shows the hands together, no canvas */
(function () {
  'use strict';
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function sstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function unit(x, y) { var l = Math.hypot(x, y) || 1; return [x / l, y / l]; }

  function mount(sec, opt) {
    opt = opt || {};
    var base = opt.base || 'corridor/', stage = sec.querySelector('.mst-stage');
    var dead = false, raf = 0, visible = false, io = null, offs = [];
    function on(t, ev, fn, o) { t.addEventListener(ev, fn, o); offs.push(function () { t.removeEventListener(ev, fn, o); }); }
    fetch(base + 'img/touch.json').then(function (r) { return r.json(); }).then(function (m) { if (!dead) build(m); });

    function build(m) {
      var FW = m.w, FH = m.h, TR = m.tips.robot, TH = m.tips.human;
      // the shadow sits on a wrapper: on the picture itself the arm's fade-out mask would cut it off at the picture's edges
      var pics = [];
      function hand(cls, d) {
        var el = document.createElement('div'), im = new Image();
        el.className = 'mst-hand ' + cls;
        el.style.left = (d.x / FW * 100) + '%'; el.style.top = (d.y / FH * 100) + '%'; el.style.width = (d.w / FW * 100) + '%';
        im.alt = ''; im.decoding = 'async'; im.draggable = false; im.width = d.w; im.height = d.h;
        im.src = base + 'img/' + d.file;
        el.appendChild(im); stage.appendChild(el); pics.push(im); return el;
      }
      var robot = hand('is-robot', m.robot), human = hand('is-human', m.human);
      var cv = document.createElement('canvas'); cv.className = 'mst-fx'; stage.appendChild(cv);
      var ctx = cv.getContext('2d');
      stage.style.aspectRatio = FW + ' / ' + FH;
      // each hand reaches along its own forearm (wrist -> fingertip, from the render); a rough guess for older files
      var dR = m.reach ? m.reach.robot : unit(TR[0] - m.robot.x, TR[1] - (m.robot.y + m.robot.h * 0.25));
      var dH = m.reach ? m.reach.human : unit(TH[0] - (m.human.x + m.human.w), TH[1] - (m.human.y + m.human.h * 0.55));
      // frame px: how far back each hand starts, and where it stops (negative: a little past its place in the render,
      // so the fingertips end up close, as in the fresco)
      var AWAY = FW * 0.3, GAP = -FW * 0.024;

      // the canvas runs well above and below the stage, so the rings going out are not cut off at its edges
      var W = 1, H = 1, s = 1, DPR = 1, PADY = 0;
      function layout() {
        W = stage.clientWidth; H = stage.clientHeight; s = W / FW;
        DPR = Math.min(2, window.devicePixelRatio || 1);
        PADY = Math.round(Math.max(H, 220) * 0.8);
        cv.style.top = -PADY + 'px'; cv.style.height = (H + 2 * PADY) + 'px';
        cv.width = Math.round(W * DPR); cv.height = Math.round((H + 2 * PADY) * DPR);
      }
      layout();
      if (window.ResizeObserver) { var ro = new ResizeObserver(layout); ro.observe(stage); offs.push(function () { ro.disconnect(); }); }
      else on(window, 'resize', layout);

      // the approach plays by itself (主人 2026-10-17: 两个手指要从两边慢慢靠近): it starts when most of the stage is on
      // screen, takes DUR seconds, eases in and out, and is reset once the whole band has left the screen
      var DUR = 4.2, played = REDUCE, t0 = 0, p = REDUCE ? 1 : 0;
      function readScroll() {
        if (REDUCE) return;
        var r = stage.getBoundingClientRect(), b = sec.getBoundingClientRect(), vh = window.innerHeight || 800;
        if (!played && r.top + r.height * 0.6 < vh && r.bottom > r.height * 0.4) { played = true; t0 = 0; }
        else if (played && (b.bottom < 0 || b.top > vh)) { played = false; p = 0; }
      }
      readScroll();
      on(window, 'scroll', function () { readScroll(); wake(); }, { passive: true });
      on(window, 'resize', function () { readScroll(); wake(); });

      // pointer, in stage px; ptr.k = how close it is to the fingertips (0..1)
      var ptr = { x: 0, y: 0, in: false, lx: 0, ly: 0 }, burst = 0;   // burst: 1 right after a click, fading
      function local(e) { var r = stage.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; }
      if (FINE && !REDUCE) {
        on(sec, 'pointermove', function (e) { local(e); ptr.in = true; wake(); }, { passive: true });
        on(sec, 'pointerleave', function () { ptr.in = false; });
      }
      on(sec, 'pointerdown', function (e) {
        if (REDUCE) return;
        local(e); burst = 1;
        rings.push({ t: 0, life: 2.2, big: 1.35 }); rings.push({ t: -0.22, life: 2.2, big: 1.1 });
        for (var i = 0; i < motes.length; i++) motes[i].v = 0.7 + Math.random() * 0.7;   // the dust blows outwards, then drifts back
        wake();
      });

      // the light where they almost touch: a breathing core with a thin lens streak, slow rings going out like a
      // signal, and fine dust drawn in towards the gap in a slow spiral (no lightning: 主人 2026-10-17 不喜欢闪电)
      var motes = [], rings = [], ringT = 0.8, clock = 0, last = 0, mid = { x: 0, y: 0 };
      function mote(spread) {
        return { a: Math.random() * 6.283, d: spread ? 0.12 + Math.random() * 0.88 : 0.85 + Math.random() * 0.3,
          w: (0.18 + Math.random() * 0.4) * (Math.random() < 0.5 ? -1 : 1), z: 0.5 + Math.random() * Math.random() * 1.6,
          tw: Math.random() * 6.283, warm: Math.random() < 0.62, v: 0 };
      }
      for (var i = 0; i < 70; i++) motes.push(mote(true));

      function frame(now) {
        raf = 0;
        var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016; last = now; clock += dt;
        if (played && !REDUCE) { if (!t0) t0 = now; p = clamp((now - t0) / 1000 / DUR, 0, 1); }
        var e = 0.5 - 0.5 * Math.cos(Math.PI * p), near = 0;
        // lean towards the mouse, breathe a little
        var lx = 0, ly = 0;
        if (ptr.in) { lx = clamp((ptr.x - W / 2) / (W / 2), -1, 1); ly = clamp((ptr.y - H / 2) / (H / 2), -1, 1); }
        ptr.lx += (lx - ptr.lx) * (1 - Math.exp(-dt * 4)); ptr.ly += (ly - ptr.ly) * (1 - Math.exp(-dt * 4));
        var bob = REDUCE ? 0 : Math.sin(clock * 0.9) * 3;
        var back = (GAP + AWAY * (1 - e)) * s;
        var rx = -dR[0] * back + ptr.lx * 10 + bob * 0.4, ry = -dR[1] * back + ptr.ly * 6 + bob;
        var hx = -dH[0] * back + ptr.lx * 6 - bob * 0.3, hy = -dH[1] * back + ptr.ly * 4 - bob * 0.6;
        robot.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
        human.style.transform = 'translate3d(' + hx.toFixed(1) + 'px,' + hy.toFixed(1) + 'px,0)';
        mid.x = (TR[0] * s + rx + TH[0] * s + hx) / 2; mid.y = (TR[1] * s + ry + TH[1] * s + hy) / 2;
        var K = Math.max(0.55, W / 1180);                 // effect size follows the stage
        if (ptr.in) near = 1 - sstep(60 * K, 320 * K, Math.hypot(ptr.x - mid.x, ptr.y - mid.y));
        burst = Math.max(0, burst - dt * 1.2);
        var live = sstep(0.82, 1, p);                    // the light only comes on as the hands arrive

        ctx.setTransform(DPR, 0, 0, DPR, 0, PADY * DPR);
        ctx.clearRect(0, -PADY, W, H + 2 * PADY);
        if (!REDUCE && live > 0.01) {
          ctx.globalCompositeOperation = 'lighter';
          var breath = 0.5 + 0.5 * Math.sin(clock * 2.1);
          // rings going out, now and then (more often with the mouse near)
          ringT -= dt * (1 + near * 0.8);
          if (ringT <= 0) { ringT = 2.6; rings.push({ t: 0, life: 2.8, big: 1 }); }
          for (i = rings.length - 1; i >= 0; i--) {
            var rg = rings[i]; rg.t += dt;
            if (rg.t > rg.life) { rings.splice(i, 1); continue; }
            if (rg.t < 0) continue;
            var u = rg.t / rg.life, rr = (10 + 300 * rg.big * (1 - Math.pow(1 - u, 3))) * K;
            ctx.strokeStyle = 'rgba(255,226,200,' + (0.42 * Math.pow(1 - u, 1.6) * live * rg.big).toFixed(3) + ')';
            ctx.lineWidth = (1.4 - u) * K;
            ctx.beginPath(); ctx.ellipse(mid.x, mid.y, rr, rr * 0.94, 0, 0, Math.PI * 2); ctx.stroke();
          }
          // dust spiralling in; it fades out at the centre and comes back at the edge
          var RM = 210 * K;
          for (i = 0; i < motes.length; i++) {
            var m = motes[i];
            m.v += ((-0.07 - 0.08 * near) - m.v) * (1 - Math.exp(-dt * 1.6));
            m.d += m.v * dt; m.a += m.w * dt * (1.2 - m.d * 0.6);
            if (m.d < 0.04) { motes[i] = m = mote(false); }
            var fade = sstep(0.04, 0.18, m.d) * (1 - sstep(0.95, 1.35, m.d));
            var tw = 0.55 + 0.45 * Math.sin(clock * 2.6 + m.tw);
            var mx = mid.x + Math.cos(m.a) * m.d * RM, my = mid.y + Math.sin(m.a) * m.d * RM * 0.62;
            var al = fade * tw * live * (0.5 + 0.5 * near + 0.4 * burst);
            if (al < 0.01) continue;
            var col = m.warm ? '255,222,190' : '206,190,255';
            ctx.fillStyle = 'rgba(' + col + ',' + (0.16 * al).toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(mx, my, m.z * 3.2 * K, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(' + col + ',' + (0.9 * al).toFixed(3) + ')';
            ctx.beginPath(); ctx.arc(mx, my, m.z * 0.9 * K, 0, Math.PI * 2); ctx.fill();
          }
          // the core, and a thin horizontal streak through it like a lens flare
          // kept soft (主人 2026-10-17: 中间那个光太亮了，暗一点)
          var cr = (13 + 8 * near + 28 * burst + 2 * breath) * K;
          var g = ctx.createRadialGradient(mid.x, mid.y, 0, mid.x, mid.y, cr);
          g.addColorStop(0, 'rgba(255,246,236,' + (0.48 * live) + ')'); g.addColorStop(0.3, 'rgba(255,210,172,' + (0.22 * live) + ')');
          g.addColorStop(1, 'rgba(180,140,255,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mid.x, mid.y, cr, 0, Math.PI * 2); ctx.fill();
          var sw = (115 + 40 * near + 120 * burst) * K;
          ctx.save(); ctx.translate(mid.x, mid.y); ctx.scale(1, 0.022);
          var st = ctx.createRadialGradient(0, 0, 0, 0, 0, sw);
          st.addColorStop(0, 'rgba(255,240,226,' + ((0.24 + 0.06 * breath) * live) + ')'); st.addColorStop(0.5, 'rgba(214,190,255,' + (0.08 * live) + ')');
          st.addColorStop(1, 'rgba(214,190,255,0)');
          ctx.fillStyle = st; ctx.beginPath(); ctx.arc(0, 0, sw, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        ctx.globalCompositeOperation = 'source-over';
        // the light keeps breathing while the band is on screen; otherwise stop once the hands have settled
        var busy = (played && p < 1) || live > 0.01 || ptr.in;
        if (visible && busy && !REDUCE) raf = requestAnimationFrame(frame);
      }
      function wake() { if (!raf && visible && !dead) { last = 0; raf = requestAnimationFrame(frame); } }
      if (window.IntersectionObserver) {
        io = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) { readScroll(); wake(); } }, { rootMargin: '80px 0px' });
        io.observe(sec);
      } else { visible = true; wake(); }
      if (REDUCE) { visible = true; requestAnimationFrame(frame); }
      Promise.all(pics.map(function (im) { return im.decode ? im.decode().catch(function () {}) : null; })).then(function () { layout(); wake(); });
    }

    return { destroy: function () { dead = true; if (raf) cancelAnimationFrame(raf); if (io) io.disconnect(); offs.forEach(function (f) { f(); }); stage.innerHTML = ''; } };
  }
  window.MSTouch = { mount: mount };
})();
