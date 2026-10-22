import { presetByType } from './registry';

export function blockStats(blocks: { type: string }[]) {
  let hds = 0, layout = 0, custom = 0;
  for (const block of blocks) {
    const kind = presetByType.get(block.type)?.kind;
    if (kind === 'hds') hds++;
    else if (kind === 'layout') layout++;
    else custom++;
  }
  const denominator = hds + custom;
  return { total: blocks.length, hds, layout, custom,
    ratio: denominator ? Math.round(hds / denominator * 1000) / 10 : null };
}
