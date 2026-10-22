import { parseSpec, type Block } from '../compose';
import { catalog, presetByType } from '../registry';
import { PRODUCT_STATES, type ProductProps, type ProductState, type RecipeNode } from '../product';

export type Action = { target: string; event: 'press' | 'secondary' | 'back'; to: string; requires: string[]; label: string };
export type FieldBinding = { target: string; key: string; label: string };
export type FlowScreen = { id: string; title: string; purpose: string; blocks: Block[]; actions: Action[]; fields: FieldBinding[] };
export type Plan = { title: string; goal: string; screens: { id: string; title: string; purpose: string }[]; assumptions: string[]; acceptance: string[]; integrations: string[] };
export type Project = { schema: 1; hdsVersion: string; brief: string; plan: Plan; screens: FlowScreen[]; warnings: string[] };
export type Values = Record<string, string | number | boolean>;
export const inputTypes = ['TextInput', 'SearchField', 'Select', 'CheckboxItem', 'CounterItem', 'SegmentedControl', 'Tabs', 'RatingInput'];
export const eventsFor = (type: string): Action['event'][] => type === 'Header' ? ['back'] : type === 'BottomFixed' ? ['press', 'secondary'] : ['Button', 'ListCell', 'EmptyState', 'Banner'].includes(type) ? ['press'] : [];
export const obj = (x: unknown): Record<string, unknown> => x && typeof x === 'object' && !Array.isArray(x) ? x as Record<string, unknown> : {};
const str = (x: unknown, fallback = '') => typeof x === 'string' ? x.slice(0, 1600) : fallback;
export const strings = (x: unknown) => Array.isArray(x) ? x.filter((v): v is string => typeof v === 'string').slice(0, 20).map(v => v.slice(0, 600)) : [];
const safeId = (x: unknown) => typeof x === 'string' && /^[a-zA-Z][a-zA-Z0-9_-]{0,60}$/.test(x);
export function readJSON(text: string): unknown {
  const start = text.indexOf('{'), end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('AI 응답에서 JSON을 찾지 못했어요.');
  return JSON.parse(text.slice(start, end + 1));
}
export function parsePlan(raw: unknown): Plan {
  const p = obj(raw);
  if (!Array.isArray(p.screens) || p.screens.length < 1 || p.screens.length > 6) throw new Error('화면은 1~6개로 구성해주세요.');
  const ids = new Set<string>();
  const screens = p.screens.map((s, i) => { const n = obj(s); const id = safeId(n.id) ? String(n.id) : `screen${i + 1}`; if (ids.has(id)) throw new Error('화면 ID가 중복됐어요.'); ids.add(id); return { id, title: str(n.title, `화면 ${i + 1}`), purpose: str(n.purpose) }; });
  return { title: str(p.title, '새 프로토타입'), goal: str(p.goal), screens, assumptions: strings(p.assumptions), acceptance: strings(p.acceptance), integrations: strings(p.integrations) };
}
export type Target = { key: string; type: string; props: Record<string, unknown> };
export function targets(screen: FlowScreen, allStates = true): Target[] {
  const read = (nodes: RecipeNode[], prefix: string): Target[] => nodes.flatMap((n, i) => [{ key: `${prefix}/${i}`, type: n.type, props: n.props }, ...read(n.children ?? [], `${prefix}/${i}`)]);
  return screen.blocks.flatMap(b => b.type === 'Product'
    ? (allStates ? PRODUCT_STATES : ['default'] as const).flatMap(state => read((b.props as unknown as ProductProps).states[state], `${b.id}/${state}`))
    : [{ key: b.id, type: b.type, props: b.props }]);
}
export function parseScreen(raw: unknown, meta: Plan['screens'][number], warnings: string[]): FlowScreen {
  const x = obj(raw);
  if (!Array.isArray(x.blocks) || x.blocks.length > 30) throw new Error('한 화면에는 1~30개 블록을 사용할 수 있어요.');
  const parsed = parseSpec(JSON.stringify({ title: meta.title, blocks: x.blocks }));
  warnings.push(...parsed.warnings);
  const ids = new Set<string>();
  parsed.blocks.forEach((b, i) => {
    const requested = obj((x.blocks as unknown[])[i]).id;
    b.id = safeId(requested) ? String(requested) : `block${i + 1}`;
    if (ids.has(b.id)) throw new Error(`${meta.title}: 블록 ID가 중복됐어요.`);
    ids.add(b.id);
    if (b.type === 'Button' && !['xlarge', 'xxlarge'].includes(String(b.props.size))) b.props.size = 'xlarge';
    if (['TextInput', 'Select'].includes(b.type) && b.props.size === 40) b.props.size = 48;
  });
  const result: FlowScreen = { ...meta, blocks: parsed.blocks, actions: [], fields: [] };
  const available = new Map(targets(result).map(t => [t.key, t]));
  const actionIds = new Set<string>();
  for (const item of Array.isArray(x.actions) ? x.actions.slice(0, 50) : []) {
    const a = obj(item), target = str(a.target), event = str(a.event, 'press') as Action['event'];
    if (!available.has(target) || !eventsFor(available.get(target)!.type).includes(event) || !safeId(a.to) || actionIds.has(`${target}:${event}`)) throw new Error(`${meta.title}: 동작 연결이 올바르지 않아요 (${target}).`);
    actionIds.add(`${target}:${event}`);
    result.actions.push({ target, event, to: String(a.to), requires: strings(a.requires), label: str(a.label, '화면 이동') });
  }
  const bound = new Set<string>();
  for (const item of Array.isArray(x.fields) ? x.fields.slice(0, 30) : []) {
    const f = obj(item), target = str(f.target);
    if (!available.has(target) || !inputTypes.includes(available.get(target)!.type) || !safeId(f.key) || ['__proto__', 'constructor', 'prototype'].includes(String(f.key)) || bound.has(target)) throw new Error(`${meta.title}: 입력 연결이 올바르지 않아요 (${target}).`);
    bound.add(target);
    result.fields.push({ target, key: String(f.key), label: str(f.label, String(f.key)) });
  }
  return result;
}
export function parseProject(raw: unknown): Project {
  const p = obj(raw);
  if (p.schema !== 1) throw new Error('지원하지 않는 프로젝트 형식이에요.');
  const plan = parsePlan(p.plan), warnings = strings(p.warnings);
  if (!Array.isArray(p.screens) || p.screens.length !== plan.screens.length) throw new Error('계획과 화면 개수가 맞지 않아요.');
  const screens = plan.screens.map(meta => {
    const matches = (p.screens as unknown[]).filter(s => obj(s).id === meta.id);
    if (matches.length !== 1) throw new Error('계획에 해당하는 화면을 찾지 못했어요.');
    return parseScreen(matches[0], meta, warnings);
  });
  const fieldKeys = new Set(screens.flatMap(s => s.fields.map(f => f.key)));
  for (const s of screens) for (const a of s.actions) {
    if (!screens.some(t => t.id === a.to)) throw new Error(`${s.title}: 이동할 화면이 없어요.`);
    if (a.requires.some(k => !fieldKeys.has(k))) throw new Error(`${s.title}: 필수 입력 항목이 연결되지 않았어요.`);
  }
  if (p.hdsVersion && p.hdsVersion !== catalog.version) warnings.push(`원본 HDS ${str(p.hdsVersion)} → 현재 ${catalog.version} 기준으로 다시 확인했어요.`);
  return { schema: 1, hdsVersion: catalog.version, brief: typeof p.brief === 'string' ? p.brief.slice(0, 12000) : '', plan, screens, warnings: [...new Set(warnings)] };
}
export function missingFields(action: Action, values: Values): string[] {
  return action.requires.filter(k => values[k] === undefined || values[k] === false || String(values[k]).trim() === '');
}
export function initialValues(project: Project): Values {
  const values: Values = {};
  for (const s of project.screens) for (const f of s.fields) {
    const t = targets(s).find(t => t.key === f.target)!;
    const value = t.props.defaultValue ?? t.props.defaultChecked;
    values[f.key] ??= typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? value : t.type === 'CheckboxItem' ? false : t.type === 'CounterItem' ? Number(t.props.min ?? 0) : '';
  }
  return values;
}
export function inspect(project: Project): string[] {
  const issues = [...project.warnings];
  const reached = new Set<string>();
  const visit = (id: string) => { if (reached.has(id)) return; reached.add(id); project.screens.find(s => s.id === id)?.actions.forEach(a => visit(a.to)); };
  visit(project.screens[0].id);
  for (const s of project.screens) {
    if (!reached.has(s.id)) issues.push(`${s.title}: 시작 화면에서 연결된 경로가 없어요.`);
    for (const t of targets(s, false)) {
      if (t.type === 'Header' && ['main', 'main-simple', 'search'].includes(String(t.props.type))) issues.push(`${s.title}: 헤더의 검색·홈 전환 동작은 연결되지 않았어요.`);
      if (t.type === 'Header' && ['sub', 'sub-details', 'search'].includes(String(t.props.type)) && !s.actions.some(a => a.target === t.key && a.event === 'back')) issues.push(`${s.title}: 헤더의 뒤로 이동이 연결되지 않았어요.`);
      if (['FilterChipRow', 'SearchField', 'Pagination', 'RadioItem', 'DatePicker', 'SliderRange'].includes(t.type)) issues.push(`${s.title}: ${t.type}의 결과 필터링·업무 반영은 별도 연결이 필요해요.`);
      if (presetByType.get(t.type)?.kind === 'custom') issues.push(`${s.title}: ${String(t.props.label)}는 미구현 커스텀 영역이에요.`);
      if (eventsFor(t.type).includes('press') && !(t.type === 'EmptyState' && !t.props.showButton) && !s.actions.some(a => a.target === t.key && a.event === 'press')) issues.push(`${s.title}: ${String(t.props.label ?? t.props.title ?? t.type)}의 주 동작이 연결되지 않았어요.`);
      if (inputTypes.includes(t.type) && !s.fields.some(f => f.target === t.key)) issues.push(`${s.title}: ${String(t.props.label ?? t.type)}의 입력값이 다음 화면에 전달되지 않아요.`);
    }
  }
  return [...new Set(issues)];
}
export function diffProjects(before: Project, after: Project): string[] {
  const changes: string[] = [];
  for (const s of after.screens) {
    const old = before.screens.find(x => x.id === s.id);
    if (!old) { changes.push(`${s.title}: 화면 추가`); continue; }
    const added = s.blocks.filter(b => !old.blocks.some(o => o.id === b.id)).length;
    const removed = old.blocks.filter(b => !s.blocks.some(o => o.id === b.id)).length;
    const changed = s.blocks.filter(b => old.blocks.some(o => o.id === b.id && JSON.stringify(o) !== JSON.stringify(b))).length;
    if (added || removed || changed) changes.push(`${s.title}: 블록 ${added}개 추가 · ${changed}개 변경 · ${removed}개 삭제`);
    if (JSON.stringify(old.actions) !== JSON.stringify(s.actions) || JSON.stringify(old.fields) !== JSON.stringify(s.fields)) changes.push(`${s.title}: 동작·입력 연결 변경`);
  }
  before.screens.filter(s => !after.screens.some(x => x.id === s.id)).forEach(s => changes.push(`${s.title}: 화면 삭제`));
  return changes.length ? changes : ['화면 구조와 동작에 변경이 없어요.'];
}
export type { ProductState };
