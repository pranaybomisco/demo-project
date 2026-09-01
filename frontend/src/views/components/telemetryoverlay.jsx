import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApiLatency } from '../../hooks/useApiLatency.js';
import { renderMetricsTracker } from '../../services/api.service.js';
import { Activity, Server, Cpu, RefreshCw, ChevronUp, ChevronDown, Sparkles, Layers, Zap } from 'lucide-react';

/**
 * Floating Telemetry Overlay HUD.
 * Displays real-time API Latency, React Render Timing, Re-renders, and Network health.
 */
export const TelemetryOverlay = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const location = useLocation();

  const startTimeRef = useRef(performance.now());
  const renderSpanRef = useRef(null);
  const [renderTime, setRenderTime] = useState('1.2');

  // Track latest API metrics
  const apiMetric = useApiLatency();
  const apiDuration = apiMetric?.durationMs || 0;
  const serverDuration = apiMetric?.serverDurationMs || apiDuration;

  // Subscribe to component-level render broadcasts
  useEffect(() => {
    return renderMetricsTracker.subscribe((metric) => {
      if (metric?.durationMs) {
        setRenderTime(metric.durationMs);
        if (renderSpanRef.current) {
          renderSpanRef.current.textContent = `${metric.durationMs} ms`;
        }
      }
    });
  }, []);

  // Measure render & DOM paint duration on every route and state change
  startTimeRef.current = performance.now();

  useLayoutEffect(() => {
    const elapsed = Math.max(0.1, performance.now() - startTimeRef.current).toFixed(1);
    const lastComponent = renderMetricsTracker.getLatest();
    // Use the latest broadcasted render duration if recent (within 500ms), otherwise local elapsed
    const displayVal = (Date.now() - lastComponent.timestamp < 500 && parseFloat(lastComponent.durationMs) > parseFloat(elapsed))
      ? lastComponent.durationMs
      : elapsed;

    setRenderTime(displayVal);
    if (renderSpanRef.current) {
      renderSpanRef.current.textContent = `${displayVal} ms`;
    }
  });

  useEffect(() => {
    setRenderCount((prev) => prev + 1);
  }, [location.pathname, location.search, apiMetric]);

  const numRender = parseFloat(renderTime) || 0;
  const numApi = apiDuration || 0;

  // Dynamic health color thresholds
  const renderColor = numRender > 50 ? '#ef4444' : numRender > 16.6 ? '#f59e0b' : '#10b981';
  const apiColor = numApi > 250 ? '#ef4444' : numApi > 80 ? '#f59e0b' : '#10b981';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1.25rem',
        zIndex: 99999,
        pointerEvents: 'auto',
        fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      }}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '12px',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          color: '#f8fafc',
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: isExpanded ? '310px' : 'auto',
        }}
      >
        {/* Top Header Bar */}
        <div
          onClick={() => setIsExpanded((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.5rem 0.875rem',
            cursor: 'pointer',
            borderBottom: isExpanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
            background: isExpanded ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: renderColor === '#ef4444' || apiColor === '#ef4444' ? '#ef4444' : '#10b981',
                boxShadow: `0 0 8px ${renderColor === '#ef4444' || apiColor === '#ef4444' ? '#ef4444' : '#10b981'}`,
                animation: 'pulse 2s infinite',
              }}
            />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8' }}>
              Live Telemetry HUD
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!isExpanded && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: apiColor, fontWeight: 700 }}>⚡ {apiDuration}ms</span>
                <span style={{ opacity: 0.3 }}>|</span>
                <span style={{ color: renderColor, fontWeight: 700 }}>⏱️ {renderTime}ms</span>
              </div>
            )}

            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
              }}
              aria-label={isExpanded ? 'Collapse Telemetry' : 'Expand Telemetry'}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Expanded Metrics Breakdown */}
        {isExpanded && (
          <div style={{ padding: '0.75rem 0.875rem' }}>
            {/* Grid of Telemetry Chips */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.625rem' }}>
              {/* API Latency Card */}
              <div
                style={{
                  padding: '0.5rem 0.625rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${apiColor}35`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8', fontWeight: 700 }}>
                  <Server size={11} style={{ color: apiColor }} />
                  <span>API Latency</span>
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: apiColor, marginTop: '0.15rem' }}>
                  {apiDuration > 0 ? (
                    <>
                      <span>{apiDuration}</span>
                      <span style={{ fontSize: '0.75rem', marginLeft: '0.15rem', fontWeight: 600 }}>ms</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Ready</span>
                  )}
                </div>
                {serverDuration > 0 && (
                  <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                    Server: {serverDuration}ms
                  </div>
                )}
              </div>

              {/* Render Latency Card */}
              <div
                style={{
                  padding: '0.5rem 0.625rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid ${renderColor}35`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#94a3b8', fontWeight: 700 }}>
                  <Cpu size={11} style={{ color: renderColor }} />
                  <span>UI Render</span>
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: renderColor, marginTop: '0.15rem' }}>
                  <span ref={renderSpanRef}>{renderTime}</span>
                  <span style={{ fontSize: '0.75rem', marginLeft: '0.15rem', fontWeight: 600 }}>ms</span>
                </div>
                <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                  {numRender < 16.6 ? '60 FPS Smooth' : 'Main-thread lag'}
                </div>
              </div>
            </div>

            {/* Bottom Details Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: '#94a3b8',
                paddingTop: '0.4rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <RefreshCw size={11} />
                <span>Renders: {renderCount}</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {apiMetric?.url ? `${apiMetric.method} ${apiMetric.url}` : location.pathname}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemetryOverlay;
