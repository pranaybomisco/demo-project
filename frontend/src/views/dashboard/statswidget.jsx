import React from 'react';
import { Card } from '../components/card.jsx';
import { FolderKanban, CheckSquare, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const StatsWidget = ({ overview }) => {
  const stats = [
    {
      title: 'Total Projects',
      value: overview?.totalProjects || 0,
      icon: <FolderKanban size={22} style={{ color: '#6366f1' }} />,
      color: 'rgba(99, 102, 241, 0.1)',
    },
    {
      title: 'Total Tasks',
      value: overview?.totalTasks || 0,
      icon: <CheckSquare size={22} style={{ color: '#38bdf8' }} />,
      color: 'rgba(56, 189, 248, 0.1)',
    },
    {
      title: 'Completed',
      value: overview?.completedTasks || 0,
      icon: <CheckCircle2 size={22} style={{ color: '#34d399' }} />,
      color: 'rgba(52, 211, 153, 0.1)',
    },
    {
      title: 'Pending',
      value: overview?.pendingTasks || 0,
      icon: <Clock size={22} style={{ color: '#fbbf24' }} />,
      color: 'rgba(251, 191, 36, 0.1)',
    },
    {
      title: 'Overdue Items',
      value: overview?.overdueTasksCount || 0,
      icon: <AlertTriangle size={22} style={{ color: '#f87171' }} />,
      color: 'rgba(248, 113, 113, 0.1)',
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      {stats.map((s, idx) => (
        <Card key={idx} style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {s.title}
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
                {s.value}
              </div>
            </div>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {s.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
