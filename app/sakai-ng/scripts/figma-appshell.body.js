// Plugin code for figma-appshell.mjs (App shell: Topbar Action, App Logo, Topbar, Layout Footer, App Shell; DECISIONS #102). Placeholders HELPERS / FRESH (in comment markers) are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Body/Base','Body/Strong','Topbar/Logo']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const P4=['Top','Right','Bottom','Left'];const CR=['topLeftRadius','topRightRadius','bottomRightRadius','bottomLeftRadius'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const rad=(f,n)=>{for(const k of CR)f.setBoundVariable(k,V(n));};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const fr=(parent,name,dir)=>{const f=figma.createFrame();f.name=name;parent.appendChild(f);f.layoutMode=dir;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.fills=[];f.clipsContent=false;return f;};
/*HELPERS*/
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const sync=async(c,fn,it)=>{if(/*FRESH*/){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const set=(n,first)=>{let s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);s=figma.combineAsVariants([c],pg);s.name=n;}return s;};
const variants=async(S,names,fn)=>{const by={};for(const c of S.children)by[c.name]=c;for(const [n,it] of names){let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}await sync(c,fn,it);}};
const row=(S,gap)=>{S.layoutMode='HORIZONTAL';S.layoutWrap='WRAP';S.primaryAxisSizingMode='AUTO';S.counterAxisSizingMode='AUTO';S.itemSpacing=gap||32;S.counterAxisSpacing=32;S.counterAxisAlignItems='CENTER';P4.forEach(s=>S['padding'+s]=24);};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const out={};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const icon=(parent,name,col,nm,size)=>{const i=IC(name).createInstance();parent.appendChild(i);i.name=nm;i.setBoundVariable('width',V(size||'icon-size'));i.setBoundVariable('height',V(size||'icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const comp=n=>{let c=pg.children.find(x=>x.type==='COMPONENT'&&x.name===n);if(!c){c=figma.createComponent();c.name=n;pg.appendChild(c);}return c;};
const SETF=n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing '+n);return s;};
const CARD=pg.findOne(x=>x.type==='COMPONENT'&&x.name==='Card');if(!CARD)throw new Error('Missing Card');const SM=SETF('Sidebar Menu');
const DEV={desktop:{W:1440,H:900},mobile:{W:390,H:844}};

// ---------- Topbar Action ----------
const TA=set('Topbar Action','State=default');
TA.description='Sakai .layout-topbar-action (not a PrimeNG component) | Version: 0.1.0 | Status: experimental (#103) | 2.5rem circle, icon 1.25rem, text/color | hover = content/hover-background (--surface-hover) | highlight = primary/color with primary/contrast-color icon (palette button) | Icon swap';
K=props(TA,[['Icon','INSTANCE_SWAP',IC('Icon/bars').id]]);
async function taBuild(c,it){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.setBoundVariable('width',V('layout/topbar/action/size'));c.setBoundVariable('height',V('layout/topbar/action/size'));c.cornerRadius=9999;c.clipsContent=false; // border-radius 50% (#47)
 c.fills=it.s==='default'?[]:[paint(V(it.s==='hover'?'content/hover-background':'primary/color'))];
 const i=icon(c,'Icon/bars',it.s==='highlight'?'primary/contrast-color':'text/color','Icon','layout/topbar/action/icon-size');REF(i,{mainComponent:K['Icon']});}
await variants(TA,['default','hover','highlight'].map(s=>['State='+s,{s}]),taBuild);row(TA);
const act=(parent,ic,state,name)=>{const a=TA.children.find(x=>x.name==='State='+(state||'default')).createInstance();parent.appendChild(a);a.name=name;a.isExposedInstance=true;P(a,{Icon:IC('Icon/'+ic).id});return a;};

// ---------- App Logo (slot) ----------
const LO=comp('App Logo');LO.description='Logo slot for the Topbar (#103): replace this component (or swap the Topbar Logo property) with the project logo | Sakai size: svg width 3rem (layout/topbar/logo/size), viewBox 54 × 40 | Placeholder mark in primary/color, not a brand';
await sync(LO,async c=>{CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(42,31.11);c.setBoundVariable('width',V('layout/topbar/logo/size'));c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.fills=[];c.clipsContent=false;
 const e=figma.createEllipse();c.appendChild(e);e.name='Placeholder mark';e.resize(28,28);e.fills=[paint(V('primary/color'))];});

// ---------- Topbar ----------
const TB=set('Topbar','Device=desktop');
TB.description='Sakai app topbar (app.topbar.ts, _topbar.scss; not a PrimeNG component) | Version: 0.1.0 | Status: experimental (#103) | Device desktop (≥ 992: menu content Calendar / Messages / Profile) or mobile (< 992: more button ⋮ opens the menu) | Props: App name, Logo (swap the App Logo slot) | Actions exposed (menu toggle, theme, palette)';
K=props(TB,[['App name','TEXT','SAKAI'],['Logo','INSTANCE_SWAP',LO.id]]);
async function tbBuild(c,it){CUR=c;const d=DEV[it.d];c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(d.W,56);c.setBoundVariable('height',V('layout/topbar/height'));c.counterAxisAlignItems='CENTER';c.primaryAxisAlignItems='SPACE_BETWEEN';
 pad(c,'layout/topbar/padding-y','layout/topbar/padding-x','layout/topbar/padding-y','layout/topbar/padding-x');c.fills=[paint(V('content/background'))];c.clipsContent=false;
 const lc=fr(c,'Logo container','HORIZONTAL');lc.counterAxisAlignItems='CENTER';lc.setBoundVariable('itemSpacing',V('layout/topbar/menu-button/margin-right'));if(it.d==='desktop'){lc.primaryAxisSizingMode='FIXED';lc.setBoundVariable('width',V('layout/topbar/logo-container/width'));}
 act(lc,'bars','default','Menu button');
 const lg=fr(lc,'Logo','HORIZONTAL');lg.counterAxisAlignItems='CENTER';lg.setBoundVariable('itemSpacing',V('layout/topbar/logo/gap'));const li=LO.createInstance();lg.appendChild(li);li.name='Logo';REF(li,{mainComponent:K['Logo']});
 const t=await txt(lg,'SAKAI','Topbar/Logo','text/color','App name');REF(t,{characters:K['App name']});
 c.itemSpacing=14;if(it.d!=='desktop')lc.layoutSizingHorizontal='FILL';lg.layoutSizingHorizontal='FILL';t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';t.textTruncation='ENDING';t.maxLines=1; // long app names truncate (design choice; Sakai would overflow)
 const ac=fr(c,'Actions','HORIZONTAL');ac.counterAxisAlignItems='CENTER';ac.setBoundVariable('itemSpacing',V('layout/topbar/actions/gap'));
 const cf=fr(ac,'Config','HORIZONTAL');cf.counterAxisAlignItems='CENTER';cf.setBoundVariable('itemSpacing',V('layout/topbar/actions/gap'));act(cf,'sun','default','Theme');act(cf,'palette','highlight','Palette');
 if(it.d==='desktop'){const mc=fr(ac,'Menu','HORIZONTAL');mc.counterAxisAlignItems='CENTER';mc.setBoundVariable('itemSpacing',V('layout/topbar/actions/gap'));act(mc,'calendar','default','Calendar');act(mc,'inbox','default','Messages');act(mc,'user','default','Profile');}
 else act(ac,'ellipsis-v','default','More');}
await variants(TB,['desktop','mobile'].map(d=>['Device='+d,{d}]),tbBuild);TB.layoutMode='VERTICAL';TB.primaryAxisSizingMode='AUTO';TB.counterAxisSizingMode='AUTO';TB.itemSpacing=24;P4.forEach(s=>TB['padding'+s]=24);

// ---------- Layout Footer ----------
const FT=comp('Layout Footer');FT.description='Sakai .layout-footer (app.footer.ts; not a PrimeNG component) | Version: 0.1.0 | Status: experimental (#103) | Centred text + bold primary link, top border (--surface-border) | Props: Text, Link';
K=props(FT,[['Text','TEXT','SAKAI by'],['Link','TEXT','PrimeNG']]);
await sync(FT,async c=>{CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(600,50);c.counterAxisSizingMode='AUTO';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.setBoundVariable('itemSpacing',V('layout/footer/gap'));
 pad(c,'layout/footer/padding-top','layout/footer/padding-right','layout/footer/padding-bottom','layout/footer/padding-left');c.fills=[];c.strokes=[paint(V('content/border-color'))];c.strokeAlign='INSIDE';c.strokeTopWeight=1;c.strokeRightWeight=0;c.strokeBottomWeight=0;c.strokeLeftWeight=0;c.strokesIncludedInLayout=true;
 const a=await txt(c,'SAKAI by','Body/Base','text/color','Text');REF(a,{characters:K['Text']});const b=await txt(c,'PrimeNG','Body/Strong','primary/color','Link');REF(b,{characters:K['Link']});});

// ---------- App Shell ----------
const PP=figma.root.children.find(p=>p.name==='03 Patterns');await PP.loadAsync(); // patterns live on 03 Patterns (#103)
const AS=PP.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='App Shell')||set('App Shell','Device=desktop');
AS.description='Sakai app layout (app.layout.ts: topbar + sidebar + main container + footer) | Version: 0.1.0 | Status: experimental (#103) | Desktop 1440 × 900: static sidebar (left 2rem, top 6rem, height 100vh − 8rem), content offset 22rem | Mobile 390 × 844: sidebar hidden (opens as overlay from the menu button), content padding 2rem | Page background layout/surface-ground | Replace the Card in Main with the page content; Topbar, Sidebar, Card and Footer are exposed';
async function asBuild(c,it){CUR=c;const d=DEV[it.d],desk=it.d==='desktop'; // auto layout: Topbar on top, Body = [Sidebar column] + Main container (#103, user: vertical flow)
 c.layoutMode='VERTICAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(d.W,d.H);c.itemSpacing=0;c.fills=[paint(V('layout/surface-ground'))];c.clipsContent=true;
 const tb=TB.children.find(x=>x.name==='Device='+it.d).createInstance();c.appendChild(tb);tb.name='Topbar';tb.layoutSizingHorizontal='FILL';tb.isExposedInstance=true;
 const body=fr(c,'Body','HORIZONTAL');body.layoutSizingHorizontal='FILL';body.layoutSizingVertical='FILL';body.itemSpacing=0;
 const TOP=28; // 6rem content / sidebar top − 4rem topbar (layout/main/padding-top − layout/topbar/height)
 if(desk){const col=fr(body,'Sidebar column','VERTICAL');col.layoutSizingVertical='FILL';col.setBoundVariable('paddingLeft',V('layout/sidebar/left'));col.paddingTop=TOP;col.paddingBottom=TOP; // sidebar height 100vh − 8rem
  const sm=SM.children.find(x=>x.name==='Expanded=false').createInstance();col.appendChild(sm);sm.name='Sidebar';sm.isExposedInstance=true;sm.layoutSizingVertical='FILL';}
 const mc=fr(body,'Main container','VERTICAL');mc.layoutSizingHorizontal='FILL';mc.layoutSizingVertical='FILL';mc.primaryAxisAlignItems='SPACE_BETWEEN';
 mc.paddingTop=TOP;mc.setBoundVariable('paddingRight',V('layout/main/padding-right'));mc.setBoundVariable('paddingLeft',V('layout/main/padding-left'));mc.setBoundVariable('paddingBottom',V('layout/main/padding-bottom'));
 const mn=fr(mc,'Main','VERTICAL');mn.layoutSizingHorizontal='FILL';mn.setBoundVariable('paddingBottom',V('layout/main/content/padding-bottom'));
 const cd=CARD.createInstance();mn.appendChild(cd);cd.name='Page content';cd.layoutSizingHorizontal='FILL';cd.isExposedInstance=true;P(cd,{Title:'Empty Page',Content:'Use this page to start from scratch and place your custom content.','Show slot':false});
 const f=FT.createInstance();mc.appendChild(f);f.name='Footer';f.layoutSizingHorizontal='FILL';f.isExposedInstance=true;}
await variants(AS,['desktop','mobile'].map(d=>['Device='+d,{d}]),asBuild);row(AS,48);
out.shell=AS.children.map(c=>c.name+' '+c.width+'x'+c.height);out.topbar=TB.children.map(c=>c.name+' '+c.width+'x'+c.height);out.footer=FT.width+'x'+FT.height;
const sbar=AS.children[0].findOne(x=>x.name==='Sidebar');out.sidebar=sbar?sbar.width+'x'+sbar.height:null;
for(const n of [TA,LO,TB,FT])if(n.y<1)place(n);
if(AS.parent!==PP){PP.appendChild(AS);let y=40;for(const n of PP.children)if(n!==AS)y=Math.max(y,n.y+n.height+200);AS.x=0;AS.y=y;}
return {ids:{action:TA.id,logo:LO.id,topbar:TB.id,footer:FT.id,shell:AS.id},...out};
