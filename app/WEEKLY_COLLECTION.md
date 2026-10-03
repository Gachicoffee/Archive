# 주간 공개 기록 수집

매주 월요일 오전 9시, Asia/Seoul. Codex의 이 채팅에 연결된 자동화가 실행합니다. 컴퓨터와 Codex 앱의 실행, 인터넷 연결, Instagram 브라우저 로그인 상태에 의존합니다. 서버에서 독립적으로 실행하는 수집기가 아닙니다.

## 현재 상태

2026-10-03 초기 검증에서 최신 공개 게시물 3건의 작성자, 펼친 캡션, 정확한 `time[datetime]`을 확인했습니다. `archive_updates.json`에 원문·게시일·게시물별 원본 링크·AI 요약을 저장했습니다. 한국 시간으로 게시일을 계산합니다. 새 사진은 아직 보관하지 않으며 원본 링크로 확인합니다. 기존 2,015개 기록과 사진은 변경하지 않습니다.

2026-01-28 이후 전체 누락 기간은 아직 채우지 않았습니다. `collection.backfillComplete=false`를 유지하고 매회 최대 30건씩 보완합니다. 단순히 최신 게시물이 보였다는 이유로 전체 수집 완료로 표시하지 않습니다.

## 실행 절차

1. GitHub 연결에서 Gachicoffee/Archive main 최신 ref와 tree를 읽습니다. 원격 `archive_updates.json`과 기존 `archive_data.json`의 게시물 shortcode를 기준으로 중복을 판단합니다. 로컬 파일만을 최신 상태로 가정하지 않습니다.
2. computer-use skill을 읽고 cua_repl의 문서화된 API로 로그인한 Codex 인앱 브라우저를 사용합니다. 공개 libre_pil 프로필의 화면에 표시된 게시물 링크만 수집합니다. 쿠키·토큰 추출, 내부 API, 로그인 우회는 사용하지 않습니다. 로그인 만료·인증·접근 제한은 중단하고 사용자 조치를 알립니다.
3. 최신 목록을 살펴보고 미등록 게시물을 선택합니다. 누락 보완 중이면 이미 등록된 최신 글을 만났다고 종료하지 말고 프로필을 스크롤해 과거 미등록 글도 선택합니다. Jan 28 경계까지 실제 도달하고 그 사이 미등록 후보를 모두 처리한 경우에만 backfillComplete를 true로 바꿉니다. 접근하지 못한 글이나 실패한 후보가 있으면 false를 유지합니다. 회당 최대 30건.
4. 링크를 열고 time 요소가 보일 때까지 기다립니다. 바로 읽으면 로딩 중 빈 DOM이 나올 수 있습니다. AX 상태를 확인하고 '더 보기'로 캡션을 펼친 후 AX를 다시 확인합니다. 작성자 libre_pil, 전체 캡션, 공개 time datetime, 원본 URL을 확인합니다. 댓글과 다른 작성자의 캡션을 혼합하지 않습니다. 날짜는 Asia/Seoul로 계산합니다.
5. 각 레코드는 src/data/types.ts의 Post 형식입니다. id=instagram-SHORTCODE, isMock=false, publishedAt=정확한 UTC datetime, summaryKind=ai. summary는 원문에 근거한 짧은 AI 요약이며 외부 뉴스나 추정을 원문 발언처럼 쓰지 않습니다. 명확한 국가·농장만 연결합니다. farmId는 실제 farms 목록에서 이름을 확인합니다. 모호하면 '국가 미분류', farmId/producerId 빈 문자열. 공개 사진이 없으면 imageUrl을 생략합니다. 임시 Instagram CDN URL을 영구 사진으로 저장하지 않습니다.
6. 기존 supplemental posts를 유지하고 shortcode로 중복 제거해 root archive_updates.json에 추가합니다. collection.checkedAt(한국 시간 날짜), lastAdded, backfillComplete를 갱신합니다. 원문이 바뀌거나 누락된 게시물을 기존 데이터에서 자동 삭제하지 않습니다.
7. 현재 앱은 root의 archive_data.json + archive_updates.json을 병합해 렌더링합니다. **데이터만 추가하는 정기 실행은 빌드할 필요가 없습니다.** 최신 main tree를 base로 archive_updates.json만 바꾼 Git tree/commit을 만들고 main ref를 force=false로 업데이트합니다. 다른 변경과 기존 archive_data.json은 보존합니다. main이 바뀌면 최신 상태를 다시 읽고 병합합니다. 로컬 출력 프로젝트 public/archive_updates.json도 원격에 맞춰 갱신합니다.
8. GitHub Pages 배포 완료 및 공개 archive_updates.json에서 신규 shortcode가 보이는지 확인합니다. 실패 시 성공이라고 보고하지 않습니다. 추가된 기록과 게시일 범위를 짧게 알립니다. 변동이 없을 때는 조용히 종료하고 새 기록, 수집 실패, 로그인 요청, 누락 보완 완료 등 의미 있는 변화에만 알립니다.

## 확장 지점

Collector 인터페이스를 이용해 허가된 별도 수집기/API로 교체할 수 있습니다. 임베딩과 벡터검색은 원문 및 sourceUrl 보존 후 별도 작업으로 붙입니다. 뉴스는 ExternalIssue 영역으로 분리합니다. 현재 검색은 로컬 키워드 및 동의어 확장입니다. Instagram 장애에도 이미 보관한 데이터는 읽을 수 있습니다.
