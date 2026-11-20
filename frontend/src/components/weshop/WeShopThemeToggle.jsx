import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const WeShopThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="weshop-theme-toggle-btn"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle color theme"
    >
      {isDark ? (
        <Sun size={18} className="weshop-theme-icon text-amber-400" />
      ) : (
        <Moon size={18} className="weshop-theme-icon text-neutral-600" />
      )}
    </button>
  );
};

export default WeShopThemeToggle;
