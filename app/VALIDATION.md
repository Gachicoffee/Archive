# 검증 결과

검증 환경: Windows, Node.js, Chromium 기반 Microsoft Edge headless.

- `npm run build`: TypeScript 검사 및 Vite production build 통과.
- `npm test`: 9개 테스트 통과. 예시 데이터 정합성, 검색, 주간 집계, 기존 기록 2,015개의 원문·사진·날짜·원본 링크 보존, 분류와 링크 검증을 확인.
- 실제 브라우저: 8개 메뉴 전환, 관련어 검색 및 결과 없는 상태, 2018년 타임머신 필터, 농장 연도별 통합 보기와 근거 모달, 북마크, JSON 다운로드, import 파일명 선택을 확인.
- 1440px 데스크톱 및 390px 모바일 화면을 캡처하여 확인. 모바일 가로 넘침 없음.
- 주요 탐색 과정에서 브라우저 runtime error 없음.

기존 데이터 연결 후 브라우저에서 24→48개 더 보기, 실제 사진, Instagram 게시물 링크, 농장 통합 이야기, 실제 기록 검색, 이번 주 기록 없음 표시, 8개 메뉴 및 모바일을 추가 검증했습니다.

실제 Instagram 수집, 외부 최신 기사, LLM 분석, vector DB, 주간 예약/알림은 mock 범위 밖이며 검증 대상이 아닙니다.
