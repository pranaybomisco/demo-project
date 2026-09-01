import React from 'react';

export const Card = ({
  children,
  hoverable = false,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <div
      className={`card ${hoverable ? 'card-hover' : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
