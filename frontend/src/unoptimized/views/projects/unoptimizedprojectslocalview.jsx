import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, updateProject, deleteProject } from '../../../redux/slices/projectslice.js';
import { ProjectCard } from '../../../views/projects/projectcard.jsx';
import { ProjectTableView } from '../../../views/projects/projecttableview.jsx';
import { ProjectFilterBar } from '../../../views/projects/projectfilterbar.jsx';
import { Pagination } from '../../../views/components/pagination.jsx';
import { ProjectModal } from '../../../views/projects/projectmodal.jsx';
import { ConfirmModal } from '../../../views/components/confirmmodal.jsx';
import { AlertCircle } from 'lucide-react';
import { BUTTON_LABELS, UI_MESSAGES, ROLES } from '../../../constants/index.js';

/**
 * ⚠️ ANTI-PATTERN: Project Pagination WITHOUT Query Parameters
 * - Pagination & filtering stored in local useState without URL search params.
 * - Refreshing the page (F5) or sharing URLs drops user back to Page 1 with lost filters.
 */
export const UnoptimizedProjectsLocalView = ({
  isModalOpen,
  setIsModalOpen,
  selectedProject,
  setSelectedProject,
}) => {
  const dispatch = useDispatch();
  const { list: projects, pagination, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  // ⚠️ Local React State ONLY (no URL query params)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [view, setView] = useState('grid');
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProjects({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      })
    );
  }, [dispatch, page, limit, search, sortBy, sortOrder]);

  const handleCreateOrUpdate = async (formData) => {
    if (selectedProject) {
      await dispatch(updateProject({ id: selectedProject.id, data: formData }));
    } else {
      await dispatch(createProject(formData));
    }
    setIsModalOpen(false);
    setSelectedProject(null);
    dispatch(fetchProjects({ page, limit, search, sortBy, sortOrder }));
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      await dispatch(deleteProject(projectToDelete.id));
      setProjectToDelete(null);
      dispatch(fetchProjects({ page, limit, search, sortBy, sortOrder }));
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setPage(1);
  };

  const canCreate = user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;

  return (
    <div>
      {/* Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.25rem',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid var(--color-warning)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          color: 'var(--color-warning)',
          fontSize: '0.8125rem',
          fontWeight: 600,
        }}
      >
        <AlertCircle size={18} />
        <span>
          [NO QUERY PARAMS DEMO] Projects pagination is active (Page {page}), but stored only in local state. URL is not synchronized!
        </span>
      </div>

      {/* Filter Bar */}
      <ProjectFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        view={view}
        onViewChange={setView}
        hasActiveFilters={Boolean(search)}
        onClearFilters={handleClearFilters}
      />

      {/* Main Content */}
      {view === 'table' || view === 'list' ? (
        <ProjectTableView
          projects={projects}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(key) => {
            if (sortBy === key) {
              setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
            } else {
              setSortBy(key);
              setSortOrder('desc');
            }
          }}
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
      ) : projects.length === 0 ? (
        <ProjectTableView
          projects={[]}
          isLoading={false}
          sortBy={sortBy}
          sortOrder={sortOrder}
          user={user}
          onCreateProject={canCreate ? () => {
            setSelectedProject(null);
            setIsModalOpen(true);
          } : null}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project) => {
            const canManage = user?.role === ROLES.ADMIN || project.ownerId === user?.id;

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
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          limitOptions={[6, 12, 24, 48]}
          itemLabel="projects"
        />
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        onSubmit={handleCreateOrUpdate}
        project={selectedProject}
      />

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
