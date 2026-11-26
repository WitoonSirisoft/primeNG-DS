const D={"A":{"severity":["success","info","warn","error","secondary","contrast"],"variant":["default","outlined","simple"],"size":["small","base","large"]},"ICON":{"success":"Icon/check-circle","info":"Icon/info-circle","warn":"Icon/exclamation-triangle","error":"Icon/times-circle","secondary":"Icon/info-circle","contrast":"Icon/info-circle"},"desc":"PrimeNG: <p-message> | Story: components-message--playground | Version: 0.1.0 | Status: experimental | Text, Show icon ([icon]; icon per severity, design default #78/#79: to change it select the Icon layer and swap it), Closable ([closable]) | Close button hover / focus not built (#77) | Border is a CSS outline: drawn outside, not part of the size | Stretch the instance: text fills, × stays right | contrast / secondary shadow uses the Light effect style (effect styles have no modes; 4% shadow)"};
function variants(A,has){
const m='message/',out=[];const ix=(a,v)=>A[a].indexOf(v);const sz=s=>s==='base'?'':(s==='small'?'sm/':'lg/');
for(const sev of A.severity)for(const variant of A.variant)for(const size of A.size){
 const s=m+sev+'/',it={sev,variant,size,n:'Severity='+sev+', Variant='+variant+', Size='+size};
 it.px=variant==='simple'?m+'simple/content/padding':m+'content/'+sz(size)+'padding-x';it.py=variant==='simple'?m+'simple/content/padding':m+'content/'+sz(size)+'padding-y';
 it.ts='Message/Text '+({small:'sm',base:'base',large:'lg'})[size];it.isz=m+'icon/'+sz(size)+'size';it.csz=m+'close-icon/'+sz(size)+'size';
 it.fg=variant==='default'?s+'color':variant==='outlined'?s+'outlined/color':s+'simple/color';
 it.bg=variant==='default'?s+'background':null;it.bgo=it.bg&&has(s+'background-opacity')?s+'background-opacity':null;
 it.bd=variant==='simple'?null:variant==='outlined'?s+'outlined/border-color':s+'border-color';it.bdo=variant==='default'&&has(s+'border-color-opacity')?s+'border-color-opacity':null;
 it.bw=variant==='outlined'?m+'outlined/root/border-width':m+'border-width';
 it.sh=variant==='simple'?null:(sev==='secondary'||sev==='contrast')?m+s.slice(m.length)+'shadow (Light)':s+'shadow'; // contrast / secondary: Light style (effect styles have no modes)
 it.x=24+(ix('variant',variant)*A.size.length+ix('size',size))*200;it.y=24+ix('severity',sev)*56;
 out.push(it);}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const IT=variants(D.A,n=>!!VB[n]);
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Message/Text sm','Message/Text base','Message/Text lg']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC={};for(const n of [...new Set(Object.values(D.ICON)),'Icon/times']){IC[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!IC[n])throw new Error('Missing icon '+n);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Message');const ids={created:0,rebuilt:0};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name='Message';set.x=0;set.y=y;ids.newSet=set.id;}
set.description=D.desc;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const [n,t,d] of [['Text','TEXT','Message content'],['Show icon','BOOLEAN',false],['Closable','BOOLEAN',false]])if(!K[n])K[n]=set.addComponentProperty(n,t,d);

figma.skipInvisibleInstanceChildren=false; // hidden instances (e.g. an icon off by default) must be synced too
const SY={kept:0,added:0,removed:0,writes:0};
const REFS=new Map();const REF=(node,refs)=>{REFS.set(node,refs);};
const SYP=['layoutWrap','primaryAxisAlignItems','counterAxisAlignItems','itemSpacing','counterAxisSpacing','paddingTop','paddingBottom','paddingLeft','paddingRight','itemReverseZIndex','strokesIncludedInLayout','clipsContent',
 'fills','strokes','strokeWeight','strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight','strokeAlign','strokeCap','strokeJoin','dashPattern','effects',
 'topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius','cornerSmoothing','opacity','blendMode','isMask','rotation','minWidth','maxWidth','minHeight','maxHeight'];
const SYT=['textAlignHorizontal','textAlignVertical','textAutoResize','textTruncation','maxLines','paragraphSpacing'];
const SKIPB=['fills','strokes','effects','componentProperties','textRangeFills'];
const stable=v=>JSON.stringify(v,(k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.keys(x).sort().reduce((o,q)=>(o[q]=x[q],o),{}):x);
const same=(a,b)=>stable(a)===stable(b); // key order does not count (refs {a,b} = {b,a})
const tryset=(o,k,v)=>{try{if(!same(o[k],v)){o[k]=v;SY.writes++;}}catch(e){}};
function setRefs(o,r){if(!same(o.componentPropertyReferences||{},r))try{o.componentPropertyReferences=r;SY.writes++;}catch(e){}}
function applyRefs(x){if(REFS.has(x))setRefs(x,REFS.get(x));if('children' in x&&x.type!=='INSTANCE')for(const k of x.children)applyRefs(k);}
async function syCopy(o,n,inInst,root){
 if(o.type==='INSTANCE'){const m=await n.getMainComponentAsync();const om=await o.getMainComponentAsync();if(m&&om&&m.id!==om.id){o.swapComponent(m);SY.writes++;}
  const P={};const op=o.componentProperties;for(const [k,v] of Object.entries(n.componentProperties))if(!op[k]||!same(op[k].value,v.value))P[k]=v.value;
  if(Object.keys(P).length){SY.writes++;try{o.setProperties(P);}catch(e){for(const k in P)try{o.setProperties({[k]:P[k]});}catch(e2){}}}}
 if(!root)tryset(o,'name',n.name);
 if('layoutMode' in n)tryset(o,'layoutMode',n.layoutMode);
 if('layoutPositioning' in n)tryset(o,'layoutPositioning',n.layoutPositioning);
 if(o.type!=='TEXT'&&(Math.abs(o.width-n.width)>0.001||Math.abs(o.height-n.height)>0.001))try{o.resize(n.width,n.height);SY.writes++;}catch(e){}
 for(const k of ['primaryAxisSizingMode','counterAxisSizingMode'])if(k in n)tryset(o,k,n[k]);
 for(const k of SYP)if(k in n&&n[k]!==figma.mixed)tryset(o,k,n[k]);
 // Figma: setting one side weight can reset the others, so when any side differs write all four in order
 const SW=['strokeTopWeight','strokeRightWeight','strokeBottomWeight','strokeLeftWeight'];
 if('strokeTopWeight' in n&&SW.some(k=>o[k]!==n[k])){for(const k of SW)o[k]=n[k];SY.writes++;}
 if(o.type==='TEXT'){
  if(n.textStyleId&&n.textStyleId!==figma.mixed){if(o.textStyleId!==n.textStyleId){await figma.loadFontAsync(n.fontName);await o.setTextStyleIdAsync(n.textStyleId);SY.writes++;}}
  else for(const k of ['fontSize','lineHeight','letterSpacing'])tryset(o,k,n[k]);
  if(!same(o.fontName,n.fontName)||o.characters!==n.characters){await figma.loadFontAsync(o.fontName===figma.mixed?n.fontName:o.fontName);await figma.loadFontAsync(n.fontName);
   tryset(o,'fontName',n.fontName);if(o.characters!==n.characters){o.characters=n.characters;SY.writes++;}}
  for(const k of SYT)if(k in n)tryset(o,k,n[k]);tryset(o,'autoRename',n.autoRename);tryset(o,'fills',n.fills);}
 // variable bindings (paints carry their own binding; the rest is per field)
 const nb=n.boundVariables||{},ob=o.boundVariables||{};const alias=a=>Array.isArray(a)?a[0]:a;
 for(const k of Object.keys(ob))if(!SKIPB.includes(k)&&!(k in nb))try{o.setBoundVariable(k,null);SY.writes++;}catch(e){}
 for(const [k,a] of Object.entries(nb)){if(SKIPB.includes(k))continue;const al=alias(a);if(!al||!al.id)continue;
  if(alias(ob[k])&&alias(ob[k]).id===al.id)continue;try{const v=await figma.variables.getVariableByIdAsync(al.id);o.setBoundVariable(k,v);SY.writes++;}catch(e){}}
 if('effectStyleId' in n&&n.effectStyleId&&o.effectStyleId!==n.effectStyleId)try{await o.setEffectStyleIdAsync(n.effectStyleId);SY.writes++;}catch(e){}
 if(!root){for(const k of ['layoutSizingHorizontal','layoutSizingVertical','layoutGrow','layoutAlign'])if(k in n)tryset(o,k,n[k]);
  if('constraints' in n)tryset(o,'constraints',n.constraints);tryset(o,'x',n.x);tryset(o,'y',n.y);}
 if('children' in n)await syncKids(o,[...o.children],[...n.children],inInst||o.type==='INSTANCE');
 if(!inInst&&!root)setRefs(o,REFS.get(n)||{});
 tryset(o,'visible',n.visible);
 if(o.type==='INSTANCE'&&'isExposedInstance' in n)tryset(o,'isExposedInstance',n.isExposedInstance);}
async function syncKids(parent,olds,news,inInst){const used=new Set();const final=[];
 // match by name + type; then, inside instances only, pair what is left by type in order: swapping an icon renames the nested
 // instance to its component name ("Icon" → "Icon/check"), and a name-only match would skip it (Dialog Save icon colour, 2026-11-26)
 const pick=[];for(const nw of news){const od=olds.find(o=>!used.has(o)&&o.name===nw.name&&o.type===nw.type);if(od)used.add(od);pick.push(od||null);}
 if(inInst)news.forEach((nw,i)=>{if(!pick[i]){const od=olds.find(o=>!used.has(o)&&o.type===nw.type);if(od){used.add(od);pick[i]=od;}}});
 for(let i=0;i<news.length;i++){const nw=news[i],od=pick[i];if(od){await syCopy(od,nw,inInst,false);final.push(od);SY.kept++;}else{final.push(nw);SY.added++;}}
 if(inInst)return;
 for(const o of olds)if(!used.has(o)){o.remove();SY.removed++;}
 final.forEach((x,i)=>{if(x.parent!==parent){parent.appendChild(x);applyRefs(x);}if(parent.children.indexOf(x)!==i)parent.insertChild(i,x);});}

async function build(c,it){const tmp=figma.createComponent();figma.currentPage.appendChild(tmp);tmp.name=c.name;REFS.clear();
 try{await build0(tmp,it);await syCopy(c,tmp,false,true);c.x=tmp.x;c.y=tmp.y;}finally{tmp.remove();}}

function icon(name,size,col){const i=IC[name].createInstance();i.setBoundVariable('width',V(size));i.setBoundVariable('height',V(size));
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape layer');sh.fills=[paint(V(col))];return i;}
function layer(c,name){const r=figma.createRectangle();r.name=name;c.appendChild(r);r.layoutPositioning='ABSOLUTE';r.constraints={horizontal:'STRETCH',vertical:'STRETCH'};rad(r,V('message/border-radius'));return r;}
async function build0(c,it){CUR=c;
 c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.fills=[];c.strokes=[];c.clipsContent=false;rad(c,V('message/border-radius'));
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(it.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(it.px));c.setBoundVariable('itemSpacing',V('message/content/gap'));
 if(it.sh&&ES[it.sh])await c.setEffectStyleIdAsync(ES[it.sh].id);else c.effects=[];
 const i=icon(D.ICON[it.sev],it.isz,it.fg);i.name='Icon';c.appendChild(i);i.visible=false;REF(i,{visible:K['Show icon']});
 const t=figma.createText();c.appendChild(t);await t.setTextStyleIdAsync(TS[it.ts].id);t.characters='Message content';t.autoRename=false;t.name='Text';t.fills=[paint(V(it.fg))];
 t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';REF(t,{characters:K['Text']});
 const cb=figma.createFrame();cb.name='Close';c.appendChild(cb);cb.layoutMode='HORIZONTAL';cb.primaryAxisAlignItems='CENTER';cb.counterAxisAlignItems='CENTER';cb.fills=[];
 cb.primaryAxisSizingMode='FIXED';cb.counterAxisSizingMode='FIXED';cb.resize(24.5,24.5);cb.setBoundVariable('width',V('message/close-button/width'));cb.setBoundVariable('height',V('message/close-button/height'));rad(cb,V('message/close-button/height')); // Aura radius 50%: circle
 const x=icon('Icon/times',it.csz,it.fg);x.name='Icon';cb.appendChild(x);cb.visible=false;REF(cb,{visible:K['Closable']});
 if(it.bg){const b=layer(c,'Background');b.fills=[paint(V(it.bg))];if(it.bgo)b.setBoundVariable('opacity',V(it.bgo));c.insertChild(0,b);}
 if(it.bd){const o=layer(c,'Border');o.fills=[];o.strokes=[paint(V(it.bd))];o.strokeAlign='OUTSIDE';for(const k of ['strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight'])o.setBoundVariable(k,V(it.bw));
  if(it.bdo)o.setBoundVariable('opacity',V(it.bdo));c.insertChild(it.bg?1:0,o);}
 for(const n of c.children)if(n.layoutPositioning==='ABSOLUTE'){n.resize(c.width,c.height);n.x=0;n.y=0;}
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c)ids.rebuilt++;else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes={};for(const c of set.children){const k=c.name.split(', ').slice(1).join(' ').replace(/[A-Za-z]+=/g,'')+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
const icons={};for(const c of set.children.filter(c=>c.name.endsWith('Variant=default, Size=base'))){const i=c.findChild(x=>x.name==='Icon');icons[c.name.split(',')[0]]=(await i.getMainComponentAsync()).name;}
return {sync:SY,set:set.id,...ids,inSet:set.children.length,sizes,icons,missingShadow:IT.filter(it=>it.sh&&!ES[it.sh]).map(it=>it.sh)};