import { productDefaults, PRODUCT_STATES, type ProductProps } from '../src/studio/product';
import { transform } from 'esbuild';
import * as HDS from '@aliceblue567/hds-react';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseSpec } from '../src/studio/compose';
import { presets, catalog, presetByType, renderBlock, blockCode, blockImports } from '../src/studio/registry';
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
assert.deepEqual(blockStats(blocks), { total: 9, hds: 7, layout: 2, product: 0, custom: 0, ratio: 100 });
assert.equal(blockStats([]).ratio, null);
assert.equal(blockStats([{ type: 'SectionTitle' }]).ratio, null);
assert.deepEqual(blockStats([{ type: 'Button' }, { type: 'Custom' }]), { total: 2, hds: 1, layout: 0, product: 0, custom: 1, ratio: 50 });
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


// New composites use the same HDS renderer/exports; arbitrary code and styles never enter.
const candidate = structuredClone(productDefaults);
candidate.states.default[0].children!.push({ type: 'script', props: { children: 'alert(1)' } });
candidate.states.default[0].props.gap = '99px';
candidate.states.default[0].props.style = { background: '#ff0000' };
candidate.states.default[0].children!.push({ type: 'Header', props: { title: 'nested fixed header' } });
candidate.states.default[0].children!.push({ type: 'Text', props: { text: '<script>alert(1)</script>{name}', role: 'body', tone: 'primary' } });
const parsedProduct = parseSpec(JSON.stringify({ blocks: [{ type: 'Product', props: candidate }] }));
assert.ok(parsedProduct.warnings.length >= 3);
const product = parsedProduct.blocks[0].props as unknown as ProductProps;
assert.equal(product.states.default[0].props.gap, '0');
assert.ok(!JSON.stringify(product).includes('#ff0000'));
assert.ok(!product.states.default[0].children!.some(n => n.type === 'script' || n.type === 'Header'));
const productPreset = presetByType.get('Product')!;
for (const state of PRODUCT_STATES) {
  const props = { ...product, state } as unknown as Record<string, unknown>;
  const html = renderToStaticMarkup(renderBlock(productPreset, props));
  assert.ok(html.includes('data-product-status="draft"'));
  assert.ok(!html.includes('<script>'));
  await transform(`const Screen = () => <>${blockCode(productPreset, props)}</>`, { loader: 'tsx' });
}
assert.ok(blockImports(productPreset, parsedProduct.blocks[0].props).includes('Button'));
assert.ok(blockImports(productPreset, parsedProduct.blocks[0].props).includes('EmptyState'));
const fallbackProduct = parseSpec(JSON.stringify({ blocks: [{ type: 'Product', props: { states: { default: productDefaults.states.default } } }] }));
assert.equal(fallbackProduct.warnings.length, 3);
assert.equal(blockStats([{ type: 'Product' }]).product, 1);
assert.equal(blockStats([{ type: 'Product' }]).hds, 0);
assert.throws(() => parseSpec(JSON.stringify({ blocks: [{ type: 'Product', props: { states: { default: [{ type: 'script' }] } } }] })), /표시할 HDS 조합/);
console.log('Product recipes passed: four states, fallback states, HDS imports, escaped content, rejected unsupported nodes/styles, candidate classification.');
