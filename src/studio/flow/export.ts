import modelSource from './model.ts?raw';
import previewSource from './Preview.tsx?raw';
import previewCss from './preview.css?raw';
import studioCss from '../studio.css?raw';
import registrySource from '../registry.tsx?raw';
import productSource from '../product.tsx?raw';
import composeSource from '../compose.ts?raw';
import packageUrl from '../../../vendor/aliceblue567-hds-react-0.42.0.tgz?url';
import { inspect, type Project } from './model';

export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
// Uncompressed ZIP, UTF-8 names. No third-party service or source upload.
export function zip(files: Record<string, string | Uint8Array>): Blob {
  const encode = new TextEncoder(), parts: Uint8Array[] = [], directory: Uint8Array[] = []; let offset = 0;
  const crc = (bytes: Uint8Array) => { let c = 0xffffffff; for (const b of bytes) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ ((c & 1) ? 0xedb88320 : 0); } return (c ^ 0xffffffff) >>> 0; };
  for (const [name, content] of Object.entries(files)) {
    const filename = encode.encode(name), data = typeof content === 'string' ? encode.encode(content) : content;
    const checksum = crc(data), local = new Uint8Array(30 + filename.length), l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x800, true); l.setUint32(14, checksum, true); l.setUint32(18, data.length, true); l.setUint32(22, data.length, true); l.setUint16(26, filename.length, true); local.set(filename, 30);
    const central = new Uint8Array(46 + filename.length), c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x800, true); c.setUint32(16, checksum, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, filename.length, true); c.setUint32(42, offset, true); central.set(filename, 46);
    parts.push(local, data); directory.push(central); offset += local.length + data.length;
  }
  const size = directory.reduce((n, d) => n + d.length, 0), end = new Uint8Array(22), e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, directory.length, true); e.setUint16(10, directory.length, true); e.setUint32(12, size, true); e.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end].map(p => new Uint8Array(p).buffer), { type: 'application/zip' });
}
export function handoffFiles(project: Project, checked: string[]): Record<string, string> {
  const issues = inspect(project);
  return {
    'project.json': JSON.stringify(project, null, 2),
    'package.json': JSON.stringify({ name: 'hds-prototype', version: '0.1.0', private: true, type: 'module', scripts: { dev: 'vite', build: 'tsc --noEmit && vite build' }, dependencies: { '@aliceblue567/hds-react': 'file:vendor/hds-react.tgz', react: '^18.3.1', 'react-dom': '^18.3.1' }, devDependencies: { '@types/react': '^18.3.12', '@types/react-dom': '^18.3.1', typescript: '^5.6.3', vite: '^5.4.11' } }, null, 2),
    'tsconfig.json': JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['ES2022', 'DOM', 'DOM.Iterable'], module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true, resolveJsonModule: true, allowSyntheticDefaultImports: true }, include: ['src'] }, null, 2),
    'index.html': '<!doctype html><html lang="ko" data-theme="light" data-platform="mobile"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>HDS Prototype</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"/></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>',
    'src/main.tsx': `import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport '@aliceblue567/hds-react/styles';\ncreateRoot(document.getElementById('root')!).render(<App />);`,
    'src/App.tsx': `import { useState } from 'react';\nimport data from '../project.json';\nimport { ProtoPreview } from './studio/flow/Preview';\nimport { parseProject, initialValues, type ProductState } from './studio/flow/model';\nimport { PRODUCT_STATES, stateLabels } from './studio/product';\nimport './studio/studio.css';\nconst project = parseProject(data);\nexport default function App() {\n const [screenId, setScreenId] = useState(project.screens[0].id);\n const [values, setValues] = useState(() => initialValues(project));\n const [state, setState] = useState<ProductState>('default');\n const screen = project.screens.find(s => s.id === screenId)!;\n return <main style={{display:'grid',justifyContent:'center',gap:'var(--hds-spacing-4)',padding:'var(--hds-spacing-4)',fontFamily:'Pretendard, sans-serif',color:'var(--hds-fg-neutral-primary)',background:'var(--hds-bg-layer-basement)'}}>\n <strong>{project.plan.title} · 시연용</strong>\n <label>시연 상태 <select value={state} onChange={e => setState(e.target.value as ProductState)}>{PRODUCT_STATES.map(s => <option key={s} value={s}>{stateLabels[s]}</option>)}</select></label>\n <ProtoPreview screen={screen} state={state} values={values} onValue={(key,value) => setValues(v => ({...v,[key]:value}))} onNavigate={action => { setScreenId(action.to); setState('default'); }} onState={setState} />\n <button onClick={() => {setScreenId(project.screens[0].id);setValues(initialValues(project));setState('default');}}>시연 다시 시작</button>\n <p>샘플 데이터 · 실제 서비스 요청은 전송하지 않아요.</p>\n </main>;\n}\n`,
    'src/studio/flow/model.ts': modelSource,
    'src/studio/flow/Preview.tsx': previewSource,
    'src/studio/flow/preview.css': previewCss,
    'src/studio/registry.tsx': registrySource,
    'src/studio/product.tsx': productSource,
    'src/studio/compose.ts': composeSource,
    'src/studio/studio.css': studioCss,
    'README.md': `# ${project.plan.title}\n\nHDS ${project.hdsVersion}의 실제 코드로 실행하는 React 프로토타입입니다.\n\n## 실행\n\nNode.js 환경에서 npm install 후 npm run dev. npm run build로 타입 검사와 빌드. HDS 패키지는 vendor/hds-react.tgz에 포함되어 동일 버전을 재현합니다. Pretendard는 CDN에서 불러오므로 오프라인 배포에는 글꼴을 별도로 포함하세요.\n\n## 목적\n${project.plan.goal}\n\n## 구성\nproject.json: 화면·입력·이동·필수 조건 선언. src/studio/flow/Preview.tsx: HDS 렌더링과 상태 전환. src/App.tsx: 프로젝트 실행과 입력 상태. 저장한 시연 입력값은 포함하지 않습니다.\n\n## 확인할 가정\n${project.plan.assumptions.map(x => '- ' + x).join('\n')}\n\n## 검토 체크\n${project.plan.acceptance.map(x => '- [' + (checked.includes(x) ? 'x' : ' ') + '] ' + x).join('\n')}\n\n## 자동 검사에서 확인할 항목\n${issues.length ? issues.map(x => '- ' + x).join('\n') : '- 지원 스키마의 미연결 동작·입력과 화면 도달성 검사에서 문제가 발견되지 않았습니다.'}\n\n자동 검사는 시각 일치·접근성 전체·사업 규칙·출시 품질을 보증하지 않습니다.\n\n## 실제 연동과 남은 작업\n${project.plan.integrations.map(x => '- ' + x).join('\n')}\n- 로딩·빈 상태·오류는 수동 시연 상태입니다. 실제 API 수명 주기에 연결해야 합니다.\n- 필수 검증은 값 존재 여부와 체크 여부만 지원합니다. 형식 검증·인증·개인정보 처리·중복 요청 방지는 별도 구현이 필요합니다.\n- 필터·검색 결과·가격 계산 등 선언에 없는 업무 로직은 실행하지 않습니다.\n- ProtoPreview의 onNavigate에서 서버 연동을 구현하고, 성공 시에만 다음 화면으로 전환하도록 확장하세요.\n- 신규 Product 조합은 검토 후보이며, 정식 HDS 승인과 Figma 최신본 대조는 별도입니다.\n`,
  };
}
export async function downloadHandoff(project: Project, checked: string[]) {
  const response = await fetch(packageUrl);
  if (!response.ok) throw new Error('HDS 패키지를 가져오지 못했어요. 다시 시도해주세요.');
  download(zip({ ...handoffFiles(project, checked), 'vendor/hds-react.tgz': new Uint8Array(await response.arrayBuffer()) }), 'hds-prototype.zip');
}
