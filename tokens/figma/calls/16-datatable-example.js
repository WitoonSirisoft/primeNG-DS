// 16-datatable-example.js — Sakai CRUD "Manage Products" table on 99 Sandbox (DECISIONS #83).
// Data: first 5 products of src/app/pages/service/product.service.ts (same as datatable.stories.ts).
// Column widths: CSS px measured from the base capture. Re-running replaces the example frame.
const PRODUCTS=[['f230fh0g3','Bamboo Watch',65,'Accessories','INSTOCK',5],['nvklal433','Black Watch',72,'Accessories','INSTOCK',4],['zz21cz3c1','Blue Band',79,'Fitness','LOWSTOCK',3],['244wgerg2','Blue T-Shirt',29,'Clothing','INSTOCK',5],['h456wer53','Bracelet',15,'Accessories','INSTOCK',4]];
const COLS=[['',41,'none','check'],['Code',104,'none'],['Name',156,'unsorted'],['Image',85.5,'none','image'],['Price',104,'unsorted'],['Category',130.5,'unsorted'],['Reviews',129.5,'unsorted','rating'],['Status',131,'unsorted','tag'],['',104.5,'none','actions']];
const SEV={INSTOCK:'success',LOWSTOCK:'warn',OUTOFSTOCK:'danger'};
const cp=figma.root.children.find(p=>p.name==='02 Components');const sb=figma.root.children.find(p=>p.name==='99 Sandbox');const fp=figma.root.children.find(p=>p.name==='01 Foundations');
await cp.loadAsync();await fp.loadAsync();await figma.setCurrentPageAsync(sb);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};const V1=(...ns)=>{for(const n of ns)if(VB[n])return VB[n];throw new Error('Missing all of '+ns.join(', '));};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;await figma.loadFontAsync(TS['Body/Base'].fontName);
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR||sb).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const SET=n=>{const s=cp.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing set '+n);return s;};
const VAR=(set,want)=>{const c=SET(set).children.find(c=>Object.entries(want).every(([k,v])=>c.variantProperties[k]===v));if(!c)throw new Error(set+': no variant '+JSON.stringify(want));return c;};
const ICON=n=>{const c=fp.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const P=(inst,vals)=>{const K={};for(const k in inst.componentProperties)K[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!K[k])throw new Error(inst.name+': no prop '+k);o[K[k]]=v;}inst.setProperties(o);};
// remove old example + helpers (re-run safe)
for(const n of [...sb.children])if(n.name==='DataTable — Example (Sakai CRUD)'||n.name==='DataTable — Example helpers')n.remove();
let y0=40;for(const n of sb.children)y0=Math.max(y0,n.y+n.height+200);
// ---- helpers (local example components; not part of the library)
const H=figma.createFrame();H.name='DataTable — Example helpers';sb.appendChild(H);H.x=1100;H.y=y0;H.layoutMode='VERTICAL';H.itemSpacing=24;H.paddingTop=H.paddingBottom=H.paddingLeft=H.paddingRight=24;H.primaryAxisSizingMode='AUTO';H.counterAxisSizingMode='AUTO';H.fills=[];CUR=H;
// #84: slot swap targets must HUG (a fixed component takes the slot's size) → hug wrapper + fixed Photo frame
const img=figma.createComponent();img.name='Example / Product image';H.appendChild(img);img.layoutMode='HORIZONTAL';img.primaryAxisSizingMode='AUTO';img.counterAxisSizingMode='AUTO';img.fills=[];
const ph=figma.createFrame();ph.name='Photo';img.appendChild(ph);ph.layoutMode='HORIZONTAL';ph.primaryAxisAlignItems='CENTER';ph.counterAxisAlignItems='CENTER';ph.primaryAxisSizingMode='FIXED';ph.counterAxisSizingMode='FIXED';ph.resize(64,42.67);
ph.fills=[paint(V1('content/hover-background','surface/100'))];for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])ph.setBoundVariable(k,V1('content/border-radius','border-radius-md'));
img.description='Example only: placeholder for the product photo (64px wide, class "rounded"). Paste an image fill on Photo to show a real photo.';
{const t=figma.createText();ph.appendChild(t);await t.setTextStyleIdAsync(TS['Body/Base'].id);t.characters='IMG';t.fills=[paint(V('text/muted-color'))];}
const STAR=ICON('Icon/star-fill'),STAR0=ICON('Icon/star');
const rat=figma.createComponent();rat.name='Example / Rating';H.appendChild(rat);rat.layoutMode='HORIZONTAL';rat.itemSpacing=7;rat.primaryAxisSizingMode='AUTO';rat.counterAxisSizingMode='AUTO';rat.fills=[];rat.counterAxisAlignItems='CENTER';
rat.description='Example only: read-only p-rating stand-in (no Rating component yet). Swap a star to Icon/star for an empty star. Colours: primary/color (on), text/muted-color (off) — check Aura rating tokens when Rating is built.';
for(let i=1;i<=5;i++){const s=STAR.createInstance();s.name='Star '+i;rat.appendChild(s);s.setBoundVariable('width',V('icon-size'));s.setBoundVariable('height',V('icon-size'));const sh=s.findOne(x=>x.name==='Shape');sh.fills=[paint(V('primary/color'))];}
const BTN=VAR('Button Icon',{Severity:'primary',Variant:'outlined',Size:'base',State:'default',Rounded:'true'}),BTND=VAR('Button Icon',{Severity:'danger',Variant:'outlined',Size:'base',State:'default',Rounded:'true'}); // #85
const act=figma.createComponent();act.name='Example / Row actions';H.appendChild(act);act.layoutMode='HORIZONTAL';act.itemSpacing=7;act.primaryAxisSizingMode='AUTO';act.counterAxisSizingMode='AUTO';act.fills=[];act.counterAxisAlignItems='CENTER';
act.description='Example only: edit + delete buttons (rounded, outlined, icon only) as in the Sakai CRUD page.';
for(const [b,ic,n] of [[BTN,'Icon/pencil','Edit'],[BTND,'Icon/trash','Delete']]){const i=b.createInstance();i.name=n;act.appendChild(i);P(i,{'Icon':ICON(ic).id,'Raised':false});}
// ---- table
const HC=SET('DataTable Header Cell'),BC=SET('DataTable Body Cell');
const hcell=sort=>VAR('DataTable Header Cell',{Size:'base',Sort:sort,State:'default',Gridlines:'no'}).createInstance();
const bcell=()=>VAR('DataTable Body Cell',{Size:'base',Row:'default',Striped:'no',Gridlines:'no'}).createInstance();
const CHK=VAR('Checkbox',{Size:'base',Variant:'outlined',State:'default',Invalid:'false',Checked:'no'});
const T=figma.createFrame();T.name='DataTable — Example (Sakai CRUD)';sb.appendChild(T);T.x=0;T.y=y0;T.layoutMode='VERTICAL';T.primaryAxisSizingMode='AUTO';T.counterAxisSizingMode='AUTO';T.fills=[];T.clipsContent=false;CUR=T;
const W=COLS.reduce((a,c)=>a+c[1],0);
const hb=VAR('DataTable Header',{Size:'base',Gridlines:'no'}).createInstance();hb.name='Caption';T.appendChild(hb);hb.layoutSizingHorizontal='FILL';
const row=n=>{const r=figma.createFrame();r.name=n;T.appendChild(r);r.layoutMode='HORIZONTAL';r.primaryAxisSizingMode='AUTO';r.counterAxisSizingMode='AUTO';r.fills=[];r.clipsContent=false;return r;};
const fillV=c=>{try{c.layoutSizingVertical='FILL';}catch(e){}};
const hr=row('Header row');
for(const [title,w,sort,kind] of COLS){const c=hcell(sort);hr.appendChild(c);c.name='th '+(title||kind);c.resize(w,c.height);
 if(kind==='check'){P(c,{'Show text':false,'Show content':true,'Content':CHK.id});}
 else if(!title)P(c,{'Show text':false});else P(c,{Text:title});if(kind==='check')c.layoutSizingVertical='HUG';else fillV(c);}
for(const [code,name,price,cat,st,rt] of PRODUCTS){const r=row('Row '+code);
 const vals=['',code,name,'','$'+price.toFixed(2),cat,'',st,''];
 COLS.forEach(([title,w,sort,kind],i)=>{const c=bcell();r.appendChild(c);c.name='td '+(title||kind);c.resize(w,c.height);
  const sw={check:CHK,image:img,rating:rat,tag:VAR('Tag',{Severity:SEV[st],Rounded:'false'}),actions:act}[kind];
  if(sw){P(c,{'Show text':false,'Show content':true,'Content':sw.id});const inn=c.findOne(x=>x.type==='INSTANCE'&&x.name==='Content');
   if(kind==='tag')P(inn,{Value:st});
   if(kind==='rating')for(let s=rt+1;s<=5;s++){const star=inn.findOne(x=>x.name==='Star '+s);star.swapComponent(STAR0);star.findOne(x=>x.name==='Shape').fills=[paint(V('text/muted-color'))];}}
  else P(c,{Text:vals[i]});if(kind==='image')c.layoutSizingVertical='HUG';else fillV(c);});} // tallest cell hugs, the rest fill the row
const pgi=VAR('Paginator',{Report:'no'}).createInstance();pgi.name='Paginator';T.appendChild(pgi);pgi.layoutSizingHorizontal='FILL';
for(let i=2;i<=5;i++){const b=pgi.findOne(x=>x.name==='Page '+i);if(b)b.visible=false;} // 5 products, 5 rows per page → 1 page
for(const n of ['Next','Last']){const b=pgi.findOne(x=>x.name===n);if(b)b.swapComponent(VAR('Paginator Button',{Type:n.toLowerCase(),State:'disabled'}));}
// report
const rows=T.children.filter(c=>c.name.startsWith('Row ')).map(r=>r.name+' '+r.height.toFixed(2));
return {table:T.id,helpers:H.id,size:T.width+'x'+T.height,expectedWidth:W,caption:hb.height,header:hr.height,rows,paginator:pgi.height};
