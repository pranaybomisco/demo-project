import React from 'react';
import { STATUS_LABELS, PRIORITY_LABELS, ROLE_LABELS } from '../../constants/index.js';

export const Badge = ({ value = '', className = '' }) => {
  const formattedText =
    STATUS_LABELS[value] ||
    PRIORITY_LABELS[value] ||
    ROLE_LABELS[value] ||
    value.replace(/_/g, ' ');

  const badgeClass = `badge badge-${value.toLowerCase()} ${className}`;

  return <span className={badgeClass}>{formattedText}</span>;
};
