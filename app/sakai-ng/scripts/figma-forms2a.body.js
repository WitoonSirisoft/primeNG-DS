// Plugin code for figma-forms2a.mjs (InputGroup, SelectButton; DECISIONS #101). /*HELPERS*/ and /*FRESH*/ are filled by the generator.
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Body/Base','ToggleButton/Label sm','ToggleButton/Label','ToggleButton/Label lg']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(!ES['togglebutton/content/checked-shadow'])throw new Error('Missing effect style togglebutton/content/checked-shadow');
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const P4=['Top','Right','Bottom','Left'];const CR=['topLeftRadius','topRightRadius','bottomRightRadius','bottomLeftRadius'];
const pad=(f,t,r,b,l)=>{const a=[t,r,b,l];P4.forEach((s,i)=>{if(typeof a[i]==='number')f['padding'+s]=a[i];else f.setBoundVariable('padding'+s,V(a[i]));});};
const corners=(f,n,which)=>{CR.forEach((k,i)=>{if(which[i])f.setBoundVariable(k,V(n));else{f.setBoundVariable(k,null);f[k]=0;}});}; // which = [TL,TR,BR,BL]
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,col)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V('icon-size'));i.setBoundVariable('height',V('icon-size'));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
/*HELPERS*/
let K={};const keys=o=>{const r={};for(const k in o.componentPropertyDefinitions)r[k.split('#')[0]]=k;return r;};
const props=(o,list)=>{const r=keys(o);for(const [n,t,d] of list)if(!r[n])r[n]=o.addComponentProperty(n,t,d);return r;};
let y0=null;const place=n=>{if(y0===null)y0=below();n.x=0;n.y=y0;y0+=n.height+80;};
const sync=async(c,fn,it)=>{if(/*FRESH*/){for(const ch of [...c.children])ch.remove();await fn(c,it);return;}const tmp=figma.createComponent();pg.appendChild(tmp);tmp.name=c.name;REFS.clear();try{await fn(tmp,it);await syCopy(c,tmp,false,true);}finally{tmp.remove();}};
const set=(n,first)=>{let s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s){const c=figma.createComponent();c.name=first;pg.appendChild(c);s=figma.combineAsVariants([c],pg);s.name=n;}return s;};
const variants=async(S,names,fn)=>{const by={};for(const c of S.children)by[c.name]=c;for(const [n,it] of names){let c=by[n];if(!c){c=figma.createComponent();c.name=n;S.appendChild(c);}await sync(c,fn,it);}};
const grid=(S,cols)=>{S.layoutMode='HORIZONTAL';S.layoutWrap='WRAP';S.primaryAxisSizingMode='FIXED';S.counterAxisSizingMode='AUTO';S.itemSpacing=24;S.counterAxisSpacing=24;S.counterAxisAlignItems='CENTER';P4.forEach(s=>S['padding'+s]=24);let w=0;for(const c of S.children.slice(0,cols))w+=c.width+24;S.resize(w+24,S.height);};
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const SETS={};for(const n of ['InputText','Checkbox','Button']){SETS[n]=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!SETS[n])throw new Error('Missing '+n);}
const VAR=(n,name)=>{const v=SETS[n].children.find(c=>c.name===name);if(!v)throw new Error(n+': no variant '+name);return v;};
const out={};

// ---------- InputGroup Addon ----------
// Position = which borders/corners the addon draws (CSS: first-child / addon+addon left border, last-child right border, outer corners rounded)
const POS={first:[1,0,[1,0,0,1]],middle:[1,0,[0,0,0,0]],'after-input':[0,0,[0,0,0,0]],last:[1,1,[0,1,1,0]],'last-after-input':[0,1,[0,1,1,0]]};
const AD=set('InputGroup Addon','Position=first');
AD.description='PrimeNG: <p-inputgroup-addon> | Story: components-inputgroup--playground | Version: 0.1.0 | Status: experimental (#101) | Position sets the borders and outer corners: first (left edge), middle (after another addon), after-input (right after the field), last (right edge, after an addon), last-after-input | Content: Show icon + Icon, Show text + Text ($, .00), Show checkbox | Stretches to the field height inside InputGroup';
K=props(AD,[['Show icon','BOOLEAN',true],['Icon','INSTANCE_SWAP',IC('Icon/user').id],['Show text','BOOLEAN',false],['Text','TEXT','$'],['Show checkbox','BOOLEAN',false]]);
async function adBuild(c,it){CUR=c;const [l,r,cor]=POS[it.p];c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.clipsContent=false;
 const ap='inputgroup/addon/padding';pad(c,ap,ap,ap,ap);try{c.setBoundVariable('minWidth',V('inputgroup/addon/min-width'));}catch(e){c.minWidth=35;}
 c.fills=[paint(V('inputgroup/addon/background'))];c.strokes=[paint(V('inputgroup/addon/border-color'))];c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;c.strokeTopWeight=1;c.strokeBottomWeight=1;c.strokeLeftWeight=l;c.strokeRightWeight=r;
 corners(c,'inputgroup/addon/border-radius',cor);
 const i=icon('Icon/user','inputgroup/addon/color');i.name='Icon';c.appendChild(i);REF(i,{visible:K['Show icon'],mainComponent:K['Icon']});
 const t=await txt(c,'$','Body/Base','inputgroup/addon/color','Text');t.visible=false;REF(t,{characters:K['Text'],visible:K['Show text']});
 const cb=VAR('Checkbox','Size=base, Variant=outlined, State=default, Invalid=false, Checked=no').createInstance();cb.name='Checkbox';c.appendChild(cb);cb.visible=false;REF(cb,{visible:K['Show checkbox']});}
await variants(AD,Object.keys(POS).map(p=>['Position='+p,{p}]),adBuild);grid(AD,5);out.addon=AD.children.map(c=>c.name.slice(9)+' '+c.width+'x'+c.height);
const ADV=p=>AD.children.find(c=>c.name==='Position='+p);

// ---------- InputGroup ----------
const IG=set('InputGroup','Row=icon');
IG.description='PrimeNG: <p-inputgroup> | Story: components-inputgroup--playground | Version: 0.1.0 | Status: experimental (#101) | Rows = the Sakai Input demo: icon (user + Username), multi (clock, star, Price, $, .00), button (Search + Keyword), checkbox (checkbox + Confirm) | Parts are exposed: change addon content / field placeholder; the field fills the width; inner corners are square (border-radius 0 in code) | Resize width freely';
const field=(c,ph,cor)=>{const f=VAR('InputText','Size=base, Variant=outlined, State=default, Invalid=false, Content=placeholder').createInstance();f.name='Field';c.appendChild(f);f.isExposedInstance=true;P(f,{Placeholder:ph});f.layoutGrow=1;f.layoutAlign='STRETCH';
 CR.forEach((k,i)=>{if(!cor[i]){try{f.setBoundVariable(k,null);}catch(e){}f[k]=0;}});return f;};
const addon=(c,p,n,vals)=>{const a=ADV(p).createInstance();a.name=n;c.appendChild(a);a.isExposedInstance=true;a.layoutAlign='STRETCH';if(vals)P(a,vals);return a;};
async function igBuild(c,it){CUR=c;c.layoutMode='HORIZONTAL';c.resize(404,33);c.primaryAxisSizingMode='FIXED';c.layoutSizingVertical='HUG';c.counterAxisAlignItems='CENTER';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 if(it.r==='icon'){addon(c,'first','Addon 1');field(c,'Username',[0,1,1,0]);}
 if(it.r==='multi'){addon(c,'first','Addon 1',{Icon:IC('Icon/clock').id});addon(c,'middle','Addon 2',{Icon:IC('Icon/star-fill').id});field(c,'Price',[0,0,0,0]);addon(c,'after-input','Addon 3',{'Show icon':false,'Show text':true,Text:'$'});addon(c,'last','Addon 4',{'Show icon':false,'Show text':true,Text:'.00'});}
 if(it.r==='button'){const b=VAR('Button','Severity=primary, Variant=solid, Size=base, State=default, Rounded=false').createInstance();b.name='Button';c.appendChild(b);b.isExposedInstance=true;b.layoutAlign='STRETCH';P(b,{Label:'Search'});
  const bg=b.findOne(x=>x.name==='Background');if(bg){for(const k of ['topRightRadius','bottomRightRadius']){try{bg.setBoundVariable(k,null);}catch(e){}bg[k]=0;}}field(c,'Keyword',[0,1,1,0]);}
 if(it.r==='checkbox'){addon(c,'first','Addon 1',{'Show icon':false,'Show checkbox':true});field(c,'Confirm',[0,1,1,0]);}}
await variants(IG,['icon','multi','button','checkbox'].map(r=>['Row='+r,{r}]),igBuild);
IG.layoutMode='VERTICAL';IG.primaryAxisSizingMode='AUTO';IG.counterAxisSizingMode='AUTO';IG.itemSpacing=24;P4.forEach(s=>IG['padding'+s]=24);out.group=IG.children.map(c=>c.name.slice(4)+' '+c.width+'x'+c.height);

// ---------- SelectButton Option ----------
const SZ={small:['togglebutton/sm/padding','togglebutton/content/sm/padding','ToggleButton/Label sm'],base:['togglebutton/padding','togglebutton/content/padding','ToggleButton/Label'],large:['togglebutton/lg/padding','togglebutton/content/lg/padding','ToggleButton/Label lg']};
const SO=set('SelectButton Option','State=default, Size=base');
SO.description='PrimeNG: <p-selectbutton> option (a ToggleButton) | Story: components-selectbutton--playground | Version: 0.1.0 | Status: experimental (#101) | State checked = selected (white content + shadow), hover = not checked, disabled | Label / icon | Use inside SelectButton';
K=props(SO,[['Label','TEXT','Option 1'],['Show label','BOOLEAN',true],['Show icon','BOOLEAN',false],['Icon','INSTANCE_SWAP',IC('Icon/align-left').id]]);
async function soBuild(c,it){CUR=c;const [op,cp,ts]=SZ[it.z],s=it.s;const k={default:'',hover:'hover-',checked:'checked-',disabled:'disabled-'}[s];
 c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.clipsContent=false;pad(c,op,op,op,op);c.fills=[paint(V('togglebutton/'+k+'background'))];
 const ct=figma.createFrame();ct.name='Content';c.appendChild(ct);ct.layoutMode='HORIZONTAL';ct.primaryAxisSizingMode='AUTO';ct.counterAxisSizingMode='AUTO';ct.counterAxisAlignItems='CENTER';ct.clipsContent=false;
 pad(ct,cp+'-y',cp+'-x',cp+'-y',cp+'-x');ct.setBoundVariable('itemSpacing',V('togglebutton/gap'));corners(ct,'togglebutton/content/border-radius',[1,1,1,1]);
 if(s==='checked'){ct.fills=[paint(V('togglebutton/content/checked-background'))];await ct.setEffectStyleIdAsync(ES['togglebutton/content/checked-shadow'].id);}else ct.fills=[];
 const icol={default:'togglebutton/icon/color',hover:'togglebutton/icon/hover-color',checked:'togglebutton/icon/checked-color',disabled:'togglebutton/icon/disabled-color'}[s];
 const i=icon('Icon/align-left',icol);i.name='Icon';ct.appendChild(i);i.visible=false;REF(i,{visible:K['Show icon'],mainComponent:K['Icon']});
 const t=await txt(ct,'Option 1',ts,'togglebutton/'+k+'color','Label');REF(t,{characters:K['Label'],visible:K['Show label']});}
{const L=[];for(const z of ['small','base','large'])for(const s of ['default','hover','checked','disabled'])L.push(['State='+s+', Size='+z,{s,z}]);await variants(SO,L,soBuild);}
grid(SO,4);out.option=[...new Set(SO.children.map(c=>c.name.split(', ')[1]+' '+c.height))];
const SOV=(s,z)=>SO.children.find(c=>c.name==='State='+s+', Size='+z);

// ---------- SelectButton ----------
const SB=set('SelectButton','Size=base, Invalid=false, Disabled=false');
SB.description='PrimeNG: <p-selectbutton [options] [(ngModel)] [size] [invalid] [disabled]> | Story: components-selectbutton--playground | Version: 0.1.0 | Status: experimental (#101) | Options are exposed: set Label / icon and State (one checked; disabled for [disabled]); Show option 4 / 5 for more | Borders: 1px around and between options (togglebutton/border-color) | Invalid = 1px outline selectbutton/invalid-border-color | Disabled = [disabled]: all options disabled, dividers togglebutton/disabled-border-color';
K=props(SB,[['Show option 4','BOOLEAN',false],['Show option 5','BOOLEAN',false]]);
async function sbBuild(c,it){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.itemSpacing=1;c.clipsContent=true;
 const bc=it.d==='true'?'togglebutton/disabled-border-color':'togglebutton/border-color';c.fills=[paint(V(bc))];c.strokes=[paint(V(bc))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;corners(c,'selectbutton/border-radius',[1,1,1,1]);
 if(it.i==='true'){const r=V('selectbutton/invalid-border-color').resolveForConsumer(c).value;c.effects=[figma.variables.setBoundVariableForEffect({type:'DROP_SHADOW',color:{r:r.r,g:r.g,b:r.b,a:1},offset:{x:0,y:0},radius:0,spread:1,visible:true,blendMode:'NORMAL',showShadowBehindNode:false},'color',V('selectbutton/invalid-border-color'))];}else c.effects=[];
 for(const [n,l,s,h] of [['Option 1','Option 1','checked'],['Option 2','Option 2','default'],['Option 3','Option 3','default'],['Option 4','Option 4','default',1],['Option 5','Option 5','default',1]]){
  const o=SOV(it.d==='true'?'disabled':s,it.z).createInstance();o.name=n;c.appendChild(o);o.isExposedInstance=true;o.layoutAlign='STRETCH';if(l!=='Option 1')P(o,{Label:l});if(h){o.visible=false;REF(o,{visible:K['Show '+n.toLowerCase()]});}}}
{const L=[];for(const z of ['small','base','large'])for(const i of ['false','true'])for(const d of ['false','true'])L.push(['Size='+z+', Invalid='+i+', Disabled='+d,{z,i,d}]);await variants(SB,L,sbBuild);}
grid(SB,4);out.selectbutton=SB.children.map(c=>c.name+' '+c.width+'x'+c.height);
for(const n of [AD,IG,SO,SB])if(n.y<1)place(n);
return {ids:{addon:AD.id,group:IG.id,option:SO.id,selectbutton:SB.id},...out};
