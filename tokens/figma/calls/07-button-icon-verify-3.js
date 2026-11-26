const D={"A":{"severity":["primary","secondary","success","info","warn","danger","help","contrast"],"variant":["solid","outlined","text"],"size":["small","base","large"],"state":["default","hover","focus","active","disabled","loading"],"rounded":["false","true"]},"on":["severity","variant","size","state","rounded"],"set":"icon","setName":"Button Icon","desc":" | Code: icon only, no label (.p-button-icon-only): width = button[.sm|.lg].icon-only-width, padding-x 0, gap 0; Rounded → circle, height = icon-only-width (#85)","props":["Icon","Raised","Badge"],"F":{"gap":"button/gap","rw":"button/focus-ring/width","dop":"disabled-opacity","bsz":"button/badge-size","shadow":"button/raised-shadow","icon":"Icon/check","spinner":"Icon/primeng-spinner"},"from":600,"to":864};
function variants(A,on,has,SET){
const vals=a=>SET!=='main'||on.includes(a)?A[a]:[A[a][a==='size'?1:0]];const ix=(a,v)=>vals(a).indexOf(v);
const SZ={small:{px:'button/sm/padding-x',py:'button/sm/padding-y',ts:'Button/Label sm',ih:'button/sm/font-size',mh:'button/sm/line-height',iw:'button/sm/icon-only-width'},
base:{px:'button/padding-x',py:'button/padding-y',ts:'Button/Label base',ih:'typography/base/font-size',mh:'button/line-height',iw:'button/icon-only-width'},
large:{px:'button/lg/padding-x',py:'button/lg/padding-y',ts:'Button/Label lg',ih:'button/lg/font-size',mh:'button/lg/line-height',iw:'button/lg/icon-only-width'}};
const RD={'false':['button/border-radius','button/focus-ring-radius'],'true':['button/rounded-border-radius','button/rounded-focus-ring-radius']};
const CW=130,CH=64,PAD=24,out=[];
const base=(size,state,rounded)=>{const k=state==='hover'||state==='active'?state:'default';return {k,sz:SZ[size],rd:RD[rounded],f:state==='focus',d:state==='disabled'||state==='loading',l:state==='loading',
 dir:'H',s1:'Icon left',s2:'Icon right',v1:state==='loading',v2:false,so:0,sb:'button/primary/background',rg:'button/primary/focus-ring/color',bo:null,ul:false,badge:false};};
const put=(it,row,col)=>{it.x=PAD+col*CW;it.y=PAD+row*CH;out.push(it);};
const solid=(it,sev)=>{const p=x=>it.k==='default'?x:it.k+'-'+x;it.bg='button/'+sev+'/'+p('background');it.st='button/'+sev+'/'+p('border-color');it.fg='button/'+sev+'/'+p('color');it.so=1;it.sb='button/'+sev+'/background';it.rg='button/'+sev+'/focus-ring/color';};
if(SET==='main'||SET==='icon'){
 for(const sev of vals('severity'))for(const variant of vals('variant'))for(const rounded of vals('rounded'))for(const size of vals('size'))for(const state of vals('state')){
  const it=base(size,state,rounded);it.n='Severity='+sev+', Variant='+variant+', Size='+size+', State='+state+', Rounded='+rounded;it.badge=true;
  if(SET==='icon'){it.io=true;it.v1=true;it.circ=rounded==='true';if(it.circ)it.rd=[it.sz.iw,it.rd[1]];} // .p-button-icon-only(.p-button-rounded)
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
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set '+D.setName);
await figma.root.children.find(p=>p.name==='01 Foundations').loadAsync(); // icon mains live there
const HAS=p=>D.props.includes(p);
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const by={};for(const c of set.children)by[c.name]=c;const errs=[],lit=[];let nerr=0,nclear=0;
const E=(it,m)=>{nerr++;if(errs.length<40)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};
const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const clear=q=>!!q&&q.type==='SOLID'&&q.opacity===0&&!(q.boundVariables&&q.boundVariables.color);
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const S=it.sz,R=it.rd,g=n=>c.findOne(x=>x.name===n);
 eq(it,'direction',c.layoutMode,it.dir==='V'?'VERTICAL':'HORIZONTAL');
 for(const k of ['paddingTop','paddingBottom'])eq(it,k,await b(c,k),S.py);for(const k of ['paddingLeft','paddingRight'])eq(it,k,await b(c,k),it.io?null:S.px);
 eq(it,'gap',await b(c,'itemSpacing'),it.io?null:D.F.gap);if(it.io){eq(it,'width',await b(c,'width'),S.iw);eq(it,'height',await b(c,'height'),it.circ?S.iw:null);eq(it,'label hidden',c.findOne(x=>x.name==='Label').visible,false);}for(const k of RAD)eq(it,k,await b(c,k),R[0]);
 eq(it,'stroke',it.st?await pv(c.strokes[0]):(clear(c.strokes[0])?'transparent':'not transparent'),it.st||'transparent');
 eq(it,'opacity',await b(c,'opacity'),it.d?D.F.dop:null);
 const bg=g('Background');eq(it,'bg',bg.fills.length?await pv(bg.fills[0]):null,it.bg);eq(it,'bgOpacity',await b(bg,'opacity'),it.bo);
 const sd=g('Shadow');eq(it,'Shadow layer',!!sd,HAS('Raised'));
 if(sd){eq(it,'shadowFill',it.so?await pv(sd.fills[0]):(clear(sd.fills[0])?'transparent':'not transparent'),it.so?it.sb:'transparent');
  eq(it,'shadowStyle',(await figma.getStyleByIdAsync(sd.effectStyleId)||{}).name,D.F.shadow);eq(it,'shadowRadius',await b(sd,'topLeftRadius'),R[0]);}
 const t=g('Label');eq(it,'label',await pv(t.fills[0]),it.fg);const ts=await figma.getStyleByIdAsync(t.textStyleId);eq(it,'textStyle',ts&&ts.name,S.ts);eq(it,'underline',t.textDecoration,it.ul?'UNDERLINE':'NONE');
 const fr=g('Focus ring');eq(it,'ring',await pv(fr.strokes[0]),it.rg);eq(it,'ringRadius',await b(fr,'topLeftRadius'),R[1]);eq(it,'ringWidth',await b(fr,'strokeTopWeight'),D.F.rw);eq(it,'ringVisible',fr.visible,it.f);
 // Icon colour is not read: sublayers of instances nested in a component read as empty after a reload (Figma API); the build throws if it cannot set it.
 for(const [sn,vis,pos] of [[it.s1,it.v1,1],[it.s2,it.v2,2]]){const s=g(sn);if(!s){E(it,sn+' missing');continue;}eq(it,sn+' visible',s.visible,vis);eq(it,sn+' minHeight',await b(s,'minHeight'),it.dir==='V'?null:S.mh);const i=s.findOne(x=>x.type==='INSTANCE');
  eq(it,sn+' height',await b(i,'height'),S.ih);eq(it,sn+' width',await b(i,'width'),S.ih);eq(it,sn+' icon',(await i.getMainComponentAsync()).name,it.spin===pos?D.F.spinner:D.F.icon);}
 const bd=g('Badge');eq(it,'Badge layer',!!bd,!!it.badge);if(bd){eq(it,'badge minWidth',await b(bd,'minWidth'),D.F.bsz);eq(it,'badge height',await b(bd,'height'),D.F.bsz);eq(it,'badge visible',bd.visible,false);
  eq(it,'badge order',c.children.indexOf(bd)===c.children.indexOf(t)+1,true);eq(it,'badge severity',(await bd.getMainComponentAsync()).name,'Severity=secondary, Circle=true');}
 for(const n of [c,...c.findAll(()=>true)]){if(n.type==='INSTANCE')continue;let p=n.parent,inInst=false;while(p&&p!==c){if(p.type==='INSTANCE')inInst=true;p=p.parent;}if(inInst)continue;
  for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key]){if(q.type!=='SOLID'||(q.boundVariables&&q.boundVariables.color))continue;if(q.opacity===0&&(n===c&&key==='strokes'||n.name==='Shadow')){nclear++;continue;}lit.push(c.name+' > '+n.name+' '+key);}
  if(n.type==='TEXT'&&!n.textStyleId)lit.push(c.name+' > '+n.name+' no text style');}}
const sizes={};for(const it of IT){const c=by[it.n];if(c){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}}
const vp={};const d=set.componentPropertyDefinitions;for(const k in d)vp[k.split('#')[0]]=d[k].type==='VARIANT'?d[k].variantOptions.length:d[k].type;
return {set:D.setName,range:[D.from,D.to],of:ALL.length,checked:IT.length,inSet:set.children.length,errors:nerr,errs,allowedTransparent:nclear,literalPaints:lit.length,lit:lit.slice(0,20),sizes,props:vp};