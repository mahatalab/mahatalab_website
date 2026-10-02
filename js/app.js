/* Renders the site from content/site.js. Design lives in css/style.css; edit content via /admin/. */
(function(){'use strict';
let D;const $=(s,e=document)=>e.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* Whitelist sanitiser for rich-text fields written by the editor */
const OK='B,I,U,STRONG,EM,SPAN,FONT,P,BR,UL,OL,LI,A,MARK,SUB,SUP,DIV,H3,H4'.split(',');
function clean(h){const b=new DOMParser().parseFromString('<body>'+(h||''),'text/html').body;
 [...b.querySelectorAll('*')].reverse().forEach(n=>{
  if(/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED)$/.test(n.tagName))return n.remove();
  if(!OK.includes(n.tagName))return n.replaceWith(...n.childNodes);
  [...n.attributes].forEach(a=>{const k=a.name;
   if(k==='href'&&/^\s*(https?:|mailto:|#)/i.test(a.value))return;
   if(k==='style'&&!/url\(|expression|@import/i.test(a.value))return;
   if(k==='color'||k==='size')return;n.removeAttribute(k)});
  if(n.tagName==='A'){n.target='_blank';n.rel='noopener'}});
 return b.innerHTML}
const rich=h=>{let s=clean(h);if(!/href=/.test(s))s=s.replace(/([\w.+-]+@[\w-]+\.[\w.-]+)/g,'<a href="mailto:$1">$1</a>');return s};
const img=(s,a,c)=>s?`<img ${c?`class="${c}" `:''}src="${esc(s)}" alt="${esc(a)}" loading="lazy">`:'';
/* Subtle background illustrations: phages, bacteria, DNA (inline SVG, colour from --lav) */
const deco=()=>{let a='',b='',r='';for(let i=0;i<=20;i++){const y=i*3,p=15+11*Math.sin(i/1.6),q=30-p;a+=(i?'L':'M')+p+' '+y;b+=(i?'L':'M')+q+' '+y;if(i%2==0)r+=`M${p} ${y}L${q} ${y}`}
 const defs=`<defs><symbol id="ph" viewBox="0 0 40 60"><path d="M20 2 32 9V23L20 30 8 23V9ZM8 9 20 16 32 9M20 16V30M20 30V43M15 34H25M15 38H25M20 43 6 58M20 43 34 58M20 43 13 58M20 43 27 58"/></symbol><symbol id="ba" viewBox="0 0 80 36"><rect x="4" y="9" width="72" height="18" rx="9"/><path d="M14 9V4M26 9V4M40 9V4M54 9V4M66 9V4M14 27V32M26 27V32M40 27V32M54 27V32M66 27V32"/><circle cx="26" cy="18" r="1.5"/><circle cx="46" cy="16" r="1.5"/><circle cx="58" cy="20" r="1.5"/><path d="M32 20Q40 12 48 20T62 18" /></symbol><symbol id="dn" viewBox="0 0 30 60"><path d="${a}"/><path d="${b}"/><path d="${r}" opacity=".6"/></symbol></defs>`;
 const it=[['ph',60,50,-18,1.1],['ph',1100,360,22,1],['ph',1120,40,14,.8],['ph',200,400,-32,.9],['ph',600,430,8,.7],
  ['ba',50,150,-14,1.4],['ba',1000,270,10,1.5],['ba',60,330,20,1.1],['ba',1010,110,-8,1.2],['ba',330,440,6,1],
  ['dn',20,230,8,1.2],['dn',1150,215,-10,1.3],['dn',420,420,26,.9],['dn',780,420,-18,1],['dn',150,60,12,.8]];
 return `<svg class="deco" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${it.map(([id,x,y,rot,s])=>{const w=id==='ba'?80:id==='ph'?40:30,h=id==='ba'?36:60;return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><use href="#${id}" width="${w}" height="${h}"/></g>`}).join('')}</svg>`};
const pad=n=>String(n).padStart(2,'0');
const sec=(id,title,sub,link,body,alt)=>`<section class="s${alt?' alt':''}" id="${id}"><div class="wrap"><div class="sh"><div><h2>${esc(title)}</h2>${sub?`<p>${esc(sub)}</p>`:''}</div>${link?`<a class="more" href="${link[0]}">${esc(link[1])} →</a>`:''}</div>${body}</div></section>`;

function theme(){const s=D.settings,r=document.documentElement.style,m={plum:'plum',purple:'purple',violet:'violet',lav:'lav',pale:'pale',bg:'bg',text:'text',muted:'muted',footer:'footer'};
 for(const k in m)if(s.colors&&s.colors[k])r.setProperty('--'+m[k],s.colors[k]);
 if(s.fonts){r.setProperty('--fh',s.fonts.heading);r.setProperty('--fb',s.fonts.body)}
 r.fontSize=(parseInt(s.baseSize)||17)+'px';document.title=s.name;
 if(s.favicon)$('#favicon').href=s.favicon;
 $('#brand').innerHTML=(s.logo?img(s.logo,s.name+' logo'):'')+`<span><b>${esc(s.name)}</b><small>${esc(s.subtitle)}</small></span>`;
 const P=[['#/','Home'],['#/news','News'],['#/research','Research'],['#/publications','Publications'],['#/team','Team'],['#/gallery','Gallery'],['#/contact','Contact']];
 $('#nav').innerHTML=P.map(p=>`<a href="${p[0]}">${p[1]}</a>`).join('');
 const soc=(s.social||[]).filter(x=>x.url).map(x=>`<a href="${esc(x.url)}" rel="noopener">${esc(x.label||x.url)}</a>`).join(' · ');
 $('#foot').innerHTML=`<p class="quote">${esc(s.footer)}</p>${soc?`<p class="soc">${soc}</p>`:''}`}

/* ---- sections ---- */
const flatPubs=()=>D.pubs.flatMap(g=>g.items.map(i=>({...i,year:g.year})));
const pubHtml=p=>`<li class="pub"><b>${esc(p.title)}${p.note==='Preprint'?'<span class="tag">Preprint</span>':''}</b><span class="au">${esc(p.authors).replace(/Mahata T/g,'<strong>Mahata T</strong>')}</span><br><span class="v">${esc(p.venue)}</span>${p.note&&p.note!=='Preprint'?`<br><small>${esc(p.note)}</small>`:''}${p.doi?` <a href="${esc(p.doi)}" rel="noopener">DOI / link</a>`:''}</li>`;
const person=m=>`<article class="person">${m.photo?img(m.photo,m.name,'av'):`<div class="av" aria-hidden="true">${esc(m.name.replace(/(Dr\.|Ph\.D\.?)/g,'').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('')).toUpperCase()}</div>`}<div><h3>${esc(m.name)}</h3>${m.role?`<p class="role">${esc(m.role)}</p>`:''}${m.details?`<p>${clean(m.details)}</p>`:''}${m.bio?`<p>${clean(m.bio)}</p>`:''}${m.interests?`<p><b>Research interests:</b> ${esc(m.interests)}</p>`:''}${m.email?`<p><a href="mailto:${esc(m.email)}">${esc(m.email)}</a></p>`:''}${m.link?`<p><a href="${esc(m.link)}" rel="noopener">Profile</a></p>`:''}</div></article>`;
const S={
hero:()=>{const h=D.home;return `<section class="hero"><div class="wrap">${deco()}<div class="in"><p class="kicker">${esc(D.settings.name)} · ${esc(D.settings.subtitle)}</p><p class="kicker" style="color:var(--muted)">${esc(h.eyebrow)}</p><h1>${esc(h.heroTitle)}</h1><p class="lead">${esc(h.heroText)}</p><a class="btn" href="#/research">Explore our research</a></div></div></section>`},
about:()=>{const h=D.home;return `<section class="s" id="about"><div class="wrap"><div class="about${h.aboutImage?' has-img':''}"><div><h2>${esc(h.aboutTitle)}</h2><div class="prose">${rich(h.aboutHtml)}</div></div>${h.aboutImage?`<figure>${img(h.aboutImage,h.aboutTitle)}</figure>`:''}</div></div></section>`},
research:()=>sec('research-preview','Research','',['#/research','All research'],`<div class="grid">${D.research.map((r,i)=>`<a class="card" href="#/research" style="text-decoration:none;color:inherit">${img(r.image,r.title)}<div class="b"><span class="num">${pad(i+1)}</span><h3>${esc(r.title)}</h3><div class="clamp">${clean(r.html)}</div></div></a>`).join('')}</div>`,1),
news:()=>sec('news',D.home.newsTitle,D.home.newsSub,0,`<div class="grid">${D.news.map(n=>`<article class="card">${img(n.image,n.title)}<div class="b"><p class="meta"><b>${esc(n.date)}</b>${n.tag?' | '+esc(n.tag):''}</p><h3>${esc(n.title)}</h3>${rich(n.html)}${n.link?`<a href="${esc(n.link)}" rel="noopener">Read more →</a>`:''}</div></article>`).join('')||'<p class="empty">No news yet.</p>'}</div>`),
pubs:()=>sec('pubs','Publications','',['#/publications','All publications'],`<ul style="padding:0">${flatPubs().slice(0,3).map(p=>pubHtml(p)).join('')}</ul>`,1),
team:()=>sec('team','Team','',['#/team','Full team'],`<div class="grid">${D.team.flatMap(g=>g.members).slice(0,6).map(person).join('')}</div>`),
gallery:()=>{const g=D.home.gallery,ims=(g.images||[]).filter(i=>i.image);return sec('gallery',g.title,'',0,ims.length?`<div class="grid">${ims.map(i=>`<figure>${img(i.image,i.caption||g.title)}<figcaption>${esc(i.caption)}</figcaption></figure>`).join('')}</div>`:`<div class="empty"><h3>${esc(g.heading)}</h3><p>${esc(g.text)}</p></div>`,1)}};

const pageH=t=>`<div class="page-h"><div class="wrap"><h1>${esc(t)}</h1></div></div>`;
const newsCards=()=>D.news.map(n=>`<article class="card">${img(n.image,n.title)}<div class="b"><p class="meta"><b>${esc(n.date)}</b>${n.tag?' | '+esc(n.tag):''}</p><h3>${esc(n.title)}</h3>${rich(n.html)}${n.link?`<a href="${esc(n.link)}" rel="noopener">Read more →</a>`:''}</div></article>`).join('')||'<p class="empty">No news yet.</p>';
const P={
'':()=>D.home.order.map(k=>S[k]?S[k]():'').join(''),
news:()=>pageH(D.home.newsTitle)+`<div class="wrap" style="padding-bottom:3rem"><p class="lead" style="margin:1.5rem 0">${esc(D.home.newsSub)}</p><div class="grid">${newsCards()}</div></div>`,
gallery:()=>{const g=D.home.gallery,ims=(g.images||[]).filter(i=>i.image);return pageH(g.title)+`<div class="wrap" style="padding:2rem 1.25rem 3rem">${ims.length?`<div class="grid">${ims.map(i=>`<figure>${img(i.image,i.caption||g.title)}<figcaption>${esc(i.caption)}</figcaption></figure>`).join('')}</div>`:`<div class="empty"><h3>${esc(g.heading)}</h3><p>${esc(g.text)}</p></div>`}</div>`},
research:()=>pageH('Research')+`<div class="wrap">${D.research.map((r,i)=>`<section class="theme" id="theme-${i+1}"><p class="kicker">Research Theme ${pad(i+1)}</p><div class="cols"><div><h2>${esc(r.title)}</h2><div class="prose">${rich(r.html)}</div>${(r.subs||[]).map(s=>`<div class="sub"><h3>${esc(s.title)}</h3>${rich(s.html)}</div>`).join('')}</div>${r.image?`<figure>${img(r.image,r.title)}${r.caption?`<figcaption>${esc(r.caption)}</figcaption>`:''}</figure>`:''}</div></section>`).join('')}</div>`,
publications:()=>pageH('Publications')+`<div class="wrap">${D.pubs.map(g=>`<div class="yr"><h2>${esc(g.year)}</h2><ul style="padding:0">${g.items.map(pubHtml).join('')}</ul></div>`).join('')}</div>`,
team:()=>pageH('Team')+`<div class="wrap">${D.team.map(g=>`<section class="s" style="padding-bottom:0"><h2>${esc(g.group)}</h2><div class="grid">${g.members.map(person).join('')}</div></section>`).join('')}<div style="height:3rem"></div></div>`,
contact:()=>{const c=D.contact;return pageH(c.title)+`<div class="wrap"><div class="contact">${c.blocks.map(b=>`<div><h3>${esc(b.label)}</h3>${rich(b.html)}</div>`).join('')}</div><div class="join"><h2>${esc(c.joinTitle)}</h2><div class="prose">${rich(c.joinHtml)}</div></div><div style="height:3rem"></div></div>`}};

function route(){const k=(location.hash.replace(/^#\/?/,'')||'');const m=$('#app');m.innerHTML=(P[k]||P[''])();
 document.querySelectorAll('nav a').forEach(a=>a.getAttribute('href')==='#/'+k?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
 $('#nav').classList.remove('open');$('.nav-toggle').setAttribute('aria-expanded','false');window.scrollTo(0,0)}
function render(d){if(d)D=d;theme();route()}
window.MLab={render};
$('.nav-toggle').onclick=e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
addEventListener('hashchange',route);
addEventListener('message',e=>{if(e.data&&e.data.mlab)render(e.data.mlab)});/* live preview from the editor */
render(window.SITE_DATA);
})();
