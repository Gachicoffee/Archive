import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { adaptLegacy } from '../src/data/legacy';
const raw=JSON.parse(readFileSync('public/archive_data.json','utf8'));
const data=adaptLegacy(raw,'/Archive/');
test('all 2015 legacy records keep captions, dates, links and images',()=>{
 assert.equal(data.posts.length,2015);assert.equal(data.mode,'imported');
 for(let i=0;i<raw.posts.length;i++){
  const p=data.posts[i],r=raw.posts[i];assert.equal(p.caption,r.body);assert.equal(p.date,r.date);assert.equal(p.sourceUrl,r.link);assert.equal(p.imageUrl,`data:image/jpeg;base64,${r.img}`);assert.equal(p.isMock,false);
 }
});
test('generic categories and ambiguous country groups are not fabricated as countries or producers',()=>{
 assert.equal(data.producers.length,0);
 assert.ok(data.posts.filter(p=>p.category==='콜롬비아·기타 중남미').every(p=>p.country==='국가 미분류'));
 assert.equal(data.farms.length,5);
 assert.ok(data.posts.filter(p=>p.farmId).every(p=>data.farms.some(f=>f.id===p.farmId)));
});
test('malicious links never become clickable evidence',()=>{
 const unsafe=adaptLegacy({categories:[],posts:[{...raw.posts[0],link:'javascript:alert(1)'}]},'/Archive/');
 assert.equal(unsafe.posts[0].sourceUrl,undefined);
});
