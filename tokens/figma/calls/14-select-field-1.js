const D={"A":{"size":["small","base","large"],"variant":["outlined","filled"],"state":["default","hover","focus","disabled"],"invalid":["false","true"],"content":["placeholder","value","empty"]},"W":196,"setName":"Select","desc":"PrimeNG: <p-select> | Story: components-select--playground | Version: 0.1.0 | Status: experimental | Same axes and rules as InputText (#73) | Show clear = showClear with a value (#75) | Width: 14rem default (no PrimeNG default), resize or Fill for fluid (#67) | Content=empty: text kept at 0% opacity to hold the height | Panel: Select Panel (open state)"};
function variants(A){
const f='select',out=[];const ix=(a,v)=>A[a].indexOf(v);
const SZ={small:{px:f+'/sm/padding-x',py:f+'/sm/padding-y',ts:'Select/Text sm',ic:f+'/sm/font-size'},base:{px:f+'/padding-x',py:f+'/padding-y',ts:'Select/Text base',ic:'icon-size'},large:{px:f+'/lg/padding-x',py:f+'/lg/padding-y',ts:'Select/Text lg',ic:f+'/lg/font-size'}};
for(const size of A.size)for(const variant of A.variant)for(const invalid of A.invalid)for(const state of A.state)for(const content of A.content){
 const inv=invalid==='true',dis=state==='disabled',hov=state==='hover',foc=state==='focus',it={sz:SZ[size]};
 it.n='Size='+size+', Variant='+variant+', State='+state+', Invalid='+invalid+', Content='+content;
 // .p-select / .p-variant-filled(:hover/.p-focus) / .p-disabled (background only)
 it.bg=dis?f+'/disabled-background':variant==='filled'?(hov?f+'/filled-hover-background':foc?f+'/filled-focus-background':f+'/filled-background'):f+'/background';
 // invalid red in every state (#53; disabled CSS sets no border, so the browser keeps red too, #72)
 it.st=inv?f+'/invalid-border-color':hov?f+'/hover-border-color':foc?f+'/focus-border-color':f+'/border-color';
 // label: .p-placeholder / .p-invalid .p-placeholder (beats disabled) / .p-disabled .p-select-label
 it.fg=content==='placeholder'?(inv?f+'/invalid-placeholder-color':dis?f+'/disabled-color':f+'/placeholder-color'):(dis?f+'/disabled-color':f+'/color');
 it.sh=!foc; // .p-focus box-shadow: focus.ring.shadow (none); ring width 0 in Aura (form-field)
 it.p=content==='placeholder'?'Placeholder':'Value';it.e=content==='empty';
 it.x=24+(ix('state',state)*A.content.length+ix('content',content))*230;it.y=24+((ix('size',size)*A.variant.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*60;
 out.push(it);}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const IT=variants(D.A);
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Select/Text sm','Select/Text base','Select/Text lg']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES=(await figma.getLocalEffectStylesAsync()).find(s=>s.name==='select/shadow');if(!ES)throw new Error('Missing effect style select/shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC={};for(const n of ['Icon/times','Icon/chevron-down']){IC[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!IC[n])throw new Error('Missing icon '+n);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:0,rebuilt:0};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.newSet=set.id;}
set.description=D.desc;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const [n,t,d] of [['Placeholder','TEXT','Select a city'],['Value','TEXT','Rome'],['Show clear','BOOLEAN',false]])if(!K[n])K[n]=set.addComponentProperty(n,t,d);

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
async function build0(c,it){CUR=c;const S=it.sz;
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='MIN';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(D.W,c.height);
 c.clipsContent=true;c.strokesIncludedInLayout=true;c.fills=[paint(V(it.bg))];c.strokes=[paint(V(it.st))];c.strokeWeight=1;c.strokeAlign='INSIDE';rad(c,V('select/border-radius'));
 if(it.sh)await c.setEffectStyleIdAsync(ES.id);else c.effects=[];
 const lb=figma.createFrame();lb.name='Label';c.appendChild(lb);lb.layoutMode='HORIZONTAL';lb.fills=[];lb.counterAxisSizingMode='AUTO';lb.layoutSizingHorizontal='FILL';
 for(const k of ['paddingTop','paddingBottom'])lb.setBoundVariable(k,V(S.py));for(const k of ['paddingLeft','paddingRight'])lb.setBoundVariable(k,V(S.px));
 const t=figma.createText();lb.appendChild(t);await t.setTextStyleIdAsync(TS[S.ts].id);t.characters=it.p;t.autoRename=false;t.name='Text';
 t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';t.textTruncation='ENDING';t.maxLines=1;t.fills=[paint(V(it.fg))];t.opacity=it.e?0:1;
 REF(t,{characters:K[it.p]});
 const cl=icon('Icon/times','icon-size','select/clear-icon/color');cl.name='Clear';c.appendChild(cl);cl.visible=false;REF(cl,{visible:K['Show clear']}); // .p-select-clear-icon: TimesIcon 1rem, before the trigger
 const dd=figma.createFrame();dd.name='Dropdown';c.appendChild(dd);dd.layoutMode='HORIZONTAL';dd.primaryAxisAlignItems='CENTER';dd.counterAxisAlignItems='CENTER';dd.fills=[];
 dd.primaryAxisSizingMode='FIXED';dd.resize(35,10);dd.setBoundVariable('width',V('select/dropdown/width'));dd.layoutSizingVertical='FILL';
 const ch=icon('Icon/chevron-down',S.ic,'select/dropdown/color');ch.name='Icon';dd.appendChild(ch);
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c)ids.rebuilt++;else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {sync:SY,set:set.id,...ids,inSet:set.children.length,sizes,props:Object.keys(set.componentPropertyDefinitions).map(k=>k.split('#')[0])};