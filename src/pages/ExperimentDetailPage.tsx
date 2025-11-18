import React from 'react';
import { useParams } from 'react-router-dom';
import { getExperiment } from '../data/experiments';
import { getMaterialIcon } from '../data/materialIcons';
import { useI18n } from '../i18n';
import BackButton from '../components/BackButton';

const ExperimentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useI18n();
  const experiment = getExperiment(lang, Number(id));

  if (!experiment) {
    return <div>{t('experiment.notFound')}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <h1 className="text-5xl font-bold mb-6 tracking-wide">{experiment.title}</h1>
      <p className="text-xl text-gray-700 mb-8 leading-8">{experiment.description}</p>
      
      {experiment.gallery && experiment.gallery.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {experiment.gallery.slice(0,3).map((src, idx) => (
            <img key={idx} src={src} alt={`${experiment.title} ${idx+1}`} className="rounded-lg shadow object-cover w-full" />
          ))}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{t('exp.materials')}</h2>
        <ul className="list-disc list-inside leading-8 materials-list">
          {experiment.materials.map((material, index) => {
            const icon = getMaterialIcon(material);
            return (
              <li key={index}>
                <span className="inline-flex items-center">
                  {icon && <img src={icon} alt="" className="w-8 h-8 mr-2" />}
                  {material}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {experiment.videoUrl && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{t('experiment.watchVideo')}</h2>
          <iframe 
            width="560" 
            height="315" 
            src={experiment.videoUrl} 
            title={experiment.title} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      )}

      <div className="safety-warning" role="alert">
        <p className="font-bold">{t('safety.title')}</p>
        <p>{t('safety.text')}</p>
      </div>
    </div>
  );
};

export default ExperimentDetailPage;