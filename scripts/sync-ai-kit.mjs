// 설치된 hds-react 패키지의 AI Kit을 저장소 루트로 복사한다. 패키지를 올릴 때마다 `npm run hds:sync-ai`.
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const src = join(process.cwd(), 'node_modules/@aliceblue567/hds-react/dist/ai');
mkdirSync('ai', { recursive: true });
copyFileSync(join(src, 'AGENTS.md'), 'AGENTS.md');
for (const f of ['hds-components.md', 'hds-catalog.json', 'hds-figma-map.json']) copyFileSync(join(src, f), join('ai', f));
console.log('synced AGENTS.md + ai/ from @aliceblue567/hds-react');
