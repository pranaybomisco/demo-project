import { useState, useEffect } from 'react';
import { apiMetricsTracker } from '../services/api.service.js';

/**
 * Custom hook that subscribes to real-time API response times across the application.
 */
export const useApiLatency = (filterUrlKeyword = '') => {
  const [metric, setMetric] = useState(apiMetricsTracker.getLatest());

  useEffect(() => {
    const unsubscribe = apiMetricsTracker.subscribe((latest) => {
      if (!filterUrlKeyword || latest.url.toLowerCase().includes(filterUrlKeyword.toLowerCase())) {
        setMetric(latest);
      }
    });

    return unsubscribe;
  }, [filterUrlKeyword]);

  return metric;
};

export default useApiLatency;
