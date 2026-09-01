import React from 'react';
import { Badge } from '../../../views/components/badge.jsx';
import { User, Calendar, Edit2, Trash2 } from 'lucide-react';

/**
 * ⚠️ UNOPTIMIZED TASK TABLE VIEW
 * 1. 1,000 Concurrent DOM Rows: Mounts all task elements simultaneously into DOM.
 * 2. In-Cell Computations: Date formatting, overdue check, and regex transformations running synchronously on 1,000 cells.
 * 3. Inline Callbacks: Reallocates onClick handlers on all 1,000 rows.
 */
export const UnoptimizedTaskTableView = ({
  tasks = [],
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem 1rem' }}>Task Title</th>
            <th style={{ padding: '0.75rem 1rem' }}>Project</th>
            <th style={{ padding: '0.75rem 1rem' }}>Status</th>
            <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
            <th style={{ padding: '0.75rem 1rem' }}>Assignee</th>
            <th style={{ padding: '0.75rem 1rem' }}>Due Date</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => {
            // In-render calculation for every row
            const isOverdue = task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();
            const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—';

            return (
              <tr
                key={task.id || idx}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: isOverdue ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                }}
              >
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{task.title}</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                  {task.project?.name || '—'}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Badge value={task.status} />
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Badge value={task.priority} />
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} style={{ color: 'var(--text-muted)' }} />
                    <span>{task.assignee?.name || 'Unassigned'}</span>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: isOverdue ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} />
                    <span>{formattedDate}</span>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                    <button
                      type="button"
                      onClick={() => onEditTask && onEditTask(task)} // Inline function creation per row
                      style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTask && onDeleteTask(task)} // Inline function creation per row
                      style={{ padding: '0.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
