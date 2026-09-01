import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  LayoutGrid,
  Table as TableIcon,
  Kanban,
} from 'lucide-react';
import { BUTTON_LABELS } from '../../constants/index.js';

/**
 * Common, Reusable FilterBar Component for Tasks, Projects, and other catalog pages.
 * Supports:
 * - Debounced search input with immediate local state & clear icon
 * - Custom filter slots (children or filters prop)
 * - Sorting controls (sort by field + asc/desc toggle)
 * - View switcher (Grid, Table, Kanban Board)
 * - Active filter detection & reset button
 */
export const FilterBar = ({
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  // Sorting
  sortBy,
  onSortByChange,
  sortOptions = [],
  sortOrder = 'desc',
  onSortOrderToggle,
  // View Switcher
  view,
  onViewChange,
  viewOptions = [
    { value: 'grid', label: 'Grid', icon: <LayoutGrid size={15} /> },
    { value: 'table', label: 'Table', icon: <TableIcon size={15} /> },
  ],
  // Extra filter controls
  children,
  // Reset
  hasActiveFilters = false,
  onClearFilters,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange?.(localSearch);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localSearch, search, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange?.('');
  };

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
      {/* Top Filter Controls Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Search Input with Debounce */}
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            className="input"
            style={{
              paddingLeft: '2.25rem',
              paddingRight: localSearch ? '2.25rem' : '0.875rem',
              height: '38px',
              width: '100%',
            }}
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Custom Filter Selects / Dropdowns (Children slot) */}
        {children}

        {/* Sort Select */}
        {sortOptions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <select
              className="select"
              style={{ height: '38px', minWidth: '135px' }}
              value={sortBy}
              onChange={(e) => onSortByChange?.(e.target.value)}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {onSortOrderToggle && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ height: '38px', padding: '0 0.65rem' }}
                onClick={onSortOrderToggle}
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
              </button>
            )}
          </div>
        )}

        {/* View Mode Toggle Switcher */}
        {viewOptions.length > 1 && onViewChange && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '2px',
              marginLeft: 'auto',
            }}
          >
            {viewOptions.map((v) => {
              const isActive = view === v.value;
              return (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => onViewChange(v.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  title={`${v.label} View`}
                >
                  {v.icon}
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && onClearFilters && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onClearFilters}
            style={{
              color: 'var(--color-danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              height: '38px',
            }}
          >
            <RotateCcw size={14} />
            <span>{BUTTON_LABELS.RESET_FILTERS || 'Reset'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
