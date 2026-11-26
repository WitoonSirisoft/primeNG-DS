#!/usr/bin/env node
/**
 * Toast → Figma: batch 2 (DECISIONS #94, mirrors Message #76–#79). 'Toast' Severity 6 = 6 variants.
 * Source: @primeuix/styles toast + primeng 21 toast template + captures (Storybook toast story):
 *   .p-toast width toast.width; message: border toast.border-width solid border-color (color-mix → layer opacity), radius,
 *   background (color-mix → layer opacity), box-shadow (per-severity effect style, drawn behind a transparent layer #94),
 *   backdrop-filter blur(toast.blur) → background blur bound to toast/blur.
 *   content: flex row, align start, padding toast.content.padding, gap toast.content.gap; icon toast.icon.size in severity color;
 *   text column gap toast.text.gap: summary (Toast/Summary, color) + detail (Toast/Detail, detail-color). With no detail the
 *   empty detail element still keeps the gap (capture: 46.8 tall) → Show detail hides the text inside a wrapper, not the wrapper.
 *   close button toast.close-button.width/height, round, transparent, icon toast.close-icon.size, inside a wrapper of its size,
 *   pulled up and right by 25% of its width (margin -25% 0 0 0; right -25%) = 6.125.
 *   Icons (template): success check, info info-circle, error times-circle, warn exclamation-triangle, secondary/contrast info-circle.
 * Properties: Summary, Detail, Show detail, Show icon, Closable. Icon fixed per severity (no swap, #79); close default state only (#77).
 * Rebuild = update in place (#68). Writes calls/21-toast-1.js. Example: calls/21-toast-example.js.
 * Usage (from app/sakai-ng): npm run figma:toast
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const SEV = ['info', 'success', 'warn', 'error', 'secondary', 'contrast'];
const ICON = { success: 'Icon/check', info: 'Icon/info-circle', error: 'Icon/times-circle', warn: 'Icon/exclamation-triangle', secondary: 'Icon/info-circle', contrast: 'Icon/info-circle' };
const TEXT = { info: ['Info Message', 'PrimeNG rocks'], success: ['Success Message', 'Message sent'], warn: ['Warn Message', 'There are unsaved changes'], error: ['Error Message', 'Validation failed'], secondary: ['Secondary Message', 'Message content'], contrast: ['Contrast Message', 'Message content'] };
const MIXED = new Set(['info', 'success', 'warn', 'error']); // background / border use color-mix → opacity variables

const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const need = ['toast/width', 'toast/blur', 'toast/border-radius', 'toast/content/padding', 'toast/content/gap', 'toast/text/gap', 'toast/icon/size', 'toast/close-button/width', 'toast/close-icon/size'];
for (const s of SEV) for (const k of ['background', 'border-color', 'color', 'detail-color']) need.push(`toast/${s}/${k}`);
for (const s of MIXED) need.push(`toast/${s}/background-opacity`, `toast/${s}/border-color-opacity`);
const missing = need.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Variables not in plan.json: ${missing.join(', ')}`);

// one default text for every variant: a TEXT property has a single default (cf. #79); Sakai texts go in the example
const ITEMS = SEV.map((s, i) => ({ n: `Severity=${s}`, s, icon: ICON[s], text: ['Toast Summary', 'Toast detail'], sakai: TEXT[s], mixed: MIXED.has(s), shadow: s === 'secondary' || s === 'contrast' ? `toast/${s}/shadow (Light)` : `toast/${s}/shadow`, x: 24, y: 24 + i * 96 }));

const code = `const IT=${JSON.stringify(ITEMS)};
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Toast/Summary','Toast/Detail']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;for(const it of IT)if(!ES[it.shadow])throw new Error('Missing effect style '+it.shadow);
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const CLEAR={type:'SOLID',color:{r:0,g:0,b:0},opacity:0}; // literal 'transparent' (#42)
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const icon=(name,size,col)=>{const i=IC(name).createInstance();i.setBoundVariable('width',V(size));i.setBoundVariable('height',V(size));const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape');sh.fills=[paint(V(col))];return i;};
const abs=(c,name)=>{const r=figma.createRectangle();r.name=name;c.appendChild(r);r.layoutPositioning='ABSOLUTE';r.resize(c.width,c.height);r.x=0;r.y=0;r.constraints={horizontal:'STRETCH',vertical:'STRETCH'};for(const k of RAD)r.setBoundVariable(k,V('toast/border-radius'));return r;};
${SYNC}${WRAP}
async function build0(c,it){CUR=c;const p='toast/'+it.s+'/';
 c.layoutMode='HORIZONTAL';c.primaryAxisSizingMode='FIXED';c.counterAxisSizingMode='AUTO';c.counterAxisAlignItems='MIN';c.clipsContent=false;c.fills=[];
 c.resize(350,c.height);c.setBoundVariable('width',V('toast/width'));
 for(const k of ['paddingTop','paddingBottom','paddingLeft','paddingRight'])c.setBoundVariable(k,V('toast/content/padding'));c.setBoundVariable('itemSpacing',V('toast/content/gap'));
 c.strokes=[CLEAR];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true; // the 1px border adds to the size (drawn by the Border layer)
 const ic=icon(it.icon,'toast/icon/size',p+'color');ic.name='Icon';c.appendChild(ic);REF(ic,{visible:K['Show icon']});
 const col=figma.createFrame();col.name='Text';c.appendChild(col);col.layoutMode='VERTICAL';col.fills=[];col.primaryAxisSizingMode='AUTO';col.layoutSizingHorizontal='FILL';col.setBoundVariable('itemSpacing',V('toast/text/gap'));
 const su=await txt(col,it.text[0],'Toast/Summary',p+'color','Summary');su.layoutSizingHorizontal='FILL';su.textAutoResize='HEIGHT';REF(su,{characters:K['Summary']});
 const dw=figma.createFrame();dw.name='Detail';col.appendChild(dw);dw.layoutMode='VERTICAL';dw.fills=[];dw.primaryAxisSizingMode='AUTO';dw.layoutSizingHorizontal='FILL'; // stays when the text is hidden: the gap remains, as in code
 const de=await txt(dw,it.text[1],'Toast/Detail',p+'detail-color','Text');de.layoutSizingHorizontal='FILL';de.textAutoResize='HEIGHT';REF(de,{characters:K['Detail'],visible:K['Show detail']});
 const sp=figma.createFrame();sp.name='Spacer';dw.appendChild(sp);sp.fills=[];sp.resize(10,0.01);sp.layoutSizingHorizontal='FILL'; // Figma keeps a hug frame's size when its only child is hidden; this keeps the wrapper (and the gap) at ~0 when Show detail is off
 const cw=figma.createFrame();cw.name='Close';c.appendChild(cw);cw.layoutMode='NONE';cw.fills=[];cw.clipsContent=false;cw.resize(24.5,18.375);cw.setBoundVariable('width',V('toast/close-button/width')); // height 18.375 = 24.5 − 25%: margin-top −25% means the button takes 75% of its height in the row (literal, derived)
 const cb=figma.createFrame();cb.name='Button';cw.appendChild(cb);cb.layoutMode='HORIZONTAL';cb.primaryAxisAlignItems='CENTER';cb.counterAxisAlignItems='CENTER';cb.primaryAxisSizingMode='FIXED';cb.counterAxisSizingMode='FIXED';cb.resize(24.5,24.5);
 cb.setBoundVariable('width',V('toast/close-button/width'));cb.setBoundVariable('height',V('toast/close-button/height'));for(const k of RAD)cb.setBoundVariable(k,V('toast/close-button/width'));cb.fills=[];
 cb.x=6.125;cb.y=-6.125; // margin -25% 0 0 0; right -25% (of the 24.5 wrapper)
 const ci=icon('Icon/times','toast/close-icon/size',p+'color');ci.name='Icon';cb.appendChild(ci);REF(cw,{visible:K['Closable']});
 // layers behind: Shadow (transparent, effect style drawn behind), Background (+ blur), Border (inside stroke)
 const sh=abs(c,'Shadow');sh.fills=[CLEAR];await sh.setEffectStyleIdAsync(ES[it.shadow].id);
 const bg=abs(c,'Background');bg.fills=[paint(V(p+'background'))];if(it.mixed)bg.setBoundVariable('opacity',V(p+'background-opacity'));
 bg.effects=[figma.variables.setBoundVariableForEffect({type:'BACKGROUND_BLUR',radius:1.5,visible:true},'radius',V('toast/blur'))];
 const bo=abs(c,'Border');bo.fills=[];bo.strokes=[paint(V(p+'border-color'))];bo.strokeAlign='INSIDE';bo.setBoundVariable('strokeWeight',V('toast/border-width'));if(it.mixed)bo.setBoundVariable('opacity',V(p+'border-color-opacity'));
 c.insertChild(0,bo);c.insertChild(0,bg);c.insertChild(0,sh);
 c.x=it.x;c.y=it.y;}
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Toast');
if(!set){const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);const y=below();set=figma.combineAsVariants([c],pg);set.name='Toast';set.x=0;set.y=y;}
set.description='PrimeNG: <p-toast> + MessageService.add({ severity, summary, detail, closable }) | Story: components-toast--playground | Version: 0.1.0 | Status: experimental (#94) | Summary → summary, Detail / Show detail → detail, Show icon → (icon), Closable → closable | Icon fixed per severity (#79); close button default state only (#77) | Stack toasts top-right with 1rem (14) between them';
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const [n,t,d] of [['Summary','TEXT','Toast Summary'],['Detail','TEXT','Toast detail'],['Show detail','BOOLEAN',true],['Show icon','BOOLEAN',true],['Closable','BOOLEAN',true]])if(!K[n])K[n]=set.addComponentProperty(n,t,d);
const by={};for(const c of set.children)by[c.name]=c;let created=0;
for(const it of IT){let c=by[it.n];if(!c){c=figma.createComponent();c.name=it.n;set.appendChild(c);created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {set:set.id,created,sizes:set.children.map(c=>c.name+' '+c.width+'x'+c.height.toFixed(2)),sync:SY};`;

await writeFile(join(OUT, 'calls', '21-toast-1.js'), code);
console.log(`Toast: ${ITEMS.length} variants, variables found in plan.json. Call: 21-toast-1.js (${code.length})`);
