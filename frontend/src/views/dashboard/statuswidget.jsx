import React from 'react';
import { Card } from '../components/card.jsx';
import { TASK_STATUS, STATUS_LABELS } from '../../constants/index.js';

export const StatusWidget = ({ statusBreakdown }) => {
  const total = Object.values(statusBreakdown || {}).reduce((acc, curr) => acc + curr, 0) || 1;

  const items = [
    { key: TASK_STATUS.TODO, label: STATUS_LABELS[TASK_STATUS.TODO], color: '#9ca3af', count: statusBreakdown?.[TASK_STATUS.TODO] || 0 },
    { key: TASK_STATUS.IN_PROGRESS, label: STATUS_LABELS[TASK_STATUS.IN_PROGRESS], color: '#60a5fa', count: statusBreakdown?.[TASK_STATUS.IN_PROGRESS] || 0 },
    { key: TASK_STATUS.DONE, label: STATUS_LABELS[TASK_STATUS.DONE], color: '#34d399', count: statusBreakdown?.[TASK_STATUS.DONE] || 0 },
  ];

  return (
    <Card style={{ padding: '1.5rem', height: '100%' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        Task Status Distribution
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {items.map((item) => {
          const pct = Math.round((item.count / total) * 100);
          return (
            <div key={item.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                <span style={{ fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {item.count} ({pct}%)
                </span>
              </div>
              <div
                style={{
                  height: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${pct}%`,
                    backgroundColor: item.color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
