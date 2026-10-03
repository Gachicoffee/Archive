import { classifyArchive, topicLabel } from './taxonomy';
import { snapshot } from './mock';
import type { ArchiveProvider, Post, SearchResult } from './types';
import { adaptLegacy } from './legacy';
import { mergeUpdates } from './updates';
import { indexFarms } from './farms';
const groups=[['기후','날씨','강우','비','우기','가뭄','개화','수확 지연','미기후'],['핑크 버번','pink bourbon','품종','버번','bourbon'],['가공','발효','워시드','washed','허니','honey','내추럴','natural','건조'],['콜롬비아','colombia','우일라','huila'],['코스타리카','costa rica','tarrazú','타라주'],['과테말라','guatemala','huehuetenango'],['에티오피아','ethiopia','sidama'],['생산자','가족','공동체','세대'],['고도','토양','그늘']];
export function searchLocal(query:string,posts:Post[]):SearchResult {
 const q=query.toLowerCase().trim();
 if(!q) return {posts,related:['기후','Pink Bourbon','가공','생산자'],mode:'local-keyword'};
 const matched=groups.filter(g=>g.some(t=>q.includes(t)));
 const related=[...new Set(matched.flat())].filter(t=>!q.includes(t)).slice(0,8);
 const terms=[...matched.flat(),...q.split(/\s+/).filter(t=>t.length>1)];
 const ranked=posts.map(p=>{const hay=[p.title,p.caption,p.country,p.region,...p.tags,...(p.topics||[]).map(topicLabel)].join(' ').toLowerCase();return {p,score:terms.reduce((s,t)=>s+(hay.includes(t.toLowerCase())?1:0),0)};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||b.p.date.localeCompare(a.p.date));
 return {posts:ranked.map(x=>x.p),related,mode:'local-keyword'};
}
export const mockProvider:ArchiveProvider={async getSnapshot(){return classifyArchive(structuredClone(snapshot))},async search(query,posts){return searchLocal(query,posts)}};
// Replace this factory with an API-backed provider; components keep the same interface.
export function getArchiveProvider():ArchiveProvider{
 if(new URLSearchParams(window.location.search).get('demo')==='1')return mockProvider;
 return {async getSnapshot(){
  const base=import.meta.env.BASE_URL;
  const response=await fetch(`${base}archive_data.json`);
  if(!response.ok)throw new Error('기존 기록을 불러오지 못했습니다.');
  const archive=adaptLegacy(await response.json(),base);
  const updates=await fetch(`${base}archive_updates.json`,{cache:'no-cache'});
  if(updates.status===404)return classifyArchive(indexFarms(archive));
  if(!updates.ok)throw new Error('추가 기록을 불러오지 못했습니다.');
  return classifyArchive(indexFarms(mergeUpdates(archive,await updates.json())));
 },async search(query,posts){return searchLocal(query,posts)}};
}
