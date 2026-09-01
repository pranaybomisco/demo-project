import React from 'react';

export const Textarea = ({
  label,
  error,
  helperText,
  id,
  rows = 3,
  className = '',
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={textareaId} className="form-label">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`form-textarea ${className}`}
        style={{
          borderColor: error ? 'var(--color-danger)' : undefined,
          resize: 'vertical',
        }}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{helperText}</span>}
    </div>
  );
};
