import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export const Pagination = ({
  pagination,
  onPageChange,
  onLimitChange,
  limitOptions = [5, 10, 20, 50],
  itemLabel = 'items',
}) => {
  if (!pagination || pagination.total === 0) return null;

  const { page, limit, total, totalPages } = pagination;

  const from = Math.min((page - 1) * limit + 1, total);
  const to = Math.min(page * limit, total);

  // Generate page numbers with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        marginTop: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.875rem',
      }}
    >
      {/* Items Range & Page Size Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{from}</strong> –{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{to}</strong> of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> {itemLabel}
        </span>

        {onLimitChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Per page:</span>
            <select
              className="form-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              style={{
                padding: '0.25rem 0.6rem',
                width: 'auto',
                fontSize: '0.8125rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="btn btn-ghost btn-sm"
          title="First Page"
          aria-label="First Page"
          style={{ padding: '0.4rem', border: '1px solid var(--border-color)' }}
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn btn-ghost btn-sm"
          title="Previous Page"
          aria-label="Previous Page"
          style={{ padding: '0.4rem', border: '1px solid var(--border-color)' }}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Numbered Page Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0 0.25rem' }}>
          {getPageNumbers().map((p, idx) =>
            p === '...' ? (
              <span
                key={`ellipsis-${idx}`}
                style={{ padding: '0 0.4rem', color: 'var(--text-muted)' }}
              >
                …
              </span>
            ) : (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(p)}
                className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  minWidth: '32px',
                  height: '32px',
                  padding: 0,
                  fontWeight: p === page ? 700 : 500,
                  border: p === page ? 'none' : '1px solid var(--border-color)',
                }}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn btn-ghost btn-sm"
          title="Next Page"
          aria-label="Next Page"
          style={{ padding: '0.4rem', border: '1px solid var(--border-color)' }}
        >
          <ChevronRight size={16} />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="btn btn-ghost btn-sm"
          title="Last Page"
          aria-label="Last Page"
          style={{ padding: '0.4rem', border: '1px solid var(--border-color)' }}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};
