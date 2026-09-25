import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import WritePage from './pages/WritePage';
import ListPage from './pages/ListPage';
import SearchPage from './pages/SearchPage';
import CalendarPage from './pages/CalendarPage';
import KBPage from './pages/KBPage';
import DashPage from './pages/DashPage';
import Toast from './components/Toast';
import { useStore } from './hooks/useStore';
import './App.css';

export default function App() {
  const [page, setPage] = useState('dash');
  const [searchCat, setSearchCat] = useState(null);
  const [toast, setToast] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);  // ← 追加
  const { entries, kb } = useStore();

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const goSearch = useCallback((cat) => {
    setSearchCat(cat);
    setPage('search');
  }, []);

  const pageProps = { entries, kb, showToast, goPage: setPage };

  return (
    <div className="app-shell">
      {/* ハンバーガーボタン */}
      <button 
        className="hamburger-btn" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <Sidebar 
        page={page} 
        setPage={setPage} 
        goSearch={goSearch} 
        entries={entries} 
        kb={kb}
        isOpen={sidebarOpen}  /* ← 追加 */
        onClose={() => setSidebarOpen(false)}  /* ← 追加 */
      />
      <div className="app-main">
        {page === 'write'  && <WritePage  {...pageProps} />}
        {page === 'list'   && <ListPage   {...pageProps} />}
        {page === 'search' && <SearchPage {...pageProps} initialCat={searchCat} />}
        {page === 'cal'    && <CalendarPage entries={entries} />}
        {page === 'kb'     && <KBPage     {...pageProps} />}
        {page === 'dash'   && <DashPage   entries={entries} kb={kb} />}
      </div>
      {toast && <Toast msg={toast} />}

      {/* FAB ボタン */}
      <div className="fab-button" onClick={() => setPage('write')}>
        <span className="fab-icon">✏️</span>
      </div>
    </div>
  );
}
