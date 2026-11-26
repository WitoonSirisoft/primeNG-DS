const D={"set":"datepicker","setName":"DatePicker","desc":"PrimeNG: <p-datepicker> (field) | Story: components-datepicker--playground | Version: 0.1.0 | Status: experimental | Composed from an InputText instance (#61, #65) | Icon display none = showIcon off; input / button = showIcon + iconDisplay | Panel: DatePicker Panel | Dropdown hover/active not built","icon":"Icon/calendar","G":{"w":{"small":149.5,"base":172,"large":194.5},"px":{"small":8.75,"base":10.5,"large":12.25},"icon":14,"btn":35,"iconPad":35,"stackPad":45.5}};
function variants(SET,G){
const SIZES=['small','base','large'],out=[];
const ISZ={small:'form-field/sm/font-size',base:'icon-size',large:'form-field/lg/font-size'}; // .p-iconfield/.p-inputnumber icon size per size
const IPX={small:12.25,base:14,large:15.75};
const it0=(size)=>({size,inner:'Size='+size+', Variant=outlined, State=default, Invalid=false, Content=placeholder',w:G.w[size],px:G.px[size]});
SIZES.forEach((size,si)=>{
 if(SET==='iconfield')['left','right'].forEach((pos,pi)=>{const it=it0(size);it.n='Icon position='+pos+', Size='+size;it.pos=pos;
  it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='iconfield/input-padding';it.icon='Icon/search';it.isz=ISZ[size];it.ipx=IPX[size];it.ic='iconfield/icon/color';
  it.ph='Search';it.x=24+si*260;it.y=24+pi*60;out.push(it);});
 if(SET==='password')['false','true'].forEach((tm,ti)=>{const it=it0(size);it.n='Toggle mask='+tm+', Size='+size;it.inner=it.inner.replace('placeholder','value');it.val='••••••••';
  if(tm==='true'){it.pos='right';it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='password/input-padding';it.icon='Icon/eye';it.isz='icon-size';it.ipx=14;it.ic='password/icon/color';}
  else it.iw=G.w[size];
  it.x=24+si*260;it.y=24+ti*60;out.push(it);});
 if(SET==='inputnumber')['none','stacked','horizontal','vertical'].forEach((bl,bi)=>{const it=it0(size);it.n='Buttons='+bl+', Size='+size;it.bl=bl;it.inner=it.inner.replace('placeholder','value');it.val='42';
  it.isz=ISZ[size];it.ipx=IPX[size];it.iw=bl==='stacked'?G.w[size]-G.px[size]+G.stackPad:G.w[size];
  if(bl==='stacked')it.pad='inputnumber/stacked-input-padding';
  it.x=24+si*300;it.y=24+bi*130;out.push(it);});
 if(SET==='datepicker')['none','input','button'].forEach((ic,ii)=>{const it=it0(size);it.n='Icon display='+ic+', Size='+size;it.ph='Select a date';
  if(ic==='input'){it.pos='right';it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='datepicker/input-padding';it.icon='Icon/calendar';it.isz=ISZ[size];it.ipx=IPX[size];it.ic='datepicker/input-icon/color';}
  else it.iw=G.w[size];
  if(ic==='button'){it.dd={small:'datepicker/dropdown/sm/width',base:'datepicker/dropdown/width',large:'datepicker/dropdown/lg/width'}[size];it.ddw={small:28,base:35,large:42}[size];it.isz=ISZ[size];it.ipx=IPX[size];}
  it.x=24+si*280;it.y=24+ii*60;out.push(it);});
});
return out;}

const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const IT=variants(D.set,D.G);
const ITXT=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='InputText');if(!ITXT)throw new Error('InputText set missing');
for(const s of await figma.getLocalTextStylesAsync())if(s.name.startsWith('InputText/'))await figma.loadFontAsync(s.fontName); // vertical layout centres the inner text
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:0,rebuilt:0};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);
 const seed=IT.find(i=>i.icon||i.dd)||IT[0];const c=figma.createComponent();c.name=seed.n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;}
set.description=D.desc;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
if(D.icon&&!K['Icon'])K['Icon']=set.addComponentProperty('Icon','INSTANCE_SWAP',IC(D.icon).id);
function iconInst(name,sizeVar,colVar){const i=IC(name).createInstance();i.name='Icon';i.setBoundVariable('width',V(sizeVar));i.setBoundVariable('height',V(sizeVar));
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape layer');sh.fills=[paint(V(colVar))];return i;}
function inner(it){const i=ITXT.children.find(c=>c.name===it.inner);if(!i)throw new Error('No InputText variant '+it.inner);const n=i.createInstance();n.name='InputText';
 const P={};for(const k in n.componentProperties)P[k.split('#')[0]]=k;const o={};if(it.val&&P['Value'])o[P['Value']]=it.val;if(it.ph&&P['Placeholder'])o[P['Placeholder']]=it.ph;n.setProperties(o);return n;}
function button(it,name,iconName,side){const b=figma.createAutoLayout('HORIZONTAL',{name});b.primaryAxisAlignItems='CENTER';b.counterAxisAlignItems='CENTER';
 b.fills=[paint(V('inputnumber/button/background'))];b.appendChild(iconInst(iconName,it.isz,'inputnumber/button/color'));return b;}

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
async function build0(c,it){CUR=c; // update in place (#68): build() in lib/figma-sync.mjs keeps old layers and syncs
c.fills=[];c.strokes=[];c.clipsContent=false;
 const n=inner(it);
 if(!it.bl||it.bl==='none'||it.bl==='stacked'){c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.appendChild(n);
  if(Math.abs(n.width-it.iw)>0.01)n.resize(it.iw,n.height);
  if(it.pad)n.setBoundVariable(it.pos==='left'?'paddingLeft':'paddingRight',V(it.pad));
  if(it.icon){const i=iconInst(it.icon,it.isz,it.ic);c.appendChild(i);i.layoutPositioning='ABSOLUTE';
   i.x=it.pos==='left'?it.px0:it.iw-it.px0-it.ipx;i.y=(n.height-it.ipx)/2;i.constraints={horizontal:it.pos==='left'?'MIN':'MAX',vertical:'CENTER'};
   REF(i,{mainComponent:K['Icon']});}
  if(it.dd){for(const k of ['topRightRadius','bottomRightRadius'])n[k]=0; // .p-datepicker:has(.p-datepicker-dropdown) .p-datepicker-input
   const b=figma.createAutoLayout('HORIZONTAL',{name:'Dropdown'});b.primaryAxisAlignItems='CENTER';b.counterAxisAlignItems='CENTER';c.appendChild(b);
   b.fills=[paint(V('datepicker/dropdown/background'))];b.strokes=[paint(V('datepicker/dropdown/border-color'))];b.strokeAlign='INSIDE';b.strokesIncludedInLayout=true;
   b.strokeTopWeight=1;b.strokeBottomWeight=1;b.strokeRightWeight=1;b.strokeLeftWeight=0;b.resize(it.ddw,n.height);b.setBoundVariable('width',V(it.dd));b.layoutSizingVertical='FILL';
   for(const k of ['topRightRadius','bottomRightRadius'])b.setBoundVariable(k,V('datepicker/dropdown/border-radius'));
   const di=iconInst('Icon/calendar',it.isz,'datepicker/dropdown/color');b.appendChild(di);if(K['Icon'])REF(di,{mainComponent:K['Icon']});}
  if(it.bl==='stacked'){const g=figma.createAutoLayout('VERTICAL',{name:'Buttons'});g.fills=[];c.appendChild(g);g.layoutPositioning='ABSOLUTE';
   g.resize(D.G.btn,n.height-2);g.setBoundVariable('width',V('inputnumber/button/width'));g.primaryAxisSizingMode='FIXED';g.counterAxisSizingMode='FIXED';g.x=it.iw-1-D.G.btn;g.y=1;g.constraints={horizontal:'MAX',vertical:'STRETCH'};
   for(const [nm,ic,cr] of [['Increment','Icon/angle-up',['topRightRadius']],['Decrement','Icon/angle-down',['bottomRightRadius']]]){const b=button(it,nm,ic);g.appendChild(b);b.layoutSizingHorizontal='FILL';b.layoutSizingVertical='FILL';
    for(const k of cr)b.setBoundVariable(k,V('inputnumber/button/border-radius'));}}
 }else{const H=it.bl==='horizontal';c.layoutMode=H?'HORIZONTAL':'VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='MIN';
  const order=H?[['Decrement','Icon/minus'],null,['Increment','Icon/plus']]:[['Increment','Icon/angle-up'],null,['Decrement','Icon/angle-down']];
  order.forEach((o,ix)=>{if(!o){c.appendChild(n);for(const k of RAD)n[k]=0;if(!H){const t=n.findOne(x=>x.type==='TEXT');if(t)t.textAlignHorizontal='CENTER';}return;}
   const b=button(it,o[0],o[1]);c.appendChild(b);b.strokes=[paint(V('inputnumber/button/border-color'))];b.strokeAlign='INSIDE';b.strokesIncludedInLayout=true; // CSS border adds to the button size
   const first=ix===0;const W={strokeTopWeight:1,strokeBottomWeight:1,strokeLeftWeight:1,strokeRightWeight:1};
   if(H){W[first?'strokeRightWeight':'strokeLeftWeight']=0;b.setBoundVariable('width',V('inputnumber/button/width'));b.layoutSizingVertical='FILL';
    for(const k of first?['topLeftRadius','bottomLeftRadius']:['topRightRadius','bottomRightRadius'])b.setBoundVariable(k,V('inputnumber/button/border-radius'));}
   else{W[first?'strokeBottomWeight':'strokeTopWeight']=0;b.layoutSizingHorizontal='FILL';for(const k of ['paddingTop','paddingBottom'])b.setBoundVariable(k,V('inputnumber/button/vertical-padding'));
    for(const k of first?['topLeftRadius','topRightRadius']:['bottomLeftRadius','bottomRightRadius'])b.setBoundVariable(k,V('inputnumber/button/border-radius'));}
   Object.assign(b,W);});
  if(H)c.counterAxisAlignItems='CENTER';}
 // fluid by default (#67): the wrapper keeps its browser width as a FIXED size and the inner InputText fills it, so resizing an instance stretches the field
 if(c.layoutMode==='HORIZONTAL')c.primaryAxisSizingMode='FIXED';else c.counterAxisSizingMode='FIXED';n.layoutSizingHorizontal='FILL';
 n.isExposedInstance=true;c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
// variants that use the Icon swap property first: Figma drops a swap property no layer references yet
const ORDER=[...IT].sort((a,b)=>((b.icon||b.dd)?1:0)-((a.icon||a.dd)?1:0));
for(const it of ORDER){it.px0=10.5;let c=byName[it.n];if(c)ids.rebuilt++;else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {sync:SY,set:set.id,...ids,inSet:set.children.length,sizes:set.children.map(c=>c.name.replace(/[A-Za-z ]+=/g,'')+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2))};