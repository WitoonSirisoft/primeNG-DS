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
const need=new Set([D.F.px,D.F.py,D.F.gap,D.F.isz]);for(const it of IT)for(const n of [it.bg,it.bo,it.fg,it.rd])if(n)need.add(n);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));const V=n=>VB[n];
const TS=(await figma.getLocalTextStylesAsync()).find(s=>s.name===D.F.ts);if(!TS)throw new Error('Missing text style '+D.F.ts);await figma.loadFontAsync(TS.fontName);
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC=ip.findOne(x=>x.type==='COMPONENT'&&x.name===D.F.icon);if(!IC)throw new Error('Missing icon '+D.F.icon);
let CUR=null; // bound paints store the colour resolved for the node being built
const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:[],rebuilt:[]};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200); // measured before creating, below everything on the page
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.created.push(c.id);ids.newSet=set.id;}
set.description=D.desc;
const want={'Value':['TEXT','Tag'],'Show icon':['BOOLEAN',false],'Icon':['INSTANCE_SWAP',IC.id]};
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const n of D.props)if(!K[n])K[n]=set.addComponentProperty(n,want[n][0],want[n][1]);
async function build(c,it){CUR=c;for(const k of [...c.children])k.remove();
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.clipsContent=false;c.fills=[];c.strokes=[];
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(D.F.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(D.F.px));
 c.setBoundVariable('itemSpacing',V(D.F.gap));rad(c,V(it.rd));
 const i=IC.createInstance();i.name='Icon';c.appendChild(i);i.setBoundVariable('width',V(D.F.isz));i.setBoundVariable('height',V(D.F.isz));
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(IC.name+': no Shape layer, icon colour cannot be set');sh.fills=[paint(V(it.fg))];
 const t=figma.createText();c.appendChild(t);await t.setTextStyleIdAsync(TS.id);t.characters='Tag';t.autoRename=false;t.name='Label';t.fills=[paint(V(it.fg))];
 i.visible=false; // property default before the absolute layer is sized
 const bg=figma.createRectangle();bg.name='Background';c.appendChild(bg);bg.layoutPositioning='ABSOLUTE';bg.resize(c.width,c.height);bg.x=0;bg.y=0;bg.constraints={horizontal:'STRETCH',vertical:'STRETCH'};c.insertChild(0,bg);
 rad(bg,V(it.rd));bg.fills=[paint(V(it.bg))];if(it.bo)bg.setBoundVariable('opacity',V(it.bo));else{bg.setBoundVariable('opacity',null);bg.opacity=1;} // Dark: color-mix 16% → layer opacity
 t.componentPropertyReferences={characters:K['Value']};i.componentPropertyReferences={visible:K['Show icon'],mainComponent:K['Icon']};
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c){ids.rebuilt.push(c.id);}else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created.push(c.id);}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {set:set.id,of:IT.length,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length};