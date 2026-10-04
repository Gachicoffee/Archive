import type { Post } from './types';

export interface EventEvidence {postId:string;date:string;quote:string;qualification?:string;sourceUrl?:string;title:string}
export interface ArchiveEvent {id:string;title:string;kind:string;date:string;period:string;observation:string;chain:string[];inference:string;limits:string;followUp:string;evidence:EventEvidence[];recordCount:number}
interface EventRule {id:string;kind:string;title:(year:number)=>string;context:RegExp;signal:RegExp;observation:string;chain:string[];inference:(year:number)=>string;limits:string;followUp:string}

// These are explicit interpretation templates, not model-generated forecasts.
// Both the place and event must appear in the same original paragraph.
const rules:EventRule[]=[
 {id:'brazil-frost',kind:'기후 · 시장',title:y=>`${y} 브라질 냉해와 가격 변동성`,context:/브라질|\bBrazil\b/i,signal:/냉해|(?<![가-힣])서리|\bfrost\b/i,
  observation:'원문에서 브라질 냉해와 작황·가격 전망을 함께 살펴볼 단서를 찾았습니다.',chain:['냉해 신호','작황·공급 확인','계약 가격 압력'],
  inference:y=>`냉해가 나무와 다음 수확에 영향을 주고 공급이 줄어든다면 ${y+1}년 생두 계약 가격에 상승 압력이 이어질 수 있습니다. 가격 인상 여부나 가능성이 높다는 판단까지 확인된 것은 아닙니다.`,
  limits:'피해 범위·수확 시점·재고·수요·환율에 따라 결과가 달라집니다. 원문에 서로 다른 전망과 불확실성이 있으면 그것도 함께 읽어야 합니다. 뒤의 연도에 가격이 올랐더라도 냉해만을 원인으로 단정할 수 없습니다.',followUp:'후속 작황 보고, 실제 수출·재고와 계약 가격을 확인하면 연결을 검증할 수 있습니다.'},
 {id:'nicaragua-harvest',kind:'수확 · 공급',title:y=>`${y} 니카라과 흉작과 입고 물량`,context:/니카라과|\bNicaragua\b/i,signal:/흉작|수확량.{0,45}(?:저조|감소|줄)|(?:감소|줄).{0,20}수확량/i,
  observation:'니카라과의 흉작 또는 수확량 감소가 보관 원문에 등장합니다.',chain:['수확량 감소','판매 가능 물량','입고·배분 확인'],
  inference:()=> '수확 감소가 판매 가능 물량에 반영되면 특정 로트의 확보와 한국 입고 일정에 영향을 줄 수 있습니다. 전체 국가의 가격 인상이나 모든 농장의 피해로 확대하지 않습니다.',
  limits:'농장·품종·계약별로 차이가 있으며, 다음 시즌 회복 가능성과 실제 확보 물량을 함께 확인해야 합니다.',followUp:'원문에 나온 농장의 다음 수확 일정, 공급 가능 로트와 한국 입고 물량을 이어서 확인하세요.'},
 {id:'narino-drought',kind:'기후 · 다음 수확',title:y=>`${y} 나리뇨 가뭄과 다음 수확`,context:/나리뇨|Nariño|Narino/i,signal:/가뭄|drought/i,
  observation:'나리뇨의 가뭄이 보관 원문에 등장합니다.',chain:['고온·건조','개화·수분 영향','다음 수확 확인'],
  inference:y=>`건조한 상태가 지속되어 개화와 수분에 문제가 생기면 ${y+1}년 수확에 영향을 줄 수 있습니다. 관찰된 지역의 신호를 콜롬비아 전체 작황으로 확대하지 않습니다.`,
  limits:'이후 강우와 지역·고도별 차이에 따라 결과가 달라집니다. 건조가 파치먼트 관리에 주는 이점과 재배에 주는 위험도 구분해야 합니다.',followUp:'후속 강우, 개화 상태와 해당 지역의 수확 기록을 확인하세요.'},
 {id:'finca-libre-coe',kind:'대회 · 품질',title:y=>`${y} 핀카 리브레 CoE 기록`,context:/핀카\s*리브레|Finca\s*Libre/i,signal:/(?:CoE|컵오브엑셀런스|Cup of Excellence).{0,160}(?:\d+위|수상)|(?:\d+위|수상).{0,160}(?:CoE|컵오브엑셀런스)/i,
  observation:'핀카 리브레의 CoE 출품·수상 관련 기록을 찾았습니다. 정확한 품종·프로세싱·순위는 아래 원문에서 확인할 수 있습니다.',chain:['대회 기록','해당 로트 관심','실제 물량·평가 확인'],
  inference:()=> '수상 로트의 관심과 구매 문의가 늘어날 수 있습니다. 대회 결과만으로 농장 전체의 품질 개선이나 가격 인상을 단정하지 않습니다.',
  limits:'수상은 해당 대회·로트의 기록입니다. 다른 로트의 향미와 품질, 경매 결과·현재 재고는 별도 확인이 필요합니다.',followUp:'수상 로트의 경매·입고 기록과 품종·프로세싱별 커핑 결과를 이어서 확인하세요.'},
];

function evidenceFor(post:Post,rule:EventRule):EventEvidence|undefined {
 for(const paragraph of post.caption.split(/\n\s*\n/)){
  const context=rule.context.exec(paragraph),signal=rule.signal.exec(paragraph);
  if(!context||!signal)continue;
  // Return an exact original span containing the event; never use old summaries.
  const start=Math.max(0,Math.min(context.index,signal.index)-45);
  const end=Math.min(paragraph.length,Math.max(context.index+context[0].length,signal.index+signal[0].length)+300);
  const qualification=post.caption.split(/\n\s*\n/).filter(part=>rule.context.test(part)).flatMap(part=>part.match(/[^.!?\n]{0,160}(?:평년작|회복|미미하다는|별 영향)[^.!?\n]{0,180}/g)||[])[0];
  return {postId:post.id,date:post.date,quote:paragraph.slice(start,end),qualification,sourceUrl:post.sourceUrl,title:post.title};
 }
}

export function detectArchiveEvents(posts:Post[],today:string):ArchiveEvent[]{
 return rules.flatMap(rule=>{
  const hits=posts.filter(p=>!p.isMock&&p.date<=today).flatMap(post=>{const evidence=evidenceFor(post,rule);return evidence?[evidence]:[]}).sort((a,b)=>b.date.localeCompare(a.date)||a.postId.localeCompare(b.postId));
  if(!hits.length)return [];
  const year=Number(hits[0].date.slice(0,4));
  const season=hits.filter(e=>e.date.startsWith(String(year)));
  return [{id:`${rule.id}-${year}`,kind:rule.kind,title:rule.title(year),date:hits[0].date,period:String(year),observation:rule.observation,chain:rule.chain,inference:rule.inference(year),limits:rule.limits,followUp:rule.followUp,evidence:season.slice(0,3),recordCount:season.length}];
 }).sort((a,b)=>b.date.localeCompare(a.date));
}
