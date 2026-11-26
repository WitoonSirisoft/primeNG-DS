const D={};
const SZ={small:'sm/',base:'',large:'lg/'};const d='datatable/';
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
   fg:sel?d+'row/selected-color':hov?d+'row/hover-color':d+'row/color',bc:sel?d+'body-cell/selected-border-color':d+'body-cell/border-color',x,y});x+=200;}y+=56;}return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
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
 for(const nw of news){const od=olds.find(o=>!used.has(o)&&o.name===nw.name&&o.type===nw.type);if(od){used.add(od);await syCopy(od,nw,inInst,false);final.push(od);SY.kept++;}else{final.push(nw);SY.added++;}}
 if(inInst)return;
 for(const o of olds)if(!used.has(o)){o.remove();SY.removed++;}
 final.forEach((x,i)=>{if(x.parent!==parent){parent.appendChild(x);applyRefs(x);}if(parent.children.indexOf(x)!==i)parent.insertChild(i,x);});}

async function build(c,it){const tmp=figma.createComponent();figma.currentPage.appendChild(tmp);tmp.name=c.name;REFS.clear();
 try{await build0(tmp,it);await syCopy(c,tmp,false,true);c.x=tmp.x;c.y=tmp.y;}finally{tmp.remove();}}

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
out.slot=SLOT.id;out.sync=SY;return out;