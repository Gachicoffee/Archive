import test from 'node:test';
import assert from 'node:assert/strict';
import { snapshot, WEEK_START, DEMO_TODAY } from '../src/data/mock';
import { searchLocal, mockProvider } from '../src/data/provider';
test('posts reference existing entities and never invent source URLs',()=>{
 assert.equal(new Set(snapshot.posts.map(p=>p.id)).size,snapshot.posts.length);
 for(const p of snapshot.posts){assert.ok(snapshot.farms.some(f=>f.id===p.farmId));assert.ok(snapshot.producers.some(e=>e.id===p.producerId));assert.ok(p.isMock);assert.equal(p.sourceUrl,undefined);assert.match(p.date,/^\d{4}-\d{2}-\d{2}$/)}
});
test('Korean climate wording expands to rainfall and harvest terms',()=>{
 const result=searchLocal('날씨 때문에 수확이 어려웠던 농장',snapshot.posts);
 assert.ok(result.related.includes('강우'));
 assert.ok(result.posts.some(p=>p.id==='p04'));
 assert.equal(result.mode,'local-keyword');
});
test('Korean cultivar term resolves the English tag',()=>{assert.ok(searchLocal('핑크 버번',snapshot.posts).posts.some(p=>p.id==='p03'))});
test('empty and unmatched searches behave predictably',()=>{assert.equal(searchLocal('',snapshot.posts).posts.length,12);assert.equal(searchLocal('unmatchedxyz',snapshot.posts).posts.length,0)});
test('weekly and new-entity counters match the actual demo records',()=>{
 const weekly=snapshot.posts.filter(p=>p.date>=WEEK_START&&p.date<=DEMO_TODAY);
 assert.equal(weekly.length,5);
 const fresh=snapshot.farms.filter(f=>!snapshot.posts.some(p=>p.farmId===f.id&&p.date<WEEK_START));
 assert.deepEqual(fresh.map(f=>f.id),['bensa']);
});
test('provider isolates the source snapshot from downstream mutation',async()=>{const data=await mockProvider.getSnapshot();data.posts[0].title='changed';assert.notEqual(snapshot.posts[0].title,'changed')});
