const IT=[{"n":"Severity=info","s":"info","icon":"Icon/info-circle","text":["Toast Summary","Toast detail"],"sakai":["Info Message","PrimeNG rocks"],"mixed":true,"shadow":"toast/info/shadow","x":24,"y":24},{"n":"Severity=success","s":"success","icon":"Icon/check","text":["Toast Summary","Toast detail"],"sakai":["Success Message","Message sent"],"mixed":true,"shadow":"toast/success/shadow","x":24,"y":120},{"n":"Severity=warn","s":"warn","icon":"Icon/exclamation-triangle","text":["Toast Summary","Toast detail"],"sakai":["Warn Message","There are unsaved changes"],"mixed":true,"shadow":"toast/warn/shadow","x":24,"y":216},{"n":"Severity=error","s":"error","icon":"Icon/times-circle","text":["Toast Summary","Toast detail"],"sakai":["Error Message","Validation failed"],"mixed":true,"shadow":"toast/error/shadow","x":24,"y":312},{"n":"Severity=secondary","s":"secondary","icon":"Icon/info-circle","text":["Toast Summary","Toast detail"],"sakai":["Secondary Message","Message content"],"mixed":false,"shadow":"toast/secondary/shadow (Light)","x":24,"y":408},{"n":"Severity=contrast","s":"contrast","icon":"Icon/info-circle","text":["Toast Summary","Toast detail"],"sakai":["Contrast Message","Message content"],"mixed":false,"shadow":"toast/contrast/shadow (Light)","x":24,"y":504}];
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Toast/Summary','Toast/Detail']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;for(const it of IT)if(!ES[it.shadow])throw new Error('Missing effect style '+it.shadow);
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const CLEAR={type:'SOLID',color:{r:0,g:0,b:0},opacity:0}; // literal 'transparent' (#42)
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,size,col)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V(size));i.setBoundVariable('height',V(size));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const abs=(c,name)=>{const r=figma.createRectangle();r.name=name;c.appendChild(r);r.layoutPositioning='ABSOLUTE';r.resize(c.width,c.height);r.x=0;r.y=0;r.constraints={horizontal:'STRETCH',vertical:'STRETCH'};for(const k of RAD)r.setBoundVariable(k,V('toast/border-radius'));return r;};

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

async function build0(c,it){CUR=c;const p='toast/'+it.s+'/';
 c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='MIN';c.clipsContent=false;c.fills=[];
 c.resize(350,c.height);c.setBoundVariable('width',V('toast/width'));
 for(const k of ['paddingTop','paddingBottom','paddingLeft','paddingRight'])c.setBoundVariable(k,V('toast/content/padding'));c.setBoundVariable('itemSpacing',V('toast/content/gap'));
 c.strokes=[CLEAR];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true; // the 1px border adds to the size (drawn by the Border layer)
 const ic=icon(it.icon,'toast/icon/size',p+'color');ic.name='Icon';c.appendChild(ic);REF(ic,{visible:K['Show icon']});
 const col=figma.createFrame();col.name='Text';c.appendChild(col);col.layoutMode='VERTICAL';col.fills=[];col.primaryAxisSizingMode='AUTO';col.layoutSizingHorizontal='FILL';col.setBoundVariable('itemSpacing',V('toast/text/gap'));
 const su=await txt(col,it.text[0],'Toast/Summary',p+'color','Summary');su.layoutSizingHorizontal='FILL';su.textAutoResize='HEIGHT';REF(su,{characters:K['Summary']});
 const dw=figma.createFrame();dw.name='Detail';col.appendChild(dw);dw.layoutMode='VERTICAL';dw.fills=[];dw.primaryAxisSizingMode='AUTO';dw.layoutSizingHorizontal='FILL'; // stays when the text is hidden: the gap remains, as in code
 const de=await txt(dw,it.text[1],'Toast/Detail',p+'detail-color','Text');de.layoutSizingHorizontal='FILL';de.textAutoResize='HEIGHT';REF(de,{characters:K['Detail'],visible:K['Show detail']});
 const sp=figma.createFrame();sp.name='Spacer';dw.appendChild(sp);sp.fills=[];sp.resize(10,0.01);sp.layoutSizingHorizontal='FILL'; // Figma keeps a hug frame's size when its only child is hidden; this keeps the wrapper (and the gap) at ~0 when Show detail is off
 const cw=figma.createFrame();cw.name='Close';c.appendChild(cw);cw.layoutMode='NONE';cw.fills=[];cw.clipsContent=false;cw.resize(24.5,18.375);cw.setBoundVariable('width',V('toast/close-button/width')); // height 18.375 = 24.5 − 25%: margin-top −25% means the button takes 75% of its height in the row (literal, derived)
 const cb=figma.createFrame();cb.name='Button';cw.appendChild(cb);cb.layoutMode='HORIZONTAL';cb.primaryAxisAlignItems='CENTER';cb.counterAxisAlignItems='CENTER';cb.primaryAxisSizingMode='FIXED';cb.counterAxisSizingMode='FIXED';cb.resize(24.5,24.5);
 cb.setBoundVariable('width',V('toast/close-button/width'));cb.setBoundVariable('height',V('toast/close-button/height'));for(const k of RAD)cb.setBoundVariable(k,V('toast/close-button/width'));cb.fills=[];
 cb.x=6.125;cb.y=-6.125; // margin -25% 0 0 0; right -25% (of the 24.5 wrapper)
 const ci=icon('Icon/times','toast/close-icon/size',p+'color');ci.name='Icon';cb.appendChild(ci);REF(cw,{visible:K['Closable']});
 // layers behind: Shadow (transparent, effect style drawn behind), Background (+ blur), Border (inside stroke)
 const sh=abs(c,'Shadow');sh.fills=[CLEAR];await sh.setEffectStyleIdAsync(ES[it.shadow].id);
 const bg=abs(c,'Background');bg.fills=[paint(V(p+'background'))];if(it.mixed)bg.setBoundVariable('opacity',V(p+'background-opacity'));
 bg.effects=[figma.variables.setBoundVariableForEffect({type:'BACKGROUND_BLUR',radius:1.5,visible:true},'radius',V('toast/blur'))];
 const bo=abs(c,'Border');bo.fills=[];bo.strokes=[paint(V(p+'border-color'))];bo.strokeAlign='INSIDE';bo.setBoundVariable('strokeWeight',V('toast/border-width'));if(it.mixed)bo.setBoundVariable('opacity',V(p+'border-color-opacity'));
 c.insertChild(0,bo);c.insertChild(0,bg);c.insertChild(0,sh);
 c.x=it.x;c.y=it.y;}
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Toast');
if(!set){const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);const y=below();set=figma.combineAsVariants([c],pg);set.name='Toast';set.x=0;set.y=y;}
set.description='PrimeNG: <p-toast> + MessageService.add({ severity, summary, detail, closable }) | Story: components-toast--playground | Version: 0.1.0 | Status: experimental (#94) | Summary → summary, Detail / Show detail → detail, Show icon → (icon), Closable → closable | Icon fixed per severity (#79); close button default state only (#77) | Stack toasts top-right with 1rem (14) between them';
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const [n,t,d] of [['Summary','TEXT','Toast Summary'],['Detail','TEXT','Toast detail'],['Show detail','BOOLEAN',true],['Show icon','BOOLEAN',true],['Closable','BOOLEAN',true]])if(!K[n])K[n]=set.addComponentProperty(n,t,d);
const by={};for(const c of set.children)by[c.name]=c;let created=0;
for(const it of IT){let c=by[it.n];if(!c){c=figma.createComponent();c.name=it.n;set.appendChild(c);created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {set:set.id,created,sizes:set.children.map(c=>c.name+' '+c.width+'x'+c.height.toFixed(2)),sync:SY};