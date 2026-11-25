#!/usr/bin/env node
/**
 * Tag → Figma: PILOT_CHECKLIST Day 5, plan agent/PLAN_TAG.md (DECISIONS #55).
 * Set 'Tag' on page 02 Components: Severity 7 × Rounded 2 = 14 variants; icon via properties (Show icon + Icon swap).
 * Writes use_figma calls to tokens/figma/calls/: 09-tag-1.js (build) and 09-tag-verify-1.js (check).
 * Same pattern as figma-button.mjs / figma-inputtext.mjs: the variant rules (SPEC) are ONE function; Node validates
 * every variable name against tokens/figma/plan.json, and the same text ships inside each call.
 * Re-run: variants found by name are rebuilt in place (node kept); missing ones created; nothing deleted (#37).
 * Source CSS: node_modules/@primeuix/styles/dist/tag/index.mjs (Aura).
 * Usage (from app/sakai-ng): npm run figma:tag
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const MAX_CHARS = 45000;
const SET_NAME = 'Tag';

const A = {
    severity: ['none', 'secondary', 'success', 'info', 'warn', 'danger', 'contrast'],
    rounded: ['false', 'true'],
};

// ---- variant rules: runs in Node (validation) AND in Figma (build/verify). Plain JS, no imports. ----
const SPEC = `function variants(A,has){
const out=[];const ix=(a,v)=>A[a].indexOf(v);
for(const sev of A.severity)for(const rounded of A.rounded){
 const t=sev==='none'?'primary':sev,o='tag/'+t+'/background-opacity'; // none = severity omitted → .p-tag defaults use primary tokens
 out.push({n:'Severity='+sev+', Rounded='+rounded,bg:'tag/'+t+'/background',bo:has(o)?o:null,fg:'tag/'+t+'/color',
  rd:rounded==='true'?'tag/rounded-border-radius':'tag/border-radius',x:24+ix('severity',sev)*80,y:24+ix('rounded',rounded)*48});}
return out;}`;
const FIXED = { px: 'tag/padding-x', py: 'tag/padding-y', gap: 'tag/gap', isz: 'tag/icon/size', ts: 'Tag/Label', icon: 'Icon/check' };

// ---- validate in Node against plan.json ----
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const items = new Function(`${SPEC}; return variants;`)()(A, (n) => known.has(n));
const missing = new Set();
for (const n of [FIXED.px, FIXED.py, FIXED.gap, FIXED.isz, FIXED.ts, ...items.flatMap((it) => [it.bg, it.bo, it.fg, it.rd])]) if (n && !known.has(n)) missing.add(n);
if (missing.size) throw new Error(`Not in plan.json: ${[...missing].join(', ')}`);
if (items.length !== 14 || new Set(items.map((i) => i.n)).size !== 14) throw new Error('Expected 14 unique variants');

// ---- Figma-side code ----
const COMMON = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const IT=variants(D.A,n=>!!VB[n]);`;

const BUILD = `${COMMON}
const need=new Set([D.F.px,D.F.py,D.F.gap,D.F.isz]);for(const it of IT)for(const n of [it.bg,it.bo,it.fg,it.rd])if(n)need.add(n);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));const V=n=>VB[n];
const TS=(await figma.getLocalTextStylesAsync()).find(s=>s.name===D.F.ts);if(!TS)throw new Error('Missing text style '+D.F.ts);await figma.loadFontAsync(TS.fontName);
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC=ip.findOne(x=>x.type==='COMPONENT'&&x.name===D.F.icon);if(!IC)throw new Error('Missing icon '+D.F.icon);
let CUR=null; // bound paints store the colour resolved for the node being built
const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:[],rebuilt:[]};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200); // measured before creating, below everything on the page
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.created.push(c.id);ids.newSet=set.id;}
set.description=D.desc;
const want={'Value':['TEXT','Tag'],'Show icon':['BOOLEAN',false],'Icon':['INSTANCE_SWAP',IC.id]};
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const n of D.props)if(!K[n])K[n]=set.addComponentProperty(n,want[n][0],want[n][1]);
${SYNC}${WRAP}async function build0(c,it){CUR=c; // update in place (#68): build() in lib/figma-sync.mjs keeps old layers and syncs

 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.clipsContent=false;c.fills=[];c.strokes=[];
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(D.F.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(D.F.px));
 c.setBoundVariable('itemSpacing',V(D.F.gap));rad(c,V(it.rd));
 const i=IC.createInstance();i.name='Icon';c.appendChild(i);i.setBoundVariable('width',V(D.F.isz));i.setBoundVariable('height',V(D.F.isz));
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(IC.name+': no Shape layer, icon colour cannot be set');sh.fills=[paint(V(it.fg))];
 const t=figma.createText();c.appendChild(t);await t.setTextStyleIdAsync(TS.id);t.characters='Tag';t.autoRename=false;t.name='Label';t.fills=[paint(V(it.fg))];
 i.visible=false; // property default before the absolute layer is sized
 const bg=figma.createRectangle();bg.name='Background';c.appendChild(bg);bg.layoutPositioning='ABSOLUTE';bg.resize(c.width,c.height);bg.x=0;bg.y=0;bg.constraints={horizontal:'STRETCH',vertical:'STRETCH'};c.insertChild(0,bg);
 rad(bg,V(it.rd));bg.fills=[paint(V(it.bg))];if(it.bo)bg.setBoundVariable('opacity',V(it.bo));else{bg.setBoundVariable('opacity',null);bg.opacity=1;} // Dark: color-mix 16% → layer opacity
 REF(t,{characters:K['Value']});REF(i,{visible:K['Show icon'],mainComponent:K['Icon']});
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c){ids.rebuilt.push(c.id);}else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created.push(c.id);}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {sync:SY,set:set.id,of:IT.length,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length};`;

const VERIFY = `${COMMON}
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set '+D.setName);
await figma.root.children.find(p=>p.name==='01 Foundations').loadAsync();
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
const by={};for(const c of set.children)by[c.name]=c;const errs=[],lit=[];let nerr=0;
const E=(it,m)=>{nerr++;if(errs.length<40)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};
const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const g=n=>c.findOne(x=>x.name===n);
 for(const k of ['paddingTop','paddingBottom'])eq(it,k,await b(c,k),D.F.py);for(const k of ['paddingLeft','paddingRight'])eq(it,k,await b(c,k),D.F.px);
 eq(it,'gap',await b(c,'itemSpacing'),D.F.gap);for(const k of RAD)eq(it,k,await b(c,k),it.rd);
 const bg=g('Background');if(!bg){E(it,'no Background');continue;}eq(it,'bg',await pv(bg.fills[0]),it.bg);eq(it,'bgOpacity',await b(bg,'opacity'),it.bo);eq(it,'bgRadius',await b(bg,'topLeftRadius'),it.rd);
 const t=g('Label');if(!t){E(it,'no Label');continue;}eq(it,'label',await pv(t.fills[0]),it.fg);const ts=await figma.getStyleByIdAsync(t.textStyleId);eq(it,'textStyle',ts&&ts.name,D.F.ts);
 eq(it,'label prop',t.componentPropertyReferences&&t.componentPropertyReferences.characters,K['Value']);
 const i=g('Icon');if(!i){E(it,'no Icon');continue;}eq(it,'icon w',await b(i,'width'),D.F.isz);eq(it,'icon h',await b(i,'height'),D.F.isz);eq(it,'icon visible',i.visible,false);
 eq(it,'icon props',JSON.stringify(i.componentPropertyReferences),JSON.stringify({visible:K['Show icon'],mainComponent:K['Icon']}));
 for(const n of [c,bg,t])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit.push(c.name+' > '+n.name+' '+key);}
const sizes={};for(const c of set.children){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
const vp={};const d=set.componentPropertyDefinitions;for(const k in d)vp[k.split('#')[0]]=d[k].type==='VARIANT'?d[k].variantOptions.length:d[k].type;
return {checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit.length,lit,sizes,props:vp};`;

const DESC = 'PrimeNG: <p-tag> | Story: components-tag--playground | Version: 0.1.0 | Status: experimental'
    + ' | Severity none = severity omitted (primary look) | Icon: turn on Show icon, swap Icon (any Icon/*) | Not interactive: no states';

const files = [];
const emit = async (file, code) => { if (code.length > MAX_CHARS) throw new Error(`${file} is ${code.length} chars`); await writeFile(join(OUT, 'calls', file), code); files.push(`${file} (${code.length})`); };
const head = `const D=${JSON.stringify({ A, setName: SET_NAME, desc: DESC, props: ['Value', 'Show icon', 'Icon'], F: FIXED })};\n${SPEC}\n`;
await emit('09-tag-1.js', head + BUILD);
await emit('09-tag-verify-1.js', head + VERIFY);
console.log(`Tag: ${items.length} variants validated against plan.json. Calls: ${files.join(', ')}`);
