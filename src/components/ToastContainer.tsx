import React from 'react';
import type { Toast } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Bildirimler">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const handleClose = () => {
    onRemove(toast.id);
  };

  return (
    <div 
      className={`toast ${toast.type} show`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-content">
        {toast.emoji && (
          <span className="toast-emoji" aria-hidden="true">
            {toast.emoji}
          </span>
        )}
        <div className="toast-text">
          {toast.title && (
            <div className="toast-title">{toast.title}</div>
          )}
          <div className="toast-message">{toast.message}</div>
        </div>
      </div>
      <button 
        onClick={handleClose}
        className="toast-close"
        aria-label="Bildirimi kapat"
      >
        ✕
      </button>
    </div>
  );
};

export default ToastContainer;
