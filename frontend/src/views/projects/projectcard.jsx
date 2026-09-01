import React from 'react';
import { Card } from '../components/card.jsx';
import { Button } from '../components/button.jsx';
import { FolderKanban, Users, CheckSquare, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_ROUTES, BUTTON_LABELS } from '../../constants/index.js';

export const ProjectCard = ({ project, onEdit, onDelete, canManage = false }) => {
  return (
    <Card hoverable style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <FolderKanban size={20} />
          </div>

          {canManage && (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                onClick={() => onEdit(project)}
                className="btn-ghost"
                style={{ padding: '0.375rem', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                title="Edit Project"
              >
                <Edit size={15} />
              </button>
              <button
                onClick={() => onDelete(project)}
                className="btn-ghost"
                style={{ padding: '0.375rem', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}
                title="Delete Project"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>{project.name}</h3>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
            marginBottom: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <CheckSquare size={15} />
            <span>{project._count?.tasks || 0} tasks</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Users size={15} />
            <span>{project._count?.members || 1} members</span>
          </div>
        </div>

        <Link to={APP_ROUTES.PROJECT_DETAIL_PATH(project.id)} style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="sm" rightIcon={<ArrowRight size={14} />} style={{ width: '100%' }}>
            {BUTTON_LABELS.VIEW_DETAILS}
          </Button>
        </Link>
      </div>
    </Card>
  );
};
