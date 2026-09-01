import React from 'react';
import { FilterBar } from '../components/filterbar.jsx';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { PLACEHOLDERS } from '../../constants/index.js';

export const ProjectFilterBar = ({
  search = '',
  onSearchChange,
  sortBy = 'updatedAt',
  onSortByChange,
  sortOrder = 'desc',
  onSortOrderToggle,
  view = 'grid',
  onViewChange,
  hasActiveFilters = false,
  onClearFilters,
}) => {
  const sortOptions = [
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'name', label: 'Project Name' },
    { value: 'taskCount', label: 'Task Count' },
    { value: 'memberCount', label: 'Member Count' },
  ];

  const viewOptions = [
    { value: 'grid', label: 'Grid', icon: <LayoutGrid size={15} /> },
    { value: 'table', label: 'Table', icon: <TableIcon size={15} /> },
  ];

  return (
    <FilterBar
      search={search}
      onSearchChange={onSearchChange}
      searchPlaceholder={PLACEHOLDERS.SEARCH_PROJECTS}
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
    />
  );
};
