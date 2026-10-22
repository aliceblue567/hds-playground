import type { CSSProperties, ReactNode } from 'react';

export type RecipeNode = { type: string; props: Record<string, unknown>; children?: RecipeNode[] };
export const PRODUCT_STATES = ['default', 'loading', 'empty', 'error'] as const;
export type ProductState = typeof PRODUCT_STATES[number];
export type ProductProps = {
  name: string; purpose: string; reason: string; state: ProductState;
  states: Record<ProductState, RecipeNode[]>;
};
export const stateLabels: Record<ProductState, string> = { default: '기본', loading: '로딩', empty: '빈 상태', error: '오류' };
export const stackOptions = {
  direction: ['column', 'row'], gap: ['0', '1', '2', '3', '4', '5', '6'], padding: ['0', '2', '3', '4', '5'],
  surface: ['default', 'subtle'], border: ['none', 'subtle'], radius: ['none', 'md', 'lg'],
} as const;
export const textOptions = { role: ['title', 'body', 'caption'], tone: ['primary', 'muted', 'brand'] } as const;
const node = (type: string, props: Record<string, unknown>): RecipeNode => ({ type, props });
export const fallbackStates = (): ProductProps['states'] => ({
  default: [],
  loading: [node('SkeletonRectangle', { width: '100%', height: 120 })],
  empty: [node('EmptyState', { type: 'empty', size: 'compact', heading: '아직 표시할 정보가 없어요', showButton: false })],
  error: [node('EmptyState', { type: 'error', size: 'compact', heading: '정보를 불러오지 못했어요', showButton: false })],
});
export const productDefaults: ProductProps = {
  name: '예약 준비 카드', purpose: '예약 후 준비할 항목과 다음 행동을 안내해요', reason: '예약 준비 정보를 한곳에 모으는 프로덕트 조합이 필요해요', state: 'default',
  states: { ...fallbackStates(), default: [{ type: 'Stack', props: { direction: 'column', gap: '3', padding: '4', surface: 'default', border: 'subtle', radius: 'lg' }, children: [
    node('Text', { text: '여행 준비를 시작해요', role: 'title', tone: 'primary' }),
    node('LabelRow', { labels: '예약 완료', variant: 'tinted', color: 'mint', size: 'small' }),
    node('Text', { text: '여행자 정보를 입력하고 준비 사항을 확인해주세요.', role: 'body', tone: 'muted' }),
    node('Button', { label: '여행자 정보 입력하기', variant: 'solid', size: 'large', fullWidth: true }),
  ] }] },
};
const object = (v: unknown): Record<string, unknown> => v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : {};
const text = (v: unknown, fallback = '') => typeof v === 'string' && v.trim() ? v.slice(0, 1200) : fallback;
// Only registered HDS props and the layout/text enums below reach the renderer.
export function normalizeProduct(raw: unknown, leaf: (type: string, props: Record<string, unknown>) => RecipeNode | null, warnings: string[]): ProductProps {
  const given = object(raw); let count = 0;
  const choices = (props: Record<string, unknown>, options: Record<string, readonly string[]>) => Object.fromEntries(Object.entries(options).map(([key, values]) => {
    const value = String(props[key] ?? values[0]);
    if (!values.includes(value)) warnings.push(`프로덕트 ${key}: 허용된 HDS 선택값으로 바꿨어요.`);
    return [key, values.includes(value) ? value : values[0]];
  }));
  const read = (items: unknown, depth: number): RecipeNode[] => {
    if (!Array.isArray(items)) return [];
    return items.slice(0, 24).flatMap((value): RecipeNode[] => {
      if (++count > 80 || depth > 4) { warnings.push('프로덕트 조합의 깊이·개수 제한을 넘은 항목을 제외했어요.'); return []; }
      const n = object(value), p = object(n.props), type = String(n.type ?? '');
      if (Object.keys(p).some(k => ['style', 'className', 'html', 'dangerouslySetInnerHTML'].includes(k))) warnings.push('임의 스타일·HTML을 제외하고 HDS 규칙만 적용했어요.');
      if (type === 'Stack') return [{ type, props: choices(p, stackOptions), children: read(n.children, depth + 1) }];
      if (type === 'Text') return [{ type, props: { ...choices(p, textOptions), text: text(p.text) } }];
      const safe = leaf(type, p);
      if (!safe) { warnings.push(`프로덕트 내부에서 지원하지 않는 ${type || '항목'}을 제외했어요.`); return []; }
      return [safe];
    });
  };
  const states = fallbackStates(), incoming = object(given.states);
  for (const key of PRODUCT_STATES) {
    const items = read(incoming[key], 0);
    if (items.length) states[key] = items;
    else if (key !== 'default') warnings.push(`${stateLabels[key]} 상태가 없어 HDS 기본 안내를 넣었어요.`);
  }
  if (!states.default.length) throw new Error('프로덕트 컴포넌트에 표시할 HDS 조합이 없어요. 요청을 구체적으로 적어주세요.');
  return { name: text(given.name, '새 프로덕트 컴포넌트'), purpose: text(given.purpose, '화면의 정보를 조합해요'), reason: text(given.reason, '기존 단일 컴포넌트로 표현하기 어려운 조합이에요'), state: PRODUCT_STATES.includes(given.state as ProductState) ? given.state as ProductState : 'default', states };
}
export function recipeStyle(n: RecipeNode): CSSProperties {
  const p = n.props;
  if (n.type === 'Stack') return {
    display: 'flex', flexDirection: p.direction === 'row' ? 'row' : 'column', flexWrap: 'wrap', alignItems: p.direction === 'row' ? 'center' : 'stretch',
    gap: `var(--hds-spacing-${p.gap ?? '3'})`, padding: `var(--hds-spacing-${p.padding ?? '0'})`,
    background: p.surface === 'subtle' ? 'var(--hds-bg-neutral-subtle)' : 'var(--hds-bg-layer-default)',
    border: p.border === 'subtle' ? '1px solid var(--hds-stroke-neutral-subtle)' : undefined,
    borderRadius: p.radius === 'none' ? undefined : `var(--hds-rounded-${p.radius ?? 'md'})`, minWidth: 0,
  };
  const style = p.role === 'title' ? 'title-md' : p.role === 'caption' ? 'caption-lg' : 'body-md';
  const weight = p.role === 'title' ? 'strong' : 'regular';
  return { margin: 0, overflowWrap: 'anywhere', minWidth: 0,
    font: `var(--hds-${style}-weight-${weight}) var(--hds-${style}-size)/var(--hds-${style}-line-height) var(--hds-${style}-font)`,
    color: p.tone === 'brand' ? 'var(--hds-fg-brand-primary)' : p.tone === 'muted' ? 'var(--hds-fg-neutral-muted)' : 'var(--hds-fg-neutral-primary)',
  };
}
export function renderProduct(p: ProductProps, leaf: (n: RecipeNode) => ReactNode): ReactNode {
  const render = (n: RecipeNode, i: number): ReactNode => n.type === 'Stack'
    ? <div key={i} style={recipeStyle(n)}>{n.children?.map(render)}</div>
    : n.type === 'Text' ? (n.props.role === 'title' ? <h3 key={i} style={recipeStyle(n)}>{String(n.props.text)}</h3> : <p key={i} style={recipeStyle(n)}>{String(n.props.text)}</p>) : <div key={i}>{leaf(n)}</div>;
  return <section aria-label={p.name} data-hds="custom" data-hds-reason={p.reason} data-product-status="draft">{p.states[p.state].map(render)}</section>;
}
export function productCode(p: ProductProps, leaf: (n: RecipeNode) => string): string {
  const render = (n: RecipeNode): string => n.type === 'Stack' ? `<div style={${JSON.stringify(recipeStyle(n))}}>${n.children?.map(render).join('\n') ?? ''}</div>`
    : n.type === 'Text' ? `<${n.props.role === 'title' ? 'h3' : 'p'} style={${JSON.stringify(recipeStyle(n))}}>{${JSON.stringify(String(n.props.text))}}</${n.props.role === 'title' ? 'h3' : 'p'}>` : `<div>${leaf(n)}</div>`;
  return `<section aria-label=${JSON.stringify(p.name)} data-hds="custom" data-hds-reason=${JSON.stringify(p.reason)} data-product-status="draft">\n${p.states[p.state].map(render).join('\n')}\n</section>`;
}
export function recipeLeaves(p: ProductProps): RecipeNode[] {
  const read = (nodes: RecipeNode[]): RecipeNode[] => nodes.flatMap(n => n.type === 'Stack' ? read(n.children ?? []) : n.type === 'Text' ? [] : [n]);
  return PRODUCT_STATES.flatMap(key => read(p.states[key]));
}
