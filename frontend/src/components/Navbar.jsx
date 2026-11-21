import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import { 
  ShoppingBag, User, Shield, LogOut, Package, PlusCircle, Sun, Moon,
  Menu, X, Home as HomeIcon, Layers, Info, LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isClient } = useAuth();
  const { totalItems } = useCart();
  const { toggleTheme, isDark } = useTheme();
  const { t } = useLanguage();
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
        <Link to={user ? "/" : "/products"} className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
          <img 
            src="/JomnenhKH.jpg" 
            alt="Jomnenh-Kh Logo" 
            className="navbar-brand-logo-img" 
          />
          <span className="logo-text">Jomnenh<span className="logo-accent">-Kh</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            {t('nav.home', 'Home')}
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
            {t('nav.products', 'Products')}
          </NavLink>
          {(!user || isAdmin) && (
            <NavLink to="/products/manage" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <span className="flex items-center gap-1.5">
                <Package size={15} /> {t('nav.manage', 'Manage')}
              </span>
            </NavLink>
          )}
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('nav.services', 'Services')}
          </NavLink>
          <NavLink to="/about-us" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {t('nav.aboutUs', 'About Us')}
          </NavLink>
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Universal Language Selector Dropdown */}
          <LanguageSelector />

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
          <Link 
            to="/cart" 
            className="cart-btn" 
            title="View Cart" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {/* Quick Profile Link (Mobile & Desktop) */}
          <Link 
            to={user ? "/settings" : "/login"} 
            className="cart-btn mobile-only-profile" 
            title={user ? "View My Account" : "Sign In"} 
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={19} />
          </Link>

          {/* Desktop User State */}
          {user ? (
            <div className="user-dropdown desktop-only-auth">
              <Link to="/settings" className="user-pill" title="View My Account">
                <span className="user-name">{user.fullName.split(' ')[0]}</span>
                {isAdmin && <span className="role-tag admin">Admin</span>}
                {!isAdmin && isClient && <span className="role-tag client">Client</span>}
              </Link>

              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="dropdown-user-name">{user.fullName}</p>
                  <p className="dropdown-email">{user.email}</p>
                </div>

                <div className="dropdown-divider" />

                <Link to="/settings" className="dropdown-item">
                  <User size={16} /> {t('nav.accountSettings', 'Account Settings')}
                </Link>

                {isAdmin && (
                  <Link to="/products/manage" className="dropdown-item">
                    <Package size={16} /> {t('nav.manage', 'Manage')}
                  </Link>
                )}

                {isClient && (
                  <Link to="/client/deploy" className="dropdown-item">
                    <PlusCircle size={16} /> {t('nav.deployProduct', 'Deploy Product (Client)')}
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin" className="dropdown-item admin-link">
                    <Shield size={16} /> {t('nav.adminDashboard', 'Admin Dashboard')}
                  </Link>
                )}

                <div className="dropdown-divider" />

                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <LogOut size={16} /> {t('nav.signOut', 'Sign Out')}
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons desktop-only-auth">
              <Link to="/login" className="btn-secondary btn-sm">{t('nav.signIn', 'Sign In')}</Link>
              <Link to="/register" className="btn-primary btn-sm">{t('nav.getStarted', 'Get Started')}</Link>
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

      {/* Mobile Phone Appbar (Second Tier / Row on Phone View) */}
      <nav className="navbar-mobile-appbar" aria-label="Mobile Navigation Appbar">
        <NavLink to="/" className={({ isActive }) => `mobile-appbar-item ${isActive ? 'active' : ''}`} end>
          <HomeIcon size={15} />
          <span>{t('nav.home', 'Home')}</span>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `mobile-appbar-item ${isActive ? 'active' : ''}`} end>
          <Package size={15} />
          <span>{t('nav.products', 'Products')}</span>
        </NavLink>
        {(!user || isAdmin) && (
          <NavLink to="/products/manage" className={({ isActive }) => `mobile-appbar-item highlight-manage ${isActive ? 'active' : ''}`}>
            <Package size={15} />
            <span>{t('nav.manage', 'Manage')}</span>
          </NavLink>
        )}
        <NavLink to="/services" className={({ isActive }) => `mobile-appbar-item ${isActive ? 'active' : ''}`}>
          <Layers size={15} />
          <span>{t('nav.services', 'Services')}</span>
        </NavLink>
        <NavLink to="/about-us" className={({ isActive }) => `mobile-appbar-item ${isActive ? 'active' : ''}`}>
          <Info size={15} />
          <span>{t('nav.aboutUs', 'About Us')}</span>
        </NavLink>
      </nav>

      {/* Mobile Drawer / Dropdown Sheet */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Top Language & Theme Bar in Mobile Drawer */}
            <div className="mobile-lang-theme-bar flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--border-color)]">
              <LanguageSelector />
              <button 
                className="theme-toggle-btn !w-9 !h-9"
                onClick={toggleTheme}
                title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle dark/light theme"
              >
                {isDark ? (
                  <Sun size={17} className="theme-icon sun-icon text-amber-400" />
                ) : (
                  <Moon size={17} className="theme-icon moon-icon text-indigo-500" />
                )}
              </button>
            </div>

            {/* User Profile Banner (if logged in) */}
            {user ? (
              <Link to="/settings" className="mobile-user-card" onClick={() => setMobileMenuOpen(false)} title="View My Account">
                <div className="mobile-user-info">
                  <div className="mobile-user-name">{user.fullName}</div>
                  <div className="mobile-user-email">{user.email}</div>
                  <div className="mobile-user-badges">
                    {isAdmin && <span className="role-tag admin">Admin</span>}
                    {!isAdmin && isClient && <span className="role-tag client">Client</span>}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="mobile-auth-actions">
                <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.signIn', 'Sign In')}
                </Link>
                <Link to="/register" className="btn-primary w-full text-center" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav.getStarted', 'Get Started')}
                </Link>
              </div>
            )}

            {/* Quick Access Account / Admin Portal Links */}
            <div className="mobile-nav-list">
              {isAdmin && (
                <NavLink to="/admin" className={({ isActive }) => `mobile-nav-item highlight-admin ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard size={17} /> {t('nav.adminDashboard', 'Admin Dashboard')}
                </NavLink>
              )}
              {user && (
                <NavLink to="/cart" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <ShoppingBag size={17} /> {t('nav.cart', 'Shopping Cart')} {totalItems > 0 ? `(${totalItems})` : ''}
                </NavLink>
              )}
              {user && (
                <NavLink to="/settings" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  <User size={17} /> {t('nav.accountSettings', 'Account Settings')}
                </NavLink>
              )}
            </div>

            {user && (
              <div className="mobile-drawer-footer">
                <button onClick={handleLogout} className="mobile-signout-btn">
                  <LogOut size={16} /> {t('nav.signOut', 'Sign Out')}
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
