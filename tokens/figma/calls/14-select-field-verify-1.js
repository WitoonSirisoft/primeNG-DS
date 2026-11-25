const D={"A":{"size":["small","base","large"],"variant":["outlined","filled"],"state":["default","hover","focus","disabled"],"invalid":["false","true"],"content":["placeholder","value","empty"]},"W":196,"setName":"Select","desc":"PrimeNG: <p-select> | Story: components-select--playground | Version: 0.1.0 | Status: experimental | Same axes and rules as InputText (#73) | Show clear = showClear with a value (#75) | Width: 14rem default (no PrimeNG default), resize or Fill for fluid (#67) | Content=empty: text kept at 0% opacity to hold the height | Panel: Select Panel (open state)"};
function variants(A){
const f='select',out=[];const ix=(a,v)=>A[a].indexOf(v);
const SZ={small:{px:f+'/sm/padding-x',py:f+'/sm/padding-y',ts:'Select/Text sm',ic:f+'/sm/font-size'},base:{px:f+'/padding-x',py:f+'/padding-y',ts:'Select/Text base',ic:'icon-size'},large:{px:f+'/lg/padding-x',py:f+'/lg/padding-y',ts:'Select/Text lg',ic:f+'/lg/font-size'}};
for(const size of A.size)for(const variant of A.variant)for(const invalid of A.invalid)for(const state of A.state)for(const content of A.content){
 const inv=invalid==='true',dis=state==='disabled',hov=state==='hover',foc=state==='focus',it={sz:SZ[size]};
 it.n='Size='+size+', Variant='+variant+', State='+state+', Invalid='+invalid+', Content='+content;
 // .p-select / .p-variant-filled(:hover/.p-focus) / .p-disabled (background only)
 it.bg=dis?f+'/disabled-background':variant==='filled'?(hov?f+'/filled-hover-background':foc?f+'/filled-focus-background':f+'/filled-background'):f+'/background';
 // invalid red in every state (#53; disabled CSS sets no border, so the browser keeps red too, #72)
 it.st=inv?f+'/invalid-border-color':hov?f+'/hover-border-color':foc?f+'/focus-border-color':f+'/border-color';
 // label: .p-placeholder / .p-invalid .p-placeholder (beats disabled) / .p-disabled .p-select-label
 it.fg=content==='placeholder'?(inv?f+'/invalid-placeholder-color':dis?f+'/disabled-color':f+'/placeholder-color'):(dis?f+'/disabled-color':f+'/color');
 it.sh=!foc; // .p-focus box-shadow: focus.ring.shadow (none); ring width 0 in Aura (form-field)
 it.p=content==='placeholder'?'Placeholder':'Value';it.e=content==='empty';
 it.x=24+(ix('state',state)*A.content.length+ix('content',content))*230;it.y=24+((ix('size',size)*A.variant.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*60;
 out.push(it);}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);figma.skipInvisibleInstanceChildren=false;
const IT=variants(D.A);const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set');
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
const by={};for(const c of set.children)by[c.name]=c;const errs=[];let nerr=0,lit=0;
const E=(it,m)=>{nerr++;if(errs.length<30)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const g=n=>c.findOne(x=>x.name===n);
 eq(it,'bg',await pv(c.fills[0]),it.bg);eq(it,'border',await pv(c.strokes[0]),it.st);eq(it,'radius',await b(c,'topLeftRadius'),'select/border-radius');eq(it,'shadow',!!c.effectStyleId,it.sh);eq(it,'width',c.width,D.W);
 const lb=g('Label');eq(it,'pad x',await b(lb,'paddingLeft'),it.sz.px);eq(it,'pad y',await b(lb,'paddingTop'),it.sz.py);
 const t=g('Text');eq(it,'text',await pv(t.fills[0]),it.fg);eq(it,'text style',(await figma.getStyleByIdAsync(t.textStyleId)).name,it.sz.ts);eq(it,'text prop',t.componentPropertyReferences.characters,K[it.p]);eq(it,'empty',t.opacity,it.e?0:1);
 const cl=g('Clear');eq(it,'clear prop',cl&&cl.componentPropertyReferences.visible,K['Show clear']);eq(it,'clear colour',await pv(cl.findOne(x=>x.name==='Shape').fills[0]),'select/clear-icon/color');
 const dd=g('Dropdown');eq(it,'trigger w',await b(dd,'width'),'select/dropdown/width');const ic=dd.findOne(x=>x.name==='Icon');eq(it,'chevron size',await b(ic,'width'),it.sz.ic);eq(it,'chevron colour',await pv(ic.findOne(x=>x.name==='Shape').fills[0]),'select/dropdown/color');
 for(const n of [c,...c.findAll(x=>x.type!=='INSTANCE')])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit++;}
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit,sizes};