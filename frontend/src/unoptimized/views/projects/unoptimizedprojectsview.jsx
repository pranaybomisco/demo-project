import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../../redux/slices/projectslice.js';
import { Card } from '../../../views/components/card.jsx';
import { FolderKanban, Users, CheckSquare } from 'lucide-react';
import { Spinner } from '../../../views/components/spinner.jsx';

/**
 * ⚠️ UNOPTIMIZED PROJECTS VIEW
 */
export const UnoptimizedProjectsView = () => {
  const dispatch = useDispatch();
  const { list: projects, isLoading } = useSelector((state) => state.projects);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    dispatch(fetchProjects({ limit: 1000 }));
  }, [dispatch]);

  // Heavy synchronous CPU blocking calculation during render
  let totalComputed = 0;
  for (let i = 0; i < 400000; i++) {
    totalComputed = ((totalComputed ^ (i * 19)) + (i & 0x7f)) & 0xffffffff;
  }

  const filtered = projects
    .filter((p) => {
      let match = true;
      if (search) {
        match = (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (p.description || '').toLowerCase().includes(search.toLowerCase());
      }
      return match;
    })
    .sort((a, b) => {
      const valA = (a[sortBy] || '').toString();
      const valB = (b[sortBy] || '').toString();
      return valA.localeCompare(valB);
    });

  if (isLoading && projects.length === 0) {
    return <Spinner fullPage message="Loading unoptimized project cards..." />;
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
          marginBottom: '1.25rem',
          color: 'var(--color-danger)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <span>⚠️ [UNOPTIMIZED VIEW] Rendering {filtered.length} unpaginated cards with in-render CPU work. (Live metrics in top-right HUD)</span>
      </div>

      {/* Non-debounced search input */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search projects (non-debounced, triggers immediate blocking re-renders)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '0.625rem 0.875rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="createdAt">Sort by Date</option>
        </select>
      </div>

      {/* Grid of cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((project) => (
          <Card key={project.id} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(99, 102, 241, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-primary)',
                }}
              >
                <FolderKanban size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 700 }}>{project.name}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Owner: {project.owner?.name || 'Unassigned'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', minHeight: '38px' }}>
              {project.description || 'No description provided.'}
            </p>

            <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                <CheckSquare size={14} style={{ color: 'var(--accent-primary)' }} />
                <span>{project._count?.tasks ?? project.taskCount ?? 0} tasks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                <Users size={14} style={{ color: '#38bdf8' }} />
                <span>{project._count?.members ?? project.memberCount ?? 1} members</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
