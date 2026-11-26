// 21-toast-example.js — Toast examples on 99 Sandbox (DECISIONS #94). Re-running replaces them.
// A: all six severities with the Sakai UI Kit texts (src/app/pages/uikit/messagesdemo.ts) — compare with the captures.
// B: a screen with a stack top-right (PrimeNG default position): 20px from the edges (.p-toast-top-right top/right 20px), 14px (1rem) between toasts.
// C: stress — long summary + detail, no detail, no icon, not closable; Light + Dark.
const sb=figma.root.children.find(p=>p.name==='99 Sandbox');const cp=figma.root.children.find(p=>p.name==='02 Components');await cp.loadAsync();await figma.setCurrentPageAsync(sb);
figma.skipInvisibleInstanceChildren=false;
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;
const set=cp.findOne(x=>x.type==='COMPONENT_SET'&&x.name==='Toast');if(!set)throw new Error('Run 21-toast-1.js first');
const V=s=>set.children.find(c=>c.name==='Severity='+s);
const P=(inst,vals)=>{const K={};for(const k in inst.componentProperties)K[k.split('#')[0]]=k;const o={};for(const [k,v] of Object.entries(vals)){if(!K[k])throw new Error('no prop '+k);o[K[k]]=v;}inst.setProperties(o);};
const TEXT={info:['Info Message','PrimeNG rocks'],success:['Success Message','Message sent'],warn:['Warn Message','There are unsaved changes'],error:['Error Message','Validation failed'],secondary:['Secondary Message','Message content'],contrast:['Contrast Message','Message content']};
const fr=(name,dir,gap)=>{const f=figma.createFrame();f.name=name;f.layoutMode=dir;f.itemSpacing=gap;f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.fills=[];f.clipsContent=false;return f;};
const fill=(f,n)=>{const v=VB[n];const r=v.resolveForConsumer(f).value;f.fills=[figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:r.r,g:r.g,b:r.b},opacity:r.a??1},'color',v)];};
for(const n of [...sb.children])if(n.name.startsWith('Toast — '))n.remove();
let y0=40;for(const n of sb.children)y0=Math.max(y0,n.y+n.height+200);
// A
const A=fr('Toast — Example (Sakai)','VERTICAL',14);sb.appendChild(A);A.x=0;A.y=y0;A.paddingTop=A.paddingBottom=A.paddingLeft=A.paddingRight=24;
for(const s of Object.keys(TEXT)){const t=V(s).createInstance();A.appendChild(t);P(t,{Summary:TEXT[s][0],Detail:TEXT[s][1]});}
// B
const B=figma.createFrame();B.name='Toast — Example screen (stack top-right)';sb.appendChild(B);B.resize(1440,900);B.x=480;B.y=y0;B.clipsContent=true;fill(B,VB['surface/ground']?'surface/ground':'content/background');
const st=fr('Stack','VERTICAL',14);B.appendChild(st);
for(const s of ['success','info','warn','error']){const t=V(s).createInstance();st.appendChild(t);P(t,{Summary:TEXT[s][0],Detail:TEXT[s][1]});}
st.x=1440-20-st.width;st.y=20;st.constraints={horizontal:'MAX',vertical:'MIN'};
// C
const C=fr('Toast — Stress','VERTICAL',0);sb.appendChild(C);C.x=0;C.y=y0+Math.max(A.height,900)+160;
const colls=await figma.variables.getLocalVariableCollectionsAsync();
for(const mode of ['Light','Dark']){const band=fr(mode,'HORIZONTAL',24);C.appendChild(band);band.paddingTop=band.paddingBottom=band.paddingLeft=band.paddingRight=24;band.counterAxisAlignItems='MIN';
 for(const c of colls){const m=c.modes.find(m=>m.name===mode);if(m)band.setExplicitVariableModeForCollection(c,m.modeId);}fill(band,VB['surface/ground']?'surface/ground':'content/background');
 for(const s of ['info','success','warn','error','secondary','contrast']){const col=fr(s,'VERTICAL',14);band.appendChild(col);
  const a=V(s).createInstance();col.appendChild(a);P(a,{Summary:'A long summary that wraps onto a second line inside the toast',Detail:'A long detail text that also wraps over several lines to check the close button and icon stay at the top.'});
  const b=V(s).createInstance();col.appendChild(b);P(b,{Summary:TEXT[s][0],'Show detail':false});
  const c=V(s).createInstance();col.appendChild(c);P(c,{Summary:TEXT[s][0],Detail:TEXT[s][1],'Show icon':false,Closable:false});}}
return {A:A.id,B:B.id,C:C.id,stack:st.width+'x'+st.height};
