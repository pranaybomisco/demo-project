import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, logoutUser, clearAuthError } from '../../redux/slices/authslice.js';
import { Card } from '../components/card.jsx';
import { Badge } from '../components/badge.jsx';
import { Button } from '../components/button.jsx';
import { Input } from '../components/input.jsx';
import {
  User,
  Mail,
  Lock,
  Shield,
  Calendar,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { BUTTON_LABELS, PLACEHOLDERS } from '../../constants/index.js';

export const ProfileView = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
    dispatch(clearAuthError());
  }, [user, dispatch]);

  if (!user) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccessMessage('');
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setLocalError('');

    if (showPasswordFields) {
      if (!formData.currentPassword) {
        setLocalError('Current password is required to change password.');
        return;
      }
      if (!formData.newPassword || formData.newPassword.length < 6) {
        setLocalError('New password must be at least 6 characters.');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setLocalError('New password and confirmation do not match.');
        return;
      }
    }

    const payload = {
      name: formData.name,
      email: formData.email,
    };

    if (showPasswordFields && formData.newPassword) {
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    const resultAction = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(resultAction)) {
      setSuccessMessage('Profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setShowPasswordFields(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Active';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Success Notification Banner */}
      {successMessage && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--color-success)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-success)',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            marginBottom: '1.5rem',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {(error || localError) && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontSize: '0.875rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{localError || error}</span>
        </div>
      )}

      {/* Profile Card */}
      <Card style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '2rem',
            paddingBottom: '1.75rem',
            borderBottom: '1px solid var(--border-color)',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '2rem',
              boxShadow: '0 4px 14px var(--accent-glow)',
              flexShrink: 0,
            }}
          >
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user.name}</h2>
              <Badge value={user.role} />
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {user.email}
            </p>
          </div>
        </div>

        {/* Read-Only Account Metadata Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              <Shield size={14} /> System Role
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{user.role}</div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              <Calendar size={14} /> Member Since
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{formatDate(user.createdAt)}</div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
              <Sparkles size={14} /> Status
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-success)' }}>
              Active Account
            </div>
          </div>
        </div>

        {/* Editable User Information Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Edit Profile Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="grid-2-col">
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
          </div>

          {/* Password Section Toggle */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowPasswordFields((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--accent-primary)',
                fontWeight: 600,
                padding: '0.4rem 0.6rem',
              }}
            >
              <KeyRound size={15} />
              <span>{showPasswordFields ? 'Hide Password Change' : 'Change Password'}</span>
            </button>
          </div>

          {/* Password Change Sub-Form */}
          {showPasswordFields && (
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                placeholder="Enter your current password"
                value={formData.currentPassword}
                onChange={handleChange}
                leftIcon={<Lock size={16} />}
                required={showPasswordFields}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2-col">
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  leftIcon={<Lock size={16} />}
                  required={showPasswordFields}
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  leftIcon={<Lock size={16} />}
                  required={showPasswordFields}
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <Button
              type="button"
              variant="danger"
              leftIcon={<LogOut size={16} />}
              onClick={() => dispatch(logoutUser())}
            >
              {BUTTON_LABELS.SIGN_OUT}
            </Button>

            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save size={16} />}
              isLoading={isLoading}
            >
              {BUTTON_LABELS.SAVE_CHANGES}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
