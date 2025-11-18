import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

// PixiJS dinamik import örneği - simülasyon aktif olduğunda kullanılabilir:
// const loadPixi = async () => {
//   const PIXI = await import('pixi.js');
//   return PIXI;
// };

const quickLinks = [
    { id: 1, title: 'Volcano Eruption', to: '/experiment/1', icon: '/icons/chemistry.svg' },
    { id: 13, title: 'Balloon Rocket', to: '/experiment/13', icon: '/icons/physics.svg' },
    { id: 4, title: 'Simple Circuit', to: '/experiment/4', icon: '/icons/physics.svg' },
];

const SimulationsPage: React.FC = () => {
    const { t } = useI18n();
    return (
        <div className="text-center">
            <h1 className="text-5xl font-bold text-pastel-green mb-4">{t('sim.title')}</h1>
            <p className="text-xl text-gray-700 mb-8">{t('sim.text')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto">
                {quickLinks.map((q) => (
                    <Link key={q.id} to={q.to} className="card flex items-center justify-between">
                        <div className="text-left">
                            <h3 className="text-2xl font-bold mb-2">{q.title}</h3>
                            <p className="text-gray-700">{t('sim.open')}</p>
                        </div>
                        <img src={q.icon} alt="icon" width={64} height={64} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SimulationsPage;
