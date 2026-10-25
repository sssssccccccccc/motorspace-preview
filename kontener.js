/* @ds-bundle: {"format":4,"namespace":"Kontener","components":[{"name":"HomeHero"},{"name":"HomeSearch"},{"name":"ScrollWords"},{"name":"StatRow"},{"name":"OfficeClocks"},{"name":"WhyUs"},{"name":"ModelSpotlight"},{"name":"CarBoxGarage"},{"name":"Showroom3D"},{"name":"Car3DView"},{"name":"HeroTitle"},{"name":"ImportJourney"},{"name":"CarDetailSheet"},{"name":"RollingNumber"},{"name":"OrderBuilder"},{"name":"StockCard"},{"name":"SectionHeader"},{"name":"ReservedSection"},{"name":"Footer"},{"name":"CarSilhouette"},{"name":"Viewer3D"},{"name":"NavBar"},{"name":"LangSwitch"},{"name":"ImportCalculator"},{"name":"SearchField"},{"name":"FilterPanel"},{"name":"ActiveFilters"},{"name":"SearchBar"},{"name":"OfferCard"},{"name":"ImportSteps"},{"name":"Button"},{"name":"DriveTag"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  var useState = React.useState, useRef = React.useRef, useEffect = React.useEffect, useLayoutEffect = React.useLayoutEffect;

  // ---------- copy: Polish first, then English, then Chinese ----------
  var LANGS = [{ id: 'pl', label: 'PL' }, { id: 'en', label: 'EN' }, { id: 'zh', label: '中' }];
  var T = {
    pl: { cnPrice: 'cena w Chinach', plPrice: 'szac. cena z importem do PL', from: 'od', range: 'Zasięg', power: 'Moc', accel: '0–100 km/h', year: 'Rok', drive: 'Napęd', seats: 'Miejsca',
      view3d: 'Zobacz w 3D', calc: 'Oblicz import', pick: 'Kliknij gablotę — otworzy się w miejscu, z wersjami, kolorami i ceną', onStage: 'Na scenie', container: 'Gabloty', details: 'Szczegóły',
      orderThis: 'Zamów to auto', toOrder: 'na zamówienie', weeks: '12–16 tyg.',
      ev: 'EV', phev: 'PHEV', ice: 'Spalinowy',
      nav: ['Zamów auto', 'Od ręki', 'Serwis', 'Kontakt'], quote: 'Kalkulator',
      brand: 'Marka', model: 'Model', yearSel: 'Rok produkcji', driveSel: 'Typ napędu', all: 'Wszystkie', any: 'Dowolny', search: 'Szukaj',
      steps: [['Wybierz auto', 'Model, wersja i kolor. Cenę z cłem i VAT widzisz od razu.'], ['Zaliczka', 'Umowa po polsku i zaliczka przelewem. Zamawiamy auto u dealera.'], ['Transport', 'Odprawa w Chinach i transport do Polski — morzem, koleją lub drogą. Śledzisz każdy etap.'], ['Odbiór', 'Po 12–16 tygodniach odbierasz auto z kompletem dokumentów i raportem z inspekcji.']],
      loadModel: 'Wczytaj model 3D', exterior: 'Nadwozie', interior: 'Wnętrze', drag: 'Przeciągnij, aby obrócić · kółko, aby przybliżyć', loading: 'Wczytywanie', notLoaded: 'Model wczytuje się dopiero po kliknięciu',
      trim: 'Wersja', color: 'Kolor', colors: ['Biały', 'Czarny', 'Szary', 'Srebrny'], delivery: 'Dostawa',
      rows: { price: 'Cena auta w Chinach', freight: 'Transport i ubezpieczenie', duty: 'Cło 10%', excise: 'Akcyza', vat: 'VAT 23%', fees: 'Homologacja i rejestracja', total: 'Razem z dostawą do PL' },
      deposit: 'Zamów z zaliczką', ratesNote: 'Kwoty orientacyjne. Ostateczną cenę potwierdzamy w umowie.',
      inPoland: 'W Polsce · od ręki', finalPrice: 'cena końcowa brutto', reserve: 'Zarezerwuj', testDrive: 'Jazda próbna',
      reserved: 'Wkrótce', more: 'Zobacz wszystkie',
      sec: { order: ['Zamów auto z Chin', 'Wybierz model, wersję i kolor. Cenę z cłem i VAT widzisz od razu.'], stock: ['Auta od ręki', 'Samochody już w Polsce, do odbioru w kilka dni.'],
        aftersales: ['Serwis i gwarancja', 'Warsztaty partnerskie, części i jasne warunki gwarancji dla każdego modelu.'], privacy: ['Prywatność i RODO', 'Jak przetwarzamy Twoje dane.'] },
      planned: { aftersales: ['Warunki gwarancji dla każdego modelu', 'Serwis partnerski w Polsce', 'Części i aktualizacje oprogramowania', 'Pomoc po polsku'], privacy: ['Polityka prywatności', 'Pliki cookies', 'Twoje prawa z RODO', 'Administrator danych'] },
      footer: [['Auta', [['Zamów auto', 'index.html#zamow'], ['Auta od ręki', 'index.html#od-reki'], ['Wszystkie oferty', 'oferty.html']]], ['Obsługa', [['Jak to działa', 'index.html#jak-to-dziala'], ['Śledź zamówienie', 'sledzenie.html'], ['Serwis i gwarancja', 'index.html#gwarancja'], ['FAQ', 'index.html#faq']]], ['Firma', [['Kontakt', 'kontakt.html'], ['Polityka prywatności', 'polityka-prywatnosci.html'], ['Cookies', 'polityka-prywatnosci.html#cookies'], ['Regulamin', 'regulamin.html']]]] },
    en: { cnPrice: 'price in China', plPrice: 'est. landed in Poland', from: 'from', range: 'Range', power: 'Power', accel: '0–100 km/h', year: 'Year', drive: 'Drive', seats: 'Seats',
      view3d: 'View in 3D', calc: 'Import cost', pick: 'Click a case — it opens right there, with trims, colours and the price', onStage: 'On stage', container: 'Display cases', details: 'Details',
      orderThis: 'Order this car', toOrder: 'to order', weeks: '12–16 weeks',
      ev: 'EV', phev: 'PHEV', ice: 'Petrol',
      nav: ['Order', 'In stock', 'Service', 'Contact'], quote: 'Calculator',
      brand: 'Brand', model: 'Model', yearSel: 'Year', driveSel: 'Drive type', all: 'All', any: 'Any', search: 'Search',
      steps: [['Choose', 'Model, trim and colour. The price with duty and VAT shows straight away.'], ['Deposit', 'Sign the contract and pay a deposit. We order the car from the dealer.'], ['Transport', 'Export clearance, then transport to Poland by sea, rail or road. Track every stage.'], ['Collect', 'In 12–16 weeks you collect the car with full papers and the inspection report.']],
      loadModel: 'Load 3D model', exterior: 'Exterior', interior: 'Interior', drag: 'Drag to rotate · scroll to zoom', loading: 'Loading', notLoaded: 'The model loads only when you ask for it',
      trim: 'Trim', color: 'Colour', colors: ['White', 'Black', 'Grey', 'Silver'], delivery: 'Delivery',
      rows: { price: 'Car price in China', freight: 'Transport & insurance', duty: 'Customs duty 10%', excise: 'Excise duty', vat: 'VAT 23%', fees: 'Homologation & registration', total: 'Total, delivered in Poland' },
      deposit: 'Order with deposit', ratesNote: 'Indicative figures. The final price is fixed in the contract.',
      inPoland: 'In Poland · ready now', finalPrice: 'final price incl. VAT', reserve: 'Reserve', testDrive: 'Test drive',
      reserved: 'Coming soon', more: 'See all',
      sec: { order: ['Order a car from China', 'Choose model, trim and colour. See the price with duty and VAT straight away.'], stock: ['Cars in stock', 'Already in Poland, ready in a few days.'],
        aftersales: ['Service & warranty', 'Partner workshops, parts and clear warranty terms for every model.'], privacy: ['Privacy & GDPR', 'How we handle your data.'] },
      planned: { aftersales: ['Warranty terms for every model', 'Partner workshops in Poland', 'Parts and software updates', 'Support in Polish'], privacy: ['Privacy policy', 'Cookies', 'Your GDPR rights', 'Data controller'] },
      footer: [['Cars', [['Order a car', 'index.html#zamow'], ['In stock', 'index.html#od-reki'], ['All offers', 'offers.html']]], ['Service', [['How it works', 'index.html#jak-to-dziala'], ['Track your order', 'tracking.html'], ['Service & warranty', 'index.html#gwarancja'], ['FAQ', 'index.html#faq']]], ['Company', [['Contact', 'contact.html'], ['Privacy policy', 'privacy.html'], ['Cookies', 'privacy.html#cookies'], ['Terms', 'terms.html']]]] },
    zh: { cnPrice: '中国售价', plPrice: '预估波兰落地价', from: '起', range: '续航', power: '功率', accel: '百公里加速', year: '年份', drive: '动力', seats: '座位',
      view3d: '3D 查看', calc: '计算进口成本', pick: '点击展示盒，就地展开版本、颜色和价格', onStage: '展示中', container: '展示盒', details: '详情',
      orderThis: '预订这台车', toOrder: '可预订', weeks: '12–16 周',
      ev: '纯电', phev: '插混', ice: '燃油',
      nav: ['订车', '现车', '售后', '联系我们'], quote: '进口计算器',
      brand: '品牌', model: '车型', yearSel: '年份', driveSel: '动力类型', all: '全部', any: '不限', search: '搜索',
      steps: [['选车', '选择车型、版本和颜色，立即看到含关税和增值税的价格。'], ['付定金', '签订波兰语合同并支付定金，我们向经销商下单。'], ['运输', '中国出口报关后发往波兰，海运、铁路或公路均可，每一步可追踪。'], ['提车', '12–16 周后提车，文件齐全，附检测报告。']],
      loadModel: '加载 3D 模型', exterior: '外观', interior: '内饰', drag: '拖动旋转 · 滚轮缩放', loading: '加载中', notLoaded: '仅在点击后才加载模型',
      trim: '版本', color: '颜色', colors: ['白色', '黑色', '灰色', '银色'], delivery: '交付',
      rows: { price: '中国车价', freight: '运输与保险', duty: '关税 10%', excise: '消费税', vat: '增值税 23%', fees: '认证与上牌', total: '波兰落地总价' },
      deposit: '支付定金预订', ratesNote: '金额仅供参考，最终价格以合同为准。',
      inPoland: '波兰现车 · 即提', finalPrice: '含税最终价', reserve: '预留', testDrive: '预约试驾',
      reserved: '即将上线', more: '查看全部',
      sec: { order: ['从中国订车', '选择车型、版本和颜色，立即看到含关税和增值税的价格。'], stock: ['现车', '已在波兰，几天内即可提车。'],
        aftersales: ['售后保障', '1–2 年售后服务。'], privacy: ['隐私与数据保护', '我们如何处理你的数据。'] },
      planned: { aftersales: ['每款车型的质保说明', '波兰合作维修网点', '配件与软件升级', '波兰语客服'], privacy: ['隐私政策', 'Cookie 说明', 'GDPR 权利', '数据控制者'] },
      footer: [['车辆', [['订车', 'index.html#zamow'], ['现车', 'index.html#od-reki'], ['全部车源', 'offers.html']]], ['服务', [['进口流程', 'index.html#jak-to-dziala'], ['订单追踪', 'tracking.html'], ['售后保障', 'index.html#gwarancja'], ['常见问题', 'index.html#faq']]], ['公司', [['联系我们', 'contact.html'], ['隐私政策', 'privacy.html'], ['Cookie', 'privacy.html#cookies'], ['服务条款', 'terms.html']]]] }
  };
  var LOCALE = { pl: 'pl-PL', en: 'en-GB', zh: 'zh-CN' };
  // all car data comes from data/cars.json, served as data/kontener-data.js (window.KT_DATA) and loaded before this bundle
  var DATA = (typeof window !== 'undefined' && window.KT_DATA) || {};
  var SAMPLE_CARS = DATA.boxes || [], SAMPLE_LISTINGS = DATA.listings || [], SAMPLE_STOCK = DATA.stock || [], SAMPLE_ORDERS = DATA.orders || [], COMPANY = DATA.company || {};
  var SAMPLE_CATALOG = DATA.catalog || [];
  if (!SAMPLE_CATALOG.length) SAMPLE_CATALOG = SAMPLE_LISTINGS;
  function t(lang) { return T[lang] || T.pl; }
  function money(n, lang) { if (n == null || !Number.isFinite(n)) return t(lang).askPrice; return new Intl.NumberFormat(LOCALE[lang] || 'pl-PL').format(n) + ' PLN'; }
  // Landed-cost estimate for a car, from the full import calculation (calcImport below).
  function estimate(car, rules) {
    var r = calcImport(pricingInput(car), rules);
    return Object.assign({}, r, { price: r.car, deposit: Math.round(r.total * 0.1 / 100) * 100 });
  }
  function boxOffer(box) {
    var prefix = (box.cipFrom || '').trim().toLowerCase();
    if (!prefix) return null;
    return SAMPLE_CATALOG.filter(function (c) {
      return Number.isFinite(c.priceCip) && c.priceCip > 0 && (c.brand + ' ' + c.model).toLowerCase().indexOf(prefix) === 0;
    }).sort(function (a, b) { return a.priceCip - b.priceCip; })[0] || null;
  }
  function boxPrice(box, rules) { var c = boxOffer(box); return c ? landedOf(c, rules) : null; }
  function isBox(c) { return Object.prototype.hasOwnProperty.call(c, 'cipFrom'); }
  function landed(c) { return landedOf(c); }
  function effectHref(c, lang) {
    var base = (window.KT_ASSETS || 'assets/').replace(/assets\/$/, '') + (lang === 'pl' ? '' : lang + '/');
    return boxOffer(c) ? base + (lang === 'pl' ? 'oferty.html' : 'offers.html') + '?q=' + encodeURIComponent(c.cipFrom)
      : base + 'index-galeria.html?car=' + encodeURIComponent(c.brand + ' ' + c.model) + '#kontakt';
  }
  function pricingRows(r, lang) {
    var s = t(lang), cs = s.calc.rows;
    return (r.basis === 'cip' ? [[s.cip, r.car], [s.freightExtra, r.freightExtra]] :
      [[cs.car, r.car], [cs.insurance, r.insurance], [cs.freight, r.freight]])
      .concat([[cs.duty, r.duty], [cs.cvd, r.cvd], [cs.excise, r.excise], [cs.port, r.port], [cs.vat, r.vat], [s.fixedFees, r.fees]]);
  }
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }

  // ---------- sample data (example values, not live offers) ----------

  // ---------- car line drawings, 240×90, wheels at x 58 / 182 ----------
  var BODIES = {
    sedan: { b: 'M16 72 L14 58 Q14 50 24 48 L52 46 Q66 34 80 30 L100 26 L140 26 Q156 28 172 44 L210 48 Q226 50 228 58 L228 68 L198 72 A16 16 0 0 0 166 72 L74 72 A16 16 0 0 0 42 72 Z',
      w: 'M58 46 L80 33 L138 31 L162 45 Z', l: 'M108 31 L108 46 M108 50 L108 70 M28 56 L212 56', hx: 220, hy: 52 },
    sport: { b: 'M16 70 L14 60 Q16 50 40 48 Q70 30 104 28 L128 28 Q150 30 172 44 L216 50 Q230 52 230 62 L228 70 L198 72 A16 16 0 0 0 166 72 L74 72 A16 16 0 0 0 42 72 Z',
      w: 'M58 46 Q80 34 104 32 L126 32 Q144 34 158 45 Z', l: 'M110 32 L110 45 M110 50 L112 68 M32 58 L214 58', hx: 222, hy: 54 },
    hatch: { b: 'M16 72 L14 56 Q14 34 34 26 L132 22 Q148 22 170 42 L210 46 Q226 48 226 58 L226 70 L198 72 A16 16 0 0 0 166 72 L74 72 A16 16 0 0 0 42 72 Z',
      w: 'M30 44 L40 30 L130 27 L158 43 Z', l: 'M94 28 L94 44 M94 48 L94 70 M24 55 L214 55', hx: 218, hy: 50 },
    suv: { b: 'M16 72 L12 44 Q12 24 26 21 L148 18 L178 40 L216 44 Q228 46 228 56 L228 70 L200 72 A18 18 0 0 0 164 72 L76 72 A18 18 0 0 0 40 72 Z',
      w: 'M22 40 L28 25 L146 23 L168 40 Z', l: 'M70 24 L70 40 M118 23 L118 40 M118 44 L118 70 M18 50 L220 50', hx: 220, hy: 48 },
    van: { b: 'M16 72 L14 30 Q14 18 28 17 L160 16 Q176 17 190 36 L218 44 Q228 46 228 56 L228 70 L200 72 A18 18 0 0 0 164 72 L76 72 A18 18 0 0 0 40 72 Z',
      w: 'M22 40 L24 24 L158 22 L180 40 Z', l: 'M64 23 L64 40 M108 22 L108 40 M146 22 L146 40 M108 44 L108 70 M18 50 L220 50', hx: 220, hy: 48 }
  };
  function spokes(cx0, cy0, r) {
    var out = '';
    for (var k = 0; k < 5; k++) {
      var a = (k * 72 - 90) * Math.PI / 180;
      out += 'M' + (cx0 + Math.cos(a) * r * 0.16).toFixed(2) + ' ' + (cy0 + Math.sin(a) * r * 0.16).toFixed(2) + 'L' + (cx0 + Math.cos(a) * r * 0.5).toFixed(2) + ' ' + (cy0 + Math.sin(a) * r * 0.5).toFixed(2);
    }
    return out;
  }
  var useId = React.useId || function () { var r = useRef('k' + Math.random().toString(36).slice(2, 8)); return r.current; };
  function CarSilhouette(p) {
    var d = BODIES[p.body] || BODIES.sedan;
    var big = p.body === 'suv' || p.body === 'van';
    var r = big ? 14 : 12;
    var id = 'ktg' + String(useId()).replace(/[^A-Za-z0-9_-]/g, '');
    return h('svg', { className: cx('kt-car', p.ghost && 'kt-car-ghost', p.className), viewBox: '0 0 240 90', role: p.title ? 'img' : undefined, 'aria-label': p.title, 'aria-hidden': p.title ? undefined : true },
      h('defs', null,
        h('linearGradient', { id: id + 'b', x1: 0, y1: 0, x2: 0, y2: 1 }, h('stop', { offset: '0', className: 's-hi' }), h('stop', { offset: '0.45', className: 's-mid' }), h('stop', { offset: '1', className: 's-lo' })),
        h('radialGradient', { id: id + 'h', cx: 0.4, cy: 0.35, r: 0.7 }, h('stop', { offset: '0', className: 's-hi' }), h('stop', { offset: '1', className: 's-lo' })),
        p.sheen ? h('clipPath', { id: id + 'c' }, h('path', { d: d.b })) : null,
        p.sheen ? h('linearGradient', { id: id + 's', x1: 0, y1: 0, x2: 1, y2: 0 }, h('stop', { offset: '0', className: 'sh-0' }), h('stop', { offset: '0.5', className: 'sh-1' }), h('stop', { offset: '1', className: 'sh-0' })) : null),
      h('path', { className: 'b', d: d.b, fill: p.ghost ? 'none' : 'url(#' + id + 'b)' }),
      h('path', { className: 'w', d: d.w }),
      h('path', { className: 'l', d: d.l }),
      h('rect', { className: 'h', x: d.hx, y: d.hy, width: 6, height: 2, rx: 1 }),
      [58, 182].map(function (x) {
        return h('g', { key: x, className: 'kt-wheel' }, h('circle', { className: 't', cx: x, cy: 72, r: r }), h('circle', { className: 'hub', cx: x, cy: 72, r: r * 0.55, fill: p.ghost ? 'none' : 'url(#' + id + 'h)' }),
          h('path', { className: 'sp', d: spokes(x, 72, r) }));
      }),
      p.sheen ? h('g', { key: 'sh' + p.sheen, className: 'kt-car-sheen', clipPath: 'url(#' + id + 'c)', 'aria-hidden': true },
        h('rect', { x: -70, y: -10, width: 46, height: 110, fill: 'url(#' + id + 's)' })) : null);
  }

  function Button(p) {
    var rest = Object.assign({}, p); delete rest.variant; delete rest.size; delete rest.arrow; delete rest.className;
    return h('button', Object.assign({ type: 'button' }, rest, { className: cx('kt-btn', 'kt-btn-' + (p.variant || 'outline'), p.size === 'sm' && 'kt-btn-sm', p.className) }),
      p.children, p.arrow ? h('span', { className: 'kt-arrow', 'aria-hidden': true }, '→') : null);
  }

  function DriveTag(p) {
    var d = p.drive || 'ev';
    var word = t(p.lang)[d];
    return h('span', { className: 'kt-tag kt-tag-' + d }, p.lang === 'zh' ? word + ' ' + d.toUpperCase() : word);
  }

  function LangSwitch(p) {
    var ref = useRef(null), box = useThumb(ref, p.value);
    return h('div', { ref: ref, className: cx('kt-lang', box && 'has-thumb'), role: 'group', 'aria-label': 'Język / Language / 语言' },
      thumb(box),
      LANGS.map(function (l) {
        return h('button', { key: l.id, type: 'button', lang: l.id, 'aria-pressed': p.value === l.id, onClick: function () { p.onChange && p.onChange(l.id); } }, l.label);
      }));
  }

  function LogoMark() {
    return h('svg', { className: 'kt-mark', viewBox: '0 0 32 32', 'aria-hidden': true },
      h('rect', { x: 2, y: 5, width: 28, height: 22, rx: 4 }),
      h('path', { d: 'M16 5v22M6 10v12M26 10v12M11 10v12M21 10v12' }),
      h('path', { className: 'kt-mark-door', d: 'M16 5l8 3v16l-8 3' }));
  }
  function BrandLogo(p) {
    p = p || {};
    var base = (window.KT_ASSETS || 'assets/') + 'brand/motorspace-pl-';
    var src = base + (p.print ? 'light' : 'dark') + (p.large ? '-wide.png' : '-nav.png');
    var props = { className: 'kt-brand-img', src: src, alt: 'MotorSpace.pl', width: p.large ? 2133 : 480, height: p.large ? 366 : 82, decoding: 'async' };
    if (!p.reveal) return h('img', props);
    return h('span', { className: 'kt-brand-reveal' }, h('img', props),
      h('img', Object.assign({}, props, { className: 'kt-brand-img kt-brand-fill', alt: '', 'aria-hidden': true })));
  }
  // a small calculator glyph for the nav button, so the calculator reads as one
  function CalcIcon() {
    return h('svg', { className: 'kt-calc-ico', width: 14, height: 14, viewBox: '0 0 14 14', 'aria-hidden': true },
      h('rect', { x: 1.5, y: 1, width: 11, height: 12, rx: 2.2, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
      h('rect', { x: 3.6, y: 3.1, width: 6.8, height: 2.3, rx: .6, fill: 'currentColor' }),
      h('circle', { cx: 4.6, cy: 8, r: .95, fill: 'currentColor' }), h('circle', { cx: 7, cy: 8, r: .95, fill: 'currentColor' }), h('circle', { cx: 9.4, cy: 8, r: .95, fill: 'currentColor' }),
      h('circle', { cx: 4.6, cy: 10.6, r: .95, fill: 'currentColor' }), h('circle', { cx: 7, cy: 10.6, r: .95, fill: 'currentColor' }), h('circle', { cx: 9.4, cy: 10.6, r: .95, fill: 'currentColor' }));
  }

  function NavBar(p) {
    var s = t(p.lang), ref = useRef(null), barRef = useRef(null);
    useEffect(function () {
      var el = ref.current, sp = scrollParent(el), raf = 0, target = sp === window ? window : sp;
      function frame() {
        raf = 0;
        var y = scrollTopOf(sp), max = (sp === window ? document.documentElement.scrollHeight - window.innerHeight : sp.scrollHeight - sp.clientHeight) || 1;
        el.classList.toggle('is-scrolled', y > 4);
        // over a dark section ([data-nav-dark]) the bar switches to the dark token set
        var nb = el.getBoundingClientRect().bottom - 1, dark = false;
        Array.prototype.forEach.call(document.querySelectorAll('[data-nav-dark]'), function (d) { var r = d.getBoundingClientRect(); if (r.top <= nb && r.bottom > nb) dark = true; });
        el.classList.toggle('kt-dark', dark);
        if (barRef.current) barRef.current.style.transform = 'scaleX(' + Math.min(1, Math.max(0, y / max)).toFixed(4) + ')';
      }
      function on() { if (!raf) raf = requestAnimationFrame(frame); }
      frame();
      target.addEventListener('scroll', on, { passive: true });
      return function () { target.removeEventListener('scroll', on); if (raf) cancelAnimationFrame(raf); };
    }, []);
    var ms = useState(false), menu = ms[0], setMenu = ms[1];
    useCJK(p.lang);
    return h('header', { ref: ref, className: 'kt kt-nav' },
      h('a', { className: 'kt-logo', href: p.home || '#', 'aria-label': 'MotorSpace' }, h(BrandLogo), h('span', null, 'CN → PL')),
      h('nav', { className: 'kt-nav-links' }, s.nav.map(function (n, i) {
        var l = p.links && p.links[i];
        return h('a', { key: i, href: typeof l === 'string' ? l : '#', onClick: typeof l === 'function' ? function (e) { e.preventDefault(); l(); } : undefined, 'aria-current': i === p.active ? 'page' : undefined }, n);
      })),
      h('div', { className: 'kt-nav-end' }, h(LangSwitch, { value: p.lang || 'pl', onChange: p.onLang }), h(Button, { variant: 'primary', size: 'sm', className: 'kt-nav-calc', onClick: function () { p.onQuote && p.onQuote(); } }, h(CalcIcon, null), s.quote),
        // phones: the calculator as an icon, everything else behind the menu button
        h('button', { type: 'button', className: 'kt-nav-ico kt-nav-mcalc', 'aria-label': s.quote, onClick: function () { p.onQuote && p.onQuote(); } }, h(CalcIcon, null)),
        h('button', { type: 'button', className: 'kt-nav-ico kt-nav-burger', 'aria-label': s.menu, 'aria-expanded': menu, onClick: function () { setMenu(true); } }, h('i'), h('i'))),
      h('span', { ref: barRef, className: 'kt-nav-progress', 'aria-hidden': true }),
      menu ? h(MobileMenu, Object.assign({}, p, { onClose: function () { setMenu(false); } })) : null);
  }

  // the phone menu: full screen, links big, then the calculator, order tracking, language and contact
  function MobileMenu(p) {
    var s = t(p.lang), ref = useRef(null);
    useEffect(function () {
      var prev = document.activeElement, root = document.documentElement, ov = root.style.overflow;
      root.style.overflow = 'hidden';
      var first = ref.current && ref.current.querySelector('.kt-sheet-close');
      if (first) first.focus({ preventScroll: true });
      function key(e) { if (e.key === 'Escape') { e.preventDefault(); p.onClose(); } }
      document.addEventListener('keydown', key);
      return function () { root.style.overflow = ov; document.removeEventListener('keydown', key); if (prev && prev.focus) prev.focus({ preventScroll: true }); };
    }, []);
    function go(l) {
      return function (e) {
        if (typeof l === 'function') { e.preventDefault(); p.onClose(); l(); return; }
        if (typeof l === 'string' && l.charAt(0) === '#') {
          e.preventDefault(); p.onClose();
          setTimeout(function () { var el = document.querySelector(l); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); try { history.replaceState(null, '', l); } catch (x) {} }, 40);
          return;
        }
        p.onClose();
      };
    }
    var tel = COMPANY.phone, mail = COMPANY.email, track = typeof window !== 'undefined' && window.KT_TRACK_URL;
    return ReactDOM.createPortal(
      h('div', { className: 'kt kt-dark kt-menu-wrap', onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose(); } },
        h('nav', { ref: ref, className: 'kt-menu', role: 'dialog', 'aria-modal': true, 'aria-label': s.menu },
          h('div', { className: 'kt-menu-top' },
            h('a', { className: 'kt-logo', href: p.home || '#', onClick: go(p.home || '#'), 'aria-label': 'MotorSpace' }, h(BrandLogo)),
            h('button', { type: 'button', className: 'kt-sheet-close', 'aria-label': s.menuClose, onClick: p.onClose }, '×')),
          h('ul', { className: 'kt-menu-links' }, s.nav.map(function (n, i) {
            var l = p.links && p.links[i];
            return h('li', { key: i, style: { '--i': i } }, h('a', { href: typeof l === 'string' ? l : '#', onClick: go(l) }, n, h('span', { 'aria-hidden': true }, '→')));
          })),
          h('div', { className: 'kt-menu-actions' },
            h(Button, { variant: 'primary', className: 'kt-btn-block', onClick: function () { p.onClose(); if (p.onQuote) p.onQuote(); } }, h(CalcIcon, null), s.quote),
            track ? h('a', { className: 'kt-btn kt-btn-outline kt-btn-block', href: track }, s.track) : null),
          h('div', { className: 'kt-menu-foot' },
            h('div', null, h('div', { className: 'kt-label' }, s.langL), h(LangSwitch, { value: p.lang || 'pl', onChange: function (x) { p.onClose(); if (p.onLang) p.onLang(x); } })),
            tel || mail ? h('div', { className: 'kt-menu-contact' }, h('div', { className: 'kt-label' }, s.contactH),
              tel ? h('a', { href: 'tel:' + String(tel).replace(/[^+0-9]/g, '') }, tel) : null,
              mail ? h('a', { href: 'mailto:' + mail }, mail) : null) : null))),
      document.body);
  }

  // Chinese pages pull in Noto Sans SC; the Polish and English pages never download it
  var CJK_CSS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600&display=swap';
  function useCJK(lang) {
    useEffect(function () {
      // the built site sets KT_LOCAL_FONTS and uses the system Chinese font (no request to Google); previews still fetch Noto Sans SC
      if (lang !== 'zh' || typeof document === 'undefined' || window.KT_LOCAL_FONTS || document.getElementById('kt-cjk')) return;
      var l = document.createElement('link'); l.id = 'kt-cjk'; l.rel = 'stylesheet'; l.href = CJK_CSS; document.head.appendChild(l);
    }, [lang]);
  }

  // ---------- legal pages: privacy (with cookies), terms, contact. Copy lives in data/legal.json, Polish is binding ----------
  function fillCo(x) {
    return String(x).replace(/\{(\w+)\}/g, function (m, k) { return COMPANY[k] != null && COMPANY[k] !== '' ? COMPANY[k] : m; });
  }
  function LegalPage(p) {
    var lang = p.lang || 'pl', L = (DATA.legal || {})[p.doc] || {}, d = L[lang] || L.pl || {}, updated = (DATA.legal || {}).updated;
    if (p.doc === 'contact') {
      var tel = COMPANY.phone, mail = COMPANY.email;
      return h('section', { className: 'kt kt-legal kt-contact', 'aria-labelledby': 'kt-legal-title' },
        h('header', { className: 'kt-legal-head' }, h('span', { className: 'kt-sechead-n' }, d.eyebrow), h('h1', { id: 'kt-legal-title' }, d.title), h('p', null, d.intro)),
        h('div', { className: 'kt-contact-grid' },
          tel ? h('a', { className: 'kt-contact-card', href: 'tel:' + String(tel).replace(/[^+0-9]/g, '') }, h('span', { className: 'kt-label' }, d.call), h('b', null, tel), h('span', { className: 'kt-arrow', 'aria-hidden': true }, '→')) : null,
          mail ? h('a', { className: 'kt-contact-card', href: 'mailto:' + mail }, h('span', { className: 'kt-label' }, d.mail), h('b', null, mail), h('span', { className: 'kt-arrow', 'aria-hidden': true }, '→')) : null,
          h('button', { type: 'button', className: 'kt-contact-card is-primary', onClick: p.onAsk }, h('span', { className: 'kt-label' }, d.write), h('b', null, t(lang).ask), h('span', { className: 'kt-arrow', 'aria-hidden': true }, '→'))),
        h('dl', { className: 'kt-contact-co' },
          h('div', null, h('dt', { className: 'kt-label' }, d.company), h('dd', null, COMPANY.legalName || COMPANY.name)),
          h('div', null, h('dt', { className: 'kt-label' }, d.address), h('dd', null, COMPANY.address)),
          h('div', null, h('dt', { className: 'kt-label' }, d.ids), h('dd', null, 'NIP ' + (COMPANY.nip || '—') + ' · ' + (COMPANY.register || '—'))),
          COMPANY.hours ? h('div', null, h('dt', { className: 'kt-label' }, d.hours), h('dd', null, typeof COMPANY.hours === 'object' ? (COMPANY.hours[lang] || COMPANY.hours.pl) : COMPANY.hours)) : null));
    }
    var secs = d.sections || [];
    return h('article', { className: 'kt kt-legal', 'aria-labelledby': 'kt-legal-title' },
      h('header', { className: 'kt-legal-head' },
        h('span', { className: 'kt-sechead-n' }, d.eyebrow),
        h('h1', { id: 'kt-legal-title' }, d.title),
        h('p', { className: 'kt-legal-meta' }, (d.updatedLabel || '') + ' ' + (updated || '') + (d.langNote ? ' · ' + d.langNote : '')),
        d.intro ? h('p', null, fillCo(d.intro)) : null),
      h('div', { className: 'kt-legal-body' },
        h('nav', { className: 'kt-legal-toc', 'aria-label': d.title }, h('ol', null, secs.map(function (x) { return h('li', { key: x.id }, h('a', { href: '#' + x.id }, x.h)); }))),
        h('div', { className: 'kt-legal-text' }, secs.map(function (x) {
          return h('section', { key: x.id, id: x.id },
            h('h2', null, x.h),
            (x.p || []).map(function (t2, i) { return h('p', { key: i }, fillCo(t2)); }),
            x.ul ? h('ul', null, x.ul.map(function (t2, i) { return h('li', { key: i }, fillCo(t2)); })) : null);
        }))));
  }

  // phones: a bar at the bottom with the two things people come for, the calculator and a question; it steps aside over the footer
  function MobileBar(p) {
    var s = t(p.lang), ref = useRef(null);
    useEffect(function () {
      var el = ref.current, sp = scrollParent(el), target = sp === window ? window : sp, raf = 0, after = p.after || 0;
      function frame() {
        raf = 0;
        var foot = document.querySelector('.kt-footer'), vh = viewportOf(sp);
        var overFoot = foot && foot.getBoundingClientRect().top < vh.top + vh.height - 24;
        el.classList.toggle('is-on', scrollTopOf(sp) > after && !overFoot);
      }
      function on() { if (!raf) raf = requestAnimationFrame(frame); }
      frame();
      target.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
      return function () { target.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
    }, []);
    return h('div', { ref: ref, className: 'kt kt-dark kt-mbar' },
      p.onCalc ? h('button', { type: 'button', className: 'kt-mbar-calc', onClick: p.onCalc }, h(CalcIcon, null), h('span', null, s.calcShort)) : null,
      h(Button, { variant: 'primary', arrow: true, onClick: p.onAsk }, p.label || s.ask));
  }

  // a sticky bar that steps aside once the real block it repeats (selector, inside the same dialog) scrolls into view
  function useStepAside(ref, selector) {
    useEffect(function () {
      var el = ref.current; if (!el || typeof IntersectionObserver === 'undefined') return;
      var host = el.closest('[role=dialog]') || document, target = host.querySelector(selector);
      if (!target) return;
      var io = new IntersectionObserver(function (es) { el.classList.toggle('is-off', es[0].isIntersecting); }, { threshold: 0.2 });
      io.observe(target);
      return function () { io.disconnect(); };
    });
  }

  // ---------- the hero: cars in boxes, one jumps out onto the stage ----------
  function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  function stop(el) { if (el && el.getAnimations) el.getAnimations().forEach(function (a) { a.cancel(); }); }

  // ---------- motion core: shared helpers for every effect (transform and opacity only) ----------
  var T3 = {
    pl: { close: 'Zamknij', mileageL: 'Przebieg', engine: 'Silnik', calcCost: 'Pełny koszt importu',
      journey: { eyebrow: 'Z Chin do Polski', title: '12–16 tygodni. Każdy etap widzisz na bieżąco.', weekLabel: 'Postęp dostawy', weekPre: 'Tydzień ', weekPost: ' / 16', points: ['Chiny', 'Umowa', 'W drodze', 'Polska'] } },
    en: { close: 'Close', mileageL: 'Mileage', engine: 'Engine', calcCost: 'Full import cost',
      journey: { eyebrow: 'From China to Poland', title: '12–16 weeks. You see every stage as it happens.', weekLabel: 'Delivery progress', weekPre: 'Week ', weekPost: ' / 16', points: ['China', 'Contract', 'In transit', 'Poland'] } },
    zh: { close: '关闭', mileageL: '里程', engine: '发动机', calcCost: '完整进口成本',
      journey: { eyebrow: '从中国到波兰', title: '12–16 周，每个环节实时可见。', weekLabel: '交付进度', weekPre: '第 ', weekPost: ' 周 / 16', points: ['中国', '签约', '运输中', '波兰'] } }
  };
  Object.keys(T3).forEach(function (k) { Object.assign(T[k], T3[k]); });

  function mq(q) { return !!(window.matchMedia && window.matchMedia(q).matches); }
  function finePointer() { return mq('(hover: hover) and (pointer: fine)'); }
  function scrollParent(el) {
    for (var n = el && el.parentElement; n && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      var o = getComputedStyle(n).overflowY;
      if (o === 'auto' || o === 'scroll') return n;
    }
    return window;
  }
  function scrollTopOf(sp) { return sp === window ? (window.scrollY || document.documentElement.scrollTop) : sp.scrollTop; }
  function viewportOf(sp) { return sp === window ? { top: 0, height: window.innerHeight } : { top: sp.getBoundingClientRect().top, height: sp.clientHeight }; }

  // A state change inside a View Transition where the browser has one (Chrome 111+, Safari 18+, Firefox 144+); a plain update elsewhere.
  function viewTransition(update) {
    if (!document.startViewTransition || reduced() || document.visibilityState !== 'visible') { update(); return; }
    try {
      var vt = document.startViewTransition(function () { window.ReactDOM.flushSync(update); });
      // a transition that is skipped (a newer one started) or aborted still applies the update; keep the console clean
      var quiet = function () {};
      vt.ready.catch(quiet); vt.finished.catch(quiet); if (vt.updateCallbackDone) vt.updateCallbackDone.catch(quiet);
    } catch (e) { update(); }
  }

  // Pointer-tracked light: sets --mx/--my (glare position) and --rx/--ry (tilt) on the element. Mouse and trackpad only.
  var NO_GLARE = {};
  // "21 aut" / "3 auta" / "1 auto": Polish counts change form by number; English has two forms; Chinese one
  function nWord(lang, n, w) {
    if (typeof w === 'string') return n + ' ' + w;
    if (lang === 'pl') { var m10 = n % 10, m100 = n % 100; return n + ' ' + (n === 1 ? w[0] : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) ? w[1] : w[2]); }
    return n + ' ' + (n === 1 ? w[0] : w[1]);
  }
  // "od 349 569 PLN" in Polish and English, "349 569 PLN 起" in Chinese
  function fromPrice(s, lang, amount) { if (amount == null) return s.askPrice; return lang === 'zh' ? money(amount, lang) + ' ' + s.from : s.from + ' ' + money(amount, lang); }
  function glare(tilt) {
    if (!finePointer() || reduced()) return NO_GLARE;
    return {
      onPointerMove: function (e) {
        var el = e.currentTarget, r = el.getBoundingClientRect(), st = el.style;
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        st.setProperty('--mx', (x * 100).toFixed(1) + '%');
        st.setProperty('--my', (y * 100).toFixed(1) + '%');
        st.setProperty('--rx', ((0.5 - y) * (tilt || 0)).toFixed(2) + 'deg');
        st.setProperty('--ry', ((x - 0.5) * (tilt || 0)).toFixed(2) + 'deg');
        if (!el.classList.contains('is-lit')) el.classList.add('is-lit');
      },
      onPointerLeave: function (e) {
        var el = e.currentTarget;
        el.classList.remove('is-lit');
        el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      }
    };
  }

  // The sliding thumb behind the pressed button of a segmented control.
  function useThumb(ref, key, on) {
    var bs = useState(null), box = bs[0], setBox = bs[1];
    useLayoutEffect(function () {
      var el = ref.current;
      if (!el || on === false) { setBox(null); return; }
      function measure() {
        var a = el.querySelector('[aria-pressed="true"]');
        var n = a ? { x: a.offsetLeft, y: a.offsetTop, w: a.offsetWidth, h: a.offsetHeight } : null;
        setBox(function (b) { return b && n && b.x === n.x && b.y === n.y && b.w === n.w && b.h === n.h ? b : n; });
      }
      measure();
      if (!window.ResizeObserver) return;
      var ro = new ResizeObserver(measure); ro.observe(el);
      return function () { ro.disconnect(); };
    }, [key, on]);
    return box;
  }
  function thumb(box) {
    return box ? h('span', { className: 'kt-thumb', 'aria-hidden': true, style: { width: box.w, height: box.h, transform: 'translate(' + box.x + 'px,' + box.y + 'px)' } }) : null;
  }

  // Scroll reveal: every [data-reveal] inside ref rises in once when it enters the viewport. Stagger with style --i.
  function useReveal(ref) {
    useEffect(function () {
      var root = ref && ref.current;
      if (!root || reduced() || !window.IntersectionObserver) return;
      root.classList.add('kt-motion');
      function all(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
      function scan() { all('[data-reveal]:not(.is-in)').forEach(function (e) { io.observe(e); }); }
      scan();
      var mo = new MutationObserver(scan); mo.observe(root, { childList: true, subtree: true });
      return function () { io.disconnect(); mo.disconnect(); };
    }, []);
  }

  // ---------- RollingNumber: odometer digits ----------
  var DIGITS = '0123456789'.split('').map(function (d) { return h('span', { key: d }, d); });
  function RollingNumber(p) {
    var lang = p.lang || 'pl';
    var text = (p.format ? p.format(p.value) : new Intl.NumberFormat(LOCALE[lang] || 'pl-PL').format(Math.round(p.value || 0))) + (p.suffix || '');
    var rs = useState(!p.rollIn || reduced()), ready = rs[0], setReady = rs[1];
    var ref = useRef(null), ws = useState(null), widths = ws[0], setWidths = ws[1];
    useEffect(function () {
      if (ready) return;
      // roll after the first painted frame; a background tab gets no frames, so a timer settles the number anyway
      var done = false, go = function () { if (!done) { done = true; setReady(true); } };
      var a = requestAnimationFrame(function () { a = requestAnimationFrame(go); }), to = setTimeout(go, 300);
      return function () { done = true; cancelAnimationFrame(a); clearTimeout(to); };
    }, []);
    // each slot takes the real (proportional) width of the digit it shows, so "105 764" never reads "1 05 764"
    useLayoutEffect(function () {
      var el = ref.current; if (!el) return;
      function measure() {
        var cs = getComputedStyle(el), fs = parseFloat(cs.fontSize) || 16, ls = parseFloat(cs.letterSpacing) || 0;
        var probe = document.createElement('span');
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font-size:100px;letter-spacing:' + (ls / fs * 100) + 'px';
        el.appendChild(probe);
        var w = '0123456789'.split('').map(function (d) { probe.textContent = d; return Math.round(probe.offsetWidth) / 100; });
        el.removeChild(probe);
        setWidths(function (prev) { return prev && prev.join() === w.join() ? prev : w; });
      }
      measure();
      if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(measure);
    }, []);
    var chars = text.split(''), n = chars.length;
    return h('span', { ref: ref, className: cx('kt-odo', p.className) },
      h('span', { className: 'kt-sr' }, text),
      h('span', { className: 'kt-odo-row', 'aria-hidden': true }, chars.map(function (ch, i) {
        var fromRight = n - i, d = ready ? +ch : 0, delay = (fromRight * 26) + 'ms';
        if (ch >= '0' && ch <= '9') {
          return h('span', { key: 'd' + fromRight, className: 'kt-odo-d', style: widths ? { width: widths[d] + 'em', transitionDelay: delay } : null },
            h('span', { className: 'kt-odo-strip', style: { '--d': d, transitionDelay: delay } }, DIGITS));
        }
        return h('span', { key: 'c' + fromRight + ch, className: 'kt-odo-c' }, ch);
      })));
  }

  // ---------- HeroTitle: lines rise out of a mask, the last one gets a brushed-metal sheen ----------
  function HeroTitle(p) {
    var lines = p.lines || [];
    return h(p.as || 'h1', { className: cx('kt kt-hero-title', p.className) }, lines.map(function (l, i) {
      return h('span', { key: i + l, className: cx('kt-line', i === lines.length - 1 && lines.length > 1 && p.sheen !== false && 'kt-line-sheen'), style: { '--i': i } },
        h('span', { className: 'kt-line-in' }, l));
    }));
  }

  // ---------- ImportJourney: pinned scroll story, the car travels China → Poland ----------
  var ROUTE = 'M40 150 C 210 150, 260 70, 420 80 S 640 168, 790 120 S 900 52, 960 56';
  var STOPS = [0, 0.3, 0.64, 1];
  function ImportJourney(p) {
    var lang = p.lang || 'pl', s = t(lang), J = s.journey;
    var top = p.top == null ? 60 : p.top, factor = p.length || 2;
    var secRef = useRef(null), pinRef = useRef(null), trackRef = useRef(null), pathRef = useRef(null), progRef = useRef(null), markRef = useRef(null);
    var ss = useState(0), stage = ss[0], setStage = ss[1];
    var ws = useState(0), week = ws[0], setWeek = ws[1];
    var vs = useState(0), vh = vs[0], setVh = vs[1];
    var ps = useState(null), pts = ps[0], setPts = ps[1];
    var still = useState(!!p.still || reduced())[0];

    useLayoutEffect(function () {
      var path = pathRef.current, len = path.getTotalLength(), prog = progRef.current;
      setPts(STOPS.map(function (f) { var q = path.getPointAtLength(len * f); return { x: q.x, y: q.y }; }));
      function place(pr) {
        var tr = trackRef.current, W = tr.clientWidth / 1000, H = tr.clientHeight / 200;
        var q = path.getPointAtLength(len * pr), q2 = path.getPointAtLength(Math.min(len, len * pr + 4)), q1 = path.getPointAtLength(Math.max(0, len * pr - 4));
        var ang = Math.atan2((q2.y - q1.y) * H, (q2.x - q1.x) * W) * 180 / Math.PI; // the car follows the slope of the road
        markRef.current.style.transform = 'translate3d(' + (q.x * W).toFixed(1) + 'px,' + (q.y * H).toFixed(1) + 'px,0) rotate(' + Math.max(-14, Math.min(14, ang)).toFixed(1) + 'deg)';
        prog.style.strokeDashoffset = (1000 * (1 - pr)).toFixed(1);
      }
      if (still) { place(1); setStage(STOPS.length - 1); setWeek(16); return; }
      var sec = secRef.current, sp = scrollParent(sec), raf = 0, target = sp === window ? window : sp;
      function frame() {
        raf = 0;
        var vp = viewportOf(sp), r = sec.getBoundingClientRect();
        var total = Math.max(1, sec.offsetHeight - pinRef.current.offsetHeight);
        var pr = Math.min(1, Math.max(0, (vp.top + top - r.top) / total));
        place(pr);
        var st = 0; for (var i = 0; i < STOPS.length; i++) if (pr >= STOPS[i] - 0.02) st = i;
        setStage(st); setWeek(Math.round(pr * 16));
      }
      function onScroll() { if (!raf) raf = requestAnimationFrame(frame); }
      function onResize() { setVh(viewportOf(sp).height); onScroll(); }
      onResize();
      target.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      return function () { target.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); if (raf) cancelAnimationFrame(raf); };
    }, []);

    var pinH = Math.max(560, (vh || 860) - top);
    return h('section', { ref: secRef, className: cx('kt kt-journey', still && 'is-still'), style: still ? null : { height: Math.round(pinH * factor) }, 'aria-label': J.eyebrow },
      h('div', { ref: pinRef, className: 'kt-journey-pin', style: still ? null : { top: top, height: pinH } },
        h('div', { className: 'kt-journey-head' },
          h('div', null, h('div', { className: 'kt-sechead-n' }, J.eyebrow), h('h2', null, J.title)),
          h('div', { className: 'kt-journey-week' },
            h('span', { className: 'kt-label' }, J.weekLabel),
            h('span', { className: 'kt-journey-wk' }, J.weekPre, h(RollingNumber, { value: week, format: String }), J.weekPost))),
        h('div', { ref: trackRef, className: 'kt-journey-track' },
          h('svg', { className: 'kt-journey-svg', viewBox: '0 0 1000 200', preserveAspectRatio: 'none', 'aria-hidden': true },
            h('path', { ref: pathRef, className: 'kt-route-base', d: ROUTE }),
            h('path', { ref: progRef, className: 'kt-route-prog', d: ROUTE, pathLength: 1000, style: { strokeDasharray: '1000 1000', strokeDashoffset: 1000 } })),
          (pts || []).map(function (q, i) {
            return h('div', { key: i, className: cx('kt-stop', stage >= i && 'is-on'), style: { left: (q.x / 10) + '%', top: (q.y / 2) + '%' } },
              h('span', { className: 'kt-stop-dot' }), h('span', { className: 'kt-stop-label' }, J.points[i]));
          }),
          h('div', { ref: markRef, className: cx('kt-journey-mark', stage === 2 && 'is-boxed'), 'aria-hidden': true },
            h('div', { className: 'kt-journey-car' }, h('span', { className: 'kt-journey-case' }), h(CarSilhouette, { body: p.body || 'suv' })))),
        h('ol', { className: 'kt-journey-steps' }, s.steps.map(function (x, i) {
          return h('li', { key: i, className: cx(i === stage && 'is-active', i < stage && 'is-done') },
            h('span', { className: 'kt-step-n' }, i + 1), h('h3', null, x[0]), h('p', null, x[1]));
        }))));
  }

  // ---------- CarDetailSheet: the card's car morphs into this sheet (shared View Transition name) ----------
  function CarDetailSheet(p) {
    var c = p.car, lang = p.lang || 'pl', s = t(lang);
    var closeRef = useRef(null);
    var photos = useState(0), photoIndex = photos[0], setPhotoIndex = photos[1];
    useEffect(function () { setPhotoIndex(0); }, [c && c.id]);
    useEffect(function () {
      if (!c) return;
      var prev = document.activeElement;
      if (closeRef.current) closeRef.current.focus({ preventScroll: true });
      function key(e) { if (e.key === 'Escape') { e.preventDefault(); p.onClose && p.onClose(); } }
      document.addEventListener('keydown', key);
      return function () { document.removeEventListener('keydown', key); if (prev && prev.focus) prev.focus({ preventScroll: true }); };
    }, [c && c.id]);
    if (!c) return null;
    var multi = c.images && c.images.length > 1;
    var photo = multi ? (c.images[photoIndex] || c.images[0]) : null;
    var pricedCar = isBox(c) ? boxOffer(c) : c;
    var r = pricedCar ? calcImport(pricingInput(pricedCar)) : null;
    var total = landedOf(c);
    if (r && total != null) r.total = total;
    var nf = new Intl.NumberFormat(LOCALE[lang]);
    var specs = [[s.year, c.year], [s.mileageL, typeof c.km === 'number' ? nf.format(c.km) + ' km' : (c.km || '—')],
      [s.range, c.range ? (typeof c.range === 'number' ? c.range + ' km' : c.range) : '—'], [s.seats, c.seats || '—'],
      [s.engine, c.cc ? (c.cc / 1000).toFixed(1).replace('.', lang === 'pl' ? ',' : '.') + ' l' : 'EV'], [s.driveSel, s[c.drive]]];
    return h('div', { className: 'kt kt-sheet-wrap', onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose && p.onClose(); } },
      h('div', { className: 'kt-sheet', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'kt-sheet-title' },
        h('button', { ref: closeRef, type: 'button', className: 'kt-sheet-close', 'aria-label': s.close, onClick: p.onClose }, '×'),
        h('div', { className: 'kt-sheet-scroll' },
        h('div', { className: 'kt-sheet-stage' },
          h('div', { className: 'kt-label kt-sheet-status' }, c.status === 'stock' ? s.inPoland + (c.location ? ' · ' + c.location : '') : s.toOrder + ' · ' + s.weeks),
          h('div', { className: 'kt-sheet-car', style: { viewTransitionName: p.vtName || 'none' } },
            h(CarImage, { car: c, sheen: c.id, image: photo }),
            h('div', { className: 'kt-stage-refl', 'aria-hidden': true }, h(CarImage, { car: c, alt: '', image: photo }))),
        multi ? h('div', { className: 'kt-sheet-thumbs', role: 'group', 'aria-label': s.details, style: { position: 'absolute', bottom: 12, left: 20, right: 20, display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0' } }, c.images.slice(0, 6).map(function (image, i) {
          return h('button', { key: image, type: 'button', 'aria-pressed': photoIndex === i, 'aria-label': s.details + ' ' + (i + 1), onClick: function () { setPhotoIndex(i); }, style: { flexShrink: 0, padding: 3, border: '2px solid ' + (photoIndex === i ? 'var(--ink)' : 'transparent'), borderRadius: 8, background: 'var(--paper-raised)', cursor: 'pointer' } },
            h('img', { src: (window.KT_ASSETS || 'assets/').replace(/assets\/$/, '') + ((c.imagesSmall || [])[i] || image), alt: c.brand + ' ' + c.model + ' · ' + (i + 1), width: 88, height: 66, loading: 'lazy', style: { display: 'block', objectFit: 'cover', borderRadius: 4 } }));
        })) : null),
        h('div', { className: 'kt-sheet-info' },
          h('div', { className: 'kt-label' }, c.brand + ' · ' + c.year),
          h('h2', { id: 'kt-sheet-title' }, c.model),
          h('div', null, h(DriveTag, { drive: c.drive, lang: lang })),
          h('dl', { className: 'kt-specs kt-specs-3' }, specs.map(function (x) { return h('div', { key: x[0] }, h('dt', { className: 'kt-label' }, x[0]), h('dd', null, x[1])); })),
          h('div', null,
            h('div', { className: 'kt-label' }, s.landed),
            h('div', { className: 'kt-price' }, total == null ? s.askPrice : h(RollingNumber, { value: total, lang: lang, suffix: ' PLN', rollIn: true })),
            c.priceFinal != null || total == null ? null : h('dl', { className: 'kt-cost' }, pricingRows(r, lang).concat([[s.calc.total, r.total]]).map(function (row) {
              return h('div', { key: row[0] }, h('dt', null, row[0]), h('dd', null, money(row[1], lang)));
            }))),
          h('div', { className: 'kt-stage-actions' },
            h(Button, { variant: 'primary', arrow: true, onClick: function () { p.onOrder && p.onOrder(c); } }, s.orderThis),
            total == null ? null : h(Button, { variant: 'outline', onClick: function () { p.onCalc && p.onCalc(c); } }, s.calcCost))),
        h(StickyBuy, { label: s.landed, total: total, lang: lang, cta: s.orderShort, watch: '.kt-stage-actions', onClick: function () { p.onOrder && p.onOrder(c); } }))));
  }

  function StickyBuy(p) {
    var ref = useRef(null);
    useStepAside(ref, p.watch);
    // a zero-height sticky anchor; the visible bar hangs above it, so it never adds space at the end of the dialog
    return h('div', { ref: ref, className: 'kt-buybar' }, h('div', { className: 'kt-buybar-in' },
      h('div', null, h('span', { className: 'kt-label' }, p.label), h('b', null, money(p.total, p.lang))),
      h(Button, { variant: 'primary', arrow: true, onClick: p.onClick }, p.cta)));
  }

  // ---------- Kontener 3D: procedural concept cars, acrylic cases and a studio (three.js r147, passed in at call time) ----------
  // Units are metres. The car faces +x, y is up, z is the width.
  var K3 = (function () {
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function sstep(e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }

    // monotone cubic interpolation through [x, y] keys (Fritsch–Carlson): a smooth line that never overshoots
    function curve(keys) {
      var n = keys.length, xs = keys.map(function (k) { return k[0]; }), ys = keys.map(function (k) { return k[1]; });
      var d = [], m = [];
      for (var i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
      m[0] = d[0]; m[n - 1] = d[n - 2];
      for (i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
      for (i = 0; i < n - 1; i++) {
        if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
        var a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
        if (s > 9) { var tau = 3 / Math.sqrt(s); m[i] = tau * a * d[i]; m[i + 1] = tau * b * d[i]; }
      }
      return function (x) {
        if (x <= xs[0]) return ys[0];
        if (x >= xs[n - 1]) return ys[n - 1];
        var i = 0; while (x > xs[i + 1]) i++;
        var hh = xs[i + 1] - xs[i], t = (x - xs[i]) / hh, t2 = t * t, t3 = t2 * t;
        return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * hh * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * hh * m[i + 1];
      };
    }

    // ---- body types: lines along the car, from the rear (−x) to the front (+x) ----
    var TYPES = {
      sport: { L: 4.95, W: 1.96, wheelR: 0.36, axles: [-1.47, 1.53], rocker: 0.17,
        top: [[-2.48, 0.62], [-2.40, 0.90], [-2.15, 0.97], [-1.6, 0.95], [-0.6, 0.90], [0.6, 0.86], [1.25, 0.84], [1.9, 0.76], [2.35, 0.66], [2.5, 0.52]],
        bottom: [[-2.48, 0.40], [-2.35, 0.27], [2.30, 0.24], [2.5, 0.36]],
        half: [[-2.48, 0.72], [-2.2, 0.93], [-1.4, 0.98], [1.2, 0.98], [2.0, 0.93], [2.5, 0.70]],
        cabin: [-2.0, 1.12], roof: [[-2.0, 0.0], [-1.65, 0.22], [-0.9, 0.46], [-0.25, 0.54], [0.25, 0.50], [0.75, 0.30], [1.12, 0.0]], cabinHalf: 0.80 },
      sedan: { L: 4.85, W: 1.92, wheelR: 0.355, axles: [-1.45, 1.47], rocker: 0.17,
        top: [[-2.43, 0.64], [-2.36, 0.94], [-2.05, 1.00], [-1.5, 0.98], [-0.6, 0.92], [0.6, 0.88], [1.2, 0.86], [1.85, 0.78], [2.3, 0.68], [2.43, 0.52]],
        bottom: [[-2.43, 0.40], [-2.30, 0.27], [2.25, 0.24], [2.43, 0.36]],
        half: [[-2.43, 0.74], [-2.15, 0.92], [-1.4, 0.96], [1.2, 0.96], [1.95, 0.92], [2.43, 0.70]],
        cabin: [-1.75, 1.08], roof: [[-1.75, 0.0], [-1.45, 0.26], [-0.8, 0.52], [-0.2, 0.58], [0.3, 0.55], [0.75, 0.32], [1.08, 0.0]], cabinHalf: 0.79 },
      hatch: { L: 4.97, W: 2.0, wheelR: 0.36, axles: [-1.50, 1.50], rocker: 0.18,
        top: [[-2.48, 0.66], [-2.44, 0.95], [-2.2, 1.00], [-1.4, 0.96], [-0.5, 0.92], [0.6, 0.88], [1.2, 0.86], [1.85, 0.78], [2.32, 0.68], [2.48, 0.52]],
        bottom: [[-2.48, 0.42], [-2.35, 0.28], [2.30, 0.25], [2.48, 0.37]],
        half: [[-2.48, 0.80], [-2.2, 0.96], [-1.4, 1.0], [1.2, 1.0], [1.95, 0.95], [2.48, 0.72]],
        cabin: [-2.42, 1.08], roof: [[-2.42, 0.0], [-2.25, 0.30], [-1.7, 0.44], [-0.6, 0.50], [0.2, 0.50], [0.7, 0.32], [1.08, 0.0]], cabinHalf: 0.81, roofPaint: true },
      suv: { L: 5.05, W: 2.0, wheelR: 0.40, axles: [-1.55, 1.55], rocker: 0.25,
        top: [[-2.52, 0.72], [-2.5, 1.08], [-2.3, 1.13], [-1.4, 1.12], [-0.4, 1.10], [0.6, 1.08], [1.25, 1.06], [1.95, 0.99], [2.4, 0.90], [2.55, 0.70]],
        bottom: [[-2.52, 0.48], [-2.40, 0.33], [2.35, 0.32], [2.55, 0.44]],
        half: [[-2.52, 0.84], [-2.25, 0.98], [-1.4, 1.0], [1.2, 1.0], [2.0, 0.96], [2.55, 0.80]],
        cabin: [-2.47, 1.18], roof: [[-2.47, 0.0], [-2.42, 0.42], [-2.1, 0.62], [-0.8, 0.66], [0.3, 0.64], [0.8, 0.40], [1.18, 0.0]], cabinHalf: 0.84, roofPaint: true },
      van: { L: 5.25, W: 2.0, wheelR: 0.39, axles: [-1.55, 1.55], rocker: 0.22,
        top: [[-2.62, 0.70], [-2.6, 1.02], [-2.4, 1.06], [-1.4, 1.06], [0, 1.05], [1.1, 1.04], [1.6, 1.02], [2.15, 0.94], [2.52, 0.84], [2.64, 0.64]],
        bottom: [[-2.62, 0.46], [-2.50, 0.31], [2.45, 0.30], [2.64, 0.42]],
        half: [[-2.62, 0.86], [-2.35, 0.99], [-1.4, 1.0], [1.4, 1.0], [2.1, 0.96], [2.64, 0.80]],
        cabin: [-2.58, 1.62], roof: [[-2.58, 0.0], [-2.56, 0.70], [-2.3, 0.86], [-0.5, 0.90], [0.6, 0.88], [1.15, 0.62], [1.62, 0.0]], cabinHalf: 0.86, roofPaint: true }
    };

    // cross-section: a superellipse that is squarer below (tucked rocker) and rounder above (shoulder into the hood/roof).
    // w may be a number or a function of py (−1 bottom … 1 top), so fenders can flare over the wheels.
    function section(w, yb, yt, n, k, out, taperTop, nTop, crown) {
      var yc = (yt + yb) / 2, hh = Math.max(0.0005, (yt - yb) / 2);
      for (var j = 0; j < k; j++) {
        var th = -Math.PI / 2 + (j / k) * Math.PI * 2, c = Math.cos(th), s = Math.sin(th), e = s > 0 && nTop ? nTop : n;
        var px = Math.sign(c) * Math.pow(Math.abs(c), 2 / e), py = Math.sign(s) * Math.pow(Math.abs(s), 2 / e);
        var ww = (typeof w === 'function' ? w(py) : w) * (taperTop ? 1 - taperTop * (py * 0.5 + 0.5) : 1);
        var y = yc + py * hh + (crown && py > 0 ? crown * (1 - px * px) * py : 0);
        out.push(px * ww, y);
      }
    }

    // loft: rings of k points at stations along x → a closed, smooth, indexed mesh
    function loft(THREE, xs, ringFn, k) {
      var pos = [], idx = [], n = xs.length;
      for (var i = 0; i < n; i++) {
        var ring = ringFn(xs[i], i);
        for (var j = 0; j < k; j++) pos.push(xs[i], ring[j * 2 + 1], ring[j * 2]);
      }
      for (i = 0; i < n - 1; i++) for (j = 0; j < k; j++) {
        var a = i * k + j, b = i * k + (j + 1) % k, c = (i + 1) * k + j, d = (i + 1) * k + (j + 1) % k;
        idx.push(a, c, b, b, c, d);
      }
      // caps: fan from the centre of the first and last ring
      [0, n - 1].forEach(function (i0, e) {
        var cx = 0, cy = 0, cz = 0;
        for (var j = 0; j < k; j++) { cx += pos[(i0 * k + j) * 3]; cy += pos[(i0 * k + j) * 3 + 1]; cz += pos[(i0 * k + j) * 3 + 2]; }
        var ci = pos.length / 3; pos.push(cx / k, cy / k, cz / k);
        for (j = 0; j < k; j++) { var p = i0 * k + j, q = i0 * k + (j + 1) % k; if (e === 0) idx.push(ci, p, q); else idx.push(ci, q, p); }
      });
      var g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      return g;
    }

    function stations(a, b, n) { // denser near both ends, so noses and tails round off smoothly
      var out = [];
      for (var i = 0; i <= n; i++) { var t = i / n; out.push(a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * t))); }
      return out;
    }

    var PAINTS = {
      silver: { color: '#c9ccd1', metalness: 0.92, roughness: 0.38 },
      graphite: { color: '#4a4d54', metalness: 0.9, roughness: 0.4 },
      white: { color: '#f3f3f1', metalness: 0.05, roughness: 0.45 },
      black: { color: '#060708', metalness: 0.35, roughness: 0.3 }
    };

    var MATS = null;
    function materials(THREE) {
      if (MATS) return MATS;
      MATS = {
        glass: new THREE.MeshPhysicalMaterial({ color: 0x040506, metalness: 0, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 0.75 }),
        trim: new THREE.MeshStandardMaterial({ color: 0x141518, metalness: 0.3, roughness: 0.55 }),
        tire: new THREE.MeshStandardMaterial({ color: 0x111113, metalness: 0, roughness: 0.82 }),
        rim: new THREE.MeshStandardMaterial({ color: 0xc9ccd1, metalness: 1, roughness: 0.22 }),
        disc: new THREE.MeshStandardMaterial({ color: 0x55585e, metalness: 0.9, roughness: 0.45 }),
        light: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.2, roughness: 0.3 }),
        tail: new THREE.MeshStandardMaterial({ color: 0x5a0d0d, emissive: 0xff2a2a, emissiveIntensity: 1.2, roughness: 0.3 }),
        shadow: null
      };
      return MATS;
    }
    function paint(THREE, name) {
      var p = PAINTS[name] || PAINTS.silver;
      return new THREE.MeshPhysicalMaterial({ color: p.color, metalness: p.metalness, roughness: p.roughness, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.0 });
    }

    function shadowTexture(THREE) {
      var c = document.createElement('canvas'); c.width = c.height = 128;
      var x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
      g.addColorStop(0, 'rgba(0,0,0,0.85)'); g.addColorStop(0.45, 'rgba(0,0,0,0.42)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128);
      var t = new THREE.CanvasTexture(c); return t;
    }

    function wheel(THREE, M, R, width, outward, lo) {
      lo = !!lo;
      var g = new THREE.Group();
      var tire = new THREE.Mesh(new THREE.TorusGeometry(R - 0.085, 0.085, lo ? 10 : 18, lo ? 28 : 48), M.tire);
      tire.scale.set(1, 1, width / 0.17); g.add(tire);
      // rim: a disc with five rounded windows, extruded
      var rr = R - 0.115, s = new THREE.Shape(); s.absarc(0, 0, rr, 0, Math.PI * 2, false);
      for (var k = 0; k < 5; k++) {
        var a0 = k * Math.PI * 2 / 5 + 0.18, a1 = a0 + Math.PI * 2 / 5 - 0.36, hole = new THREE.Path();
        hole.absarc(0, 0, rr * 0.82, a0, a1, false); hole.absarc(0, 0, rr * 0.36, a1, a0, true); s.holes.push(hole);
      }
      var rim = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: lo ? 1 : 2, curveSegments: lo ? 12 : 24 }), M.rim);
      rim.position.z = outward * (width / 2 - 0.05) - (outward < 0 ? 0.035 : 0); g.add(rim);
      var disc = new THREE.Mesh(new THREE.CylinderGeometry(rr * 0.8, rr * 0.8, 0.03, 32), M.disc);
      disc.rotation.x = Math.PI / 2; disc.position.z = outward * 0.02; g.add(disc);
      return g;
    }

    function makeCar(THREE, opt) {
      opt = opt || {};
      var T = TYPES[opt.body] || TYPES.sport, M = materials(THREE), body = paint(THREE, opt.paint);
      var car = new THREE.Group(); car.name = 'car-' + (opt.body || 'sport');
      var top = curve(T.top), bot = curve(T.bottom), half = curve(T.half), L2 = T.L / 2, R = T.wheelR, AR = R + 0.075;
      function bottom(x) { // rocker line with wheel arches
        var y = bot(x);
        T.axles.forEach(function (ax) { var d = Math.abs(x - ax); if (d < AR) y = Math.max(y, R + Math.sqrt(AR * AR - d * d) * 0.98); });
        return y;
      }
      var lo = opt.lod === 'low', K = lo ? 32 : 48, xs = stations(-L2, L2, lo ? 64 : 120);
      function flare(x) { var f = 0; T.axles.forEach(function (ax, i) { var d = (x - ax) / 0.62; f = Math.max(f, Math.exp(-d * d) * (i === 0 ? 0.045 : 0.03)); }); return f; }
      var bodyGeo = loft(THREE, xs, function (x) {
        var out = [], yt = top(x), yb = bottom(x), w = half(x) * T.W / 2 - 0.03, fl = flare(x);
        var endR = Math.min(sstep(L2, L2 - 0.13, x), sstep(-L2, -L2 + 0.13, x)); // round off the very nose and tail
        var w2 = w * (0.7 + 0.3 * endR), yb2 = yb + (1 - endR) * (yt - yb) * 0.35, yt2 = yt - (1 - endR) * (yt - yb) * 0.25;
        // widest at the shoulder, tucked in at the rocker, haunches over the wheels
        section(function (py) { return w2 * (1 - 0.06 * sstep(-0.2, -1, py)) + fl * sstep(-0.9, -0.1, py) * sstep(0.7, 0.1, py); },
          yb2, yt2, 5.0, K, out, 0.07, 3.2, 0.015 * endR);
        return out;
      }, K);
      var bodyMesh = new THREE.Mesh(bodyGeo, body); bodyMesh.name = 'body'; car.add(bodyMesh);

      // cabin (all glass, the "floating roof" look): lofted between the cowl and the rear glass
      var c0 = T.cabin[0], c1 = T.cabin[1], roof = curve(T.roof), cxs = stations(c0, c1, lo ? 40 : 70);
      var cabGeo = loft(THREE, cxs, function (x) {
        var base = top(x) - 0.03, hgt = Math.max(0.004, roof(x)), w = Math.min(T.cabinHalf, half(x) * T.W / 2 - 0.13);
        var out = []; section(w, base - 0.03, base + hgt, 4.0, lo ? 24 : 36, out, 0.26, 3.6, 0.02); return out;
      }, lo ? 24 : 36);
      var cab = new THREE.Mesh(cabGeo, M.glass); cab.name = 'cabin'; car.add(cab);
      if (T.roofPaint) { // a painted roof over glass sides, for the bigger bodies
        var rmax = 0; cxs.forEach(function (x) { rmax = Math.max(rmax, roof(x)); });
        var span = cxs.filter(function (x) { return roof(x) > rmax * 0.86; });
        var roofGeo = loft(THREE, stations(span[0], span[span.length - 1], 40), function (x) {
          var base = top(x) - 0.03, yr = base + roof(x), w = Math.min(T.cabinHalf, half(x) * T.W / 2 - 0.13) * (1 - 0.26) + 0.02;
          var out = []; section(w, yr - 0.06, yr + 0.018, 4.0, 28, out, 0.08, 2.6, 0.01); return out;
        }, 28);
        var rf = new THREE.Mesh(roofGeo, body); rf.name = 'roof'; car.add(rf);
      }

      // light bars front and rear, a dark lower intake
      var fx = L2 - 0.06, fy = top(L2 - 0.15) - 0.05;
      var fl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.022, T.W * 0.56), M.light); fl.position.set(fx, fy, 0); car.add(fl);
      var rl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.028, T.W * 0.6), M.tail); rl.position.set(-L2 + 0.02, top(-L2 + 0.15) - 0.07, 0); car.add(rl);
      var intake = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.10, T.W * 0.5), M.trim); intake.position.set(L2 - 0.03, bot(L2 - 0.1) + 0.1, 0); car.add(intake);
      // wheels
      var wheels = [], track = T.W / 2 - 0.205, tw = 0.25;
      T.axles.forEach(function (ax) {
        [-1, 1].forEach(function (sd) {
          var wh = wheel(THREE, M, R, tw, sd, lo); wh.position.set(ax, R, sd * track); car.add(wh); wheels.push(wh);
        });
      });
      // soft contact shadow
      var sh = new THREE.Mesh(new THREE.PlaneGeometry(T.L * 1.18, T.W * 1.55), new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, depthWrite: false, opacity: 0.7 }));
      sh.rotation.x = -Math.PI / 2; sh.position.y = 0.004; sh.name = 'shadow'; car.add(sh);
      car.userData = { wheels: wheels, length: T.L, width: T.W, wheelR: R, paint: body };
      return car;
    }

    // spin the wheels by a distance travelled (metres)
    function rollWheels(car, dist) {
      var R = car.userData.wheelR || 0.36;
      car.userData.wheels.forEach(function (w) { w.rotation.z -= (w.userData.spin || 1) * dist / R; });
    }

    // ---------- cars modelled in Blender (.glb): materials matched by name, wheels by node name ----------
    var MODELS = {};
    function glbMaterial(THREE, m) {
      var n = (m && m.name || '').toLowerCase(), P = THREE.MeshPhysicalMaterial, S = THREE.MeshStandardMaterial;
      switch (n) {
        case 'glass': return new P({ name: n, color: 0x07090b, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.6, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.2, depthWrite: false });
        case 'chrome': return new S({ name: n, color: 0xe8eaed, metalness: 1, roughness: 0.1, envMapIntensity: 1.4 });
        case 'accent': return new P({ name: n, color: 0xd6d8db, metalness: 0.85, roughness: 0.24, clearcoat: 1, clearcoatRoughness: 0.03 });
        case 'trim_gloss': case 'lens': return new P({ name: n, color: 0x060607, metalness: 0, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 0.9 });
        case 'tail_lens': return new P({ name: n, color: 0x1c0607, metalness: 0, roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 });
        case 'trim_matte': return new S({ name: n, color: 0x0e0e10, metalness: 0, roughness: 0.7 });
        case 'tire': return new S({ name: n, color: 0x0d0d0e, metalness: 0, roughness: 0.88 });
        case 'rim_black': return new S({ name: n, color: 0x0f0f11, metalness: 0.5, roughness: 0.38 });
        case 'rim_silver': return new S({ name: n, color: 0xd9dbde, metalness: 1, roughness: 0.2 });
        case 'brake': return new S({ name: n, color: 0x55585e, metalness: 0.9, roughness: 0.45 });
        case 'light_white': return new THREE.MeshBasicMaterial({ name: n, color: 0xffffff });
        case 'light_red': return new THREE.MeshBasicMaterial({ name: n, color: 0xff2a20 });
        case 'leather': return new S({ name: n, color: 0x9c6436, metalness: 0, roughness: 0.6 });
        case 'interior_dark': return new S({ name: n, color: 0x161618, metalness: 0, roughness: 0.75 });
        case 'screen': return new S({ name: n, color: 0x050607, emissive: 0x5a6578, emissiveIntensity: 0.35, roughness: 0.1 });
        default: return m; // 'paint' (swapped per car) and anything unknown keep what the file has
      }
    }
    function prepModel(THREE, root) {
      var made = {};
      root.traverse(function (o) {
        if (!o.isMesh) return;
        var nm = (o.material && o.material.name) || '';
        if (!made[nm]) made[nm] = glbMaterial(THREE, o.material);
        o.material = made[nm];
        if (nm === 'glass') o.renderOrder = 2;
      });
      var box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3());
      if (size.z > size.x) root.rotation.y = Math.PI / 2; // modelled along z: turn it to face +x like ours
      root.updateMatrixWorld(true); box.setFromObject(root);
      // stand it on its tyres when the file names its wheels (a stray part below the car cannot lift it)
      var ground = box.min.y, tyres = new THREE.Box3();
      root.traverse(function (o) { if (/^wheel_/i.test(o.name)) tyres.expandByObject(o); });
      if (!tyres.isEmpty()) ground = tyres.min.y;
      var c = box.getCenter(new THREE.Vector3()), holder = new THREE.Group();
      root.position.set(-c.x, -ground, -c.z); holder.add(root);
      holder.userData = { length: Math.max(size.x, size.z), width: Math.min(size.x, size.z), height: size.y };
      return holder;
    }
    // one download per file, shared by the showroom, the viewer and the detail sheet
    // Draco-compressed .glb files (Blender export with --draco, ~13x smaller) need the decoder; it is fetched once, on the first model
    var DRACO = null;
    function gltfLoader(THREE) {
      var loader = new THREE.GLTFLoader();
      if (THREE.DRACOLoader) {
        if (!DRACO) {
          DRACO = new THREE.DRACOLoader();
          DRACO.setDecoderPath((typeof window !== 'undefined' && window.KT_DRACO) || 'https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/libs/draco/gltf/');
        }
        loader.setDRACOLoader(DRACO);
      }
      return loader;
    }
    function loadModel(THREE, url) {
      if (!url || !THREE.GLTFLoader) return Promise.reject(new Error('GLTFLoader missing'));
      if (!MODELS[url]) {
        MODELS[url] = new Promise(function (ok, bad) {
          gltfLoader(THREE).load(url, function (g) { ok(prepModel(THREE, g.scene)); }, undefined, function (e) { delete MODELS[url]; bad(e); });
        });
      }
      return MODELS[url];
    }
    // a scene-ready copy: its own paint, wheels that roll the right way, a contact shadow
    function modelInstance(THREE, tpl, paintName) {
      var car = tpl.clone(true), wheels = [], body = paint(THREE, paintName || 'black'), wr = 0.36;
      car.traverse(function (o) {
        if (/^wheel_/i.test(o.name)) wheels.push(o);
        if (o.isMesh && o.material && o.material.name === 'paint') o.material = body;
      });
      car.updateMatrixWorld(true);
      wheels.forEach(function (w) {
        w.userData.spin = new THREE.Vector3(0, 0, 1).transformDirection(w.matrixWorld).z < 0 ? -1 : 1;
        var b = new THREE.Box3().setFromObject(w); wr = (b.max.y - b.min.y) / 2;
      });
      var u = tpl.userData, sh = new THREE.Mesh(new THREE.PlaneGeometry(u.length * 1.18, u.width * 1.55), new THREE.MeshBasicMaterial({ map: shadowTexture(THREE), transparent: true, depthWrite: false, opacity: 0.75 }));
      sh.rotation.x = -Math.PI / 2; sh.position.y = 0.004; sh.name = 'shadow'; car.add(sh);
      car.userData = { wheels: wheels, length: u.length, width: u.width, wheelR: wr, paint: body, model: true };
      return car;
    }

    // a clear acrylic display case with a lid and a brushed-metal plinth
    function makeCase(THREE, size, dark) {
      size = size || { w: 1.7, h: 0.72, d: 1.0 };
      var g = new THREE.Group();
      var acrylic = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, transparent: true, opacity: dark ? 0.05 : 0.14, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false });
      var edge = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 });
      var RB = THREE.RoundedBoxGeometry;
      var walls = new THREE.Mesh(RB ? new RB(size.w, size.h, size.d, 4, 0.05) : new THREE.BoxGeometry(size.w, size.h, size.d), acrylic);
      walls.position.y = 0.08 + size.h / 2; walls.renderOrder = 2; g.add(walls);
      var lines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(size.w, size.h, size.d)), edge);
      lines.position.copy(walls.position); g.add(lines);
      var lidPivot = new THREE.Group(); lidPivot.position.set(0, 0.08 + size.h, -size.d / 2); g.add(lidPivot);
      var lid = new THREE.Mesh(RB ? new RB(size.w + 0.04, 0.05, size.d + 0.04, 3, 0.02) : new THREE.BoxGeometry(size.w + 0.04, 0.05, size.d + 0.04), acrylic.clone());
      lid.material.opacity = 0.22; lid.position.set(0, 0.025, size.d / 2); lid.renderOrder = 3; lidPivot.add(lid);
      var plinth = new THREE.Mesh(RB ? new RB(size.w + 0.08, 0.08, size.d + 0.08, 3, 0.02) : new THREE.BoxGeometry(size.w + 0.08, 0.08, size.d + 0.08),
        new THREE.MeshStandardMaterial({ color: 0xd2d4d8, metalness: 1, roughness: 0.32 }));
      plinth.position.y = 0.04; g.add(plinth);
      g.userData = { lid: lidPivot, walls: walls, size: size, floorY: 0.08 };
      return g;
    }

    function studioEnvironment(THREE) {
      var env = new THREE.Scene();
      var room = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: 0x1b1c1f, side: THREE.BackSide }));
      env.add(room);
      var floor = new THREE.Mesh(new THREE.CircleGeometry(30, 32), new THREE.MeshBasicMaterial({ color: 0x3a3b3f }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -0.5; env.add(floor);
      function box(w, h, x, y, z, ry, rx, k) {
        var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
        m.material.color.setScalar(k); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); m.lookAt(0, 1, 0); env.add(m);
      }
      box(14, 5, 0, 9, 0, 0, 0, 5.5);        // big overhead softbox
      box(16, 0.9, 0, 3.2, 9, 0, 0, 7);      // long front strip
      box(16, 0.9, 0, 3.2, -9, 0, 0, 5);     // long back strip
      box(1.2, 7, 10, 3, 2, 0, 0, 4.5);      // side strips
      box(1.2, 7, -10, 3, -2, 0, 0, 3.5);
      box(6, 3, 7, 5, 7, 0, 0, 3);           // key panel, front right
      return env;
    }

    function makeStudio(THREE, renderer) {
      var scene = new THREE.Scene();
      var pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(studioEnvironment(THREE), 0.02).texture;
      var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(4, 8, 6); scene.add(key);
      var rim = new THREE.DirectionalLight(0xffffff, 0.6); rim.position.set(-6, 4, -6); scene.add(rim);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8a8a, 0.35));
      return scene;
    }

    function makeRenderer(THREE, canvas, dpr) {
      var r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false });
      r.setPixelRatio(Math.min(dpr || window.devicePixelRatio || 1, 2));
      r.outputEncoding = THREE.sRGBEncoding; r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
      r.setClearColor(0x000000, 0);
      return r;
    }


    // ---------- the showroom: six acrylic cases and a turntable podium ----------
    function disposeTree(o) {
      o.traverse(function (n) { if (n.geometry) n.geometry.dispose(); if (n.material) { (Array.isArray(n.material) ? n.material : [n.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); } });
    }
    function spring(o, key, target, dt, k, c) { // damped spring on o[key] towards target; returns true while still moving
      var v = o['_v' + key] || 0, x = o[key], a = -k * (x - target) - c * v;
      v += a * dt; x += v * dt; o[key] = x; o['_v' + key] = v;
      return Math.abs(v) > 1e-4 || Math.abs(x - target) > 1e-4;
    }
    function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function makeShowroom(THREE, canvas, opt) {
      var renderer = makeRenderer(THREE, canvas, opt.dpr || 1.75), scene = makeStudio(THREE, renderer);
      var camera = new THREE.PerspectiveCamera(opt.fov || 32, 2, 0.1, 100);
      var CAM = { pos: new THREE.Vector3().fromArray(opt.camPos || [0, 6.4, 15.6]), target: new THREE.Vector3().fromArray(opt.camTarget || [0, 1.55, 1.6]) };
      var colors = opt.colors || {}, MINI = 0.3, HERO = opt.heroScale || 1.12, reduced = !!opt.reduced;
      // podium
      var podium = new THREE.Group(); podium.position.fromArray(opt.podiumPos || [-2.35, 0, 0.7]); scene.add(podium);
      var disc = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.06, 0.14, 96),
        new THREE.MeshPhysicalMaterial({ color: colors.podium || 0x111214, metalness: 0, roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.18, envMapIntensity: 0.45 }));
      disc.position.y = 0.07; podium.add(disc);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(3.03, 0.014, 8, 128), new THREE.MeshStandardMaterial({ color: 0xd4d6da, metalness: 1, roughness: 0.25 }));
      ring.rotation.x = Math.PI / 2; ring.position.y = 0.14; podium.add(ring);
      var turn = new THREE.Group(); turn.position.y = 0.14; podium.add(turn);
      var glow = new THREE.Mesh(new THREE.RingGeometry(2.55, 2.7, 128), new THREE.MeshBasicMaterial({ color: colors.glow || 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
      glow.rotation.x = -Math.PI / 2; glow.position.y = 0.146; podium.add(glow);
      // cases with their miniatures
      var n = opt.cars.length, cases = [], cars = [], heroes = [], hits = [];
      opt.cars.forEach(function (c, i) {
        var cs = makeCase(THREE, null, opt.dark); cs.position.set((i - (n - 1) / 2) * 2.08, 0, 4.7); scene.add(cs);
        cs.children.forEach(function (m) { if (m.isLineSegments) { m.material = m.material.clone(); m.material.color.set(colors.edge || 0xffffff); } });
        var car = makeCar(THREE, { body: c.body, paint: c.paint, lod: 'low' }); car.scale.setScalar(MINI); car.position.set(0, cs.userData.floorY, 0); cs.add(car);
        cs.userData.lift = 0; cs.userData.lidAngle = 0; cs.userData.index = i;
        cs.traverse(function (m) { if (m.isMesh) { m.userData.caseIndex = i; hits.push(m); } });
        cases.push(cs); cars.push(car);
      });
      var sel = -1, hover = -1, flights = [], last = performance.now(), raf = 0, alive = true, visible = true;
      // cars with a Blender model (.glb): the procedural stand-in is swapped as soon as the file arrives
      var models = [];
      opt.cars.forEach(function (c, i) {
        if (!c.src) return;
        loadModel(THREE, c.src).then(function (tpl) { if (!alive) return; models[i] = tpl; swapMini(i); wake(); }, function () {});
      });
      function swapMini(i) {
        var cs = cases[i], old = cars[i], m = modelInstance(THREE, models[i], opt.cars[i].paint);
        m.scale.setScalar(MINI); m.position.copy(old.position); m.rotation.copy(old.rotation); m.visible = old.visible;
        cs.remove(old); old.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
        cs.add(m); cars[i] = m;
        hits = []; cases.forEach(function (c2, k) { c2.traverse(function (o) { if (o.isMesh) { o.userData.caseIndex = k; hits.push(o); } }); });
        var hc = heroes[i];
        if (hc && !hc.userData.model) {
          if (hc.parent === turn) {
            var nh = modelInstance(THREE, models[i], opt.cars[i].paint); nh.userData.mini = m;
            nh.position.copy(hc.position); nh.rotation.copy(hc.rotation); nh.scale.copy(hc.scale); turn.remove(hc); turn.add(nh); heroes[i] = nh;
          } else if (!hc.parent) heroes[i] = null;
          else hc.userData.stale = true;
        }
      }
      // resolves when car i's model is in (or after ms), so the intro can wait for the real car
      function ready(i, ms) {
        var c = opt.cars[i];
        if (!c || !c.src) return Promise.resolve();
        return Promise.race([loadModel(THREE, c.src).then(function () {}, function () {}), new Promise(function (ok) { setTimeout(ok, ms || 2500); })]);
      }
      var par = { x: 0, y: 0, tx: 0, ty: 0 }, bounce = { y: 0, v: 0 }, glowT = 0;
      var tmpV = new THREE.Vector3(), tmpQ = new THREE.Quaternion();

      function caseHome(i) { var cs = cases[i]; return cs.localToWorld(new THREE.Vector3(0, cs.userData.floorY, 0)); }
      function fly(car, toFn, dur, arc, twist, done) {
        car.updateMatrixWorld(); scene.attach(car);
        var f = { car: car, from: car.position.clone(), fromS: car.scale.x, fromYaw: car.rotation.y, toFn: toFn, dur: dur, arc: arc, twist: twist, t: 0, done: done, last: car.position.clone() };
        flights = flights.filter(function (o) { return o.car !== car; }); flights.push(f);
        if (reduced) { f.t = dur; }
      }
      // the miniature stays in its case; a high-detail twin makes the trip to the podium and back
      function hero(i) {
        if (heroes[i] && heroes[i].userData.stale && !heroes[i].parent) heroes[i] = null;
        if (!heroes[i]) {
          heroes[i] = models[i] ? modelInstance(THREE, models[i], opt.cars[i].paint) : makeCar(THREE, { body: opt.cars[i].body, paint: opt.cars[i].paint });
          heroes[i].userData.mini = cars[i];
        }
        return heroes[i];
      }
      function select(i) {
        if (i === sel || i < 0 || i >= n) return;
        var prev = sel; sel = i;
        if (prev >= 0) {
          var ph = hero(prev);
          fly(ph, function () { return { pos: caseHome(prev), s: MINI, yaw: 0 }; }, 0.95, 1.5, -0.35, function () {
            scene.remove(ph); cars[prev].visible = true;
            if (sel !== prev) cases[prev].userData.open = false;
          });
        }
        cases[i].userData.open = true;
        later(function () {
          if (!alive || sel !== i) return;
          var hc = hero(i), mini = cars[i];
          mini.updateMatrixWorld(); hc.position.setFromMatrixPosition(mini.matrixWorld); hc.rotation.set(0, 0, 0); hc.scale.setScalar(MINI);
          scene.add(hc); mini.visible = false;
          fly(hc, function () { turn.updateMatrixWorld(); return { pos: turn.localToWorld(new THREE.Vector3()), s: HERO, yaw: turn.rotation.y }; }, 1.15, 2.6, 0.5, function () {
            turn.attach(hc); hc.position.set(0, 0, 0); hc.rotation.set(0, 0, 0); hc.scale.setScalar(HERO);
            bounce.v = -1.2; glowT = 1;
          });
        }, 160);
        wake();
      }
      function step(f, dt) {
        f.t = Math.min(f.dur, f.t + dt);
        var p = f.t / f.dur, e = easeInOut(p), to = f.toFn();
        f.car.position.lerpVectors(f.from, to.pos, e); f.car.position.y += Math.sin(Math.PI * p) * f.arc;
        f.car.scale.setScalar(f.fromS + (to.s - f.fromS) * easeOut(p));
        f.car.rotation.y = f.fromYaw + (to.yaw - f.fromYaw) * e + Math.sin(Math.PI * p) * f.twist;
        var d = f.car.position.distanceTo(f.last); f.last.copy(f.car.position); rollWheels(f.car, d * 1.6 / Math.max(0.3, f.car.scale.x));
        if (p >= 1) { f.done && f.done(); return false; }
        return true;
      }
      function resize() {
        var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      function project(out) { // where each case sits on screen (for the HTML labels under them)
        var w = canvas.clientWidth, h = canvas.clientHeight;
        cases.forEach(function (cs, i) {
          tmpV.set(0, -0.02, cs.userData.size.d / 2 + 0.25); cs.localToWorld(tmpV); tmpV.project(camera);
          out[i] = { x: (tmpV.x + 1) / 2 * w, y: (1 - tmpV.y) / 2 * h };
        });
        return out;
      }
      var labelPos = [];
      function frame(now) {
        raf = 0; if (!alive) return;
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        var moving = update(dt);
        renderer.render(scene, camera);
        if (opt.onFrame) opt.onFrame(project(labelPos));
        if (moving && visible) raf = requestAnimationFrame(frame);
      }
      function update(dt) {
        var moving = false;
        clock += dt;
        if (pending.length) { var due = pending.filter(function (p) { return p.at <= clock; }); pending = pending.filter(function (p) { return p.at > clock; }); due.forEach(function (p) { p.fn(); }); moving = true; }
        // camera parallax follows the pointer, softly
        par.x += (par.tx - par.x) * Math.min(1, dt * 4); par.y += (par.ty - par.y) * Math.min(1, dt * 4);
        camera.position.set(CAM.pos.x + par.x * 0.6, CAM.pos.y + par.y * 0.3, CAM.pos.z); camera.lookAt(CAM.target);
        if (Math.abs(par.tx - par.x) > 1e-3 || Math.abs(par.ty - par.y) > 1e-3) moving = true;
        if (!reduced) { turn.rotation.y += dt * 0.22; moving = true; }
        flights = flights.filter(function (f) { return step(f, dt); }); if (flights.length) moving = true;
        cases.forEach(function (cs, i) {
          var ud = cs.userData, lidTarget = ud.open ? -0.95 : 0, liftTarget = i === hover && i !== sel ? 0.08 : 0;
          if (spring(ud, 'lidAngle', lidTarget, dt, 90, 13)) moving = true;
          if (spring(ud, 'lift', liftTarget, dt, 160, 18)) moving = true;
          ud.lid.rotation.x = ud.lidAngle; cs.position.y = ud.lift;
        });
        if (bounce.v || bounce.y) { bounce.v += (-160 * bounce.y - 14 * bounce.v) * dt; bounce.y += bounce.v * dt; if (Math.abs(bounce.v) < 1e-3 && Math.abs(bounce.y) < 1e-4) { bounce.v = 0; bounce.y = 0; } turn.position.y = 0.14 + bounce.y * 0.05; moving = true; }
        if (glowT > 0) { glowT = Math.max(0, glowT - dt * 0.9); glow.material.opacity = Math.sin(glowT * Math.PI) * 0.55; glow.scale.setScalar(1 + (1 - glowT) * 0.12); moving = true; }
        return moving;
      }
      var pending = []; // timers that should also run when the scene is stepped by hand
      function later(fn, ms) { if (reduced || !ms) { fn(); return; } pending.push({ fn: fn, at: clock + ms / 1000 }); }
      var clock = 0;
      function wake() { if (!raf && alive && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } }
      var ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
      function pick(e) {
        var r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera); var hit = ray.intersectObjects(hits, false)[0];
        return hit ? hit.object.userData.caseIndex : -1;
      }
      function onMove(e) {
        var r = canvas.getBoundingClientRect();
        par.tx = ((e.clientX - r.left) / r.width - 0.5) * (reduced ? 0 : 1); par.ty = ((e.clientY - r.top) / r.height - 0.5) * (reduced ? 0 : -1);
        var i = pick(e); if (i !== hover) { hover = i; canvas.style.cursor = i >= 0 ? 'pointer' : ''; opt.onHover && opt.onHover(i); }
        wake();
      }
      function onLeave() { par.tx = 0; par.ty = 0; if (hover !== -1) { hover = -1; opt.onHover && opt.onHover(-1); } canvas.style.cursor = ''; wake(); }
      function onClick(e) { var i = pick(e); if (i >= 0) opt.onSelect && opt.onSelect(i); }
      canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerleave', onLeave); canvas.addEventListener('click', onClick);
      var ro = window.ResizeObserver ? new ResizeObserver(function () { resize(); wake(); }) : null; if (ro) ro.observe(canvas);
      var io = window.IntersectionObserver ? new IntersectionObserver(function (es) { visible = es[0].isIntersecting && !document.hidden; if (visible) wake(); }) : null; if (io) io.observe(canvas);
      function onVis() { visible = !document.hidden; if (visible) wake(); }
      document.addEventListener('visibilitychange', onVis);
      resize(); wake();
      return {
        select: select, wake: wake, scene: scene, renderer: renderer, ready: ready,
        advance: function (sec) { var steps = Math.round(sec * 60); for (var k = 0; k < steps; k++) update(1 / 60); renderer.render(scene, camera); if (opt.onFrame) opt.onFrame(project(labelPos)); },
        hover: function (i) { hover = i; wake(); },
        dispose: function () {
          alive = false; if (raf) cancelAnimationFrame(raf);
          canvas.removeEventListener('pointermove', onMove); canvas.removeEventListener('pointerleave', onLeave); canvas.removeEventListener('click', onClick);
          if (ro) ro.disconnect(); if (io) io.disconnect(); document.removeEventListener('visibilitychange', onVis);
          disposeTree(scene); heroes.forEach(function (hc) { if (hc && !hc.parent) disposeTree(hc); }); renderer.dispose();
        }
      };
    }

    // ---------- a single car you can turn: drag with inertia, slow turntable when idle ----------
    function makeViewer(THREE, canvas, opt) {
      var renderer = makeRenderer(THREE, canvas, opt.dpr || 2), scene = makeStudio(THREE, renderer);
      var camera = new THREE.PerspectiveCamera(26, 2, 0.1, 100), reduced = !!opt.reduced;
      var stage = new THREE.Group(); scene.add(stage);
      var disc = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.06, 0.1, 96), new THREE.MeshPhysicalMaterial({ color: (opt.colors && opt.colors.podium) || 0x111214, roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.18, envMapIntensity: 0.45 }));
      disc.position.y = -0.05; scene.add(disc);
      var car = makeCar(THREE, { body: opt.body, paint: opt.paint }); stage.add(car);
      if (opt.src && THREE.GLTFLoader) {
        loadModel(THREE, opt.src).then(function (tpl) {
          if (!alive) return;
          var m = modelInstance(THREE, tpl, opt.paint);
          m.scale.setScalar((opt.length || 4.9) / tpl.userData.length);
          stage.remove(car); car.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); stage.add(m); car = m; wake();
          opt.onLoad && opt.onLoad(m);
        }, function (err) { opt.onError && opt.onError(err); });
      }
      var yaw = opt.yaw == null ? -0.65 : opt.yaw, vel = reduced ? 0 : 0.25, drag = null, raf = 0, alive = true, last = performance.now(), idleSince = 0, pitch = 0.2;
      function resize() { var w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
      function frame(now) {
        raf = 0; if (!alive) return;
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!drag) { if (!reduced && now - idleSince > 2500) vel += (0.22 - vel) * Math.min(1, dt * 0.8); else vel *= Math.pow(0.08, dt); yaw += vel * dt; }
        stage.rotation.y = yaw;
        var d = 10.5; camera.position.set(0, 1.15 + Math.sin(pitch) * d, Math.cos(pitch) * d); camera.lookAt(0, 0.62, 0);
        renderer.render(scene, camera);
        if (opt.onAngle) opt.onAngle(((yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));
        if (drag || Math.abs(vel) > 1e-3 || !reduced) raf = requestAnimationFrame(frame);
      }
      function wake() { if (!raf && alive) { last = performance.now(); raf = requestAnimationFrame(frame); } }
      function down(e) { drag = { x: e.clientX, y: e.clientY, t: performance.now() }; canvas.setPointerCapture(e.pointerId); vel = 0; wake(); }
      function move(e) {
        if (!drag) return;
        var now = performance.now(), dx = e.clientX - drag.x, dtt = Math.max(1, now - drag.t) / 1000;
        var dy = e.clientY - drag.y; pitch = Math.max(0.02, Math.min(0.55, pitch + dy * 0.003));
        yaw += dx * 0.008; vel = dx * 0.008 / dtt; drag.x = e.clientX; drag.y = e.clientY; drag.t = now; idleSince = now; wake();
      }
      function up() { drag = null; idleSince = performance.now(); wake(); }
      function key(e) { if (e.key === 'ArrowLeft') { vel -= 1.2; idleSince = performance.now(); wake(); } if (e.key === 'ArrowRight') { vel += 1.2; idleSince = performance.now(); wake(); } }
      canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('keydown', key);
      var ro = window.ResizeObserver ? new ResizeObserver(function () { resize(); wake(); }) : null; if (ro) ro.observe(canvas);
      resize(); wake();
      return { dispose: function () { alive = false; if (raf) cancelAnimationFrame(raf); if (ro) ro.disconnect(); canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('keydown', key); disposeTree(scene); renderer.dispose(); },
        spin: function (v) { vel = v; idleSince = performance.now(); wake(); } };
    }

    return { TYPES: TYPES, PAINTS: PAINTS, makeCar: makeCar, makeCase: makeCase, makeStudio: makeStudio, makeRenderer: makeRenderer, rollWheels: rollWheels, makeShowroom: makeShowroom, makeViewer: makeViewer };
  })();

  // ---------- three.js components: the page loads three.js (r147) and passes window.THREE as `three` ----------
  var T4 = {
    pl: { pick3d: 'Kliknij gablotę — auto wskoczy na podest', drag360: 'Przeciągnij, aby obrócić o 360°', model3d: 'Model koncepcyjny 3D' },
    en: { pick3d: 'Click a case — the car jumps onto the turntable', drag360: 'Drag to turn it 360°', model3d: '3D concept model' },
    zh: { pick3d: '点击展示盒，车会跳上转台', drag360: '拖动旋转 360°', model3d: '3D 概念模型' }
  };
  Object.keys(T4).forEach(function (k) { Object.assign(T[k], T4[k]); });
  var PAINT_ORDER = ['silver', 'graphite', 'white', 'black', 'white', 'graphite'];
  function paintFor(c, i) {
    if (c.paint) return c.paint;
    if (i != null) return PAINT_ORDER[i % PAINT_ORDER.length];
    var hsum = 0; String(c.id || c.model || '').split('').forEach(function (ch) { hsum = (hsum * 31 + ch.charCodeAt(0)) >>> 0; });
    return PAINT_ORDER[hsum % 4];
  }
  function themeIsDark(el) {
    var c = getComputedStyle(el).getPropertyValue('--paper').trim(), m = /^#?([0-9a-f]{6})$/i.exec(c);
    if (!m) return false;
    var n = parseInt(m[1], 16); return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) < 90;
  }
  // a device that should get the 3D layer: WebGL, not reduced motion, not data saver, a large enough screen
  function can3D(minWidth) {
    if (reduced()) return false;
    if (navigator.connection && navigator.connection.saveData) return false;
    if (window.innerWidth < (minWidth || 900)) return false;
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }

  function stageInfo(car, sel, lang, p) {
    var s = t(lang);
    return h('div', { key: car.id + lang, className: 'kt-fade', style: { display: 'flex', flexDirection: 'column', gap: 24, flex: 1 } },
      h('div', null,
        h('div', { className: 'kt-label kt-brand' }, car.brand + ' · ' + car.year + ' · ' + s.toOrder),
        h('h2', null, car.model),
        h('div', { style: { marginTop: 12 } }, h(DriveTag, { drive: car.drive, lang: lang }))),
      h('dl', { className: 'kt-specs' },
        [[s.range, car.range], [s.power, car.power], [s.accel, car.accel], [s.seats, car.seats]].map(function (r) {
          return h('div', { key: r[0] }, h('dt', { className: 'kt-label' }, r[0]), h('dd', null, r[1]));
        })),
      h('div', null,
        h('div', { className: 'kt-price' }, landed(car) == null ? s.askPrice : h(RollingNumber, { value: landed(car), lang: lang, suffix: ' PLN', rollIn: true })),
        h('div', { className: 'kt-price-sub' }, landed(car) == null ? '' : s.landed)),
      h('div', { className: 'kt-stage-actions' },
        h(Button, { variant: 'primary', arrow: true, onClick: function () { p.onOrder && p.onOrder(car); } }, s.orderThis),
        h(Button, { variant: 'outline', onClick: function () { p.onView3D && p.onView3D(car); } }, s.view3d)));
  }

  // Showroom3D: six acrylic cases and a black turntable; a click lifts the lid and the car jumps onto the podium
  function Showroom3D(p) {
    var THREE = p.three, cars = p.cars || SAMPLE_CARS, lang = p.lang || 'pl', s = t(lang);
    var wrapRef = useRef(null), canvasRef = useRef(null), engRef = useRef(null), labelRefs = useRef([]);
    var ss = useState(null), sel = ss[0], setSel = ss[1];
    var hs = useState(-1), hover = hs[0], setHover = hs[1], selRef = useRef(null);
    function pick(i) { selRef.current = i; setSel(i); if (engRef.current) engRef.current.select(i); p.onSelect && p.onSelect(cars[i], i); }
    useEffect(function () {
      if (!THREE) return;
      var dark = themeIsDark(wrapRef.current), cs = getComputedStyle(wrapRef.current);
      var eng = K3.makeShowroom(THREE, canvasRef.current, {
        cars: cars.map(function (c, i) { return { body: c.body, paint: paintFor(c, i), src: c.glb && p.assets != null ? p.assets + c.glb : (c.src || null) }; }),
        colors: { podium: dark ? 0x232326 : 0x111214, edge: new THREE.Color(cs.getPropertyValue('--line-strong').trim() || '#86868b'), glow: 0xffffff },
        dark: dark, reduced: reduced(),
        onSelect: function (i) { pick(i); },
        onHover: function (i) { setHover(i); },
        onFrame: function (pos) {
          for (var i = 0; i < pos.length; i++) { var el = labelRefs.current[i]; if (el) el.style.transform = 'translate(' + Math.round(pos[i].x) + 'px,' + Math.round(pos[i].y) + 'px)'; }
        }
      });
      engRef.current = eng; wrapRef.current.__engine = eng; // handle for tests and frame export
      var init = p.initial == null ? 0 : p.initial, id = 0, live = true;
      // the intro waits (up to 2.6 s) for the first car's model; it never overrides a visitor's own pick
      if (init >= 0) id = setTimeout(function () { eng.ready(init, 2600).then(function () { if (live && selRef.current == null) pick(init); }); }, p.introDelay == null ? 600 : p.introDelay);
      return function () { live = false; clearTimeout(id); eng.dispose(); engRef.current = null; };
    }, [THREE]);
    var car = sel == null ? null : cars[sel];
    function hov(i) { return function () { if (engRef.current) engRef.current.hover(i); setHover(i); }; }
    return h('section', { ref: wrapRef, className: 'kt kt-show3d', 'aria-label': s.container },
      h('canvas', { ref: canvasRef, className: 'kt-show3d-canvas', 'aria-hidden': true }),
      h('span', { className: 'kt-label kt-show3d-idx' }, car ? s.onStage + ' · ' + String(sel + 1).padStart(2, '0') + ' · ' + s.model3d : s.model3d),
      h('div', { className: 'kt-show3d-info kt-stage-info', 'aria-live': 'polite' }, car ? stageInfo(car, sel, lang, p) : null),
      h('div', { className: 'kt-show3d-labels' }, cars.map(function (c, i) {
        return h('button', { key: c.id, type: 'button', ref: function (el) { labelRefs.current[i] = el; }, className: cx('kt-show3d-label', i === sel && 'is-open', i === hover && 'is-hover'),
          'aria-pressed': i === sel, onClick: function () { pick(i); }, onMouseEnter: hov(i), onMouseLeave: hov(-1), onFocus: hov(i), onBlur: hov(-1) },
          h('span', { className: 'kt-show3d-chip' },
            h('span', { className: 'kt-show3d-n' }, String(i + 1).padStart(2, '0')),
            h('span', { className: 'kt-show3d-name' }, c.brand + ' ' + c.model),
            h('span', { className: 'kt-show3d-price' }, fromPrice(s, lang, landed(c)))));
      })),
      h('span', { className: 'kt-label kt-show3d-hint' }, s.pick3d));
  }

  // Car3DView: one car on a turntable you can drag; inertia, arrow keys, a slow spin when left alone
  function Car3DView(p) {
    var THREE = p.three, lang = p.lang || 'pl', s = t(lang);
    var wrapRef = useRef(null), canvasRef = useRef(null), dialRef = useRef(null);
    useEffect(function () {
      if (!THREE) return;
      var dark = themeIsDark(wrapRef.current);
      var eng = K3.makeViewer(THREE, canvasRef.current, { body: p.body, paint: p.paint, src: p.src, length: p.length, reduced: reduced(), colors: { podium: p.podium != null ? p.podium : dark ? 0x232326 : 0x111214 }, onLoad: p.onLoad, onError: p.onError,
        onAngle: function (a) { if (dialRef.current) dialRef.current.style.transform = 'rotate(' + (a * 180 / Math.PI).toFixed(1) + 'deg)'; } });
      return function () { eng.dispose(); };
    }, [THREE, p.body, p.paint, p.src]);
    return h('div', { ref: wrapRef, className: cx('kt kt-car3d', p.className) },
      h('canvas', { ref: canvasRef, className: 'kt-car3d-canvas', tabIndex: 0, role: 'img', 'aria-label': (p.title ? p.title + ' · ' : '') + s.drag360 }),
      h('div', { className: 'kt-car3d-foot' },
        h('span', { className: 'kt-car3d-dial', 'aria-hidden': true }, h('i', { ref: dialRef })),
        h('span', { className: 'kt-label' }, s.drag360)));
  }

  // ---------- CarBoxGarage: glossy display cases; a click zooms the case open in place, into the configurator ----------
  function CarBoxGarage(p) {
    var cars = p.cars || SAMPLE_CARS;
    var lang = p.lang || 'pl';
    var s = t(lang);
    var init = p.initial == null ? -1 : p.initial;
    var st = useState(init >= 0 && init < cars.length ? init : null), sel = st[0], setSel = st[1];
    var boxRefs = useRef([]), panelRef = useRef(null), wrapRef = useRef(null), closeRef = useRef(null), closing = useRef(false);
    var lit = glare(5);

    // the panel grows out of the clicked case (the case's rectangle → the panel's); the page frosts behind it
    useLayoutEffect(function () {
      if (sel == null) return;
      var panel = panelRef.current, box = boxRefs.current[sel], wrap = wrapRef.current;
      if (closeRef.current) closeRef.current.focus({ preventScroll: true });
      if (!panel || !box || reduced()) return;
      var to = panel.getBoundingClientRect(), from = box.getBoundingClientRect();
      if (!to.width || !from.width) return;
      stop(panel); stop(wrap);
      var dx = from.left - to.left, dy = from.top - to.top, kx = from.width / to.width, ky = from.height / to.height;
      panel.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + kx + ',' + ky + ')' }, { transform: 'none' }], { duration: 560, easing: 'cubic-bezier(.2,.8,.2,1)' });
      var body = panel.querySelector('.kt-zoom-body');
      if (body) body.animate([{ opacity: 0 }, { opacity: 0, offset: 0.35 }, { opacity: 1 }], { duration: 560 });
      if (wrap) wrap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360 });
    }, [sel]);

    // Esc closes; focus goes back to the case
    useEffect(function () {
      if (sel == null) return;
      var box = boxRefs.current[sel];
      function key(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } }
      document.addEventListener('keydown', key);
      return function () { document.removeEventListener('keydown', key); if (box && box.focus) box.focus({ preventScroll: true }); };
    }, [sel]);

    // a page can open a case from elsewhere (the spotlight's Order button): bump openKey with openIndex set
    useEffect(function () {
      if (p.openKey && p.openIndex != null && p.openIndex >= 0 && p.openIndex < cars.length) pick(p.openIndex);
    }, [p.openKey]);

    function pick(i) { closing.current = false; setSel(i); p.onSelect && p.onSelect(cars[i], i); }
    function close() {
      if (sel == null || closing.current) return;
      var panel = panelRef.current, box = boxRefs.current[sel], wrap = wrapRef.current;
      var to = panel && panel.getBoundingClientRect(), from = box && box.getBoundingClientRect();
      if (!to || !from || !to.width || !from.width || reduced()) { setSel(null); return; }
      closing.current = true;
      stop(panel); stop(wrap);
      var dx = from.left - to.left, dy = from.top - to.top, kx = from.width / to.width, ky = from.height / to.height;
      var a = panel.animate([{ transform: 'none' }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + kx + ',' + ky + ')' }], { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
      var body = panel.querySelector('.kt-zoom-body');
      if (body) body.animate([{ opacity: 1 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }], { duration: 420, fill: 'forwards' });
      if (wrap) wrap.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 360, delay: 60, fill: 'forwards' });
      a.onfinish = function () { closing.current = false; setSel(null); };
    }

    var car = sel == null ? null : cars[sel];
    return h('section', { className: 'kt kt-garage is-intro', 'aria-label': s.container },
      h('p', { className: 'kt-label kt-rack-hint' }, h('span', null, s.pick), p.onCalc ? h('button', { type: 'button', className: 'kt-link kt-rack-calc', onClick: p.onCalc }, h(CalcIcon, null), s.rackCalc) : null),
      h('div', { className: 'kt-rack' }, cars.map(function (c, i) {
        var open = i === sel;
        return h('button', Object.assign({ key: c.id, ref: function (el) { boxRefs.current[i] = el; }, type: 'button', className: cx('kt-box', open && 'is-open'), style: { '--i': i }, 'aria-pressed': open, 'aria-haspopup': 'dialog', onClick: function () { pick(i); } }, lit),
          h('span', { className: 'kt-case-lid', 'aria-hidden': true }), h('span', { className: 'kt-case-sheen', 'aria-hidden': true }),
          h('span', { className: 'kt-box-head' }, h('span', { className: 'kt-box-idx' }, String(i + 1).padStart(2, '0')), h(DriveTag, { drive: c.drive, lang: lang })),
          h('span', { className: 'kt-box-bay' },
            h('span', { className: 'kt-box-ghost' }, h(CarSilhouette, { body: c.body, ghost: true })),
            h('span', { className: 'kt-box-car', style: { display: 'block' } }, h(CarImage, { car: c, alt: '' })),
            h('span', { className: 'kt-box-refl', 'aria-hidden': true }, h(CarImage, { car: c, alt: '' })),
            h('span', { className: 'kt-plinth', 'aria-hidden': true })),
          h('span', null,
            h('span', { className: 'kt-box-name', style: { display: 'block' } }, c.brand + ' ' + c.model),
            h('span', { className: 'kt-box-meta', style: { display: 'block' } }, fromPrice(s, lang, landed(c)))));
      })),
      car ? h('div', { ref: wrapRef, className: 'kt kt-zoom-wrap', onMouseDown: function (e) { if (e.target === e.currentTarget) close(); } },
        h('div', { ref: panelRef, className: 'kt-zoom', role: 'dialog', 'aria-modal': true, 'aria-label': car.brand + ' ' + car.model },
          h('button', { ref: closeRef, type: 'button', className: 'kt-sheet-close', 'aria-label': s.close, onClick: close }, '×'),
          h('div', { className: 'kt-zoom-body' },
            h(OrderBuilder, { car: car, lang: lang, rates: p.rates, onDeposit: p.onDeposit, onView3D: p.onView3D })))) : null);
  }

  function OfferCard(p) {
    var c = p.car || SAMPLE_LISTINGS[0], lang = p.lang || 'pl', s = t(lang);
    var nf = new Intl.NumberFormat(LOCALE[lang]);
    var km = typeof c.km === 'number' ? nf.format(c.km) + ' km' : (c.km || '0 km');
    var range = c.range ? (typeof c.range === 'number' ? c.range + ' km EV' : c.range) : null;
    if (p.loading) {
      return h('article', { className: 'kt kt-offer is-loading', 'aria-hidden': true },
        h('div', { className: 'kt-offer-bay' }, h('span', { className: 'kt-skel kt-skel-car' })),
        h('div', { className: 'kt-offer-body' }, h('span', { className: 'kt-skel', style: { width: '62%', height: 18 } }), h('span', { className: 'kt-skel', style: { width: '44%', height: 12 } }),
          h('span', { className: 'kt-skel', style: { width: '52%', height: 24, marginTop: 14 } })));
    }
    var href = p.href || (isBox(c) ? effectHref(c, lang) : null) || (c.source === 'crm' && c.slug ? (window.KT_ASSETS || 'assets/').replace(/assets\/$/, '') + (lang === 'pl' ? 'auta/' : lang + '/cars/') + c.slug + '.html' : '#');
    function open(e) { if (href !== '#' && e.target.closest && e.target.closest('a')) return; if (!p.onOpen) return; e.preventDefault(); p.onOpen(c); }
    return h('article', Object.assign({ className: cx('kt kt-offer', p.onOpen && 'is-clickable'), style: p.vtCard ? { viewTransitionName: p.vtCard } : null, onClick: open }, glare(3)),
      c.status === 'stock' ? h('div', { className: 'kt-stock-band' }, h('span', null, s.inPoland), h('span', null, c.location || '')) : null,
      h('div', { className: 'kt-offer-bay' }, h('span', { className: 'kt-label' }, p.index || (c.status === 'stock' ? '' : s.toOrder)), h(DriveTag, { drive: c.drive, lang: lang }),
        h('div', { className: 'kt-offer-car', style: p.vtCar ? { viewTransitionName: p.vtCar } : null }, h(CarImage, { car: c, alt: c.brand + ' ' + c.model, catalog: true }))),
      h('div', { className: 'kt-offer-body' },
        h('h3', null, c.brand + ' ' + c.model),
        h('div', { className: 'kt-offer-meta' }, [c.year, km, range].filter(Boolean).join(' · ')),
        h('div', { className: 'kt-offer-foot' },
          h('div', null, h('div', { className: 'kt-label', style: { marginBottom: 4 } }, c.priceCip != null ? s.cip : s.landed),
            h('div', { style: { display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' } },
              h('div', { className: 'kt-price' }, money(c.priceCip != null ? cipOf(c) : landedOf(c), lang)),
              c.priceCip != null ? h('small', { className: 'kt-offer-meta' }, '$' + nf.format(c.priceCip)) : null),
            h('div', { className: 'kt-offer-meta', style: { marginTop: 4 } }, c.priceCip != null ? s.landed + ' ' + nf.format(landedOf(c)) + ' zł' : isBox(c) ? '' : s.cnPrice + ' ' + money(c.priceCN, lang))),
          h('a', { href: href }, s.details + ' →'))));
  }

  function SearchBar(p) {
    var lang = p.lang || 'pl', s = t(lang), cars = p.cars || SAMPLE_LISTINGS;
    var qs = useState(''), q = qs[0], setQ = qs[1];
    var ds = useState(''), d = ds[0], setD = ds[1];
    var ps = useState(''), pm = ps[0], setPm = ps[1];
    var n = filterCars(cars, { drive: d ? [d] : [], priceMax: pm }, q).length;
    function go(query) { p.onSearch && p.onSearch({ query: query != null ? query : q, filters: { drive: d ? [d] : [], priceMax: pm } }); }
    return h('form', { className: 'kt kt-search', role: 'search', onSubmit: function (e) { e.preventDefault(); go(); } },
      h('div', { className: 'kt-field kt-field-q' }, h('span', { className: 'kt-label' }, s.searchFor), h(SearchField, { lang: lang, cars: cars, onChange: setQ, onSubmit: function (x) { setQ(x); go(x); }, onBrand: function (b) { setQ(b); go(b); } })),
      h('label', { className: 'kt-field' }, h('span', { className: 'kt-label' }, s.driveSel), h('select', { value: d, onChange: function (e) { setD(e.target.value); } },
        h('option', { value: '' }, s.any), ['ev', 'erev', 'phev', 'hev', 'ice'].map(function (x) { return h('option', { key: x, value: x }, s[x]); }))),
      h('label', { className: 'kt-field' }, h('span', { className: 'kt-label' }, s.priceRange), h('select', { value: pm, onChange: function (e) { setPm(e.target.value); } },
        h('option', { value: '' }, s.any), [100000, 150000, 200000, 300000].map(function (x) { return h('option', { key: x, value: x }, s.max + ' ' + money(x, lang)); }))),
      h(Button, { variant: 'primary', type: 'submit', arrow: true }, s.show + ' ' + nWord(lang, n, s.cars)));
  }

  function ImportSteps(p) {
    var s = t(p.lang);
    return h('ol', { className: 'kt kt-steps', style: { listStyle: 'none', margin: 0, padding: 0 } }, s.steps.map(function (st, i) {
      return h('li', { key: i, className: cx('kt-step', p.done != null && i < p.done && 'is-done') },
        h('span', { className: 'kt-step-track', 'aria-hidden': true }),
        h('span', { className: 'kt-step-n' }, String(i + 1).padStart(2, '0')),
        h('h3', null, st[0]), h('p', null, st[1]));
    }));
  }

  // ---------- 3D viewer shell: nothing heavy loads until the visitor asks ----------
  function Viewer3D(p) {
    var lang = p.lang || 'pl', s = t(lang);
    var st = useState('idle'), state = st[0], setState = st[1];
    var pr = useState(0), progress = pr[0], setProgress = pr[1];
    var md = useState('exterior'), mode = md[0], setMode = md[1];
    var stageRef = useRef(null), apiRef = useRef(null), modesRef = useRef(null), mbox = useThumb(modesRef, mode);
    function load() {
      if (!p.onActivate) return;
      setState('loading');
      Promise.resolve(p.onActivate(stageRef.current, { progress: setProgress })).then(function (api) { apiRef.current = api || null; setState('ready'); }, function () { setState('idle'); });
    }
    function choose(m) { setMode(m); if (apiRef.current && apiRef.current.setMode) apiRef.current.setMode(m); }
    useEffect(function () { return function () { if (apiRef.current && apiRef.current.dispose) apiRef.current.dispose(); }; }, []);
    var c = p.car || SAMPLE_CARS[0];
    return h('section', { className: 'kt kt-v3d' },
      h('div', { className: 'kt-v3d-bar' },
        h('span', { className: 'kt-label' }, '3D · ' + c.brand + ' ' + c.model),
        h('div', { ref: modesRef, className: cx('kt-v3d-modes', mbox && 'has-thumb'), role: 'group' }, thumb(mbox),
          h('button', { type: 'button', 'aria-pressed': mode === 'exterior', disabled: state !== 'ready', onClick: function () { choose('exterior'); } }, s.exterior),
          h('button', { type: 'button', 'aria-pressed': mode === 'interior', disabled: state !== 'ready', onClick: function () { choose('interior'); } }, s.interior + (p.interiorSize ? ' · ' + p.interiorSize : '')))),
      h('div', { className: 'kt-v3d-stage', ref: stageRef },
        state !== 'ready' ? h('div', { className: 'kt-v3d-poster' },
          h(CarSilhouette, { body: c.body }),
          state === 'idle'
            ? h(Button, { variant: 'primary', arrow: true, onClick: load }, s.loadModel + (p.size ? ' · ' + p.size : ''))
            : h('div', { className: 'kt-v3d-progress', role: 'progressbar', 'aria-valuenow': Math.round(progress * 100), 'aria-label': s.loading }, h('i', { style: { width: Math.round(progress * 100) + '%' } }))) : null),
      h('div', { className: 'kt-v3d-foot' },
        h('span', { className: 'kt-label' }, state === 'ready' ? s.drag : s.notLoaded),
        h('span', { className: 'kt-label' }, p.budget || '')));
  }

  // ---------- copy for search, filters and the calculator ----------
  var T2 = {
    pl: { erev: 'EREV', hev: 'HEV',
      searchPh: 'Marka, model albo np. „SUV 7 miejsc”', brands: 'Marki', models: 'Modele', searchFor: 'Szukaj', cars: ['auto', 'auta', 'aut'],
      filters: 'Filtry', reset: 'Wyczyść', priceRange: 'Cena w Polsce (PLN)', min: 'od', max: 'do', yearRange: 'Rok produkcji', mileage: 'Przebieg do', rangeMin: 'Zasięg elektryczny od',
      bodyType: 'Nadwozie', bodies: { mpv: 'MPV', wagon: 'Kombi', coupe: 'Coupé', pickup: 'Pick-up', unknown: 'Inne', sedan: 'Sedan', sport: 'Sport', hatch: 'Kombi', suv: 'SUV', van: 'Van' }, availability: 'Dostępność', avOrder: 'Na zamówienie', avStock: 'W Polsce',
      noExcise: 'Tylko bez akcyzy', anySeats: 'Każda', results: 'Wyniki', sort: 'Sortuj', sorts: ['Najtańsze', 'Najnowsze', 'Najmniejszy przebieg', 'Największy zasięg'], empty: 'Brak aut dla tych filtrów.', show: 'Pokaż', moreBrands: 'Więcej marek', fewer: 'Mniej',
      landed: 'w Polsce ok.',
      calc: { title: 'Kalkulator importu', price: 'Cena zakupu w Chinach', rate: 'Kurs', condition: 'Stan', used: 'Używany', isNew: 'Nowy', engine: 'Pojemność silnika', maker: 'Producent (cło wyrównawcze UE)',
        makers: { byd: 'BYD', geely: 'Geely', saic: 'SAIC / MG', tesla: 'Tesla', coop: 'Inni współpracujący', other: 'Pozostali' }, freight: 'Transport', freights: { container: 'Kontener', rail: 'Kolej', roro: 'RoRo' },
        coc: 'Auto ma świadectwo zgodności WE (CoC) — bez dopuszczenia jednostkowego', buyer: 'Kupujący', buyers: { private: 'Osoba prywatna', co50: 'Firma · 50% VAT', co100: 'Firma · 100% VAT' },
        g1: 'Zakup i transport do UE', g2: 'Cło i podatki', g3: 'Opłaty w Polsce',
        rows: { car: 'Cena auta', insurance: 'Ubezpieczenie 0,5%', freight: 'Transport do Polski', customsValue: 'Wartość celna', duty: 'Cło 10%', cvd: 'Cło wyrównawcze UE', excise: 'Akcyza', vat: 'VAT 23%', port: 'Port i rozładunek', agency: 'Agencja celna', homologation: 'Dopuszczenie jednostkowe', translations: 'Tłumaczenia przysięgłe', inspection: 'Badanie techniczne', registration: 'Rejestracja i tablice', service: 'Prowizja' },
        total: 'Razem w Polsce, brutto', net: 'Koszt dla firmy po odliczeniu VAT', markup: 'ponad cenę auta', exempt: 'zwolnione do 2029',
        note: 'Stawki: stan na październik 2026. Cło od wartości celnej (cena + fracht + ubezpieczenie). Akcyza od wartości celnej z cłem. VAT od wartości celnej, cła, akcyzy i kosztów do miejsca przeznaczenia. Cło wyrównawcze UE dotyczy tylko nowych aut elektrycznych z Chin. Kwoty orientacyjne.' } },
    en: { erev: 'EREV', hev: 'HEV',
      searchPh: 'Brand, model, or e.g. "7-seat SUV"', brands: 'Brands', models: 'Models', searchFor: 'Search', cars: ['car', 'cars'],
      filters: 'Filters', reset: 'Clear all', priceRange: 'Price in Poland (PLN)', min: 'min', max: 'max', yearRange: 'Year', mileage: 'Max mileage', rangeMin: 'Min electric range',
      bodyType: 'Body', bodies: { mpv: 'MPV', wagon: 'Estate', coupe: 'Coupé', pickup: 'Pickup', unknown: 'Other', sedan: 'Sedan', sport: 'Sport', hatch: 'Estate', suv: 'SUV', van: 'Van' }, availability: 'Availability', avOrder: 'To order', avStock: 'In Poland',
      noExcise: 'Excise-free only', anySeats: 'Any', results: 'Results', sort: 'Sort', sorts: ['Cheapest', 'Newest', 'Lowest mileage', 'Longest range'], empty: 'No cars match these filters.', show: 'Show', moreBrands: 'More brands', fewer: 'Fewer',
      landed: 'in Poland approx.',
      calc: { title: 'Import calculator', price: 'Purchase price in China', rate: 'Exchange rate', condition: 'Condition', used: 'Used', isNew: 'New', engine: 'Engine size', maker: 'Manufacturer (EU countervailing duty)',
        makers: { byd: 'BYD', geely: 'Geely', saic: 'SAIC / MG', tesla: 'Tesla', coop: 'Other cooperating companies', other: 'All others' }, freight: 'Shipping', freights: { container: 'Container', rail: 'Rail', roro: 'RoRo' },
        coc: 'Car has an EU CoC certificate (no individual approval)', buyer: 'Buyer', buyers: { private: 'Private person', co50: 'Company · 50% VAT', co100: 'Company · 100% VAT' },
        g1: 'Purchase and shipping to the EU', g2: 'Duties and taxes', g3: 'Fees in Poland',
        rows: { car: 'Car price', insurance: 'Insurance 0.5%', freight: 'Transport to Poland', customsValue: 'Customs value', duty: 'Customs duty 10%', cvd: 'EU countervailing duty', excise: 'Excise', vat: 'VAT 23%', port: 'Port handling', agency: 'Customs agent', homologation: 'Individual approval', translations: 'Sworn translations', inspection: 'Technical inspection', registration: 'Registration & plates', service: 'Our fee' },
        total: 'Total in Poland, incl. VAT', net: 'Cost to a company after VAT deduction', markup: 'on top of the car price', exempt: 'exempt until 2029',
        note: 'Rates as of October 2026. Duty on the customs value (price + freight + insurance). Excise on customs value plus duty. VAT on customs value, duty, excise and costs to destination. The EU countervailing duty applies only to new Chinese EVs. Indicative figures.' } },
    zh: { erev: '增程', hev: '油混',
      searchPh: '品牌、车型，或例如“7 座 SUV”', brands: '品牌', models: '车型', searchFor: '搜索', cars: '辆',
      filters: '筛选', reset: '清除', priceRange: '波兰落地价 (PLN)', min: '最低', max: '最高', yearRange: '年份', mileage: '最高里程', rangeMin: '最低纯电续航',
      bodyType: '车身', bodies: { mpv: 'MPV', wagon: '旅行车', coupe: '轿跑', pickup: '皮卡', unknown: '其他', sedan: '轿车', sport: '跑车', hatch: '旅行/两厢', suv: 'SUV', van: 'MPV' }, availability: '车源状态', avOrder: '可预订', avStock: '波兰现车',
      noExcise: '仅看免消费税车型', anySeats: '不限', results: '结果', sort: '排序', sorts: ['价格最低', '最新', '里程最少', '续航最长'], empty: '没有符合条件的车辆。', show: '显示', moreBrands: '更多品牌', fewer: '收起',
      landed: '波兰落地约',
      calc: { title: '进口费用计算器', price: '中国购车价格', rate: '汇率', condition: '车况', used: '二手', isNew: '新车', engine: '发动机排量', maker: '制造商（欧盟反补贴税）',
        makers: { byd: '比亚迪', geely: '吉利', saic: '上汽 / 名爵', tesla: '特斯拉', coop: '其他配合调查企业', other: '其他' }, freight: '运输方式', freights: { container: '集装箱', rail: '铁路', roro: '滚装船' },
        coc: '车辆有欧盟 CoC 证书（无需单车认证）', buyer: '买方', buyers: { private: '个人', co50: '公司 · 抵扣 50%', co100: '公司 · 抵扣 100%' },
        g1: '购车与运至欧盟', g2: '关税与税费', g3: '波兰境内费用',
        rows: { car: '车价', insurance: '保险 0.5%', freight: '运至波兰', customsValue: '完税价格', duty: '关税 10%', cvd: '欧盟反补贴税', excise: '消费税', vat: '增值税 23%', port: '港口与卸货', agency: '报关代理', homologation: '单车认证', translations: '公证翻译', inspection: '车检', registration: '上牌', service: '服务费' },
        total: '波兰落地总价（含税）', net: '公司抵扣增值税后成本', markup: '较车价增加', exempt: '2029 年前免征',
        note: '税率截至 2026 年 10 月。关税按完税价格（车价 + 运费 + 保险）计算；消费税按完税价格加关税计算；增值税按完税价格、关税、消费税及运至目的地费用计算。欧盟反补贴税只适用于中国产新纯电车。金额仅供参考。' } }
  };
  Object.keys(T2).forEach(function (k) { Object.assign(T[k], T2[k]); });
  var PRICING_COPY = {"pl": {"cip": "Cena CIP (z transportem i ubezpieczeniem)", "cipShort": "CIP", "freightExtra": "Dopłata za fracht na trasie do Polski (szacunek)", "askPrice": "Zapytaj o cenę", "fixedFees": "Opłaty stałe"}, "en": {"cip": "CIP price (incl. freight and insurance)", "cipShort": "CIP", "freightExtra": "Polish-route freight surcharge (estimate)", "askPrice": "Ask for a price", "fixedFees": "Fixed fees"}, "zh": {"cip": "CIP 价（含运费和保险）", "cipShort": "CIP", "freightExtra": "波兰航线运费补差（估算）", "askPrice": "询价", "fixedFees": "固定费"}};
  var PRICING_NOTE = {"pl": "Szacunek: cena CIP obejmuje fracht do portu w Europie i ubezpieczenie. Doliczamy dopłatę za trasę do Polski, cło, należne cło wyrównawcze, akcyzę, VAT oraz port, odprawę, homologację, tłumaczenia i rejestrację. Cło wyrównawcze dotyczy tylko nowych EV i aut z przedłużaczem zasięgu wyprodukowanych w Chinach, nie aut Imported. Kurs według dziennej tabeli NBP; przy braku połączenia oznaczony kurs orientacyjny. Cena ostateczna zgodnie z umową.", "en": "Estimate: CIP includes freight to a European port and insurance. We add the Polish-route surcharge, customs duty, applicable countervailing duty, excise, VAT, port charges, customs clearance, homologation, translations and registration. Countervailing duty applies only to new China-made EVs and range-extender EVs, excluding Imported cars. Exchange rates follow the daily NBP table; a labelled indicative rate is used when unavailable. The final price is set by the contract.", "zh": "估算由 CIP 价（含到欧洲港口的运费和保险）、波兰航线运费补差、关税、适用的反补贴税、消费税、增值税，以及港口、清关、认证、翻译和登记费组成。反补贴税只适用于中国产新纯电及增程车，Imported 车辆不计。汇率按 NBP 当日公布汇率；无法连接时会标明参考汇率。最终价格以合同为准。"};
  Object.keys(PRICING_COPY).forEach(function (k) { Object.assign(T[k], PRICING_COPY[k]); });

  // ---------- Polish import rules for a car from China (verify before launch) ----------
  var RULES = Object.assign({
    asOf: '2026-10', duty: 0.10, vat: 0.23, insurance: 0.005, freightPlExtra: 1500,
    // excise by drive, by engine bucket [≤2.0 l, 2.0–3.5 l, >3.5 l]; base = customs value + duty
    excise: { ev: [0, 0, 0], erev: [0, 0.093, 0.186], phev: [0, 0.093, 0.186], hev: [0.0155, 0.093, 0.186], ice: [0.031, 0.186, 0.186] },
    // EU countervailing duty, Regulation (EU) 2024/2754: NEW battery EVs (incl. range extenders) only
    cvd: { byd: 0.17, geely: 0.188, saic: 0.353, tesla: 0.078, coop: 0.207, other: 0.353 },
    freight: { container: 8000, rail: 12000, roro: 6500 },
    port: 1500, agency: 1200, homologation: 5000, translations: 900, inspection: 149, registration: 180, service: 0,
    fx: { CNY: 0.52, USD: 3.65, EUR: 4.25, PLN: 1 }
  }, DATA.rules || {});

  // ---------- exchange rates: the National Bank of Poland's table A (PLN per unit), fetched once a day; cars.json holds the fallback ----------
  var T11 = {"pl": {"nbp": {"from": "kurs średni NBP z", "fallback": "kurs orientacyjny (brak połączenia z NBP)"}}, "en": {"nbp": {"from": "NBP mid rate of", "fallback": "indicative rate (NBP not reachable)"}}, "zh": {"nbp": {"from": "波兰央行 NBP 中间价，日期", "fallback": "参考汇率（未能连接 NBP）"}}};
  Object.keys(T11).forEach(function (k) { Object.assign(T[k], T11[k]); });
  var NBP_URL = 'https://api.nbp.pl/api/exchangerates/tables/A/?format=json', ratesPromise = null;
  function applyRates(table) {
    if (!table || !table.rates) return false;
    var fx = {};
    table.rates.forEach(function (r) { if (r.code === 'CNY' || r.code === 'USD' || r.code === 'EUR') fx[r.code] = +r.mid; });
    if (!fx.CNY) return false;
    RULES.fx = Object.assign({}, RULES.fx, fx, { PLN: 1 });
    RULES.fxDate = table.effectiveDate; RULES.fxSource = 'NBP';
    return true;
  }
  function loadRates() {
    if (ratesPromise) return ratesPromise;
    ratesPromise = new Promise(function (done) {
      var today = new Date().toISOString().slice(0, 10);
      try { var c = JSON.parse(sessionStorage.getItem('kt-nbp') || 'null'); if (c && c.day === today && applyRates(c.table)) { done(true); return; } } catch (e) {}
      if (typeof fetch !== 'function') { done(false); return; }
      fetch(NBP_URL, { headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var t = j && j[0], ok = applyRates(t);
          if (ok) { try { sessionStorage.setItem('kt-nbp', JSON.stringify({ day: today, table: { effectiveDate: t.effectiveDate, rates: t.rates.filter(function (r) { return /^(CNY|USD|EUR)$/.test(r.code); }) } })); } catch (e) {} }
          done(ok);
        }, function () { done(false); })
        .catch(function () { done(false); });
    });
    return ratesPromise;
  }
  // a page calls this once: the rates arrive, the page re-renders, every price follows
  function useRates() {
    var st = useState(0), bump = st[1];
    useEffect(function () { loadRates().then(function (ok) { if (ok) bump(function (x) { return x + 1; }); }); }, []);
    return st[0];
  }
  function rateNote(lang) { var s = t(lang); return RULES.fxSource ? s.nbp.from + ' ' + RULES.fxDate : s.nbp.fallback; }
  var CC = ['le2', '2to35', 'gt35'];
  function ccBucket(cc) { return !cc || cc <= 2000 ? 'le2' : cc <= 3500 ? '2to35' : 'gt35'; }
  function calcImport(inp, rules) {
    var r = Object.assign({}, RULES, rules || {});
    var i = Object.assign({ price: 0, currency: 'PLN', basis: 'cn', imported: false, condition: 'used', drive: 'ev', cc: 'le2', maker: 'other', freight: 'container', coc: false, buyer: 'private' }, inp);
    var fx = i.fx || r.fx[i.currency] || 1;
    var car = Math.round(i.price * fx), cip = i.basis === 'cip';
    var ins = cip ? 0 : Math.round(car * r.insurance), fr = cip ? 0 : (r.freight[i.freight] || 0);
    var freightExtra = cip ? Math.round(r.freightPlExtra * r.fx.USD) : 0;
    var cv = car + ins + fr + freightExtra, duty = Math.round(cv * r.duty);
    var cvdRate = i.condition === 'new' && (i.drive === 'ev' || i.drive === 'erev') && !i.imported ? (r.cvd[i.maker] || 0) : 0;
    var cvd = Math.round(cv * cvdRate);
    var exRate = (r.excise[i.drive] || r.excise.ice)[Math.max(0, CC.indexOf(i.cc))];
    var excise = Math.round((cv + duty + cvd) * exRate);
    var vat = Math.round((cv + duty + cvd + excise + r.port) * r.vat);
    var homologation = i.coc ? 0 : r.homologation;
    var fees = r.agency + homologation + r.translations + r.inspection + r.registration + (i.service != null ? i.service : r.service);
    var total = cv + duty + cvd + excise + r.port + vat + fees;
    var back = i.buyer === 'co100' ? vat : i.buyer === 'co50' ? Math.round(vat / 2) : 0;
    return { basis: i.basis, freightExtra: freightExtra, car: car, insurance: ins, freight: fr, customsValue: cv, duty: duty, cvd: cvd, cvdRate: cvdRate, excise: excise, exciseRate: exRate,
      exciseExempt: exRate === 0 && (i.drive === 'phev' || i.drive === 'erev'), vat: vat, port: r.port, agency: r.agency, homologation: homologation,
      translations: r.translations, inspection: r.inspection, registration: r.registration, service: i.service != null ? i.service : r.service,
      fees: fees, total: total, net: total - back, vatBack: back, markup: total - car, asOf: r.asOf };
  }
  function pricingInput(c) {
    if (isBox(c)) { var offer = boxOffer(c); if (offer) return pricingInput(offer); }
    if (c.priceCip != null) return { price: c.priceCip, currency: 'USD', basis: 'cip', drive: c.drive, cc: ccBucket(c.cc),
      condition: c.isNew ? 'new' : 'used', maker: c.makerKey || 'other', imported: !!c.imported, coc: c.coc };
    return { price: c.priceCN, currency: 'PLN', basis: 'cn', drive: c.drive, cc: ccBucket(c.cc), condition: c.condition || 'used', coc: c.coc };
  }
  function landedOf(c, rules) {
    if (isBox(c)) return boxPrice(c, rules);
    if (c.priceFinal != null) return c.priceFinal;
    if (c.pricePL != null) return c.pricePL;
    if (c.priceCip == null && c.priceCN == null) return null;
    var total = calcImport(pricingInput(c), rules).total;
    return Number.isFinite(total) && total > 0 ? total : null;
  }
  function cipOf(c) { if (isBox(c)) { var offer = boxOffer(c); return offer ? cipOf(offer) : null; } return c.priceCip != null ? Math.round(c.priceCip * RULES.fx.USD) : null; }

  // ---------- search and filtering (pure functions) ----------
  var KEYWORDS = { body: { suv: 'suv', sedan: 'sedan', kombi: ['wagon', 'hatch'], estate: ['wagon', 'hatch'], hatch: 'hatch', van: 'van', mpv: ['mpv', 'van'], 轿车: 'sedan', 跑车: 'sport', sport: 'sport', coupe: ['coupe', 'sport'] },
    drive: { ev: 'ev', elektryk: 'ev', electric: 'ev', 纯电: 'ev', phev: 'phev', 'plug-in': 'phev', 插混: 'phev', hybryda: 'hev', hybrid: 'hev', hev: 'hev', 油混: 'hev', erev: 'erev', 增程: 'erev', spalinowy: 'ice', benzyna: 'ice', petrol: 'ice', 燃油: 'ice' } };
  function matchQuery(c, q) {
    if (!q) return true;
    var s = q.toLowerCase(), seats = /(\d)\s*(-?\s*miejsc|-?\s*seat|座)/.exec(s);
    if (seats) { if (c.seats < +seats[1]) return false; s = s.replace(seats[0], ' '); }
    return s.split(/\s+/).filter(Boolean).every(function (tok) {
      if (KEYWORDS.body[tok]) return [].concat(KEYWORDS.body[tok]).indexOf(c.body) >= 0;
      if (KEYWORDS.drive[tok]) return c.drive === KEYWORDS.drive[tok];
      return wordStart(c.brand + ' ' + c.model, tok);
    });
  }
  function wordStart(text, tok) { return (' ' + text.toLowerCase().replace(/[-_/]/g, ' ')).indexOf(' ' + tok.replace(/[-_/]/g, ' ')) >= 0; }
  var EMPTY_FILTERS = { status: [], drive: [], body: [], brand: [], priceMin: '', priceMax: '', yearMin: '', yearMax: '', kmMax: 0, rangeMin: 0, seats: 0, noExcise: false };
  function filterCars(cars, f, q, skip) {
    f = Object.assign({}, EMPTY_FILTERS, f);
    return cars.filter(function (c) {
      var p = landedOf(c);
      if (!matchQuery(c, q)) return false;
      if (skip !== 'status' && f.status.length && f.status.indexOf(c.status) < 0) return false;
      if (skip !== 'drive' && f.drive.length && f.drive.indexOf(c.drive) < 0) return false;
      if (skip !== 'body' && f.body.length && f.body.indexOf(c.body) < 0) return false;
      if (skip !== 'brand' && f.brand.length && f.brand.indexOf(c.brand) < 0) return false;
      if (f.priceMin !== '' && p < +f.priceMin) return false;
      if (f.priceMax !== '' && p > +f.priceMax) return false;
      if (f.yearMin !== '' && c.year < +f.yearMin) return false;
      if (f.yearMax !== '' && c.year > +f.yearMax) return false;
      if (f.kmMax && c.km > f.kmMax) return false;
      if (f.rangeMin && (c.range || 0) < f.rangeMin) return false;
      if (f.seats && c.seats < f.seats) return false;
      if (f.noExcise && calcImport(pricingInput(c)).excise > 0) return false;
      return true;
    });
  }
  function sortCars(cars, by) {
    var k = [function (c) { return landedOf(c); }, function (c) { return -c.year; }, function (c) { return c.km; }, function (c) { return -(c.range || 0); }][by || 0];
    return cars.slice().sort(function (a, b) { return k(a) - k(b); });
  }
  function countBy(cars, key) { var o = {}; cars.forEach(function (c) { o[c[key]] = (o[c[key]] || 0) + 1; }); return o; }

  // ---------- SearchField: typeahead over brands and models ----------
  function SearchField(p) {
    var lang = p.lang || 'pl', s = t(lang), cars = p.cars || SAMPLE_LISTINGS;
    var qs = useState(p.value || ''), q = qs[0], setQ = qs[1];
    var os = useState(false), open = os[0], setOpen = os[1];
    var as = useState(-1), act = as[0], setAct = as[1];
    var idRef = useRef('kt-sf-' + Math.random().toString(36).slice(2, 7));
    useEffect(function () { if (p.value != null) setQ(p.value); }, [p.value]);
    var lq = q.trim().toLowerCase();
    var brands = Object.keys(countBy(cars, 'brand')).filter(function (b) { return lq && b.toLowerCase().indexOf(lq) === 0; }).slice(0, 4);
    var models = cars.filter(function (c) { return lq && wordStart(c.brand + ' ' + c.model, lq); }).slice(0, 5);
    var items = [];
    brands.forEach(function (b) { items.push({ kind: 'brand', label: b, count: cars.filter(function (c) { return c.brand === b; }).length }); });
    models.forEach(function (c) { items.push({ kind: 'model', label: c.brand + ' ' + c.model, car: c }); });
    if (lq) items.push({ kind: 'query', label: q.trim(), count: filterCars(cars, {}, q).length });
    function choose(it) {
      setOpen(false); setAct(-1);
      if (it.kind === 'brand') { setQ(''); p.onBrand ? p.onBrand(it.label) : p.onSubmit && p.onSubmit(it.label); }
      else if (it.kind === 'model') { setQ(it.label); p.onSubmit && p.onSubmit(it.label); }
      else { p.onSubmit && p.onSubmit(it.label); }
    }
    function key(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setAct(Math.min(items.length - 1, act + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(Math.max(-1, act - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (act >= 0 && items[act]) choose(items[act]); else { setOpen(false); p.onSubmit && p.onSubmit(q.trim()); } }
      else if (e.key === 'Escape') { setOpen(false); }
    }
    var lid = idRef.current;
    return h('div', { className: cx('kt kt-sf', p.className) },
      h('span', { className: 'kt-sf-icon', 'aria-hidden': true }, '⌕'),
      h('input', { type: 'search', role: 'combobox', 'aria-expanded': open && items.length > 0, 'aria-controls': lid, 'aria-autocomplete': 'list', 'aria-activedescendant': act >= 0 ? lid + '-' + act : undefined,
        'aria-label': s.searchFor, placeholder: s.searchPh, value: q,
        onChange: function (e) { setQ(e.target.value); setOpen(true); setAct(-1); p.onChange && p.onChange(e.target.value); },
        onFocus: function () { setOpen(true); }, onBlur: function () { setTimeout(function () { setOpen(false); }, 120); }, onKeyDown: key }),
      open && items.length ? h('ul', { className: 'kt-sf-list', role: 'listbox', id: lid }, items.map(function (it, i) {
        var head = (i === 0 && it.kind === 'brand') ? s.brands : (it.kind === 'model' && (i === 0 || items[i - 1].kind !== 'model')) ? s.models : null;
        return h(React.Fragment, { key: it.kind + it.label },
          head ? h('li', { className: 'kt-sf-head kt-label', role: 'presentation' }, head) : null,
          h('li', { id: lid + '-' + i, role: 'option', 'aria-selected': i === act, className: cx('kt-sf-item', it.kind === 'query' && 'is-query'),
            onMouseDown: function (e) { e.preventDefault(); choose(it); }, onMouseEnter: function () { setAct(i); } },
            it.kind === 'model' ? h('span', { className: 'kt-sf-car' }, h(CarSilhouette, { body: it.car.body })) : null,
            h('span', { className: 'kt-sf-text' }, it.kind === 'query' ? s.searchFor + ' „' + it.label + '”' : it.label),
            it.kind === 'model' ? h('span', { className: 'kt-sf-meta' }, it.car.year + ' · ' + money(landedOf(it.car), lang)) : h('span', { className: 'kt-sf-meta' }, nWord(lang, it.count, s.cars))));
      })) : null);
  }

  // ---------- FilterPanel ----------
  function Seg(p) {
    var ref = useRef(null), box = useThumb(ref, p.multi ? '' : String(p.value), !p.multi);
    return h('div', { ref: ref, className: cx('kt-seg', box && 'has-thumb'), role: 'group', 'aria-label': p.label }, p.multi ? null : thumb(box), p.options.map(function (o) {
      return h('button', { key: String(o.v), type: 'button', 'aria-pressed': p.multi ? p.value.indexOf(o.v) >= 0 : p.value === o.v, disabled: o.disabled,
        onClick: function () { p.onChange(o.v); } }, o.l);
    }));
  }
  function toggle(arr, v) { return arr.indexOf(v) >= 0 ? arr.filter(function (x) { return x !== v; }) : arr.concat([v]); }

  function FilterPanel(p) {
    var lang = p.lang || 'pl', s = t(lang), cars = p.cars || SAMPLE_LISTINGS, f = Object.assign({}, EMPTY_FILTERS, p.value), q = p.query || '';
    var ms = useState(false), more = ms[0], setMore = ms[1];
    function set(k, v) { var n = Object.assign({}, f); n[k] = v; p.onChange && p.onChange(n); }
    function counts(key) { return countBy(filterCars(cars, f, q, key), key); }
    var dc = counts('drive'), bc = counts('body'), brc = counts('brand'), sc = counts('status');
    var allBrands = Object.keys(countBy(cars, 'brand')).sort(function (a, b) { return (brc[b] || 0) - (brc[a] || 0) || a.localeCompare(b); });
    var shown = more ? allBrands : allBrands.slice(0, 6);
    function check(key, v, label, n) {
      var on = f[key].indexOf(v) >= 0;
      return h('label', { key: v, className: cx('kt-check', !n && !on && 'is-empty') },
        h('input', { type: 'checkbox', checked: on, onChange: function () { set(key, toggle(f[key], v)); } }),
        h('span', null, label), h('span', { className: 'kt-check-n' }, n || 0));
    }
    function group(title, body) { return h('fieldset', { className: 'kt-fgroup' }, h('legend', { className: 'kt-label' }, title), body); }
    var years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
    return h('aside', { className: 'kt kt-filters', 'aria-label': s.filters },
      h('div', { className: 'kt-filters-head' }, h('span', { className: 'kt-label' }, s.filters), h('button', { type: 'button', className: 'kt-link', onClick: function () { p.onChange && p.onChange(Object.assign({}, EMPTY_FILTERS)); } }, s.reset)),
      group(s.availability, h(Seg, { label: s.availability, multi: true, value: f.status, onChange: function (v) { set('status', toggle(f.status, v)); },
        options: [{ v: 'order', l: s.avOrder + ' · ' + (sc.order || 0) }, { v: 'stock', l: s.avStock + ' · ' + (sc.stock || 0) }] })),
      group(s.bodyType, h('div', { className: 'kt-bodies' }, Array.from(new Set(['suv', 'sedan', 'hatch', 'sport', 'van'].concat(cars.map(function (c) { return c.body; })))).map(function (b) {
        return h('button', { key: b, type: 'button', className: 'kt-body', 'aria-pressed': f.body.indexOf(b) >= 0, onClick: function () { set('body', toggle(f.body, b)); } },
          h(CarSilhouette, { body: b }), h('span', null, s.bodies[b] || b), h('span', { className: 'kt-check-n' }, bc[b] || 0));
      }))),
      group(s.driveSel, h('div', null, ['ev', 'erev', 'phev', 'hev', 'ice'].map(function (d) { return check('drive', d, s[d] + (lang === 'zh' ? ' ' + d.toUpperCase() : ''), dc[d]); }),
        h('label', { className: 'kt-check kt-check-strong' }, h('input', { type: 'checkbox', checked: f.noExcise, onChange: function () { set('noExcise', !f.noExcise); } }), h('span', null, s.noExcise)))),
      group(s.priceRange, h('div', { className: 'kt-range2' },
        h('input', { type: 'number', inputMode: 'numeric', placeholder: s.min, 'aria-label': s.priceRange + ' ' + s.min, value: f.priceMin, step: 5000, onChange: function (e) { set('priceMin', e.target.value); } }),
        h('span', { 'aria-hidden': true }, '—'),
        h('input', { type: 'number', inputMode: 'numeric', placeholder: s.max, 'aria-label': s.priceRange + ' ' + s.max, value: f.priceMax, step: 5000, onChange: function (e) { set('priceMax', e.target.value); } }))),
      group(s.brand, h('div', null, shown.map(function (b) { return check('brand', b, b, brc[b]); }),
        allBrands.length > 6 ? h('button', { type: 'button', className: 'kt-link', onClick: function () { setMore(!more); } }, more ? s.fewer : s.moreBrands + ' (' + (allBrands.length - 6) + ')') : null)),
      group(s.yearRange, h('div', { className: 'kt-range2' },
        h('select', { 'aria-label': s.yearRange + ' ' + s.min, value: f.yearMin, onChange: function (e) { set('yearMin', e.target.value); } }, h('option', { value: '' }, s.min), years.slice().reverse().map(function (y) { return h('option', { key: y, value: y }, y); })),
        h('span', { 'aria-hidden': true }, '—'),
        h('select', { 'aria-label': s.yearRange + ' ' + s.max, value: f.yearMax, onChange: function (e) { set('yearMax', e.target.value); } }, h('option', { value: '' }, s.max), years.map(function (y) { return h('option', { key: y, value: y }, y); })))),
      group(s.mileage, h('div', { className: 'kt-slider' },
        h('input', { type: 'range', min: 0, max: 100000, step: 5000, value: f.kmMax || 100000, 'aria-label': s.mileage, onChange: function (e) { var v = +e.target.value; set('kmMax', v >= 100000 ? 0 : v); } }),
        h('output', null, f.kmMax ? new Intl.NumberFormat(LOCALE[lang]).format(f.kmMax) + ' km' : '∞'))),
      group(s.rangeMin, h('div', { className: 'kt-slider' },
        h('input', { type: 'range', min: 0, max: 700, step: 50, value: f.rangeMin, 'aria-label': s.rangeMin, onChange: function (e) { set('rangeMin', +e.target.value); } }),
        h('output', null, f.rangeMin ? f.rangeMin + ' km' : '—'))),
      group(s.seats, h(Seg, { label: s.seats, value: f.seats, onChange: function (v) { set('seats', v); }, options: [{ v: 0, l: s.anySeats }, { v: 5, l: '5+' }, { v: 6, l: '6+' }, { v: 7, l: '7' }] })));
  }

  function ActiveFilters(p) {
    var lang = p.lang || 'pl', s = t(lang), f = Object.assign({}, EMPTY_FILTERS, p.value), chips = [];
    function rm(k, v) { var n = Object.assign({}, f); n[k] = Array.isArray(f[k]) ? f[k].filter(function (x) { return x !== v; }) : EMPTY_FILTERS[k]; p.onChange && p.onChange(n); }
    f.status.forEach(function (v) { chips.push([v === 'order' ? s.avOrder : s.avStock, 'status', v]); });
    f.body.forEach(function (v) { chips.push([s.bodies[v], 'body', v]); });
    f.drive.forEach(function (v) { chips.push([s[v], 'drive', v]); });
    f.brand.forEach(function (v) { chips.push([v, 'brand', v]); });
    if (f.priceMin !== '') chips.push([s.min + ' ' + money(+f.priceMin, lang), 'priceMin']);
    if (f.priceMax !== '') chips.push([s.max + ' ' + money(+f.priceMax, lang), 'priceMax']);
    if (f.yearMin !== '') chips.push(['≥ ' + f.yearMin, 'yearMin']);
    if (f.yearMax !== '') chips.push(['≤ ' + f.yearMax, 'yearMax']);
    if (f.kmMax) chips.push(['≤ ' + new Intl.NumberFormat(LOCALE[lang]).format(f.kmMax) + ' km', 'kmMax']);
    if (f.rangeMin) chips.push(['≥ ' + f.rangeMin + ' km EV', 'rangeMin']);
    if (f.seats) chips.push([f.seats + '+ ' + s.seats.toLowerCase(), 'seats']);
    if (f.noExcise) chips.push([s.noExcise, 'noExcise']);
    if (p.query) chips.unshift(['„' + p.query + '”', '_q']);
    if (!chips.length) return null;
    return h('div', { className: 'kt kt-chips' }, chips.map(function (c) {
      return h('button', { key: c[1] + (c[2] || ''), type: 'button', className: 'kt-chip', onClick: function () { c[1] === '_q' ? p.onQuery && p.onQuery('') : rm(c[1], c[2]); } }, c[0], h('span', { 'aria-hidden': true }, '×'));
    }), h('button', { type: 'button', className: 'kt-link', onClick: function () { p.onChange && p.onChange(Object.assign({}, EMPTY_FILTERS)); p.onQuery && p.onQuery(''); } }, s.reset));
  }

  // ---------- ImportCalculator ----------
  function ImportCalculator(p) {
    var lang = p.lang || 'pl', s = t(lang), cs = s.calc, rules = Object.assign({}, RULES, p.rules || {});
    var c0 = p.car;
    var st = useState(Object.assign({ fx: '', freight: 'container', coc: false, buyer: 'private', maker: 'other', imported: false },
      c0 ? pricingInput(c0) : { price: 30000, currency: 'USD', basis: 'cip', condition: 'used', drive: 'ev', cc: 'le2' }));
    var v = st[0], setV = st[1];
    function set(k, x) { var n = Object.assign({}, v); n[k] = x; if (k === 'currency') n.fx = ''; setV(n); }
    var fx = v.fx !== '' ? +v.fx : rules.fx[v.currency];
    var r = calcImport(Object.assign({}, v, { price: +v.price || 0, fx: fx }), rules);
    var isEV = v.drive === 'ev', showMaker = v.condition === 'new' && (v.drive === 'ev' || v.drive === 'erev') && !v.imported;
    function pct(x) { return (Math.round(x * 1000) / 10).toString().replace('.', lang === 'pl' ? ',' : '.') + '%'; }
    var prevRef = useRef(null), seen = {};
    useEffect(function () { prevRef.current = seen; });
    useEffect(function () { p.onResult && p.onResult(v, r); }, [r.total, r.net, v.price, v.currency, v.drive, v.condition, v.buyer]);
    function row(k, val, hint, strong) {
      seen[k] = val;
      var changed = prevRef.current && prevRef.current[k] !== undefined && prevRef.current[k] !== val;
      return h('div', { key: k, className: cx('kt-crow', strong && 'is-strong') }, h('dt', null, (k === 'cip' ? s.cip : k === 'freightExtra' ? s.freightExtra : cs.rows[k]) || k, hint ? h('small', null, hint) : null),
        h('dd', { key: String(val), className: changed ? 'kt-flash' : null }, money(val, lang)));
    }
    var segs = [['car', r.car], ['freight', r.freight + r.insurance + r.freightExtra], ['duty', r.duty + r.cvd], ['excise', r.excise], ['vat', r.vat], ['fees', r.fees + r.port]];
    var segLabel = { car: r.basis === 'cip' ? s.cipShort : cs.rows.car, freight: r.basis === 'cip' ? s.freightExtra : cs.rows.freight, duty: cs.rows.duty, excise: cs.rows.excise, vat: cs.rows.vat, fees: cs.g3 };
    return h('section', { className: 'kt kt-calc', 'aria-label': cs.title },
      h('div', { className: 'kt-calc-in' },
        h('div', { className: 'kt-fgroup' }, h('label', { className: 'kt-label', htmlFor: 'kt-calc-price' }, v.basis === 'cip' ? s.cip : cs.price),
          h('div', { className: 'kt-money' },
            h('input', { id: 'kt-calc-price', type: 'number', inputMode: 'numeric', min: 0, step: 1000, value: v.price, onChange: function (e) { set('price', e.target.value); } }),
            h(Seg, { label: v.basis === 'cip' ? s.cip : cs.price, value: v.currency, onChange: function (x) { set('currency', x); }, options: ['CNY', 'USD', 'EUR', 'PLN'].map(function (x) { return { v: x, l: x }; }) })),
          v.currency !== 'PLN' ? h('div', { className: 'kt-fx' }, h('span', null, cs.rate + ': 1 ' + v.currency + ' ='),
            h('input', { type: 'number', step: 0.0001, 'aria-label': cs.rate, value: v.fx !== '' ? v.fx : rules.fx[v.currency], onChange: function (e) { set('fx', e.target.value); } }), h('span', null, 'PLN')) : null,
          v.currency !== 'PLN' ? h('small', { className: 'kt-fx-src' }, rateNote(lang)) : null),
        h('div', { className: 'kt-fgroup' }, h('span', { className: 'kt-label' }, cs.condition),
          h(Seg, { label: cs.condition, value: v.condition, onChange: function (x) { set('condition', x); }, options: [{ v: 'used', l: cs.used }, { v: 'new', l: cs.isNew }] })),
        h('div', { className: 'kt-fgroup' }, h('span', { className: 'kt-label' }, s.driveSel),
          h(Seg, { label: s.driveSel, value: v.drive, onChange: function (x) { set('drive', x); }, options: ['ev', 'erev', 'phev', 'hev', 'ice'].map(function (d) { return { v: d, l: s[d] }; }) })),
        h('div', { className: 'kt-fgroup' }, h('span', { className: 'kt-label' }, cs.engine),
          h(Seg, { label: cs.engine, value: isEV ? '' : v.cc, onChange: function (x) { set('cc', x); }, options: [{ v: 'le2', l: '≤ 2,0 l', disabled: isEV }, { v: '2to35', l: '2,0–3,5 l', disabled: isEV }, { v: 'gt35', l: '> 3,5 l', disabled: isEV }] })),
        showMaker ? h('div', { className: 'kt-fgroup' }, h('label', { className: 'kt-label', htmlFor: 'kt-calc-maker' }, cs.maker),
          h('select', { id: 'kt-calc-maker', className: 'kt-select', value: v.maker, onChange: function (e) { set('maker', e.target.value); } },
            Object.keys(rules.cvd).map(function (m) { return h('option', { key: m, value: m }, cs.makers[m] + ' · ' + pct(rules.cvd[m])); }))) : null,
        v.basis === 'cip' ? h('div', { className: 'kt-fgroup' }, h('span', { className: 'kt-label' }, s.freightExtra), h('output', null, money(r.freightExtra, lang))) : h('div', { className: 'kt-fgroup' }, h('span', { className: 'kt-label' }, cs.freight),
          h(Seg, { label: cs.freight, value: v.freight, onChange: function (x) { set('freight', x); }, options: Object.keys(rules.freight).map(function (k) { return { v: k, l: cs.freights[k] }; }) })),
        h('div', { className: 'kt-fgroup' }, h('span', { className: 'kt-label' }, cs.buyer),
          h(Seg, { label: cs.buyer, value: v.buyer, onChange: function (x) { set('buyer', x); }, options: ['private', 'co50', 'co100'].map(function (k) { return { v: k, l: cs.buyers[k] }; }) })),
        h('label', { className: 'kt-check kt-check-strong' }, h('input', { type: 'checkbox', checked: v.coc, onChange: function () { set('coc', !v.coc); } }), h('span', null, cs.coc))),
      h('div', { className: 'kt-calc-out', 'aria-live': 'polite' },
        h('div', { className: 'kt-calc-total' },
          h('span', { className: 'kt-label' }, cs.total),
          h('div', { className: 'kt-calc-big' }, h(RollingNumber, { value: r.total, lang: lang, suffix: ' PLN' })),
          h('div', { className: 'kt-price-sub' }, '+ ' + money(r.markup, lang) + ' (' + pct(r.car ? r.markup / r.car : 0) + ') ' + cs.markup),
          v.buyer !== 'private' ? h('div', { className: 'kt-calc-net' }, h('span', null, cs.net), h('b', null, h(RollingNumber, { value: r.net, lang: lang, suffix: ' PLN' }))) : null),
        h('div', { className: 'kt-bar', role: 'img', 'aria-label': segs.map(function (x) { return segLabel[x[0]] + ' ' + money(x[1], lang); }).join(', ') },
          segs.map(function (x) { return h('i', { key: x[0], className: cx('kt-bar-' + x[0], !x[1] && 'is-zero'), style: { flexGrow: x[1] } }); })),
        h('ul', { className: 'kt-bar-key' }, segs.map(function (x) { return h('li', { key: x[0] }, h('i', { className: 'kt-bar-' + x[0] }), segLabel[x[0]]); })),
        r.basis === 'cip' ? h('dl', { className: 'kt-cgroup' }, pricingRows(r, lang).map(function (x) { return row(x[0], x[1]); }), row(cs.total, r.total, null, true)) : [
        h('dl', { className: 'kt-cgroup' }, h('div', { className: 'kt-label' }, '01 · ' + cs.g1),
          row(r.basis === 'cip' ? 'cip' : 'car', r.car, v.currency !== 'PLN' ? (+v.price || 0).toLocaleString(LOCALE[lang]) + ' ' + v.currency + ' × ' + fx : null),
          r.basis === 'cip' ? row('freightExtra', r.freightExtra) : [row('insurance', r.insurance), row('freight', r.freight)], row('customsValue', r.customsValue, null, true)),
        h('dl', { className: 'kt-cgroup' }, h('div', { className: 'kt-label' }, '02 · ' + cs.g2),
          row('duty', r.duty, '10% × ' + money(r.customsValue, lang)),
          row('cvd', r.cvd, pct(r.cvdRate) + ' × ' + money(r.customsValue, lang)),
          row('excise', r.excise, r.exciseExempt ? cs.exempt : pct(r.exciseRate) + ' × ' + money(r.customsValue + r.duty + r.cvd, lang)),
          row('port', r.port),
          row('vat', r.vat, '23% × ' + money(r.customsValue + r.duty + r.cvd + r.excise + r.port, lang))),
        h('dl', { className: 'kt-cgroup' }, h('div', { className: 'kt-label' }, '03 · ' + cs.g3),
          row('agency', r.agency), r.homologation ? row('homologation', r.homologation) : null,
          row('translations', r.translations), row('inspection', r.inspection), row('registration', r.registration), r.service ? row('service', r.service) : null)],
        p.onOrder ? h(Button, { variant: 'primary', arrow: true, className: 'kt-btn-block', onClick: function () { p.onOrder(v, r); } }, s.orderThis) : null,
        h('p', { className: 'kt-note' }, r.basis === 'cip' ? PRICING_NOTE[lang] || PRICING_NOTE.pl : cs.note)));
  }

  // ---------- ordering from China: the main section ----------
  var DEFAULT_TRIMS = [{ name: 'Standard', delta: 0 }, { name: 'Pro', delta: 16000 }, { name: 'Max', delta: 34000 }];
  var DEFAULT_PAINTS = ['#f2f2f0', '#111111', '#6b6d70', '#b8babd'];

  function OrderBuilder(p) {
    var c = p.car || SAMPLE_CARS[0], lang = p.lang || 'pl', s = t(lang);
    var pricedCar = isBox(c) ? boxOffer(c) : c;
    var trims = pricedCar && pricedCar.priceCip != null ? [{ name: pricedCar.trim || pricedCar.model, delta: 0 }] : (c.trims || p.trims || DEFAULT_TRIMS), paints = c.paints || p.paints || DEFAULT_PAINTS;
    var tr = useState(0), ti = tr[0], setTi = tr[1];
    var pc = useState(0), ci = pc[0], setCi = pc[1];
    var qs = useState(null), quote = qs[0], setQuote = qs[1];
    useEffect(function () { setTi(0); setCi(0); }, [c.id]);
    var trim = trims[Math.min(ti, trims.length - 1)];
    if (!pricedCar) return h('section', { className: 'kt kt-order' },
      h('h3', null, c.brand + ' ' + c.model), h('div', { className: 'kt-price' }, s.askPrice),
      h(Button, { variant: 'primary', onClick: function () { p.onDeposit && p.onDeposit({ car: c }); } }, s.askPrice));
    var e = estimate(pricedCar.priceCip != null ? pricedCar : Object.assign({}, pricedCar, { priceCN: pricedCar.priceCN + trim.delta }), p.rules);
    var rows = pricingRows(e, lang);
    return h('section', { className: 'kt kt-order', 'aria-label': s.sec.order[0] },
      h('div', { className: 'kt-order-car' },
        h('div', { className: 'kt-label' }, c.brand + ' · ' + c.year + ' · ' + s.toOrder),
        h('h3', null, c.model),
        h('div', { className: 'kt-order-bay' }, h(CarImage, { car: c })),
        h('div', { className: 'kt-order-facts' },
          h('span', null, h('span', { className: 'kt-label' }, s.delivery), h('b', null, s.weeks)),
          h('span', null, h('span', { className: 'kt-label' }, s.range), h('b', null, c.range)),
          h(DriveTag, { drive: c.drive, lang: lang })),
        p.onView3D ? h(Button, { variant: 'ghost', size: 'sm', arrow: true, onClick: function () { p.onView3D(c); } }, s.view3d) : null),
      h('div', { className: 'kt-order-config' },
        h('fieldset', null, h('legend', { className: 'kt-label' }, '01 · ' + s.trim),
          trims.map(function (x, i) {
            return h('button', { key: x.name, type: 'button', className: 'kt-choice', 'aria-pressed': i === ti, onClick: function () { setTi(i); } },
              h('span', null, x.name), h('span', { className: 'kt-mono' }, x.delta ? '+ ' + money(x.delta, lang) : '—'));
          })),
        h('fieldset', null, h('legend', { className: 'kt-label' }, '02 · ' + s.color + ' · ' + (s.colors[ci] || '')),
          h('div', { className: 'kt-swatches' }, paints.map(function (hex, i) {
            return h('button', { key: hex, type: 'button', className: 'kt-swatch', 'aria-pressed': i === ci, 'aria-label': s.colors[i] || hex, style: { background: hex }, onClick: function () { setCi(i); } });
          })))),
      h('div', { className: 'kt-order-cost' },
        h('div', { className: 'kt-label' }, '03 · ' + s.rows.total),
        h('dl', { className: 'kt-cost' }, rows.map(function (r, i) {
          return h('div', { key: r[0], style: { '--i': i } }, h('dt', null, r[0]), h('dd', { key: r[1] }, money(r[1], lang)));
        })),
        h('div', { className: 'kt-cost-total' }, h('span', { className: 'kt-label' }, s.rows.total), h('div', { className: 'kt-price' }, h(RollingNumber, { value: e.total, lang: lang, suffix: ' PLN' }))),
        h(Button, { variant: 'primary', arrow: true, className: 'kt-btn-block', onClick: function () { p.onDeposit && p.onDeposit({ car: c, trim: trim, paint: paints[ci], paintName: s.colors[ci] || '', estimate: e }); } }, s.deposit + ' · ' + money(e.deposit, lang)),
        h(Button, { variant: 'ghost', size: 'sm', className: 'kt-btn-block', onClick: function () { setQuote({ car: c, trim: trim, paint: paints[ci], paintName: s.colors[ci] || '', estimate: e }); } }, s.quoteDoc.btn),
        quote ? h(QuoteSheet, { lang: lang, order: quote, onDone: function () { setQuote(null); } }) : null,
        h('p', { className: 'kt-note' }, s.ratesNote)),
      h(StickyBuy, { label: s.rows.total, total: e.total, lang: lang, cta: s.orderShort, watch: '.kt-cost-total', onClick: function () { p.onDeposit && p.onDeposit({ car: c, trim: trim, paint: paints[ci], paintName: s.colors[ci] || '', estimate: e }); } }));
  }


  // ---------- photos: a car with a `photo` shows it instead of the drawn silhouette (cut-out, nose to the left) ----------
  function photoSrc(c) { var ph = c && c.photo; if (!ph) return null; return /^(https?:)?\//.test(ph) ? ph : ((typeof window !== 'undefined' && window.KT_ASSETS) || '') + ph; }
  function CarImage(p) {
    var effectPhoto = isBox(p.car) && SAMPLE_LISTINGS.some(function (c) { return c.id === p.car.id; }) ? 'corridor/img/hd/' + p.car.id + '.jpg' : null;
    var ph = p.image || (!p.car.photo && effectPhoto) || (p.catalog && ((p.car.imagesSmall || [])[0] || (p.car.images || [])[0]));
    var src = ph ? (((window.KT_ASSETS || 'assets/').replace(/assets\/$/, '')) + ph) : photoSrc(p.car);
    if (src) return h('img', { className: cx('kt-car-photo', p.className), src: src, alt: p.alt == null ? (p.car.brand + ' ' + p.car.model) : p.alt, loading: 'lazy', decoding: 'async', draggable: false });
    return h(CarSilhouette, { body: p.car.body, title: p.alt == null ? undefined : p.alt, ghost: p.ghost, sheen: p.sheen });
  }

  // ---------- lead form: one dialog for deposits, reservations, test drives and quotes ----------
  var T7 = {"pl": {"lead": {"titles": {"deposit": "Zamów z zaliczką", "order": "Zamów to auto", "reserve": "Zarezerwuj auto", "testdrive": "Umów jazdę próbną", "quote": "Poproś o wycenę", "inquiry": "Napisz do nas"}, "sub": "Zostaw kontakt — odezwiemy się w ciągu 24 godzin w dni robocze. Bez zobowiązań.", "name": "Imię i nazwisko", "phone": "Telefon", "email": "E-mail", "emailOpt": "opcjonalnie", "contact": "Jak się kontaktować", "contacts": ["Telefon", "WhatsApp", "WeChat", "E-mail"], "message": "Wiadomość", "messagePh": "Model, wersja, kolor, pytania…", "consent": "Zgadzam się na kontakt w sprawie mojego zapytania i przetwarzanie danych zgodnie z polityką prywatności.", "send": "Wyślij", "sending": "Wysyłanie…", "required": "To pole jest wymagane", "badEmail": "Sprawdź adres e-mail", "badPhone": "Sprawdź numer telefonu", "needConsent": "Potrzebujemy Twojej zgody, żeby odpisać", "doneTitle": "Dziękujemy!", "done": "Odezwiemy się w ciągu 24 godzin w dni robocze. Kopia zapytania:", "failed": "Nie udało się wysłać. Napisz do nas bezpośrednio:", "demo": "Tryb demo: formularz nie jest jeszcze podłączony do skrzynki — zapytanie zapisano tylko w przeglądarce.", "close": "Zamknij", "about": "Dotyczy"}}, "en": {"lead": {"titles": {"deposit": "Order with a deposit", "order": "Order this car", "reserve": "Reserve this car", "testdrive": "Book a test drive", "quote": "Ask for a quote", "inquiry": "Write to us"}, "sub": "Leave your details and we get back within 24 hours on working days. No obligation.", "name": "Full name", "phone": "Phone", "email": "E-mail", "emailOpt": "optional", "contact": "How to reach you", "contacts": ["Phone", "WhatsApp", "WeChat", "E-mail"], "message": "Message", "messagePh": "Model, trim, colour, questions…", "consent": "I agree to be contacted about my enquiry and to the processing of my data as described in the privacy policy.", "send": "Send", "sending": "Sending…", "required": "This field is required", "badEmail": "Check the e-mail address", "badPhone": "Check the phone number", "needConsent": "We need your consent to reply", "doneTitle": "Thank you!", "done": "We get back within 24 hours on working days. A copy of your enquiry:", "failed": "Sending failed. Write to us directly:", "demo": "Demo mode: the form is not connected to a mailbox yet, so the enquiry was only kept in this browser.", "close": "Close", "about": "About"}}, "zh": {"lead": {"titles": {"deposit": "支付定金预订", "order": "预订这台车", "reserve": "预留这台车", "testdrive": "预约试驾", "quote": "索取报价", "inquiry": "联系我们"}, "sub": "留下联系方式，工作日 24 小时内回复。不构成任何义务。", "name": "姓名", "phone": "电话", "email": "邮箱", "emailOpt": "选填", "contact": "希望的联系方式", "contacts": ["电话", "WhatsApp", "微信", "邮箱"], "message": "留言", "messagePh": "车型、版本、颜色、想问的问题……", "consent": "我同意就本次咨询与我联系，并按隐私政策处理我的数据。", "send": "发送", "sending": "发送中……", "required": "此项必填", "badEmail": "请检查邮箱地址", "badPhone": "请检查电话号码", "needConsent": "需要你的同意我们才能回复", "doneTitle": "谢谢！", "done": "工作日 24 小时内回复。你的咨询内容：", "failed": "发送失败，请直接联系我们：", "demo": "演示模式：表单尚未接入邮箱，咨询内容只保存在本浏览器中。", "close": "关闭", "about": "关于"}}};
  Object.keys(T7).forEach(function (k) { Object.assign(T[k], T7[k]); });
  function LeadForm(p) {
    var lang = p.lang || 'pl', s = t(lang), L = s.lead, ctx = p.context || {}, kind = ctx.kind || 'inquiry';
    var fs = useState({ name: '', phone: '', email: '', contact: 0, message: '', consent: false, website: '' }), f = fs[0], setF = fs[1];
    var es = useState({}), err = es[0], setErr = es[1];
    var st = useState('idle'), state = st[0], setState = st[1];
    var firstRef = useRef(null);
    useEffect(function () {
      if (!p.open) return;
      setState('idle'); setErr({});
      setF(function (o) { return Object.assign({}, o, { message: ctx.summary || '' }); });
      // a mouse/keyboard user starts typing at once; on a phone the keyboard would cover the form before it is read
      var fine = !window.matchMedia || window.matchMedia('(pointer: fine)').matches;
      if (firstRef.current && fine) setTimeout(function () { firstRef.current.focus(); }, 50);
      function key(e) { if (e.key === 'Escape') { e.preventDefault(); p.onClose && p.onClose(); } }
      document.addEventListener('keydown', key);
      return function () { document.removeEventListener('keydown', key); };
    }, [p.open]);
    if (!p.open) return null;
    function set(k, v) { setF(Object.assign({}, f, (function () { var o = {}; o[k] = v; return o; })())); if (err[k]) setErr(Object.assign({}, err, (function () { var o = {}; o[k] = null; return o; })())); }
    function validate() {
      var e = {};
      if (!f.name.trim()) e.name = L.required;
      if (!f.phone.trim()) e.phone = L.required; else if (!/^[+\d][\d\s().-]{6,}$/.test(f.phone.trim())) e.phone = L.badPhone;
      if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = L.badEmail;
      if (!f.consent) e.consent = L.needConsent;
      return e;
    }
    function submit(ev) {
      ev.preventDefault();
      if (f.website) return; // honeypot
      var e = validate(); setErr(e); if (Object.keys(e).length) return;
      var payload = { kind: kind, name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), contact: L.contacts[f.contact], message: f.message.trim(), car: ctx.summary || '', lang: lang, page: location.href, at: new Date().toISOString() };
      var url = (typeof window !== 'undefined' && window.KT_LEAD_URL) || '';
      if (typeof window !== 'undefined' && window.KT_LEAD_EXTRA) payload = Object.assign({}, window.KT_LEAD_EXTRA, payload);
      setState('sending');
      if (!url) { try { console.log('[kontener] lead (demo)', payload); } catch (x) {} setTimeout(function () { setState('demo'); p.onSent && p.onSent(payload); }, 500); return; }
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); setState('done'); p.onSent && p.onSent(payload); }, function () { setState('failed'); })
        .catch(function () { setState('failed'); });
    }
    var company = p.company || COMPANY;
    function field(k, label, type, opt) {
      return h('label', { className: cx('kt-lead-field', err[k] && 'is-bad') },
        h('span', { className: 'kt-label' }, label, opt ? h('em', null, ' · ' + opt) : null),
        h('input', { ref: k === 'name' ? firstRef : null, type: type || 'text', value: f[k], autoComplete: k === 'name' ? 'name' : k === 'phone' ? 'tel' : k === 'email' ? 'email' : 'off', inputMode: k === 'phone' ? 'tel' : undefined, onChange: function (e) { set(k, e.target.value); }, 'aria-invalid': !!err[k] }),
        err[k] ? h('span', { className: 'kt-lead-err', role: 'alert' }, err[k]) : null);
    }
    var sent = state === 'done' || state === 'demo';
    return h('div', { className: 'kt kt-lead-wrap', onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose && p.onClose(); } },
      h('div', { className: 'kt-lead', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'kt-lead-title' },
        h('button', { type: 'button', className: 'kt-sheet-close', 'aria-label': L.close, onClick: p.onClose }, '×'),
        sent ? h('div', { className: 'kt-lead-done' },
            h('svg', { viewBox: '0 0 48 48', className: 'kt-lead-check', 'aria-hidden': true }, h('circle', { cx: 24, cy: 24, r: 22 }), h('path', { d: 'M14 25l7 7 13-15', pathLength: 1 })),
            h('h2', { id: 'kt-lead-title' }, L.doneTitle),
            h('p', null, L.done),
            h('dl', { className: 'kt-lead-copy' },
              ctx.summary ? h('div', null, h('dt', null, L.about), h('dd', null, ctx.summary)) : null,
              h('div', null, h('dt', null, L.name), h('dd', null, f.name)),
              h('div', null, h('dt', null, L.contact), h('dd', null, L.contacts[f.contact] + ' · ' + f.phone + (f.email ? ' · ' + f.email : ''))),
              f.message ? h('div', null, h('dt', null, L.message), h('dd', null, f.message)) : null),
            state === 'demo' ? h('p', { className: 'kt-note' }, L.demo) : null,
            h(Button, { variant: 'primary', onClick: p.onClose }, L.close))
        : h('form', { className: 'kt-lead-form', onSubmit: submit, noValidate: true },
            h('div', { className: 'kt-label' }, s.sec.order[0]),
            h('h2', { id: 'kt-lead-title' }, L.titles[kind] || L.titles.inquiry),
            h('p', { className: 'kt-lead-sub' }, L.sub),
            ctx.summary ? h('div', { className: 'kt-lead-about' }, h('span', { className: 'kt-label' }, L.about), h('b', null, ctx.summary)) : null,
            h('div', { className: 'kt-lead-grid' }, field('name', L.name), field('phone', L.phone, 'tel'), field('email', L.email, 'email', L.emailOpt),
              h('div', { className: 'kt-lead-field' }, h('span', { className: 'kt-label' }, L.contact),
                h('div', { className: 'kt-lead-seg', role: 'radiogroup' }, L.contacts.map(function (c, i) { return h('button', { key: c, type: 'button', role: 'radio', 'aria-checked': f.contact === i, className: cx(f.contact === i && 'is-on'), onClick: function () { set('contact', i); } }, c); })))),
            h('label', { className: 'kt-lead-field' }, h('span', { className: 'kt-label' }, L.message),
              h('textarea', { rows: 3, value: f.message, placeholder: L.messagePh, onChange: function (e) { set('message', e.target.value); } })),
            h('input', { type: 'text', name: 'website', tabIndex: -1, autoComplete: 'off', className: 'kt-lead-hp', value: f.website, onChange: function (e) { set('website', e.target.value); }, 'aria-hidden': true }),
            h('label', { className: cx('kt-lead-consent', err.consent && 'is-bad') },
              h('input', { type: 'checkbox', checked: f.consent, onChange: function (e) { set('consent', e.target.checked); } }),
              h('span', null, L.consent, window.KT_PRIVACY_URL ? h('a', { className: 'kt-lead-policy', href: window.KT_PRIVACY_URL, target: '_blank', rel: 'noopener' }, ' ' + t(lang).readPolicy) : null)),
            err.consent ? h('span', { className: 'kt-lead-err', role: 'alert' }, err.consent) : null,
            state === 'failed' ? h('p', { className: 'kt-lead-err', role: 'alert' }, L.failed + ' ', h('a', { href: 'mailto:' + (company.email || '') }, company.email || '')) : null,
            h('div', { className: 'kt-lead-actions' },
              h(Button, { variant: 'primary', type: 'submit', arrow: true, disabled: state === 'sending' }, state === 'sending' ? L.sending : L.send),
              company.phone ? h('a', { className: 'kt-lead-alt', href: 'tel:' + company.phone.replace(/\s/g, '') }, company.phone) : null))));
  }
  // one summary line for the form and the quote: "Zeekr 9X Max · Pro · czarny · 349 569 PLN"
  function leadSummary(o, lang) {
    var s = t(lang), parts = [o.car.brand + ' ' + o.car.model];
    if (o.trim) parts.push(o.trim.name);
    if (o.paintName) parts.push(o.paintName);
    if (o.estimate) parts.push(money(o.estimate.total, lang)); else if (o.car.priceFinal) parts.push(money(o.car.priceFinal, lang));
    return parts.join(' · ');
  }

  // ---------- the quote as a PDF: a print-only sheet appended to <body>; the browser's print dialog saves it ----------
  var T8 = {"pl": {"quoteDoc": {"btn": "Pobierz wycenę (PDF)", "title": "Wycena importu", "no": "Nr wyceny", "date": "Data", "valid": "Ważna 7 dni od daty wystawienia", "car": "Samochód", "trim": "Wersja", "color": "Kolor", "delivery": "Dostawa", "rate": "Kurs CNY/PLN", "rateSrc": "stawki i kursy na", "deposit": "Zaliczka przy umowie", "contact": "Kontakt", "note": "Wycena orientacyjna. Ostateczna cena jest ustalana w umowie według kursu z dnia podpisania i aktualnej ceny u dealera. Cena obejmuje auto, transport i ubezpieczenie, cło, akcyzę i VAT oraz szacunkowe opłaty za homologację i rejestrację w Polsce, jeśli zlecisz je nam.", "prepared": "Przygotowano na", "hint": "W oknie drukowania wybierz „Zapisz jako PDF”."}}, "en": {"quoteDoc": {"btn": "Download quote (PDF)", "title": "Import quote", "no": "Quote no.", "date": "Date", "valid": "Valid for 7 days from the date of issue", "car": "Car", "trim": "Trim", "color": "Colour", "delivery": "Delivery", "rate": "CNY/PLN rate", "rateSrc": "rates as of", "deposit": "Deposit at contract", "contact": "Contact", "note": "Indicative quote. The final price is fixed in the contract at the exchange rate of the signing date and the dealer's current price. The price covers the car, shipping and insurance, duty, excise and VAT, plus estimated homologation and registration fees in Poland if you have us handle them.", "prepared": "Prepared on", "hint": "In the print dialog choose “Save as PDF”."}}, "zh": {"quoteDoc": {"btn": "下载报价单（PDF）", "title": "进口报价单", "no": "报价编号", "date": "日期", "valid": "自出具之日起 7 天内有效", "car": "车辆", "trim": "版本", "color": "颜色", "delivery": "交付", "rate": "人民币/兹罗提汇率", "rateSrc": "税率与汇率截至", "deposit": "签约定金", "contact": "联系方式", "note": "本报价为参考价。最终价格以合同为准，按签约当日汇率和经销商实时价格确定。价格包含车价、运输与保险、关税、消费税和增值税，以及委托我们办理时波兰认证和上牌的预估费用。", "prepared": "出具于", "hint": "在打印窗口中选择“存储为 PDF”。"}}};
  Object.keys(T8).forEach(function (k) { Object.assign(T[k], T8[k]); });
  function quoteNumber() { var d = new Date(); return 'KT-W-' + d.getFullYear() + pad2(d.getMonth() + 1) + pad2(d.getDate()) + '-' + pad2(d.getHours()) + pad2(d.getMinutes()); }
  function QuoteSheet(p) {
    var lang = p.lang || 'pl', s = t(lang), Q = s.quoteDoc, o = p.order, e = o.estimate, c = o.car, company = p.company || COMPANY;
    var rows = pricingRows(e, lang);
    var el = useRef(null);
    if (!el.current && typeof document !== 'undefined') { el.current = document.createElement('div'); el.current.className = 'kt kt-quote'; document.body.appendChild(el.current); }
    useEffect(function () {
      var node = el.current, cancelled = false;
      function after() { p.onDone && p.onDone(); }
      window.addEventListener('afterprint', after);
      var id = setTimeout(function () {
        // Printing must wait for the newly mounted bitmap logo, including on a
        // cold cache. decode() is also safe for an already loaded image.
        Promise.all(Array.prototype.map.call(node.querySelectorAll('img'), function (img) {
          return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
        })).then(function () { if (!cancelled) window.print(); });
      }, 80);
      return function () { cancelled = true; clearTimeout(id); window.removeEventListener('afterprint', after); if (node && node.parentNode) node.parentNode.removeChild(node); el.current = null; };
    }, []);
    var today = new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: 'long' }).format(new Date());
    var quoteCurrency = e.basis === 'cip' ? 'USD' : 'PLN';
    var fx = RULES.fx[quoteCurrency];
    return ReactDOM.createPortal(
      h('article', { className: 'kt-quote-page', lang: lang },
        h('header', { className: 'kt-quote-head' },
          h('div', null, h('div', { className: 'kt-quote-logo', 'aria-label': 'MotorSpace' }, h(BrandLogo, { print: true, large: true }), h('span', null, ' CN → PL')), h('div', { className: 'kt-quote-legal' }, company.legal || '')),
          h('div', { className: 'kt-quote-meta' }, h('h1', null, Q.title), h('div', null, Q.no + ' ' + quoteNumber()), h('div', null, Q.date + ' ' + today), h('div', null, Q.valid))),
        h('section', { className: 'kt-quote-car' },
          h('div', null, h('span', null, Q.car), h('b', null, c.brand + ' ' + c.model + ' · ' + c.year)),
          h('div', null, h('span', null, Q.trim), h('b', null, o.trim ? o.trim.name : '—')),
          h('div', null, h('span', null, Q.color), h('b', null, o.paintName || '—')),
          h('div', null, h('span', null, Q.delivery), h('b', null, s.weeks))),
        h('table', { className: 'kt-quote-table' },
          h('tbody', null, rows.map(function (r) { return h('tr', { key: r[0] }, h('td', null, r[0]), h('td', null, money(r[1], lang))); })),
          h('tfoot', null,
            h('tr', { className: 'kt-quote-total' }, h('td', null, s.rows.total), h('td', null, money(e.total, lang))),
            h('tr', null, h('td', null, Q.deposit), h('td', null, money(e.deposit, lang))))),
        h('p', { className: 'kt-quote-rate' }, (fx ? '1 ' + quoteCurrency + ' = ' + fx.toFixed(4) + ' PLN' + ' (' + rateNote(lang) + ') · ' : '') + Q.rateSrc + ' ' + (RULES.asOf || '')),
        h('p', { className: 'kt-quote-note' }, Q.note),
        h('footer', { className: 'kt-quote-foot' },
          h('div', null, h('span', null, Q.contact), h('b', null, [company.phone, company.email, company.address].filter(Boolean).join(' · '))),
          h('div', null, h('span', null, Q.prepared), h('b', null, location.host || 'motorspace'))),
        h('p', { className: 'kt-quote-hint' }, Q.hint)),
      el.current);
  }


  // ---------- order tracking: a number from the contract -> the car's stage and its history (demo data in cars.json) ----------
  var T9 = {"pl": {"tracker": {"eyebrow": "Śledzenie zamówienia", "title": "Gdzie jest Twoje auto?", "sub": "Wpisz numer zamówienia z umowy. Ten sam numer dostajesz w każdej wiadomości od nas.", "label": "Numer zamówienia", "ph": "np. KT-2026-0142", "go": "Sprawdź", "demo": "Demo: wpisz KT-2026-0142 albo KT-2026-0157.", "notFound": "Nie znamy takiego numeru. Sprawdź pisownię albo napisz do nas.", "order": "Zamówienie", "contract": "Umowa", "eta": "Planowany odbiór", "stage": "Etap", "of": "z", "done": "zrobione", "now": "w toku", "next": "dalej", "stages": {"contract": "Umowa i zaliczka", "bought": "Zakup w Chinach", "inspected": "Inspekcja i raport", "shipped": "W drodze do Europy", "arrived": "Przyjazd do Polski", "customs": "Odprawa celna", "registered": "Homologacja i rejestracja", "ready": "Gotowe do odbioru"}}}, "en": {"tracker": {"eyebrow": "Order tracking", "title": "Where is your car?", "sub": "Enter the order number from your contract. The same number is in every message from us.", "label": "Order number", "ph": "e.g. KT-2026-0142", "go": "Check", "demo": "Demo: try KT-2026-0142 or KT-2026-0157.", "notFound": "We don't know that number. Check the spelling or write to us.", "order": "Order", "contract": "Contract", "eta": "Planned collection", "stage": "Stage", "of": "of", "done": "done", "now": "in progress", "next": "next", "stages": {"contract": "Contract and deposit", "bought": "Purchased in China", "inspected": "Inspection and report", "shipped": "On the way to Europe", "arrived": "Arrived in Poland", "customs": "Customs clearance", "registered": "Homologation and registration", "ready": "Ready for collection"}}}, "zh": {"tracker": {"eyebrow": "订单追踪", "title": "你的车到哪了？", "sub": "输入合同上的订单号。我们发给你的每条消息里都有这个号码。", "label": "订单号", "ph": "例如 KT-2026-0142", "go": "查询", "demo": "演示：试试 KT-2026-0142 或 KT-2026-0157。", "notFound": "没有这个订单号。请检查拼写，或直接联系我们。", "order": "订单", "contract": "签约", "eta": "预计提车", "stage": "阶段", "of": "/", "done": "已完成", "now": "进行中", "next": "待进行", "stages": {"contract": "签约与定金", "bought": "中国购车", "inspected": "验车与报告", "shipped": "运往欧洲", "arrived": "抵达波兰", "customs": "清关", "registered": "认证与上牌", "ready": "可以提车"}}}};
  Object.keys(T9).forEach(function (k) { Object.assign(T[k], T9[k]); });
  function OrderTracker(p) {
    var lang = p.lang || 'pl', s = t(lang), R = s.tracker, orders = p.orders || SAMPLE_ORDERS;   // its own key: T13's track is the short link label
    var init = p.initial || (typeof location !== 'undefined' && new URLSearchParams(location.search).get('nr')) || '';
    var qs = useState(init), q = qs[0], setQ = qs[1];
    var rs = useState(init ? find(init) : undefined), res = rs[0], setRes = rs[1];
    function find(no) { var k = String(no || '').trim().toUpperCase().replace(/\s+/g, ''); if (!k) return undefined; return orders.filter(function (o) { return o.no.toUpperCase() === k; })[0] || null; }
    function go(e) { e.preventDefault(); var r = find(q); setRes(r); if (r && typeof history !== 'undefined') { try { history.replaceState(null, '', '?nr=' + encodeURIComponent(r.no)); } catch (x) {} } }
    var fmt = new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' });
    function date(d) { return d ? fmt.format(new Date(d + 'T12:00:00')) : ''; }
    return h('section', { className: cx('kt kt-track', p.className), 'aria-label': R.title },
      h('header', { className: 'kt-track-head' },
        h('span', { className: 'kt-sechead-n' }, R.eyebrow),
        h('h1', null, R.title),
        h('p', null, R.sub)),
      h('form', { className: 'kt-track-form', onSubmit: go },
        h('label', { className: 'kt-track-field' }, h('span', { className: 'kt-label' }, R.label),
          h('input', { value: q, placeholder: R.ph, autoComplete: 'off', spellCheck: false, onChange: function (e) { setQ(e.target.value); } })),
        h(Button, { variant: 'primary', type: 'submit', arrow: true }, R.go)),
      h('p', { className: 'kt-note' }, R.demo),
      res === null ? h('p', { className: 'kt-track-none', role: 'status' }, R.notFound) : null,
      res ? h('div', { className: 'kt-track-result', key: res.no },
        h('div', { className: 'kt-track-card' },
          h('div', null, h('span', { className: 'kt-label' }, R.order), h('b', null, res.no)),
          h('div', null, h('span', { className: 'kt-label' }, s.car || 'Auto'), h('b', null, res.car)),
          h('div', null, h('span', { className: 'kt-label' }, R.contract), h('b', null, date(res.contract))),
          h('div', null, h('span', { className: 'kt-label' }, R.eta), h('b', null, date(res.eta))),
          h('div', { className: 'kt-track-progress', style: { '--p': ((res.stage + 1) / res.events.length) } },
            h('span', { className: 'kt-label' }, R.stage + ' ' + (res.stage + 1) + ' ' + R.of + ' ' + res.events.length),
            h('i', null, h('b', null)))),
        h('ol', { className: 'kt-track-list' }, res.events.map(function (ev, i) {
          var state = i < res.stage ? 'done' : i === res.stage ? 'now' : 'next';
          return h('li', { key: i, className: 'is-' + state, style: { '--i': i } },
            h('span', { className: 'kt-track-dot', 'aria-hidden': true }),
            h('div', { className: 'kt-track-ev' },
              h('div', { className: 'kt-track-ev-head' }, h('b', null, R.stages[ev[1]] || ev[1]), h('span', { className: 'kt-label' }, ev[0] ? date(ev[0]) : R[state])),
              ev[2] ? h('p', null, ev[2]) : null));
        }))) : null);
  }


  // ---------- the calculator as a drawer from the right: opened from the nav's quote button and from a car's detail sheet ----------
  var T10 = {"pl": {"drawer": {"eyebrow": "Kalkulator", "sub": "Pełny koszt auta z Chin w Polsce: cło, akcyza, VAT i opłaty. Zmieniaj dane i patrz, co się zmienia.", "close": "Zamknij kalkulator", "summary": "Kalkulator"}}, "en": {"drawer": {"eyebrow": "Calculator", "sub": "The full cost of a car from China in Poland: duty, excise, VAT and fees. Change the inputs and watch what moves.", "close": "Close the calculator", "summary": "Calculator"}}, "zh": {"drawer": {"eyebrow": "计算器", "sub": "中国汽车到波兰的全部费用：关税、消费税、增值税和各项杂费。改一改参数，看看哪里会变。", "close": "关闭计算器", "summary": "计算器"}}};
  Object.keys(T10).forEach(function (k) { Object.assign(T[k], T10[k]); });
  var T13 = {
    pl: { menu: 'Menu', menuClose: 'Zamknij menu', track: 'Śledź zamówienie', contactH: 'Kontakt', langL: 'Język', ask: 'Zapytaj o auto', calcShort: 'Kalkulator', showN: 'Pokaż', orderShort: 'Zamów' },
    en: { menu: 'Menu', menuClose: 'Close menu', track: 'Track your order', contactH: 'Contact', langL: 'Language', ask: 'Ask about a car', calcShort: 'Calculator', showN: 'Show', orderShort: 'Order' },
    zh: { menu: '菜单', menuClose: '关闭菜单', track: '订单追踪', contactH: '联系方式', langL: '语言', ask: '咨询购车', calcShort: '计算器', showN: '显示', orderShort: '预订' }
  };
  T13.pl.readPolicy = 'Przeczytaj politykę prywatności →'; T13.en.readPolicy = 'Read the privacy policy →'; T13.zh.readPolicy = '查看隐私政策 →';
  Object.keys(T13).forEach(function (k) { Object.assign(T[k], T13[k]); });
  var T12 = { pl: { rackCalc: 'Inne auto? Policz je w kalkulatorze' }, en: { rackCalc: 'Another car? Price it in the calculator' }, zh: { rackCalc: '想算别的车？打开进口计算器' } };
  Object.keys(T12).forEach(function (k) { Object.assign(T[k], T12[k]); });
  function CalcDrawer(p) {
    var lang = p.lang || 'pl', s = t(lang), D = s.drawer, closeRef = useRef(null), last = useRef(null);
    var ts = useState(0), total = ts[0], setTotal = ts[1];
    useEffect(function () {
      if (!p.open) return;
      var prev = document.activeElement, html = document.documentElement, over = html.style.overflow;
      html.style.overflow = 'hidden';
      if (closeRef.current) setTimeout(function () { closeRef.current.focus({ preventScroll: true }); }, 60);
      function key(e) { if (e.key === 'Escape') { e.preventDefault(); p.onClose && p.onClose(); } }
      document.addEventListener('keydown', key);
      return function () { document.removeEventListener('keydown', key); html.style.overflow = over; if (prev && prev.focus) prev.focus({ preventScroll: true }); };
    }, [p.open]);
    if (!p.open) return null;
    var car = p.car || null;
    return h('div', { className: 'kt kt-drawer-wrap', onMouseDown: function (e) { if (e.target === e.currentTarget) p.onClose && p.onClose(); } },
      h('aside', { className: 'kt-drawer', role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'kt-drawer-title' },
        h('header', { className: 'kt-drawer-head' },
          h('div', null,
            h('span', { className: 'kt-sechead-n' }, D.eyebrow + (car ? ' · ' + car.brand + ' ' + car.model : '')),
            h('h2', { id: 'kt-drawer-title' }, s.calc.title),
            h('p', null, D.sub)),
          h('button', { ref: closeRef, type: 'button', className: 'kt-sheet-close kt-drawer-close', 'aria-label': D.close, onClick: p.onClose }, '×')),
        h('div', { className: 'kt-drawer-body' },
          h(ImportCalculator, { key: (car && car.id) || 'blank', lang: lang, car: car, rules: p.rules, onResult: function (v, r) { last.current = { v: v, r: r }; setTotal(r.total); } })),
        h('footer', { className: 'kt-drawer-foot' },
          h('div', null, h('span', { className: 'kt-label' }, s.calc.total), h('div', { className: 'kt-drawer-total' }, h(RollingNumber, { value: total || 0, lang: lang, suffix: ' PLN' }))),
          h(Button, { variant: 'primary', arrow: true, onClick: function () { var l = last.current; if (l && p.onOrder) p.onOrder(l.v, l.r, car); } }, s.orderThis))));
  }
  // what the calculator hands to the lead form: "Kalkulator · 150 000 CNY · EV · razem 180 550 PLN"
  function calcSummary(v, r, car, lang) {
    var s = t(lang), parts = [car ? car.brand + ' ' + car.model : s.drawer.summary];
    parts.push(new Intl.NumberFormat(LOCALE[lang]).format(+v.price || 0) + ' ' + v.currency);
    parts.push(s[v.drive] || v.drive);
    parts.push(s.calc.total + ' ' + money(r.total, lang));
    return parts.join(' · ');
  }

  // ---------- cars already in Poland ----------

  function StockCard(p) {
    var c = p.car || SAMPLE_STOCK[0], lang = p.lang || 'pl', s = t(lang);
    return h('article', Object.assign({ className: 'kt kt-stock' }, glare(3)),
      h('div', { className: 'kt-stock-band' }, h('span', null, s.inPoland), h('span', null, c.location)),
      h('div', { className: 'kt-offer-bay' }, h(DriveTag, { drive: c.drive, lang: lang }), h(CarImage, { car: c })),
      h('div', { className: 'kt-offer-body' },
        h('h3', null, c.brand + ' ' + c.model),
        h('div', { className: 'kt-offer-meta' }, [c.year, c.km, c.location].join(' · ')),
        h('div', { className: 'kt-offer-foot' },
          h('div', null, h('div', { className: 'kt-price' }, money(c.priceFinal, lang)), h('div', { className: 'kt-label', style: { marginTop: 4 } }, s.finalPrice))),
        h('div', { className: 'kt-stock-actions' },
          h(Button, { variant: 'primary', size: 'sm', onClick: function () { p.onReserve && p.onReserve(c); } }, s.reserve),
          h(Button, { variant: 'outline', size: 'sm', onClick: function () { p.onTestDrive && p.onTestDrive(c); } }, s.testDrive))));
  }

  // ---------- page scaffolding ----------
  function SectionHeader(p) {
    var s = t(p.lang), sec = s.sec[p.kind] || [];
    return h('header', { className: 'kt kt-sechead' },
      h('span', { className: 'kt-sechead-n' }, p.index || '01'),
      h('div', null, h('h2', null, p.title || sec[0]), h('p', null, p.sub || sec[1])),
      p.action !== false ? h('a', { href: p.href || '#' }, (p.action || s.more) + ' →') : null);
  }

  function ReservedSection(p) {
    var lang = p.lang || 'pl', s = t(lang), sec = s.sec[p.kind] || ['', ''];
    var items = p.items || s.planned[p.kind] || [];
    return h('section', { className: 'kt kt-reserved', 'aria-label': sec[0] },
      h('div', { className: 'kt-reserved-top' }, p.index ? h('span', { className: 'kt-sechead-n' }, p.index) : null, h('span', { className: 'kt-soon' }, s.reserved)),
      h('h2', null, p.title || sec[0]),
      h('p', null, p.sub || sec[1]),
      h('ul', null, items.map(function (x) { return h('li', { key: x }, x); })));
  }

  function Footer(p) {
    var lang = p.lang || 'pl', s = t(lang);
    return h('footer', { className: 'kt kt-footer' },
      h('div', { className: 'kt-footer-brand' }, h('div', { className: 'kt-logo', 'aria-label': 'MotorSpace' }, h(BrandLogo, { large: true, reveal: true }), h('span', null, 'CN → PL')),
        h('p', null, p.company || COMPANY.legal || '[Nazwa firmy] · NIP — · KRS —')),
      s.footer.map(function (col) {
        return h('nav', { key: col[0] }, h('div', { className: 'kt-label' }, col[0]), col[1].map(function (l) { var lab = Array.isArray(l) ? l[0] : l, href = Array.isArray(l) ? l[1] : '#'; if (href === 'mailto:') href = 'mailto:' + (COMPANY.email || ''); return h('a', { key: lab, href: href }, lab); }));
      }),
      h('div', { className: 'kt-footer-end' }, h(LangSwitch, { value: lang, onChange: p.onLang }), h('span', { className: 'kt-label' }, '© ' + new Date().getFullYear())),
      // the wordmark set large and fading into the page: the last thing you see
      h('div', { className: 'kt-footer-mark', 'aria-hidden': true }, h(BrandLogo, { large: true, reveal: true }), h('span', null, 'CN → PL')));
  }

  // ---------- home page: the search hero, the company story and the model spotlight ----------
  var T5 = {
    pl: { heroEyebrow: 'MotorSpace · import samochodów z Chin', heroTitle: ['Samochody z Chin.', 'Sprowadzone pod klucz.'],
      heroSub: 'Kupujemy u producentów i dealerów w Chinach, sami sprawdzamy każde auto i sami odprawiamy je w Polsce. Do każdego dostajesz raport z niezależnej inspekcji z tłumaczeniem na polski.',
      tabs: ['Na zamówienie z Chin', 'Od ręki w Polsce'], budget: 'Budżet', anyBody: 'Każde', anyBudget: 'Bez limitu', upTo: 'do', offersWord: ['oferta', 'oferty', 'ofert'], popular: 'Popularne',
      chips: [['Xiaomi SU7', 'Xiaomi SU7'], ['Xiaomi YU7', 'Xiaomi YU7'], ['BMW i5', 'BMW i5'], ['Mercedes EQE', 'Mercedes EQE'], ['SUV 7 miejsc', 'suv 7 miejsc'], ['Elektryczne', 'ev']],
      trust: ['Pełna cena z cłem i VAT od razu', 'Własna odprawa celna w Polsce', 'Raport z niezależnej inspekcji'], scroll: 'Przewiń',
      about: 'O nas', aboutText: 'MotorSpace to polsko-chiński zespół, który sprowadza samochody prosto od producentów i dealerów. Sami kupujemy, sami sprawdzamy, sami odprawiamy. Do każdego auta dostajesz raport z niezależnej inspekcji w Chinach wraz z tłumaczeniem na polski.',
      stats: [{ v: 12, suffix: '–16', l: 'tygodni od umowy do odbioru' }, { v: 100, suffix: '%', l: 'aut z raportem z niezależnej inspekcji' }, { v: 8, l: 'etapów zamówienia do śledzenia online' }, { v: 3, l: 'języki obsługi: polski, angielski, chiński' }],
      sampleNote: '', officesTitle: 'Dwa kraje, jeden zespół', localTime: 'czas lokalny',
      offices: [['Warszawa', 'Biuro główne · 华沙', 'Obsługa klienta, odprawa i odbiór aut', 'Europe/Warsaw'], ['Chiny', '中国', 'Zakupy u dealerów i inspekcja', 'Asia/Shanghai']],
      whyTitle: 'Dlaczego MotorSpace',
      why: [['Zakup u źródła', 'Kupujemy bezpośrednio u producentów i autoryzowanych dealerów — bez pośredników.'], ['Inspekcja przed wysyłką', 'Nasz inspektor w Chinach sprawdza auto punkt po punkcie. Dostajesz raport ze zdjęciami i wideo.'],
        ['Koszty bez niespodzianek', 'Cło, akcyza, VAT i opłaty liczymy od razu. Cena w umowie jest ceną końcową.'], ['Raport po polsku', 'Niezależny inspektor sprawdza auto w Chinach, a raport dostajesz z tłumaczeniem na polski. Wiesz, co kupujesz, zanim auto wypłynie.']],
      spot: { eyebrow: 'Model miesiąca', sub: 'Sześć miejsc, 898 KM i 1 200 km zasięgu. Flagowy SUV marki Zeekr — na zamówienie z Chin, z pełną ceną w Polsce.',
        specs: [['660 kW', 'moc systemowa · 898 KM'], ['3,9 s', 'od 0 do 100 km/h'], ['1 200 km', 'zasięg CLTC · 300 km na prądzie'], ['6 miejsc', 'fotele zero gravity w 2. rzędzie'], ['900 V', 'ładowanie 6C · 20–80% w ok. 9 min']],
        turn: 'Obróć w 3D', order: 'Zamów 9X', from: 'w Polsce od', cny: 'cena w Chinach', note: 'Model 3D poglądowy: zbudowany w Blenderze na podstawie zdjęć i wymiarów auta.',
        drag: 'Przewijaj albo przeciągnij, aby obrócić', close: 'Zamknij', loading3d: 'Wczytywanie modelu 3D…' },
      secX: { showroom: ['Salon', 'Kliknij gablotę — auto wyjedzie na scenę.'] },
      nav: ['Zamów auto', 'Od ręki', 'O nas', 'Serwis', 'Kontakt'] },
    en: { heroEyebrow: 'MotorSpace · car imports from China', heroTitle: ['Cars from China.', 'Delivered turnkey.'],
      heroSub: 'We buy from manufacturers and dealers in China, inspect every car on site, clear it through customs in Poland ourselves. Every car comes with an independent inspection report translated into Polish.',
      tabs: ['To order from China', 'In stock in Poland'], budget: 'Budget', anyBody: 'Any', anyBudget: 'No limit', upTo: 'up to', offersWord: ['offer', 'offers'], popular: 'Popular',
      chips: [['Xiaomi SU7', 'Xiaomi SU7'], ['Xiaomi YU7', 'Xiaomi YU7'], ['BMW i5', 'BMW i5'], ['Mercedes EQE', 'Mercedes EQE'], ['7-seat SUV', 'suv 7 seat'], ['Electric', 'ev']],
      trust: ['Full price with duty and VAT, up front', 'Our own customs clearance in Poland', 'Independent inspection report'], scroll: 'Scroll',
      about: 'About us', aboutText: 'MotorSpace is a Polish–Chinese team that brings cars straight from manufacturers and dealers. We buy, we inspect, we clear customs. Every car comes with an independent inspection report from China, translated into Polish.',
      stats: [{ v: 12, suffix: '–16', l: 'weeks from contract to collection' }, { v: 100, suffix: '%', l: 'of cars with an independent inspection report' }, { v: 8, l: 'order stages you can track online' }, { v: 3, l: 'languages: Polish, English, Chinese' }],
      sampleNote: '', officesTitle: 'Two countries, one team', localTime: 'local time',
      offices: [['Warsaw', 'Head office · 华沙', 'Customer service, customs and handover', 'Europe/Warsaw'], ['China', '中国', 'Sourcing and inspection', 'Asia/Shanghai']],
      whyTitle: 'Why MotorSpace',
      why: [['Bought at the source', 'We buy directly from manufacturers and authorised dealers — no middlemen.'], ['Inspected before shipping', 'Our inspector in China checks the car point by point. You get a report with photos and video.'],
        ['No surprise costs', 'Duty, excise, VAT and fees are calculated up front. The price in the contract is final.'], ['A report in Polish', 'An independent inspector checks the car in China and you get the report translated into Polish. You know what you are buying before it ships.']],
      spot: { eyebrow: 'Model of the month', sub: 'Six seats, 898 hp and 1,200 km of range. Zeekr’s flagship SUV — to order from China, with the full price in Poland.',
        specs: [['660 kW', 'system output · 898 hp'], ['3.9 s', '0–100 km/h'], ['1,200 km', 'CLTC range · 300 km electric'], ['6 seats', 'zero-gravity second row'], ['900 V', '6C charging · 20–80% in about 9 min']],
        turn: 'Turn it in 3D', order: 'Order the 9X', from: 'in Poland from', cny: 'price in China', note: '3D model for illustration: built in Blender from photos and the car’s dimensions.',
        drag: 'Scroll or drag to turn', close: 'Close', loading3d: 'Loading the 3D model…' },
      secX: { showroom: ['Showroom', 'Click a case — the car drives onto the stage.'] },
      nav: ['Order', 'In stock', 'About', 'Service', 'Contact'] },
    zh: { heroEyebrow: 'MotorSpace · 中国汽车进口', heroTitle: ['中国好车，', '一站式进口到波兰。'],
      heroSub: '我们直接向中国的厂家和经销商采购，自己验车，自己在波兰清关。每台车都附第三方检测报告和它的波兰语译本。',
      tabs: ['从中国预订', '波兰现车'], budget: '预算', anyBody: '不限', anyBudget: '不限', upTo: '最高', offersWord: '个车源', popular: '热门搜索',
      chips: [['小米 SU7', 'Xiaomi SU7'], ['小米 YU7', 'Xiaomi YU7'], ['宝马 i5', 'BMW i5'], ['奔驰 EQE', 'Mercedes EQE'], ['7 座 SUV', 'suv 7座'], ['纯电', 'ev']],
      trust: ['立即显示含关税和增值税的完整价格', '自己在波兰清关', '第三方检测报告'], scroll: '向下滚动',
      about: '关于我们', aboutText: 'MotorSpace 是一支中波团队，直接从厂家和经销商把车带到波兰。我们自己采购、自己验车、自己清关。每台车都附第三方检测报告和它的波兰语翻译件。',
      stats: [{ v: 12, suffix: '–16', l: '周，从签约到提车' }, { v: 100, suffix: '%', l: '的车附第三方检测报告' }, { v: 8, l: '个订单环节可在线追踪' }, { v: 3, l: '种服务语言：波兰语、英语、中文' }],
      sampleNote: '', officesTitle: '两个国家，一个团队', localTime: '当地时间',
      offices: [['华沙', 'Warszawa · 总部', '客户服务、清关与交车', 'Europe/Warsaw'], ['中国', 'China', '采购与验车', 'Asia/Shanghai']],
      whyTitle: '为什么选 MotorSpace',
      why: [['源头采购', '直接向厂家和授权经销商采购，没有中间商。'], ['发运前验车', '我们在中国的验车员逐项检查车辆，并提供照片和视频报告。'],
        ['费用透明', '关税、消费税、增值税和各项费用一次算清，合同价就是最终价。'], ['波兰语检测报告', '第三方检测机构在中国验车，报告附波兰语译本。车还没装船，你就知道自己买的是什么。']],
      spot: { eyebrow: '本月车型', sub: '6 座、898 马力、1200 公里综合续航。极氪旗舰 SUV，从中国预订，直接显示波兰到手价。',
        specs: [['660 kW', '系统总功率 · 898 马力'], ['3.9 秒', '百公里加速'], ['1200 km', 'CLTC 综合续航 · 纯电 300 km'], ['6 座', '第二排零重力座椅'], ['900 V', '6C 超充 · 20–80% 约 9 分钟']],
        turn: '3D 旋转查看', order: '预订 9X', from: '波兰到手价约', cny: '中国售价', note: '3D 模型仅供示意：根据照片和整车尺寸在 Blender 中建模。',
        drag: '滚动或拖动旋转', close: '关闭', loading3d: '正在加载 3D 模型…' },
      secX: { showroom: ['展厅', '点击展示盒，车会开上展台。'] },
      nav: ['订车', '现车', '关于我们', '售后', '联系我们'] }
  };
  Object.keys(T5).forEach(function (k) { var x = T5[k]; Object.assign(T[k], x); T[k].sec = Object.assign({}, T[k].sec, x.secX); });

  // HomeHero: a dark stage where container doors swing open; the search console sits in the light
  function HomeHero(p) {
    var lang = p.lang || 'pl', s = t(lang), ref = useRef(null);
    useEffect(function () {
      var el = ref.current;
      if (!el || reduced() || !finePointer()) return;
      var raf = 0, x = 0.5, y = 0.5;
      function apply() { raf = 0; el.style.setProperty('--hx', x.toFixed(3)); el.style.setProperty('--hy', y.toFixed(3)); }
      function on(e) { var r = el.getBoundingClientRect(); x = (e.clientX - r.left) / r.width; y = (e.clientY - r.top) / r.height; if (!raf) raf = requestAnimationFrame(apply); }
      el.addEventListener('pointermove', on);
      return function () { el.removeEventListener('pointermove', on); if (raf) cancelAnimationFrame(raf); };
    }, []);
    return h('section', { ref: ref, className: cx('kt kt-dark kt-hh', p.className), 'data-nav-dark': '', 'aria-label': s.heroEyebrow },
      h('div', { className: 'kt-hh-scene', 'aria-hidden': true },
        h('div', { className: 'kt-hh-frame' },
          h('svg', { className: 'kt-hh-box', viewBox: '0 0 1200 640', preserveAspectRatio: 'none' },
            h('path', { pathLength: 1, d: 'M0 0L450 236M1200 0L750 236M0 640L450 410M1200 640L750 410M450 236H750V410H450Z' }),
            h('path', { pathLength: 1, className: 'kt-hh-ribs', d: 'M150 79V561M270 141V500M360 189V452M1050 79V561M930 141V500M840 189V452' })),
          h('div', { className: 'kt-hh-back' }),
          h('div', { className: 'kt-hh-door kt-hh-door-l' }, h('i'), h('i')),
          h('div', { className: 'kt-hh-door kt-hh-door-r' }, h('i'), h('i'))),
        h('div', { className: 'kt-hh-floor' })),
      h('div', { className: 'kt-hh-in' },
        h('div', { className: 'kt-label kt-hh-eyebrow' }, s.heroEyebrow),
        h(HeroTitle, { key: lang, lines: s.heroTitle }),
        h('p', { className: 'kt-hh-sub' }, s.heroSub),
        h('div', { className: 'kt-hh-console' }, h(HomeSearch, { lang: lang, cars: p.cars, onSearch: p.onSearch })),
        h('ul', { className: 'kt-hh-trust' }, s.trust.map(function (x) { return h('li', { key: x }, x); }))),
      h('div', { className: 'kt-hh-cue', 'aria-hidden': true }, h('span', { className: 'kt-label' }, s.scroll), h('i')));
  }

  // HomeSearch: the reference site opens with a search; ours counts matching cars as you type
  function Pick(p) {
    return h('label', { className: 'kt-hs-pick' }, h('span', { className: 'kt-label' }, p.label),
      h('select', { value: p.value, onChange: function (e) { p.onChange(e.target.value); } }, p.options.map(function (o) { return h('option', { key: o[0], value: o[0] }, o[1]); })));
  }
  function HomeSearch(p) {
    var lang = p.lang || 'pl', s = t(lang), cars = p.cars || SAMPLE_LISTINGS;
    var tb = useState(p.tab || 'order'), tab = tb[0], setTab = tb[1];
    var qs = useState(''), q = qs[0], setQ = qs[1];
    var bs = useState(''), body = bs[0], setBody = bs[1];
    var ds = useState(''), drive = ds[0], setDrive = ds[1];
    var ps = useState(''), pmax = ps[0], setPmax = ps[1];
    var tabsRef = useRef(null), tbox = useThumb(tabsRef, tab);
    function filters() { return { status: [tab], body: body ? [body] : [], drive: drive ? [drive] : [], priceMax: pmax }; }
    var n = filterCars(cars, filters(), q).length;
    function go(query) { p.onSearch && p.onSearch({ query: query != null ? query : q, filters: filters(), tab: tab }); }
    return h('form', { className: 'kt kt-hs', role: 'search', onSubmit: function (e) { e.preventDefault(); go(); } },
      h('div', { className: 'kt-hs-top' },
        h('div', { ref: tabsRef, className: cx('kt-hs-tabs', tbox && 'has-thumb'), role: 'group', 'aria-label': s.availability }, thumb(tbox),
          [['order', s.tabs[0]], ['stock', s.tabs[1]]].map(function (x) {
            return h('button', { key: x[0], type: 'button', 'aria-pressed': tab === x[0], onClick: function () { setTab(x[0]); } }, x[1]);
          })),
        h('span', { className: 'kt-hs-count', 'aria-live': 'polite' }, h(RollingNumber, { value: n, format: String }), ' ' + nWord(lang, n, s.offersWord).replace(/^\d+ /, ''))),
      h('div', { className: 'kt-hs-row' },
        h('div', { className: 'kt-hs-q' }, h('span', { className: 'kt-label' }, s.searchFor),
          h(SearchField, { lang: lang, cars: cars, value: q, onChange: setQ, onSubmit: function (x) { setQ(x); go(x); }, onBrand: function (b) { setQ(b); go(b); } })),
        h(Pick, { label: s.bodyType, value: body, onChange: setBody, options: [['', s.anyBody]].concat(['suv', 'sedan', 'hatch', 'van', 'sport'].map(function (b) { return [b, s.bodies[b]]; })) }),
        h(Pick, { label: s.driveSel, value: drive, onChange: setDrive, options: [['', s.any]].concat(['ev', 'phev', 'erev', 'hev', 'ice'].map(function (d) { return [d, s[d]]; })) }),
        h(Pick, { label: s.budget, value: pmax, onChange: setPmax, options: [['', s.anyBudget]].concat([150000, 200000, 300000, 400000].map(function (v) { return [String(v), s.upTo + ' ' + money(v, lang)]; })) }),
        h(Button, { variant: 'primary', type: 'submit', arrow: true, className: 'kt-hs-go' }, s.search)),
      h('div', { className: 'kt-hs-pop' }, h('span', { className: 'kt-label' }, s.popular),
        s.chips.map(function (c) { return h('button', { key: c[0], type: 'button', className: 'kt-hs-chip', onClick: function () { setQ(c[1]); go(c[1]); } }, c[0]); })));
  }

  // ScrollWords: a statement whose words light up as it passes through the viewport
  function ScrollWords(p) {
    var ref = useRef(null), lang = p.lang || 'pl';
    useEffect(function () {
      var el = ref.current;
      if (!el) return;
      if (reduced()) { el.style.setProperty('--p', '1'); return; }
      var sp = scrollParent(el), target = sp === window ? window : sp, raf = 0;
      function frame() {
        raf = 0;
        var r = el.getBoundingClientRect(), vp = viewportOf(sp), start = vp.top + vp.height * 0.88, end = vp.top + vp.height * 0.32;
        var pr = (start - r.top) / Math.max(1, (start - end) + r.height * 0.5);
        el.style.setProperty('--p', Math.min(1, Math.max(0, pr)).toFixed(3));
      }
      function on() { if (!raf) raf = requestAnimationFrame(frame); }
      frame();
      target.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on);
      return function () { target.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
    }, []);
    var parts = lang === 'zh' ? Array.from(p.text) : p.text.split(' '), n = parts.length;
    return h(p.as || 'p', { ref: ref, className: cx('kt kt-sw', p.className) },
      h('span', { className: 'kt-sr' }, p.text),
      h('span', { 'aria-hidden': true }, parts.map(function (w, i) {
        return h('span', { key: i, className: 'kt-sw-w', style: { '--i': (i / n).toFixed(4) } }, w + (lang === 'zh' || i === n - 1 ? '' : ' '));
      })));
  }

  // StatRow: odometer numbers that roll once the row is on screen
  function StatRow(p) {
    var lang = p.lang || 'pl', s = t(lang), items = p.items || s.stats, ref = useRef(null), vs = useState(false), on = vs[0], setOn = vs[1];
    useEffect(function () {
      var el = ref.current;
      if (!el || !window.IntersectionObserver || reduced()) { setOn(true); return; }
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.35 });
      io.observe(el);
      return function () { io.disconnect(); };
    }, []);
    return h('dl', { ref: ref, className: cx('kt kt-stats', p.className) }, items.map(function (it, i) {
      var len = String(it.v).length;
      return h('div', { key: i, className: 'kt-stat' },
        h('dd', null, h(RollingNumber, { value: on ? it.v : 0, lang: lang, format: function (v) { var x = String(Math.round(v)); while (x.length < len) x = '0' + x; return x; } }),
          it.suffix ? h('span', { className: 'kt-stat-suf' }, it.suffix) : null),
        h('dt', null, it.l));
    }));
  }

  // OfficeClocks: an analogue clock per office, in that office's time zone
  function timeIn(ms, tz) {
    try {
      var o = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ms)).forEach(function (x) { o[x.type] = +x.value; });
      return { h: o.hour % 24, m: o.minute, s: o.second };
    } catch (e) { var d = new Date(ms); return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() }; }
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function Clock(p) {
    var ha = ((p.h % 12) + p.m / 60) * 30, ma = (p.m + p.s / 60) * 6, sa = p.s * 6, ticks = [];
    for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6, r0 = i % 3 ? 41 : 36; ticks.push(h('line', { key: i, className: 'kt-clock-tick', x1: 50 + Math.sin(a) * r0, y1: 50 - Math.cos(a) * r0, x2: 50 + Math.sin(a) * 45, y2: 50 - Math.cos(a) * 45 })); }
    return h('svg', { className: 'kt-clock', viewBox: '0 0 100 100', 'aria-hidden': true },
      h('circle', { className: 'kt-clock-face', cx: 50, cy: 50, r: 48.5 }), ticks,
      h('line', { className: 'kt-clock-h', x1: 50, y1: 55, x2: 50, y2: 28, transform: 'rotate(' + ha.toFixed(2) + ' 50 50)' }),
      h('line', { className: 'kt-clock-m', x1: 50, y1: 57, x2: 50, y2: 15, transform: 'rotate(' + ma.toFixed(2) + ' 50 50)' }),
      h('line', { className: 'kt-clock-s', x1: 50, y1: 61, x2: 50, y2: 11, transform: 'rotate(' + sa + ' 50 50)' }),
      h('circle', { className: 'kt-clock-pin', cx: 50, cy: 50, r: 2.4 }));
  }
  function OfficeClocks(p) {
    var lang = p.lang || 'pl', s = t(lang), list = p.offices || s.offices;
    var ns = useState(function () { return Date.now(); }), now = ns[0], setNow = ns[1], ref = useRef(null);
    useEffect(function () {
      var id = 0;
      function start() { if (!id) id = setInterval(function () { setNow(Date.now()); }, 1000); }
      function halt() { if (id) { clearInterval(id); id = 0; } }
      var io = window.IntersectionObserver ? new IntersectionObserver(function (es) { if (es[0].isIntersecting) { setNow(Date.now()); start(); } else halt(); }) : null;
      if (io) io.observe(ref.current); else start();
      return function () { halt(); if (io) io.disconnect(); };
    }, []);
    return h('div', { ref: ref, className: cx('kt kt-offices', p.className) }, list.map(function (o, i) {
      var tm = timeIn(now, o[3]);
      return h('article', { key: o[0], className: 'kt-office', 'data-reveal': '', style: { '--i': i } },
        h(Clock, tm),
        h('div', null,
          h('h3', null, o[0], h('span', null, o[1])),
          h('p', null, o[2]),
          h('span', { className: 'kt-label' }, pad2(tm.h) + ':' + pad2(tm.m) + ' · ' + s.localTime)));
    }));
  }

  // WhyUs: four promises; the line icons draw themselves in when the cards arrive
  var WHY_ICONS = ['M3 20.5V10l5 3.5V10l5 3.5V5.5h8v15H3zM7 20.5v-3M11.5 20.5v-3M16 20.5v-3',
    'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.3 15.3L21 21M7.6 10.6l2 2 3.4-4',
    'M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6M9 16h3',
    'M12 3l8 3v6c0 4.6-3.4 8.2-8 9-4.6-.8-8-4.4-8-9V6l8-3zM8.6 12.2l2.4 2.4 4.4-4.8'];
  function WhyUs(p) {
    var lang = p.lang || 'pl', s = t(lang);
    return h('div', { className: cx('kt kt-why', p.className) }, s.why.map(function (w, i) {
      return h('article', { key: i, className: 'kt-why-card', 'data-reveal': '', style: { '--i': i } },
        h('svg', { viewBox: '0 0 24 24', className: 'kt-why-icon', 'aria-hidden': true }, h('path', { d: WHY_ICONS[i % WHY_ICONS.length], pathLength: 1 })),
        h('span', { className: 'kt-label' }, pad2(i + 1)),
        h('h3', null, w[0]), h('p', null, w[1]));
    }));
  }


  // ---------- FAQ: four topics; each question opens in place. Also emits FAQPage structured data for search engines ----------
  var T6 = {"pl": {"faq": {"eyebrow": "Najczęstsze pytania", "title": "Pytania, które słyszymy najczęściej.", "sub": "Nie ma Twojego pytania? Napisz do nas — odpowiadamy po polsku, angielsku i chińsku.", "groups": [{"title": "Zamówienie i płatność", "items": [["Jak wygląda zamówienie krok po kroku?", "Wybierasz model, wersję i kolor, a my potwierdzamy dostępność u dealera w Chinach i cenę. Podpisujemy umowę po polsku i wpłacasz zaliczkę. Kupujemy auto, sprawdzamy je na miejscu, a niezależny inspektor przygotowuje raport ze zdjęciami i wideo — dostajesz go razem z tłumaczeniem na polski. Potem transport do Europy i odprawa celna, którą prowadzimy sami. Homologację i rejestrację możesz zlecić nam albo załatwić samodzielnie. Cały proces trwa zwykle 12–16 tygodni."], ["Ile wynosi zaliczka i kiedy płacę resztę?", "Zaliczka to 30% ceny końcowej i płacisz ją przy podpisaniu umowy. Pozostałe 70% płacisz, gdy auto dotrze do portu w Europie. Wszystkie płatności idą przelewem na konto polskiej spółki, na fakturę."], ["Czy cena z konfiguratora jest ostateczna?", "Szacunek: cena CIP obejmuje fracht do portu w Europie i ubezpieczenie. Doliczamy dopłatę za trasę do Polski, cło, należne cło wyrównawcze, akcyzę, VAT oraz port, odprawę, homologację, tłumaczenia i rejestrację. Cło wyrównawcze dotyczy tylko nowych EV i aut z przedłużaczem zasięgu wyprodukowanych w Chinach, nie aut Imported. Kurs według dziennej tabeli NBP; przy braku połączenia oznaczony kurs orientacyjny. Cena ostateczna zgodnie z umową."], ["Czy mogę zamówić model, którego nie ma na stronie?", "Tak. Sprowadzamy każdy model sprzedawany w Chinach — nowy albo używany. Napisz, jaki model i wersja Cię interesują, a w ciągu kilku dni dostaniesz wycenę z pełnym kosztem w Polsce."]]}, {"title": "Transport, cło i rejestracja", "items": [["Jak auto jedzie z Chin do Polski?", "Najczęściej w kontenerze drogą morską do portu w Europie, a stamtąd lawetą do Polski. Przy pilnych zamówieniach korzystamy z kolei albo transportu drogowego. Auto jest ubezpieczone na całej trasie, a Ty dostajesz zdjęcia z każdego etapu: załadunek, port, odprawa, przyjazd."], ["Czy auto z Chin można legalnie zarejestrować w Polsce?", "Tak. Jeśli model ma europejskie świadectwo zgodności (CoC), rejestracja przebiega jak przy każdym aucie z importu. Jeśli nie ma, potrzebne jest dopuszczenie jednostkowe w Polsce. Tłumaczenia przysięgłe, badanie techniczne i wizytę w wydziale komunikacji możemy załatwić za Ciebie albo przygotować Ci komplet dokumentów, żebyś zrobił to sam."], ["Jakie podatki i opłaty są wliczone w cenę?", "Szacunek: cena CIP obejmuje fracht do portu w Europie i ubezpieczenie. Doliczamy dopłatę za trasę do Polski, cło, należne cło wyrównawcze, akcyzę, VAT oraz port, odprawę, homologację, tłumaczenia i rejestrację. Cło wyrównawcze dotyczy tylko nowych EV i aut z przedłużaczem zasięgu wyprodukowanych w Chinach, nie aut Imported. Kurs według dziennej tabeli NBP; przy braku połączenia oznaczony kurs orientacyjny. Cena ostateczna zgodnie z umową."]]}, {"title": "Auto na co dzień w Europie", "items": [["Czy auto elektryczne z Chin naładuję w Polsce?", "Auta na rynek chiński mają złącze GB/T, a w Europie standardem jest Type 2 i CCS2. Do każdego auta dołączamy przejściówki na europejski standard, więc ładowanie w domu, w pracy i na publicznych stacjach działa normalnie. Jeśli dany model jest dostępny w wersji z europejskim gniazdem, powiemy Ci o tym przed zamówieniem."], ["Czy serwis i części są dostępne w Polsce?", "Przeglądy i naprawy wykonują nasze warsztaty partnerskie, w tym serwisy wyspecjalizowane w autach elektrycznych. Części zamawiamy bezpośrednio z Chin, typowe elementy eksploatacyjne są dostępne od ręki. Aktualizacje oprogramowania zależą od marki — przed zamówieniem informujemy, jak wyglądają w danym modelu."]]}, {"title": "Gwarancja, dokumenty i ubezpieczenie", "items": [["Jaką gwarancję dostaję?", "To zależy od modelu, wieku auta i tego, czy producent obsługuje gwarancję w Europie. Przed podpisaniem umowy mówimy wprost, jaka ochrona przysługuje na konkretne auto, a jakiej nie ma — bez ogólnych obietnic. Pewne jest jedno: zanim auto wyjedzie z Chin, dostajesz raport z niezależnej inspekcji z tłumaczeniem na polski."], ["Jakie dokumenty dostanę razem z autem?", "Umowę i fakturę, dokumenty celne (SAD) i potwierdzenie zapłaty akcyzy, raport z niezależnej inspekcji z tłumaczeniem na polski, chińskie dokumenty pojazdu z tłumaczeniami przysięgłymi oraz świadectwo zgodności, jeśli model je ma. Jeśli zlecisz nam rejestrację, dostajesz też dowód rejestracyjny i tablice."], ["Czy ubezpieczę takie auto w Polsce?", "Tak, OC i AC działają tak samo jak dla każdego auta zarejestrowanego w Polsce. Niektórzy ubezpieczyciele proszą przy AC o wycenę rzeczoznawcy — pomagamy ją załatwić i podpowiadamy, które towarzystwa dobrze znają chińskie marki."]]}]}}, "en": {"faq": {"eyebrow": "Frequently asked questions", "title": "The questions we hear most often.", "sub": "Not here? Write to us. We answer in Polish, English and Chinese.", "groups": [{"title": "Ordering and payment", "items": [["How does an order work, step by step?", "You pick the model, trim and colour; we confirm availability with the dealer in China and the price. We sign a contract in Polish, with an English version, and you pay the deposit. We buy the car, our inspector checks it on site and sends you a report with photos and video. Then shipping to Europe, customs clearance and registration in Poland. You collect a car that is ready to drive. The whole process usually takes 12–16 weeks."], ["How much is the deposit, and when do I pay the rest?", "The deposit is 30% of the final price, paid when the contract is signed. The remaining 70% is due once the car reaches the port in Europe. All payments go by bank transfer to a Polish company account, with an invoice."], ["Is the configurator price final?", "Estimate: CIP includes freight to a European port and insurance. We add the Polish-route surcharge, customs duty, applicable countervailing duty, excise, VAT, port charges, customs clearance, homologation, translations and registration. Countervailing duty applies only to new China-made EVs and range-extender EVs, excluding Imported cars. Exchange rates follow the daily NBP table; a labelled indicative rate is used when unavailable. The final price is set by the contract."], ["Can I order a model that is not on the site?", "Yes. We import any model sold in China, new or used. Tell us the model and trim you want and within a few days you get a quote with the full cost in Poland."]]}, {"title": "Shipping, customs and registration", "items": [["How does the car get from China to Poland?", "Usually in a container by sea to a European port, then by truck to Poland. For urgent orders we use rail or road transport. The car is insured for the whole route and you get photos from every stage: loading, port, customs, arrival."], ["Can a car from China be legally registered in Poland?", "Yes. If the model has an EU certificate of conformity (CoC), registration works like for any imported car. If not, it needs individual vehicle approval in Poland. We can handle the sworn translations, the technical inspection and the registration office for you, or prepare a complete set of documents so you can do it yourself."], ["Which taxes and fees are included in the price?", "Estimate: CIP includes freight to a European port and insurance. We add the Polish-route surcharge, customs duty, applicable countervailing duty, excise, VAT, port charges, customs clearance, homologation, translations and registration. Countervailing duty applies only to new China-made EVs and range-extender EVs, excluding Imported cars. Exchange rates follow the daily NBP table; a labelled indicative rate is used when unavailable. The final price is set by the contract."]]}, {"title": "Living with the car in Europe", "items": [["Can I charge a Chinese EV in Poland?", "Chinese-market cars have a GB/T charging port, while Europe uses Type 2 and CCS2. Every car comes with adapters to the European standard, so charging at home, at work and at public stations works as normal. If a model is available with a European port, we tell you before you order."], ["Are servicing and parts available in Poland?", "Servicing and repairs are done by our partner workshops, including ones specialised in electric cars. We order parts directly from China; common wear parts are available immediately. Software updates depend on the brand, and we tell you before ordering how they work for that model."]]}, {"title": "Warranty, documents and insurance", "items": [["What warranty do I get?", "That depends on the model, the car's age and whether the manufacturer services its warranty in Europe. Before you sign, we tell you plainly what cover the specific car has and what it does not — no blanket promises. One thing is certain: before the car leaves China you receive an independent inspection report with a Polish translation."], ["Which documents come with the car?", "The contract and invoice, customs documents (SAD) and proof of excise payment, the independent inspection report with a Polish translation, the Chinese vehicle documents with sworn translations, and the certificate of conformity if the model has one. If you have us register the car, you also get the registration document and plates."], ["Can I insure the car in Poland?", "Yes, third-party and comprehensive insurance work like for any car registered in Poland. Some insurers ask for an appraiser's valuation for comprehensive cover; we help arrange it and point you to the companies that know Chinese brands well."]]}]}}, "zh": {"faq": {"eyebrow": "常见问题", "title": "大家问得最多的问题。", "sub": "没找到你的问题？给我们留言，我们用波兰语、英语和中文回复。", "groups": [{"title": "订车与付款", "items": [["下单流程是怎样的？", "你选定车型、版本和颜色，我们向中国经销商确认现车和价格。签订波兰语合同（可附中文版）并支付定金。我们买下车并到现场验车，第三方检测机构出具带照片和视频的检测报告，连同波兰语译本一起发给你。随后运往欧洲，由我们自己在波兰清关。认证和上牌可以委托我们办理，也可以你自己办。整个流程通常需要 12–16 周。"], ["定金多少？余款什么时候付？", "定金为最终价格的 30%，签合同时支付。其余 70% 在车辆到达欧洲港口后支付。所有款项都转账到波兰公司账户并开具发票。"], ["配置器里的价格是最终价吗？", "估算由 CIP 价（含到欧洲港口的运费和保险）、波兰航线运费补差、关税、适用的反补贴税、消费税、增值税，以及港口、清关、认证、翻译和登记费组成。反补贴税只适用于中国产新纯电及增程车，Imported 车辆不计。汇率按 NBP 当日公布汇率；无法连接时会标明参考汇率。最终价格以合同为准。"], ["网站上没有的车型可以订吗？", "可以。在中国市场销售的任何车型，新车或二手车，我们都能进口。告诉我们车型和版本，几天内就能收到含波兰落地总价的报价。"]]}, {"title": "运输、清关与上牌", "items": [["车是怎么从中国运到波兰的？", "通常是集装箱海运到欧洲港口，再用板车运到波兰；急单可以走铁路或公路。全程投保，每个环节（装柜、到港、清关、到达）都会给你发照片。"], ["中国的车能在波兰合法上牌吗？", "可以。如果车型有欧盟一致性证书（CoC），上牌流程和其他进口车一样；没有的话，需要在波兰做单车认证。宣誓翻译、车检和车管所手续可以委托我们办理，也可以由我们把全套文件准备好，你自己去办。"], ["价格里包含哪些税费？", "估算由 CIP 价（含到欧洲港口的运费和保险）、波兰航线运费补差、关税、适用的反补贴税、消费税、增值税，以及港口、清关、认证、翻译和登记费组成。反补贴税只适用于中国产新纯电及增程车，Imported 车辆不计。汇率按 NBP 当日公布汇率；无法连接时会标明参考汇率。最终价格以合同为准。"]]}, {"title": "在欧洲日常使用", "items": [["中国的电动车在波兰能充电吗？", "中国市场的车用 GB/T 充电口，欧洲标准是 Type 2 和 CCS2。每台车我们都配欧标转换头，家充、公司充电和公共充电桩都能正常使用。如果某款车型有欧标接口的版本，下单前我们会告诉你。"], ["在波兰有维修和配件吗？", "保养和维修由我们的合作维修点完成，其中包括专修电动车的门店。配件直接从中国订购，常用易损件有现货。软件升级因品牌而异，下单前我们会说明该车型的情况。"]]}, {"title": "质保、文件与保险", "items": [["质保是怎样的？", "这取决于车型、车龄，以及厂家在欧洲是否提供质保服务。签合同前我们会把这台车有哪些保障、没有哪些保障讲清楚，不做笼统承诺。可以确定的是：车离开中国之前，你会拿到第三方检测报告和它的波兰语译本。"], ["随车会拿到哪些文件？", "合同和发票、海关文件（SAD）和消费税缴纳证明、第三方检测报告及波兰语译本、带宣誓翻译的中国车辆文件，以及车型具备时的一致性证书。如果委托我们上牌，还会拿到行驶证和牌照。"], ["这样的车在波兰能上保险吗？", "可以，交强险（OC）和车损险（AC）与其他在波兰登记的车一样办理。部分保险公司在投保车损险时要求评估师估价，我们可以协助办理，并推荐熟悉中国品牌的保险公司。"]]}]}}};
  Object.keys(T6).forEach(function (k) { Object.assign(T[k], T6[k]); });
  function FAQ(p) {
    var lang = p.lang || 'pl', s = t(lang), f = s.faq;
    var os = useState({}), open = os[0], setOpen = os[1];
    function toggle(k) { setOpen(function (o) { var n = Object.assign({}, o); if (n[k]) delete n[k]; else n[k] = true; return n; }); }
    var ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };
    f.groups.forEach(function (g) { g.items.forEach(function (it) { ld.mainEntity.push({ '@type': 'Question', name: it[0], acceptedAnswer: { '@type': 'Answer', text: it[1] } }); }); });
    return h('section', { className: cx('kt kt-faq', p.className), id: p.id || 'faq', 'aria-label': f.title },
      h('header', { className: 'kt-faq-head', 'data-reveal': '' },
        h('span', { className: 'kt-sechead-n' }, (p.index ? p.index + ' · ' : '') + f.eyebrow),
        h('h2', null, f.title), h('p', null, f.sub)),
      f.groups.map(function (g, gi) {
        return h('div', { key: gi, className: 'kt-faq-group', 'data-reveal': '', style: { '--i': gi } },
          h('h3', null, g.title),
          h('div', { className: 'kt-faq-list' }, g.items.map(function (it, ii) {
            var k = gi + '.' + ii, on = !!open[k], id = 'faq-' + gi + '-' + ii;
            return h('div', { key: ii, className: cx('kt-faq-item', on && 'is-open') },
              h('h4', null, h('button', { type: 'button', className: 'kt-faq-q', 'aria-expanded': on, 'aria-controls': id, onClick: function () { toggle(k); } }, h('span', null, it[0]), h('i', { 'aria-hidden': true }))),
              h('div', { id: id, className: 'kt-faq-a', role: 'region', 'aria-hidden': !on }, h('div', null, h('p', null, it[1]))));
          })));
      }),
      h('script', { type: 'application/ld+json', dangerouslySetInnerHTML: { __html: JSON.stringify(ld) } }));
  }

  // ModelSpotlight: a pinned black stage; scrolling turns a 36-frame Blender turntable, the specs light up one by one
  function ModelSpotlight(p) {
    var lang = p.lang || 'pl', s = t(lang), sp0 = s.spot, car = p.car || SAMPLE_CARS[0];
    var count = p.frames || 36, base = p.base || '', ext = p.ext || '.webp', still = !!p.still || reduced();
    var secRef = useRef(null), canvasRef = useRef(null), imgs = useRef([]), st = useRef({ p: 0, drag: 0, frame: -1, dragging: null });
    var ss = useState(still ? 99 : 0), step = ss[0], setStep = ss[1];
    var os = useState(false), open = os[0], setOpen = os[1];
    var ts = useState(p.three || null), three = ts[0], setThree = ts[1];
    useEffect(function () { if (p.three) setThree(p.three); }, [p.three]);
    function draw(force) {
      var cv = canvasRef.current, S = st.current, im = imgs.current;
      if (!cv) return;
      var f = Math.round(S.p * count * (p.turns || 1) + S.drag);
      f = ((f % count) + count) % count;
      var k = f;
      for (var d = 1; d < count && !(im[k] && im[k].ok); d++) k = (((f + (d % 2 ? -1 : 1) * Math.ceil(d / 2)) % count) + count) % count;
      if (!(im[k] && im[k].ok) || (!force && k === S.frame)) return;
      S.frame = k;
      var dpr = Math.min(2, window.devicePixelRatio || 1), w = Math.round(cv.clientWidth * dpr), hh = Math.round(cv.clientHeight * dpr);
      if (!w || !hh) return;
      if (cv.width !== w || cv.height !== hh) { cv.width = w; cv.height = hh; }
      var c2 = cv.getContext('2d'), img = im[k], sc = Math.min(w / img.naturalWidth, hh / img.naturalHeight) * (p.zoom || 1);
      var dw = img.naturalWidth * sc, dh = img.naturalHeight * sc;
      c2.clearRect(0, 0, w, hh);
      c2.drawImage(img, (w - dw) / 2, (hh - dh) / 2, dw, dh);
    }
    // frame 0 first, the other 35 once the section is near
    useEffect(function () {
      var sec = secRef.current, im = imgs.current, started = false;
      function load(i) {
        if (im[i]) return;
        var img = new Image();
        img.decoding = 'async';
        img.onload = function () { img.ok = true; draw(true); };
        img.src = base + pad2(i) + ext;
        im[i] = img;
      }
      function all() { if (started) return; started = true; for (var i = 1; i < count; i++) load(i); }
      load(0);
      if (still) return;
      var io = window.IntersectionObserver ? new IntersectionObserver(function (es) { if (es[0].isIntersecting) { all(); io.disconnect(); } }, { rootMargin: '800px 0px' }) : null;
      if (io) io.observe(sec); else all();
      return function () { if (io) io.disconnect(); };
    }, [base]);
    // scroll position -> frame and spec step
    useEffect(function () {
      var sec = secRef.current, sp = scrollParent(sec), target = sp === window ? window : sp, raf = 0, n = sp0.specs.length;
      function frame() {
        raf = 0;
        var r = sec.getBoundingClientRect(), vp = viewportOf(sp);
        var pr = still ? 0 : Math.min(1, Math.max(0, (vp.top - r.top) / Math.max(1, r.height - vp.height)));
        st.current.p = pr;
        draw(false);
        if (!still) setStep(Math.min(n, Math.floor(pr * (n + 0.8) + 0.4)));
        sec.style.setProperty('--sp', pr.toFixed(3));
      }
      function on() { if (!raf) raf = requestAnimationFrame(frame); }
      function rs() { draw(true); on(); }
      frame();
      target.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', rs);
      return function () { target.removeEventListener('scroll', on); window.removeEventListener('resize', rs); if (raf) cancelAnimationFrame(raf); };
    }, [still]);
    // drag the car round by hand too
    function down(e) { st.current.dragging = { x: e.clientX, d: st.current.drag }; e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); }
    function move(e) { var g = st.current.dragging; if (!g) return; st.current.drag = g.d - (e.clientX - g.x) / 14; draw(false); }
    function up() { st.current.dragging = null; }
    function open3d() {
      setOpen(true);
      if (!three && p.loadThree) p.loadThree().then(setThree, function () {});
    }
    useEffect(function () {
      if (!open) return;
      function key(e) { if (e.key === 'Escape') setOpen(false); }
      document.addEventListener('keydown', key);
      return function () { document.removeEventListener('keydown', key); };
    }, [open]);
    var price = landed(car);
    return h('section', { ref: secRef, className: cx('kt kt-dark kt-spot', still && 'is-still', p.className), 'data-nav-dark': '', 'aria-label': car.brand + ' ' + car.model },
      h('div', { className: 'kt-spot-pin' },
        h('canvas', { ref: canvasRef, className: 'kt-spot-canvas', role: 'img', 'aria-label': car.brand + ' ' + car.model + ' · 360°',
          onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up }),
        h('div', { className: 'kt-spot-head' },
          h('span', { className: 'kt-label' }, sp0.eyebrow),
          h('h2', null, h('span', { className: 'kt-spot-brand' }, car.brand.toUpperCase()), ' ', car.model.split(' ')[0]),
          h('p', null, sp0.sub)),
        h('ol', { className: 'kt-spot-specs' }, sp0.specs.map(function (x, i) {
          return h('li', { key: i, className: cx(i < step && 'is-on') }, h('b', null, x[0]), h('span', null, x[1]));
        })),
        h('span', { className: 'kt-label kt-spot-hint', 'aria-hidden': true }, h('i', null), sp0.drag),
        h('div', { className: 'kt-spot-foot' },
          h('div', { className: 'kt-spot-price' },
            h('span', { className: 'kt-label' }, sp0.from),
            h('div', { className: 'kt-price' }, price == null ? s.askPrice : money(price, lang)),
            !isBox(car) && car.priceCNY ? h('span', { className: 'kt-spot-cny' }, sp0.cny + ' ' + new Intl.NumberFormat(LOCALE[lang] || 'pl-PL').format(car.priceCNY) + ' CNY') : null),
          h('div', { className: 'kt-spot-cta' },
            p.src3d ? h(Button, { variant: 'outline', onClick: open3d }, sp0.turn) : null,
            h(Button, { variant: 'primary', arrow: true, onClick: function () { p.onOrder && p.onOrder(car); } }, sp0.order)),
          h('p', { className: 'kt-spot-note' }, sp0.note))),
      open ? h('div', { className: 'kt-spot-3d', role: 'dialog', 'aria-modal': true, 'aria-label': car.brand + ' ' + car.model + ' · 3D' },
        three ? h(Car3DView, { three: three, lang: lang, src: p.src3d, body: car.body, paint: car.paint || 'black', podium: 0x0a0a0b, title: car.brand + ' ' + car.model, className: 'kt-spot-3dview' })
          : h('div', { className: 'kt-label kt-spot-wait' }, sp0.loading3d),
        h('button', { type: 'button', className: 'kt-spot-close', onClick: function () { setOpen(false); } }, sp0.close, h('span', { 'aria-hidden': true }, ' ✕'))) : null);
  }

  window.Kontener = Object.assign(window.Kontener || {}, {
    nWord: nWord, fromPrice: fromPrice, LegalPage: LegalPage, MobileBar: MobileBar, MobileMenu: MobileMenu, CalcIcon: CalcIcon, FAQ: FAQ, loadRates: loadRates, useRates: useRates, rateNote: rateNote, CalcDrawer: CalcDrawer, calcSummary: calcSummary, OrderTracker: OrderTracker, LeadForm: LeadForm, leadSummary: leadSummary, QuoteSheet: QuoteSheet, CarImage: CarImage,
    CarBoxGarage: CarBoxGarage, CarSilhouette: CarSilhouette, Viewer3D: Viewer3D, NavBar: NavBar, LangSwitch: LangSwitch, BrandLogo: BrandLogo,
    SearchBar: SearchBar, OfferCard: OfferCard, ImportSteps: ImportSteps, Button: Button, DriveTag: DriveTag,
    OrderBuilder: OrderBuilder, StockCard: StockCard, SectionHeader: SectionHeader, ReservedSection: ReservedSection, Footer: Footer,
    ImportCalculator: ImportCalculator, SearchField: SearchField, FilterPanel: FilterPanel, ActiveFilters: ActiveFilters,
    HeroTitle: HeroTitle, ImportJourney: ImportJourney, CarDetailSheet: CarDetailSheet, RollingNumber: RollingNumber,
    Showroom3D: Showroom3D, Car3DView: Car3DView, three3d: K3,
    HomeHero: HomeHero, HomeSearch: HomeSearch, ScrollWords: ScrollWords, StatRow: StatRow, OfficeClocks: OfficeClocks, WhyUs: WhyUs, ModelSpotlight: ModelSpotlight,
    motion: { viewTransition: viewTransition, useReveal: useReveal, glare: glare, scrollParent: scrollParent, reduced: reduced, can3D: can3D },
    SAMPLE_CARS: SAMPLE_CARS, SAMPLE_STOCK: SAMPLE_STOCK, SAMPLE_LISTINGS: SAMPLE_LISTINGS, SAMPLE_CATALOG: SAMPLE_CATALOG, SAMPLE_ORDERS: SAMPLE_ORDERS, COMPANY: COMPANY, DATA: DATA, EMPTY_FILTERS: EMPTY_FILTERS, copy: T, money: money, estimate: estimate,
    RULES: RULES, calcImport: calcImport, pricingInput: pricingInput, pricingRows: pricingRows, cipOf: cipOf, boxOffer: boxOffer, boxPrice: boxPrice, landed: landed, effectHref: effectHref, landedOf: landedOf, filterCars: filterCars, sortCars: sortCars, ccBucket: ccBucket
  });
})();
