import React from 'react';
import { Modal } from './modal.jsx';
import { Button } from './button.jsx';
import { BUTTON_LABELS } from '../../constants/index.js';

/**
 * Common, Reusable FormModal Component for create/edit entity workflows.
 * Handles:
 * - Modal presentation & escape/click-away dismissal
 * - Form submit handler wrapping
 * - Standardized responsive action buttons (Cancel & Submit)
 * - Loading & disabled state management
 */
export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  maxWidth = '550px',
  isLoading = false,
  submitLabel = BUTTON_LABELS.SAVE_CHANGES,
  cancelLabel = BUTTON_LABELS.CANCEL,
  children,
  extraActions = null,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={maxWidth}>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {children}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          {extraActions}
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
