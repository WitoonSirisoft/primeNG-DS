const D={"A":{"severity":["success","info","warn","error","secondary","contrast"],"variant":["default","outlined","simple"],"size":["small","base","large"]},"ICON":{"success":"Icon/check-circle","info":"Icon/info-circle","warn":"Icon/exclamation-triangle","error":"Icon/times-circle","secondary":"Icon/info-circle","contrast":"Icon/info-circle"},"desc":"PrimeNG: <p-message> | Story: components-message--playground | Version: 0.1.0 | Status: experimental | Text, Show icon ([icon]; icon per severity, design default #78/#79: to change it select the Icon layer and swap it), Closable ([closable]) | Close button hover / focus not built (#77) | Border is a CSS outline: drawn outside, not part of the size | Stretch the instance: text fills, × stays right | contrast / secondary shadow uses the Light effect style (effect styles have no modes; 4% shadow)"};
function variants(A,has){
const m='message/',out=[];const ix=(a,v)=>A[a].indexOf(v);const sz=s=>s==='base'?'':(s==='small'?'sm/':'lg/');
for(const sev of A.severity)for(const variant of A.variant)for(const size of A.size){
 const s=m+sev+'/',it={sev,variant,size,n:'Severity='+sev+', Variant='+variant+', Size='+size};
 it.px=variant==='simple'?m+'simple/content/padding':m+'content/'+sz(size)+'padding-x';it.py=variant==='simple'?m+'simple/content/padding':m+'content/'+sz(size)+'padding-y';
 it.ts='Message/Text '+({small:'sm',base:'base',large:'lg'})[size];it.isz=m+'icon/'+sz(size)+'size';it.csz=m+'close-icon/'+sz(size)+'size';
 it.fg=variant==='default'?s+'color':variant==='outlined'?s+'outlined/color':s+'simple/color';
 it.bg=variant==='default'?s+'background':null;it.bgo=it.bg&&has(s+'background-opacity')?s+'background-opacity':null;
 it.bd=variant==='simple'?null:variant==='outlined'?s+'outlined/border-color':s+'border-color';it.bdo=variant==='default'&&has(s+'border-color-opacity')?s+'border-color-opacity':null;
 it.bw=variant==='outlined'?m+'outlined/root/border-width':m+'border-width';
 it.sh=variant==='simple'?null:(sev==='secondary'||sev==='contrast')?m+s.slice(m.length)+'shadow (Light)':s+'shadow'; // contrast / secondary: Light style (effect styles have no modes)
 it.x=24+(ix('variant',variant)*A.size.length+ix('size',size))*200;it.y=24+ix('severity',sev)*56;
 out.push(it);}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);figma.skipInvisibleInstanceChildren=false;
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const IT=variants(D.A,n=>!!VB[n]);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Message');const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const by={};for(const c of set.children)by[c.name]=c;const errs=[];let nerr=0,lit=0;
const E=(it,m)=>{nerr++;if(errs.length<30)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const g=n=>c.findChild(x=>x.name===n);
 eq(it,'pad x',await b(c,'paddingLeft'),it.px);eq(it,'pad y',await b(c,'paddingTop'),it.py);eq(it,'gap',await b(c,'itemSpacing'),'message/content/gap');
 const t=g('Text');eq(it,'text',await pv(t.fills[0]),it.fg);eq(it,'text style',(await figma.getStyleByIdAsync(t.textStyleId)).name,it.ts);eq(it,'text prop',t.componentPropertyReferences.characters,K['Text']);
 const i=g('Icon');eq(it,'icon colour',await pv(i.findOne(x=>x.name==='Shape').fills[0]),it.fg);eq(it,'icon size',await b(i,'width'),it.isz);eq(it,'icon props',JSON.stringify(i.componentPropertyReferences),JSON.stringify({visible:K['Show icon']}));
 eq(it,'icon default',(await i.getMainComponentAsync()).name,D.ICON[it.sev]);
 const cb=g('Close');eq(it,'close prop',cb.componentPropertyReferences.visible,K['Closable']);eq(it,'close w',await b(cb,'width'),'message/close-button/width');const x=cb.findChild(n=>n.name==='Icon');eq(it,'close icon',await b(x,'width'),it.csz);eq(it,'close colour',await pv(x.findOne(n=>n.name==='Shape').fills[0]),it.fg);
 const bg=g('Background');eq(it,'bg',bg?await pv(bg.fills[0]):null,it.bg);if(bg)eq(it,'bg opacity',await b(bg,'opacity'),it.bgo);
 const bd=g('Border');eq(it,'border',bd?await pv(bd.strokes[0]):null,it.bd);if(bd){eq(it,'border w',await b(bd,'strokeTopWeight'),it.bw);eq(it,'border opacity',await b(bd,'opacity'),it.bdo);eq(it,'outside',bd.strokeAlign,'OUTSIDE');}
 const es=c.effectStyleId?(await figma.getStyleByIdAsync(c.effectStyleId)).name:null;eq(it,'shadow',es,it.sh);
 for(const n of [c,...c.findAll(x=>x.type!=='INSTANCE')])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit++;}
return {checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit};