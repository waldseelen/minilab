
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { learningCards } from '../data/learningCards';
import { generateExperimentIdeas } from '../services/geminiService';
import { useI18n } from '../i18n';

interface ExperimentHistoryItem {
  id: string;
  category: Category;
  age: string;
  content: string;
  timestamp: number;
}

const HomePage: React.FC = () => {
  const { t, language } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Generator State
  const [genCategory, setGenCategory] = useState<Category>(Category.Physics);
  const [genAge, setGenAge] = useState<'4-6' | '6-8' | '8-10'>('6-8');
  const [experimentIdeas, setExperimentIdeas] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ExperimentHistoryItem[]>([]);
  
  // Card Interaction State
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Modal State
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('experimentHistory');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  }, []);

  // Intersection Observer for card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('animate-pop-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    setTimeout(() => {
      const cards = document.querySelectorAll('.learning-card');
      cards.forEach((card) => observer.observe(card));
    }, 50);

    return () => {
      observer.disconnect();
    };
  }, [selectedCategory, language, searchQuery]);

  const filteredCards = learningCards.filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) {
      return false;
    }
    if (!searchQuery.trim()) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    const title = c.title[language].toLowerCase();
    const content = c.content[language].toLowerCase();
    const tags = c.tags.some(tag => tag.toLowerCase().includes(query));

    return title.includes(query) || content.includes(query) || tags;
  });

  const categories = Object.values(Category);

  const handleGenerateExperiment = async () => {
    setIsGenerating(true);
    setExperimentIdeas('');
    try {
      const ideas = await generateExperimentIdeas(genCategory, genAge, language);
      setExperimentIdeas(ideas);

      if (ideas && !ideas.includes("error") && !ideas.includes("hata")) {
        const newItem: ExperimentHistoryItem = {
          id: Date.now().toString(),
          category: genCategory,
          age: genAge,
          content: ideas,
          timestamp: Date.now()
        };
        
        const updatedHistory = [newItem, ...history].slice(0, 5);
        setHistory(updatedHistory);
        localStorage.setItem('experimentHistory', JSON.stringify(updatedHistory));
      }
    } catch (e) {
      setExperimentIdeas(language === 'tr' ? "Bir hata oluştu." : "An error occurred.");
    }
    setIsGenerating(false);
  };

  const loadHistoryItem = (item: ExperimentHistoryItem) => {
    setGenCategory(item.category);
    setGenAge(item.age as any);
    setExperimentIdeas(item.content);
  };

  const handleCardClick = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const getCategoryStyles = (cat: Category) => {
    switch (cat) {
      case Category.Physics: 
        return { bg: 'bg-blue-100', text: 'text-blue-700', light: 'bg-blue-50', shadow: 'hover:shadow-blue-200', border: 'border-blue-200', pill: 'bg-blue-500 text-white' };
      case Category.Chemistry: 
        return { bg: 'bg-green-100', text: 'text-green-700', light: 'bg-green-50', shadow: 'hover:shadow-green-200', border: 'border-green-200', pill: 'bg-green-500 text-white' };
      case Category.Biology: 
        return { bg: 'bg-pink-100', text: 'text-pink-700', light: 'bg-pink-50', shadow: 'hover:shadow-pink-200', border: 'border-pink-200', pill: 'bg-pink-500 text-white' };
      case Category.Space: 
        return { bg: 'bg-indigo-100', text: 'text-indigo-800', light: 'bg-indigo-50', shadow: 'hover:shadow-indigo-200', border: 'border-indigo-200', pill: 'bg-indigo-500 text-white' };
      case Category.Tech: 
        return { bg: 'bg-gray-200', text: 'text-gray-700', light: 'bg-gray-50', shadow: 'hover:shadow-gray-300', border: 'border-gray-300', pill: 'bg-gray-600 text-white' };
      case Category.AI: 
        return { bg: 'bg-purple-100', text: 'text-purple-700', light: 'bg-purple-50', shadow: 'hover:shadow-purple-200', border: 'border-purple-200', pill: 'bg-purple-500 text-white' };
      case Category.Environment:
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', light: 'bg-emerald-50', shadow: 'hover:shadow-emerald-200', border: 'border-emerald-200', pill: 'bg-emerald-500 text-white' };
      case Category.Robotics:
        return { bg: 'bg-slate-200', text: 'text-slate-800', light: 'bg-slate-100', shadow: 'hover:shadow-slate-300', border: 'border-slate-300', pill: 'bg-slate-600 text-white' };
      default: 
        return { bg: 'bg-gray-100', text: 'text-gray-700', light: 'bg-gray-50', shadow: 'hover:shadow-gray-200', border: 'border-gray-200', pill: 'bg-gray-500 text-white' };
    }
  };

  return (
    <div className="space-y-16 pb-24">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-20 text-center text-white shadow-2xl shadow-indigo-200 overflow-hidden isolate ring-1 ring-white/10">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-bounce delay-1000 duration-[5000ms]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
            
            {/* Floating Emojis */}
            <div className="absolute top-20 right-[15%] text-6xl animate-bounce opacity-30 duration-[3000ms] select-none">🚀</div>
            <div className="absolute bottom-20 left-[10%] text-6xl animate-bounce opacity-30 delay-700 duration-[4000ms] select-none">🪐</div>
            <div className="absolute top-10 left-[20%] text-4xl animate-pulse opacity-30 delay-300 select-none">✨</div>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
           <button 
             onClick={() => setShowAboutModal(true)}
             className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold mb-8 hover:bg-white/20 hover:scale-105 transition-all cursor-pointer"
           >
             <span className="bg-green-400 w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
             {t('btn.about')} <span className="group-hover:translate-x-1 transition-transform">→</span>
           </button>

          <h1 className="text-5xl md:text-7xl font-comic font-bold mb-6 leading-tight drop-shadow-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-indigo-100">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl font-medium text-indigo-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>

      {/* Search & Filter Section - Floating overlap */}
      <section className="px-4 -mt-16 relative z-20 max-w-6xl mx-auto">
         {/* Search */}
         <div className="max-w-2xl mx-auto mb-12">
            <div className="relative group transform transition-all hover:-translate-y-1 duration-300">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] flex items-center p-2 border border-white/50">
                  <div className="pl-5 text-2xl opacity-50 select-none">🔍</div>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="w-full p-4 text-lg font-bold text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="mr-2 w-10 h-10 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center font-bold text-lg"
                    >
                      ✕
                    </button>
                  )}
              </div>
            </div>
         </div>

         {/* Filters */}
         <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-6 py-2.5 rounded-full font-bold text-base transition-all duration-300 ${
                selectedCategory === 'All' 
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-300 scale-105' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm hover:shadow-md border border-slate-200'
              }`}
            >
              🌈 {t('filter.all')}
            </button>
            {categories.map((cat) => {
               const styles = getCategoryStyles(cat);
               const isSelected = selectedCategory === cat;
               return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 flex items-center gap-2 ${
                    isSelected 
                      ? `${styles.pill} shadow-lg scale-105` 
                      : `bg-white ${styles.text} hover:bg-gray-50 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200`
                  }`}
                >
                  <span>
                    {cat === Category.Physics && '⚡'}
                    {cat === Category.Chemistry && '🧪'}
                    {cat === Category.Biology && '🧬'}
                    {cat === Category.Space && '🪐'}
                    {cat === Category.Tech && '💻'}
                    {cat === Category.AI && '🤖'}
                    {cat === Category.Environment && '🌱'}
                    {cat === Category.Robotics && '🦾'}
                  </span>
                  {t(`cat.${cat}`)}
                </button>
               );
            })}
         </div>
      </section>

      {/* Cards Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div key={`${selectedCategory}-${language}`} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredCards.length > 0 ? (
            filteredCards.map((card, index) => {
              const styles = getCategoryStyles(card.category);
              const isExpanded = expandedCardId === card.id;
              
              // Choose localized content
              const title = card.title[language];
              const content = card.content[language];
              
              // Determine card type label
              let typeLabel = t('card.learn');
              if (card.type === 'Experiment') typeLabel = t('card.experiment');
              if (card.type === 'Simulation') typeLabel = t('card.simulation');

              return (
                <div 
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`learning-card opacity-0 translate-y-8 bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.04)] 
                    transition-all duration-500 ease-out cursor-pointer relative group border border-slate-100
                    ${isExpanded 
                      ? 'scale-[1.02] ring-4 ring-indigo-100 shadow-2xl z-10' 
                      : `hover:-translate-y-2 hover:scale-[1.01] ${styles.shadow} hover:shadow-xl`}
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card Header */}
                  <div className={`h-28 ${styles.bg} w-full relative overflow-hidden rounded-t-[2rem] border-b ${styles.border}`}>
                    <div className="absolute inset-0 opacity-30" 
                         style={{backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)', backgroundSize: '16px 16px'}}>
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 shadow-sm flex items-center gap-1">
                       <span>🎂</span> {card.ageGroup}
                    </div>
                    
                    <div className="absolute top-4 left-4 bg-black/5 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                       {typeLabel}
                    </div>
                  </div>

                  {/* Floating Emoji Badge */}
                  <div className="absolute top-14 left-6 w-20 h-20 bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] flex items-center justify-center z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-4 border-white">
                     <span className="text-4xl filter drop-shadow-sm">{card.emoji}</span>
                  </div>

                  {/* Card Body */}
                  <div className="pt-12 pb-6 px-7 flex flex-col h-full">
                    <div className="mb-3">
                      <h3 className="text-2xl font-bold text-slate-800 font-comic leading-tight group-hover:text-indigo-600 transition-colors">
                        {title}
                      </h3>
                    </div>
                    
                    <p className="text-slate-500 text-sm font-medium leading-relaxed mb-5 line-clamp-3 group-hover:text-slate-600">
                      {content}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {card.tags.map(tag => (
                        <span key={tag} className={`text-xs font-bold px-2.5 py-1 rounded-lg ${styles.light} ${styles.text} border ${styles.border}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="h-px bg-slate-100 w-full my-2"></div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
                        ⏱ {card.duration}
                      </span>
                      <span className={`text-sm font-bold ${styles.text} opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1`}>
                        {t('card.more')} <span className="text-lg">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200">
               <div className="text-6xl mb-4 opacity-50">🔍</div>
               <h3 className="text-xl font-bold text-gray-400 font-comic">
                 {language === 'tr' ? 'Sonuç bulunamadı...' : 'No results found...'}
               </h3>
               <button onClick={() => {setSearchQuery(''); setSelectedCategory('All');}} className="mt-4 text-indigo-500 font-bold hover:underline">
                 {language === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters'}
               </button>
            </div>
          )}
        </div>
      </section>

      {/* Features / How it works Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-3 shadow-sm">
            {t('features.tag')}
          </span>
          <h2 className="text-3xl md:text-4xl font-comic font-bold text-slate-800">
            {t('features.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Feature 1: Cards */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-100 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="absolute -right-6 -top-6 bg-blue-100 w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
             <div className="relative z-10 text-5xl mb-6 bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">🃏</div>
             <h3 className="relative z-10 text-2xl font-bold text-blue-900 mb-3 font-comic">{t('features.cards.title')}</h3>
             <p className="relative z-10 text-blue-700/70 font-medium leading-relaxed">
               {t('features.cards.desc')}
             </p>
          </div>

          {/* Feature 2: Experiments */}
          <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 border border-green-100 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className="absolute -right-6 -top-6 bg-green-100 w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
             <div className="relative z-10 text-5xl mb-6 bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">🧪</div>
             <h3 className="relative z-10 text-2xl font-bold text-green-900 mb-3 font-comic">{t('features.experiments.title')}</h3>
             <p className="relative z-10 text-green-700/70 font-medium leading-relaxed">
               {t('features.experiments.desc')}
             </p>
          </div>

           {/* Feature 3: MiniBot */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 border border-purple-100 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => window.location.hash = '#/minibot'}>
             <div className="absolute -right-6 -top-6 bg-purple-100 w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
             <div className="relative z-10 text-5xl mb-6 bg-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">🤖</div>
             <h3 className="relative z-10 text-2xl font-bold text-purple-900 mb-3 font-comic flex items-center gap-2">
                {t('features.minibot.title')} <span className="text-[10px] bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full uppercase tracking-wide">AI</span>
             </h3>
             <p className="relative z-10 text-purple-700/70 font-medium leading-relaxed">
               {t('features.minibot.desc')}
             </p>
             <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">➜</div>
          </div>
        </div>
      </section>

      {/* Experiment Generator Section */}
      <section className="max-w-5xl mx-auto px-4 pt-10">
        <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.15)] border border-orange-100 relative overflow-hidden">
             {/* Decorative Blobs */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-200/30 to-transparent rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-200/30 to-transparent rounded-full -ml-16 -mb-16 blur-3xl pointer-events-none"></div>
             
            <div className="text-center mb-10 relative z-10">
              <div className="inline-block p-3 bg-orange-50 rounded-2xl mb-4">
                 <span className="text-4xl">🧪</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-comic font-bold text-slate-800 mb-4">
                {t('gen.title')}
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto text-lg">
                {t('gen.desc')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t('filter.category')}</label>
                  <div className="relative">
                    <select 
                      value={genCategory}
                      onChange={(e) => setGenCategory(e.target.value as Category)}
                      className="w-full p-4 rounded-2xl border border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none bg-slate-50 font-bold text-slate-700 appearance-none cursor-pointer hover:bg-white transition-all"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {t(`cat.${cat}`)}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">▼</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t('filter.age')}</label>
                   <div className="relative">
                    <select 
                      value={genAge}
                      onChange={(e) => setGenAge(e.target.value as any)}
                      className="w-full p-4 rounded-2xl border border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none bg-slate-50 font-bold text-slate-700 appearance-none cursor-pointer hover:bg-white transition-all"
                    >
                      <option value="4-6">4-6</option>
                      <option value="6-8">6-8</option>
                      <option value="8-10">8-10</option>
                    </select>
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">▼</span>
                  </div>
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={handleGenerateExperiment}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2 shadow-lg shadow-orange-200"
                  >
                    {isGenerating ? (
                      <>
                        <span className="animate-spin text-xl">🌀</span> {t('gen.loading')}
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🎲</span> {t('btn.generate')}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* History List */}
              {history.length > 0 && (
                <div className="mb-8 border-t border-slate-100 pt-6">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-4 ml-1 tracking-wider">{t('gen.history')}</p>
                   <div className="flex flex-wrap gap-3">
                     {history.map((item) => (
                       <button
                         key={item.id}
                         onClick={() => loadHistoryItem(item)}
                         className="group bg-white hover:bg-orange-50 text-slate-500 hover:text-orange-600 border border-slate-200 hover:border-orange-200 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 flex items-center gap-2 shadow-sm"
                       >
                         <span className="grayscale group-hover:grayscale-0 transition-all text-base">
                            {item.category === Category.Physics && '⚡'}
                            {item.category === Category.Chemistry && '🧪'}
                            {item.category === Category.Biology && '🧬'}
                            {item.category === Category.Space && '🪐'}
                            {item.category === Category.Tech && '💻'}
                            {item.category === Category.AI && '🤖'}
                            {item.category === Category.Environment && '🌱'}
                            {item.category === Category.Robotics && '🦾'}
                         </span>
                         {t(`cat.${item.category}`)}
                       </button>
                     ))}
                   </div>
                </div>
              )}

              {experimentIdeas && (
                <div className="mt-4 transition-all duration-500 animate-pop-in">
                  <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-[0_10px_30px_-5px_rgba(251,146,60,0.1)]">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="p-2 bg-yellow-100 rounded-lg text-xl">💡</div> 
                      {t('gen.result')}
                    </h3>
                    <div className="prose prose-slate prose-lg max-w-none whitespace-pre-wrap font-medium text-slate-600 leading-relaxed">
                      {experimentIdeas}
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>
      </section>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-2xl w-full relative shadow-2xl animate-pop-in overflow-y-auto max-h-[90vh] border border-white/20">
            <button 
              onClick={() => setShowAboutModal(false)} 
              className="absolute top-6 right-6 w-10 h-10 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center font-bold transition-colors text-xl"
            >
              ✕
            </button>
            
            <div className="text-center mb-8 mt-2">
              <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-3xl rotate-3 flex items-center justify-center text-5xl shadow-xl shadow-purple-200 mb-6 animate-bounce border-4 border-white">
                🧬
              </div>
              <h2 className="text-3xl font-comic font-bold text-slate-800">{t('modal.welcome')}</h2>
            </div>
            
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium">
              <div className="text-center px-4">
                <p className="mb-4 text-xl text-slate-700">
                  {t('hero.subtitle')} 🌍
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                <h3 className="text-xl font-bold text-purple-700 mb-2 flex items-center gap-2">
                  <span>🎯</span> {t('modal.mission')}
                </h3>
                <p className="text-base">
                  {t('modal.mission.desc')}
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-5 items-center shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => window.location.hash = '#/minibot'}>
                 <div className="text-5xl min-w-[60px] group-hover:scale-110 transition-transform">🤖</div>
                 <div>
                   <h3 className="text-xl font-bold text-blue-600 mb-1">{t('modal.minibot')}</h3>
                   <p className="text-sm text-blue-800/80">
                     {t('modal.minibot.desc')}
                   </p>
                 </div>
              </div>

              <div className="text-center pt-4 pb-2">
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-12 rounded-full shadow-xl transform hover:scale-105 transition-all text-lg"
                >
                  {t('modal.start')} 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
