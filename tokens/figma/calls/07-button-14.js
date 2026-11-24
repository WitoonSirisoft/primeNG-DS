const D={"A":{"severity":["primary","secondary","success","info","warn","danger","help","contrast"],"variant":["solid","outlined","text"],"size":["small","base","large"],"state":["default","hover","focus","active","disabled","loading"],"rounded":["false","true"]},"on":["severity","variant","size","state","rounded"],"set":"main","setName":"Button","desc":"","props":["Label","Show label","Icon left","Icon right","Icon","Raised","Badge"],"F":{"gap":"button/gap","rw":"button/focus-ring/width","dop":"disabled-opacity","bsz":"button/badge-size","shadow":"button/raised-shadow","icon":"Icon/check","spinner":"Icon/primeng-spinner"},"from":624,"to":672};
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
async function build(c,it){CUR=c;for(const k of [...c.children])k.remove();const S=it.sz,R=it.rd;
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
 t.componentPropertyReferences={characters:K['Label'],visible:K['Show label']};if(sh)sh.componentPropertyReferences={visible:K['Raised']};
 if(bi){bi.componentPropertyReferences={visible:K['Badge']};bi.isExposedInstance=true;}
 if(it.dir==='V'){if(it.spin!==1)i1.componentPropertyReferences={mainComponent:K['Icon']};if(it.spin!==2)i2.componentPropertyReferences={mainComponent:K['Icon']};}
 else if(!it.l){s1.componentPropertyReferences={visible:K['Icon left']};i1.componentPropertyReferences={mainComponent:K['Icon']};
  s2.componentPropertyReferences={visible:K['Icon right']};i2.componentPropertyReferences={mainComponent:K['Icon']};}
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c){ids.rebuilt.push(c.id);}else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created.push(c.id);}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {set:set.id,range:[D.from,D.to],of:ALL.length,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length};