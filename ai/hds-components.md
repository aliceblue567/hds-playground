# HDS 컴포넌트 카탈로그 — `@aliceblue567/hds-react@0.40.0`

자동 생성(2026-10-22). 각 prop의 `← Figma`는 Figma 컴포넌트 속성과의 대응이다. Figma 디자인을 받아 구현할 때 이 대응표로 변환한다. 규칙은 `AGENTS.md`에 있다.

## Accordion

### `Accordion`
WAI-ARIA Accordion: 제목 안의 버튼(aria-expanded) + region.
`import { Accordion } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-accordion--design · Figma 가이드 node `9561:9506`

- `title`: string — 제목(Anatomy `Heading`). 접힌 상태에서 내용을 예측할 수 있게 쓴다. 길면 줄 수 제한 없이 줄바꿈한다
- `children`: ReactNode — 펼친 영역(Anatomy `Description`)에 들어갈 내용. 슬롯이라 무엇이든 넣을 수 있다
- `type?`: 'fill' · 'padding' (기본 'fill') ← Figma `Fill Width` — fill(True · Accordion/Fill, 전폭·Line Divider) · padding(False · Accordion/Padding, 좌우 여백·radius 8·Gap). 한 화면에 섞지 않는다
- `size?`: 'small' · 'medium' · 'large' (기본 'medium') ← Figma `Size` — 접힘 높이 small 48 · medium 56 · large 64
- `required?`: boolean ← Figma `Show Required` — 제목 뒤에 "필수" Shape 배지를 붙인다
- `helper?`: string ← Figma `Show Helper Text` — Chevron 왼쪽 보조 문구(선택한 값 · 개수 등). 1줄, 넘치면 말줄임
- `icon?`: ReactNode ← Figma `Show Icon` — 제목 앞 아이콘(20, small은 16). 장식이라 aria-hidden
- `divider?`: boolean ← Figma `Show Divider` — 항목 아래 Line Divider. 기본값은 type을 따른다: fill → 표시, padding → 없음(Gap으로 구분). 마지막 항목에는 그려지지 않는다
- `forceState?`: 'hover' · 'pressed' — 문서용: Hovered · Pressed 배경을 고정해서 보여줄 때
- `open?`: boolean — 펼침 상태(제어). 넘기면 onOpenChange에서 직접 바꿔야 한다
- `defaultOpen?`: boolean (기본 false) — 처음 펼침 상태(비제어)
- `onOpenChange?`: (open: boolean) => void — 헤더를 눌렀을 때 다음 펼침 상태로 불린다
- `headingLevel?`: 2 · 3 · 4 (기본 3) — 제목 요소 레벨(h2 · h3 · h4). 페이지의 제목 구조에 맞춘다

### `AccordionGroup`
한 번에 하나만 펼치는 그룹(선택). 기본 Accordion은 각자 독립적으로 열린다.
`import { AccordionGroup } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-accordion--design · Figma 가이드 node `9561:9506`

- `items`: Omit<AccordionProps, "open" | "onOpenChange" | "defaultOpen">[] — 항목 목록. 각 항목은 Accordion props(open · onOpenChange · defaultOpen 제외)
- `exclusive?`: boolean (기본 true) — true면 한 번에 하나만 펼친다(하나를 펼치면 나머지는 접힘). false면 각자 독립
- `type?`: 'fill' · 'padding' ← Figma `Fill Width` — 모든 항목에 같은 type을 적용(항목의 값이 우선)
- `size?`: 'small' · 'medium' · 'large' ← Figma `Size` — 모든 항목에 같은 size를 적용(항목의 값이 우선)

## Dialog

### `AlertDialog`
시스템 인터럽트. 배경을 눌러도 닫히지 않고, 결정을 받아야 닫힌다.
`import { AlertDialog } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-dialog--design · Figma 가이드 node `13832:3025`

- `open`: boolean — 열림 상태. 앱이 들고 있는다. 액션 버튼의 onClick에서 false로 바꾼다
- `dismissible?`: boolean (기본 true) — Esc · 하드웨어 뒤로가기 허용 (기본 true). true면 Esc가 cancel(없으면 confirm)의 onClick을 부른다.
- `title`: string — 결정을 묻는 제목, 최대 2줄. aria-labelledby로 연결된다
- `description?`: string ← Figma `Show Description` — aria-describedby로 연결된다
- `subContent?`: { type: "text"; text: ReactNode; } | { type: "highlight"; label: string; value: string; } ← Figma `Show Sub Content` — text 안내 블록 / highlight 강조 값. description이 있을 때만 쓴다. aria-describedby에 함께 연결된다
- `confirm`: { label: string; onClick: () => void; } ← Figma `Action Layout` — 확인(주 행동) 버튼. 명사형 라벨 — `확인`, 모호하면 `예약 취소`. cancel이 없으면 Single
- `cancel?`: { label: string; onClick: () => void; } ← Figma `Action Layout` — 취소(부정 행동) 버튼. 있으면 Double(나란히, 취소 왼쪽) 또는 Stacked. 액션은 최대 2개
- `stacked?`: boolean ← Figma `Action Layout` — (중첩 Stacked). 라벨이 길어 나란히 들어가지 않을 때. 확인이 위

### `AlertDialogPanel`
The Alert Dialog card without the modal layer. Used by AlertDialog and by static docs examples.
`import { AlertDialogPanel } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-dialog--design · Figma 가이드 node `13832:3025`

- `ids?`: { title?: string | undefined; desc?: string | undefined; sub?: string | undefined; } — 내부용: 모달이 aria-labelledby · aria-describedby로 연결하는 id
- `title`: string — 결정을 묻는 제목, 최대 2줄. aria-labelledby로 연결된다
- `description?`: string ← Figma `Show Description` — aria-describedby로 연결된다
- `subContent?`: { type: "text"; text: ReactNode; } | { type: "highlight"; label: string; value: string; } ← Figma `Show Sub Content` — text 안내 블록 / highlight 강조 값. description이 있을 때만 쓴다. aria-describedby에 함께 연결된다
- `confirm`: { label: string; onClick: () => void; } ← Figma `Action Layout` — 확인(주 행동) 버튼. 명사형 라벨 — `확인`, 모호하면 `예약 취소`. cancel이 없으면 Single
- `cancel?`: { label: string; onClick: () => void; } ← Figma `Action Layout` — 취소(부정 행동) 버튼. 있으면 Double(나란히, 취소 왼쪽) 또는 Stacked. 액션은 최대 2개
- `stacked?`: boolean ← Figma `Action Layout` — (중첩 Stacked). 라벨이 길어 나란히 들어가지 않을 때. 확인이 위

### `Dialog`
서비스가 말하는 중앙 오버레이. 배경 클릭 · 닫기 버튼 · Esc로 닫힌다.
`import { Dialog } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-dialog--design · Figma 가이드 node `13832:3025`

- `open`: boolean — 열림 상태. 앱이 들고 있는다(제어 컴포넌트). false가 되면 퇴장 모션 200ms 뒤 닫힌다
- `onClose`: () => void — 닫기 요청: 배경 클릭 · 닫기 버튼 · Esc · 뒤로가기. 여기서 open을 false로 바꾼다
- `title`: string ← Figma `Show Title` — (항상 켬). 명사형 또는 목적을 담은 짧은 문장. 모달에서는 aria-labelledby로 연결된다
- `description?`: string ← Figma `Show Description` — + `Description`. 모달에서는 aria-describedby로 연결된다
- `size?`: 'md' · 'lg' · 'xl' ← Figma `Size` — 콘텐츠 양으로 고름 — md 텍스트·짧은 폼 / lg 표·목록·이미지 / xl 좌석도·달력. Mobile에서는 셋 다 320
- `showClose?`: boolean (기본 true) ← Figma `Show Close` — 끄면 secondaryAction(취소)을 반드시 제공 — 없으면 개발 모드에서 경고
- `padding?`: 'default' · 'none' ← Figma `Padding` — default 좌우 20 / none 전폭
- `primaryAction?`: { label: string; onClick: () => void; disabled?: boolean | undefined; } ← Figma `Action` — primaryAction만 = Primary Only. 없으면 ActionArea를 그리지 않는다
- `secondaryAction?`: { label: string; onClick: () => void; } ← Figma `Action` — primaryAction과 함께 = Dual Equal(왼쪽 outlined 버튼). 액션은 최대 2개
- `safeArea?`: boolean ← Figma `Show Safe Area` — 모바일에서 뜨면 켬(하단 안전영역)
- `children`: ReactNode ← Figma `Slot` — Body 콘텐츠(하한 80px). Body만 스크롤된다

### `DialogPanel`
The Dialog surface (Header · Body · ActionArea) without the modal layer. Used by Dialog and by static docs examples.
`import { DialogPanel } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-dialog--design · Figma 가이드 node `13832:3025`

- `onClose?`: () => void — 닫기 버튼을 눌렀을 때
- `ids?`: { title?: string | undefined; desc?: string | undefined; } — 내부용: 모달이 aria-labelledby · aria-describedby로 연결하는 id
- `title`: string ← Figma `Show Title` — (항상 켬). 명사형 또는 목적을 담은 짧은 문장. 모달에서는 aria-labelledby로 연결된다
- `description?`: string ← Figma `Show Description` — + `Description`. 모달에서는 aria-describedby로 연결된다
- `size?`: 'md' · 'lg' · 'xl' (기본 'md') ← Figma `Size` — 콘텐츠 양으로 고름 — md 텍스트·짧은 폼 / lg 표·목록·이미지 / xl 좌석도·달력. Mobile에서는 셋 다 320
- `showClose?`: boolean (기본 true) ← Figma `Show Close` — 끄면 secondaryAction(취소)을 반드시 제공 — 없으면 개발 모드에서 경고
- `padding?`: 'default' · 'none' (기본 'default') ← Figma `Padding` — default 좌우 20 / none 전폭
- `primaryAction?`: { label: string; onClick: () => void; disabled?: boolean | undefined; } ← Figma `Action` — primaryAction만 = Primary Only. 없으면 ActionArea를 그리지 않는다
- `secondaryAction?`: { label: string; onClick: () => void; } ← Figma `Action` — primaryAction과 함께 = Dual Equal(왼쪽 outlined 버튼). 액션은 최대 2개
- `safeArea?`: boolean ← Figma `Show Safe Area` — 모바일에서 뜨면 켬(하단 안전영역)
- `children`: ReactNode ← Figma `Slot` — Body 콘텐츠(하한 80px). Body만 스크롤된다

## Attachment Input

### `AttachmentDropzone`
PC 전용 드래그 앤 드롭 영역. 320 × 120, 점선 1.5(6 · 4). 누르면 파일 고르기
`import { AttachmentDropzone } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-attachment-input--design · Figma 가이드 node `11367:3409`

- `onFiles`: (files: File[]) => void — 파일이 놓이거나 골라졌을 때
- `accept?`: string (기본 'image/*,video/*') — `<input accept>`. 기본 이미지 · 동영상
- `multiple?`: boolean (기본 true)
- `disabled?`: boolean
- `label?`: string (기본 '파일을 이곳에 끌어다 놓거나 클릭하여 업로드') — 큰 문구. 기본 「파일을 이곳에 끌어다 놓거나 클릭하여 업로드」
- `hint?`: string — 작은 문구. 예: 「이미지, 동영상 (최대 10개)」
- `forceDragOver?`: boolean — 문서 전용: Figma `State=Drag Over` 모습을 고정해서 그린다
- `className?`: string

### `AttachmentInput`
첨부 입력. Trigger 옆에 Item을 가로로 나열하고(행 높이 84 · 아래 정렬), PC는 그 위에 Dropzone을 둔다
`import { AttachmentInput } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-attachment-input--design · Figma 가이드 node `11367:3409`

- `items`: AttachmentItemData[] — 지금 첨부된 항목
- `max`: number — 최대 개수. Trigger에 「n/max」로 보이고, 다 차면 Trigger가 Disabled
- `onAdd`: (files: File[]) => void — 파일을 골랐거나(Trigger · Dropzone) 놓았을 때. 남은 자리만큼만 넘긴다
- `onRemove?`: (id: string) => void
- `onRetry?`: (id: string) => void
- `accept?`: string (기본 'image/*,video/*')
- `dropzone?`: boolean (기본 false) — PC에서 Dropzone을 줄 위에 둔다. 모바일 · 앱에서는 쓰지 않는다
- `hint?`: string — Dropzone 작은 문구
- `disabled?`: boolean
- `label?`: string — Trigger 첨부 전 문구
- `className?`: string

### `AttachmentItem`
첨부된 항목 하나의 미리보기. 바깥 84 × 84, 이미지 80 × 80(위 4 내려감), 지우기 24가 오른쪽 위로 4 튀어나온다
`import { AttachmentItem } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-attachment-input--design · Figma 가이드 node `11367:3409`

- `onRemove?`: () => void ← Figma `Show Remove Button` — 넘기면 오른쪽 위 지우기 버튼
- `onRetry?`: () => void — state=error에서 누르면
- `onOpen?`: () => void — 썸네일을 누르면(크게 보기 등)
- `className?`: string
- `id`: string
- `type`: 'image' · 'video' ← Figma `Type`
- `src?`: string — 미리보기(동영상은 대표 화면)
- `name`: string — 스크린리더 이름. 예: 「여권 사진」
- `state?`: 'default' · 'loading' · 'error' · 'disabled' (기본 'default') ← Figma `State` — loading = 올리는 중 · 동영상 변환 중, error = 실패(누르면 재시도)
- `badge?`: boolean ← Figma `Show Badge` — 대표 사진 표시

### `AttachmentTrigger`
첨부를 시작하는 80 × 80 버튼. 카메라 24 + 문구(label/md-emphasized)
`import { AttachmentTrigger } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-attachment-input--design · Figma 가이드 node `11367:3409`

- `count?`: { current: number; max: number; } ← Figma `Content=Count` — 첨부 후 「1/10」. 없으면 `Content=Label`
- `label?`: string (기본 '첨부하기') ← Figma `Label` — 첨부 전 문구. 기본 「첨부하기」
- `forcePressed?`: boolean — 문서 전용: Figma `State=Pressed` 모습을 고정해서 그린다

## Avatar

### `Avatar`
`import { Avatar } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-avatar--design · Figma 가이드 node `8027:557`

- `size?`: 20 · 24 · 32 · 40 · 48 · 56 · 64 · 72 · 80 · 104 (기본 48) ← Figma `Size` — 원의 지름(px). 프레임–원 여백 0. 인스턴스를 리사이즈하지 말고 값을 고른다
- `variant?`: 'photo' · 'filled' · 'line' ← Figma `Variant` — photo · filled · line. 생략하면 src가 있을 때 photo, 없으면 filled. photo인데 src가 없거나 불러오지 못하면 filled로 대체
- `src?`: string — 프로필 사진 URL. 사진은 Variant의 값이 아니라 내용이라 src로 바꾼다
- `name`: string — 누구의 아바타인지(접근 가능한 이름). 배지가 뜻하는 값(등급 등)도 여기에 넣는다. 예: "김하나, 우수 회원"
- `badge?`: ReactNode ← Figma `Show Badge` — + `Badge Content` — 좌측 하단 20px 배지(1:1). 장식이라 aria-hidden. Size 48 이상에서만 표시하고, editable이 켜지면 숨김
- `editable?`: boolean ← Figma `Show Editable` — 우측 하단 카메라 아이콘. 표시 전용이라 탭 영역은 아바타 전체(onClick). Size 48 이상에서만 표시
- `onClick?`: () => void — 있으면 아바타 전체가 <button>이 되고, 누르는 동안 Pressed 스크림이 덮인다
- `forceState?`: 'pressed' ← Figma `State` — 문서용: Pressed 스크림을 고정해서 보여줄 때

### `AvatarGroup`
`import { AvatarGroup } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-avatar--design · Figma 가이드 node `8027:557`

- `size?`: 20 · 24 · 32 · 40 · 48 · 56 · 64 · 72 · 80 · 104 (기본 32) ← Figma `Size` — 각 Avatar의 지름. 겹침은 size/4, 분리 링 2px
- `people`: { name: string; src?: string | undefined; }[] — 표시할 사람. 앞의 5명만 그린다(+N 축은 2026-09-14 보류). 전체 인원은 label로 전달
- `label`: string — 그룹 전체의 접근 가능한 이름. 개별 아바타는 읽지 않는다. 예: "함께 가는 여행자 12명"

## Banner

### `Banner`
프로모션 배너(Figma `Banner`, 10586:26987). 통이미지 한 장 + 선택 페이지 표시.
`import { Banner } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-banner--design · Figma 가이드 node `3471:4174`

- `level?`: '1' · '2' · '3' · '3-wide' · '4' · '5' · '6-wide' (기본 '3') ← Figma `Layout Level` — 높이가 정해진다 — 1 48 · 2 56 · 3 80 · 4 105 · 5 124 (폭 320 비율), 3-wide 80 · 6-wide 180 (폭 360 비율, 모서리 없음)
- `image`: string — 배너 그림. 글자 · 그림이 다 들어간 통이미지다(Figma 가이드 「img는 텍스트, 오브젝트 포함 통이미지」)
- `alt`: string — 그림 안 글자를 그대로 옮긴 대체 텍스트. 통이미지라 스크린리더는 이것만 읽는다
- `href?`: string — 있으면 배너 전체가 링크가 된다
- `onClick?`: (e: MouseEvent<Element, MouseEvent>) => void
- `pagination?`: BannerPagination ← Figma `Show Pagination` — + `Pagination Type`. 없으면 표시하지 않는다
- `className?`: string

## Buttons

### `BottomAction`
Bottom Fixed/Action. 하단 고정 영역의 버튼 조합. 버튼 크기는 조합마다 정해져 있어 바꿀 수 없다.
`import { BottomAction } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `layout?`: 'primary-only' · 'dual-equal' · 'dual-prominent' · 'primary-with-icon' · 'primary-with-metrics' · 'compact-dual' ← Figma `Action` — 버튼 조합. 생략하면 넘긴 것으로 정한다: iconActions가 있으면 primary-with-icon(수치가 있거나 2개면 primary-with-metrics),
- `primaryAction`: BottomActionButton — 주 버튼(오른쪽). compact-dual에서는 오른쪽 보조 버튼이 된다
- `secondaryAction?`: BottomActionButton — 보조 버튼(왼쪽). dual-equal · dual-prominent · compact-dual에서 쓴다
- `iconActions?`: BottomActionIcon[] — 주 버튼 왼쪽의 아이콘 버튼. primary-with-icon은 1개, primary-with-metrics는 2개까지
- `divider?`: boolean (기본 true) ← Figma `Show Divider` — 위쪽 경계 1px 선(`stroke/neutral/subtle`). 기본 true(2026-10-07 결정: 하단 고정 영역의 위쪽 경계는 선이고 그림자는 쓰지 않는다). 이미 경계가 있는 면 위에 놓을 때만 끈다

### `BottomFixed`
Bottom Fixed/Container. Panel(정보)과 Action(버튼)을 세로로 붙인 하단 고정 영역.
`import { BottomFixed } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `panel?`: ReactNode ← Figma `Bottom Fixed/Panel` — 버튼 위 정보 영역. `BottomPanelText` · `BottomPanelDateRange` · `BottomPanelChecklist` · `FilterResult`를 위에서 아래로 넣는다. 없으면 버튼만 그린다
- `layout?`: 'primary-only' · 'dual-equal' · 'dual-prominent' · 'primary-with-icon' · 'primary-with-metrics' · 'compact-dual' ← Figma `Action` — 버튼 조합. 생략하면 넘긴 것으로 정한다: iconActions가 있으면 primary-with-icon(수치가 있거나 2개면 primary-with-metrics),
- `primaryAction`: BottomActionButton — 주 버튼(오른쪽). compact-dual에서는 오른쪽 보조 버튼이 된다
- `secondaryAction?`: BottomActionButton — 보조 버튼(왼쪽). dual-equal · dual-prominent · compact-dual에서 쓴다
- `iconActions?`: BottomActionIcon[] — 주 버튼 왼쪽의 아이콘 버튼. primary-with-icon은 1개, primary-with-metrics는 2개까지
- `divider?`: boolean (기본 true) ← Figma `Show Divider` — 위쪽 경계 1px 선(`stroke/neutral/subtle`). 기본 true(2026-10-07 결정: 하단 고정 영역의 위쪽 경계는 선이고 그림자는 쓰지 않는다). 이미 경계가 있는 면 위에 놓을 때만 끈다

### `BottomPanelChecklist`
Bottom Fixed/Panel · Checklist. 약관 동의처럼 버튼을 누르기 전에 체크해야 하는 항목 묶음
`import { BottomPanelChecklist } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `children`: ReactNode — `CheckboxItem`(small)들

### `BottomPanelDateRange`
Bottom Fixed/Panel · Date Range · Hotel Summary. 여러 줄을 이어 넣으면 둘째 줄부터 위에 1px 선이 생긴다(Multi Date Range)
`import { BottomPanelDateRange } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `start`: BottomPanelDate — 시작(왼쪽)
- `end`: BottomPanelDate — 끝(오른쪽, 오른쪽 정렬)
- `nights?`: string ← Figma `Panel=Hotel Summary` — 넘기면 가운데 화살표 대신 숙박 수 배지가 들어간다. 예: "2박"

### `BottomPanelText`
Bottom Fixed/Panel · Text. 레이블 + 값 두 줄 요약. Package Summary의 요약 블록도 이것이다
`import { BottomPanelText } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `label`: string — 위 줄의 작은 레이블. 예: "가는날"
- `value`: ReactNode — 아래 줄의 값. 예: "02.02(월)"

### `Button`
`import { Button } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `variant?`: 'solid' · 'outlined' · 'text' (기본 'solid') ← Figma `컴포넌트 세트` — Button/Filled(+ /Dual Label) → solid · Button/Outlined(+ /Dual Label) → outlined · Button/Text → text
- `tone?`: 'primary' · 'secondary' · 'neutral' · 'assistive' · 'white' · 'default' · 'grey' ← Figma `Type` — outlined: primary · secondary · neutral · assistive · white(기본 primary) / text: default · secondary · grey · white(기본 default). solid에는 없어 무시됨. HTML type 속성과 겹쳐 tone으로 이름을 바꿈
- `size?`: 'xxlarge' · 'xlarge' · 'large' · 'medium' · 'small' · 'xsmall' (기본 'large') ← Figma `Size` — 높이 56 · 48 · 40 · 32 · 28 · 20. text에는 xxlarge가 없어 xlarge로 보정됨
- `label`: string ← Figma `Label` — 버튼의 접근 가능한 이름
- `leadingIcon?`: ReactNode ← Figma `Show Leading Icon` — solid · outlined 전용(text에서는 무시). aria-hidden으로 렌더
- `trailingIcon?`: ReactNode ← Figma `Show Trailing Icon` — solid · outlined 전용(text에서는 무시). aria-hidden으로 렌더
- `arrow?`: boolean (기본 true) ← Figma `Show Arrow` — text 전용. 라벨 오른쪽 Chevron. disabled에서는 숨김. 기본 true(Figma 기본 On과 같음). 이동이 아닌 텍스트 버튼은 false
- `underline?`: boolean (기본 false) ← Figma `Show Underline` — text 전용. 링크 성격을 드러낼 때 라벨에 밑줄
- `subLabel?`: string ← Figma `Sub Label` — Dual Label 세트. solid · outlined의 xxlarge에서만 표시되고, 다른 Size에서는 무시됨
- `subLabelPosition?`: 'left' · 'top' (기본 'left') ← Figma `Sub Label Position` — outlined assistive는 값과 상관없이 항상 top
- `fullWidth?`: boolean — 부모 너비를 채움(가이드 Width Behavior의 Full). 기본은 라벨 길이만큼(Hug)
- `forceState?`: 'pressed' · 'focus' — 문서 · QA용: Pressed · Focus 모습을 고정 표시. 실제 화면에서는 넘기지 않음(:active · :focus-visible이 처리)
- `type?`: 'button' · 'submit' · 'reset' (기본 'button') — HTML type. 기본 button이라 form 안에서도 제출하지 않음. 제출 버튼에만 submit

### `FieldButton`
Button/Field. 텍스트 필드 옆 · 안에 붙는 버튼.
`import { FieldButton } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `tone?`: 'assistive' · 'solid' (기본 'assistive') ← Figma `Type` — assistive = 흰 배경 + 1px 테두리(보조 행동), solid = 브랜드 채움(주 행동). HTML type 속성과 겹쳐 tone으로 이름을 바꿈
- `size?`: 'small' · 'large' · 'xlarge' · 'xxlarge' (기본 'small') ← Figma `Size` — small 28은 필드 안, large 40 · xlarge 48 · xxlarge 56은 같은 높이의 필드 옆
- `label`: string ← Figma `Label` — 버튼의 접근 가능한 이름. 버튼 폭이 문구 길이를 따르므로 짧게 쓴다
- `forceState?`: 'pressed' · 'focus' — 문서 · QA용: Pressed · Focus 모습을 고정 표시. 실제 화면에서는 넘기지 않음
- `type?`: 'button' · 'submit' · 'reset' — HTML type. 기본 button이라 form 안에서도 제출하지 않음

### `FilterResult`
Filter Result. 고른 필터 조건을 한 줄로 요약해 보여주는 바. 하단 고정 영역(Bottom Fixed/Panel) 안에서 쓴다.
`import { FilterResult } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `chips?`: FilterResultChip[] (기본 '[]') — 적용된 조건 목록. 비어 있으면 Figma `Content State=Empty`(안내 문구)가 된다. Content State를 따로 받지 않는다
- `onReset?`: () => void ← Figma `Show Reset` — 넘기면 칩 앞에 초기화 버튼이 보이고, 누르면 불린다. 조건이 없으면(Empty) 버튼은 숨는다
- `onRemove?`: (id: string) => void — Figma: 칩의 `Show Close` 켬. 넘기면 칩마다 닫기(×)가 붙고, 칩을 누르면 그 조건의 `id`로 불린다. 넘기지 않으면 칩은 표시만 한다
- `emptyMessage?`: string (기본 '상세 조건을 선택해서 정확한 상품을 검색해보세요') — Empty일 때의 안내 문구
- `label?`: string (기본 '적용된 조건') — 조건 목록의 이름(aria-label)
- `resetLabel?`: string (기본 '조건 초기화') — 초기화 버튼의 이름(aria-label)

### `FloatingAction`
Button/Floating Action. 화면 위에 떠서 스크롤과 무관하게 누를 수 있는 필(pill) 모양 버튼.
`import { FloatingAction } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `items`: [FloatingActionItem] | [FloatingActionItem, FloatingActionItem] ← Figma `Action Count` — 액션 1개(Single) 또는 2개(Double). 2개면 사이에 구분선이 들어간다. 3개 이상은 Figma에 없다
- `label?`: string — 액션이 2개일 때 묶음의 이름(aria-label). 예: "목록 조건"

### `IconButton`
Button/Icon. 아이콘만 있거나 아이콘 + 수치로 된 원형 버튼.
`import { IconButton } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-button--design · Figma 가이드 node `13837:5947`

- `icon`: ReactNode — 버튼 안의 아이콘. Figma에서는 중첩 인스턴스를 교체하는 자리. 크기는 버튼이 정한다(xlarge 24 · medium 16 · 수치가 있으면 16)
- `label`: string — 버튼의 접근 가능한 이름(aria-label). 보이는 글자가 없으므로 꼭 넘긴다. 예: "찜하기"
- `count?`: string | number ← Figma `Type=Icon With Label` — + `Label`. 아이콘 아래 수치(리뷰 수 · 찜 수). size가 xlarge일 때만 보이고 medium에서는 무시됨. 3자 안쪽으로 쓴다
- `size?`: 'xlarge' · 'medium' (기본 'medium') ← Figma `Size` — xlarge 48 · medium 32
- `selected?`: boolean — 켜고 끄는 버튼일 때의 현재 상태(aria-pressed). 켜지면 아이콘 색이 `fg/brand/primary`가 된다. 채워진(Filled) 아이콘은 `icon`으로 바꿔 넘긴다
- `forceState?`: 'pressed' · 'focus' — 문서 · QA용: Pressed · Focus 모습을 고정 표시. 실제 화면에서는 넘기지 않음
- `type?`: 'button' · 'submit' · 'reset' (기본 'button') — HTML type. 기본 button

## Bottom Navigation

### `BottomNavigation`
화면 하단에 고정하는 앱 내비게이션(Figma `Bottom Navigation`, 10260:37037).
`import { BottomNavigation } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-bottom-navigation--design · Figma 가이드 node `16458:21854`

- `items`: BottomNavigationItem[] — 목적지 탭. Figma는 Home · Manlevel · My · Like 네 칸이고, Hai가 다섯째 칸이다
- `current?`: string — 지금 화면의 목적지 `key`. 이 탭이 Selected가 되고 `aria-current="page"`를 받는다
- `onNavigate?`: (key: string, event: MouseEvent<Element, MouseEvent>) => void — 목적지 탭을 눌렀을 때. `href`가 있는 탭도 불린다
- `platform?`: 'ios' · 'android' · 'web' (기본 'web') ← Figma `Platform` — 바닥 여백만 바뀐다 — iOS 20 · Android 8 · Web 12. 기본 web
- `scrollState?`: 'default' · 'scrolled' (기본 'default') ← Figma `Scroll State` — scrolled면 목적지 탭이 사라지고 Top과 Hai만 오른쪽에 뜬다. Web에는 없다
- `onHai?`: () => void — Hai(AI) 버튼을 눌렀을 때
- `haiLabel?`: string (기본 '하이에게 물어보기') — Hai 버튼의 이름(aria-label). 기본 「하이에게 물어보기」
- `onTop?`: () => void — scrolled에서 Top 버튼을 눌렀을 때. 보통 `window.scrollTo({ top: 0 })`
- `label?`: string (기본 '주요 메뉴') — nav 영역 이름(aria-label). 기본 「주요 메뉴」
- `className?`: string

## Bottom Sheet

### `BottomSheet`
Bottom Sheet. 닫혀도 DOM에 남아 있어서 내부 입력값이 보존된다 —
`import { BottomSheet } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-bottom-sheet--design · Figma 가이드 node `7789:1527`

- `open`: boolean — 열림 상태. 앱이 들고 있는다(제어 컴포넌트). false가 되면 퇴장 모션 200ms 뒤 닫힌다
- `onClose`: () => void — 닫기 요청: 배경 탭(handle) · 쓸어내리기(handle) · 닫기 버튼(close) · Esc · 뒤로가기. 여기서 open을 false로 바꾼다
- `initialDetent?`: 'half' · 'full' (기본 'half') — 처음 열리는 높이. Handle 시트에서 콘텐츠가 화면의 50%를 넘을 때만 쓰인다 — 닫기 버튼 시트는 콘텐츠 높이(최대 90%)로 고정.
- `title`: string ← Figma `Show Title` — (항상 켬). 시트 제목, 최대 2줄. 물음표로 끝내지 않는다. 모달에서는 aria-labelledby로 연결된다
- `description?`: string ← Figma `Show Description` — + `Description`. 최대 3줄, Title로 부족할 때만. 모달에서는 aria-describedby로 연결된다
- `dismiss?`: 'handle' · 'close' (기본 'handle') ← Figma `Show Handle` — + `Show Close`. 닫힘 정책은 시트 종류를 따라간다 (2026-08-21, 별도 프로퍼티 없음).
- `headerAlign?`: 'left' · 'center' ← Figma `Align` — center는 Bottom Sheet 전용
- `padding?`: 'default' · 'none' ← Figma `Padding` — default 좌우 20 / none 전폭(List Cell처럼 행 전체가 터치 영역인 콘텐츠)
- `primaryAction?`: { label: string; onClick: () => void; disabled?: boolean | undefined; } ← Figma `Action` — primaryAction만 = Primary Only. 없으면 ActionArea를 그리지 않는다
- `secondaryAction?`: { label: string; onClick: () => void; } ← Figma `Action` — primaryAction과 함께 = Dual Equal(왼쪽 outlined 버튼). primaryAction 없이 단독으로는 그리지 않는다
- `safeArea?`: boolean ← Figma `Show Safe Area` — 하단 안전영역 20px, OS inset이 더 크면 그 값
- `children`: ReactNode ← Figma `Slot` — Body 콘텐츠. Body만 스크롤된다

### `BottomSheetPanel`
The sheet surface (Header · Body · ActionArea · SafeAreaSpacer) without the modal layer. Used by BottomSheet and by static docs examples.
`import { BottomSheetPanel } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-bottom-sheet--design · Figma 가이드 node `7789:1527`

- `onClose?`: () => void — 닫기 버튼(dismiss="close")을 눌렀을 때
- `ids?`: { title?: string | undefined; desc?: string | undefined; } — 내부용: 모달이 연결하는 제목 · 설명 id
- `headerProps?`: HTMLAttributes<HTMLDivElement> — 내부용: 모달이 Header에 거는 드래그 핸들러
- `handleButton?`: { label: string; expanded: boolean; onClick: (e?: MouseEvent<Element, MouseEvent> | undefined) => void; } — 내부용: Half · Full 높이 전환이 있을 때 핸들을 버튼으로 만든다(탭 = 높이 전환, WCAG 2.5.7)
- `title`: string ← Figma `Show Title` — (항상 켬). 시트 제목, 최대 2줄. 물음표로 끝내지 않는다. 모달에서는 aria-labelledby로 연결된다
- `description?`: string ← Figma `Show Description` — + `Description`. 최대 3줄, Title로 부족할 때만. 모달에서는 aria-describedby로 연결된다
- `dismiss?`: 'handle' · 'close' (기본 'handle') ← Figma `Show Handle` — + `Show Close`. 닫힘 정책은 시트 종류를 따라간다 (2026-08-21, 별도 프로퍼티 없음).
- `headerAlign?`: 'left' · 'center' (기본 'left') ← Figma `Align` — center는 Bottom Sheet 전용
- `padding?`: 'default' · 'none' (기본 'default') ← Figma `Padding` — default 좌우 20 / none 전폭(List Cell처럼 행 전체가 터치 영역인 콘텐츠)
- `primaryAction?`: { label: string; onClick: () => void; disabled?: boolean | undefined; } ← Figma `Action` — primaryAction만 = Primary Only. 없으면 ActionArea를 그리지 않는다
- `secondaryAction?`: { label: string; onClick: () => void; } ← Figma `Action` — primaryAction과 함께 = Dual Equal(왼쪽 outlined 버튼). primaryAction 없이 단독으로는 그리지 않는다
- `safeArea?`: boolean (기본 true) ← Figma `Show Safe Area` — 하단 안전영역 20px, OS inset이 더 크면 그 값
- `children`: ReactNode ← Figma `Slot` — Body 콘텐츠. Body만 스크롤된다

## Calendar

### `Calendar`
한 달 달력(Figma `Calendar/Header` + `Calendar/Day Of Week` + `Calendar/Day`).
`import { Calendar } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-calendar--design · Figma 가이드 node `822:878`

- `month`: string — 보여줄 달 `YYYY-MM`
- `days?`: { [x: string]: CalendarDayData; } (기본 '{}') — 날짜별 라벨 · 공휴일 · 비활성. 키는 `YYYY-MM-DD`
- `mode?`: 'single' · 'range' (기본 'single') — single은 하루, range는 시작 · 끝 두 번 눌러 기간
- `value?`: string | [string, (string | undefined)?] — 고른 값. single은 `YYYY-MM-DD`, range는 `[시작, 끝]`(끝은 아직 없을 수 있음)
- `onChange?`: (value: string | [string, (string | undefined)?]) => void
- `today?`: string — 오늘 `YYYY-MM-DD`. 넘기면 「오늘」 라벨과 회색 원
- `min?`: string — 이 날짜 이전은 고를 수 없다(`YYYY-MM-DD`)
- `max?`: string — 이 날짜 이후는 고를 수 없다
- `showMonthTitle?`: boolean (기본 true) ← Figma `Calendar/Header` — 의 `Show Month Title`. 여러 달을 이어 붙일 때 첫 달만 켠다
- `size?`: 'default' · 'small' (기본 'default') ← Figma `Calendar/Month Title` — 의 `Size`. small은 여러 달을 한 화면에 늘어놓을 때
- `monthSelect?`: { checked: boolean; onChange: (checked: boolean) => void; label?: string | undefined; } ← Figma `Show Month Select` — 「월 전체」 체크(Checkbox Item Small, 라벨만)
- `className?`: string

### `CalendarDay`
날짜 한 칸(Figma `Calendar/Day` 2646:2744). 48 × 49, 원 28, 숫자 14 SemiBold, 라벨 11 Bold
`import { CalendarDay } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-calendar--design · Figma 가이드 node `822:878`

- `day`: number — 날짜 숫자
- `selection?`: 'none' · 'single' · 'start' · 'end' · 'in-range' · 'middle' — 선택 맥락. single · start · end · middle은 보라 원, start · end · in-range · middle은 구간 띠
- `holiday?`: boolean — 휴일(일 · 토 · 공휴일). 선택되지 않은 날의 숫자가 fg/critical/primary
- `today?`: boolean — 오늘. 회색 원(bg/neutral/subtle)
- `label?`: string — 아래 라벨 문구(98만 · 공휴일 · 가는날 …)
- `tone?`: 'price' · 'lowest' · 'mid' · 'highest' · 'info' · 'marker' · 'today' — 아래 라벨의 뜻. 기본 price
- `disabled?`: boolean — 고를 수 없는 날
- `forceFocus?`: boolean — 문서 전용: 포커스 링을 고정해서 그린다
- `fluid?`: boolean — 칸이 놓인 폭을 채운다(Date Picker). 기본은 48 고정
- `ariaLabel?`: string — 스크린리더 이름. 없으면 숫자와 라벨로 만든다
- `onClick?`: (() => void) & MouseEventHandler<HTMLButtonElement>
- `tabIndex?`: number
- `className?`: string

## Pagination

### `CarouselCounter`
Carousel Indicator/Overlay — 사진 위에 얹는 배지형 위치 표시
`import { CarouselCounter } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-pagination--design · Figma 가이드 node `9886:296`

- `type?`: 'number' · 'media' · 'more' (기본 'number') — Number는 1/20, Media는 사진 아이콘 + 1/20, More는 1/20 + 「전체보기」 +
- `current`: number
- `total`: number
- `onMore?`: () => void — type='more'에서 누르면 전체보기로 간다. 주면 버튼이 된다
- `moreLabel?`: string (기본 '전체보기')
- `className?`: string

### `CarouselDots`
Carousel Indicator/Dot — 표시 전용. 현재 위치를 점으로
`import { CarouselDots } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-pagination--design · Figma 가이드 node `9886:296`

- `total`: number — 전체 개수. Figma는 5개로 그려져 있지만 코드는 개수만큼 그린다
- `current`: number — 지금 위치(1부터)
- `color?`: 'default' · 'white' (기본 'default') — Default는 밝은 배경, White는 사진 · 어두운 배경 위
- `className?`: string

### `Pagination`
Pagination/Directional — 좌우 화살표로 페이지를 옮긴다
`import { Pagination } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-pagination--design · Figma 가이드 node `9886:296`

- `type?`: 'standard' · 'infinite' (기본 'standard') — Standard는 처음과 끝이 있어 끝에서 화살표가 꺼지고, Infinite는 끝에서 처음으로 돈다
- `indicator?`: 'count' · 'dot' (기본 'count') — Count는 1/5 숫자, Dot는 점
- `page?`: number — 지금 페이지(1부터)
- `defaultPage?`: number (기본 1)
- `total`: number
- `onPageChange?`: (page: number) => void
- `previousLabel?`: string (기본 '이전 페이지')
- `nextLabel?`: string (기본 '다음 페이지')
- `className?`: string

## Selection Controls

### `Checkbox`
`import { Checkbox } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design · Figma 가이드 node `10082:2721`

- `size?`: 16 · 20 · 24 (기본 20) ← Figma `Size` — 컨트롤 한 변(px) 16 · 20 · 24
- `indeterminate?`: boolean (기본 false) ← Figma `Selection=Partial` — 일부만 선택된 상태. 네이티브 indeterminate + aria-checked="mixed"로 렌더링하며, checked와 별개로 넘긴다

### `CheckboxItem`
`import { CheckboxItem } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design · Figma 가이드 node `10082:2721`

- `size?`: 'xsmall' · 'small' · 'medium' (기본 'small') ← Figma `Size` — 컨트롤 크기와 글자 스타일을 함께 정한다: xsmall 16 · small 20 · medium 24
- `label`: ReactNode ← Figma `Label` — `<label>` 안에 들어가 체크박스의 이름이 된다
- `helper?`: ReactNode ← Figma `Show Helper Text` — 라벨 아래 보조 문구. 없으면 그리지 않는다
- `icon?`: boolean (기본 false) ← Figma `Show Icon` — 라벨 뒤 chevron(12 · medium 16). 약관 상세처럼 더 볼 내용이 있음을 알리는 표시이며, 장식이라 스크린리더에는 읽히지 않는다
- `indeterminate?`: boolean ← Figma `Selection=Partial` — 일부만 선택된 상태. 네이티브 indeterminate + aria-checked="mixed"로 렌더링하며, checked와 별개로 넘긴다

### `Radio`
`import { Radio } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design · Figma 가이드 node `10082:2721`

- `size?`: 20 · 24 (기본 20) ← Figma `Size` — 컨트롤 한 변(px) 20 · 24

### `RadioItem`
`import { RadioItem } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design · Figma 가이드 node `10082:2721`

- `size?`: 'small' · 'medium' (기본 'small') ← Figma `Size` — 컨트롤 크기와 글자 스타일을 함께 정한다: small 20 · medium 24
- `label`: ReactNode — 라벨 문구. `<label>` 안에 들어가 라디오의 이름이 된다
- `helper?`: ReactNode ← Figma `Helper Text` — + `Show Helper Text`. 넘기면 라벨 아래에 보조 문구를 그린다

### `RadioSegmented`
Figma `Radio/Segmented` — 값을 입력하는 2지 택일. 칸 48×48 두 개, 바깥 모서리만 radius 8.
`import { RadioSegmented } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design · Figma 가이드 node `10082:2721`

- `options`: { value: string; label: string; }[] — 선택지. 2개 고정(예: 남/여). 3개 이상이면 RadioItem 목록을 쓴다 — 가이드의 Don't 예시를 그리기 위해서만 배열을 받는다
- `label`: string — 그룹 이름(radiogroup의 aria-label). 스크린리더가 읽는 이름. 예: "성별"
- `name?`: string — 네이티브 radio의 name. 폼 제출 키가 된다. 생략하면 자동 생성
- `value?`: string ← Figma `Selection` — None · Leading · Trailing을 고른 값으로 표현한다. 제어 모드이며, 선택 없음은 빈 문자열('')
- `defaultValue?`: string — 비제어 모드의 처음 값. 생략하면 선택 없음(Figma 기본 Selection=None)으로 시작한다
- `onChange?`: (value: string) => void — 칸을 고를 때 그 칸의 value로 불린다. 이미 선택된 칸을 다시 눌러도 해제되지 않는다
- `disabled?`: boolean ← Figma `State=Disabled` — 두 칸 모두 비활성

### `ToggleSwitch`
`import { ToggleSwitch } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design · Figma 가이드 node `10082:2721`

- `size?`: 'small' · 'medium' (기본 'small') ← Figma `Size` — small 40×24 · medium 56×32

## Chips

### `ChipGroup`
`import { ChipGroup } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-chips--design · Figma 가이드 node `542:3650`

- `children`: ReactNode
- `scroll?`: boolean (기본 false) — 한 줄 가로 스크롤. 꺼져 있으면 줄바꿈. 칩 사이 간격은 spacing-2(8)
- `label?`: string — 묶음의 목적(aria-label). 스크린리더가 그룹 이름으로 읽습니다
- `selectionMode?`: 'multiple' · 'single' (기본 'multiple') — `single`이면 radiogroup이 되고, 방향키로 칩 사이를 이동하며 고릅니다(ChoiceChip의 selectionMode와 같이 씁니다)

### `ChoiceChip`
`import { ChoiceChip } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-chips--design · Figma 가이드 node `542:3650`

- `label`: string ← Figma `Label`
- `selected?`: boolean (기본 false) ← Figma `State=Selected` — multiple이면 aria-pressed, single이면 aria-checked
- `icon?`: ReactNode ← Figma `icon` — 슬롯(16×16). 선택지를 알아보게 하는 아이콘
- `selectionMode?`: 'multiple' · 'single' (기본 'multiple') — 선택 방식. `multiple`(기본) — 여러 개를 켜고 끄는 토글 버튼. `single` — 하나만 고르는 라디오.

### `FilterChip`
`import { FilterChip } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-chips--design · Figma 가이드 node `542:3650`

- `label`: string ← Figma `Label`
- `kind?`: 'option' · 'dropdown' (기본 'option') ← Figma `Type` — option(켜고 끄는 필터) · dropdown(바텀시트 등으로 값 선택). HTML type 속성과 겹쳐 kind로 이름을 바꿈
- `size?`: 32 · 36 · 40 (기본 32) ← Figma `Size`
- `selected?`: boolean (기본 false) ← Figma `State=Selected` — option은 토글 상태, dropdown은 "값이 골라져 있음"
- `leadingIcon?`: ReactNode ← Figma `Show Leading Icon`
- `closeIcon?`: boolean (기본 false) ← Figma `Show Close` — kind=option 전용. 적용된 필터임을 × 로 표시 — 표시 전용이라 누르면 칩 전체가 토글됨

### `SelectChip`
`import { SelectChip } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-chips--design · Figma 가이드 node `542:3650`

- `label`: string ← Figma `Label`
- `selected?`: boolean (기본 false) ← Figma `State=Selected` — 삭제 없는 칩이면 토글 상태(aria-pressed)
- `onRemove?`: () => void ← Figma `Show Close` — 넘기면 닫기 아이콘을 표시하고, 칩 전체가 제거 버튼이 됨

## Tab/Line

### `ChipTabs`
Tab/Chip · Tab/Chip Group(Depth=1). 필(pill) 배경으로 선택을 표시하는 2차 분류용 탭.
`import { ChipTabs } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tabs--design · Figma 가이드 node `13975:34950`

- `items`: TabItem[] — 탭 목록(`ChipTabItem[]`). Tabs와 달리 항목이 1개여도 행을 그린다
- `variant?`: 'filled' · 'outlined' (기본 'filled') ← Figma `Variant` — filled = 처음부터 하나가 선택돼 있는 행, outlined = 아무것도 고르지 않은 채 시작하는 행. 선택된 탭은 두 경우 모두 `color`로 채워진다
- `size?`: 'small' · 'medium' · 'large' (기본 'medium') ← Figma `Size` — small 32 · medium 36 · large 40
- `color?`: 'black' · 'blue' · 'blue-light' · 'purple' · 'purple-light' (기본 'black') ← Figma `Color` — Tab Item의 선택 색을 행 단위로 올린 것
- `defaultValue?`: string — 비제어 모드의 처음 선택 탭 id. 생략하면 filled는 첫 번째 활성 탭, outlined는 선택 없음
- `value?`: string ← Figma `State=Selected` — 선택된 탭 id(제어 모드). `null`은 선택 없음. 넘기면 onChange에서 직접 바꿔야 한다
- `onChange?`: (id: string) => void — 탭을 누르거나 화살표 · Home · End로 옮길 때 새 탭 id로 불린다
- `label?`: string — 탭 목록 이름(tablist의 aria-label). 스크린리더가 읽는다
- `expandable?`: boolean (기본 false) ← Figma `Tab/Chip Group` — 켜면 가로 스크롤 대신 행을 좌우 여백 안에서 자르고, 한 줄에 다 안 들어갈 때 오른쪽에 펼침 버튼을 보여준다. 끄면(기본) 화면 끝까지 가로 스크롤
- `defaultExpanded?`: boolean (기본 false) ← Figma `Expand` — 비제어 모드에서 처음부터 펼쳐 둘지
- `expanded?`: boolean ← Figma `Expand` — 펼침 상태(제어 모드). 넘기면 onExpandedChange에서 직접 바꿔야 한다
- `onExpandedChange?`: (expanded: boolean) => void — 펼침 버튼을 누를 때 새 상태로 불린다
- `className?`: string — 감싸는 요소에 붙일 클래스

### `Tabs`
Tab/Line. 항목이 1개 이하면 탭 행을 렌더링하지 않고 콘텐츠만 보여준다 (2026-09-14 확정).
`import { Tabs } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tabs--design · Figma 가이드 node `13975:34950`

- `items`: TabItem[] — 탭 목록(`TabItem[]`). 1개 이하면 탭 행 없이 첫 항목의 content만 렌더링한다
- `alignment?`: 'fixed' · 'fluid' (기본 'fixed') ← Figma `Alignment` — fixed = 균등 분할(탭당 44px 이상일 때만), fluid = 내용 폭 + 가로 스크롤
- `size?`: 'large' · 'small' (기본 'large') ← Figma `Size` — large 48 · small 40
- `color?`: 'black' · 'purple' (기본 'black') ← Figma `Color` — Tab Item의 선택 색을 행 단위로 올린 것. black(기본) · purple
- `defaultValue?`: string — 비제어 모드의 처음 선택 탭 id. 생략하면 첫 번째 활성 탭
- `value?`: string ← Figma `State=Selected` — 선택된 탭 id(제어 모드). 넘기면 onChange에서 직접 바꿔야 한다
- `onChange?`: (id: string) => void — 탭을 누르거나 화살표 · Home · End로 옮길 때 새 탭 id로 불린다
- `label?`: string — 탭 목록 이름(tablist의 aria-label). 스크린리더가 읽는다

## Copy

### `Copy`
Copy — 옆의 값을 클립보드에 담는 트리거. 스크린 리더에는 결과를 직접 알린다
`import { Copy } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-copy--design · Figma 가이드 node `12838:16523`

- `type?`: 'icon-only' · 'text-line' · 'text-icon' (기본 'icon-only') — Icon Only 아이콘만 · Text Line 「복사」 + 밑줄 · Text Icon 「복사」 + 복사 아이콘 12
- `value`: string — 복사할 값
- `target`: string — 무엇을 복사하는지. 「예약번호」면 버튼 이름이 「예약번호 복사」
- `onCopy?`: (ok: boolean) => void — 복사가 끝나면 부른다. 화면 피드백(Toast 등)은 여기서 붙인다
- `className?`: string

## Counter

### `Counter`
수량을 1씩 늘리고 줄이는 조절기(Figma `Counter` 9102:1633 = Counter/Minus + Counter/Number + Counter/Plus).
`import { Counter } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-counter--design · Figma 가이드 node `4290:653`

- `value?`: number — 지금 수량(제어)
- `defaultValue?`: number — 처음 수량(비제어). 기본은 min
- `onChange?`: (value: number) => void
- `min?`: number (기본 0) — 최솟값. 닿으면 Counter/Minus가 Disabled. 기본 0
- `max?`: number (기본 99) — 최댓값. 닿으면 Counter/Plus가 Disabled. 기본 99
- `disabled?`: boolean (기본 false) — 값 자체를 못 바꿀 때. 세 부품이 모두 Disabled(Counter/Number State=Disabled)
- `label`: string — 무엇의 수량인지(스크린리더 이름). 예: 「성인」
- `holdToRepeat?`: boolean (기본 true) — 길게 누르면 연속으로 증감. 기본 켬(상한이 10을 넘는 화면에 필요)
- `forcePressed?`: 'minus' · 'plus' — 문서 전용: Figma `State=Pressed` 모습을 고정해서 그린다
- `className?`: string

### `CounterItem`
라벨과 Counter를 한 행으로 묶은 항목(Figma `Counter Item` 9502:3257). 폭은 놓인 영역을 채우고 라벨과 Counter를 양끝에 둔다
`import { CounterItem } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-counter--design · Figma 가이드 node `4290:653`

- `layout?`: 'inline' · 'stacked' (기본 'inline') ← Figma `Layout` — inline = 라벨 한 줄(문구가 짧고 가로 여유가 있을 때) · stacked = 라벨 위 · 가격 아래 두 줄(가격을 함께 보일 때)
- `price?`: number — 가격. stacked에서 라벨 아래 title/md-strong + 「원」
- `description?`: string ← Figma `Show Description` — 보조 설명(만 2세 미만 · 최소 1개 / 최대 20개). label/md fg/neutral/subtle
- `tooltip?`: string ← Figma `Show Icon` — 라벨 옆 물음표(Tooltip/Trigger Icon)를 누르면 이 설명이 Tooltip으로 뜬다
- `value?`: number — 지금 수량(제어)
- `defaultValue?`: number — 처음 수량(비제어). 기본은 min
- `onChange?`: (value: number) => void
- `min?`: number — 최솟값. 닿으면 Counter/Minus가 Disabled. 기본 0
- `max?`: number — 최댓값. 닿으면 Counter/Plus가 Disabled. 기본 99
- `disabled?`: boolean — 값 자체를 못 바꿀 때. 세 부품이 모두 Disabled(Counter/Number State=Disabled)
- `label`: string — 무엇의 수량인지(스크린리더 이름). 예: 「성인」
- `holdToRepeat?`: boolean — 길게 누르면 연속으로 증감. 기본 켬(상한이 10을 넘는 화면에 필요)
- `forcePressed?`: 'minus' · 'plus' — 문서 전용: Figma `State=Pressed` 모습을 고정해서 그린다
- `className?`: string

## Date Picker

### `DatePicker`
한 달 달력에서 날짜를 고르는 컴포넌트. 머리글 + 요일 줄 + 날짜 칸(Calendar/Day)
`import { DatePicker } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design · Figma 가이드 node `20016:2`

- `layout?`: 'inline' · 'popover' · 'sheet' (기본 'popover') ← Figma `Layout` — inline = 화면 흐름 안(놓인 폭을 채움) · popover = PC · 태블릿(360 고정, 표면 · 그림자) · sheet = 바텀시트 본문(놓인 폭을 채움, 시트는 DatePickerSheet가 그린다)
- `selection?`: 'single' · 'range' (기본 'single') ← Figma `Selection` — single = 하루 · range = 시작일 ~ 종료일
- `value?`: string | [string, (string | undefined)?] — 고른 값(제어). single은 `YYYY-MM-DD`, range는 `[시작, 끝?]`
- `defaultValue?`: string | [string, (string | undefined)?]
- `onChange?`: (value: DatePickerValue) => void
- `onComplete?`: (value: DatePickerValue) => void — single은 날짜를 누를 때, range는 종료일을 누를 때. Popover는 여기서 닫는다
- `month?`: string — 보이는 달 `YYYY-MM`(제어). 없으면 고른 날짜의 달, 그다음 오늘이 속한 달
- `defaultMonth?`: string
- `onMonthChange?`: (month: string) => void
- `today?`: string — 오늘 `YYYY-MM-DD`. 「오늘」 라벨과 회색 원
- `min?`: string — 고를 수 있는 첫날 · 마지막 날 `YYYY-MM-DD`. 그 달 밖으로는 이전 · 다음 버튼이 Disabled
- `max?`: string
- `days?`: { [x: string]: CalendarDayData; } (기본 '{}') — 날짜별 라벨 · 공휴일 · 비활성. 키는 `YYYY-MM-DD`
- `showMonthYear?`: boolean (기본 true) ← Figma `Show Dropdown Icon` — 머리글 연 · 월을 눌러 휠로 건너뛰기
- `defaultView?`: 'date' · 'month-year' (기본 'date') — 문서 전용: 처음 보여줄 화면. Figma `View`
- `ariaLabel?`: string (기본 '날짜 선택') — 스크린리더 이름. 기본 「날짜 선택」
- `className?`: string

### `DatePickerHeader`
달력 머리글. 왼쪽 연 · 월(body/lg-strong), 오른쪽 이전 · 다음. 높이 48, 왼쪽 안쪽 여백 8
`import { DatePickerHeader } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design · Figma 가이드 node `20016:2`

- `month`: string — 보고 있는 달 `YYYY-MM`. 「2026.10」으로 그린다
- `expanded?`: boolean (기본 false) ← Figma `Expand` — 연 · 월 고르는 화면이 열렸는지
- `showDropdown?`: boolean (기본 true) ← Figma `Show Dropdown Icon` — 연 · 월을 눌러 다른 달로 건너뛸 수 있을 때만
- `onToggle?`: () => void
- `onPrev?`: () => void
- `onNext?`: () => void
- `prevDisabled?`: boolean
- `nextDisabled?`: boolean
- `controls?`: string — 연 · 월 휠의 id (aria-controls)

### `DatePickerNavButton`
이전 달 · 다음 달 버튼. 48 × 48, 눌림 원 32, 아이콘 16 Bold. Hover skeleton/base · Pressed skeleton/strong
`import { DatePickerNavButton } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design · Figma 가이드 node `20016:2`

- `direction`: 'prev' · 'next' ← Figma `Direction`
- `forcePressed?`: boolean — 문서 전용: Pressed 모습을 고정해서 그린다

### `DatePickerSheet`
모바일. 바텀시트(Overlay/Header + 본문 좌우 20 + Overlay/ActionArea)에 Date Picker를 담는다. 시트 안에서 고른 값은 확정 전까지 바깥 값을 바꾸지 않는다
`import { DatePickerSheet } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design · Figma 가이드 node `20016:2`

- `open`: boolean
- `onClose`: () => void
- `onConfirm`: (value: DatePickerValue) => void — 「날짜 선택 완료」. 시트 안에서 고른 값을 넘긴다. range는 종료일까지 골라야 눌린다
- `title?`: string (기본 '날짜 선택') — 시트 제목. 기본 「날짜 선택」
- `confirmLabel?`: string (기본 '날짜 선택 완료') — 확정 버튼 문구. 기본 「날짜 선택 완료」
- `value?`: string | [string, (string | undefined)?] — 고른 값(제어). single은 `YYYY-MM-DD`, range는 `[시작, 끝?]`
- `defaultValue?`: string | [string, (string | undefined)?]
- `className?`: string
- `onChange?`: (value: DatePickerValue) => void
- `selection?`: 'single' · 'range' (기본 'single') ← Figma `Selection` — single = 하루 · range = 시작일 ~ 종료일
- `today?`: string — 오늘 `YYYY-MM-DD`. 「오늘」 라벨과 회색 원
- `ariaLabel?`: string — 스크린리더 이름. 기본 「날짜 선택」
- `showMonthYear?`: boolean ← Figma `Show Dropdown Icon` — 머리글 연 · 월을 눌러 휠로 건너뛰기
- `defaultView?`: 'date' · 'month-year' — 문서 전용: 처음 보여줄 화면. Figma `View`
- `month?`: string — 보이는 달 `YYYY-MM`(제어). 없으면 고른 날짜의 달, 그다음 오늘이 속한 달
- `defaultMonth?`: string
- `onMonthChange?`: (month: string) => void
- `min?`: string — 고를 수 있는 첫날 · 마지막 날 `YYYY-MM-DD`. 그 달 밖으로는 이전 · 다음 버튼이 Disabled
- `max?`: string
- `days?`: { [x: string]: CalendarDayData; } — 날짜별 라벨 · 공휴일 · 비활성. 키는 `YYYY-MM-DD`

### `DatePickerTwoMonths`
PC 기간 선택. 두 달을 나란히(720 고정, 달 사이 24). 이전 버튼은 첫 달 왼쪽, 다음 버튼은 둘째 달 오른쪽. 연 · 월 휠은 쓰지 않는다
`import { DatePickerTwoMonths } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design · Figma 가이드 node `20016:2`

- `value?`: string | [string, (string | undefined)?] — 고른 값(제어). single은 `YYYY-MM-DD`, range는 `[시작, 끝?]`
- `defaultValue?`: string | [string, (string | undefined)?]
- `className?`: string
- `onChange?`: (value: DatePickerValue) => void
- `today?`: string — 오늘 `YYYY-MM-DD`. 「오늘」 라벨과 회색 원
- `ariaLabel?`: string (기본 '기간 선택') — 스크린리더 이름. 기본 「날짜 선택」
- `onComplete?`: (value: DatePickerValue) => void — single은 날짜를 누를 때, range는 종료일을 누를 때. Popover는 여기서 닫는다
- `month?`: string — 보이는 달 `YYYY-MM`(제어). 없으면 고른 날짜의 달, 그다음 오늘이 속한 달
- `defaultMonth?`: string
- `onMonthChange?`: (month: string) => void
- `min?`: string — 고를 수 있는 첫날 · 마지막 날 `YYYY-MM-DD`. 그 달 밖으로는 이전 · 다음 버튼이 Disabled
- `max?`: string
- `days?`: { [x: string]: CalendarDayData; } (기본 '{}') — 날짜별 라벨 · 공휴일 · 비활성. 키는 `YYYY-MM-DD`

### `DatePickerWeekdays`
요일 줄. 놓인 폭을 7등분. label/md-emphasized, 일 · 토 fg/critical/primary
`import { DatePickerWeekdays } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design · Figma 가이드 node `20016:2`

- (고유 props 없음 — HTML 속성 전달)

### `MonthYearPicker`
연도와 월을 한 번에 고르는 휠. 한 줄 48, 다섯 줄. 연 · 월 두 칸 사이 24
`import { MonthYearPicker } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design · Figma 가이드 node `20016:2`

- `month`: string — 지금 고른 달 `YYYY-MM`
- `onChange`: (month: string) => void
- `minMonth?`: string — 고를 수 있는 첫 달 · 마지막 달 `YYYY-MM`. 없으면 앞뒤 10년
- `maxMonth?`: string
- `id?`: string

## Divider

### `Divider`
`import { Divider } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-divider--design · Figma 가이드 node `6362:3354`

- `orientation?`: 'horizontal' · 'vertical' (기본 'horizontal') ← Figma `Orientation` — horizontal은 <hr>, vertical은 <span role="separator" aria-orientation="vertical">
- `tone?`: 'default' · 'strong' · 'subtle' (기본 'default') ← Figma `Tone` — default stroke/neutral/default · strong stroke/neutral/bold · subtle stroke/neutral/subtle. line에서만 적용
- `thickness?`: 'line' · 'block' (기본 'line') ← Figma `Thickness` — line(1px 선) · block(8px 면, bg/neutral/subtle). block은 horizontal 전용이라 orientation · tone을 무시
- `length?`: string | number (기본 12) — vertical 선의 길이. 숫자는 px, 문자열은 CSS 길이. Figma Vertical variant의 12px가 기본

## Empty State

### `EmptyState`
Empty State — 보여 줄 것이 없거나 실패했을 때 상황을 알리고 다음 행동을 안내한다
`import { EmptyState } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-empty-state--design · Figma 가이드 node `16480:91`

- `type?`: 'empty' · 'no-result' · 'error' (기본 'empty') — Empty 데이터 없음 · No Result 검색 · 필터 결과 없음 · Error 실패
- `size?`: 'default' · 'compact' (기본 'default') — Default는 페이지 전체, Compact는 카드 · 탭 패널 같은 부분 영역
- `heading?`: ReactNode — 상태를 알리는 제목. 비우면 Type 기본 문구
- `description?`: ReactNode — 다음 행동 안내(2줄 이내). 줄바꿈은 \n
- `actionLabel?`: string — 버튼 라벨(「~하기」)
- `onAction?`: () => void
- `showIcon?`: boolean (기본 true)
- `showHeading?`: boolean (기본 true)
- `showDescription?`: boolean (기본 true)
- `showButton?`: boolean (기본 true) — 다음 행동이 없거나 버튼이 하단 고정이면 끈다
- `icon?`: ReactNode — 도메인 심볼로 바꿀 때만. 바꿀 이유가 있어야 한다
- `placement?`: 'content' · 'section' — 부모 영역 안 세로 위치.
- `className?`: string

## Footers

### `FooterDesktop`
Footer/Desktop (4775:559) — 콘텐츠 폭 1200(layout/content-width-lg의 Desktop 값)
`import { FooterDesktop } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-footers--design · Figma 가이드 node `4469:896`

- `notice?`: { label: string; text: string; href?: string | undefined; moreHref?: string | undefined; } — 맨 위 공지 한 줄
- `sns?`: FooterSnsItem[]
- `links`: FooterLinkItem[]
- `companyRows`: ReactNode[][] — 사업자 정보. 줄마다 항목 배열, 항목 사이에 구분선
- `contacts?`: { label: string; number: string; }[] — 수화기 아이콘이 붙는 연락처
- `notices`: ReactNode[]
- `copyright`: string
- `aside?`: ReactNode — 오른쪽 칸(구매안전 서비스 안내 등)
- `awards?`: FooterMark[] — 아래 회색 띠의 수상 마크(넘겨 보기)
- `certifications?`: ReactNode[] — 아래 회색 띠 오른쪽 인증 마크
- `className?`: string

### `FooterInlineLink`
본문 안 브랜드 색 밑줄 링크(사업자정보확인 · 전화 · 이메일)
`import { FooterInlineLink } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-footers--design · Figma 가이드 node `4469:896`

- `href`: string
- `children`: ReactNode

### `FooterMobile`
Footer/Mobile (4469:896)
`import { FooterMobile } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-footers--design · Figma 가이드 node `4469:896`

- `topLinks`: FooterLinkItem[] — 맨 위 3칸(로그아웃 · 공지사항 · 고객센터)
- `termsLinks`: FooterLinkItem[] — 약관 링크
- `companyName`: string — 사업자 정보를 펼치는 버튼 이름
- `details`: ReactNode[] — 펼쳤을 때 보이는 사업자 정보, 한 줄에 하나
- `notices`: ReactNode[] — ※ 고지
- `copyright`: string
- `expanded?`: boolean — Figma Expand. Expanded면 사업자 정보가 보인다
- `defaultExpanded?`: boolean (기본 false)
- `onExpandedChange?`: (expanded: boolean) => void
- `className?`: string

## Header

### `Header`
앱 화면 최상단 헤더(Figma `Header/GNB`, 2202:1639). 상태 표시줄은 OS가 그리므로 코드는 그 아래 52 줄과 탭 줄만 그린다.
`import { Header } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-header--design · Figma 가이드 node `10322:4514`

- `type?`: 'main' · 'main-simple' · 'sub' · 'sub-details' · 'popup' · 'search' (기본 'sub') ← Figma `Type` — 좌측에 무엇이 오는지가 정해진다 — main 로고 + 검색 진입, main-simple 로고 + 간편홈, sub · sub-details 뒤로 + 제목, popup 제목 또는 로고, search 뒤로 + 검색 입력칸. 기본 sub
- `title?`: string ← Figma `Title` — sub · sub-details · popup의 제목. 길면 말줄임
- `logo?`: ReactNode ← Figma `Logo Slot` — · 로고. main · main-simple, 그리고 title이 없는 popup에서 그린다
- `background?`: 'white' · 'transparent' (기본 'white') ← Figma `Background` — transparent는 sub · sub-details · popup에만 있다(이미지 위 헤더). 기본 white
- `showGradient?`: boolean (기본 true) ← Figma `Show Gradient` — transparent에서 위쪽을 어둡게 해 흰 글자를 받친다. 기본 true
- `onBack?`: () => void — 뒤로 가기(sub · sub-details · search). 이름은 「뒤로 가기」
- `actions?`: HeaderAction[] (기본 '[]') ← Figma `Trailing Slot` — 우측 아이콘 버튼, 최대 3개
- `searchEntry?`: { placeholder?: string | undefined; onClick?: (() => void) | undefined; } — type=main의 검색 진입 버튼. 입력칸이 아니라 누르면 검색 화면으로 가는 버튼이다
- `search?`: { forceState, label, onClear, onSearch, …HTML attrs } — type=search의 입력칸(Search Field, 돋보기 꺼짐). 바의 검색 버튼은 actions로 넘긴다
- `simpleHome?`: { on: boolean; onChange?: ((on: boolean) => void) | undefined; } — type=main-simple의 간편홈 전환(Figma `Header/GNB/Simple Home`). on이면 Simple
- `tabs?`: HeaderTab[] — type=main의 탭 줄(Figma `Show Home Tab`)
- `currentTab?`: string
- `onTabChange?`: (key: string) => void
- `className?`: string

## Ratings

### `HelpfulButton`
Rating/Helpful Button — 후기 「도움이 돼요」
`import { HelpfulButton } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-ratings--design · Figma 가이드 node `9192:1101`

- `type?`: 'button' · 'text' (기본 'button') — Button은 누를 수 있는 반응 버튼, Text는 개수만 보여 주는 표시
- `selected?`: boolean
- `defaultSelected?`: boolean (기본 false)
- `onSelectedChange?`: (selected: boolean) => void
- `count?`: number (기본 0)
- `label?`: string (기본 '도움이 돼요')
- `className?`: string

### `Rating`
Rating Size=Small — 평점 요약 표시(읽기 전용)
`import { Rating } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-ratings--design · Figma 가이드 node `9192:1101`

- `value`: number — 0~5. 소수는 0.5 단위로 내려 그린다
- `reviewCount?`: number — 후기 수. 주면 별 아래 「N명의 여행후기」
- `caption?`: ReactNode — 후기 수 문구를 직접 정할 때
- `showScore?`: boolean (기본 false) ← Figma `Show Score` — 별 오른쪽에 평균 점수(소수 첫째 자리)를 보인다
- `className?`: string

### `RatingInput`
Rating Size=Large — 평가 입력. 별 하나가 곧 점수
`import { RatingInput } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-ratings--design · Figma 가이드 node `9192:1101`

- `value?`: number — 0~5 정수. 0은 아직 고르지 않음
- `defaultValue?`: number (기본 0)
- `onChange?`: (value: number) => void
- `labels?`: readonly string[] (기본 'RATING_LABELS') — 점수별 문구. 0~5 여섯 개
- `label?`: string (기본 '별점') — 그룹 이름
- `disabled?`: boolean
- `className?`: string

### `RatingStar`
Rating/Star — 별 하나. 단독으로 쓰지 않고 Rating 안에서 쓴다
`import { RatingStar } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-ratings--design · Figma 가이드 node `9192:1101`

- `fill?`: 'full' · 'half' · 'empty' (기본 'full')
- `size?`: 'small' · 'medium' · 'large' (기본 'medium') — Small 12 · Medium 16 · Large 40
- `className?`: string

## Image Frame

### `ImageFrame`
이미지가 놓이는 자리를 비율 · 모서리 · 테두리로 고정하는 컨테이너(Figma `Image Frame` 8458:1772 · `Image Frame/Square` 8458:559).
`import { ImageFrame } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-image-frame--design · Figma 가이드 node `8458:1772`

- `src?`: string — 이미지 주소. 없거나 불러오지 못하면 Fallback(회색 면 + 하나투어 심볼)을 그린다
- `alt`: string — 대체 텍스트. 장식 이미지면 빈 문자열. Fallback일 때도 스크린리더에 남는다
- `ratio?`: '1:1' · '5:4' · '4:3' · '3:2' · '16:10' · '16:9' · '2:1' · '4:5' · '3:4' · '2:3' · '10:16' · '9:16' · '1:2' · 'original' (기본 '1:1') ← Figma `Ratio` — 13종 또는 original(원본 비율, 모서리 없음). 기본 1:1
- `size?`: number — 고정 폭(px). Figma `Image Frame/Square`의 Size와 같고, 모서리는 크기가 정한다. 없으면 부모 폭을 채운다(fill)
- `rounded?`: boolean (기본 false) ← Figma `Radius` — 16(rounded-2xl). size가 있으면 무시하고 크기 단계를 따른다. fill에서는 모서리를 이것으로 직접 정한다
- `border?`: boolean (기본 false) ← Figma `Border` — 밝은 이미지가 배경과 안 갈릴 때 1px 안쪽 선(overlay/adaptive/tint)
- `loading?`: boolean (기본 false) — 불러오는 중. skeleton shimmer를 덮는다. 자동 지연(200ms)은 하지 않는다
- `className?`: string

### `ImageLabelGroup`
이미지 왼쪽 위에 얹는 라벨 묶음(Figma `Common/Image Label` 6892:2838 · `Common/Image Label Group` 8681:101).
`import { ImageLabelGroup } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-image-frame--design · Figma 가이드 node `8458:1772`

- `items`: ImageLabelItem[] — 1~2개. 두 번째 라벨은 첫 라벨 밑으로 8 겹쳐 붙는다(Figma `Type=Second`). 3개부터는 그리지 않는다
- `className?`: string

## Label

### `Label`
상품 · 콘텐츠에 붙어 그것의 종류나 조건을 알리는 각진 태그(Figma `Common/Label`, 4528:549).
`import { Label } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-label--design · Figma 가이드 node `4528:549`

- `children`: ReactNode ← Figma `Label` — 텍스트. 상품 · 콘텐츠의 속성을 나타내는 짧은 단어(예: 무료취소 · 조식포함)
- `variant?`: 'outlined' · 'tinted' · 'filled' · 'tinted-outlined' (기본 'outlined') ← Figma `Variant` — outlined(기본) · tinted · filled · tinted-outlined. 본문 크기에서 Light AA를 모든 색이 통과하는 것은 tinted뿐
- `color?`: 'purple' · 'blue' · 'mint' · 'pink' · 'red' · 'gray' · 'black' (기본 'purple') ← Figma `Color` — gray는 tinted · tinted-outlined에만, black은 outlined · filled에만 있다. 없는 조합은 가까운 조합으로 그리고 개발 중 경고한다
- `size?`: 'small' · 'medium' (기본 'small') ← Figma `Size` — small 16 · medium 20
- `leadingIcon?`: ReactNode ← Figma `Show Leading Icon` — 12 아이콘을 넘기면 글자 앞에 2 간격으로 붙는다
- `trailingIcon?`: ReactNode ← Figma `Show Trailing Icon` — 12 아이콘을 넘기면 글자 뒤에 붙는다
- `className?`: string

## Badge

### `LabelBadge`
`import { LabelBadge } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-badge--design · Figma 가이드 node `14185:20472`

- `children`: ReactNode ← Figma `Label` — 특가 · 단독 같은 짧은 단어
- `size?`: 'small' · 'medium' · 'large' (기본 'medium') ← Figma `Size` — small 12 · medium 16 · large 20. large는 Tinted만 정의되어 있어 variant가 tinted로 고정된다
- `variant?`: 'filled' · 'tinted' · 'outlined' (기본 'tinted') ← Figma `Variant` — filled · tinted · outlined
- `color?`: 'purple' · 'blue' (기본 'purple') ← Figma `Color` — purple(Vivid Purple) · blue

### `MessageBadge`
버튼 위에 얹는 보조 메시지 배지 (Figma 세트 `Badge/Message`, 339:884 — 2026-10-02 `Button`에서 개명).
`import { MessageBadge } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-badge--design · Figma 가이드 node `14185:20472`

- `type?`: 'time' · 'alarm' · 'live' (기본 'time') ← Figma `Type` — time 남은 시간 · alarm 마감 임박 · live 라이브 중 (Figma 세트 `Badge/Message`)
- `children`: ReactNode — 짧은 보조 메시지. time은 강조할 앞부분(예: "1일 15:10:11")을 <strong>으로 감싸 넘길 수 있다

### `NotificationBadge`
알림 표식. 시각 정보와 같은 내용을 label로 반드시 전달한다(점·숫자만으로는 의미가 없음).
`import { NotificationBadge } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-badge--design · Figma 가이드 node `14185:20472`

- `type?`: 'count' · 'new' · 'dot' (기본 'count') ← Figma `Type` — count 숫자 · new "N" · dot 점
- `tone?`: 'critical' · 'brand' (기본 'critical') ← Figma `Tone` — critical · brand. brand는 New에만 정의되어 있어 count · dot에서는 무시된다
- `count?`: number (기본 0) — 표시할 개수(type=count). 0 이하면 렌더링하지 않는다. Figma `Count Length`(Single · Multiple)는 자릿수로 자동 결정
- `max?`: number (기본 99) — 이 값을 넘으면 "+{max}"로 표시한다(기본 +99)
- `label`: string — 스크린리더용 문장(aria-label). 화면의 점·숫자와 같은 내용을 쓴다. 예: "읽지 않은 알림 3개"

### `ShapeBadge`
텍스트 옆·위에 붙는 꼬리표 모양 배지(Figma `Badge/Shape`, Type=Default). 모서리 8/8/8/0.
`import { ShapeBadge } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-badge--design · Figma 가이드 node `14185:20472`

- `children`: ReactNode ← Figma `Label` — 필수 · NEW 같은 짧은 단어

## List

### `List`
ListCell을 담는 목록. 각 항목은 li로 감싼다. 같은 목록 안에서는 density를 통일한다.
`import { List } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-list--design · Figma 가이드 node `10459:300`

- `children`: ReactNode

### `ListCell`
List Cell. 세로로 나열된 목록의 한 행.
`import { ListCell } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-list--design · Figma 가이드 node `10459:300`

- `title`: ReactNode — 제목(Figma `Title`, body/lg-emphasized). 길면 줄바꿈하고 셀이 함께 늘어난다
- `subtitle?`: ReactNode — 보조 설명(Figma `Subtitle`, body/sm). 없으면 제목만 그린다
- `leading?`: ReactNode ← Figma `Leading Content` — 슬롯. 아이콘 · `ListLargeIcon` · `Avatar`(40) · `ListThumbnail` · `Checkbox` · `Radio`. 넘기면 표시(`Show Leading Content`)
- `trailing?`: ReactNode ← Figma `Trailing Content` — 슬롯. `ListValue` · 아이콘 · `Button` · `ListCheck` · `Label` · 텍스트 버튼 · `ToggleSwitch`. 셰브런은 여기에 넣지 않고 `chevron`으로 켠다
- `chevron?`: boolean (기본 false) ← Figma `Show Chevron` — 행을 누르면 다른 화면으로 이동할 때만 켠다. Figma 기본값은 true지만 코드는 이동이 있는 행에만 그리도록 false가 기본이다
- `divider?`: boolean (기본 false) ← Figma `Show Divider` — 행 아래 1px 구분선(stroke/neutral/default). 마지막 행에는 그려지지 않는다
- `density?`: 'compact' · 'standard' · 'spacious' (기본 'standard') ← Figma `Density` — 상하 패딩 compact 12 · standard 16 · spacious 20, 좌우는 모두 20. None · Custom은 코드에 없다
- `verticalAlign?`: 'top' · 'center' (기본 'top') ← Figma `Vertical Align` — top은 Leading · Trailing을 제목 첫 줄에, center는 셀 가운데에 맞춘다
- `selected?`: boolean (기본 false) ← Figma `Selected` — 배경 bg/neutral/subtle. 선택된 행은 Hover · Pressed 반응이 없다. 행이 선택 목록(role=option 등) 안에 있을 때 aria-selected로도 전달한다
- `disabled?`: boolean (기본 false) ← Figma `State=Disabled` — 글자 · 아이콘 · 셰브런을 모두 fg/neutral/disabled-bg로 바꾸고 누를 수 없게 한다
- `href?`: string — 넘기면 행 전체가 링크(a)가 된다
- `onClick?`: (event: MouseEvent<HTMLElement, MouseEvent>) => void — 넘기면 행 전체가 버튼이 된다
- `as?`: 'div' · 'a' · 'button' · 'label' · 'li' — 행 요소를 직접 고른다. 기본은 href → a, onClick → button, 둘 다 없으면 div.
- `forceState?`: 'hover' · 'pressed' · 'focus' — 문서용: Hovered · Pressed · Focused를 고정해서 보여줄 때
- `role?`: string — 행 요소에 그대로 넘길 role (예: option)
- `id?`: string — 행 요소의 id. Select Menu처럼 aria-activedescendant로 가리킬 때 쓴다
- `className?`: string

### `ListCheck`
Trailing Content/Check. 선택됨 표시(ic-check Bold 20). 장식이라 행에 aria-selected · aria-checked를 함께 준다.
`import { ListCheck } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-list--design · Figma 가이드 node `10459:300`

- (고유 props 없음 — HTML 속성 전달)

### `ListLargeIcon`
Leading Content/Large Icon. 48 정사각, 배경 bg/neutral/strong, radius 8, 아이콘 32.
`import { ListLargeIcon } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-list--design · Figma 가이드 node `10459:300`

- `icon`: ReactNode

### `ListThumbnail`
Leading Content/Thumbnail. Image Frame/Square Size=56(모서리 8). src가 없거나 실패하면 ImageFrame Fallback(회색 면 + 심볼).
`import { ListThumbnail } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-list--design · Figma 가이드 node `10459:300`

- `src?`: string
- `alt?`: string

### `ListValue`
Trailing Content/Value. 현재 설정값 텍스트(label/md, fg/neutral/subtle).
`import { ListValue } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-list--design · Figma 가이드 node `10459:300`

- `children`: ReactNode

## Overlay Parts

### `OverlayActionArea`
Overlay/ActionArea 8221:2665 + Overlay/Action 17914:56 — 위 8 · 좌우 20 · 아래 12, 버튼 XXlarge 56, 사이 8
`import { OverlayActionArea } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-overlay-parts--design · Figma 가이드 node `13639:33`

- `primaryAction?`: OverlayAction ← Figma `Action` — 이것만 = Primary Only. 없으면 액션 줄을 그리지 않는다
- `secondaryAction?`: { label: string; onClick: () => void; } — primaryAction과 함께 = Dual Equal(왼쪽 Outlined Assistive). 액션은 최대 2개
- `safeArea?`: boolean (기본 false) ← Figma `Show Safe Area` — SafeAreaSpacer 20(spacing-5), OS 하단 inset이 더 크면 그 값. 액션이 없으면 그리지 않는다(Body가 맨 아래 40을 갖는다)
- `className?`: string

### `OverlayBody`
Overlay/Body 13595:24534 — 유일한 스크롤 영역
`import { OverlayBody } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-overlay-parts--design · Figma 가이드 node `13639:33`

- `padding?`: 'default' · 'none' (기본 'default') ← Figma `Padding` — default 좌우 20 · 아래 16 / none 전폭(List Cell처럼 행 전체가 누르는 자리인 목록)
- `hasAction?`: boolean (기본 true) ← Figma `Has Action` — 아래에 ActionArea가 없으면 false — 맨 아래 40(spacing-10, 2026-10-15 하단 여백 규칙)

### `OverlayHeader`
Overlay/Header 7747:7531 — 위아래 16 · 좌우 20 · 간격 8. Handle 40×5, 제목 줄 최소 44, 닫기 44 · 아이콘 20
`import { OverlayHeader } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-overlay-parts--design · Figma 가이드 node `13639:33`

- `title`: string ← Figma `Show Title` — (늘 켬). 최대 2줄
- `description?`: string ← Figma `Show Description` — + `Description`. body/md-long, 최대 3줄
- `align?`: 'leading' · 'center' (기본 'leading') ← Figma `Align` — center는 Handle과만 쓴다(닫기 버튼과 함께면 제목이 왼쪽으로 치우친다)
- `handle?`: ReactNode (기본 true) ← Figma `Show Handle` — (기본 켬). true면 장식 막대, 노드를 주면 그 노드(예: 높이 전환 버튼)를 그린다
- `showClose?`: boolean (기본 false) ← Figma `Show Close` — (기본 끔). Handle과 함께 쓰지 않는다
- `onClose?`: () => void
- `ids?`: { title?: string | undefined; desc?: string | undefined; } — 모달이 aria-labelledby · aria-describedby로 연결하는 id

### `ResponsiveOverlay`
화면 폭에 따라 Bottom Sheet와 Dialog 중 하나로 띄운다.
`import { ResponsiveOverlay } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-overlay-parts--design · Figma 가이드 node `13639:33`

- `open`: boolean — 열림 상태. 앱이 들고 있는다(제어 컴포넌트)
- `onClose`: () => void — 닫기 요청. 여기서 open을 false로 바꾼다
- `title`: string — 제목. 두 표현 모두 aria-labelledby로 연결된다
- `description?`: string — 설명. 최대 3줄
- `primaryAction?`: { label: string; onClick: () => void; disabled?: boolean | undefined; } — 주 액션. Bottom Sheet · Dialog 모두 오른쪽 Filled
- `secondaryAction?`: { label: string; onClick: () => void; } — 보조 액션. primaryAction과 함께일 때만 그린다
- `padding?`: 'default' · 'none' — Body 안쪽 여백. none은 List Cell처럼 행 전체가 누르는 자리일 때
- `dismiss?`: 'handle' · 'close' (기본 'handle') — 768 미만(Bottom Sheet)일 때의 닫힘 정책. handle 가벼운 작업 / close 중요한 작업. Dialog는 항상 닫기 버튼
- `size?`: 'md' · 'lg' · 'xl' (기본 'md') — 768 이상(Dialog)일 때의 크기. md 텍스트·짧은 폼 / lg 표·목록·이미지 / xl 좌석도·달력
- `breakpoint?`: number (기본 'OVERLAY_DIALOG_MIN_WIDTH') — 전환 기준 폭. 기본 768. 바꾸지 않는다 — 테스트·문서 예시용
- `children`: ReactNode — Body 콘텐츠. 두 표현에 같은 내용을 넣는다

## Tooltip

### `Popover`
Popover. 트리거를 누르면 옆에 뜨는 흰 카드. 제목 · 본문 · 텍스트 버튼이 들어간다.
`import { Popover } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design · Figma 가이드 node `21392:2345`

- `title?`: string ← Figma `Show Title` — (True · False variant). 제목. 정책 · 조건처럼 무엇에 대한 설명인지 밝혀야 할 때 넘긴다. 없으면 본문만 있는 형태이고 닫기는 본문 오른쪽에 붙는다
- `content`: ReactNode ← Figma `Body` — 슬롯. 본문. 문장, PopoverList, PopoverKeyValue, 또는 직접 만든 요소
- `action?`: { label: string; onClick: () => void; } ← Figma `Show Action` — 본문 아래 텍스트 버튼(상세 보기 등). 일반 버튼은 넣지 않는다
- `position?`: 'left' · 'top' · 'bottom' · 'right' (기본 'bottom') — 카드가 트리거의 어느 쪽에 뜨는지. 그쪽에 자리가 없으면 반대편으로 뒤집힌다
- `align?`: 'leading' · 'center' · 'trailing' (기본 'leading') — 트리거의 어느 끝에 카드를 맞추는지. leading이면 트리거 시작 쪽 끝과 카드 시작 쪽 끝을 맞춘다. 화면 끝 8 안쪽으로 못 들어가면 반대쪽 끝으로 바뀐다
- `label?`: string — 제목이 없을 때 스크린리더가 읽을 카드 이름. 제목이 있으면 제목이 이름이 된다
- `closable?`: boolean (기본 true) ← Figma `Show Close` — (Show Title=False 변형에만 있음). 닫기(×) 버튼. 제목도 액션도 없는 단문 설명일 때만 false로 끌 수 있다. 제목이나 액션이 있으면 false를 넘겨도 닫기를 둔다. 기본 true
- `alignTo?`: RefObject<HTMLElement | null> — 레이블 뒤에 붙은 트리거일 때 그 레이블 줄(레이블과 트리거를 감싼 요소)의 ref. 넘기면 카드의 시작 쪽 끝을 트리거가 아니라 이 요소의 시작에 맞춘다. 트리거가 카드 폭 밖으로 나가면 카드 끝을 트리거 끝에 맞춘다. position이 top · bottom이고 align이 leading일 때만 쓰인다
- `open?`: boolean — 열림 상태(제어 모드). 넘기면 onOpenChange에서 직접 바꿔야 한다
- `defaultOpen?`: boolean (기본 false) — 비제어 모드에서 처음부터 열어 둘지
- `onOpenChange?`: (open: boolean) => void — 열리거나 닫힐 때 새 상태로 불린다
- `children`: ReactElement<{ 'aria-expanded'?: boolean | undefined; 'aria-controls'?: string | undefined; 'aria-haspopup'?: "dialog" | undefined; }, string | JSXElementConstructor<any>> — 트리거. 누를 수 있는 요소 하나(TriggerIcon · 버튼 등). aria-expanded · aria-controls가 붙는다
- `className?`: string — 감싸는 요소에 붙일 클래스

### `PopoverKeyValue`
Popover 본문 조각: 용어와 그 뜻을 나란히 놓는 목록(Figma `Popover/Key Value Row`). 이름과 설명 사이 12, 줄 사이 8. 이름은 fg/neutral/primary · label/md emphasized.
`import { PopoverKeyValue } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design · Figma 가이드 node `21392:2345`

- `rows`: { label: ReactNode; description: ReactNode; }[] — 「이름 : 설명」 줄. Figma의 Popover/Key Value Row 하나가 한 줄이다. 이름 칸은 가장 긴 이름에 맞춰 정렬된다.

### `PopoverList`
Popover 본문 조각: 같은 층위의 항목이 반복될 때 쓰는 불릿 목록(Figma `Popover/List Item`).
`import { PopoverList } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design · Figma 가이드 node `21392:2345`

- `items`: ReactNode[] — 불릿 줄. Figma의 Popover/List Item 하나가 한 줄이다. 줄 사이 8

### `Tooltip`
Tooltip/System. 트리거에 붙는 어두운 말풍선. 마우스는 올리면(300ms 뒤), 키보드는 포커스하면, 터치는 누르면 열린다.
`import { Tooltip } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design · Figma 가이드 node `21392:2345`

- `label`: string ← Figma `Label` — 말풍선 문구. 한두 줄, 공백 포함 40자 안쪽으로 쓴다. 폭이 280을 넘으면 줄바꿈된다
- `size?`: 'small' · 'medium' (기본 'small') ← Figma `Size` — small = 한 줄짜리 이름(아이콘 버튼 등), medium = 한두 줄 보조 설명(폼 레이블 등). 글자 크기는 같고 여백 · 닫기 · 꼬리 크기가 다르다
- `position?`: 'top' · 'bottom' · 'left' · 'right' (기본 'bottom') ← Figma `Position` — 말풍선이 트리거의 어느 쪽에 뜨는지. 그쪽에 자리가 없으면 반대편으로 뒤집힌다
- `shortcut?`: string ← Figma `Show Shortcut` — + `Shortcut Text`. 넘기면 문구 뒤에 단축키가 붙는다. 예: "⌘C"
- `closable?`: boolean (기본 false) ← Figma `Show Close` — 말풍선 안에 닫기(×)를 둔다. 말풍선이 다른 콘텐츠를 가려 직접 닫아야 할 때만 켠다
- `open?`: boolean — 열림 상태(제어 모드). 넘기면 onOpenChange에서 직접 바꿔야 한다
- `defaultOpen?`: boolean (기본 false) — 비제어 모드에서 처음부터 열어 둘지
- `onOpenChange?`: (open: boolean, reason?: TooltipCloseReason | undefined) => void — 열리거나 닫힐 때 새 상태로 불린다. 닫힐 때는 까닭이 함께 온다: escape(Esc) · outside(바깥 누르기) · close(닫기 버튼). 그 밖의 닫힘(벗어나기 · 다시 누르기)은 까닭이 없다
- `children`: ReactElement<{ 'aria-describedby'?: string | undefined; }, string | JSXElementConstructor<any>> — 트리거. 포커스를 받을 수 있는 요소 하나(버튼 등). `aria-describedby`가 붙는다

### `TooltipBadge`
Tooltip/Badge. 버튼이나 가격 옆에 프로모션 · 혜택을 한마디로 붙이는 브랜드색 알약.
`import { TooltipBadge } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design · Figma 가이드 node `21392:2345`

- `label`: string — 말풍선 문구. 한 줄, 12자 안쪽으로 쓴다. 줄바꿈되지 않는다
- `variant?`: 'outlined' · 'filled' (기본 'outlined') ← Figma `Variant` — outlined = 흰 바탕에 브랜드색 선, filled = 브랜드색 채움
- `align?`: 'leading' · 'center' · 'trailing' (기본 'leading') ← Figma `Align` — 꼬리가 알약의 어느 쪽에 붙는지. leading이면 알약이 대상의 오른쪽으로, trailing이면 왼쪽으로 뻗는다
- `onClose?`: () => void ← Figma `Show Close` — 넘기면 닫기(×) 버튼이 나오고 누르면 불린다. 지우는 일은 앱이 한다
- `open?`: boolean (기본 true) — 말풍선을 보일지. 화면이 띄우고 지우는 시점을 정한다. false여도 대상(children)은 그대로 그려진다. 기본 true
- `children?`: ReactElement<{ 'aria-describedby'?: string | undefined; }, string | JSXElementConstructor<any>> — 말풍선을 붙일 대상 하나(버튼 · 가격 등). 넘기면 대상 위쪽 4px에 뜨고 꼬리가 대상 가운데를 가리킨다. 없으면 말풍선만 그 자리에 그린다
- `className?`: string — 말풍선에 붙일 클래스

### `TriggerIcon`
Tooltip/Trigger Icon. Popover · Tooltip을 여는 20px 아이콘 버튼. 누르는 영역은 28이다.
`import { TriggerIcon } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design · Figma 가이드 node `21392:2345`

- `kind?`: 'question' · 'alert' · 'info' (기본 'info') ← Figma `Type` — (HTML type 속성과 겹쳐 kind로 받는다). question = 궁금한 사람만 보는 보조 설명, alert = 반드시 알아야 하는 제약 · 위험, info = 행동을 요구하지 않는 중립 안내
- `label`: string — 버튼의 접근 가능한 이름(aria-label). 무엇에 대한 설명인지 적는다. 예: "취소 수수료 안내"
- `size?`: 16 · 20 (기본 20) — 아이콘 크기. 기본 20, 작은 글자 옆(Counter/Text Option/Stacked 등)은 16. 누르는 영역은 둘 다 28

## Progress Circle

### `ProgressCircle`
Progress Circle — 진행 중임을 알리는 원형 인디케이터
`import { ProgressCircle } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-progress-circle--design · Figma 가이드 node `16311:2541`

- `size?`: 'small' · 'medium' · 'large' (기본 'medium') — Small(24) 요소 안 · Medium(32) 기본 · Large(40) 페이지 전체
- `tone?`: 'neutral' · 'brand' · 'inverse' (기본 'neutral') — 기본은 Neutral. Brand는 주요 전환점에만. Inverse는 사진 · 영상 · 딤 위에서만
- `value?`: number — 0~100. 주면 진행률을 채우는 Determinate, 없으면 계속 도는 Indeterminate
- `label?`: string (기본 '불러오는 중') — 스크린 리더 이름
- `className?`: string
- `style?`: CSSProperties

## Search

### `SearchBar`
Figma Search Bar (16228:38712). 검색 화면 상단 바. 높이 56 = 8 + 40 + 8
`import { SearchBar } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-search--design · Figma 가이드 node `16285:258`

- `field`: { forceState, label, onClear, onSearch, …HTML attrs } — 안의 Search Field에 그대로 넘긴다. 돋보기는 항상 켜져 있다(`showSearchIcon`은 받지 않는다)
- `showBack?`: boolean (기본 false) ← Figma `Show Back` — 필드 왼쪽 뒤로가기. 검색 전용 화면으로 들어왔을 때 켠다
- `showClose?`: boolean (기본 false) ← Figma `Show Close` — 필드 오른쪽 닫기. 검색 모드를 끄고 원래 화면으로 돌아갈 때 켠다
- `onBack?`: () => void
- `onClose?`: () => void
- `className?`: string

### `SearchField`
Figma Search Field (16228:3324). 회색 면 위의 검색 입력. 높이 40
`import { SearchField } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-search--design · Figma 가이드 node `16285:258`

- `label`: string — 화면에 보이지 않는 필드 이름(aria-label). 플레이스홀더로 대신하지 않는다
- `showSearchIcon?`: boolean (기본 true) ← Figma `Show Search Icon` — 필드 오른쪽 돋보기(장식). 바가 이미 검색 버튼을 가진 곳(GNB Type=Search)에서만 끈다. 기본 true
- `onClear?`: () => void — 지우기(✕)를 누른 뒤 불린다. 지우기는 값이 있고 비활성이 아닐 때만 나온다(Figma에서 Content State가 정하는 요소라 켜고 끄는 prop이 없다)
- `onSearch?`: (value: string) => void — Enter로 검색을 실행할 때 지금 값과 함께 불린다
- `forceState?`: 'hover' · 'focus' — 문서 전용. 포인터 · 포커스 없이 Figma `State=Hovered` · `Focused` 모습을 그린다

## Segmented Control

### `SegmentedControl`
같은 화면의 표시 방식을 바꾸는 배타적 선택. 값을 입력하는 2지 택일(남/여)은 Radio/Segmented를 쓴다.
`import { SegmentedControl } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-segmented-control--design · Figma 가이드 node `16190:33`

- `options`: SegmentedOption[] ← Figma `Count` — 2 · 3 · 4개. 5개 이상은 Tab을 쓴다 — 넘기면 앞의 4개만 그리고 개발 모드에서 경고
- `value?`: string ← Figma `Selection` — 선택된 칸의 value(제어 모드). 넘기면 onChange에서 직접 바꿔야 함. options에 없는 값이면 첫 칸이 선택돼 보이고 개발 모드에서 경고
- `defaultValue?`: string — 비제어 모드의 처음 선택값. 없으면 첫 칸
- `onChange?`: (value: string) => void — 칸을 누르거나 화살표 · Home · End로 선택을 옮길 때 새 value로 호출
- `label`: string — 그룹 이름(aria-label). 화면에는 보이지 않고 스크린리더가 읽음. 무엇의 표시 방식을 바꾸는지 적는다. 예: "보기 방식"
- `disabled?`: boolean ← Figma `State=Disabled` — 모든 칸을 비활성으로 두고 선택 칸의 그림자를 뺌

## Select

### `Select`
정해진 선택지 중에서 고르는 입력(Figma `Select` 래퍼 9991:1569 + `Select/Default` · `Date` · `Time` · `Search` · `Select/Menu`).
`import { Select } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-select--design · Figma 가이드 node `9981:18143`

- `label`: string — Figma 래퍼 `Label`. 필드 위 14 Bold. `<label>`로 연결된다
- `showLabel?`: boolean (기본 true) ← Figma `Show Label` — false면 화면에서 숨기고 스크린리더 이름으로만 쓴다
- `type?`: 'default' · 'date' · 'time' · 'search' (기본 'default') ← Figma `Type` — default는 목록 선택(Menu), date · time · search는 앞 아이콘이 고정되고 누르면 `onOpen`으로 날짜 · 시간 · 검색 화면을 연다
- `size?`: 40 · 48 (기본 48) ← Figma `Size` — (Large 40 · Xlarge 48). 기본 48
- `options?`: SelectOption[] — type=default의 선택지. 있으면 필드를 누를 때 Select/Menu가 열린다
- `value?`: string — 고른 값(제어)
- `defaultValue?`: string — 처음 값(비제어)
- `onChange?`: (value: string) => void
- `onOpen?`: () => void — type=date · time · search이거나 options가 없을 때 필드를 누르면 불린다
- `displayValue?`: string — date · time · search에서 바깥이 정한 표시값(예: 2026.10.15)
- `placeholder?`: string (기본 '선택해주세요')
- `leadingIcon?`: IconData ← Figma `Show Leading Icon` — (type=default만). 앞 아이콘. date · time · search는 아이콘이 정해져 있다
- `description?`: string ← Figma `Show Helper Text` — (type=default만). 필드 아래 도움말
- `status?`: 'normal' · 'negative' (기본 'normal') ← Figma `Status` — (type=default만). negative면 테두리 · 도움말이 빨강, aria-invalid
- `disabled?`: boolean (기본 false)
- `forceState?`: 'hover' · 'pressed' · 'focus' · 'open' — 문서 전용. Figma `State=Hovered · Pressed · Focused`를 고정해서 그린다. `open`은 Menu를 열어 둔다
- `className?`: string

## Skeleton

### `SkeletonCircle`
Skeleton/Circle — 아바타 · 프로필 자리
`import { SkeletonCircle } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-skeleton--design · Figma 가이드 node `12753:5902`

- `size?`: number (기본 100) — 지름. 기본 100
- `color?`: 'normal' · 'white' (기본 'normal') — Normal은 밝은 배경, White는 어둡거나 사진이 깔린 배경
- `className?`: string
- `style?`: CSSProperties

### `SkeletonGroup`
Skeleton을 감싸는 영역. role="status" · aria-busy로 로딩 중임을 한 번만 알린다
`import { SkeletonGroup } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-skeleton--design · Figma 가이드 node `12753:5902`

- `loading?`: boolean (기본 true) — 로딩 중이면 true. false가 되면 aria-busy를 풀어 내용이 읽힌다
- `label?`: string (기본 '불러오는 중') — 스크린 리더에 알리는 문구

### `SkeletonRectangle`
Skeleton/Rectangle — 썸네일 · 이미지 · 배너 자리. 모서리 8 고정
`import { SkeletonRectangle } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-skeleton--design · Figma 가이드 node `12753:5902`

- `width?`: string | number (기본 100) — 기본 100. 실제 콘텐츠와 같은 크기로
- `height?`: string | number (기본 100)
- `color?`: 'normal' · 'white' (기본 'normal') — Normal은 밝은 배경, White는 어둡거나 사진이 깔린 배경
- `className?`: string
- `style?`: CSSProperties

### `SkeletonText`
Skeleton/Text — 텍스트 한 줄. 놓인 영역의 폭을 채우고 그 안에서 length만큼 막대를 그린다
`import { SkeletonText } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-skeleton--design · Figma 가이드 node `12753:5902`

- `length?`: 100 · 75 · 50 · 25 (기본 100) — 줄 폭 비율. 여러 줄은 100 → 75 → 50처럼 점점 짧게
- `align?`: 'leading' · 'center' · 'trailing' (기본 'leading')
- `lineHeight?`: number (기본 32) — 줄 높이(막대 + 위아래 2). 기본 32
- `color?`: 'normal' · 'white' (기본 'normal') — Normal은 밝은 배경, White는 어둡거나 사진이 깔린 배경
- `className?`: string
- `style?`: CSSProperties

## Slider

### `Slider`
범위 슬라이더(Figma `Slider/Track` 9340:1392 + `Slider/Value Bubble` 9240:2054).
`import { Slider } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-slider--design · Figma 가이드 node `433:48`

- `value?`: [number, number] — 범위 [아래, 위](제어)
- `defaultValue?`: [number, number]
- `onChange?`: (value: SliderRangeValue) => void
- `onChangeEnd?`: (value: SliderRangeValue) => void — 손을 떼거나 입력을 마쳤을 때 한 번. 목록 다시 불러오기처럼 무거운 일은 여기서
- `min`: number
- `max`: number
- `step?`: number (기본 1) — 한 칸. 기본 1
- `format?`: (v: number) => string (기본 'String') — 핸들 위 말풍선(Slider/Value Bubble)과 스크린리더 값 글자. 기본 숫자 그대로
- `label`: string — 무엇의 범위인지(스크린리더 이름). 예: 「출발 시간」
- `showBubble?`: boolean (기본 true) — 말풍선 표시. 기본 켬
- `disabled?`: boolean (기본 false) ← Figma `State=Disabled` — 핸들 · 고른 구간이 회색이 되고 누르거나 키로 바꿀 수 없다
- `className?`: string

### `SliderRange`
범위 입력(Figma `Slider/Range` 3983:238). 슬라이더와 숫자 입력 두 가지 표시 방식을 텍스트 버튼으로 바꾼다
`import { SliderRange } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-slider--design · Figma 가이드 node `433:48`

- `type?`: 'slider' · 'input' ← Figma `Type` — slider = 핸들로 조절 · input = 숫자 직접 입력. 비제어면 옵션 체크로 바뀐다
- `defaultType?`: 'slider' · 'input' (기본 'slider')
- `onTypeChange?`: (type: "slider" | "input") => void
- `showOption?`: boolean (기본 true) ← Figma `Show Option` — 오른쪽 위 「직접입력」 · 「그래프로 입력」 텍스트 버튼
- `inputLabels?`: [string, string] (기본 '['최소', '최대']') — 입력 칸 레이블. 기본 「최소」 · 「최대」
- `value?`: [number, number] — 범위 [아래, 위](제어)
- `defaultValue?`: [number, number]
- `onChange?`: (value: SliderRangeValue) => void
- `onChangeEnd?`: (value: SliderRangeValue) => void — 손을 떼거나 입력을 마쳤을 때 한 번. 목록 다시 불러오기처럼 무거운 일은 여기서
- `min`: number
- `max`: number
- `step?`: number — 한 칸. 기본 1
- `format?`: (v: number) => string — 핸들 위 말풍선(Slider/Value Bubble)과 스크린리더 값 글자. 기본 숫자 그대로
- `label`: string — 무엇의 범위인지(스크린리더 이름). 예: 「출발 시간」
- `showBubble?`: boolean — 말풍선 표시. 기본 켬
- `disabled?`: boolean ← Figma `State=Disabled` — 핸들 · 고른 구간이 회색이 되고 누르거나 키로 바꿀 수 없다
- `className?`: string

## Toast

### `Snackbar`
Snackbar: 되돌리기 등 후속 행동을 제공. 노출 시간은 가이드 Duration 표(4초 · 6초 · 최대 16초)를 앱이 적용한다.
`import { Snackbar } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-toast-snackbar--design · Figma 가이드 node `8821:3937`

- `message`: string ← Figma `Heading` — 한 줄(넘치면 말줄임)
- `description?`: string ← Figma `Heading` — = Expanded. 있으면 두 줄 구성의 보조 문구(최대 2줄)
- `leading?`: ReactNode ← Figma `Snackbar/Leading Content` — + `Show Leading Icon`. 아이콘 · 이미지 · 아바타(24). 장식(aria-hidden)
- `action?`: { label: string; onClick: () => void; } ← Figma `button_txt` — + `Show Action`. 텍스트 버튼(되돌리기 · 보기 등). 누르면 앱이 행동을 실행하고 Snackbar를 닫는다
- `onClose?`: () => void ← Figma `ic-close` — + `Show Close`. 넘기면 닫기 버튼(aria-label "닫기", 가이드 닫기 방법 표)을 그린다

### `Toast`
Toast: 결과를 알리고 스스로 사라짐. 행동(버튼)을 넣지 않는다 — 필요하면 Snackbar.
`import { Toast } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-toast-snackbar--design · Figma 가이드 node `8821:3937`

- `variant?`: 'default' · 'positive' · 'cautionary' · 'negative' (기본 'default') ← Figma `Status` — Positive · Cautionary · Negative는 아이콘 고정. negative는 즉시(assertive), 나머지는 차례대로(polite) 읽힌다
- `icon?`: ReactNode ← Figma `Status` — = Normal+Icon custom(`Show Icon`). variant="default"에 맥락 아이콘을 붙일 때만. 상태 variant에서는 무시. 장식(aria-hidden)
- `message`: string — 알림 문장, 최대 2줄(넘치면 말줄임). 상태를 색 · 아이콘만이 아니라 문장으로도 말한다

### `ToastRegion`
Where notifications appear (guide › Position). Toast: top center on every platform, newest on top, max 3.
`import { ToastRegion } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-toast-snackbar--design · Figma 가이드 node `8821:3937`

- `placement?`: 'top' · 'bottom' (기본 'top') — top = Toast 영역(상단 중앙, 최신이 위) · bottom = Snackbar 영역(하단 중앙). 두 영역은 동시에 떠도 겹치지 않는다
- `children`: ReactNode — 지금 보여 줄 Toast · Snackbar. 각 항목에 key를 준다(사라질 때 퇴장 모션을 그리는 기준). 개수 제한 · 타이머 · 큐는 앱이 정한다

## Tables

### `Table`
Table — 골격. thead · tbody · tr에 TableHead · TableCell을 조합한다.
`import { Table } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tables--design · Figma 가이드 node `8390:3236`

- `size?`: 'small' · 'large' (기본 'small') — Small 48 · 13(모바일 · 조밀한 목록) · Large 56 · 15(PC 기본)
- `bordered?`: boolean (기본 true) — 표 맨 위 1px 가로선. 위 요소와 붙어 있을 때 경계를 세운다
- `caption`: string — 무엇을 비교하는 표인지. 스크린 리더가 표 이름으로 읽는다
- `showCaption?`: boolean (기본 false) — caption을 눈에도 보이게
- `columnWidths?`: (string | number | undefined)[] — 열 폭 고정(<colgroup>). 숫자는 px
- `children`: ReactNode

### `TableCell`
Table/Cell — 값 칸. 높이는 최소값(48 · 56)이고 내용이 길면 늘어난다.
`import { TableCell } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tables--design · Figma 가이드 node `8390:3236`

- `align?`: 'leading' · 'center' · 'trailing' (기본 'leading')
- `title?`: ReactNode — Title & Description · Description & Title — 두 줄 값
- `description?`: ReactNode
- `descriptionFirst?`: boolean — true면 Description & Title(설명이 위)
- `fit?`: boolean — Input(체크박스)처럼 폭이 내용만큼인 칸

### `TableHead`
Table/Head — 제목 칸. 높이 지정(48 · 56), 줄바꿈하지 않는다
`import { TableHead } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-tables--design · Figma 가이드 node `8390:3236`

- `content?`: 'title' · 'subtitle' · 'input' · 'order' (기본 'title') — Title 제목 · Subtitle 보조 제목(보통 굵기) · Input 체크박스(children) · Order 정렬
- `align?`: 'leading' · 'center' · 'trailing' (기본 'leading') — 같은 열의 값과 같은 정렬. 숫자 · 금액은 trailing
- `scope?`: 'col' · 'row' (기본 'col') — 열 제목이면 col, 행 제목이면 row
- `sort?`: 'none' · 'ascending' · 'descending' (기본 'none') — content='order'의 현재 정렬
- `onSort?`: () => void

## Text Input

### `TextInput`
`import { TextInput } from '@aliceblue567/hds-react'`
문서: https://hds-storybook.vercel.app/?path=/docs/components-text-input--design · Figma 가이드 node `14382:2560`

- `label`: string ← Figma `Label` — `<label for>`로 연결되는 필드 이름. 48·56은 필드 안(floating), 40은 필드 밖
- `size?`: 40 · 48 · 56 (기본 48) ← Figma `Size` — (Large · Xlarge · XXlarge = 40 · 48 · 56). 높이와 레이블 위치를 함께 정한다. 기본값 48 (2026-09-21 확정)
- `status?`: 'normal' · 'negative' · 'positive' (기본 'normal') ← Figma `Status` — negative면 aria-invalid. positive는 서버 확인 결과(중복확인·인증번호)에만 쓰고, 값이 비어 있으면 normal로 보정된다. disabled + negative도 normal로 보정된다
- `description?`: string ← Figma `Helper Text` — + `Show Helper Text`. 필드 아래 도움말. aria-describedby로 연결된다
- `showClear?`: boolean (기본 false) ← Figma `Show Clear` — 켜 두면 값이 있고 비활성이 아닐 때만 지우기 버튼을 그린다
- `placeholder?`: string ← Figma `Placeholder` — Size 40에서만 쓰인다. 48·56은 레이블이 플레이스홀더를 겸하므로 무시된다
- `tooltip?`: string ← Figma `Show Tooltip` — 입력 형식 설명 문구. 넘기면 16px 물음표 버튼이 나오고, 올리거나 포커스하거나 누르면 Tooltip(Size=Medium, 아래쪽)으로 문구가 뜬다. 비활성 필드에서는 뜨지 않는다
- `forceState?`: 'hover' · 'focus' · 'tooltip' — 문서 전용. 포인터 · 포커스 없이 Figma `State=Hovered` · `Focused` 모습을 그린다. `tooltip`은 말풍선을 열어 둔다. 제품 코드에서 쓰지 않는다

