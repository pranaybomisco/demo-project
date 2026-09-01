import React, { useState, useEffect } from 'react';
import { Input } from '../components/input.jsx';
import { Select } from '../components/select.jsx';
import {
  Search,
  X,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  ArrowUpAZ,
  ArrowDownAZ,
  Filter,
} from 'lucide-react';
import {
  PLACEHOLDERS,
  TASK_STATUS,
  STATUS_LABELS,
  TASK_PRIORITY,
  PRIORITY_LABELS,
} from '../../constants/index.js';

export const TaskFilterBar = ({
  search = '',
  onSearchChange,
  status = '',
  onStatusChange,
  priority = '',
  onPriorityChange,
  projectId = '',
  onProjectChange,
  sortBy = 'createdAt',
  onSortByChange,
  sortOrder = 'desc',
  onSortOrderToggle,
  view = 'table',
  onViewChange,
  projects = [],
  hasActiveFilters = false,
  onClearFilters,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync external search update
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update to URL/parent
  useEffect(() => {
    if (localSearch === search) return;
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: TASK_STATUS.TODO, label: STATUS_LABELS[TASK_STATUS.TODO] },
    { value: TASK_STATUS.IN_PROGRESS, label: STATUS_LABELS[TASK_STATUS.IN_PROGRESS] },
    { value: TASK_STATUS.DONE, label: STATUS_LABELS[TASK_STATUS.DONE] },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: TASK_PRIORITY.LOW, label: PRIORITY_LABELS[TASK_PRIORITY.LOW] },
    { value: TASK_PRIORITY.MEDIUM, label: PRIORITY_LABELS[TASK_PRIORITY.MEDIUM] },
    { value: TASK_PRIORITY.HIGH, label: PRIORITY_LABELS[TASK_PRIORITY.HIGH] },
    { value: TASK_PRIORITY.CRITICAL, label: PRIORITY_LABELS[TASK_PRIORITY.CRITICAL] },
  ];

  const projectOptions = [
    { value: '', label: 'All Projects' },
    ...projects.map((p) => ({ value: p.id, label: p.name })),
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'title', label: 'Task Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.125rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      {/* Top Filter Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Input
            placeholder={PLACEHOLDERS.SEARCH_TASKS || 'Search tasks by title or description...'}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        />

        {/* Priority Filter */}
        <Select
          options={priorityOptions}
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
        />

        {/* Project Filter */}
        <Select
          options={projectOptions}
          value={projectId}
          onChange={(e) => onProjectChange(e.target.value)}
        />
      </div>

      {/* Bottom Bar: Sorting, Reset & View Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '0.625rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {/* Sort Controls & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Sort by:
            </span>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              style={{
                padding: '0.35rem 0.65rem',
                width: 'auto',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onSortOrderToggle}
              className="btn btn-ghost btn-sm"
              style={{
                border: '1px solid var(--border-color)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              title={`Order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
            >
              {sortOrder === 'asc' ? <ArrowUpAZ size={15} /> : <ArrowDownAZ size={15} />}
              <span>{sortOrder === 'asc' ? 'ASC' : 'DESC'}</span>
            </button>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="btn btn-ghost btn-sm"
              style={{
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                border: '1px dashed var(--accent-primary)',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* View Switcher (Table / Board) */}
        <div
          style={{
            display: 'inline-flex',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            padding: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => onViewChange('table')}
            className="btn-ghost"
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: view === 'table' ? 'var(--bg-tertiary)' : 'transparent',
              color: view === 'table' ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'var(--transition-fast)',
            }}
          >
            <TableIcon size={14} />
            <span>Table</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('board')}
            className="btn-ghost"
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: view === 'board' ? 'var(--bg-tertiary)' : 'transparent',
              color: view === 'board' ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'var(--transition-fast)',
            }}
          >
            <LayoutGrid size={14} />
            <span>Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
