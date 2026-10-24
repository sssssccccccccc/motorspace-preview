/* MotorSpace · car page script (make_carpages.js). Everything on the page is already in the HTML; this only adds:
   - the site's own lead form for the ask button (without scripts the button stays a mailto link)
   - the photo transition to a similar car: its photo takes the view-transition name and the hero gives it up */
(function () {
  'use strict';
  // Native links keep the full-size photos usable when JavaScript is disabled.
  document.querySelectorAll('a[data-photo]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.querySelector('.cp-hero-img').src = a.href;
      document.querySelectorAll('a[data-photo]').forEach(function (thumb) { thumb.removeAttribute('aria-current'); });
      a.setAttribute('aria-current', 'true');
    });
  });
  var btn = document.querySelector('[data-lead]'), host = document.getElementById('cp-lead'), root = null;
  function render(open) {
    var K = window.Kontener, h = window.React.createElement;
    root = root || window.ReactDOM.createRoot(host);
    root.render(h(K.LeadForm, { open: open, lang: window.KT_LANG || 'pl', onClose: function () { render(false); },
      context: { kind: btn.getAttribute('data-kind') || 'inquiry', summary: btn.getAttribute('data-lead') || '' } }));
  }
  if (btn && host) btn.addEventListener('click', function (e) {
    if (!window.React || !window.ReactDOM || !window.Kontener || !window.Kontener.LeadForm) return;
    e.preventDefault(); render(true);
  });

  function names(clear) {
    var hero = document.querySelector('.cp-hero-img'); if (hero) hero.style.viewTransitionName = clear ? '' : 'none';
    Array.prototype.forEach.call(document.querySelectorAll('[data-car-link]'), function (a) { var p = document.querySelector(a.getAttribute('data-car-link')); if (p) p.style.viewTransitionName = ''; });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-car-link]');
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    names(false);
    var ph = document.querySelector(a.getAttribute('data-car-link')); if (ph) ph.style.viewTransitionName = 'ms-car';
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) names(true); });
})();
