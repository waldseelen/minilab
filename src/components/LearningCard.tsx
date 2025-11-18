import { useState } from 'react';
import type { LearningCard as LearningCardModel } from '../data/learningCards';
import { useToast } from '../hooks/useToast';
import { useI18n } from '../i18n';
import ProgressIndicator from './ProgressIndicator';

interface LearningCardProps {
    card: LearningCardModel;
    onComplete?: (cardId: string) => void;
}

const LearningCardComponent: React.FC<LearningCardProps> = ({ card, onComplete }) => {
    const { t } = useI18n();
    const { celebrate, success } = useToast();
    const [currentView, setCurrentView] = useState<'content' | 'quiz'>('content');
    const [quizAnswered, setQuizAnswered] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);

    const handleQuizAnswer = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
        setQuizAnswered(true);
        setShowExplanation(true);
        setProgress(100);

        // Doğru cevap kontrolü
        if (card.quiz?.[0] && answerIndex === card.quiz[0].correctAnswer) {
            success('Doğru cevap! 🎉 Harikasın!', {
                title: 'Tebrikler!',
                duration: 3000
            });
        } else {
            success('Yanlış olsun! Denemeye devam et! 😊', {
                emoji: '💪',
                title: 'Devam et!',
                duration: 3000
            });
        }

        // 2 saniye sonra tamamlandı olarak işaretle
        setTimeout(() => {
            setCompleted(true);
            if (onComplete) {
                onComplete(card.id);
            }
        }, 3000);
    };

    const handleComplete = () => {
        setProgress(100);
        setCompleted(true);
        celebrate(`${card.title} kartını tamamladın! 🌟`);
        celebrate();
        if (onComplete) {
            onComplete(card.id);
        }
    };

    const ageGroupColors = {
        '4-6': 'from-pink-300 to-purple-300',
        '6-8': 'from-blue-300 to-green-300',
        '8-10': 'from-orange-300 to-red-300'
    };

    const categoryEmojis = {
        Physics: '⚡',
        Chemistry: '🧪',
        Biology: '🧬',
        'Environmental Science': '🌍',
        Engineering: '⚙️',
        Astronomy: '🌟',
        Technology: '💻',
        AI: '🤖'
    };

    return (
        <div className="learning-card">
            {/* Kart Başlığı */}
            <div className={`learning-card-header bg-gradient-to-r ${ageGroupColors[card.ageGroup]}`}>
                <div className="learning-card-badges">
                    <span className="category-badge">
                        {categoryEmojis[card.category]} {card.category}
                    </span>
                    <span className="age-badge">
                        👶 {card.ageGroup} yaş
                    </span>
                    <span className="level-badge">
                        📚 Seviye {card.level}
                    </span>
                </div>
                <h3 className="learning-card-title">{card.title}</h3>
                <div className="learning-card-duration">⏱️ {card.duration}</div>

                {/* Progress Indicator */}
                <ProgressIndicator
                    current={completed ? 1 : progress / 100}
                    total={1}
                    label="İlerleme"
                    color={completed ? 'success' : 'primary'}
                />
            </div>

            {/* Ana Görsel */}
            <div className="learning-card-image">
                <img src={card.imageUrl} alt={card.title} />
            </div>

            {/* İçerik veya Test */}
            <div className="learning-card-content">
                {currentView === 'content' ? (
                    <>
                        {/* Ana İçerik */}
                        <div className="learning-content">
                            <p className="content-text">{card.content}</p>
                        </div>

                        {/* Anahtar Kelimeler */}
                        <div className="keywords-section">
                            <h4 className="section-title">{t('learning.keywords')}</h4>
                            <div className="keywords-list">
                                {card.keyWords.map((keyword, index) => (
                                    <span key={index} className="keyword-tag">{keyword}</span>
                                ))}
                            </div>
                        </div>

                        {/* Eğlenceli Bilgiler */}
                        <div className="fun-facts-section">
                            <h4 className="section-title">{t('learning.facts')}</h4>
                            <ul className="fun-facts-list">
                                {card.funFacts.map((fact, index) => (
                                    <li key={index} className="fun-fact">{fact}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Şema varsa göster */}
                        {card.schemaUrl && (
                            <div className="schema-section">
                                <h4 className="section-title">{t('learning.schema')}</h4>
                                <img src={card.schemaUrl} alt="Şema" className="schema-image" />
                            </div>
                        )}

                        {/* Aksiyonlar */}
                        <div className="card-actions">
                            {card.quiz && card.quiz.length > 0 && (
                                <button
                                    onClick={() => setCurrentView('quiz')}
                                    className="action-button quiz-button"
                                >
                                    {t('learning.quiz')}
                                </button>
                            )}
                            <button
                                onClick={handleComplete}
                                className={`action-button ${completed ? 'feedback-success' : 'complete-button'} clickable`}
                                disabled={completed}
                            >
                                {completed ? '✅ Tamamlandı!' : t('learning.complete')}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Quiz Bölümü */}
                        {card.quiz && card.quiz[0] && (
                            <div className="quiz-section">
                                <h3 className="quiz-question">{card.quiz[0].question}</h3>
                                <div className="quiz-options">
                                    {card.quiz[0].options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => !quizAnswered && handleQuizAnswer(index)}
                                            className={`quiz-option ${selectedAnswer === index ? (index === card.quiz![0].correctAnswer ? 'correct' : 'incorrect') : ''} ${quizAnswered ? 'disabled' : ''}`}
                                            disabled={quizAnswered}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                {/* Açıklama */}
                                {showExplanation && (
                                    <div className={`quiz-explanation ${selectedAnswer === card.quiz[0].correctAnswer ? 'correct-explanation' : 'incorrect-explanation'}`}>
                                        <h4>{selectedAnswer === card.quiz[0].correctAnswer ? '🎉 Doğru!' : '😅 Yanlış!'}</h4>
                                        <p>{card.quiz[0].explanation}</p>
                                    </div>
                                )}

                                {/* Geri Dön Butonu */}
                                <button
                                    onClick={() => setCurrentView('content')}
                                    className="action-button back-button"
                                >
                                    {t('learning.back')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LearningCardComponent;

