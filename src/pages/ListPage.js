import React, { useState } from 'react';
import { store } from '../data/store';
import { CAT_STYLES, MOOD_ICONS } from '../data/constants';
import './ListPage.css';

function EntryDetail({ entry }) {
  if (!entry) return <div className="detail-empty"><i className="ti ti-notebook" /><p>日記を選択してください</p></div>;
  const c = CAT_STYLES[entry.cat] || {};
  return (
    <div className="detail-pane">
      <div className="detail-meta">
        <span className="cat-badge" style={{ background: c.bg, color: c.tx }}>{entry.cat}</span>
        <span className="detail-date">{entry.date}</span>
        <span className="detail-mood"><i className={`ti ${MOOD_ICONS[entry.mood] || 'ti-mood-empty'}`} />{entry.mood}</span>
      </div>
      <h2 className="detail-title">{entry.title}</h2>
      <hr className="detail-sep" />
      <div className="detail-body">{entry.body.split('\n').map((l, i) => <p key={i}>{l}</p>)}</div>
      <div className="detail-tags">{entry.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
    </div>
  );
}

export default function ListPage({ entries, showToast, goPage }) {
  const [sel, setSel] = useState(entries[0]?.id ?? null);
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const selEntry = entries.find(e => e.id === sel);

  const del = (id) => {
    store.deleteEntry(id);
    setSel(entries.find(e => e.id !== id)?.id ?? null);
    showToast('削除しました');
  };

  return (
    <div className="list-layout">
      <div className="list-topbar">
        <h1 className="page-title">日記一覧</h1>
        <button className="btn-primary" onClick={() => goPage('write')}><i className="ti ti-plus" /> 新しい日記</button>
      </div>
      <div className="list-body">
        <div className="entry-list">
          {sorted.map(e => {
            const c = CAT_STYLES[e.cat] || {};
            return (
              <div key={e.id} className={`entry-card ${e.id === sel ? 'selected' : ''}`} onClick={() => setSel(e.id)}>
                <div className="entry-card-date">{e.date}</div>
                <div className="entry-card-title">{e.title}</div>
                <div className="entry-card-preview">{e.body}</div>
                <div className="entry-card-footer">
                  <span className="cat-badge" style={{ background: c.bg, color: c.tx }}>{e.cat}</span>
                  {e.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  <button className="del-btn" onClick={ev => { ev.stopPropagation(); del(e.id); }} title="削除"><i className="ti ti-trash" /></button>
                </div>
              </div>
            );
          })}
        </div>
        <EntryDetail entry={selEntry} />
      </div>
    </div>
  );
}
