import { useEffect, useMemo, useRef, useState } from 'react';
import { catalog, presetByType, fieldsFor, setPath, getPath } from '../registry';
import { PRODUCT_STATES, stateLabels, type ProductProps } from '../product';
import { FieldRow } from '../FieldRow';
import { ProductEditor } from '../ProductEditor';
import { sampleProject } from './sample';
import { ProtoPreview } from './Preview';
import { parseProject, inspect, initialValues, diffProjects, type Project, type Plan, type ProductState, type Values } from './model';
import { buildProject, proposePlan, reviseProject } from './ai';
import { download, downloadHandoff } from './export';
import '../studio.css';
import './flow.css';

const STORE = 'hds-studio:flow:v1';
function load() {
  try { const raw = localStorage.getItem(STORE); return { project: raw ? parseProject(JSON.parse(raw)) : sampleProject(), error: '' }; }
  catch { return { project: sampleProject(), error: '저장한 프로젝트를 읽지 못했어요. 예시를 표시했어요. 새 변경을 적용하기 전까지 기존 저장 내용은 유지돼요.' }; }
}
export function FlowStudio() {
  const init = useMemo(load, []);
  const [project, setProject] = useState<Project>(init.project);
  const [brief, setBrief] = useState('');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);
  const [previous, setPrevious] = useState<Project | null>(null);
  const [screenId, setScreenId] = useState(project.screens[0].id);
  const [state, setState] = useState<ProductState>('default');
  const [values, setValues] = useState<Values>(() => initialValues(project));
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [request, setRequest] = useState('');
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState(init.error);
  const [panel, setPanel] = useState<'review' | 'edit' | 'handoff'>('review');
  const [checks, setChecks] = useState<string[]>([]);
  const [runId, setRunId] = useState(0);
  const [trace, setTrace] = useState<string[]>([]);
  const controller = useRef<AbortController | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const shown = draft ?? project;
  const screen = shown.screens.find(s => s.id === screenId) ?? shown.screens[0];
  const selectedBlock = screen.blocks.find(b => b.id === selected);
  const issues = useMemo(() => inspect(shown), [shown]);
  const reset = (p: Project, keepScreen = false) => { if (!keepScreen || !p.screens.some(s => s.id === screenId)) setScreenId(p.screens[0].id); setRunId(id => id + 1); setValues(initialValues(p)); setState('default'); setSelected(null); setTrace([]); };
  const store = (p: Project) => {
    setPrevious(project); setProject(p); setDraft(null); setChecks([]); reset(p, true);
    try { localStorage.setItem(STORE, JSON.stringify(p)); setMessage('이 브라우저에 저장했어요. 팀에 전달하려면 프로젝트나 개발 파일을 내려받으세요.'); }
    catch { setMessage('현재 화면에는 적용했지만 브라우저 저장에 실패했어요. 프로젝트 파일을 내려받아 보관해주세요.'); }
  };
  const stage = (p: Project) => { setDraft(p); reset(p, true); setEditing(false); setPanel('review'); };
  const task = async (label: string, fn: (signal: AbortSignal) => Promise<void>) => {
    if (controller.current) return;
    const abort = new AbortController(); controller.current = abort; setBusy(label); setMessage('');
    try { await fn(abort.signal); } catch (e) { setMessage(abort.signal.aborted ? '생성을 취소했어요. 적용한 프로젝트는 유지돼요.' : (e as Error).message); }
    finally { controller.current = null; setBusy(''); }
  };
  const selectScreen = (id: string) => { setScreenId(id); setSelected(null); setState('default'); };
  const updateProp = (path: string, value: unknown) => {
    if (!selectedBlock) return;
    const next = structuredClone(shown), s = next.screens.find(s => s.id === screen.id)!;
    s.blocks = s.blocks.map(b => b.id === selectedBlock.id ? { ...b, props: setPath(b.props, path, value) } : b);
    try { setDraft(parseProject(next)); } catch (e) { setMessage((e as Error).message); }
  };
  const loadFile = async (file?: File) => {
    if (!file) return;
    try { if (file.size > 2_000_000) throw new Error('프로젝트 파일은 2MB 이하로 가져와주세요.'); stage(parseProject(JSON.parse(await file.text()))); setMessage('가져온 프로젝트를 미리 확인한 뒤 적용해주세요.'); }
    catch (e) { setMessage((e as Error).message); }
    if (fileInput.current) fileInput.current.value = '';
  };
  return <div className="st flow-workspace">
    <header className="st-top flow-top">
      <a className="st-back" href="#/">목록</a><strong className="st-brand">HDS Studio</strong><span className="st-ver">제품 시연 · HDS {catalog.version}</span>
      <div className="flow-top-actions"><button type="button" disabled={!!busy || !!draft} onClick={() => fileInput.current?.click()}>프로젝트 가져오기</button><a href="#/studio-blocks">기존 블록 편집기</a></div>
      <input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={e => void loadFile(e.target.files?.[0])} />
    </header>
    <aside className="flow-brief" aria-label="기획과 화면 흐름">
      <span className="flow-eyebrow">01 · 기획과 흐름</span><h1>어떤 경험을<br />확인하고 싶나요?</h1><p>기획을 적으면 HDS로 화면과 동작을 연결해요.</p>
      <label className="flow-label" htmlFor="flow-brief">기획서 · 사용자 시나리오</label>
      <textarea id="flow-brief" value={brief} disabled={!!busy || !!draft} maxLength={12000} onChange={e => { setBrief(e.target.value); setPlan(null); }} placeholder="누가 어떤 일을 완료해야 하나요? 필요한 정보, 주요 행동, 실패 조건을 적거나 기획서 내용을 붙여넣어주세요." rows={7} />
      <button className="flow-primary" type="button" disabled={!!busy || !!draft || !brief.trim()} onClick={() => void task('화면 흐름 제안 중', async signal => setPlan(await proposePlan(brief, signal)))}>화면 흐름 제안받기</button>
      {plan && <section className="flow-plan" aria-label="생성 전 흐름 검토"><h2>{plan.title}</h2><p>{plan.goal}</p><ol>{plan.screens.map((s, i) => <li key={s.id}><input aria-label={`제안 화면 ${i + 1} 이름`} disabled={!!busy} value={s.title} onChange={e => setPlan({ ...plan, screens: plan.screens.map(x => x.id === s.id ? { ...x, title: e.target.value } : x) })} /><textarea aria-label={`제안 화면 ${i + 1} 목적`} disabled={!!busy} rows={2} value={s.purpose} onChange={e => setPlan({ ...plan, screens: plan.screens.map(x => x.id === s.id ? { ...x, purpose: e.target.value } : x) })} /></li>)}</ol><label className="flow-label">확인할 가정 · 한 줄에 하나<textarea disabled={!!busy} rows={4} value={plan.assumptions.join('\n')} onChange={e => setPlan({ ...plan, assumptions: e.target.value.split('\n') })} /></label><button className="flow-primary" disabled={!!busy || !!draft} onClick={() => void task('프로토타입 생성 준비', async signal => { stage(await buildProject(brief, plan, signal, setBusy)); setPlan(null); })}>이 흐름으로 프로토타입 만들기</button></section>}
      <div className="flow-divider" /><div className="flow-section-heading"><h2>현재 화면 흐름</h2><span>{shown.screens.length}개</span></div>
      <nav className="flow-screen-list" aria-label="시연 화면">{shown.screens.map((s, i) => <button key={s.id} type="button" aria-current={screen.id === s.id ? 'step' : undefined} onClick={() => selectScreen(s.id)}><b>{String(i + 1).padStart(2, '0')}</b><span>{s.title}<small>{s.purpose}</small></span></button>)}</nav>
      <button type="button" disabled={!!busy || !!draft} onClick={() => { stage(sampleProject()); setMessage('예시를 확인한 뒤 적용하면 현재 프로젝트를 바꿀 수 있어요.'); }}>예약 요청 예시 불러오기</button>
      <p className="flow-muted">기존 단일 화면 작업은 ‘기존 블록 편집기’에 보관되어 있어요.</p>
    </aside>
    <main className="flow-stage">
      <div className="flow-stage-heading"><div><span className="flow-eyebrow">02 · 작동하는 프로토타입</span><h2>{shown.plan.title}</h2><p>{shown.plan.goal}</p></div><span className="flow-badge">샘플 데이터</span></div>
      {(busy || message) && <div className="flow-message" role="status"><span>{busy || message}</span>{busy ? <button onClick={() => controller.current?.abort()}>생성 취소</button> : <button aria-label="안내 닫기" onClick={() => setMessage('')}>닫기</button>}</div>}
      {draft && <section className="flow-draft" aria-label="변경 검토"><strong>적용 전 변경안</strong><ul>{diffProjects(project, draft).map((d, i) => <li key={i}>{d}</li>)}</ul><div className="flow-actions"><button className="flow-primary" disabled={!!busy} onClick={() => store(draft)}>변경 적용</button><button disabled={!!busy} onClick={() => { setDraft(null); reset(project, true); setMessage('변경안을 버리고 적용된 프로젝트로 돌아왔어요.'); }}>변경 취소</button></div></section>}
      <div className="flow-preview-toolbar"><div className="flow-segments" role="group" aria-label="작업 모드"><button aria-pressed={!editing} onClick={() => { setEditing(false); setSelected(null); }}>직접 시연</button><button aria-pressed={editing} onClick={() => { setEditing(true); setState('default'); setPanel('edit'); }}>영역 수정</button></div><label>상태 <select aria-label="시연 상태" value={state} onChange={e => { setState(e.target.value as ProductState); setSelected(null); }}>{PRODUCT_STATES.map(s => <option key={s} value={s}>{stateLabels[s]}</option>)}</select></label></div>
      <ProtoPreview key={`${screen.id}:${runId}`} screen={screen} state={state} values={values} onValue={(key, value) => setValues(v => ({ ...v, [key]: value }))} onState={setState} onNavigate={action => { setTrace(log => [...log.slice(-19), `${screen.title} → ${shown.screens.find(s => s.id === action.to)?.title} · ${action.label}`]); selectScreen(action.to); }} editing={editing} selected={selected} onSelect={id => { setSelected(id); setPanel('edit'); }} />
      <div className="flow-preview-footer"><span>{screen.title} · 360px</span><button onClick={() => reset(shown)}>시연 다시 시작</button>{previous && !draft && <button disabled={!!busy} onClick={() => { const restored = previous; store(restored); setPrevious(null); }}>직전 적용 되돌리기</button>}</div>
      <p className="flow-muted">실제 예약·결제는 발생하지 않아요. 로딩·빈 상태·오류는 수동 시연이에요.</p>
    </main>
    <aside className="flow-review" aria-label="수정과 개발 전달">
      <span className="flow-eyebrow">03 · 검토와 전달</span>
      <div className="flow-tabs" role="group" aria-label="검토 도구">{(['review', 'edit', 'handoff'] as const).map(p => <button key={p} aria-pressed={panel === p} onClick={() => setPanel(p)}>{{ review: '검토', edit: '수정', handoff: '개발 전달' }[p]}</button>)}</div>
      {panel === 'review' && <>
        <h2>시연에서 확인할 것</h2><p className="flow-muted">실제로 눌러보고 확인한 항목에 표시해주세요.</p>
        <div className="flow-checks">{shown.plan.acceptance.map((item, i) => <label key={i}><input type="checkbox" disabled={!!draft} checked={!draft && checks.includes(item)} onChange={e => setChecks(c => e.target.checked ? [...c, item] : c.filter(x => x !== item))} /><span>{item}</span></label>)}</div>
        <div className="flow-divider" /><h2>연결 검사 <span className="flow-badge">{issues.length}건</span></h2><p className="flow-muted">지원 속성·화면 도달성·동작·입력 연결을 검사해요. 디자인 승인 점수는 아니에요.</p>
        {issues.length ? <ul className="flow-issues">{issues.map((x, i) => <li key={i}>{x}</li>)}</ul> : <p className="flow-success">검사한 연결에서 문제를 찾지 못했어요.</p>}
        <details open><summary>확인할 가정</summary><ul>{shown.plan.assumptions.map((x, i) => <li key={i}>{x}</li>)}</ul></details>
        <details><summary>이번 시연의 입력값</summary>{Object.entries(values).length ? <dl>{Object.entries(values).map(([key, value]) => <div key={key}><dt>{shown.screens.flatMap(s => s.fields).find(f => f.key === key)?.label ?? key}</dt><dd>{typeof value === 'boolean' ? value ? '동의함' : '미동의' : String(value) || '미입력'}</dd></div>)}</dl> : <p>연결한 입력이 없어요.</p>}<p className="flow-muted">입력값은 파일로 내보내거나 저장하지 않아요.</p></details>
        <details><summary>이동 기록 ({trace.length})</summary><ol>{trace.map((x, i) => <li key={i}>{x}</li>)}</ol></details>
      </>}
      {panel === 'edit' && <>
        <h2>{selectedBlock ? '선택 영역 수정' : '현재 화면 수정'}</h2><p>{selectedBlock ? String(selectedBlock.props.name ?? selectedBlock.props.label ?? selectedBlock.type) : screen.title}</p>
        {selectedBlock && <button onClick={() => setSelected(null)}>화면 전체로 범위 변경</button>}
        <label className="flow-label" htmlFor="flow-change">어떻게 바꿀까요?</label><textarea id="flow-change" rows={5} value={request} disabled={!!busy || !!draft} onChange={e => setRequest(e.target.value)} placeholder="예: 여행자 이름 입력 전에 준비해야 할 정보를 안내해줘." />
        <button className="flow-primary" disabled={!!busy || !!draft || !request.trim()} onClick={() => void task('수정안 생성 중', async signal => { stage(await reviseProject(project, screen.id, selected, request, signal)); setRequest(''); })}>수정안 확인하기</button>
        <p className="flow-muted">다른 화면은 유지해요. 수정안은 비교 후 적용할 수 있어요.</p>
        {selectedBlock && <details><summary>직접 속성 조정</summary>{selectedBlock.type === 'Product' ? <ProductEditor props={selectedBlock.props as unknown as ProductProps} onChange={updateProp} /> : fieldsFor(presetByType.get(selectedBlock.type)!).map(field => <FieldRow key={field.path} f={field} value={getPath(selectedBlock.props, field.path)} onChange={value => updateProp(field.path, value)} />)}</details>}
        <details><summary>이 화면의 동작 연결</summary>{screen.actions.length ? screen.actions.map((a, i) => <p key={i}>{a.label} → {shown.screens.find(s => s.id === a.to)?.title}{a.requires.length > 0 && <small> · 필수 입력 {a.requires.length}개</small>}</p>) : <p>연결된 화면 이동이 없어요.</p>}</details>
      </>}
      {panel === 'handoff' && <>
        <h2>시연한 동작까지 전달</h2><p>같은 HDS 코드와 화면·입력·이동 연결을 묶어 전달해요.</p>
        <div className="flow-package"><strong>React 실행 프로젝트</strong><span>화면 코드 · 상태 · 동작 · HDS 패키지</span><span>기획 가정 · 검토 기록 · 연동 과제</span><button className="flow-primary" disabled={!!busy || !!draft} onClick={() => void task('개발 파일 준비 중', async () => { await downloadHandoff(project, checks); setMessage('hds-prototype.zip을 내려받았어요. README에서 실행 방법과 남은 연동 작업을 확인해주세요.'); })}>개발 파일 ZIP 받기</button></div>
        <button disabled={!!draft} onClick={() => download(new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' }), 'hds-prototype.json')}>다시 편집할 프로젝트 JSON 받기</button>
        {draft && <p>변경안을 적용한 뒤 내보낼 수 있어요.</p>}
        <h2>실제 출시 전 연결할 것</h2><ul>{shown.plan.integrations.map((x, i) => <li key={i}>{x}</li>)}</ul><p className="flow-muted">샘플 데이터와 시연용 동작이에요. API·인증·업무 검증은 개발팀이 연결해야 해요.</p>
        <div className="flow-divider" /><h2>사용한 시스템</h2><p>HDS React {shown.hdsVersion}</p><a href="https://hds-storybook.vercel.app" target="_blank" rel="noreferrer">컴포넌트 기준 보기 ↗</a><p className="flow-muted">등록된 HDS 코드·속성·토큰을 사용해요. 새로운 조합은 검토 후보이며, 최신 Figma와의 자동 대조·프로덕트 라이브러리 검색은 아직 연결되지 않았어요.</p>
      </>}
    </aside>
  </div>;
}
