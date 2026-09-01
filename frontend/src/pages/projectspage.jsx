import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { UnoptimizedProjectsLocalView as ProjectsView } from '../unoptimized/views/projects/unoptimizedprojectslocalview.jsx';
import { Button } from '../views/components/button.jsx';
import { Plus } from 'lucide-react';
import { BUTTON_LABELS, UI_MESSAGES, ROLES } from '../constants/index.js';

export const ProjectsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const canCreate = user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{UI_MESSAGES.PROJECTS_TITLE}</h1>
          <p className="page-header-subtitle">{UI_MESSAGES.PROJECTS_SUBTITLE}</p>
        </div>

        {canCreate && (
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setSelectedProject(null);
              setIsModalOpen(true);
            }}
          >
            {BUTTON_LABELS.NEW_PROJECT}
          </Button>
        )}
      </div>

      <ProjectsView
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
    </div>
  );
};
