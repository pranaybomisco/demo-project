import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * ⚠️ ANTI-PATTERN: Unoptimized Modal Component
 * 1. Event Listener Memory Leak: Attaches keydown listener to window on every render without proper cleanup.
 * 2. Uncontrolled Re-renders: Every keystroke in form fields causes the full modal backdrop & dialog to re-animate.
 * 3. Blocking synchronous execution on open.
 */
export const UnoptimizedModal = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      // ⚠️ Memory leak anti-pattern: Missing cleanup function
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') onClose();
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ⚠️ Synchronous work in modal render
  for (let i = 0; i < 50000; i++) {
    Math.sin(i);
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xl)',
          padding: '1.5rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.25rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
