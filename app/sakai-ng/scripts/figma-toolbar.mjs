#!/usr/bin/env node
/**
 * Toolbar → Figma: batch 2 (DECISIONS #89). One component 'Toolbar' (no variants) with prefilled, exposed groups.
 * Source CSS (@primeuix/styles toolbar, Aura): .p-toolbar flex, align center, justify space-between, wrap, padding toolbar.padding,
 *   border 1px toolbar.border-color, radius toolbar.border-radius, background toolbar.background, gap toolbar.gap.
 *   .p-toolbar-start / -center / -end: flex, align center. Items in Sakai are spaced with class mr-2 (0.5rem = 7px, not a token).
 * Defaults = Sakai CRUD toolbar (src/app/pages/crud/crud.ts): start New + Delete (disabled, no selection), end Export.
 *   Also present, hidden: a third start button, the center search (IconField) and an end SplitButton (UI Kit toolbar).
 * Properties: Show start, Show center, Show end. Items are exposed instances: edit, hide or swap them.
 * Rebuild = update in place (#68). Writes calls/19-toolbar-1.js; example calls/19-toolbar-example.js (hand-written).
 * Usage (from app/sakai-ng): npm run figma:toolbar
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const VARS = ['toolbar/background', 'toolbar/border-color', 'toolbar/border-radius', 'toolbar/gap', 'toolbar/padding'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Variables not in plan.json: ${missing.join(', ')}`);

const code = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const SET=n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing set '+n);return s;};
const VAR=(s,w)=>{const c=SET(s).children.find(c=>Object.entries(w).every(([k,v])=>c.variantProperties[k]===v));if(!c)throw new Error(s+' '+JSON.stringify(w));return c;};
const P=(inst,vals)=>{const K={};for(const k in inst.componentProperties)K[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!K[k])throw new Error(inst.name+': no prop '+k);o[K[k]]=v;}inst.setProperties(o);};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
${SYNC}${WRAP}
const SEC={Severity:'secondary',Variant:'solid',Size:'base',State:'default',Rounded:'false'};
async function build0(c,it){CUR=c;
 c.layoutMode='HORIZONTAL';c.layoutWrap='WRAP';c.primaryAxisAlignItems='SPACE_BETWEEN';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.resize(884,c.height);c.clipsContent=false;
 for(const k of ['paddingTop','paddingBottom','paddingLeft','paddingRight'])c.setBoundVariable(k,V('toolbar/padding'));c.setBoundVariable('itemSpacing',V('toolbar/gap'));c.setBoundVariable('counterAxisSpacing',V('toolbar/gap'));
 c.fills=[paint(V('toolbar/background'))];c.strokes=[paint(V('toolbar/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true; // CSS border adds to the size
 for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])c.setBoundVariable(k,V('toolbar/border-radius'));
 const group=(name,prop)=>{const g=figma.createFrame();g.name=name;c.appendChild(g);g.layoutMode='HORIZONTAL';g.primaryAxisSizingMode='AUTO';g.counterAxisSizingMode='AUTO';g.counterAxisAlignItems='CENTER';g.itemSpacing=7;g.fills=[];g.clipsContent=false;REF(g,{visible:K[prop]});return g;}; // 7 = Sakai mr-2 (0.5rem), not a token
 const btn=(g,name,label,icon,extra)=>{const w=Object.assign({},SEC,extra||{});const i=VAR('Button',w).createInstance();i.name=name;g.appendChild(i);P(i,{Label:label,'Icon left':true,Icon:IC(icon).id,Raised:false});i.isExposedInstance=true;return i;};
 const s=group('Start','Show start');btn(s,'Button 1','New','Icon/plus');btn(s,'Button 2','Delete','Icon/trash',{Variant:'outlined',State:'disabled'});const b3=btn(s,'Button 3','Button','Icon/print');b3.visible=false;
 const m=group('Center','Show center');m.visible=false;const f=VAR('IconField',{'Icon position':'left',Size:'base'}).createInstance();f.name='Search';m.appendChild(f);f.isExposedInstance=true;
 const inn=f.findOne(x=>x.type==='INSTANCE'&&x.name==='InputText');P(inn,{Placeholder:'Search'});
 const e=group('End','Show end');const sp=VAR('SplitButton',{Severity:'primary',Variant:'solid',Size:'base',Rounded:'false'}).createInstance();sp.name='SplitButton';e.appendChild(sp);sp.isExposedInstance=true;sp.visible=false;
 btn(e,'Button','Export','Icon/upload');
 c.x=it.x;c.y=it.y;}
let T=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='Toolbar');if(!T){T=figma.createComponent();T.name='Toolbar';pg.appendChild(T);T.x=0;T.y=below();}
T.description='PrimeNG: <p-toolbar> (#start / #center / #end templates) | Story: components-toolbar--playground | Version: 0.1.0 | Status: experimental (#89) | Defaults = Sakai CRUD toolbar; hidden extras: Button 3, Center search, End SplitButton (UI Kit toolbar) | Items are exposed: edit, hide (eye) or swap them (e.g. to Button Icon for icon-only buttons) | Item spacing 7 = Sakai mr-2 | Stretch to the page width';
const K={};for(const k in T.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const [n,d] of [['Show start',true],['Show center',false],['Show end',true]])if(!K[n])K[n]=T.addComponentProperty(n,'BOOLEAN',d);
await build(T,{x:T.x,y:T.y});
return {toolbar:T.id,size:T.width+'x'+T.height,groups:T.children.map(g=>g.name+' '+g.width.toFixed(1)+'x'+g.height.toFixed(1)+(g.visible?'':' (hidden)')),sync:SY};`;

await writeFile(join(OUT, 'calls', '19-toolbar-1.js'), code);
console.log(`Toolbar: variables found in plan.json. Call: 19-toolbar-1.js (${code.length})`);
