const DIARY_KEY = 'noto_entries';
const KB_KEY    = 'noto_kb';

const SEED_ENTRIES = [
  { id: 1, date: '2025-06-04', title: 'プロジェクトのキックオフ', body: '新しいプロジェクトのキックオフを行った。チームメンバーは5人でスプリント計画を立てた。デザインシステムの刷新が主テーマ。', cat: '仕事', tags: ['デザイン', 'React'], mood: '良い' },
  { id: 2, date: '2025-06-03', title: '「思考の整理学」読み始め', body: '外山滋比古の「思考の整理学」を読み始めた。グライダーと飛行機の比喩が印象的だった。', cat: '学習', tags: ['読書', 'アイデア'], mood: '普通' },
  { id: 3, date: '2025-06-02', title: '朝のランニング再開', body: '3週間ぶりにランニングを再開。5kmを28分で走れた。週3回のペースで続けることを目標にする。', cat: '健康', tags: ['運動', '日課'], mood: '最高' },
  { id: 4, date: '2025-06-01', title: 'TypeScriptの型システム復習', body: 'Mapped TypesとConditional Typesを復習した。ユーティリティ型の組み合わせが面白い。', cat: '学習', tags: ['TypeScript', 'メモ'], mood: '普通' },
  { id: 5, date: '2025-05-31', title: '週末の振り返り', body: '今週は仕事が忙しかったが読書の時間も確保できた。来週はゆとりを持ちたい。', cat: '日常', tags: ['振り返り'], mood: '普通' },
  { id: 6, date: '2025-05-29', title: 'デザインレビューの準備', body: '来週のレビューに向けてプレゼン資料を整理した。Figmaのコンポーネントを共有できる状態にした。', cat: '仕事', tags: ['デザイン', 'Figma'], mood: '良い' },
  { id: 7, date: '2025-05-27', title: '新しいカフェを発見', body: '散歩中に雰囲気の良いカフェを発見。コーヒーが美味しく作業もはかどった。', cat: '日常', tags: ['カフェ', '散歩'], mood: '最高' },
  { id: 8, date: '2025-05-25', title: 'React Server Components調査', body: 'RSCの仕組みを調べた。サーバー側とクライアントコンポーネントの使い分けが重要。', cat: '学習', tags: ['React', 'TypeScript'], mood: '普通' },
  { id: 9, date: '2025-05-23', title: 'チームとの1on1', body: '月次1on1で今期の目標進捗を確認し来期キャリアについても話した。', cat: '仕事', tags: ['振り返り', 'メモ'], mood: '良い' },
  { id: 10, date: '2025-05-21', title: '体重測定と食事見直し', body: '運動不足気味なので食事を見直すことにした。朝食にタンパク質を意識して摂る。', cat: '健康', tags: ['日課', '運動'], mood: '悪い' },
  { id: 11, date: '2025-05-19', title: '読書メモ：ゼロ秒思考', body: '赤羽雄二「ゼロ秒思考」を読了。A4メモ書きの手法が面白く毎日10分試してみる。', cat: '学習', tags: ['読書', 'アイデア'], mood: '良い' },
  { id: 12, date: '2025-05-17', title: 'スプリントレトロ', body: '今週スプリントの振り返り。見積もりが甘かった点を反省し来週はバッファを多めに設定する。', cat: '仕事', tags: ['振り返り', 'デザイン'], mood: '普通' },
];

const SEED_KB = [
  { id: 1, title: 'スプリント計画の進め方', body: 'キックオフ時にチームで見積もりを行い、バックログを整理してから2週間スプリントを回す。', tag: '仕事', linked: 'プロジェクトのキックオフ' },
  { id: 2, title: 'グライダーと飛行機の比喩', body: '教育によって知識を詰め込まれたグライダー型と自ら思考し飛ぶ飛行機型。思考のプロセスが大切。', tag: '学習', linked: '「思考の整理学」読み始め' },
];

function load(key, seed) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : seed; } catch { return seed; }
}
function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

let _entries = load(DIARY_KEY, SEED_ENTRIES);
let _kb      = load(KB_KEY, SEED_KB);
let _listeners = [];
function notify() { _listeners.forEach(fn => fn()); }

export const store = {
  subscribe(fn) { _listeners.push(fn); return () => { _listeners = _listeners.filter(l => l !== fn); }; },
  getEntries() { return _entries; },
  getKB()      { return _kb; },
  addEntry(entry) { const e = { ...entry, id: Date.now() }; _entries = [e, ..._entries]; save(DIARY_KEY, _entries); notify(); return e; },
  deleteEntry(id) { _entries = _entries.filter(e => e.id !== id); save(DIARY_KEY, _entries); notify(); },
  addKB(item) { const k = { ...item, id: Date.now() }; _kb = [k, ..._kb]; save(KB_KEY, _kb); notify(); return k; },
  deleteKB(id) { _kb = _kb.filter(k => k.id !== id); save(KB_KEY, _kb); notify(); },
};
