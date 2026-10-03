import catalog from './farm-catalog.json';
import type { ArchiveSnapshot, Entity, Post } from './types';
const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const hasFarm=(post:Post,id:string)=>post.farmIds?post.farmIds.includes(id):post.farmId===id;
const patterns=catalog.farms.map(f=>({...f,patterns:f.aliases.map(alias=>new RegExp((/^[A-Za-z]/.test(alias)?'(?<![A-Za-z])':'')+alias.split(/\s+/).map(escape).join('\\s*')+(/[A-Za-z]$/.test(alias)?'(?![A-Za-z])':''),'gi'))}));
export function indexFarms(snapshot:ArchiveSnapshot):ArchiveSnapshot {
 if(snapshot.mode==='demo')return snapshot;
 const posts=snapshot.posts.map(post=>{
  const text=post.caption;const matches:{id:string;start:number;end:number;quote:string}[]=[];
  for(const f of patterns){
   const hits=f.patterns.flatMap(pattern=>[...text.matchAll(pattern)]).sort((a,b)=>a.index!-b.index!||b[0].length-a[0].length);
   for(const hit of hits){
    const start=hit.index!,end=start+hit[0].length;
    // Shared names and technical terms need explicit source context.
    if(f.id==='santa-rosa-sv'&&/^(?:\s*1900)/.test(text.slice(end)))continue;
    if(f.id==='santa-rosa-sv'&&/santarosa1900|산타\s*로사\s*1900/i.test(text)&&!/(엘살바도르|El Salvador)/i.test(text))continue;
    if(f.id==='el-paraiso-co'&&!/(콜롬비아|Colombia|디에고|Diego)/i.test(text))continue;
    if(f.id==='los-pirineos-ni'&&post.id!=='legacy-561'&&!/니카라과|Nicaragua/i.test(text))continue;
    if(f.id==='la-bendicion-luis'&&post.id==='legacy-561'&&text.slice(end,end+12).includes('위와 다른'))continue;
    if(matches.some(m=>m.id===f.id))break;
    const quote=text.slice(Math.max(0,start-70),Math.min(text.length,end+170)).trim();
    matches.push({id:f.id,start,end,quote});break;
   }
  }
  matches.sort((a,b)=>a.start-b.start||b.end-a.end);
  // Primary ID remains available to old clients; a post may reference many farms.
  return {...post,farmId:matches[0]?.id||'',farmIds:matches.map(m=>m.id),farmEvidence:Object.fromEntries(matches.map(m=>[m.id,m.quote]))};
 });
 const farms:Entity[]=catalog.farms.filter(f=>posts.some(p=>p.farmIds.includes(f.id))).map(f=>({id:f.id,name:f.name,country:f.country,region:f.region,description:f.description,kind:f.kind==='mill'?'mill':'farm',evidence:f.evidence}));
 return {...snapshot,posts,farms};
}
