// Plugin code for figma-content.mjs (Card, Divider, Accordion; DECISIONS #100). 
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
 // match by name + type; then, inside instances only, pair what is left by type in order: swapping an icon renames the nested
 // instance to its component name ("Icon" → "Icon/check"), and a name-only match would skip it (Dialog Save icon colour, 2026-11-26)
 const pick=[];for(const nw of news){const od=olds.find(o=>!used.has(o)&&o.name===nw.name&&o.type===nw.type);if(od)used.add(od);pick.push(od||null);}
 if(inInst)news.forEach((nw,i)=>{if(!pick[i]){const od=olds.find(o=>!used.has(o)&&o.type===nw.type);if(od){used.add(od);pick[i]=od;}}});
 for(let i=0;i<news.length;i++){const nw=news[i],od=pick[i];if(od){await syCopy(od,nw,inInst,false);final.push(od);SY.kept++;}else{final.push(nw);SY.added++;}}
 if(inInst)return;
 for(const o of olds)if(!used.has(o)){o.remove();SY.removed++;}
 final.forEach((x,i)=>{if(x.parent!==parent){parent.appendChild(x);applyRefs(x);}if(parent.children.indexOf(x)!==i)parent.insertChild(i,x);});}

async function build(c,it){const tmp=figma.createComponent();figma.currentPage.appendChild(tmp);tmp.name=c.name;REFS.clear();
 try{await build0(tmp,it);await syCopy(c,tmp,false,true);c.x=tmp.x;c.y=tmp.y;}finally{tmp.remove();}}
 and false are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Card/Title','Body/Paragraph','Body/Strong','Accordion/Header']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const P4=['Top','Right','Bottom','Left'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const rad=(f,n)=>{for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])f.setBoundVariable(k,V(n));};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,col)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V('icon-size'));i.setBoundVariable('height',V('icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const W=544,DW=384;
const LOREM_CARD='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const LOREM_ACC='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
/*HELPERS*/
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const sync=async(c,fn,it)=>{if(/*FRESH*/){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const comp=n=>{let c=pg.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c){c=figma.createComponent();c.name=n;pg.appendChild(c);}return c;};
const set=(n,first)=>{let s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);s=figma.combineAsVariants([c],pg);s.name=n;}return s;};
const variants=async(S,names,fn)=>{const by={};for(const c of S.children)by[c.name]=c;for(const [n,it] of names){let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}await sync(c,fn,it);}};
const grid=(S,cols)=>{S.layoutMode='HORIZONTAL';S.layoutWrap='WRAP';S.primaryAxisSizingMode='FIXED';S.counterAxisSizingMode='AUTO';S.itemSpacing=24;S.counterAxisSpacing=24;P4.forEach(s=>S['padding'+s]=24);let w=0;for(const c of S.children.slice(0,cols))w+=c.width+24;S.resize(w+24,S.height);};
const slotFor=(n,desc)=>{let s=pg.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!s){const ds=pg.findOne(x=>x.type==='COMPONENT'&&x.name==='Dialog Slot');if(!ds)throw new Error('Missing Dialog Slot');s=ds.clone();s.name=n;pg.appendChild(s);s.y=0;}s.description=desc;return s;};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const out={};

// ---------- Card ----------
const CS=slotFor('Card Slot','Placeholder for Card content (#100). In Card: turn on Show slot, then swap Slot to any component (it must hug, #84).');
const CA=comp('Card');
CA.description='Sakai layout card: <div class="card"> (assets/layout/_utils.scss) + title <div class="font-semibold text-xl mb-4"> | Story: components-card--playground | Version: 0.1.0 | Status: experimental (#100) | Title / Content text, or Show slot + swap Slot for any hugging component | Resize width freely (fluid) | Stack cards with gap layout/card/gap (2rem)';
K=props(CA,[['Title','TEXT','Card title'],['Show title','BOOLEAN',true],['Content','TEXT',LOREM_CARD],['Show content','BOOLEAN',true],['Show slot','BOOLEAN',false],['Slot','INSTANCE_SWAP',CS.id]]);
async function cardBuild(c){CUR=c;c.layoutMode='VERTICAL';c.resize(W,100);c.counterAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.clipsContent=false;
 pad(c,'layout/card/padding','layout/card/padding','layout/card/padding','layout/card/padding');c.setBoundVariable('itemSpacing',V('layout/card/title/margin-bottom'));c.fills=[paint(V('content/background'))];rad(c,'content/border-radius');
 const t=await txt(c,'Card title','Card/Title','text/color','Title');t.layoutAlign='STRETCH';t.textAutoResize='HEIGHT';REF(t,{characters:K['Title'],visible:K['Show title']});
 const b=await txt(c,LOREM_CARD,'Body/Paragraph','text/color','Content');b.layoutAlign='STRETCH';b.textAutoResize='HEIGHT';REF(b,{characters:K['Content'],visible:K['Show content']});
 const s=CS.createInstance();s.name='Slot';c.appendChild(s);s.visible=false;REF(s,{visible:K['Show slot'],mainComponent:K['Slot']});}
await sync(CA,cardBuild,{});out.card=CA.width+'x'+CA.height;

// ---------- Divider ----------
const DV=set('Divider','Layout=horizontal, Type=solid, Align=start');
DV.description='PrimeNG: <p-divider [layout] [type] [align]> | Story: components-divider--playground | Version: 0.1.0 | Status: experimental (#100) | Margins are drawn as padding (horizontal: 14 above/below; vertical: 14 left/right) | Content = projected content (e.g. <b>OR</b>), Label text | Align matters only with Content (start = left/top, end = right/bottom) | Horizontal: Fill width; vertical: Fill height of the row | Dashed/dotted = dash pattern close to the browser';
K=props(DV,[['Content','BOOLEAN',false],['Label','TEXT','OR']]);
const DASH={solid:[],dashed:[2.5,2.5],dotted:[1,1]}; // measured from the 2x captures
async function divBuild(c,it){CUR=c;const h=it.l==='horizontal';c.fills=[];c.clipsContent=false;c.layoutMode=h?'HORIZONTAL':'VERTICAL';
 if(h){c.resize(DW,28);c.primaryAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';pad(c,'divider/horizontal/margin-y','divider/horizontal/padding-x','divider/horizontal/margin-y','divider/horizontal/padding-x');}
 else{c.resize(28,120);c.primaryAxisSizingMode='FIXED';c.layoutSizingHorizontal='HUG';pad(c,'divider/vertical/padding-y','divider/vertical/margin-x','divider/vertical/padding-y','divider/vertical/margin-x');}
 c.counterAxisAlignItems='CENTER';c.primaryAxisAlignItems={start:'MIN',center:'CENTER',end:'MAX'}[it.a];
 const ln=figma.createVector();c.appendChild(ln);ln.name='Line';ln.layoutPositioning='ABSOLUTE';
 if(h){await ln.setVectorNetworkAsync({vertices:[{x:0,y:0},{x:c.width,y:0}],segments:[{start:0,end:1}],regions:[]});ln.x=0;ln.y=c.height/2;ln.constraints={horizontal:'STRETCH',vertical:'CENTER'};}
 else{await ln.setVectorNetworkAsync({vertices:[{x:0,y:0},{x:0,y:c.height}],segments:[{start:0,end:1}],regions:[]});ln.x=c.width/2;ln.y=0;ln.constraints={horizontal:'CENTER',vertical:'STRETCH'};}
 ln.strokes=[paint(V('divider/border-color'))];ln.strokeWeight=1;ln.dashPattern=DASH[it.t];
 const sp=figma.createFrame();sp.name='Spacer';c.appendChild(sp);sp.resize(0.01,0.01);sp.fills=[]; // keeps the hug size when Content is off (a frame whose only flow child is hidden does not shrink)
 const ct=figma.createFrame();ct.name='Content';c.appendChild(ct);ct.layoutMode='HORIZONTAL';ct.primaryAxisSizingMode='AUTO';ct.counterAxisSizingMode='AUTO';ct.fills=[paint(V('divider/content/background'))];ct.clipsContent=false;
 if(h)pad(ct,0,'divider/horizontal/content/padding-x',0,'divider/horizontal/content/padding-x');else pad(ct,'divider/vertical/content/padding-y',0,'divider/vertical/content/padding-y',0);
 const t=await txt(ct,'OR','Body/Strong','divider/content/color','Label');REF(t,{characters:K['Label']});ct.visible=false;REF(ct,{visible:K['Content']});}
{const L=[];for(const l of ['horizontal','vertical'])for(const t of ['solid','dashed','dotted'])for(const a of ['start','center','end'])L.push(['Layout='+l+', Type='+t+', Align='+a,{l,t,a}]);await variants(DV,L,divBuild);}
grid(DV,3);out.divider=[...new Set(DV.children.map(c=>c.width+'x'+c.height))];

// ---------- Accordion Panel ----------
const AS=slotFor('Accordion Slot','Placeholder for Accordion panel content (#100). In Accordion Panel: turn on Show slot, then swap Slot to any component (it must hug, #84).');
const AP=set('Accordion Panel','State=default, Expanded=false');
AP.description='PrimeNG: <p-accordion-panel> (header + content) | Story: components-accordion--playground | Version: 0.1.0 | Status: experimental (#100) | Expanded = open panel (p-accordionpanel-active) | hover = pointer over the header | disabled = [disabled], opacity disabled-opacity | Content text, or Show slot + swap Slot | Use inside Accordion (fills its width)';
K=props(AP,[['Header','TEXT','Header I'],['Content','TEXT',LOREM_ACC],['Show content','BOOLEAN',true],['Show slot','BOOLEAN',false],['Slot','INSTANCE_SWAP',AS.id]]);
async function panBuild(c,it){CUR=c;const ex=it.e==='true',hv=it.s==='hover';const pre=ex?(hv?'active-hover-':'active-'):(hv?'hover-':'');
 c.layoutMode='VERTICAL';c.resize(W,50);c.counterAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 c.strokes=[paint(V('accordion/panel/border-color'))];c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;for(const s of P4)c.setBoundVariable('stroke'+s+'Weight',V('accordion/panel/border-width-'+s.toLowerCase()));
 if(it.s==='disabled')c.setBoundVariable('opacity',V('disabled-opacity'));
 const hd=figma.createFrame();hd.name='Header';c.appendChild(hd);hd.layoutMode='HORIZONTAL';hd.layoutAlign='STRETCH';hd.layoutSizingHorizontal='FILL';hd.layoutSizingVertical='HUG';hd.primaryAxisAlignItems='SPACE_BETWEEN';hd.counterAxisAlignItems='CENTER';hd.clipsContent=false;
 const hp='accordion/header/padding';pad(hd,hp,hp,hp,hp);hd.fills=[paint(V('accordion/header/'+pre+'background'))];rad(hd,'accordion/header/border-radius');
 const t=await txt(hd,'Header I','Accordion/Header','accordion/header/'+pre+'color','Header');REF(t,{characters:K['Header']});
 const ic=icon(ex?'Icon/chevron-up':'Icon/chevron-down','accordion/header/toggle-icon/'+pre+'color');ic.name='Toggle icon';hd.appendChild(ic);
 if(ex){const ct=figma.createFrame();ct.name='Content';c.appendChild(ct);ct.layoutMode='VERTICAL';ct.layoutAlign='STRETCH';ct.counterAxisSizingMode='FIXED';ct.primaryAxisSizingMode='AUTO';ct.clipsContent=false;ct.itemSpacing=0;
  pad(ct,'accordion/content/padding-top','accordion/content/padding-right','accordion/content/padding-bottom','accordion/content/padding-left');ct.fills=[paint(V('accordion/content/background'))];
  const b=await txt(ct,LOREM_ACC,'Body/Paragraph','accordion/content/color','Content');b.layoutAlign='STRETCH';b.textAutoResize='HEIGHT';REF(b,{characters:K['Content'],visible:K['Show content']});
  const s=AS.createInstance();s.name='Slot';ct.appendChild(s);s.visible=false;REF(s,{visible:K['Show slot'],mainComponent:K['Slot']});}}
{const L=[];for(const e of ['false','true'])for(const s of ['default','hover','disabled'])L.push(['State='+s+', Expanded='+e,{s,e}]);await variants(AP,L,panBuild);}
grid(AP,3);out.panel=AP.children.map(c=>c.name.replace('State=','').replace(', Expanded=','/')+' '+c.height);
const APV=(s,e)=>AP.children.find(c=>c.name==='State='+s+', Expanded='+e);

// ---------- Accordion ----------
const AC=comp('Accordion');
AC.description='PrimeNG: <p-accordion [value]> | Story: components-accordion--playground | Version: 0.1.0 | Status: experimental (#100) | Panels are exposed: set Header / Expanded / State / content; Show panel 4 / 5 for more (or duplicate) | Several panels can be expanded ([multiple]) | Fills its parent width';
K=props(AC,[['Show panel 4','BOOLEAN',false],['Show panel 5','BOOLEAN',false]]);
async function accBuild(c){CUR=c;c.layoutMode='VERTICAL';c.resize(W,100);c.counterAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 const PN=[['Panel 1','true','Header I'],['Panel 2','false','Header II'],['Panel 3','false','Header III'],['Panel 4','false','Header IV',1],['Panel 5','false','Header V',1]];
 for(const [n,e,h,hid] of PN){const i=APV('default',e).createInstance();i.name=n;c.appendChild(i);i.layoutAlign='STRETCH';i.isExposedInstance=true;if(h!=='Header I')P(i,{Header:h});if(hid){i.visible=false;REF(i,{visible:K['Show '+n.toLowerCase()]});}}}
await sync(AC,accBuild,{});out.accordion=AC.width+'x'+AC.height;
for(const n of [CA,CS,DV,AP,AS,AC])if(n.y<1)place(n);
return {ids:{card:CA.id,cardSlot:CS.id,divider:DV.id,panel:AP.id,accSlot:AS.id,accordion:AC.id},...out};
