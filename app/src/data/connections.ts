import type {ArchiveSnapshot,Post,Entity} from './types';
import catalog from './producer-catalog.json';
export const processingMethods=[
 {id:'washed',name:'워시드 / 수세식',aliases:['워시드','와시드','수세식','washed'],pattern:/워시드|와시드|수세식|(?<![a-z])(?:fully[ -]?)?washed(?![a-z])/i},
 {id:'natural',name:'내추럴 / 건식',aliases:['내추럴','네추럴','내츄럴','natural','건식'],pattern:/내추럴|네추럴|내츄럴|건식(?:가공| 가공)|(?<![a-z])natural(?![a-z])/i},
 {id:'honey',name:'허니',aliases:['허니','honey'],pattern:/허니|(?<![a-z])honey(?:[ -]?process)?(?![a-z])/i},
 {id:'anaerobic',name:'무산소 발효',aliases:['무산소','혐기','anaerobic','아나에어로빅'],pattern:/무산소|혐기|아나에어로빅|아나에로빅|(?<![a-z])anaerobic(?![a-z])/i},
 {id:'carbonic',name:'탄산침용 / 카보닉 마세레이션',aliases:['탄산침용','탄산 침용','카보닉','카보니크','carbonic maceration'],pattern:/탄산\s*침용|카[르]?보[닉니]크?\s*마[세쎄]레이션|카보닉|carbonic\s*maceration/i},
 {id:'pulped-natural',name:'펄프드 내추럴',aliases:['펄프드 내추럴','펄프드내추럴','pulped natural'],pattern:/펄프[드트]\s*내추럴|pulped[ -]?natural/i},
 {id:'wet-hulled',name:'웻 헐 / 길링 바사',aliases:['웻 헐','웻헐','wet hulled','길링바사','giling basah'],pattern:/웻\s*헐|길링\s*바사|wet[ -]?hull(?:ed|ing)?|giling\s*basah/i},
 {id:'yeast',name:'효모 접종 발효',aliases:['효모','yeast','이스트'],pattern:/효모|(?<![a-z])yeast(?![a-z])|이스트\s*(?:발효|접종)/i},
 {id:'double',name:'이중 / 다단계 발효',aliases:['이중발효','이중 발효','더블 발효','double fermentation'],pattern:/이중\s*발효|더블\s*발효|다단계\s*발효|double\s*fermentation/i},
 {id:'thermal',name:'열충격 / 온도 제어 가공',aliases:['열충격','열 충격','thermal shock','써멀 쇼크'],pattern:/열\s*충격|thermal\s*shock|써멀\s*쇼크/i},
 {id:'osmotic',name:'삼투압 가공',aliases:['삼투압','osmotic'],pattern:/삼투압|(?<![a-z])osmotic(?![a-z])/i},
 {id:'coferment',name:'코퍼먼테이션 / 첨가 발효',aliases:['코퍼먼테이션','co-fermentation','cofermentation','첨가 발효'],pattern:/코\s*퍼먼테이션|co[ -]?fermentation|첨가\s*발효|과일.{0,12}(첨가|넣.{0,4}발효)/i},
];
export const methodLabel=(id:string)=>processingMethods.find(m=>m.id===id)?.name||id;
export const hasProducer=(post:Post,id:string)=>post.producerIds?.includes(id)??post.producerId===id;
const quote=(text:string,start:number,length:number)=>text.slice(Math.max(0,start-70),start+length+170).trim();
export function indexConnections(snapshot:ArchiveSnapshot):ArchiveSnapshot{
 const posts=snapshot.posts.map(post=>{
  const text=post.caption;const processingEvidence:Record<string,string>={};const producerEvidence:Record<string,string>={};
  const coffeeContext=/커피|농장|생두|가공|발효|coffee|finca|estate/i.test(text);
  for(const method of processingMethods){const hit=method.pattern.exec(text);if(!hit||!coffeeContext)continue;processingEvidence[method.id]=quote(text,hit.index,hit[0].length)}
  // A processing mention never asserts that a named farm or producer used it.
  for(const producer of catalog.producers){
   const hits=producer.aliases.flatMap(alias=>[...text.matchAll(new RegExp(String.raw`(?<![가-힣A-Za-z])${alias.replaceAll('.', '[.]')}(?=$|[\s.,!?/()#]|[은는이가을를와과의에])`,'gi'))]).sort((a,b)=>a.index!-b.index!);
   for(const hit of hits){const nearby=text.slice(Math.max(0,hit.index!-90),hit.index!+hit[0].length+90);
    if(producer.contextAliases.length&&!producer.contextAliases.some(a=>text.toLowerCase().includes(a.toLowerCase()))&&!producer.evidence.some(e=>e.postId===post.id))continue;
    if(producer.id==='producer-samuel'&&/사무엘\s*데겔로|Samuel\s*Degelo/i.test(text))continue;
    const roleContext=/농장주|생산자|커피|농장|finca|estate|차크라|파트너/i.test(nearby);
    if(producer.id==='producer-raul-santa-rosa'&&!/산타\s*로사|santa\s*rosa|fincasantarosa/i.test(text))continue;
    if(producer.id==='producer-diego-paraiso'&&!/엘\s*파라이소|el\s*paraiso|농장주\s*디에고/i.test(text))continue;
    if(!roleContext&&!producer.evidence.some(e=>e.postId===post.id))continue;
    producerEvidence[producer.id]=quote(text,hit.index!,hit[0].length);break;
   }
  }
  const ids=Object.keys(producerEvidence);
  return {...post,processingIds:Object.keys(processingEvidence),processingEvidence,producerIds:ids.length?ids:(post.producerId?[post.producerId]:[]),producerId:ids[0]||post.producerId,producerEvidence};
 });
 if(snapshot.mode==='demo')return {...snapshot,posts};
 const producers:Entity[]=catalog.producers.filter(p=>posts.some(post=>hasProducer(post,p.id))).map(p=>{
  const source=posts.find(post=>post.id===p.evidence[0].postId);const linked=source?.farmIds||[];const country=source?.country!=='국가 미분류'?source?.country:linked.length===1?snapshot.farms.find(f=>f.id===linked[0])?.country:undefined;
  return {id:p.id,name:p.name,role:p.role,aliases:p.aliases,country:('originCountry' in p?p.originCountry:undefined)||country||'국가 미확인',region:'원문에서 이름과 역할 확인',description:p.role+' · 원문에 등장한 이름으로 관련 기록을 연결합니다. 동명이인과 관계는 근거를 확인하세요.',evidence:p.evidence,};
 });
 return {...snapshot,posts,producers};
}