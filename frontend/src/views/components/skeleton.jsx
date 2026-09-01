import React from 'react';

export const Skeleton = ({
  width,
  height = '1rem',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: width || '100%',
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
};
