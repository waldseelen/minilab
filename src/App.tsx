import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { I18nProvider } from './i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const ExperimentDetailPage = React.lazy(() => import('./pages/ExperimentDetailPage'));
const MiniBotPage = React.lazy(() => import('./pages/MiniBotPage'));
const SimulationsPage = React.lazy(() => import('./pages/SimulationsPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ParentDashboard = React.lazy(() => import('./pages/ParentDashboard'));

const App: React.FC = () => {
  return (
    <I18nProvider>
      <ErrorBoundary>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/experiment/:id" element={<ExperimentDetailPage />} />
                  <Route path="/minibot" element={<MiniBotPage />} />
                  <Route path="/simulations" element={<SimulationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/parent" element={<ParentDashboard />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </I18nProvider>
  );
};

export default App;