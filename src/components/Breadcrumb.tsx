import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';

interface BreadcrumbItem {
  label: string;
  path: string;
  emoji?: string;
}

const Breadcrumb: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const items: BreadcrumbItem[] = [
      { label: t('nav.home'), path: '/', emoji: '🏠' }
    ];

    if (path.startsWith('/experiment/')) {
      items.push({ label: 'Deney', path: path, emoji: '🧪' });
    } else if (path === '/minibot') {
      items.push({ label: t('nav.minibot'), path: '/minibot', emoji: '🤖' });
    } else if (path === '/profile') {
      items.push({ label: t('profile.title'), path: '/profile', emoji: '👤' });
    } else if (path === '/parent') {
      items.push({ label: t('parent.title'), path: '/parent', emoji: '👨‍👩‍👧‍👦' });
    } else if (path === '/simulations') {
      items.push({ label: t('nav.simulations'), path: '/simulations', emoji: '🔬' });
    }

    return items;
  };

  const items = getBreadcrumbItems();
  
  // Ana sayfadaysa breadcrumb gösterme
  if (items.length <= 1) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb navigation">
      <div className="breadcrumb-container">
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            {index === items.length - 1 ? (
              <span className="breadcrumb-current" aria-current="page">
                {item.emoji && <span className="breadcrumb-emoji">{item.emoji}</span>}
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path} 
                className="breadcrumb-link clickable"
                aria-label={`${item.label} sayfasına git`}
              >
                {item.emoji && <span className="breadcrumb-emoji">{item.emoji}</span>}
                {item.label}
              </Link>
            )}
            {index < items.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true">▶</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
