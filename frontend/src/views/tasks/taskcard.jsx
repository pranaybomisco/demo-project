import React from 'react';
import { Card } from '../components/card.jsx';
import { Badge } from '../components/badge.jsx';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';
import { TASK_STATUS } from '../../constants/index.js';

export const TaskCard = ({ task, onEdit, onDelete }) => {
  const isOverdue =
    task.status !== TASK_STATUS.DONE &&
    task.dueDate &&
    new Date(task.dueDate).getTime() < Date.now();

  return (
    <Card hoverable style={{ padding: '1rem', borderLeft: `3px solid var(--border-color)` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
          {task.title}
        </h4>
        <div style={{ display: 'flex', gap: '0.2rem', flexShrink: 0 }}>
          <button
            onClick={() => onEdit(task)}
            className="btn-ghost"
            style={{ padding: '0.25rem', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            title="Edit Task"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="btn-ghost"
            style={{ padding: '0.25rem', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {task.description && (
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.875rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {task.description}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Badge value={task.priority} />
          {task.status && <Badge value={task.status} />}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {task.assignee?.name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
              <User size={13} />
              <span>{task.assignee.name}</span>
            </div>
          )}

          {task.dueDate && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: isOverdue ? 'var(--color-danger)' : 'var(--text-muted)',
                fontWeight: isOverdue ? 700 : 400,
              }}
            >
              <Calendar size={13} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
