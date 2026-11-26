#!/usr/bin/env node
/**
 * SplitButton → Figma: batch 2 (DECISIONS #90). 'SplitButton' Severity 8 × Variant 3 × Size 3 × Rounded 2 = 144.
 * Source: primeng 21 splitbutton template + node_modules/@primeuix/styles/dist/splitbutton (Aura):
 *   two inner p-buttons (severity / text / outlined / size passed down; NOT raised or rounded):
 *   - Main  = Button (label, not rounded): .p-splitbutton-button → end corners 0, no end border
 *   - Menu  = Button with the label hidden + chevron-down (.p-splitbutton-dropdown has no icon input, so it is NOT p-button-icon-only:
 *     normal padding + svg icon) → start corners 0. Known gap: the svg is icon.size (14) at every size; Figma's Button icon box follows
 *     the size font (12.25 / 14 / 15.75), so small is 1.75 narrower and large's chevron 1.75 bigger.
 *   - .p-splitbutton-rounded → outer corners splitbutton.rounded-border-radius (2rem); .p-splitbutton-raised → box-shadow on the container
 *   The nested parts are exposed: set State (hover / disabled / loading), Label, Icon on each part, as in code.
 * Rebuild = update in place (#68). Writes calls/18-splitbutton-N.js (36 variants per call).
 * Usage (from app/sakai-ng): npm run figma:splitbutton
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const PER_CALL = 36;
const A = {
    severity: ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'],
    variant: ['solid', 'outlined', 'text'],
    size: ['small', 'base', 'large'],
    rounded: ['false', 'true']
};
const VARS = ['splitbutton/border-radius', 'splitbutton/rounded-border-radius', 'button/rounded-focus-ring-radius'];

const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = [...VARS, ...A.severity.map((s) => `button/${s}/background`)].filter((n) => !known.has(n));
if (missing.length) throw new Error(`Variables not in plan.json: ${missing.join(', ')}`);

const ITEMS = [];
let row = 0;
for (const severity of A.severity) for (const variant of A.variant) {
    let col = 0;
    for (const rounded of A.rounded) for (const size of A.size) {
        ITEMS.push({ n: `Severity=${severity}, Variant=${variant}, Size=${size}, Rounded=${rounded}`, severity, variant, size, rounded, x: 24 + col * 150, y: 24 + row * 64 });
        col++;
    }
    row++;
}

const BODY = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(!ES['splitbutton/raised-shadow'])throw new Error('Missing effect style splitbutton/raised-shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const CHEV=ip.findOne(x=>x.type==='COMPONENT'&&x.name==='Icon/chevron-down');if(!CHEV)throw new Error('Missing Icon/chevron-down');
const SET=n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing set '+n);return s;};
const BTN=SET('Button');
const VAR=(s,w)=>{const c=s.children.find(c=>Object.entries(w).every(([k,v])=>c.variantProperties[k]===v));if(!c)throw new Error(s.name+' '+JSON.stringify(w));return c;};
const P=(inst,vals)=>{const K={};for(const k in inst.componentProperties)K[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals))if(K[k])o[K[k]]=v;inst.setProperties(o);};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const CLEAR={type:'SOLID',color:{r:0,g:0,b:0},opacity:0};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
// corners of a nested Button part: root + its Background / Shadow / Focus ring layers (all share the button radius)
const corners=(inst,keys,val,ring)=>{for(const n of [inst,...['Background','Shadow'].map(x=>inst.findChild(y=>y.name===x)).filter(Boolean)])for(const k of keys){n.setBoundVariable(k,null);if(typeof val==='number')n[k]=val;else n.setBoundVariable(k,val);}
 const fr=inst.findChild(y=>y.name==='Focus ring');if(fr)for(const k of keys){fr.setBoundVariable(k,null);if(typeof ring==='number')fr[k]=ring;else fr.setBoundVariable(k,ring);}};
${SYNC}${WRAP}
async function build0(c,it){CUR=c;const rnd=it.rounded==='true';
 c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='CENTER';c.itemSpacing=0;c.fills=[];c.clipsContent=false;
 const R=rnd?V('splitbutton/rounded-border-radius'):V('splitbutton/border-radius');for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])c.setBoundVariable(k,R);
 const w={Severity:it.severity,Variant:it.variant,Size:it.size,State:'default',Rounded:'false'};
 const main=VAR(BTN,w).createInstance();main.name='Button';c.appendChild(main);P(main,{Label:'Save',Raised:false,'Icon left':false,'Icon right':false});
 const menu=VAR(BTN,w).createInstance();menu.name='Dropdown';c.appendChild(menu);P(menu,{'Show label':false,'Icon left':true,'Icon right':false,Icon:CHEV.id,Raised:false});
 // .p-splitbutton-button: end corners 0, no end border; .p-splitbutton-dropdown: start corners 0 (focus ring keeps 0 inside too)
 corners(main,['topRightRadius','bottomRightRadius'],0,0);corners(menu,['topLeftRadius','bottomLeftRadius'],0,0);
 main.strokeTopWeight=1;main.strokeRightWeight=0;main.strokeBottomWeight=1;main.strokeLeftWeight=1;
 if(rnd){corners(main,['topLeftRadius','bottomLeftRadius'],V('splitbutton/rounded-border-radius'),V('button/rounded-focus-ring-radius'));corners(menu,['topRightRadius','bottomRightRadius'],V('splitbutton/rounded-border-radius'),V('button/rounded-focus-ring-radius'));}
 main.isExposedInstance=true;menu.isExposedInstance=true;
 // .p-splitbutton-raised: shadow on the whole control (solid only, as Button #42)
 const sh=figma.createRectangle();sh.name='Shadow';c.appendChild(sh);sh.layoutPositioning='ABSOLUTE';sh.resize(c.width,c.height);sh.x=0;sh.y=0;sh.constraints={horizontal:'STRETCH',vertical:'STRETCH'};c.insertChild(0,sh);
 sh.fills=[it.variant==='solid'?paint(V('button/'+it.severity+'/background')):CLEAR];for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])sh.setBoundVariable(k,R);
 await sh.setEffectStyleIdAsync(ES['splitbutton/raised-shadow'].id);sh.visible=false;REF(sh,{visible:K['Raised']});
 c.x=it.x;c.y=it.y;}
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='SplitButton');
if(!set){const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);const y=below();set=figma.combineAsVariants([c],pg);set.name='SplitButton';set.x=0;set.y=y;}
set.description='PrimeNG: <p-splitbutton> | Story: components-splitbutton--playground | Version: 0.1.0 | Status: experimental (#90) | Nested Button (label) + Dropdown (Button, label hidden, chevron-down) are exposed: set Label, Icon and State (hover / disabled / loading) on each part — in code each part hovers on its own; disabled sets both | Raised = splitbutton raised shadow on the whole control';
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;if(!K['Raised'])K['Raised']=set.addComponentProperty('Raised','BOOLEAN',false);
const by={};for(const c of set.children)by[c.name]=c;let created=0;
for(const it of IT.slice(D.from,D.to)){let c=by[it.n];if(!c){c=figma.createComponent();c.name=it.n;set.appendChild(c);created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes={};for(const c of set.children.filter(c=>IT.slice(D.from,D.to).some(i=>i.n===c.name))){const k=c.name.match(/Size=\\w+/)[0]+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
return {set:set.id,range:[D.from,D.to],created,inSet:set.children.length,sizes,sync:SY};`;

const files = [];
for (let i = 0, n = 1; i < ITEMS.length; i += PER_CALL, n++) {
    const code = `const A=${JSON.stringify(A)};const IT=[];{let row=0;for(const severity of A.severity)for(const variant of A.variant){let col=0;for(const rounded of A.rounded)for(const size of A.size){IT.push({n:'Severity='+severity+', Variant='+variant+', Size='+size+', Rounded='+rounded,severity,variant,size,rounded,x:24+col*150,y:24+row*64});col++;}row++;}}\nif(IT.length!==${ITEMS.length})throw new Error('variant count');const D={from:${i},to:${Math.min(i + PER_CALL, ITEMS.length)}};\n${BODY}`;
    await writeFile(join(OUT, 'calls', `18-splitbutton-${n}.js`), code);
    files.push(`18-splitbutton-${n}.js (${code.length})`);
}
console.log(`SplitButton: ${ITEMS.length} variants, variables found in plan.json. Calls: ${files.join(', ')}`);
