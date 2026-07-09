# NARRA — Brand Narrative OS — 프로젝트 문서

이 문서는 새 Claude Code 세션(또는 다른 사람)이 이 프로젝트를 이어서 작업할 때 필요한 모든 배경 정보를 담고 있습니다. 코드를 건드리기 전에 먼저 이 문서 전체를 읽어주세요.

## 한 줄 요약

NARRA는 "브랜드 내러티브 탐험가"입니다 — 챗봇이 아니라, 대화를 통해 브랜드를 먼저 이해하고(Brand) → 세계관으로 정의한 뒤(World) → 원하는 포맷의 결과물(Output)로 표현해주는 Next.js 웹앱입니다. 현재는 Mock 데이터로만 동작하며, 실제 LLM 연동은 API 키만 넣으면 되도록 구조가 준비되어 있습니다.

## 위치 / 배포

- **로컬 경로**: `~/Desktop/coding_0707` (이미 git 저장소, 이 폴더가 유일한 원본입니다)
- **GitHub**: `eunk333-sudo/0707` (origin)
- **배포**: Vercel — `https://project0707.vercel.app`, `main` 브랜치에 push하면 자동 배포
- **⚠️ 중요한 작업 규칙**: `main`에 커밋/push(=배포)는 사용자가 그 턴에 명시적으로 "적용해줘"/"배포해줘"라고 말했을 때만 합니다. 로컬에서 다 만들고 검증한 뒤 "배포는 안 했습니다, 말씀하시면 push하겠습니다"라고 보고하는 게 기본 동작입니다.

## 개발 환경 — 꼭 알아야 할 것

이 macOS 환경에는 시스템에 Node/npm/brew가 기본 설치되어 있지 않습니다. Node는 아래 경로에 별도로 설치되어 있습니다:

```
~/.narra-tools/node-v24.18.0-darwin-arm64/bin
```

터미널에서 `npm`/`npx`가 필요한 모든 명령 앞에 **반드시** PATH를 이렇게 붙여야 합니다:

```bash
export PATH="$HOME/.narra-tools/node-v24.18.0-darwin-arm64/bin:$PATH" && npm run build
```

개발 서버는 (Claude Code라면) 직접 bash로 띄우지 말고 `.claude/launch.json`에 등록된 `narra-dev` 설정으로 `preview_start` 류의 툴을 통해 실행합니다:

```json
{
  "configurations": [
    { "name": "narra-dev", "runtimeExecutable": "npm", "runtimeArgs": ["run", "dev"], "port": 3000 }
  ]
}
```

## 실행 방법 (사람이 직접 할 때)

```bash
export PATH="$HOME/.narra-tools/node-v24.18.0-darwin-arm64/bin:$PATH"
npm install
npm run dev
# http://localhost:3000
```

`.env.local`의 `ANTHROPIC_API_KEY`는 현재 **비어있음** — 그래서 모든 대화가 `lib/mock.ts`의 결정론적 mock 응답으로 동작합니다. 여기에 실제 키를 넣으면 `app/api/chat/route.ts`가 자동으로 진짜 Claude API 호출로 전환됩니다 (코드 변경 불필요).

검증 루틴(작업 후 항상 실행):
```bash
export PATH="$HOME/.narra-tools/node-v24.18.0-darwin-arm64/bin:$PATH"
npx tsc --noEmit && npx eslint . && npm run build
```

## 화면 구조 (4컬럼, `app/page.tsx`)

맨 위에 사용자 인사말 바("최은강 모험가님")가 있고, 그 아래 4개 컬럼:

| 컬럼 | 폭 | 컴포넌트 | 역할 |
|---|---|---|---|
| 1 | 240px | `ResultPanel.tsx` | "브랜드 탐험" 고정 표시 — 브랜드 정의(`brand_definition`) 카드가 생기면 자동으로 여기 뜸. 네비게이션 없음. |
| 2 | 160px | `DiscoveryPanel.tsx` | "발견" — 나머지 5개 워크플로우 단계 네비게이션(크리에이티브 디렉션/브리프/AI 프롬프트/브랜드 자산/브랜드 확장) + 선택한 단계의 카드 내용이 그 아래 표시 |
| 3 | 1fr | `ChatPanel.tsx` | "탐험" — 실제 대화 채팅 UI. 메시지 없을 땐 히어로(검색창 스타일) 모드, 있으면 일반 채팅 로그 |
| 4 | 280px | `SavedPanel.tsx` | "아카이브" — 저장한 카드들을 세로 카드 덱으로 보여줌 + 하단 고정 "브랜드 정합성 검토(AI)" 섹션 |

`components/NarraCardView.tsx`는 카드 1개(제목/필드/저장버튼)를 렌더링하는 공용 컴포넌트로 컬럼 1, 2에서 재사용됩니다.

## 대화 ↔ 카드 프로토콜

- 어시스턴트 응답 텍스트 안에 다음과 같은 펜스드 코드블록이 있으면 카드로 파싱됩니다 (`lib/parseCard.ts`의 `extractCard`):
  ````
  ```narra-card
  {"type":"brand_definition","title":"...","fields":{...}}
  ```
  ````
- `NarraCard.type`은 3종류만 존재: `"brand_definition" | "creative_direction" | "result"`. **"크리에이티브 브리프"와 "AI 프롬프트" 두 워크플로우 단계는 둘 다 `"result"` 타입 카드를 공유합니다** — 일부러 타입을 안 쪼갠 설계 결정입니다 (mock이 이미 브리프+프롬프트를 아우르는 카드 하나를 만들어주기 때문).
- `lib/types.ts`의 `WORKFLOW_STEPS`가 6단계 전체 정의(`explore/creative/brief/ai_prompt/assets/expansion`)의 단일 소스입니다. UI에서는 `explore`만 컬럼 1에, 나머지 5개만 컬럼 2 네비게이션에 씁니다.

## Mock 대화 엔진 (`lib/mock.ts`)

API 키가 없을 때 사용자 메시지 개수(`count`)로 턴을 세는 결정론적 상태 머신입니다:

1. `count` 1~5: `EXPLORATION_QUESTIONS` 배열의 고정 질문이 순서대로 나옴 (현재는 키워드 분기 없이 고정 문장 — 예전엔 키워드 기반 분기였다가 사용자 요청으로 고정 시퀀스로 변경됨)
2. `count === 6`: `당신이 찾아낸 세계의 "브랜드 디렉션"이 발견되었습니다.` + `brand_definition` 카드 + `당신의 세계가 첫번째 정의를 가졌습니다.`
3. 이후 사용자가 포맷(브랜드필름/광고/키비주얼/홈페이지 히어로 이미지/SNS 콘텐츠/무드보드)을 고르면(컬럼 2의 "브랜드 자산" 단계에서 버튼 클릭 → `handlePickFormat`) `result` 카드 생성. 영상 계열 포맷이면 그 전에 AI 영상 툴(클링/런웨이/시드니스) 질문이 한 번 더 낌.

새로운 대화 단계나 질문을 바꿀 땐 이 파일의 상수/분기만 건드리면 됩니다. `lib/systemPrompt.ts`는 실제 Claude API를 쓸 경우를 위한 시스템 프롬프트로, mock과 구조가 어긋나지 않게 같이 유지해야 합니다 (지금은 API 키가 없어 실제로 쓰이진 않음).

## 저장(아카이브) & 정합성 검토

- 저장된 카드는 `lib/savedAssetsStore.ts`가 `localStorage`(`narra-saved-assets` 키)에 저장하고 `useSyncExternalStore`로 구독합니다. 백엔드 없음, MVP 범위.
- 카드를 저장하는 순간(`app/page.tsx`의 `handleSaveCard`) `lib/consistency.ts`의 `scoreConsistency()`가 호출되어 `ConsistencyReport`(narrative/tone/emotion/message 4개 수치 + 개선 포인트 + 수정 제안)를 만들어 카드에 함께 저장합니다. **모든 저장 카드에 대해 무조건 호출**(카드 타입 상관없이) — 예전엔 `result` 타입에만 붙여서 다른 카드를 클릭하면 정합성 섹션이 비어보이는 버그가 있었음.
- 수치는 고정값(76/76/82/68 근처)에 저장할 때마다 ±8 정도 랜덤 지터를 줘서, 카드마다 조금씩 다른 값이 나오도록 되어 있습니다 (완전히 똑같으면 "클릭해도 안 바뀐다"고 오해하기 쉬워서).
- `SavedPanel.tsx`의 카드 덱은 세로로 쌓인 접힘(56px)/펼침 카드입니다. 카드 간 세로 offset 48px(끝부분만 겹침), 클릭하면 그 카드가 제자리에서 살짝 떠오르며 삭제(✕) 아이콘이 나타납니다. 정합성 검토 섹션은 카드 안이 아니라 **패널 맨 아래 고정된 별도 섹션**이며, 선택한 카드에 따라 수치만 갱신됩니다.

## 폰트 / 톤 & 무드

- 다크 우주/골드 테마 유지 중 (`app/globals.css`의 `--color-void/--color-gold/--color-gold-bright` 등).
- 영문 타이틀(NARRA, Workflow 등)은 `next/font/google`의 Cinzel(`--font-display`)/Cormorant Garamond(`--font-serif`)로 화려하게, 넓은 자간(`tracking-[0.3~0.5em]`) 유지.
- **한글 텍스트에는 절대 `font-display`/`font-serif`(Cinzel/Cormorant)를 걸지 않습니다** — 이 두 폰트는 한글 글리프가 없어서 브라우저가 기본 폰트로 대체하는데, 거기에 넓은 자간까지 남아서 예전에 한글이 "촌스럽게" 벌어져 보이는 버그가 있었습니다. 한글은 Pretendard Variable(`--font-sans`, `app/layout.tsx`의 `<head>`에 CDN link 태그로 로드) + 자간 `tracking-[0.08~0.15em]` 이하로 통일되어 있습니다.

## 알아두면 좋은 과거 결정들

- 예전에 "PRD v1.0" 이름으로 완전히 다른 라이트/글래스 테마 4컬럼 리디자인을 만들었다가, 실제 배포된 사이트(다크 테마)와 안 맞아서 `git reset --hard origin/main`으로 전부 되돌린 적이 있습니다. 그 이후로는 "새 프로젝트 만들지 마라, 기존 컴포넌트 재사용, 추가만 하고 통째로 교체하지 마라"가 이 프로젝트의 암묵적 기본 원칙입니다.
- (2026-07-09 삭제됨) 예전엔 `AGENTS.md`/`CLAUDE.md`에 "이건 네가 아는 Next.js가 아니다, `node_modules/next/dist/docs/`를 먼저 읽어라"라는, 실제로 존재하지 않는 경로를 가리키는 문구가 있었습니다. 사용자 확인 후 두 파일 모두 삭제했습니다 — 프로젝트에는 표준 Next.js 16 API가 그대로 적용됩니다.

## 현재 상태 (최근 커밋 기준)

최신 배포 커밋: `6ec1dc7` ("Rework the archive into a vertical card deck and fix Korean typography"). 이 문서를 쓰는 시점 기준으로 로컬에 다음 변경들이 **아직 push 안 된 상태로 쌓여있을 수 있습니다** — 새 세션에서는 `git status`/`git log`로 실제 배포 상태와 로컬 작업 상태를 먼저 확인하세요:
- 아카이브 카드 덱/정합성 검토 섹션 분리
- 인사말 바, WORKFLOW 텍스트 오버플로 수정, 포맷 버튼 "브랜드 자산"으로 이동, 입력창 포커스 유지
- 탐험 질문 mock 고정 시퀀스로 변경
- 컬럼 1/2 역할 스왑 (브랜드 탐험 고정 표시 / 발견=나머지 5단계 nav+content)

## 자주 하는 작업 패턴

1. 파일 읽고 → 수정 → `npx tsc --noEmit && npx eslint . && npm run build`
2. `preview_start`(narra-dev)로 브라우저 열어서 실제 클릭/입력으로 확인 (모달 닫기 → 대화 진행 → 카드/저장/정합성 확인)
3. 배포 지시가 명시적으로 있을 때만 `git add` → `git commit` → `git push origin main`
