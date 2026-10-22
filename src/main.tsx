import React from 'react';
import ReactDOM from 'react-dom/client';
import '@aliceblue567/hds-react/styles'; // HDS 토큰 · 기본 스타일 — 앱 진입점에서 한 번
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
