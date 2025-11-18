import React from 'react';
import { Link } from 'react-router-dom';
import type { Experiment } from '../data/experiments';
import { useI18n } from '../i18n';

interface ExperimentCardProps {
  experiment: Experiment;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment }) => {
  const { t } = useI18n();
  
  const categoryEmojis: Record<string, string> = {
    Physics: '⚡',
    Chemistry: '🧪',
    Biology: '🧬',
    'Environmental Science': '🌍',
    Engineering: '⚙️',
    Astronomy: '🌟',
    Technology: '💻',
    AI: '🤖'
  };

  const difficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'Kolay': return '⭐';
      case 'Orta': return '⭐⭐';
      case 'Zor': return '⭐⭐⭐';
      default: return '⭐';
    }
  };

  return (
    <div className="experiment-card clickable">
      {experiment.imageUrl && (
        <div className="experiment-image">
          <img src={experiment.imageUrl} alt={experiment.title} />
        </div>
      )}
      <div className="experiment-content">
        <div className="experiment-category">
          {categoryEmojis[experiment.category]} {t(`cat.${experiment.category}`)}
        </div>
        <h3 className="experiment-title">{experiment.title}</h3>
        <p className="experiment-description">{experiment.description}</p>
        
        {/* Deney özellikleri */}
        <div className="experiment-meta">
          <span className="meta-item" title="Yaş grubu">
            👶 {experiment.ageGroup} yaş
          </span>
          <span className="meta-item" title="Zorluk seviyesi">
            {difficultyStars(experiment.difficulty)} {experiment.difficulty}
          </span>
          <span className="meta-item" title="Süre">
            ⏱️ {experiment.duration}
          </span>
        </div>
        
        <Link 
          to={`/experiment/${experiment.id}`} 
          className="experiment-button clickable"
          aria-label={`${experiment.title} deneyine git`}
        >
          🚀 {t('btn.letsgo')}
        </Link>
      </div>
    </div>
  );
};

export default ExperimentCard;
