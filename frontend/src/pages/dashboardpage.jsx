import React from 'react';
import { DashboardView } from '../views/dashboard/dashboardview.jsx';
import { UI_MESSAGES } from '../constants/index.js';

export const DashboardPage = () => {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{UI_MESSAGES.DASHBOARD_TITLE}</h1>
          <p className="page-header-subtitle">{UI_MESSAGES.DASHBOARD_SUBTITLE}</p>
        </div>
      </div>

      <DashboardView />
    </div>
  );
};
