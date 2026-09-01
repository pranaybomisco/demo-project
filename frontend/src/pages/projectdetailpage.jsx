import React from 'react';
import { useParams } from 'react-router-dom';
import { UnoptimizedProjectDetailView as ProjectDetailView } from '../unoptimized/views/projects/unoptimizedprojectdetailview.jsx';

export const ProjectDetailPage = () => {
  const { id } = useParams();

  return <ProjectDetailView projectId={id} />;
};

export default ProjectDetailPage;
