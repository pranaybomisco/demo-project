import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../../../views/components/card.jsx';
import { AlertTriangle, User, Mail } from 'lucide-react';

/**
 * ⚠️ UNOPTIMIZED PROFILE VIEW
 * 1. Uncontrolled State Cascade: Re-renders the entire 400-line profile view tree on every character keystroke.
 * 2. In-render Synchronous Validation loops.
 */
export const UnoptimizedProfileView = () => {
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [keystrokes, setKeystrokes] = useState(0);

  // ⚠️ In-render CPU work
  for (let i = 0; i < 100000; i++) {
    Math.sin(i);
  }

  const handleNameChange = (e) => {
    setName(e.target.value);
    setKeystrokes((prev) => prev + 1);
  };

  return (
    <Card style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          color: 'var(--color-danger)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <AlertTriangle size={18} />
        <span>[UNOPTIMIZED PROFILE] Full-tree reconciliation on every letter typed (Total Keystroke Renders: {keystrokes})</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.35rem', fontWeight: 600 }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.35rem', fontWeight: 600 }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setKeystrokes((prev) => prev + 1);
            }}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>
    </Card>
  );
};
