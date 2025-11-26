
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../i18n';

const Header: React.FC = () => {
  const location = useLocation();
  const { language, toggleLanguage, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`sticky top-0 z-50 px-4 pt-4 transition-all duration-500 ${scrolled ? 'pb-2' : 'pb-6'}`}>
      <header className={`
        mx-auto max-w-5xl 
        bg-white/90 backdrop-blur-xl 
        rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
        border border-white/50 
        px-4 py-2 md:px-6 md:py-3 
        flex justify-between items-center
        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${scrolled ? 'scale-[0.98] opacity-95 shadow-md translate-y-[-4px]' : 'scale-100'}
      `}>
        {/* Logo Area */}
        <Link to="/" className="flex items-center gap-3 group pl-1">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-200 group-hover:rotate-12 transition-transform duration-500 text-white">
              <span className="text-xl filter drop-shadow-sm">🧬</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col justify-center leading-none">
            <span className="text-xl md:text-2xl font-bold font-comic tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
              Mini<span className="text-purple-500">Lab</span>
            </span>
          </div>
        </Link>
        
        {/* Navigation */}
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden md:flex bg-slate-100/80 rounded-full p-1.5 border border-slate-200/50">
            <Link 
              to="/" 
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                isActive('/') 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <span>🏠</span> {t('nav.home')}
            </Link>
            <Link 
              to="/minibot" 
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                isActive('/minibot') 
                  ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <span>🤖</span> {t('nav.minibot')}
            </Link>
          </nav>

          {/* Mobile Nav (Icons Only) */}
           <nav className="flex md:hidden gap-1 bg-slate-100/80 rounded-full p-1">
            <Link 
              to="/" 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                isActive('/') ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              🏠
            </Link>
            <Link 
              to="/minibot" 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                isActive('/minibot') ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'
              }`}
            >
              🤖
            </Link>
          </nav>
          
          <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>

          <button 
            onClick={toggleLanguage}
            className="w-11 h-11 rounded-full bg-gradient-to-b from-white to-slate-50 border border-slate-200 flex items-center justify-center text-xl transition-all hover:shadow-md hover:border-indigo-200 hover:scale-105 active:scale-95 group"
            title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
          >
            <span className="group-hover:rotate-12 transition-transform duration-300">
              {language === 'tr' ? '🇬🇧' : '🇹🇷'}
            </span>
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
