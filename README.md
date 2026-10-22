# HDS Playground

기획자 · 디자이너 · 개발자가 **HDS(Hanatour Design System) 컴포넌트만으로** 화면을 빠르게 조립해 보는 곳입니다. AI 코딩 도구(Claude Code · Cursor 등)에 말로 요청하면 HDS로 조립된 화면이 나오고, 같은 주소에서 같이 보고, 폐기하거나 Figma로 올리거나 개발로 넘깁니다.

실험용입니다. 여기 코드는 그대로 서비스에 들어가지 않습니다.

## 처음 한 번

1. Node 20 이상, GitHub 계정에 이 저장소 접근 권한 (토큰 설정은 필요 없습니다)
2. 설치와 실행

```bash
git clone https://github.com/aliceblue567/hds-playground
cd hds-playground
npm install
npm run dev         # http://localhost:5173
```

## HDS Studio — 화면으로 조합하기 (시연용)

주소 `#/studio`. 코드를 몰라도 HDS 컴포넌트로 화면을 조합해 볼 수 있습니다.

- **직접 조합**: 왼쪽 팔레트에서 블록을 누르면 360 화면에 쌓입니다. 블록을 누르면 오른쪽에서 속성(size · variant 등)을 바꾸고, 위아래 이동 · 복제 · 삭제를 합니다. 선택지는 패키지의 `ai/hds-catalog.json`(컴포넌트 코드에서 자동 생성)에서 읽어서 HDS에 없는 값은 고를 수 없습니다.
- **프롬프트**: 위 입력창에 요청을 쓰면 AI가 **블록 목록(JSON)만** 냅니다. 코드를 쓰지 않으므로 HDS 밖으로 나갈 수 없고, 허용값이 아닌 값은 기본값으로 되돌리며, 없는 컴포넌트는 점선 「커스텀」 블록으로 바뀌어 드러납니다.
- 아래 숫자: HDS 블록 수 · 커스텀 수 · HDS 비율. 「코드 보기」는 같은 화면의 JSX입니다.
- 조합한 화면은 브라우저에 저장됩니다(사람마다 따로).

프롬프트 모드를 켜려면 Vercel → Settings → Environment Variables에 `ANTHROPIC_API_KEY`를 넣고 다시 배포합니다(`api/compose.ts`). 선택: `STUDIO_MODEL`(기본 claude-sonnet-5-5). 키가 없어도 직접 조합은 동작합니다.

## 화면 하나 만들기 (AI 도구로)

1. 실험 브랜치를 만듭니다: `git switch -c exp/<무엇을-실험하나>`
2. Claude Code(또는 Cursor)를 이 폴더에서 엽니다. 루트의 `AGENTS.md`를 자동으로 읽습니다.
3. 요청합니다. 예: **「패키지 상품 상세 화면을 만들어. src/mock의 packages 데이터를 쓰고, 하단에 예약 버튼」** — 문장 패턴은 [docs/PROMPTS.md](docs/PROMPTS.md)
4. 화면이 `src/screens/<id>/`에 생기고 `src/screens/index.ts`에 등록됩니다. 브라우저 왼쪽 목록에서 열어 봅니다.
5. 끝내기 전에 `npm run check` — lint(HDS 규칙)와 드리프트 리포트가 통과해야 합니다.
6. 푸시하면 브랜치마다 미리보기 주소가 생깁니다(Vercel). 그 주소를 공유해 같이 봅니다.

## 규칙 (요약 — 전문은 AGENTS.md)

- UI는 `@aliceblue567/hds-react` 컴포넌트만. HTML `<button>` `<input>`으로 흉내 내지 않습니다.
- 색 · 글자 · 간격은 HDS 토큰(`var(--hds-…)`)만. 원시 hex · px 글자 크기 금지.
- 아이콘은 HDS Foundation 아이콘(427개)만.
- HDS에 없는 UI가 꼭 필요하면 만들되 `data-hds="custom" data-hds-reason="왜"`를 붙입니다. 이 목록이 디자인시스템 백로그가 됩니다.
- 로딩(Skeleton) · 빈 상태(EmptyState) · 오류를 같이 만듭니다.

`npm run lint`가 이 규칙을 기계로 검사하고, `npm run hds:report`가 HDS 비율과 커스텀 목록을 냅니다(`reports/hds-report.json`).

## 실험의 결말 세 가지

| 결말 | 하는 일 |
| --- | --- |
| 폐기 | 브랜치 삭제. 가장 흔하고 건강한 결말 |
| Figma 정본화 | 디자이너가 화면을 Figma로 가져가 정식 스펙으로 다듬음 |
| 개발 이관 | 개발팀이 받아 실제 저장소에 다시 구현. 복사가 아니라 재작성에 가깝습니다 |

커스텀 마커가 붙은 UI가 여러 실험에서 반복되면 HDS 컴포넌트 후보입니다.

## 구조

```
AGENTS.md                 AI 도구가 읽는 규칙 + 컴포넌트 인덱스 (패키지에서 복사됨 — 손으로 고치지 않음)
ai/hds-components.md      컴포넌트 104개 props 전체
ai/hds-catalog.json       기계용 카탈로그 · ai/hds-figma-map.json  Figma 속성 → 코드 prop
src/mock/                 패키지 · 항공 · 예약 목데이터 (새 데이터 모양을 만들지 말고 여기에 더함)
src/screens/<id>/         실험 화면 하나 = 폴더 하나
src/screens/index.ts      화면 등록 (제목 · 시작한 사람 · 상태)
src/App.tsx               미리보기 틀 (테마 · 플랫폼 전환)
eslint/hds-plugin.mjs     HDS 규칙 lint
scripts/hds-report.mjs    드리프트 리포트
scripts/sync-ai-kit.mjs   패키지의 AI Kit을 루트로 복사 (npm run hds:sync-ai — 패키지를 올릴 때마다)
```

## HDS 패키지 버전 올리기

HDS 패키지는 `vendor/`에 파일로 들어 있어 비공개 레지스트리 토큰 없이 설치 · 배포됩니다.

1. hds-storybook에서 `npm run build:lib && npm pack` → `aliceblue567-hds-react-<버전>.tgz`
2. 그 파일을 이 저장소 `vendor/`에 넣고 옛 파일은 지움
3. `package.json`의 `@aliceblue567/hds-react` 경로를 새 파일 이름으로 바꾸고 `npm install`
4. `npm run hds:sync-ai` → AGENTS.md · ai/ 갱신 → 커밋

## 명령

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run check` | lint + 드리프트 리포트 (끝내기 전 필수) |
| `npm run hds:sync-ai` | `@aliceblue567/hds-react`를 올린 뒤 AGENTS.md · ai/ 갱신 |
| `npm run build` | 배포 빌드 |

## 참조 화면

`src/screens/package-payment/` — 패키지 예약의 결제 단계. 규칙대로 만들면 어떤 모양이 되는지의 기준입니다. HDS 비율 96.8%, 커스텀 1건(요금 요약 카드 → 백로그).


## Studio (0.42.0 기준)

- 화면에 추가 가능한 HDS 블록 34종과 레이아웃·커스텀 블록 2종을 제공합니다. 라이브러리의 104개 export에는 조합 내부의 하위 부품이 포함됩니다.
- 이름·그룹 검색으로 블록을 찾고, 아직 연결하지 않은 컴포넌트는 팔레트 아래 Storybook 링크에서 확인합니다. 이 항목들은 AI 조합에도 아직 제공되지 않습니다.
- 날짜 선택·셀렉트·검색·범위 선택·별점 입력·정보 표·배지·아바타·페이지 이동·피드백·로딩 블록을 추가했습니다.
- HDS 사용률은 레이아웃을 제외한 컴포넌트 사용 비율이며, Figma 일치도나 QA 점수가 아닙니다.
- `npm run test:studio`: 전체 블록 기본 렌더링, JSX 문법, HDS export, Table 기본 테두리, AI 속성 파싱을 확인합니다. 시각적 회귀 테스트를 대체하지 않습니다.
- 이번 패키지는 `aliceblue567/hds-storybook` 커밋 `baaafc4993e0a1dcd6f49be6f516fd77642c1bf1`에서 빌드했습니다. Figma 원본 전체 대조 완료를 의미하지 않습니다.


## AI 프로덕트 컴포넌트 후보

AI는 먼저 등록된 HDS 블록을 재사용하고, 필요한 경우 `Product` 레시피를 생성합니다. `Stack` 레이아웃과 `Text` 타이포 선택값은 HDS 토큰으로 변환되며, UI 부품은 등록된 HDS 블록을 그대로 렌더링합니다. 임의 CSS·HTML·스크립트·중첩 고정 영역은 허용하지 않습니다. 기본·로딩·빈 상태·오류를 포함하며, 빠진 보조 상태는 HDS 기본 안내로 보완하고 경고합니다.

- 후보를 선택하면 이름·목적·신설 이유, 상태, 내부 부품과 레이아웃을 편집할 수 있습니다.
- 후보 저장은 이 브라우저의 localStorage에 최대 20개까지 저장합니다. 화면에 다시 넣을 때는 복사본입니다. 정식 HDS 등록이나 팀 공유가 아닙니다.
- 코드 보기는 현재 표시 중인 상태의 JSX와 필요한 HDS imports를 제공합니다. 후보는 `data-hds="custom"`, 이유, `data-product-status="draft"`를 유지합니다.
- AI 결과를 적용한 뒤 직전 화면으로 한 번 되돌릴 수 있습니다. 생성 실패·너무 긴 응답은 기존 화면을 교체하지 않습니다.
- 이 기능은 HDS 기반 시각 조합을 만듭니다. 실제 데이터 연결·화면 이동·업무 로직·전체 접근성 검증은 별도 개발·리뷰 대상입니다. 기본 HDS 자체에 없는 새 상호작용은 아직 Custom 백로그로 남깁니다.
- 검증: 등록된 블록 렌더링/JSX, Product 4개 상태, 기본 상태 보완, 허용하지 않은 노드·스타일 제거, 문자열 이스케이프와 중첩 HDS 의존성 검사를 `npm run test:studio`에서 수행합니다.
