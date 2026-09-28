import React, { useMemo } from 'react';

const ITEMS_PER_PAGE = 50;
const ITEMS_PER_BOOK = 50000;

export default function DictionaryCard({ kb = [] }) {
  const stats = useMemo(() => {
    const knowledgeCount = kb.length;

    // 1ページ = 50個の知識
    const pages = knowledgeCount / ITEMS_PER_PAGE;

    // 1冊 = 50,000個の知識
    const books = knowledgeCount / ITEMS_PER_BOOK;

    // 現在のページの進捗
    const currentPageCount = knowledgeCount % ITEMS_PER_PAGE;
    const pageProgress =
      (currentPageCount / ITEMS_PER_PAGE) * 100;

    // 現在の本の進捗
    const bookProgress =
      (knowledgeCount % ITEMS_PER_BOOK) / ITEMS_PER_BOOK * 100;

    return {
      knowledgeCount,
      pages,
      books,
      currentPageCount,
      pageProgress,
      bookProgress,
    };
  }, [kb]);

  return (
    <div className="dict-card">
      <div className="dict-header">
        <span className="dict-icon">📚</span>
        <h3>辞書に換算すると…</h3>
      </div>

      <div className="dict-content">

        {/* ページ換算 */}
        <div className="dict-stat">
          <div className="dict-label">
            ページ換算
          </div>

          <div className="dict-value">
            {stats.pages.toFixed(1)}ページ
          </div>
        </div>

        {/* 知識数 */}
        <div className="dict-stat">
          <div className="dict-label">
            蓄積した知識
          </div>

          <div className="dict-value">
            {stats.knowledgeCount.toLocaleString('ja-JP')}個
          </div>
        </div>

        {/* 本換算 */}
        <div className="dict-stat">
          <div className="dict-label">
            本にすると
          </div>

          <div className="dict-value">
            {stats.books.toFixed(3)}冊
          </div>
        </div>

        {/* ページ進捗 */}
        <div className="dict-progress">
          <div className="dict-progress-text">
            次の1ページまで
            <strong>
              {stats.currentPageCount} / {ITEMS_PER_PAGE}
            </strong>
          </div>

          <div className="dict-progress-bar">
            <div
              className="dict-progress-fill"
              style={{
                width: `${stats.pageProgress}%`,
              }}
            />
          </div>
        </div>

        {/* 基準 */}
        <div className="dict-message">
          <p>
            1ページ = 50個の知識　｜　
            1冊 = 50,000個の知識
          </p>
        </div>

      </div>
    </div>
  );
}
