import React, { useState, useEffect } from 'react';
import { Gauge, Zap, AlertTriangle } from 'lucide-react';

/**
 * Interactive Performance Mode Toggle Widget for Tech Talk Presentations.
 * Allows the speaker/developer to switch live between:
 * - 🚀 Optimized Mode (Fast, Paginated, Virtualized, Debounced, Skeleton Loading)
 * - ⚠️ Unoptimized Mode (In-render blocking calculations, 1,000 unvirtualized DOM nodes)
 */
export const PerformanceModeToggle = ({ isUnoptimized, onToggle }) => {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const calculateFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calculateFps);
    };

    animId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.625rem 1rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isUnoptimized ? 'rgba(239, 68, 68, 0.92)' : 'rgba(17, 24, 39, 0.88)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isUnoptimized ? 'var(--color-danger)' : 'var(--border-color)'}`,
        boxShadow: 'var(--shadow-xl)',
        color: 'white',
        fontSize: '0.8125rem',
        fontWeight: 600,
        transition: 'all var(--transition-normal)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <Gauge size={16} />
        <span style={{ fontFamily: 'var(--font-mono)' }}>{fps} FPS</span>
      </div>

      <div style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

      <button
        type="button"
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'none',
          border: 'none',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        {isUnoptimized ? (
          <>
            <AlertTriangle size={15} />
            <span>Mode: Unoptimized (Demo)</span>
          </>
        ) : (
          <>
            <Zap size={15} style={{ color: '#fbbf24' }} />
            <span>Mode: Optimized</span>
          </>
        )}
      </button>
    </div>
  );
};
