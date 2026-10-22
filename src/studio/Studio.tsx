// HDS Studio — HDS 컴포넌트만으로 화면을 조합하는 도구. 시연 · 기획 리뷰용.
// 왼쪽 팔레트(직접 조합) · 위쪽 프롬프트(AI 조합) · 가운데 360 화면 · 오른쪽 속성 패널(카탈로그에서 유도).
import { Component, useEffect, useMemo, useState, type ReactNode } from 'react';
import { presets, presetByType, fieldsFor, getPath, setPath, renderBlock, blockCode, catalog, blockImports } from './registry';
import { composeWithAI, newBlock, uid, type Block } from './compose';
import './studio.css';
import { blockStats } from './stats';
import { FieldRow } from './FieldRow';
import { ProductEditor } from './ProductEditor';
import { type ProductProps } from './product';

const STORE = 'hds-studio:v1';
const RECIPES = 'hds-studio:products:v1';
type SavedProduct = { id: string; version: string; props: Record<string, unknown> };
const loadProducts = (): SavedProduct[] => { try { const data = JSON.parse(localStorage.getItem(RECIPES) ?? '[]'); return Array.isArray(data) ? data.filter(p => p?.id && p?.props?.states).slice(0, 20) : []; } catch { return []; } };
const load = (): { title: string; blocks: Block[] } | null => { try { return JSON.parse(localStorage.getItem(STORE) ?? 'null'); } catch { return null; } };
const save = (v: unknown) => { try { localStorage.setItem(STORE, JSON.stringify(v)); } catch { /* 저장 불가 환경 */ } };

const SAMPLE = (): Block[] => {
  const b = (type: string, props: Record<string, unknown> = {}): Block => { const n = newBlock(type); n.props = { ...n.props, ...props }; return n; };
  return [
    b('Header', { title: '상품 상세' }),
    b('ImageFrame', { ratio: '16:9' }),
    b('SectionTitle', { text: '오사카 · 교토 · 나라 4일' }),
    b('LabelRow', { labels: '무료취소, 노쇼핑, 출발확정' }),
    b('Rating'),
    b('Divider'),
    b('SectionTitle', { text: '출발일' }),
    b('FilterChipRow', { labels: '11.12(목), 11.19(목), 11.26(목)', selectedIndex: 1 }),
    b('CounterItem', { label: '성인', price: 1290000, defaultValue: 2 }),
    b('Divider'),
    b('AccordionGroup'),
    b('BottomFixed', { layout: 'dual-prominent', primaryAction: { label: '예약하기' }, secondaryAction: { label: '찜' }, panelLabel: '총 상품 금액', panelValue: '2,580,000원' }),
  ];
};

class Boundary extends Component<{ children: ReactNode; name: string }, { err: string | null }> {
  state = { err: null as string | null };
  static getDerivedStateFromError(e: Error) { return { err: e.message }; }
  render() { return this.state.err ? <div className="st-error">{this.props.name} 렌더 오류: {this.state.err}</div> : this.props.children; }
}

export function Studio() {
  const init = useMemo(load, []);
  const [title, setTitle] = useState(init?.title ?? '새 화면');
  const [blocks, setBlocks] = useState<Block[]>(init?.blocks ?? SAMPLE());
  const [sel, setSel] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'new' | 'edit'>('new');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'error' | 'info'; text: string; list?: string[] } | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [search, setSearch] = useState('');
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>(loadProducts);
  const [previous, setPrevious] = useState<{ title: string; blocks: Block[] } | null>(null);
  const matches = (text: string) => text.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase());
  const visiblePresets = presets.filter((p) => matches(`${p.title} ${p.type} ${p.component ?? ''} ${p.group}`));
  const available = new Set(presets.filter(p => p.kind === 'hds').map(p => p.component ?? p.type));
  const otherComponents = catalog.components.filter(c => !available.has(c.name) && matches(`${c.name} ${c.group}`));

  useEffect(() => save({ title, blocks }), [title, blocks]);

  const selected = blocks.find((b) => b.id === sel) ?? null;
  const stats = useMemo(() => blockStats(blocks), [blocks]);

  const add = (type: string) => {
    const nb = newBlock(type);
    const p = presetByType.get(type)!;
    setBlocks((bs) => {
      if (p.fixed === 'top') return [nb, ...bs.filter((b) => b.type !== type)];
      if (p.fixed === 'bottom') return [...bs.filter((b) => b.type !== type), nb];
      const i = sel ? bs.findIndex((b) => b.id === sel) : -1;
      const at = i >= 0 ? i + 1 : bs.findIndex((b) => presetByType.get(b.type)?.fixed === 'bottom');
      const pos = at < 0 ? bs.length : at;
      return [...bs.slice(0, pos), nb, ...bs.slice(pos)];
    });
    setSel(nb.id);
  };
  const update = (id: string, path: string, v: unknown) => setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, props: setPath(b.props, path, v) } : b)));
  const move = (id: string, d: -1 | 1) => setBlocks((bs) => { const i = bs.findIndex((b) => b.id === id); const j = i + d; if (j < 0 || j >= bs.length) return bs; const c = [...bs]; [c[i], c[j]] = [c[j], c[i]]; return c; });
  const remove = (id: string) => { setBlocks((bs) => bs.filter((b) => b.id !== id)); setSel(null); };
  const dup = (id: string) => setBlocks((bs) => { const i = bs.findIndex((b) => b.id === id); return [...bs.slice(0, i + 1), { ...structuredClone(bs[i]), id: uid() }, ...bs.slice(i + 1)]; });

  const run = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true); setMsg(null);
    try {
      const r = await composeWithAI(prompt, blocks, mode);
      setPrevious({ title, blocks: structuredClone(blocks) });
      setBlocks(r.blocks); setTitle(r.title); setSel(null); setMode('edit');
      setMsg({ kind: 'info', text: `전체 블록 ${blockStats(r.blocks).total}개로 조합했어요.`, list: r.warnings });
    } catch (e) {
      setMsg({ kind: 'error', text: (e as Error).message });
    } finally { setBusy(false); }
  };

  const top = blocks.filter((b) => presetByType.get(b.type)?.fixed === 'top');
  const body = blocks.filter((b) => !presetByType.get(b.type)?.fixed);
  const bottom = blocks.filter((b) => presetByType.get(b.type)?.fixed === 'bottom');
  const code = useMemo(() => {
    const used = [...new Set(blocks.flatMap(b => blockImports(presetByType.get(b.type)!, b.props)))];
    return `import '@aliceblue567/hds-react/styles';\nimport { ${used.sort().join(', ')} } from '@aliceblue567/hds-react';\n\nexport function Screen() {\n  return (\n    <>\n${blocks.map((b) => blockCode(presetByType.get(b.type)!, b.props).split('\n').map((l) => '      ' + l).join('\n')).join('\n')}\n    </>\n  );\n}\n`;
  }, [blocks]);

  const saveProduct = (block: Block) => {
    if (savedProducts.length >= 20) { setMsg({ kind: 'error', text: '후보는 이 브라우저에 최대 20개까지 저장할 수 있어요.' }); return; }
    const next = [...savedProducts, { id: uid(), version: catalog.version, props: structuredClone(block.props) }];
    try { localStorage.setItem(RECIPES, JSON.stringify(next)); setSavedProducts(next); setMsg({ kind: 'info', text: '프로덕트 후보를 저장했어요. 팔레트에서 다시 추가할 수 있어요.' }); }
    catch { setMsg({ kind: 'error', text: '브라우저 저장 공간이 부족하거나 저장이 차단되어 있어요.' }); }
  };
  const reuseProduct = (saved: SavedProduct) => {
    const b: Block = { id: uid(), type: 'Product', props: structuredClone(saved.props) };
    setBlocks(bs => { const at = bs.findIndex(x => presetByType.get(x.type)?.fixed === 'bottom'); return at < 0 ? [...bs, b] : [...bs.slice(0, at), b, ...bs.slice(at)]; });
    setSel(b.id); setPreview(false);
  };

  const renderOne = (b: Block) => {
    const p = presetByType.get(b.type);
    if (!p) return null;
    return (
      <div key={b.id} className={['st-block', p.inset && 'st-block--inset', p.kind === 'custom' && 'st-block--custom', p.kind === 'product' && 'st-block--product', !preview && sel === b.id && 'is-selected'].filter(Boolean).join(' ')}>
        {p.kind === 'product' && !preview && <span className="st-candidate-label">{String(b.props.name)} · 후보</span>}
        <Boundary key={JSON.stringify(b.props)} name={p.title}>{renderBlock(p, b.props)}</Boundary>
        {!preview && <div className="st-block__hit" onClick={() => setSel(b.id)} title={`${p.title} (${p.component ?? p.type})`}><span>{p.title}</span></div>}
      </div>
    );
  };

  return (
    <div className="st">
      <header className="st-top">
        <a href="#/studio" className="st-back">← 제품 시연</a>
        <strong className="st-brand">HDS Studio</strong>
        <span className="st-ver">hds-react {catalog.version}</span>
        <form className="st-prompt" onSubmit={(e) => { e.preventDefault(); run(); }}>
          <select value={mode} onChange={(e) => setMode(e.target.value as 'new' | 'edit')} aria-label="프롬프트 방식">
            <option value="new">새로 만들기</option>
            <option value="edit">지금 화면 고치기</option>
          </select>
          <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="목적 · 필요한 정보 · 주 행동을 적어주세요. HDS에 없는 카드도 조합할 수 있어요" aria-label="요청" />
          <button type="submit" disabled={busy || !prompt.trim()}>{busy ? '조합 중…' : 'AI로 조합'}</button>
        </form>
      </header>

      <aside className="st-palette" aria-label="블록 팔레트">
        <p className="st-palette__summary">추가 가능한 HDS 블록 {presets.filter(p => p.kind === 'hds').length}종 · 라이브러리 {catalog.components.length}개</p>
        <input type="text" aria-label="컴포넌트 검색" placeholder="이름 또는 그룹 검색" value={search} onChange={e => setSearch(e.target.value)} />
        {[...new Set(visiblePresets.map((p) => p.group))].map((g) => (
          <section key={g}>
            <h3>{g}</h3>
            {visiblePresets.filter((p) => p.group === g).map((p) => (
              <button key={p.type} type="button" onClick={() => add(p.type)} className={p.kind !== 'hds' ? `is-${p.kind}` : undefined}>
                <span>{p.title}</span><code>{p.component ?? p.type}</code>
              </button>
            ))}
          </section>
        ))}
        {visiblePresets.length === 0 && !savedProducts.some(p => matches(String(p.props.name))) && <p>검색에 맞는 블록이 없어요.</p>}
        {savedProducts.length > 0 && <section><h3>저장한 프로덕트 후보</h3>{savedProducts.filter(p => matches(String(p.props.name))).map(p => <button type="button" key={p.id} onClick={() => reuseProduct(p)}>{String(p.props.name)} <small>HDS {p.version}</small></button>)}</section>}
        <details className="st-catalog" open={search.trim() ? true : undefined}>
          <summary>그 밖의 라이브러리 컴포넌트 ({otherComponents.length})</summary>
          <p>조합 내부 부품이나 아직 Studio에 연결하지 않은 항목이에요. 문서에서 사용법을 확인할 수 있어요.</p>
          {otherComponents.map(c => <a key={c.name} href={c.storybook ?? 'https://hds-storybook.vercel.app'} target="_blank" rel="noreferrer">{c.name} ↗</a>)}
        </details>
      </aside>

      <main className="st-stage">
        <div className="st-stage__bar">
          <input className="st-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="화면 이름" />
          <label className="st-toggle"><input type="checkbox" checked={preview} onChange={(e) => { setPreview(e.target.checked); setSel(null); }} /> 미리보기(눌러보기)</label>
        </div>
        {msg && (
          <div className={`st-msg st-msg--${msg.kind}`} role="status">
            {msg.text}
            {msg.list?.length ? <ul>{msg.list.map((w, i) => <li key={i}>{w}</li>)}</ul> : null}
            <button type="button" onClick={() => setMsg(null)} aria-label="닫기">×</button>
          </div>
        )}
        <div className="st-frame">
          <div className="st-frame__top">{top.map(renderOne)}</div>
          <div className="st-frame__body">{body.length ? body.map(renderOne) : <p className="st-empty">왼쪽에서 블록을 누르거나 위에 요청을 써 보세요.</p>}</div>
          <div className="st-frame__bottom">{bottom.map(renderOne)}</div>
        </div>
        <div className="st-stats">
          <span>전체 블록 <b>{stats.total}</b></span>
          <span>HDS 직접 사용 <b>{stats.hds}</b></span>
          <span>프로덕트 후보 <b>{stats.product}</b></span>
          <span>레이아웃 <b>{stats.layout}</b></span>
          <span className={stats.custom ? 'is-warn' : undefined}>커스텀 <b>{stats.custom}</b></span>
          <small className="st-quality-note">후보 내부의 HDS 부품은 속성에서 확인하세요. 블록 수는 디자인 검증 점수가 아니에요.</small>
          {previous && <button type="button" onClick={() => { setBlocks(previous.blocks); setTitle(previous.title); setPrevious(null); setSel(null); setMsg({ kind: 'info', text: '직전 AI 조합 전 화면으로 되돌렸어요.' }); }}>직전 AI 조합 되돌리기</button>}
          <button type="button" onClick={() => setShowCode(true)}>코드 보기</button>
          <button type="button" onClick={() => { setBlocks(SAMPLE()); setTitle('상품 상세 (예시)'); setSel(null); }}>예시 불러오기</button>
          <button type="button" onClick={() => { setBlocks([]); setTitle('새 화면'); setSel(null); setMode('new'); }}>비우기</button>
        </div>
      </main>

      <aside className="st-inspector" aria-label="속성">
        {selected ? <Inspector block={selected} onChange={update} onMove={move} onRemove={remove} onDup={dup} onSave={saveProduct} /> : (
          <div className="st-inspector__empty">
            <p><strong>목적 → 정보 → 행동</strong> 순서로 요청해보세요.</p>
            <p>기존 HDS를 우선 쓰고, 없는 프로덕트 UI는 부품과 토큰을 조합한 후보로 만들어요.</p>
            <button type="button" onClick={() => setPrompt('예약 후 준비할 일을 안내하는 예약 준비 카드를 만들어줘. 예약 상태, 여행자 정보 입력 여부, 다음 할 일을 보여주고 주 버튼은 여행자 정보 입력하기로 해줘. HDS를 우선 재사용하고 기본·로딩·빈 상태·오류 상태도 포함해줘.')}>예약 준비 카드 요청 예시</button>
            <p>화면에서 블록을 누르면 속성을 바꿀 수 있어요. 후보의 상태와 내부 부품도 수정할 수 있어요. 실제 데이터 연결·화면 이동은 별도 개발이 필요해요.</p>
            <p>선택지는 컴포넌트 코드에서 자동으로 읽은 것이라 HDS에 없는 값은 고를 수 없어요. <em>Figma</em> 표시는 Figma 컴포넌트 속성 이름이에요.</p>
          </div>
        )}
      </aside>

      {showCode && (
        <div className="st-modal" role="dialog" aria-modal="true" aria-label="코드" onClick={() => setShowCode(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="st-modal__bar"><strong>{title} — JSX · 현재 표시된 상태</strong><button type="button" onClick={() => { navigator.clipboard?.writeText(code); }}>복사</button><button type="button" onClick={() => setShowCode(false)}>닫기</button></div>
            <pre>{code}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function Inspector({ block, onChange, onMove, onRemove, onDup, onSave }: { block: Block; onChange: (id: string, path: string, v: unknown) => void; onMove: (id: string, d: -1 | 1) => void; onRemove: (id: string) => void; onDup: (id: string) => void; onSave: (block: Block) => void }) {
  const p = presetByType.get(block.type)!;
  const fields = fieldsFor(p);
  const doc = catalog.components.find((c) => c.name === (p.component ?? p.type))?.storybook;
  return (
    <div className="st-insp">
      <div className="st-insp__head">
        <strong>{p.title}</strong>
        <code>{p.component ?? p.type}</code>
        {p.kind === 'product' && <span className="st-tag st-tag--custom">프로덕트 후보 · 검토 전</span>}
        {p.kind === 'custom' && <span className="st-tag st-tag--custom">커스텀 · 백로그 후보</span>}
        {p.kind === 'layout' && <span className="st-tag">레이아웃</span>}
      </div>
      <div className="st-insp__actions">
        {!p.fixed && <><button type="button" onClick={() => onMove(block.id, -1)}>위로</button><button type="button" onClick={() => onMove(block.id, 1)}>아래로</button><button type="button" onClick={() => onDup(block.id)}>복제</button></>}
        <button type="button" onClick={() => onRemove(block.id)} className="is-danger">삭제</button>
      </div>
      {fields.map((f) => <FieldRow key={f.path} f={f} value={getPath(block.props, f.path)} onChange={(v) => onChange(block.id, f.path, v)} />)}
      {p.kind === 'product' && <ProductEditor props={block.props as unknown as ProductProps} onChange={(path, value) => onChange(block.id, path, value)} onSave={() => onSave(block)} />}
      {doc && <a className="st-doc" href={doc} target="_blank" rel="noreferrer">Storybook 문서 열기 ↗</a>}
    </div>
  );
}
