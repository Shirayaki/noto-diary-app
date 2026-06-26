import React, { useState } from 'react';
import { store } from '../data/store';
import { CATEGORIES, MOODS, today } from '../data/constants';
import TagInput from '../components/TagInput';
import './WritePage.css';

export default function WritePage({ kb, showToast, goPage }) {
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');
  const [cat, setCat]       = useState('日常');
  const [mood, setMood]     = useState('普通');
  const [tags, setTags]     = useState([]);
  const [kbForm, setKbForm] = useState(false);
  const [kbTitle, setKbTitle] = useState('');
  const [kbBody, setKbBody]   = useState('');

  const save = () => {
    if (!title.trim() || !body.trim()) { showToast('タイトルと内容を入力してください'); return; }
    store.addEntry({ date: today(), title: title.trim(), body: body.trim(), cat, mood, tags });
    showToast('日記を保存しました ✓');
    setTimeout(() => goPage('list'), 400);
  };

  const saveKB = () => {
    if (!kbTitle.trim() || !kbBody.trim()) { showToast('タイトルと内容を入力してください'); return; }
    store.addKB({ title: kbTitle.trim(), body: kbBody.trim(), tag: cat, linked: title.trim() || null });
    setKbTitle(''); setKbBody(''); setKbForm(false);
    showToast('知識DBに登録しました ✓');
  };

  return (
    <div className="write-layout">
      <div className="write-form">
        <div className="write-header">
          <h1 className="page-title">日記を書く</h1>
        </div>
        <div className="form-group">
          <label>タイトル</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="今日のタイトル" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>カテゴリ</label>
            <select value={cat} onChange={e => setCat(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>気分</label>
            <select value={mood} onChange={e => setMood(e.target.value)}>
              {MOODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>内容</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={9} placeholder="今日はどんな一日でしたか？" />
        </div>
        <div className="form-group">
          <label>タグ</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>
        <div className="form-actions">
          <button className="btn-primary" onClick={save}>保存する</button>
          <button className="btn-ghost" onClick={() => goPage('list')}>キャンセル</button>
        </div>
      </div>

      {/* 知識DBサイドパネル */}
      <aside className="kb-panel">
        <div className="kb-panel-header">
          <span><i className="ti ti-database" /> 知識DB <span className="kb-count">{kb.length}</span></span>
          <small>この日記から追加</small>
        </div>
        <div className="kb-panel-list">
          {[...kb].slice(0, 5).map(k => (
            <div key={k.id} className="kb-card">
              <div className="kb-card-title">{k.title}</div>
              <div className="kb-card-body">{k.body}</div>
              {k.linked && <div className="kb-card-link"><i className="ti ti-link" />{k.linked}</div>}
            </div>
          ))}
        </div>
        <div className="kb-panel-footer">
          {!kbForm ? (
            <button className="btn-kb-add" onClick={() => setKbForm(true)}>
              <i className="ti ti-plus" /> 知識を追加する
            </button>
          ) : (
            <div className="kb-form">
              {title && <div className="kb-link-hint"><i className="ti ti-link" />「{title}」とリンクされます</div>}
              <input value={kbTitle} onChange={e => setKbTitle(e.target.value)} placeholder="タイトル" />
              <textarea value={kbBody} onChange={e => setKbBody(e.target.value)} rows={3} placeholder="内容・メモ・定義など" />
              <div className="form-actions">
                <button className="btn-primary" style={{fontSize:12,padding:'5px 14px'}} onClick={saveKB}>登録</button>
                <button className="btn-ghost" style={{fontSize:12}} onClick={() => setKbForm(false)}>キャンセル</button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
