const D={"K":"radiobutton","A":{"size":["small","base","large"],"variant":["outlined","filled"],"state":["default","hover","focus","disabled"],"invalid":["false","true"],"checked":["no","yes"]},"setName":"RadioButton","desc":"PrimeNG: <p-radiobutton> | Story: components-radiobutton--playground | Version: 0.1.0 | Status: experimental | Control only, put a label next to it (#69) | Invalid stays red in hover/focus (#53/#70); invalid + disabled shows the disabled border, as in the browser (#72)"};
function variants(K,A){
const out=[];const ix=(a,v)=>A[a].indexOf(v);const sz=s=>s==='base'?'':(s==='small'?'sm':'lg')+'/';
const vs=A.variant||['outlined'];
for(const size of A.size)for(const variant of vs)for(const invalid of A.invalid)for(const state of A.state)for(const checked of A.checked){
 const f=K,ch=checked==='yes',inv=invalid==='true',dis=state==='disabled',hov=state==='hover',foc=state==='focus',it={kind:K};
 it.n='Size='+size+(A.variant?', Variant='+variant:'')+', State='+state+', Invalid='+invalid+', Checked='+checked;
 it.sh=!foc; // :focus-visible sets box-shadow to focus.ring.shadow (none)
 it.ring=foc;it.ro=f+'/focus-ring/offset';it.rw=f+'/focus-ring/width';it.rc=f+'/focus-ring/color';
 if(K==='toggleswitch'){
  it.w=size==='base'?f+'/width':f+'/'+sz(size)+'width';it.h=size==='base'?f+'/height':f+'/'+sz(size)+'height';it.hs=size==='base'?f+'/handle/size':f+'/'+sz(size)+'handle-size';
  it.bg=dis?f+'/disabled-background':ch?(hov?f+'/checked-hover-background':f+'/checked-background'):(hov?f+'/hover-background':f+'/background');
  it.st=inv?f+'/invalid-border-color':hov?(ch?f+'/checked-hover-border-color':f+'/hover-border-color'):(ch?f+'/checked-border-color':f+'/border-color');
  it.hb=dis?f+'/handle/disabled-background':ch?(hov?f+'/handle/checked-hover-background':f+'/handle/checked-background'):(hov?f+'/handle/hover-background':f+'/handle/background');
  it.on=ch;it.rr=f+'/border-radius';
  it.x=24+(ix('state',state)*A.checked.length+ix('checked',checked))*64;it.y=24+(ix('size',size)*A.invalid.length+ix('invalid',invalid))*44;
 }else{
  it.w=f+'/'+sz(size)+'width';it.h=f+'/'+sz(size)+'height';it.isz=f+'/icon/'+sz(size)+'size';
  it.bg=dis?f+'/disabled-background':ch?(hov?f+'/checked-hover-background':f+'/checked-background'):(variant==='filled'?f+'/filled-background':f+'/background');
  it.st=dis?f+'/checked-disabled-border-color':inv?f+'/invalid-border-color':foc?(ch?f+'/checked-focus-border-color':f+'/focus-border-color'):hov?(ch?f+'/checked-hover-border-color':f+'/hover-border-color'):(ch?f+'/checked-border-color':f+'/border-color');
  it.ic=checked==='no'?null:dis?f+'/icon/disabled-color':ch?(hov?f+'/icon/checked-hover-color':f+'/icon/checked-color'):f+'/icon/color';
  it.icon=K==='checkbox'?(checked==='indeterminate'?'Icon/minus':checked==='yes'?'Icon/check':null):null;
  it.dot=K==='radiobutton'&&ch;
  it.rr=K==='checkbox'?f+'/border-radius':it.h;it.ringR=K==='checkbox'?f+'/focus-ring-radius':it.h; // circle: radius = height (Figma caps at half)
  it.x=24+(ix('state',state)*A.checked.length+ix('checked',checked))*40;it.y=24+((ix('size',size)*vs.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*40;
 }
 out.push(it);}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const IT=variants(D.K,D.A);
const need=new Set();for(const it of IT)for(const k of ['w','h','isz','hs','bg','st','ic','hb','rr','ringR','ro','rw','rc'])if(it[k])need.add(it[k]);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));const V=n=>VB[n];
const ES=(await figma.getLocalEffectStylesAsync()).find(s=>s.name===D.K+'/shadow');if(!ES)throw new Error('Missing effect style '+D.K+'/shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC={};for(const n of ['Icon/check','Icon/minus']){IC[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!IC[n])throw new Error('Missing icon '+n);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const num=v=>v.resolveForConsumer(CUR).value;
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:0,rebuilt:0};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.newSet=set.id;}
set.description=D.desc;

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
 for(const nw of news){const od=olds.find(o=>!used.has(o)&&o.name===nw.name&&o.type===nw.type);if(od){used.add(od);await syCopy(od,nw,inInst,false);final.push(od);SY.kept++;}else{final.push(nw);SY.added++;}}
 if(inInst)return;
 for(const o of olds)if(!used.has(o)){o.remove();SY.removed++;}
 final.forEach((x,i)=>{if(x.parent!==parent){parent.appendChild(x);applyRefs(x);}if(parent.children.indexOf(x)!==i)parent.insertChild(i,x);});}

async function build(c,it){const tmp=figma.createComponent();figma.currentPage.appendChild(tmp);tmp.name=c.name;REFS.clear();
 try{await build0(tmp,it);await syCopy(c,tmp,false,true);c.x=tmp.x;c.y=tmp.y;}finally{tmp.remove();}}

async function build0(c,it){CUR=c;
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems=it.kind==='toggleswitch'?(it.on?'MAX':'MIN'):'CENTER';c.counterAxisAlignItems='CENTER';
 c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(num(V(it.w)),num(V(it.h)));c.setBoundVariable('width',V(it.w));c.setBoundVariable('height',V(it.h));
 c.clipsContent=false;c.fills=[paint(V(it.bg))];c.strokes=[paint(V(it.st))];c.strokeAlign='INSIDE';rad(c,V(it.rr));
 if(it.kind==='toggleswitch'){for(const k of ['strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight'])c.setBoundVariable(k,V('toggleswitch/border-width'));
  for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V('toggleswitch/gap')); // .p-toggleswitch-handle inset-inline-start: gap (checked: width − handle − gap)
  const hd=figma.createFrame();hd.name='Handle';c.appendChild(hd);hd.resize(num(V(it.hs)),num(V(it.hs)));hd.setBoundVariable('width',V(it.hs));hd.setBoundVariable('height',V(it.hs));
  rad(hd,V(it.hs));hd.fills=[paint(V(it.hb))];} // Aura handle radius 50% (percent: no variable) = circle
 else{c.strokeWeight=1; // Aura CSS: border 1px (no token)
  if(it.icon){const i=IC[it.icon].createInstance();i.name='Icon';c.appendChild(i);i.setBoundVariable('width',V(it.isz));i.setBoundVariable('height',V(it.isz));
   const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(it.icon+': no Shape layer');sh.fills=[paint(V(it.ic))];}
  if(it.dot){const d=figma.createFrame();d.name='Dot';c.appendChild(d);d.resize(num(V(it.isz)),num(V(it.isz)));d.setBoundVariable('width',V(it.isz));d.setBoundVariable('height',V(it.isz));
   rad(d,V(it.isz));d.fills=[paint(V(it.ic))];}}
 if(it.sh)await c.setEffectStyleIdAsync(ES.id);else c.effects=[];
 if(it.ring){const o=num(V(it.ro))+num(V(it.rw));const r=figma.createFrame();r.name='Focus ring';r.fills=[];c.appendChild(r);r.layoutPositioning='ABSOLUTE';
  r.resize(c.width+2*o,c.height+2*o);r.x=-o;r.y=-o;r.constraints={horizontal:'STRETCH',vertical:'STRETCH'};r.clipsContent=false;rad(r,V(it.ringR||it.rr));
  r.strokes=[paint(V(it.rc))];r.strokeAlign='INSIDE';for(const k of ['strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight'])r.setBoundVariable(k,V(it.rw));}
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c)ids.rebuilt++;else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {sync:SY,set:set.id,...ids,inSet:set.children.length,sizes};