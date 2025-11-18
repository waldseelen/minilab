import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  color = 'primary'
}) => {
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  
  const colorClasses = {
    primary: 'from-blue-400 to-purple-500',
    success: 'from-green-400 to-emerald-500',
    warning: 'from-yellow-400 to-orange-500',
    error: 'from-red-400 to-pink-500'
  };

  const colorEmojis = {
    primary: '🚀',
    success: '🎉',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className="progress-indicator" role="progressbar" aria-valuenow={current} aria-valuemax={total} aria-label={label}>
      <div className="progress-header">
        {label && (
          <span className="progress-label">
            {colorEmojis[color]} {label}
          </span>
        )}
        {showPercentage && (
          <span className="progress-percentage">
            %{percentage}
          </span>
        )}
      </div>
      
      <div className="progress-track">
        <div 
          className={`progress-fill bg-gradient-to-r ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="progress-shine"></div>
        </div>
      </div>
      
      <div className="progress-footer">
        <span className="progress-steps">
          {current} / {total}
        </span>
        {current === total && (
          <span className="progress-complete">Tamamlandı! 🎊</span>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;
