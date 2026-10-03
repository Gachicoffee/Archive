import type { ArchiveSnapshot, Post } from './types';
export interface Updates {version:1; posts:Post[]; collection:{checkedAt:string;schedule:string;backfillComplete:boolean;backfillAfter:string;lastAdded:number;method:string};}
export const shortcode=(url?:string)=>url?.match(/^https:\/\/(?:www\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(?:p|reel)\/([A-Za-z0-9_-]+)\/?$/)?.[1];
export function mergeUpdates(base:ArchiveSnapshot,updates:Updates):ArchiveSnapshot {
 if(updates.version!==1||!Array.isArray(updates.posts)||!updates.collection)throw new Error('Invalid updates');
 const known=new Set(base.posts.map(p=>shortcode(p.sourceUrl)).filter(Boolean));
 const added:Post[]=[];
 for(const p of updates.posts){
  const key=shortcode(p.sourceUrl);
  if(!key||known.has(key)||p.isMock||!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||!p.caption||!Array.isArray(p.tags)||!p.id||typeof p.summary!=='string')continue;
  known.add(key);added.push(p);
 }
 return {...base,posts:[...added,...base.posts],collection:updates.collection};
}
