import React from 'react';
import { Link } from 'react-router-dom';
import { DataTable } from '../components/datatable.jsx';
import { Skeleton } from '../components/skeleton.jsx';
import {
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
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Project Name',
      sortable: true,
      width: '34%',
      skeletonRender: () => (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
          <Skeleton width="36px" height="36px" borderRadius="var(--radius-sm)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <Skeleton width="55%" height="1rem" />
            <Skeleton width="85%" height="0.75rem" />
          </div>
        </div>
      ),
      render: (project) => (
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
      ),
    },
    {
      key: 'taskCount',
      label: 'Tasks',
      sortable: true,
      width: '12%',
      skeletonRender: () => <Skeleton width="48px" height="24px" borderRadius="var(--radius-full)" />,
      render: (project) => (
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
      ),
    },
    {
      key: 'memberCount',
      label: 'Members',
      sortable: true,
      width: '12%',
      skeletonRender: () => <Skeleton width="48px" height="24px" borderRadius="var(--radius-full)" />,
      render: (project) => (
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
      ),
    },
    {
      key: 'owner',
      label: 'Owner',
      sortable: false,
      width: '16%',
      skeletonRender: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Skeleton width="26px" height="26px" borderRadius="50%" />
          <Skeleton width="80px" height="0.875rem" />
        </div>
      ),
      render: (project) =>
        project.owner ? (
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
        ),
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      sortable: true,
      width: '14%',
      skeletonRender: () => <Skeleton width="80px" height="0.875rem" />,
      render: (project) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
          <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(project.updatedAt || project.createdAt)}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      width: '12%',
      skeletonRender: () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
          <Skeleton width="28px" height="28px" borderRadius="var(--radius-sm)" />
          <Skeleton width="28px" height="28px" borderRadius="var(--radius-sm)" />
        </div>
      ),
      render: (project) => {
        const canManage = user?.role === ROLES.ADMIN || project.ownerId === user?.id;
        return (
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
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={projects}
      isLoading={isLoading}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      emptyTitle={UI_MESSAGES.NO_PROJECTS}
      emptyDescription="No projects match your current filters. Adjust your search or clear filters to see projects."
      emptyActionLabel={onCreateProject ? 'Create New Project' : null}
      onEmptyAction={onCreateProject}
    />
  );
};
