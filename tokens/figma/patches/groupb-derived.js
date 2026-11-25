const D={"col": "Components", "chunk": "group-b-derived", "modes": ["Light", "Dark"], "vars": [["checkbox/focus-ring-radius", "F", "r", 7, 0, "Derived (no CSS variable): checkbox.border-radius + checkbox.focus-ring.offset + checkbox.focus-ring.width. Radius of the focus outline as the browser draws it."], ["toggleswitch/sm/width", "F", "wh", 28, 0, "Derived (no CSS variable): DESIGN-ONLY, not in Aura or code (#71): toggleswitch.width \u2212 0.5rem."], ["toggleswitch/sm/height", "F", "wh", 17.5, 0, "Derived (no CSS variable): DESIGN-ONLY, not in Aura or code (#71): toggleswitch.height \u2212 0.25rem."], ["toggleswitch/sm/handle-size", "F", "wh", 10.5, 0, "Derived (no CSS variable): DESIGN-ONLY, not in Aura or code (#71): toggleswitch.handle.size \u2212 0.25rem."], ["toggleswitch/lg/width", "F", "wh", 42, 0, "Derived (no CSS variable): DESIGN-ONLY, not in Aura or code (#71): toggleswitch.width + 0.5rem."], ["toggleswitch/lg/height", "F", "wh", 24.5, 0, "Derived (no CSS variable): DESIGN-ONLY, not in Aura or code (#71): toggleswitch.height + 0.25rem."], ["toggleswitch/lg/handle-size", "F", "wh", 17.5, 0, "Derived (no CSS variable): DESIGN-ONLY, not in Aura or code (#71): toggleswitch.handle.size + 0.25rem."]]};
const SC={h:[],ff:['FONT_FAMILY'],sem:['ALL_FILLS','STROKE_COLOR'],bg:['FRAME_FILL','SHAPE_FILL'],tx:['TEXT_FILL','SHAPE_FILL'],st:['STROKE_COLOR'],r:['CORNER_RADIUS'],g:['GAP'],wh:['WIDTH_HEIGHT'],fs:['FONT_SIZE'],sw:['STROKE_FLOAT'],fw:['FONT_WEIGHT'],op:['OPACITY']};
const T={C:'COLOR',F:'FLOAT',S:'STRING'};
let col=(await figma.variables.getLocalVariableCollectionsAsync()).find(c=>c.name===D.col);
let newCol=false;
if(!col){col=figma.variables.createVariableCollection(D.col);col.renameMode(col.modes[0].modeId,D.modes[0]);newCol=true;}
for(const m of D.modes) if(!col.modes.some(x=>x.name===m)) col.addMode(m);
const mid=Object.fromEntries(col.modes.map(m=>[m.name,m.modeId]));
const all=await figma.variables.getLocalVariablesAsync();
const byName=new Map();const dup=[];
for(const v of all){if(byName.has(v.name))dup.push(v.name);byName.set(v.name,v);}
const inCol=new Map(all.filter(v=>v.variableCollectionId===col.id).map(v=>[v.name,v]));
const errors=[];let created=0,updated=0,unchanged=0;const fresh=new Set();
for(const [n,t] of D.vars){let v=inCol.get(n);if(!v){if(byName.has(n)){errors.push(n+': name exists in another collection');continue;}v=figma.variables.createVariable(n,col,T[t]);inCol.set(n,v);byName.set(n,v);fresh.add(n);created++;}else if(v.resolvedType!==T[t])errors.push(n+': type '+v.resolvedType+' != '+T[t]);}
const k4=x=>Math.round(x*10000)/10000;
const eq=(a,b)=>{if(a&&typeof a==='object'&&a.type==='VARIABLE_ALIAS')return !!(b&&b.type==='VARIABLE_ALIAS'&&a.id===b.id);if(a&&typeof a==='object'&&'r' in a)return !!(b&&typeof b==='object'&&'r' in b)&&['r','g','b','a'].every(c=>k4(a[c])===k4(b[c]));if(typeof a==='number'&&typeof b==='number')return Math.abs(a-b)<1e-6;return a===b;};
for(const [n,t,sk,vals,cs,desc] of D.vars){const v=inCol.get(n);if(!v)continue;let ch=false;
const sc=SC[sk];if(JSON.stringify([...v.scopes].sort())!==JSON.stringify([...sc].sort())){v.scopes=sc;ch=true;}
const d=desc||'';if(v.description!==d){v.description=d;ch=true;}
const web=cs?'var('+cs+')':null;const curWeb=(v.codeSyntax&&v.codeSyntax.WEB)||null;
if(web&&curWeb!==web){v.setVariableCodeSyntax('WEB',web);ch=true;}else if(!web&&curWeb){v.removeVariableCodeSyntax('WEB');ch=true;}
for(const m of D.modes){const raw=(vals&&typeof vals==='object'&&!Array.isArray(vals)&&!('a' in vals))?vals[m]:vals;let val;
if(raw&&typeof raw==='object'&&!Array.isArray(raw)){const tg=byName.get(raw.a);if(!tg){errors.push(n+': alias target '+raw.a+' missing');continue;}val={type:'VARIABLE_ALIAS',id:tg.id};}
else if(Array.isArray(raw))val={r:raw[0],g:raw[1],b:raw[2],a:raw[3]};else val=raw;
if(!eq(val,v.valuesByMode[mid[m]])){v.setValueForMode(mid[m],val);ch=true;}}
if(!fresh.has(n)){ch?updated++:unchanged++;}}
const planNames=new Set(D.vars.map(x=>x[0]));
return {collection:D.col,chunk:D.chunk,modes:col.modes.map(m=>m.name),newCollection:newCol,inPlan:D.vars.length,created,updated,unchanged,collectionTotal:col.variableIds.length,errors,duplicateNames:dup.slice(0,10)};
