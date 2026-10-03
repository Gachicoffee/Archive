import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adaptLegacy } from '../src/data/legacy';
import { mergeUpdates } from '../src/data/updates';
const base=adaptLegacy(JSON.parse(readFileSync('public/archive_data.json','utf8')),'/Archive/');
const updates=JSON.parse(readFileSync('public/archive_updates.json','utf8'));
test('weekly additions preserve all original posts and link farm evidence',()=>{
 const merged=mergeUpdates(base,updates);assert.equal(merged.posts.length,2086);
 assert.deepEqual(merged.posts.slice(71),base.posts);
 assert.equal(merged.farms.find(f=>f.id===merged.posts[0].farmId)?.name,'핀카 리브레 (Finca Libre)');
 assert.equal(merged.collection?.backfillComplete,true);
});
test('repeat runs and alternate profile permalink shapes cannot duplicate records',()=>{
 const merged=mergeUpdates(base,updates);
 assert.equal(mergeUpdates(merged,updates).posts.length,2086);
 const repeated={...updates,posts:[{...updates.posts[0],sourceUrl:'https://www.instagram.com/libre_pil/p/DeBDmiWgDVy/'}]};
 assert.equal(mergeUpdates(merged,repeated).posts.length,2086);
});
test('unsafe evidence and invalid dates are rejected',()=>{
 for(const patch of [{sourceUrl:'https://evil.com/instagram.com/p/unsafe/'},{date:'unknown'},{isMock:true}]){
  assert.equal(mergeUpdates(base,{...updates,posts:[{...updates.posts[0],...patch}]}).posts.length,2015);
 }
});
