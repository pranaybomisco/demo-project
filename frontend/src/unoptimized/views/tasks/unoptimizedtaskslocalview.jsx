import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../../redux/slices/taskslice.js';
import { fetchProjects } from '../../../redux/slices/projectslice.js';
import { TaskTableView } from '../../../views/tasks/tasktableview.jsx';
import { TaskBoardView } from '../../../views/tasks/taskboardview.jsx';
import { TaskFilterBar } from '../../../views/tasks/taskfilterbar.jsx';
import { Pagination } from '../../../views/components/pagination.jsx';
import { TaskModal } from '../../../views/tasks/taskmodal.jsx';
import { ConfirmModal } from '../../../views/components/confirmmodal.jsx';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { BUTTON_LABELS, UI_MESSAGES } from '../../../constants/index.js';

/**
 * ⚠️ ANTI-PATTERN: Pagination WITHOUT Query Parameters
 * - Pagination & filters exist, but are stored ONLY in local React state (useState).
 * - Issues demonstrated in Tech Talk:
 *   1. Page Refresh Problem: Navigating to page 4 and pressing F5 resets everything back to page 1.
 *   2. Non-Shareable URLs: URL stays static ("/tasks") with zero query parameters.
 *   3. Broken Browser Navigation: Browser Back/Forward buttons do not restore previous pages or search states.
 */
export const UnoptimizedTasksLocalView = ({
  isModalOpen,
  setIsModalOpen,
  selectedTask,
  setSelectedTask,
}) => {
  const dispatch = useDispatch();

  const { list: tasks, pagination, isLoading: isTasksLoading } = useSelector((state) => state.tasks);
  const { list: projects } = useSelector((state) => state.projects);

  // ⚠️ Anti-pattern: Local state ONLY instead of URL Search Params (useQueryParams)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [projectId, setProjectId] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [view, setView] = useState('table');
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Fetch tasks whenever local state changes
  useEffect(() => {
    dispatch(
      fetchTasks({
        page,
        limit,
        search,
        status,
        priority,
        projectId,
        sortBy,
        sortOrder,
      })
    );
  }, [dispatch, page, limit, search, status, priority, projectId, sortBy, sortOrder]);

  const handleTaskSubmit = async (formData) => {
    if (selectedTask) {
      await dispatch(updateTask({ id: selectedTask.id, data: formData }));
    } else {
      await dispatch(createTask(formData));
    }
    setIsModalOpen(false);
    setSelectedTask(null);
    dispatch(
      fetchTasks({ page, limit, search, status, priority, projectId, sortBy, sortOrder })
    );
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete.id));
      setTaskToDelete(null);
      dispatch(
        fetchTasks({ page, limit, search, status, priority, projectId, sortBy, sortOrder })
      );
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setProjectId('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || status || priority || projectId);

  return (
    <div>
      {/* Educational Banner for Tech Talk */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>
            [NO QUERY PARAMS DEMO] Pagination is working (Page {page}), but stored only in local useState. Try refreshing the page (F5) or copying the URL to observe state loss!
          </span>
        </div>
      </div>

      {/* Local-State Filter Bar */}
      <TaskFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        priority={priority}
        onPriorityChange={(val) => {
          setPriority(val);
          setPage(1);
        }}
        projectId={projectId}
        onProjectChange={(val) => {
          setProjectId(val);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        view={view}
        onViewChange={setView}
        projects={projects}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Main Task View */}
      {view === 'board' ? (
        <TaskBoardView
          tasks={tasks}
          onEditTask={(task) => {
            setSelectedTask(task);
            setIsModalOpen(true);
          }}
          onDeleteTask={(task) => setTaskToDelete(task)}
          onCreateTask={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <TaskTableView
          tasks={tasks}
          isLoading={isTasksLoading}
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
          onEditTask={(task) => {
            setSelectedTask(task);
            setIsModalOpen(true);
          }}
          onDeleteTask={(task) => setTaskToDelete(task)}
          onCreateTask={() => {
            setSelectedTask(null);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Pagination without URL Sync */}
      {pagination && pagination.total > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          limitOptions={[5, 10, 20, 50]}
          itemLabel="tasks"
        />
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
        projects={projects}
      />

      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={UI_MESSAGES.DELETE_TASK_CONFIRM}
        confirmLabel={BUTTON_LABELS.DELETE}
      />
    </div>
  );
};
