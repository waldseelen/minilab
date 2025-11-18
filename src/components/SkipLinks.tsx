import React from 'react';
import { useI18n } from '../i18n';

const SkipLinks: React.FC = () => {
  const {} = useI18n();

  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Ana içeriğe geç
      </a>
      <a href="#navigation" className="skip-link">
        Navigasyona geç
      </a>
      <a href="#search" className="skip-link">
        Arama'ya geç
      </a>
    </div>
  );
};

export default SkipLinks;
