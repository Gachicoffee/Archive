import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adaptLegacy } from '../src/data/legacy';
import { mergeUpdates } from '../src/data/updates';
import { hasFarm, indexFarms } from '../src/data/farms';
const base=adaptLegacy(JSON.parse(readFileSync('public/archive_data.json','utf8')),'/Archive/');
const data=indexFarms(mergeUpdates(base,JSON.parse(readFileSync('public/archive_updates.json','utf8'))));
test('every reviewed entity retains a real caption evidence and all source data',()=>{
 assert.equal(data.posts.length,2086);assert.ok(data.farms.length>60);
 for(const f of data.farms)for(const e of f.evidence||[]){const post=data.posts.find(p=>p.id===e.postId)!;assert.ok(post);assert.ok(post.caption.includes(e.quote));assert.equal(post.sourceUrl,e.sourceUrl)}
 for(const p of data.posts){assert.ok((p.farmIds||[]).every(id=>data.farms.some(f=>f.id===id)));assert.ok(Object.values(p.farmEvidence||{}).every(quote=>p.caption.includes(quote)))}
});
test('one auction record appears in each named farm story, without losing its caption',()=>{
 const p=data.posts.find(p=>p.id==='legacy-2021')!;
 for(const id of ['el-laurel','la-fortuna','montecillos','santa-rosa-sv'])assert.ok(hasFarm(p,id),id);
 assert.equal(p.caption,base.posts.find(source=>source.id===p.id)!.caption);
});
test('same-name farms, regions, lots, and producer nicknames are not conflated',()=>{
 const p=data.posts.find(p=>p.id==='legacy-1793')!;assert.ok(hasFarm(p,'santa-rosa-1900'));assert.equal(hasFarm(p,'santa-rosa-sv'),false);
 const region=data.posts.find(p=>p.id==='legacy-2021')!;assert.equal(hasFarm(region,'el-paraiso-co'),false);
 assert.equal(data.farms.some(f=>/돈 카이토|Macho|아라쿠|구지/.test(f.name)),false);
 assert.equal(data.farms.find(f=>f.id==='sin-limites')?.kind,'mill');
});
test('multi-farm 2026 record connects both new names after review',()=>{
 const p=data.posts.find(p=>p.id==='instagram-DXAv-G1CTiR')!;assert.ok(hasFarm(p,'la-esperanza'));assert.ok(hasFarm(p,'el-cambalache'));
});
