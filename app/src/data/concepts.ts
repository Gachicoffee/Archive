// Facility names are a single search concept, separate from washed processing.
export interface SearchConcept {id:string;name:string;aliases:string[];pattern?:RegExp}
export const searchConcepts:SearchConcept[] = [
 {id:'washing-station',name:'워싱스테이션',aliases:['와싱스테이션','와싱 스테이션','워싱스테이션','워싱 스테이션','커피워싱스테이션','커피 워싱 스테이션','커피와싱스테이션','coffee washing station','washing station','washing-station']},
 {id:'frost',name:'서리 · 냉해',aliases:['서리','냉해','frost'],pattern:/냉해|(?<![가-힣])서리|\bfrost\b/i},
];
export const normalizeSearchText=(text:string)=>text.normalize('NFKC').toLowerCase().replace(/[\s\u200b-]+/g,'');
