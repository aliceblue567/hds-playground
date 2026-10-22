// 프롬프트 → 화면 스펙. AI는 코드를 쓰지 않고 "블록 목록(JSON)"만 낸다.
// 블록 타입은 레지스트리(=HDS 카탈로그)에 있는 것만 허용하고, 값은 카탈로그의 허용값으로 검증한다.
// 없는 타입은 버리지 않고 Custom 블록으로 바꿔 화면에 드러낸다(AGENTS.md 규칙 4).
import { presets, presetByType, fieldsFor, getPath, setPath, catalog } from './registry';

export type Block = { id: string; type: string; props: Record<string, unknown> };
export const uid = () => Math.random().toString(36).slice(2, 9);
export const newBlock = (type: string): Block => ({ id: uid(), type, props: structuredClone(presetByType.get(type)!.defaults) });

export function systemPrompt(): string {
  const lines = presets.map((p) => {
    const f = fieldsFor(p).map((x) => `${x.path}${x.kind === 'enum' ? `: ${x.options!.map((o) => JSON.stringify(o)).join('|')}` : `: ${x.kind}`}`).join('; ');
    return `- ${p.type} (${p.title}${p.fixed ? `, 화면 ${p.fixed === 'top' ? '맨 위' : '맨 아래'} 고정` : ''}${p.kind === 'custom' ? ', HDS에 없는 UI 자리표시' : ''})\n  편집 가능: ${f}\n  기본값: ${JSON.stringify(p.defaults)}`;
  });
  return `너는 하나투어 디자인시스템 HDS(@aliceblue567/hds-react ${catalog.version})로 모바일 화면(폭 360)을 조합하는 도구다.
코드를 쓰지 말고 아래 JSON 한 개만 출력한다. 설명 문장 · 마크다운 금지.

{"title":"화면 이름","blocks":[{"type":"블록 타입","props":{...}}]}

규칙
1. type은 아래 목록에 있는 것만 쓴다. 목록에 없는 UI가 꼭 필요하면 type "Custom"으로 두고 props.label(무엇) · props.reason(왜 HDS로 안 되는지)을 적는다.
2. props에는 '편집 가능'에 적힌 키만 쓴다. 값은 적힌 허용값 중에서 고른다. 안 적은 키는 기본값이 쓰인다.
3. 순서는 위에서 아래로. Header는 맨 처음, BottomFixed는 맨 끝에 한 번만.
4. 섹션마다 SectionTitle을 두고, 섹션 사이는 Divider(thickness "block")로 나눈다.
5. 문구는 하나투어 여행 상품 맥락의 실제 같은 한국어로 쓴다. 안내는 해요체, 버튼은 짧은 명령형("예약하기").
6. 데이터가 비는 상황을 요청받으면 EmptyState를 쓴다.
7. 사람 이름 · 실존 브랜드 로고 · 실제 가격은 지어내지 말고 예시 수준으로 둔다.

참고 데이터(목데이터)
- 오사카 · 교토 · 나라 4일, 노쇼핑 · 노옵션 / 대한항공 / 성인 1,290,000원 / 무료취소 · 출발확정 / 평점 4.7(128)
- 다낭 · 호이안 5일, 5성 리조트 / 진에어 / 성인 899,000원 / 조식포함
- 파리 · 스위스 · 로마 서유럽 8일 / 아시아나항공 / 성인 3,490,000원

블록 목록
${lines.join('\n')}`;
}

export function parseSpec(text: string): { title: string; blocks: Block[]; warnings: string[] } {
  const warnings: string[] = [];
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s < 0 || e < s) throw new Error('AI 응답에서 JSON을 찾지 못했어요');
  const raw = JSON.parse(text.slice(s, e + 1)) as { title?: string; blocks?: { type?: string; props?: Record<string, unknown> }[] };
  const blocks: Block[] = [];
  for (const b of raw.blocks ?? []) {
    const type = String(b.type ?? '');
    let preset = presetByType.get(type);
    let given = b.props ?? {};
    if (!preset) {
      warnings.push(`카탈로그에 없는 "${type}" → 커스텀 블록으로 바꿈`);
      preset = presetByType.get('Custom')!;
      given = { label: type || '알 수 없는 블록', reason: 'AI가 HDS에 없는 컴포넌트를 요청함' };
    }
    let props = structuredClone(preset.defaults);
    for (const f of fieldsFor(preset)) {
      const v = getPath(given, f.path);
      if (v === undefined) continue;
      if (f.kind === 'enum' && !f.options!.includes(v as never)) { warnings.push(`${type}.${f.path}="${v}"는 허용값이 아님 → 기본값`); continue; }
      if (f.kind === 'boolean') props = setPath(props, f.path, Boolean(v));
      else if (f.kind === 'number') props = setPath(props, f.path, Number(v));
      else props = setPath(props, f.path, typeof v === 'string' || typeof v === 'number' ? v : String(v));
    }
    blocks.push({ id: uid(), type: preset.type, props });
  }
  return { title: raw.title ?? '새 화면', blocks, warnings };
}

export async function composeWithAI(prompt: string, current: Block[], mode: 'new' | 'edit'): Promise<{ title: string; blocks: Block[]; warnings: string[] }> {
  const user = mode === 'edit' && current.length
    ? `지금 화면(블록 JSON):\n${JSON.stringify({ blocks: current.map(({ type, props }) => ({ type, props })) })}\n\n요청: ${prompt}\n\n요청을 반영한 전체 화면 JSON을 다시 출력해.`
    : `요청: ${prompt}`;
  const res = await fetch('/api/compose', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ system: systemPrompt(), user }) });
  const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
  if (!res.ok || !data.text) throw new Error(data.error ?? `요청 실패 (${res.status})`);
  return parseSpec(data.text);
}
