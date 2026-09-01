import React from 'react';
// 🔄 ARCHITECTURE MODE SWITCH TARGET:
// To demonstrate Code Splitting vs Monolithic Bundle:
// - Optimized (Lazy Code Splitting): import { EagerRouter as RouterImplementation } from './eagerrouter.jsx';
// - Unoptimized (Monolithic Eager):  import { LazyRouter as RouterImplementation } from './lazyrouter.jsx';
import { LazyRouter as RouterImplementation } from './lazyrouter.jsx';

export const AppRouter = () => {
  return <RouterImplementation />;
};

export default AppRouter;
