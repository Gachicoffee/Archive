import type { Post } from './types';
export type InsightCategory='processing'|'research'|'cultivars'|'cultivation'|'quality'|'partnership'|'market';
import { additionalInsights } from './insight-topics';
export const insightSections: {id:InsightCategory;label:string;title:string;subtitle:string}[]=[
 {id:'processing',label:'프로세싱 실험',title:'산지에서 시작한 실험, 그다음은?',subtitle:'어디서 무엇을 시도했나 → 기대 → 후속 결과 → 원문 근거'},
 {id:'research',label:'논문·연구',title:'연구를 읽고, 커피에 연결하기',subtitle:'원문의 연구 언급 → 확인한 자료 → 적용 가능성 → 출처'},
 {id:'cultivars',label:'품종·유전 자원',title:'품종의 가능성은 어떤 땅에서 달라질까?',subtitle:'품종 선택 → 현장 관찰 → 다음 확인 → 원문 근거'},
 {id:'cultivation',label:'재배·토양',title:'커피를 키우는 환경의 변화',subtitle:'토양·그늘·농장 관리 → 기대와 조건 → 확인할 결과'},
 {id:'quality',label:'수확·품질 관리',title:'좋은 커피를 지키는 현장의 디테일',subtitle:'선별·건조·로트 관리 → 품질 연결 → 적용의 조건'},
 {id:'partnership',label:'생산자·협업',title:'좋은 커피를 함께 만드는 사람들',subtitle:'파트너와 역할 → 함께 한 일 → 다음 협업 → 원문 근거'},
 {id:'market',label:'시장·유통',title:'산지의 커피가 시장에 닿기까지',subtitle:'당시 시장 신호 → 구매·유통의 의미 → 확인할 조건'},
];
interface CitationSpec {postId:string;anchor:string;label:string}
export interface InsightCitation extends CitationSpec {date:string;quote:string;sourceUrl?:string}
export interface ResearchSource {label:string;url:string;checkedAt:string;scope:string;finding:string}
export interface InsightStage {label:string;title:string;text:string;kind:'원문에서 정리'|'원문 목표 + 추정'|'후속 언급'|'결과 미확인'|'연구와 해석 구분'|'해석 · 추정';citationIndexes:number[]}
export interface InsightSpec {id:string;category:InsightCategory;title:string;place:string;status:string;lead:string;stages:InsightStage[];citations:CitationSpec[];limits:string;researchSources?:ResearchSource[]}
export interface InsightCardData extends Omit<InsightSpec,'citations'> {citations:InsightCitation[];date:string}
const april='instagram-DXBQ9ftlqO7',october='instagram-DeBDmiWgDVy';

const catalog:InsightSpec[]=[
 {id:'libre-osmotic',category:'processing',title:'삼투압 프로세싱, 쉬운 적용 다음의 과제',place:'니카라과 · 핀카 리브레',status:'후속 언급 · 안정성 과제',lead:'낮은 비용과 쉬운 작업에서 출발했지만, 반복해서 같은 결과를 얻는 것이 다음 과제로 남았습니다.',
  stages:[
   {label:'시도',title:'물 디카페인 처리에서 얻은 아이디어',text:'2026-04-12 원문은 물을 이용한 디카페인 처리에서 아이디어를 얻은 삼투압 프로세싱을 소개합니다. 미완성 단계이며, 입고 생두를 테스트하고 그 결과로 개선하겠다는 계획입니다.',kind:'원문에서 정리',citationIndexes:[0]},
   {label:'기대',title:'낮은 비용 · 쉬운 작업 · 일관성',text:'원문의 목표는 소농이 큰 부담 없이 안정적인 품질을 만드는 것입니다. 추정: 이 세 조건이 함께 충족되면 특수 장비에 크게 의존하지 않는 프로세싱 선택지가 될 수 있습니다. 특정 향미나 점수 상승을 예측할 자료는 없습니다.',kind:'원문 목표 + 추정',citationIndexes:[0,1]},
   {label:'후속',title:'기대와 함께 읽어야 할 안정성 문제',text:'2026-10-03에는 삼투압 실험의 비용과 작업 난도는 낮지만 안정성 확보가 어렵다고 적었습니다. 같은 농장·방식의 후속 언급이며 동일 실험 로트의 결과로 확정하지 않습니다. 다음 확인 항목은 배치별 커핑 편차와 작업 조건의 재현성입니다.',kind:'후속 언급',citationIndexes:[1]},
  ],citations:[{postId:april,anchor:'다른 하나는 아직 미완성 단계인데',label:'삼투압 아이디어와 테스트 계획'},{postId:october,anchor:'작년에는 삼투압을 이용한 실험을 했었는데',label:'안정성 확보의 어려움'}],limits:'4월 글은 “올해”, 10월 글은 “작년”으로 표현합니다. 실제 실험 연도와 로트 관계는 추가 확인이 필요합니다. 삼투압이라는 이름만으로 디카페인 효과나 특정 향미를 보장하지 않습니다.'},
 {id:'libre-yeast',category:'processing',title:'효모 접종 실험, 실패도 다음 선택의 근거',place:'니카라과 · 핀카 리브레',status:'실패 회고 · 원인 세부 미확인',lead:'성공 사례만 모으는 대신, 효모 테스트가 기대에 미치지 못한 기록도 함께 읽습니다.',
  stages:[
   {label:'시도',title:'여러 커피·맥주·사이더용 효모를 테스트',text:'2026-10-03 원문은 2015년 커피용 효모 라인업과 코로나 이전 여러 나라의 맥주·사이더용 효모를 테스트했던 과정을 회고합니다. 게시일과 실제 실험 시기는 다릅니다.',kind:'원문에서 정리',citationIndexes:[0]},
   {label:'기대',title:'향미 가설보다 농장 조건의 재현성',text:'원문은 효모별로 기대했던 향미를 제시하지 않습니다. 추정: 향후 실험에서는 같은 품종과 체리 조건에서 무접종 대조군을 두고 비용·작업 난도·커핑 재현성을 비교해야 적용 가능성을 판단할 수 있습니다.',kind:'원문 목표 + 추정',citationIndexes:[0]},
   {label:'후속',title:'“모두 실패”라는 회고를 보존',text:'원문은 테스트가 모두 실패했고 원인은 다양했다고 적습니다. 실패 원인의 세부 자료는 없습니다. 이 기록은 해당 농장의 테스트 회고이며 효모 접종 전체가 실패한다는 결론으로 확대하지 않습니다.',kind:'후속 언급',citationIndexes:[0]},
  ],citations:[{postId:october,anchor:'2015 년에 와인, 사이더 및 맥주 전문 효모 회사',label:'효모 테스트와 실패 회고'}],limits:'효모 균주별 조건·투입량·온도·대조군·커핑 데이터가 없어 실패 원인과 기대 향미를 재구성할 수 없습니다.'},
 {id:'libre-cold',category:'processing',title:'찬 물을 활용한 콜드퍼먼테이션',place:'니카라과 · 핀카 리브레',status:'적용 기록 · 효과 미확인',lead:'서늘한 미시기후와 흐르는 찬 물을 활용해 발효 온도를 낮추고 시간을 늘린 시도입니다.',
  stages:[
   {label:'시도',title:'배럴을 흐르는 물에 반쯤 담그기',text:'2026-04-12 원문은 농장의 찬 물을 이용해 발효 온도를 낮추고 시간을 연장했다고 적었습니다. 대부분의 커피에 적용했다는 현장 기록입니다.',kind:'원문에서 정리',citationIndexes:[0]},
   {label:'기대',title:'농장에 이미 있는 환경을 활용',text:'원문은 냉장고 비용을 피하면서 낮은 온도와 긴 발효 시간을 활용하려는 접근을 설명합니다. 추정: 수온과 발효 조건을 일정하게 유지할 수 있다면 별도 냉각 설비 부담을 줄인 선택지가 될 수 있습니다.',kind:'원문 목표 + 추정',citationIndexes:[0]},
   {label:'결과',title:'향미 개선은 대조 실험이 있어야 판단',text:'보관 기록에서 이 처리만의 효과를 분리한 결과를 확인하지 못했습니다. 같은 글의 커핑 인상이나 이후 CoE 수상을 콜드퍼먼테이션의 효과로 연결하지 않습니다. 발효 온도·시간·체리 조건과 대조 로트의 커핑 결과가 다음 근거입니다.',kind:'결과 미확인',citationIndexes:[0]},
  ],citations:[{postId:april,anchor:'올해는 서늘한 미시기후와 얼음장 같이 찬 물',label:'냉각 방식과 현장 적용'}],limits:'실제 온도·발효 시간과 대조군 데이터가 없으며 농장마다 수온·품종·미생물 조건이 다릅니다.'},
 {id:'busanze-trials',category:'processing',title:'부산제의 내추럴·무산소·이중 발효 계획',place:'르완다 · 부산제 워싱스테이션',status:'시험 계획 · 후속 결과 미확인',lead:'한 가지 방식의 성공을 미리 정하기보다, 지역별 선별과 샘플링으로 최적의 프로세싱을 찾으려는 계획입니다.',
  stages:[
   {label:'계획',title:'세 가지 프로세싱을 비교하기로',text:'2025-01-12 원문은 부산제에서 내추럴·무산소 발효를 시작하고 케냐 전통 이중 발효도 시험하기로 했다고 적습니다. 계획 단계의 기록이며 완료된 적용으로 표시하지 않습니다.',kind:'원문에서 정리',citationIndexes:[0]},
   {label:'기대',title:'지역별 선별 + 샘플링 + 피드백',text:'원문은 부가가치 향상, 체리 공급 지역별 선별과 지속적인 샘플링 지원을 목표로 합니다. 추정: 로트별 향미 차이가 재현되고 비용까지 맞는다면 판매 로트의 다양성과 차별화로 이어질 수 있습니다.',kind:'원문 목표 + 추정',citationIndexes:[0]},
   {label:'결과',title:'좋아질 것이라는 기대와 실제 결과 구분',text:'검토한 보관 기록에서 이 계획의 후속 커핑 결과를 확인하지 못했습니다. 다음에는 방식별 결점·향미·비용을 비교하고, CoE 출품 계획과 실제 출품·수상 결과도 따로 확인해야 합니다.',kind:'결과 미확인',citationIndexes:[0]},
  ],citations:[{postId:'legacy-223',anchor:'올해부터 부가가치를 높이기 위해 내추럴과 무산소 발효를 시작하기로 했다.',label:'부산제의 시험 계획과 샘플링'}],limits:'부산제에서 케냐 방식을 시험한다는 계획을 케냐 산지의 실제 결과와 합치지 않습니다. 내추럴·무산소 명칭만으로 향미·품질 개선을 예측할 수 없습니다.'},
 {id:'dna-varieties',category:'research',title:'유전자 지문이 품종의 계통을 다시 쓰다',place:'품종 연구 · WCR',status:'공식 자료 대조',lead:'SL34·SL14의 계통과 인도 품종의 분류처럼, 이름과 역사에 DNA 근거를 더하면 설명이 달라질 수 있습니다.',
  stages:[
   {label:'언급',title:'역사 자료에 유전자 지문을 더하기',text:'2026-07-10 원문은 WCR 품종 카탈로그와 유전자 지문 연구를 소개합니다. SL34·SL14를 티피카 유전적 그룹으로, Coorg·Kent를 부르봉 그룹으로 설명합니다.',kind:'원문에서 정리',citationIndexes:[0]},
   {label:'분석',title:'품종명과 유전적 그룹은 같은 말이 아니다',text:'WCR 공식 자료에서도 이 계통 재분류를 확인했습니다. 같은 유전적 그룹에 속해도 동일 품종이라는 뜻은 아닙니다. 원문에서 언급한 논문 자체의 제목·DOI는 확정하지 않았습니다.',kind:'연구와 해석 구분',citationIndexes:[0]},
   {label:'전망',title:'다음 변화는 로트 설명의 정확성',text:'추정: DNA 근거가 축적되면 품종 이력과 묘목·로트 설명을 더 정확하게 수정할 수 있습니다. 유전적 계통이 확인되어도 향미·재배 적응성·커핑 점수가 자동으로 정해지는 것은 아닙니다.',kind:'원문 목표 + 추정',citationIndexes:[0]},
  ],citations:[{postId:'instagram-DamfOA2J38c',anchor:'유전자 지문 검사 결과, 이전에 부르봉 계열로 여겨졌던 SL 34 및 SL 14',label:'품종 계통 재분류 언급'}],limits:'기관의 공식 설명과 게시물의 해석을 대조한 카드입니다. 개별 농장 로트의 품종 인증이나 원문이 언급한 특정 논문의 완전한 검증을 대신하지 않습니다.',researchSources:[{label:'WCR · Varieties catalog goes global (2018)',url:'https://worldcoffeeresearch.org/news/2018/varieties-catalog-goes-global',checkedAt:'2026-10-04',scope:'공식 자료 · 계통 재분류 대조',finding:'WCR는 DNA 자료로 SL34·SL14의 티피카 그룹, Coorg·Kent의 부르봉 그룹 분류를 설명합니다. 유전적 그룹과 개별 품종을 구분합니다.'}]},
 {id:'cell-coffee',category:'research',title:'세포배양 커피, 풍미 재현은 어디까지 왔나',place:'연구 동향 · ZHAW·VTT',status:'인터뷰 언급 + 관련 연구 초록',lead:'시장 출시 목표보다 먼저 볼 것은 원두 구조, 로스팅 향과 음료의 감각적 차이입니다.',
  stages:[
   {label:'언급',title:'연구 인터뷰를 AI로 요약한 게시물',text:'2026-05-04 원문은 차한 예레치안 교수의 인터뷰를 AI가 요약한 내용을 소개합니다. 구조 재현과 풍미 강도·로스팅을 과제로 다루며, 시장 출시 시점은 당시 목표로 제시합니다.',kind:'원문에서 정리',citationIndexes:[0]},
   {label:'분석',title:'원료 성분 → 로스팅 향 → 음료 감각',text:'별도로 확인한 2024년 관련 논문의 기관 초록은 이 세 단계로 재배 커피와 세포배양 커피를 비교합니다. 성분과 향의 차이를 보고하며, 이를 대안 커피 개선을 위한 평가 틀로 제시합니다.',kind:'연구와 해석 구분',citationIndexes:[0]},
   {label:'전망',title:'가능성과 달성된 성능을 나눠 보기',text:'추정: 원료 조성과 로스팅·구조 재현을 개선하면 별도의 커피 제품군으로 발전할 여지가 있습니다. 인터뷰의 2027년 말 출시 목표를 확정 일정으로 표시하지 않으며 스페셜티 커피와 동등한 품질에 도달했다는 결과도 확인되지 않았습니다.',kind:'원문 목표 + 추정',citationIndexes:[0]},
  ],citations:[{postId:'instagram-DX5lr4TiU9i',anchor:'Ai가 요약한 인터뷰 내용을 정리해 보자면',label:'AI 요약임을 밝힌 인터뷰 언급'}],limits:'게시물은 인터뷰의 2차 AI 요약입니다. 관련 논문은 별도로 확인한 2024년 연구이며 동일 인터뷰의 근거 논문으로 확정하지 않습니다. 초록 확인 범위에서만 연구 결과를 정리했습니다.',researchSources:[{label:'Khushvakov et al. · ACS Food Science & Technology (2024)',url:'https://doi.org/10.1021/acsfoodscitech.4c00238',checkedAt:'2026-10-04',scope:'관련 연구 · VTT 기관 초록 확인',finding:'원료 전구체, 로스팅 향, 음료의 감각적 평가를 잇는 분석 틀을 제안합니다. 세포배양 커피와 재배 커피의 성분·향 차이를 보고한 연구입니다.'},{label:'VTT · 논문 초록과 서지',url:'https://cris.vtt.fi/en/publications/analytical-platform-to-determine-similarities-and-dissimilarities/',checkedAt:'2026-10-04',scope:'관련 연구 · 기관 기록',finding:'논문 서지와 초록을 확인한 경로입니다. 인터뷰의 출시 목표를 검증한 자료는 아닙니다.'}]},
 {id:'pour-over-avalanche',category:'research',title:'드립의 눈사태 효과, 주입 높이만의 문제일까',place:'추출 연구 · Physics of Fluids',status:'관련 논문 본문 대조',lead:'게시자의 낮고 굵은 물줄기 해석과 논문이 측정한 교반·TDS를 구분해서 읽습니다.',
  stages:[
   {label:'언급',title:'와류를 활용한 드립 해석',text:'2025-04-10 원문은 눈사태 효과와 충분한 와류를 언급하며 낮고 굵은 물줄기를 선호하는 주법을 설명합니다. 이 레시피는 게시자의 적용 방식입니다.',kind:'원문에서 정리',citationIndexes:[0]},
   {label:'분석',title:'논문은 높이·유량·입자 혼합을 함께 본다',text:'2025년 관련 논문은 입자 모형으로 혼합을 관찰하고 실제 커피에서 TDS를 측정합니다. 주입 높이와 물줄기 조건에 따라 혼합·침식이 달라지며, 원문 게시자의 빠른 추출 레시피를 보편적 최적값으로 증명한 연구는 아닙니다.',kind:'연구와 해석 구분',citationIndexes:[0]},
   {label:'적용',title:'추출 수치와 맛을 함께 비교하기',text:'추정: 같은 원두·분쇄·물 조건에서 주입 높이와 유량을 달리해 TDS·수율·감각적 결과를 비교하면 자신의 추출에 적용할 조건을 찾을 수 있습니다. 추출 효율 상승만으로 더 맛있다고 결론 내리지 않습니다.',kind:'원문 목표 + 추정',citationIndexes:[0]},
  ],citations:[{postId:'legacy-247',anchor:'높이 붓는 것보다 더 중요한 것은 논문에서 눈사태 효과',label:'눈사태 효과와 게시자의 드립 해석'}],limits:'게시물에 논문 제목·DOI가 없어 내용과 시기가 일치하는 관련 논문으로 연결했습니다. 측정한 TDS와 감각적 선호, 실험 장치와 실제 드립 환경을 구분해야 합니다.',researchSources:[{label:'Park, Young & Mathijssen · Physics of Fluids (2025)',url:'https://doi.org/10.1063/5.0257924',checkedAt:'2026-10-04',scope:'관련 논문 · 연구자 제공 본문 확인',finding:'물줄기와 입자층의 상호작용·눈사태 혼합을 관찰하고 실제 커피의 TDS를 측정했습니다. 높이와 유량에 따른 혼합 조건이 추출에 영향을 줄 수 있음을 다룹니다.'}]},
];

function resolveCitation(spec:CitationSpec,posts:Post[],today:string):InsightCitation|undefined{
 const post=posts.find(p=>p.id===spec.postId&&!p.isMock&&p.date<=today&&p.caption.includes(spec.anchor));
 if(!post)return;
 const index=post.caption.indexOf(spec.anchor);
 const boundary=post.caption.lastIndexOf('\n\n',index);
 const start=Math.max(boundary<0?0:boundary+2,index-65,0);
 const next=post.caption.indexOf('\n\n',index);
 const end=Math.min(post.caption.length,next<0?post.caption.length:Math.max(next,index+spec.anchor.length+180),index+spec.anchor.length+360);
 return {...spec,date:post.date,quote:post.caption.slice(start,end),sourceUrl:post.sourceUrl};
}
// Reviewed editorial cards are shown only while all original anchors are present.
// Shared names or a later award never establish that two posts describe one trial.
export function buildInsightCards(posts:Post[],today:string):InsightCardData[]{
 return [...catalog,...additionalInsights].flatMap(spec=>{
  const citations=spec.citations.map(c=>resolveCitation(c,posts,today));
  if(citations.some(c=>!c))return [];
  const resolved=citations as InsightCitation[];
  return [{...spec,citations:resolved,date:resolved.map(c=>c.date).sort().at(-1)!}];
 }).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
