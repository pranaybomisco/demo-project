import React from 'react';
import { Card } from '../components/card.jsx';
import { Badge } from '../components/badge.jsx';
import { AlertCircle, Calendar } from 'lucide-react';
import { UI_MESSAGES } from '../../constants/index.js';

export const OverdueTasksWidget = ({ overdueTasks = [] }) => {
  return (
    <Card style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Attention: Overdue Tasks</h3>
      </div>

      {overdueTasks.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {UI_MESSAGES.NO_OVERDUE}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {overdueTasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{task.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {task.project?.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-danger)', fontSize: '0.75rem' }}>
                  <Calendar size={13} />
                  <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                <Badge value={task.priority} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
