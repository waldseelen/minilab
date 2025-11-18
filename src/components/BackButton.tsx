import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';

interface BackButtonProps {
  customText?: string;
  customPath?: string;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  customText, 
  customPath, 
  className = 'back-button' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const handleBack = () => {
    if (customPath) {
      navigate(customPath);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const getBackText = () => {
    if (customText) return customText;
    
    const path = location.pathname;
    if (path.startsWith('/experiment/')) {
      return `← ${t('nav.home')}`;
    } else if (path === '/minibot') {
      return `← ${t('nav.home')}`;
    } else if (path === '/profile') {
      return `← ${t('nav.home')}`;
    } else {
      return `← Geri`;
    }
  };

  return (
    <button 
      onClick={handleBack}
      className={`${className} clickable`}
      aria-label="Geri git"
    >
      {getBackText()}
    </button>
  );
};

export default BackButton;
