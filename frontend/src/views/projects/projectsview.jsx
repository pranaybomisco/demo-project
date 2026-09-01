import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, updateProject, deleteProject } from '../../redux/slices/projectslice.js';
import { useQueryParams } from '../../hooks/useQueryParams.js';
import { ProjectCard } from './projectcard.jsx';
import { ProjectTableView } from './projecttableview.jsx';
import { ProjectFilterBar } from './projectfilterbar.jsx';
import { Pagination } from '../components/pagination.jsx';
import { ProjectModal } from './projectmodal.jsx';
import { ConfirmModal } from '../components/confirmmodal.jsx';
import { Skeleton } from '../components/skeleton.jsx';
import { BUTTON_LABELS, UI_MESSAGES, ROLES } from '../../constants/index.js';

export const ProjectsView = ({ isModalOpen, setIsModalOpen, selectedProject, setSelectedProject }) => {
  const dispatch = useDispatch();
  const { list: projects, pagination, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    view,
    apiParams,
    hasActiveFilters,
    setPage,
    setLimit,
    setSearch,
    setFilter,
    setSort,
    setView,
    clearFilters,
  } = useQueryParams({
    limit: 6,
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    view: 'grid',
  });

  const [projectToDelete, setProjectToDelete] = useState(null);

  const apiParamsKey = JSON.stringify(apiParams);
  useEffect(() => {
    dispatch(fetchProjects(apiParams));
  }, [dispatch, apiParamsKey]);

  const handleCreateOrUpdate = async (formData) => {
    if (selectedProject) {
      await dispatch(updateProject({ id: selectedProject.id, data: formData }));
    } else {
      await dispatch(createProject(formData));
    }
    setIsModalOpen(false);
    setSelectedProject(null);
    dispatch(fetchProjects(apiParams));
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      await dispatch(deleteProject(projectToDelete.id));
      setProjectToDelete(null);
      dispatch(fetchProjects(apiParams));
    }
  };

  const handleSortOrderToggle = () => {
    setSort(sortBy);
  };

  const canCreate = user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;

  return (
    <div>
      {/* URL-Synchronized Filter & Control Bar */}
      <ProjectFilterBar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortByChange={(val) => setFilter('sortBy', val)}
        sortOrder={sortOrder}
        onSortOrderToggle={handleSortOrderToggle}
        view={view}
        onViewChange={setView}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Main Project View Content */}
      {view === 'table' || view === 'list' ? (
        <ProjectTableView
          projects={projects}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSort}
          user={user}
          onEditProject={(p) => {
            setSelectedProject(p);
            setIsModalOpen(true);
          }}
          onDeleteProject={(p) => setProjectToDelete(p)}
          onCreateProject={canCreate ? () => {
            setSelectedProject(null);
            setIsModalOpen(true);
          } : null}
        />
      ) : isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-card-${i}`} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Skeleton width="40px" height="40px" borderRadius="var(--radius-sm)" />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <Skeleton width="70%" height="1.1rem" />
                  <Skeleton width="40%" height="0.75rem" />
                </div>
              </div>
              <Skeleton width="90%" height="0.875rem" />
              <Skeleton width="75%" height="0.875rem" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <Skeleton width="60px" height="24px" borderRadius="var(--radius-full)" />
                <Skeleton width="60px" height="24px" borderRadius="var(--radius-full)" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <ProjectTableView
          projects={[]}
          isLoading={false}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={setSort}
          user={user}
          onCreateProject={canCreate ? () => {
            setSelectedProject(null);
            setIsModalOpen(true);
          } : null}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project) => {
            const canManage =
              user?.role === ROLES.ADMIN ||
              project.ownerId === user?.id;

            return (
              <ProjectCard
                key={project.id}
                project={project}
                canManage={canManage}
                onEdit={(p) => {
                  setSelectedProject(p);
                  setIsModalOpen(true);
                }}
                onDelete={(p) => setProjectToDelete(p)}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          limitOptions={[6, 12, 24, 48]}
          itemLabel="projects"
        />
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleCreateOrUpdate}
        project={selectedProject}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={UI_MESSAGES.DELETE_PROJECT_CONFIRM}
        confirmLabel={BUTTON_LABELS.DELETE}
      />
    </div>
  );
};
