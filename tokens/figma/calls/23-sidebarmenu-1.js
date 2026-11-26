const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Body/Base','Sidebar/Section','Sidebar/Item active']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const pad=(f,y,x)=>{f.setBoundVariable('paddingTop',V(y));f.setBoundVariable('paddingBottom',V(y));f.setBoundVariable('paddingLeft',V(x));f.setBoundVariable('paddingRight',V(x));};
const rad=(f,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])f.setBoundVariable(k,V(n));};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,col,size)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V(size));i.setBoundVariable('height',V(size));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const slot=(name,w)=>{const f=figma.createFrame();f.name=name;f.layoutMode='HORIZONTAL';f.primaryAxisSizingMode='FIXED';f.counterAxisSizingMode='AUTO';f.primaryAxisAlignItems='CENTER';f.counterAxisAlignItems='CENTER';f.resize(w,14);f.fills=[];f.clipsContent=false;return f;};
const row=(s)=>{s.layoutMode='HORIZONTAL';s.layoutWrap='WRAP';s.primaryAxisSizingMode='FIXED';s.counterAxisSizingMode='AUTO';s.itemSpacing=24;s.counterAxisSpacing=24;s.paddingTop=s.paddingBottom=s.paddingLeft=s.paddingRight=24;s.resize(6*(W+24)+24,s.height);};
const W=238; // 280 sidebar - 2 x 21 padding
const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const sync=async(c,fn,it)=>{if(true){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const out={};

// ---------- Sidebar Menu Item ----------
async function itemBuild(c,it){CUR=c;c.resize(W,38);c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.fills=[];c.clipsContent=false;
 c.paddingTop=c.paddingBottom=c.paddingRight=0;if(it.l==='1')c.setBoundVariable('paddingLeft',V('layout/menu/submenu/indent'));else c.paddingLeft=0;
 const act=it.s.startsWith('active'),hov=it.s.endsWith('hover'),col=act?'primary/color':'text/color';
 const L=figma.createFrame();L.name='Link';c.appendChild(L);L.layoutMode='HORIZONTAL';L.layoutGrow=1;L.layoutAlign='INHERIT';L.counterAxisSizingMode='AUTO';L.counterAxisAlignItems='CENTER';L.clipsContent=false;
 pad(L,'layout/menu/item/padding-y','layout/menu/item/padding-x');L.setBoundVariable('itemSpacing',V('layout/menu/item/icon-gap'));rad(L,'content/border-radius');L.fills=hov?[paint(V('content/hover-background'))]:[];
 const is=slot('Icon slot',18);L.appendChild(is);const ic=icon('Icon/bars',col,'icon-size');ic.name='Icon';is.appendChild(ic);REF(is,{visible:K['Show icon']});REF(ic,{mainComponent:K['Icon']});
 const t=await txt(L,'Menu item',act?'Sidebar/Item active':'Body/Base',col,'Label');t.layoutGrow=1;t.textAutoResize='HEIGHT';REF(t,{characters:K['Label']});
 if(it.t!=='none'){const ts=slot('Toggler',13.5);L.appendChild(ts);const ti=icon(it.t==='expanded'?'Icon/angle-up':'Icon/angle-down',col,'layout/menu/toggler/size');ti.name='Toggler icon';ts.appendChild(ti);}}
let IS=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Sidebar Menu Item');
const VN=(s,t,l)=>'State='+s+', Toggler='+t+', Level='+l;
if(!IS){const c=figma.createComponent();c.name=VN('default','none','0');pg.appendChild(c);IS=figma.combineAsVariants([c],pg);IS.name='Sidebar Menu Item';}
IS.description='Sakai layout menu item (app.menuitem.ts, _menu.scss ul a) — not a PrimeNG component | Story: components-sidebarmenu--playground | Version: 0.1.0 | Status: experimental (#97) | State active = router link active (700 + primary) | Toggler = item with children (collapsed/expanded) | Level 1 = child of an expanded group (indent 1rem) | Focus ring not modelled | Use inside Sidebar Menu (fills its width)';
K=props(IS,[['Label','TEXT','Menu item'],['Show icon','BOOLEAN',true],['Icon','INSTANCE_SWAP',IC('Icon/bars').id]]);
{const by={};for(const c of IS.children)by[c.name]=c;for(const l of ['0','1'])for(const t of ['none','collapsed','expanded'])for(const s of ['default','hover','active','active-hover']){const n=VN(s,t,l);let c=by[n];if(!c){c=figma.createComponent();c.name=n;IS.appendChild(c);}await sync(c,itemBuild,{s,t,l});}}
row(IS);out.item=[...new Set(IS.children.map(c=>c.width+'x'+c.height))];out.itemCount=IS.children.length;

// ---------- Sidebar Section ----------
let SE=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Sidebar Section');if(!SE){SE=figma.createComponent();SE.name='Sidebar Section';pg.appendChild(SE);}
SE.description='Sakai layout menu section label (.layout-menuitem-root-text: 0.857rem 700 uppercase, margin 0.75rem 0) | Version: 0.1.0 | Status: experimental (#97) | Use inside Sidebar Menu';
K=props(SE,[['Label','TEXT','Section']]);
async function secBuild(c){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(W,c.height);c.fills=[];pad(c,'layout/menu/root-text/margin-y','layout/menu/root-text/margin-x');
 const t=await txt(c,'Section','Sidebar/Section','text/color','Label');t.layoutGrow=1;t.textAutoResize='HEIGHT';REF(t,{characters:K['Label']});}
await sync(SE,secBuild,{});out.section=SE.width+'x'+SE.height;

// ---------- Sidebar Menu ----------
const VAR=(s,t,l)=>IS.children.find(c=>c.name===VN(s,t,l));
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
// [layer, type, label, icon, toggler, level, activeKey]; sub rows hidden when collapsed
const CONTENT=[['Section 1','S','UI Components'],['Item 1','I','Menu','Icon/bars'],['Item 2','I','Chart','Icon/chart-bar',0,0,'chart'],['Item 3','I','Timeline','Icon/calendar'],
 ['Section 2','S','Pages'],['Item 4','I','Landing','Icon/globe'],['Item 5','I','Auth','Icon/user',1],['Sub 1','I','Login','Icon/sign-in',0,1,'login'],['Sub 2','I','Error','Icon/times-circle',0,1],['Sub 3','I','Access Denied','Icon/lock',0,1],['Item 6','I','Crud','Icon/pencil']];
async function menuBuild(c,it){CUR=c;c.layoutMode='VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.resize(280,100);c.setBoundVariable('width',V('layout/sidebar/width'));c.clipsContent=false;c.itemSpacing=0;
 c.fills=[paint(V('overlay/popover/background'))];rad(c,'content/border-radius');pad(c,'layout/sidebar/padding-y','layout/sidebar/padding-x');
 const ex=it.ex,active=ex?'login':'chart';
 for(const [n,t,label,ic,tog,lvl,key] of CONTENT){const i=(t==='S'?SE:VAR(key===active?'active':'default',tog?(ex?'expanded':'collapsed'):'none',lvl?'1':'0')).createInstance();i.name=n;c.appendChild(i);i.layoutAlign='STRETCH';i.isExposedInstance=true;
  P(i,{Label:label});if(t==='I'&&ic!=='Icon/bars')P(i,{Icon:IC(ic).id});if(lvl&&!ex)i.visible=false;}}
let MS=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Sidebar Menu');
if(!MS){const c=figma.createComponent();c.name='Expanded=false';pg.appendChild(c);MS=figma.combineAsVariants([c],pg);MS.name='Sidebar Menu';}
MS.description='Sakai layout sidebar (.layout-sidebar > .layout-menu, model in app.menu.ts) | Story: components-sidebarmenu--playground | Version: 0.1.0 | Status: experimental (#97) | Rows are exposed parts: set Label/Icon/State/Toggler, hide (eye), duplicate, or swap Item ↔ Section | Expanded=true = Auth group open (sub rows Level 1) | Width = layout/sidebar/width (280)';
{const by={};for(const c of MS.children)by[c.name]=c;for(const e of ['false','true']){const n='Expanded='+e;let c=by[n];if(!c){c=figma.createComponent();c.name=n;MS.appendChild(c);}await sync(c,menuBuild,{ex:e==='true'});}}
MS.layoutMode='HORIZONTAL';MS.primaryAxisSizingMode='AUTO';MS.counterAxisSizingMode='AUTO';MS.counterAxisAlignItems='MIN';MS.itemSpacing=24;MS.paddingTop=MS.paddingBottom=MS.paddingLeft=MS.paddingRight=24;
out.menu=MS.children.map(c=>c.name+' '+c.width+'x'+c.height);
for(const n of [IS,SE,MS])if(n.y<1)place(n);
return {ids:{item:IS.id,section:SE.id,menu:MS.id},...out};