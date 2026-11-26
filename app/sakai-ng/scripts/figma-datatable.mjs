#!/usr/bin/env node
/**
 * DataTable + Paginator → Figma: batch 2, plan agent/PLAN_DATATABLE.md (DECISIONS #80–#83).
 * Call 16-datatable-1.js (cells):
 *   'DataTable Slot'         placeholder for the Content swap (#81)
 *   'DataTable Header Cell'  Size 3 × Sort (none, unsorted+default/hover, ascending, descending) × Gridlines 2 = 30
 *   'DataTable Body Cell'    Size 3 × Row (default, hover, selected) × Striped 2 × Gridlines 2 = 36
 *   cells: Text (TEXT) + Show text, Show content, Content (swap, default DataTable Slot)
 * Call 16-datatable-2.js (bars + paginator):
 *   'DataTable Header' (caption: Title, Show search) and 'DataTable Footer' (Text): Size 3 × Gridlines 2
 *   'Paginator Button'  Type (first, prev, page, next, last) × State; 'Paginator' Report (no, yes)
 * Call 16-datatable-example.js: Sakai CRUD "Manage Products" replica on 99 Sandbox (#83), rebuilt each run.
 * Build a table as ROWS: a horizontal auto-layout frame per row, cells with fixed widths, cell height Fill (cells stretch to the tallest).
 * Gridlines: cells draw top + left (header cells also bottom); the last column / last row add right / bottom (CSS :last-child) — the example does it.
 * Source CSS: node_modules/@primeuix/styles/dist/{datatable,paginator}/index.mjs. Rebuild = update in place (#68).
 * Usage (from app/sakai-ng): npm run figma:datatable
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const MAX_CHARS = 45000;
const SIZES = ['small', 'base', 'large'];

const SPEC = `const SZ={small:'sm/',base:'',large:'lg/'};const d='datatable/';
function headerCells(){const out=[];let y=24;for(const size of ['small','base','large'])for(const grid of ['no','yes'])for(const title of ['fit','wrap']){let x=24;
 for(const [sort,state] of [['none','default'],['unsorted','default'],['unsorted','hover'],['ascending','default'],['descending','default']]){
  if(title==='wrap'&&sort==='none'){x+=200;continue;} // #87: Sort none always wraps (no icon), so only sortable cells get Title=wrap
  const sorted=sort==='ascending'||sort==='descending',hov=state==='hover';
  out.push({kind:'hcell',n:'Size='+size+', Sort='+sort+', State='+state+', Gridlines='+grid+', Title='+title,size,sort,grid,wrap:title==='wrap',
   px:d+'header-cell/'+SZ[size]+'padding-x',py:d+'header-cell/'+SZ[size]+'padding-y',
   bg:sorted?d+'header-cell/selected-background':hov?d+'header-cell/hover-background':d+'header-cell/background',bgo:sorted?d+'header-cell/selected-background-opacity':null,
   fg:sorted?d+'header-cell/selected-color':hov?d+'header-cell/hover-color':d+'header-cell/color',
   icon:{none:null,unsorted:'Icon/sort-alt',ascending:'Icon/sort-amount-up-alt',descending:'Icon/sort-amount-down'}[sort],
   ic:sorted?d+'header-cell/selected-color':hov?d+'sort-icon/hover-color':d+'sort-icon/color',bc:d+'header-cell/border-color',x,y});x+=200;}y+=title==='wrap'?100:60;}return out;}
function bodyCells(){const out=[];let y=24;for(const size of ['small','base','large'])for(const grid of ['no','yes'])for(const striped of ['no','yes']){let x=24;
 for(const row of ['default','hover','selected']){const sel=row==='selected',hov=row==='hover';
  out.push({kind:'bcell',n:'Size='+size+', Row='+row+', Striped='+striped+', Gridlines='+grid,size,row,grid,
   px:d+'body-cell/'+SZ[size]+'padding-x',py:d+'body-cell/'+SZ[size]+'padding-y',
   bg:sel?d+'row/selected-background':hov?d+'row/hover-background':striped==='yes'?d+'row/striped-background':d+'row/background',bgo:sel?d+'row/selected-background-opacity':null,
   fg:sel?d+'row/selected-color':hov?d+'row/hover-color':d+'row/color',bc:sel?d+'body-cell/selected-border-color':d+'body-cell/border-color',x,y});x+=200;}y+=56;}return out;}`;

const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const lib = new Function(`${SPEC}; return {headerCells, bodyCells};`)();
const H = lib.headerCells(), B = lib.bodyCells();
if (H.length !== 54 || B.length !== 36) throw new Error(`variant counts ${H.length}/${B.length}`);
const need = new Set(['datatable/header-cell/gap', 'datatable/sort-icon/size', 'Body/Base', 'DataTable/Column title', 'Heading/H5', 'text/muted-color', 'content/border-color',
    'paginator/background', 'paginator/border-radius', 'paginator/gap', 'paginator/padding-x', 'paginator/padding-y', 'paginator/current-page-report/color', 'paginator/nav-button/background', 'paginator/nav-button/color',
    'paginator/nav-button/hover-background', 'paginator/nav-button/hover-color', 'paginator/nav-button/selected-background', 'paginator/nav-button/selected-background-opacity', 'paginator/nav-button/selected-color',
    'paginator/nav-button/width', 'paginator/nav-button/height', 'disabled-opacity', 'icon-size']);
for (const it of [...H, ...B]) for (const k of ['px', 'py', 'bg', 'bgo', 'fg', 'ic', 'bc']) if (it[k]) need.add(it[k]);
for (const s of SIZES) for (const p of ['header', 'footer']) for (const a of ['padding-x', 'padding-y']) need.add(`datatable/${p}/${s === 'base' ? '' : (s === 'small' ? 'sm/' : 'lg/')}${a}`);
for (const p of ['header', 'footer']) for (const k of ['background', 'color', 'border-color', 'border-width-top', 'border-width-right', 'border-width-bottom', 'border-width-left']) need.add(`datatable/${p}/${k}`);
const missing = [...need].filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);

const COMMON = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Body/Base','DataTable/Column title','Heading/H5']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const ICN={};const IC=n=>{if(!ICN[n]){ICN[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!ICN[n])throw new Error('Missing icon '+n);}return ICN[n];};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
async function ensureSet(name,first){let s=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===name);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);const y=below();s=figma.combineAsVariants([c],pg);s.name=name;s.x=0;s.y=y;}return s;}
const props=(s,list)=>{const K={};for(const k in s.componentPropertyDefinitions)K[k.split('#')[0]]=k;for(const [n,t,dv] of list)if(!K[n])K[n]=s.addComponentProperty(n,t,dv);return K;};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name||'Text';t.fills=[paint(V(col))];return t;};
const icon=(name,size,col)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V(size));i.setBoundVariable('height',V(size));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const sides=(n,w)=>{const [t,r,b,l]=w;n.strokeTopWeight=t;n.strokeRightWeight=r;n.strokeBottomWeight=b;n.strokeLeftWeight=l;};
function bgLayer(c,v,o){const r=figma.createRectangle();r.name='Background';c.appendChild(r);r.layoutPositioning='ABSOLUTE';r.constraints={horizontal:'STRETCH',vertical:'STRETCH'};r.fills=[paint(V(v))];if(o)r.setBoundVariable('opacity',V(o));return r;}
function fitAbs(c){for(const n of c.children)if(n.layoutPositioning==='ABSOLUTE'&&n.name==='Background'){n.resize(c.width,c.height);n.x=0;n.y=0;c.insertChild(0,n);}}
${SYNC}${WRAP}`;

const CELLS = `${COMMON}
const out={};let K={};
// placeholder for the Content swap (#81)
let SLOT=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='DataTable Slot');if(!SLOT){SLOT=figma.createComponent();SLOT.name='DataTable Slot';pg.appendChild(SLOT);SLOT.x=0;SLOT.y=below();}
SLOT.description='Placeholder for DataTable cell content (#81). In a cell: turn on Show content, then swap Content to any component (Checkbox, Tag, Button, image…).';
await build(SLOT,{kind:'slot',x:SLOT.x,y:SLOT.y});
async function build0(c,it){CUR=c;
 if(it.kind==='slot'){c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.paddingLeft=c.paddingRight=8;c.paddingTop=c.paddingBottom=2;c.fills=[]; /* hug (#84): a fixed slot forces its size on swapped content */
  c.strokes=[paint(V('content/border-color'))];c.strokeWeight=1;c.dashPattern=[4,3];c.strokeAlign='INSIDE';await txt(c,'Content','Body/Base','text/muted-color','Label');c.x=it.x;c.y=it.y;return;}
 const head=it.kind==='hcell';
 if(head&&it.wrap){c.layoutMode='VERTICAL';c.counterAxisAlignItems='MIN';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.resize(176,c.height);} // #87: long title wraps, sort icon on the next line (as Sakai)
 else{c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(176,c.height);}c.clipsContent=false;c.fills=[];
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(it.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(it.px));
 if(head)c.setBoundVariable('itemSpacing',V('datatable/header-cell/gap'));
 c.strokes=[paint(V(it.bc))];c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true; // CSS border adds to the cell (border-collapse: separate)
 sides(c,it.grid==='yes'?(head?[1,0,1,1]:[1,0,0,1]):[0,0,1,0]);
 bgLayer(c,it.bg,it.bgo);
 const t=await txt(c,head?'Title':'Text',head?'DataTable/Column title':'Body/Base',it.fg,'Text');t.textAutoResize='WIDTH_AND_HEIGHT';
 if(!head||it.sort==='none'||it.wrap){t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';} // body text, unsortable and Title=wrap titles wrap
 REF(t,{characters:K['Text'],visible:K['Show text']});
 if(head&&it.icon){const i=icon(it.icon,'datatable/sort-icon/size',it.ic);i.name='Sort icon';c.appendChild(i);}
 const s=SLOT.createInstance();s.name='Content';c.appendChild(s);s.visible=false;REF(s,{visible:K['Show content'],mainComponent:K['Content']});
 fitAbs(c);c.x=it.x;c.y=it.y;}
const PROPS=[['Text','TEXT','Text'],['Show text','BOOLEAN',true],['Show content','BOOLEAN',false],['Content','INSTANCE_SWAP',SLOT.id]];
for(const [name,items,desc] of [['DataTable Header Cell',headerCells(),'PrimeNG: <p-table> header cell (th, pSortableColumn + p-sortIcon) | Story: components-datatable--playground | Version: 0.1.0 | Status: experimental | Title: fit = icon right after the title; wrap = long title wraps and the sort icon goes to the next line (#87). Sort none always wraps | Sort none = not sortable; unsorted hover only (sorted columns do not change on hover) | Select-all: Show text off, Show content on, swap Content to Checkbox | Gridlines: top + left + bottom; add a right border on the last column'],
 ['DataTable Body Cell',bodyCells(),'PrimeNG: <p-table> body cell (td) | Story: components-datatable--playground | Version: 0.1.0 | Status: experimental | Row = row state for the whole row (set every cell of a row the same) | Striped = odd row with stripedRows | Content slot (#81): Show content + swap Content (Checkbox, Tag, Buttons, image) | Selected rows also colour the bottom border of the row above (CSS) — not automatic | Gridlines: top + left; add right on the last column, bottom on the last row']]){
 const set=await ensureSet(name,items[0].n);set.description=desc;K=props(set,PROPS.map(p=>p[0]==='Text'?['Text','TEXT',name.includes('Header')?'Title':'Text']:p));
 if(name==='DataTable Header Cell')for(const c of set.children)if(!c.name.includes('Title='))c.name+=', Title=fit'; // #87: keep existing nodes (instances stay linked)
 const by={};for(const c of set.children)by[c.name]=c;let created=0;
 for(const it of items){let c=by[it.n];if(!c){c=figma.createComponent();c.name=it.n;set.appendChild(c);created++;}await build(c,it);}
 let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
 const sizes={};for(const c of set.children){const k=c.name.split(',')[0]+' '+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
 out[name]={set:set.id,created,inSet:set.children.length,heights:sizes};}
out.slot=SLOT.id;out.sync=SY;return out;`;

const BARS = `${COMMON}
const out={};let K={};
async function build0(c,it){CUR=c;
 if(it.kind==='bar'){const p='datatable/'+it.part+'/',sz={small:'sm/',base:'',large:'lg/'}[it.size];
  c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.primaryAxisAlignItems='SPACE_BETWEEN';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(600,c.height);c.clipsContent=false;
  c.fills=[paint(V(p+'background'))];c.strokes=[paint(V(p+'border-color'))];c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;
  for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(p+sz+'padding-y'));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(p+sz+'padding-x'));
  if(it.grid==='yes')sides(c,it.part==='header'?[1,1,0,1]:[0,1,1,1]); // .p-datatable-gridlines .p-datatable-header / -footer
  else for(const [sd,k] of [['Top','strokeTopWeight'],['Right','strokeRightWeight'],['Bottom','strokeBottomWeight'],['Left','strokeLeftWeight']])c.setBoundVariable(k,V(p+'border-width-'+sd.toLowerCase()));
  if(it.part==='header'){const t=await txt(c,'Manage Products','Heading/H5',p+'color','Title');t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';REF(t,{characters:K['Title']}); /* CSS: h5 wraps; search keeps its width */
   const f=IFV.createInstance();f.name='Search';c.appendChild(f);const inn=f.findOne(n=>n.type==='INSTANCE'&&n.name==='InputText');
   const P={};for(const k in inn.componentProperties)P[k.split('#')[0]]=k;inn.setProperties({[P['Placeholder']]:'Search...'});REF(f,{visible:K['Show search']});}
  else{const t=await txt(c,'Footer','Body/Base',p+'color','Text');t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';REF(t,{characters:K['Text']});}
  c.x=it.x;c.y=it.y;return;}
 if(it.kind==='pbtn'){const n='paginator/nav-button/';
  c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.resize(35,35);c.clipsContent=true;
  c.setBoundVariable('minWidth',V(n+'width'));c.setBoundVariable('height',V(n+'height'));rad(c,V(n+'height')); // Aura radius 50%: circle
  const bgv=it.state==='hover'?n+'hover-background':it.state==='selected'?n+'selected-background':n+'background';c.fills=[];bgLayer(c,bgv,it.state==='selected'?n+'selected-background-opacity':null);
  const fg=it.state==='hover'?n+'hover-color':it.state==='selected'?n+'selected-color':n+'color';
  if(it.type==='page'){const t=await txt(c,'1','Body/Base',fg,'Label');REF(t,{characters:K['Label']});}
  else{const i=icon({first:'Icon/angle-double-left',prev:'Icon/angle-left',next:'Icon/angle-right',last:'Icon/angle-double-right'}[it.type],'icon-size',fg);i.name='Icon';c.appendChild(i);}
  if(it.state==='disabled')c.setBoundVariable('opacity',V('disabled-opacity'));else{c.setBoundVariable('opacity',null);c.opacity=1;}
  fitAbs(c);const b=c.findChild(x=>x.name==='Background');if(b)rad(b,V(n+'height'));c.x=it.x;c.y=it.y;return;}
 // paginator
 const p='paginator/';c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(712,c.height);
 c.fills=[paint(V(p+'background'))];rad(c,V(p+'border-radius'));c.setBoundVariable('itemSpacing',V(p+'gap'));
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(p+'padding-y'));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(p+'padding-x'));
 const rep=it.report==='yes',cur=rep?3:1;
 if(rep)await txt(c,'Showing 21 to 30 of 120 products','Body/Base',p+'current-page-report/color','Report');
 const nav=(type,st)=>{const b=PB[type+'|'+st].createInstance();b.name=type[0].toUpperCase()+type.slice(1);c.appendChild(b);return b;};
 nav('first',cur===1?'disabled':'default');nav('prev',cur===1?'disabled':'default');
 const pages=figma.createFrame();pages.name='Pages';c.appendChild(pages);pages.layoutMode='HORIZONTAL';pages.fills=[];pages.primaryAxisSizingMode='AUTO';pages.counterAxisSizingMode='AUTO';pages.counterAxisAlignItems='CENTER';pages.setBoundVariable('itemSpacing',V(p+'gap'));
 for(let i=1;i<=5;i++){const b=PB['page|'+(i===cur?'selected':'default')].createInstance();b.name='Page '+i;pages.appendChild(b);const P={};for(const k in b.componentProperties)P[k.split('#')[0]]=k;b.setProperties({[P['Label']]:String(i)});}
 nav('next','default');nav('last','default');
 if(rep){const s=SEL.createInstance();s.name='Rows per page';c.appendChild(s);const P={};for(const k in s.componentProperties)P[k.split('#')[0]]=k;s.setProperties({[P['Value']]:'10'});
  {const st=s.findOne(x=>x.type==='TEXT'&&x.characters==='10');const m=figma.createText();m.fontName=st.fontName;m.fontSize=st.fontSize;m.characters='10';const lbl=st.parent,dd=s.findOne(x=>x.name==='Dropdown');
   s.resize(Math.ceil((m.width+lbl.paddingLeft+lbl.paddingRight+dd.width+s.strokeLeftWeight+s.strokeRightWeight)*100)/100,s.height);m.remove();} /* CSS: select hugs label + dropdown (~73.6) */}
 c.x=it.x;c.y=it.y;}
const IF=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='IconField');const IFV=IF.children.find(c=>c.name==='Icon position=left, Size=base');
const SS=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Select');const SEL=SS.children.find(c=>c.name==='Size=base, Variant=outlined, State=default, Invalid=false, Content=value');
for(const [name,part,desc,pp] of [['DataTable Header','header','PrimeNG: <p-table> caption (#caption template, .p-datatable-header) | Version: 0.1.0 | Status: experimental | Title + search (IconField) as in the Sakai CRUD page | Stretch to the table width',[['Title','TEXT','Manage Products'],['Show search','BOOLEAN',true]]],
 ['DataTable Footer','footer','PrimeNG: <p-table> footer (#footer template, .p-datatable-footer) | Version: 0.1.0 | Status: experimental | Stretch to the table width',[['Text','TEXT','Footer']]]]){
 const items=[];let y=24;for(const size of ['small','base','large'])for(const grid of ['no','yes']){items.push({kind:'bar',part,size,grid,n:'Size='+size+', Gridlines='+grid,x:24,y});y+=90;}
 const set=await ensureSet(name,items[0].n);set.description=desc;K=props(set,pp);const by={};for(const c of set.children)by[c.name]=c;
 for(const it of items){let c=by[it.n];if(!c){c=figma.createComponent();c.name=it.n;set.appendChild(c);}await build(c,it);}
 let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
 out[name]={set:set.id,heights:set.children.map(c=>c.name.split(',')[0].split('=')[1]+'/'+c.name.split('=')[2]+' '+c.height.toFixed(2))};}
// Paginator Button
const PBI=[];let x=24;for(const [type,states] of [['first',['default','hover','disabled']],['prev',['default','hover','disabled']],['page',['default','hover','selected']],['next',['default','hover','disabled']],['last',['default','hover','disabled']]]){let y=24;for(const st of states){PBI.push({kind:'pbtn',type,state:st,n:'Type='+type+', State='+st,x,y});y+=56;}x+=60;}
const pbs=await ensureSet('Paginator Button',PBI[0].n);pbs.description='PrimeNG: <p-paginator> nav / page button | Version: 0.1.0 | Status: experimental | Label = page number (Type page)';K=props(pbs,[['Label','TEXT','1']]);
const pby={};for(const c of pbs.children)pby[c.name]=c;for(const it of PBI){let c=pby[it.n];if(!c){c=figma.createComponent();c.name=it.n;pbs.appendChild(c);}await build(c,it);}
let mx=0,my=0;for(const c of pbs.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}pbs.resizeWithoutConstraints(mx+24,my+24);
const PB={};for(const c of pbs.children){const [t,s]=c.name.split(', ').map(v=>v.split('=')[1]);PB[t+'|'+s]=c;}
// Paginator
const ps=await ensureSet('Paginator','Report=no');ps.description='PrimeNG: <p-paginator> | Story: components-paginator--playground | Version: 0.1.0 | Status: experimental | Report=no: page 1 (first/prev disabled) | Report=yes: showCurrentPageReport + rowsPerPageOptions, page 3 | Swap page button State / Label for other pages';K={};
const pa={};for(const c of ps.children)pa[c.name]=c;let py=24;
for(const r of ['no','yes']){const n='Report='+r;let c=pa[n];if(!c){c=figma.createComponent();c.name=n;ps.appendChild(c);}await build(c,{kind:'pag',report:r,x:24,y:py});py+=80;}
mx=0;my=0;for(const c of ps.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}ps.resizeWithoutConstraints(mx+24,my+24);
out.paginatorButton=pbs.id;out.paginator=ps.id;out.pagSizes=ps.children.map(c=>c.name+' '+c.width+'x'+c.height);out.btn=pbs.children.slice(0,3).map(c=>c.width+'x'+c.height);out.sync=SY;return out;`;

const head = `const D={};\n${SPEC}\n`;
const files = [];
for (const [f, code] of [['16-datatable-1.js', head + CELLS], ['16-datatable-2.js', head + BARS]]) {
    if (code.length > MAX_CHARS) throw new Error(`${f} is ${code.length} chars`);
    await writeFile(join(OUT, 'calls', f), code); files.push(`${f} (${code.length})`);
}
console.log(`DataTable: header cells ${H.length}, body cells ${B.length} validated against plan.json. Calls: ${files.join(', ')}`);
