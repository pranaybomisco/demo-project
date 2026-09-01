import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast } from '../../views/components/toast.jsx';
import { TOAST_TYPES } from '../../constants/index.js';

const ToastContext = createContext(null);

let globalToastHandler = null;

/**
 * Global toast dispatcher for use outside React components (e.g., in Axios interceptors)
 */
export const toast = {
  success: (message, title = 'Success', duration = 4000) => {
    globalToastHandler?.(message, TOAST_TYPES.SUCCESS, title, duration);
  },
  error: (message, title = 'Error', duration = 5000) => {
    globalToastHandler?.(message, TOAST_TYPES.ERROR, title, duration);
  },
  warning: (message, title = 'Warning', duration = 4500) => {
    globalToastHandler?.(message, TOAST_TYPES.WARNING, title, duration);
  },
  info: (message, title = 'Info', duration = 4000) => {
    globalToastHandler?.(message, TOAST_TYPES.INFO, title, duration);
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = TOAST_TYPES.INFO, title = null, duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type, title }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    globalToastHandler = showToast;
    return () => {
      globalToastHandler = null;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          zIndex: 99999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <Toast
              id={t.id}
              type={t.type}
              title={t.title}
              message={t.message}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
