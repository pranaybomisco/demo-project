import React from 'react';
import { FolderKanban, CheckSquare, Users, User, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ⚠️ UNOPTIMIZED PROJECT TABLE VIEW
 * 1. Synchronous Work in Render Loop: Computes deep array lengths and owner name initials on every frame.
 * 2. Unstable Inline Function Handlers: Causes React to recreate DOM listeners.
 */
export const UnoptimizedProjectTableView = ({
  projects = [],
}) => {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
          <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
            <th style={{ padding: '0.75rem 1rem' }}>Project Name</th>
            <th style={{ padding: '0.75rem 1rem' }}>Tasks</th>
            <th style={{ padding: '0.75rem 1rem' }}>Members</th>
            <th style={{ padding: '0.75rem 1rem' }}>Owner</th>
            <th style={{ padding: '0.75rem 1rem' }}>Updated</th>
            <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.75rem 1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FolderKanban size={18} style={{ color: 'var(--accent-primary)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{project.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{project.description}</div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '0.75rem 1rem' }}>{project._count?.tasks ?? project.taskCount ?? 0}</td>
              <td style={{ padding: '0.75rem 1rem' }}>{project._count?.members ?? project.memberCount ?? 1}</td>
              <td style={{ padding: '0.75rem 1rem' }}>{project.owner?.name || '—'}</td>
              <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '—'}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                <Link to={`/projects/${project.id}`} style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                  <ExternalLink size={15} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
