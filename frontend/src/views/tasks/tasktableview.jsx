import React from 'react';
import { Badge } from '../components/badge.jsx';
import { EmptyState } from '../components/emptystate.jsx';
import { Skeleton } from '../components/skeleton.jsx';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
  if (!isLoading && tasks.length === 0) {
    return (
      <EmptyState
        title={UI_MESSAGES.NO_TASKS}
        description="No tasks match your active filters. Adjust your search or filters to see tasks."
        actionLabel={onCreateTask ? 'Create New Task' : null}
        onAction={onCreateTask ? () => onCreateTask() : null}
      />
    );
  }

  const renderSortIcon = (columnKey) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown size={13} style={{ opacity: 0.35, marginLeft: '4px' }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--accent-primary)', marginLeft: '4px' }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--accent-primary)', marginLeft: '4px' }} />
    );
  };

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

  const renderSkeletonRows = () => {
    const rowCount = 8;
    return Array.from({ length: rowCount }).map((_, idx) => (
      <tr
        key={`skeleton-task-${idx}`}
        style={{
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {/* Title Skeleton */}
        <td style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <Skeleton width="65%" height="0.9375rem" />
            <Skeleton width="40%" height="0.75rem" />
          </div>
        </td>

        {/* Project Skeleton */}
        <td style={{ padding: '1rem' }}>
          <Skeleton width="90px" height="0.875rem" />
        </td>

        {/* Status Skeleton */}
        <td style={{ padding: '1rem' }}>
          <Skeleton width="65px" height="22px" borderRadius="var(--radius-full)" />
        </td>

        {/* Priority Skeleton */}
        <td style={{ padding: '1rem' }}>
          <Skeleton width="60px" height="22px" borderRadius="var(--radius-full)" />
        </td>

        {/* Assignee Skeleton */}
        <td style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Skeleton width="24px" height="24px" borderRadius="50%" />
            <Skeleton width="75px" height="0.875rem" />
          </div>
        </td>

        {/* Due Date Skeleton */}
        <td style={{ padding: '1rem' }}>
          <Skeleton width="80px" height="0.875rem" />
        </td>

        {/* Actions Skeleton */}
        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Skeleton width="24px" height="24px" borderRadius="var(--radius-sm)" />
            <Skeleton width="24px" height="24px" borderRadius="var(--radius-sm)" />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div
      className="glass-panel"
      style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <th
              onClick={() => onSort?.('title')}
              style={{
                padding: '0.875rem 1.25rem',
                cursor: 'pointer',
                userSelect: 'none',
                width: '32%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Task Title {renderSortIcon('title')}
              </div>
            </th>

            <th
              style={{
                padding: '0.875rem 1rem',
                width: '15%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <FolderKanban size={13} style={{ marginRight: '5px' }} /> Project
              </div>
            </th>

            <th
              onClick={() => onSort?.('status')}
              style={{
                padding: '0.875rem 1rem',
                cursor: 'pointer',
                userSelect: 'none',
                width: '12%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Status {renderSortIcon('status')}
              </div>
            </th>

            <th
              onClick={() => onSort?.('priority')}
              style={{
                padding: '0.875rem 1rem',
                cursor: 'pointer',
                userSelect: 'none',
                width: '11%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Priority {renderSortIcon('priority')}
              </div>
            </th>

            <th
              style={{
                padding: '0.875rem 1rem',
                userSelect: 'none',
                width: '13%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <User size={13} style={{ marginRight: '5px' }} /> Assignee
              </div>
            </th>

            <th
              onClick={() => onSort?.('dueDate')}
              style={{
                padding: '0.875rem 1rem',
                cursor: 'pointer',
                userSelect: 'none',
                width: '11%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                Due Date {renderSortIcon('dueDate')}
              </div>
            </th>

            <th
              style={{
                padding: '0.875rem 1.25rem',
                textAlign: 'right',
                width: '6%',
              }}
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            renderSkeletonRows()
          ) : (
            tasks.map((task) => {
              const overdue = isOverdue(task.dueDate, task.status);

              return (
                <tr
                  key={task.id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  className="table-row-hover"
                >
                  {/* Title & Desc */}
                  <td style={{ padding: '1rem 1.25rem' }}>
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
                  </td>

                  {/* Project */}
                  <td style={{ padding: '1rem 1rem' }}>
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
                  </td>

                  {/* Status */}
                  <td style={{ padding: '1rem 1rem' }}>
                    <Badge value={task.status} />
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '1rem 1rem' }}>
                    <Badge value={task.priority} />
                  </td>

                  {/* Assignee */}
                  <td style={{ padding: '1rem 1rem' }}>
                    {task.assignee ? (
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
                    )}
                  </td>

                  {/* Due Date */}
                  <td style={{ padding: '1rem 1rem' }}>
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
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
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
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
