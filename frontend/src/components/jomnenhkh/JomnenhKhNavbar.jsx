import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, ArrowRight, Home, Shirt, Laptop, Armchair, Coffee,
  ShoppingBag, LogOut, LayoutDashboard
} from 'lucide-react';
import JomnenhKhSearchBar from './JomnenhKhSearchBar';
import JomnenhKhThemeToggle from './JomnenhKhThemeToggle';
import JomnenhKhLanguageSelector from './JomnenhKhLanguageSelector';
import JomnenhKhPrimaryButton from './JomnenhKhPrimaryButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const JomnenhKhNavbar = ({ onExploreStoresClick }) => {
  const { t } = useLanguage();
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const marketplaceCategories = [
    { name: t('cat.home'), count: t('cat.homeCount'), icon: Home, path: '/products?category=Home' },
    { name: t('cat.apparel'), count: t('cat.apparelCount'), icon: Shirt, path: '/products?category=Apparel' },
    { name: t('cat.office'), count: t('cat.officeCount'), icon: Laptop, path: '/products?category=Hardware' },
    { name: t('cat.furniture'), count: t('cat.furnitureCount'), icon: Armchair, path: '/products?category=Furniture' },
    { name: t('cat.ceramics'), count: t('cat.ceramicsCount'), icon: Coffee, path: '/products?category=Kitchen' },
  ];

  // Close categories when clicking outside or resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExploreStores = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onExploreStoresClick) {
      onExploreStoresClick();
    } else {
      const el = document.getElementById('featured-stores');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/products');
      }
    }
  };

  return (
    <header className="jomnenhkh-navbar-root weshop-navbar-root">
      <div className="jomnenhkh-navbar-container weshop-navbar-container">
        {/* LEFT: Brand Logo & Main Nav Links */}
        <div className="jomnenhkh-nav-left weshop-nav-left">
          {/* Jomnenh-KH Logo linking directly to root / */}
          <Link to="/" className="jomnenhkh-logo-link weshop-logo-link" aria-label="Jomnenh-KH Home">
            <img
              src="/JomnenhKH.jpg"
              alt="Jomnenh-KH Logo"
              className="jomnenhkh-brand-logo-img weshop-brand-logo-img"
            />
            <span className="jomnenhkh-logo-script weshop-logo-script">
              Jomnenh<span className="jomnenhkh-logo-accent weshop-logo-accent">-KH</span>
            </span>
          </Link>

          {/* Navigation Links: Home, Products, Manage, Services, About Us, Categories */}
          <nav className="jomnenhkh-nav-links weshop-nav-links" aria-label="Main Navigation">
            <NavLink
              to="/"
              className={({ isActive }) => `jomnenhkh-nav-link weshop-nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) => `jomnenhkh-nav-link weshop-nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Products
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/products/manage"
                className={({ isActive }) => `jomnenhkh-nav-link weshop-nav-link ${isActive ? 'active' : ''}`}
              >
                Manage
              </NavLink>
            )}

            <NavLink
              to="/services"
              className={({ isActive }) => `jomnenhkh-nav-link weshop-nav-link ${isActive ? 'active' : ''}`}
            >
              Services
            </NavLink>

            <NavLink
              to="/about-us"
              className={({ isActive }) => `jomnenhkh-nav-link weshop-nav-link ${isActive ? 'active' : ''}`}
            >
              About Us
            </NavLink>

            <div className="jomnenhkh-categories-trigger-wrap weshop-categories-trigger-wrap">
              <button
                type="button"
                className={`jomnenhkh-nav-link weshop-nav-link jomnenhkh-dropdown-trigger weshop-dropdown-trigger ${categoriesOpen ? 'active' : ''}`}
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                aria-expanded={categoriesOpen}
              >
                <span>{t('nav.categories')}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Mega Dropdown */}
              {categoriesOpen && (
                <div 
                  className="jomnenhkh-categories-popover weshop-categories-popover" 
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <div className="jomnenhkh-categories-grid weshop-categories-grid">
                    {marketplaceCategories.map((cat, idx) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={idx}
                          to={cat.path}
                          className="jomnenhkh-category-popover-item weshop-category-popover-item"
                          onClick={() => setCategoriesOpen(false)}
                        >
                          <div className="jomnenhkh-cat-icon-box weshop-cat-icon-box">
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="jomnenhkh-cat-name weshop-cat-name">{cat.name}</div>
                            <div className="jomnenhkh-cat-count weshop-cat-count">{cat.count}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="jomnenhkh-categories-footer weshop-categories-footer">
                    <Link to="/products" className="jomnenhkh-cat-footer-link weshop-cat-footer-link" onClick={() => setCategoriesOpen(false)}>
                      {t('nav.allCategories')} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* CENTER: Wide Rounded Search Bar */}
        <div className="jomnenhkh-nav-center weshop-nav-center">
          <JomnenhKhSearchBar placeholder={t('nav.searchPlaceholder')} />
        </div>

        {/* RIGHT: Actions (Theme, Language, Cart, Auth) */}
        <div className="jomnenhkh-nav-right weshop-nav-right">
          <JomnenhKhThemeToggle />
          <JomnenhKhLanguageSelector />

          {/* Cart Icon */}
          <Link to="/cart" className="jomnenhkh-cart-action-btn weshop-cart-action-btn" title="View Cart" aria-label="Cart">
            <ShoppingBag size={18} />
            {totalItems > 0 && <span className="jomnenhkh-cart-count-badge weshop-cart-count-badge">{totalItems}</span>}
          </Link>
          
          <div className="jomnenhkh-nav-separator weshop-nav-separator" aria-hidden="true" />

          {/* User Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/settings" className="jomnenhkh-user-pill weshop-user-pill user-pill flex items-center gap-1.5" title="My Account">
                <span className="user-name font-semibold">{user.fullName ? user.fullName.split(' ')[0] : 'Account'}</span>
                {isAdmin && <span className="role-tag admin">Admin</span>}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="jomnenhkh-user-pill weshop-user-pill" title="Admin Dashboard">
                  <LayoutDashboard size={15} />
                </Link>
              )}
              <button
                type="button"
                className="jomnenhkh-theme-toggle-btn weshop-theme-toggle-btn"
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="jomnenhkh-signin-link weshop-signin-link">
                Sign In
              </Link>
              <JomnenhKhPrimaryButton
                size="md"
                variant="primary"
                asLink={true}
                to="/register"
                className="jomnenhkh-get-started-btn weshop-get-started-btn"
              >
                {t('nav.getStarted')}
              </JomnenhKhPrimaryButton>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="jomnenhkh-mobile-toggle weshop-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="jomnenhkh-mobile-drawer weshop-mobile-drawer">
          <div className="jomnenhkh-mobile-drawer-inner weshop-mobile-drawer-inner">
            <div className="jomnenhkh-mobile-search-wrap weshop-mobile-search-wrap">
              <JomnenhKhSearchBar
                placeholder={t('nav.searchPlaceholder')}
                onSearch={() => setMobileMenuOpen(false)}
              />
            </div>

            <nav className="jomnenhkh-mobile-links weshop-mobile-links">
              <Link
                to="/"
                className="jomnenhkh-mobile-link weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="jomnenhkh-mobile-link weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {isAdmin && (
                <Link
                  to="/products/manage"
                  className="jomnenhkh-mobile-link weshop-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Manage
                </Link>
              )}
              <Link
                to="/services"
                className="jomnenhkh-mobile-link weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about-us"
                className="jomnenhkh-mobile-link weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/products"
                className="jomnenhkh-mobile-link weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.categories')}
              </Link>
              <a
                href="#featured-stores"
                className="jomnenhkh-mobile-link weshop-mobile-link"
                onClick={handleExploreStores}
              >
                {t('nav.exploreStores')}
              </a>
              <Link
                to="/cart"
                className="jomnenhkh-mobile-link weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart ({totalItems})
              </Link>
            </nav>

            <div className="jomnenhkh-mobile-bottom-row weshop-mobile-bottom-row">
              <div className="flex items-center gap-3">
                <JomnenhKhThemeToggle />
                <JomnenhKhLanguageSelector />
              </div>
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/settings"
                    className="jomnenhkh-user-pill weshop-user-pill user-pill flex items-center gap-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="user-name font-semibold">{user.fullName ? user.fullName.split(' ')[0] : 'Account'}</span>
                    {isAdmin && <span className="role-tag admin">Admin</span>}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="jomnenhkh-theme-toggle-btn weshop-theme-toggle-btn"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="jomnenhkh-signin-link weshop-signin-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <JomnenhKhPrimaryButton
                    size="md"
                    asLink={true}
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.getStarted')}
                  </JomnenhKhPrimaryButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default JomnenhKhNavbar;
