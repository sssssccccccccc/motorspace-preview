/* Motorspace gallery homepage: the big titles write themselves.
   主人 2026-10-17: 「首页的字用这个代码做一下」— react-bits StrokeText (strokeWidth 1.4, drawDuration 1.6, fillDelay .2,
   stagger .05, ease power2.out, fillMode wipe from the left, hoverRedraw). Same evening: 「不应该是紫色，它就应该是白色描边，
   然后最后就变成白色实体」「最主要的是首页那个地方得加」(the first screen, the corridor with the cars on both walls).
   Each letter's outline is drawn in white, one after another; then the title itself is wiped in from the left and the
   outline goes, leaving the plain solid title. Hovering a finished title (mouse only) writes it again.
   Where: the first-screen title (.msc-title) as the page opens, and the section titles (h2) as each comes into view.
   Nothing inside a title is touched (React owns the section titles): the outline is a sibling layer under the title,
   the wipe is a clip-path on the title. The titles keep their own size, weight and colours. */
(function () {
  'use strict';
  var mm = window.matchMedia ? function (q) { return window.matchMedia(q).matches; } : function () { return false; };
  if (mm('(prefers-reduced-motion: reduce)') || !Element.prototype.animate || !window.IntersectionObserver) return;
  var FINE = mm('(hover: hover) and (pointer: fine)');
  var O = { width: 1.4, draw: 1.6, fillDelay: 0.2, stagger: 0.05, fill: 0.8, maxStagger: 1.2, redraw: 0.8 };
  var OUT = 'cubic-bezier(.215,.61,.355,1)', IN_OUT = 'cubic-bezier(.645,.045,.355,1)';   // gsap power2.out / power2.inOut
  var NS = 'http://www.w3.org/2000/svg';
  var PICK = '.msc-title, h2', SKIP = '.msc-info, .kt-reserved, footer, nav';
  var CJK = /[⺀-鿿　-〿豈-﫿＀-￯]/;
  var ctx = document.createElement('canvas').getContext('2d');

  var css = document.createElement('style');
  css.textContent = '[data-mstk-iso]{isolation:isolate}' +
    '.mstk{position:absolute;left:0;top:0;z-index:-1;pointer-events:none;overflow:visible}' +
    '.msc-hero>.mstk{opacity:calc(1 - var(--show, 0) * 1.6)}' +   // fades with the first-screen title when a car is opened
    '.mstk svg{position:absolute;left:0;top:0;overflow:visible}' +
    '.mstk text{fill:none;stroke-width:' + O.width + 'px;stroke-linejoin:round;stroke-linecap:round;font-kerning:none;letter-spacing:0}';
  document.head.appendChild(css);

  function each(n) { return Math.min(O.stagger, O.maxStagger / Math.max(1, n)); }

  function Title(h) {
    this.h = h; this.state = 'idle'; this.texts = []; this.dash = 200;
    this.layer = document.createElement('div'); this.layer.className = 'mstk'; this.layer.setAttribute('aria-hidden', 'true');
    this.svg = document.createElementNS(NS, 'svg'); this.layer.appendChild(this.svg);
    h.parentNode.insertBefore(this.layer, h.nextSibling);
    h.parentNode.setAttribute('data-mstk-iso', '');
    this.build();
    var self = this;
    if (FINE) h.addEventListener('pointerenter', function () { self.again(); });
  }

  // every letter where the browser put it, as an outline in the layer; the wipe runs from the first letter to the last
  Title.prototype.build = function () {
    var h = this.h, hr = h.getBoundingClientRect();
    if (!hr.width) return;
    var L = this.layer; L.style.left = '0px'; L.style.top = '0px';
    var lr = L.getBoundingClientRect();
    L.style.left = (hr.left - lr.left).toFixed(2) + 'px'; L.style.top = (hr.top - lr.top).toFixed(2) + 'px';
    L.style.width = hr.width + 'px'; L.style.height = hr.height + 'px';
    this.svg.setAttribute('width', hr.width); this.svg.setAttribute('height', hr.height);
    while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);
    var texts = [], walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT, null), node, range = document.createRange();
    var left = Infinity, right = -Infinity, size = 0;
    while ((node = walk.nextNode())) {
      var cs = getComputedStyle(node.parentElement), fs = parseFloat(cs.fontSize);
      var font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      // the outline is the title's own colour (white); a gradient title has a transparent colour, so plain white
      var ink = /rgba\([^)]*,\s*0\)|transparent/.test(cs.color) ? '#f5f5f7' : cs.color;
      ctx.font = font;
      var met = ctx.measureText('Hg'), asc = met.fontBoundingBoxAscent || fs * 0.8, desc = met.fontBoundingBoxDescent || fs * 0.2;
      var s = node.nodeValue;
      for (var i = 0; i < s.length; i++) {
        var n = s.codePointAt(i) > 0xffff ? 2 : 1, ch = s.substr(i, n);
        if (!/\s/.test(ch)) {
          range.setStart(node, i); range.setEnd(node, i + n);
          var r = range.getClientRects()[0];
          if (r && r.width) {
            var base = r.top - hr.top + (r.height - asc - desc) / 2 + asc;
            var t = document.createElementNS(NS, 'text');
            t.setAttribute('x', (r.left - hr.left).toFixed(2));
            // measured against the page in Chrome: Chinese glyphs sit on the whole pixel above, Latin ones on the nearest
            t.setAttribute('y', CJK.test(ch) ? Math.floor(base + 0.01) : Math.round(base));
            t.style.font = font; t.style.fontFeatureSettings = cs.fontFeatureSettings; t.style.fontVariationSettings = cs.fontVariationSettings;
            t.style.stroke = ink;
            t.textContent = ch;
            this.svg.appendChild(t); texts.push(t);
            left = Math.min(left, r.left - hr.left); right = Math.max(right, r.right - hr.left); size = Math.max(size, fs);
          }
        }
        i += n - 1;
      }
    }
    this.texts = texts;
    this.dash = Math.max(size * 7, 200);
    var pad = Math.round(size * 0.4);
    // hidden: a zero-wide window at the first letter; shown: the window has reached the last letter
    this.clipFrom = 'inset(' + -pad + 'px ' + (hr.width - left + 2).toFixed(1) + 'px ' + -pad + 'px ' + -pad + 'px)';
    this.clipTo = 'inset(' + -pad + 'px ' + Math.min(-pad, hr.width - right - pad).toFixed(1) + 'px ' + -pad + 'px ' + -pad + 'px)';
    this.clipGone = 'inset(' + -pad + 'px ' + -pad + 'px ' + -pad + 'px ' + (right + pad).toFixed(1) + 'px)';   // wiped away to the right
    var d = this.dash;
    texts.forEach(function (t) { t.style.strokeDasharray = d; t.style.strokeDashoffset = d; });
    this.svg.style.opacity = this.state === 'done' ? 0 : 1;
    if (this.state === 'idle') h.style.clipPath = this.clipFrom;
  };

  // outline letter by letter, then the title wipes in over it and the outline fades away
  Title.prototype.write = function (speed, clearFirst) {
    var self = this, d = this.dash, k = each(this.texts.length), draw = O.draw * speed;
    this.svg.getAnimations().forEach(function (a) { a.cancel(); });
    this.svg.style.opacity = 1;
    this.texts.forEach(function (t, i) {
      t.getAnimations().forEach(function (a) { a.cancel(); });
      t.animate([{ strokeDashoffset: d }, { strokeDashoffset: 0 }], { duration: draw * 1000, delay: i * k * 1000, easing: OUT, fill: 'both' });
    });
    var frames = clearFirst ? [{ clipPath: this.clipTo, offset: 0 }, { clipPath: this.clipGone, offset: 0.999 }, { clipPath: this.clipFrom, offset: 1 }] : null;
    if (frames) this.h.animate(frames, { duration: 380, easing: IN_OUT, fill: 'forwards' });
    var w = this.h.animate([{ clipPath: this.clipFrom }, { clipPath: this.clipTo }], { duration: O.fill * speed * 1000, delay: (draw + O.fillDelay * speed) * 1000, easing: IN_OUT, fill: 'forwards' });   // before it starts: the inline clip (first time) or the wipe-away's end
    w.onfinish = function () { self.finish(true); };
  };

  Title.prototype.play = function () {
    if (this.state !== 'idle') return;
    this.state = 'play';
    this.write(1, false);
  };

  // hovering a finished title: it wipes away to the right and writes itself again, a little quicker
  Title.prototype.again = function () {
    if (this.state !== 'done') return;
    this.state = 'play';
    this.write(O.redraw, true);
  };

  Title.prototype.finish = function (fade) {
    this.state = 'done';
    this.h.style.clipPath = '';
    this.h.getAnimations().forEach(function (a) { a.cancel(); });
    this.texts.forEach(function (t) { t.style.strokeDashoffset = 0; t.getAnimations().forEach(function (a) { a.cancel(); }); });
    var svg = this.svg; svg.style.opacity = 0;
    if (fade) svg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: 'ease-out' });
  };

  function init() {
    var list = Array.prototype.filter.call(document.querySelectorAll(PICK), function (h) {
      return !h.closest(SKIP) && h.textContent.trim() && h.parentNode;
    }).map(function (h) { return new Title(h); });
    document.documentElement.classList.remove('mstk-pre');   // the page kept the first-screen title hidden until now
    if (!list.length) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = list.filter(function (x) { return x.layer === e.target; })[0];
        if (t) { io.unobserve(t.layer); t.build(); t.play(); }
      });
    }, { rootMargin: '0px 0px -18% 0px' });
    // watch the outline layer, not the title: the hidden title is clipped to nothing, and the observer goes by what is visible
    list.forEach(function (t) { io.observe(t.layer); });
    var raf = 0;
    function rebuild() {
      raf = 0;
      // phones fire resize when the address bar slides; only a real change of the title's box re-lays the letters
      list.forEach(function (t) {
        var r = t.h.getBoundingClientRect(), key = Math.round(r.width) + 'x' + Math.round(r.height);
        if (key === t.key) return;
        var first = !t.key; t.key = key;
        if (first) return;   // the observer's first call only reports the size the title was built at
        if (t.state === 'play') {   // the title moved while writing (the page was still settling): start it over in the new place
          t.h.getAnimations().forEach(function (a) { a.cancel(); });
          t.state = 'idle'; t.build(); t.play();
        } else t.build();
      });
    }
    function later() { if (!raf) raf = requestAnimationFrame(rebuild); }
    window.addEventListener('resize', later);
    if (window.ResizeObserver) { var ro = new ResizeObserver(later); list.forEach(function (t) { ro.observe(t.h); }); }
  }

  function start() { (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(init, init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
