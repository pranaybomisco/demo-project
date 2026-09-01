import React, { useState, useEffect } from 'react';
import { Modal } from '../components/modal.jsx';
import { Input } from '../components/input.jsx';
import { Select } from '../components/select.jsx';
import { Textarea } from '../components/textarea.jsx';
import { Button } from '../components/button.jsx';
import {
  BUTTON_LABELS,
  PLACEHOLDERS,
  TASK_STATUS,
  STATUS_LABELS,
  TASK_PRIORITY,
  PRIORITY_LABELS,
} from '../../constants/index.js';

export const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task = null,
  projects = [],
  defaultProjectId = '',
  members = [],
  isLoading = false,
}) => {
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: '',
    projectId: defaultProjectId || '',
    assigneeId: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.TODO,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        projectId: task.projectId || '',
        assigneeId: task.assigneeId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: '',
        projectId: defaultProjectId || (projects[0]?.id || ''),
        assigneeId: '',
      });
    }
  }, [task, defaultProjectId, projects, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      await onSubmit({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        assigneeId: formData.assigneeId || null,
        description: formData.description || null,
      });
      onClose();
    }
  };

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.name }));
  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map((m) => ({ value: m.userId || m.id, label: m.user?.name || m.name })),
  ];

  const statusOptions = [
    { value: TASK_STATUS.TODO, label: STATUS_LABELS[TASK_STATUS.TODO] },
    { value: TASK_STATUS.IN_PROGRESS, label: STATUS_LABELS[TASK_STATUS.IN_PROGRESS] },
    { value: TASK_STATUS.DONE, label: STATUS_LABELS[TASK_STATUS.DONE] },
  ];

  const priorityOptions = [
    { value: TASK_PRIORITY.LOW, label: PRIORITY_LABELS[TASK_PRIORITY.LOW] },
    { value: TASK_PRIORITY.MEDIUM, label: PRIORITY_LABELS[TASK_PRIORITY.MEDIUM] },
    { value: TASK_PRIORITY.HIGH, label: PRIORITY_LABELS[TASK_PRIORITY.HIGH] },
    { value: TASK_PRIORITY.CRITICAL, label: PRIORITY_LABELS[TASK_PRIORITY.CRITICAL] },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Task Title"
          name="title"
          placeholder={PLACEHOLDERS.TASK_TITLE}
          value={formData.title}
          onChange={handleChange}
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Select
            label="Project"
            name="projectId"
            options={projectOptions}
            value={formData.projectId}
            onChange={handleChange}
            disabled={isEditing || !!defaultProjectId}
            required
          />

          <Select
            label="Assignee"
            name="assigneeId"
            options={memberOptions}
            value={formData.assigneeId}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <Select
            label="Status"
            name="status"
            options={statusOptions}
            value={formData.status}
            onChange={handleChange}
          />

          <Select
            label="Priority"
            name="priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={handleChange}
          />

          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <Textarea
          label="Description"
          name="description"
          placeholder={PLACEHOLDERS.TASK_DESC}
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            {BUTTON_LABELS.CANCEL}
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? BUTTON_LABELS.SAVE_CHANGES : BUTTON_LABELS.CREATE_TASK}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
