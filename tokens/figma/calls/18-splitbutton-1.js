const A={"severity":["primary","secondary","success","info","warn","danger","help","contrast"],"variant":["solid","outlined","text"],"size":["small","base","large"],"rounded":["false","true"]};const IT=[];{let row=0;for(const severity of A.severity)for(const variant of A.variant){let col=0;for(const rounded of A.rounded)for(const size of A.size){IT.push({n:'Severity='+severity+', Variant='+variant+', Size='+size+', Rounded='+rounded,severity,variant,size,rounded,x:24+col*150,y:24+row*64});col++;}row++;}}
if(IT.length!==144)throw new Error('variant count');const D={from:0,to:36};
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(!ES['splitbutton/raised-shadow'])throw new Error('Missing effect style splitbutton/raised-shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const CHEV=ip.findOne(x=>x.type==='COMPONENT'&&x.name==='Icon/chevron-down');if(!CHEV)throw new Error('Missing Icon/chevron-down');
const SET=n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing set '+n);return s;};
const BTN=SET('Button');
const VAR=(s,w)=>{const c=s.children.find(c=>Object.entries(w).every(([k,v])=>c.variantProperties[k]===v));if(!c)throw new Error(s.name+' '+JSON.stringify(w));return c;};
const P=(inst,vals)=>{const K={};for(const k in inst.componentProperties)K[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals))if(K[k])o[K[k]]=v;inst.setProperties(o);};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const CLEAR={type:'SOLID',color:{r:0,g:0,b:0},opacity:0};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
// corners of a nested Button part: root + its Background / Shadow / Focus ring layers (all share the button radius)
const corners=(inst,keys,val,ring)=>{for(const n of [inst,...['Background','Shadow'].map(x=>inst.findChild(y=>y.name===x)).filter(Boolean)])for(const k of keys){n.setBoundVariable(k,null);if(typeof val==='number')n[k]=val;else n.setBoundVariable(k,val);}
 const fr=inst.findChild(y=>y.name==='Focus ring');if(fr)for(const k of keys){fr.setBoundVariable(k,null);if(typeof ring==='number')fr[k]=ring;else fr.setBoundVariable(k,ring);}};

figma.skipInvisibleInstanceChildren=false; // hidden instances (e.g. an icon off by default) must be synced too
const SY={kept:0,added:0,removed:0,writes:0};
const REFS=new Map();const REF=(node,refs)=>{REFS.set(node,refs);};
const SYP=['layoutWrap','primaryAxisAlignItems','counterAxisAlignItems','itemSpacing','counterAxisSpacing','paddingTop','paddingBottom','paddingLeft','paddingRight','itemReverseZIndex','strokesIncludedInLayout','clipsContent',
 'fills','strokes','strokeWeight','strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight','strokeAlign','strokeCap','strokeJoin','dashPattern','effects',
 'topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius','cornerSmoothing','opacity','blendMode','isMask','rotation','minWidth','maxWidth','minHeight','maxHeight'];
const SYT=['textAlignHorizontal','textAlignVertical','textAutoResize','textTruncation','maxLines','paragraphSpacing'];
const SKIPB=['fills','strokes','effects','componentProperties','textRangeFills'];
const stable=v=>JSON.stringify(v,(k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.keys(x).sort().reduce((o,q)=>(o[q]=x[q],o),{}):x);
const same=(a,b)=>stable(a)===stable(b); // key order does not count (refs {a,b} = {b,a})
const tryset=(o,k,v)=>{try{if(!same(o[k],v)){o[k]=v;SY.writes++;}}catch(e){}};
function setRefs(o,r){if(!same(o.componentPropertyReferences||{},r))try{o.componentPropertyReferences=r;SY.writes++;}catch(e){}}
function applyRefs(x){if(REFS.has(x))setRefs(x,REFS.get(x));if('children' in x&&x.type!=='INSTANCE')for(const k of x.children)applyRefs(k);}
async function syCopy(o,n,inInst,root){
 if(o.type==='INSTANCE'){const m=await n.getMainComponentAsync();const om=await o.getMainComponentAsync();if(m&&om&&m.id!==om.id){o.swapComponent(m);SY.writes++;}
  const P={};const op=o.componentProperties;for(const [k,v] of Object.entries(n.componentProperties))if(!op[k]||!same(op[k].value,v.value))P[k]=v.value;
  if(Object.keys(P).length){SY.writes++;try{o.setProperties(P);}catch(e){for(const k in P)try{o.setProperties({[k]:P[k]});}catch(e2){}}}}
 if(!root)tryset(o,'name',n.name);
 if('layoutMode' in n)tryset(o,'layoutMode',n.layoutMode);
 if('layoutPositioning' in n)tryset(o,'layoutPositioning',n.layoutPositioning);
 if(o.type!=='TEXT'&&(Math.abs(o.width-n.width)>0.001||Math.abs(o.height-n.height)>0.001))try{o.resize(n.width,n.height);SY.writes++;}catch(e){}
 for(const k of ['primaryAxisSizingMode','counterAxisSizingMode'])if(k in n)tryset(o,k,n[k]);
 for(const k of SYP)if(k in n&&n[k]!==figma.mixed)tryset(o,k,n[k]);
 // Figma: setting one side weight can reset the others, so when any side differs write all four in order
 const SW=['strokeTopWeight','strokeRightWeight','strokeBottomWeight','strokeLeftWeight'];
 if('strokeTopWeight' in n&&SW.some(k=>o[k]!==n[k])){for(const k of SW)o[k]=n[k];SY.writes++;}
 if(o.type==='TEXT'){
  if(n.textStyleId&&n.textStyleId!==figma.mixed){if(o.textStyleId!==n.textStyleId){await figma.loadFontAsync(n.fontName);await o.setTextStyleIdAsync(n.textStyleId);SY.writes++;}}
  else for(const k of ['fontSize','lineHeight','letterSpacing'])tryset(o,k,n[k]);
  if(!same(o.fontName,n.fontName)||o.characters!==n.characters){await figma.loadFontAsync(o.fontName===figma.mixed?n.fontName:o.fontName);await figma.loadFontAsync(n.fontName);
   tryset(o,'fontName',n.fontName);if(o.characters!==n.characters){o.characters=n.characters;SY.writes++;}}
  for(const k of SYT)if(k in n)tryset(o,k,n[k]);tryset(o,'autoRename',n.autoRename);tryset(o,'fills',n.fills);}
 // variable bindings (paints carry their own binding; the rest is per field)
 const nb=n.boundVariables||{},ob=o.boundVariables||{};const alias=a=>Array.isArray(a)?a[0]:a;
 for(const k of Object.keys(ob))if(!SKIPB.includes(k)&&!(k in nb))try{o.setBoundVariable(k,null);SY.writes++;}catch(e){}
 for(const [k,a] of Object.entries(nb)){if(SKIPB.includes(k))continue;const al=alias(a);if(!al||!al.id)continue;
  if(alias(ob[k])&&alias(ob[k]).id===al.id)continue;try{const v=await figma.variables.getVariableByIdAsync(al.id);o.setBoundVariable(k,v);SY.writes++;}catch(e){}}
 if('effectStyleId' in n&&n.effectStyleId&&o.effectStyleId!==n.effectStyleId)try{await o.setEffectStyleIdAsync(n.effectStyleId);SY.writes++;}catch(e){}
 if(!root){for(const k of ['layoutSizingHorizontal','layoutSizingVertical','layoutGrow','layoutAlign'])if(k in n)tryset(o,k,n[k]);
  if('constraints' in n)tryset(o,'constraints',n.constraints);tryset(o,'x',n.x);tryset(o,'y',n.y);}
 if('children' in n)await syncKids(o,[...o.children],[...n.children],inInst||o.type==='INSTANCE');
 if(!inInst&&!root)setRefs(o,REFS.get(n)||{});
 tryset(o,'visible',n.visible);
 if(o.type==='INSTANCE'&&'isExposedInstance' in n)tryset(o,'isExposedInstance',n.isExposedInstance);}
async function syncKids(parent,olds,news,inInst){const used=new Set();const final=[];
 for(const nw of news){const od=olds.find(o=>!used.has(o)&&o.name===nw.name&&o.type===nw.type);if(od){used.add(od);await syCopy(od,nw,inInst,false);final.push(od);SY.kept++;}else{final.push(nw);SY.added++;}}
 if(inInst)return;
 for(const o of olds)if(!used.has(o)){o.remove();SY.removed++;}
 final.forEach((x,i)=>{if(x.parent!==parent){parent.appendChild(x);applyRefs(x);}if(parent.children.indexOf(x)!==i)parent.insertChild(i,x);});}

async function build(c,it){const tmp=figma.createComponent();figma.currentPage.appendChild(tmp);tmp.name=c.name;REFS.clear();
 try{await build0(tmp,it);await syCopy(c,tmp,false,true);c.x=tmp.x;c.y=tmp.y;}finally{tmp.remove();}}

async function build0(c,it){CUR=c;const rnd=it.rounded==='true';
 c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 const R=rnd?V('splitbutton/rounded-border-radius'):V('splitbutton/border-radius');for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])c.setBoundVariable(k,R);
 const w={Severity:it.severity,Variant:it.variant,Size:it.size,State:'default',Rounded:'false'};
 const main=VAR(BTN,w).createInstance();main.name='Button';c.appendChild(main);P(main,{Label:'Save',Raised:false,'Icon left':false,'Icon right':false});
 const menu=VAR(BTN,w).createInstance();menu.name='Dropdown';c.appendChild(menu);P(menu,{'Show label':false,'Icon left':true,'Icon right':false,Icon:CHEV.id,Raised:false});
 // .p-splitbutton-button: end corners 0, no end border; .p-splitbutton-dropdown: start corners 0 (focus ring keeps 0 inside too)
 corners(main,['topRightRadius','bottomRightRadius'],0,0);corners(menu,['topLeftRadius','bottomLeftRadius'],0,0);
 main.strokeTopWeight=1;main.strokeRightWeight=0;main.strokeBottomWeight=1;main.strokeLeftWeight=1;
 if(rnd){corners(main,['topLeftRadius','bottomLeftRadius'],V('splitbutton/rounded-border-radius'),V('button/rounded-focus-ring-radius'));corners(menu,['topRightRadius','bottomRightRadius'],V('splitbutton/rounded-border-radius'),V('button/rounded-focus-ring-radius'));}
 main.isExposedInstance=true;menu.isExposedInstance=true;
 // .p-splitbutton-raised: shadow on the whole control (solid only, as Button #42)
 const sh=figma.createRectangle();sh.name='Shadow';c.appendChild(sh);sh.layoutPositioning='ABSOLUTE';sh.resize(c.width,c.height);sh.x=0;sh.y=0;sh.constraints={horizontal:'STRETCH',vertical:'STRETCH'};c.insertChild(0,sh);
 sh.fills=[it.variant==='solid'?paint(V('button/'+it.severity+'/background')):CLEAR];for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])sh.setBoundVariable(k,R);
 await sh.setEffectStyleIdAsync(ES['splitbutton/raised-shadow'].id);sh.visible=false;REF(sh,{visible:K['Raised']});
 c.x=it.x;c.y=it.y;}
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='SplitButton');
if(!set){const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);const y=below();set=figma.combineAsVariants([c],pg);set.name='SplitButton';set.x=0;set.y=y;}
set.description='PrimeNG: <p-splitbutton> | Story: components-splitbutton--playground | Version: 0.1.0 | Status: experimental (#90) | Nested Button (label) + Dropdown (Button, label hidden, chevron-down) are exposed: set Label, Icon and State (hover / disabled / loading) on each part — in code each part hovers on its own; disabled sets both | Raised = splitbutton raised shadow on the whole control';
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;if(!K['Raised'])K['Raised']=set.addComponentProperty('Raised','BOOLEAN',false);
const by={};for(const c of set.children)by[c.name]=c;let created=0;
for(const it of IT.slice(D.from,D.to)){let c=by[it.n];if(!c){c=figma.createComponent();c.name=it.n;set.appendChild(c);created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes={};for(const c of set.children.filter(c=>IT.slice(D.from,D.to).some(i=>i.n===c.name))){const k=c.name.match(/Size=\w+/)[0]+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {set:set.id,range:[D.from,D.to],created,inSet:set.children.length,sizes,sync:SY};