#!/usr/bin/env node
/**
 * Button family → Figma: PILOT_CHECKLIST Day 5, plan agent/PLAN_BUTTON.md (DECISIONS #29–#46).
 * Sets (--set=): main (default) 'Button' 864 · link 'Button Link' 18 · plain 'Button Plain' 36 · vertical 'Button Vertical' 36
 *                · badge 'Badge' 7 (experimental, nested in Button) · badge-in-button (add-only pass, #46).
 * Writes use_figma calls to tokens/figma/calls/: 07-<set>-N.js (build) and 07-<set>-verify-N.js (check).
 * The variant rules (SPEC) are ONE function: Node runs it to validate variable names against tokens/figma/plan.json,
 * and the same text ships inside each call, where Figma computes the variants itself (~9k chars per call).
 * Every main variant has its full name from the first run; axes not enabled use their default (--axes=, main only).
 * Re-run: variants found by name are rebuilt in place (node kept); missing ones created; nothing deleted (#37).
 * Known Figma behaviours handled here (see agent/HANDOFF.md §9): bound paints store their resolved colour; Figma ignores
 * paint opacity on bound paints, so 'transparent' is a literal 0% paint (#42); opacity variables are percent (#41);
 * calls fail with "unexpected error" when too long, so batches shrink as the set grows.
 * Usage (from app/sakai-ng): npm run figma:button -- [--set=main|link|plain|vertical|badge|badge-in-button] [--axes=...]
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const MAX_CHARS = 45000;
const PER_CALL = 48;    // variants built per call: Figma throws "unexpected error" when a call runs too long (144 failed at ~340, 72 at ~720)
const PER_VERIFY = 300; // variants checked per verify call

const A = {
    severity: ['primary', 'secondary', 'success', 'info', 'warn', 'danger', 'help', 'contrast'],
    variant: ['solid', 'outlined', 'text'],
    size: ['small', 'base', 'large'],
    state: ['default', 'hover', 'focus', 'active', 'disabled', 'loading'],
    rounded: ['false', 'true'],
};
const ORDER = ['severity', 'variant', 'size', 'state', 'rounded'];
const getArg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3);
const SET = getArg('set') || 'main';
const on = getArg('axes') ? getArg('axes').split(',').filter(Boolean) : ORDER;
for (const a of on) if (!A[a]) throw new Error(`Unknown axis ${a}; use ${ORDER.join(',')}`);
const SETS = {
    main: { name: 'Button', desc: '', props: ['Label', 'Show label', 'Icon left', 'Icon right', 'Icon', 'Raised', 'Badge'] },
    link: { name: 'Button Link', desc: ' | Code: [link]="true" (severity, outlined, text are ignored by PrimeNG) | Known gap: code underlines the label on hover; not shown in Figma (#48)', props: ['Label', 'Show label', 'Icon left', 'Icon right', 'Icon'] },
    plain: { name: 'Button Plain', desc: ' | Code: [plain]="true" with variant outlined or text (plain styles only those)', props: ['Label', 'Show label', 'Icon left', 'Icon right', 'Icon'] },
    vertical: { name: 'Button Vertical', desc: ' | Code: iconPos="top" | "bottom" (primary solid; combine with severity/variant in code)', props: ['Label', 'Show label', 'Icon', 'Raised'] },
};
if (!SETS[SET] && SET !== 'badge' && SET !== 'badge-in-button') throw new Error(`Unknown set ${SET}`);

// ---- variant rules: runs in Node (validation) AND in Figma (build/verify). Plain JS, no imports. ----
const SPEC = `function variants(A,on,has,SET){
const vals=a=>SET!=='main'||on.includes(a)?A[a]:[A[a][a==='size'?1:0]];const ix=(a,v)=>vals(a).indexOf(v);
const SZ={small:{px:'button/sm/padding-x',py:'button/sm/padding-y',ts:'Button/Label sm',ih:'button/sm/font-size',mh:'button/sm/line-height'},
base:{px:'button/padding-x',py:'button/padding-y',ts:'Button/Label base',ih:'typography/base/font-size',mh:'button/line-height'},
large:{px:'button/lg/padding-x',py:'button/lg/padding-y',ts:'Button/Label lg',ih:'button/lg/font-size',mh:'button/lg/line-height'}};
const RD={'false':['button/border-radius','button/focus-ring-radius'],'true':['button/rounded-border-radius','button/rounded-focus-ring-radius']};
const CW=130,CH=64,PAD=24,out=[];
const base=(size,state,rounded)=>{const k=state==='hover'||state==='active'?state:'default';return {k,sz:SZ[size],rd:RD[rounded],f:state==='focus',d:state==='disabled'||state==='loading',l:state==='loading',
 dir:'H',s1:'Icon left',s2:'Icon right',v1:state==='loading',v2:false,so:0,sb:'button/primary/background',rg:'button/primary/focus-ring/color',bo:null,ul:false,badge:false};};
const put=(it,row,col)=>{it.x=PAD+col*CW;it.y=PAD+row*CH;out.push(it);};
const solid=(it,sev)=>{const p=x=>it.k==='default'?x:it.k+'-'+x;it.bg='button/'+sev+'/'+p('background');it.st='button/'+sev+'/'+p('border-color');it.fg='button/'+sev+'/'+p('color');it.so=1;it.sb='button/'+sev+'/background';it.rg='button/'+sev+'/focus-ring/color';};
if(SET==='main'){
 for(const sev of vals('severity'))for(const variant of vals('variant'))for(const rounded of vals('rounded'))for(const size of vals('size'))for(const state of vals('state')){
  const it=base(size,state,rounded);it.n='Severity='+sev+', Variant='+variant+', Size='+size+', State='+state+', Rounded='+rounded;it.badge=true;
  if(variant==='solid')solid(it,sev);
  else{const pre='button/'+variant+'/'+sev,o=pre+'/'+it.k+'-background-opacity';it.bg=it.k==='default'?null:pre+'/'+it.k+'-background';
   it.bo=it.k!=='default'&&has(o)?o:null;it.st=variant==='outlined'?pre+'/border-color':null;it.fg=pre+'/color';it.sb='button/'+sev+'/background';it.rg='button/'+sev+'/focus-ring/color';}
  put(it,(ix('severity',sev)*vals('variant').length+ix('variant',variant))*vals('rounded').length+ix('rounded',rounded),ix('size',size)*vals('state').length+ix('state',state));}
}else if(SET==='link'){
 for(const size of A.size)for(const state of A.state){const it=base(size,state,'false');it.n='Size='+size+', State='+state;
  it.bg=null;it.st=null;it.fg='button/link/'+(it.k==='default'?'color':it.k+'-color'); // CSS also underlines on hover: not built (#48)
  put(it,0,ix('size',size)*A.state.length+ix('state',state));}
}else if(SET==='plain'){
 for(const variant of ['outlined','text'])for(const size of A.size)for(const state of A.state){const it=base(size,state,'false');it.n='Variant='+variant+', Size='+size+', State='+state;
  const pre='button/'+variant+'/plain';it.bg=it.k==='default'?null:pre+'/'+it.k+'-background';it.st=variant==='outlined'?pre+'/border-color':null;it.fg=pre+'/color';
  put(it,variant==='outlined'?0:1,ix('size',size)*A.state.length+ix('state',state));}
}else if(SET==='vertical'){
 for(const pos of ['top','bottom'])for(const size of A.size)for(const state of A.state){const it=base(size,state,'false');it.n='Icon position='+pos+', Size='+size+', State='+state;
  solid(it,'primary');it.dir='V';it.s1='Icon top';it.s2='Icon bottom';it.v1=pos==='top';it.v2=pos==='bottom';it.spin=state==='loading'?(pos==='top'?1:2):0;
  put(it,pos==='top'?0:1,ix('size',size)*A.state.length+ix('state',state));}
}
for(const it of out){if(it.spin===undefined)it.spin=it.l?1:0;}
return out;}`;
const FIXED = { gap: 'button/gap', rw: 'button/focus-ring/width', dop: 'disabled-opacity', bsz: 'button/badge-size', shadow: 'button/raised-shadow', icon: 'Icon/check', spinner: 'Icon/primeng-spinner' };
const BADGE_SEV = ['none', 'secondary', 'info', 'success', 'warn', 'danger', 'contrast'];

// ---- validate in Node against plan.json ----
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) {
    if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); }
})(plan);
const missing = new Set();
const need = (n) => { if (n && !known.has(n)) missing.add(n); };
let items = [];
if (SETS[SET]) {
    const variants = new Function(`${SPEC}; return variants;`)();
    items = variants(A, on, (n) => known.has(n), SET);
    for (const it of items) for (const n of [it.sz.px, it.sz.py, it.sz.ih, it.sz.mh, ...it.rd, it.rg, it.sb, it.bg, it.bo, it.st, it.fg]) need(n);
    for (const n of [FIXED.gap, FIXED.rw, FIXED.dop, FIXED.bsz]) need(n);
    if (new Set(items.map((i) => i.n)).size !== items.length) throw new Error('Duplicate variant names');
} else {
    for (const s of BADGE_SEV) { const t = s === 'none' ? 'primary' : s; need(`badge/${t}/background`); need(`badge/${t}/color`); }
    for (const n of ['badge/padding-x', 'badge/padding-y', 'badge/min-width', 'badge/height', 'badge/border-radius', 'badge/font-size', 'badge/font-weight', 'font-family', FIXED.bsz]) need(n);
}
if (missing.size) throw new Error(`Variables not in plan.json: ${[...missing].join(', ')}`);

// ---- Figma-side code ----
const COMMON = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const ALL=variants(D.A,D.on,n=>!!VB[n],D.set);const IT=ALL.slice(D.from,D.to);`;

const BUILD = `${COMMON}
const need=new Set([D.F.gap,D.F.rw,D.F.dop,D.F.bsz]);for(const it of IT)for(const n of [it.sz.px,it.sz.py,it.sz.ih,it.sz.mh,...it.rd,it.rg,it.sb,it.bg,it.bo,it.st,it.fg])if(n)need.add(n);
const miss=[...need].filter(n=>!VB[n]);if(miss.length)throw new Error('Missing variables: '+miss.join(', '));
const V=n=>VB[n];const HAS=p=>D.props.includes(p);
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;
for(const n of new Set(IT.map(i=>i.sz.ts))){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(HAS('Raised')&&!ES[D.F.shadow])throw new Error('Missing effect style '+D.F.shadow);
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();
const IC={};for(const n of [D.F.icon,D.F.spinner]){IC[n]=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!IC[n])throw new Error('Missing icon '+n);}
let BADGE=null;if(HAS('Badge')){const bs=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Badge');BADGE=bs&&bs.children.find(c=>c.name==='Severity=secondary, Circle=true');if(!BADGE)throw new Error('Build the Badge set first (--set=badge)');}
const CLEAR={type:'SOLID',color:{r:0,g:0,b:0},opacity:0}; // literal 'transparent' (CSS keyword), the only allowed literal (#42)
let CUR=null; // bound paints store the colour resolved for the node being built (Figma draws strokes with the stored colour)
const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];const rad=(n,v)=>{for(const k of RAD)n.setBoundVariable(k,v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);const ids={created:[],rebuilt:[]};
if(!set){const c=figma.createComponent();c.name=IT[0].n;pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name=D.setName;
 let y=40;for(const n of pg.children)if(n!==set)y=Math.max(y,n.y+n.height+80);set.x=40;set.y=y;ids.created.push(c.id);ids.newSet=set.id;}
set.description='PrimeNG: <p-button> | Story: components-button--playground | Version: 0.1.0 | Status: experimental'+D.desc;
const want={'Label':['TEXT','Button'],'Show label':['BOOLEAN',true],'Icon left':['BOOLEAN',false],'Icon right':['BOOLEAN',false],'Icon':['INSTANCE_SWAP',IC[D.F.icon].id],'Raised':['BOOLEAN',false],'Badge':['BOOLEAN',false]};
const K={};const defs=set.componentPropertyDefinitions;for(const k in defs)K[k.split('#')[0]]=k;
for(const n of D.props)if(!K[n])K[n]=set.addComponentProperty(n,want[n][0],want[n][1]);
function abs(c,n,d){c.appendChild(n);n.layoutPositioning='ABSOLUTE';n.resize(c.width+2*d,c.height+2*d);n.x=-d;n.y=-d;n.constraints={horizontal:'STRETCH',vertical:'STRETCH'};}
function slot(c,name,comp,S,fg,dir){const f=figma.createAutoLayout('HORIZONTAL',{name});f.primaryAxisAlignItems='CENTER';f.counterAxisAlignItems='CENTER';f.fills=[];c.appendChild(f);
 if(dir!=='V')f.setBoundVariable('minHeight',V(S.mh)); // horizontal only: keeps icon-only height = label line; stacked it would add height (code: icon box 14)
 const i=comp.createInstance();i.name='Icon';f.appendChild(i);i.setBoundVariable('height',V(S.ih));i.setBoundVariable('width',V(S.ih)); // square icon box (#43)
 const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error(comp.name+': no Shape layer, icon colour cannot be set');sh.fills=[paint(V(fg))];return [f,i];}
${SYNC}${WRAP}async function build0(c,it){CUR=c; // update in place (#68): build() in lib/figma-sync.mjs keeps old layers and syncs
const S=it.sz,R=it.rd;
 c.layoutMode=it.dir==='V'?'VERTICAL':'HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';c.clipsContent=false;c.fills=[];
 for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V(S.py));for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V(S.px));
 c.setBoundVariable('itemSpacing',V(D.F.gap));rad(c,V(R[0]));
 c.strokes=[it.st?paint(V(it.st)):CLEAR];c.strokeWeight=1;c.strokeAlign='INSIDE';
 if(it.d)c.setBoundVariable('opacity',V(D.F.dop));else{c.setBoundVariable('opacity',null);c.opacity=1;}
 const [s1,i1]=slot(c,it.s1,it.spin===1?IC[D.F.spinner]:IC[D.F.icon],S,it.fg,it.dir);
 const t=figma.createText();t.name='Label';c.appendChild(t);await t.setTextStyleIdAsync(TS[S.ts].id);t.characters='Button';t.fills=[paint(V(it.fg))];/* no per-variant text formatting: Figma copies formatting of a label bound to the 'Label' property to every variant (#48) */
 let bi=null;if(it.badge){bi=BADGE.createInstance();bi.name='Badge';c.appendChild(bi);bi.setBoundVariable('minWidth',V(D.F.bsz));bi.setBoundVariable('height',V(D.F.bsz));bi.visible=false;}
 const [s2,i2]=slot(c,it.s2,it.spin===2?IC[D.F.spinner]:IC[D.F.icon],S,it.fg,it.dir);
 s1.visible=it.v1;s2.visible=it.v2; // property defaults before absolute layers are sized
 let sh=null;if(HAS('Raised')){sh=figma.createRectangle();sh.name='Shadow';abs(c,sh,0);c.insertChild(0,sh);sh.fills=[it.so?paint(V(it.sb)):CLEAR]; /* see-through variants: transparent, Raised is solid-only (#42) */
  rad(sh,V(R[0]));await sh.setEffectStyleIdAsync(ES[D.F.shadow].id);}
 const bg=figma.createRectangle();bg.name='Background';abs(c,bg,0);c.insertChild(sh?1:0,bg);rad(bg,V(R[0]));bg.fills=it.bg?[paint(V(it.bg))]:[];if(it.bo)bg.setBoundVariable('opacity',V(it.bo));
 const fr=figma.createFrame();fr.name='Focus ring';fr.fills=[];abs(c,fr,3);fr.clipsContent=false;rad(fr,V(R[1]));
 fr.strokes=[paint(V(it.rg))];fr.strokeAlign='INSIDE';for(const k of ['strokeTopWeight','strokeBottomWeight','strokeLeftWeight','strokeRightWeight'])fr.setBoundVariable(k,V(D.F.rw));fr.visible=it.f;
 REF(t,{characters:K['Label'],visible:K['Show label']});if(sh)REF(sh,{visible:K['Raised']});
 if(bi){REF(bi,{visible:K['Badge']});bi.isExposedInstance=true;}
 if(it.dir==='V'){if(it.spin!==1)REF(i1,{mainComponent:K['Icon']});if(it.spin!==2)REF(i2,{mainComponent:K['Icon']});}
 else if(!it.l){REF(s1,{visible:K['Icon left']});REF(i1,{mainComponent:K['Icon']});
  REF(s2,{visible:K['Icon right']});REF(i2,{mainComponent:K['Icon']});}
 c.x=it.x;c.y=it.y;}
const byName={};for(const c of set.children)byName[c.name]=c;
for(const it of IT){let c=byName[it.n];if(c){ids.rebuilt.push(c.id);}else{c=figma.createComponent();c.name=it.n;set.appendChild(c);ids.created.push(c.id);}await build(c,it);}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
return {sync:SY,set:set.id,range:[D.from,D.to],of:ALL.length,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length};`;

const VERIFY = `${COMMON}
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name===D.setName);if(!set)throw new Error('No set '+D.setName);
await figma.root.children.find(p=>p.name==='01 Foundations').loadAsync(); // icon mains live there
const HAS=p=>D.props.includes(p);
const VN={};const vn=async id=>{if(!(id in VN)){const v=await figma.variables.getVariableByIdAsync(id);VN[id]=v?v.name:'?'+id;}return VN[id];};
const pv=async p=>p&&p.boundVariables&&p.boundVariables.color?vn(p.boundVariables.color.id):null;
const b=async(n,k)=>n.boundVariables&&n.boundVariables[k]?vn(n.boundVariables[k].id):null;
const by={};for(const c of set.children)by[c.name]=c;const errs=[],lit=[];let nerr=0,nclear=0;
const E=(it,m)=>{nerr++;if(errs.length<40)errs.push(it.n.replace(/[A-Za-z ]+=/g,'')+': '+m);};
const eq=(it,w,got,exp)=>{if(got!==exp)E(it,w+' '+got+' != '+exp);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const clear=q=>!!q&&q.type==='SOLID'&&q.opacity===0&&!(q.boundVariables&&q.boundVariables.color);
for(const it of IT){const c=by[it.n];if(!c){E(it,'missing');continue;}const S=it.sz,R=it.rd,g=n=>c.findOne(x=>x.name===n);
 eq(it,'direction',c.layoutMode,it.dir==='V'?'VERTICAL':'HORIZONTAL');
 for(const k of ['paddingTop','paddingBottom'])eq(it,k,await b(c,k),S.py);for(const k of ['paddingLeft','paddingRight'])eq(it,k,await b(c,k),S.px);
 eq(it,'gap',await b(c,'itemSpacing'),D.F.gap);for(const k of RAD)eq(it,k,await b(c,k),R[0]);
 eq(it,'stroke',it.st?await pv(c.strokes[0]):(clear(c.strokes[0])?'transparent':'not transparent'),it.st||'transparent');
 eq(it,'opacity',await b(c,'opacity'),it.d?D.F.dop:null);
 const bg=g('Background');eq(it,'bg',bg.fills.length?await pv(bg.fills[0]):null,it.bg);eq(it,'bgOpacity',await b(bg,'opacity'),it.bo);
 const sd=g('Shadow');eq(it,'Shadow layer',!!sd,HAS('Raised'));
 if(sd){eq(it,'shadowFill',it.so?await pv(sd.fills[0]):(clear(sd.fills[0])?'transparent':'not transparent'),it.so?it.sb:'transparent');
  eq(it,'shadowStyle',(await figma.getStyleByIdAsync(sd.effectStyleId)||{}).name,D.F.shadow);eq(it,'shadowRadius',await b(sd,'topLeftRadius'),R[0]);}
 const t=g('Label');eq(it,'label',await pv(t.fills[0]),it.fg);const ts=await figma.getStyleByIdAsync(t.textStyleId);eq(it,'textStyle',ts&&ts.name,S.ts);eq(it,'underline',t.textDecoration,it.ul?'UNDERLINE':'NONE');
 const fr=g('Focus ring');eq(it,'ring',await pv(fr.strokes[0]),it.rg);eq(it,'ringRadius',await b(fr,'topLeftRadius'),R[1]);eq(it,'ringWidth',await b(fr,'strokeTopWeight'),D.F.rw);eq(it,'ringVisible',fr.visible,it.f);
 // Icon colour is not read: sublayers of instances nested in a component read as empty after a reload (Figma API); the build throws if it cannot set it.
 for(const [sn,vis,pos] of [[it.s1,it.v1,1],[it.s2,it.v2,2]]){const s=g(sn);if(!s){E(it,sn+' missing');continue;}eq(it,sn+' visible',s.visible,vis);eq(it,sn+' minHeight',await b(s,'minHeight'),it.dir==='V'?null:S.mh);const i=s.findOne(x=>x.type==='INSTANCE');
  eq(it,sn+' height',await b(i,'height'),S.ih);eq(it,sn+' width',await b(i,'width'),S.ih);eq(it,sn+' icon',(await i.getMainComponentAsync()).name,it.spin===pos?D.F.spinner:D.F.icon);}
 const bd=g('Badge');eq(it,'Badge layer',!!bd,!!it.badge);if(bd){eq(it,'badge minWidth',await b(bd,'minWidth'),D.F.bsz);eq(it,'badge height',await b(bd,'height'),D.F.bsz);eq(it,'badge visible',bd.visible,false);
  eq(it,'badge order',c.children.indexOf(bd)===c.children.indexOf(t)+1,true);eq(it,'badge severity',(await bd.getMainComponentAsync()).name,'Severity=secondary, Circle=true');}
 for(const n of [c,...c.findAll(()=>true)]){if(n.type==='INSTANCE')continue;let p=n.parent,inInst=false;while(p&&p!==c){if(p.type==='INSTANCE')inInst=true;p=p.parent;}if(inInst)continue;
  for(const key of ['fills','strokes'])if(n[key]&&n[key]!==figma.mixed)for(const q of n[key]){if(q.type!=='SOLID'||(q.boundVariables&&q.boundVariables.color))continue;if(q.opacity===0&&(n===c&&key==='strokes'||n.name==='Shadow')){nclear++;continue;}lit.push(c.name+' > '+n.name+' '+key);}
  if(n.type==='TEXT'&&!n.textStyleId)lit.push(c.name+' > '+n.name+' no text style');}}
const sizes={};for(const it of IT){const c=by[it.n];if(c){const k=c.width.toFixed(2)+'x'+c.height.toFixed(2);sizes[k]=(sizes[k]||0)+1;}}
const vp={};const d=set.componentPropertyDefinitions;for(const k in d)vp[k.split('#')[0]]=d[k].type==='VARIANT'?d[k].variantOptions.length:d[k].type;
return {set:D.setName,range:[D.from,D.to],of:ALL.length,checked:IT.length,inSet:set.children.length,errors:nerr,errs,allowedTransparent:nclear,literalPaints:lit.length,lit:lit.slice(0,20),sizes,props:vp};`;

// Badge component set (experimental, #32/#45): token-bound, base size only.
const BADGE = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const ff=V('font-family');const fams=[...new Set(Object.values(ff.valuesByMode).filter(x=>typeof x==='string'))];if(!fams.length)throw new Error('font-family has no string value');
for(const fam of fams)await figma.loadFontAsync({family:fam,style:'Bold'});
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',v);};
let set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Badge');const ids={created:[],rebuilt:[]};
if(!set){const c=figma.createComponent();c.name='Severity='+D.sev[0]+', Circle=true';pg.appendChild(c);set=figma.combineAsVariants([c],pg);set.name='Badge';
 let y=40;for(const n of pg.children)if(n!==set)y=Math.max(y,n.y+n.height+80);set.x=40;set.y=y;ids.created.push(c.id);}
set.description='PrimeNG: <p-badge> | Story: none (pilot: used inside Button) | Version: 0.1.0 | Status: experimental | Severity none = attribute omitted (primary colours). Base size only (badgeSize small/large/xlarge not built). Circle is design-only: code adds p-badge-circle itself when the value is 1 character (#47).';
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;if(!K['Value'])K['Value']=set.addComponentProperty('Value','TEXT','8');
const byName={};for(const c of set.children)byName[c.name]=c;
for(const circle of [true,false])for(const [i,s] of D.sev.entries()){const n='Severity='+s+', Circle='+circle;let c=byName[n];
 if(!c&&circle&&byName['Severity='+s]){c=byName['Severity='+s];c.name=n;} // pre-#47 name: keep the node so Button instances stay linked
 if(c)ids.rebuilt.push(c.id);else{c=figma.createComponent();c.name=n;set.appendChild(c);ids.created.push(c.id);}
 CUR=c;for(const k of [...c.children])k.remove();const tk=s==='none'?'primary':s;
 c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.clipsContent=false;
 for(const k of ['paddingLeft','paddingRight','paddingTop','paddingBottom'])c.setBoundVariable(k,null);
 if(!circle){for(const k of ['paddingLeft','paddingRight'])c.setBoundVariable(k,V('badge/padding-x'));for(const k of ['paddingTop','paddingBottom'])c.setBoundVariable(k,V('badge/padding-y'));}
 else{c.paddingLeft=c.paddingRight=c.paddingTop=c.paddingBottom=0;} // CSS .p-badge-circle { padding: 0 } (no token)
 c.setBoundVariable('minWidth',V('badge/min-width'));c.setBoundVariable('height',V('badge/height'));
 for(const k of ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])c.setBoundVariable(k,V(circle?'badge/height':'badge/border-radius')); // circle: radius >= half height = 50%
 c.fills=[paint(V('badge/'+tk+'/background'))];c.strokes=[];
 const t=figma.createText();t.name='Value';c.appendChild(t);t.fontName={family:fams[0],style:'Bold'};t.characters='8';
 t.setBoundVariable('fontFamily',ff);t.setBoundVariable('fontSize',V('badge/font-size'));t.setBoundVariable('fontWeight',V('badge/font-weight'));t.fills=[paint(V('badge/'+tk+'/color'))];
 t.componentPropertyReferences={characters:K['Value']};c.x=24+i*48;c.y=circle?24:69;}
let mx=0,my=0;for(const c of set.children){mx=Math.max(mx,c.x+c.width);my=Math.max(my,c.y+c.height);}set.resizeWithoutConstraints(mx+24,my+24);
const sizes=[...new Set(set.children.map(c=>c.name.split(', ')[1]+' '+c.width.toFixed(2)+'x'+c.height.toFixed(2)))];
return {set:set.id,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length,sizes};`;

// One-off add-only pass (#46): same Badge structure the main build creates, without rebuilding the variant.
const ADD_BADGE = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const bsz=VB[D.F.bsz];if(!bsz)throw new Error('Missing '+D.F.bsz);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Button');const bs=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Badge');
const BADGE=bs&&bs.children.find(c=>c.name==='Severity=secondary, Circle=true');if(!BADGE)throw new Error('Build the Badge set first');
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;if(!K['Badge'])K['Badge']=set.addComponentProperty('Badge','BOOLEAN',false);
let added=0,had=0;const kids=set.children.slice(D.from,D.to);
for(const c of kids){if(c.findChild(x=>x.name==='Badge')){had++;continue;}const t=c.findChild(x=>x.name==='Label');
 const bi=BADGE.createInstance();bi.name='Badge';c.insertChild(c.children.indexOf(t)+1,bi);bi.setBoundVariable('minWidth',bsz);bi.setBoundVariable('height',bsz);bi.visible=false;
 bi.componentPropertyReferences={visible:K['Badge']};bi.isExposedInstance=true;added++;}
return {range:[D.from,D.to],added,had,total:set.children.length};`;

const files = [];
const emit = async (file, code) => { if (code.length > MAX_CHARS) throw new Error(`${file} is ${code.length} chars`); await writeFile(join(OUT, 'calls', file), code); files.push(`${file} (${code.length})`); };
if (SETS[SET]) {
    const S = SETS[SET];
    const pre = SET === 'main' ? '07-button' : `07-button-${SET}`;
    const head = (from, to) => `const D=${JSON.stringify({ A, on, set: SET, setName: S.name, desc: S.desc, props: S.props, F: FIXED, from, to })};\n${SPEC}\n`;
    for (let i = 0, n = 1; i < items.length; i += PER_CALL, n++) await emit(`${pre}-${n}.js`, head(i, Math.min(i + PER_CALL, items.length)) + BUILD);
    for (let i = 0, n = 1; i < items.length; i += PER_VERIFY, n++) await emit(`${pre}-verify-${n}.js`, head(i, Math.min(i + PER_VERIFY, items.length)) + VERIFY);
} else if (SET === 'badge') {
    await emit('07-badge-1.js', `const D=${JSON.stringify({ sev: BADGE_SEV })};\n${BADGE}`);
} else {
    const PER_ADD = 216;
    for (let i = 0, n = 1; i < 864; i += PER_ADD, n++) await emit(`07-button-add-badge-${n}.js`, `const D=${JSON.stringify({ F: FIXED, from: i, to: i + PER_ADD })};\n${ADD_BADGE}`);
}
console.log(`Button family: set ${SET}${SET === 'main' ? ` axes ${on.join(',')}` : ''} → ${SETS[SET] ? items.length + ' variants' : ''}. Calls: ${files.join(', ')}`);
