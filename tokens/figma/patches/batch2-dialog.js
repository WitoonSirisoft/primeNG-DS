const D={"col": "Components", "chunk": "batch2-dialog", "modes": ["Light", "Dark"], "vars": [["dialog/background", "C", "bg", {"a": "overlay/modal/background"}, "--p-dialog-background", 0], ["dialog/border-color", "C", "st", {"a": "overlay/modal/border-color"}, "--p-dialog-border-color", 0], ["dialog/border-radius", "F", "r", {"a": "overlay/modal/border-radius"}, "--p-dialog-border-radius", 0], ["dialog/color", "C", "tx", {"a": "overlay/modal/color"}, "--p-dialog-color", 0], ["dialog/content/padding-top", "F", "g", 0, 0, "Derived from --p-dialog-content-padding (4-value shorthand, top)."], ["dialog/content/padding-right", "F", "g", {"a": "overlay/modal/padding"}, 0, "Derived from --p-dialog-content-padding (4-value shorthand, right)."], ["dialog/content/padding-bottom", "F", "g", {"a": "overlay/modal/padding"}, 0, "Derived from --p-dialog-content-padding (4-value shorthand, bottom)."], ["dialog/content/padding-left", "F", "g", {"a": "overlay/modal/padding"}, 0, "Derived from --p-dialog-content-padding (4-value shorthand, left)."], ["dialog/footer/gap", "F", "g", 7, "--p-dialog-footer-gap", 0], ["dialog/footer/padding-top", "F", "g", 0, 0, "Derived from --p-dialog-footer-padding (4-value shorthand, top)."], ["dialog/footer/padding-right", "F", "g", {"a": "overlay/modal/padding"}, 0, "Derived from --p-dialog-footer-padding (4-value shorthand, right)."], ["dialog/footer/padding-bottom", "F", "g", {"a": "overlay/modal/padding"}, 0, "Derived from --p-dialog-footer-padding (4-value shorthand, bottom)."], ["dialog/footer/padding-left", "F", "g", {"a": "overlay/modal/padding"}, 0, "Derived from --p-dialog-footer-padding (4-value shorthand, left)."], ["dialog/header/gap", "F", "g", 7, "--p-dialog-header-gap", 0], ["dialog/header/padding", "F", "g", {"a": "overlay/modal/padding"}, "--p-dialog-header-padding", 0], ["dialog/title/font-size", "F", "fs", 17.5, "--p-dialog-title-font-size", 0], ["dialog/title/font-weight", "F", "fw", 600, "--p-dialog-title-font-weight", 0], ["confirmdialog/content/gap", "F", "g", 14, "--p-confirmdialog-content-gap", 0], ["confirmdialog/icon/color", "C", "tx", {"a": "overlay/modal/color"}, "--p-confirmdialog-icon-color", 0], ["confirmdialog/icon/size", "F", "wh", 28, "--p-confirmdialog-icon-size", 0]]};
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
