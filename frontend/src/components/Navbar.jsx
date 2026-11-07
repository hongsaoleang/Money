import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, User, Shield, LogOut, Code, Package, PlusCircle, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isClient } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Code size={22} />
          </div>
          <span className="logo-text">Saoleang<span className="logo-accent">Tech</span></span>
        </Link>

        {/* Navigation Links */}
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
              <Sun size={19} className="theme-icon sun-icon text-amber-400" />
            ) : (
              <Moon size={19} className="theme-icon moon-icon text-indigo-500" />
            )}
          </button>

          {/* Cart */}
          <Link to="/cart" className="cart-btn" title="View Cart">
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {/* User State */}
          {user ? (
            <div className="user-dropdown">
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
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary">Sign In</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
