import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../app/providers/themeprovider.jsx';

export const ThemeToggle = ({ className = '', style = {} }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn-ghost ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-tertiary)',
        color: isDark ? '#fbbf24' : '#6366f1',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        ...style,
      }}
    >
      {isDark ? (
        <Sun size={18} style={{ transform: 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
      ) : (
        <Moon size={18} style={{ transform: 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
      )}
    </button>
  );
};
