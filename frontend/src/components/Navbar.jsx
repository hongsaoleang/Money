import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingBag, User, Shield, LogOut, Code, Package, PlusCircle, Sun, Moon,
  Menu, X, Home as HomeIcon, Layers, Info, LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isClient } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon">
            <Code size={20} />
          </div>
          <span className="logo-text">Jomnenh<span className="logo-accent">-KH</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            Products
          </NavLink>
          {isAdmin && (
            <NavLink to="/products/manage" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <span className="flex items-center gap-1.5">
                <Package size={15} /> Manage (CRUD)
              </span>
            </NavLink>
          )}
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Services
          </NavLink>
          <NavLink to="/about-us" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            About Us
          </NavLink>
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Theme Mode Toggle Button */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle dark/light theme"
          >
            {isDark ? (
              <Sun size={18} className="theme-icon sun-icon text-amber-400" />
            ) : (
              <Moon size={18} className="theme-icon moon-icon text-indigo-500" />
            )}
          </button>

          {/* Cart */}
          <Link to="/cart" className="cart-btn" title="View Cart" onClick={() => setMobileMenuOpen(false)}>
            <ShoppingBag size={19} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {/* Desktop User State */}
          {user ? (
            <div className="user-dropdown desktop-only-auth">
              <div className="user-pill">
                <span className="user-avatar">{user.fullName.charAt(0)}</span>
                <span className="user-name">{user.fullName.split(' ')[0]}</span>
                {isAdmin && <span className="role-tag admin">Admin</span>}
                {!isAdmin && isClient && <span className="role-tag client">Client</span>}
              </div>

              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">{user.fullName}</p>
                  <p className="dropdown-email">{user.email}</p>
                </div>

                <div className="dropdown-divider" />

                <Link to="/settings" className="dropdown-item">
                  <User size={16} /> Account Settings
                </Link>

                {isAdmin && (
                  <Link to="/products/manage" className="dropdown-item">
                    <Package size={16} /> Manage Products (CRUD)
                  </Link>
                )}

                {isClient && (
                  <Link to="/client/deploy" className="dropdown-item">
                    <PlusCircle size={16} /> Deploy Product (Client)
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin" className="dropdown-item admin-link">
                    <Shield size={16} /> Admin Dashboard
                  </Link>
                )}

                <div className="dropdown-divider" />

                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons desktop-only-auth">
              <Link to="/login" className="btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            {/* User Profile Banner (if logged in) */}
            {user ? (
              <div className="mobile-user-card">
                <div className="mobile-user-avatar">{user.fullName.charAt(0)}</div>
                <div className="mobile-user-info">
                  <div className="mobile-user-name">{user.fullName}</div>
                  <div className="mobile-user-email">{user.email}</div>
                  <div className="mobile-user-badges">
                    {isAdmin && <span className="role-tag admin">Admin</span>}
                    {!isAdmin && isClient && <span className="role-tag client">Client</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}

            <div className="mobile-nav-list">
              <NavLink to="/" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} end onClick={() => setMobileMenuOpen(false)}>
                <HomeIcon size={17} /> Home
              </NavLink>
              <NavLink to="/products" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} end onClick={() => setMobileMenuOpen(false)}>
                <Package size={17} /> Products & Hardware
              </NavLink>
              {isAdmin && (
                <NavLink to="/products/manage" className={({ isActive }) => `mobile-nav-item highlight-admin ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <Package size={17} /> Manage (CRUD)
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `mobile-nav-item highlight-admin ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard size={17} /> Admin Dashboard
                </NavLink>
              )}
              <NavLink to="/services" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <Layers size={17} /> Services & Solutions
              </NavLink>
              <NavLink to="/about-us" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                <Info size={17} /> About Us
              </NavLink>
              {user && (
                <NavLink to="/settings" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <User size={17} /> Account Settings
                </NavLink>
              )}
            </div>

            {user && (
              <div className="mobile-drawer-footer">
                <button onClick={handleLogout} className="mobile-signout-btn">
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
  );
};

export default Navbar;
