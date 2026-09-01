import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../../redux/slices/taskslice.js';
import { UnoptimizedTable } from '../../components/unoptimizedtable.jsx';
import { Spinner } from '../../../views/components/spinner.jsx';

/**
 * ⚠️ UNOPTIMIZED TASKS VIEW
 * - Fetches all 1000 tasks at once in a single massive payload.
 * - Disables server-side pagination and URL sync.
 * - Mounts the heavy UnoptimizedTable component into the DOM.
 */
export const UnoptimizedTasksView = () => {
  const dispatch = useDispatch();
  const { list: tasks, isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    // ⚠️ Requesting 1,000 records at once without pagination
    dispatch(fetchTasks({ limit: 1000, page: 1 }));
  }, [dispatch]);

  if (isLoading && tasks.length === 0) {
    return <Spinner fullPage message="Fetching entire 1,000 records dataset..." />;
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          This view loads the entire 1,000 items in a single non-virtualized table to demonstrate layout thrashing, DOM weight, and input lag without debounce.
        </p>
      </div>

      <UnoptimizedTable data={tasks} title="All Tasks (1,000 records)" />
    </div>
  );
};
