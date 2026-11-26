const D={"col":"Semantic","chunk":"batch2-sidebar","modes":["Light","Dark"],"vars":[["layout/menu/item/active-font-weight","F","fw",700,0,"Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: ul a.active-route { font-weight }."],["layout/menu/item/icon-gap","F","g",7,0,"Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-menuitem-icon { margin-right }."],["layout/menu/item/padding-y","F","g",10.5,0,"Derived from layout/menu/item/padding (2-value shorthand, y). Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: ul a { padding }."],["layout/menu/item/padding-x","F","g",14,0,"Derived from layout/menu/item/padding (2-value shorthand, x). Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: ul a { padding }."],["layout/menu/root-text/font-size","F","fs",11.998,0,"Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-menuitem-root-text { font-size }."],["layout/menu/root-text/font-weight","F","fw",700,0,"Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-menuitem-root-text { font-weight }."],["layout/menu/root-text/margin-y","F","g",10.5,0,"Derived from layout/menu/root-text/margin (2-value shorthand, y). Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-menuitem-root-text { margin }."],["layout/menu/root-text/margin-x","F","g",0,0,"Derived from layout/menu/root-text/margin (2-value shorthand, x). Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-menuitem-root-text { margin }."],["layout/menu/submenu/indent","F","h",14,0,"Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: ul ul li a { margin-left } (first nested level)."],["layout/menu/toggler/size","F","wh",10.5,0,"Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-submenu-toggler { font-size: 75% } of the 1rem link text."],["layout/sidebar/padding-y","F","g",7,0,"Derived from layout/sidebar/padding (2-value shorthand, y). Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-sidebar { padding }."],["layout/sidebar/padding-x","F","g",21,0,"Derived from layout/sidebar/padding (2-value shorthand, x). Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-sidebar { padding }."],["layout/sidebar/width","F","wh",280,0,"Not a PrimeNG token (no CSS variable). Source: src/assets/layout/_menu.scss: .layout-sidebar { width }."]]};
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
