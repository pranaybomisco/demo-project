import React from 'react';
import { Layers } from 'lucide-react';
import { UI_MESSAGES } from '../../constants/index.js';

export const Preloader = ({ message = 'Loading workspace...', fullScreen = false }) => {
  return (
    <div
      className={fullScreen ? 'preloader-fullscreen' : 'preloader-container'}
      role="status"
      aria-live="polite"
    >
      <div className="preloader-card glass-panel">
        <div className="preloader-logo-wrapper">
          <div className="preloader-logo-glow" />
          <div className="preloader-logo">
            <Layers size={28} />
          </div>
        </div>

        <div className="preloader-text-group">
          <h3 className="preloader-title">{UI_MESSAGES.APP_TITLE}</h3>
          <p className="preloader-message">{message}</p>
        </div>

        <div className="preloader-progress-track">
          <div className="preloader-progress-bar" />
        </div>
      </div>
    </div>
  );
};
