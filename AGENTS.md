# AGENTS.md — HDS(Hanatour Design System) 코드 규칙

이 파일은 `@aliceblue567/hds-react@0.40.0` 빌드에서 자동 생성됐다(2026-10-22). 손으로 고치지 않는다 — 고칠 것은 컴포넌트 소스의 JSDoc이나 `scripts/build-ai-kit.mjs`다.
AI 코딩 도구(Claude Code · Cursor · v0 등)는 이 저장소에서 UI를 만들 때 아래 규칙을 따른다.

## 1. 절대 규칙

1. **UI는 `@aliceblue567/hds-react` 컴포넌트로만 조립한다.** 버튼·입력·선택·목록·탭·다이얼로그·바텀시트·토스트·칩·배지·헤더·하단바 등 아래 카탈로그에 있는 것은 새로 만들지 않는다. `<button className="…">`처럼 HTML로 흉내 내지 않는다.
2. **색·글자·간격·반경·그림자는 HDS 토큰(CSS 변수 `--hds-*`)만 쓴다.** 원시 hex · rgb · px 글자 크기 · 임의 그림자 금지. 토큰 목록은 `@aliceblue567/hds-react/tokens.json`에 있다. 레이아웃용 width/height 수치는 허용.
3. **아이콘은 Foundation 아이콘(427개)만 쓴다.** `import { Icon, icCloseBold } from '@aliceblue567/hds-react'` → `<Icon icon={icCloseBold} size={20} />`. 직접 그린 `<svg>`·이모지·외부 아이콘 라이브러리 금지.
4. **카탈로그에 없는 UI가 꼭 필요하면 만들되, 루트 요소에 `data-hds="custom"`과 `data-hds-reason="왜 필요한지"`를 붙인다.** 이 마커가 없는 비HDS UI는 lint에서 실패한다. 마커가 붙은 것은 디자인시스템 백로그로 올라간다.
5. **상태를 빼먹지 않는다.** 데이터가 있는 화면은 로딩(`Skeleton`)·빈 상태(`EmptyState` type=empty|noResult|error)·오류를 함께 만든다. 폼은 disabled·error(helper text) 상태를 만든다.
6. **접근성:** 아이콘만 있는 버튼은 `IconButton`에 `label`을 준다. 터치 타깃 44px 이상. 포커스 순서는 DOM 순서와 같게.
7. **글은 HDS UX Writing을 따른다:** 안내·행동 유도는 해요체, 위약금·중대 안내만 합니다체. 버튼 라벨은 동사로 끝나는 짧은 명령형("예약하기").

## 2. 설치와 기본 설정

```tsx
import '@aliceblue567/hds-react/styles';                 // 앱 진입점에서 한 번
import { Button, TextInput } from '@aliceblue567/hds-react';
// <html data-theme="light|dark" data-platform="mobile|tablet|desktop">
// 글꼴 Pretendard는 앱에서 불러온다.
```

- 브레이크포인트: `platformForWidth, breakpoints`
- 테마·플랫폼은 `<html>` 속성으로만 바꾼다. 컴포넌트에 색을 덮어쓰지 않는다.

## 3. 화면을 만드는 순서

1. 요청을 **화면 단위**로 쪼갠다(헤더 → 본문 섹션들 → 하단 고정 영역).
2. 각 영역을 아래 카탈로그에서 **먼저 찾는다.** 없는 것만 규칙 4로 만든다.
3. 목데이터는 `src/mock/`의 것을 쓴다. 새 데이터 모양을 만들지 않는다.
4. 로딩·빈 상태·오류를 붙인다(규칙 5).
5. `npm run lint`가 통과해야 끝이다.

## 4. 컴포넌트 인덱스 (104개)

먼저 여기서 이름을 찾고, props는 `ai/hds-components.md`의 같은 이름 절(또는 `ai/hds-catalog.json`)을 읽는다. 자세한 사용 규칙은 Storybook Design 문서, 예제는 React 문서에 있다.

| 컴포넌트 | 그룹 | 주요 props | 문서 |
| --- | --- | --- | --- |
| `Accordion` | Accordion | `title` `children` `type` `size` `required` `helper` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-accordion--design) |
| `AccordionGroup` | Accordion | `items` `exclusive` `type` `size` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-accordion--design) |
| `AlertDialog` | Dialog | `open` `dismissible` `title` `description` `subContent` `confirm` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-dialog--design) |
| `AlertDialogPanel` | Dialog | `ids` `title` `description` `subContent` `confirm` `cancel` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-dialog--design) |
| `AttachmentDropzone` | Attachment Input | `onFiles` `accept` `multiple` `disabled` `label` `hint` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-attachment-input--design) |
| `AttachmentInput` | Attachment Input | `items` `max` `onAdd` `onRemove` `onRetry` `accept` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-attachment-input--design) |
| `AttachmentItem` | Attachment Input | `onRemove` `onRetry` `onOpen` `className` `id` `type` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-attachment-input--design) |
| `AttachmentTrigger` | Attachment Input | `count` `label` `forcePressed` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-attachment-input--design) |
| `Avatar` | Avatar | `size` `variant` `src` `name` `badge` `editable` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-avatar--design) |
| `AvatarGroup` | Avatar | `size` `people` `label` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-avatar--design) |
| `Banner` | Banner | `level` `image` `alt` `href` `onClick` `pagination` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-banner--design) |
| `BottomAction` | Buttons | `layout` `primaryAction` `secondaryAction` `iconActions` `divider` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `BottomFixed` | Buttons | `panel` `layout` `primaryAction` `secondaryAction` `iconActions` `divider` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `BottomNavigation` | Bottom Navigation | `items` `current` `onNavigate` `platform` `scrollState` `onHai` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-bottom-navigation--design) |
| `BottomPanelChecklist` | Buttons | `children` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `BottomPanelDateRange` | Buttons | `start` `end` `nights` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `BottomPanelText` | Buttons | `label` `value` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `BottomSheet` | Bottom Sheet | `open` `onClose` `initialDetent` `title` `description` `dismiss` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-bottom-sheet--design) |
| `BottomSheetPanel` | Bottom Sheet | `onClose` `ids` `headerProps` `handleButton` `title` `description` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-bottom-sheet--design) |
| `Button` | Buttons | `variant` `tone` `size` `label` `leadingIcon` `trailingIcon` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `Calendar` | Calendar | `month` `days` `mode` `value` `onChange` `today` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-calendar--design) |
| `CalendarDay` | Calendar | `day` `selection` `holiday` `today` `label` `tone` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-calendar--design) |
| `CarouselCounter` | Pagination | `type` `current` `total` `onMore` `moreLabel` `className` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-pagination--design) |
| `CarouselDots` | Pagination | `total` `current` `color` `className` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-pagination--design) |
| `Checkbox` | Selection Controls | `size` `indeterminate` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design) |
| `CheckboxItem` | Selection Controls | `size` `label` `helper` `icon` `indeterminate` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design) |
| `ChipGroup` | Chips | `children` `scroll` `label` `selectionMode` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-chips--design) |
| `ChipTabs` | Tab/Line | `items` `variant` `size` `color` `defaultValue` `value` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tabs--design) |
| `ChoiceChip` | Chips | `label` `selected` `icon` `selectionMode` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-chips--design) |
| `Copy` | Copy | `type` `value` `target` `onCopy` `className` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-copy--design) |
| `Counter` | Counter | `value` `defaultValue` `onChange` `min` `max` `disabled` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-counter--design) |
| `CounterItem` | Counter | `layout` `price` `description` `tooltip` `value` `defaultValue` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-counter--design) |
| `DatePicker` | Date Picker | `layout` `selection` `value` `defaultValue` `onChange` `onComplete` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design) |
| `DatePickerHeader` | Date Picker | `month` `expanded` `showDropdown` `onToggle` `onPrev` `onNext` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design) |
| `DatePickerNavButton` | Date Picker | `direction` `forcePressed` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design) |
| `DatePickerSheet` | Date Picker | `open` `onClose` `onConfirm` `title` `confirmLabel` `value` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design) |
| `DatePickerTwoMonths` | Date Picker | `value` `defaultValue` `className` `onChange` `today` `ariaLabel` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design) |
| `DatePickerWeekdays` | Date Picker |  | [Design](https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design) |
| `Dialog` | Dialog | `open` `onClose` `title` `description` `size` `showClose` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-dialog--design) |
| `DialogPanel` | Dialog | `onClose` `ids` `title` `description` `size` `showClose` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-dialog--design) |
| `Divider` | Divider | `orientation` `tone` `thickness` `length` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-divider--design) |
| `EmptyState` | Empty State | `type` `size` `heading` `description` `actionLabel` `onAction` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-empty-state--design) |
| `FieldButton` | Buttons | `tone` `size` `label` `forceState` `type` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `FilterChip` | Chips | `label` `kind` `size` `selected` `leadingIcon` `closeIcon` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-chips--design) |
| `FilterResult` | Buttons | `chips` `onReset` `onRemove` `emptyMessage` `label` `resetLabel` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `FloatingAction` | Buttons | `items` `label` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `FooterDesktop` | Footers | `notice` `sns` `links` `companyRows` `contacts` `notices` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-footers--design) |
| `FooterInlineLink` | Footers | `href` `children` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-footers--design) |
| `FooterMobile` | Footers | `topLinks` `termsLinks` `companyName` `details` `notices` `copyright` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-footers--design) |
| `Header` | Header | `type` `title` `logo` `background` `showGradient` `onBack` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-header--design) |
| `HelpfulButton` | Ratings | `type` `selected` `defaultSelected` `onSelectedChange` `count` `label` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-ratings--design) |
| `IconButton` | Buttons | `icon` `label` `count` `size` `selected` `forceState` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-button--design) |
| `ImageFrame` | Image Frame | `src` `alt` `ratio` `size` `rounded` `border` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-image-frame--design) |
| `ImageLabelGroup` | Image Frame | `items` `className` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-image-frame--design) |
| `Label` | Label | `children` `variant` `color` `size` `leadingIcon` `trailingIcon` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-label--design) |
| `LabelBadge` | Badge | `children` `size` `variant` `color` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-badge--design) |
| `List` | List | `children` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-list--design) |
| `ListCell` | List | `title` `subtitle` `leading` `trailing` `chevron` `divider` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-list--design) |
| `ListCheck` | List |  | [Design](https://hds-storybook.vercel.app/?path=/docs/components-list--design) |
| `ListLargeIcon` | List | `icon` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-list--design) |
| `ListThumbnail` | List | `src` `alt` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-list--design) |
| `ListValue` | List | `children` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-list--design) |
| `MessageBadge` | Badge | `type` `children` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-badge--design) |
| `MonthYearPicker` | Date Picker | `month` `onChange` `minMonth` `maxMonth` `id` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-date-picker--design) |
| `NotificationBadge` | Badge | `type` `tone` `count` `max` `label` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-badge--design) |
| `OverlayActionArea` | Overlay Parts | `primaryAction` `secondaryAction` `safeArea` `className` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-overlay-parts--design) |
| `OverlayBody` | Overlay Parts | `padding` `hasAction` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-overlay-parts--design) |
| `OverlayHeader` | Overlay Parts | `title` `description` `align` `handle` `showClose` `onClose` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-overlay-parts--design) |
| `Pagination` | Pagination | `type` `indicator` `page` `defaultPage` `total` `onPageChange` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-pagination--design) |
| `Popover` | Tooltip | `title` `content` `action` `position` `align` `label` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design) |
| `PopoverKeyValue` | Tooltip | `rows` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design) |
| `PopoverList` | Tooltip | `items` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design) |
| `ProgressCircle` | Progress Circle | `size` `tone` `value` `label` `className` `style` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-progress-circle--design) |
| `Radio` | Selection Controls | `size` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design) |
| `RadioItem` | Selection Controls | `size` `label` `helper` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design) |
| `RadioSegmented` | Selection Controls | `options` `label` `name` `value` `defaultValue` `onChange` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design) |
| `Rating` | Ratings | `value` `reviewCount` `caption` `showScore` `className` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-ratings--design) |
| `RatingInput` | Ratings | `value` `defaultValue` `onChange` `labels` `label` `disabled` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-ratings--design) |
| `RatingStar` | Ratings | `fill` `size` `className` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-ratings--design) |
| `ResponsiveOverlay` | Overlay Parts | `open` `onClose` `title` `description` `primaryAction` `secondaryAction` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-overlay-parts--design) |
| `SearchBar` | Search | `field` `showBack` `showClose` `onBack` `onClose` `className` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-search--design) |
| `SearchField` | Search | `label` `showSearchIcon` `onClear` `onSearch` `forceState` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-search--design) |
| `SegmentedControl` | Segmented Control | `options` `value` `defaultValue` `onChange` `label` `disabled` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-segmented-control--design) |
| `Select` | Select | `label` `showLabel` `type` `size` `options` `value` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-select--design) |
| `SelectChip` | Chips | `label` `selected` `onRemove` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-chips--design) |
| `ShapeBadge` | Badge | `children` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-badge--design) |
| `SkeletonCircle` | Skeleton | `size` `color` `className` `style` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-skeleton--design) |
| `SkeletonGroup` | Skeleton | `loading` `label` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-skeleton--design) |
| `SkeletonRectangle` | Skeleton | `width` `height` `color` `className` `style` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-skeleton--design) |
| `SkeletonText` | Skeleton | `length` `align` `lineHeight` `color` `className` `style` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-skeleton--design) |
| `Slider` | Slider | `value` `defaultValue` `onChange` `onChangeEnd` `min` `max` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-slider--design) |
| `SliderRange` | Slider | `type` `defaultType` `onTypeChange` `showOption` `inputLabels` `value` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-slider--design) |
| `Snackbar` | Toast | `message` `description` `leading` `action` `onClose` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-toast-snackbar--design) |
| `Table` | Tables | `size` `bordered` `caption` `showCaption` `columnWidths` `children` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tables--design) |
| `TableCell` | Tables | `align` `title` `description` `descriptionFirst` `fit` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tables--design) |
| `TableHead` | Tables | `content` `align` `scope` `sort` `onSort` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tables--design) |
| `Tabs` | Tab/Line | `items` `alignment` `size` `color` `defaultValue` `value` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tabs--design) |
| `TextInput` | Text Input | `label` `size` `status` `description` `showClear` `placeholder` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-text-input--design) |
| `Toast` | Toast | `variant` `icon` `message` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-toast-snackbar--design) |
| `ToastRegion` | Toast | `placement` `children` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-toast-snackbar--design) |
| `ToggleSwitch` | Selection Controls | `size` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-selection-controls--design) |
| `Tooltip` | Tooltip | `label` `size` `position` `shortcut` `closable` `open` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design) |
| `TooltipBadge` | Tooltip | `label` `variant` `align` `onClose` `open` `children` … | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design) |
| `TriggerIcon` | Tooltip | `kind` `label` `size` | [Design](https://hds-storybook.vercel.app/?path=/docs/components-tooltip-popover--design) |

## 5. 토큰 요약

CSS 변수 710개. 접두어별 개수: `--hds-*` 710.
전체 이름과 값: `@aliceblue567/hds-react/tokens.json`(`styles`에 CSS 변수로 들어 있음).

- 색은 **semantic**만: `--hds-bg-{role}-{state}`(bg-layer-default · bg-brand-default · bg-neutral-subtle …) · `--hds-fg-{role}-{tone}`(fg-neutral-primary · fg-neutral-muted · fg-brand-primary · fg-critical-primary …) · `--hds-stroke-{role}-{tone}`(stroke-neutral-default …). atomic `--hds-color-*`는 직접 쓰지 않는다.
- 글자는 스타일 묶음으로: `font: var(--hds-body-md-weight-regular) var(--hds-body-md-size)/var(--hds-body-md-line-height) var(--hds-body-md-font)`. 묶음 이름은 display · headline · title · body · label · caption × lg/md/sm(·xs), weight는 regular · emphasized · strong.
- 간격 `--hds-spacing-{0,0_5,1,1_5,2,3,4,5,6,7,8,9,10,12,14,16}`(4px 단위) · 반경 `--hds-rounded-{xs,sm,md,lg,xl,2xl,3xl,4xl,full}` · 그림자 `--hds-shadow-{gray|black|white}-{raised,floating,overlay}` · 레이아웃 `.hds-container` `.hds-grid`.

## 6. 이 파일이 다루지 않는 것

- 데이터 연결·API·인증은 프로토타입 범위 밖이다. 목데이터로만 만든다.
- 프로덕션 코드로 옮길 때는 개발팀 리뷰를 거친다. 이 저장소의 코드는 그대로 서비스에 들어가지 않는다.
