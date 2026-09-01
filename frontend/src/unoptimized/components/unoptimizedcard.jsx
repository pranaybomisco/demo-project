import React from 'react';
import { Badge } from '../../views/components/badge.jsx';
import { User, Calendar, CheckSquare, Users } from 'lucide-react';

/**
 * ⚠️ ANTI-PATTERN: Unoptimized Card Component
 * 1. Expensive In-Render Formatting: Formats dates and runs expensive regex transformations on every render cycle.
 * 2. Unstable Inline Style Objects & Callbacks: Breaks shallow comparison props in React.memo.
 * 3. Deep Object Cloning in Props: Recreates new object references on every render.
 */
export const UnoptimizedCard = ({
  item,
  onSelect,
  type = 'task',
}) => {
  // ⚠️ Synchronous in-render blocking work on each card
  for (let i = 0; i < 5000; i++) {
    Math.sqrt(i);
  }

  const formatUnoptimizedDate = (dateStr) => {
    if (!dateStr) return '—';
    // Repeated Date instance creation on every frame
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={() => onSelect && onSelect(item)} // Inline callback creation
      style={{
        padding: '1.25rem',
        borderRadius: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'transform 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
          {item.title || item.name}
        </h4>
        {item.status && <Badge value={item.status} />}
      </div>

      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: 1.4,
        }}
      >
        {item.description || 'No description provided.'}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '0.75rem',
          marginTop: 'auto',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <User size={13} />
          <span>{item.assignee?.name || item.owner?.name || 'Unassigned'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} />
          <span>{formatUnoptimizedDate(item.dueDate || item.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
