import React, { useState } from 'react';
import { CAT_STYLES, MOOD_ICONS, dateKey } from '../data/constants';
import './CalendarPage.css';

export default function CalendarPage({ entries }) {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sel, setSel]     = useState(dateKey(now.getFullYear(), now.getMonth(), now.getDate()));
  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const nav = (d) => {
    let m = month + d, y = year;
    if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; }
    setMonth(m); setYear(y);
  };

  const firstDow  = new Date(year, month, 1).getDay();
  const dim       = new Date(year, month + 1, 0).getDate();
  const prevDim   = new Date(year, month, 0).getDate();
  const cells     = [];

  for (let i = 0; i < firstDow; i++) {
    const d = prevDim - firstDow + i + 1;
    cells.push({ key: dateKey(year, month - 1, d), day: d, other: true });
  }
  for (let d = 1; d <= dim; d++) cells.push({ key: dateKey(year, month, d), day: d, other: false });
  const rem = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= rem; d++) cells.push({ key: dateKey(year, month + 1, d), day: d, other: true });

  const selEntries = entries.filter(e => e.date === sel);

  return (
    <div className="cal-layout">
      <div className="cal-toolbar">
        <div className="cal-nav">
          <button onClick={() => nav(-1)} aria-label="前の月"><i className="ti ti-chevron-left" /></button>
          <span className="cal-month-label">{year}年{month + 1}月</span>
          <button onClick={() => nav(1)} aria-label="次の月"><i className="ti ti-chevron-right" /></button>
          <button className="today-btn" onClick={() => { const t = new Date(); setYear(t.getFullYear()); setMonth(t.getMonth()); setSel(todayKey); }}>今日</button>
        </div>
        <div className="cal-legend">
          {Object.entries(CAT_STYLES).map(([k, v]) => (
            <span key={k}><span className="legend-dot" style={{ background: v.dot }} />{k}</span>
          ))}
        </div>
      </div>
      <div className="cal-grid-wrap">
        <div className="cal-dow">
          {['日', '月', '火', '水', '木', '金', '土'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="cal-grid">
          {cells.map(({ key, day, other }) => {
            const es = entries.filter(e => e.date === key);
            return (
              <div key={key} className={`cal-cell ${other ? 'other' : ''} ${key === sel ? 'selected' : ''} ${key === todayKey ? 'today' : ''}`} onClick={() => setSel(key)}>
                <div className="cal-day">{key === todayKey ? <span className="today-num">{day}</span> : day}</div>
                <div className="cal-dots">{es.slice(0, 4).map((e, i) => <span key={i} className="cal-dot" style={{ background: CAT_STYLES[e.cat]?.dot || '#888' }} />)}</div>
                {es.slice(0, 2).map((e, i) => (
                  <div key={i} className="cal-entry" style={{ background: CAT_STYLES[e.cat]?.bg, color: CAT_STYLES[e.cat]?.tx }}>{e.title}</div>
                ))}
                {es.length > 2 && <div className="cal-more">他{es.length - 2}件</div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="cal-detail">
        {sel && <div className="cal-detail-date">{sel}</div>}
        {selEntries.length === 0 ? (
          <div className="cal-detail-empty"><i className="ti ti-notebook" /> この日の日記はありません</div>
        ) : (
          <div className="cal-detail-entries">
            {selEntries.map(e => (
              <div key={e.id} className="cal-detail-card">
                <div className="cal-detail-bar" style={{ background: CAT_STYLES[e.cat]?.dot }} />
                <div>
                  <div className="cal-detail-title">{e.title}</div>
                  <div className="cal-detail-body">{e.body}</div>
                  <div className="cal-detail-footer">
                    <span className="cat-badge" style={{ background: CAT_STYLES[e.cat]?.bg, color: CAT_STYLES[e.cat]?.tx }}>{e.cat}</span>
                    {e.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    <span className="cal-detail-mood"><i className={`ti ${MOOD_ICONS[e.mood] || 'ti-mood-empty'}`} />{e.mood}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
