import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../../redux/slices/authslice.js';
import { Input } from '../components/input.jsx';
import { Button } from '../components/button.jsx';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { BUTTON_LABELS, PLACEHOLDERS } from '../../constants/index.js';

export const LoginView = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      dispatch(loginUser(formData));
    }
  };

  const handleQuickLogin = (email) => {
    dispatch(loginUser({ email, password: 'Password123!' }));
  };

  return (
    <div>
      {/* Demo Credentials Quick Fill Bar */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
          <Sparkles size={14} /> Quick Demo Logins
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickLogin('admin@example.com')}
          >
            Admin
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickLogin('manager@example.com')}
          >
            Manager
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleQuickLogin('member@example.com')}
          >
            Member
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-danger)',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder={PLACEHOLDERS.EMAIL}
          value={formData.email}
          onChange={handleChange}
          leftIcon={<Mail size={16} />}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder={PLACEHOLDERS.PASSWORD}
          value={formData.password}
          onChange={handleChange}
          leftIcon={<Lock size={16} />}
          required
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          {BUTTON_LABELS.SIGN_IN}
        </Button>
      </form>
    </div>
  );
};
