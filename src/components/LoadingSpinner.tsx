import React from 'react';
import { useI18n } from '../i18n';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  emoji?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text, 
  emoji = '🔬' 
}) => {
  const { t } = useI18n();
  const loadingText = text || t('loading.text');
  
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-lg'
  };

  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className={`loading-spinner ${sizeClasses[size]}`}>
        <div className="loading-emoji">
          {emoji}
        </div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {loadingText && (
        <p className="loading-text" aria-label={loadingText}>
          {loadingText}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;