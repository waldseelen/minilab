
import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MiniBotPage from './pages/MiniBotPage';
import { I18nProvider, useI18n } from './i18n';

const FooterContent = () => {
  const { t } = useI18n();
  return (
    <footer className="bg-white p-6 mt-8 border-t-4 border-pastel-blue">
      <div className="text-center text-gray-500 font-comic">
        <p>{t('footer')}</p>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6">
            <Suspense fallback={<div className="text-center p-10 text-2xl text-pastel-blue animate-pulse">Loading... 🚀</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/minibot" element={<MiniBotPage />} />
              </Routes>
            </Suspense>
          </main>
          <FooterContent />
        </div>
      </HashRouter>
    </I18nProvider>
  );
};

export default App;
