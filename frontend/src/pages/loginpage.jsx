import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LoginView } from '../views/auth/loginview.jsx';
import { ThemeToggle } from '../views/components/themetoggle.jsx';
import { Layers } from 'lucide-react';
import { APP_ROUTES, UI_MESSAGES } from '../constants/index.js';

export const LoginPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const from = location.state?.from?.pathname || APP_ROUTES.DASHBOARD;

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backgroundColor: 'var(--bg-primary)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <ThemeToggle />
      </div>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '1rem',
            }}
          >
            <Layers size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{UI_MESSAGES.LOGIN_TITLE}</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {UI_MESSAGES.LOGIN_SUBTITLE}
          </p>
        </div>

        <LoginView />

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to={APP_ROUTES.REGISTER} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};
