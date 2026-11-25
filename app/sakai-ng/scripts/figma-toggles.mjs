#!/usr/bin/env node
/**
 * Checkbox, RadioButton, ToggleSwitch → Figma: batch 1 Group B, plan agent/PLAN_GROUP_B.md (DECISIONS #69–#71).
 *   'Checkbox'     Size 3 × Variant 2 × State 4 × Invalid 2 × Checked 3 (no, yes, indeterminate) = 144
 *   'RadioButton'  Size 3 × Variant 2 × State 4 × Invalid 2 × Checked 2 = 96
 *   'ToggleSwitch' Size 3 (sm/lg design-only, #71) × State 4 × Invalid 2 × Checked 2 = 48
 * Controls only, no label (#69). Invalid keeps the red border in hover/focus (#53/#70); invalid + disabled follows the browser (#72):
 * Checkbox/RadioButton show the disabled border, ToggleSwitch keeps red (its disabled CSS does not set a border).
 * Source CSS: node_modules/@primeuix/styles/dist/{checkbox,radiobutton,toggleswitch}/index.mjs (Aura).
 * Indeterminate: PrimeNG sets checked=false, so the box looks unchecked and shows the minus icon in checkbox.icon.color.
 * Rebuild = update in place (#68, lib/figma-sync.mjs). Writes calls/13-<set>-1.js (build) and 13-<set>-verify-1.js.
 * Usage (from app/sakai-ng): npm run figma:toggles -- [--set=checkbox|radiobutton|toggleswitch]   (default: all three)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const MAX_CHARS = 45000;
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1];
const ONLY = arg('set');

const SETS = {
    checkbox: { setName: 'Checkbox', A: { size: ['small', 'base', 'large'], variant: ['outlined', 'filled'], state: ['default', 'hover', 'focus', 'disabled'], invalid: ['false', 'true'], checked: ['no', 'yes', 'indeterminate'] }, count: 144,
        desc: 'PrimeNG: <p-checkbox> | Story: components-checkbox--playground | Version: 0.1.0 | Status: experimental | Control only, put a label next to it (#69) | Checked=indeterminate: [indeterminate]="true" (checked is false in code) | Invalid stays red in hover/focus (#53/#70); invalid + disabled shows the disabled border, as in the browser (#72)' },
    radiobutton: { setName: 'RadioButton', A: { size: ['small', 'base', 'large'], variant: ['outlined', 'filled'], state: ['default', 'hover', 'focus', 'disabled'], invalid: ['false', 'true'], checked: ['no', 'yes'] }, count: 96,
        desc: 'PrimeNG: <p-radiobutton> | Story: components-radiobutton--playground | Version: 0.1.0 | Status: experimental | Control only, put a label next to it (#69) | Invalid stays red in hover/focus (#53/#70); invalid + disabled shows the disabled border, as in the browser (#72)' },
    toggleswitch: { setName: 'ToggleSwitch', A: { size: ['small', 'base', 'large'], state: ['default', 'hover', 'focus', 'disabled'], invalid: ['false', 'true'], checked: ['no', 'yes'] }, count: 48,
        desc: 'PrimeNG: <p-toggleswitch> | Story: components-toggleswitch--playground | Version: 0.1.0 | Status: experimental | Control only (#69) | Size small/large = DESIGN-ONLY (#71): Aura has no toggleswitch sizes, code always renders base 35 × 21 | Invalid stays red in every state, also disabled, as in the browser (#53/#70/#72)' }
};

// ---- variant rules: runs in Node (validation) AND in Figma (build/verify). Plain JS, no imports. ----
const SPEC = `function variants(K,A){
const out=[];const ix=(a,v)=>A[a].indexOf(v);const sz=s=>s==='base'?'':(s==='small'?'sm':'lg')+'/';
const vs=A.variant||['outlined'];
for(const size of A.size)for(const variant of vs)for(const invalid of A.invalid)for(const state of A.state)for(const checked of A.checked){
 const f=K,ch=checked==='yes',inv=invalid==='true',dis=state==='disabled',hov=state==='hover',foc=state==='focus',it={kind:K};
 it.n='Size='+size+(A.variant?', Variant='+variant:'')+', State='+state+', Invalid='+invalid+', Checked='+checked;
 it.sh=!foc; // :focus-visible sets box-shadow to focus.ring.shadow (none)
 it.ring=foc;it.ro=f+'/focus-ring/offset';it.rw=f+'/focus-ring/width';it.rc=f+'/focus-ring/color';
 if(K==='toggleswitch'){
  it.w=size==='base'?f+'/width':f+'/'+sz(size)+'width';it.h=size==='base'?f+'/height':f+'/'+sz(size)+'height';it.hs=size==='base'?f+'/handle/size':f+'/'+sz(size)+'handle-size';
  it.bg=dis?f+'/disabled-background':ch?(hov?f+'/checked-hover-background':f+'/checked-background'):(hov?f+'/hover-background':f+'/background');
  it.st=inv?f+'/invalid-border-color':hov?(ch?f+'/checked-hover-border-color':f+'/hover-border-color'):(ch?f+'/checked-border-color':f+'/border-color');
  it.hb=dis?f+'/handle/disabled-background':ch?(hov?f+'/handle/checked-hover-background':f+'/handle/checked-background'):(hov?f+'/handle/hover-background':f+'/handle/background');
  it.on=ch;it.rr=f+'/border-radius';
  it.x=24+(ix('state',state)*A.checked.length+ix('checked',checked))*64;it.y=24+(ix('size',size)*A.invalid.length+ix('invalid',invalid))*44;
 }else{
  it.w=f+'/'+sz(size)+'width';it.h=f+'/'+sz(size)+'height';it.isz=f+'/icon/'+sz(size)+'size';
  it.bg=dis?f+'/disabled-background':ch?(hov?f+'/checked-hover-background':f+'/checked-background'):(variant==='filled'?f+'/filled-background':f+'/background');
  it.st=dis?f+'/checked-disabled-border-color':inv?f+'/invalid-border-color':foc?(ch?f+'/checked-focus-border-color':f+'/focus-border-color'):hov?(ch?f+'/checked-hover-border-color':f+'/hover-border-color'):(ch?f+'/checked-border-color':f+'/border-color');
  it.ic=checked==='no'?null:dis?f+'/icon/disabled-color':ch?(hov?f+'/icon/checked-hover-color':f+'/icon/checked-color'):f+'/icon/color';
  it.icon=K==='checkbox'?(checked==='indeterminate'?'Icon/minus':checked==='yes'?'Icon/check':null):null;
  it.dot=K==='radiobutton'&&ch;
  it.rr=K==='checkbox'?f+'/border-radius':it.h;it.ringR=K==='checkbox'?f+'/focus-ring-radius':it.h; // circle: radius = height (Figma caps at half)
  it.x=24+(ix('state',state)*A.checked.length+ix('checked',checked))*40;it.y=24+((ix('size',size)*vs.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*40;
 }
 out.push(it);}
return out;}`;

// ---- validate in Node against plan.json ----
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const variants = new Function(`${SPEC}; return variants;`)();
const files = [];
const emit = async (file, code) => { if (code.length > MAX_CHARS) throw new Error(`${file} is ${code.length} chars`); await writeFile(join(OUT, 'calls', file), code); files.push(`${file} (${code.length})`); };

const BUILD = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const IT=variants(D.K,D.A);
const need=new Set();for(const it of IT)for(const k of ['w','h','isz','hs','bg','st','ic','hb','rr','ringR','ro','rw','rc'])if(it[k])need.add(it[k]);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));const V=n=>VB[n];
const ES=(await figma.getLocalEffectStylesAsync()).find(s=>s.name===D.K+'/shadow');if(!ES)throw new Error('Missing effect style '+D.K+'/shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC={};for(const n of ['Icon/check','Icon/minus']){IC[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!IC[n])throw new Error('Missing icon '+n);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const num=v=>v.resolveForConsumer(CUR).value;
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:0,rebuilt:0};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.newSet=set.id;}
set.description=D.desc;
${SYNC}${WRAP}
async function build0(c,it){CUR=c;
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems=it.kind==='toggleswitch'?(it.on?'MAX':'MIN'):'CENTER';c.counterAxisAlignItems='CENTER';
 c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='FIXED';c.resize(num(V(it.w)),num(V(it.h)));c.setBoundVariable('width',V(it.w));c.setBoundVariable('height',V(it.h));
 c.clipsContent=false;c.fills=[paint(V(it.bg))];c.strokes=[paint(V(it.st))];c.strokeAlign='INSIDE';rad(c,V(it.rr));
 if(it.kind==='toggleswitch'){for(const k of ['strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight'])c.setBoundVariable(k,V('toggleswitch/border-width'));
  for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V('toggleswitch/gap')); // .p-toggleswitch-handle inset-inline-start: gap (checked: width − handle − gap)
  const hd=figma.createFrame();hd.name='Handle';c.appendChild(hd);hd.resize(num(V(it.hs)),num(V(it.hs)));hd.setBoundVariable('width',V(it.hs));hd.setBoundVariable('height',V(it.hs));
  rad(hd,V(it.hs));hd.fills=[paint(V(it.hb))];} // Aura handle radius 50% (percent: no variable) = circle
 else{c.strokeWeight=1; // Aura CSS: border 1px (no token)
  if(it.icon){const i=IC[it.icon].createInstance();i.name='Icon';c.appendChild(i);i.setBoundVariable('width',V(it.isz));i.setBoundVariable('height',V(it.isz));
   const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(it.icon+': no Shape layer');sh.fills=[paint(V(it.ic))];}
  if(it.dot){const d=figma.createFrame();d.name='Dot';c.appendChild(d);d.resize(num(V(it.isz)),num(V(it.isz)));d.setBoundVariable('width',V(it.isz));d.setBoundVariable('height',V(it.isz));
   rad(d,V(it.isz));d.fills=[paint(V(it.ic))];}}
 if(it.sh)await c.setEffectStyleIdAsync(ES.id);else c.effects=[];
 if(it.ring){const o=num(V(it.ro))+num(V(it.rw));const r=figma.createFrame();r.name='Focus ring';r.fills=[];c.appendChild(r);r.layoutPositioning='ABSOLUTE';
  r.resize(c.width+2*o,c.height+2*o);r.x=-o;r.y=-o;r.constraints={horizontal:'STRETCH',vertical:'STRETCH'};r.clipsContent=false;rad(r,V(it.ringR||it.rr));
  r.strokes=[paint(V(it.rc))];r.strokeAlign='INSIDE';for(const k of ['strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight'])r.setBoundVariable(k,V(it.rw));}
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c)ids.rebuilt++;else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {sync:SY,set:set.id,...ids,inSet:set.children.length,sizes};`;

const VERIFY = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);figma.skipInvisibleInstanceChildren=false;
const IT=variants(D.K,D.A);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set '+D.setName);
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const by={};for(const c of set.children)by[c.name]=c;const errs=[],lit=[];let nerr=0;
const E=(it,m)=>{nerr++;if(errs.length<30)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}
 eq(it,'w',await b(c,'width'),it.w);eq(it,'h',await b(c,'height'),it.h);eq(it,'bg',await pv(c.fills[0]),it.bg);eq(it,'border',await pv(c.strokes[0]),it.st);eq(it,'radius',await b(c,'topLeftRadius'),it.rr);
 eq(it,'shadow',!!c.effectStyleId,it.sh);
 const ring=c.children.find(x=>x.name==='Focus ring');eq(it,'ring',!!ring,it.ring);if(ring){eq(it,'ring colour',await pv(ring.strokes[0]),it.rc);eq(it,'ring width',await b(ring,'strokeTopWeight'),it.rw);eq(it,'ring radius',await b(ring,'topLeftRadius'),it.ringR||it.rr);}
 if(it.kind==='toggleswitch'){const hd=c.children.find(x=>x.name==='Handle');if(!hd){E(it,'no Handle');continue;}eq(it,'handle',await pv(hd.fills[0]),it.hb);eq(it,'handle size',await b(hd,'width'),it.hs);
  eq(it,'handle side',c.primaryAxisAlignItems,it.on?'MAX':'MIN');eq(it,'track border w',await b(c,'strokeTopWeight'),'toggleswitch/border-width');eq(it,'inset',await b(c,'paddingLeft'),'toggleswitch/gap');}
 else{const i=c.children.find(x=>x.name==='Icon');eq(it,'icon',i?(await i.getMainComponentAsync()).name:null,it.icon);
  if(i){eq(it,'icon colour',await pv(i.findOne(x=>x.name==='Shape').fills[0]),it.ic);eq(it,'icon size',await b(i,'width'),it.isz);}
  const d=c.children.find(x=>x.name==='Dot');eq(it,'dot',!!d,!!it.dot);if(d){eq(it,'dot colour',await pv(d.fills[0]),it.ic);eq(it,'dot size',await b(d,'width'),it.isz);}}
 for(const n of [c,...c.findAll(x=>x.type!=='INSTANCE')])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit.push(c.name+' > '+n.name+' '+key);}
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {set:D.setName,checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit.length,lit:lit.slice(0,5),sizes};`;

for (const [K, S] of Object.entries(SETS)) {
    if (ONLY && ONLY !== K) continue;
    const items = variants(K, S.A);
    if (items.length !== S.count || new Set(items.map((i) => i.n)).size !== S.count) throw new Error(`${K}: expected ${S.count} unique variants, got ${items.length}`);
    const missing = new Set();
    for (const it of items) for (const k of ['w', 'h', 'isz', 'hs', 'bg', 'st', 'ic', 'hb', 'rr', 'ringR', 'ro', 'rw', 'rc']) if (it[k] && !known.has(it[k])) missing.add(it[k]);
    for (const n of [`${K}/shadow`, ...(K === 'toggleswitch' ? ['toggleswitch/border-width', 'toggleswitch/gap'] : [])]) if (!known.has(n)) missing.add(n);
    if (missing.size) throw new Error(`${K}: not in plan.json: ${[...missing].join(', ')}`);
    const head = `const D=${JSON.stringify({ K, A: S.A, setName: S.setName, desc: S.desc })};\n${SPEC}\n`;
    await emit(`13-${K}-1.js`, head + BUILD);
    await emit(`13-${K}-verify-1.js`, head + VERIFY);
}
console.log(`Group B validated against plan.json. Calls: ${files.join(', ')}`);
