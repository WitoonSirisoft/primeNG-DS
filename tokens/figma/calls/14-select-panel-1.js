const D={"OPT":[["default","none"],["focus","none"],["selected","none"],["selected-focus","none"],["default","blank"],["focus","blank"],["default","checked"],["focus","checked"]],"PANELS":[{"content":"options","rows":[["o","New York","default"],["o","Rome","selected-focus"],["o","London","default"],["o","Istanbul","default"],["o","Paris","default"]]},{"content":"grouped","rows":[["g","Italy"],["o","Rome","selected-focus"],["o","Milan","default"],["g","United Kingdom"],["o","London","default"],["o","Manchester","default"]]},{"content":"empty"}],"W":196,"LW":187};
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Select/Text base','Select/Group']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES=(await figma.getLocalEffectStylesAsync()).find(s=>s.name==='select/overlay/shadow');if(!ES)throw new Error('Missing effect style select/overlay/shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const CHECK=ip.findOne(x=>x.type==='COMPONENT'&&x.name==='Icon/check');
const IF=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='IconField');const IFV=IF&&IF.children.find(c=>c.name==='Icon position=right, Size=base');if(!IFV)throw new Error('IconField right/base missing');
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
async function ensureSet(name,first){let s=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===name);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);const y=below();s=figma.combineAsVariants([c],pg);s.name=name;s.x=0;s.y=y;}return s;}
const props=(s,list)=>{const K={};for(const k in s.componentPropertyDefinitions)K[k.split('#')[0]]=k;for(const [n,t,d] of list)if(!K[n])K[n]=s.addComponentProperty(n,t,d);return K;};
const setP=(i,o)=>{const K={};for(const k in i.componentProperties)K[k.split('#')[0]]=k;const x={};for(const k in o)x[K[k]]=o[k];i.setProperties(x);};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name||'Text';t.fills=[paint(V(col))];return t;};

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

const OK={};let GK={},PK={};const out={};
async function build0(c,it){CUR=c;
 if(it.kind==='option'){const o='select/option/';
  c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(D.LW,c.height);c.fills=[];c.clipsContent=true;rad(c,V(o+'border-radius'));
  for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(o+'padding-y'));c.setBoundVariable('paddingRight',V(o+'padding-x'));
  c.setBoundVariable('paddingLeft',V(it.check==='none'?o+'padding-x':o+'check-padding-left'));if(it.check!=='none')c.setBoundVariable('itemSpacing',V('select/checkmark/gutter-end'));
  const bgv={focus:o+'focus-background',selected:o+'selected-background','selected-focus':o+'selected-focus-background'}[it.state];
  if(bgv){const bg=figma.createRectangle();bg.name='Background';c.appendChild(bg);bg.layoutPositioning='ABSOLUTE';bg.resize(c.width,c.height);bg.x=0;bg.y=0;bg.constraints={horizontal:'STRETCH',vertical:'STRETCH'};
   rad(bg,V(o+'border-radius'));bg.fills=[paint(V(bgv))];if(VB[bgv+'-opacity'])bg.setBoundVariable('opacity',V(bgv+'-opacity'));} // color-mix → layer opacity (as Tag)
  if(it.check==='checked'){const i=CHECK.createInstance();i.name='Check';c.appendChild(i);i.setBoundVariable('width',V('icon-size'));i.setBoundVariable('height',V('icon-size'));i.findOne(x=>x.name==='Shape').fills=[paint(V('select/checkmark/color'))];}
  if(it.check==='blank'){const b=figma.createFrame();b.name='Blank';c.appendChild(b);b.fills=[];b.resize(14,14);b.setBoundVariable('width',V('icon-size'));b.setBoundVariable('height',V('icon-size'));} // .p-select-option-blank-icon keeps labels aligned
  const fg={default:o+'color',focus:o+'focus-color',selected:o+'selected-color','selected-focus':o+'selected-focus-color'}[it.state];
  const t=await txt(c,'Option','Select/Text base',fg,'Label');t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';t.textTruncation='ENDING';t.maxLines=1;REF(t,{characters:OK['Label']});
  const B=c.findChild(x=>x.name==='Background');if(B){B.resize(c.width,c.height);B.x=0;B.y=0;}}
 else if(it.kind==='group'){const g='select/option-group/';
  c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(D.LW,c.height);c.fills=[paint(V(g+'background'))];
  for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(g+'padding-y'));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(g+'padding-x'));
  const t=await txt(c,'Group','Select/Group',g+'color','Label');t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';REF(t,{characters:GK['Label']});}
 else{ // panel
  c.layoutMode='VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.resize(D.W,c.height);c.clipsContent=true;
  c.fills=[paint(V('select/overlay/background'))];c.strokes=[paint(V('select/overlay/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;rad(c,V('select/overlay/border-radius'));await c.setEffectStyleIdAsync(ES.id);
  const h=figma.createFrame();h.name='Header';c.appendChild(h);h.layoutMode='HORIZONTAL';h.fills=[];h.counterAxisSizingMode='AUTO';h.layoutSizingHorizontal='FILL';
  for(const sd of ['Top','Right','Bottom','Left'])h.setBoundVariable('padding'+sd,V('select/list/header/padding-'+sd.toLowerCase()));
  const f=IFV.createInstance();f.name='Filter';h.appendChild(f);f.layoutSizingHorizontal='FILL';const inn=f.findOne(n=>n.type==='INSTANCE'&&n.name==='InputText');setP(inn,{Content:'empty'}); // filter input is empty when the panel opens
  h.visible=false;REF(h,{visible:PK['Filter']});
  const l=figma.createFrame();l.name='List';c.appendChild(l);l.layoutMode='VERTICAL';l.fills=[];l.primaryAxisSizingMode='AUTO';l.layoutSizingHorizontal='FILL';
  for(const k of ['paddingTop','paddingBottom'])l.setBoundVariable(k,V('select/list/padding-y'));for(const k of ['paddingLeft','paddingRight'])l.setBoundVariable(k,V('select/list/padding-x'));l.setBoundVariable('itemSpacing',V('select/list/gap'));
  if(it.content==='empty'){const e=figma.createFrame();e.name='Empty message';l.appendChild(e);e.layoutMode='HORIZONTAL';e.fills=[];e.counterAxisSizingMode='AUTO';e.layoutSizingHorizontal='FILL';
   for(const k of ['paddingTop','paddingBottom'])e.setBoundVariable(k,V('select/empty-message/padding-y'));for(const k of ['paddingLeft','paddingRight'])e.setBoundVariable(k,V('select/empty-message/padding-x'));
   const t=await txt(e,'No results found','Select/Text base','select/overlay/color','Label');t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';}
  else for(const [i,[kind,label,state]] of it.rows.entries()){const n=(kind==='g'?GROUP:OPTS[state]).createInstance();n.name=kind==='g'?'Group '+label:label;l.appendChild(n);n.layoutSizingHorizontal='FILL';setP(n,{Label:label});}}
 c.x=it.x;c.y=it.y;}
// Select Option
const os=await ensureSet('Select Option','State='+D.OPT[0][0]+', Check='+D.OPT[0][1]);os.description='PrimeNG: <p-select> option (.p-select-option) | Version: 0.1.0 | Status: experimental | State selected / selected-focus = no checkmark mode; Check blank / checked = checkmark mode (selected highlight is not used there, PrimeNG: selected && !checkmark) | Focus = hover or keyboard focus';
Object.assign(OK,props(os,[['Label','TEXT','Option']]));
const oBy={};for(const c of os.children)oBy[c.name]=c;let i=0;
for(const [state,check] of D.OPT){const n='State='+state+', Check='+check;let c=oBy[n];if(!c){c=figma.createComponent();c.name=n;os.appendChild(c);}await build(c,{kind:'option',state,check,x:24,y:24+i*48});i++;}
let mx=0,my=0;for(const c of os.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}os.resizeWithoutConstraints(mx+24,my+24);
const OPTS={};for(const c of os.children)OPTS[c.name.split(', ')[0].split('=')[1]+(c.name.endsWith('none')?'':'|'+c.name.split('Check=')[1])]=c;
// Select Option Group (single component)
let GROUP=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Select Option Group');if(!GROUP){GROUP=figma.createComponent();GROUP.name='Select Option Group';pg.appendChild(GROUP);GROUP.x=0;GROUP.y=below();}
GROUP.description='PrimeNG: <p-select> option group header (.p-select-option-group) | Version: 0.1.0 | Status: experimental | Edit Label';
GK=props(GROUP,[['Label','TEXT','Group']]);const gy=GROUP.y,gx=GROUP.x;await build(GROUP,{kind:'group',x:gx,y:gy});
// Select Panel
const ps=await ensureSet('Select Panel','Content=options');ps.description='PrimeNG: <p-select> overlay (.p-select-overlay) | Story: components-select--open | Version: 0.1.0 | Status: experimental | Filter = [filter]="true" (IconField with search icon) | Content grouped = [group] + optionGroupLabel/Children | empty = empty message | Width = field width (min-width 100%) | Swap option State / Check per row; checkmark mode: Check blank on every row, checked on the selected one';
PK=props(ps,[['Filter','BOOLEAN',false]]);
const pBy={};for(const c of ps.children)pBy[c.name]=c;let px=24;
for(const it of D.PANELS){const n='Content='+it.content;let c=pBy[n];if(!c){c=figma.createComponent();c.name=n;ps.appendChild(c);}it.kind='panel';it.x=px;it.y=24;await build(c,it);px+=D.W+40;}
mx=0;my=0;for(const c of ps.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}ps.resizeWithoutConstraints(mx+24,my+24);
return {sync:SY,option:os.id,group:GROUP.id,panel:ps.id,sizes:[...os.children,GROUP,...ps.children].map(c=>c.name+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2))};