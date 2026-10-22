import { PRODUCT_STATES, stateLabels, stackOptions, textOptions, type ProductProps, type RecipeNode } from './product';
import { fieldsFor, getPath, presetByType, blockImports, type Field } from './registry';
import { FieldRow } from './FieldRow';

export function ProductEditor({ props, onChange, onSave }: { props: ProductProps; onChange: (path: string, value: unknown) => void; onSave: () => void }) {
  const state = props.state;
  const renderNode = (node: RecipeNode, path: string, index: number) => {
    let fields: Field[] = [];
    if (node.type === 'Stack' || node.type === 'Text') {
      fields = Object.entries(node.type === 'Stack' ? stackOptions : textOptions).map(([key, options]) => ({ path: key, label: ({ direction: '배치 방향', gap: '간격', padding: '안쪽 여백', surface: '배경 역할', border: '테두리', radius: '모서리', role: '글자 역할', tone: '글자 색 역할' } as Record<string, string>)[key], kind: 'enum', options: [...options] }));
      if (node.type === 'Text') fields.unshift({ path: 'text', label: '문구', kind: 'text' });
    } else {
      const preset = presetByType.get(node.type);
      if (preset) fields = fieldsFor(preset).map(f => node.type === 'Button' && f.path === 'size' ? { ...f, options: ['xlarge', 'xxlarge'] } : f);
    }
    return <details className="st-recipe-node" key={path}>
      <summary>{index + 1}. {node.type === 'Stack' ? '레이아웃' : node.type === 'Text' ? String(node.props.text).slice(0, 28) || '텍스트' : presetByType.get(node.type)?.title ?? node.type}</summary>
      {fields.map(f => <FieldRow key={f.path} f={f} value={getPath(node.props, f.path)} onChange={value => onChange(`${path}.props.${f.path}`, value)} />)}
      {node.children?.map((child, i) => renderNode(child, `${path}.children.${i}`, i))}
    </details>;
  };
  return <div className="st-product-editor">
    <p className="st-product-notice">프로덕트 후보 · 검토 전<br />HDS 부품과 토큰으로 조합했어요. 디자인·접근성·업무 동작은 검토가 필요해요.</p>
    <label className="st-field"><span>확인할 상태</span><select value={state} onChange={e => onChange('state', e.target.value)}>{PRODUCT_STATES.map(key => <option key={key} value={key}>{stateLabels[key]}</option>)}</select></label>
    <p>사용 부품: {blockImports(presetByType.get('Product')!, props as unknown as Record<string, unknown>).join(', ')}</p>
    {props.states[state].map((node, i) => renderNode(node, `states.${state}.${i}`, i))}
    <button type="button" onClick={onSave}>이 브라우저에 후보 저장</button>
    <small>현재 4개 상태를 함께 저장해요. 정식 HDS 등록이나 팀 공유는 아니에요.</small>
  </div>;
}
