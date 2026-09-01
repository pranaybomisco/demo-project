import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../../redux/slices/projectslice.js';
import { Card } from '../../../views/components/card.jsx';
import { FolderKanban, Users, CheckSquare, AlertTriangle } from 'lucide-react';
import { Spinner } from '../../../views/components/spinner.jsx';

/**
 * ⚠️ UNOPTIMIZED PROJECTS VIEW
 */
export const UnoptimizedProjectsView = () => {
  const dispatch = useDispatch();
  const { list: projects, isLoading } = useSelector((state) => state.projects);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [renderDuration, setRenderDuration] = useState('0.0');

  const startPerfTimeRef = useRef(performance.now());
  startPerfTimeRef.current = performance.now();

  useEffect(() => {
    dispatch(fetchProjects({ limit: 100, page: 1 }));
  }, [dispatch]);

  // Synchronous calculation running inside render
  let filtered = [...projects];

  // Real CPU work on projects dataset
  for (let i = 0; i < filtered.length; i++) {
    const str = filtered[i].name + (filtered[i].description || '');
    let hash = 0;
    for (let c = 0; c < str.length; c++) {
      hash = (hash * 31 + str.charCodeAt(c)) & 0xffffffff;
    }
    for (let k = 0; k < 1200; k++) {
      hash = ((hash ^ (k * 7)) + (k & 0x3f)) & 0xffffffff;
    }
    filtered[i] = { ...filtered[i], _calcHash: hash };
  }

  if (search) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    );
  }

  filtered.sort((a, b) => {
    return (a[sortBy] || '').toString().localeCompare((b[sortBy] || '').toString());
  });

  useLayoutEffect(() => {
    const elapsed = (performance.now() - startPerfTimeRef.current).toFixed(1);
    setRenderDuration(elapsed);
  });

  if (isLoading && projects.length === 0) {
    return <Spinner fullPage message="Loading unoptimized project cards..." />;
  }

  return (
    <div>
      {/* Performance Warning Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1rem',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '1.25rem',
          color: 'var(--color-danger)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>[UNOPTIMIZED VIEW] In-render blocking calculations on {filtered.length} project cards</span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.875rem',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--color-danger)',
          }}
        >
          Render Time: {renderDuration} ms
        </span>
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
