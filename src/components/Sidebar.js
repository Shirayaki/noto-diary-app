import React, { useMemo } from 'react';
import { CAT_STYLES, CATEGORIES, dateKey } from '../data/constants';
import './Sidebar.css';

export default function Sidebar({ page, setPage, goSearch, entries, kb }) {
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = entries.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
      if (entries.some(e => e.date === k)) streak++;
      else break;
    }
    return { month: thisMonth.length, kb: kb.length, streak };
  }, [entries, kb]);

  const nav = (id) => () => setPage(id);

  return (
    <aside className="sidebar">
      <div className="sb-logo">まなログ<span>.</span></div>

      <nav className="sb-nav">
        <div className="sb-label">メニュー</div>
        {[
          { id: 'write', icon: 'ti-edit',      label: '日記を書く' },
          { id: 'list',  icon: 'ti-notebook',  label: '日記一覧' },
          { id: 'search',icon: 'ti-search',    label: '検索・フィルター' },
          { id: 'cal',   icon: 'ti-calendar',  label: 'カレンダー' },
          { id: 'kb',    icon: 'ti-database',  label: '知識DB' },
          { id: 'dash',  icon: 'ti-chart-bar', label: 'ダッシュボード' },
        ].map(({ id, icon, label }) => (
          <button key={id} className={`sb-item ${page === id ? 'active' : ''}`} onClick={nav(id)}>
            <i className={`ti ${icon}`} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sb-nav">
        <div className="sb-label">カテゴリ</div>
        {CATEGORIES.map(cat => (
          <button key={cat} className="sb-item" onClick={() => goSearch(cat)}>
            <span className="sb-dot" style={{ background: CAT_STYLES[cat].dot }} />
            {cat}
          </button>
        ))}
      </div>

      <div className="sb-footer">
        <div className="sb-label">今月の記録</div>
        <div className="sb-stat"><span><i className="ti ti-notebook" /> 日記</span><strong>{stats.month}件</strong></div>
        <div className="sb-stat"><span><i className="ti ti-database" /> 知識</span><strong>{stats.kb}件</strong></div>
        <div className="sb-stat"><span><i className="ti ti-flame" /> 連続</span><strong>{stats.streak}日</strong></div>
      </div>
    </aside>
  );
}
