/* Mahata Lab — router + renderer. Content lives in content/site.js (window.SITE_DATA). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  var D = window.SITE_DATA;

  /* ---- sanitizer for rich text ---- */
  var OK = {B:1,STRONG:1,I:1,EM:1,U:1,P:1,BR:1,UL:1,OL:1,LI:1,A:1,SPAN:1,MARK:1,FONT:1,H3:1,H4:1,DIV:1,SUB:1,SUP:1};
  function clean(html) {
    var doc = new DOMParser().parseFromString('<div>' + (html || '') + '</div>', 'text/html');
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (c) {
        if (c.nodeType === 8) { n.removeChild(c); return; }
        if (c.nodeType !== 1) return;
        if (!OK[c.tagName]) { n.removeChild(c); return; }
        Array.prototype.slice.call(c.attributes).forEach(function (a) {
          var k = a.name.toLowerCase(), v = a.value;
          if (k === 'href' && /^(https?:|mailto:|#|\/|[\w.-]+\/)/i.test(v) && !/^javascript:/i.test(v)) return;
          if (k === 'style' && !/url\(|expression|javascript/i.test(v)) return;
          if (k === 'color' || k === 'size') return;
          if (k === 'target' || k === 'rel') return;
          c.removeAttribute(a.name);
        });
        if (c.tagName === 'A') { c.setAttribute('target', '_blank'); c.setAttribute('rel', 'noopener'); }
        walk(c);
      });
    })(doc.body.firstChild);
    return doc.body.firstChild.innerHTML;
  }
  var rich = function (h) { return clean(h); };

  /* ---- decorative inline SVGs (thin strokes, lavender) ---- */
  var SVG = {
    phage: '<svg viewBox="0 0 80 120" width="W" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><polygon points="40,4 62,16 62,40 40,52 18,40 18,16"/><path d="M40 4v48M18 16l44 24M62 16L18 40" stroke-width=".8"/><rect x="34" y="52" width="12" height="40"/><path d="M34 60h12M34 68h12M34 76h12M34 84h12" stroke-width=".8"/><path d="M34 92L14 112M46 92l20 20M40 92v24M34 92L22 116M46 92l12 24"/></svg>',
    bact: '<svg viewBox="0 0 140 70" width="W" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="4" y="8" width="132" height="54" rx="27"/><path d="M30 38c10-14 18 14 28 0s18 14 28 0 14 8 24-2" stroke-width="1.2"/><circle cx="106" cy="24" r="3"/></svg>',
    dna: '<svg viewBox="0 0 40 110" width="W" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M8 4c32 18 32 34 0 52s-32 34 0 50M32 4C0 22 0 38 32 56s32 34 0 50"/><path d="M12 14h16M9 28h22M10 42h20M10 70h20M9 84h22M12 98h16" stroke-width="1"/></svg>'
  };
  var deco = function (t, w, css, rot, cls) {
    return '<div class="deco ' + (cls || '') + '" style="' + css + ';transform:rotate(' + rot + 'deg)">' + SVG[t].replace('W', w) + '</div>';
  };

  /* ---- pieces ---- */
  var route = function (r) { return '#/' + r; };
  function newsItem(n) {
    return '<article class="news-item"><p class="news-meta">' + esc(n.date) + (n.tag ? ' &nbsp;|&nbsp; <span>' + esc(n.tag) + '</span>' : '') +
      '</p><h3>' + esc(n.title) + '</h3>' + (n.body ? '<div>' + rich(n.body) + '</div>' : '') + '</article>';
  }
  function head(t, sub) { return '<div class="page-head"><div class="wrap"><h1>' + esc(t) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div></div>'; }
  var img = function (src, alt, cls) { return src ? '<img ' + (cls ? 'class="' + cls + '" ' : '') + 'src="' + esc(src) + '" alt="' + esc(alt || '') + '" loading="lazy">' : ''; };
  var mail = function (e) { return e ? '<a href="mailto:' + esc(e) + '">' + esc(e) + '</a>' : ''; };

  /* ---- pages ---- */
  var pages = {
    home: function () {
      var h = D.home, items = (D.news.items || []).map(newsItem).join('');
      var dur = Math.max(14, (D.news.items || []).length * 11);
      return '<section class="hero">' +
        deco('phage', 70, 'left:4%;top:14%', -14) + deco('bact', 120, 'left:9%;bottom:10%', 12, 'hide-m') +
        deco('dna', 34, 'left:21%;top:8%', 18, 'hide-m') + deco('phage', 56, 'right:5%;top:10%', 16) +
        deco('bact', 100, 'right:7%;bottom:12%', -10, 'hide-m') + deco('dna', 30, 'right:20%;bottom:6%', -16, 'hide-m') +
        '<div class="wrap"><p class="eyebrow">' + esc(h.eyebrow) + '</p><h1>' + esc(h.heading) + '</h1><p class="sub">' + esc(h.subheading) +
        '</p><a class="btn" href="' + route(h.buttonRoute || 'research') + '">' + esc(h.buttonText) + '</a></div></section>' +
        '<section class="block"><div class="wrap center"><h2>' + esc(h.aboutTitle) + '</h2><hr class="rule"><div class="prose">' + rich(h.about) + '</div></div></section>' +
        '<section class="block news-home" aria-label="News"><div class="wrap center"><h2>' + esc(D.news.title) + '</h2><hr class="rule"><p style="color:var(--slate);margin:-10px 0 24px">' + esc(D.news.subtitle) + '</p>' +
        '<div class="ticker" tabindex="0" aria-label="Scrolling news. Hover or focus to pause."><div class="ticker-track" style="--dur:' + dur + 's">' + items +
        '<div class="dup" aria-hidden="true">' + items + '</div></div></div><p class="ticker-note"><a href="' + route('news') + '">View all news</a></p></div></section>';
    },
    news: function () {
      return head(D.news.title, D.news.subtitle) + '<section class="block"><div class="wrap news-list prose">' + (D.news.items || []).map(newsItem).join('') + '</div></section>';
    },
    research: function () {
      return head(D.research.title) + '<div class="wrap">' + (D.research.themes || []).map(function (t) {
        return '<div class="theme"><div class="theme-img">' + img(t.image, t.alt) + '</div><div><span class="num">' + esc(t.num) + '</span><h2>' + esc(t.title) + '</h2>' + rich(t.body) + '</div></div>';
      }).join('') + '</div>';
    },
    publications: function () {
      var P = D.publications, by = {}, years = [];
      (P.items || []).forEach(function (p) { if (!by[p.year]) { by[p.year] = []; years.push(p.year); } by[p.year].push(p); });
      years.sort(function (a, b) { return b - a; });
      return head(P.title, P.subtitle) + '<section class="block" style="padding-top:8px"><div class="wrap prose">' + years.map(function (y) {
        return '<h2 class="year">' + esc(y) + '</h2>' + by[y].map(function (p) {
          var t = p.link ? '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>' : esc(p.title);
          return '<article class="pub"><h3>' + t + (p.tag ? '<span class="tag">' + esc(p.tag) + '</span>' : '') + '</h3><p class="au">' +
            esc(p.authors).replace(/Mahata T/g, '<strong>Mahata T</strong>') + '</p><p class="ve">' + esc(p.venue) + '</p>' + (p.note ? '<p class="nt">' + esc(p.note) + '</p>' : '') + '</article>';
        }).join('');
      }).join('') + '</div></section>';
    },
    team: function () {
      return head(D.team.title) + '<div class="wrap" style="padding-bottom:24px">' + (D.team.groups || []).map(function (g, gi) {
        return '<div class="group"><h2>' + esc(g.name) + '</h2>' + (gi === 0 && g.members.length === 1 ? g.members.map(function (m) {
          return '<div class="pi">' + img(m.photo, m.name) + '<div><h3>' + esc(m.name) + '</h3><p class="role">' + esc(m.role) + '</p>' + (m.degree ? '<p>' + esc(m.degree) + '</p>' : '') + rich(m.bio) + '<p>' + mail(m.email) + '</p></div></div>';
        }).join('') : '<div class="cards">' + g.members.map(function (m) {
          return '<div class="card">' + (m.photo ? img(m.photo, m.name) : '<div class="ph" aria-hidden="true">' + esc((m.name || '?').charAt(0)) + '</div>') + '<div class="t"><h3>' + esc(m.name) + '</h3><p class="role">' + esc(m.role) + '</p>' +
            (m.degree ? '<p class="deg">' + esc(m.degree) + '</p>' : '') + (m.bio ? '<div class="deg">' + rich(m.bio) + '</div>' : '') + mail(m.email) + '</div></div>';
        }).join('') + '</div>') + '</div>';
      }).join('') + '</div>';
    },
    gallery: function () {
      var G = D.gallery, ph = G.photos || [];
      return head(G.title) + '<section class="block"><div class="wrap">' + (ph.length ? '<div class="gal">' + ph.map(function (p) { return img(p.image, p.caption); }).join('') + '</div>' :
        '<div class="soon"><h2>' + esc(G.message) + '</h2><p>' + esc(G.text) + '</p></div>') + '</div></section>';
    },
    contact: function () {
      var C = D.contact;
      return head(C.title) + '<section class="block"><div class="wrap contact-grid"><div><dl style="margin:0">' +
        '<dt>' + esc(C.piLabel) + '</dt><dd>' + esc(C.pi) + '</dd><dt>' + esc(C.labLabel) + '</dt><dd>' + esc(C.lab) + '</dd>' +
        '<dt>' + esc(C.locationLabel) + '</dt><dd>' + esc(C.location) + '</dd><dt>' + esc(C.emailLabel) + '</dt><dd>' + mail(C.email) + '</dd></dl>' +
        '<div class="logos">' + img(D.settings.logo, D.settings.labName + ' logo') + img(D.settings.institutionLogo, 'NISER logo') + '</div>' +
        '</div><div class="join"><h2>' + esc(C.joinTitle) + '</h2>' + rich(C.join) + '</div></div></section>';
    }
  };

  function chrome(cur) {
    var S = D.settings;
    $('#header').innerHTML = '<div class="wrap"><a class="brand" href="' + route('home') + '">' + img(S.logo, S.labName + ' logo') + '<span class="bt"><b>' + esc(S.labName) + '</b>' + (S.headerSubtitle ? '<small>' + esc(S.headerSubtitle) + '</small>' : '') + '</span></a>' +
      '<button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button><ul class="nav" id="nav">' +
      (D.nav || []).filter(function (n) { return n.hidden !== 'yes'; }).map(function (n) {
        return '<li><a href="' + route(n.route) + '"' + (n.route === cur ? ' aria-current="page"' : '') + '>' + esc(n.label) + '</a></li>';
      }).join('') + '</ul></div>';
    var b = $('.menu-btn'), nav = $('#nav');
    b.onclick = function () { var o = nav.classList.toggle('open'); b.setAttribute('aria-expanded', o); };
    nav.onclick = function () { nav.classList.remove('open'); b.setAttribute('aria-expanded', false); };
    $('#footer').innerHTML = '<div class="wrap"><p class="quote">“' + esc(S.footerQuote) + '”</p><div class="foot-row"><div class="credits"><p>Website developed by - <b>' + esc(S.developedBy) +
      '</b></p><p>Website maintained by - <b>' + esc(S.maintainedBy) + '</b></p></div></div></div>';
    var f = document.querySelector('link[rel=icon]'); if (f && S.favicon) f.href = S.favicon;
  }

  function render() {
    D = window.SITE_DATA;
    var r = (location.hash.replace(/^#\/?/, '') || 'home').split('?')[0];
    if (!pages[r]) r = 'home';
    chrome(r);
    $('#main').innerHTML = pages[r]();
    var nav = (D.nav || []).filter(function (n) { return n.route === r; })[0];
    document.title = r === 'home' ? D.settings.siteTitle : (nav ? nav.label : r) + ' — ' + D.settings.labName;
    var m = document.querySelector('meta[name=description]'); if (m) m.content = D.settings.description;
    if (!window.__mlabFirst) window.__mlabFirst = true; else window.scrollTo(0, 0);
  }

  window.MLab = { render: render };
  window.addEventListener('hashchange', render);
  render();
})();
