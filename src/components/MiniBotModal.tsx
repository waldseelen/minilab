import type { ChatSession } from '@google/generative-ai';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { startChat } from '../services/geminiService';

type Message = { text: string; sender: 'user' | 'bot' };

const MiniBotModal = () => {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: 'Merhaba! Ben MiniBot! 🤖 Bilimle eğlenceye hazır mısın? Bugün neye merak ettin? ✨', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatSession = useRef<ChatSession | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const open = () => { setIsClosing(false); setIsOpen(true); };
        window.addEventListener('minibot:open', open);
        return () => window.removeEventListener('minibot:open', open);
    }, []);

    useEffect(() => {
        if (isOpen && !chatSession.current) {
            chatSession.current = startChat();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !chatSession.current) return;
        const userMessage: Message = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const result = await chatSession.current.sendMessage(userMessage.text);
            const botMessage: Message = { text: result.response.text(), sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        } catch (e) {
            setMessages((prev) => [...prev, { text: 'Bir şeyler ters gitti, tekrar dener misin? 😵', sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen && !isClosing) return null;

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpen(false);
        }, 220);
    };

    return (
        <div className={`chat-popup ${isOpen ? 'open' : ''} ${isClosing ? 'closing' : ''}`} role="dialog" aria-label="MiniBot">
            <div className="chat-popup-panel">
                <div className="chat-popup-header">
                    <span>MiniBot 🤖</span>
                    <button onClick={handleClose} className="btn" aria-label="Kapat">✖</button>
                </div>
                <div className="chat-popup-body">
                    {messages.map((msg, i) => (
                        <div key={i} className={`message ${msg.sender}`}>
                            <div className="message-bubble">{msg.text}</div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message bot"><div className="message-bubble">… düşünüyorum 🤖</div></div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-popup-footer">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('minibot.placeholder')}
                        aria-label="Mesaj yaz"
                    />
                    <button onClick={handleSend} disabled={isLoading}>{isLoading ? '...' : 'Gönder'}</button>
                </div>
            </div>
        </div>
    );
};

export default MiniBotModal;


