import { transform } from 'esbuild';
import * as HDS from '@aliceblue567/hds-react';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseSpec } from '../src/studio/compose';
import { presets, catalog, presetByType, renderBlock, blockCode } from '../src/studio/registry';
import { blockStats } from '../src/studio/stats';

for (const props of [
  { 'primaryAction.label': '적용하기' },
  { primaryAction: { label: '적용하기' } },
]) {
  const { blocks } = parseSpec(JSON.stringify({ blocks: [{ type: 'BottomFixed', props }] }));
  const preset = presetByType.get('BottomFixed')!;
  const html = renderToStaticMarkup(renderBlock(preset, blocks[0].props));
  assert.ok(html.includes('적용하기'));
  assert.ok(!html.includes('예약하기'));
  assert.ok(blockCode(preset, blocks[0].props).includes('적용하기'));
}
const tabs = parseSpec(JSON.stringify({ blocks: [{ type: 'Tabs', props: { 'items.0.label': '쿠폰' } }] }));
assert.equal((tabs.blocks[0].props.items as {label:string}[])[0].label, '쿠폰');
const blocks = ['Header', 'SectionTitle', 'RadioItem', 'RadioItem', 'Divider', 'SectionTitle', 'ListCell', 'ListCell', 'BottomFixed'].map(type => ({ type }));
assert.deepEqual(blockStats(blocks), { total: 9, hds: 7, layout: 2, custom: 0, ratio: 100 });
assert.equal(blockStats([]).ratio, null);
assert.equal(blockStats([{ type: 'SectionTitle' }]).ratio, null);
assert.deepEqual(blockStats([{ type: 'Button' }, { type: 'Custom' }]), { total: 2, hds: 1, layout: 0, custom: 1, ratio: 50 });
console.log('Studio regression checks passed: action label rendering/export, dotted array fields, block totals and ratios.');

// Every palette item must render with its defaults after a library update.
for (const preset of presets) {
  const html = renderToStaticMarkup(renderBlock(preset, preset.defaults));
  assert.ok(html.length > 0, `${preset.type} must render`);
  await transform(`const Screen = () => <>${blockCode(preset, preset.defaults)}</>`, { loader: 'tsx' });
  if (preset.kind === 'hds') {
    const component = preset.component ?? preset.type;
    assert.ok(component in HDS, `${component} must be exported by HDS`);
    for (const dependency of preset.imports ?? []) assert.ok(dependency in HDS);
  }
}
const table = presetByType.get('Table')!;
assert.ok(!renderToStaticMarkup(renderBlock(table, table.defaults)).includes('is-bordered'));
assert.ok(renderToStaticMarkup(renderBlock(table, { ...table.defaults, bordered: true })).includes('is-bordered'));
const more = parseSpec(JSON.stringify({ blocks: [
  { type: 'Select', props: { 'options.1.label': '부산' } },
  { type: 'DatePicker', props: { selection: 'range' } },
  { type: 'Table', props: { rowValue1: '성인 3명', bordered: true } },
] }));
assert.equal(more.warnings.length, 0);
assert.equal(more.blocks[2].props.rowValue1, '성인 3명');
assert.equal(catalog.version, '0.42.0');

console.log('Expanded palette passed: all default renders/JSX, HDS exports, table border migration, AI nested fields.');
