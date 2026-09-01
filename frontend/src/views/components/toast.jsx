import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { TOAST_TYPES } from '../../constants/index.js';

export const Toast = ({
  id,
  type = TOAST_TYPES.INFO,
  title,
  message,
  onClose,
}) => {
  const getConfig = () => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return {
          icon: <CheckCircle2 size={20} style={{ color: 'var(--color-success)', flexShrink: 0 }} />,
          borderColor: 'rgba(16, 185, 129, 0.4)',
          bgColor: 'rgba(16, 185, 129, 0.1)',
          defaultTitle: 'Success',
        };
      case TOAST_TYPES.ERROR:
        return {
          icon: <AlertCircle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />,
          borderColor: 'rgba(239, 68, 68, 0.4)',
          bgColor: 'rgba(239, 68, 68, 0.1)',
          defaultTitle: 'Error',
        };
      case TOAST_TYPES.WARNING:
        return {
          icon: <AlertTriangle size={20} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />,
          borderColor: 'rgba(245, 158, 11, 0.4)',
          bgColor: 'rgba(245, 158, 11, 0.1)',
          defaultTitle: 'Warning',
        };
      default:
        return {
          icon: <Info size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />,
          borderColor: 'rgba(99, 102, 241, 0.4)',
          bgColor: 'rgba(99, 102, 241, 0.1)',
          defaultTitle: 'Info',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem',
        padding: '0.875rem 1.125rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: `4px solid ${config.borderColor.replace('0.4', '1')}`,
        borderTop: `1px solid ${config.borderColor}`,
        borderRight: `1px solid ${config.borderColor}`,
        borderBottom: `1px solid ${config.borderColor}`,
        boxShadow: 'var(--shadow-xl)',
        minWidth: '320px',
        maxWidth: '460px',
        animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div style={{ paddingTop: '2px' }}>{config.icon}</div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {title && (
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: '0.875rem', color: title ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.4, wordBreak: 'break-word' }}>
          {message}
        </div>
      </div>
      <button
        onClick={() => onClose(id)}
        className="btn-ghost"
        style={{
          padding: '0.25rem',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 'var(--radius-sm)',
          marginTop: '-2px',
          marginRight: '-4px',
        }}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
