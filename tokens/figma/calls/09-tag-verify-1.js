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
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set '+D.setName);
await figma.root.children.find(p=>p.name==='01 Foundations').loadAsync();
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
const by={};for(const c of set.children)by[c.name]=c;const errs=[],lit=[];let nerr=0;
const E=(it,m)=>{nerr++;if(errs.length<40)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};
const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const g=n=>c.findOne(x=>x.name===n);
 for(const k of ['paddingTop','paddingBottom'])eq(it,k,await b(c,k),D.F.py);for(const k of ['paddingLeft','paddingRight'])eq(it,k,await b(c,k),D.F.px);
 eq(it,'gap',await b(c,'itemSpacing'),D.F.gap);for(const k of RAD)eq(it,k,await b(c,k),it.rd);
 const bg=g('Background');if(!bg){E(it,'no Background');continue;}eq(it,'bg',await pv(bg.fills[0]),it.bg);eq(it,'bgOpacity',await b(bg,'opacity'),it.bo);eq(it,'bgRadius',await b(bg,'topLeftRadius'),it.rd);
 const t=g('Label');if(!t){E(it,'no Label');continue;}eq(it,'label',await pv(t.fills[0]),it.fg);const ts=await figma.getStyleByIdAsync(t.textStyleId);eq(it,'textStyle',ts&&ts.name,D.F.ts);
 eq(it,'label prop',t.componentPropertyReferences&&t.componentPropertyReferences.characters,K['Value']);
 const i=g('Icon');if(!i){E(it,'no Icon');continue;}eq(it,'icon w',await b(i,'width'),D.F.isz);eq(it,'icon h',await b(i,'height'),D.F.isz);eq(it,'icon visible',i.visible,false);
 eq(it,'icon props',JSON.stringify(i.componentPropertyReferences),JSON.stringify({visible:K['Show icon'],mainComponent:K['Icon']}));
 for(const n of [c,bg,t])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit.push(c.name+' > '+n.name+' '+key);}
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
const vp={};const d=set.componentPropertyDefinitions;for(const k in d)vp[k.split('#')[0]]=d[k].type==='VARIANT'?d[k].variantOptions.length:d[k].type;
return {checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit.length,lit,sizes,props:vp};