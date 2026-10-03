export type EvidenceKind = 'original' | 'ai' | 'external';
export interface Post { id:string; topics?:string[]; topicEvidence?:Record<string,string>; classificationKind?:'inferred'; date:string; country:string; region:string; farmId:string; farmIds?:string[]; farmEvidence?:Record<string,string>; producerId:string; producerIds?:string[]; producerEvidence?:Record<string,string>; processingIds?:string[]; processingEvidence?:Record<string,string>; title:string; caption:string; summary:string; tags:string[]; sourceUrl?:string; imageUrl?:string; category?:string; isMock:boolean; summaryKind?:'ai'|'excerpt'; publishedAt?:string; author?:string; }
export interface Entity { id:string; name:string; country:string; region:string; description:string; elevation?:string; kind?:'farm'|'mill'; role?:string; aliases?:string[]; farmIds?:string[]; evidence?:{postId:string;date:string;sourceUrl:string;quote:string}[]; }
export interface ExternalIssue { id:string; title:string; description:string; country:string; sourceLabel:string; sourceUrl:string; checkedAt:string|null; isMock:boolean; }
export interface ArchiveSnapshot { posts:Post[]; farms:Entity[]; producers:Entity[]; issues:ExternalIssue[]; mode?:'demo'|'imported'; collection?:{checkedAt:string;schedule:string;backfillComplete:boolean;backfillAfter:string;lastAdded:number;method:string}; }
export interface ArchiveProvider { getSnapshot():Promise<ArchiveSnapshot>; search(query:string,posts:Post[]):Promise<SearchResult>; }
export interface SearchResult { posts:Post[]; related:string[]; mode:'local-keyword'|'hybrid'; }
export interface Collector { collect(cursor?:string):Promise<{ posts:Post[]; nextCursor?:string }>; }
export interface ImportAdapter { format:string; parse(content:string):Post[]; }
