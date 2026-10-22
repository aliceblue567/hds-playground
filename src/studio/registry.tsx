// HDS Studio 블록 레지스트리.
// 팔레트에 올라가는 블록 = HDS 컴포넌트 + 기본 props. 편집 패널의 선택지(enum · boolean · 텍스트)는
// 손으로 적지 않고 패키지의 ai/hds-catalog.json(컴포넌트 소스의 타입 · JSDoc에서 생성)에서 읽는다.
// 배열 · 객체 안의 문구처럼 카탈로그로 표현이 안 되는 것만 extraFields로 적는다.
import type { ComponentType, ReactNode } from 'react';
import * as HDS from '@aliceblue567/hds-react';
import catalogJson from '@aliceblue567/hds-react/ai/hds-catalog.json';

type Val = string | number | boolean;
type CatalogProp = { name: string; type: string; values: Val[] | null; required: boolean; default?: unknown; figma?: { property: string; value?: string } | null; description?: string };
type CatalogComponent = { name: string; group: string; props: CatalogProp[]; storybook: string | null };
export const catalog = catalogJson as unknown as { version: string; components: CatalogComponent[] };
const byName = new Map(catalog.components.map((c) => [c.name, c]));

export type FieldKind = 'enum' | 'boolean' | 'text' | 'number';
export type Field = { path: string; label: string; kind: FieldKind; options?: Val[]; figma?: string; hint?: string };
export type Kind = 'hds' | 'layout' | 'custom';
export type Preset = {
  type: string; // 블록 타입 = 보통 HDS 컴포넌트 이름
  title: string;
  group: string;
  kind: Kind;
  component?: string; // 렌더할 HDS 컴포넌트(기본 type)
  defaults: Record<string, unknown>;
  extraFields?: Field[];
  hiddenProps?: string[];
  imports?: string[]; // 조합 블록이 함께 쓰는 HDS 부품
  inset?: boolean; // 좌우 화면 여백(20)을 줄지
  fixed?: 'top' | 'bottom';
  render?: (p: Record<string, unknown>) => ReactNode;
  code?: (p: Record<string, unknown>) => string;
};

const SKIP = new Set(['forceState', 'className', 'style', 'id', 'name', 'ids', 'headingLevel', 'as', 'href', 'open', 'defaultOpen', 'value', 'defaultValue', 'src', 'image']);
const noop = () => {};
// 블록 렌더는 props를 동적으로 넘기므로 느슨한 타입으로 꺼내 쓴다(값 검증은 카탈로그 기준 fieldsFor/parseSpec이 함)
const H = HDS as unknown as Record<string, ComponentType<Record<string, unknown>>>;
const IMG = (w: number, h: number, t: string) => `https://placehold.co/${w}x${h}/EEEEEE/999999?text=${encodeURIComponent(t)}`;
const list = (s: unknown) => String(s ?? '').split(',').map((x) => x.trim()).filter(Boolean);
const jsx = (s: string) => JSON.stringify(s);

export const presets: Preset[] = [
  // ── 상단 ──
  { type: 'Header', title: '헤더', group: '상단 · 하단', kind: 'hds', fixed: 'top', defaults: { type: 'sub', title: '화면 제목' }, hiddenProps: ['logo', 'search', 'searchEntry', 'simpleHome', 'tabs', 'currentTab', 'actions'] },
  { type: 'Tabs', title: '탭', group: '상단 · 하단', kind: 'hds', defaults: { label: '카테고리', items: [{ id: 't0', label: '전체' }, { id: 't1', label: '패키지' }, { id: 't2', label: '호텔' }], defaultValue: 't0', alignment: 'fixed' },
    extraFields: [{ path: 'items.0.label', label: '탭 1', kind: 'text' }, { path: 'items.1.label', label: '탭 2', kind: 'text' }, { path: 'items.2.label', label: '탭 3', kind: 'text' }] },
  { type: 'BottomFixed', title: '하단 고정 버튼', group: '상단 · 하단', kind: 'hds', fixed: 'bottom', defaults: { layout: 'primary-only', primaryAction: { label: '예약하기' }, secondaryAction: { label: '장바구니' }, panelLabel: '', panelValue: '' },
    hiddenProps: ['panel', 'iconActions'],
    extraFields: [{ path: 'primaryAction.label', label: '주 버튼', kind: 'text' }, { path: 'secondaryAction.label', label: '보조 버튼', kind: 'text', hint: 'dual 레이아웃에서만 보임' }, { path: 'panelLabel', label: '패널 레이블', kind: 'text', hint: '예: 총 결제 금액' }, { path: 'panelValue', label: '패널 값', kind: 'text', hint: '예: 2,580,000원' }],
    render: ({ panelLabel, panelValue, ...p }) => <H.BottomFixed {...p} panel={panelValue ? <H.BottomPanelText label={String(panelLabel || '')} value={String(panelValue)} /> : undefined} />,
    code: ({ panelLabel, panelValue, ...p }) => `<BottomFixed${props(p)}${panelValue ? ` panel={<BottomPanelText label=${jsx(String(panelLabel))} value=${jsx(String(panelValue))} />}` : ''} />` },

  // ── 콘텐츠 ──
  { type: 'ImageFrame', title: '이미지', group: '콘텐츠', kind: 'hds', defaults: { src: IMG(720, 405, 'IMAGE'), alt: '상품 이미지', ratio: '16:9' }, hiddenProps: ['size', 'loading'],
    extraFields: [{ path: 'alt', label: '대체 텍스트', kind: 'text' }] },
  { type: 'Banner', title: '배너', group: '콘텐츠', kind: 'hds', inset: true, defaults: { level: '3', image: IMG(640, 160, 'BANNER'), alt: '이벤트 배너' }, hiddenProps: ['pagination'] },
  { type: 'ListCell', title: '리스트 셀', group: '콘텐츠', kind: 'hds', defaults: { title: '오사카 · 교토 · 나라 4일', subtitle: '11.19(수) 출발 · 대한항공', chevron: true, density: 'standard' }, hiddenProps: ['leading', 'trailing', 'selected', 'onClick'] },
  { type: 'LabelRow', component: 'Label', title: '라벨 묶음', group: '콘텐츠', kind: 'hds', inset: true, defaults: { labels: '무료취소, 노쇼핑, 출발확정', variant: 'tinted', color: 'mint', size: 'small' },
    hiddenProps: ['children', 'leadingIcon', 'trailingIcon'], extraFields: [{ path: 'labels', label: '라벨들(쉼표로 구분)', kind: 'text' }],
    render: ({ labels, ...p }) => <div className="st-row">{list(labels).map((l) => <H.Label key={l} {...p}>{l}</H.Label>)}</div>,
    code: ({ labels, ...p }) => list(labels).map((l) => `<Label${props(p)}>{${jsx(l)}}</Label>`).join('\n') },
  { type: 'Rating', title: '별점', group: '콘텐츠', kind: 'hds', inset: true, defaults: { value: 4.7, reviewCount: 128, showScore: true }, hiddenProps: ['caption'], extraFields: [{ path: 'value', label: 'value (점수)', kind: 'number' }] },
  { type: 'AccordionGroup', title: '아코디언', group: '콘텐츠', kind: 'hds', defaults: { size: 'medium', type: 'fill', items: [{ title: '포함 사항', children: '왕복 항공권, 호텔 3박, 전 일정 가이드' }, { title: '불포함 사항', children: '개인 경비, 선택 관광, 여행자 보험' }] },
    extraFields: [{ path: 'items.0.title', label: '항목 1 제목', kind: 'text' }, { path: 'items.0.children', label: '항목 1 내용', kind: 'text' }, { path: 'items.1.title', label: '항목 2 제목', kind: 'text' }, { path: 'items.1.children', label: '항목 2 내용', kind: 'text' }] },
  { type: 'EmptyState', title: '빈 상태', group: '콘텐츠', kind: 'hds', defaults: { type: 'no-result', size: 'compact', showButton: false }, hiddenProps: ['icon', 'onAction', 'placement'] },
  { type: 'Divider', title: '구분선', group: '콘텐츠', kind: 'hds', defaults: { thickness: 'block' }, hiddenProps: ['length', 'orientation'] },

  // ── 입력 · 선택 ──
  { type: 'Button', title: '버튼', group: '입력 · 선택', kind: 'hds', inset: true, defaults: { label: '버튼', variant: 'solid', size: 'large', fullWidth: true }, hiddenProps: ['leadingIcon', 'trailingIcon', 'subLabel', 'subLabelPosition', 'type'] },
  { type: 'TextInput', title: '텍스트 입력', group: '입력 · 선택', kind: 'hds', inset: true, defaults: { label: '이름', size: 48 } },
  { type: 'FilterChipRow', component: 'FilterChip', title: '필터 칩 묶음', group: '입력 · 선택', kind: 'hds', inset: true, defaults: { labels: '일본, 동남아, 유럽, 미주', kind: 'option', size: 32, selectedIndex: 0 },
    hiddenProps: ['label', 'selected', 'leadingIcon', 'closeIcon'], extraFields: [{ path: 'labels', label: '칩들(쉼표로 구분)', kind: 'text' }, { path: 'selectedIndex', label: '선택된 칩 번호(0부터)', kind: 'number' }],
    render: ({ labels, selectedIndex, ...p }) => <div className="st-row">{list(labels).map((l, i) => <H.FilterChip key={l} label={l} selected={i === Number(selectedIndex)} {...p} />)}</div>,
    code: ({ labels, selectedIndex, ...p }) => list(labels).map((l, i) => `<FilterChip label=${jsx(l)}${i === Number(selectedIndex) ? ' selected' : ''}${props(p)} />`).join('\n') },
  { type: 'SegmentedControl', title: '세그먼트', group: '입력 · 선택', kind: 'hds', inset: true, defaults: { label: '정렬', options: [{ value: 's0', label: '추천순' }, { value: 's1', label: '가격순' }, { value: 's2', label: '출발일순' }], defaultValue: 's0' },
    extraFields: [{ path: 'options.0.label', label: '옵션 1', kind: 'text' }, { path: 'options.1.label', label: '옵션 2', kind: 'text' }, { path: 'options.2.label', label: '옵션 3', kind: 'text' }] },
  { type: 'CheckboxItem', title: '체크박스', group: '입력 · 선택', kind: 'hds', inset: true, defaults: { label: '[필수] 여행약관 동의' }, hiddenProps: ['indeterminate'] },
  { type: 'RadioItem', title: '라디오', group: '입력 · 선택', kind: 'hds', inset: true, defaults: { label: '신용 · 체크카드', helper: '무이자 할부 최대 6개월', name: 'studio-radio' } },
  { type: 'CounterItem', title: '인원 카운터', group: '입력 · 선택', kind: 'hds', inset: true, defaults: { label: '성인', price: 1290000, defaultValue: 2, min: 1, max: 9 }, hiddenProps: ['tooltip', 'holdToRepeat', 'forcePressed', 'description'] },

  // 추가 블록도 HDS 구현을 그대로 사용한다. 하위 부품은 조합 안에 둔다.
  { type: 'SearchField', title: '검색 입력', group: '입력 · 선택', kind: 'hds', inset: true,
    defaults: { label: '여행지 검색', placeholder: '여행지를 검색해주세요' },
    extraFields: [{ path: 'placeholder', label: '안내 문구', kind: 'text' }] },
  { type: 'Select', title: '셀렉트', group: '입력 · 선택', kind: 'hds', inset: true,
    defaults: { label: '출발 공항', type: 'default', options: [{ value: 'icn', label: '인천' }, { value: 'gmp', label: '김포' }, { value: 'pus', label: '김해' }] },
    hiddenProps: ['type', 'displayValue', 'placeholder', 'leadingIcon'],
    extraFields: [0, 1, 2].map((i) => ({ path: `options.${i}.label`, label: `선택지 ${i + 1}`, kind: 'text' as const })) },
  { type: 'DatePicker', title: '날짜 선택', group: '날짜 · 범위', kind: 'hds',
    defaults: { layout: 'inline', selection: 'single', defaultMonth: '2026-11', ariaLabel: '출발일 선택' },
    hiddenProps: ['month', 'days', 'defaultView'],
    extraFields: [{ path: 'defaultMonth', label: '처음 보이는 달 (YYYY-MM)', kind: 'text' }] },
  { type: 'SliderRange', title: '범위 선택', group: '날짜 · 범위', kind: 'hds', inset: true,
    defaults: { label: '여행 기간', min: 1, max: 30, step: 1, defaultValue: [3, 10], showBubble: true },
    extraFields: [{ path: 'defaultValue.0', label: '처음 최소값', kind: 'number' }, { path: 'defaultValue.1', label: '처음 최대값', kind: 'number' }] },
  { type: 'RatingInput', title: '별점 입력', group: '입력 · 선택', kind: 'hds', inset: true, defaults: { label: '여행 만족도', defaultValue: 3 },
    extraFields: [{ path: 'defaultValue', label: '처음 별점', kind: 'number' }] },
  { type: 'Avatar', title: '아바타', group: '콘텐츠', kind: 'hds', inset: true, defaults: { name: '여행자', variant: 'filled', size: 48 },
    hiddenProps: ['badge', 'editable'], extraFields: [{ path: 'name', label: '접근성 이름', kind: 'text' }] },
  { type: 'LabelBadge', title: '라벨 배지', group: '콘텐츠', kind: 'hds', inset: true, defaults: { children: '출발 확정', variant: 'tinted', size: 'medium' } },
  { type: 'NotificationBadge', title: '알림 배지', group: '콘텐츠', kind: 'hds', inset: true, defaults: { type: 'count', count: 3, label: '읽지 않은 알림' } },
  { type: 'Pagination', title: '페이지 이동', group: '콘텐츠', kind: 'hds', inset: true, defaults: { total: 5, indicator: 'count' }, hiddenProps: ['page'] },
  { type: 'Table', title: '정보 표', group: '콘텐츠', kind: 'hds', inset: true, imports: ['TableHead', 'TableCell'],
    defaults: { caption: '예약 요약', size: 'small', bordered: false, rowLabel1: '여행자', rowValue1: '성인 2명', rowLabel2: '여행 기간', rowValue2: '3박 4일' },
    hiddenProps: ['children', 'columnWidths'],
    extraFields: ['rowLabel1', 'rowValue1', 'rowLabel2', 'rowValue2'].map((path, i) => ({ path, label: ['항목 1', '값 1', '항목 2', '값 2'][i], kind: 'text' as const })),
    render: ({ rowLabel1, rowValue1, rowLabel2, rowValue2, ...p }) => <H.Table {...p}><tbody>{[[rowLabel1, rowValue1], [rowLabel2, rowValue2]].map(([label, value], i) => <tr key={i}><H.TableHead scope="row">{String(label)}</H.TableHead><H.TableCell>{String(value)}</H.TableCell></tr>)}</tbody></H.Table>,
    code: ({ rowLabel1, rowValue1, rowLabel2, rowValue2, ...p }) => `<Table${props(p)}><tbody>${[[rowLabel1, rowValue1], [rowLabel2, rowValue2]].map(([label, value]) => `<tr><TableHead scope="row">{${jsx(String(label))}}</TableHead><TableCell>{${jsx(String(value))}}</TableCell></tr>`).join('')}</tbody></Table>` },
  { type: 'Toast', title: '토스트', group: '피드백 · 로딩', kind: 'hds', inset: true, defaults: { message: '변경 내용을 저장했어요', variant: 'default' }, hiddenProps: ['icon'] },
  { type: 'Snackbar', title: '스낵바', group: '피드백 · 로딩', kind: 'hds', inset: true, defaults: { message: '선택한 항목을 담았어요', description: '예약 전 내용을 확인해주세요' }, hiddenProps: ['leading', 'action'] },
  { type: 'ProgressCircle', title: '진행 표시', group: '피드백 · 로딩', kind: 'hds', inset: true, defaults: { label: '여행 정보를 불러오는 중', tone: 'brand', size: 'medium', value: 60 },
    extraFields: [{ path: 'value', label: '진행률 (0–100)', kind: 'number' }] },
  { type: 'SkeletonText', title: '텍스트 로딩', group: '피드백 · 로딩', kind: 'hds', inset: true, defaults: {} },
  { type: 'SkeletonRectangle', title: '영역 로딩', group: '피드백 · 로딩', kind: 'hds', inset: true, defaults: { width: '100%', height: 120 },
    extraFields: [{ path: 'height', label: '높이', kind: 'number' }] },
  { type: 'SkeletonCircle', title: '원형 로딩', group: '피드백 · 로딩', kind: 'hds', inset: true, defaults: { size: 48 } },

  // ── 레이아웃 · 커스텀 ──
  { type: 'SectionTitle', title: '섹션 제목', group: '레이아웃 · 커스텀', kind: 'layout', defaults: { text: '섹션 제목' }, extraFields: [{ path: 'text', label: '제목', kind: 'text' }],
    render: ({ text }) => <h2 className="st-section-title">{String(text)}</h2>,
    code: ({ text }) => `<h2 className="section-title">{${jsx(String(text))}}</h2>` },
  { type: 'Custom', title: 'HDS에 없는 것', group: '레이아웃 · 커스텀', kind: 'custom', defaults: { label: '요금 요약 카드', reason: '소계 · 할인 · 합계 강조 행이 HDS에 없음' },
    extraFields: [{ path: 'label', label: '무엇', kind: 'text' }, { path: 'reason', label: '왜 HDS로 안 되나', kind: 'text' }],
    render: ({ label, reason }) => <div className="st-custom" data-hds="custom" data-hds-reason={String(reason)}><strong>커스텀 · {String(label)}</strong><span>{String(reason)}</span></div>,
    code: ({ label, reason }) => `<div data-hds="custom" data-hds-reason=${jsx(String(reason))}>{/* ${label} */}</div>` },
];
export const presetByType = new Map(presets.map((p) => [p.type, p]));

// ── 편집 필드: 카탈로그에서 유도 + extraFields ──
export function fieldsFor(preset: Preset): Field[] {
  const c = preset.component ?? preset.type;
  const comp = preset.kind === 'hds' ? byName.get(c) : undefined;
  const hidden = new Set([...(preset.hiddenProps ?? []), ...SKIP]);
  const auto: Field[] = [];
  for (const p of comp?.props ?? []) {
    if (hidden.has(p.name)) continue;
    const figma = p.figma ? `${p.figma.property}${p.figma.value ? '=' + p.figma.value : ''}` : undefined;
    const hint = p.description?.split(/[.。]\s|\n/)[0]?.slice(0, 80);
    if (p.values && p.values.length > 1) auto.push({ path: p.name, label: p.name, kind: 'enum', options: p.values, figma, hint });
    else if (p.type === 'boolean') auto.push({ path: p.name, label: p.name, kind: 'boolean', figma, hint });
    else if (p.type === 'string' || (p.type === 'ReactNode' && typeof preset.defaults[p.name] === 'string')) auto.push({ path: p.name, label: p.name, kind: 'text', figma, hint });
    else if (p.type === 'number') auto.push({ path: p.name, label: p.name, kind: 'number', figma, hint });
  }
  const extra = preset.extraFields ?? [];
  const seen = new Set(extra.map((f) => f.path));
  return [...auto.filter((f) => !seen.has(f.path)), ...extra];
}

// ── 경로 읽기 · 쓰기 (items.0.label) ──
export const getPath = (o: unknown, path: string): unknown => path.split('.').reduce<unknown>((a, k) => (a == null ? undefined : (a as Record<string, unknown>)[k]), o);
export function setPath<T>(o: T, path: string, v: unknown): T {
  const keys = path.split('.');
  const clone = (x: unknown) => (Array.isArray(x) ? [...x] : { ...(x as object) });
  const root = clone(o) as Record<string, unknown>;
  let cur = root;
  keys.slice(0, -1).forEach((k) => { cur[k] = clone(cur[k] ?? (/^\d+$/.test(k) ? [] : {})); cur = cur[k] as Record<string, unknown>; });
  cur[keys[keys.length - 1]] = v;
  return root as T;
}

// ── 렌더 ──
const HANDLERS = ['onBack', 'onClick', 'onChange', 'onAction'];
export function renderBlock(preset: Preset, p: Record<string, unknown>): ReactNode {
  if (preset.render) return preset.render(p);
  const Comp = H[preset.component ?? preset.type];
  if (!Comp) return null;
  const injected = Object.fromEntries(HANDLERS.filter((h) => fieldsFor(preset).every((f) => f.path !== h)).map((h) => [h, noop]));
  if (preset.type !== 'Header') delete injected.onBack;
  return <Comp {...injected} {...p} />;
}

// ── JSX 코드 ──
function props(p: Record<string, unknown>): string {
  return Object.entries(p)
    .filter(([, v]) => v !== undefined && v !== '' && v !== null)
    .map(([k, v]) => (v === true ? ` ${k}` : typeof v === 'string' ? ` ${k}=${jsx(v)}` : ` ${k}={${JSON.stringify(v)}}`))
    .join('');
}
export function blockCode(preset: Preset, p: Record<string, unknown>): string {
  if (preset.code) return preset.code(p);
  const name = preset.component ?? preset.type;
  const { children, ...rest } = p;
  return children !== undefined && typeof children === 'string' ? `<${name}${props(rest)}>{${jsx(children)}}</${name}>` : `<${name}${props(p)} />`;
}
