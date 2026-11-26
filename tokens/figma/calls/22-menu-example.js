// 22-menu-example.js — Menu examples on 99 Sandbox (DECISIONS #95). Re-running replaces them.
// A: Sakai plain menu (Customers / Orders), 284 wide, "New" hovered (= focus) — compare menu__plain-hover.
// B: overlay items inline (Save, Update disabled, Delete, separator, Home) — compare menu__overlay-disabled.
// C: popup (Popup=true, shadow), 175 = min-width — compare menu__popup.
// D: stress — no icons, long label, width 260. Light + Dark.
const sb=figma.root.children.find(p=>p.name==='99 Sandbox');const cp=figma.root.children.find(p=>p.name==='02 Components');await cp.loadAsync();await figma.setCurrentPageAsync(sb);figma.skipInvisibleInstanceChildren=false;
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const ip=figma.root.children.find(p=>p.name==='01 Foundations');await ip.loadAsync();const IC=n=>{const c=ip.findOne(x=>x.type==='COMPONENT'&&x.name===n);if(!c)throw new Error('Missing icon '+n);return c;};
const MS=cp.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Menu');if(!MS)throw new Error('Missing Menu');
const old=sb.findOne(n=>n.name==='Menu — examples');let X=0,Y=0;if(old){X=old.x;Y=old.y;old.remove();}else{for(const n of sb.children)Y=Math.max(Y,n.y+n.height+200);}
const fr=(name,dir,gap)=>{const f=figma.createFrame();f.name=name;f.layoutMode=dir;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.itemSpacing=gap;f.fills=[];f.clipsContent=false;return f;};
const C=fr('Menu — examples','VERTICAL',0);sb.appendChild(C);C.x=X;C.y=Y;
const P=(inst,vals)=>{const r={};for(const k in inst.componentProperties)r[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!r[k])throw new Error(inst.name+': no prop '+k);o[r[k]]=v;}inst.setProperties(o);};
const setItem=async(i,label,icon,extra)=>{const o=Object.assign({Label:label},extra||{});if(icon){const cur=i.findOne(x=>x.type==='INSTANCE');const mc=cur&&await cur.getMainComponentAsync();if(!mc||mc.id!==IC(icon).id)o.Icon=IC(icon).id;}P(i,o);};
const OVERLAY=async(m,dis)=>{const k=n=>m.findOne(x=>x.name===n);for(const n of ['Label 1','Label 2','Item 4','Item 6'])k(n).visible=false;
 await setItem(k('Item 1'),'Save','Icon/save');await setItem(k('Item 2'),'Update','Icon/refresh',dis?{State:'disabled'}:{});await setItem(k('Item 3'),'Delete','Icon/trash');
 k('Separator').visible=true;k('Item 5').visible=true;await setItem(k('Item 5'),'Home','Icon/home');};
const colls=await figma.variables.getLocalVariableCollectionsAsync();const sizes={};
for(const mode of ['Light','Dark']){const band=fr(mode,'HORIZONTAL',24);C.appendChild(band);band.paddingTop=band.paddingBottom=band.paddingLeft=band.paddingRight=24;band.counterAxisAlignItems='MIN';
 for(const c of colls){const m=c.modes.find(m=>m.name===mode);if(m)band.setExplicitVariableModeForCollection(c,m.modeId);}
 const g=VB['surface/ground']||VB['content/background'];const r=g.resolveForConsumer(band).value;band.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b}},'color',g)];
 const mk=(name,popup,w)=>{const v=MS.children.find(c=>c.name==='Popup='+popup);const i=v.createInstance();i.name=name;band.appendChild(i);i.resize(w,i.height);return i;};
 const a=mk('A Plain (Sakai)','false',284);P(a.findOne(x=>x.name==='Item 1'),{State:'focus'});
 const b=mk('B Overlay items, Update disabled','false',284);await OVERLAY(b,true);
 const c=mk('C Popup','true',175);await OVERLAY(c,false);
 const d=mk('D Stress: no icons, long label','false',260);for(const n of ['Item 1','Item 2','Item 3','Item 4'])P(d.findOne(x=>x.name===n),{'Show icon':false});
 P(d.findOne(x=>x.name==='Item 2'),{Label:'Export all customers to a CSV file'});P(d.findOne(x=>x.name==='Label 2'),{Label:'Orders and returns'});
 sizes[mode]=[a,b,c,d].map(i=>i.width+'x'+i.height);}
return {frame:C.id,sizes};
