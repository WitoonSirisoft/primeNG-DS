const D={"F":{"gap":"button/gap","rw":"button/focus-ring/width","dop":"disabled-opacity","bsz":"button/badge-size","shadow":"button/raised-shadow","icon":"Icon/check","spinner":"Icon/primeng-spinner"},"from":216,"to":432};
const pg=figma.root.children.find(p=>p.name==='99 Sandbox');await figma.setCurrentPageAsync(pg);
const VB={};for(const v of await figma.variables.getLocalVariablesAsync())VB[v.name]=v;const bsz=VB[D.F.bsz];if(!bsz)throw new Error('Missing '+D.F.bsz);
const set=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Button');const bs=pg.findOne(n=>n.type==='COMPONENT_SET'&&n.name==='Badge');
const BADGE=bs&&bs.children.find(c=>c.name==='Severity=secondary, Circle=true');if(!BADGE)throw new Error('Build the Badge set first');
const K={};for(const k in set.componentPropertyDefinitions)K[k.split('#')[0]]=k;if(!K['Badge'])K['Badge']=set.addComponentProperty('Badge','BOOLEAN',false);
let added=0,had=0;const kids=set.children.slice(D.from,D.to);
for(const c of kids){if(c.findChild(x=>x.name==='Badge')){had++;continue;}const t=c.findChild(x=>x.name==='Label');
 const bi=BADGE.createInstance();bi.name='Badge';c.insertChild(c.children.indexOf(t)+1,bi);bi.setBoundVariable('minWidth',bsz);bi.setBoundVariable('height',bsz);bi.visible=false;
 bi.componentPropertyReferences={visible:K['Badge']};bi.isExposedInstance=true;added++;}
return {range:[D.from,D.to],added,had,total:set.children.length};