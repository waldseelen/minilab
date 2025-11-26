
import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";
import { useI18n } from '../i18n';

const MiniBotPage: React.FC = () => {
  const { t, language } = useI18n();
  
  const ANIMATION_OPTIONS = [
    { id: 'bounce', label: 'Bounce 🦘', className: 'animate-bounce-in' },
    { id: 'fade', label: 'Float 🍃', className: 'animate-fade-in-up' },
    { id: 'pop', label: 'Pop ✨', className: 'animate-pop-in' },
  ];

  const STYLE_OPTIONS = [
    { id: 'default', labelKey: 'minibot.style.default', hat: '', color: 'bg-pastel-purple', borderColor: 'border-pastel-purple' },
    { id: 'smart', labelKey: 'minibot.style.smart', hat: '🎓', color: 'bg-blue-200', borderColor: 'border-blue-300' },
    { id: 'fancy', labelKey: 'minibot.style.fancy', hat: '🎩', color: 'bg-gray-200', borderColor: 'border-gray-400' },
    { id: 'worker', labelKey: 'minibot.style.worker', hat: '⛑️', color: 'bg-orange-200', borderColor: 'border-orange-300' },
    { id: 'royal', labelKey: 'minibot.style.royal', hat: '👑', color: 'bg-yellow-200', borderColor: 'border-yellow-400' },
  ];

  const EYE_OPTIONS = [
    { id: 'normal', labelKey: 'minibot.eyes.normal' },
    { id: 'big', labelKey: 'minibot.eyes.big' },
    { id: 'sparkling', labelKey: 'minibot.eyes.sparkling' },
    { id: 'curious', labelKey: 'minibot.eyes.curious' },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnimation, setSelectedAnimation] = useState(ANIMATION_OPTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0]);
  const [selectedEye, setSelectedEye] = useState(EYE_OPTIONS[0]);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when language changes
  useEffect(() => {
    setMessages([
      {
        id: 'intro',
        text: t('minibot.intro'),
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    try {
      chatSessionRef.current = createChatSession(language);
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, [language, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (!chatSessionRef.current) {
        chatSessionRef.current = createChatSession(language);
      }
      
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ 
        message: userText 
      });
      
      const botText = response.text || (language === 'tr' ? "Hmm, bir şeyler karıştı. Tekrar dener misin? 🤔" : "Hmm, something got mixed up. Try again? 🤔");

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: language === 'tr' ? "Üzgünüm, bağlantıda bir sorun oldu. Biraz bekleyip tekrar deneyelim mi? 🔌" : "Sorry, connection issue. Let's wait a bit and try again? 🔌",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const renderAvatarEyes = () => {
    switch (selectedEye.id) {
      case 'big':
        return (
          <>
            <div className="w-3 md:w-4 h-3 md:h-4 bg-slate-800 rounded-full relative">
              <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
            </div>
            <div className="w-3 md:w-4 h-3 md:h-4 bg-slate-800 rounded-full relative">
              <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
            </div>
          </>
        );
      case 'sparkling':
        return (
          <>
            <span className="text-lg md:text-xl animate-pulse">✨</span>
            <span className="text-lg md:text-xl animate-pulse">✨</span>
          </>
        );
      case 'curious':
        return (
          <>
            <div className="w-3 md:w-4 h-3 md:h-4 bg-slate-800 rounded-full ring-2 ring-white inset-0"></div>
            <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-slate-800 rounded-full"></div>
          </>
        );
      case 'normal':
      default:
        return (
          <>
            <div className="w-2.5 md:w-3 h-2.5 md:h-3 bg-slate-800 rounded-full"></div>
            <div className="w-2.5 md:w-3 h-2.5 md:h-3 bg-slate-800 rounded-full"></div>
          </>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className={`bg-white rounded-t-3xl shadow-lg border-4 ${selectedStyle.borderColor} p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300`}>
        <div className="flex items-center gap-4 self-start sm:self-center">
           {/* Custom Constructed Robot Avatar */}
           <div className={`w-16 h-16 md:w-20 md:h-20 ${selectedStyle.color} rounded-2xl border-4 ${selectedStyle.borderColor} flex flex-col items-center justify-center relative shadow-md transition-all duration-300`}>
              {/* Antenna */}
              <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-400 rounded-full`}></div>
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse shadow-sm ring-1 ring-red-200`}></div>
              
              {/* Face Container */}
              <div className="flex flex-col items-center justify-center mt-1">
                 <div className="flex gap-2 mb-1.5 items-center justify-center min-h-[1rem]">
                   {renderAvatarEyes()}
                 </div>
                 {/* Mouth */}
                 <div className="w-5 md:w-8 h-1.5 bg-slate-700/70 rounded-full"></div>
              </div>

              {/* Hat */}
              {selectedStyle.hat && (
                <span className="absolute -top-5 -right-4 text-3xl md:text-4xl filter drop-shadow-md animate-bounce-in origin-bottom-left z-20">
                  {selectedStyle.hat}
                </span>
              )}
           </div>

          <div>
            <h1 className="font-comic font-bold text-xl text-gray-800">{t('minibot.title')}</h1>
            <p className="text-sm text-gray-500">{t('minibot.subtitle')}</p>
          </div>
        </div>

        {/* Controls: Animation, Eye & Style */}
        <div className="flex flex-col items-end gap-2 self-end sm:self-center w-full sm:w-auto">
          {/* Animation Selector */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-200 w-full sm:w-auto justify-end">
            <span className="text-[10px] font-bold text-gray-400 px-2 hidden sm:inline">{t('minibot.anim')}</span>
            {ANIMATION_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedAnimation(option)}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all duration-300 flex items-center gap-1 ${
                  selectedAnimation.id === option.id
                    ? 'bg-pastel-purple text-white shadow-sm scale-105'
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Eye Selector */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-200 w-full sm:w-auto justify-end">
            <span className="text-[10px] font-bold text-gray-400 px-2 hidden sm:inline">{t('minibot.eyes')}</span>
            {EYE_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedEye(option)}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all duration-300 flex items-center gap-1 ${
                  selectedEye.id === option.id
                    ? 'bg-blue-400 text-white shadow-sm scale-105'
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                {t(option.labelKey)}
              </button>
            ))}
          </div>

          {/* Style Selector */}
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-200 w-full sm:w-auto justify-end">
             <span className="text-[10px] font-bold text-gray-400 px-2 hidden sm:inline">{t('minibot.style')}</span>
             {STYLE_OPTIONS.map((style) => (
               <button
                 key={style.id}
                 onClick={() => setSelectedStyle(style)}
                 className={`w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
                   selectedStyle.id === style.id
                     ? `ring-2 ring-offset-1 ring-pastel-purple scale-110 shadow-md`
                     : 'opacity-60 hover:opacity-100 hover:scale-105'
                 } ${style.color}`}
                 title={t(style.labelKey)}
               >
                 <span className="text-[10px]">{style.hat || '🤖'}</span>
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className={`flex-grow bg-white border-l-4 border-r-4 ${selectedStyle.borderColor} overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-pastel-purple transition-colors duration-300`}>
        {messages.map((msg) => (
          <div
            key={msg.id === 'intro' ? `intro-${selectedAnimation.id}` : msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-md text-lg leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-pastel-blue text-blue-900 rounded-tr-none'
                  : 'bg-gray-100 text-gray-800 rounded-tl-none border-2 border-gray-200'
              } ${
                msg.id === 'intro' 
                  ? `${selectedAnimation.className} ${selectedStyle.borderColor} ring-4 ring-pastel-purple/20` 
                  : ''
              }`}
              style={msg.id === 'intro' ? { borderColor: 'inherit' } : {}}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none border-2 border-gray-200 flex gap-2 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`bg-white p-4 rounded-b-3xl border-4 border-t-0 ${selectedStyle.borderColor} shadow-lg transition-colors duration-300`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t('minibot.input')}
            className={`flex-grow p-4 rounded-xl border-2 border-gray-200 focus:border-pastel-purple focus:outline-none text-lg bg-gray-50 transition-colors`}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-pastel-green hover:bg-green-300 text-green-900 font-bold py-3 px-6 rounded-xl shadow-md transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl"
          >
            🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniBotPage;
