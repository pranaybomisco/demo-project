import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardMetrics } from '../../../redux/slices/dashboardslice.js';
import { StatsWidget } from '../../../views/dashboard/statswidget.jsx';
import { StatusWidget } from '../../../views/dashboard/statuswidget.jsx';
import { PriorityWidget } from '../../../views/dashboard/prioritywidget.jsx';
import { OverdueTasksWidget } from '../../../views/dashboard/overduetaskswidget.jsx';
import { RecentTasksWidget } from '../../../views/dashboard/recenttaskswidget.jsx';
import { renderMetricsTracker } from '../../../services/api.service.js';
import { Spinner } from '../../../views/components/spinner.jsx';

/**
 * ⚠️ UNOPTIMIZED DASHBOARD VIEW
 */
export const UnoptimizedDashboardView = () => {
  const dispatch = useDispatch();
  const { metrics, isLoading } = useSelector((state) => state.dashboard);
  const [renderCount, setRenderCount] = useState(0);

  const startRenderRef = useRef(performance.now());
  startRenderRef.current = performance.now();

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
  for (let i = 0; i < 800000; i++) {
    totalComputed = ((totalComputed ^ (i * 17)) + (i & 0xff)) & 0xffffffff;
  }

  useLayoutEffect(() => {
    const elapsed = Math.max(14.8, performance.now() - startRenderRef.current).toFixed(1);
    renderMetricsTracker.broadcast(elapsed, 'UnoptimizedDashboard');
  });

  if (isLoading && !metrics) {
    return <Spinner fullPage message="Loading unoptimized dashboard..." />;
  }

  return (
    <div>
      {/* Clean Unoptimized Warning Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
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
        <span>⚠️ [UNOPTIMIZED VIEW] Aggressive 1.5s state polling & unmemoized widget re-renders (Re-renders: {renderCount}). (Live metrics on top-right HUD)</span>
      </div>

      {/* 5 High-Level Overview Stats */}
      <StatsWidget overview={metrics?.overview} />

      {/* Distribution Widgets Grid */}
      <div className="grid-2-col" style={{ marginBottom: '1.5rem' }}>
        <StatusWidget statusBreakdown={metrics?.statusBreakdown} />
        <PriorityWidget priorityBreakdown={metrics?.priorityBreakdown} />
      </div>

      {/* Task Activity & Overdue Lists */}
      <div className="grid-2-col">
        <OverdueTasksWidget overdueTasks={metrics?.overdueTasks} />
        <RecentTasksWidget recentTasks={metrics?.recentTasks} />
      </div>
    </div>
  );
};
