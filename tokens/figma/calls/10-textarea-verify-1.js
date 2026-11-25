const D={"A":{"size":["small","base","large"],"variant":["outlined","filled"],"state":["default","hover","focus","disabled"],"invalid":["false","true"],"content":["placeholder","value","empty"]},"P":{"pfx":"textarea","ts":"Textarea/Text","w":{"small":183.5,"base":208,"large":233.5},"h":{"small":56.56,"base":66.39,"large":76.17}},"setName":"Textarea","desc":"PrimeNG: pTextarea | Story: components-textarea--playground | Same rules as InputText (#62); default 3 rows × 24 cols | Version: 0.1.0 | Status: experimental | Readonly: no Aura style, looks like default (#51) | Invalid + hover/focus: border stays red as with Angular forms (#53); the [invalid] attribute replaces it on hover/focus | Size: browser default (cols 24 × rows 3); resize freely, Fill for fluid | Content=empty: text kept at 0% opacity to hold the height","props":["Placeholder","Value"],"F":{"rd":"textarea/border-radius","shadow":"textarea/shadow"},"from":0,"to":144};
function variants(A,P){
// w = browser default <input> width (size=20), from screenshots/manifest.csv; no Aura token (design-only literal)
const f=P.pfx,SZ={small:{px:f+'/sm/padding-x',py:f+'/sm/padding-y',ts:P.ts+' sm',w:P.w.small,h:P.h&&P.h.small},
base:{px:f+'/padding-x',py:f+'/padding-y',ts:P.ts+' base',w:P.w.base,h:P.h&&P.h.base},
large:{px:f+'/lg/padding-x',py:f+'/lg/padding-y',ts:P.ts+' lg',w:P.w.large,h:P.h&&P.h.large}};
const CW=P.h?260:220,CH=P.h?96:60,PAD=24,out=[];const ix=(a,v)=>A[a].indexOf(v);
for(const size of A.size)for(const variant of A.variant)for(const invalid of A.invalid)for(const state of A.state)for(const content of A.content){
 const inv=invalid==='true',dis=state==='disabled',it={sz:SZ[size]};
 it.n='Size='+size+', Variant='+variant+', State='+state+', Invalid='+invalid+', Content='+content;
 // background: .p-inputtext / .p-variant-filled(:hover/:focus) / :disabled (disabled wins, later in the CSS)
 it.bg=dis?f+'/disabled-background':variant==='filled'?(state==='hover'?f+'/filled-hover-background':state==='focus'?f+'/filled-focus-background':f+'/filled-background'):f+'/background';
 // border: invalid stays red in every state (#53, Angular forms); otherwise :enabled:hover / :enabled:focus
 it.st=inv?f+'/invalid-border-color':state==='hover'?f+'/hover-border-color':state==='focus'?f+'/focus-border-color':f+'/border-color';
 // text: ::placeholder / .p-invalid::placeholder (no disabled placeholder rule); value: color / :disabled color
 it.fg=content==='placeholder'?(inv?f+'/invalid-placeholder-color':f+'/placeholder-color'):(dis?f+'/disabled-color':f+'/color');
 it.sh=state!=='focus'; // :enabled:focus sets box-shadow to focus.ring.shadow = none
 it.p=content==='placeholder'?'Placeholder':'Value';it.e=content==='empty'; // empty: text kept at opacity 0 so the line box keeps the height
 it.x=PAD+(ix('state',state)*A.content.length+ix('content',content))*CW;
 it.y=PAD+((ix('size',size)*A.variant.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*CH;
 out.push(it);}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const ALL=variants(D.A,D.P);const IT=ALL.slice(D.from,D.to);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set '+D.setName);
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
const by={};for(const c of set.children)by[c.name]=c;const errs=[],lit=[];let nerr=0;
const E=(it,m)=>{nerr++;if(errs.length<40)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};
const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const S=it.sz;
 for(const k of ['paddingTop','paddingBottom'])eq(it,k,await b(c,k),S.py);for(const k of ['paddingLeft','paddingRight'])eq(it,k,await b(c,k),S.px);
 for(const k of RAD)eq(it,k,await b(c,k),D.F.rd);
 eq(it,'fill',await pv(c.fills[0]),it.bg);eq(it,'stroke',await pv(c.strokes[0]),it.st);eq(it,'strokeWeight',c.strokeWeight,1);
 eq(it,'width',Math.round(c.width*100)/100,S.w);if(S.h)eq(it,'height',Math.round(c.height*100)/100,S.h);
 const es=c.effectStyleId?await figma.getStyleByIdAsync(c.effectStyleId):null;eq(it,'shadow',es?es.name:null,it.sh?D.F.shadow:null);
 const t=c.findOne(x=>x.name==='Text');if(!t){E(it,'no Text');continue;}
 eq(it,'text fill',await pv(t.fills[0]),it.fg);const ts=await figma.getStyleByIdAsync(t.textStyleId);eq(it,'textStyle',ts&&ts.name,S.ts);
 eq(it,'text prop',t.componentPropertyReferences&&t.componentPropertyReferences.characters,K[it.p]);eq(it,'text opacity',t.opacity,it.e?0:1);
 for(const n of [c,...c.findAll(()=>true)])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit.push(c.name+' > '+n.name+' '+key);}
const sizes={};for(const it of IT){const c=by[it.n];if(c){const k=it.sz.ts.split(' ').pop()+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}}
const vp={};const d=set.componentPropertyDefinitions;for(const k in d)vp[k.split('#')[0]]=d[k].type==='VARIANT'?d[k].variantOptions.length:d[k].type;
return {set:D.setName,range:[D.from,D.to],of:ALL.length,checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit.length,lit:lit.slice(0,20),sizes,props:vp};