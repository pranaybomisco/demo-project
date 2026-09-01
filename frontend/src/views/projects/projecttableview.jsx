import React from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/emptystate.jsx';
import { Skeleton } from '../components/skeleton.jsx';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FolderKanban,
  CheckSquare,
  Users,
  User,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
} from 'lucide-react';
import { APP_ROUTES, UI_MESSAGES, ROLES } from '../../constants/index.js';

export const ProjectTableView = ({
  projects = [],
  isLoading = false,
  sortBy = 'updatedAt',
  sortOrder = 'desc',
  onSort,
  user,
  onEditProject,
  onDeleteProject,
  onCreateProject,
}) => {
  if (!isLoading && projects.length === 0) {
    return (
      <EmptyState
        title={UI_MESSAGES.NO_PROJECTS}
        description="No projects match your current filters. Adjust your search or clear filters to see projects."
        actionLabel={onCreateProject ? 'Create New Project' : null}
        onAction={onCreateProject ? () => onCreateProject() : null}
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

  const renderSkeletonRows = () => {
    const rowCount = 6;
    return Array.from({ length: rowCount }).map((_, idx) => (
      <tr
        key={`skeleton-project-${idx}`}
        style={{
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {/* Project Info Skeleton */}
        <td style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
            <Skeleton width="36px" height="36px" borderRadius="var(--radius-sm)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <Skeleton width="55%" height="1rem" />
              <Skeleton width="85%" height="0.75rem" />
            </div>
          </div>
        </td>

        {/* Tasks Skeleton */}
        <td style={{ padding: '1rem' }}>
          <Skeleton width="48px" height="24px" borderRadius="var(--radius-full)" />
        </td>

        {/* Members Skeleton */}
        <td style={{ padding: '1rem' }}>
          <Skeleton width="48px" height="24px" borderRadius="var(--radius-full)" />
        </td>

        {/* Owner Skeleton */}
        <td style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Skeleton width="26px" height="26px" borderRadius="50%" />
            <Skeleton width="80px" height="0.875rem" />
          </div>
        </td>

        {/* Updated Skeleton */}
        <td style={{ padding: '1rem' }}>
          <Skeleton width="80px" height="0.875rem" />
        </td>

        {/* Actions Skeleton */}
        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
            <Skeleton width="28px" height="28px" borderRadius="var(--radius-sm)" />
            <Skeleton width="28px" height="28px" borderRadius="var(--radius-sm)" />
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
            {/* Project Name Header */}
            <th
              onClick={() => onSort?.('name')}
              style={{
                padding: '0.875rem 1.25rem',
                cursor: 'pointer',
                userSelect: 'none',
                width: '34%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span>Project Name</span>
                {renderSortIcon('name')}
              </div>
            </th>

            {/* Tasks Header */}
            <th
              onClick={() => onSort?.('taskCount')}
              style={{
                padding: '0.875rem 1rem',
                cursor: 'pointer',
                userSelect: 'none',
                width: '12%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span>Tasks</span>
                {renderSortIcon('taskCount')}
              </div>
            </th>

            {/* Members Header */}
            <th
              onClick={() => onSort?.('memberCount')}
              style={{
                padding: '0.875rem 1rem',
                cursor: 'pointer',
                userSelect: 'none',
                width: '12%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span>Members</span>
                {renderSortIcon('memberCount')}
              </div>
            </th>

            {/* Owner Header */}
            <th
              style={{
                padding: '0.875rem 1rem',
                userSelect: 'none',
                width: '16%',
              }}
            >
              <span>Owner</span>
            </th>

            {/* Last Activity / Updated Header */}
            <th
              onClick={() => onSort?.('updatedAt')}
              style={{
                padding: '0.875rem 1rem',
                cursor: 'pointer',
                userSelect: 'none',
                width: '14%',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span>Updated</span>
                {renderSortIcon('updatedAt')}
              </div>
            </th>

            {/* Actions Header */}
            <th
              style={{
                padding: '0.875rem 1.25rem',
                textAlign: 'right',
                width: '12%',
              }}
            >
              <span>Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            renderSkeletonRows()
          ) : (
            projects.map((project) => {
              const canManage =
                user?.role === ROLES.ADMIN ||
                project.ownerId === user?.id;

              return (
                <tr
                  key={project.id}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  className="table-row-hover"
                >
                  {/* Project Info */}
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(99, 102, 241, 0.12)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-primary)',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}
                      >
                        <FolderKanban size={18} />
                      </div>
                      <div>
                        <Link
                          to={APP_ROUTES.PROJECT_DETAIL_PATH(project.id)}
                          style={{
                            fontWeight: 700,
                            fontSize: '0.9375rem',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            display: 'inline-block',
                            marginBottom: '0.2rem',
                          }}
                          className="hover-accent"
                        >
                          {project.name}
                        </Link>
                        {project.description && (
                          <p
                            style={{
                              fontSize: '0.8125rem',
                              color: 'var(--text-secondary)',
                              margin: 0,
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              maxWidth: '380px',
                            }}
                          >
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Tasks Count */}
                  <td style={{ padding: '1rem' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      <CheckSquare size={13} style={{ color: 'var(--accent-primary)' }} />
                      <span>{project._count?.tasks ?? project.taskCount ?? 0}</span>
                    </div>
                  </td>

                  {/* Members Count */}
                  <td style={{ padding: '1rem' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      <Users size={13} style={{ color: '#38bdf8' }} />
                      <span>{project._count?.members ?? project.memberCount ?? 1}</span>
                    </div>
                  </td>

                  {/* Owner */}
                  <td style={{ padding: '1rem' }}>
                    {project.owner ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(99, 102, 241, 0.2)',
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {project.owner.name ? project.owner.name[0].toUpperCase() : <User size={13} />}
                        </div>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                          {project.owner.name}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>—</span>
                    )}
                  </td>

                  {/* Updated Date */}
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                      <span>{formatDate(project.updatedAt || project.createdAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                      <Link
                        to={APP_ROUTES.PROJECT_DETAIL_PATH(project.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.35rem 0.5rem', color: 'var(--accent-primary)' }}
                        title="Open Project"
                      >
                        <ExternalLink size={15} />
                      </Link>

                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() => onEditProject?.(project)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '0.35rem 0.5rem', color: 'var(--text-secondary)' }}
                            title="Edit Project"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProject?.(project)}
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '0.35rem 0.5rem', color: 'var(--color-danger)' }}
                            title="Delete Project"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
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
