const D={"A":{"severity":["primary","secondary","success","info","warn","danger","help","contrast"],"variant":["solid","outlined","text"],"size":["small","base","large"],"state":["default","hover","focus","active","disabled","loading"],"rounded":["false","true"]},"on":["severity","variant","size","state","rounded"],"set":"link","setName":"Button Link","desc":" | Code: [link]=\"true\" (severity, outlined, text are ignored by PrimeNG) | Known gap: code underlines the label on hover; not shown in Figma (#48)","props":["Label","Show label","Icon left","Icon right","Icon"],"F":{"gap":"button/gap","rw":"button/focus-ring/width","dop":"disabled-opacity","bsz":"button/badge-size","shadow":"button/raised-shadow","icon":"Icon/check","spinner":"Icon/primeng-spinner"},"from":0,"to":18};
function variants(A,on,has,SET){
const vals=a=>SET!=='main'||on.includes(a)?A[a]:[A[a][a==='size'?1:0]];const ix=(a,v)=>vals(a).indexOf(v);
const SZ={small:{px:'button/sm/padding-x',py:'button/sm/padding-y',ts:'Button/Label sm',ih:'button/sm/font-size',mh:'button/sm/line-height'},
base:{px:'button/padding-x',py:'button/padding-y',ts:'Button/Label base',ih:'typography/base/font-size',mh:'button/line-height'},
large:{px:'button/lg/padding-x',py:'button/lg/padding-y',ts:'Button/Label lg',ih:'button/lg/font-size',mh:'button/lg/line-height'}};
const RD={'false':['button/border-radius','button/focus-ring-radius'],'true':['button/rounded-border-radius','button/rounded-focus-ring-radius']};
const CW=130,CH=64,PAD=24,out=[];
const base=(size,state,rounded)=>{const k=state==='hover'||state==='active'?state:'default';return {k,sz:SZ[size],rd:RD[rounded],f:state==='focus',d:state==='disabled'||state==='loading',l:state==='loading',
 dir:'H',s1:'Icon left',s2:'Icon right',v1:state==='loading',v2:false,so:0,sb:'button/primary/background',rg:'button/primary/focus-ring/color',bo:null,ul:false,badge:false};};
const put=(it,row,col)=>{it.x=PAD+col*CW;it.y=PAD+row*CH;out.push(it);};
const solid=(it,sev)=>{const p=x=>it.k==='default'?x:it.k+'-'+x;it.bg='button/'+sev+'/'+p('background');it.st='button/'+sev+'/'+p('border-color');it.fg='button/'+sev+'/'+p('color');it.so=1;it.sb='button/'+sev+'/background';it.rg='button/'+sev+'/focus-ring/color';};
if(SET==='main'){
 for(const sev of vals('severity'))for(const variant of vals('variant'))for(const rounded of vals('rounded'))for(const size of vals('size'))for(const state of vals('state')){
  const it=base(size,state,rounded);it.n='Severity='+sev+', Variant='+variant+', Size='+size+', State='+state+', Rounded='+rounded;it.badge=true;
  if(variant==='solid')solid(it,sev);
  else{const pre='button/'+variant+'/'+sev,o=pre+'/'+it.k+'-background-opacity';it.bg=it.k==='default'?null:pre+'/'+it.k+'-background';
   it.bo=it.k!=='default'&&has(o)?o:null;it.st=variant==='outlined'?pre+'/border-color':null;it.fg=pre+'/color';it.sb='button/'+sev+'/background';it.rg='button/'+sev+'/focus-ring/color';}
  put(it,(ix('severity',sev)*vals('variant').length+ix('variant',variant))*vals('rounded').length+ix('rounded',rounded),ix('size',size)*vals('state').length+ix('state',state));}
}else if(SET==='link'){
 for(const size of A.size)for(const state of A.state){const it=base(size,state,'false');it.n='Size='+size+', State='+state;
  it.bg=null;it.st=null;it.fg='button/link/'+(it.k==='default'?'color':it.k+'-color'); // CSS also underlines on hover: not built (#48)
  put(it,0,ix('size',size)*A.state.length+ix('state',state));}
}else if(SET==='plain'){
 for(const variant of ['outlined','text'])for(const size of A.size)for(const state of A.state){const it=base(size,state,'false');it.n='Variant='+variant+', Size='+size+', State='+state;
  const pre='button/'+variant+'/plain';it.bg=it.k==='default'?null:pre+'/'+it.k+'-background';it.st=variant==='outlined'?pre+'/border-color':null;it.fg=pre+'/color';
  put(it,variant==='outlined'?0:1,ix('size',size)*A.state.length+ix('state',state));}
}else if(SET==='vertical'){
 for(const pos of ['top','bottom'])for(const size of A.size)for(const state of A.state){const it=base(size,state,'false');it.n='Icon position='+pos+', Size='+size+', State='+state;
  solid(it,'primary');it.dir='V';it.s1='Icon top';it.s2='Icon bottom';it.v1=pos==='top';it.v2=pos==='bottom';it.spin=state==='loading'?(pos==='top'?1:2):0;
  put(it,pos==='top'?0:1,ix('size',size)*A.state.length+ix('state',state));}
}
for(const it of out){if(it.spin===undefined)it.spin=it.l?1:0;}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const ALL=variants(D.A,D.on,n=>!!VB[n],D.set);const IT=ALL.slice(D.from,D.to);
const need=new Set([D.F.gap,D.F.rw,D.F.dop,D.F.bsz]);for(const it of IT)for(const n of [it.sz.px,it.sz.py,it.sz.ih,it.sz.mh,...it.rd,it.rg,it.sb,it.bg,it.bo,it.st,it.fg])if(n)need.add(n);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));
const V=n=>VB[n];const HAS=p=>D.props.includes(p);
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;
for(const n of new Set(IT.map(i=>i.sz.ts))){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(HAS('Raised')&&!ES[D.F.shadow])throw new Error('Missing effect style '+D.F.shadow);
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC={};for(const n of [D.F.icon,D.F.spinner]){IC[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!IC[n])throw new Error('Missing icon '+n);}
let BADGE=null;if(HAS('Badge')){const bs=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Badge');BADGE=bs&&bs.children.find(c=>c.name==='Severity=secondary, Circle=true');if(!BADGE)throw new Error('Build the Badge set first (--set=badge)');}
const CLEAR={type:'SOLID',color:{r:0,g:0,b:0},opacity:0}; // literal 'transparent' (CSS keyword), the only allowed literal (#42)
let CUR=null; // bound paints store the colour resolved for the node being built (Figma draws strokes with the stored colour)
const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:[],rebuilt:[]};
if(!set){const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;
 let y=40;for(const n of pg.children)if(n!==set)y=Math.max(y,n.y+n.height+80);set.x=40;set.y=y;ids.created.push(c.id);ids.newSet=set.id;}
set.description='PrimeNG: <p-button> | Story: components-button--playground | Version: 0.1.0 | Status: experimental'+D.desc;
const want={'Label':['TEXT','Button'],'Show label':['BOOLEAN',true],'Icon left':['BOOLEAN',false],'Icon right':['BOOLEAN',false],'Icon':['INSTANCE_SWAP',IC[D.F.icon].id],'Raised':['BOOLEAN',false],'Badge':['BOOLEAN',false]};
const K={};const defs=set.componentPropertyDefinitions;for(const k in defs)K[k.split('#')[0]]=k;
for(const n of D.props)if(!K[n])K[n]=set.addComponentProperty(n,want[n][0],want[n][1]);
function abs(c,n,d){c.appendChild(n);n.layoutPositioning='ABSOLUTE';n.resize(c.width+2*d,c.height+2*d);n.x=-d;n.y=-d;n.constraints={horizontal:'STRETCH',vertical:'STRETCH'};}
function slot(c,name,comp,S,fg,dir){const f=figma.createAutoLayout('HORIZONTAL',{name});f.primaryAxisAlignItems='CENTER';f.counterAxisAlignItems='CENTER';f.fills=[];c.appendChild(f);
 if(dir!=='V')f.setBoundVariable('minHeight',V(S.mh)); // horizontal only: keeps icon-only height = label line; stacked it would add height (code: icon box 14)
 const i=comp.createInstance();i.name='Icon';f.appendChild(i);i.setBoundVariable('height',V(S.ih));i.setBoundVariable('width',V(S.ih)); // square icon box (#43)
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(comp.name+': no Shape layer, icon colour cannot be set');sh.fills=[paint(V(fg))];return [f,i];}

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
const S=it.sz,R=it.rd;
 c.layoutMode=it.dir==='V'?'VERTICAL':'HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.clipsContent=false;c.fills=[];
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(S.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(S.px));
 c.setBoundVariable('itemSpacing',V(D.F.gap));rad(c,V(R[0]));
 c.strokes=[it.st?paint(V(it.st)):CLEAR];c.strokeWeight=1;c.strokeAlign='INSIDE';
 if(it.d)c.setBoundVariable('opacity',V(D.F.dop));else{c.setBoundVariable('opacity',null);c.opacity=1;}
 const [s1,i1]=slot(c,it.s1,it.spin===1?IC[D.F.spinner]:IC[D.F.icon],S,it.fg,it.dir);
 const t=figma.createText();t.name='Label';c.appendChild(t);await t.setTextStyleIdAsync(TS[S.ts].id);t.characters='Button';t.fills=[paint(V(it.fg))];/* no per-variant text formatting: Figma copies formatting of a label bound to the 'Label' property to every variant (#48) */
 let bi=null;if(it.badge){bi=BADGE.createInstance();bi.name='Badge';c.appendChild(bi);bi.setBoundVariable('minWidth',V(D.F.bsz));bi.setBoundVariable('height',V(D.F.bsz));bi.visible=false;}
 const [s2,i2]=slot(c,it.s2,it.spin===2?IC[D.F.spinner]:IC[D.F.icon],S,it.fg,it.dir);
 s1.visible=it.v1;s2.visible=it.v2; // property defaults before absolute layers are sized
 let sh=null;if(HAS('Raised')){sh=figma.createRectangle();sh.name='Shadow';abs(c,sh,0);c.insertChild(0,sh);sh.fills=[it.so?paint(V(it.sb)):CLEAR]; /* see-through variants: transparent, Raised is solid-only (#42) */
  rad(sh,V(R[0]));await sh.setEffectStyleIdAsync(ES[D.F.shadow].id);}
 const bg=figma.createRectangle();bg.name='Background';abs(c,bg,0);c.insertChild(sh?1:0,bg);rad(bg,V(R[0]));bg.fills=it.bg?[paint(V(it.bg))]:[];if(it.bo)bg.setBoundVariable('opacity',V(it.bo));
 const fr=figma.createFrame();fr.name='Focus ring';fr.fills=[];abs(c,fr,3);fr.clipsContent=false;rad(fr,V(R[1]));
 fr.strokes=[paint(V(it.rg))];fr.strokeAlign='INSIDE';for(const k of ['strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight'])fr.setBoundVariable(k,V(D.F.rw));fr.visible=it.f;
 REF(t,{characters:K['Label'],visible:K['Show label']});if(sh)REF(sh,{visible:K['Raised']});
 if(bi){REF(bi,{visible:K['Badge']});bi.isExposedInstance=true;}
 if(it.dir==='V'){if(it.spin!==1)REF(i1,{mainComponent:K['Icon']});if(it.spin!==2)REF(i2,{mainComponent:K['Icon']});}
 else if(!it.l){REF(s1,{visible:K['Icon left']});REF(i1,{mainComponent:K['Icon']});
  REF(s2,{visible:K['Icon right']});REF(i2,{mainComponent:K['Icon']});}
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c){ids.rebuilt.push(c.id);}else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created.push(c.id);}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {sync:SY,set:set.id,range:[D.from,D.to],of:ALL.length,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length};