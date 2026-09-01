import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './protectedroute.jsx';
import { AppLayout } from '../views/layout/applayout.jsx';

// 💥 UNOPTIMIZED / MONOLITHIC: Synchronous eager imports of all pages
// Every route, form, and dependency is bundled into a single massive upfront bundle.
import LoginPage from '../pages/loginpage.jsx';
import RegisterPage from '../pages/registerpage.jsx';
import DashboardPage from '../pages/dashboardpage.jsx';
import ProjectsPage from '../pages/projectspage.jsx';
import ProjectDetailPage from '../pages/projectdetailpage.jsx';
import TasksPage from '../pages/taskspage.jsx';
import ProfilePage from '../pages/profilepage.jsx';
import NotFoundPage from '../pages/notfoundpage.jsx';
import { APP_ROUTES } from '../constants/index.js';

export const EagerRouter = () => {
  return (
    <Routes>
      {/* Public Routes (Monolithic Eager Loaded) */}
      <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={APP_ROUTES.HOME} element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
          <Route path={APP_ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={APP_ROUTES.PROJECTS} element={<ProjectsPage />} />
          <Route path={APP_ROUTES.PROJECT_DETAIL} element={<ProjectDetailPage />} />
          <Route path={APP_ROUTES.TASKS} element={<TasksPage />} />
          <Route path={APP_ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Catch-all 404 Route */}
      <Route path={APP_ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
};

export default EagerRouter;
