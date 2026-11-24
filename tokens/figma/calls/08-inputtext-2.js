const D={"A":{"size":["small","base","large"],"variant":["outlined","filled"],"state":["default","hover","focus","disabled"],"invalid":["false","true"],"content":["placeholder","value","empty"]},"setName":"InputText","desc":"PrimeNG: pInputText | Story: components-inputtext--playground | Version: 0.1.0 | Status: experimental | Readonly: no Aura style, looks like default (#51) | Invalid + hover/focus: border stays red as with Angular forms (#53); the [invalid] attribute replaces it on hover/focus | Width: browser default (size=20); set the instance to Fill for fluid | Content=empty: text kept at 0% opacity to hold the height","props":["Placeholder","Value"],"F":{"rd":"inputtext/border-radius","shadow":"inputtext/shadow"},"from":48,"to":96};
function variants(A){
// w = browser default <input> width (size=20), from screenshots/manifest.csv; no Aura token (design-only literal)
const SZ={small:{px:'inputtext/sm/padding-x',py:'inputtext/sm/padding-y',ts:'InputText/Text sm',w:149.5},
base:{px:'inputtext/padding-x',py:'inputtext/padding-y',ts:'InputText/Text base',w:172},
large:{px:'inputtext/lg/padding-x',py:'inputtext/lg/padding-y',ts:'InputText/Text lg',w:194.5}};
const CW=220,CH=60,PAD=24,out=[];const ix=(a,v)=>A[a].indexOf(v);
for(const size of A.size)for(const variant of A.variant)for(const invalid of A.invalid)for(const state of A.state)for(const content of A.content){
 const inv=invalid==='true',dis=state==='disabled',it={sz:SZ[size]};
 it.n='Size='+size+', Variant='+variant+', State='+state+', Invalid='+invalid+', Content='+content;
 // background: .p-inputtext / .p-variant-filled(:hover/:focus) / :disabled (disabled wins, later in the CSS)
 it.bg=dis?'inputtext/disabled-background':variant==='filled'?(state==='hover'?'inputtext/filled-hover-background':state==='focus'?'inputtext/filled-focus-background':'inputtext/filled-background'):'inputtext/background';
 // border: invalid stays red in every state (#53, Angular forms); otherwise :enabled:hover / :enabled:focus
 it.st=inv?'inputtext/invalid-border-color':state==='hover'?'inputtext/hover-border-color':state==='focus'?'inputtext/focus-border-color':'inputtext/border-color';
 // text: ::placeholder / .p-invalid::placeholder (no disabled placeholder rule); value: color / :disabled color
 it.fg=content==='placeholder'?(inv?'inputtext/invalid-placeholder-color':'inputtext/placeholder-color'):(dis?'inputtext/disabled-color':'inputtext/color');
 it.sh=state!=='focus'; // :enabled:focus sets box-shadow to focus.ring.shadow = none
 it.p=content==='placeholder'?'Placeholder':'Value';it.e=content==='empty'; // empty: text kept at opacity 0 so the line box keeps the height
 it.x=PAD+(ix('state',state)*A.content.length+ix('content',content))*CW;
 it.y=PAD+((ix('size',size)*A.variant.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*CH;
 out.push(it);}
return out;}
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const ALL=variants(D.A);const IT=ALL.slice(D.from,D.to);
const need=new Set([D.F.rd]);for(const it of IT)for(const n of [it.sz.px,it.sz.py,it.bg,it.st,it.fg])need.add(n);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));const V=n=>VB[n];
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;
for(const n of new Set(IT.map(i=>i.sz.ts))){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(!ES[D.F.shadow])throw new Error('Missing effect style '+D.F.shadow);
let CUR=null; // bound paints store the colour resolved for the node being built (Figma draws strokes with the stored colour)
const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:[],rebuilt:[]};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200); // measured before creating, below everything on the page
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.created.push(c.id);ids.newSet=set.id;}
set.description=D.desc;
const K={};const defs=set.componentPropertyDefinitions;for(const k in defs)K[k.split('#')[0]]=k;
for(const n of D.props)if(!K[n])K[n]=set.addComponentProperty(n,'TEXT',n);
async function build(c,it){CUR=c;for(const k of [...c.children])k.remove();const S=it.sz;
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='MIN';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.clipsContent=true;
 c.resize(S.w,c.height);c.strokesIncludedInLayout=true; // CSS box: 1px border adds to the size
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(S.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(S.px));
 for(const k of RAD)c.setBoundVariable(k,V(D.F.rd));
 c.fills=[paint(V(it.bg))];c.strokes=[paint(V(it.st))];c.strokeWeight=1;c.strokeAlign='INSIDE';
 if(it.sh)await c.setEffectStyleIdAsync(ES[D.F.shadow].id);else c.effects=[]; /* plain effects array detaches the style */
 const t=figma.createText();c.appendChild(t);await t.setTextStyleIdAsync(TS[S.ts].id);t.characters=it.p;t.autoRename=false;t.name='Text'; // Figma renames text layers after their content unless autoRename is off
 t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';t.textTruncation='ENDING';t.maxLines=1;
 t.fills=[paint(V(it.fg))];t.opacity=it.e?0:1; /* only the fill differs per variant: formatting of a property-bound text spreads to every variant (#48) */
 t.componentPropertyReferences={characters:K[it.p]};
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c){ids.rebuilt.push(c.id);}else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created.push(c.id);}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {set:set.id,range:[D.from,D.to],of:ALL.length,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length};