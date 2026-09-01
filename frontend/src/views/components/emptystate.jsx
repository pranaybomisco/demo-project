import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './button.jsx';

export const EmptyState = ({
  icon = null,
  title,
  description,
  actionLabel = null,
  onAction = null,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-color)',
        backgroundColor: 'var(--bg-card)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          marginBottom: '1rem',
        }}
      >
        {icon || <FolderOpen size={28} />}
      </div>
      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p
        style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          maxWidth: '400px',
          marginBottom: actionLabel ? '1.5rem' : '0',
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
