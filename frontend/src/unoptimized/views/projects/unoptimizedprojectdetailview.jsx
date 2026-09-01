import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDetail } from '../../../redux/slices/projectslice.js';
import { fetchTasks } from '../../../redux/slices/taskslice.js';
import { UnoptimizedTaskBoardView } from '../tasks/unoptimizedtaskboardview.jsx';
import { Spinner } from '../../../views/components/spinner.jsx';
import { FolderKanban, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../../../constants/index.js';

/**
 * ⚠️ UNOPTIMIZED PROJECT DETAIL VIEW
 * 1. Duplicate In-Memory Fetches: Requests full tasks dataset on every navigation without local memoization.
 * 2. In-render blocking loop on project metadata.
 * 3. Mounts heavy UnoptimizedTaskBoardView.
 */
export const UnoptimizedProjectDetailView = ({ projectId }) => {
  const dispatch = useDispatch();
  const { currentProject, isLoading: isProjectLoading } = useSelector((state) => state.projects);
  const { list: tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectDetail(projectId));
      dispatch(fetchTasks({ projectId, limit: 500 }));
    }
  }, [dispatch, projectId]);

  // ⚠️ In-render CPU work
  for (let i = 0; i < 120000; i++) {
    Math.tan(i);
  }

  if (isProjectLoading && !currentProject) {
    return <Spinner fullPage message="Loading project in unoptimized mode..." />;
  }

  if (!currentProject) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Project Not Found</h2>
        <Link to={APP_ROUTES.PROJECTS}>Back to Projects</Link>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.25rem',
          color: 'var(--color-danger)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <AlertTriangle size={18} />
        <span>[UNOPTIMIZED DETAIL] In-render blocking calculations and un-virtualized sprint task board</span>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link to={APP_ROUTES.PROJECTS} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentProject.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{currentProject.description}</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Sprint Tasks ({tasks.length})</h2>
        <UnoptimizedTaskBoardView tasks={tasks} />
      </div>
    </div>
  );
};
