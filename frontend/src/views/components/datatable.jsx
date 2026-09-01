import React from 'react';
import { EmptyState } from './emptystate.jsx';
import { Skeleton } from './skeleton.jsx';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Common, Reusable DataTable Component for Projects, Tasks, and all future entities.
 * Supports:
 * - Declarative column configuration
 * - Column sorting with animated sort indicators
 * - Shimmering skeleton rows matching column widths during loading
 * - Empty state integration
 * - Hover effects and customizable cell renders
 */
export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  sortBy = '',
  sortOrder = 'desc',
  onSort,
  emptyTitle = 'No records found',
  emptyDescription = 'No records match your active filters.',
  emptyActionLabel = null,
  onEmptyAction = null,
  keyExtractor = (item, index) => item.id || index,
  skeletonRowCount = 6,
}) => {
  if (!isLoading && data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  const renderSortIcon = (columnKey) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown size={13} style={{ opacity: 0.35, marginLeft: '5px' }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={13} style={{ color: 'var(--accent-primary)', marginLeft: '5px' }} />
    ) : (
      <ArrowDown size={13} style={{ color: 'var(--accent-primary)', marginLeft: '5px' }} />
    );
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
      <tr
        key={`dt-skeleton-row-${rowIndex}`}
        style={{
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {columns.map((col, colIndex) => (
          <td
            key={`dt-skeleton-cell-${colIndex}`}
            style={{
              padding: col.cellPadding || '1rem',
              textAlign: col.align || 'left',
              width: col.width,
            }}
          >
            {col.skeletonRender ? (
              col.skeletonRender()
            ) : (
              <Skeleton
                width={col.skeletonWidth || '65%'}
                height={col.skeletonHeight || '0.875rem'}
                borderRadius={col.skeletonRadius || 'var(--radius-sm)'}
              />
            )}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div
      className="glass-panel"
      style={{
        overflowX: 'auto',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {columns.map((col) => {
              const isSortable = col.sortable && onSort;
              return (
                <th
                  key={col.key}
                  onClick={isSortable ? () => onSort(col.key) : undefined}
                  style={{
                    padding: col.headerPadding || '0.875rem 1rem',
                    cursor: isSortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    width: col.width,
                    textAlign: col.align || 'left',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start',
                      width: col.align === 'right' ? '100%' : 'auto',
                    }}
                  >
                    {col.headerIcon && <span style={{ marginRight: '6px' }}>{col.headerIcon}</span>}
                    <span>{col.label}</span>
                    {isSortable && renderSortIcon(col.key)}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? renderSkeletonRows()
            : data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    transition: 'background-color var(--transition-fast)',
                  }}
                  className="table-row-hover"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: col.cellPadding || '1rem',
                        textAlign: col.align || 'left',
                        color: col.color || 'inherit',
                      }}
                    >
                      {col.render ? col.render(item, index) : item[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};
