const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Menu/Item label','Menu/Submenu label']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(!ES['menu/shadow'])throw new Error('Missing effect style menu/shadow');
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const pad=(f,y,x)=>{f.setBoundVariable('paddingTop',V(y));f.setBoundVariable('paddingBottom',V(y));f.setBoundVariable('paddingLeft',V(x));f.setBoundVariable('paddingRight',V(x));};
const rad=(f,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])f.setBoundVariable(k,V(n));};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,col)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V('icon-size'));i.setBoundVariable('height',V('icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const row=(s)=>{s.layoutMode='HORIZONTAL';s.primaryAxisSizingMode='AUTO';s.counterAxisSizingMode='AUTO';s.counterAxisAlignItems='MIN';s.itemSpacing=24;s.paddingTop=s.paddingBottom=s.paddingLeft=s.paddingRight=24;};
const FRESH=false;const W=166; // 175 min-width - 2 border - 2 x 3.5 list padding

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

let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const out={};

// ---------- Menu Item ----------
async function itemBuild(c,it){CUR=c;c.resize(W,28);c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';
 pad(c,'menu/item/padding-y','menu/item/padding-x');c.setBoundVariable('itemSpacing',V('menu/item/gap'));rad(c,'menu/item/border-radius');c.clipsContent=true;
 const f=it.s==='focus';c.fills=f?[paint(V('menu/item/focus-background'))]:[];
 if(it.s==='disabled')c.setBoundVariable('opacity',V('disabled-opacity'));
 const ic=icon('Icon/plus',f?'menu/item/icon/focus-color':'menu/item/icon/color');ic.name='Icon';c.appendChild(ic);REF(ic,{visible:K['Show icon'],mainComponent:K['Icon']});
 const t=await txt(c,'Menu item','Menu/Item label',f?'menu/item/focus-color':'menu/item/color','Label');REF(t,{characters:K['Label']});}
let IS=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Menu Item');
if(!IS){const c=figma.createComponent();c.name='State=default';pg.appendChild(c);IS=figma.combineAsVariants([c],pg);IS.name='Menu Item';}
IS.description='PrimeNG: <p-menu> item (MenuItem { label, icon, disabled }) | Story: components-menu--playground | Version: 0.1.0 | Status: experimental (#95) | State focus = keyboard focus and hover (same CSS) | Disabled = item opacity disabled-opacity | Use inside Menu (fills its width)';
K=props(IS,[['Label','TEXT','Menu item'],['Show icon','BOOLEAN',true],['Icon','INSTANCE_SWAP',IC('Icon/plus').id]]);
{const by={};for(const c of IS.children)by[c.name]=c;for(const s of ['default','focus','disabled']){const n='State='+s;let c=by[n];if(!c){c=figma.createComponent();c.name=n;IS.appendChild(c);}
if(FRESH){for(const ch of [...c.children])ch.remove();await itemBuild(c,{s});}else{const build0=itemBuild;await (async()=>{const tmp=figma.createComponent();figma.currentPage.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await build0(tmp,{s});await syCopy(c,tmp,false,true);}finally{tmp.remove();}})();}}}
row(IS);out.item=IS.children.map(c=>c.name+' '+c.width+'x'+c.height);

// ---------- Menu Submenu Label ----------
let GL=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Menu Submenu Label');if(!GL){GL=figma.createComponent();GL.name='Menu Submenu Label';pg.appendChild(GL);}
GL.description='PrimeNG: <p-menu> group label (MenuItem with items) | Version: 0.1.0 | Status: experimental (#95) | Use inside Menu';
K=props(GL,[['Label','TEXT','Group']]);
async function labelBuild(c){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(W,30.8); /* fixed: Figma rounds the 16.8 text box to 17 */c.counterAxisAlignItems='CENTER';
 pad(c,'menu/submenu-label/padding-y','menu/submenu-label/padding-x');c.fills=[paint(V('menu/submenu-label/background'))];
 const t=await txt(c,'Group','Menu/Submenu label','menu/submenu-label/color','Label');REF(t,{characters:K['Label']});}
if(FRESH){for(const ch of [...GL.children])ch.remove();await labelBuild(GL);}else{const tmp=figma.createComponent();pg.appendChild(tmp);REFS.clear();try{await labelBuild(tmp);await syCopy(GL,tmp,false,true);}finally{tmp.remove();}}
out.label=GL.width+'x'+GL.height;

// ---------- Menu Separator ----------
let SP=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Menu Separator');if(!SP){SP=figma.createComponent();SP.name='Menu Separator';pg.appendChild(SP);}
SP.description='PrimeNG: <p-menu> separator (MenuItem { separator: true }) = border-top 1px | Version: 0.1.0 | Status: experimental (#95)';
CUR=SP;SP.layoutMode='NONE';SP.resize(W,1);SP.fills=[paint(V('menu/separator/border-color'))];out.sep=SP.width+'x'+SP.height;

// ---------- Menu ----------
const VAR=(w)=>IS.children.find(c=>c.name==='State='+w);
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const CONTENT=[['Label 1','L','Customers'],['Item 1','I','New','Icon/plus'],['Item 2','I','Edit','Icon/user-edit'],['Label 2','L','Orders'],['Item 3','I','View','Icon/list'],['Item 4','I','Search','Icon/search'],['Separator','S',0,0,1],['Item 5','I','Menu item','Icon/plus',1],['Item 6','I','Menu item','Icon/plus',1]];
async function menuBuild(c,it){CUR=c;c.resize(175,100);c.layoutMode='VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.minWidth=175;c.clipsContent=false;
 c.fills=[paint(V('menu/background'))];c.strokes=[paint(V('menu/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;rad(c,'menu/border-radius');
 if(it.popup)await c.setEffectStyleIdAsync(ES['menu/shadow'].id);else c.effects=[];
 const L=figma.createFrame();L.name='List';c.appendChild(L);L.layoutMode='VERTICAL';L.layoutAlign='STRETCH';L.primaryAxisSizingMode='AUTO';L.fills=[];L.clipsContent=false;pad(L,'menu/list/padding-y','menu/list/padding-x');L.setBoundVariable('itemSpacing',V('menu/list/gap'));
 for(const [n,t,label,ic,hide] of CONTENT){const i=(t==='L'?GL:t==='S'?SP:VAR('default')).createInstance();i.name=n;L.appendChild(i);i.layoutAlign='STRETCH';if(t!=='S')i.isExposedInstance=true;
  if(t==='L')P(i,{Label:label});if(t==='I'){P(i,{Label:label});if(ic!=='Icon/plus')P(i,{Icon:IC(ic).id});}if(hide)i.visible=false;}}
let MS=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Menu');
if(!MS){const c=figma.createComponent();c.name='Popup=false';pg.appendChild(c);MS=figma.combineAsVariants([c],pg);MS.name='Menu';}
MS.description='PrimeNG: <p-menu [model]> (inline) / <p-menu [popup]="true"> (Popup=true adds menu.shadow) | Story: components-menu--playground | Version: 0.1.0 | Status: experimental (#95) | Rows are exposed parts: set Label/Icon/State, hide (eye) or swap (Item / Submenu Label / Separator) | Width 175 = min-width 12.5rem; resize wider for inline menus';
{const by={};for(const c of MS.children)by[c.name]=c;for(const p of ['false','true']){const n='Popup='+p;let c=by[n];if(!c){c=figma.createComponent();c.name=n;MS.appendChild(c);}
 if(FRESH){for(const ch of [...c.children])ch.remove();await menuBuild(c,{popup:p==='true'});}else{const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await menuBuild(tmp,{popup:p==='true'});await syCopy(c,tmp,false,true);}finally{tmp.remove();}}}}
row(MS);out.menu=MS.children.map(c=>c.name+' '+c.width+'x'+c.height);
for(const n of [IS,GL,SP,MS])if(n.y<1)place(n);
return {ids:{item:IS.id,label:GL.id,sep:SP.id,menu:MS.id},...out};