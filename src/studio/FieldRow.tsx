import type { Field } from './registry';

export function FieldRow({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  const head = <span className="st-field__label">{f.label}{f.figma && <em>Figma {f.figma}</em>}</span>;
  return (
    <label className="st-field" title={f.hint}>
      {head}
      {f.kind === 'enum' && (
        <select value={JSON.stringify(value ?? null)} onChange={(e) => onChange(JSON.parse(e.target.value))}>
          {value === undefined && <option value="null">(기본)</option>}
          {f.options!.map((o) => <option key={String(o)} value={JSON.stringify(o)}>{String(o)}</option>)}
        </select>
      )}
      {f.kind === 'boolean' && <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />}
      {f.kind === 'text' && <input type="text" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} />}
      {f.kind === 'number' && <input type="number" value={value === undefined ? '' : Number(value)} onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))} />}
      {f.hint && <small>{f.hint}</small>}
    </label>
  );
}
