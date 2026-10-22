import { systemPrompt } from '../compose';
import { catalog } from '../registry';
import { obj, readJSON, parsePlan, parseScreen, parseProject, type Plan, type Project, type FlowScreen } from './model';

async function ask(system: string, user: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch('/api/compose', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ system, user }), signal });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || typeof data.text !== 'string') throw new Error(data.error ?? `AI 응답 오류 (${response.status})`);
  return readJSON(data.text);
}
export async function proposePlan(brief: string, signal: AbortSignal): Promise<Plan> {
  return parsePlan(await ask(`너는 HDS 기반 제품 프로토타입 설계자다. 사용자 문제와 기획 요구를 1~6개 화면의 시연 흐름으로 정리한다. 실제 API 호출·로그인·결제·예약 접수는 시연에서 실행하지 않는다. 불명확한 사업 규칙은 assumptions에 명시하고 추측을 사실로 쓰지 않는다. 기존 HDS로 구현 가능한 간결한 화면을 우선한다. 중요한 완료/실패 조건을 acceptance에 적는다. 화면을 예쁘게 나열하는 대신 사용자가 목표에 도달하는 동선을 만든다. JSON만 출력:
{"title":"제품 시연 이름","goal":"확인할 사용자 목표","screens":[{"id":"explore","title":"화면 이름","purpose":"사용자가 이 화면에서 하는 일"}],"assumptions":["확인할 가정"],"acceptance":["시연에서 검토할 조건"],"integrations":["실제 출시 전 연결할 API·정책"]}. id는 영문자로 시작하는 영문/숫자/_/-만 사용한다.`, brief, signal));
}
const flowRules = `
이번 출력은 위 단일 화면 JSON에 id, actions, fields를 더한 시연 화면 스펙이다. 동작은 아래 선언형 연결로만 만든다. JavaScript/HTML/CSS 생성 금지.
{"id":"계획의 화면 id","blocks":[{"id":"name","type":"TextInput","props":{"label":"이름"}},{"id":"next","type":"Button","props":{"label":"계속하기","size":"xlarge"}}],"fields":[{"target":"name","key":"travelerName","label":"이름"}],"actions":[{"target":"next","event":"press","to":"계획에 있는 다음 화면 id","requires":["travelerName"],"label":"다음으로 이동"}]}
- 각 블록 id는 화면 안에서 고유하고 영문자로 시작한다. 수정 시 기존 id를 유지한다.
- Button/ListCell/Banner의 onClick, EmptyState의 onAction은 event press. Header 뒤로는 back. BottomFixed 주 버튼 press, 보조 버튼 secondary. 실제 표시하는 모든 행동에 적절한 화면 연결을 제공한다. 시작 화면 Header는 type popup으로 제목만 표시한다. main/main-simple/search는 연결되지 않은 추가 컨트롤이 생기므로 사용하지 않는다.
- fields는 TextInput/SearchField/Select/CheckboxItem/CounterItem/SegmentedControl/Tabs/RatingInput에만 연결한다. key는 프로젝트 전체에서 공유하는 입력 변수명이고 영문자로 시작한다. 같은 이름은 같은 데이터다. requires에는 실제 fields에 연결한 key만 넣는다. CheckboxItem 필수 검증은 체크=true, 텍스트는 공백 아닌 값인지 확인한다. 그 이상의 검증은 구현됐다고 하지 않는다.
- Product 안의 HDS도 target을 블록id/default/노드인덱스/자식인덱스 (예 card/default/0/2)로 지정하면 연결 가능하다. 클릭 영역을 임의 HTML로 만들지 않는다.
- loading/empty/error는 시연 런타임에서 공통 HDS 상태로 제공된다. Product 자체의 4개 상태 규칙은 유지한다.
- 입력값 표시는 런타임 검토 패널에 나타난다. 임의 {{변수}} 치환, 계산 가격, 조건 분기, API, 검색 결과 필터링 등 지원하지 않는 동작을 된다고 꾸미지 않는다. 이런 미지원 요구는 warnings 배열에 적는다.
- 30개 이하 블록, 페이지당 가능한 간결한 구성. 데이터는 예시임을 표시한다. 실제 서비스에서 사용 중인 승인 패턴이라고 주장하지 않는다.
`;
export async function buildProject(brief: string, plan: Plan, signal: AbortSignal, progress: (text: string) => void): Promise<Project> {
  const screens: FlowScreen[] = [], warnings: string[] = [];
  for (const meta of plan.screens) {
    progress(`${screens.length + 1}/${plan.screens.length} · ${meta.title} 생성 중`);
    const raw = await ask(systemPrompt() + flowRules, `기획: ${brief}\n전체 계획: ${JSON.stringify(plan)}\n이미 연결한 입력: ${JSON.stringify(screens.flatMap(s => s.fields))}\n지금 만들 화면은 ${JSON.stringify(meta)}. 전체 흐름 중 이 화면 하나의 JSON만 출력해.`, signal);
    const parsed = parseScreen(raw, meta, warnings);
    const extra = obj(raw).warnings;
    if (Array.isArray(extra)) warnings.push(...extra.filter((v): v is string => typeof v === 'string'));
    screens.push(parsed);
  }
  return parseProject({ schema: 1, hdsVersion: catalog.version, brief, plan, screens, warnings });
}
export async function reviseProject(project: Project, screenId: string, selected: string | null, request: string, signal: AbortSignal): Promise<Project> {
  const screen = project.screens.find(s => s.id === screenId)!;
  const belongs = (target: string) => target === selected || target.startsWith(`${selected}/`);
  const current = selected ? { ...screen, blocks: screen.blocks.filter(b => b.id === selected), actions: screen.actions.filter(a => belongs(a.target)), fields: screen.fields.filter(f => belongs(f.target)) } : screen;
  const raw = await ask(systemPrompt() + flowRules, `기획: ${project.brief}\n전체 계획: ${JSON.stringify(project.plan)}\n현재 수정 범위: ${selected ? '선택 블록 하나만. 같은 id의 블록 하나로 반환해.' : '현재 화면만.'}\n현재 내용: ${JSON.stringify(current)}\n요청: ${request}\n요청하지 않은 내용과 동작 연결은 유지해. 전체 수정 범위의 blocks/actions/fields JSON을 반환해.`, signal);
  const warnings: string[] = [];
  const changed = parseScreen(raw, screen, warnings);
  if (selected && (changed.blocks.length !== 1 || changed.blocks[0].id !== selected)) throw new Error('선택한 블록의 범위를 벗어난 수정이라 적용하지 않았어요.');
  const updated = selected ? { ...screen, blocks: screen.blocks.map(b => b.id === selected ? changed.blocks[0] : b), actions: [...screen.actions.filter(a => !belongs(a.target)), ...changed.actions], fields: [...screen.fields.filter(f => !belongs(f.target)), ...changed.fields] } : changed;
  return parseProject({ ...project, screens: project.screens.map(s => s.id === screenId ? updated : s), warnings: [...project.warnings, ...warnings] });
}
