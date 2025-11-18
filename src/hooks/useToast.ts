import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  emoji?: string;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 4000, // default 4 seconds
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, newToast.duration);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'success',
      message,
      emoji: '🎉',
      ...options
    });
  }, [addToast]);

  const error = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'error',
      message,
      emoji: '😅',
      ...options
    });
  }, [addToast]);

  const info = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'info',
      message,
      emoji: 'ℹ️',
      ...options
    });
  }, [addToast]);

  const warning = useCallback((message: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'warning',
      message,
      emoji: '⚠️',
      ...options
    });
  }, [addToast]);

  // Çocuk dostu özel mesajlar
  const celebrate = useCallback((message: string = 'Harika! Başardın! 🌟') => {
    return success(message, { 
      emoji: '🎊',
      title: 'Tebrikler!',
      duration: 5000 
    });
  }, [success]);

  const encourage = useCallback((message: string = 'Devam et! Sen yapabilirsin! 💪') => {
    return info(message, { 
      emoji: '🚀',
      title: 'Motivasyon!',
      duration: 4000 
    });
  }, [info]);

  const remind = useCallback((message: string = 'Unutma! 🤔') => {
    return warning(message, { 
      emoji: '💡',
      title: 'Hatırlatma',
      duration: 6000 
    });
  }, [warning]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    celebrate,
    encourage,
    remind
  };
};
