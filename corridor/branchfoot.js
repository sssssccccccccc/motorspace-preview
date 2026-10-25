/* Motorspace gallery homepage: the footer as a ridge of dark glowing rock that grows moss and flowers under the mouse.
   主人 2026-10-18 (screenshot of the footer + https://motionsites.ai/?prompt=interactive-discovery):
   「在背后加一个代码，就是在那个文字后面。1. 这个必须做得很清楚、很清晰，想尽一切办法把它做得更清晰。2. 我觉得MotorSpace暂时先不要，
   太丑了。3. 这里面应该类似于树枝，可以做变绿的那种特效，要铺满…… 4. 我指的去掉MotorSpace，是最底下那个大的MotorSpace去掉。
   5. 左上角有个MotorSpace，下一个可以加一句To the Future。」
   Then (same day, the reference's picture beside ours): 「人家的树枝是那种粗壮的，我要的是1:1复刻。人家那种是鼠标点到
   哪里，哪个地方就有一点点变化。」 So the thin branches (removed 2026-10-18 with 主人's OK) gave way to a
   remake of the reference's picture: one massive lump of dark porous rock rising to the right, a net of orange-red
   glowing fibres in its folds and along its underside (dev/corridor/blender/strata.py). The second picture is the same
   scene from the same camera, grown over with moss and small wild flowers, so under the circle the very same rock
   changes, and only there: the circle is reveal.js, as in the reference: no trail, nothing
   moving by itself with a mouse. On a phone (no mouse) the circle wanders across slowly and a tap brings it there.
   Sharpness: the renders are 5120 x 1800 and the page picks one big enough for the screen (3840 / 5120 / the phone
   slice at full resolution); nothing is scaled up.
   The footer is React's: nothing in it is moved. The big MOTORSPACE under it is hidden with CSS, "To the Future" is a
   ::after line under the logo, and the rock is one layer appended at its end.
   Then (footer screenshot, the text above and the rock below): 「我想做的效果是那个上面的字后面是这个特效而不是分开的」:
   so the render was reframed (strata.py: the ridge level and tall, its crest near the top, the glow kept low) and the
   footer no longer leaves room under the text: the rock fills it, the text sits on the rock. A light veil and a soft
   shadow under the letters keep the links readable without hiding the rock. Reduced motion: the circle sits at the cursor, and does not wander on a phone. */
(function () {
  'use strict';
  if (!window.MSReveal) return;
  var me = document.currentScript && document.currentScript.src;
  var IMG = me ? new URL('img/strata/', me).href : '/corridor/img/strata/';
  var R = 260;                 // the reference's circle
  var TALL = 1.12;             // the picture this much taller than the footer: the sky above the crest falls outside

  function u(name, size) { return 'url("' + IMG + name + '-' + size + '.webp")'; }
  var css = document.createElement('style');
  css.textContent =
    '.kt-footer[data-mbr]{position:relative;overflow:hidden;isolation:isolate;align-content:start;font-size:15px}' +
    '.kt-footer[data-mbr]>:not(.mbr){position:relative;z-index:2}' +
    '.kt-footer[data-mbr] .kt-footer-mark{display:none}' +
    // 主人 2026-10-18: 「最下面字可以大一点重新排版尤其是那个motorspace to the future 可以大一点然后那个岩石和字重叠可以更多点」
    // the wordmark and "To the Future" as the footer's headline, the links a size up, all of it on the rock
    '.kt-footer[data-mbr] .kt-logo{flex-wrap:wrap;align-items:flex-start;column-gap:14px;row-gap:clamp(8px,1vw,16px)}' +
    '.kt-footer[data-mbr] .kt-logo b{font-size:clamp(34px,6vw,104px);line-height:.92;letter-spacing:.12em}' +
    '.kt-footer[data-mbr] .kt-logo .kt-brand-reveal{width:min(1050px,calc(100% - 86px));flex:none}' +
    '.kt-footer[data-mbr] .kt-logo>span:last-child{font-size:clamp(12px,1vw,16px);margin-top:.35em;color:var(--ink)}' +
    '.kt-footer .kt-logo::after{content:"To the Future";flex-basis:100%;font:500 15px/1.2 var(--font-display);letter-spacing:.01em;color:var(--ink)}' +
    '.kt-footer[data-mbr] .kt-logo::after{font:500 clamp(24px,3.6vw,62px)/1.04 var(--font-display);letter-spacing:-.01em}' +
    '.kt-footer[data-mbr] .kt-footer-brand p{margin-top:clamp(16px,1.6vw,26px);font-size:14px;color:rgba(245,245,247,.72)}' +
    '.kt-footer[data-mbr] nav{gap:10px}' +
    '.kt-footer[data-mbr] nav .kt-label{font-size:14px;margin-bottom:4px}' +
    '.kt-footer[data-mbr] nav a{font-size:17px;color:rgba(245,245,247,.84)}' +
    '.kt-footer[data-mbr] .kt-lang button{height:34px;min-width:44px;font-size:14px}' +
    '.kt-footer[data-mbr] .kt-footer-end .kt-label{font-size:14px}' +
    // computers: headline across the top, the three link columns under it, the glowing foot of the rock left free below
    '@media (min-width:861px){.kt-footer[data-mbr]{grid-template-columns:repeat(3,minmax(0,1fr)) auto;grid-template-rows:auto auto 1fr;column-gap:var(--space-8);' +
    'row-gap:clamp(40px,4.5vw,80px);padding:clamp(56px,6vw,104px) var(--space-12) var(--space-12);min-height:clamp(620px,52vw,920px)}' +
    '.kt-footer[data-mbr] .kt-footer-brand{grid-column:1/4;grid-row:1}' +
    '.kt-footer[data-mbr] .kt-footer-end{grid-column:4;grid-row:1}' +
    '.kt-footer[data-mbr]>nav{grid-row:2}.kt-footer[data-mbr]>nav:nth-of-type(1){grid-column:1}.kt-footer[data-mbr]>nav:nth-of-type(2){grid-column:2}.kt-footer[data-mbr]>nav:nth-of-type(3){grid-column:3}}' +
    '.kt-footer[data-mbr] .kt-footer-brand{grid-column:1/-1}' +
    '.mbr{position:absolute;inset:0;z-index:0;pointer-events:none}' +
    // the picture is set a little taller than the footer (measure()), so the dark sky above the crest is cut off and the
    // rock reaches up behind the headline
    '.mbr i{position:absolute;inset:0;background:no-repeat 50% 100%;background-size:auto var(--mbr-h,100%)}' +
    // the veil: just a light dimming behind the text, the rock shows through; a soft shadow under the letters does the rest
    '.mbr::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,11,14,.42) 0,rgba(10,11,14,.3) var(--mbr-text,220px),rgba(10,11,14,0) calc(var(--mbr-text,220px) + 120px))}' +
    '.kt-footer[data-mbr]>:not(.mbr){text-shadow:0 1px 3px rgba(4,5,7,.8),0 0 24px rgba(4,5,7,.7)}' +
    ['3840', '5120', 'phone'].map(function (z) {
      return '.mbr-on[data-size="' + z + '"] .mbr-rock{background-image:' + u('rock', z) + '}.mbr-on[data-size="' + z + '"] .mbr-moss{background-image:' + u('moss', z) + '}';
    }).join('') +
    // phones: a little room under the last line, where the glowing foot of the rock shows unveiled
    '@media (max-width:860px){.kt-footer[data-mbr]{min-height:0;row-gap:var(--space-8);padding-bottom:calc(var(--space-8) + 26vw)}' +
    '.kt-footer[data-mbr] .kt-logo{position:relative;padding-top:22px}' +
    '.kt-footer[data-mbr] .kt-logo .kt-brand-reveal{width:100%}' +
    '.kt-footer[data-mbr] .kt-logo>span:last-child{position:absolute;top:0;right:0;margin:0}}';
  document.head.appendChild(css);

  function make(f) {
    f.setAttribute('data-mbr', '');
    var box = document.createElement('div'), rock = document.createElement('i'), moss = document.createElement('i');
    box.className = 'mbr'; box.setAttribute('aria-hidden', 'true');
    rock.className = 'mbr-rock'; moss.className = 'mbr-moss';
    box.appendChild(rock); box.appendChild(moss); f.appendChild(box);

    function measure() {
      var fr = f.getBoundingClientRect(), W = fr.width, H = fr.height, bottom = 0;
      Array.prototype.forEach.call(f.children, function (c) {
        if (c === box) return;
        var r = c.getBoundingClientRect();
        if (r.height) bottom = Math.max(bottom, r.bottom - fr.top);
      });
      box.style.setProperty('--mbr-text', Math.round(bottom) + 'px');
      // the smallest picture that still has a pixel for every screen pixel: the footer shows the render's full height
      // (cover, wider than tall) unless the footer is wider than the render's shape
      var dpr = window.devicePixelRatio || 1, phone = W <= 760;
      var A = phone ? 0.797 : 2.844, bh = Math.max(H * TALL, W / A);    // the picture's height on screen: taller than the footer, and wide enough
      box.style.setProperty('--mbr-h', Math.round(bh) + 'px');
      var need = bh * dpr;
      var size = phone ? 'phone' : need <= 1350 * 1.04 ? '3840' : '5120';
      if (box.getAttribute('data-size') !== size && !(box.getAttribute('data-size') === '5120' && size === '3840')) box.setAttribute('data-size', size);
      if (rv) rv.measure();
    }

    var rv = null;
    measure();
    rv = window.MSReveal(f, moss, {
      radius: function (W) { return Math.min(R, Math.max(140, W * 0.36)); },
      // wandering on a phone, the circle goes all over the rock, text and all
      band: function (W, H) { return [H * 0.3, H * 0.85]; }
    });
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) box.classList.add('mbr-on');   // load the pictures as the page nears its end
    }, { rootMargin: '1200px 0px' }).observe(f);
    window.addEventListener('resize', measure);
    if (window.ResizeObserver) new ResizeObserver(measure).observe(f);
  }

  var tries = 0;
  function init() {
    var f = document.querySelector('.kt-footer');
    if (!f) { if (++tries < 20) setTimeout(init, 500); return; }
    if (!f.hasAttribute('data-mbr')) make(f);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
