import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adaptLegacy } from '../src/data/legacy';
import { mergeUpdates } from '../src/data/updates';
import { buildInsightCards, insightSections } from '../src/data/insights';
const data=mergeUpdates(adaptLegacy(JSON.parse(readFileSync('public/archive_data.json','utf8')),'/'),JSON.parse(readFileSync('public/archive_updates.json','utf8')));
test('reviewed cards retain original quotes, dates and distinct source identities',()=>{
 const cards=buildInsightCards(data.posts,'2026-10-04');
 assert.equal(cards.filter(c=>c.category==='processing').length,4);
 assert.equal(cards.filter(c=>c.category==='research').length,3);
 assert.equal(cards.length,17);
 assert.equal(new Set(insightSections.map(s=>s.id)).size,7);
 for(const category of ['cultivars','cultivation','quality','partnership','market'])assert.equal(cards.filter(c=>c.category===category).length,2);
 for(const card of cards){
  for(const citation of card.citations){const post=data.posts.find(p=>p.id===citation.postId)!;assert.ok(post.caption.includes(citation.quote));assert.ok(citation.quote.includes(citation.anchor));assert.equal(citation.date,post.date);assert.equal(citation.sourceUrl,post.sourceUrl);}
  for(const stage of card.stages)for(const index of stage.citationIndexes)assert.ok(card.citations[index]);
  for(const source of card.researchSources||[])assert.ok(source.url.startsWith('https://'));
 }
 const osmotic=cards.find(c=>c.id==='libre-osmotic')!;
 assert.deepEqual(osmotic.citations.map(c=>c.date),['2026-04-12','2026-10-03']);
});
test('missing, altered, future or mock evidence hides a card rather than inventing support',()=>{
 const cards=buildInsightCards(data.posts,'2026-10-04');
 for(const card of cards)for(const citation of card.citations){
  for(const transform of [(p:any)=>({...p,caption:'근거 없음'}),(p:any)=>({...p,date:'2027-01-01'}),(p:any)=>({...p,isMock:true})]){
   const changed=data.posts.map(p=>p.id===citation.postId?transform(p):p);
   assert.ok(!buildInsightCards(changed,'2026-10-04').some(c=>c.id===card.id));
  }
  assert.ok(!buildInsightCards(data.posts.filter(p=>p.id!==citation.postId),'2026-10-04').some(c=>c.id===card.id));
 }
});
test('source-free imports do not generate editorial research or predictions',()=>{
 assert.deepEqual(buildInsightCards([{...data.posts[0],id:'unreviewed',caption:'새 논문: 효모 발효가 CoE 수상을 일으켰다.',isMock:false}],'2026-10-04'),[]);
 assert.ok(!buildInsightCards(data.posts,'2026-04-11').some(c=>c.id==='libre-osmotic'));
});
