import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  leftIcon,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: '0.75rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`form-input ${className}`}
          style={{
            paddingLeft: leftIcon ? '2.25rem' : '0.875rem',
            borderColor: error ? 'var(--color-danger)' : undefined,
          }}
          aria-invalid={!!error}
          {...props}
        />
      </div>
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helperText}</span>}
    </div>
  );
};
