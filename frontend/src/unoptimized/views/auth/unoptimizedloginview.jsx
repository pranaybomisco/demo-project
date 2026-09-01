import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../redux/slices/authslice.js';

/**
 * ⚠️ UNOPTIMIZED LOGIN VIEW
 * 1. Synchronous Render Blocking: Artificial CPU loop on every character typed into email/password.
 * 2. Unmemoized Inline Event Handlers and state cascades.
 */
export const UnoptimizedLoginView = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keystrokes, setKeystrokes] = useState(0);

  // ⚠️ In-render CPU work
  for (let i = 0; i < 80000; i++) {
    Math.sin(i);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div>
      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8125rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.35rem', fontWeight: 600 }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setKeystrokes((prev) => prev + 1);
            }}
            required
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
          <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.35rem', fontWeight: 600 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setKeystrokes((prev) => prev + 1);
            }}
            required
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

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{ marginTop: '0.5rem', width: '100%' }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
