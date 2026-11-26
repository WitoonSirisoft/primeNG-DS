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
out.paginatorButton=pbs.id;out.paginator=ps.id;out.pagSizes=ps.children.map(c=>c.name+' '+c.width+'x'+c.height);out.btn=pbs.children.slice(0,3).map(c=>c.width+'x'+c.height);out.sync=SY;return out;