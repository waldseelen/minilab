import React, { useState, useEffect } from 'react';
import { dailyFactService } from '../services/dailyFactService';
import type { DailyFact } from '../services/dailyFactService';
import { useI18n } from '../i18n';

const DailyFactCard: React.FC = () => {
  const { t } = useI18n();
  const [dailyFact, setDailyFact] = useState<DailyFact | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fact = dailyFactService.getDailyFact();
    setDailyFact(fact);
  }, []);

  if (!dailyFact || !isVisible) return null;

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      dailyFactService.markFactAsRead(dailyFact.id);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="daily-fact-card">
      <div className="daily-fact-header">
        <div className="daily-fact-badge">
          <span className="daily-fact-emoji">{dailyFact.emoji}</span>
          <span className="daily-fact-label">{t('daily.fact')}</span>
        </div>
        <button onClick={handleClose} className="daily-fact-close">✕</button>
      </div>

      <div className="daily-fact-content">
        <h3 className="daily-fact-title">{dailyFact.title}</h3>
        
        {isExpanded ? (
          <div className="daily-fact-expanded">
            <p className="daily-fact-text">{dailyFact.content}</p>
            <div className="daily-fact-category">📚 {dailyFact.category}</div>
          </div>
        ) : (
          <div className="daily-fact-preview">
            <p className="daily-fact-preview-text">
              {dailyFact.content.slice(0, 50)}...
            </p>
          </div>
        )}

        <button 
          onClick={handleExpand}
          className="daily-fact-button"
        >
          {isExpanded ? t('daily.close') : t('daily.continue')}
        </button>
      </div>
    </div>
  );
};

export default DailyFactCard;
