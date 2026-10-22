import { useEffect, useState } from 'react';
import { screens } from './screens';
import { Studio } from './studio/Studio';
import { FlowStudio } from './studio/flow/FlowStudio';
import './App.css';

// 화면 목록 + 미리보기 틀. 실험 화면은 src/screens/ 에 폴더 하나로 추가하고 src/screens/index.ts 에 등록한다.
// 주소: #/<screen-id> · 틀의 테마 · 플랫폼 전환은 <html data-theme data-platform> 을 바꾼다(HDS 규칙).

type Theme = 'light' | 'dark';
type Platform = 'mobile' | 'tablet' | 'desktop';
const WIDTH: Record<Platform, number> = { mobile: 360, tablet: 768, desktop: 1280 };

const readHash = () => decodeURIComponent(location.hash.replace(/^#\/?/, ''));

export function App() {
  const [current, setCurrent] = useState(readHash);
  const [theme, setTheme] = useState<Theme>('light');
  const [platform, setPlatform] = useState<Platform>('mobile');

  useEffect(() => {
    const onHash = () => setCurrent(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.platform = platform;
  }, [theme, platform]);

  const screen = screens.find((s) => s.id === current);
  if (current === 'studio') return <FlowStudio />;
  if (current === 'studio-blocks') return <Studio />;

  return (
    <div className="pg">
      <aside className="pg__side">
        <div className="pg__brand">HDS Playground</div>
        <a href="#/studio" className="pg__studio">HDS Studio 열기<small>기획 → 작동 시연 → 검토·개발 전달</small></a>
        <nav className="pg__nav" aria-label="실험 화면">
          {screens.map((s) => (
            <a key={s.id} href={`#/${s.id}`} className={s.id === current ? 'is-current' : undefined}>
              <span>{s.title}</span>
              <small>{s.owner} · {s.status}</small>
            </a>
          ))}
        </nav>
        <div className="pg__controls" role="group" aria-label="미리보기 설정">
          <label>
            테마
            <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label>
            플랫폼
            <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
              <option value="mobile">Mobile 360</option>
              <option value="tablet">Tablet 768</option>
              <option value="desktop">Desktop 1280</option>
            </select>
          </label>
        </div>
      </aside>
      <main className="pg__stage">
        {screen ? (
          <div className="pg__frame" style={{ width: WIDTH[platform] }}>
            <screen.component />
          </div>
        ) : (
          <div className="pg__empty">
            <p>왼쪽에서 화면을 고르세요.</p>
            <p>새 화면은 <code>src/screens/</code>에 폴더를 만들고 <code>src/screens/index.ts</code>에 등록합니다. 규칙은 <code>AGENTS.md</code>.</p>
          </div>
        )}
      </main>
    </div>
  );
}
