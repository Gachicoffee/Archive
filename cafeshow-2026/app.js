'use strict';
const $=id=>document.getElementById(id);
const SHEET='https://docs.google.com/spreadsheets/d/1k2p3E9k6aNp3Zin-Zr7HOYkKXoKEEIcuhxapFbPHEmU/edit';
const DOC='https://docs.google.com/document/d/1D9_7HJE2Vo-kwqS1CMeVwrQWtoxLXoTZqOw6daLJ4oU/edit';
const views={today:['함께 준비하는 오늘','지금 무엇부터 할까요?'],plan:['기획의 기준과 남은 선택','손님이 경험할 커피 한상'],tasks:['선행 작업과 담당자','전체 준비 일정'],decisions:['다음 작업을 여는 결정','대표 결정사항'],orders:['실물 준비와 입고 확인','발주·구매']};
let data=null,active='today';
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shortDate=s=>s?s.slice(5).replace('-','/'):'미정';
const day=s=>Date.parse(s+'T00:00:00+09:00');
const complete=s=>['완료','제출 완료','발주 완료','검수 완료'].includes(s);
const alerts=[
 ['제작물 도착 기한이 서로 다릅니다.','촬영 전 도착 10/17, 발주 시트 10/22, 문서 개요 10/30이 함께 적혀 있습니다. 촬영용 실물과 사진 포함 제작물을 나눠 기준일을 정해야 합니다.','일정 충돌','제작·촬영 마감 충돌을 대조하고 촬영 전 필요한 실물과 촬영 후 제작할 품목별 기준일을 정리해주세요. 업체 리드타임은 확인값만 사용하고 임의로 날짜를 확정하지 마세요.'],
 ['기획 톤과 목표를 다시 맞춰야 합니다.','기획서에서 폐기한 자기 비하·오일장 톤이 준비 문서에 다시 나타납니다. 목표 순서도 소매/B2B가 서로 다릅니다. 변경 결정이 있었는지 확인하세요.','기획 확인','기획서의 정갈한 남도 한상 톤과 현재 준비 문서의 장터·여수 촌놈 표현, 소매/B2B 목표 우선순위 차이를 비교해서 제가 결정할 질문을 최대 세 개로 정리해주세요.'],
 ['결정은 있는데, 시트에는 빈칸입니다.','준비 문서에는 원두·리필·소반과 착석 관련 결정이 있지만 대표 결정사항 시트는 비어 있습니다. 대기 표기 전체를 미완료로 보면 잘못 재촉할 수 있습니다.','상태 확인','대표 결정사항을 준비 문서와 대조해 이미 확정된 내용, 아직 미정인 내용, 기록만 누락된 내용을 구분해주세요. 수정 전 현재 원본을 다시 확인해주세요.'],
 ['시작·마감과 신청 증빙을 확인하세요.','작업 12는 시작 10/7·마감 10/6으로 역전돼 있습니다. 급배수 신청 완료와 안전 서약서 제출 필요도 구분해야 합니다.','자료 검토','작업 12의 시작·마감 역전, 하빈 비근무일의 공동 회의, 주최측 제출 마감과 급배수 신청·납부·서약서 증빙을 확인할 목록을 정리해주세요.']
];
const flow=[
 ['멈추고 바라보기','덮은 소반과 차려 낸 상의 집계로 시선을 붙잡습니다. 집계 방식은 확정 필요.','기획'],
 ['상보 걷기','관람객이 상보를 직접 걷는 순간. 사진과 릴스의 핵심 장면입니다.','채택'],
 ['네 가지 커피 맛보기','준비 문서 구성: 코스모스 → 허브 → 구수 라떼 → 보통. 기획서의 구성·순서와 차이가 있어 확인 필요.','자료 대조'],
 ['마음에 든 커피 리필','준비 문서 기준 블렌드 네 가지 중 1회. 맛에 대한 대화로 취향을 찾습니다.','문서 결정'],
 ['구매와 후배송','드립백은 현장 구매, 원두는 현장 결제 후 여수에서 배송. 가격·배송비·발송 약속은 최종 확인 필요.','조건 확인'],
 ['덤과 배웅','차림표·쿠폰·브랜드 안내를 가지고 떠납니다. 기획서의 구매자 덤과 문서의 팔로우 굿즈 조건은 구분해 결정합니다.','조건 확인']
];
const roadmap=[['~10/7','시트 기준: 대표 결정과 게이트1 회의. 기획서의 프로그램 확정 기한은 10/9이므로 합의 필요.'],['10/8–17','디자인 사양·시안·피드백·소품 구매. 촬영 전 실물 확보 일정 대조.'],['10/18–24','준비 문서 기준 외부 촬영. 정확한 촬영일·사진 전달일 확인.'],['10/24–30','시트의 리허설과 10/25 완료 판정, 문서의 사진 포함 디자인 10/25–30을 대조.'],['10/27–31','기획서 기록: 부대시설 특별접수, 10/28 부스 추가 옵션 마감. 최신 주최측 안내 확인.'],['11/2–8','생산·패킹·근무표·결제 점검. 시트 생산 11/6까지, 기획서 생산·리허설 11/3–7.'],['11/10','기획서 기준 반입 12–20시, 차량 하역 16시 전. 운송과 설치 담당 확정.'],['11/11–14','행사 운영, 일일 재고·결제·배송 주문·B2B 리드 기록.'],['행사 이후','원두 발송·납품 상담 후속 대응·쿠폰 사용 집계. 문서의 11/20 발송과 수령 안내 문구 대조.']];
const ideas=['마지막은 숭늉','밥공기 뚜껑','백반 0원 메뉴판','원산지 표시판','수저 봉투 차림표','매일 다른 오늘의 상','겸상','생산자 이름 차림표','주인장 장보기','맛집 벽','상 물림 인사','역할 나누기','종지 잔','호출벨','커피콩 초콜릿','밑반찬 세트·보자기','반찬 배달','단골 장부','늦가을 한상·원두 김장'];
function assistance(t){
 const title=t.title;
 if(/플로우|시뮬레이션|리허설/.test(title))return '관람객 경험과 스태프 동작을 연결하고, 리허설에서 측정할 시간·회전율·문제점을 정리해드릴게요.';
 if(/예산|소요량|생산 계획/.test(title))return '주신 수치로 계산표를 만들고, 부족한 자료를 추려드릴게요. 수치는 임의로 넣지 않습니다.';
 if(/원고|대본|SNS|B2B/.test(title))return '기획 톤에 맞는 원고와 응대 문구를 만들고, 팀이 검토할 초안을 준비해드릴게요.';
 if(/디자인|시안|레이아웃/.test(title))return '정갈한 한상 컨셉에 맞춰 사양·필수 문구·배치와 검토 기준을 정리해드릴게요.';
 if(/발주|리드타임|구매/.test(title))return '견적 확인 질문과 발주 체크리스트를 만들고, 확인된 리드타임으로 일정을 역산해드릴게요.';
 return '필요한 준비 자료와 확인 순서를 정리하고, 바로 검토할 초안을 함께 만들겠습니다.';
}
function taskStatus(t){
 if(complete(t.status))return ['원본상 완료',''];
 if(t.start&&t.due&&t.start>t.due)return ['날짜 확인 필요','danger'];
 if(t.due&&t.due<$('date').value)return ['지난 마감 · 완료 확인','warn'];
 if(t.due===$('date').value)return ['오늘 마감 · 상태 확인','warn'];
 const pending=t.dependencies.filter(id=>!complete(data.tasks.find(p=>p.id===id)?.status));
 if(pending.length)return ['선행 상태 확인',''];
 return [t.status,''];
}
function openHelp(title,request){
 $('help-title').textContent=title;
 $('help-prompt').value=`가치커피 2026 카페쇼 준비를 같이 진행해주세요.\n준비 문서: ${DOC}\n준비 시트: ${SHEET}\n\n${request}\n\n기획서 기준은 정갈한 남도 한상, 무료 체험, 상보 걷기, 드립백 현장 판매와 원두 후배송입니다. 기획서와 이후 결정이 다르면 확인해주세요. 원본을 다시 읽고 확정·후보·자료 없음을 구분해주세요. 구매·외부 전송·확정 결정은 먼저 실행하지 마세요.`;
 $('copy-status').textContent='';$('help-dialog').showModal();
}
function taskCard(t){
 const [state,cls]=taskStatus(t);
 const parentText=t.dependencies.map(id=>{const p=data.tasks.find(x=>x.id===id);return p?`#${id} ${p.title} (${p.status})`:`#${id} 자료 없음`;}).join(' / ');
 const startError=t.start&&t.due&&t.start>t.due;
 return `<article class="task-row"><div class="task-meta"><span>#${escape(t.id)}</span><span>${escape(t.owner)}</span><span>${shortDate(t.start)} → ${shortDate(t.due)}</span><span class="badge ${cls}">${escape(state)}</span></div><h4>${escape(t.title)}</h4><p class="output">준비할 결과: ${escape(t.deliverable||'자료 없음')}</p>${parentText?`<p>먼저 확인: ${escape(parentText)}</p>`:''}${startError?'<p>시작일이 마감일보다 늦습니다. 기준 일정을 확인하세요.</p>':''}${t.note?`<p>원본 메모: ${escape(t.note)}</p>`:''}<p>${escape(assistance(t))}</p><div class="actions"><button class="action" data-help-task="${escape(t.id)}">이 일 같이 준비하기</button><a class="secondary" href="${SHEET}?gid=1537565671#gid=1537565671" target="_blank" rel="noopener">원본에서 상태 기록 ↗</a></div></article>`;
}
function render(){
 if(!data)return;
 $('snapshot').textContent='원본 조회: '+data.snapshot.replaceAll('-','.');
 $('task-count').textContent=data.tasks.length+'개';
 const days=Math.round((day(data.eventDate)-day($('date').value))/86400000);
 $('countdown').textContent=days>=0?'D−'+days:'행사 시작 후 '+(-days)+'일';
 const owner=$('owner').value;
 const priorities=data.tasks.filter(t=>!complete(t.status)&&(owner==='all'||t.owner===owner)).sort((a,b)=>{
 const score=t=>(t.start&&t.due&&t.start>t.due?-100000:day(t.due||'2099-01-01'));
 return score(a)-score(b);
 }).filter(t=>t.start<=$('date').value||(t.due&&t.due<=$('date').value)).slice(0,4);
 $('priority').innerHTML=priorities.length?priorities.map(taskCard).join(''):'<article class="card">해당 담당자의 오늘 시작·마감 작업이 없습니다. 전체 일정에서 다음 작업과 선행 상태를 확인하세요.</article>';
 const needle=$('search').value.trim().toLowerCase(), filter=$('task-owner').value;
 const shown=data.tasks.filter(t=>(filter==='all'||t.owner===filter)&&[t.title,t.note,t.category,t.deliverable].join(' ').toLowerCase().includes(needle));
 $('all-tasks').innerHTML=shown.length?shown.map(taskCard).join(''):'<p>해당하는 작업이 없습니다.</p>';
}
function staticRender(){
 $('alerts').innerHTML=alerts.map((a,i)=>`<article class="alert-card"><span class="badge warn">${a[2]}</span><h4>${a[0]}</h4><p>${a[1]}</p><button class="action" data-alert="${i}">같이 확인하기</button></article>`).join('');
 $('flow').innerHTML=flow.map((f,i)=>`<article><span class="badge">${f[2]}</span><strong>${i+1}. ${f[0]}</strong><p>${f[1]}</p></article>`).join('');
 $('roadmap').innerHTML=roadmap.map(r=>`<article><strong>${r[0]}</strong><p>${r[1]}</p></article>`).join('');
 $('ideas').innerHTML='<span class="adopted">채택 · 상보 걷기</span>'+ideas.map(x=>`<span>기획서 후보 · ${x}</span>`).join('')+'<span>보류 · 줄 세우기·물티슈·식권·소진 마감</span>';
 const cross={'1':'준비 문서: 기존 블렌드 + 허브 블렌드. 구체 제품 구성과 일치 여부 확인.','2':'구수 라떼가 문서의 시음 구성에 포함됨. 레시피·장비 최종값은 확인 필요.','3':'준비 문서: 블렌드 네 가지 중 1회 가능.','4':'기획서: 체험 전부 무료. 판매 가격과 경계 문구 확인.','5':'준비 문서: 11/20 일괄배송. “셋째 주 자택 수령” 문구와 대조 필요.','6':'준비 문서: 소반 4개·3인 착석, 그릇에 담아두고 주전자에서 따라주기 검토.','7':'기획서: 숙박·교통 제외 약 200만원·초과 가능. 확정 상한은 자료 없음.','8':'기획서: 현장 3명, 실제 운영 2명 기준. 최종 근무표 자료 없음.'};
 $('decision-list').innerHTML=data.decisions.map(d=>`<article class="task-row"><div class="task-meta"><span class="badge warn">결정 내용 대조 필요</span><span>기한 ${shortDate(d.due)}</span></div><h4>${escape(d.title)}</h4><p class="output">시트 결정 내용: ${escape(d.value||'빈칸')}</p><p>${escape(cross[d.id]||'문서 대조 필요')}</p><p>연결되는 작업: ${escape(d.affects)}</p><p>고려할 점: ${escape(d.consider)}</p><button class="action" data-decision="${escape(d.id)}">결정 준비 도와주세요</button></article>`).join('');
 $('order-list').innerHTML=data.orders.map(o=>`<article class="task-row"><div class="task-meta"><span>${escape(o.type)}</span><span>${escape(o.owner)}</span><span class="badge">원본 상태 ${escape(o.status)}</span></div><h4>${escape(o.title)}</h4><p class="output">입고 목표 ${shortDate(o.arrival)} · 수량 ${escape(o.quantity??'자료 없음')} · 리드타임 ${o.lead==null?'자료 없음':escape(o.lead)+'일'}</p><p>발주 마감: ${o.lead==null?'리드타임 확인 후 계산':shortDate(new Date(day(o.arrival)-Number(o.lead)*86400000).toISOString().slice(0,10))}</p>${o.note?`<p>${escape(o.note)}</p>`:''}<button class="action" data-order="${escape(o.id)}">발주 준비 도와주세요</button></article>`).join('');
}
function switchView(view){if(!views[view])view='today';active=view;document.querySelectorAll('.view').forEach(s=>s.hidden=s.id!==view);document.querySelectorAll('[data-view]').forEach(b=>{if(b.dataset.view===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});$('page-kicker').textContent=views[view][0];$('page-title').textContent=views[view][1];}
document.addEventListener('click',e=>{
 const v=e.target.closest('[data-view]');if(v){switchView(v.dataset.view);location.hash=active;return;}
 if(!data)return;
 const task=e.target.closest('[data-help-task]');if(task){const t=data.tasks.find(t=>t.id===task.dataset.helpTask);openHelp(t.title,`작업 #${t.id}: ${t.title}\n담당: ${t.owner}, 시작 ${t.start}, 마감 ${t.due}, 원본 상태 ${t.status}\n산출물: ${t.deliverable}\n선행 작업: ${t.dependencies.join(',')||'없음'}\n메모: ${t.note}\n이 일을 할 수 있도록 필요한 자료와 검토 가능한 초안을 준비해주세요.`);return;}
 const alert=e.target.closest('[data-alert]');if(alert){const a=alerts[Number(alert.dataset.alert)];openHelp(a[0],a[3]);return;}
 const decision=e.target.closest('[data-decision]');if(decision){const d=data.decisions.find(d=>d.id===decision.dataset.decision);openHelp(d.title,`대표 결정사항: ${d.title}. 고려할 점: ${d.consider}. 영향: ${d.affects}. 관련 문서에서 이미 확정된 내용을 확인하고 제가 답해야 할 질문을 추려주세요.`);return;}
 const order=e.target.closest('[data-order]');if(order){const o=data.orders.find(o=>o.id===order.dataset.order);openHelp(o.title,`발주·구매 항목: ${o.title}. 목표 입고 ${o.arrival}, 리드타임 ${o.lead??'자료 없음'}, 수량 ${o.quantity??'자료 없음'}. 발주 전에 확인할 사양·수량·리드타임 질문과 일정 초안을 준비해주세요. 구매나 외부 발송은 하지 마세요.`);}
});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('help-prompt').value);$('copy-status').textContent='복사했습니다. Codex 채팅에 붙여넣어주세요.';}catch{$('help-prompt').focus();$('help-prompt').select();$('copy-status').textContent='요청 내용을 선택했습니다. 복사해서 채팅에 붙여넣어주세요.';}});
['date','owner','task-owner'].forEach(id=>$(id).addEventListener('change',()=>{if(!$('date').value)return;render();}));$('search').addEventListener('input',render);
window.addEventListener('hashchange',()=>switchView(location.hash.slice(1)));
const now=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());$('date').value=now;
async function load(){try{const res=await fetch('data.json',{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);const next=await res.json();if(!Array.isArray(next.tasks)||!Array.isArray(next.decisions)||!Array.isArray(next.orders))throw new Error('자료 형식 오류');data=next;staticRender();render();$('connection').textContent='공유 자료 · '+data.snapshot;$('error').hidden=true;}catch(e){$('connection').textContent='자료 연결 확인 필요';if(!data){$('error').hidden=false;$('error').textContent='준비 자료를 불러오지 못했습니다. 배포 주소에서 새로고침하거나 담당자에게 알려주세요.';}}}
switchView(location.hash.slice(1));load();setInterval(load,60000);
