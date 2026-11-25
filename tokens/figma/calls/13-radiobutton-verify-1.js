const D={"K":"radiobutton","A":{"size":["small","base","large"],"variant":["outlined","filled"],"state":["default","hover","focus","disabled"],"invalid":["false","true"],"checked":["no","yes"]},"setName":"RadioButton","desc":"PrimeNG: <p-radiobutton> | Story: components-radiobutton--playground | Version: 0.1.0 | Status: experimental | Control only, put a label next to it (#69) | Invalid stays red in hover/focus (#53/#70); invalid + disabled shows the disabled border, as in the browser (#72)"};
function variants(K,A){
const out=[];const ix=(a,v)=>A[a].indexOf(v);const sz=s=>s==='base'?'':(s==='small'?'sm':'lg')+'/';
const vs=A.variant||['outlined'];
for(const size of A.size)for(const variant of vs)for(const invalid of A.invalid)for(const state of A.state)for(const checked of A.checked){
 const f=K,ch=checked==='yes',inv=invalid==='true',dis=state==='disabled',hov=state==='hover',foc=state==='focus',it={kind:K};
 it.n='Size='+size+(A.variant?', Variant='+variant:'')+', State='+state+', Invalid='+invalid+', Checked='+checked;
 it.sh=!foc; // :focus-visible sets box-shadow to focus.ring.shadow (none)
 it.ring=foc;it.ro=f+'/focus-ring/offset';it.rw=f+'/focus-ring/width';it.rc=f+'/focus-ring/color';
 if(K==='toggleswitch'){
  it.w=size==='base'?f+'/width':f+'/'+sz(size)+'width';it.h=size==='base'?f+'/height':f+'/'+sz(size)+'height';it.hs=size==='base'?f+'/handle/size':f+'/'+sz(size)+'handle-size';
  it.bg=dis?f+'/disabled-background':ch?(hov?f+'/checked-hover-background':f+'/checked-background'):(hov?f+'/hover-background':f+'/background');
  it.st=inv?f+'/invalid-border-color':hov?(ch?f+'/checked-hover-border-color':f+'/hover-border-color'):(ch?f+'/checked-border-color':f+'/border-color');
  it.hb=dis?f+'/handle/disabled-background':ch?(hov?f+'/handle/checked-hover-background':f+'/handle/checked-background'):(hov?f+'/handle/hover-background':f+'/handle/background');
  it.on=ch;it.rr=f+'/border-radius';
  it.x=24+(ix('state',state)*A.checked.length+ix('checked',checked))*64;it.y=24+(ix('size',size)*A.invalid.length+ix('invalid',invalid))*44;
 }else{
  it.w=f+'/'+sz(size)+'width';it.h=f+'/'+sz(size)+'height';it.isz=f+'/icon/'+sz(size)+'size';
  it.bg=dis?f+'/disabled-background':ch?(hov?f+'/checked-hover-background':f+'/checked-background'):(variant==='filled'?f+'/filled-background':f+'/background');
  it.st=dis?f+'/checked-disabled-border-color':inv?f+'/invalid-border-color':foc?(ch?f+'/checked-focus-border-color':f+'/focus-border-color'):hov?(ch?f+'/checked-hover-border-color':f+'/hover-border-color'):(ch?f+'/checked-border-color':f+'/border-color');
  it.ic=checked==='no'?null:dis?f+'/icon/disabled-color':ch?(hov?f+'/icon/checked-hover-color':f+'/icon/checked-color'):f+'/icon/color';
  it.icon=K==='checkbox'?(checked==='indeterminate'?'Icon/minus':checked==='yes'?'Icon/check':null):null;
  it.dot=K==='radiobutton'&&ch;
  it.rr=K==='checkbox'?f+'/border-radius':it.h;it.ringR=K==='checkbox'?f+'/focus-ring-radius':it.h; // circle: radius = height (Figma caps at half)
  it.x=24+(ix('state',state)*A.checked.length+ix('checked',checked))*40;it.y=24+((ix('size',size)*vs.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*40;
 }
 out.push(it);}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);figma.skipInvisibleInstanceChildren=false;
const IT=variants(D.K,D.A);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set '+D.setName);
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const by={};for(const c of set.children)by[c.name]=c;const errs=[],lit=[];let nerr=0;
const E=(it,m)=>{nerr++;if(errs.length<30)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}
 eq(it,'w',await b(c,'width'),it.w);eq(it,'h',await b(c,'height'),it.h);eq(it,'bg',await pv(c.fills[0]),it.bg);eq(it,'border',await pv(c.strokes[0]),it.st);eq(it,'radius',await b(c,'topLeftRadius'),it.rr);
 eq(it,'shadow',!!c.effectStyleId,it.sh);
 const ring=c.children.find(x=>x.name==='Focus ring');eq(it,'ring',!!ring,it.ring);if(ring){eq(it,'ring colour',await pv(ring.strokes[0]),it.rc);eq(it,'ring width',await b(ring,'strokeTopWeight'),it.rw);eq(it,'ring radius',await b(ring,'topLeftRadius'),it.ringR||it.rr);}
 if(it.kind==='toggleswitch'){const hd=c.children.find(x=>x.name==='Handle');if(!hd){E(it,'no Handle');continue;}eq(it,'handle',await pv(hd.fills[0]),it.hb);eq(it,'handle size',await b(hd,'width'),it.hs);
  eq(it,'handle side',c.primaryAxisAlignItems,it.on?'MAX':'MIN');eq(it,'track border w',await b(c,'strokeTopWeight'),'toggleswitch/border-width');eq(it,'inset',await b(c,'paddingLeft'),'toggleswitch/gap');}
 else{const i=c.children.find(x=>x.name==='Icon');eq(it,'icon',i?(await i.getMainComponentAsync()).name:null,it.icon);
  if(i){eq(it,'icon colour',await pv(i.findOne(x=>x.name==='Shape').fills[0]),it.ic);eq(it,'icon size',await b(i,'width'),it.isz);}
  const d=c.children.find(x=>x.name==='Dot');eq(it,'dot',!!d,!!it.dot);if(d){eq(it,'dot colour',await pv(d.fills[0]),it.ic);eq(it,'dot size',await b(d,'width'),it.isz);}}
 for(const n of [c,...c.findAll(x=>x.type!=='INSTANCE')])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit.push(c.name+' > '+n.name+' '+key);}
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {set:D.setName,checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit.length,lit:lit.slice(0,5),sizes};