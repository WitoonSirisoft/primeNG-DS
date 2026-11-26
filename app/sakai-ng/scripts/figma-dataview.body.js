// Plugin code for figma-dataview.mjs (DataView + Sakai items; DECISIONS #102). Placeholders HELPERS / FRESH (in comment markers) are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['DataView/Meta','DataView/Name','DataView/Price','DataView/Price lg']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
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
const icon=(parent,name,col,nm)=>{const i=IC(name).createInstance();parent.appendChild(i);i.name=nm;i.setBoundVariable('width',V('icon-size'));i.setBoundVariable('height',V('icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const SETF=n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing '+n);return s;};
const bv=(S,name)=>{const v=S.children.find(c=>c.name===name);if(!v)throw new Error(S.name+': no '+name);return v;};
const BTN=SETF('Button'),BI=SETF('Button Icon'),TAG=SETF('Tag'),SB=SETF('SelectButton');
const RTW=3.5; // Tailwind `rounded` (0.25rem): Sakai template literal, not a theme token
const comp=n=>{let c=pg.children.find(x=>x.type==='COMPONENT'&&x.name===n);if(!c){c=figma.createComponent();c.name=n;pg.appendChild(c);}return c;};
// --- shared item parts (Sakai List demo markup) ---
const image=(parent,w,h)=>{const f=figma.createFrame();f.name='Image';parent.appendChild(f);f.resize(w,h);f.cornerRadius=RTW;f.clipsContent=true;f.fills=[paint(V('surface/100'))];f.layoutMode='HORIZONTAL';f.primaryAxisSizingMode='FIXED';f.counterAxisSizingMode='FIXED';f.primaryAxisAlignItems='CENTER';f.counterAxisAlignItems='CENTER';
 icon(f,'Icon/image','text/muted-color','Placeholder icon');
 const t=bv(TAG,'Severity=success, Rounded=false').createInstance();f.appendChild(t);t.name='Status';t.layoutPositioning='ABSOLUTE';t.x=4;t.y=4;t.isExposedInstance=true;P(t,{Value:'INSTOCK'});return f;}; // tag at left/top 4px (inline style)
const pill=(parent)=>{const o=fr(parent,'Rating','HORIZONTAL');pad(o,3.5,3.5,3.5,3.5);o.cornerRadius=9999;o.fills=[paint(V('surface/100'))]; // p-1, border-radius 30px (pill)
 const i=fr(o,'Inner','HORIZONTAL');pad(i,3.5,7,3.5,7);i.itemSpacing=7;i.counterAxisAlignItems='CENTER';i.cornerRadius=9999;i.fills=[paint(V('surface/0'))];return i;};
const buy=(parent)=>{const b=bv(BTN,'Severity=primary, Variant=solid, Size=base, State=default, Rounded=false').createInstance();parent.appendChild(b);b.name='Buy';b.isExposedInstance=true;P(b,{Label:'Buy Now','Icon left':true,Icon:IC('Icon/shopping-cart').id});return b;};
const heart=(parent)=>{const b=bv(BI,'Severity=primary, Variant=outlined, Size=base, State=default, Rounded=false').createInstance();parent.appendChild(b);b.name='Favorite';b.isExposedInstance=true;P(b,{Icon:IC('Icon/heart').id});return b;};
const texts=async(c,parent,gap)=>{const tb=fr(parent,'Title','VERTICAL');tb.itemSpacing=gap;const ca=await txt(tb,'Accessories','DataView/Meta','text/muted-color','Category');REF(ca,{characters:K['Category']});const nm=await txt(tb,'Bamboo Watch','DataView/Name','dataview/content/color','Name');REF(nm,{characters:K['Name']});tb.layoutSizingHorizontal='FILL';for(const t of [ca,nm]){t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';}return tb;}; // long names wrap
const ratingText=async(i)=>{const r=await txt(i,'5','DataView/Meta','surface/900','Rating value');REF(r,{characters:K['Rating']});icon(i,'Icon/star-fill','yellow/500','Star');};
const ITEM_PROPS=[['Category','TEXT','Accessories'],['Name','TEXT','Bamboo Watch'],['Rating','TEXT','5'],['Price','TEXT','$ 65']];

// ---------- DataView List Item ----------
const LI=set('DataView List Item','Position=first');
LI.description='Sakai List demo list item (#list template of <p-dataview>; Tailwind markup) | Story: components-dataview--playground | Version: 0.1.0 | Status: experimental (#102) | Position other = border-top (border-surface) | Image = placeholder (drop a photo as image fill on Image) | Status tag, Buy and Favorite buttons exposed | Spacing / radius are Tailwind literals (p-6, gap-4, rounded)';
K=props(LI,ITEM_PROPS);
async function liBuild(c,it){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(884,135);c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';pad(c,21,21,21,21);c.itemSpacing=14;c.fills=[];c.clipsContent=false;
 if(it.p==='other'){c.strokes=[paint(V('content/border-color'))];c.strokeAlign='INSIDE';c.strokeTopWeight=1;c.strokeRightWeight=0;c.strokeBottomWeight=0;c.strokeLeftWeight=0;c.strokesIncludedInLayout=true;} // border-t adds 1px, like CSS
 image(c,140,93.33);
 const info=fr(c,'Info','HORIZONTAL');info.layoutSizingHorizontal='FILL';info.primaryAxisAlignItems='SPACE_BETWEEN';info.counterAxisAlignItems='CENTER';info.itemSpacing=21;
 const left=fr(info,'Left','VERTICAL');left.itemSpacing=7;left.layoutSizingHorizontal='FILL';await texts(c,left,7);await ratingText(pill(left));
 const right=fr(info,'Right','VERTICAL');right.itemSpacing=28;right.counterAxisAlignItems='MAX';const pr=await txt(right,'$ 65','DataView/Price','dataview/content/color','Price');REF(pr,{characters:K['Price']});
 const bt=fr(right,'Actions','HORIZONTAL');bt.itemSpacing=7;heart(bt);buy(bt);}
await variants(LI,[['Position=first',{p:'first'}],['Position=other',{p:'other'}]],liBuild);LI.layoutMode='VERTICAL';LI.primaryAxisSizingMode='AUTO';LI.counterAxisSizingMode='AUTO';LI.itemSpacing=24;P4.forEach(s=>LI['padding'+s]=24);

// ---------- DataView Grid Item ----------
const GI=comp('DataView Grid Item');
GI.description='Sakai List demo grid card (#grid template of <p-dataview>; Tailwind markup) | Version: 0.1.0 | Status: experimental (#102) | Card border content/border-color, background content/background | Image box surface/50, image = placeholder | Status tag, Buy (fills) and Favorite exposed | Spacing / radius are Tailwind literals (p-6, p-4, pt-6, mt-6, gap-6, rounded)';
K=props(GI,ITEM_PROPS);
await sync(GI,async c=>{CUR=c;c.layoutMode='VERTICAL';c.counterAxisSizingMode='FIXED';c.primaryAxisSizingMode='FIXED';c.resize(271.33,370);c.primaryAxisSizingMode='AUTO';pad(c,21,21,21,21);c.strokesIncludedInLayout=true;c.itemSpacing=0;c.fills=[paint(V('content/background'))];c.strokes=[paint(V('content/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.cornerRadius=RTW;c.clipsContent=false; // p-6 + 1px border (stroke included in layout)
 const box=fr(c,'Image box','VERTICAL');box.layoutSizingHorizontal='FILL';pad(box,14,14,14,14);box.counterAxisAlignItems='CENTER';box.cornerRadius=RTW;box.fills=[paint(V('surface/50'))];
 const im=image(box,199.33,132.89);im.layoutSizingHorizontal='FILL';
 const body=fr(c,'Body','VERTICAL');body.layoutSizingHorizontal='FILL';body.paddingTop=21;body.itemSpacing=21;
 const tr=fr(body,'Title row','HORIZONTAL');tr.layoutSizingHorizontal='FILL';tr.primaryAxisAlignItems='SPACE_BETWEEN';tr.itemSpacing=7;await texts(c,tr,3.5);await ratingText(pill(tr));
 const bot=fr(body,'Bottom','VERTICAL');bot.layoutSizingHorizontal='FILL';bot.itemSpacing=21;bot.paddingTop=21-21;const pr=await txt(bot,'$ 65','DataView/Price lg','dataview/content/color','Price');REF(pr,{characters:K['Price']});
 const bt=fr(bot,'Actions','HORIZONTAL');bt.layoutSizingHorizontal='FILL';bt.itemSpacing=7;const b=buy(bt);b.layoutSizingHorizontal='FILL';heart(bt);});

// ---------- DataView ----------
const DV=set('DataView','Layout=list');
DV.description='PrimeNG: <p-dataview [value] [layout]> + the Sakai List demo templates | Story: components-dataview--playground | Version: 0.1.0 | Status: experimental (#102) | Header (#header template): layout SelectButton (list / grid icons) | Content: 3 exposed items (DataView List Item / Grid Item; grid = 3 columns, gap 14, p-2) | Show header | Footer / paginator not built';
K=props(DV,[['Show header','BOOLEAN',true]]);
const PR=[['Bamboo Watch','Accessories','5','$ 65','INSTOCK','success'],['Black Watch','Accessories','4','$ 72','INSTOCK','success'],['Blue Band','Fitness','3','$ 79','LOWSTOCK','warn']];
const fill=(inst,p)=>{P(inst,{Name:p[0],Category:p[1],Rating:p[2],Price:p[3]});const t=inst.findOne(x=>x.name==='Status');P(t,{Value:p[4],Severity:p[5]});};
async function dvBuild(c,it){CUR=c;const grid=it.l==='grid';c.layoutMode='VERTICAL';c.counterAxisSizingMode='FIXED';c.primaryAxisSizingMode='FIXED';c.resize(884,400);c.primaryAxisSizingMode='AUTO';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 const h=fr(c,'Header','HORIZONTAL');h.layoutSizingHorizontal='FILL';h.primaryAxisAlignItems='MAX';pad(h,'dataview/header/padding-y','dataview/header/padding-x','dataview/header/padding-y','dataview/header/padding-x');h.fills=[paint(V('dataview/header/background'))];
 h.strokes=[paint(V('dataview/header/border-color'))];h.strokeAlign='INSIDE';for(const s of P4)h.setBoundVariable('stroke'+s+'Weight',V('dataview/header/border-width-'+s.toLowerCase()));REF(h,{visible:K['Show header']});
 const sb=bv(SB,'Size=base, Invalid=false, Disabled=false').createInstance();h.appendChild(sb);sb.name='Layout';sb.isExposedInstance=true;
 const opts=sb.children.filter(x=>x.type==='INSTANCE');opts.forEach((o,i)=>{if(i>1){o.visible=false;return;}P(o,{'Show label':false,'Show icon':true,Icon:IC(i===0?'Icon/bars':'Icon/table').id,State:(i===0)!==grid?'checked':'default'});});
 const ct=fr(c,'Content',grid?'HORIZONTAL':'VERTICAL');ct.layoutSizingHorizontal='FILL';ct.fills=[paint(V('dataview/content/background'))];ct.itemSpacing=grid?14:0;
 PR.forEach((p,i)=>{if(grid){const col=fr(ct,'Col '+(i+1),'VERTICAL');col.layoutSizingHorizontal='FILL';pad(col,7,7,7,7);const g=GI.createInstance();col.appendChild(g);g.layoutSizingHorizontal='FILL';g.name=p[0];g.isExposedInstance=true;fill(g,p);}
  else{const l=bv(LI,'Position='+(i?'other':'first')).createInstance();ct.appendChild(l);l.layoutSizingHorizontal='FILL';l.name=p[0];l.isExposedInstance=true;fill(l,p);}});}
await variants(DV,[['Layout=list',{l:'list'}],['Layout=grid',{l:'grid'}]],dvBuild);DV.layoutMode='VERTICAL';DV.primaryAxisSizingMode='AUTO';DV.counterAxisSizingMode='AUTO';DV.itemSpacing=32;P4.forEach(s=>DV['padding'+s]=24);
out.dv=DV.children.map(c=>c.name+' '+c.width+'x'+c.height);out.li=LI.children.map(c=>c.width+'x'+c.height);out.gi=GI.width+'x'+GI.height;
for(const n of [LI,GI,DV])if(n.y<1)place(n);
return {ids:{list:LI.id,grid:GI.id,dataview:DV.id},...out};
