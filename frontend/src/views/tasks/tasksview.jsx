import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../redux/slices/taskslice.js';
import { fetchProjects } from '../../redux/slices/projectslice.js';
import { useQueryParams } from '../../hooks/useQueryParams.js';
import { TaskTableView } from './tasktableview.jsx';
import { TaskBoardView } from './taskboardview.jsx';
import { TaskFilterBar } from './taskfilterbar.jsx';
import { Pagination } from '../components/pagination.jsx';
import { TaskModal } from './taskmodal.jsx';
import { ConfirmModal } from '../components/confirmmodal.jsx';
import { BUTTON_LABELS, UI_MESSAGES } from '../../constants/index.js';

export const TasksView = ({ isModalOpen, setIsModalOpen, selectedTask, setSelectedTask }) => {
  const dispatch = useDispatch();

  const { list: tasks, pagination, isLoading: isTasksLoading } = useSelector((state) => state.tasks);
  const { list: projects } = useSelector((state) => state.projects);

  const {
    page,
    limit,
    search,
    status,
    priority,
    projectId,
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
  } = useQueryParams();

  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const apiParamsKey = JSON.stringify(apiParams);
  useEffect(() => {
    dispatch(fetchTasks(apiParams));
  }, [dispatch, apiParamsKey]);

  const handleTaskSubmit = async (formData) => {
    if (selectedTask) {
      await dispatch(updateTask({ id: selectedTask.id, data: formData }));
    } else {
      await dispatch(createTask(formData));
    }
    setIsModalOpen(false);
    setSelectedTask(null);
    dispatch(fetchTasks(apiParams));
  };

  const handleDeleteConfirm = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete.id));
      setTaskToDelete(null);
      dispatch(fetchTasks(apiParams));
    }
  };

  const handleSortOrderToggle = () => {
    setSort(sortBy);
  };

  return (
    <div>
      {/* URL-Synchronized Filter & Control Bar */}
      <TaskFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={(val) => setFilter('status', val)}
        priority={priority}
        onPriorityChange={(val) => setFilter('priority', val)}
        projectId={projectId}
        onProjectChange={(val) => setFilter('projectId', val)}
        sortBy={sortBy}
        onSortByChange={(val) => setFilter('sortBy', val)}
        sortOrder={sortOrder}
        onSortOrderToggle={handleSortOrderToggle}
        view={view}
        onViewChange={setView}
        projects={projects}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {/* Main Task List Content */}
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
          onSort={setSort}
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

      {/* Fully Optimized URL-Synced Pagination Bar */}
      {pagination && pagination.total > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          onLimitChange={setLimit}
          limitOptions={[5, 10, 20, 50]}
          itemLabel="tasks"
        />
      )}

      {/* Task Create / Edit Modal */}
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

      {/* Delete Confirmation Modal */}
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
