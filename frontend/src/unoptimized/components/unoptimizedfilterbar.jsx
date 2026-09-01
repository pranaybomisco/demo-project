import React from 'react';
import { Search } from 'lucide-react';

/**
 * ⚠️ ANTI-PATTERN: Unoptimized FilterBar Component
 * 1. Immediate State Propagations (Zero Debounce): Immediately updates parent state on every keystroke.
 * 2. Inline Callback Allocations: Passes new inline functions on every render.
 * 3. Layout shifts and janky input typing responsiveness.
 */
export const UnoptimizedFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
}) => {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
          }}
        />
        <input
          type="text"
          placeholder="Non-debounced search input (causes heavy lag on 1000 items)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)} // ⚠️ Non-debounced input
          style={{
            width: '100%',
            padding: '0.55rem 0.75rem 0.55rem 2.25rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {onStatusChange && (
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
            padding: '0.55rem 0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Statuses</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      )}

      {onPriorityChange && (
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          style={{
            padding: '0.55rem 0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="">All Priorities</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
      )}
    </div>
  );
};
