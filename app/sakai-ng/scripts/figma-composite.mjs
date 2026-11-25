#!/usr/bin/env node
/**
 * Composed form fields → Figma: batch 1 Group A, plan agent/PLAN_GROUP_A.md (DECISIONS #61, #63, #64).
 * IconField, Password and InputNumber are built around an InputText INSTANCE (exposed nested instance), as the code wraps
 * a real pInputText. The wrapper adds only its own axes; the inner instance keeps State / Variant / Invalid / Content.
 *   --set=iconfield    'IconField'   Icon position (left, right) × Size 3 = 6
 *   --set=password     'Password'    Toggle mask (false, true) × Size 3 = 6
 *   --set=inputnumber  'InputNumber' Buttons (none, stacked, horizontal, vertical) × Size 3 = 12
 *   --set=datepicker   'DatePicker'  Icon display (none, input, button) × Size 3 = 9 (axis not named 'Icon': that is the swap property) (field only; panel: figma-datepicker.mjs, #65)
 * Writes tokens/figma/calls/11-composite-<set>.js (build) and 11-composite-<set>-verify.js.
 * Same rules as the other generators: SPEC validated in Node against plan.json, upsert by name, rebuild in place.
 * Positions of absolutely placed icons cannot bind to variables in Figma: they are computed from the same tokens (literal x/y).
 * Usage (from app/sakai-ng): npm run figma:composite -- --set=iconfield
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const SET = process.argv.find((a) => a.startsWith('--set='))?.slice(6) || 'iconfield';
const NAMES = { iconfield: 'IconField', password: 'Password', inputnumber: 'InputNumber', datepicker: 'DatePicker' };
if (!NAMES[SET]) throw new Error('Unknown --set');

// Browser widths of the plain InputText (screenshots/manifest.csv) and the base tokens the geometry is computed from.
const GEO = { w: { small: 149.5, base: 172, large: 194.5 }, px: { small: 8.75, base: 10.5, large: 12.25 }, icon: 14, btn: 35, iconPad: 35, stackPad: 45.5 }; // iconPad = form-field.padding-x × 2 + icon-size (base values for every size, as the CSS)

const SPEC = `function variants(SET,G){
const SIZES=['small','base','large'],out=[];
const ISZ={small:'form-field/sm/font-size',base:'icon-size',large:'form-field/lg/font-size'}; // .p-iconfield/.p-inputnumber icon size per size
const IPX={small:12.25,base:14,large:15.75};
const it0=(size)=>({size,inner:'Size='+size+', Variant=outlined, State=default, Invalid=false, Content=placeholder',w:G.w[size],px:G.px[size]});
SIZES.forEach((size,si)=>{
 if(SET==='iconfield')['left','right'].forEach((pos,pi)=>{const it=it0(size);it.n='Icon position='+pos+', Size='+size;it.pos=pos;
  it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='iconfield/input-padding';it.icon='Icon/search';it.isz=ISZ[size];it.ipx=IPX[size];it.ic='iconfield/icon/color';
  it.ph='Search';it.x=24+si*260;it.y=24+pi*60;out.push(it);});
 if(SET==='password')['false','true'].forEach((tm,ti)=>{const it=it0(size);it.n='Toggle mask='+tm+', Size='+size;it.inner=it.inner.replace('placeholder','value');it.val='••••••••';
  if(tm==='true'){it.pos='right';it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='password/input-padding';it.icon='Icon/eye';it.isz='icon-size';it.ipx=14;it.ic='password/icon/color';}
  else it.iw=G.w[size];
  it.x=24+si*260;it.y=24+ti*60;out.push(it);});
 if(SET==='inputnumber')['none','stacked','horizontal','vertical'].forEach((bl,bi)=>{const it=it0(size);it.n='Buttons='+bl+', Size='+size;it.bl=bl;it.inner=it.inner.replace('placeholder','value');it.val='42';
  it.isz=ISZ[size];it.ipx=IPX[size];it.iw=bl==='stacked'?G.w[size]-G.px[size]+G.stackPad:G.w[size];
  if(bl==='stacked')it.pad='inputnumber/stacked-input-padding';
  it.x=24+si*300;it.y=24+bi*130;out.push(it);});
 if(SET==='datepicker')['none','input','button'].forEach((ic,ii)=>{const it=it0(size);it.n='Icon display='+ic+', Size='+size;it.ph='Select a date';
  if(ic==='input'){it.pos='right';it.iw=G.w[size]-G.px[size]+G.iconPad;it.pad='datepicker/input-padding';it.icon='Icon/calendar';it.isz=ISZ[size];it.ipx=IPX[size];it.ic='datepicker/input-icon/color';}
  else it.iw=G.w[size];
  if(ic==='button'){it.dd={small:'datepicker/dropdown/sm/width',base:'datepicker/dropdown/width',large:'datepicker/dropdown/lg/width'}[size];it.ddw={small:28,base:35,large:42}[size];it.isz=ISZ[size];it.ipx=IPX[size];}
  it.x=24+si*280;it.y=24+ii*60;out.push(it);});
});
return out;}`;

// ---- validate in Node ----
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const items = new Function(`${SPEC}; return variants;`)()(SET, GEO);
const BTN = ['inputnumber/button/width', 'inputnumber/button/background', 'inputnumber/button/color', 'inputnumber/button/border-color', 'inputnumber/button/border-radius', 'inputnumber/button/vertical-padding'];
const DDV = ['datepicker/dropdown/background', 'datepicker/dropdown/border-color', 'datepicker/dropdown/border-radius', 'datepicker/dropdown/color'];
const need = new Set(['form-field/padding-x', ...(SET === 'inputnumber' ? BTN : []), ...(SET === 'datepicker' ? DDV : [])]);
for (const it of items) for (const n of [it.pad, it.isz, it.ic, it.dd]) if (n) need.add(n);
const missing = [...need].filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);
if (new Set(items.map((i) => i.n)).size !== items.length) throw new Error('Duplicate names');

const BUILD = `
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const IT=variants(D.set,D.G);
const ITXT=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='InputText');if(!ITXT)throw new Error('InputText set missing');
for(const s of await figma.getLocalTextStylesAsync())if(s.name.startsWith('InputText/'))await figma.loadFontAsync(s.fontName); // vertical layout centres the inner text
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:0,rebuilt:0};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);
 const seed=IT.find(i=>i.icon||i.dd)||IT[0];const c=figma.createComponent();c.name=seed.n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;}
set.description=D.desc;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
if(D.icon&&!K['Icon'])K['Icon']=set.addComponentProperty('Icon','INSTANCE_SWAP',IC(D.icon).id);
function iconInst(name,sizeVar,colVar){const i=IC(name).createInstance();i.name='Icon';i.setBoundVariable('width',V(sizeVar));i.setBoundVariable('height',V(sizeVar));
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape layer');sh.fills=[paint(V(colVar))];return i;}
function inner(it){const i=ITXT.children.find(c=>c.name===it.inner);if(!i)throw new Error('No InputText variant '+it.inner);const n=i.createInstance();n.name='InputText';
 const P={};for(const k in n.componentProperties)P[k.split('#')[0]]=k;const o={};if(it.val&&P['Value'])o[P['Value']]=it.val;if(it.ph&&P['Placeholder'])o[P['Placeholder']]=it.ph;n.setProperties(o);return n;}
function button(it,name,iconName,side){const b=figma.createAutoLayout('HORIZONTAL',{name});b.primaryAxisAlignItems='CENTER';b.counterAxisAlignItems='CENTER';
 b.fills=[paint(V('inputnumber/button/background'))];b.appendChild(iconInst(iconName,it.isz,'inputnumber/button/color'));return b;}
${SYNC}${WRAP}async function build0(c,it){CUR=c; // update in place (#68): build() in lib/figma-sync.mjs keeps old layers and syncs
c.fills=[];c.strokes=[];c.clipsContent=false;
 const n=inner(it);
 if(!it.bl||it.bl==='none'||it.bl==='stacked'){c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.appendChild(n);
  if(Math.abs(n.width-it.iw)>0.01)n.resize(it.iw,n.height);
  if(it.pad)n.setBoundVariable(it.pos==='left'?'paddingLeft':'paddingRight',V(it.pad));
  if(it.icon){const i=iconInst(it.icon,it.isz,it.ic);c.appendChild(i);i.layoutPositioning='ABSOLUTE';
   i.x=it.pos==='left'?it.px0:it.iw-it.px0-it.ipx;i.y=(n.height-it.ipx)/2;i.constraints={horizontal:it.pos==='left'?'MIN':'MAX',vertical:'CENTER'};
   REF(i,{mainComponent:K['Icon']});}
  if(it.dd){for(const k of ['topRightRadius','bottomRightRadius'])n[k]=0; // .p-datepicker:has(.p-datepicker-dropdown) .p-datepicker-input
   const b=figma.createAutoLayout('HORIZONTAL',{name:'Dropdown'});b.primaryAxisAlignItems='CENTER';b.counterAxisAlignItems='CENTER';c.appendChild(b);
   b.fills=[paint(V('datepicker/dropdown/background'))];b.strokes=[paint(V('datepicker/dropdown/border-color'))];b.strokeAlign='INSIDE';b.strokesIncludedInLayout=true;
   b.strokeTopWeight=1;b.strokeBottomWeight=1;b.strokeRightWeight=1;b.strokeLeftWeight=0;b.resize(it.ddw,n.height);b.setBoundVariable('width',V(it.dd));b.layoutSizingVertical='FILL';
   for(const k of ['topRightRadius','bottomRightRadius'])b.setBoundVariable(k,V('datepicker/dropdown/border-radius'));
   const di=iconInst('Icon/calendar',it.isz,'datepicker/dropdown/color');b.appendChild(di);if(K['Icon'])REF(di,{mainComponent:K['Icon']});}
  if(it.bl==='stacked'){const g=figma.createAutoLayout('VERTICAL',{name:'Buttons'});g.fills=[];c.appendChild(g);g.layoutPositioning='ABSOLUTE';
   g.resize(D.G.btn,n.height-2);g.setBoundVariable('width',V('inputnumber/button/width'));g.primaryAxisSizingMode='FIXED';g.counterAxisSizingMode='FIXED';g.x=it.iw-1-D.G.btn;g.y=1;g.constraints={horizontal:'MAX',vertical:'STRETCH'};
   for(const [nm,ic,cr] of [['Increment','Icon/angle-up',['topRightRadius']],['Decrement','Icon/angle-down',['bottomRightRadius']]]){const b=button(it,nm,ic);g.appendChild(b);b.layoutSizingHorizontal='FILL';b.layoutSizingVertical='FILL';
    for(const k of cr)b.setBoundVariable(k,V('inputnumber/button/border-radius'));}}
 }else{const H=it.bl==='horizontal';c.layoutMode=H?'HORIZONTAL':'VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='MIN';
  const order=H?[['Decrement','Icon/minus'],null,['Increment','Icon/plus']]:[['Increment','Icon/angle-up'],null,['Decrement','Icon/angle-down']];
  order.forEach((o,ix)=>{if(!o){c.appendChild(n);for(const k of RAD)n[k]=0;if(!H){const t=n.findOne(x=>x.type==='TEXT');if(t)t.textAlignHorizontal='CENTER';}return;}
   const b=button(it,o[0],o[1]);c.appendChild(b);b.strokes=[paint(V('inputnumber/button/border-color'))];b.strokeAlign='INSIDE';b.strokesIncludedInLayout=true; // CSS border adds to the button size
   const first=ix===0;const W={strokeTopWeight:1,strokeBottomWeight:1,strokeLeftWeight:1,strokeRightWeight:1};
   if(H){W[first?'strokeRightWeight':'strokeLeftWeight']=0;b.setBoundVariable('width',V('inputnumber/button/width'));b.layoutSizingVertical='FILL';
    for(const k of first?['topLeftRadius','bottomLeftRadius']:['topRightRadius','bottomRightRadius'])b.setBoundVariable(k,V('inputnumber/button/border-radius'));}
   else{W[first?'strokeBottomWeight':'strokeTopWeight']=0;b.layoutSizingHorizontal='FILL';for(const k of ['paddingTop','paddingBottom'])b.setBoundVariable(k,V('inputnumber/button/vertical-padding'));
    for(const k of first?['topLeftRadius','topRightRadius']:['bottomLeftRadius','bottomRightRadius'])b.setBoundVariable(k,V('inputnumber/button/border-radius'));}
   Object.assign(b,W);});
  if(H)c.counterAxisAlignItems='CENTER';}
 // fluid by default (#67): the wrapper keeps its browser width as a FIXED size and the inner InputText fills it, so resizing an instance stretches the field
 if(c.layoutMode==='HORIZONTAL')c.primaryAxisSizingMode='FIXED';else c.counterAxisSizingMode='FIXED';n.layoutSizingHorizontal='FILL';
 n.isExposedInstance=true;c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
// variants that use the Icon swap property first: Figma drops a swap property no layer references yet
const ORDER=[...IT].sort((a,b)=>((b.icon||b.dd)?1:0)-((a.icon||a.dd)?1:0));
for(const it of ORDER){it.px0=10.5;let c=byName[it.n];if(c)ids.rebuilt++;else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {sync:SY,set:set.id,...ids,inSet:set.children.length,sizes:set.children.map(c=>c.name.replace(/[A-Za-z ]+=/g,'')+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2))};`;

const VERIFY = `
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set');
const IT=variants(D.set,D.G);const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?';}return VN[id];};
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const errs=[];let lit=0;const by={};for(const c of set.children)by[c.name]=c;
for(const it of IT){const c=by[it.n];if(!c){errs.push(it.n+' missing');continue;}const n=c.findChild(x=>x.name==='InputText');
 if(!n||n.type!=='INSTANCE'){errs.push(it.n+' no InputText instance');continue;}
 const mc=await n.getMainComponentAsync();if(!mc||mc.parent.name!=='InputText')errs.push(it.n+' inner not InputText');if(!n.isExposedInstance)errs.push(it.n+' not exposed');
 if(it.pad&&await b(n,it.pos==='left'?'paddingLeft':'paddingRight')!==it.pad)errs.push(it.n+' padding not bound');
 if(Math.abs(n.width-it.iw)>0.05)errs.push(it.n+' inner width '+n.width+' != '+it.iw);
 for(const x of c.findAll(x=>x.type!=='INSTANCE'||x.name==='Icon'))for(const key of ['fills','strokes'])if(x[key]&&x[key]!==figma.mixed)for(const q of x[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color)&&!(x.parent&&x.parent.type==='INSTANCE'))lit++;}
return {set:D.setName,checked:IT.length,inSet:set.children.length,errors:errs.length,errs:errs.slice(0,20),literalPaints:lit,sizes:set.children.map(c=>c.name.replace(/[A-Za-z ]+=/g,'')+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2))};`;

const DESC = {
    datepicker: 'PrimeNG: <p-datepicker> (field) | Story: components-datepicker--playground | Version: 0.1.0 | Status: experimental | Composed from an InputText instance (#61, #65) | Icon display none = showIcon off; input / button = showIcon + iconDisplay | Panel: DatePicker Panel | Dropdown hover/active not built',
    iconfield: 'PrimeNG: <p-iconfield> + <p-inputicon> around pInputText | Story: components-iconfield--playground | Version: 0.1.0 | Status: experimental | Composed from an InputText instance (#61): set State, Variant, Invalid, text on the nested InputText; do not change its Size | Icon: swap any Icon/*',
    password: 'PrimeNG: <p-password> | Story: components-password--playground | Version: 0.1.0 | Status: experimental | Composed from an InputText instance (#61) | Toggle mask = toggleMask (swap Icon/eye ↔ Icon/eye-slash) | Not built: strength meter, clear icon (#63)',
    inputnumber: 'PrimeNG: <p-inputnumber> | Story: components-inputnumber--playground | Version: 0.1.0 | Status: experimental | Composed from an InputText instance (#61) | Buttons = showButtons + buttonLayout | Button hover/pressed colours not built (#64)'
}[SET];
const ICON = { iconfield: 'Icon/search', password: 'Icon/eye', inputnumber: null, datepicker: 'Icon/calendar' }[SET];
const head = `const D=${JSON.stringify({ set: SET, setName: NAMES[SET], desc: DESC, icon: ICON, G: GEO })};\n${SPEC}\n`;
for (const [f, code] of [[`11-composite-${SET}.js`, head + BUILD], [`11-composite-${SET}-verify.js`, head + VERIFY]]) {
    if (code.length > 45000) throw new Error(`${f} too long`);
    await writeFile(join(OUT, 'calls', f), code);
}
console.log(`${NAMES[SET]}: ${items.length} variants validated against plan.json → calls/11-composite-${SET}.js (+ -verify)`);
