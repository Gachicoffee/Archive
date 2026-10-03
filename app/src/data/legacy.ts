import type { ArchiveSnapshot, Entity, Post } from './types';
export interface LegacyPost { id:number|string; date:string; cat:string; ent:string; sum:string; body:string; tags:string[]; link:string; img?:string; }
export interface LegacyArchive { categories:string[]; posts:LegacyPost[]; }
const countryMap:Record<string,string>={'과테말라':'Guatemala','인도':'India','에티오피아':'Ethiopia','니카라과':'Nicaragua','케냐':'Kenya','온두라스':'Honduras','파나마':'Panama','코스타리카':'Costa Rica'};
// Only explicit legacy farm labels are promoted; other entities remain searchable text.
const farmNames=['핀카 리브레 (Finca Libre)','바드라 에스테이트 (Bhadra Estate)','챠기테 (Chaguite)','아티칸 에스테이트 (Attikan Estate)','아자드 힌드 (Azad Hind)'];
export function adaptLegacy(raw:LegacyArchive,baseUrl:string):ArchiveSnapshot{
 if(!Array.isArray(raw.posts))throw new Error('Invalid legacy archive');
 const farms:Entity[]=farmNames.filter(name=>raw.posts.some(p=>p.ent===name)).map((name,i)=>{
  const source=raw.posts.find(p=>p.ent===name)!;
  return {id:`legacy-farm-${i}`,name,country:countryMap[source.cat]||'국가 미분류',region:'지역 미분류',description:'기존 아카이브의 농장 이름 분류를 연결했습니다. 통합 요약은 기존 요약을 연도별로 모은 것이며, 분류와 관계는 검토가 필요합니다.'};
 });
 const posts:Post[]=raw.posts.map(p=>({
  id:`legacy-${p.id}`,date:p.date,country:countryMap[p.cat]||'국가 미분류',region:p.ent||p.cat,
  farmId:farms.find(f=>f.name===p.ent)?.id||'',producerId:'',
  title:(p.sum||p.body||p.ent||'기록').split(/\n/)[0].slice(0,65),caption:p.body||'',summary:p.sum||p.body?.slice(0,180)||'',
  tags:[...new Set([p.cat,p.ent,...(p.tags||[]).map(t=>t.replace(/^#/,''))])].filter(Boolean),category:p.cat,
  sourceUrl:/^https:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+\/?$/.test(p.link)?p.link:undefined,
  imageUrl:p.img?`data:image/jpeg;base64,${p.img}`:undefined,isMock:false
 }));
 return {posts,farms,producers:[],issues:[],mode:'imported'};
}
