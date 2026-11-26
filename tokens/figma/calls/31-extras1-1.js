// Plugin code for figma-extras1.mjs (Tooltip, Timeline, Stepper; DECISIONS #102). Placeholders HELPERS / FRESH (in comment markers) are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Body/Base','Stepper/Number','Stepper/Title']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const P4=['Top','Right','Bottom','Left'];const CR=['topLeftRadius','topRightRadius','bottomRightRadius','bottomLeftRadius'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const rad=(f,n)=>{for(const k of CR)f.setBoundVariable(k,V(n));};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const fr=(parent,name,dir)=>{const f=figma.createFrame();f.name=name;parent.appendChild(f);f.layoutMode=dir;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.fills=[];f.clipsContent=false;return f;};

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

let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const sync=async(c,fn,it)=>{if(false){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const set=(n,first)=>{let s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);s=figma.combineAsVariants([c],pg);s.name=n;}return s;};
const variants=async(S,names,fn)=>{const by={};for(const c of S.children)by[c.name]=c;for(const [n,it] of names){let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}await sync(c,fn,it);}};
const row=(S,gap)=>{S.layoutMode='HORIZONTAL';S.layoutWrap='WRAP';S.primaryAxisSizingMode='AUTO';S.counterAxisSizingMode='AUTO';S.itemSpacing=gap||32;S.counterAxisSpacing=32;S.counterAxisAlignItems='CENTER';P4.forEach(s=>S['padding'+s]=24);};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const out={};

// ---------- Tooltip ----------
const TT=set('Tooltip','Position=top');
TT.description='PrimeNG: pTooltip [tooltipPosition] | Story: components-tooltip--playground | Version: 0.1.0 | Status: experimental (#102) | Position = side of the target the tooltip sits on (arrow points at the target) | Text wraps at tooltip/max-width (12.5rem) | Place it tooltip/gutter (0.25rem) from the target edge';
K=props(TT,[['Text','TEXT','Click to proceed']]);
const G=3.5; // tooltip/gutter: arrow size (border-width) — drawn as a vector triangle
async function ttBuild(c,it){CUR=c;const p=it.p,vert=p==='top'||p==='bottom';c.layoutMode=vert?'VERTICAL':'HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 const box=figma.createFrame();c.appendChild(box);box.name='Text box';box.layoutMode='HORIZONTAL';box.primaryAxisSizingMode='AUTO';box.counterAxisSizingMode='AUTO';pad(box,'tooltip/padding-y','tooltip/padding-x','tooltip/padding-y','tooltip/padding-x');
 box.fills=[paint(V('tooltip/background'))];rad(box,'tooltip/border-radius');await box.setEffectStyleIdAsync(ES['tooltip/shadow'].id);try{box.setBoundVariable('maxWidth',V('tooltip/max-width'));}catch(e){box.maxWidth=175;}
 const t=await txt(box,'Click to proceed','Body/Base','tooltip/color','Text');t.textAutoResize='WIDTH_AND_HEIGHT';t.maxWidth=154;REF(t,{characters:K['Text']}); // 175 max-width - 2 × 10.5 padding: long text wraps
 const ar=figma.createVector();ar.name='Arrow';const pts={top:[[0,0],[2*G,0],[G,G]],bottom:[[G,0],[2*G,G],[0,G]],left:[[0,0],[G,G],[0,2*G]],right:[[G,0],[G,2*G],[0,G]]}[p];
 await ar.setVectorNetworkAsync({vertices:pts.map(([x,y])=>({x,y})),segments:[{start:0,end:1},{start:1,end:2},{start:2,end:0}],regions:[{windingRule:'NONZERO',loops:[[0,1,2]]}]});ar.fills=[paint(V('tooltip/background'))];ar.strokes=[];
 if(p==='top'||p==='left')c.appendChild(ar);else c.insertChild(0,ar);}
await variants(TT,['top','right','bottom','left'].map(p=>['Position='+p,{p}]),ttBuild);row(TT);out.tooltip=TT.children.map(c=>c.name.slice(9)+' '+c.width+'x'+c.height);

// ---------- Timeline Event ----------
const TE=set('Timeline Event','Layout=vertical, Align=start, Position=middle');
TE.description='PrimeNG: <p-timeline> event (opposite | separator (marker + connector) | content) | Story: components-timeline--playground | Version: 0.1.0 | Status: experimental (#102) | Layout vertical / horizontal; Align start = left (vertical) or top (horizontal), end = right / bottom (alternate = mix both) | Position last = no connector, no min-height | Opposite and content are flex 1 (the opposite column stays even when empty: Show opposite only hides the text)';
K=props(TE,[['Content','TEXT','Ordered'],['Opposite','TEXT','15/10/2020 10:30'],['Show opposite','BOOLEAN',false]]);
async function teBuild(c,it){CUR=c;const v=it.l==='vertical',last=it.pos==='last',end=it.a==='end';c.layoutMode=v?'HORIZONTAL':'VERTICAL';c.clipsContent=false;c.fills=[];c.itemSpacing=0;
 if(v){c.resize(528,70);c.primaryAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';if(!last){try{c.setBoundVariable('minHeight',V('timeline/event/min-height'));}catch(e){c.minHeight=70;}}}
 else{c.resize(132,80);c.counterAxisSizingMode='FIXED';c.primaryAxisSizingMode='AUTO';}
 const side=(name)=>{const f=fr(c,name,v?'VERTICAL':'HORIZONTAL');if(v){f.layoutGrow=1;f.layoutAlign='STRETCH';pad(f,'timeline/vertical/event-content/padding-y','timeline/vertical/event-content/padding-x','timeline/vertical/event-content/padding-y','timeline/vertical/event-content/padding-x');}
  else{f.layoutAlign='STRETCH';pad(f,'timeline/horizontal/event-content/padding-y','timeline/horizontal/event-content/padding-x','timeline/horizontal/event-content/padding-y','timeline/horizontal/event-content/padding-x');}return f;};
 const op=side('Opposite'),sep=fr(c,'Separator',v?'VERTICAL':'HORIZONTAL'),ct=side('Content');
 { const sp=figma.createFrame();sp.name='Spacer';sp.resize(0.01,0.01);sp.fills=[];op.appendChild(sp); } // a frame whose only flow child is hidden keeps its size
 const opAlign=v?(end?'MIN':'MAX'):'MIN',ctAlign=v?(end?'MAX':'MIN'):'MIN';op.counterAxisAlignItems=opAlign;ct.counterAxisAlignItems=ctAlign;
 const ot=await txt(op,'15/10/2020 10:30','Body/Base','text/muted-color','Opposite text');ot.textAlignHorizontal=v?(end?'LEFT':'RIGHT'):'LEFT';ot.visible=false;REF(ot,{characters:K['Opposite'],visible:K['Show opposite']});
 const ctt=await txt(ct,'Ordered','Body/Base','text/color','Content text');ctt.textAlignHorizontal=v&&end?'RIGHT':'LEFT';REF(ctt,{characters:K['Content']});
 sep.counterAxisAlignItems='CENTER';if(v)sep.layoutSizingVertical='FILL';else sep.layoutSizingHorizontal='FILL'; // FILL (not STRETCH): a hugging separator would not let the connector grow
 const mk=figma.createFrame();mk.name='Marker';sep.appendChild(mk);mk.layoutMode='HORIZONTAL';mk.primaryAxisAlignItems='CENTER';mk.counterAxisAlignItems='CENTER';mk.primaryAxisSizingMode='FIXED';mk.counterAxisSizingMode='FIXED';mk.resize(15.75,15.75);
 mk.setBoundVariable('width',V('timeline/event-marker/size'));mk.setBoundVariable('height',V('timeline/event-marker/size'));mk.cornerRadius=9999;mk.fills=[paint(V('timeline/event-marker/background'))];mk.strokes=[paint(V('timeline/event-marker/border-color'))];mk.strokeAlign='INSIDE';mk.setBoundVariable('strokeWeight',V('timeline/event-marker/border-width'));
 const dot=figma.createEllipse();dot.name='Dot';mk.appendChild(dot);dot.resize(5.25,5.25);dot.setBoundVariable('width',V('timeline/event-marker/content/size'));dot.setBoundVariable('height',V('timeline/event-marker/content/size'));dot.fills=[paint(V('timeline/event-marker/content/background'))];await dot.setEffectStyleIdAsync(ES['timeline/event-marker/content/inset-shadow'].id);
 if(!last){const cn=figma.createRectangle();cn.name='Connector';sep.appendChild(cn);cn.fills=[paint(V('timeline/event-connector/color'))];if(v){cn.resize(2,10);cn.setBoundVariable('width',V('timeline/event-connector/size'));cn.layoutGrow=1;}else{cn.resize(10,2);cn.setBoundVariable('height',V('timeline/event-connector/size'));cn.layoutGrow=1;}}
 if(v&&end){c.insertChild(0,ct);c.appendChild(op);} // right / alternate-even: row-reverse
 if(!v&&end){c.insertChild(0,ct);c.appendChild(op);}}
{const L=[];for(const l of ['vertical','horizontal'])for(const a of ['start','end'])for(const pos of ['middle','last'])L.push(['Layout='+l+', Align='+a+', Position='+pos,{l,a,pos}]);await variants(TE,L,teBuild);}
row(TE,24);out.event=TE.children.map(c=>c.name.replace(/Layout=|Align=|Position=/g,'')+' '+c.width+'x'+c.height);
const TEV=(l,a,pos)=>TE.children.find(c=>c.name==='Layout='+l+', Align='+a+', Position='+pos);

// ---------- Timeline ----------
const TL=set('Timeline','Align=left');
TL.description='PrimeNG: <p-timeline [value] [align] [layout]> | Story: components-timeline--playground | Version: 0.1.0 | Status: experimental (#102) | Prefilled with the Sakai events (Ordered, Processing, Shipped, Delivered); events are exposed: set Content / Opposite / Show opposite; duplicate for more (last one Position=last) | Align left / right / alternate (vertical), horizontal = layout horizontal, align top';
const EV=[['Ordered','15/10/2020 10:30'],['Processing','15/10/2020 14:00'],['Shipped','15/10/2020 16:15'],['Delivered','16/10/2020 10:00']];
async function tlBuild(c,it){CUR=c;const h=it.a==='horizontal';c.layoutMode=h?'HORIZONTAL':'VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 EV.forEach(([s,d],i)=>{const last=i===EV.length-1;const a=it.a==='right'?'end':it.a==='alternate'?(i%2?'end':'start'):'start';const e=TEV(h?'horizontal':'vertical',a,last?'last':'middle').createInstance();e.name='Event '+(i+1);c.appendChild(e);e.isExposedInstance=true;
  if(h)e.layoutGrow=1;else e.layoutAlign='STRETCH';if(s!=='Ordered')P(e,{Content:s});P(e,{Opposite:d});});
 if(h){c.primaryAxisSizingMode='FIXED';c.resize(528,c.height);}}
await variants(TL,['left','right','alternate','horizontal'].map(a=>['Align='+a,{a}]),tlBuild);row(TL);out.timeline=TL.children.map(c=>c.name.slice(6)+' '+c.width+'x'+c.height);

// ---------- Step ----------
const ST=set('Step','State=default, Position=middle');
ST.description='PrimeNG: <p-step> inside <p-step-list> (header: number + title, then a separator to the next step) | Story: components-stepper--playground | Version: 0.1.0 | Status: experimental (#102) | State active = current step (primary number + title); completed = before the active step (separator primary); default = after | Position last = no separator | Hover has no style in Aura';
K=props(ST,[['Number','TEXT','1'],['Title','TEXT','Header I']]);
async function stBuild(c,it){CUR=c;const act=it.s==='active',last=it.pos==='last';c.layoutMode='HORIZONTAL';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.clipsContent=false;c.fills=[];
 if(last)c.primaryAxisSizingMode='AUTO';else{c.primaryAxisSizingMode='FIXED';c.resize(220,42);}
 const sp='stepper/step/padding';pad(c,sp,sp,sp,sp);c.setBoundVariable('itemSpacing',V('stepper/step/gap'));
 const hd=fr(c,'Header','HORIZONTAL');hd.counterAxisAlignItems='CENTER';hd.setBoundVariable('itemSpacing',V('stepper/step-header/gap'));const hp='stepper/step-header/padding';pad(hd,hp,hp,hp,hp);rad(hd,'stepper/step-header/border-radius');
 const nb=figma.createFrame();nb.name='Number';hd.appendChild(nb);nb.layoutMode='HORIZONTAL';nb.primaryAxisAlignItems='CENTER';nb.counterAxisAlignItems='CENTER';nb.primaryAxisSizingMode='FIXED';nb.counterAxisSizingMode='FIXED';nb.resize(28,28);
 nb.setBoundVariable('width',V('stepper/step-number/size'));nb.setBoundVariable('height',V('stepper/step-number/size'));nb.cornerRadius=9999;nb.clipsContent=false;
 nb.fills=[paint(V(act?'stepper/step-number/active-background':'stepper/step-number/background'))];nb.strokes=[paint(V(act?'stepper/step-number/active-border-color':'stepper/step-number/border-color'))];nb.strokeWeight=2;nb.strokeAlign='INSIDE';await nb.setEffectStyleIdAsync(ES['stepper/step-number/shadow'].id);
 const n=await txt(nb,'1','Stepper/Number',act?'stepper/step-number/active-color':'stepper/step-number/color','Value');n.textAlignHorizontal='CENTER';REF(n,{characters:K['Number']});
 const t=await txt(hd,'Header I','Stepper/Title',act?'stepper/step-title/active-color':'stepper/step-title/color','Title');REF(t,{characters:K['Title']});
 if(!last){const s=figma.createRectangle();s.name='Separator';c.appendChild(s);s.resize(10,2);s.setBoundVariable('height',V('stepper/separator/size'));s.layoutGrow=1;s.fills=[paint(V(it.s==='completed'?'stepper/separator/active-background':'stepper/separator/background'))];}}
{const L=[];for(const pos of ['middle','last'])for(const s of ['default','active','completed'])L.push(['State='+s+', Position='+pos,{s,pos}]);await variants(ST,L,stBuild);}
row(ST);out.step=ST.children.map(c=>c.name.replace(/State=|Position=/g,'')+' '+c.width+'x'+c.height);
const STV=(s,pos)=>ST.children.find(c=>c.name==='State='+s+', Position='+pos);

// ---------- Stepper ----------
let SL=pg.findOne(x=>x.type==='COMPONENT'&&x.name==='Stepper Slot');if(!SL){const ds=pg.findOne(x=>x.type==='COMPONENT'&&x.name==='Dialog Slot');SL=ds.clone();SL.name='Stepper Slot';pg.appendChild(SL);SL.y=0;}
SL.description='Placeholder for Stepper panel content (#102). In Stepper: turn on Show panels, then swap Slot to any component (it must hug, #84).';
const SP=set('Stepper','Active=1');
SP.description='PrimeNG: <p-stepper [value]> with <p-step-list> (+ <p-step-panels>) | Story: components-stepper--playground | Version: 0.1.0 | Status: experimental (#102) | Active = current step (steps before it are completed: primary separator) | Steps are exposed (Number, Title) | Show panels: panel area (padding stepper/steppanels/*) with a swappable Slot for the step content and your Back / Next buttons';
K=props(SP,[['Show panels','BOOLEAN',false],['Slot','INSTANCE_SWAP',SL.id]]);
async function spBuild(c,it){CUR=c;const a=it.a;c.layoutMode='VERTICAL';c.resize(624,42);c.counterAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 const L=fr(c,'Step list','HORIZONTAL');L.layoutSizingHorizontal='FILL';L.counterAxisAlignItems='CENTER';L.itemSpacing=0;
 for(let i=1;i<=3;i++){const s=i===a?'active':i<a?'completed':'default';const st=STV(s,i===3?'last':'middle').createInstance();st.name='Step '+i;L.appendChild(st);st.isExposedInstance=true;if(i<3)st.layoutGrow=1;P(st,{Number:String(i),Title:'Header '+['I','II','III'][i-1]});}
 const pn=fr(c,'Panels','VERTICAL');pn.layoutSizingHorizontal='FILL';pad(pn,'stepper/steppanels/padding-top','stepper/steppanels/padding-right','stepper/steppanels/padding-bottom','stepper/steppanels/padding-left');pn.fills=[paint(V('stepper/steppanel/background'))];pn.visible=false;REF(pn,{visible:K['Show panels']});
 const sl=SL.createInstance();sl.name='Slot';pn.appendChild(sl);REF(sl,{mainComponent:K['Slot']});}
await variants(SP,[1,2,3].map(a=>['Active='+a,{a}]),spBuild);SP.layoutMode='VERTICAL';SP.primaryAxisSizingMode='AUTO';SP.counterAxisSizingMode='AUTO';SP.itemSpacing=24;P4.forEach(s=>SP['padding'+s]=24);
out.stepper=SP.children.map(c=>c.name+' '+c.width+'x'+c.height);
for(const n of [TT,TE,TL,ST,SP,SL])if(n.y<1)place(n);
return {ids:{tooltip:TT.id,event:TE.id,timeline:TL.id,step:ST.id,stepper:SP.id,slot:SL.id},...out};
