import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardMetrics } from '../../redux/slices/dashboardslice.js';
import { StatsWidget } from './statswidget.jsx';
import { StatusWidget } from './statuswidget.jsx';
import { PriorityWidget } from './prioritywidget.jsx';
import { OverdueTasksWidget } from './overduetaskswidget.jsx';
import { RecentTasksWidget } from './recenttaskswidget.jsx';
import { Spinner } from '../components/spinner.jsx';

export const DashboardView = () => {
  const dispatch = useDispatch();
  const { metrics, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
  }, [dispatch]);

  if (isLoading && !metrics) {
    return <Spinner fullPage message="Loading dashboard analytics..." />;
  }

  return (
    <div>
      <StatsWidget overview={metrics?.overview} />

      <div className="grid-2-col" style={{ marginBottom: '1.5rem' }}>
        <StatusWidget statusBreakdown={metrics?.statusBreakdown} />
        <PriorityWidget priorityBreakdown={metrics?.priorityBreakdown} />
      </div>

      <div className="grid-2-col">
        <OverdueTasksWidget overdueTasks={metrics?.overdueTasks} />
        <RecentTasksWidget recentTasks={metrics?.recentTasks} />
      </div>
    </div>
  );
};
