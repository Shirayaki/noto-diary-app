/**
 * DictionaryCard Component
 * DashPage に追加する「辞書換算」セクション
 * 日記の総語数をページ数・冊数で換算して表示
 */

import React, { useMemo } from 'react';
import { useStore } from '../hooks/useStore';

export default function DictionaryCard({ entries }) {

  // 設定
  const WORDS_PER_PAGE = 50;      // 1ページあたりの語数
  const WORDS_PER_BOOK = 50000;   // 1冊あたりの語数

  // 総語数を計算
  const stats = useMemo(() => {
    let totalWords = 0;

    // すべてのエントリのタイトル + 本文の語数をカウント
    diaryEntries.forEach((entry) => {
      // シンプルな語数カウント（スペース区切り）
      const titleWords = entry.title ? entry.title.split(/\s+/).length : 0;
      const bodyWords = entry.body ? entry.body.split(/\s+/).length : 0;
      totalWords += titleWords + bodyWords;
    });

    // ページ数・冊数を計算
    const pages = Math.round(totalWords / WORDS_PER_PAGE);
    const books = (totalWords / WORDS_PER_BOOK).toFixed(2);
    const booksWhole = Math.floor(totalWords / WORDS_PER_BOOK);
    const booksDecimal = totalWords % WORDS_PER_BOOK;

    return {
      totalWords: totalWords.toLocaleString('ja-JP'),
      pages,
      books: parseFloat(books),
      booksWhole,
      booksDecimal,
      booksPercentage: Math.round((booksDecimal / WORDS_PER_BOOK) * 100),
    };
  }, [diaryEntries]);

  return (
    <div className="dict-card">
      <div className="dict-header">
        <span className="dict-icon">📚</span>
        <h3>辞書に換算すると</h3>
      </div>

      <div className="dict-content">
        {/* 総語数 */}
        <div className="dict-stat">
          <div className="dict-label">総語数</div>
          <div className="dict-value">{stats.totalWords}語</div>
        </div>

        {/* ページ数 */}
        <div className="dict-stat">
          <div className="dict-label">ページ数（50語/ページ）</div>
          <div className="dict-value">{stats.pages}ページ</div>
        </div>

        {/* 冊数 */}
        <div className="dict-stat">
          <div className="dict-label">冊数（5万語/冊）</div>
          <div className="dict-value">{stats.books}冊</div>
        </div>

        {/* 冊数詳細（進捗バー付き） */}
        {stats.booksWhole > 0 || stats.booksPercentage > 0 ? (
          <div className="dict-progress">
            <div className="dict-progress-text">
              {stats.booksWhole > 0 && (
                <>
                  <strong>{stats.booksWhole}冊</strong>と
                </>
              )}
              <strong>{stats.booksPercentage}%</strong>
            </div>
            <div className="dict-progress-bar">
              <div
                className="dict-progress-fill"
                style={{ width: `${Math.min(stats.booksPercentage, 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="dict-progress">
            <div className="dict-progress-text">
              まだ <strong>0%</strong>
            </div>
            <div className="dict-progress-bar">
              <div className="dict-progress-fill" style={{ width: '0%' }} />
            </div>
          </div>
        )}

        {/* メッセージ */}
        <div className="dict-message">
          {stats.books >= 1 ? (
            <p>✨ {stats.booksWhole}冊分の知識を記録しました！</p>
          ) : (
            <p>📝 次の冊達成まで頑張りましょう</p>
          )}
        </div>
      </div>
    </div>
  );
}
