import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProjectDetail,
  addProjectMember,
  removeProjectMember,
} from '../../redux/slices/projectslice.js';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../../redux/slices/taskslice.js';
import { ProjectMembersView } from './projectmembersview.jsx';
import { TaskBoardView } from '../tasks/taskboardview.jsx';
import { TaskModal } from '../tasks/taskmodal.jsx';
import { ConfirmModal } from '../components/confirmmodal.jsx';
import { Button } from '../components/button.jsx';
import { Spinner } from '../components/spinner.jsx';
import { ArrowLeft, Plus, FolderKanban } from 'lucide-react';
import { APP_ROUTES, BUTTON_LABELS, UI_MESSAGES, ROLES } from '../../constants/index.js';

export const ProjectDetailView = ({ projectId }) => {
  const dispatch = useDispatch();

  const { currentProject, isLoading: isProjectLoading } = useSelector((state) => state.projects);
  const { list: tasks, isLoading: isTasksLoading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectDetail(projectId));
      dispatch(fetchTasks({ projectId }));
    }
  }, [dispatch, projectId]);

  const handleTaskSubmit = async (formData) => {
    if (selectedTask) {
      await dispatch(updateTask({ id: selectedTask.id, data: formData }));
    } else {
      await dispatch(createTask({ ...formData, projectId }));
    }
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTaskConfirm = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const handleAddMember = async (memberData) => {
    await dispatch(addProjectMember({ projectId, data: memberData }));
  };

  const handleRemoveMember = async (userId) => {
    await dispatch(removeProjectMember({ projectId, userId }));
  };

  if (isProjectLoading && !currentProject) {
    return <Spinner fullPage message="Loading project details..." />;
  }

  if (!currentProject) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h2>Project Not Found</h2>
        <Link to={APP_ROUTES.PROJECTS}>
          <Button variant="secondary" style={{ marginTop: '1rem' }}>
            {BUTTON_LABELS.BACK_TO_PROJECTS}
          </Button>
        </Link>
      </div>
    );
  }

  const canManage =
    user?.role === ROLES.ADMIN ||
    currentProject.ownerId === user?.id;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={APP_ROUTES.PROJECTS}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            textDecoration: 'none',
            marginBottom: '1rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>{BUTTON_LABELS.BACK_TO_PROJECTS}</span>
        </Link>

        <div className="page-header" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <FolderKanban size={24} />
            </div>
            <div>
              <h1>{currentProject.name}</h1>
              <p className="page-header-subtitle">
                {currentProject.description || 'No description provided.'}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
          >
            {BUTTON_LABELS.NEW_TASK}
          </Button>
        </div>
      </div>

      {/* Team Members Section */}
      <ProjectMembersView
        members={currentProject.members || []}
        ownerId={currentProject.ownerId}
        currentUserId={user?.id}
        canManage={canManage}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      {/* Project Tasks Kanban Board */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Sprint Tasks ({tasks.length})</h2>
        </div>

        {isTasksLoading ? (
          <Spinner message="Updating tasks..." />
        ) : (
          <TaskBoardView
            tasks={tasks}
            onEditTask={(task) => {
              setSelectedTask(task);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={(task) => setTaskToDelete(task)}
            onCreateTask={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={selectedTask}
        projects={[currentProject]}
        defaultProjectId={currentProject.id}
        members={currentProject.members || []}
      />

      {/* Delete Task Confirmation */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTaskConfirm}
        title="Delete Task"
        message={UI_MESSAGES.DELETE_TASK_CONFIRM}
        confirmLabel={BUTTON_LABELS.DELETE}
      />
    </div>
  );
};
