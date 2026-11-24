#!/usr/bin/env node
/**
 * InputText → Figma: PILOT_CHECKLIST Day 5, plan agent/PLAN_INPUTTEXT.md (DECISIONS #50–#53).
 * Set 'InputText' on page 02 Components: Size 3 × Variant 2 × State 4 × Invalid 2 × Content 3 = 144 variants.
 * Writes use_figma calls to tokens/figma/calls/: 08-inputtext-N.js (build) and 08-inputtext-verify-N.js (check).
 * Same pattern as figma-button.mjs: the variant rules (SPEC) are ONE function; Node runs it to validate every
 * variable name against tokens/figma/plan.json, and the same text ships inside each call so Figma computes the variants.
 * Re-run: variants found by name are rebuilt in place (node kept); missing ones created; nothing deleted (#37).
 * Source CSS: node_modules/@primeuix/styles/dist/inputtext/index.mjs (Aura). Rule → Figma table in PLAN_INPUTTEXT.md.
 * Usage (from app/sakai-ng): npm run figma:inputtext
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const MAX_CHARS = 45000;
const PER_CALL = 48;    // same limit as Button: Figma throws "unexpected error" when a call runs too long
const PER_VERIFY = 144; // whole set in one verify call
const SET_NAME = 'InputText';
const PROPS = ['Placeholder', 'Value'];

const A = {
    size: ['small', 'base', 'large'],
    variant: ['outlined', 'filled'],
    state: ['default', 'hover', 'focus', 'disabled'],
    invalid: ['false', 'true'],
    content: ['placeholder', 'value', 'empty'],
};

// ---- variant rules: runs in Node (validation) AND in Figma (build/verify). Plain JS, no imports. ----
const SPEC = `function variants(A){
// w = browser default <input> width (size=20), from screenshots/manifest.csv; no Aura token (design-only literal)
const SZ={small:{px:'inputtext/sm/padding-x',py:'inputtext/sm/padding-y',ts:'InputText/Text sm',w:149.5},
base:{px:'inputtext/padding-x',py:'inputtext/padding-y',ts:'InputText/Text base',w:172},
large:{px:'inputtext/lg/padding-x',py:'inputtext/lg/padding-y',ts:'InputText/Text lg',w:194.5}};
const CW=220,CH=60,PAD=24,out=[];const ix=(a,v)=>A[a].indexOf(v);
for(const size of A.size)for(const variant of A.variant)for(const invalid of A.invalid)for(const state of A.state)for(const content of A.content){
 const inv=invalid==='true',dis=state==='disabled',it={sz:SZ[size]};
 it.n='Size='+size+', Variant='+variant+', State='+state+', Invalid='+invalid+', Content='+content;
 // background: .p-inputtext / .p-variant-filled(:hover/:focus) / :disabled (disabled wins, later in the CSS)
 it.bg=dis?'inputtext/disabled-background':variant==='filled'?(state==='hover'?'inputtext/filled-hover-background':state==='focus'?'inputtext/filled-focus-background':'inputtext/filled-background'):'inputtext/background';
 // border: invalid stays red in every state (#53, Angular forms); otherwise :enabled:hover / :enabled:focus
 it.st=inv?'inputtext/invalid-border-color':state==='hover'?'inputtext/hover-border-color':state==='focus'?'inputtext/focus-border-color':'inputtext/border-color';
 // text: ::placeholder / .p-invalid::placeholder (no disabled placeholder rule); value: color / :disabled color
 it.fg=content==='placeholder'?(inv?'inputtext/invalid-placeholder-color':'inputtext/placeholder-color'):(dis?'inputtext/disabled-color':'inputtext/color');
 it.sh=state!=='focus'; // :enabled:focus sets box-shadow to focus.ring.shadow = none
 it.p=content==='placeholder'?'Placeholder':'Value';it.e=content==='empty'; // empty: text kept at opacity 0 so the line box keeps the height
 it.x=PAD+(ix('state',state)*A.content.length+ix('content',content))*CW;
 it.y=PAD+((ix('size',size)*A.variant.length+ix('variant',variant))*A.invalid.length+ix('invalid',invalid))*CH;
 out.push(it);}
return out;}`;
const FIXED = { rd: 'inputtext/border-radius', shadow: 'inputtext/shadow' };

// ---- validate in Node against plan.json ----
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const items = new Function(`${SPEC}; return variants;`)()(A);
const missing = new Set();
for (const n of [FIXED.rd, FIXED.shadow, ...items.flatMap((it) => [it.sz.px, it.sz.py, it.sz.ts, it.bg, it.st, it.fg])]) if (!known.has(n)) missing.add(n);
if (missing.size) throw new Error(`Not in plan.json: ${[...missing].join(', ')}`);
const expected = Object.values(A).reduce((n, v) => n * v.length, 1);
if (items.length !== expected) throw new Error(`Expected ${expected} variants, got ${items.length}`);
if (new Set(items.map((i) => i.n)).size !== items.length) throw new Error('Duplicate variant names');

// ---- Figma-side code ----
const COMMON = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const ALL=variants(D.A);const IT=ALL.slice(D.from,D.to);`;

const BUILD = `${COMMON}
const need=new Set([D.F.rd]);for(const it of IT)for(const n of [it.sz.px,it.sz.py,it.bg,it.st,it.fg])need.add(n);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));const V=n=>VB[n];
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;
for(const n of new Set(IT.map(i=>i.sz.ts))){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(!ES[D.F.shadow])throw new Error('Missing effect style '+D.F.shadow);
let CUR=null; // bound paints store the colour resolved for the node being built (Figma draws strokes with the stored colour)
const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:[],rebuilt:[]};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200); // measured before creating, below everything on the page
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;set.x=0;set.y=y;ids.created.push(c.id);ids.newSet=set.id;}
set.description=D.desc;
const K={};const defs=set.componentPropertyDefinitions;for(const k in defs)K[k.split('#')[0]]=k;
for(const n of D.props)if(!K[n])K[n]=set.addComponentProperty(n,'TEXT',n);
async function build(c,it){CUR=c;for(const k of [...c.children])k.remove();const S=it.sz;
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='MIN';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.clipsContent=true;
 c.resize(S.w,c.height);c.strokesIncludedInLayout=true; // CSS box: 1px border adds to the size
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(S.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(S.px));
 for(const k of RAD)c.setBoundVariable(k,V(D.F.rd));
 c.fills=[paint(V(it.bg))];c.strokes=[paint(V(it.st))];c.strokeWeight=1;c.strokeAlign='INSIDE';
 if(it.sh)await c.setEffectStyleIdAsync(ES[D.F.shadow].id);else c.effects=[]; /* plain effects array detaches the style */
 const t=figma.createText();c.appendChild(t);await t.setTextStyleIdAsync(TS[S.ts].id);t.characters=it.p;t.autoRename=false;t.name='Text'; // Figma renames text layers after their content unless autoRename is off
 t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';t.textTruncation='ENDING';t.maxLines=1;
 t.fills=[paint(V(it.fg))];t.opacity=it.e?0:1; /* only the fill differs per variant: formatting of a property-bound text spreads to every variant (#48) */
 t.componentPropertyReferences={characters:K[it.p]};
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c){ids.rebuilt.push(c.id);}else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created.push(c.id);}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {set:set.id,range:[D.from,D.to],of:ALL.length,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length};`;

const VERIFY = `${COMMON}
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set '+D.setName);
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
const by={};for(const c of set.children)by[c.name]=c;const errs=[],lit=[];let nerr=0;
const E=(it,m)=>{nerr++;if(errs.length<40)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};
const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const S=it.sz;
 for(const k of ['paddingTop','paddingBottom'])eq(it,k,await b(c,k),S.py);for(const k of ['paddingLeft','paddingRight'])eq(it,k,await b(c,k),S.px);
 for(const k of RAD)eq(it,k,await b(c,k),D.F.rd);
 eq(it,'fill',await pv(c.fills[0]),it.bg);eq(it,'stroke',await pv(c.strokes[0]),it.st);eq(it,'strokeWeight',c.strokeWeight,1);
 eq(it,'width',Math.round(c.width*100)/100,S.w);
 const es=c.effectStyleId?await figma.getStyleByIdAsync(c.effectStyleId):null;eq(it,'shadow',es?es.name:null,it.sh?D.F.shadow:null);
 const t=c.findOne(x=>x.name==='Text');if(!t){E(it,'no Text');continue;}
 eq(it,'text fill',await pv(t.fills[0]),it.fg);const ts=await figma.getStyleByIdAsync(t.textStyleId);eq(it,'textStyle',ts&&ts.name,S.ts);
 eq(it,'text prop',t.componentPropertyReferences&&t.componentPropertyReferences.characters,K[it.p]);eq(it,'text opacity',t.opacity,it.e?0:1);
 for(const n of [c,...c.findAll(()=>true)])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit.push(c.name+' > '+n.name+' '+key);}
const sizes={};for(const it of IT){const c=by[it.n];if(c){const k=it.sz.ts.split(' ').pop()+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}}
const vp={};const d=set.componentPropertyDefinitions;for(const k in d)vp[k.split('#')[0]]=d[k].type==='VARIANT'?d[k].variantOptions.length:d[k].type;
return {set:D.setName,range:[D.from,D.to],of:ALL.length,checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit.length,lit:lit.slice(0,20),sizes,props:vp};`;

const DESC = 'PrimeNG: pInputText | Story: components-inputtext--playground | Version: 0.1.0 | Status: experimental'
    + ' | Readonly: no Aura style, looks like default (#51)'
    + ' | Invalid + hover/focus: border stays red as with Angular forms (#53); the [invalid] attribute replaces it on hover/focus'
    + ' | Width: browser default (size=20); set the instance to Fill for fluid'
    + ' | Content=empty: text kept at 0% opacity to hold the height';

const files = [];
const emit = async (file, code) => { if (code.length > MAX_CHARS) throw new Error(`${file} is ${code.length} chars`); await writeFile(join(OUT, 'calls', file), code); files.push(`${file} (${code.length})`); };
const head = (from, to) => `const D=${JSON.stringify({ A, setName: SET_NAME, desc: DESC, props: PROPS, F: FIXED, from, to })};\n${SPEC}\n`;
for (let i = 0, n = 1; i < items.length; i += PER_CALL, n++) await emit(`08-inputtext-${n}.js`, head(i, Math.min(i + PER_CALL, items.length)) + BUILD);
for (let i = 0, n = 1; i < items.length; i += PER_VERIFY, n++) await emit(`08-inputtext-verify-${n}.js`, head(i, Math.min(i + PER_VERIFY, items.length)) + VERIFY);
console.log(`InputText: ${items.length} variants validated against plan.json. Calls: ${files.join(', ')}`);
