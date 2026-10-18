/* Motorspace gallery homepage: the two office clocks (Warszawa, China) as American schoolhouse clocks.
   主人 2026-10-17: 「这个要做的美式复古一点，然后里面不是有三个时针吗？你可以把其中的一个换成红色或者两个换成红色，
   你可以用那个taste来看一看哪个更合适」. Verdict (design-taste-frontend): one red hand, the seconds. Red stays the one accent,
   the black hour and minute hands keep the time readable on a 78px dial, and the red sweep hand over black hands is the
   schoolhouse / railroad clock itself; two red hands would make red the main colour and blur which hand is which.
   The clock is React's (it moves the hands every second), so none of it is moved or replaced: its face and twelve ticks
   are hidden and a dial is put in under the hands (black case, brass rim, ivory face, railroad minute track, numerals 1-12
   in the site's own typeface). The hands are restyled with CSS: black hour hand with a spade, black minute hand with a
   point, thin red seconds hand with its round counterweight, red hub. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var INK = '#17140f', RED = '#c8282a', IVORY = '#ece4d2', BRASS = '#a8875a', CASE = '#0c0c0e';
  var ON = '.kt-clock[data-msc-retro] ';

  var css = document.createElement('style');
  css.textContent = ON + '.kt-clock-face,' + ON + '.kt-clock-tick{display:none}' +
    ON + '.kt-clock-h,' + ON + '.kt-clock-m{stroke:' + INK + ';stroke-linecap:butt}' +
    ON + '.kt-clock-h{stroke-width:3.2;marker-end:url(#msc-clock-spade)}' +
    ON + '.kt-clock-m{stroke-width:2.2;marker-end:url(#msc-clock-point)}' +
    ON + '.kt-clock-s{stroke:' + RED + ';stroke-width:1.1;marker-start:url(#msc-clock-weight)}' +
    ON + '.kt-clock-pin{fill:' + RED + '}' +
    '.msc-clock-dial text{font-family:var(--font-display);font-weight:700;font-size:9.5px;fill:' + INK + ';text-anchor:middle;dominant-baseline:central;font-variant-numeric:lining-nums}' +
    '.msc-clock-defs{position:absolute;width:0;height:0;overflow:hidden}';
  document.head.appendChild(css);

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // the hand ends, drawn once for both clocks; +x is the way the hand points
  function defs() {
    if (document.getElementById('msc-clock-spade')) return;
    var svg = el('svg', { 'class': 'msc-clock-defs', 'aria-hidden': 'true', focusable: 'false' }), d = el('defs', {}, svg);
    function marker(id, box, shape) {
      var m = el('marker', { id: id, markerUnits: 'userSpaceOnUse', viewBox: box, refX: 0, refY: 0, orient: 'auto', overflow: 'visible' }, d);
      var b = box.split(' ');
      m.setAttribute('markerWidth', b[2]); m.setAttribute('markerHeight', b[3]);
      m.appendChild(shape);
    }
    marker('msc-clock-spade', '-8 -5 14 10', el('path', { fill: INK, d: 'M-7 0C-7-1.2-5.6-3.3-3.1-3.3C-.8-3.3 1.6-1.6 4.6 0C1.6 1.6-.8 3.3-3.1 3.3C-5.6 3.3-7 1.2-7 0Z' }));
    marker('msc-clock-point', '-2 -2 7 4', el('path', { fill: INK, d: 'M-.4-1.1L3.6 0L-.4 1.1Z' }));
    marker('msc-clock-weight', '-2 -4 8 8', el('circle', { fill: RED, cx: 2.2, cy: 0, r: 2.7 }));
    document.body.appendChild(svg);
  }

  function dial(svg) {
    var face = svg.querySelector('.kt-clock-face');
    if (!face) return;
    var g = el('g', { 'class': 'msc-clock-dial', 'aria-hidden': 'true' });
    el('circle', { cx: 50, cy: 50, r: 49.6, fill: CASE }, g);
    el('circle', { cx: 50, cy: 50, r: 45.6, fill: 'none', stroke: BRASS, 'stroke-width': 1.6 }, g);
    el('circle', { cx: 50, cy: 50, r: 44.8, fill: IVORY }, g);
    // the railroad minute track: two rings with the minutes between them, longer marks at the hours
    el('circle', { cx: 50, cy: 50, r: 42.2, fill: 'none', stroke: INK, 'stroke-width': 0.5 }, g);
    el('circle', { cx: 50, cy: 50, r: 38.6, fill: 'none', stroke: INK, 'stroke-width': 0.5 }, g);
    for (var i = 0; i < 60; i++) {
      var a = i * Math.PI / 30, hour = i % 5 === 0, r0 = hour ? 37.2 : 38.6, s = Math.sin(a), c = Math.cos(a);
      el('line', { x1: (50 + s * r0).toFixed(2), y1: (50 - c * r0).toFixed(2), x2: (50 + s * 42.2).toFixed(2), y2: (50 - c * 42.2).toFixed(2),
        stroke: INK, 'stroke-width': hour ? 1.4 : 0.5 }, g);
    }
    for (var h = 1; h <= 12; h++) {
      var b = h * Math.PI / 6, t = el('text', { x: (50 + Math.sin(b) * 31).toFixed(2), y: (50 - Math.cos(b) * 31 + 0.3).toFixed(2) }, g);
      t.textContent = h;
    }
    face.parentNode.insertBefore(g, face.nextSibling);
    svg.setAttribute('data-msc-retro', '');
  }

  var pend = 0;
  function run() {
    pend = 0;
    var list = document.querySelectorAll('.kt-clock:not([data-msc-retro])');
    if (!list.length) return;
    defs();
    Array.prototype.forEach.call(list, dial);
  }
  function start() {
    run();
    // React may draw the clocks late or draw them again (a new language): dress any new one
    new MutationObserver(function () { if (!pend) pend = requestAnimationFrame(run); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
