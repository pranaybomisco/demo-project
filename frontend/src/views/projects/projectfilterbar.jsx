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
  const [localSearch, setLocalSearch] = useState(search);

  // Sync external search updates
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search input to parent/URL
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

  const sortOptions = [
    { value: 'updatedAt', label: 'Last Updated' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'name', label: 'Project Name' },
    { value: 'taskCount', label: 'Task Count' },
    { value: 'memberCount', label: 'Member Count' },
  ];

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.875rem',
      }}
    >
      {/* Top Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Search Box with Clear Button */}
        <div style={{ flex: 1, minWidth: '240px', maxWidth: '420px', position: 'relative' }}>
          <Input
            placeholder={PLACEHOLDERS.SEARCH_PROJECTS}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            leftIcon={<Search size={16} />}
            style={{ marginBottom: 0 }}
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear Search"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Right Controls: Sort, Order Toggle, View Mode, Clear */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Sort By Select */}
          <div style={{ minWidth: '150px' }}>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={onSortOrderToggle}
            className="btn btn-secondary"
            style={{ padding: '0.55rem 0.75rem' }}
            title={`Sort ${sortOrder === 'asc' ? 'Ascending (A-Z)' : 'Descending (Z-A)'}`}
            aria-label="Toggle Sort Order"
          >
            {sortOrder === 'asc' ? <ArrowUpAZ size={18} /> : <ArrowDownAZ size={18} />}
          </button>

          {/* View Mode Toggle: Grid vs Table/List */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => onViewChange('grid')}
              className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                padding: '0.35rem 0.65rem',
                border: 'none',
                borderRadius: 'calc(var(--radius-sm) - 2px)',
              }}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => onViewChange('table')}
              className={`btn btn-sm ${view === 'table' || view === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                padding: '0.35rem 0.65rem',
                border: 'none',
                borderRadius: 'calc(var(--radius-sm) - 2px)',
              }}
              title="Table / List View"
              aria-label="Table / List View"
            >
              <TableIcon size={16} />
            </button>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="btn btn-ghost btn-sm"
              style={{
                color: 'var(--color-danger)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.45rem 0.75rem',
              }}
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
