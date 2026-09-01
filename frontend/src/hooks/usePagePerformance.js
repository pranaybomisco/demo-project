import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useApiLatency } from './useApiLatency.js';

/**
 * Hook to measure in-browser Render Duration, Re-render Count, and API Response Time.
 */
export const usePagePerformance = ({ pageName = 'Page', filterKeyword = '' } = {}) => {
  const startTimeRef = useRef(performance.now());
  const renderTimeSpanRef = useRef(null);
  const renderCountRef = useRef(0);
  const [renderDuration, setRenderDuration] = useState('0.0');

  renderCountRef.current += 1;
  startTimeRef.current = performance.now();

  const apiMetric = useApiLatency(filterKeyword);

  useLayoutEffect(() => {
    const elapsed = Math.max(0.1, performance.now() - startTimeRef.current).toFixed(1);
    setRenderDuration(elapsed);
    if (renderTimeSpanRef.current) {
      renderTimeSpanRef.current.textContent = `${elapsed} ms`;
    }
  });

  const durationNum = parseFloat(renderDuration);
  const isFastRender = durationNum < 16; // 60 FPS standard (< 16.6ms)

  return {
    renderDuration,
    renderTimeSpanRef,
    renderCount: renderCountRef.current,
    isFastRender,
    apiDuration: apiMetric?.durationMs || 0,
    serverDuration: apiMetric?.serverDurationMs || 0,
    apiMethod: apiMetric?.method || 'GET',
    apiUrl: apiMetric?.url || '',
  };
};

export default usePagePerformance;
