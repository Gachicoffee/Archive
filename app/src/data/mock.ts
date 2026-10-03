import type { ArchiveSnapshot, Post } from './types';
const make=(id:string,date:string,country:string,region:string,farmId:string,producerId:string,title:string,caption:string,tags:string[]):Post=>({id,date,country,region,farmId,producerId,title,caption,summary:caption,tags,isMock:true});
export const snapshot:ArchiveSnapshot={
 farms:[
 {id:'la-palma',name:'Finca La Palma',country:'Colombia',region:'Huila',elevation:'1,750–1,900 m',description:'품종과 수확, 생산자의 선택을 따라 읽는 우일라의 가상 농장 기록.'},
 {id:'el-bosque',name:'El Bosque',country:'Costa Rica',region:'Tarrazú',elevation:'1,650 m',description:'워시드 가공과 물 사용, 기후 변화의 관계를 살펴보는 가상 농장.'},
 {id:'las-nubes',name:'Las Nubes',country:'Guatemala',region:'Huehuetenango',elevation:'1,850 m',description:'고도와 미기후, 생산자 가족의 이야기를 연결하는 가상 농장.'},
 {id:'bensa',name:'Bensa Community',country:'Ethiopia',region:'Sidama',elevation:'2,100 m',description:'소농 공동체의 수확과 건조 과정을 살펴보는 가상 기록.'}],
 producers:[
 {id:'ana',name:'Ana Rivera',country:'Colombia',region:'Huila',description:'품종 다양성과 수확 관리에 관심을 둔 가상 생산자.'},
 {id:'diego',name:'Diego Solís',country:'Costa Rica',region:'Tarrazú',description:'물 사용과 가공 실험을 기록하는 가상 생산자.'},
 {id:'maria',name:'María López',country:'Guatemala',region:'Huehuetenango',description:'가족 농장의 세대 변화를 보여주는 가상 생산자.'},
 {id:'community',name:'Bensa Growers',country:'Ethiopia',region:'Sidama',description:'수확과 건조를 함께하는 가상 생산자 공동체.'}],
 posts:[
 make('p01','2018-03-11','Colombia','Huila','la-palma','ana','처음 만난 라 팔마','버번과 카투라가 자라는 작은 구획에서 첫 대화를 나눴다. 같은 고도에서도 그늘과 토양에 따라 체리의 익는 속도가 달랐다.',['Bourbon','Caturra','토양','고도','첫 방문']),
 make('p02','2020-05-18','Colombia','Huila','la-palma','ana','가공은 작은 선택의 연속','분리 수확과 워시드 가공을 비교했다. 생산자는 발효 시간보다 체리 상태를 먼저 관찰하는 일이 중요하다고 설명했다.',['Washed','발효','가공','품질']),
 make('p03','2022-09-20','Colombia','Huila','la-palma','ana','핑크 버번의 새 구획','Pink Bourbon 시험 구획이 늘었다. 품종 이름만으로 맛을 단정하기보다 재배 환경과 수확 상태를 함께 읽어야 한다.',['Pink Bourbon','품종','재배','품질']),
 make('p04','2024-10-02','Colombia','Huila','la-palma','ana','비가 바꾸는 수확 달력','비가 길어지면서 개화와 수확이 고르게 이어지지 않았다. 선별 수확 횟수가 늘고 노동 부담도 커졌다는 이야기를 들었다.',['기후','강우','개화','수확 지연','노동']),
 make('p05','2026-09-28','Colombia','Huila','la-palma','ana','다시, 우일라의 아침','최근 구획을 돌아보며 Pink Bourbon의 성숙도를 살폈다. 강우와 수확 시점, 균일한 체리 선별이 이번 방문의 주요 대화였다.',['Pink Bourbon','강우','수확','산지 방문']),
 make('p06','2026-10-01','Colombia','Huila','la-palma','ana','잘 익은 체리를 고르는 일','생산자와 분리 수확의 기준을 비교했다. 품질을 유지하기 위해 수확 간격을 조정하는 시도를 기록했다.',['수확','품질','생산자','선별']),
 make('p07','2019-02-08','Costa Rica','Tarrazú','el-bosque','diego','물과 워시드 커피','물 사용량을 줄이는 가공 설비를 살펴보았다. 세척과 건조 과정의 작은 차이를 관찰했다.',['Washed','물','가공','건조']),
 make('p08','2023-03-21','Costa Rica','Tarrazú','el-bosque','diego','건조장의 하루','허니 가공과 워시드 가공의 건조 속도를 비교했다. 날씨에 따라 뒤집는 횟수와 층 두께를 바꿨다.',['Honey','Washed','건조','기후']),
 make('p09','2026-09-30','Costa Rica','Tarrazú','el-bosque','diego','다음 수확을 준비하는 대화','이번 예시 기록에서는 강우 패턴과 물 관리에 관한 원격 대화를 다룬다. 방문 기록과 원격 소식은 구분해서 읽어야 한다.',['기후','강우','물','원격 소식']),
 make('p10','2021-04-07','Guatemala','Huehuetenango','las-nubes','maria','높은 곳의 작은 농장','그늘나무와 고도가 만드는 미기후를 살펴보았다. 가족이 함께 운영하는 농장에서 수확의 속도를 배웠다.',['고도','미기후','생산자','그늘']),
 make('p11','2026-10-02','Guatemala','Huehuetenango','las-nubes','maria','농장의 다음 세대','가족 농장의 새 운영 계획을 예시로 기록했다. 토양 관리와 생산 비용이 다음 세대의 중요한 과제다.',['토양','생산비','생산자','세대']),
 make('p12','2026-09-29','Ethiopia','Sidama','bensa','community','건조대에서 만난 공동체','체리의 두께와 건조 속도를 함께 조절하는 공동체의 작업을 관찰하는 예시다. 균일한 건조가 품질 관리의 출발점이다.',['Natural','건조','공동체','품질'])],
 issues:[{id:'weather',title:'강우의 변화, 기록과 연결해 읽기',description:'기상 자료를 연결하는 카드 예시입니다. 현재 기상 현상이나 농장 피해를 확인한 정보가 아닙니다.',country:'Colombia',sourceLabel:'WMO · 참고 기관',sourceUrl:'https://wmo.int/',checkedAt:null,isMock:true},
 {id:'volcano',title:'화산 활동과 커피 산지',description:'향후 관측소의 발표일·지역·영향 범위를 확인해 연결합니다. 실제 폭발이나 생산 영향을 주장하지 않습니다.',country:'Costa Rica',sourceLabel:'OVSICORI · 참고 기관',sourceUrl:'https://www.ovsicori.una.ac.cr/',checkedAt:null,isMock:true}]
};
export const DEMO_TODAY='2026-10-03';
export const WEEK_START='2026-09-28';
