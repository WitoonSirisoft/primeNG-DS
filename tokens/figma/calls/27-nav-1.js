// Plugin code for figma-nav.mjs (Breadcrumb, Menubar; DECISIONS #100). 
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
 and false are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Body/Base','Menu/Item label']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(!ES['menubar/submenu/shadow'])throw new Error('Missing effect style menubar/submenu/shadow');
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const P4=['Top','Right','Bottom','Left'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const rad=(f,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])f.setBoundVariable(k,V(n));};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,col,size)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V(size||'icon-size'));i.setBoundVariable('height',V(size||'icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
/*HELPERS*/
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const sync=async(c,fn,it)=>{if(/*FRESH*/){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const comp=n=>{let c=pg.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c){c=figma.createComponent();c.name=n;pg.appendChild(c);}return c;};
const set=(n,first)=>{let s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);s=figma.combineAsVariants([c],pg);s.name=n;}return s;};
const variants=async(S,names,fn)=>{const by={};for(const c of S.children)by[c.name]=c;for(const [n,it] of names){let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}await sync(c,fn,it);}};
const grid=(S,cols)=>{S.layoutMode='HORIZONTAL';S.layoutWrap='WRAP';S.primaryAxisSizingMode='FIXED';S.counterAxisSizingMode='AUTO';S.itemSpacing=24;S.counterAxisSpacing=24;S.counterAxisAlignItems='CENTER';P4.forEach(s=>S['padding'+s]=24);let w=0;for(const c of S.children.slice(0,cols))w+=c.width+24;S.resize(w+24,S.height);};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const hug=(f,dir)=>{f.layoutMode=dir;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.counterAxisAlignItems='CENTER';f.clipsContent=false;f.fills=[];};
const out={};

// ---------- Breadcrumb ----------
const BI=set('Breadcrumb Item','State=default');
BI.description='PrimeNG: <p-breadcrumb> item link (MenuItem { label, icon }; home = [home]) | Story: components-breadcrumb--playground | Version: 0.1.0 | Status: experimental (#100) | hover = pointer over the link | Home = Show label off + Icon/home | Use inside Breadcrumb';
K=props(BI,[['Label','TEXT','Computer'],['Show label','BOOLEAN',true],['Show icon','BOOLEAN',false],['Icon','INSTANCE_SWAP',IC('Icon/home').id]]);
async function biBuild(c,it){CUR=c;const hv=it.s==='hover';hug(c,'HORIZONTAL');c.setBoundVariable('itemSpacing',V('breadcrumb/item/gap'));rad(c,'breadcrumb/item/border-radius');
 const i=icon('Icon/home',hv?'breadcrumb/item/icon/hover-color':'breadcrumb/item/icon/color');i.name='Icon';c.appendChild(i);i.visible=false;REF(i,{visible:K['Show icon'],mainComponent:K['Icon']});
 const t=await txt(c,'Computer','Body/Base',hv?'breadcrumb/item/hover-color':'breadcrumb/item/color','Label');REF(t,{characters:K['Label'],visible:K['Show label']});}
await variants(BI,[['State=default',{s:'default'}],['State=hover',{s:'hover'}]],biBuild);grid(BI,2);
const BS=comp('Breadcrumb Separator');BS.description='PrimeNG: <p-breadcrumb> separator (chevron-right, breadcrumb/separator/color) | Version: 0.1.0 | Status: experimental (#100)';
await sync(BS,async c=>{CUR=c;hug(c,'HORIZONTAL');const i=icon('Icon/chevron-right','breadcrumb/separator/color');i.name='Icon';c.appendChild(i);},{});
const BR=comp('Breadcrumb');BR.description='PrimeNG: <p-breadcrumb [model] [home]> | Story: components-breadcrumb--playground | Version: 0.1.0 | Status: experimental (#100) | Prefilled like the Sakai demo (home + Computer › Notebook › Accessories › Backpacks › Item); items and separators are exposed: set Label / icon / State, hide pairs you do not need, duplicate for more | Overflow scrolls in code (overflow-x auto)';
async function brBuild(c){CUR=c;hug(c,'HORIZONTAL');c.setBoundVariable('itemSpacing',V('breadcrumb/gap'));pad(c,'breadcrumb/padding','breadcrumb/padding','breadcrumb/padding','breadcrumb/padding');c.fills=[paint(V('breadcrumb/background'))];
 const d=BI.children.find(x=>x.name==='State=default');const L=['Computer','Notebook','Accessories','Backpacks','Item'];
 const h=d.createInstance();h.name='Home';c.appendChild(h);h.isExposedInstance=true;P(h,{'Show label':false,'Show icon':true});
 L.forEach((l,i)=>{const s=BS.createInstance();s.name='Separator '+(i+1);c.appendChild(s);const it=d.createInstance();it.name='Item '+(i+1);c.appendChild(it);it.isExposedInstance=true;if(l!=='Computer')P(it,{Label:l});});}
await sync(BR,brBuild,{});out.breadcrumb=BR.width+'x'+BR.height;out.item=BI.children[0].width+'x'+BI.children[0].height;

// ---------- Menubar Item ----------
const MI=set('Menubar Item','Level=root, State=default, Submenu=false');
MI.description='PrimeNG: <p-menubar> item (MenuItem { label, icon, items }) | Story: components-menubar--playground | Version: 0.1.0 | Status: experimental (#100) | Level root = top bar item (base-item padding), submenu = item in a Menubar Submenu (fills its width) | hover = pointer / keyboard focus (same CSS), active = its submenu is open | Submenu = has items (root: angle-down, submenu: angle-right)';
K=props(MI,[['Label','TEXT','Customers'],['Show icon','BOOLEAN',true],['Icon','INSTANCE_SWAP',IC('Icon/table').id]]);
async function miBuild(c,it){CUR=c;const root=it.l==='root',k=it.s==='hover'?'focus-':it.s==='active'?'active-':'';
 c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.clipsContent=true;c.counterAxisSizingMode='AUTO';
 if(root){c.primaryAxisSizingMode='AUTO';pad(c,'menubar/base-item/padding-y','menubar/base-item/padding-x','menubar/base-item/padding-y','menubar/base-item/padding-x');rad(c,'menubar/base-item/border-radius');}
 else{c.primaryAxisSizingMode='FIXED';c.resize(160,30);c.layoutSizingVertical='HUG';pad(c,'menubar/item/padding-y','menubar/item/padding-x','menubar/item/padding-y','menubar/item/padding-x');rad(c,'menubar/item/border-radius');}
 c.setBoundVariable('itemSpacing',V('menubar/item/gap'));c.fills=k?[paint(V('menubar/item/'+k+'background'))]:[];
 const i=icon('Icon/table','menubar/item/icon/'+(k?k+'color':'color'));i.name='Icon';c.appendChild(i);REF(i,{visible:K['Show icon'],mainComponent:K['Icon']});
 const t=await txt(c,'Customers','Menu/Item label','menubar/item/'+(k?k+'color':'color'),'Label');REF(t,{characters:K['Label']});if(!root)t.layoutGrow=1;
 if(it.sub==='true'){const s=icon(root?'Icon/angle-down':'Icon/angle-right','menubar/submenu/icon/'+(k?k+'color':'color'),'menubar/submenu/icon/size');s.name='Submenu icon';c.appendChild(s);}}
{const L=[];for(const l of ['root','submenu'])for(const s of ['default','hover','active'])for(const sub of ['false','true'])L.push(['Level='+l+', State='+s+', Submenu='+sub,{l,s,sub}]);await variants(MI,L,miBuild);}
grid(MI,6);out.mitem=[...new Set(MI.children.map(c=>c.name.split(',')[0]+' '+c.width+'x'+c.height))];
const MIV=(l,s,sub)=>MI.children.find(c=>c.name==='Level='+l+', State='+s+', Submenu='+sub);

// ---------- Menubar Submenu ----------
const MS=comp('Menubar Submenu');MS.description='PrimeNG: <p-menubar> submenu panel (.p-menubar-submenu: min-width 12.5rem, shadow menubar/submenu/shadow) | Version: 0.1.0 | Status: experimental (#100) | Items are exposed (Level=submenu): set Label / icon / State / Submenu; Show item 3 / 4 or duplicate | Place it under its root item (or right of a parent item for nested levels)';
K=props(MS,[['Show item 3','BOOLEAN',false],['Show item 4','BOOLEAN',false]]);
async function msBuild(c){CUR=c;c.layoutMode='VERTICAL';c.resize(175,60);c.counterAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.minWidth=175;c.clipsContent=false;
 pad(c,'menubar/submenu/padding-y','menubar/submenu/padding-x','menubar/submenu/padding-y','menubar/submenu/padding-x');c.setBoundVariable('itemSpacing',V('menubar/submenu/gap'));
 c.fills=[paint(V('menubar/submenu/background'))];c.strokes=[paint(V('menubar/submenu/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;rad(c,'menubar/submenu/border-radius');await c.setEffectStyleIdAsync(ES['menubar/submenu/shadow'].id);
 for(const [n,l,ic,sub,h] of [['Item 1','New','Icon/user-plus','true'],['Item 2','Edit','Icon/user-edit','false'],['Item 3','Menu item','Icon/plus','false',1],['Item 4','Menu item','Icon/plus','false',1]]){
  const i=MIV('submenu','default',sub).createInstance();i.name=n;c.appendChild(i);i.layoutAlign='STRETCH';i.isExposedInstance=true;P(i,{Label:l,Icon:IC(ic).id});if(h){i.visible=false;REF(i,{visible:K['Show '+n.toLowerCase()]});}}}
await sync(MS,msBuild,{});out.submenu=MS.width+'x'+MS.height;

// ---------- Menubar ----------
const IFS=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='IconField');const IF=IFS?{defaultVariant:IFS.children.find(c=>/Icon position=left/.test(c.name)&&/Size=base/.test(c.name))||IFS.defaultVariant}:null; // Sakai search = base size
const MB=comp('Menubar');MB.description='PrimeNG: <p-menubar [model]> with <ng-template #end> | Story: components-menubar--playground | Version: 0.1.0 | Status: experimental (#100) | Prefilled like the Sakai demo: Customers, Orders, Shipments, Profile (submenus), Quit; root items exposed | End = search IconField (Show end; swap End for any hugging component) | Open a submenu: set the root item State=active and place a Menubar Submenu below it | Items wrap in code when the bar is too narrow (flex-wrap)';
K=props(MB,[['Show end','BOOLEAN',true]].concat(IF?[['End','INSTANCE_SWAP',IF.defaultVariant.id]]:[]));
async function mbBuild(c){CUR=c;c.layoutMode='HORIZONTAL';c.resize(1084,44);c.primaryAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.counterAxisAlignItems='CENTER';c.primaryAxisAlignItems='SPACE_BETWEEN';c.clipsContent=false;
 pad(c,'menubar/padding-y','menubar/padding-x','menubar/padding-y','menubar/padding-x');c.setBoundVariable('itemSpacing',V('menubar/gap'));
 c.fills=[paint(V('menubar/background'))];c.strokes=[paint(V('menubar/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;rad(c,'menubar/border-radius');
 const R=figma.createFrame();R.name='Root list';c.appendChild(R);hug(R,'HORIZONTAL');R.setBoundVariable('itemSpacing',V('menubar/gap'));
 for(const [n,l,ic,sub] of [['Item 1','Customers','Icon/table','true'],['Item 2','Orders','Icon/shopping-cart','true'],['Item 3','Shipments','Icon/envelope','true'],['Item 4','Profile','Icon/user','true'],['Item 5','Quit','Icon/sign-out','false']]){
  const i=MIV('root','default',sub).createInstance();i.name=n;R.appendChild(i);i.isExposedInstance=true;if(l!=='Customers')P(i,{Label:l,Icon:IC(ic).id});}
 if(IF){const e=IF.defaultVariant.createInstance();e.name='End';c.appendChild(e);REF(e,{visible:K['Show end'],mainComponent:K['End']});}}
await sync(MB,mbBuild,{});out.menubar=MB.width+'x'+MB.height;out.iconField=IF?IF.defaultVariant.name:'none';
for(const n of [BI,BS,BR,MI,MS,MB])if(n.y<1)place(n);
return {ids:{bitem:BI.id,bsep:BS.id,breadcrumb:BR.id,mitem:MI.id,msub:MS.id,menubar:MB.id},...out};
