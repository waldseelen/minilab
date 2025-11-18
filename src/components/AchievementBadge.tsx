import React from 'react';
import type { Achievement } from '../services/achievementService';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-12 h-12 text-xs',
    medium: 'w-16 h-16 text-sm',
    large: 'w-20 h-20 text-base',
  };

  const emojiSizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${achievement.unlocked 
          ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg transform hover:scale-110' 
          : 'bg-gray-200 opacity-50'
        }
        rounded-full flex flex-col items-center justify-center
        transition-all duration-300 cursor-pointer
        border-4 border-white
      `}
      title={achievement.unlocked ? `${achievement.title}: ${achievement.description}` : '???'}
    >
      <span className={`${emojiSizes[size]} ${achievement.unlocked ? '' : 'grayscale'}`}>
        {achievement.unlocked ? achievement.emoji : '🔒'}
      </span>
      {size !== 'small' && (
        <span className={`font-bold text-center leading-tight ${achievement.unlocked ? 'text-yellow-900' : 'text-gray-500'}`}>
          {achievement.unlocked ? achievement.title.slice(0, 8) : '???'}
        </span>
      )}
    </div>
  );
};

export default AchievementBadge;
