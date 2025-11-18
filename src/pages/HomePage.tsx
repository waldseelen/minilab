import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ExperimentCard from '../components/ExperimentCard';
import LearningCard from '../components/LearningCard';
import { getExperiments } from '../data/experiments';
import { getCardsByAge, getCardsByCategoryAndAge } from '../data/learningCards';

const categories = ['All', 'Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Engineering', 'Astronomy', 'Technology', 'AI'];
const categoryIcons: Record<string, string> = {
    All: '/icons/categories/all.svg',
    Physics: '/icons/categories/physics-pro.svg',
    Chemistry: '/icons/categories/chemistry-pro.svg',
    Biology: '/icons/categories/biology-pro.svg',
    'Environmental Science': '/icons/categories/environment.svg',
    Engineering: '/icons/categories/engineering.svg',
    Astronomy: '/icons/categories/astronomy.svg',
    Technology: '/icons/categories/technology.svg',
    AI: '/icons/categories/ai.svg',
};

const categoryEmoji: Record<string, string> = {
    All: '✨',
    Physics: '⚡',
    Chemistry: '🧪',
    Biology: '🧬',
    'Environmental Science': '🌍',
    Engineering: '⚙️',
    Astronomy: '🌟',
    Technology: '💻',
    AI: '🤖',
};

const HomePage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const [selectedCategory, setSelectedCategory] = useState('Physics'); // Fizik ile başla
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<'All' | '4-6' | '6-8' | '8-10'>('6-8');
    const [currentView, setCurrentView] = useState<'learning' | 'experiments'>('learning');

    // Öğrenme kartları
    const learningCards = selectedAgeGroup !== 'All' && selectedCategory !== 'All'
        ? getCardsByCategoryAndAge(selectedCategory, selectedAgeGroup)
        : selectedAgeGroup !== 'All'
            ? getCardsByAge(selectedAgeGroup)
            : [];

    // Deneyler (eski sistem)
    const data = getExperiments(lang === 'tr' ? 'tr' : 'en');
    let filteredExperiments = selectedCategory === 'All' ? data : data.filter(exp => exp.category === selectedCategory);
    if (selectedAgeGroup !== 'All') {
        filteredExperiments = filteredExperiments.filter(exp => exp.ageGroup === selectedAgeGroup || exp.ageGroup === 'All');
    }

    return (
        <div className="kids-homepage">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-background-elements">
                    <img src="/illustrations/educational/atom-interactive.svg"
                        alt="Atom"
                        className="hero-bg-element atom-element float-animation" />
                    <img src="/icons/categories/chemistry-pro.svg"
                        alt="Chemistry"
                        className="hero-bg-element chemistry-element pulse-glow" />
                    <img src="/icons/categories/biology-pro.svg"
                        alt="Biology"
                        className="hero-bg-element biology-element float-animation" />
                </div>
                <h1 className="hero-title">
                    <span className="hero-emoji">🧠</span>
                    {t('home.hero.title')}
                    <span className="hero-emoji">🌟</span>
                </h1>
                <p className="hero-subtitle">
                    {t('home.hero.subtitle')}
                </p>

                {/* Yaş Grubu Seçimi */}
                <div className="age-filter-section">
                    <h3 className="age-filter-title">{t('home.age.title')}</h3>
                    <div className="age-filter-buttons">
                        {(['4-6', '6-8', '8-10'] as const).map(age => (
                            <button
                                key={age}
                                onClick={() => setSelectedAgeGroup(age)}
                                className={`age-filter-btn clickable ${selectedAgeGroup === age ? 'active' : ''}`}
                                aria-label={`${age} yaş grubunu seç`}
                            >
                                👶 {age} yaş
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Günlük Bilim Gerçeği */}
            <div className="daily-section">
                {/* <DailyFactCard /> */}
            </div>

            {/* Başarı Rozetleri */}
            <div className="achievement-section">
                {/* <AchievementPanel /> */}
            </div>

            {/* İçerik Türü Seçimi */}
            <div className="content-type-section">
                <div className="content-type-buttons">
                    <button
                        onClick={() => setCurrentView('learning')}
                        className={`content-type-btn clickable ${currentView === 'learning' ? 'active' : ''}`}
                        aria-label="Bilgi kartlarını göster"
                    >
                        {t('home.content.learning')}
                    </button>
                    <button
                        onClick={() => setCurrentView('experiments')}
                        className={`content-type-btn clickable ${currentView === 'experiments' ? 'active' : ''}`}
                        aria-label="Deneyleri göster"
                    >
                        {t('home.content.experiments')}
                    </button>
                </div>
            </div>

            {/* Kategori Seçimi */}
            <div className="category-section">
                <h2 className="section-title">
                    {currentView === 'learning' ? t('home.category.learning') : t('home.category.experiments')}
                </h2>
                <div className="category-grid">
                    {categories.slice(1).map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`category-card clickable ${selectedCategory === category ? 'active' : ''}`}
                            aria-label={`${t(`cat.${category}`)} kategorisini seç`}
                        >
                            <img src={categoryIcons[category] || '/icons/categories/' + category.toLowerCase() + '.svg'}
                                alt={category}
                                className="category-icon"
                                onError={(e) => {
                                    // Fallback to emoji if icon not found
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                }} />
                            <span className="category-emoji hidden">{categoryEmoji[category]}</span>
                            <span className="category-name">{t(`cat.${category}`)}</span>
                            <span className="category-count">
                                {currentView === 'learning'
                                    ? `${learningCards.filter(c => c.category === category).length} ${t('card.count')}`
                                    : `${data.filter(e => e.category === category).length} ${t('experiment.count')}`
                                }
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* İçerik Gösterimi */}
            {currentView === 'learning' && learningCards.length > 0 && (
                <div className="learning-section">
                    <h2 className="section-title">
                        {categoryEmoji[selectedCategory]} {selectedCategory} - Seviye {selectedAgeGroup} yaş
                    </h2>
                    <div className="learning-cards-container">
                        {learningCards.map((card, index) => (
                            <div key={card.id} className="learning-card-wrapper">
                                <div className="learning-card-level">📚 {index + 1}{t('level.card')}</div>
                                <LearningCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {currentView === 'experiments' && (
                <div className="experiments-section">
                    <h2 className="section-title">
                        {categoryEmoji[selectedCategory]} {selectedCategory} Deneyleri - {selectedAgeGroup} yaş
                    </h2>
                    <div className="experiments-grid">
                        {filteredExperiments.map(experiment => (
                            <ExperimentCard key={experiment.id} experiment={experiment} />
                        ))}
                    </div>
                </div>
            )}

            {currentView === 'learning' && learningCards.length === 0 && (
                <div className="no-content">
                    <div className="no-content-message">
                        <span className="no-content-emoji">🔄</span>
                        <h3>{t('home.nocontent.title')}</h3>
                        <p>{t('home.nocontent.subtitle')}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
