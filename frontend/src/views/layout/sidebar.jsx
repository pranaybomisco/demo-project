import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  User,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { APP_ROUTES, UI_MESSAGES } from '../../constants/index.js';

export const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onToggleCollapse,
  onCloseMobile,
}) => {
  const navItems = [
    { label: 'Dashboard', path: APP_ROUTES.DASHBOARD, icon: <LayoutDashboard size={20} /> },
    { label: 'Projects', path: APP_ROUTES.PROJECTS, icon: <FolderKanban size={20} /> },
    { label: 'Tasks', path: APP_ROUTES.TASKS, icon: <CheckSquare size={20} /> },
    { label: 'Profile', path: APP_ROUTES.PROFILE, icon: <User size={20} /> },
  ];

  return (
    <aside
      className={`app-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Layers size={20} />
          </div>
          <div className="sidebar-brand-text">
            <h2 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
              {UI_MESSAGES.APP_TITLE}
            </h2>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Demo Architecture</span>
          </div>
        </div>

        {/* Mobile Close Button (visible only on mobile drawer) */}
        <button
          type="button"
          className="mobile-close-btn"
          onClick={onCloseMobile}
          aria-label="Close Sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive }) =>
              `nav-link-item ${isActive ? 'active' : ''}`
            }
          >
            {item.icon}
            <span className="nav-item-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Desktop Collapse / Expand Footer */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <>
              <ChevronLeft size={18} />
              <span className="sidebar-footer-text">Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

