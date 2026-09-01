import React from 'react';
import { Card } from '../components/card.jsx';
import { Badge } from '../components/badge.jsx';
import { Clock, User } from 'lucide-react';
import { UI_MESSAGES } from '../../constants/index.js';

export const RecentTasksWidget = ({ recentTasks = [] }) => {
  return (
    <Card style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Recent Task Activity</h3>
      </div>

      {recentTasks.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {UI_MESSAGES.NO_ACTIVITY}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentTasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>{task.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {task.project?.name}
                  </span>
                  {task.assignee?.name && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <User size={12} /> {task.assignee.name}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge value={task.status} />
                <Badge value={task.priority} />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
