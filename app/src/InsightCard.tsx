import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import type { InsightCardData } from './data/insights';

export default function InsightCard({card,onOpenPost}:{card:InsightCardData;onOpenPost:(id:string)=>void}){
 const [step,setStep]=useState(0);
 const stage=card.stages[step];
 const labels=[...card.stages.map(s=>s.label),'근거'];
 return <article className={`card insight-card insight-${card.category}`} aria-label={card.title}>
  <div className="event-meta"><span className="badge original">{card.status}</span><span>최근 근거 {card.date}</span></div>
  <span className="eyebrow">{card.place}</span><h2>{card.title}</h2><p className="insight-lead">{card.lead}</p>
  <nav className="insight-steps" aria-label={`${card.title} 카드 순서`}>{labels.map((label,i)=><button key={i} aria-pressed={step===i} onClick={()=>setStep(i)}><span>0{i+1}</span>{label}</button>)}</nav>
  <section className="insight-stage" aria-label={`${labels[step]} 카드`} aria-live="polite">
   {stage?<><span className={`badge ${(stage.kind==='원문 목표 + 추정'||stage.kind==='해석 · 추정')?'ai':'original'}`}>{stage.kind}</span><h3>{stage.title}</h3><p>{stage.text}</p>{stage.citationIndexes.map(i=>{const e=card.citations[i];return <div className="insight-quote" key={i}><span className="eyebrow">원문 근거 · {e.date}</span><blockquote>{e.quote.slice(0,200)}{e.quote.length>200?'…':''}</blockquote><button className="text-link" onClick={()=>onOpenPost(e.postId)}>원문 전체 읽기 <ArrowUpRight size={13}/></button></div>})}</>:<><span className="badge original">출처 · 판단의 범위</span><h3>이 카드를 뒷받침하는 자료</h3><p>{card.limits}</p>{card.citations.map((e,i)=><div className="event-source" key={i}><span className="eyebrow">{e.label} · 게시일 {e.date}</span><blockquote>{e.quote}</blockquote><div className="issue-actions"><button className="text-link" onClick={()=>onOpenPost(e.postId)}>보관 원문 <ArrowUpRight size={13}/></button>{e.sourceUrl&&<a className="text-link" href={e.sourceUrl} target="_blank" rel="noreferrer">Instagram 출처 <ExternalLink size={13}/></a>}</div></div>)}{card.researchSources?.map(source=><div className="research-source" key={source.url}><span className="badge external">{source.scope}</span><h4><a href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={13}/></a></h4><p>{source.finding}</p><small>자료 확인 {source.checkedAt} · 게시물의 게시일과 별도</small></div>)}</>}
  </section>
  <footer className="insight-navigation"><button className="soft-button" disabled={step===0} onClick={()=>setStep(n=>n-1)} aria-label={`${card.title} 이전 카드`}><ArrowLeft size={14}/> 이전</button><span>{step+1} / {labels.length}</span><button className="soft-button" disabled={step===labels.length-1} onClick={()=>setStep(n=>n+1)} aria-label={`${card.title} 다음 카드`}>다음 <ArrowRight size={14}/></button></footer>
 </article>;
}
