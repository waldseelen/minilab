import React from 'react';
import { useI18n } from '../i18n';

const ParentDashboard: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">{t('parent.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-pastel-blue">{t('parent.stats.experiments')}</h2>
          <p className="text-5xl font-bold">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-pastel-green">{t('parent.stats.time')}</h2>
          <p className="text-5xl font-bold">3h 45m</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-pastel-pink">{t('parent.stats.badges')}</h2>
          <p className="text-5xl font-bold">5</p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4 text-gray-800">{t('recent.activity')}</h2>
        <ul className="list-disc list-inside bg-white p-6 rounded-lg shadow">
          <li>Completed 'Volcano Eruption' experiment</li>
          <li>Earned the 'Chemist' badge</li>
          <li>Spent 20 minutes on the 'Build a Simple Circuit' experiment</li>
          <li>Unlocked a new avatar customization</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">{t('settings')}</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="screen-time" className="text-lg">{t('settings.screenTime')}</label>
            <input type="range" id="screen-time" min="30" max="180" step="15" className="w-1/2" />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="content-filter" className="text-lg">{t('settings.filter')}</label>
            <select id="content-filter" className="p-2 rounded border">
              <option>All</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ParentDashboard;
