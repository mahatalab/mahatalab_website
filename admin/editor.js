/* Schema-free CMS: builds forms from content/site.js, so any field/array can be edited, added, deleted, reordered. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const h=(t,a={},...k)=>{const e=document.createElement(t);for(const[n,v]of Object.entries(a)){n.startsWith('on')?e.addEventListener(n.slice(2),v):n==='class'?e.className=v:e.setAttribute(n,v)}k.flat().forEach(x=>e.append(x&&x.nodeType?x:document.createTextNode(x==null?'':x)));return e};
const SECS=[['settings','Site Settings'],['home','Home'],['news','News'],['research','Research'],['pubs','Publications'],['team','Team'],['contact','Contact']];
const RICH=['html','aboutHtml','joinHtml','bio','details'],IMG=['image','photo','logo','favicon','aboutImage'],LONG=['text','authors','footer','heroText'];
const ORDER=['hero','about','research','news','pubs','team','gallery'];
const TPL={news:{date:'',tag:'',title:'',html:'',image:'',link:''},research:{title:'',html:'',image:'',caption:'',subs:[]},subs:{title:'',html:''},
 pubs:{year:'',items:[]},items:{title:'',authors:'',venue:'',note:'',doi:''},team:{group:'',members:[]},members:{name:'',role:'',photo:'',details:'',bio:'',interests:'',email:'',link:''},
 images:{image:'',caption:''},social:{label:'',url:''},blocks:{label:'',html:''},order:'hero'};
let D,cur='settings',token='',cfg=JSON.parse(localStorage.getItem('mlab-repo')||'{"branch":"main"}');
const st=(m,ok)=>{const e=$('#st');e.textContent=m;e.className=m?'on':''};
const dirty=()=>{clearTimeout(dirty.t);dirty.t=setTimeout(()=>{try{localStorage.setItem('mlab-draft',JSON.stringify(D))}catch(e){st('Draft too large for browser storage — publish soon.')}},500)};
const nice=k=>k==='html'?'Description':k==='aboutHtml'?'About text':k==='joinHtml'?'Join text':k.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase());
const clone=o=>JSON.parse(JSON.stringify(o));
const label=it=>typeof it==='string'?it:[it.date,it.title||it.name||it.group||it.year||it.label||it.caption].filter(Boolean).join(' — ')||'Item';

function node(p,k,lab){const v=p[k];
 if(Array.isArray(v))return list(p,k,lab);
 if(v&&typeof v==='object')return h('fieldset',{},h('legend',{},lab),...Object.keys(v).map(x=>node(v,x,nice(x))));
 if(p===D.settings.colors)return h('div',{class:'f'},h('label',{},lab),h('input',{type:'color',value:v,oninput:e=>{p[k]=e.target.value;dirty()}}));
 if(IMG.includes(k))return image(p,k,lab);if(RICH.includes(k))return rich(p,k,lab);
 const inp=h(LONG.includes(k)?'textarea':'input',{oninput:e=>{p[k]=e.target.value;dirty()}});inp.value=v;
 return h('div',{class:'f'},h('label',{},lab),inp)}

function list(p,k,lab){const a=p[k],box=h('fieldset',{},h('legend',{},lab));
 a.forEach((it,i)=>{const mv=d=>()=>{const j=i+d;if(j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];dirty();draw()};
  const ctl=[h('button',{class:'g',type:'button',title:'Move up',onclick:e=>{e.preventDefault();mv(-1)()}},'↑'),h('button',{class:'g',type:'button',title:'Move down',onclick:e=>{e.preventDefault();mv(1)()}},'↓'),
   h('button',{class:'d',type:'button',onclick:e=>{e.preventDefault();if(confirm('Delete this item?')){a.splice(i,1);dirty();draw()}}},'Delete')];
  if(typeof it==='string'){const s=h('select',{onchange:e=>{a[i]=e.target.value;dirty()}},...ORDER.map(o=>h('option',{value:o},o)));s.value=it;box.append(h('div',{class:'f'},s,...ctl));return}
  box.append(h('details',{},h('summary',{},h('span',{},label(it)),...ctl),h('div',{},...Object.keys(it).map(x=>node(it,x,nice(x))))))});
 box.append(h('button',{type:'button',onclick:()=>{const t=TPL[k]!==undefined?TPL[k]:a.length?blank(a[0]):'';a.push(clone(t));dirty();draw()}},'+ Add to '+lab));return box}
const blank=o=>typeof o==='string'?'':Array.isArray(o)?[]:Object.fromEntries(Object.entries(o).map(([k,v])=>[k,blank(v)]));

function rich(p,k,lab){let saved;const ed=h('div',{class:'ed',contenteditable:'true',role:'textbox','aria-label':lab});ed.innerHTML=p[k]||'';
 const sync=()=>{p[k]=ed.innerHTML;dirty()};ed.oninput=sync;ed.onblur=()=>{const s=getSelection();if(s.rangeCount)saved=s.getRangeAt(0).cloneRange()};
 const cmd=(c,v)=>{ed.focus();if(saved){const s=getSelection();s.removeAllRanges();s.addRange(saved)}document.execCommand('styleWithCSS',false,c!=='fontSize');document.execCommand(c,false,v);sync()};
 const b=(t,c,f)=>h('button',{type:'button',class:'g',onmousedown:e=>e.preventDefault(),onclick:f||(()=>cmd(c))},t);
 const sz=h('select',{onchange:e=>{if(e.target.value)cmd('fontSize',e.target.value);e.target.value=''}},h('option',{value:''},'Size'),...[['1','Small'],['3','Normal'],['5','Large'],['6','X-large']].map(([v,t])=>h('option',{value:v},t)));
 return h('div',{class:'f'},h('label',{},lab),h('div',{class:'tb'},b('B','bold'),b('I','italic'),b('U','underline'),sz,
  h('label',{},'Colour',h('input',{type:'color',value:'#5B3A82',onchange:e=>cmd('foreColor',e.target.value)})),
  h('label',{},'Highlight',h('input',{type:'color',value:'#ffe9a8',onchange:e=>cmd('hiliteColor',e.target.value)})),
  b('Link',0,()=>{const u=prompt('Link URL (https://…)');if(u)cmd('createLink',u)}),b('Clear format','removeFormat')),ed)}

function image(p,k,lab){const pre=h('img',{class:'th',alt:''});
 const show=()=>{const v=p[k];pre.hidden=!v;if(v)pre.src=/^(data:|https?:)/.test(v)?v:'../'+v};
 const f=h('input',{type:'file',accept:'image/*',onchange:async e=>{if(e.target.files[0]){p[k]=await shrink(e.target.files[0],k);show();dirty()}}});
 show();return h('div',{class:'f'},h('label',{},lab),pre,f,h('button',{type:'button',class:'d',onclick:()=>{p[k]='';show();dirty()}},'Remove image'))}
const shrink=(f,k)=>new Promise(res=>{const r=new FileReader();r.onload=()=>{if(/svg|icon/.test(f.type)||['logo','favicon'].includes(k))return res(r.result);
 const i=new Image();i.onload=()=>{const w=Math.min(1600,i.width),c=h('canvas');c.width=w;c.height=i.height*w/i.width;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.85))};i.src=r.result};r.readAsDataURL(f)});

function draw(){const f=$('#form'),y=scrollY;f.replaceChildren(h('h2',{},SECS.find(s=>s[0]===cur)[1]),
  ...(cur==='settings'?['name','subtitle','logo','favicon','colors','fonts','baseSize','footer','social']:cur==='home'?['order','eyebrow','heroTitle','heroText','aboutTitle','aboutHtml','aboutImage','newsTitle','newsSub','gallery']:[null]).map(k=>k?node(cur==='settings'?D.settings:D.home,k,nice(k)):node(D,cur,SECS.find(s=>s[0]===cur)[1])));
 $('#nav').replaceChildren(...SECS.map(([k,t])=>h('button',{class:k===cur?'on':'',onclick:()=>{cur=k;draw()}},t)));scrollTo(0,y)}

/* ---- GitHub publish (token supplied at runtime, never stored) ---- */
const API=()=>`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/`;
const HD=()=>({Authorization:'Bearer '+token,Accept:'application/vnd.github+json'});
async function put(path,b64,msg){let sha;const g=await fetch(API()+path+'?ref='+cfg.branch,{headers:HD()});
 if(g.ok)sha=(await g.json()).sha;else if(g.status!==404)throw new Error('GitHub '+g.status+' — check repository name and token permissions');
 const r=await fetch(API()+path,{method:'PUT',headers:HD(),body:JSON.stringify({message:msg,content:b64,branch:cfg.branch,sha})});if(!r.ok)throw new Error('Publish failed ('+r.status+')')}
function readCfg(){cfg={owner:$('#own').value.trim(),repo:$('#rep').value.trim(),branch:$('#brn').value.trim()||'main'};token=$('#tok').value.trim();localStorage.setItem('mlab-repo',JSON.stringify(cfg))}
$('#chk').onclick=async()=>{readCfg();try{const r=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}`,{headers:HD()});const j=await r.json();
 st(r.ok?`Connected to ${j.full_name}${j.permissions&&!j.permissions.push?' — but this token cannot write':''}.`:'Could not connect: '+(j.message||r.status))}catch(e){st('Network error')}};
$('#pub').onclick=async()=>{readCfg();if(!token||!cfg.owner||!cfg.repo)return st('Enter repository and token first, then Publish.');
 if(!confirm('Publish these changes to '+cfg.owner+'/'+cfg.repo+'?'))return;
 try{const c=clone(D),files=[];let n=0;(function w(o){for(const k in o){const v=o[k];if(typeof v==='string'&&v.startsWith('data:')){const m=v.match(/^data:([^;]+);base64,(.*)$/);
   const ext={'image/jpeg':'jpg','image/png':'png','image/svg+xml':'svg','image/webp':'webp','image/gif':'gif','image/x-icon':'ico','image/vnd.microsoft.icon':'ico'}[m[1]]||'png';
   const path=`assets/uploads/${Date.now()}-${n++}.${ext}`;files.push([path,m[2]]);o[k]=path}else if(v&&typeof v==='object')w(v)}})(c);
  for(const[p,b]of files){st('Uploading '+p+'…');await put(p,b,'Upload image via editor')}
  st('Saving content…');await put('content/site.js',btoa(unescape(encodeURIComponent('window.SITE_DATA = '+JSON.stringify(c,null,1)+';\n'))),'Update site content via editor');
  D=c;dirty();draw();st('Published ✔ — GitHub Pages usually updates within 1–2 minutes.')}catch(e){st('Error: '+e.message)}};
$('#save').onclick=()=>{dirty();st('Draft saved in this browser (not yet published).')};
$('#prev').onclick=()=>{const f=$('#fr');f.onload=()=>f.contentWindow.postMessage({mlab:clone(D)},'*');f.src='../index.html?'+Date.now();$('#pv').classList.add('on')};
$('#pvx').onclick=()=>$('#pv').classList.remove('on');
$('#own').value=cfg.owner||'';$('#rep').value=cfg.repo||'';$('#brn').value=cfg.branch||'main';
D=clone(window.SITE_DATA);{const d=localStorage.getItem('mlab-draft');
 if(d&&d!==JSON.stringify(D)&&confirm('An unpublished draft was found in this browser. Restore it?\n(Cancel = discard the draft and load the published version.)'))D=JSON.parse(d);draw()}
})();
