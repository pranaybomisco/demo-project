import React, { useState, useEffect } from 'react';
import { Modal } from '../components/modal.jsx';
import { Input } from '../components/input.jsx';
import { Textarea } from '../components/textarea.jsx';
import { Button } from '../components/button.jsx';
import { BUTTON_LABELS, PLACEHOLDERS } from '../../constants/index.js';

export const ProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  project = null,
  isLoading = false,
}) => {
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [project, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      await onSubmit(formData);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Input
          label="Project Name"
          name="name"
          placeholder={PLACEHOLDERS.PROJECT_NAME}
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Textarea
          label="Description"
          name="description"
          placeholder={PLACEHOLDERS.PROJECT_DESC}
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            {BUTTON_LABELS.CANCEL}
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? BUTTON_LABELS.SAVE_CHANGES : BUTTON_LABELS.CREATE_PROJECT}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
