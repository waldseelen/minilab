import React, { useEffect, useState } from 'react';
import { achievementService } from '../services/achievementService';
import AchievementBadge from './AchievementBadge';
import type { Achievement } from '../services/achievementService';
import { useI18n } from '../i18n';
import { useToast } from '../hooks/useToast';

const AchievementPanel: React.FC = () => {
  const { t } = useI18n();
  const { celebrate } = useToast();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    setAchievements(achievementService.getAchievements());
    
    const handleAchievementUnlocked = (event: CustomEvent) => {
      const achievement = event.detail as Achievement;
      setNewAchievement(achievement);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setAchievements(achievementService.getAchievements());
      
      // Toast notification da göster
      celebrate();
    };

    window.addEventListener('achievement:unlocked', handleAchievementUnlocked as EventListener);
    return () => window.removeEventListener('achievement:unlocked', handleAchievementUnlocked as EventListener);
  }, []);

  const progress = achievementService.getProgress();

  return (
    <div className="achievement-panel">
      {/* Başarı Notification */}
      {showNotification && newAchievement && (
        <div className="achievement-notification">
          <div className="achievement-notification-content">
            <span className="text-4xl">{newAchievement.emoji}</span>
            <div>
              <h3 className="font-bold text-lg">{t('achievement.unlock')}</h3>
              <p className="text-sm">{newAchievement.title} rozetini kazandın!</p>
              <p className="text-xs text-gray-600">{newAchievement.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Başarı Paneli */}
      <div className="bg-white rounded-3xl p-4 shadow-lg border-4 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purple-700">{t('achievement.title')}</h2>
          <div className="text-sm text-purple-600">
            {progress.completed}/{progress.total} (%{progress.percentage})
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>

        {/* Rozetler */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {achievements.map(achievement => (
            <AchievementBadge 
              key={achievement.id} 
              achievement={achievement} 
              size="medium"
            />
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>{t('achievement.first')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementPanel;