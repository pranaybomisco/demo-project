import React from 'react';
import { useParams } from 'react-router-dom';
import { ProjectDetailView } from '../views/projects/projectdetailview.jsx';

export const ProjectDetailPage = () => {
  const { id } = useParams();

  return <ProjectDetailView projectId={id} />;
};
