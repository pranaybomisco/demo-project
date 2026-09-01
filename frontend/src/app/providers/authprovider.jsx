import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../../redux/slices/authslice.js';
import { Preloader } from '../../views/components/preloader.jsx';

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(checkAuth()).finally(() => {
      setTimeout(() => {
        setIsInitialLoading(false);
      }, 250);
    });

    // Guaranteed fallback timer so preloader never stays stuck
    const fallbackTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800);

    return () => clearTimeout(fallbackTimer);
  }, [dispatch]);

  if (isInitialLoading) {
    return <Preloader fullScreen message="Initializing workspace..." />;
  }

  return <>{children}</>;
};
