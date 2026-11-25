#!/usr/bin/env node
/**
 * Message → Figma: batch 1 Group D (DECISIONS #76–#78).
 *   'Message'  Severity 6 × Variant 3 (default, outlined, simple) × Size 3 = 54
 *   properties: Text, Show icon, Closable. Icon fixed per severity, no Icon swap property (#78/#79: Figma forces a swap-property layer
 *   back to the property's single default). Close button default state only (#77).
 * Source CSS: node_modules/@primeuix/styles/dist/message/index.mjs (Aura).
 *   Border = CSS outline (outside the box, not in its size) → stroke OUTSIDE on an absolute Border layer.
 *   Background / border colours are color-mix → layer opacity bound to the -opacity variable (as Tag).
 *   Close button: margin-inline-start auto → Text fills, so a stretched message keeps × at the right.
 * Rebuild = update in place (#68). Writes calls/15-message-1.js (+ -verify-1.js).
 * Usage (from app/sakai-ng): npm run figma:message
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const MAX_CHARS = 45000;
const A = { severity: ['success', 'info', 'warn', 'error', 'secondary', 'contrast'], variant: ['default', 'outlined', 'simple'], size: ['small', 'base', 'large'] };
const ICON = { success: 'Icon/check-circle', info: 'Icon/info-circle', warn: 'Icon/exclamation-triangle', error: 'Icon/times-circle', secondary: 'Icon/info-circle', contrast: 'Icon/info-circle' };

const SPEC = `function variants(A,has){
const m='message/',out=[];const ix=(a,v)=>A[a].indexOf(v);const sz=s=>s==='base'?'':(s==='small'?'sm/':'lg/');
for(const sev of A.severity)for(const variant of A.variant)for(const size of A.size){
 const s=m+sev+'/',it={sev,variant,size,n:'Severity='+sev+', Variant='+variant+', Size='+size};
 it.px=variant==='simple'?m+'simple/content/padding':m+'content/'+sz(size)+'padding-x';it.py=variant==='simple'?m+'simple/content/padding':m+'content/'+sz(size)+'padding-y';
 it.ts='Message/Text '+({small:'sm',base:'base',large:'lg'})[size];it.isz=m+'icon/'+sz(size)+'size';it.csz=m+'close-icon/'+sz(size)+'size';
 it.fg=variant==='default'?s+'color':variant==='outlined'?s+'outlined/color':s+'simple/color';
 it.bg=variant==='default'?s+'background':null;it.bgo=it.bg&&has(s+'background-opacity')?s+'background-opacity':null;
 it.bd=variant==='simple'?null:variant==='outlined'?s+'outlined/border-color':s+'border-color';it.bdo=variant==='default'&&has(s+'border-color-opacity')?s+'border-color-opacity':null;
 it.bw=variant==='outlined'?m+'outlined/root/border-width':m+'border-width';
 it.sh=variant==='simple'?null:(sev==='secondary'||sev==='contrast')?m+s.slice(m.length)+'shadow (Light)':s+'shadow'; // contrast / secondary: Light style (effect styles have no modes)
 it.x=24+(ix('variant',variant)*A.size.length+ix('size',size))*200;it.y=24+ix('severity',sev)*56;
 out.push(it);}
return out;}`;

const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const items = new Function(`${SPEC}; return variants;`)()(A, (n) => known.has(n));
if (items.length !== 54) throw new Error('Expected 54 variants');
const missing = new Set();
for (const it of items) for (const k of ['px', 'py', 'isz', 'csz', 'fg', 'bg', 'bgo', 'bd', 'bdo', 'bw', 'ts']) if (it[k] && !known.has(it[k])) missing.add(it[k]);
for (const n of ['message/border-radius', 'message/content/gap', 'message/close-button/width', 'message/close-button/height']) if (!known.has(n)) missing.add(n);
if (missing.size) throw new Error(`Not in plan.json: ${[...missing].join(', ')}`);

const DESC = 'PrimeNG: <p-message> | Story: components-message--playground | Version: 0.1.0 | Status: experimental | Text, Show icon ([icon]; icon per severity, design default #78/#79: to change it select the Icon layer and swap it), Closable ([closable]) | Close button hover / focus not built (#77) | Border is a CSS outline: drawn outside, not part of the size | Stretch the instance: text fills, × stays right | contrast / secondary shadow uses the Light effect style (effect styles have no modes; 4% shadow)';

const BUILD = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const IT=variants(D.A,n=>!!VB[n]);
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Message/Text sm','Message/Text base','Message/Text lg']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC={};for(const n of [...new Set(Object.values(D.ICON)),'Icon/times']){IC[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!IC[n])throw new Error('Missing icon '+n);}
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Message');const ids={created:0,rebuilt:0};
if(!set){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);
 const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name='Message';set.x=0;set.y=y;ids.newSet=set.id;}
set.description=D.desc;
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
for(const [n,t,d] of [['Text','TEXT','Message content'],['Show icon','BOOLEAN',false],['Closable','BOOLEAN',false]])if(!K[n])K[n]=set.addComponentProperty(n,t,d);
${SYNC}${WRAP}
function icon(name,size,col){const i=IC[name].createInstance();i.setBoundVariable('width',V(size));i.setBoundVariable('height',V(size));
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(name+': no Shape layer');sh.fills=[paint(V(col))];return i;}
function layer(c,name){const r=figma.createRectangle();r.name=name;c.appendChild(r);r.layoutPositioning='ABSOLUTE';r.constraints={horizontal:'STRETCH',vertical:'STRETCH'};rad(r,V('message/border-radius'));return r;}
async function build0(c,it){CUR=c;
 c.layoutMode='HORIZONTAL';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.fills=[];c.strokes=[];c.clipsContent=false;rad(c,V('message/border-radius'));
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(it.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(it.px));c.setBoundVariable('itemSpacing',V('message/content/gap'));
 if(it.sh&&ES[it.sh])await c.setEffectStyleIdAsync(ES[it.sh].id);else c.effects=[];
 const i=icon(D.ICON[it.sev],it.isz,it.fg);i.name='Icon';c.appendChild(i);i.visible=false;REF(i,{visible:K['Show icon']});
 const t=figma.createText();c.appendChild(t);await t.setTextStyleIdAsync(TS[it.ts].id);t.characters='Message content';t.autoRename=false;t.name='Text';t.fills=[paint(V(it.fg))];
 t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';REF(t,{characters:K['Text']});
 const cb=figma.createFrame();cb.name='Close';c.appendChild(cb);cb.layoutMode='HORIZONTAL';cb.primaryAxisAlignItems='CENTER';cb.counterAxisAlignItems='CENTER';cb.fills=[];
 cb.primaryAxisSizingMode='FIXED';cb.counterAxisSizingMode='FIXED';cb.resize(24.5,24.5);cb.setBoundVariable('width',V('message/close-button/width'));cb.setBoundVariable('height',V('message/close-button/height'));rad(cb,V('message/close-button/height')); // Aura radius 50%: circle
 const x=icon('Icon/times',it.csz,it.fg);x.name='Icon';cb.appendChild(x);cb.visible=false;REF(cb,{visible:K['Closable']});
 if(it.bg){const b=layer(c,'Background');b.fills=[paint(V(it.bg))];if(it.bgo)b.setBoundVariable('opacity',V(it.bgo));c.insertChild(0,b);}
 if(it.bd){const o=layer(c,'Border');o.fills=[];o.strokes=[paint(V(it.bd))];o.strokeAlign='OUTSIDE';for(const k of ['strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight'])o.setBoundVariable(k,V(it.bw));
  if(it.bdo)o.setBoundVariable('opacity',V(it.bdo));c.insertChild(it.bg?1:0,o);}
 for(const n of c.children)if(n.layoutPositioning==='ABSOLUTE'){n.resize(c.width,c.height);n.x=0;n.y=0;}
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c)ids.rebuilt++;else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created++;}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes={};for(const c of set.children){const k=c.name.split(', ').slice(1).join(' ').replace(/[A-Za-z]+=/g,'')+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}
const icons={};for(const c of set.children.filter(c=>c.name.endsWith('Variant=default, Size=base'))){const i=c.findChild(x=>x.name==='Icon');icons[c.name.split(',')[0]]=(await i.getMainComponentAsync()).name;}
return {sync:SY,set:set.id,...ids,inSet:set.children.length,sizes,icons,missingShadow:IT.filter(it=>it.sh&&!ES[it.sh]).map(it=>it.sh)};`;

const VERIFY = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);figma.skipInvisibleInstanceChildren=false;
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const IT=variants(D.A,n=>!!VB[n]);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Message');const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const by={};for(const c of set.children)by[c.name]=c;const errs=[];let nerr=0,lit=0;
const E=(it,m)=>{nerr++;if(errs.length<30)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const g=n=>c.findChild(x=>x.name===n);
 eq(it,'pad x',await b(c,'paddingLeft'),it.px);eq(it,'pad y',await b(c,'paddingTop'),it.py);eq(it,'gap',await b(c,'itemSpacing'),'message/content/gap');
 const t=g('Text');eq(it,'text',await pv(t.fills[0]),it.fg);eq(it,'text style',(await figma.getStyleByIdAsync(t.textStyleId)).name,it.ts);eq(it,'text prop',t.componentPropertyReferences.characters,K['Text']);
 const i=g('Icon');eq(it,'icon colour',await pv(i.findOne(x=>x.name==='Shape').fills[0]),it.fg);eq(it,'icon size',await b(i,'width'),it.isz);eq(it,'icon props',JSON.stringify(i.componentPropertyReferences),JSON.stringify({visible:K['Show icon']}));
 eq(it,'icon default',(await i.getMainComponentAsync()).name,D.ICON[it.sev]);
 const cb=g('Close');eq(it,'close prop',cb.componentPropertyReferences.visible,K['Closable']);eq(it,'close w',await b(cb,'width'),'message/close-button/width');const x=cb.findChild(n=>n.name==='Icon');eq(it,'close icon',await b(x,'width'),it.csz);eq(it,'close colour',await pv(x.findOne(n=>n.name==='Shape').fills[0]),it.fg);
 const bg=g('Background');eq(it,'bg',bg?await pv(bg.fills[0]):null,it.bg);if(bg)eq(it,'bg opacity',await b(bg,'opacity'),it.bgo);
 const bd=g('Border');eq(it,'border',bd?await pv(bd.strokes[0]):null,it.bd);if(bd){eq(it,'border w',await b(bd,'strokeTopWeight'),it.bw);eq(it,'border opacity',await b(bd,'opacity'),it.bdo);eq(it,'outside',bd.strokeAlign,'OUTSIDE');}
 const es=c.effectStyleId?(await figma.getStyleByIdAsync(c.effectStyleId)).name:null;eq(it,'shadow',es,it.sh);
 for(const n of [c,...c.findAll(x=>x.type!=='INSTANCE')])for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key])if(q.type==='SOLID'&&!(q.boundVariables&&q.boundVariables.color))lit++;}
return {checked:IT.length,inSet:set.children.length,errors:nerr,errs,literalPaints:lit};`;

const head = `const D=${JSON.stringify({ A, ICON, desc: DESC })};\n${SPEC}\n`;
const files = [];
for (const [f, code] of [['15-message-1.js', head + BUILD], ['15-message-verify-1.js', head + VERIFY]]) {
    if (code.length > MAX_CHARS) throw new Error(`${f} is ${code.length} chars`);
    await writeFile(join(OUT, 'calls', f), code); files.push(`${f} (${code.length})`);
}
console.log(`Message: 54 variants validated against plan.json. Calls: ${files.join(', ')}`);
