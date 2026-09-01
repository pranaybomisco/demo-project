import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/slices/authslice.js';

/**
 * ⚠️ UNOPTIMIZED REGISTER VIEW
 * 1. Artificial Render Blocking loop on form inputs.
 * 2. Uncontrolled state propagation across all fields.
 */
export const UnoptimizedRegisterView = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [keystrokes, setKeystrokes] = useState(0);

  // ⚠️ In-render CPU work
  for (let i = 0; i < 80000; i++) {
    Math.cos(i);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password, role }));
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
          <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.35rem', fontWeight: 600 }}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
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

        <div>
          <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '0.35rem', fontWeight: 600 }}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="MEMBER">Team Member</option>
            <option value="MANAGER">Project Manager</option>
            <option value="ADMIN">System Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
          style={{ marginTop: '0.5rem', width: '100%' }}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};
