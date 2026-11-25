#!/usr/bin/env node
/**
 * DatePicker panel → Figma: batch 1, plan agent/PLAN_DATEPICKER.md (DECISIONS #65, #66, #68). The field is built by figma-composite.mjs --set=datepicker.
 *   'DatePicker Date'  State (default, hover, selected, today, disabled, other-month) = 6 variants, property Day (text)
 *   'DatePicker Panel' one component: header (Button instances prev/next + month/year title) + weekday row + 5 week rows of Date instances
 *                      + button bar (Today / Clear, boolean property 'Button bar', on by default, #66)
 * Panel width hugs the 7 x 35 day grid (browser inline: 268). Example month: November 2026 (1st = Sunday), 18 selected, 24 today,
 * 1–2 disabled, Dec 1–5 other-month (as the reference screenshot).
 * UPDATE IN PLACE (#68): every layer is found by name (and type) and updated; missing layers are created, unknown layers removed.
 * Layers keep their node IDs, so overrides made in instances (Month text, hidden Week 5, swapped day State) survive a rebuild.
 * Writes tokens/figma/calls/12-datepicker.js. Upsert by name, never delete components.
 * Usage (from app/sakai-ng): npm run figma:datepicker
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');

// State → [background or null, text colour, opacity variable or null] (Aura datepicker CSS; disabled / other-month measured: date colour at 60%)
const STATES = {
    default: [null, 'datepicker/date/color', null],
    hover: ['datepicker/date/hover-background', 'datepicker/date/hover-color', null],
    selected: ['datepicker/date/selected-background', 'datepicker/date/selected-color', null],
    today: ['datepicker/today/background', 'datepicker/today/color', null],
    disabled: [null, 'datepicker/date/color', 'disabled-opacity'],
    'other-month': [null, 'datepicker/date/color', 'disabled-opacity']
};
const WEEKS = [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21], [22, 23, 24, 25, 26, 27, 28], [29, 30, 'd1', 'd2', 'd3', 'd4', 'd5']];
const stateOf = (d) => (String(d).startsWith('d') ? 'other-month' : d <= 2 ? 'disabled' : d === 18 ? 'selected' : d === 24 ? 'today' : 'default');
const VARS = ['datepicker/date/padding', 'datepicker/date/width', 'datepicker/date/height', 'datepicker/panel/padding', 'datepicker/panel/background', 'datepicker/panel/border-color', 'datepicker/panel/border-radius',
    'datepicker/header/background', 'datepicker/header/border-color', 'datepicker/header/padding-bottom', 'datepicker/title/gap', 'datepicker/title/font-weight',
    'datepicker/select-month/padding-x', 'datepicker/select-month/padding-y', 'datepicker/select-month/border-radius', 'datepicker/select-month/color',
    'datepicker/select-year/padding-x', 'datepicker/select-year/padding-y', 'datepicker/select-year/border-radius', 'datepicker/select-year/color',
    'datepicker/day-view/margin-top', 'datepicker/week-day/padding', 'datepicker/week-day/font-weight', 'datepicker/week-day/color',
    'datepicker/buttonbar/padding-top', 'datepicker/buttonbar/padding-right', 'datepicker/buttonbar/padding-bottom', 'datepicker/buttonbar/padding-left', 'datepicker/buttonbar/border-color',
    ...Object.values(STATES).flat().filter(Boolean)];

const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const missing = [...new Set(VARS)].filter((n) => !known.has(n));
if (missing.length) throw new Error(`Not in plan.json: ${missing.join(', ')}`);
if (!known.has('datepicker/panel/shadow')) throw new Error('effect style datepicker/panel/shadow missing');

const CODE = `
const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS=(await figma.getLocalTextStylesAsync()).find(s=>s.name==='Body/Base');if(!TS)throw new Error('Body/Base missing');
await figma.loadFontAsync(TS.fontName);await figma.loadFontAsync({family:TS.fontName.family,style:'Medium'});
const ES=(await figma.getLocalEffectStylesAsync()).find(s=>s.name==='datepicker/panel/shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
const pad=(n,v)=>{for(const k of ['paddingTop','paddingBottom','paddingLeft','paddingRight'])n.setBoundVariable(k,v);};
const st={created:0,kept:0,removed:0,swapped:0};
// in place: find child by name + type, create if missing, put at index i; prune() removes children not listed
function kid(parent,name,type,i,make){let n=parent.children.find(c=>c.name===name&&c.type===type);if(n)st.kept++;else{n=make();n.name=name;parent.appendChild(n);st.created++;}
 if(parent.children.indexOf(n)!==i)parent.insertChild(i,n);return n;}
function prune(parent,keep){for(const c of [...parent.children])if(!keep.includes(c)){c.remove();st.removed++;}}
const frame=()=>{const f=figma.createFrame();f.clipsContent=false;return f;};
function al(parent,name,i,dir){const f=kid(parent,name,'FRAME',i,frame);f.layoutMode=dir;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.fills=[];f.strokes=[];f.clipsContent=false;return f;}
function inst(parent,name,i,main){const n=kid(parent,name,'INSTANCE',i,()=>main.createInstance());if(n.mainComponent&&n.mainComponent.id!==main.id){n.swapComponent(main);st.swapped++;}return n;}
async function text(parent,name,i,str,weightVar,colVar){const t=kid(parent,name,'TEXT',i,()=>figma.createText());t.autoRename=false;await t.setTextStyleIdAsync(TS.id);
 if(t.characters!==String(str))t.characters=String(str);
 if(weightVar){t.fontName={family:TS.fontName.family,style:'Medium'};t.setBoundVariable('fontWeight',V(weightVar));}t.fills=[paint(V(colVar))];return t;}
const props=(n,o)=>{const K={};for(const k in n.componentProperties)K[k.split('#')[0]]=k;const s={};for(const k in o)s[K[k]]=o[k];n.setProperties(s);};
const out={};
// ---- DatePicker Date ----
let dset=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='DatePicker Date');
if(!dset){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);const c=figma.createComponent();c.name='State=default';pg.appendChild(c);dset=figma.combineAsVariants([c],pg);dset.name='DatePicker Date';dset.x=0;dset.y=y;}
dset.description='PrimeNG: <p-datepicker> day cell (.p-datepicker-day-cell > .p-datepicker-day) | Version: 0.1.0 | Status: experimental | Used inside DatePicker Panel; swap State and edit Day per cell | disabled / other-month = date colour at disabled-opacity (measured) (#65)';
const DK={};for(const k in dset.componentPropertyDefinitions)DK[k.split('#')[0]]=k;if(!DK['Day'])DK['Day']=dset.addComponentProperty('Day','TEXT','18');
const dBy={};for(const c of dset.children)dBy[c.name]=c;let i=0;
for(const [s,[bg,fg,op]] of Object.entries(D.states)){let c=dBy['State='+s];if(!c){c=figma.createComponent();c.name='State='+s;dset.appendChild(c);}CUR=c;
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.fills=[];pad(c,V('datepicker/date/padding'));
 if(op)c.setBoundVariable('opacity',V(op));else{c.setBoundVariable('opacity',null);c.opacity=1;}
 const d=al(c,'Day',0,'HORIZONTAL');d.primaryAxisAlignItems='CENTER';d.counterAxisAlignItems='CENTER';d.primaryAxisSizingMode='FIXED';d.counterAxisSizingMode='FIXED';
 d.resize(28,28);d.setBoundVariable('width',V('datepicker/date/width'));d.setBoundVariable('height',V('datepicker/date/height'));rad(d,V('datepicker/date/height')); // Aura radius 50% = circle
 d.fills=bg?[paint(V(bg))]:[];const t=await text(d,'Label',0,'18',null,fg);t.componentPropertyReferences={characters:DK['Day']};prune(d,[t]);prune(c,[d]);
 c.x=24+i*56;c.y=24;i++;}
let mx=0,my=0;for(const c of dset.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}dset.resizeWithoutConstraints(mx+24,my+24);out.date=dset.id;
const dByName={};for(const c of dset.children)dByName[c.name]=c;
// ---- DatePicker Panel ----
const BS=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Button');
const BTN=w=>{const b=BS.children.find(c=>Object.entries(w).every(([k,v])=>String(c.variantProperties[k])===v));if(!b)throw new Error('Button variant missing '+JSON.stringify(w));return b;};
const NAV=BTN({Severity:'secondary',Variant:'text',Size:'base',State:'default',Rounded:'true'});const BAR=BTN({Severity:'secondary',Variant:'text',Size:'small',State:'default',Rounded:'false'});
let p=pg.findOne(n=>n.type==='COMPONENT'&&n.name==='DatePicker Panel');
if(!p){let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);p=figma.createComponent();p.name='DatePicker Panel';pg.appendChild(p);p.x=0;p.y=y;}
CUR=p;
p.description='PrimeNG: <p-datepicker> panel, day view (.p-datepicker-panel) | Story: components-datepicker--panel | Version: 0.1.0 | Status: experimental | Example November 2026 | Prev/next = Button (secondary, text, rounded, icon-only; width gap #44) | Button bar (Today / Clear) = property, on by default (#66) | Not built: month/year views, range, time picker (#65) | Rebuilt in place: instance overrides survive (#68)';
p.layoutMode='VERTICAL';p.primaryAxisSizingMode='AUTO';p.counterAxisSizingMode='AUTO';pad(p,V('datepicker/panel/padding'));
p.fills=[paint(V('datepicker/panel/background'))];p.strokes=[paint(V('datepicker/panel/border-color'))];p.strokeWeight=1;p.strokeAlign='INSIDE';p.strokesIncludedInLayout=true;rad(p,V('datepicker/panel/border-radius'));
await p.setEffectStyleIdAsync(ES.id);
const PK={};for(const k in p.componentPropertyDefinitions)PK[k.split('#')[0]]=k;if(!PK['Button bar'])PK['Button bar']=p.addComponentProperty('Button bar','BOOLEAN',true);
// header
const h=al(p,'Header',0,'HORIZONTAL');h.layoutSizingHorizontal='FILL';h.primaryAxisAlignItems='SPACE_BETWEEN';h.counterAxisAlignItems='CENTER';
h.fills=[paint(V('datepicker/header/background'))];h.setBoundVariable('paddingBottom',V('datepicker/header/padding-bottom'));
h.strokes=[paint(V('datepicker/header/border-color'))];h.strokeTopWeight=0;h.strokeLeftWeight=0;h.strokeRightWeight=0;h.strokeBottomWeight=1;h.strokeAlign='INSIDE';h.strokesIncludedInLayout=true;
const prev=inst(h,'Prev',0,NAV);props(prev,{'Show label':false,'Icon left':true,'Icon':IC('Icon/chevron-left').id});
const title=al(h,'Title',1,'HORIZONTAL');title.counterAxisAlignItems='CENTER';title.setBoundVariable('itemSpacing',V('datepicker/title/gap'));const tk=[];
for(const [ix,[w,str,nm]] of [['month','November','Month'],['year','2026','Year']].entries()){const f=al(title,nm,ix,'HORIZONTAL');tk.push(f);
 for(const k of ['paddingLeft','paddingRight'])f.setBoundVariable(k,V('datepicker/select-'+w+'/padding-x'));for(const k of ['paddingTop','paddingBottom'])f.setBoundVariable(k,V('datepicker/select-'+w+'/padding-y'));
 rad(f,V('datepicker/select-'+w+'/border-radius'));prune(f,[await text(f,nm,0,str,'datepicker/title/font-weight','datepicker/select-'+w+'/color')]);}
prune(title,tk);
const next=inst(h,'Next',2,NAV);props(next,{'Show label':false,'Icon left':true,'Icon':IC('Icon/chevron-right').id});prune(h,[prev,title,next]);
// day view
const dv=al(p,'Day view',1,'VERTICAL');dv.setBoundVariable('paddingTop',V('datepicker/day-view/margin-top'));const dvk=[];
const wr=al(dv,'Weekdays',0,'HORIZONTAL');dvk.push(wr);const wk=[];
for(const [ix,wd] of ['Su','Mo','Tu','We','Th','Fr','Sa'].entries()){const cell=al(wr,wd,ix,'HORIZONTAL');cell.primaryAxisAlignItems='CENTER';cell.layoutSizingHorizontal='FILL';wk.push(cell);
 pad(cell,V('datepicker/week-day/padding'));prune(cell,[await text(cell,'Label',0,wd,'datepicker/week-day/font-weight','datepicker/week-day/color')]);}
prune(wr,wk);
for(const [ri,week] of D.weeks.entries()){const r=al(dv,'Week '+(ri+1),ri+1,'HORIZONTAL');dvk.push(r);const rk=[];
 for(const [ci,d] of week.entries()){const n=inst(r,String(d),ci,dByName['State='+D.stateOf[String(d)]]);props(n,{'Day':String(d).replace('d','')});rk.push(n);}prune(r,rk);}
prune(dv,dvk);wr.layoutSizingHorizontal='FILL';
// button bar (showButtonBar): Today / Clear = Button secondary text small; .p-datepicker-buttonbar space-between, border-top (#66)
const bb=al(p,'Button bar',2,'HORIZONTAL');bb.layoutSizingHorizontal='FILL';bb.primaryAxisAlignItems='SPACE_BETWEEN';bb.counterAxisAlignItems='CENTER';
for(const sd of ['Top','Right','Bottom','Left'])bb.setBoundVariable('padding'+sd,V('datepicker/buttonbar/padding-'+sd.toLowerCase()));
bb.strokes=[paint(V('datepicker/buttonbar/border-color'))];bb.strokeTopWeight=1;bb.strokeLeftWeight=0;bb.strokeRightWeight=0;bb.strokeBottomWeight=0;bb.strokeAlign='INSIDE';bb.strokesIncludedInLayout=true;
const bk=[];for(const [ix,lb] of ['Today','Clear'].entries()){const b=inst(bb,lb,ix,BAR);props(b,{'Label':lb,'Show label':true,'Icon left':false,'Icon right':false});bk.push(b);}prune(bb,bk);
bb.componentPropertyReferences={visible:PK['Button bar']};
prune(p,[h,dv,bb]);
out.panel=p.id;out.panelSize=p.width+'x'+p.height;out.layers=st;
return out;`;

const STATE_OF = Object.fromEntries(WEEKS.flat().map((d) => [String(d), stateOf(d)]));
const code = `const D=${JSON.stringify({ states: STATES, weeks: WEEKS, stateOf: STATE_OF })};\n${CODE}`;
if (code.length > 45000) throw new Error('call too long');
await writeFile(join(OUT, 'calls', '12-datepicker.js'), code);
console.log(`DatePicker Date (6) + Panel validated against plan.json → calls/12-datepicker.js (${code.length} chars)`);
