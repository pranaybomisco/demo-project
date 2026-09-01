import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './protectedroute.jsx';
import { AppLayout } from '../views/layout/applayout.jsx';
import { RouteSkeleton } from '../views/components/routeskeleton.jsx';
import { APP_ROUTES } from '../constants/index.js';

// 🚀 OPTIMIZED CODE SPLITTING: Dynamic route imports via React.lazy()
// Each page route is split into its own lightweight async JavaScript chunk.
const LoginPage = lazy(() => import('../pages/loginpage.jsx'));
const RegisterPage = lazy(() => import('../pages/registerpage.jsx'));
const DashboardPage = lazy(() => import('../pages/dashboardpage.jsx'));
const ProjectsPage = lazy(() => import('../pages/projectspage.jsx'));
const ProjectDetailPage = lazy(() => import('../pages/projectdetailpage.jsx'));
const TasksPage = lazy(() => import('../pages/taskspage.jsx'));
const ProfilePage = lazy(() => import('../pages/profilepage.jsx'));
const NotFoundPage = lazy(() => import('../pages/notfoundpage.jsx'));

export const LazyRouter = () => {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        {/* Public Routes (Lazy Loaded) */}
        <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected Routes (Lazy Loaded with App Shell Layout) */}
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
    </Suspense>
  );
};

export default LazyRouter;
