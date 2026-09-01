import React from 'react';
import { UnoptimizedCard } from '../../components/unoptimizedcard.jsx';

/**
 * ⚠️ UNOPTIMIZED TASK BOARD VIEW
 * 1. 3x Full Array Scans per Render: Scans 1,000 tasks repeatedly inside the render phase to bucket into columns.
 * 2. Massive Column Heights: Renders hundreds of DOM cards per column simultaneously without virtualization.
 * 3. Heavy Layout Recalculation on Drag & Drop.
 */
export const UnoptimizedTaskBoardView = ({
  tasks = [],
  onEditTask,
}) => {
  // ⚠️ Anti-pattern: 3 separate full-array scans on every render without useMemo
  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  const columns = [
    { title: 'To Do', items: todoTasks, color: '#f59e0b' },
    { title: 'In Progress', items: inProgressTasks, color: '#38bdf8' },
    { title: 'Completed', items: doneTasks, color: '#10b981' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
      {columns.map((col) => (
        <div
          key={col.title}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            maxHeight: '800px',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
              {col.title}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {col.items.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {col.items.map((task) => (
              <UnoptimizedCard key={task.id} item={task} onSelect={onEditTask} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
