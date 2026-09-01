import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../../redux/slices/authslice.js';
import { Input } from '../components/input.jsx';
import { Select } from '../components/select.jsx';
import { Button } from '../components/button.jsx';
import { Mail, Lock, User } from 'lucide-react';
import { BUTTON_LABELS, PLACEHOLDERS, ROLES, ROLE_LABELS } from '../../constants/index.js';

export const RegisterView = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.MEMBER,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      dispatch(registerUser(formData));
    }
  };

  const roleOptions = [
    { value: ROLES.MEMBER, label: ROLE_LABELS[ROLES.MEMBER] },
    { value: ROLES.MANAGER, label: ROLE_LABELS[ROLES.MANAGER] },
    { value: ROLES.ADMIN, label: ROLE_LABELS[ROLES.ADMIN] },
  ];

  return (
    <div>
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
          label="Full Name"
          name="name"
          type="text"
          placeholder={PLACEHOLDERS.FULL_NAME}
          value={formData.name}
          onChange={handleChange}
          leftIcon={<User size={16} />}
          required
        />

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

        <Select
          label="System Role"
          name="role"
          options={roleOptions}
          value={formData.role}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          {BUTTON_LABELS.CREATE_ACCOUNT}
        </Button>
      </form>
    </div>
  );
};
