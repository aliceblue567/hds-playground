// 프롬프트 → 화면 스펙. AI는 코드를 쓰지 않고 "블록 목록(JSON)"만 낸다.
// 블록 타입은 레지스트리(=HDS 카탈로그)에 있는 것만 허용하고, 값은 카탈로그의 허용값으로 검증한다.
// 없는 타입은 버리지 않고 Custom 블록으로 바꿔 화면에 드러낸다(AGENTS.md 규칙 4).
import { presets, presetByType, fieldsFor, sanitizeProps, catalog } from './registry';

import { normalizeProduct, productDefaults, stackOptions, textOptions, type RecipeNode } from './product';

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
1. type은 아래 목록에 있는 것만 쓴다. 목록에 없는 UI가 꼭 필요하면 먼저 type "Product"로 기존 HDS 부품과 토큰 기반 레이아웃을 조합한다. 새로운 기본 입력 방식이나 지원하지 않는 동작 등 조합으로도 불가능한 경우에만 type "Custom"으로 두고 props.label · props.reason을 적는다.
2. props에는 '편집 가능'에 적힌 키만 쓴다. 값은 적힌 허용값 중에서 고른다. 안 적은 키는 기본값이 쓰인다.
2-1. 점으로 표시된 경로는 중첩 객체로 출력한다. 예: "primaryAction.label" → "primaryAction":{"label":"적용하기"}, "items.0.label" → "items":[{"label":"전체"}]. 사용자가 지정한 버튼 문구를 그대로 반영한다.
3. 순서는 위에서 아래로. Header는 맨 처음, BottomFixed는 맨 끝에 한 번만.
4. 제목·구분선은 정보 구분에 필요한 위치에만 둔다. Product 안의 제목은 Text(role "title")로 표현한다.
5. 문구는 하나투어 여행 상품 맥락의 실제 같은 한국어로 쓴다. 안내는 해요체, 버튼은 짧은 명령형("예약하기").
6. 데이터가 비는 상황을 요청받으면 EmptyState를 쓴다.
7. 사람 이름 · 실존 브랜드 로고 · 실제 가격은 지어내지 말고 예시 수준으로 둔다.

참고 데이터(목데이터)
- 오사카 · 교토 · 나라 4일, 노쇼핑 · 노옵션 / 대한항공 / 성인 1,290,000원 / 무료취소 · 출발확정 / 평점 4.7(128)
- 다낭 · 호이안 5일, 5성 리조트 / 진에어 / 성인 899,000원 / 조식포함
- 파리 · 스위스 · 로마 서유럽 8일 / 아시아나항공 / 성인 3,490,000원

프로덕트 컴포넌트 규칙
- 기존 HDS 단일 컴포넌트가 해결하면 그것을 재사용한다. 정보 묶음·업무 흐름에 특화된 카드처럼 새 조합이 필요하면 Product를 만든다.
- Product.props는 name(이름), purpose(해결할 사용자 문제), reason(단일 HDS로 안 되는 이유), state("default"), states를 갖는다.
- states에는 default/loading/empty/error 각각 노드 배열이 필요하다. 기본 상태를 고쳤다면 다른 상태도 같은 목적에 맞게 유지한다.
- 각 노드는 {"type":"HDS 블록 타입","props":{...}}. 내부에는 Header, BottomFixed, Product, Custom, SectionTitle을 넣지 않는다.
- 레이아웃은 {"type":"Stack","props":{...},"children":[...]}만 쓴다. 선택값: ${JSON.stringify(stackOptions)}
- 텍스트는 {"type":"Text","props":{"text":"문구",...}}. 선택값: ${JSON.stringify(textOptions)}
- HTML/JavaScript/CSS/style/className/원시 색상/임의 아이콘을 생성하지 않는다. 부품 스타일은 HDS가 담당한다. 레이아웃·타이포는 위 토큰 선택값만 사용한다.
- 최대 깊이 4, 상태별 24개 노드 이내로 간결하게 조합한다. 이름은 역할이 드러나게 쓰고, 정식 HDS로 승인됐다고 표현하지 않는다.
- 버튼은 기존 HDS Button을 사용하고 44px 이상의 터치 영역이 있는 xlarge(48) 또는 xxlarge(56)을 선택한다. 데이터 연결·화면 이동·업무 로직은 구현됐다고 가정하지 않는다.
- 기존 화면 수정에서는 요청하지 않은 블록·텍스트·상태를 보존한다. 기존 조합으로 충분한 곳에 Product를 새로 만들지 않는다.
- 요청이 모호하면 목적·정보·주 행동을 합리적으로 좁혀 조합하고, 모든 섹션에 불필요한 제목·구분선을 반복하지 않는다.
Product JSON 예시: ${JSON.stringify({ type: 'Product', props: productDefaults })}

블록 목록
${lines.join('\n')}`;
}

export function parseSpec(text: string): { title: string; blocks: Block[]; warnings: string[] } {
  const warnings: string[] = [];
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s < 0 || e < s) throw new Error('AI 응답에서 JSON을 찾지 못했어요');
  const raw = JSON.parse(text.slice(s, e + 1)) as { title?: string; blocks?: { type?: string; props?: Record<string, unknown> }[] };
  const blocks: Block[] = [];
  if (!Array.isArray(raw.blocks) || !raw.blocks.length) throw new Error('조합할 블록이 없어요. 요청을 조금 더 구체적으로 적어주세요.');
  for (const b of raw.blocks.slice(0, 40)) {
    const type = String(b.type ?? '');
    let preset = presetByType.get(type);
    let given = b.props ?? {};
    if (!preset) {
      warnings.push(`카탈로그에 없는 "${type}" → 커스텀 블록으로 바꿈`);
      preset = presetByType.get('Custom')!;
      given = { label: type || '알 수 없는 블록', reason: 'AI가 HDS에 없는 컴포넌트를 요청함' };
    }
    const props = preset.kind === 'product'
      ? normalizeProduct(given, (type, values): RecipeNode | null => {
        const child = presetByType.get(type);
        if (!child || child.kind !== 'hds' || child.fixed) return null;
        const props = sanitizeProps(child, values, warnings);
        if (type === 'Button' && props.size !== 'xlarge' && props.size !== 'xxlarge') {
          props.size = 'xlarge'; warnings.push('프로덕트 버튼은 터치 영역 확보를 위해 xlarge(48)로 맞췄어요.');
        }
        return { type, props };
      }, warnings) as unknown as Record<string, unknown>
      : sanitizeProps(preset, given, warnings);
    blocks.push({ id: uid(), type: preset.type, props });
  }
  return { title: typeof raw.title === 'string' ? raw.title.slice(0, 120) : '새 화면', blocks, warnings: [...new Set(warnings)] };
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
