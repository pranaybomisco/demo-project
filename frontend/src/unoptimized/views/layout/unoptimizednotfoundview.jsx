import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, AlertTriangle } from 'lucide-react';
import { APP_ROUTES } from '../../../constants/index.js';

/**
 * ⚠️ UNOPTIMIZED 404 VIEW
 */
export const UnoptimizedNotFoundView = () => {
  // In-render work
  for (let i = 0; i < 50000; i++) {
    Math.sqrt(i);
  }

  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          color: 'var(--color-danger)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <AlertTriangle size={16} />
        <span>[UNOPTIMIZED 404 NOT FOUND]</span>
      </div>

      <div style={{ width: '64px', height: '64px', margin: '0 auto 1rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-danger)' }}>
        <HelpCircle size={32} />
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist.
      </p>

      <Link to={APP_ROUTES.DASHBOARD} className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};
