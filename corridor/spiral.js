/* Motorspace gallery homepage, About: the particle paragraph on the left half, and on the right our cars climbing an
   endless spiral staircase.
   主人 2026-10-18 (React Bits「Infinite Spiral」screenshot + its usage code): 「我给你的代码应该是像它这样可以环。像那种
   旋转楼梯一样，网上不停的旋转的那种代码才对啊……我想的是那个图片里面放车，然后就跟代码一样这样循环往上」
   A plain-script port of React Bits' InfiniteSpiral (reactbits.dev/components/infinite-spiral, MIT + Commons Clause;
   its source is kept in dev/corridor/src/reference-infinite-spiral.txt), with 主人's settings: animationMode "all",
   speed 0.55, radius 170, cards 100 x 100, vertical spacing 60, perspective 1000, card radius 10, centre scale 1.2,
   edge blur 6, 7 cards a turn, pause on hover; the rest at its defaults (up, edge fade 0.3, cover, in colour), in a
   box 600 px high as in its example. The maths per frame is the original's: each card sits at an offset from the
   moving progress, wrapped round the list; its angle on the helix, its depth scale, its fade and blur near the ends.
   The cards are ten of our car photos (img/spiral/, make_spiral.py), each a link to that car's page.
   Moves: by itself (up, 0.55 cards a second, easing to a stop under the mouse), with the page's scroll, and by dragging
   with a mouse. A finger on it still scrolls the page (the original takes vertical touch drags for itself, which would
   trap a phone visitor in a 600 px box); the scroll turns the spiral anyway. Reduced motion: no motion by itself.
   React owns the About heading: the box is appended to it and placed with CSS grid (it replaced the lit-car panel, removed 2026-10-18). */
(function () {
  'use strict';
  var me = document.currentScript && document.currentScript.src;
  var IMG = me ? new URL('img/spiral/', me).href : '/corridor/img/spiral/';
  var DIR = /\/(en|zh)\/[^/]*$/.test(location.pathname) ? 'cars/' : 'auta/';
  var O = {
    speed: 0.55, direction: 'up', mode: 'all', radius: 170, cardWidth: 100, cardHeight: 100, verticalSpacing: 60,
    perspective: 1000, cardsPerTurn: 7, rotation: 0, cardTilt: 0, cardRadius: 10, centerScale: 1.2, edgeFade: 0.3,
    edgeBlur: 6, pauseOnHover: true, imageFit: 'cover', grayscale: 0
  };
  var CARS = [["xiaomi-su7", "xiaomi-su7", "Xiaomi SU7"], ["zeekr-9x", "zeekr-9x", "Zeekr 9X"], ["denza-z9gt", "denza-z9gt", "Denza Z9GT"], ["li-auto-l9", "li-auto-l9", "Li Auto L9"], ["xiaomi-yu7", "xiaomi-yu7", "Xiaomi YU7"], ["lynk-900", "lynk-900", "Lynk & Co 900"], ["xpeng-p7-plus", "xpeng-p7-plus", "Xpeng P7+"], ["mercedes-eqs-53", "mercedes-eqs-53", "Mercedes-AMG EQS 53 4MATIC+"], ["zeekr-001", "zeekr-001", "Zeekr 001"], ["fangchengbao-bao5", "fangchengbao-bao5", "Fang Cheng Bao (BYD) Bao 5"]];

  var css = document.createElement('style');
  css.textContent =
    // the label and the paragraph sit in the middle of the spiral's height
    '.kt-about-head[data-msp]{grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:1fr auto auto 1fr;column-gap:clamp(32px,4.5vw,80px)}' +
    '.kt-about-head[data-msp]>.kt-label{grid-column:1;grid-row:2}' +
    '.kt-about-head[data-msp]>.kt-sw{grid-column:1;grid-row:3;max-width:none;font-size:clamp(24px,2.5vw,38px);line-height:1.14}' +
    '.msp{grid-column:2;grid-row:1/-1;position:relative;z-index:2;width:100%;height:600px;overflow:hidden;isolation:isolate;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:pan-y}' +
    '.msp.is-drag{cursor:grabbing}' +
    '.msp-stage{position:absolute;inset:0;transform-style:preserve-3d;margin:0;padding:0;list-style:none}' +
    '.msp-item{position:absolute;top:50%;left:50%;display:block;overflow:hidden;border:1px solid rgb(255 255 255/.24);background:rgb(255 255 255/.08);' +
    'box-shadow:0 14px 38px rgb(8 6 18/.2);transform-style:preserve-3d;backface-visibility:hidden;will-change:transform,opacity,filter;text-decoration:none;-webkit-user-drag:none}' +
    '.msp-item img{position:absolute;inset:0;display:block;width:100%;height:100%;max-width:none;max-height:none;object-position:center;user-select:none;-webkit-user-drag:none}' +
    '.msp-item:focus-visible{outline:2px solid var(--ink,#f5f5f7);outline-offset:3px}' +
    // tablets and phones: the spiral goes under the paragraph, full width
    '@media (max-width:900px){.kt-about-head[data-msp]{grid-template-columns:minmax(0,1fr);grid-template-rows:none}' +
    '.kt-about-head[data-msp]>.kt-label{grid-row:1}.kt-about-head[data-msp]>.kt-sw{grid-row:2;font-size:clamp(24px,3.6vw,30px)}' +
    '.msp{grid-column:1;grid-row:3;margin-top:12px}}';
  document.head.appendChild(css);

  var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
  var modulo = function (v, d) { return ((v % d) + d) % d; };
  var smoothstep = function (a, b, v) { var x = clamp((v - a) / (b - a || 1), 0, 1); return x * x * (3 - 2 * x); };
  var REDUCE = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  function make(head) {
    head.setAttribute('data-msp', '');
    var root = document.createElement('div'); root.className = 'msp';
    root.style.perspective = O.perspective + 'px';
    var stage = document.createElement('ul'); stage.className = 'msp-stage';
    stage.setAttribute('aria-label', document.documentElement.lang === 'zh' ? '我们的车' : document.documentElement.lang === 'en' ? 'Our cars' : 'Nasze auta');
    var cards = CARS.map(function (c, i) {
      var li = document.createElement('li'); li.style.display = 'contents';
      var a = document.createElement('a'); a.className = 'msp-item'; var K = window.Kontener, car = K && K.SAMPLE_LISTINGS.find(function (x) { return x.id === c[0]; });
      a.href = car ? K.effectHref(car, document.documentElement.lang || 'pl') : DIR + c[1] + '.html';
      a.setAttribute('aria-label', c[2]); a.title = c[2]; a.draggable = false;
      a.style.width = O.cardWidth + 'px'; a.style.height = O.cardHeight + 'px'; a.style.borderRadius = O.cardRadius + 'px';
      var im = document.createElement('img'); im.src = IMG + c[0] + '.webp'; im.alt = c[2]; im.draggable = false;
      im.loading = i < 6 ? 'eager' : 'lazy'; im.decoding = 'async';
      im.style.objectFit = O.imageFit; im.style.filter = 'grayscale(' + clamp(O.grayscale, 0, 1) + ')';
      a.appendChild(im); li.appendChild(a); stage.appendChild(li);
      return a;
    });
    root.appendChild(stage); head.appendChild(root);

    var progress = 0, target = 0, autoSpeed = 0, hovered = false, visible = false, dragging = false, lastY = 0, moved = false;
    var frame = 0, prev = 0, bounds = root.getBoundingClientRect(), lastScroll = window.scrollY;
    var scrollOn = O.mode === 'scroll' || O.mode === 'all', autoOn = O.mode === 'auto' || O.mode === 'all', dragOn = O.mode === 'drag' || O.mode === 'all';
    var scrollMul = Math.max(O.speed, 0) / 0.55;

    if (window.ResizeObserver) new ResizeObserver(function () { bounds = root.getBoundingClientRect(); }).observe(root);
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      if (visible && !frame) { prev = performance.now(); frame = requestAnimationFrame(render); }
    }, { threshold: 0.02 }).observe(root);
    window.addEventListener('scroll', function () {
      var y = window.scrollY, d = y - lastScroll; lastScroll = y;
      if (!scrollOn || !visible || d === 0) return;
      target += clamp((d * scrollMul) / Math.max(O.verticalSpacing * 2, 1), -1.5, 1.5);
    }, { passive: true });

    function render(time) {
      var delta = Math.min((time - prev) / 1000, 0.05); prev = time;
      var paused = dragging || (O.pauseOnHover && hovered);
      var want = autoOn && visible && !REDUCE.matches && !paused ? O.speed * (O.direction === 'down' ? -1 : 1) : 0;
      autoSpeed += (want - autoSpeed) * (1 - Math.exp(-delta * 7));
      target += autoSpeed * delta;
      progress += (target - progress) * (1 - Math.exp(-delta * (dragging ? 22 : 11)));

      var count = cards.length, half = count / 2;
      var width = Math.max(bounds.width, 1), height = Math.max(bounds.height, 1);
      var fit = Math.min(1, width / (O.cardWidth * 2.8), height / (O.cardHeight * 2.35));
      // the original's radius, but never so wide that a card at the side is cut by the box (phones only; 170 on a computer)
      var R = Math.min(O.radius, Math.max(72, width * 0.36), Math.max(40, width / 2 - O.cardWidth * 0.58)) * fit;
      var fadeStart = clamp(1 - O.edgeFade, 0, 0.98), turn = Math.max(O.cardsPerTurn, 1);
      for (var i = 0; i < count; i++) {
        var card = cards[i];
        var offset = modulo(i - progress + half, count) - half;
        var edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1);
        var opacity = 1 - smoothstep(fadeStart, 1, edge);
        var focus = 1 - Math.min(Math.abs(offset) / Math.max(turn * 0.65, 1), 1);
        var scale = (1 + (O.centerScale - 1) * focus) * fit;
        var ang = (offset * (360 / turn) + O.rotation) * Math.PI / 180;
        var x = Math.sin(ang) * R, z = Math.cos(ang) * R;
        var depthScale = clamp(O.perspective / Math.max(O.perspective - z, 1), 0.72, 1.45);
        var depth = (z / Math.max(R, 1) + 1) / 2;
        var blur = O.edgeBlur * smoothstep(0.35, 1, edge);
        // progress grows, so every card's offset shrinks and it rises: the cars climb, new ones come up from below
        card.style.transform = 'translate(-50%, -50%) translate3d(' + x.toFixed(2) + 'px, ' + (offset * O.verticalSpacing * fit).toFixed(2) + 'px, 0) rotateZ(' + O.cardTilt + 'deg) scale(' + (scale * depthScale).toFixed(4) + ')';
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.01 ? 'blur(' + blur.toFixed(2) + 'px)' : 'none';
        card.style.zIndex = String(Math.round(depth * 100000) + i);
        card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
        card.tabIndex = opacity > 0.25 ? 0 : -1;
      }
      frame = visible ? requestAnimationFrame(render) : 0;
    }

    root.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hovered = true; });
    root.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hovered = false; });
    // keyboard: a focused card holds the spiral still, as the mouse does
    root.addEventListener('focusin', function () { hovered = true; });
    root.addEventListener('focusout', function () { hovered = false; });
    function stop(e) {
      if (!dragging) return;
      dragging = false; root.classList.remove('is-drag');
      if (root.hasPointerCapture && root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
    }
    root.addEventListener('pointerdown', function (e) {
      if (!dragOn || e.pointerType === 'touch' || e.button !== 0) return;
      dragging = true; moved = false; lastY = e.clientY; target = progress;
      root.setPointerCapture(e.pointerId); root.classList.add('is-drag');
    });
    root.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var d = e.clientY - lastY; lastY = e.clientY;
      if (Math.abs(d) > 0.5) moved = true;
      target -= d / Math.max(O.verticalSpacing, 1);
    });
    root.addEventListener('pointerup', stop);
    root.addEventListener('pointercancel', stop);
    // a drag is not a click on the card it ended on
    root.addEventListener('click', function (e) {
      if (!moved) return;
      e.preventDefault(); e.stopPropagation(); moved = false;
    }, true);
    root.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  var tries = 0;
  function init() {
    var head = document.querySelector('.kt-about .kt-about-head');
    if (!head || !head.querySelector('.kt-sw')) { if (++tries < 20) setTimeout(init, 500); return; }
    if (!head.hasAttribute('data-msp')) make(head);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
