import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      emoji: '🎉',
      title: t('welcome.step1.title') || 'MiniLab\'a Hoş Geldin!',
      description: t('welcome.step1.desc') || 'Bilimi öğrenmek için en eğlenceli yerdesin! Birlikte keşfedelim.',
    },
    {
      emoji: '🎂',
      title: t('welcome.step2.title') || 'Kaç Yaşındasın?',
      description: t('welcome.step2.desc') || 'Yaş grubunu seçerek sana özel içerikler göreceğin!',
    },
    {
      emoji: '📚',
      title: t('welcome.step3.title') || 'Kategori Seç',
      description: t('welcome.step3.desc') || 'Fizik, Kimya, Astronomi... Hangisini öğrenmek istersin?',
    },
    {
      emoji: '🤖',
      title: t('welcome.step4.title') || 'MiniBot ile Tanış',
      description: t('welcome.step4.desc') || 'Aklına takılan her şeyi bana sorabilirsin! Ben senin bilim arkadaşınım.',
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setStep(step + 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #fff9e6 0%, #ffffff 100%)',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: '4px solid #FFD700',
          position: 'relative',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '50%',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          aria-label="Kapat"
        >
          ✕
        </button>

        {/* Content */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '80px',
              marginBottom: '20px',
              animation: 'bounce 1s ease infinite',
            }}
          >
            {currentStep.emoji}
          </div>

          <h2
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '16px',
              color: '#333',
            }}
          >
            {currentStep.title}
          </h2>

          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: '#666',
              marginBottom: '32px',
            }}
          >
            {currentStep.description}
          </p>

          {/* Progress dots */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            {steps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: index === step 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#ddd',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: '#f0f0f0',
                  color: '#666',
                  border: '2px solid #ddd',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e0e0e0';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                ← Geri
              </button>
            )}

            <button
              onClick={handleNext}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
            >
              {isLastStep ? '🚀 Başlayalım!' : 'Devam Et →'}
            </button>
          </div>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default WelcomeModal;
