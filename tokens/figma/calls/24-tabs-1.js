const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Tabs/Tab label','Body/Paragraph']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const BS=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Badge');if(!BS)throw new Error('Missing Badge');const BADGE=BS.children.find(c=>/Severity=none/.test(c.name)&&/Circle=true/.test(c.name))||BS.defaultVariant;
let SLOT=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Tabs Slot');if(!SLOT){const ds=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Dialog Slot');if(!ds)throw new Error('Missing Dialog Slot');SLOT=ds.clone();SLOT.name='Tabs Slot';pg.appendChild(SLOT);SLOT.description='Placeholder for Tabs panel content (#98). In Tabs: turn on Show slot, then swap Slot to any component (it must hug, #84).';SLOT.y=0;}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,col)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V('icon-size'));i.setBoundVariable('height',V('icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const W=544; // story cell 560 - 2 x 8

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
const sync=async(c,fn,it)=>{if(false){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const out={};

// ---------- Tab ----------
async function tabBuild(c,it){CUR=c;const s=it.s,k=s==='hover'?'hover-':s==='active'?'active-':'';
 c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.clipsContent=false;
 c.setBoundVariable('paddingTop',V('tabs/tab/padding-y'));c.setBoundVariable('paddingBottom',V('tabs/tab/padding-y'));c.setBoundVariable('paddingLeft',V('tabs/tab/padding-x'));c.setBoundVariable('paddingRight',V('tabs/tab/padding-x'));c.setBoundVariable('itemSpacing',V('tabs/tab/gap'));
 c.fills=[paint(V('tabs/tab/'+k+'background'))];c.strokes=[paint(V('tabs/tab/'+k+'border-color'))];c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;
 for(const sd of ['Top','Right','Bottom','Left'])c.setBoundVariable('stroke'+sd+'Weight',V('tabs/tab/border-width-'+sd.toLowerCase()));
 if(s==='disabled')c.setBoundVariable('opacity',V('disabled-opacity'));
 const col='tabs/tab/'+k+'color';
 const ic=icon('Icon/user',col);ic.name='Icon';c.appendChild(ic);ic.visible=false;REF(ic,{visible:K['Show icon'],mainComponent:K['Icon']});
 const t=await txt(c,'Header I','Tabs/Tab label',col,'Label');REF(t,{characters:K['Label']});
 const b=BADGE.createInstance();b.name='Badge';c.appendChild(b);b.visible=false;REF(b,{visible:K['Badge']});}
let TB=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Tab');
if(!TB){const c=figma.createComponent();c.name='State=default';pg.appendChild(c);TB=figma.combineAsVariants([c],pg);TB.name='Tab';}
TB.description='PrimeNG: <p-tab> (inside <p-tablist>) | Story: components-tabs--playground | Version: 0.1.0 | Status: experimental (#98) | State active = selected tab (p-tab-active; its bottom border = the active bar) | hover = not active, not disabled | disabled = [disabled], opacity disabled-opacity | Badge = a <p-badge> in the tab content (set its value / severity) | Focus ring not modelled';
K=props(TB,[['Label','TEXT','Header I'],['Show icon','BOOLEAN',false],['Icon','INSTANCE_SWAP',IC('Icon/user').id],['Badge','BOOLEAN',false]]);
{const by={};for(const c of TB.children)by[c.name]=c;for(const s of ['default','hover','active','disabled']){const n='State='+s;let c=by[n];if(!c){c=figma.createComponent();c.name=n;TB.appendChild(c);}await sync(c,tabBuild,{s});}}
TB.layoutMode='HORIZONTAL';TB.primaryAxisSizingMode='AUTO';TB.counterAxisSizingMode='AUTO';TB.itemSpacing=24;TB.paddingTop=TB.paddingBottom=TB.paddingLeft=TB.paddingRight=24;
out.tab=TB.children.map(c=>c.name+' '+c.width+'x'+c.height);
const TV=s=>TB.children.find(c=>c.name==='State='+s);
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};

// ---------- Tab List ----------
let TL=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Tab List');if(!TL){TL=figma.createComponent();TL.name='Tab List';pg.appendChild(TL);}
TL.description='PrimeNG: <p-tablist> | Version: 0.1.0 | Status: experimental (#98) | Tabs are exposed parts: set Label / State / icon / badge, Show tab 4 / Show tab 5, or duplicate a tab for more; one tab State=active | Fills its parent width; the bottom border spans the full width | Scrollable nav buttons not built';
K=props(TL,[['Show tab 4','BOOLEAN',false],['Show tab 5','BOOLEAN',false]]);
async function listBuild(c){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(W,46);c.layoutSizingVertical='HUG';c.itemSpacing=0;c.clipsContent=false;c.fills=[paint(V('tabs/tablist/background'))];
 const bd=figma.createRectangle();bd.name='Border';c.appendChild(bd);bd.layoutPositioning='ABSOLUTE';bd.resize(W,1);bd.setBoundVariable('height',V('tabs/tablist/border-width-bottom'));bd.fills=[paint(V('tabs/tablist/border-color'))];bd.constraints={horizontal:'STRETCH',vertical:'MAX'};
 const TABS=[['Tab 1','active','Header I'],['Tab 2','default','Header II'],['Tab 3','default','Header III'],['Tab 4','default','Header IV',1],['Tab 5','default','Header V',1]];
 for(const [n,s,l,h] of TABS){const i=TV(s).createInstance();i.name=n;c.appendChild(i);i.layoutAlign='STRETCH';i.isExposedInstance=true;if(l!=='Header I')P(i,{Label:l});if(h){i.visible=false;REF(i,{visible:K['Show '+n.toLowerCase()]});}}
 bd.x=0;bd.y=c.height-bd.height;}
await sync(TL,listBuild,{});out.list=TL.width+'x'+TL.height;

// ---------- Tabs ----------
let TT=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Tabs');if(!TT){TT=figma.createComponent();TT.name='Tabs';pg.appendChild(TT);}
TT.description='PrimeNG: <p-tabs> = <p-tablist> + <p-tabpanels> | Story: components-tabs--playground | Version: 0.1.0 | Status: experimental (#98) | Tab List is exposed (edit the tabs there) | Panel: edit Content text, or turn Show slot on and swap Slot for your own content (hug components, #84) | Resize width freely';
K=props(TT,[['Content','TEXT',"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."],['Show content','BOOLEAN',true],['Show slot','BOOLEAN',false]].concat([['Slot','INSTANCE_SWAP',SLOT.id]]));
async function tabsBuild(c){CUR=c;c.layoutMode='VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.resize(W,100);c.layoutSizingVertical='HUG';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 const l=TL.createInstance();l.name='Tab List';c.appendChild(l);l.layoutAlign='STRETCH';l.isExposedInstance=true;
 const p=figma.createFrame();p.name='Panel';c.appendChild(p);p.layoutMode='VERTICAL';p.layoutAlign='STRETCH';p.primaryAxisSizingMode='AUTO';p.itemSpacing=0;p.clipsContent=false;p.fills=[paint(V('tabs/tabpanel/background'))];
 for(const sd of ['Top','Right','Bottom','Left'])p.setBoundVariable('padding'+sd,V('tabs/tabpanel/padding-'+sd.toLowerCase()));
 const t=await txt(p,"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",'Body/Paragraph','tabs/tabpanel/color','Content');t.layoutAlign='STRETCH';t.textAutoResize='HEIGHT';REF(t,{characters:K['Content'],visible:K['Show content']});
 const s=SLOT.createInstance();s.name='Slot';p.appendChild(s);s.visible=false;REF(s,{visible:K['Show slot'],mainComponent:K['Slot']});}
await sync(TT,tabsBuild,{});out.tabs=TT.width+'x'+TT.height;out.slot=SLOT.id;out.badge=BADGE.name+' '+BADGE.width+'x'+BADGE.height;
for(const n of [TB,TL,TT,SLOT])if(n.y<1)place(n);
return {ids:{tab:TB.id,list:TL.id,tabs:TT.id},...out};