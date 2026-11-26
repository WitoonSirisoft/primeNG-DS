// Plugin code for figma-forms2b.mjs (MultiSelect, AutoComplete; DECISIONS #101). const REF=(n,r)=>{n.componentPropertyReferences=r;};const REFS=new Map();, true and "multiselect" ('multiselect' | 'autocomplete' | 'panel') are filled by the generator.
const SET=/*SET*/;
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Select/Text sm','Select/Text base','Select/Text lg','Body/Base']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const P4=['Top','Right','Bottom','Left'];const CR=['topLeftRadius','topRightRadius','bottomRightRadius','bottomLeftRadius'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const corners=(f,n,which)=>{CR.forEach((k,i)=>{if(which[i])f.setBoundVariable(k,V(n));else{f.setBoundVariable(k,null);f[k]=0;}});};
const icon=(name,col,size)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V(size||'icon-size'));i.setBoundVariable('height',V(size||'icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
/*HELPERS*/
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const sync=async(c,fn,it)=>{if(/*FRESH*/){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const set=(n,first)=>{let s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);s=figma.combineAsVariants([c],pg);s.name=n;s.x=0;s.y=below();}return s;};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const CHIP=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='Chip');if(!CHIP)throw new Error('Missing Chip');const CHIPR=CHIP.children.find(c=>c.name==='Removable=true');
const W=252; // story width 18rem
const A={size:['small','base','large'],variant:['outlined','filled'],state:['default','hover','focus','disabled'],invalid:['false','true']};

// ---------- shared field rules (same as Select / InputText, #73) ----------
function spec(f,size,variant,state,invalid,content,szf){const inv=invalid==='true',dis=state==='disabled',hov=state==='hover',foc=state==='focus';
 return {bg:dis?f+'/disabled-background':variant==='filled'?(hov?f+'/filled-hover-background':foc?f+'/filled-focus-background':f+'/filled-background'):f+'/background',
  st:inv?f+'/invalid-border-color':hov?f+'/hover-border-color':foc?f+'/focus-border-color':f+'/border-color',
  fg:content==='placeholder'?(inv?f+'/invalid-placeholder-color':dis?f+'/disabled-color':f+'/placeholder-color'):(dis?f+'/disabled-color':f+'/color'),sh:!foc,sz:szf[size]};}
const chips=async(parent,f,labels)=>{for(const l of labels){const c=CHIPR.createInstance();c.name='Chip';parent.appendChild(c);P(c,{Label:l});c.paddingTop=3.5;c.paddingBottom=3.5; // calc(padding-y / 2): no variable
 for(const k of CR)c.setBoundVariable(k,V(f+'/chip/border-radius'));}};
const out={};

if(SET==='multiselect'){
 const f='multiselect';const SZ={small:{px:f+'/sm/padding-x',py:f+'/sm/padding-y',ts:'Select/Text sm',ic:f+'/sm/font-size'},base:{px:f+'/padding-x',py:f+'/padding-y',ts:'Select/Text base',ic:'icon-size'},large:{px:f+'/lg/padding-x',py:f+'/lg/padding-y',ts:'Select/Text lg',ic:f+'/lg/font-size'}};
 const CT=['placeholder','chips','value'];
 const S=set('MultiSelect','Size=small, Variant=outlined, State=default, Invalid=false, Content=placeholder');
 S.description='PrimeNG: <p-multiselect> | Story: components-multiselect--playground | Version: 0.1.0 | Status: experimental (#101) | Same axes and rules as Select / InputText (#73) | Content: placeholder, chips (display="chip", Chip instances, padding calc(padding / 2)), value (display="comma") | Show clear = showClear with a value | Width 18rem (story); resize or Fill';
 K=props(S,[['Placeholder','TEXT','Select Cities'],['Value','TEXT','New York, Rome'],['Show clear','BOOLEAN',false]]);
 async function build(c,it){CUR=c;const s=it.s;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(W,33);c.layoutSizingVertical='HUG';c.counterAxisAlignItems='CENTER';c.clipsContent=true;
  c.fills=[paint(V(s.bg))];c.strokes=[paint(V(s.st))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;corners(c,f+'/border-radius',[1,1,1,1]);
  if(s.sh)await c.setEffectStyleIdAsync(ES[f+'/shadow'].id);else c.effects=[];
  const lb=figma.createFrame();lb.name='Label';c.appendChild(lb);lb.layoutMode='HORIZONTAL';lb.fills=[];lb.counterAxisSizingMode='AUTO';lb.layoutSizingHorizontal='FILL';lb.counterAxisAlignItems='CENTER';lb.clipsContent=true;
  if(it.c==='chips'){lb.paddingTop=lb.paddingBottom=3.5;lb.paddingLeft=lb.paddingRight=5.25;lb.itemSpacing=3.5;await chips(lb,f,['New York','Rome']);} // calc(padding / 2)
  else{pad(lb,s.sz.py,s.sz.px,s.sz.py,s.sz.px);const t=await txt(lb,it.c==='placeholder'?'Select Cities':'New York, Rome',s.sz.ts,s.fg,'Text');t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';t.textTruncation='ENDING';t.maxLines=1;REF(t,{characters:K[it.c==='placeholder'?'Placeholder':'Value']});}
  const cl=icon('Icon/times',f+'/clear-icon/color');cl.name='Clear';c.appendChild(cl);cl.visible=false;REF(cl,{visible:K['Show clear']});
  const dd=figma.createFrame();dd.name='Dropdown';c.appendChild(dd);dd.layoutMode='HORIZONTAL';dd.primaryAxisAlignItems='CENTER';dd.counterAxisAlignItems='CENTER';dd.fills=[];dd.primaryAxisSizingMode='FIXED';dd.resize(35,10);dd.setBoundVariable('width',V(f+'/dropdown/width'));dd.layoutSizingVertical='FILL';
  const ch=icon('Icon/chevron-down',f+'/dropdown/color',s.sz.ic);ch.name='Icon';dd.appendChild(ch);c.x=it.x;c.y=it.y;}
 const by={};for(const c of S.children)by[c.name]=c;let i=0;
 for(const size of A.size)for(const variant of A.variant)for(const invalid of A.invalid)for(const state of A.state)for(const ct of CT){const n='Size='+size+', Variant='+variant+', State='+state+', Invalid='+invalid+', Content='+ct;
  let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}const col=A.state.indexOf(state)*3+CT.indexOf(ct),row=(A.size.indexOf(size)*2+A.variant.indexOf(variant))*2+A.invalid.indexOf(invalid);
  await sync(c,build,{s:spec(f,size,variant,state,invalid,ct,SZ),c:ct,x:24+col*(W+24),y:24+row*60});i++;}
 let mx=0,my=0;for(const c of S.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}S.resizeWithoutConstraints(mx+24,my+24);
 out.multiselect={id:S.id,n:S.children.length,sizes:[...new Set(S.children.map(c=>c.width+'x'+c.height))]};}

if(SET==='autocomplete'){
 const f='autocomplete';const SZ={small:{px:'inputtext/sm/padding-x',py:'inputtext/sm/padding-y',ts:'Select/Text sm',ic:'inputtext/sm/font-size',dw:f+'/dropdown/sm/width'},base:{px:f+'/padding-x',py:f+'/padding-y',ts:'Select/Text base',ic:'icon-size',dw:f+'/dropdown/width'},large:{px:'inputtext/lg/padding-x',py:'inputtext/lg/padding-y',ts:'Select/Text lg',ic:'inputtext/lg/font-size',dw:f+'/dropdown/lg/width'}};
 const CT=['placeholder','value','chips'];
 const S=set('AutoComplete','Size=small, Variant=outlined, State=default, Invalid=false, Content=placeholder');
 S.description='PrimeNG: <p-autocomplete [dropdown]="true"> | Story: components-autocomplete--playground | Version: 0.1.0 | Status: experimental (#101) | Same axes and rules as Select / InputText (#73) for the input; dropdown button: autocomplete/dropdown/* (no left border) | Content: placeholder, value (single), chips ([multiple], Chip instances; wraps with the input to a 2nd row like the browser) | Without dropdown the single field looks like InputText — use InputText | Panel: use Select Panel (same overlay + list tokens) | Width 18rem (story); resize or Fill';
 K=props(S,[['Placeholder','TEXT','Search'],['Value','TEXT','Rome']]);
 async function build(c,it){CUR=c;const s=it.s;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(W,33);c.layoutSizingVertical='HUG';c.counterAxisAlignItems='MIN';c.fills=[];c.clipsContent=false;
  const inp=figma.createFrame();inp.name='Input';c.appendChild(inp);inp.layoutMode='HORIZONTAL';inp.layoutSizingHorizontal='FILL';inp.layoutAlign='STRETCH';inp.counterAxisAlignItems='CENTER';inp.clipsContent=true;
  inp.fills=[paint(V(s.bg))];inp.strokes=[paint(V(s.st))];inp.strokeWeight=1;inp.strokeAlign='INSIDE';inp.strokesIncludedInLayout=true;corners(inp,f+'/border-radius',[1,0,0,1]);
  if(s.sh)await inp.setEffectStyleIdAsync(ES[f+'/shadow'].id);else inp.effects=[];
  if(it.c==='chips'){inp.layoutWrap='WRAP';inp.paddingTop=inp.paddingBottom=3.5;inp.setBoundVariable('paddingLeft',V(s.sz.px));inp.setBoundVariable('paddingRight',V(s.sz.px));inp.itemSpacing=3.5;inp.counterAxisSpacing=3.5;
   await chips(inp,f,['New York','Rome']);const sp=figma.createFrame();sp.name='Input text';inp.appendChild(sp);sp.fills=[];sp.resize(100,23.8);} // the typing area: wraps to a 2nd row (browser 60.09)
  else{pad(inp,s.sz.py,s.sz.px,s.sz.py,s.sz.px);const t=await txt(inp,it.c==='placeholder'?'Search':'Rome',s.sz.ts,s.fg,'Text');t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';t.textTruncation='ENDING';t.maxLines=1;REF(t,{characters:K[it.c==='placeholder'?'Placeholder':'Value']});}
  const dd=figma.createFrame();dd.name='Dropdown';c.appendChild(dd);dd.layoutMode='HORIZONTAL';dd.primaryAxisAlignItems='CENTER';dd.counterAxisAlignItems='CENTER';dd.primaryAxisSizingMode='FIXED';dd.resize(35,33);dd.setBoundVariable('width',V(s.sz.dw));dd.layoutAlign='STRETCH';
  dd.fills=[paint(V(f+'/dropdown/background'))];dd.strokes=[paint(V(f+'/dropdown/border-color'))];dd.strokeAlign='INSIDE';dd.strokesIncludedInLayout=true;dd.strokeTopWeight=1;dd.strokeBottomWeight=1;dd.strokeRightWeight=1;dd.strokeLeftWeight=0;corners(dd,f+'/dropdown/border-radius',[0,1,1,0]);
  const ch=icon('Icon/chevron-down',f+'/dropdown/color',s.sz.ic);ch.name='Icon';dd.appendChild(ch);c.x=it.x;c.y=it.y;}
 const by={};for(const c of S.children)by[c.name]=c;
 for(const size of A.size)for(const variant of A.variant)for(const invalid of A.invalid)for(const state of A.state)for(const ct of CT){const n='Size='+size+', Variant='+variant+', State='+state+', Invalid='+invalid+', Content='+ct;
  let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}const col=A.state.indexOf(state)*3+CT.indexOf(ct),row=(A.size.indexOf(size)*2+A.variant.indexOf(variant))*2+A.invalid.indexOf(invalid);
  await sync(c,build,{s:spec(f,size,variant,state,invalid,ct,SZ),c:ct,x:24+col*(W+24),y:24+row*90});}
 let mx=0,my=0;for(const c of S.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}S.resizeWithoutConstraints(mx+24,my+24);
 out.autocomplete={id:S.id,n:S.children.length,sizes:[...new Set(S.children.map(c=>c.width+'x'+c.height))]};}

if(SET==='panel'){
 const f='multiselect';const CB=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='Checkbox');const IF=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='IconField');
 const cbv=ck=>CB.children.find(c=>c.name==='Size=base, Variant=outlined, State=default, Invalid=false, Checked='+ck);
 const O=set('MultiSelect Option','State=default');
 O.description='PrimeNG: <p-multiselect> option (checkbox + label) | Story: components-multiselect--open | Version: 0.1.0 | Status: experimental (#101) | State focus = keyboard / hover; selected = checked option (background multiselect/option/selected-background at its opacity); selected-focus | Use inside MultiSelect Panel';
 K=props(O,[['Label','TEXT','New York']]);
 async function ob(c,it){CUR=c;const st=it.s,sel=st.startsWith('selected'),foc=st.endsWith('focus');c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(W-16,30);c.layoutSizingVertical='HUG';c.counterAxisAlignItems='CENTER';c.clipsContent=true;c.fills=[];
  pad(c,f+'/option/padding-y',f+'/option/padding-x',f+'/option/padding-y',f+'/option/padding-x');c.setBoundVariable('itemSpacing',V(f+'/option/gap'));corners(c,f+'/option/border-radius',[1,1,1,1]);
  if(st!=='default'){const bg=figma.createRectangle();bg.name='Background';c.appendChild(bg);bg.layoutPositioning='ABSOLUTE';bg.resize(c.width,c.height);bg.x=0;bg.y=0;bg.constraints={horizontal:'STRETCH',vertical:'STRETCH'};
   const bv=sel?(foc?f+'/option/selected-focus-background':f+'/option/selected-background'):f+'/option/focus-background';bg.fills=[paint(V(bv))];if(sel)bg.setBoundVariable('opacity',V(bv+'-opacity'));}
  const cb=cbv(sel?'yes':'no').createInstance();cb.name='Checkbox';c.appendChild(cb);
  const col=sel?(foc?f+'/option/selected-focus-color':f+'/option/selected-color'):foc?f+'/option/focus-color':f+'/option/color';const t=await txt(c,'New York','Body/Base',col,'Label');REF(t,{characters:K['Label']});}
 const ob_={};for(const c of O.children)ob_[c.name]=c;for(const s of ['default','focus','selected','selected-focus']){const n='State='+s;let c=ob_[n];if(!c){c=figma.createComponent();c.name=n;O.appendChild(c);}await sync(c,ob,{s});}
 O.layoutMode='VERTICAL';O.primaryAxisSizingMode='AUTO';O.counterAxisSizingMode='AUTO';O.itemSpacing=16;P4.forEach(s=>O['padding'+s]=24);
 const OV=s=>O.children.find(c=>c.name==='State='+s);
 let PN=pg.findOne(x=>x.type==='COMPONENT'&&x.name==='MultiSelect Panel');if(!PN){PN=figma.createComponent();PN.name='MultiSelect Panel';pg.appendChild(PN);PN.x=O.x+O.width+80;PN.y=O.y;}
 PN.description='PrimeNG: <p-multiselect> overlay (.p-multiselect-overlay: header with select-all checkbox + filter, list of checkbox options) | Story: components-multiselect--open | Version: 0.1.0 | Status: experimental (#101) | Show header (showToggleAll / filter) | Options exposed: set Label / State; Show option 6 for more | Place under the field (min-width = field width)';
 K=props(PN,[['Show header','BOOLEAN',true],['Show option 6','BOOLEAN',false]]);
 await sync(PN,async c=>{CUR=c;c.layoutMode='VERTICAL';c.resize(W,100);c.counterAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.itemSpacing=0;c.clipsContent=true;
  c.fills=[paint(V(f+'/overlay/background'))];c.strokes=[paint(V(f+'/overlay/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;corners(c,f+'/overlay/border-radius',[1,1,1,1]);await c.setEffectStyleIdAsync(ES[f+'/overlay/shadow'].id);
  const h=figma.createFrame();h.name='Header';c.appendChild(h);h.layoutMode='HORIZONTAL';h.layoutAlign='STRETCH';h.counterAxisSizingMode='AUTO';h.counterAxisAlignItems='CENTER';h.fills=[];
  pad(h,f+'/list/header/padding-top',f+'/list/header/padding-right',f+'/list/header/padding-bottom',f+'/list/header/padding-left');h.setBoundVariable('itemSpacing',V(f+'/option/gap'));REF(h,{visible:K['Show header']});
  const cb=cbv('no').createInstance();cb.name='Toggle all';h.appendChild(cb);
  if(IF){const fi=IF.children.find(x=>x.name==='Icon position=right, Size=base').createInstance();fi.name='Filter';h.appendChild(fi);fi.layoutGrow=1;try{P(fi,{Icon:IC('Icon/search').id});}catch(e){}}
  const L=figma.createFrame();L.name='List';c.appendChild(L);L.layoutMode='VERTICAL';L.layoutAlign='STRETCH';L.primaryAxisSizingMode='AUTO';L.fills=[];pad(L,f+'/list/padding-y',f+'/list/padding-x',f+'/list/padding-y',f+'/list/padding-x');L.setBoundVariable('itemSpacing',V(f+'/list/gap'));
  for(const [n,l,s,hd] of [['Option 1','New York','selected-focus'],['Option 2','Rome','selected'],['Option 3','London','default'],['Option 4','Istanbul','default'],['Option 5','Paris','default'],['Option 6','Option','default',1]]){
   const o=OV(s).createInstance();o.name=n;L.appendChild(o);o.layoutAlign='STRETCH';o.isExposedInstance=true;if(l!=='New York')P(o,{Label:l});if(hd){o.visible=false;REF(o,{visible:K['Show option 6']});}}},{});
 out.panel={option:O.id,optionH:O.children.map(c=>c.height),panel:PN.id,size:PN.width+'x'+PN.height};}
return out;
