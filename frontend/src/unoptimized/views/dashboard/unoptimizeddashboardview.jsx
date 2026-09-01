import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardMetrics } from '../../../redux/slices/dashboardslice.js';
import { Card } from '../../../views/components/card.jsx';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Spinner } from '../../../views/components/spinner.jsx';

/**
 * ⚠️ UNOPTIMIZED DASHBOARD VIEW
 * 1. Memory Leak & Polling Anti-Pattern: Aggressive interval triggering continuous state re-renders without debounce or cancellation checks.
 * 2. In-render Metrics Aggregation: Recomputes entire statistics on every single tick.
 * 3. Layout Thrashing & CPU Spike.
 */
export const UnoptimizedDashboardView = () => {
  const dispatch = useDispatch();
  const { metrics, isLoading } = useSelector((state) => state.dashboard);
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());

    // ⚠️ Unoptimized rapid polling creating constant re-render load
    const interval = setInterval(() => {
      setRenderCount((prev) => prev + 1);
    }, 1200);

    return () => clearInterval(interval);
  }, [dispatch]);

  // ⚠️ Artificial in-render blocking loop simulating un-memoized heavy dashboard charts
  const startPerfTime = performance.now();
  for (let i = 0; i < 200000; i++) {
    Math.tan(i);
  }
  const renderDuration = (performance.now() - startPerfTime).toFixed(2);

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
          padding: '0.75rem 1rem',
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
          <span>[UNOPTIMIZED VIEW] Aggressive 1.2s state polling trigger & unmemoized widget re-renders (Re-renders: {renderCount})</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
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
