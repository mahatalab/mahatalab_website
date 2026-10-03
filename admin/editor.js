/* Schema-free editor: builds forms from whatever is in window.SITE_DATA. No code editing needed. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var PUBLISHED = JSON.parse(JSON.stringify(window.SITE_DATA));
  var data, cur = 'settings', token = '';
  var RICH = /^(body|about|join|bio)$/, IMG = /(image|photo|logo|favicon)$/i, LONG = /^(description|subheading|text|authors|location|lab|footerQuote)$/;
  var ROUTES = ['home', 'news', 'research', 'publications', 'team', 'gallery', 'contact'];
  var LABELS = {settings:'Site settings',nav:'Menu order',home:'Home',news:'News',research:'Research',publications:'Publications',team:'Team',gallery:'Gallery',contact:'Contact'};
  try { var d = localStorage.getItem('mlab-draft'); data = d ? JSON.parse(d) : JSON.parse(JSON.stringify(PUBLISHED)); if (d) status('Draft loaded'); } catch (e) { data = JSON.parse(JSON.stringify(PUBLISHED)); }

  function status(t) { $('#status').textContent = t; }
  var timer;
  function changed() { status('Unsaved changes'); clearTimeout(timer); timer = setTimeout(sendPreview, 250); }
  function sendPreview() { var f = $('#frame'); if (f.contentWindow) f.contentWindow.postMessage({ type: 'mlab-preview', data: data, route: ROUTES.indexOf(cur) > -1 ? cur : null }, '*'); }
  $('#frame').addEventListener('load', sendPreview);
  var human = function (k) { return k.replace(/([A-Z])/g, ' $1').replace(/^./, function (c) { return c.toUpperCase(); }); };
  function el(tag, attrs, kids) { var e = document.createElement(tag); Object.keys(attrs || {}).forEach(function (k) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else if (k.slice(0, 2) === 'on') e[k] = attrs[k]; else e.setAttribute(k, attrs[k]); }); (kids || []).forEach(function (c) { e.appendChild(c); }); return e; }

  /* ---- nav ---- */
  function drawNav() {
    var n = $('#nav'); n.innerHTML = '';
    Object.keys(data).forEach(function (k) { n.appendChild(el('button', { text: LABELS[k] || human(k), class: k === cur ? 'on' : '', onclick: function () { cur = k; drawNav(); drawForm(); sendPreview(); } })); });
  }

  /* ---- field builders ---- */
  function resizeImage(file, cb) {
    var r = new FileReader();
    r.onload = function () { var im = new Image(); im.onload = function () { var m = 1400, s = Math.min(1, m / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s; var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', .86), file.name); }; im.src = r.result; };
    r.readAsDataURL(file);
  }
  function imageField(o, k) {
    var th = el('img', { alt: '', src: o[k] ? (/^(data:|https?:)/.test(o[k]) ? o[k] : '../' + o[k]) : '' }), inp = el('input', { type: 'text', value: o[k] || '', placeholder: 'No image' });
    var file = el('input', { type: 'file', accept: 'image/*', style: 'display:none' });
    inp.oninput = function () { o[k] = inp.value; th.src = /^(data:|https?:)/.test(o[k]) ? o[k] : '../' + o[k]; changed(); };
    file.onchange = function () { if (!file.files[0]) return; resizeImage(file.files[0], function (url) { o[k] = url; o['_' + k + 'Name'] = undefined; inp.value = '(new image — uploads when you publish)'; th.src = url; changed(); }); };
    return el('div', { class: 'imgf' }, [th, el('div', { class: 'x' }, [inp, el('div', { class: 'hint', text: 'Type a path, or upload a picture.' })]), el('button', { text: 'Upload', class: 'sm', onclick: function () { file.click(); } }), file]);
  }
  function richField(o, k) {
    var ed = el('div', { class: 'ed', contenteditable: 'true', html: o[k] || '' });
    var cmd = function (c, v) { return function () { ed.focus(); document.execCommand('styleWithCSS', false, false); document.execCommand(c, false, v); o[k] = ed.innerHTML; changed(); }; };
    var size = el('select', { class: 'sm', title: 'Text size' }, [['Size', ''], ['Small', '2'], ['Normal', '3'], ['Large', '5'], ['Huge', '6']].map(function (s) { return el('option', { value: s[1], text: s[0] }); }));
    size.onchange = function () { if (size.value) cmd('fontSize', size.value)(); size.value = ''; };
    var col = el('input', { type: 'color', value: '#5B3A82', title: 'Text colour' }); col.oninput = function () { cmd('foreColor', col.value)(); };
    var hi = el('input', { type: 'color', value: '#F3E58A', title: 'Highlight' }); hi.oninput = function () { cmd('hiliteColor', hi.value)(); };
    var tb = el('div', { class: 'tb' }, [
      el('button', { html: '<b>B</b>', onclick: cmd('bold') }), el('button', { html: '<i>I</i>', onclick: cmd('italic') }), el('button', { html: '<u>U</u>', onclick: cmd('underline') }), size, col, hi,
      el('button', { text: '• List', onclick: cmd('insertUnorderedList') }),
      el('button', { text: 'Link', onclick: function () { var u = prompt('Link address (https://…)'); if (u) cmd('createLink', u)(); } }),
      el('button', { text: 'Clear', onclick: cmd('removeFormat') })]);
    tb.querySelectorAll('button').forEach(function (b) { b.onmousedown = function (e) { e.preventDefault(); }; b.type = 'button'; });
    ed.oninput = function () { o[k] = ed.innerHTML; changed(); };
    ed.onpaste = function (e) { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text')); };
    return el('div', { class: 'rt' }, [tb, ed]);
  }
  function field(o, k, parentKey) {
    var v = o[k], lab = el('label', { text: human(k) });
    var wrap = el('div');
    if (k.charAt(0) === '_') return wrap;
    if (typeof v === 'string' || typeof v === 'number') {
      wrap.appendChild(lab);
      if (parentKey === 'nav' && k === 'route') { wrap.appendChild(el('input', { type: 'text', value: v, disabled: 'disabled' })); return wrap; }
      if (parentKey === 'nav' && k === 'hidden') { lab.textContent = 'Hide from menu'; var cb = el('input', { type: 'checkbox' }); cb.checked = v === 'yes'; cb.onchange = function () { o[k] = cb.checked ? 'yes' : ''; changed(); }; wrap.appendChild(cb); return wrap; }
      if (/Route$/.test(k)) { var s = el('select', {}, ROUTES.map(function (r) { return el('option', { value: r, text: r }); })); s.value = v; s.onchange = function () { o[k] = s.value; changed(); }; wrap.appendChild(s); return wrap; }
      if (IMG.test(k)) wrap.appendChild(imageField(o, k));
      else if (RICH.test(k)) wrap.appendChild(richField(o, k));
      else if (LONG.test(k) || String(v).length > 90) { var t = el('textarea', {}); t.value = v; t.oninput = function () { o[k] = t.value; changed(); }; wrap.appendChild(t); }
      else { var i = el('input', { type: 'text', value: v }); i.oninput = function () { o[k] = i.value; changed(); }; wrap.appendChild(i); }
    } else if (Array.isArray(v)) { wrap.appendChild(arrayField(v, k, o)); }
    else if (v && typeof v === 'object') { var fs = el('fieldset', {}, [el('legend', { text: human(k) })]); Object.keys(v).forEach(function (kk) { fs.appendChild(field(v, kk, k)); }); wrap.appendChild(fs); }
    return wrap;
  }
  function itemTitle(it) { return it.name || it.title || it.label || it.date || it.year || (it.image ? 'Photo' : 'Item'); }
  function arrayField(arr, k, owner) {
    var box = el('div'), fixed = k === 'nav';
    box.appendChild(el('label', { text: human(k) }));
    var open = {};
    function draw() {
      Array.prototype.slice.call(box.querySelectorAll('.item,.add')).forEach(function (n) { n.remove(); });
      arr.forEach(function (it, idx) {
        var item = el('div', { class: 'item' + (open[idx] ? ' open' : '') }), body = el('div', { class: 'body' });
        if (it && typeof it === 'object') Object.keys(it).forEach(function (kk) { body.appendChild(field(it, kk, k)); });
        else { var i = el('input', { type: 'text', value: it }); i.oninput = function () { arr[idx] = i.value; changed(); }; body.appendChild(i); }
        var mv = function (d) { return function (e) { e.stopPropagation(); var j = idx + d; if (j < 0 || j >= arr.length) return; var t = arr[idx]; arr[idx] = arr[j]; arr[j] = t; open = {}; draw(); changed(); }; };
        var bar = el('div', { class: 'bar', onclick: function () { open[idx] = !open[idx]; item.classList.toggle('open'); } }, [el('b', { text: (idx + 1) + '. ' + (it && typeof it === 'object' ? itemTitle(it) : it) }),
          el('button', { text: '↑', class: 'sm', title: 'Move up', onclick: mv(-1) }), el('button', { text: '↓', class: 'sm', title: 'Move down', onclick: mv(1) })]);
        if (!fixed) bar.appendChild(el('button', { text: 'Delete', class: 'sm dng', onclick: function (e) { e.stopPropagation(); if (confirm('Delete this item?')) { arr.splice(idx, 1); open = {}; draw(); changed(); } } }));
        item.appendChild(bar); item.appendChild(body); box.appendChild(item);
      });
      if (!fixed) box.appendChild(el('button', { text: '+ Add item', class: 'add pri', onclick: function () {
        var tpl = arr.length ? JSON.parse(JSON.stringify(arr[arr.length - 1])) : (k === 'photos' ? { image: '', caption: '' } : { title: '' });
        (function blank(o) { Object.keys(o).forEach(function (q) { if (typeof o[q] === 'string') o[q] = ''; else if (Array.isArray(o[q])) { if (o[q].length && typeof o[q][0] === 'object') { o[q] = [blank(o[q][0])]; } else o[q] = []; } else if (o[q] && typeof o[q] === 'object') blank(o[q]); }); return o; })(tpl);
        if (typeof arr[0] === 'string') tpl = ''; arr.push(tpl); open = {}; open[arr.length - 1] = true; draw(); changed(); } }));
    }
    draw(); return box;
  }
  function drawForm() {
    var f = $('#form'); f.innerHTML = ''; f.appendChild(el('h2', { text: LABELS[cur] || human(cur) }));
    if (cur === 'nav') f.appendChild(el('div', { class: 'hint', text: 'Use the arrows to change the order of the menu. Tick "Hide from menu" to remove a page from the menu.' }));
    var v = data[cur];
    if (Array.isArray(v)) f.appendChild(arrayField(v, cur, data)); else Object.keys(v).forEach(function (k) { f.appendChild(field(v, k, cur)); });
    f.appendChild(publishPanel());
  }

  /* ---- publish ---- */
  var gh = { owner: '', repo: '', branch: 'main' };
  try { Object.assign(gh, JSON.parse(localStorage.getItem('mlab-gh') || '{}')); } catch (e) {}
  function publishPanel() {
    var box = el('div', { class: 'pub', id: 'pubpanel' }), msg = el('div', { class: 'msg' });
    var inp = function (lbl, key, type, ph) { var i = el('input', { type: type || 'text', placeholder: ph || '' }); i.value = key === 'token' ? token : gh[key]; i.oninput = function () { if (key === 'token') token = i.value.trim(); else { gh[key] = i.value.trim(); localStorage.setItem('mlab-gh', JSON.stringify(gh)); } }; return el('div', {}, [el('label', { text: lbl }), i]); };
    box.appendChild(el('h2', { text: 'Publish to GitHub', style: 'font-size:16px;margin:12px 0 0' }));
    box.appendChild(el('div', { class: 'hint', text: 'Paste a fine-grained Personal Access Token limited to this one repository (Contents: Read and write). It is kept in memory only and is forgotten when you close this tab.' }));
    box.appendChild(inp('GitHub username / organisation', 'owner', 'text', 'e.g. mahata-lab'));
    box.appendChild(inp('Repository name', 'repo', 'text', 'e.g. mahata-lab.github.io'));
    box.appendChild(inp('Branch', 'branch', 'text', 'main'));
    box.appendChild(inp('Personal Access Token', 'token', 'password', 'github_pat_…'));
    var row = el('div', { style: 'margin-top:14px;display:flex;gap:8px' }, [
      el('button', { text: 'Connect (test)', onclick: function () { connect(msg); } }), el('button', { class: 'pri', text: 'Publish to GitHub', onclick: function () { publish(msg); } })]);
    box.appendChild(row); box.appendChild(msg); return box;
  }
  function api(path, opt) {
    return fetch('https://api.github.com/repos/' + gh.owner + '/' + gh.repo + path, Object.assign({ headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' } }, opt || {}));
  }
  function ready(msg) { if (!gh.owner || !gh.repo || !token) { msg.className = 'msg er'; msg.textContent = 'Please fill in username, repository and token.'; return false; } return true; }
  function connect(msg) {
    if (!ready(msg)) return; msg.className = 'msg'; msg.textContent = 'Connecting…';
    api('').then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.message || r.status); msg.className = 'msg ok'; msg.textContent = 'Connected to ' + j.full_name + (j.permissions && !j.permissions.push ? '\n(Warning: this token cannot write to the repo.)' : ''); }); })
      .catch(function (e) { msg.className = 'msg er'; msg.textContent = 'Could not connect: ' + e.message; });
  }
  var b64 = function (s) { return btoa(unescape(encodeURIComponent(s))); };
  function put(path, contentB64, note) {
    return api('/contents/' + path + '?ref=' + encodeURIComponent(gh.branch)).then(function (r) { return r.ok ? r.json() : null; }).then(function (ex) {
      var body = { message: note, content: contentB64, branch: gh.branch }; if (ex && ex.sha) body.sha = ex.sha;
      return api('/contents/' + path, { method: 'PUT', body: JSON.stringify(body) }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(path + ': ' + (j.message || r.status)); return j; }); });
    });
  }
  function publish(msg) {
    if (!ready(msg)) return; msg.className = 'msg'; msg.textContent = 'Publishing…';
    var out = JSON.parse(JSON.stringify(data)), files = [], n = 0, stamp = Date.now();
    (function walk(o) { Object.keys(o).forEach(function (k) { var v = o[k]; if (typeof v === 'string' && v.indexOf('data:image/') === 0) { var p = 'assets/uploads/' + stamp + '-' + (++n) + '.jpg'; files.push({ path: p, b64: v.split(',')[1] }); o[k] = p; } else if (v && typeof v === 'object') walk(v); }); })(out);
    (function strip(o) { Object.keys(o).forEach(function (k) { if (k.charAt(0) === '_') delete o[k]; else if (o[k] && typeof o[k] === 'object') strip(o[k]); }); })(out);
    var chain = Promise.resolve();
    files.forEach(function (f) { chain = chain.then(function () { msg.textContent = 'Uploading ' + f.path + '…'; return put(f.path, f.b64, 'Upload image'); }); });
    chain.then(function () { msg.textContent = 'Saving content…'; return put('content/site.js', b64(toJs(out)), 'Update site content'); })
      .then(function () { data = out; localStorage.removeItem('mlab-draft'); PUBLISHED = JSON.parse(JSON.stringify(out)); window.SITE_DATA = out; status('Published'); msg.className = 'msg ok'; msg.textContent = 'Published! GitHub Pages usually updates the live site within a minute or two.'; drawForm(); })
      .catch(function (e) { msg.className = 'msg er'; msg.textContent = 'Publish failed: ' + e.message + '\nCheck the token, repository name and branch.'; });
  }
  var toJs = function (o) { return '/* Mahata Lab website content. Edit through admin/index.html or by hand. */\nwindow.SITE_DATA = ' + JSON.stringify(o, null, 2) + ';\n'; };

  /* ---- toolbar buttons ---- */
  $('#draft').onclick = function () { try { localStorage.setItem('mlab-draft', JSON.stringify(data)); status('Draft saved in this browser'); } catch (e) { alert('Draft too large to save in the browser (large uploaded images). Publish or download instead.'); } };
  $('#reset').onclick = function () { if (confirm('Discard all unpublished changes?')) { localStorage.removeItem('mlab-draft'); data = JSON.parse(JSON.stringify(PUBLISHED)); drawNav(); drawForm(); sendPreview(); status('Changes discarded'); } };
  $('#topub').onclick = function () { var p = $('#pubpanel'); if (p) p.scrollIntoView({ behavior: 'smooth' }); };
  $('#dl').onclick = function () {
    var hasNew = JSON.stringify(data).indexOf('data:image/') > -1; if (hasNew && !confirm('Newly uploaded pictures are embedded in this file and make it large. For the best result use "Publish to GitHub". Download anyway?')) return;
    var a = el('a', { href: URL.createObjectURL(new Blob([toJs(data)], { type: 'text/javascript' })), download: 'site.js' }); a.click();
  };
  drawNav(); drawForm();
})();
