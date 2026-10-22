// HDS 드리프트 리포트 — 이 저장소의 화면이 HDS를 얼마나 따르는지 숫자로 낸다.
//   HDS import 비율    = HDS 컴포넌트 사용 수 / (HDS 사용 수 + 커스텀 마커 수 + 미표시 네이티브 UI 수)
//   커스텀 목록         = data-hds="custom" 요소 전부(파일 · 이유) → 디자인시스템 백로그 후보
//   CSS 토큰 위반       = src/**/*.css 의 원시 hex · px 글자 크기
// 결과: reports/hds-report.json + 콘솔 요약. `npm run check`에서 lint와 함께 돈다.
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
// 실험 화면만 잰다(src/screens). App 틀 · 목데이터는 제외.
const files = walk(join(root, 'src', 'screens'));
const tsx = files.filter((f) => /\.(tsx|jsx)$/.test(f));
const css = files.filter((f) => f.endsWith('.css'));

const catalog = JSON.parse(readFileSync(join(root, 'node_modules/@aliceblue567/hds-react/dist/ai/hds-catalog.json'), 'utf8'));
const hdsNames = new Set(catalog.components.map((c) => c.name));
const NATIVE = /<(button|input|select|textarea|dialog|table|progress|meter|details)\b/g;

let hdsUses = 0, nativeUses = 0;
const customs = [];
const perFile = [];
for (const f of tsx) {
  const s = readFileSync(f, 'utf8');
  const rel = relative(root, f);
  let h = 0, n = 0;
  for (const m of s.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) if (hdsNames.has(m[1])) h++;
  for (const m of s.matchAll(/<[a-z][a-z0-9]*\b[^>]*data-hds=["']custom["'][^>]*>/g)) {
    const reason = m[0].match(/data-hds-reason=["']([^"']*)["']/)?.[1] ?? '(이유 없음)';
    const tag = m[0].match(/^<([a-z0-9]+)/)[1];
    customs.push({ file: rel, line: s.slice(0, m.index).split('\n').length, tag, reason });
  }
  for (const m of s.matchAll(NATIVE)) {
    // 여는 태그 끝(>)을 찾되 {…} 안의 => 는 건너뛴다
    let i = m.index, depth = 0;
    for (; i < s.length; i++) { const ch = s[i]; if (ch === '{') depth++; else if (ch === '}') depth--; else if (ch === '>' && depth === 0) break; }
    const tail = s.slice(m.index, i + 1);
    if (!/data-hds=["']custom["']/.test(tail) && !/type=["']hidden["']/.test(tail)) n++;
  }
  hdsUses += h; nativeUses += n;
  if (h || n) perFile.push({ file: rel, hds: h, nativeUnmarked: n });
}
const cssViolations = [];
for (const f of css) {
  const s = readFileSync(f, 'utf8');
  s.split('\n').forEach((line, i) => {
    if (/^\s*\/\//.test(line)) return;
    if (/#[0-9a-f]{3,8}\b|\b(rgba?|hsla?)\(/i.test(line) && !/var\(--hds-/.test(line)) cssViolations.push({ file: relative(root, f), line: i + 1, text: line.trim().slice(0, 80), kind: 'raw-color' });
    if (/font-size\s*:\s*\d/.test(line)) cssViolations.push({ file: relative(root, f), line: i + 1, text: line.trim().slice(0, 80), kind: 'raw-font-size' });
  });
}
const total = hdsUses + customs.length + nativeUses;
const ratio = total ? hdsUses / total : 1;
const report = { generatedAt: new Date().toISOString(), hdsVersion: catalog.version, files: tsx.length, hdsUses, customMarked: customs.length, nativeUnmarked: nativeUses, hdsRatio: Number(ratio.toFixed(3)), customs, cssViolations, perFile };
mkdirSync(join(root, 'reports'), { recursive: true });
writeFileSync(join(root, 'reports', 'hds-report.json'), JSON.stringify(report, null, 2));

console.log(`HDS 드리프트 리포트 (hds-react ${catalog.version})`);
console.log(`  화면 파일 ${tsx.length}개 · HDS 컴포넌트 사용 ${hdsUses} · 커스텀(마커) ${customs.length} · 미표시 네이티브 UI ${nativeUses}`);
console.log(`  HDS 비율 ${(ratio * 100).toFixed(1)}%  ${ratio >= 0.9 ? '✓ 목표 90% 이상' : '✗ 목표 90% 미달'}`);
if (customs.length) { console.log('  커스텀(디자인시스템 백로그 후보):'); for (const c of customs) console.log(`    ${c.file}:${c.line} <${c.tag}> — ${c.reason}`); }
if (cssViolations.length) { console.log(`  CSS 토큰 위반 ${cssViolations.length}건:`); for (const v of cssViolations) console.log(`    ${v.file}:${v.line} [${v.kind}] ${v.text}`); }
if (nativeUses || cssViolations.length) process.exitCode = 1;
