#!/usr/bin/env node
/**
 * Dialog, ConfirmDialog, Dialog Mask → Figma: batch 2 (DECISIONS #91–#93).
 * Source CSS (@primeuix/styles dialog / confirmdialog, Aura) + captures (Storybook dialog / confirmdialog stories):
 *   .p-dialog: border 1px dialog.border-color, radius dialog.border-radius, background, color, shadow (= overlay/modal/shadow)
 *   .p-dialog-header: flex, space-between, padding dialog.header.padding; .p-dialog-title: dialog.title font-size / weight
 *   .p-dialog-header-actions: gap dialog.header.gap; close button = rounded secondary text icon-only Button (Button Icon), pi-times
 *   .p-dialog-content: padding dialog.content.padding (0 x x x); .p-dialog-footer: flex-end, gap, padding dialog.footer.padding
 *   ConfirmDialog content: flex, align center, gap confirmdialog.content.gap; icon confirmdialog.icon.size / color; message = text.
 *   Default footer (capture): "No" and "Yes", both primary solid base Buttons, no icons.
 * Components: 'Dialog Slot' (hug placeholder, #84), 'Dialog' (450 wide), 'ConfirmDialog' (450 wide), 'Dialog Mask' (1440 × 900).
 * Rebuild = update in place (#68). Writes calls/20-dialog-1.js. Example: calls/20-dialog-example.js.
 * Usage (from app/sakai-ng): npm run figma:dialog
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SYNC, WRAP } from './lib/figma-sync.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../../tokens/figma');
const VARS = ['dialog/background', 'dialog/border-color', 'dialog/border-radius', 'dialog/color', 'dialog/header/padding', 'dialog/header/gap',
    'dialog/content/padding-top', 'dialog/content/padding-right', 'dialog/content/padding-bottom', 'dialog/content/padding-left',
    'dialog/footer/padding-top', 'dialog/footer/padding-right', 'dialog/footer/padding-bottom', 'dialog/footer/padding-left', 'dialog/footer/gap',
    'confirmdialog/content/gap', 'confirmdialog/icon/size', 'confirmdialog/icon/color', 'mask/background', 'content/border-color', 'text/muted-color'];
const plan = JSON.parse(await readFile(join(OUT, 'plan.json'), 'utf8'));
const known = new Set();
(function walk(o) { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (typeof o.name === 'string') known.add(o.name); Object.values(o).forEach(walk); } })(plan);
const missing = VARS.filter((n) => !known.has(n));
if (missing.length) throw new Error(`Variables not in plan.json: ${missing.join(', ')}`);

const code = `const pg=figma.root.children.find(p=>p.name==='02 Components');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Dialog/Title','Body/Base']){if(!TS[n])throw new Error('Missing text style '+n);await figma.loadFontAsync(TS[n].fontName);}
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;if(!ES['overlay/modal/shadow'])throw new Error('Missing effect style overlay/modal/shadow');
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const SET=n=>{const s=pg.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing set '+n);return s;};
const VAR=(s,w)=>{const c=SET(s).children.find(c=>Object.entries(w).every(([k,v])=>c.variantProperties[k]===v));if(!c)throw new Error(s+' '+JSON.stringify(w));return c;};
const P=(inst,vals)=>{const K={};for(const k in inst.componentProperties)K[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!K[k])throw new Error(inst.name+': no prop '+k);o[K[k]]=v;}inst.setProperties(o);};
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const RAD=['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
const below=()=>{let y=40;for(const n of pg.children)y=Math.max(y,n.y+n.height+200);return y;};
const comp=n=>{let c=pg.findOne(x=>x.type==='COMPONENT'&&x.name===n&&x.parent===pg);if(!c){c=figma.createComponent();c.name=n;pg.appendChild(c);c.x=0;c.y=below();}return c;};
const props=(c,list)=>{const K={};for(const k in c.componentPropertyDefinitions)K[k.split('#')[0]]=k;for(const [n,t,d] of list)if(!K[n])K[n]=c.addComponentProperty(n,t,d);return K;};
const txt=async(parent,str,style,col,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=str;t.autoRename=false;t.name=name;t.fills=[paint(V(col))];return t;};
const frame=(parent,name,dir)=>{const f=figma.createFrame();f.name=name;parent.appendChild(f);f.layoutMode=dir;f.fills=[];f.clipsContent=false;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';return f;};
${SYNC}${WRAP}
// shell shared by Dialog and ConfirmDialog: box, header (title + close), body, footer (2 exposed buttons)
async function shell(c,it){CUR=c;
 c.layoutMode='VERTICAL';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='FIXED';c.resize(450,c.height);c.clipsContent=false;c.itemSpacing=0;
 c.fills=[paint(V('dialog/background'))];c.strokes=[paint(V('dialog/border-color'))];c.strokeWeight=1;c.strokeAlign='INSIDE';c.strokesIncludedInLayout=true;
 for(const k of RAD)c.setBoundVariable(k,V('dialog/border-radius'));await c.setEffectStyleIdAsync(ES['overlay/modal/shadow'].id);
 const h=frame(c,'Header','HORIZONTAL');h.layoutSizingHorizontal='FILL';h.primaryAxisAlignItems='SPACE_BETWEEN';h.counterAxisAlignItems='CENTER';
 for(const k of ['paddingTop','paddingBottom','paddingLeft','paddingRight'])h.setBoundVariable(k,V('dialog/header/padding'));
 const t=await txt(h,it.title,'Dialog/Title','dialog/color','Title');t.layoutSizingHorizontal='FILL';t.textAutoResize='HEIGHT';
 const a=frame(h,'Actions','HORIZONTAL');a.counterAxisAlignItems='CENTER';a.setBoundVariable('itemSpacing',V('dialog/header/gap'));
 const x=VAR('Button Icon',{Severity:'secondary',Variant:'text',Size:'base',State:'default',Rounded:'true'}).createInstance();x.name='Close';a.appendChild(x);P(x,{Icon:IC('Icon/times').id,Raised:false});x.isExposedInstance=true;
 REF(h,{visible:it.K['Show header']});REF(t,{characters:it.K['Header']});REF(a,{visible:it.K['Closable']});
 const b=frame(c,'Content','HORIZONTAL');b.layoutSizingHorizontal='FILL';
 for(const [k,s] of [['paddingTop','top'],['paddingRight','right'],['paddingBottom','bottom'],['paddingLeft','left']])b.setBoundVariable(k,V('dialog/content/padding-'+s));
 const f=frame(c,'Footer','HORIZONTAL');f.layoutSizingHorizontal='FILL';f.primaryAxisAlignItems='MAX';f.counterAxisAlignItems='CENTER';f.setBoundVariable('itemSpacing',V('dialog/footer/gap'));
 for(const [k,s] of [['paddingTop','top'],['paddingRight','right'],['paddingBottom','bottom'],['paddingLeft','left']])f.setBoundVariable(k,V('dialog/footer/padding-'+s));
 for(const [name,label,variant,icon] of it.buttons){const bt=VAR('Button',{Severity:'primary',Variant:variant,Size:'base',State:'default',Rounded:'false'}).createInstance();bt.name=name;f.appendChild(bt);
  P(bt,{Label:label,'Icon left':!!icon,'Icon right':false,Raised:false});
  // Figma quirk: setting the Icon swap to the icon already in place resets the icon colour to the icon's own default (text/color),
  // dropping the Button's override (Save showed a dark check). Only swap when the icon differs.
  if(icon){const cur=bt.findOne(x=>x.name==='Icon left').findOne(x=>x.type==='INSTANCE');if((await cur.getMainComponentAsync()).id!==IC(icon).id)P(bt,{Icon:IC(icon).id});}
  bt.isExposedInstance=true;}
 if(it.K['Show footer'])REF(f,{visible:it.K['Show footer']});
 return b;}
async function build0(c,it){
 if(it.kind==='slot'){CUR=c;c.layoutMode='HORIZONTAL';c.primaryAxisAlignItems='CENTER';c.counterAxisAlignItems='CENTER';c.primaryAxisSizingMode='AUTO';c.counterAxisSizingMode='AUTO';
  c.paddingLeft=c.paddingRight=8;c.paddingTop=c.paddingBottom=2;c.fills=[];c.strokes=[paint(V('content/border-color'))];c.strokeWeight=1;c.dashPattern=[4,3];c.strokeAlign='INSIDE';
  await txt(c,'Content','Body/Base','text/muted-color','Label');c.x=it.x;c.y=it.y;return;}
 if(it.kind==='mask'){CUR=c;c.layoutMode='NONE';c.resize(1440,900);c.fills=[paint(V('mask/background'))];c.clipsContent=true;c.x=it.x;c.y=it.y;return;}
 const b=await shell(c,it);
 if(it.kind==='dialog'){const s=SLOT.createInstance();s.name='Body';b.appendChild(s);REF(s,{mainComponent:it.K['Content']});}
 else{b.counterAxisAlignItems='CENTER';b.setBoundVariable('itemSpacing',V('confirmdialog/content/gap'));
  const i=IC('Icon/exclamation-triangle').createInstance();i.name='Icon';b.appendChild(i);i.setBoundVariable('width',V('confirmdialog/icon/size'));i.setBoundVariable('height',V('confirmdialog/icon/size'));
  const sh=i.findOne(x=>x.name==='Shape');if(!sh)throw new Error('icon has no Shape');sh.fills=[paint(V('confirmdialog/icon/color'))];REF(i,{mainComponent:it.K['Icon']});
  const m=await txt(b,'Are you sure you want to proceed?','Body/Base','dialog/color','Message');m.layoutSizingHorizontal='FILL';m.textAutoResize='HEIGHT';REF(m,{characters:it.K['Message']});}
 c.x=it.x;c.y=it.y;}
const out={};
const SLOT=comp('Dialog Slot');SLOT.description='Placeholder for Dialog content (#91). In a Dialog: swap Content to any component (it must hug, #84).';await build(SLOT,{kind:'slot',x:SLOT.x,y:SLOT.y});out.slot=SLOT.id;
const M=comp('Dialog Mask');M.description='PrimeNG: modal mask (.p-dialog-mask / .p-overlay-mask) | DESIGN aid (#92): put it behind a Dialog / ConfirmDialog in a screen; resize to the screen | Fill mask/background';await build(M,{kind:'mask',x:M.x,y:M.y});out.mask=M.id;
const D=comp('Dialog');D.description='PrimeNG: <p-dialog> | Story: components-dialog--playground | Version: 0.1.0 | Status: experimental (#91) | Header → header, Show header → [showHeader], Closable → [closable], Content → content template (swap; must hug), Show footer → #footer template | Footer buttons Cancel / Save are exposed (Sakai CRUD); edit or hide them | Width 450 (Sakai) — resize as [style] width';
let K=props(D,[['Header','TEXT','Dialog'],['Show header','BOOLEAN',true],['Closable','BOOLEAN',true],['Show footer','BOOLEAN',true],['Content','INSTANCE_SWAP',SLOT.id]]);
await build(D,{kind:'dialog',title:'Dialog',K,buttons:[['Cancel','Cancel','text','Icon/times'],['Save','Save','solid','Icon/check']],x:D.x,y:D.y});out.dialog=D.id+' '+D.width+'x'+D.height;
const C=comp('ConfirmDialog');C.description='PrimeNG: <p-confirmdialog> + ConfirmationService.confirm({ header, message, icon }) | Story: components-confirmdialog--playground | Version: 0.1.0 | Status: experimental (#93) | Header → header, Message → message, Icon → icon (swap), Closable → closable | Reject "No" / Accept "Yes" are exposed (rejectLabel / acceptLabel, reject/acceptButtonProps) | Width 450 (Sakai)';
const ICDEF=IC('Icon/exclamation-triangle');K=props(C,[['Header','TEXT','Confirm'],['Show header','BOOLEAN',true],['Closable','BOOLEAN',true],['Message','TEXT','Are you sure you want to proceed?'],['Icon','INSTANCE_SWAP',ICDEF.id]]);
await build(C,{kind:'confirm',title:'Confirm',K,buttons:[['Reject','No','solid',null],['Accept','Yes','solid',null]],x:C.x,y:C.y});out.confirm=C.id+' '+C.width+'x'+C.height;
out.sync=SY;return out;`;

await writeFile(join(OUT, 'calls', '20-dialog-1.js'), code);
console.log(`Dialog: variables found in plan.json. Call: 20-dialog-1.js (${code.length})`);
