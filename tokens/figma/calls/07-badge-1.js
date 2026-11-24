const D={"sev":["none","secondary","info","success","warn","danger","contrast"]};
const pg=figma.root.children.find(p=>p.name==='99 Sandbox');await figma.setCurrentPageAsync(pg);
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
return {set:set.id,created:ids.created.length,rebuilt:ids.rebuilt.length,variantsInSet:set.children.length,sizes};