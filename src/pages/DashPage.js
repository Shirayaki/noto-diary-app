import React, { useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { CAT_STYLES, MOOD_ICONS, MOODS, dateKey } from '../data/constants';
import './DashPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function DashPage({ entries, kb }) {
  const stats = useMemo(() => {
    const now = new Date();
    let streak = 0;
    for (let i = 0; i < 60; i++) { const d = new Date(now); d.setDate(d.getDate() - i); const k = dateKey(d.getFullYear(), d.getMonth(), d.getDate()); if (entries.some(e => e.date === k)) streak++; else break; }
    const tagCount = {};
    entries.flatMap(e => e.tags).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
    const topTag = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    const catCount = {};
    entries.forEach(e => { catCount[e.cat] = (catCount[e.cat] || 0) + 1; });
    const moodCount = {};
    entries.forEach(e => { moodCount[e.mood] = (moodCount[e.mood] || 0) + 1; });
    const monthData = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now); d.setMonth(d.getMonth() - (5 - i));
      const y = d.getFullYear(), m = d.getMonth();
      return entries.filter(e => { const ed = new Date(e.date); return ed.getFullYear() === y && ed.getMonth() === m; }).length;
    });
    const monthLabels = Array.from({ length: 6 }, (_, i) => { const d = new Date(now); d.setMonth(d.getMonth() - (5 - i)); return `${d.getMonth() + 1}月`; });
    return { total: entries.length, kb: kb.length, streak, topTag, tagCount, catCount, moodCount, monthData, monthLabels };
  }, [entries, kb]);

  const barData = {
    labels: stats.monthLabels,
    datasets: [{ label: '日記', data: stats.monthData, backgroundColor: '#1D9E75', borderRadius: 4, borderSkipped: false }],
  };
  const catList = Object.entries(stats.catCount).sort((a, b) => b[1] - a[1]);
  const donutData = {
    labels: catList.map(x => x[0]),
    datasets: [{ data: catList.map(x => x[1]), backgroundColor: catList.map(x => CAT_STYLES[x[0]]?.dot || '#888'), borderWidth: 2, borderColor: '#fff', hoverOffset: 4 }],
  };
  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
  const tagsSorted = Object.entries(stats.tagCount).sort((a, b) => b[1] - a[1]);
  const maxTag = tagsSorted[0]?.[1] || 1;

  return (
    <div className="dash-page">
      <div className="dash-metrics">
        {[['ti-notebook','総日記数',`${stats.total}件`],['ti-database','知識DB',`${stats.kb}件`],['ti-flame','連続記録',`${stats.streak}日`],['ti-tag','人気タグ',stats.topTag]].map(([ic, lb, vl]) => (
          <div key={lb} className="metric-card"><div className="metric-label"><i className={`ti ${ic}`} />{lb}</div><div className="metric-val">{vl}</div></div>
        ))}
      </div>

      <div className="dash-row2">
        <div className="dash-card">
          <div className="dash-card-title"><i className="ti ti-chart-bar" />月別投稿数</div>
          <div style={{ height: 160 }}><Bar data={barData} options={chartOpts} /></div>
        </div>
        <div className="dash-card">
          <div className="dash-card-title"><i className="ti ti-chart-donut" />カテゴリ別割合</div>
          <div className="cat-legend">{catList.map(([c, n]) => (<span key={c}><span className="legend-dot" style={{ background: CAT_STYLES[c]?.dot }} />{c} {Math.round(n / stats.total * 100)}%</span>))}</div>
          <div style={{ height: 130 }}><Doughnut data={donutData} options={{ ...chartOpts, cutout: '65%' }} /></div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-title"><i className="ti ti-tags" />タグクラウド</div>
        <div className="tag-cloud">
          {tagsSorted.map(([t, n]) => {
            const sz = Math.round(11 + (n / maxTag) * 10);
            return <span key={t} className="tc-tag" style={{ fontSize: sz, padding: sz > 16 ? '5px 11px' : '3px 8px' }}>{t} <small>{n}</small></span>;
          })}
        </div>
      </div>

      <div className="dash-row2">
        <div className="dash-card">
          <div className="dash-card-title"><i className="ti ti-mood-smile" />気分の分布</div>
          {MOODS.map(m => {
            const n = stats.moodCount[m] || 0;
            return (
              <div key={m} className="mood-row">
                <i className={`ti ${MOOD_ICONS[m]}`} />
                <span className="mood-lbl">{m}</span>
                <div className="mood-bar"><div className="mood-fill" style={{ width: `${(n / Math.max(stats.total, 1)) * 100}%` }} /></div>
                <span className="mood-n">{n}</span>
              </div>
            );
          })}
        </div>
        <div className="dash-card">
          <div className="dash-card-title"><i className="ti ti-database" />カテゴリ別 知識DB</div>
          {Object.entries(Object.fromEntries(Object.entries(stats.catCount).map(([c]) => [c, kb.filter(k => k.tag === c).length]))).sort((a,b)=>b[1]-a[1]).map(([c, n]) => (
            <div key={c} className="kb-bar-row">
              <span className="kb-bar-lbl">{c}</span>
              <div className="kb-bar"><div className="kb-bar-fill" style={{ width: `${(n / Math.max(...Object.values(stats.catCount))) * 100}%` }} /></div>
              <span className="kb-bar-n">{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
