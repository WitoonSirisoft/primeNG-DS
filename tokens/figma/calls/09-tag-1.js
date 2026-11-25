const D={"A":{"severity":["none","secondary","success","info","warn","danger","contrast"],"rounded":["false","true"]},"setName":"Tag","desc":"PrimeNG: <p-tag> | Story: components-tag--playground | Version: 0.1.0 | Status: experimental | Severity none = severity omitted (primary look) | Icon: turn on Show icon, swap Icon (any Icon/*) | Not interactive: no states","props":["Value","Show icon","Icon"],"F":{"px":"tag/padding-x","py":"tag/padding-y","gap":"tag/gap","isz":"tag/icon/size","ts":"Tag/Label","icon":"Icon/check"}};
function variants(A,has){
const out=[];const ix=(a,v)=>A[a].indexOf(v);
for(const sev of A.severity)for(const rounded of A.rounded){
 const t=sev==='none'?'primary':sev,o='tag/'+t+'/background-opacity'; // none = severity omitted → .p-tag defaults use primary tokens
 out.push({n:'Severity='+sev+', Rounded='+rounded,bg:'tag/'+t+'/background',bo:has(o)?o:null,fg:'tag/'+t+'/color',
  rd:rounded==='true'?'tag/rounded-border-radius':'tag/border-radius',x:24+ix('severity',sev)*80,y:24+ix('rounded',rounded)*48});}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const IT=variants(D.A,n=>!!VB[n]);
const need=new Set([D.F.px,D.F.py,D.F.gap,D.F.isz]);for(const it of IT)for(const n of [it.bg,it.bo,it.fg,it.rd])if(n)need.add(n);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));const V=n=>VB[n];
const TS=(await figma.getLocalTextStylesAsync()).find(s=>s.name===D.F.ts);if(!TS)throw new Error('Missing text style '+D.F.ts);await figma.loadFontAsync(TS.fontName);
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC=ip.findOne(x=>x.type==='COMPONENT'&&x.name===D.F.icon);if(!IC)throw new Error('Missing icon '+D.F.icon);
let CUR=null; // bound paints store the colour resolved for the node being built
const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:[],rebuilt:[]};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200); // measured before creating, below everything on the page
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.created.push(c.id);ids.newSet=set.id;}
set.description=D.desc;
const want={'Value':['TEXT','Tag'],'Show icon':['BOOLEAN',false],'Icon':['INSTANCE_SWAP',IC.id]};
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const n of D.props)if(!K[n])K[n]=set.addComponentProperty(n,want[n][0],want[n][1]);

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
async function build0(c,it){CUR=c; // update in place (#68): build() in lib/figma-sync.mjs keeps old layers and syncs

 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.clipsContent=false;c.fills=[];c.strokes=[];
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(D.F.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(D.F.px));
 c.setBoundVariable('itemSpacing',V(D.F.gap));rad(c,V(it.rd));
 const i=IC.createInstance();i.name='Icon';c.appendChild(i);i.setBoundVariable('width',V(D.F.isz));i.setBoundVariable('height',V(D.F.isz));
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(IC.name+': no Shape layer, icon colour cannot be set');sh.fills=[paint(V(it.fg))];
 const t=figma.createText();c.appendChild(t);await t.setTextStyleIdAsync(TS.id);t.characters='Tag';t.autoRename=false;t.name='Label';t.fills=[paint(V(it.fg))];
 i.visible=false; // property default before the absolute layer is sized
 const bg=figma.createRectangle();bg.name='Background';c.appendChild(bg);bg.layoutPositioning='ABSOLUTE';bg.resize(c.width,c.height);bg.x=0;bg.y=0;bg.constraints={horizontal:'STRETCH',vertical:'STRETCH'};c.insertChild(0,bg);
 rad(bg,V(it.rd));bg.fills=[paint(V(it.bg))];if(it.bo)bg.setBoundVariable('opacity',V(it.bo));else{bg.setBoundVariable('opacity',null);bg.opacity=1;} // Dark: color-mix 16% → layer opacity
 REF(t,{characters:K['Value']});REF(i,{visible:K['Show icon'],mainComponent:K['Icon']});
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c){ids.rebuilt.push(c.id);}else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created.push(c.id);}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {sync:SY,set:set.id,of:IT.length,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length};