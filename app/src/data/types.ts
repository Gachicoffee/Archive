export type EvidenceKind = 'original' | 'ai' | 'external';
export interface Post { id:string; date:string; country:string; region:string; farmId:string; producerId:string; title:string; caption:string; summary:string; tags:string[]; sourceUrl?:string; imageUrl?:string; category?:string; isMock:boolean; }
export interface Entity { id:string; name:string; country:string; region:string; description:string; elevation?:string; }
export interface ExternalIssue { id:string; title:string; description:string; country:string; sourceLabel:string; sourceUrl:string; checkedAt:string|null; isMock:boolean; }
export interface ArchiveSnapshot { posts:Post[]; farms:Entity[]; producers:Entity[]; issues:ExternalIssue[]; mode?:'demo'|'imported'; }
export interface ArchiveProvider { getSnapshot():Promise<ArchiveSnapshot>; search(query:string,posts:Post[]):Promise<SearchResult>; }
export interface SearchResult { posts:Post[]; related:string[]; mode:'local-keyword'|'hybrid'; }
export interface Collector { collect(cursor?:string):Promise<{ posts:Post[]; nextCursor?:string }>; }
export interface ImportAdapter { format:string; parse(content:string):Post[]; }
