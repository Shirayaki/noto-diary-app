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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 編集対象の日記
  const [editEntryId, setEditEntryId] =
    useState(null);

  // 一覧で開く日記
  const [selectedEntryId, setSelectedEntryId] =
    useState(null);

  const { entries, kb } = useStore();


  const showToast = useCallback((msg) => {
    setToast(msg);

    setTimeout(() => {
      setToast('');
    }, 2200);
  }, []);


  const goSearch = useCallback((cat) => {
    setSearchCat(cat);
    setPage('search');
  }, []);


  /*
   * 通常のページ移動
   */
  const goPage = useCallback((nextPage) => {

    setEditEntryId(null);

    setPage(nextPage);

  }, []);


  /*
   * 日記編集
   */
  const editEntry = useCallback((id) => {

    setEditEntryId(id);

    setPage('write');

  }, []);


  /*
   * 特定の日記を一覧で開く
   */
  const openEntry = useCallback((id) => {

    setSelectedEntryId(id);

    setPage('list');

  }, []);


  const pageProps = {
    entries,
    kb,
    showToast,
    goPage,
    editEntry,
    openEntry,
  };


  return (
    <div className="app-shell">

      <button
        className="hamburger-btn"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
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
        isOpen={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />


      <div className="app-main">

        {page === 'write' && (
          <WritePage
            {...pageProps}
            editEntryId={editEntryId}
          />
        )}

        {page === 'list' && (
          <ListPage
            {...pageProps}
            selectedEntryId={
              selectedEntryId
            }
          />
        )}

        {page === 'search' && (
          <SearchPage
            {...pageProps}
            initialCat={searchCat}
          />
        )}

        {page === 'cal' && (
          <CalendarPage
            entries={entries}
          />
        )}

        {page === 'kb' && (
          <KBPage
            {...pageProps}
          />
        )}

        {page === 'dash' && (
          <DashPage
            entries={entries}
            kb={kb}
          />
        )}

      </div>


      {toast && (
        <Toast msg={toast} />
      )}


      <div
        className="fab-button"
        onClick={() =>
          goPage('write')
        }
      >
        <span className="fab-icon">
          ✏️
        </span>
      </div>

    </div>
  );
}
