import React, { useState, useRef, useLayoutEffect } from 'react';
import { Badge } from '../../views/components/badge.jsx';
import { User, Calendar } from 'lucide-react';

/**
 * ⚠️ ANTI-PATTERN DEMO: Unoptimized Table
 * 1. Monolithic In-Memory Rendering: Renders all items (up to 1,000+) into the DOM simultaneously without virtualization or pagination.
 * 2. Unmemoized Heavy Synchronous Calculations: Runs fuzzy matching, Levenshtein distance, and deep transformations on 1,000 items in render.
 * 3. Non-Debounced Input: Every keypress triggers full 1,000-row DOM reconciliation and CPU recalculation.
 */
export const UnoptimizedTable = ({ data = [], title = 'Tasks' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortField, setSortField] = useState('title');

  // Heavy synchronous calculation running directly in the render phase on every keystroke
  const processedList = [...data]
    .filter((item) => {
      // Intentional CPU waste: complex nested string operations repeated on every render
      let match = true;
      if (searchTerm) {
        let dummy = 0;
        for (let i = 0; i < 60000; i++) {
          dummy = ((dummy ^ (i * 31)) + (i & 0xff)) & 0xffffffff;
        }
        match = (item.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (item.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      }
      if (filterStatus !== 'ALL') {
        match = match && item.status === filterStatus;
      }
      return match;
    })
    .sort((a, b) => {
      // Unmemoized inline comparator
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      return valA > valB ? 1 : -1;
    });

  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(239, 68, 68, 0.04)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
      }}
    >
      {/* Clean Unoptimized Warning Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem',
          color: 'var(--color-danger)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <span>⚠️ [UNOPTIMIZED DEMO] Rendering {processedList.length} un-virtualized DOM rows with in-render blocking calculations. (See live metrics on top-right HUD)</span>
      </div>

      {/* Non-Debounced Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Type to search (no debounce - triggers blocking re-render on every letter)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          style={{
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="title">Sort by Title</option>
          <option value="status">Sort by Status</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      {/* Massive un-virtualized DOM Table with 1,000+ rows */}
      <div style={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-tertiary)', zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem' }}>#</th>
              <th style={{ padding: '0.75rem 1rem' }}>Title</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
              <th style={{ padding: '0.75rem 1rem' }}>Assignee</th>
              <th style={{ padding: '0.75rem 1rem' }}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {processedList.map((item, index) => (
              <tr
                key={item.id || index}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: index % 2 === 0 ? 'transparent' : 'var(--surface-subtle)',
                }}
              >
                <td style={{ padding: '0.625rem 1rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                <td style={{ padding: '0.625rem 1rem', fontWeight: 600 }}>{item.title || item.name}</td>
                <td style={{ padding: '0.625rem 1rem' }}>
                  <Badge value={item.status || 'TODO'} />
                </td>
                <td style={{ padding: '0.625rem 1rem' }}>
                  <Badge value={item.priority || 'MEDIUM'} />
                </td>
                <td style={{ padding: '0.625rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>{item.assignee?.name || item.owner?.name || 'Unassigned'}</span>
                  </div>
                </td>
                <td style={{ padding: '0.625rem 1rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '—'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
