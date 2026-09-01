import React, { useState, useEffect } from 'react';
import { FormModal } from '../components/formmodal.jsx';
import { Input } from '../components/input.jsx';
import { Textarea } from '../components/textarea.jsx';
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
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      submitLabel={isEditing ? BUTTON_LABELS.SAVE_CHANGES : BUTTON_LABELS.CREATE_PROJECT}
      isLoading={isLoading}
    >
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
    </FormModal>
  );
};
