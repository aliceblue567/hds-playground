import { Component, useState, type ReactNode } from 'react';
import { EmptyState, SkeletonRectangle, SkeletonText, FilterChip, Toast } from '@aliceblue567/hds-react';
import { presetByType, renderBlock } from '../registry';
import { recipeStyle, type ProductProps, type RecipeNode } from '../product';
import { missingFields, type Action, type FlowScreen, type Values, type ProductState } from './model';
import './preview.css';

type Props = { screen: FlowScreen; state: ProductState; values: Values; onValue: (key: string, value: Values[string]) => void; onNavigate: (action: Action) => void; onState: (state: ProductState) => void; editing?: boolean; selected?: string | null; onSelect?: (id: string) => void };
class RenderBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <EmptyState type="error" size="compact" heading="이 화면을 표시하지 못했어요" description="화면 구성과 입력 속성을 수정해주세요." /> : this.props.children; }
}
export function ProtoPreview(props: Props) {
  return <RenderBoundary key={`${props.screen.id}:${JSON.stringify(props.screen.blocks)}:${props.state}`}><PreviewContent {...props} /></RenderBoundary>;
}
function PreviewContent({ screen, state, values, onValue, onNavigate, onState, editing, selected, onSelect }: Props) {
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [chips, setChips] = useState<Record<string, number>>({});
  const act = (target: string, event: Action['event']) => {
    const action = screen.actions.find(a => a.target === target && a.event === event);
    if (!action) { setNotice('아직 연결하지 않은 동작이에요. 검토 목록에서 확인해주세요.'); return; }
    const missing = missingFields(action, values);
    setErrors(missing);
    if (missing.length) { setNotice('필수 입력과 동의 항목을 확인해주세요.'); return; }
    setNotice(''); onNavigate(action);
  };
  const leaf = (type: string, original: Record<string, unknown>, key: string): ReactNode => {
    const p = { ...original };
    const binding = screen.fields.find(f => f.target === key);
    if (binding) {
      const value = values[binding.key];
      delete p.defaultValue; delete p.defaultChecked;
      const set = (v: Values[string]) => { onValue(binding.key, v); setErrors(prev => prev.filter(k => k !== binding.key)); setNotice(''); };
      if (type === 'CheckboxItem') { p.checked = Boolean(value); p.onChange = (e: { target: { checked: boolean } }) => set(e.target.checked); }
      else if (type === 'TextInput' || type === 'SearchField') { p.value = value ?? ''; p.onChange = (e: { target: { value: string } }) => set(e.target.value); }
      else { p.value = value ?? ''; p.onChange = (v: string | number) => set(v); }
      if (errors.includes(binding.key)) {
        if (['TextInput', 'Select'].includes(type)) { p.status = 'negative'; p.description = `${binding.label} 항목을 입력해주세요.`; }
        else p['aria-invalid'] = true;
      }
    }
    if (type === 'Header') p.onBack = () => act(key, 'back');
    if (['Button', 'ListCell', 'Banner'].includes(type)) p.onClick = () => act(key, 'press');
    if (type === 'EmptyState') p.onAction = () => act(key, 'press');
    if (type === 'BottomFixed') {
      p.primaryAction = { ...(p.primaryAction as object), onClick: () => act(key, 'press') };
      p.secondaryAction = { ...(p.secondaryAction as object), onClick: () => act(key, 'secondary') };
    }
    if (type === 'FilterChipRow') return <div className="st-row">{String(p.labels ?? '').split(',').map((label, i) => <FilterChip key={i} label={label.trim()} selected={(chips[key] ?? Number(p.selectedIndex ?? 0)) === i} onClick={() => setChips(prev => ({ ...prev, [key]: i }))} />)}</div>;
    return renderBlock(presetByType.get(type)!, p);
  };
  const recipe = (n: RecipeNode, key: string): ReactNode => n.type === 'Stack'
    ? <div key={key} style={recipeStyle(n)}>{n.children?.map((c, i) => recipe(c, `${key}/${i}`))}</div>
    : n.type === 'Text' ? <p key={key} style={recipeStyle(n)}>{String(n.props.text)}</p>
      : <div key={key}>{leaf(n.type, n.props, key)}</div>;
  const render = (b: FlowScreen['blocks'][number]) => {
    const preset = presetByType.get(b.type)!;
    const product = b.props as unknown as ProductProps;
    return <div key={b.id} className={`st-block ${preset.inset ? 'st-block--inset' : ''} ${selected === b.id && editing ? 'is-selected' : ''}`}>
      {b.type === 'Product' ? <section aria-label={product.name} data-hds="custom" data-hds-reason={product.reason} data-product-status="draft">{product.states[product.state].map((n, i) => recipe(n, `${b.id}/${product.state}/${i}`))}</section> : leaf(b.type, b.props, b.id)}
      {editing && <button className="flow-block-hit" type="button" aria-label={`${String(b.props.name ?? b.props.label ?? b.props.title ?? preset.title)} 수정 선택`} onClick={() => onSelect?.(b.id)}><span>{preset.title}</span></button>}
    </div>;
  };
  return <div className="st-frame flow-preview" aria-label={`${screen.title} 프로토타입`}>
    <div className="st-frame__top">{screen.blocks.filter(b => presetByType.get(b.type)?.fixed === 'top').map(render)}</div>
    <div className="st-frame__body" key={`${screen.id}:${state}`}>
      {state === 'default' ? screen.blocks.filter(b => !presetByType.get(b.type)?.fixed).map(render)
        : <div className="flow-state">{state === 'loading' ? <><SkeletonRectangle width="100%" height={140} /><SkeletonText /></> : <EmptyState type={state === 'error' ? 'error' : 'empty'} size="compact" heading={state === 'error' ? '정보를 불러오지 못했어요' : '표시할 정보가 없어요'} description="프로토타입 상태 시연이에요." showButton actionLabel="다시 확인하기" onAction={() => onState('default')} />}</div>}
      {notice && <div role="status" className="flow-notice"><Toast message={notice} /></div>}
    </div>
    {state === 'default' && <div className="st-frame__bottom">{screen.blocks.filter(b => presetByType.get(b.type)?.fixed === 'bottom').map(render)}</div>}
  </div>;
}
