import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const Header = () => {
    const { t, toggleLang, lang } = useI18n();
    const [isDark, setIsDark] = useState(false);

    const toggleDark = () => {
        const root = document.documentElement;
        const currentIsDark = root.getAttribute('data-theme') === 'dark';
        if (currentIsDark) {
            root.removeAttribute('data-theme');
            localStorage.setItem('minilab:theme', 'light');
            setIsDark(false);
        } else {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('minilab:theme', 'dark');
            setIsDark(true);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('minilab:theme');
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            setIsDark(true);
        } else {
            document.documentElement.removeAttribute('data-theme');
            setIsDark(false);
        }
    }, []);

    return (
        <header className="kids-header transition-colors duration-300">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="logo-link">
                    <div className="logo-container">
                        <img src="/icons/logo-professional.svg" alt="MiniLab" className="logo-icon" />
                        <span className="logo-text">MiniLab</span>
                    </div>
                </Link>
                <nav id="navigation" className="nav-container" role="navigation" aria-label="Ana navigasyon">
                    <Link to="/" className="nav-btn home-btn clickable" aria-label={t('nav.home')}>
                        <img src="/icons/navigation/home.svg" alt="" className="nav-icon" aria-hidden="true" />
                        <span className="nav-text">{t('nav.home')}</span>
                    </Link>
                    <Link to="/minibot" className="nav-btn chat-btn clickable" aria-label={t('nav.minibot')}>
                        <img src="/icons/navigation/robot.svg" alt="" className="nav-icon" aria-hidden="true" />
                        <span className="nav-text">{t('nav.minibot')}</span>
                    </Link>
                    <button
                        onClick={toggleLang}
                        className="nav-btn lang-btn clickable"
                        aria-label={t('toggle.lang')}
                    >
                        <img src="/icons/navigation/language.svg" alt="" className="nav-icon" aria-hidden="true" />
                        <span className="nav-text">{lang === 'tr' ? 'EN' : 'TR'}</span>
                    </button>
                    <button
                        onClick={toggleDark}
                        className="nav-btn dark-btn clickable"
                        aria-label={t('toggle.dark')}
                    >
                        <img src="/icons/navigation/dark-mode.svg" alt="" className="nav-icon" aria-hidden="true" style={{ filter: isDark ? 'invert(1)' : 'none' }} />
                        <span className="nav-text">{isDark ? 'Light' : 'Dark'}</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
