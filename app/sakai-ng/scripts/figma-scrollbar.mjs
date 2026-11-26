#!/usr/bin/env node
/**
 * Scrollbar → Figma: batch 2, table overflow (DECISIONS #88). DESIGN-ONLY.
 *   PrimeNG DataTable has no scrollbar styling: [scrollable] / responsive scroll uses the browser's native scrollbar.
 *   This draws the macOS overlay look (thin rounded thumb, no track) so designs can show that a table scrolls.
 *   'Scrollbar'  Direction horizontal | vertical = 2
 *   Thumb fills the bar; its start / end are the instance's padding (layers inside an instance can't be resized, padding can):
 *   start padding = inset + scrolled ÷ total × track, end padding = inset + (total − visible − scrolled) ÷ total × track (track = bar − 2 × inset).
 *   Variables (design-only): scrollbar/size (thumb thickness 7), scrollbar/inset (2), scrollbar/thumb-color (black 50% / white 50%).
 * Rebuild = update in place (#68). Writes calls/17-scrollbar-1.js. The example is calls/17-scrollbar-example.js (hand-written).
 * Usage (from app/sakai-ng): npm run figma:scrollbar
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const VARS = ['scrollbar/size', 'scrollbar/inset', 'scrollbar/thumb-color'];

const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Variables not in plan.json: ${missing.join(', ')} (run npm run figma:plan)`);

const ITEMS = [
    { n: 'Direction=horizontal', dir: 'H', len: 400, end: 240, x: 24, y: 24 },
    { n: 'Direction=vertical', dir: 'V', len: 200, end: 120, x: 448, y: 24 }
];

const code = `const IT=${JSON.stringify(ITEMS)};
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
${SYNC}${WRAP}
async function build0(c,it){CUR=c;const H=it.dir==='H';
 c.layoutMode=H?'HORIZONTAL':'VERTICAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.primaryAxisAlignItems='MIN';c.counterAxisAlignItems='CENTER';c.itemSpacing=0;c.fills=[];c.clipsContent=true;
 if(H)c.resize(it.len,c.height);else c.resize(c.width,it.len);
 const [S,E,X1,X2]=H?['paddingLeft','paddingRight','paddingTop','paddingBottom']:['paddingTop','paddingBottom','paddingLeft','paddingRight'];
 for(const k of [S,X1,X2])c.setBoundVariable(k,V('scrollbar/inset'));c.setBoundVariable(E,null);c[E]=it.end; // end padding = rest of the track after the thumb (instance override)
 const t=figma.createFrame();t.name='Thumb';c.appendChild(t);t.layoutMode='NONE';
 if(H){t.resize(100,7);t.setBoundVariable('height',V('scrollbar/size'));t.layoutSizingHorizontal='FILL';}else{t.resize(7,100);t.setBoundVariable('width',V('scrollbar/size'));t.layoutSizingVertical='FILL';}
 t.fills=[paint(V('scrollbar/thumb-color'))];for(const k of RAD)t.setBoundVariable(k,V('scrollbar/size')); // pill: radius >= half thickness
 c.x=it.x;c.y=it.y;}
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Scrollbar');
if(!set){const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);const y=below();set=figma.combineAsVariants([c],pg);set.name='Scrollbar';set.x=0;set.y=y;}
set.description='DESIGN-ONLY (#88): no PrimeNG component. DataTable [scrollable] / responsive scroll uses the browser\\'s native scrollbar; this shows the macOS overlay look. | Status: experimental | Thumb fills the bar: set the instance padding — start = 2 + scrolled ÷ total × track, end = 2 + (total − visible − scrolled) ÷ total × track (track = bar − 4) | Place on the clipped table container (absolute, bottom / right edge)';
const by={};for(const c of set.children)by[c.name]=c;let created=0;
for(const it of IT){let c=by[it.n];if(!c){c=figma.createComponent();c.name=it.n;set.appendChild(c);created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {set:set.id,created,variants:set.children.map(c=>c.name+' '+c.width+'x'+c.height),sync:SY};`;

await writeFile(join(OUT, 'calls', '17-scrollbar-1.js'), code);
console.log(`Scrollbar: 2 variants, variables ${VARS.join(', ')} found in plan.json. Call: 17-scrollbar-1.js (${code.length})`);
