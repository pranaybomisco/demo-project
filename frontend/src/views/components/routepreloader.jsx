import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const RoutePreloader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Only trigger when navigating to a different page route
    if (prevPathRef.current === location.pathname) {
      return;
    }
    prevPathRef.current = location.pathname;

    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="top-progress-bar-container" aria-hidden="true">
      <div key={location.pathname} className="top-progress-bar animate-progress" />
    </div>
  );
};
