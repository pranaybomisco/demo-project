import React, { useState } from 'react';
import { TaskCard } from './taskcard.jsx';
import { EmptyState } from '../components/emptystate.jsx';
import { LayoutGrid, List, Plus } from 'lucide-react';
import {
  TASK_STATUS,
  STATUS_LABELS,
  VIEW_MODES,
  UI_MESSAGES,
} from '../../constants/index.js';

export const TaskBoardView = ({
  tasks = [],
  onEditTask,
  onDeleteTask,
  onCreateTask,
}) => {
  const [viewMode, setViewMode] = useState(VIEW_MODES.BOARD);

  const columns = [
    { status: TASK_STATUS.TODO, title: STATUS_LABELS[TASK_STATUS.TODO], color: '#9ca3af' },
    { status: TASK_STATUS.IN_PROGRESS, title: STATUS_LABELS[TASK_STATUS.IN_PROGRESS], color: '#60a5fa' },
    { status: TASK_STATUS.DONE, title: STATUS_LABELS[TASK_STATUS.DONE], color: '#34d399' },
  ];

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={UI_MESSAGES.NO_TASKS}
        description="No tasks found matching your filters. Create a new task to get started."
        actionLabel={onCreateTask ? 'Create First Task' : null}
        onAction={onCreateTask ? () => onCreateTask() : null}
      />
    );
  }

  return (
    <div>
      {/* View Switcher Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            padding: '2px',
          }}
        >
          <button
            onClick={() => setViewMode(VIEW_MODES.BOARD)}
            className="btn-ghost"
            style={{
              padding: '0.375rem 0.625rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: viewMode === VIEW_MODES.BOARD ? 'var(--bg-tertiary)' : 'transparent',
              color: viewMode === VIEW_MODES.BOARD ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            <LayoutGrid size={14} />
            <span>Board</span>
          </button>
          <button
            onClick={() => setViewMode(VIEW_MODES.LIST)}
            className="btn-ghost"
            style={{
              padding: '0.375rem 0.625rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: viewMode === VIEW_MODES.LIST ? 'var(--bg-tertiary)' : 'transparent',
              color: viewMode === VIEW_MODES.LIST ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            <List size={14} />
            <span>List</span>
          </button>
        </div>
      </div>

      {viewMode === VIEW_MODES.BOARD ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start',
          }}
        >
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  minHeight: '400px',
                  backgroundColor: 'var(--bg-tertiary)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{col.title}</h3>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.1rem 0.45rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {colTasks.length}
                    </span>
                  </div>

                  {onCreateTask && (
                    <button
                      onClick={() => onCreateTask(col.status)}
                      className="btn-ghost"
                      style={{ padding: '0.25rem', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                      title={`Add task to ${col.title}`}
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}

                  {colTasks.length === 0 && (
                    <div
                      style={{
                        padding: '2rem 1rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.8125rem',
                        border: '1px dashed var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      No tasks in {col.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};
