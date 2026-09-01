import React from 'react';
import { Activity, Server, Zap, AlertTriangle, AlertCircle, RefreshCw, Cpu, Layers } from 'lucide-react';

/**
 * Enhanced Performance & Telemetry HUD with high-legibility typography,
 * dynamic color thresholds, and clear visual hierarchy.
 */
export const PerformanceMetricsBar = ({
  variant = 'optimized', // 'optimized' | 'unoptimized' | 'no-query-params'
  title = '',
  description = '',
  renderDuration = '1.2',
  renderTimeSpanRef = null,
  apiDuration = 0,
  serverDuration = 0,
  apiMethod = 'GET',
  apiUrl = '',
  renderCount = 1,
  itemCount = null,
  style = {},
}) => {
  const numRender = parseFloat(renderDuration) || 0;
  const numApi = apiDuration || serverDuration || 0;

  // Determine dynamic metric health colors
  const renderColor = numRender > 50 ? '#ef4444' : numRender > 16.6 ? '#f59e0b' : '#10b981';
  const apiColor = numApi > 250 ? '#ef4444' : numApi > 80 ? '#f59e0b' : '#10b981';

  // Theme palettes
  const themes = {
    optimized: {
      bg: 'rgba(16, 185, 129, 0.07)',
      border: 'rgba(16, 185, 129, 0.28)',
      headerBg: 'rgba(16, 185, 129, 0.15)',
      headerColor: '#10b981',
      icon: <Zap size={16} style={{ color: '#10b981' }} />,
      tag: 'OPTIMIZED (60 FPS)',
    },
    unoptimized: {
      bg: 'rgba(239, 68, 68, 0.08)',
      border: 'rgba(239, 68, 68, 0.35)',
      headerBg: 'rgba(239, 68, 68, 0.18)',
      headerColor: '#ef4444',
      icon: <AlertTriangle size={16} style={{ color: '#ef4444' }} />,
      tag: 'UNOPTIMIZED (BLOCKING LOAD)',
    },
    'no-query-params': {
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.35)',
      headerBg: 'rgba(245, 158, 11, 0.18)',
      headerColor: '#f59e0b',
      icon: <AlertCircle size={16} style={{ color: '#f59e0b' }} />,
      tag: 'NO QUERY PARAMS (LOCAL STATE)',
    },
  };

  const currentTheme = themes[variant] || themes.optimized;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.875rem',
        padding: '0.75rem 1.125rem',
        backgroundColor: currentTheme.bg,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: 'var(--radius-md, 10px)',
        marginBottom: '1.25rem',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)',
        ...style,
      }}
    >
      {/* Left: Mode Badge & Description */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '260px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: currentTheme.headerBg,
          }}
        >
          {currentTheme.icon}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: currentTheme.headerColor,
                backgroundColor: currentTheme.headerBg,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              {currentTheme.tag}
            </span>
            {title && (
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {title}
              </span>
            )}
          </div>

          {description && (
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Right: Key Telemetry Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
        {/* Render Latency Chip */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem',
            padding: '0.35rem 0.75rem',
            backgroundColor: 'var(--bg-secondary, rgba(255, 255, 255, 0.04))',
            borderRadius: '6px',
            border: `1px solid ${renderColor}40`,
            minWidth: '95px',
          }}
          title="Total computation, React reconciliation and DOM layout/painting time"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Cpu size={11} style={{ color: renderColor }} />
            <span>Render</span>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: renderColor }}>
            <span ref={renderTimeSpanRef}>{renderDuration}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, marginLeft: '0.15rem', opacity: 0.85 }}>ms</span>
          </div>
        </div>

        {/* Backend API Latency Chip */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem',
            padding: '0.35rem 0.75rem',
            backgroundColor: 'var(--bg-secondary, rgba(255, 255, 255, 0.04))',
            borderRadius: '6px',
            border: `1px solid ${apiColor}40`,
            minWidth: '95px',
          }}
          title={`Server execution: ${serverDuration}ms | Client round-trip latency: ${apiDuration}ms ${apiUrl ? `[${apiMethod} ${apiUrl}]` : ''}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
            <Server size={11} style={{ color: apiColor }} />
            <span>API Latency</span>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: apiColor }}>
            {numApi > 0 ? (
              <>
                <span>{numApi}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, marginLeft: '0.15rem', opacity: 0.85 }}>ms</span>
              </>
            ) : (
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)' }}>Ready</span>
            )}
          </div>
        </div>

        {/* Re-render Count Chip */}
        {renderCount !== undefined && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.15rem',
              padding: '0.35rem 0.65rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
            }}
            title="Total component re-renders during this session"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
              <RefreshCw size={10} />
              <span>Renders</span>
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {renderCount}
            </div>
          </div>
        )}

        {/* Rendered Items Count Chip */}
        {itemCount !== null && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.15rem',
              padding: '0.35rem 0.65rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
            }}
            title="Total elements currently mounted in browser DOM"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
              <Layers size={10} />
              <span>DOM Items</span>
            </div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {itemCount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMetricsBar;
