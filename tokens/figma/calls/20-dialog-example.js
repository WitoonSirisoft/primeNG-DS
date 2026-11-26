// 20-dialog-example.js — Sakai dialogs on 99 Sandbox (DECISIONS #91–#93), from the Dialog / ConfirmDialog components with overrides only.
// 1 Product Details (src/app/pages/crud/crud.ts, new product): Content swapped to a local helper 'Example / Product form'
// 2 UI Kit dialog (src/app/pages/uikit/overlaydemo.ts): Content → 'Example / Dialog text'; footer Save only, no icon
// 3 CRUD delete confirmation (ConfirmDialog)   4 Screen: Dialog Mask + Product Details dialog centred
// Helpers hug (#84): fixed-width art sits in a hug wrapper. Labels: Heading/H6 (Bold 14) = Sakai "font-bold" (Tailwind, not a token).
// Spacing literals are Tailwind classes in crud.ts: gap-6 21, mb-3 10.5, mb-4 14, gap-4 14, gap-2 7. Re-running replaces everything.
const sb=figma.root.children.find(p=>p.name==='99 Sandbox');const cp=figma.root.children.find(p=>p.name==='02 Components');await cp.loadAsync();await figma.setCurrentPageAsync(sb);
figma.skipInvisibleInstanceChildren=false;
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const V=n=>{if(!VB[n])throw new Error('Missing variable '+n);return VB[n];};
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;for(const n of ['Heading/H6','Body/Base','Body/Paragraph'])await figma.loadFontAsync(TS[n].fontName);
let CUR=null;const paint=v=>{const r=v.resolveForConsumer(CUR||sb).value;return figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v);};
const SET=n=>{const s=cp.findOne(x=>x.type==='COMPONENT_SET'&&x.name===n);if(!s)throw new Error('Missing set '+n);return s;};
const COMP=n=>{const c=cp.findOne(x=>x.type==='COMPONENT'&&x.name===n&&x.parent===cp);if(!c)throw new Error('Missing '+n+' (run 20-dialog-1.js)');return c;};
const VAR=(s,w)=>{const c=SET(s).children.find(c=>Object.entries(w).every(([k,v])=>c.variantProperties[k]===v));if(!c)throw new Error(s+' '+JSON.stringify(w));return c;};
const P=(inst,vals)=>{const K={};for(const k in inst.componentProperties)K[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!K[k])throw new Error(inst.name+': no prop '+k);o[K[k]]=v;}inst.setProperties(o);};
const fr=(parent,name,dir,gap)=>{const f=figma.createFrame();f.name=name;parent.appendChild(f);f.layoutMode=dir;f.fills=[];f.clipsContent=false;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.itemSpacing=gap||0;return f;};
const txt=async(parent,s,style,name)=>{const t=figma.createText();parent.appendChild(t);await t.setTextStyleIdAsync(TS[style].id);t.characters=s;t.name=name||'Text';t.fills=[paint(V('dialog/color'))];return t;};
for(const n of [...sb.children])if(n.name.startsWith('Dialog — Example'))n.remove();
let y0=40;for(const n of sb.children)y0=Math.max(y0,n.y+n.height+200);
const H=fr(sb,'Dialog — Example helpers','VERTICAL',24);H.x=1600;H.y=y0;CUR=H;
// ---- helper: Product form (hug wrapper, fixed 414 inside = 450 − 2 border − 2 × 17.5 padding)
const form=figma.createComponent();form.name='Example / Product form';H.appendChild(form);form.layoutMode='VERTICAL';form.primaryAxisSizingMode='AUTO';form.counterAxisSizingMode='AUTO';form.fills=[];
form.description='Example only: Sakai CRUD "Product Details" form (new product). Swap a Dialog Content to it.';
const F=fr(form,'Form','VERTICAL',21);F.counterAxisSizingMode='FIXED';F.resize(414,F.height);
// label = Heading/H6 (Bold 14) with line height 120%: Sakai labels inherit line-height 1.2 (measured 17px); local override, example only
const lab=async(parent,s)=>{const t=await txt(parent,s,'Heading/H6','Label');t.lineHeight={unit:'PERCENT',value:120};return t;};
const field=async(label,node,mb)=>{const f=fr(F,label,'VERTICAL',mb||10.5);f.layoutSizingHorizontal='FILL';await lab(f,label);f.appendChild(node);node.layoutSizingHorizontal='FILL';return f;};
const base={Size:'base',Variant:'outlined',State:'default',Invalid:'false'};
await field('Name',VAR('InputText',{...base,Content:'empty'}).createInstance());
const ta=VAR('Textarea',{...base,Content:'empty'}).createInstance();await field('Description',ta);
const sel=VAR('Select',{...base,Content:'placeholder'}).createInstance();P(sel,{Placeholder:'Select a Status'});await field('Inventory Status',sel);
const cat=fr(F,'Category','VERTICAL',14);cat.layoutSizingHorizontal='FILL';await txt(cat,'Category','Heading/H6','Label');
const grid=fr(cat,'Options','VERTICAL',14);grid.layoutSizingHorizontal='FILL';
for(const pair of [['Accessories','Clothing'],['Electronics','Fitness']]){const row=fr(grid,'Row','HORIZONTAL',14);row.layoutSizingHorizontal='FILL';
 for(const c of pair){const cell=fr(row,c,'HORIZONTAL',7);cell.layoutSizingHorizontal='FILL';cell.counterAxisAlignItems='CENTER';cell.appendChild(VAR('RadioButton',{Size:'base',Variant:'outlined',State:'default',Invalid:'false',Checked:'no'}).createInstance());await txt(cell,c,'Body/Base','Label');}}
const pq=fr(F,'Price + Quantity','HORIZONTAL',14);pq.layoutSizingHorizontal='FILL';
for(const l of ['Price','Quantity']){const f=fr(pq,l,'VERTICAL',10.5);f.layoutSizingHorizontal='FILL';await txt(f,l,'Heading/H6','Label');const n=VAR('InputNumber',{Buttons:'none',Size:'base'}).createInstance();f.appendChild(n);n.layoutSizingHorizontal='FILL';
 const inner=n.findOne(x=>x.type==='INSTANCE'&&x.name==='InputText');P(inner,{Content:'empty'});} // new product: empty fields
// ---- helper: Dialog text
const tx=figma.createComponent();tx.name='Example / Dialog text';H.appendChild(tx);tx.layoutMode='VERTICAL';tx.primaryAxisSizingMode='AUTO';tx.counterAxisSizingMode='AUTO';tx.fills=[];
tx.description='Example only: paragraph for a Dialog body (Sakai UI Kit dialog). Swap a Dialog Content to it.';
const TF=fr(tx,'Text','VERTICAL',0);TF.counterAxisSizingMode='FIXED';TF.resize(414,TF.height);
const p=await txt(TF,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','Body/Paragraph','Paragraph');
p.layoutSizingHorizontal='FILL';p.textAutoResize='HEIGHT';
// ---- dialogs
const X=fr(sb,'Dialog — Example (Sakai)','HORIZONTAL',40);X.x=0;X.y=y0;X.counterAxisAlignItems='MIN';
const D=COMP('Dialog'),C=COMP('ConfirmDialog');
const d1=D.createInstance();d1.name='Product Details (crud.ts)';X.appendChild(d1);P(d1,{Header:'Product Details',Content:form.id});
const d2=D.createInstance();d2.name='Dialog (overlaydemo.ts)';X.appendChild(d2);P(d2,{Header:'Dialog',Content:tx.id});
const ft=d2.findChild(x=>x.name==='Footer');ft.findChild(x=>x.name==='Cancel').visible=false;P(ft.findChild(x=>x.name==='Save'),{'Icon left':false});
const c1=C.createInstance();c1.name='Confirm delete (crud.ts)';X.appendChild(c1);P(c1,{Message:'Are you sure you want to delete the selected products?'});
// ---- screen with mask
const S=figma.createFrame();S.name='Dialog — Example screen (mask)';sb.appendChild(S);S.x=0;S.y=y0+X.height+120;S.resize(1440,900);S.clipsContent=true;CUR=S;S.fills=[paint(VB['surface/ground']||V('content/background'))];
const m=COMP('Dialog Mask').createInstance();S.appendChild(m);m.x=0;m.y=0;m.constraints={horizontal:'STRETCH',vertical:'STRETCH'};
const d3=D.createInstance();S.appendChild(d3);P(d3,{Header:'Product Details',Content:form.id});d3.x=Math.round((1440-d3.width)/2);d3.y=Math.round((900-d3.height)/2);
const body=d1.findChild(x=>x.name==='Content');
return {examples:X.id,helpers:H.id,screen:S.id,product:d1.width+'x'+d1.height,simple:d2.width+'x'+d2.height,confirm:c1.width+'x'+c1.height,textarea:ta.height,form:form.width+'x'+form.height,bodyH:body.height};
