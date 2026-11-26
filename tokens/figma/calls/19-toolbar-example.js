// 19-toolbar-example.js — the two Sakai toolbars on 99 Sandbox (DECISIONS #89), built from the Toolbar component with overrides only.
// CRUD (src/app/pages/crud/crud.ts) = the component defaults. UI Kit (src/app/pages/uikit/panelsdemo.ts): start = 3 icon-only text
// buttons (swapped to Button Icon), center = search, end = SplitButton "Save" (Export hidden). Re-running replaces the frame.
const sb=figma.root.children.find(p=>p.name==='99 Sandbox');const cp=figma.root.children.find(p=>p.name==='02 Components');const fp=figma.root.children.find(p=>p.name==='01 Foundations');
await cp.loadAsync();await fp.loadAsync();await figma.setCurrentPageAsync(sb);figma.skipInvisibleInstanceChildren=false;
const T=cp.findOne(x=>x.type==='COMPONENT'&&x.name==='Toolbar');if(!T)throw new Error('Run 19-toolbar-1.js first');
const BIC=cp.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='Button Icon');
const VAR=(s,w)=>{const c=s.children.find(c=>Object.entries(w).every(([k,v])=>c.variantProperties[k]===v));if(!c)throw new Error(s.name+' '+JSON.stringify(w));return c;};
const ICON=n=>{const c=fp.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const P=(inst,vals)=>{const K={};for(const k in inst.componentProperties)K[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!K[k])throw new Error(inst.name+': no prop '+k);o[K[k]]=v;}inst.setProperties(o);};
for(const n of [...sb.children])if(n.name==='Toolbar — Example (Sakai)')n.remove();
let y0=40;for(const n of sb.children)y0=Math.max(y0,n.y+n.height+200);
const F=figma.createFrame();F.name='Toolbar — Example (Sakai)';sb.appendChild(F);F.x=0;F.y=y0;F.layoutMode='VERTICAL';F.itemSpacing=24;F.primaryAxisSizingMode='AUTO';F.counterAxisSizingMode='AUTO';F.fills=[];
const crud=T.createInstance();crud.name='CRUD (crud.ts)';F.appendChild(crud);
const ui=T.createInstance();ui.name='UI Kit (panelsdemo.ts)';F.appendChild(ui);P(ui,{'Show center':true});
const start=ui.findChild(x=>x.name==='Start');
for(const [name,icon] of [['Button 1','Icon/plus'],['Button 2','Icon/print'],['Button 3','Icon/upload']]){const b=start.findChild(x=>x.name===name);b.visible=true;
 b.swapComponent(VAR(BIC,{Severity:'secondary',Variant:'text',Size:'base',State:'default',Rounded:'false'}));P(b,{Icon:ICON(icon).id,Raised:false});}
const end=ui.findChild(x=>x.name==='End');end.findChild(x=>x.name==='SplitButton').visible=true;end.findChild(x=>x.name==='Button').visible=false;
const rep=i=>i.name+' '+i.width+'x'+i.height+' | '+i.children.filter(g=>g.visible).map(g=>g.name+' x'+g.x.toFixed(1)+' w'+g.width.toFixed(1)).join(', ');
return {frame:F.id,crud:rep(crud),ui:rep(ui)};
