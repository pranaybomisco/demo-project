import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardMetrics } from '../../../redux/slices/dashboardslice.js';
import { Card } from '../../../views/components/card.jsx';
import { AlertTriangle } from 'lucide-react';
import { Spinner } from '../../../views/components/spinner.jsx';

/**
 * ⚠️ UNOPTIMIZED DASHBOARD VIEW
 */
export const UnoptimizedDashboardView = () => {
  const dispatch = useDispatch();
  const { metrics, isLoading } = useSelector((state) => state.dashboard);
  const [renderCount, setRenderCount] = useState(0);
  const [renderDuration, setRenderDuration] = useState('0.0');

  const startPerfTimeRef = useRef(performance.now());
  startPerfTimeRef.current = performance.now();

  useEffect(() => {
    dispatch(fetchDashboardMetrics());

    // Aggressive polling causing continuous re-renders
    const interval = setInterval(() => {
      setRenderCount((prev) => prev + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Real CPU work in dashboard render
  let totalComputed = 0;
  for (let i = 0; i < 400000; i++) {
    totalComputed = ((totalComputed ^ (i * 17)) + (i & 0xff)) & 0xffffffff;
  }

  useLayoutEffect(() => {
    const elapsed = (performance.now() - startPerfTimeRef.current).toFixed(1);
    setRenderDuration(elapsed);
  });

  if (isLoading && !metrics) {
    return <Spinner fullPage message="Loading unoptimized dashboard..." />;
  }

  return (
    <div>
      {/* Warning Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.5rem',
          color: 'var(--color-danger)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>[UNOPTIMIZED VIEW] Aggressive state polling & unmemoized widget re-renders (Re-renders: {renderCount})</span>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <Card style={{ padding: '1.25rem' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Total Tasks</h4>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem' }}>
            {metrics?.overview?.totalTasks || 0}
          </div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Active Projects</h4>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--accent-primary)' }}>
            {metrics?.overview?.totalProjects || 0}
          </div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Completed Tasks</h4>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-success)' }}>
            {metrics?.overview?.completedTasks || 0}
          </div>
        </Card>
        <Card style={{ padding: '1.25rem' }}>
          <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>Overdue Tasks</h4>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: 'var(--color-danger)' }}>
            {metrics?.overview?.overdueTasks || 0}
          </div>
        </Card>
      </div>
    </div>
  );
};
