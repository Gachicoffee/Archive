import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adaptLegacy } from '../src/data/legacy';
import { mergeUpdates } from '../src/data/updates';
import { detectArchiveEvents } from '../src/data/events';
import { searchLocal } from '../src/data/provider';
import type { Post } from '../src/data/types';
const data=mergeUpdates(adaptLegacy(JSON.parse(readFileSync('public/archive_data.json','utf8')),'/'),JSON.parse(readFileSync('public/archive_updates.json','utf8')));
const makePost=(caption:string,id='test'):Post=>({id,caption,date:'2025-08-17',title:'기록',summary:'',country:'국가 미분류',region:'',farmId:'',producerId:'',tags:[],isMock:false});

test('washing station variants resolve to the same real records and stay separate from washed processing',()=>{
 const captions=['와싱스테이션을 방문했다.','워싱 스테이션에서 선별했다.','커피워싱스테이션이다.','Coffee washing-station.'];
 const posts=captions.map((caption,i)=>makePost(caption,String(i))).concat(makePost('워시드 프로세싱으로 가공한 커피다.','washed-only'));
 for(const q of ['와싱스테이션','워싱스테이션','커피워싱스테이션','커피 워싱 스테이션','washing station','washing-station']){
  assert.deepEqual(new Set(searchLocal(q,posts).posts.map(p=>p.id)),new Set(['0','1','2','3']));
  assert.deepEqual(searchLocal(q,data.posts).posts.map(p=>p.id),searchLocal('와싱스테이션',data.posts).posts.map(p=>p.id));
 }
 assert.ok(searchLocal('워싱스테이션',data.posts).posts.some(p=>p.id==='legacy-221'));
});

test('archive event citations are original spans and isolate calendar years',()=>{
 const events=detectArchiveEvents(data.posts,'2026-10-04');
 assert.equal(events.length,4);
 const frost=events.find(e=>e.id==='brazil-frost-2025')!;
 assert.ok(frost);assert.equal(frost.date,'2025-08-17');assert.match(frost.inference,/2026년/);assert.match(frost.inference,/확인된 것은 아닙니다/);
 for(const event of events)for(const citation of event.evidence){
  const post=data.posts.find(p=>p.id===citation.postId)!;
  assert.ok(post.caption.includes(citation.quote));if(citation.qualification)assert.ok(post.caption.includes(citation.qualification));assert.equal(post.sourceUrl,citation.sourceUrl);assert.ok(citation.date.startsWith(event.period));
 }
 assert.ok(events.find(e=>e.id==='narino-drought-2026')?.inference.includes('2027년'));
 assert.match(frost.evidence[0].qualification||'',/수확량에는 별 영향/);
 assert.match(events.find(e=>e.id==='nicaragua-harvest-2026')?.evidence[0].qualification||'',/평년작/);
});

test('event discovery ignores summaries, literary frost substrings, unrelated paragraphs and future records',()=>{
 const posts=[makePost('책의 모서리를 접었다. 브라질 커피를 마셨다.','literary'),makePost('브라질의 문화를 읽었다.\n\n다른 나라에서 냉해가 발생했다.','unrelated'),{...makePost('커피를 마셨다.','summary-only'),summary:'브라질 냉해와 가격 급등'}, {...makePost('브라질 냉해가 발생했다.','future'),date:'2027-01-01'}, {...makePost('브라질 냉해가 발생했다.','demo'),isMock:true}];
 assert.deepEqual(detectArchiveEvents(posts,'2026-10-04'),[]);
 assert.equal(detectArchiveEvents([makePost('브라질 냉해의 피해 규모는 아직 불확실하다.')],'2026-10-04').length,1);
});

test('frost search joins cold damage aliases without confusing book corners with frost',()=>{
 const posts=[makePost('책의 모서리를 접었다.','book'),makePost('브라질 냉해가 발생했다.','cold'),makePost('브라질에 서리가 내렸다.','frost')];
 for(const q of ['서리','냉해','frost'])assert.deepEqual(new Set(searchLocal(q,posts).posts.map(p=>p.id)),new Set(['cold','frost']));
});
