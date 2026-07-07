# NARRA — Brand Narrative OS (MVP)

Every Brand Has Its Own World.

대화형으로 브랜드를 탐색하고(브랜드 → 세계관 → Output), 원하는 포맷으로 결과를 생성해 저장하는 MVP입니다.

## 실행 방법

1. Node.js 18 이상이 필요합니다. 의존성 설치:
   ```bash
   npm install
   ```
2. `.env.local.example`을 `.env.local`로 복사하고 `ANTHROPIC_API_KEY`를 설정하면 실제 Claude API로 대화가 동작합니다.
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
   키가 없으면 자동으로 mock 응답(`lib/mock.ts`)으로 동작해 UX 흐름만 검증할 수 있습니다.
3. 개발 서버 실행:
   ```bash
   npm run dev
   ```
4. http://localhost:3000 접속.

## 구조

- `lib/systemPrompt.ts` — NARRA의 대화 단계(탐색 → 브랜드 정의 → 포맷 선택 → 결과 생성)와 카드 출력 포맷을 정의하는 시스템 프롬프트.
- `lib/mock.ts` — API 키가 없을 때 사용하는 결정론적 mock 응답기.
- `app/api/chat/route.ts` — Claude API 호출 (또는 mock) 라우트.
- `lib/parseCard.ts` — 응답에서 \`\`\`narra-card\`\`\` 블록을 파싱.
- `app/page.tsx` — 3단 레이아웃(좌: 대화 / 가운데: 생성 결과 / 우: 저장된 에셋) 및 상태 관리.
- 저장된 에셋은 브라우저 `localStorage`에 보관됩니다 (백엔드 저장소 없음, MVP 범위).

## MVP 범위

1. 브랜드 탐색 대화
2. 브랜드 정의 카드
3. 포맷 선택 (퀵 버튼 + 대화)
4. 결과 생성 카드 (시놉시스/카피/이미지·영상 프롬프트)
5. 저장 기능 (로컬 저장)

이미지/영상 실제 생성은 다음 단계 범위입니다.
