import React from 'react';
import { useI18n } from '../i18n';

const ProfilePage: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-pastel-yellow mb-6">{t('profile.title')}</h1>
      
      <div className="bg-white inline-block p-8 rounded-full shadow-lg mb-8">
        <div className="w-[150px] h-[150px] rounded-full bg-pastel-blue flex items-center justify-center text-6xl">😀</div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('profile.name')}</h2>

      <div>
        <h3 className="text-2xl font-bold mb-4 text-pastel-green">{t('profile.badges')}</h3>
        <div className="flex justify-center space-x-4">
          <div className="bg-pastel-pink p-4 rounded-full text-4xl">🏅</div>
          <div className="bg-pastel-blue p-4 rounded-full text-4xl">🔬</div>
          <div className="bg-pastel-purple p-4 rounded-full text-4xl">🧪</div>
          <div className="bg-pastel-yellow p-4 rounded-full text-4xl">🌱</div>
          <div className="bg-gray-300 p-4 rounded-full text-4xl">⚙️</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;