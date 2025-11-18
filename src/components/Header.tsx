import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

const Header: React.FC = () => {
    const { t, toggleLang } = useI18n();
    const toggleDark = () => {
        const root = document.documentElement;
        const isDark = root.getAttribute('data-theme') === 'dark';
        if (isDark) {
            root.removeAttribute('data-theme');
            localStorage.setItem('minilab:theme', 'light');
        } else {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('minilab:theme', 'dark');
        }
    };
    useEffect(() => {
        const saved = localStorage.getItem('minilab:theme');
        if (saved === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }, []);
    return (
        <header className="kids-header">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="logo-link">
                    <div className="logo-container">
                        <img src="/icons/logo-professional.svg" alt="MiniLab" className="logo-icon" />
                        <span className="logo-text">MiniLab</span>
                    </div>
                </Link>
                <nav id="navigation" className="nav-container" role="navigation" aria-label="Ana navigasyon">
                    <Link to="/" className="nav-btn home-btn clickable">
                        <img src="/icons/navigation/home.svg" alt="Home" className="nav-icon" />
                        <span className="nav-text">{t('nav.home')}</span>
                    </Link>
                    <Link to="/minibot" className="nav-btn chat-btn clickable">
                        <img src="/icons/navigation/robot.svg" alt="MiniBot" className="nav-icon" />
                        <span className="nav-text">{t('nav.minibot')}</span>
                    </Link>
                    <button onClick={toggleLang} className="nav-btn lang-btn clickable">
                        <img src="/icons/navigation/language.svg" alt="Language" className="nav-icon" />
                        <span className="nav-text">{t('toggle.lang')}</span>
                    </button>
                    <button onClick={toggleDark} className="nav-btn dark-btn clickable">
                        <img src="/icons/navigation/dark-mode.svg" alt="Dark Mode" className="nav-icon" />
                        <span className="nav-text">{t('toggle.dark')}</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
