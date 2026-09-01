import React from 'react';
import { FilterBar } from '../components/filterbar.jsx';
import { Select } from '../components/select.jsx';
import { Table as TableIcon, LayoutGrid } from 'lucide-react';
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

  const viewOptions = [
    { value: 'table', label: 'Table', icon: <TableIcon size={14} /> },
    { value: 'board', label: 'Board', icon: <LayoutGrid size={14} /> },
  ];

  return (
    <FilterBar
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder={PLACEHOLDERS.SEARCH_TASKS || 'Search tasks by title or description...'}
      sortBy={sortBy}
      onSortByChange={onSortByChange}
      sortOptions={sortOptions}
      sortOrder={sortOrder}
      onSortOrderToggle={onSortOrderToggle}
      view={view}
      onViewChange={onViewChange}
      viewOptions={viewOptions}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={onClearFilters}
    >
      {/* Custom Domain Filters for Tasks */}
      <div style={{ minWidth: '140px' }}>
        <Select
          options={statusOptions}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{ marginBottom: 0, height: '38px' }}
        />
      </div>

      <div style={{ minWidth: '140px' }}>
        <Select
          options={priorityOptions}
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          style={{ marginBottom: 0, height: '38px' }}
        />
      </div>

      {projects.length > 0 && (
        <div style={{ minWidth: '160px' }}>
          <Select
            options={projectOptions}
            value={projectId}
            onChange={(e) => onProjectChange(e.target.value)}
            style={{ marginBottom: 0, height: '38px' }}
          />
        </div>
      )}
    </FilterBar>
  );
};
