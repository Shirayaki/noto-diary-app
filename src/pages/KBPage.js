import React from 'react';
import { store } from '../data/store';
import './KBPage.css';

export default function KBPage({ kb, showToast, goPage }) {
  const del = (id) => { store.deleteKB(id); showToast('削除しました'); };
  return (
    <div className="kb-page">
      <div className="kb-topbar">
        <h1 className="page-title">知識データベース</h1>
        <button className="btn-primary" onClick={() => goPage('write')}><i className="ti ti-plus" /> 日記から追加</button>
      </div>
      <div className="kb-list">
        <p className="kb-meta">{kb.length}件の知識が登録されています</p>
        {kb.map(k => (
          <div key={k.id} className="kb-item">
            <div className="kb-item-title">{k.title}</div>
            <div className="kb-item-body">{k.body}</div>
            <div className="kb-item-footer">
              <span className="tag" style={{ background: '#E1F5EE', color: '#085041', border: '1px solid #9FE1CB' }}>{k.tag}</span>
              {k.linked && <span className="kb-item-link"><i className="ti ti-link" />{k.linked}</span>}
              <button className="del-btn" onClick={() => del(k.id)}><i className="ti ti-trash" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
