import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authslice.js';
import projectReducer from './slices/projectslice.js';
import taskReducer from './slices/taskslice.js';
import dashboardReducer from './slices/dashboardslice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
