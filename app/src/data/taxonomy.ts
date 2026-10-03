import type { ArchiveSnapshot, Post } from './types';
export const taxonomy = [
 ['산지와 생산','farm','농장 이야기',/농장|estate|finca|plantation/i],
 ['산지와 생산','producer','생산자와 공동체',/생산자|농부|농민|조합|협동|노동자|producer|farmer/i],
 ['산지와 생산','harvest','재배와 수확',/수확|재배|개화|전정|비료|토양|묘목|harvest/i],
 ['산지와 생산','climate','기후와 생태',/기후|가뭄|강우|우기|건기|녹병|병충해|온난화|산림|생태|biodiversity/i],
 ['커피 지식','variety','품종과 유전',/품종|유전|게이샤|게샤|버번|부르봉|카투라|카티모르|bourbon|geisha|gesha|caturra/i],
 ['커피 지식','process','가공과 발효',/가공|발효|워시드|내추럴|건조|무산소|혐기|washed|ferment|anaerobic/i],
 ['커피 지식','roast','로스팅',/로스팅|로스터|배전|roast/i],
 ['커피 지식','brew','추출과 장비',/추출|에스프레소|드립|그라인더|분쇄|브루잉|커피머신|espresso|brewing/i],
 ['커피 지식','sensory','향미와 커핑',/커핑|향미|컵노트|테이스팅|산미|단맛|cupping|tasting/i],
 ['커피 지식','research','논문과 연구',/논문|학술|연구팀|연구진|연구결과|연구 결과|실험 결과|실험결과|journal|doi\.org|research paper|scientific study/i],
 ['커피 지식','philosophy','커피 철학과 관점',/스페셜티.{0,20}(의미|정의|본질)|커피.{0,15}(철학|가치|본질|생각|믿|의미)|지속가능|지속 가능|공정무역|직거래|다이렉트 트레이드/i],
 ['커피 지식','education','정보와 교육',/커피.{0,12}(정보|공부|교육|지식)|강의|강좌|세미나|워크숍|커피 수업|커피수업/i],
 ['커피 산업','market','시장과 가격',/커피.{0,12}가격|생두.{0,12}가격|국제시세|국제 시세|생산비|경매|옥션|수출|수입|물류|운임/i],
 ['커피 산업','libre','리브레 운영과 소식',/(?:커피\s*리브레|리브레).{0,20}(매장|오픈|출시|영업|직원|출판|출간|신간|행사|휴무)/i],
 ['커피 산업','event','대회와 행사',/커피.{0,12}(대회|행사|박람회|페스티벌)|챔피언|바리스타 대회|컵오브엑셀런스|cup of excellence/i],
 ['방문과 여행','cafe','카페 투어',/카페|커피숍|커피샵|커피하우스|café|\bcafe\b|coffee shop/i],
 ['방문과 여행','origin-trip','산지 출장',/산지.{0,12}(방문|여행|출장)|농장.{0,12}(방문|도착|찾아)|출장|origin trip/i],
 ['방문과 여행','travel','여행과 장소',/여행|공항|비행기|호텔|기차|박물관|미술관|여정/i],
 ['일상과 개인','animal','동물 이야기',/고양이|강아지|반려|길냥|멍멍|야옹|코끼리|원숭이|새끼|탐지견|사냥개|진돗개|짖|고슴도치|말을 타|동물|\bdog\b|\bcat\b/i],
 ['일상과 개인','people','사람과 관계',/(?<!동물 )친구|가족|아버지|어머니|아내|부모|딸(?:이|과|을|은|의|에게)|아들(?:이|과|을|은|의|에게)|동료|선배|후배|생일|결혼/i],
 ['일상과 개인','food','음식과 식사',/식사|맛집|점심|저녁|아침밥|국밥|(?:먹는|먹은|끓인|맛있는|한 그릇|신라면|진라면|짜장)\s*라면|맥주|와인|식당|요리/i],
 ['일상과 개인','daily','일상과 취미',/일상(?!적)|산책|등산|자전거|(?<!사회)운동|독서|음악|영화|휴일|주말|취미/i],
 ['문화와 생각','book','책과 읽기',/책을|책이|책의|읽었|읽고|서적|저자|출판|독서|번역/i],
 ['문화와 생각','culture','예술과 문화',/문화|예술|공연|전시|음악|영화|사진전|성당|축일|행렬|역사|미술/i],
 ['문화와 생각','reflection','개인적인 생각',/생각한다|생각합니다|깨달|돌아보|느꼈|느낀|기억|회고/i],
 ['검토 대기','review','주제 확인 필요',null],
] as const;
export type TopicId = typeof taxonomy[number][1];
export const topicLabel=(id:string)=>taxonomy.find(t=>t[1]===id)?.[2]||id;
export const topicGroup=(id:string)=>taxonomy.find(t=>t[1]===id)?.[0]||'검토 대기';
// Inferred multi-label topics use the preserved caption only, never old category or summary.
export function classifyPost(post:Post):Post {
 const matches=taxonomy.flatMap(([,id,,pattern])=>{const hit=pattern?.exec(post.caption);
 if(id==='cafe'&&!/찾아|방문|투어|다녀|들렀|마셨|마시|카페에서|카페에|커피숍에서/.test(post.caption))return [];
 if(id==='origin-trip'&&!/산지|농장|finca|estate/i.test(post.caption))return [];
 if(id==='food'&&hit&&/와인|맥주/.test(hit[0])&&!/마셨|마시|먹|식사|식당|맛집|한잔|한 잔|저녁|점심/.test(post.caption))return [];
 return hit?[{id,evidence:post.caption.slice(Math.max(0,hit.index-35),hit.index+hit[0].length+65)}]:[]});
 if(post.farmIds?.length&&!matches.some(m=>m.id==='farm')){const quote=Object.values(post.farmEvidence||{})[0];if(quote)matches.push({id:'farm',evidence:quote})}
 if(!matches.length) matches.push({id:'review',evidence:''});
 return {...post,topics:matches.map(m=>m.id),topicEvidence:Object.fromEntries(matches.map(m=>[m.id,m.evidence])),classificationKind:'inferred'};
}
export function classifyArchive(data:ArchiveSnapshot):ArchiveSnapshot {return {...data,posts:data.posts.map(classifyPost)}}
export type RecordSort='recent'|'oldest'|'title'|'connections'|'relevance';
export interface RecordFilter {processing?:string;producer?:string;country:string;group:string;topic:string;recordYear:string;untilYear:number;sort:RecordSort}
export function selectRecords(posts:Post[],filter:RecordFilter):Post[]{
 const selected=posts.filter(p=>(!filter.processing||filter.processing==='All'||p.processingIds?.includes(filter.processing))&&(!filter.producer||filter.producer==='All'||(p.producerIds||[p.producerId]).includes(filter.producer))&&(filter.country==='All'||p.country===filter.country)&&(filter.topic==='All'||p.topics?.includes(filter.topic))&&(filter.group==='All'||p.topics?.some(t=>topicGroup(t)===filter.group))&&(filter.recordYear==='All'||p.date.startsWith(filter.recordYear))&&Number(p.date.slice(0,4))<=filter.untilYear);
 if(filter.sort==='relevance')return selected;
 return selected.sort((a,b)=>filter.sort==='oldest'?a.date.localeCompare(b.date)||a.id.localeCompare(b.id):filter.sort==='title'?a.title.localeCompare(b.title,'ko')||b.date.localeCompare(a.date):filter.sort==='connections'?(b.farmIds?.length||0)-(a.farmIds?.length||0)||b.date.localeCompare(a.date):b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
