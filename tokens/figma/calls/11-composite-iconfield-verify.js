const D={"set":"iconfield","setName":"IconField","desc":"PrimeNG: <p-iconfield> + <p-inputicon> around pInputText | Story: components-iconfield--playground | Version: 0.1.0 | Status: experimental | Composed from an InputText instance (#61): set State, Variant, Invalid, text on the nested InputText; do not change its Size | Icon: swap any Icon/*","icon":"Icon/search","G":{"w":{"small":149.5,"base":172,"large":194.5},"px":{"small":8.75,"base":10.5,"large":12.25},"icon":14,"btn":35,"iconPad":35,"stackPad":45.5}};
function variants(SET,G){
const SIZES=['small','base','large'],out=[];
const ISZ={small:'form-field/sm/font-size',base:'icon-size',large:'form-field/lg/font-size'}; // .p-iconfield/.p-inputnumber icon size per size
const IPX={small:12.25,base:14,large:15.75};
const it0=(size)=>({size,inner:'Size='+size+', Variant=outlined, State=default, Invalid=false, Content=placeholder',w:G.w[size],px:G.px[size]});
SIZES.forEach((size,si)=>{
 if(SET==='iconfield')['left','right'].forEach((pos,pi)=>{const it=it0(size);it.n='Icon position='+pos+', Size='+size;it.pos=pos;
  it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='iconfield/input-padding';it.icon='Icon/search';it.isz=ISZ[size];it.ipx=IPX[size];it.ic='iconfield/icon/color';
  it.ph='Search';it.x=24+si*260;it.y=24+pi*60;out.push(it);});
 if(SET==='password')['false','true'].forEach((tm,ti)=>{const it=it0(size);it.n='Toggle mask='+tm+', Size='+size;it.inner=it.inner.replace('placeholder','value');it.val='••••••••';
  if(tm==='true'){it.pos='right';it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='password/input-padding';it.icon='Icon/eye';it.isz='icon-size';it.ipx=14;it.ic='password/icon/color';}
  else it.iw=G.w[size];
  it.x=24+si*260;it.y=24+ti*60;out.push(it);});
 if(SET==='inputnumber')['none','stacked','horizontal','vertical'].forEach((bl,bi)=>{const it=it0(size);it.n='Buttons='+bl+', Size='+size;it.bl=bl;it.inner=it.inner.replace('placeholder','value');it.val='42';
  it.isz=ISZ[size];it.ipx=IPX[size];it.iw=bl==='stacked'?G.w[size]-G.px[size]+G.stackPad:G.w[size];
  if(bl==='stacked')it.pad='inputnumber/stacked-input-padding';
  it.x=24+si*300;it.y=24+bi*130;out.push(it);});
 if(SET==='datepicker')['none','input','button'].forEach((ic,ii)=>{const it=it0(size);it.n='Icon display='+ic+', Size='+size;it.ph='Select a date';
  if(ic==='input'){it.pos='right';it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='datepicker/input-padding';it.icon='Icon/calendar';it.isz=ISZ[size];it.ipx=IPX[size];it.ic='datepicker/input-icon/color';}
  else it.iw=G.w[size];
  if(ic==='button'){it.dd={small:'datepicker/dropdown/sm/width',base:'datepicker/dropdown/width',large:'datepicker/dropdown/lg/width'}[size];it.ddw={small:28,base:35,large:42}[size];it.isz=ISZ[size];it.ipx=IPX[size];}
  it.x=24+si*280;it.y=24+ii*60;out.push(it);});
});
return out;}

const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set');
const IT=variants(D.set,D.G);const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?';}return VN[id];};
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const errs=[];let lit=0;const by={};for(const c of set.children)by[c.name]=c;
for(const it of IT){const c=by[it.n];if(!c){errs.push(it.n+' missing');continue;}const n=c.findChild(x=>x.name==='InputText');
 if(!n||n.type!=='INSTANCE'){errs.push(it.n+' no InputText instance');continue;}
 const mc=await n.getMainComponentAsync();if(!mc||mc.parent.name!=='InputText')errs.push(it.n+' inner not InputText');if(!n.isExposedInstance)errs.push(it.n+' not exposed');
 if(it.pad&&await b(n,it.pos==='left'?'paddingLeft':'paddingRight')!==it.pad)errs.push(it.n+' padding not bound');
 if(Math.abs(n.width-it.iw)>0.05)errs.push(it.n+' inner width '+n.width+' != '+it.iw);
 for(const x of c.findAll(x=>x.type!=='INSTANCE'||x.name==='Icon'))for(const key of ['fills','strokes'])if(x[key]&&x[key]!==figma.mixed)for(const q of x[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color)&&!(x.parent&&x.parent.type==='INSTANCE'))lit++;}
return {set:D.setName,checked:IT.length,inSet:set.children.length,errors:errs.length,errs:errs.slice(0,20),literalPaints:lit,sizes:set.children.map(c=>c.name.replace(/[A-Za-z ]+=/g,'')+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2))};