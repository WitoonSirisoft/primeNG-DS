#!/usr/bin/env node
/**
 * Select → Figma: batch 1 Group C, plan agent/PLAN_GROUP_C.md (DECISIONS #73–#75).
 *   --set=field  'Select'  Size 3 × Variant 2 × State 4 × Invalid 2 × Content 3 = 144 (same rules as InputText #50–#54, #72)
 *                properties: Placeholder, Value (text), Show clear (boolean, #75). Default width 14rem = 196 (story; PrimeNG has none), fluid (#67).
 *   --set=panel  'Select Option', 'Select Option Group', 'Select Panel' (filter, groups, empty message, #74) — see PANEL below.
 * Source CSS: node_modules/@primeuix/styles/dist/select/index.mjs (Aura). Rebuild = update in place (#68, lib/figma-sync.mjs).
 * Usage (from app/sakai-ng): npm run figma:select -- --set=field|panel
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const MAX_CHARS = 45000;
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1];
const SET = arg('set') || 'field';

const A = { size: ['small', 'base', 'large'], variant: ['outlined', 'filled'], state: ['default', 'hover', 'focus', 'disabled'], invalid: ['false', 'true'], content: ['placeholder', 'value', 'empty'] };
const W = 196; // story width 14rem; design default (no token), fluid by default

// ---- variant rules: Node (validation) AND Figma (build/verify) ----
const SPEC = `function variants(A){
const f='select',out=[];const ix=(a,v)=>A[a].indexOf(v);
const SZ={small:{px:f+'/sm/padding-x',py:f+'/sm/padding-y',ts:'Select/Text sm',ic:f+'/sm/font-size'},base:{px:f+'/padding-x',py:f+'/padding-y',ts:'Select/Text base',ic:'icon-size'},large:{px:f+'/lg/padding-x',py:f+'/lg/padding-y',ts:'Select/Text lg',ic:f+'/lg/font-size'}};
for(const size of A.size)for(const variant of A.variant)for(const invalid of A.invalid)for(const state of A.state)for(const content of A.content){
 const inv=invalid==='true',dis=state==='disabled',hov=state==='hover',foc=state==='focus',it={sz:SZ[size]};
 it.n='Size='+size+', Variant='+variant+', State='+state+', Invalid='+invalid+', Content='+content;
 // .p-select / .p-variant-filled(:hover/.p-focus) / .p-disabled (background only)
 it.bg=dis?f+'/disabled-background':variant==='filled'?(hov?f+'/filled-hover-background':foc?f+'/filled-focus-background':f+'/filled-background'):f+'/background';
 // invalid red in every state (#53; disabled CSS sets no border, so the browser keeps red too, #72)
 it.st=inv?f+'/invalid-border-color':hov?f+'/hover-border-color':foc?f+'/focus-border-color':f+'/border-color';
 // label: .p-placeholder / .p-invalid .p-placeholder (beats disabled) / .p-disabled .p-select-label
 it.fg=content==='placeholder'?(inv?f+'/invalid-placeholder-color':dis?f+'/disabled-color':f+'/placeholder-color'):(dis?f+'/disabled-color':f+'/color');
 it.sh=!foc; // .p-focus box-shadow: focus.ring.shadow (none); ring width 0 in Aura (form-field)
 it.p=content==='placeholder'?'Placeholder':'Value';it.e=content==='empty';
 it.x=24+(ix('state',state)*A.content.length+ix('content',content))*230;it.y=24+((ix('size',size)*A.variant.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*60;
 out.push(it);}
return out;}`;

const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const files = [];
const emit = async (file, code) => { if (code.length > MAX_CHARS) throw new Error(`${file} is ${code.length} chars`); await writeFile(join(OUT, 'calls', file), code); files.push(`${file} (${code.length})`); };

const FIXED = ['select/border-radius', 'select/dropdown/width', 'select/dropdown/color', 'select/clear-icon/color', 'icon-size', 'Select/Text sm', 'Select/Text base', 'Select/Text lg'];
const DESC = 'PrimeNG: <p-select> | Story: components-select--playground | Version: 0.1.0 | Status: experimental | Same axes and rules as InputText (#73) | Show clear = showClear with a value (#75) | Width: 14rem default (no PrimeNG default), resize or Fill for fluid (#67) | Content=empty: text kept at 0% opacity to hold the height | Panel: Select Panel (open state)';

const FIELD = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const IT=variants(D.A);
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Select/Text sm','Select/Text base','Select/Text lg']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES=(await figma.getLocalEffectStylesAsync()).find(s=>s.name==='select/shadow');if(!ES)throw new Error('Missing effect style select/shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC={};for(const n of ['Icon/times','Icon/chevron-down']){IC[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!IC[n])throw new Error('Missing icon '+n);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:0,rebuilt:0};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.newSet=set.id;}
set.description=D.desc;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const [n,t,d] of [['Placeholder','TEXT','Select a city'],['Value','TEXT','Rome'],['Show clear','BOOLEAN',false]])if(!K[n])K[n]=set.addComponentProperty(n,t,d);
${SYNC}${WRAP}
function icon(name,size,col){const i=IC[name].createInstance();i.setBoundVariable('width',V(size));i.setBoundVariable('height',V(size));
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape layer');sh.fills=[paint(V(col))];return i;}
async function build0(c,it){CUR=c;const S=it.sz;
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='MIN';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(D.W,c.height);
 c.clipsContent=true;c.strokesIncludedInLayout=true;c.fills=[paint(V(it.bg))];c.strokes=[paint(V(it.st))];c.strokeWeight=1;c.strokeAlign='INSIDE';rad(c,V('select/border-radius'));
 if(it.sh)await c.setEffectStyleIdAsync(ES.id);else c.effects=[];
 const lb=figma.createFrame();lb.name='Label';c.appendChild(lb);lb.layoutMode='HORIZONTAL';lb.fills=[];lb.counterAxisSizingMode='AUTO';lb.layoutSizingHorizontal='FILL';
 for(const k of ['paddingTop','paddingBottom'])lb.setBoundVariable(k,V(S.py));for(const k of ['paddingLeft','paddingRight'])lb.setBoundVariable(k,V(S.px));
 const t=figma.createText();lb.appendChild(t);await t.setTextStyleIdAsync(TS[S.ts].id);t.characters=it.p;t.autoRename=false;t.name='Text';
 t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';t.textTruncation='ENDING';t.maxLines=1;t.fills=[paint(V(it.fg))];t.opacity=it.e?0:1;
 REF(t,{characters:K[it.p]});
 const cl=icon('Icon/times','icon-size','select/clear-icon/color');cl.name='Clear';c.appendChild(cl);cl.visible=false;REF(cl,{visible:K['Show clear']}); // .p-select-clear-icon: TimesIcon 1rem, before the trigger
 const dd=figma.createFrame();dd.name='Dropdown';c.appendChild(dd);dd.layoutMode='HORIZONTAL';dd.primaryAxisAlignItems='CENTER';dd.counterAxisAlignItems='CENTER';dd.fills=[];
 dd.primaryAxisSizingMode='FIXED';dd.resize(35,10);dd.setBoundVariable('width',V('select/dropdown/width'));dd.layoutSizingVertical='FILL';
 const ch=icon('Icon/chevron-down',S.ic,'select/dropdown/color');ch.name='Icon';dd.appendChild(ch);
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c)ids.rebuilt++;else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {sync:SY,set:set.id,...ids,inSet:set.children.length,sizes,props:Object.keys(set.componentPropertyDefinitions).map(k=>k.split('#')[0])};`;

const FIELD_VERIFY = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);figma.skipInvisibleInstanceChildren=false;
const IT=variants(D.A);const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set');
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
const by={};for(const c of set.children)by[c.name]=c;const errs=[];let nerr=0,lit=0;
const E=(it,m)=>{nerr++;if(errs.length<30)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const g=n=>c.findOne(x=>x.name===n);
 eq(it,'bg',await pv(c.fills[0]),it.bg);eq(it,'border',await pv(c.strokes[0]),it.st);eq(it,'radius',await b(c,'topLeftRadius'),'select/border-radius');eq(it,'shadow',!!c.effectStyleId,it.sh);eq(it,'width',c.width,D.W);
 const lb=g('Label');eq(it,'pad x',await b(lb,'paddingLeft'),it.sz.px);eq(it,'pad y',await b(lb,'paddingTop'),it.sz.py);
 const t=g('Text');eq(it,'text',await pv(t.fills[0]),it.fg);eq(it,'text style',(await figma.getStyleByIdAsync(t.textStyleId)).name,it.sz.ts);eq(it,'text prop',t.componentPropertyReferences.characters,K[it.p]);eq(it,'empty',t.opacity,it.e?0:1);
 const cl=g('Clear');eq(it,'clear prop',cl&&cl.componentPropertyReferences.visible,K['Show clear']);eq(it,'clear colour',await pv(cl.findOne(x=>x.name==='Shape').fills[0]),'select/clear-icon/color');
 const dd=g('Dropdown');eq(it,'trigger w',await b(dd,'width'),'select/dropdown/width');const ic=dd.findOne(x=>x.name==='Icon');eq(it,'chevron size',await b(ic,'width'),it.sz.ic);eq(it,'chevron colour',await pv(ic.findOne(x=>x.name==='Shape').fills[0]),'select/dropdown/color');
 for(const n of [c,...c.findAll(x=>x.type!=='INSTANCE')])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit++;}
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit,sizes};`;

// ---- panel parts (#74): Select Option (State × Check), Select Option Group, Select Panel (Content × Filter) ----
// .p-select-option: selected class is dropped in checkmark mode (PrimeNG: selected && !checkmark), the ✓ marks the choice.
const OPT = [['default', 'none'], ['focus', 'none'], ['selected', 'none'], ['selected-focus', 'none'], ['default', 'blank'], ['focus', 'blank'], ['default', 'checked'], ['focus', 'checked']];
const PANEL = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
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
${SYNC}${WRAP}
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
return {sync:SY,option:os.id,group:GROUP.id,panel:ps.id,sizes:[...os.children,GROUP,...ps.children].map(c=>c.name+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2))};`;

if (SET === 'field') {
    const items = new Function(`${SPEC}; return variants;`)()(A);
    if (items.length !== 144 || new Set(items.map((i) => i.n)).size !== 144) throw new Error('Expected 144 unique variants');
    const missing = new Set();
    for (const it of items) for (const n of [it.bg, it.st, it.fg, it.sz.px, it.sz.py, it.sz.ic]) if (!known.has(n)) missing.add(n);
    for (const n of FIXED) if (!known.has(n)) missing.add(n);
    if (missing.size) throw new Error(`Not in plan.json: ${[...missing].join(', ')}`);
    const head = `const D=${JSON.stringify({ A, W, setName: 'Select', desc: DESC })};\n${SPEC}\n`;
    await emit('14-select-field-1.js', head + FIELD);
    await emit('14-select-field-verify-1.js', head + FIELD_VERIFY);
}
if (SET === 'panel') {
    for (const n of ['select/option/padding-x', 'select/option/padding-y', 'select/option/check-padding-left', 'select/option/border-radius', 'select/option/color', 'select/option/focus-color', 'select/option/selected-color', 'select/option/selected-focus-color',
        'select/option/focus-background', 'select/option/selected-background', 'select/option/selected-focus-background', 'select/checkmark/gutter-end', 'select/checkmark/color', 'select/option-group/background', 'select/option-group/color',
        'select/option-group/padding-x', 'select/option-group/padding-y', 'select/overlay/background', 'select/overlay/border-color', 'select/overlay/border-radius', 'select/overlay/color', 'select/list/padding-x', 'select/list/padding-y', 'select/list/gap',
        'select/list/header/padding-top', 'select/list/header/padding-right', 'select/list/header/padding-bottom', 'select/list/header/padding-left', 'select/empty-message/padding-x', 'select/empty-message/padding-y', 'Select/Group'])
        if (!known.has(n)) throw new Error(`Not in plan.json: ${n}`);
    // Rome = selected-focus: PrimeNG focuses the selected option when the panel opens (as in the open captures)
    const PANELS = [
        { content: 'options', rows: [['o', 'New York', 'default'], ['o', 'Rome', 'selected-focus'], ['o', 'London', 'default'], ['o', 'Istanbul', 'default'], ['o', 'Paris', 'default']] },
        { content: 'grouped', rows: [['g', 'Italy'], ['o', 'Rome', 'selected-focus'], ['o', 'Milan', 'default'], ['g', 'United Kingdom'], ['o', 'London', 'default'], ['o', 'Manchester', 'default']] },
        { content: 'empty' }];
    await emit('14-select-panel-1.js', `const D=${JSON.stringify({ OPT, PANELS, W, LW: W - 2 - 7 })};\n` + PANEL);
}
console.log(`Select (${SET}) validated against plan.json. Calls: ${files.join(', ')}`);
