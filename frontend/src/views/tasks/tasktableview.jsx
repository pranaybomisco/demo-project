import React from 'react';
import { Badge } from '../components/badge.jsx';
import { DataTable } from '../components/datatable.jsx';
import { Skeleton } from '../components/skeleton.jsx';
import {
  Edit2,
  Trash2,
  Calendar,
  User,
  FolderKanban,
} from 'lucide-react';
import { UI_MESSAGES } from '../../constants/index.js';

export const TaskTableView = ({
  tasks = [],
  isLoading = false,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSort,
  onEditTask,
  onDeleteTask,
  onCreateTask,
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (dueDateStr, status) => {
    if (!dueDateStr || status === 'DONE') return false;
    return new Date(dueDateStr) < new Date();
  };

  const columns = [
    {
      key: 'title',
      label: 'Task Title',
      sortable: true,
      width: '32%',
      skeletonRender: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <Skeleton width="65%" height="0.9375rem" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
      ),
      render: (task) => (
        <div>
          <div
            style={{
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: task.description ? '0.2rem' : 0,
            }}
          >
            {task.title}
          </div>
          {task.description && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '320px',
              }}
            >
              {task.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'project',
      label: 'Project',
      headerIcon: <FolderKanban size={13} />,
      sortable: false,
      width: '15%',
      skeletonRender: () => <Skeleton width="90px" height="0.875rem" />,
      render: (task) => (
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            display: 'inline-block',
            maxWidth: '160px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {task.project?.name || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '12%',
      skeletonRender: () => <Skeleton width="65px" height="22px" borderRadius="var(--radius-full)" />,
      render: (task) => <Badge value={task.status} />,
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      width: '11%',
      skeletonRender: () => <Skeleton width="60px" height="22px" borderRadius="var(--radius-full)" />,
      render: (task) => <Badge value={task.priority} />,
    },
    {
      key: 'assignee',
      label: 'Assignee',
      headerIcon: <User size={13} />,
      sortable: false,
      width: '13%',
      skeletonRender: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Skeleton width="24px" height="24px" borderRadius="50%" />
          <Skeleton width="75px" height="0.875rem" />
        </div>
      ),
      render: (task) =>
        task.assignee ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6875rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {task.assignee.name ? task.assignee.name[0].toUpperCase() : <User size={12} />}
            </div>
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {task.assignee.name}
            </span>
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Unassigned</span>
        ),
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sortable: true,
      width: '11%',
      skeletonRender: () => <Skeleton width="80px" height="0.875rem" />,
      render: (task) => {
        const overdue = isOverdue(task.dueDate, task.status);
        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8125rem',
              color: overdue ? 'var(--color-danger)' : 'var(--text-secondary)',
              fontWeight: overdue ? 600 : 400,
            }}
          >
            <Calendar size={13} style={{ opacity: overdue ? 1 : 0.7 }} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      width: '6%',
      skeletonRender: () => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <Skeleton width="24px" height="24px" borderRadius="var(--radius-sm)" />
          <Skeleton width="24px" height="24px" borderRadius="var(--radius-sm)" />
        </div>
      ),
      render: (task) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          {onEditTask && (
            <button
              type="button"
              onClick={() => onEditTask(task)}
              className="btn-ghost"
              title="Edit Task"
              aria-label="Edit Task"
              style={{
                padding: '0.35rem',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
              }}
            >
              <Edit2 size={14} />
            </button>
          )}

          {onDeleteTask && (
            <button
              type="button"
              onClick={() => onDeleteTask(task)}
              className="btn-ghost"
              title="Delete Task"
              aria-label="Delete Task"
              style={{
                padding: '0.35rem',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-danger)',
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tasks}
      isLoading={isLoading}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      emptyTitle={UI_MESSAGES.NO_TASKS}
      emptyDescription="No tasks match your active filters. Adjust your search or filters to see tasks."
      emptyActionLabel={onCreateTask ? 'Create New Task' : null}
      onEmptyAction={onCreateTask}
      skeletonRowCount={8}
    />
  );
};
