import React from 'react';
import './DictionaryCard.css';

const ITEMS_PER_PAGE = 50;
const ITEMS_PER_BOOK = 50000;

const DictionaryCard = ({ knowledge = [], onClick }) => {
  const knowledgeCount = knowledge.length;

  // 辞書換算
  const pages = knowledgeCount / ITEMS_PER_PAGE;
  const books = knowledgeCount / ITEMS_PER_BOOK;

  // 現在のページ内での進捗
  const pageProgress =
    ((knowledgeCount % ITEMS_PER_PAGE) / ITEMS_PER_PAGE) * 100;

  return (
    <div className="dictionary-card" onClick={onClick}>
      <div className="dictionary-card-header">
        <span className="dictionary-card-title">
          辞書に換算すると…
        </span>
      </div>

      <div className="dictionary-card-main">
        <span className="dictionary-card-number">
          {pages.toFixed(1)}
        </span>
        <span className="dictionary-card-unit">
          ページ分
        </span>
      </div>

      <div className="dictionary-card-info">
        <div className="dictionary-card-stat">
          <span className="stat-label">蓄積した知識</span>
          <span className="stat-value">
            {knowledgeCount.toLocaleString()} 個
          </span>
        </div>

        <div className="dictionary-card-stat">
          <span className="stat-label">本にすると</span>
          <span className="stat-value">
            {books.toFixed(3)} 冊
          </span>
        </div>
      </div>

      <div className="dictionary-card-progress">
        <div className="progress-label">
          <span>次の1ページまで</span>
          <span>
            {knowledgeCount % ITEMS_PER_PAGE} / {ITEMS_PER_PAGE}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${pageProgress}%` }}
          />
        </div>
      </div>

      <p className="dictionary-card-note">
        1ページ = 50個の知識　｜　1冊 = 50,000個の知識
      </p>
    </div>
  );
};

export default DictionaryCard;
