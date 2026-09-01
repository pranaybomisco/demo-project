import React, { useState, useRef, useLayoutEffect } from 'react';
import { Badge } from '../../views/components/badge.jsx';
import { User, Calendar, AlertTriangle } from 'lucide-react';

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
  const [renderDuration, setRenderDuration] = useState('0.0');

  const startPerfTimeRef = useRef(performance.now());
  startPerfTimeRef.current = performance.now();

  // Heavy synchronous calculation running directly in the render phase on every keystroke
  const computeHeavyData = () => {
    let result = [...data];

    // Real CPU-intensive fuzzy distance & checksum processing across all items
    for (let i = 0; i < result.length; i++) {
      const itemStr = (result[i].title || result[i].name || '') + (result[i].description || '');
      let hash = 0;
      for (let j = 0; j < itemStr.length; j++) {
        hash = (hash * 31 + itemStr.charCodeAt(j)) & 0xffffffff;
      }

      // Levenshtein fuzzy distance computation against search term
      const target = searchTerm || 'task';
      for (let m = 0; m < target.length; m++) {
        for (let n = 0; n < Math.min(itemStr.length, 50); n++) {
          hash = (hash + (target.charCodeAt(m) ^ itemStr.charCodeAt(n))) & 0xffffffff;
        }
      }

      // Artificial work loop to guarantee measurable main-thread blocking (50ms - 200ms)
      for (let k = 0; k < 600; k++) {
        hash = ((hash ^ (k * 13)) + (k & 0x7f)) & 0xffffffff;
      }

      result[i] = { ...result[i], _calcHash: hash };
    }

    if (searchTerm) {
      result = result.filter((item) =>
        (item.title || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'ALL') {
      result = result.filter((item) => item.status === filterStatus);
    }

    result.sort((a, b) => {
      const valA = (a[sortField] || '').toString();
      const valB = (b[sortField] || '').toString();
      return valA.localeCompare(valB);
    });

    return result;
  };

  const processedList = computeHeavyData();

  useLayoutEffect(() => {
    const elapsed = (performance.now() - startPerfTimeRef.current).toFixed(1);
    setRenderDuration(elapsed);
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
      {/* Performance Warning Banner with Real-Time Timing */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1rem',
          color: 'var(--color-danger)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>[UNOPTIMIZED VIEW] In-render blocking loop on {processedList.length} DOM rows</span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--color-danger)',
          }}
        >
          Render Time: {renderDuration} ms
        </span>
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
