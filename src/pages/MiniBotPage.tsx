import React, { useState, useEffect, useRef } from 'react';
import { startChat } from '../services/geminiService';
import type { ChatSession } from '@google/generative-ai';
import { useI18n } from '../i18n';
import BackButton from '../components/BackButton';

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
    <div>
      <BackButton />
      <div className="flex flex-col h-[70vh] max-w-2xl mx-auto border-4 border-pastel-purple rounded-2xl shadow-lg">
        <div className="bg-pastel-purple p-4 text-white font-bold text-2xl text-center rounded-t-lg">
          {t('minibot.title')}
        </div>
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-pastel-blue text-white' : 'bg-white shadow'}`}>
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
          >
            {isLoading ? 'Wait...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MiniBotPage;