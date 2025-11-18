import type { ChatSession } from '@google/generative-ai';
import React, { useEffect, useRef, useState } from 'react';
import BackButton from '../components/BackButton';
import HelpBubble from '../components/HelpBubble';
import InstructionCard from '../components/InstructionCard';
import { useI18n } from '../i18n';
import { isGeminiConfigured, startChat } from '../services/geminiService';

interface Message {
    text: string;
    sender: 'user' | 'bot';
}

const MiniBotPage: React.FC = () => {
    const { t } = useI18n();
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Merhaba! Ben MiniBot! 🤖 Bilimle eğlenceye hazır mısın? Bugün neye merak ettin? ✨', sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatSession = useRef<ChatSession | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatSession.current = startChat();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading || !chatSession.current) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatSession.current.sendMessage(input);
            const botMessage: Message = { text: result.response.text(), sender: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage: Message = { text: "Oops! Something went wrong. Please try again. 😵", sender: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <BackButton />

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <InstructionCard
                    title="MiniBot ile Nasıl Konuşulur? 🤖"
                    emoji="💬"
                    steps={[
                        'Aklına gelen bilim sorusunu yazabilirsin! (Örnek: "Güneş neden parlar?")',
                        'Enter tuşuna bas veya "Gönder" butonuna tıkla',
                        'MiniBot sana basit ve eğlenceli bir cevap verecek!',
                        'Daha çok soru sorabilirsin, sohbet devam eder! 🌟',
                    ]}
                />
            </div>

            {!isGeminiConfigured && (
                <div className="max-w-2xl mx-auto mb-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg" role="alert">
                    <p className="font-bold text-yellow-800">⚠️ Demo Modu</p>
                    <p className="text-sm text-yellow-700">
                        Gemini API yapılandırılmamış. MiniBot şu anda demo cevaplar veriyor.
                        Gerçek AI deneyimi için <code className="bg-yellow-200 px-1 rounded">.env.local</code> dosyasına{' '}
                        <code className="bg-yellow-200 px-1 rounded">VITE_GEMINI_API_KEY</code> ekleyin.
                    </p>
                </div>
            )}

            <div className="flex flex-col h-[70vh] max-w-2xl mx-auto border-4 border-pastel-purple rounded-2xl shadow-lg" style={{ marginTop: '20px' }}>
                <div className="bg-pastel-purple p-4 text-white font-bold text-2xl text-center rounded-t-lg" style={{
                    background: 'linear-gradient(135deg, #C5A3FF 0%, #A78BFA 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                }}>
                    {t('minibot.title')}
                    <HelpBubble
                        message={t('help.minibot')}
                        icon="💬"
                        position="bottom"
                    />
                </div>
                <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`} style={{ animation: 'slideIn 0.3s ease-out' }}>
                            <div
                                className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-pastel-blue text-white' : 'bg-white shadow'}`}
                                style={{
                                    background: msg.sender === 'user'
                                        ? 'linear-gradient(135deg, #A7C7E7 0%, #89A7C7 100%)'
                                        : 'white',
                                    boxShadow: msg.sender === 'bot' ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
                                    border: msg.sender === 'bot' ? '2px solid #E0E0E0' : 'none',
                                }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start mb-4">
                            <div className="p-3 rounded-lg bg-white shadow">
                                ... thinking 🤖
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t-2 border-pastel-purple bg-white rounded-b-lg">
                    <div className="flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('minibot.placeholder')}
                            className="flex-grow p-2 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:border-pastel-blue"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-pastel-green text-white font-bold p-2 rounded-r-lg hover:bg-pastel-pink transition-colors disabled:bg-gray-400"
                            disabled={isLoading}
                            style={{
                                background: isLoading
                                    ? '#ccc'
                                    : 'linear-gradient(135deg, #B4E197 0%, #8BC34A 100%)',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                minWidth: '80px',
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #FFB6D9 0%, #FF80AB 100%)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #B4E197 0%, #8BC34A 100%)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }
                            }}
                        >
                            {isLoading ? '⏳ Bekle...' : '🚀 Gönder'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
        </div >
    );
};

export default MiniBotPage;
