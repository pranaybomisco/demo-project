import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/button.jsx';
import { HelpCircle } from 'lucide-react';
import { APP_ROUTES } from '../../constants/index.js';

export const NotFoundView = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-danger)',
          marginBottom: '1rem',
        }}
      >
        <HelpCircle size={32} />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to={APP_ROUTES.DASHBOARD}>
        <Button variant="primary">Return to Dashboard</Button>
      </Link>
    </div>
  );
};
