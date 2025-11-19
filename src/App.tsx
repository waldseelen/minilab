import { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import SkipLinks from './components/SkipLinks';
import { I18nProvider } from './i18n';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const ExperimentDetailPage = lazy(() => import('./pages/ExperimentDetailPage'));
const MiniBotPage = lazy(() => import('./pages/MiniBotPage'));
const SimulationsPage = lazy(() => import('./pages/SimulationsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));

const App = () => {
    return (
        <I18nProvider>
            <ErrorBoundary>
                <Router>
                    <SkipLinks />
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main id="main-content" className="flex-grow container mx-auto p-4" role="main">
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
