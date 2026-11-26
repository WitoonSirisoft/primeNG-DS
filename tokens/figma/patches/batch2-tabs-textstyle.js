const D={"styles": [["Tabs/Tab label", "Lato", "SemiBold", 14, 120, {"fontFamily": "font-family", "fontSize": "typography/base/font-size", "fontWeight": "tabs/tab/font-weight"}, "CSS: .p-tab (#98). Size typography/base/font-size, weight tabs/tab/font-weight (--p-tabs-tab-font-weight), line-height 1.2 (typography/base/line-height).", "ORIGINAL"]]};
const vars=await figma.variables.getLocalVariablesAsync();const vByName=new Map(vars.map(v=>[v.name,v]));
const avail=await figma.listAvailableFontsAsync();const errors=[];
const fonts=[...new Set(D.styles.map(s=>s[1]+'|'+s[2]))].map(x=>{const [family,style]=x.split('|');return {family,style};});
for(const f of fonts){if(!avail.some(a=>a.fontName.family===f.family&&a.fontName.style===f.style))errors.push('font not available: '+f.family+' '+f.style);}
if(errors.length)return {errors};
await Promise.all(fonts.map(f=>figma.loadFontAsync(f)));
const styles=await figma.getLocalTextStylesAsync();const byName=new Map(styles.map(s=>[s.name,s]));let created=0,updated=0,unchanged=0;const ids=[];const bound={};
for(const [n,family,style,size,lh,bind,desc,tc] of D.styles){let s=byName.get(n);let isNew=false;if(!s){s=figma.createTextStyle();s.name=n;created++;isNew=true;}
let ch=false;
if(s.fontName.family!==family||s.fontName.style!==style){s.fontName={family,style};ch=true;}
if(Math.abs(s.fontSize-size)>1e-4){s.fontSize=size;ch=true;}
if(s.lineHeight.unit!=='PERCENT'||Math.abs(s.lineHeight.value-lh)>1e-3){s.lineHeight={unit:'PERCENT',value:lh};ch=true;}
if(s.textCase!==(tc||'ORIGINAL')){s.textCase=tc||'ORIGINAL';ch=true;}
if(s.letterSpacing.unit!=='PERCENT'||s.letterSpacing.value!==0){s.letterSpacing={unit:'PERCENT',value:0};ch=true;}
if(s.description!==desc){s.description=desc;ch=true;}
bound[n]={};
for(const [field,vn] of Object.entries(bind)){const v=vByName.get(vn);if(!v){errors.push(n+': variable '+vn+' missing');continue;}
const cur=s.boundVariables&&s.boundVariables[field];if(!cur||cur.id!==v.id){try{s.setBoundVariable(field,v);ch=true;}catch(e){errors.push(n+': bind '+field+' failed: '+e.message);continue;}}
bound[n][field]=vn;}
ids.push(s.id);if(!isNew){ch?updated++:unchanged++;}}
const after=(await figma.getLocalTextStylesAsync()).filter(s=>D.styles.some(x=>x[0]===s.name)).map(s=>[s.name,s.fontName.family,s.fontName.style,s.fontSize,s.lineHeight.value,Object.keys(s.boundVariables||{}).join(',')]);
return {textStyles:D.styles.length,created,updated,unchanged,errors,after};
