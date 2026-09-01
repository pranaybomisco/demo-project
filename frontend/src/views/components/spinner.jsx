import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 32, message = null, fullPage = false }) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '2rem',
      }}
    >
      <Loader2 size={size} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
      {message && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{message}</span>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          width: '100%',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};
