import React from 'react';
import { Card } from '../components/card.jsx';
import { TASK_PRIORITY, PRIORITY_LABELS } from '../../constants/index.js';

export const PriorityWidget = ({ priorityBreakdown }) => {
  const items = [
    { key: TASK_PRIORITY.LOW, label: PRIORITY_LABELS[TASK_PRIORITY.LOW], color: '#6b7280', count: priorityBreakdown?.[TASK_PRIORITY.LOW] || 0 },
    { key: TASK_PRIORITY.MEDIUM, label: PRIORITY_LABELS[TASK_PRIORITY.MEDIUM], color: '#38bdf8', count: priorityBreakdown?.[TASK_PRIORITY.MEDIUM] || 0 },
    { key: TASK_PRIORITY.HIGH, label: PRIORITY_LABELS[TASK_PRIORITY.HIGH], color: '#fb923c', count: priorityBreakdown?.[TASK_PRIORITY.HIGH] || 0 },
    { key: TASK_PRIORITY.CRITICAL, label: PRIORITY_LABELS[TASK_PRIORITY.CRITICAL], color: '#f87171', count: priorityBreakdown?.[TASK_PRIORITY.CRITICAL] || 0 },
  ];

  return (
    <Card style={{ padding: '1.5rem', height: '100%' }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem' }}>
        Priority Breakdown
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {items.map((item) => (
          <div
            key={item.key}
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                }}
              />
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {item.label}
              </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{item.count}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};
