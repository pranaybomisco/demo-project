import React, { useState, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/authslice.js';
import { LogOut, User, Sparkles, Menu, X, Cpu } from 'lucide-react';
import { APP_ROUTES, BUTTON_LABELS } from '../../constants/index.js';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/themetoggle.jsx';
import { ApiLatencyBadge } from '../components/apilatencybadge.jsx';

// 🚀 Component-Level Lazy Loading: Chunk loaded on-demand when user clicks button
const HeavyReportModal = lazy(() => import('../components/heavyreportmodal.jsx'));

export const Navbar = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen = false,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          className="hamburger-btn"
          onClick={onToggleMobileSidebar}
          aria-label={isMobileSidebarOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          title={isMobileSidebarOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: 'var(--accent-primary)',
            fontWeight: 600,
          }}
        >
          <Sparkles size={14} />
          {/* <span className="header-badge-text">Clean Architecture</span> */}
        </div>

        {/* Dynamic Code Splitting Trigger Demo */}
        <button
          disabled
          type="button"
          onClick={() => setIsAuditModalOpen(true)}
          className="btn btn-secondary"
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            borderRadius: 'var(--radius-full)',
          }}
          title="Demonstrates on-demand component chunk loading via dynamic import()"
        >
          <Cpu size={13} />
          {/* <span>Audit Engine (Lazy Chunk)</span> */}
        </button>
      </div>

      {isAuditModalOpen && (
        <Suspense fallback={null}>
          <HeavyReportModal
            isOpen={isAuditModalOpen}
            onClose={() => setIsAuditModalOpen(false)}
          />
        </Suspense>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <ApiLatencyBadge compact />
        <ThemeToggle />

        {user && (
          <Link
            to={APP_ROUTES.PROFILE}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.875rem',
              }}
            >
              {user.name ? user.name[0].toUpperCase() : <User size={16} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</span>
            </div>
          </Link>
        )}

        <button
          onClick={() => dispatch(logoutUser())}
          className="btn btn-ghost"
          style={{ padding: '0.5rem', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          title={BUTTON_LABELS.SIGN_OUT}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

