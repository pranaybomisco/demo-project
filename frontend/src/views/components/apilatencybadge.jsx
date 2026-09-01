import React, { useRef, useLayoutEffect, useState } from 'react';
import { useApiLatency } from '../../hooks/useApiLatency.js';
import { Activity, Server, Cpu } from 'lucide-react';

export const ApiLatencyBadge = ({
  filterKeyword = '',
  label = 'Backend API',
  compact = false,
  showEndpoint = false,
  customDuration = null,
}) => {
  const metric = useApiLatency(filterKeyword);
  const duration = customDuration ?? metric?.durationMs ?? 0;
  const serverDuration = metric?.serverDurationMs ?? duration;

  const startTimeRef = useRef(performance.now());
  const [renderMs, setRenderMs] = useState('1.1');
  startTimeRef.current = performance.now();

  useLayoutEffect(() => {
    setRenderMs(Math.max(0.1, performance.now() - startTimeRef.current).toFixed(1));
  });

  // Determine color based on latency
  const color = duration > 300 ? 'var(--color-danger, #ef4444)' : duration > 100 ? '#f59e0b' : 'var(--color-success, #10b981)';
  const bg = duration > 300 ? 'rgba(239, 68, 68, 0.12)' : duration > 100 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)';
  const border = duration > 300 ? 'rgba(239, 68, 68, 0.3)' : duration > 100 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)';

  if (compact) {
    const renderColor = parseFloat(renderMs) > 50 ? '#ef4444' : parseFloat(renderMs) > 16.6 ? '#f59e0b' : '#10b981';

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.3rem 0.875rem',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}
        title={`API Response: ${duration}ms (Server: ${serverDuration}ms) | Render: ${renderMs}ms [${metric?.method || 'GET'} ${metric?.url || ''}]`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: color }}>
          <Activity size={13} style={{ color }} />
          <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.85 }}>API:</span>
          <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{duration > 0 ? `${duration}ms` : '—'}</span>
        </div>
        <span style={{ color: 'var(--border-color)', fontWeight: 300 }}>|</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: renderColor }}>
          <Cpu size={13} style={{ color: renderColor }} />
          <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.85 }}>Render:</span>
          <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{renderMs}ms</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.3rem 0.75rem',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.8125rem',
        color: color,
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
      }}
      title={`Server processing time: ${serverDuration}ms | Client round-trip latency: ${duration}ms`}
    >
      <Server size={14} />
      <span>{label}: {duration > 0 ? `${duration} ms` : 'Ready'}</span>
      {showEndpoint && metric?.url && (
        <span style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 400 }}>
          ({metric.method} {metric.url})
        </span>
      )}
    </div>
  );
};

export default ApiLatencyBadge;
