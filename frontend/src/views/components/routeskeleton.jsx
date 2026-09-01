import React from 'react';
import { Skeleton } from './skeleton.jsx';

export const RouteSkeleton = () => {
  return (
    <div style={{ padding: '1.5rem 0', width: '100%' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Skeleton width="220px" height="32px" style={{ marginBottom: '0.5rem' }} />
          <Skeleton width="340px" height="18px" />
        </div>
        <Skeleton width="130px" height="40px" style={{ borderRadius: 'var(--radius-md)' }} />
      </div>

      {/* Top Stat Cards Skeleton */}
      <div className="grid-4-col" style={{ marginBottom: '2rem' }}>
        <Skeleton height="110px" style={{ borderRadius: 'var(--radius-md)' }} />
        <Skeleton height="110px" style={{ borderRadius: 'var(--radius-md)' }} />
        <Skeleton height="110px" style={{ borderRadius: 'var(--radius-md)' }} />
        <Skeleton height="110px" style={{ borderRadius: 'var(--radius-md)' }} />
      </div>

      {/* Main Table / Grid Content Skeleton */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Skeleton width="280px" height="38px" />
          <Skeleton width="120px" height="38px" />
          <Skeleton width="120px" height="38px" />
        </div>
        <Skeleton height="45px" style={{ marginBottom: '0.75rem' }} />
        <Skeleton height="45px" style={{ marginBottom: '0.75rem' }} />
        <Skeleton height="45px" style={{ marginBottom: '0.75rem' }} />
        <Skeleton height="45px" style={{ marginBottom: '0.75rem' }} />
        <Skeleton height="45px" />
      </div>
    </div>
  );
};

export default RouteSkeleton;
