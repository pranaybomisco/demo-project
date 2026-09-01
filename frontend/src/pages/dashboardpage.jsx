import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardView } from '../views/dashboard/dashboardview.jsx';
import { createTask } from '../redux/slices/taskslice.js';
import { createProject, fetchProjects } from '../redux/slices/projectslice.js';
import { fetchDashboardMetrics } from '../redux/slices/dashboardslice.js';
import { Button } from '../views/components/button.jsx';
import { TaskModal } from '../views/tasks/taskmodal.jsx';
import { ProjectModal } from '../views/projects/projectmodal.jsx';
import { Plus, CheckSquare, FolderPlus } from 'lucide-react';
import { BUTTON_LABELS, UI_MESSAGES, ROLES } from '../constants/index.js';

export const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: projects } = useSelector((state) => state.projects);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateTask = async (formData) => {
    await dispatch(createTask(formData));
    setIsTaskModalOpen(false);
    dispatch(fetchDashboardMetrics());
  };

  const handleCreateProject = async (formData) => {
    await dispatch(createProject(formData));
    setIsProjectModalOpen(false);
    dispatch(fetchDashboardMetrics());
    dispatch(fetchProjects());
  };

  const canCreateProject = user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{UI_MESSAGES.DASHBOARD_TITLE}</h1>
          <p className="page-header-subtitle">{UI_MESSAGES.DASHBOARD_SUBTITLE}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {canCreateProject && (
            <Button
              variant="secondary"
              leftIcon={<FolderPlus size={16} />}
              onClick={() => setIsProjectModalOpen(true)}
            >
              {BUTTON_LABELS.NEW_PROJECT}
            </Button>
          )}

          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsTaskModalOpen(true)}
          >
            {BUTTON_LABELS.NEW_TASK}
          </Button>
        </div>
      </div>

      <DashboardView />

      {/* Quick Task Creation Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={projects}
      />

      {/* Quick Project Creation Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default DashboardPage;
