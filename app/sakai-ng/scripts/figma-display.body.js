// Plugin code for figma-display.mjs (Avatar, Avatar Group, Chip; DECISIONS #100). /*HELPERS*/ and /*FRESH*/ are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Avatar/Label','Avatar/Label lg','Avatar/Label xl','Body/Base']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const P4=['Top','Right','Bottom','Left'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const CR=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const rad=(f,n)=>{for(const k of CR)f.setBoundVariable(k,V(n));};
const round=f=>{for(const k of CR)f.setBoundVariable(k,null);f.cornerRadius=9999;}; // circle = 50 % (no percent variables, #47)
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,col,size)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V(size));i.setBoundVariable('height',V(size));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
/*HELPERS*/
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const sync=async(c,fn,it)=>{if(/*FRESH*/){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const set=(n,first)=>{let s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);s=figma.combineAsVariants([c],pg);s.name=n;}return s;};
const variants=async(S,names,fn)=>{const by={};for(const c of S.children)by[c.name]=c;for(const [n,it] of names){let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}await sync(c,fn,it);}};
const grid=(S,cols)=>{S.layoutMode='HORIZONTAL';S.layoutWrap='WRAP';S.primaryAxisSizingMode='FIXED';S.counterAxisSizingMode='AUTO';S.itemSpacing=24;S.counterAxisSpacing=24;S.counterAxisAlignItems='CENTER';P4.forEach(s=>S['padding'+s]=24);let w=0;for(const c of S.children.slice(0,cols))w+=c.width+24;S.resize(w+24,S.height);};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const out={};

// ---------- Avatar ----------
const SZ={normal:['avatar/width','avatar/height','avatar/icon/size','Avatar/Label'],large:['avatar/lg/width','avatar/lg/height','avatar/lg/icon/size','Avatar/Label lg'],xlarge:['avatar/xl/width','avatar/xl/height','avatar/xl/icon/size','Avatar/Label xl']};
const AV=set('Avatar','Size=normal, Shape=square, Content=label');
AV.description='PrimeNG: <p-avatar [label] [icon] [size] [shape]> | Story: components-avatar--playground | Version: 0.1.0 | Status: experimental (#100) | Size normal / large / xlarge, Shape square / circle (50 %), Content label / icon | Group border = the 2px ring avatars get inside <p-avatargroup> | Image avatar: add an image fill to the Avatar layer (Figma) / [image] (code)';
K=props(AV,[['Label','TEXT','P'],['Icon','INSTANCE_SWAP',IC('Icon/user').id],['Group border','BOOLEAN',false]]);
async function avBuild(c,it){CUR=c;const [w,h,is,ts]=SZ[it.s];c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(28,28);
 c.setBoundVariable('width',V(w));c.setBoundVariable('height',V(h));c.fills=[paint(V('avatar/background'))];c.clipsContent=true;if(it.sh==='circle')round(c);else rad(c,'avatar/border-radius');
 if(it.c==='label'){const t=await txt(c,'P',ts,'avatar/color','Label');t.textAlignHorizontal='CENTER';REF(t,{characters:K['Label']});}
 else{const i=icon('Icon/user','avatar/color',is);i.name='Icon';c.appendChild(i);REF(i,{mainComponent:K['Icon']});}
 const g=figma.createRectangle();g.name='Group border';c.appendChild(g);g.layoutPositioning='ABSOLUTE';g.resize(c.width,c.height);g.x=0;g.y=0;g.constraints={horizontal:'STRETCH',vertical:'STRETCH'};g.fills=[];
 g.strokes=[paint(V('avatar/group/border-color'))];g.strokeWeight=2;g.strokeAlign='INSIDE';if(it.sh==='circle')g.cornerRadius=9999;else for(const k of CR)g.setBoundVariable(k,V('avatar/border-radius'));
 g.visible=false;REF(g,{visible:K['Group border']});}
{const L=[];for(const s of ['normal','large','xlarge'])for(const sh of ['square','circle'])for(const ct of ['label','icon'])L.push(['Size='+s+', Shape='+sh+', Content='+ct,{s,sh,c:ct}]);await variants(AV,L,avBuild);}
grid(AV,4);out.avatar=[...new Set(AV.children.map(c=>c.width+'x'+c.height))];
const AVV=(s,sh,ct)=>AV.children.find(c=>c.name==='Size='+s+', Shape='+sh+', Content='+ct);

// ---------- Avatar Group ----------
const OFF={normal:'avatar/group/offset',large:'avatar/lg/group/offset',xlarge:'avatar/xl/group/offset'};
const AG=set('Avatar Group','Size=normal');
AG.description='PrimeNG: <p-avatargroup> with <p-avatar> children | Story: components-avatar--playground (group) | Version: 0.1.0 | Status: experimental (#100) | Avatars overlap by the group offset (negative gap) and show Group border | Avatars are exposed: change Label / Shape / Content, hide or duplicate; last one = "+N" count';
async function agBuild(c,it){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.fills=[];c.clipsContent=false;c.setBoundVariable('itemSpacing',V(OFF[it.s]));
 for(const [n,l] of [['Avatar 1','A'],['Avatar 2','B'],['Avatar 3','C'],['Avatar 4','D'],['Count','+2']]){const a=AVV(it.s,'circle','label').createInstance();a.name=n;c.appendChild(a);a.isExposedInstance=true;P(a,{Label:l,'Group border':true});}}
{const L=['normal','large','xlarge'].map(s=>['Size='+s,{s}]);await variants(AG,L,agBuild);}
grid(AG,3);out.group=AG.children.map(c=>c.name+' '+c.width+'x'+c.height);

// ---------- Chip ----------
const CH=set('Chip','Removable=false');
CH.description='PrimeNG: <p-chip [label] [icon] [removable]> | Story: components-chip--playground | Version: 0.1.0 | Status: experimental (#100) | Removable=true: remove icon (times-circle) and padding-right = padding-y | Show icon + Icon (swap) | Image chips not built (remote images): use an Avatar circle 28 as icon if needed';
K=props(CH,[['Label','TEXT','Action'],['Show icon','BOOLEAN',false],['Icon','INSTANCE_SWAP',IC('Icon/apple').id]]);
async function chBuild(c,it){CUR=c;const rm=it.r==='true';c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.clipsContent=false;
 pad(c,'chip/padding-y',rm?'chip/padding-y':'chip/padding-x','chip/padding-y','chip/padding-x');c.setBoundVariable('itemSpacing',V('chip/gap'));c.fills=[paint(V('chip/background'))];rad(c,'chip/border-radius');
 const i=icon('Icon/apple','chip/icon/color','chip/icon/size');i.name='Icon';c.appendChild(i);i.visible=false;REF(i,{visible:K['Show icon'],mainComponent:K['Icon']});
 const t=await txt(c,'Action','Body/Base','chip/color','Label');REF(t,{characters:K['Label']});
 if(rm){const x=icon('Icon/times-circle','chip/remove-icon/color','chip/remove-icon/size');x.name='Remove icon';c.appendChild(x);}}
{await variants(CH,[['Removable=false',{r:'false'}],['Removable=true',{r:'true'}]],chBuild);}
grid(CH,2);out.chip=CH.children.map(c=>c.name+' '+c.width+'x'+c.height);
for(const n of [AV,AG,CH])if(n.y<1)place(n);
return {ids:{avatar:AV.id,group:AG.id,chip:CH.id},...out};
