import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, ArrowRight, Home, Shirt, Laptop, Armchair, Coffee,
  ShoppingBag, LogOut, LayoutDashboard
} from 'lucide-react';
import WeShopSearchBar from './WeShopSearchBar';
import WeShopThemeToggle from './WeShopThemeToggle';
import WeShopLanguageSelector from './WeShopLanguageSelector';
import WeShopPrimaryButton from './WeShopPrimaryButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const WeShopNavbar = ({ onExploreStoresClick }) => {
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
    <header className="weshop-navbar-root">
      <div className="weshop-navbar-container">
        {/* LEFT: Brand Logo & Main Nav Links */}
        <div className="weshop-nav-left">
          {/* Jomnenh-KH Logo linking directly to root / */}
          <Link to="/" className="weshop-logo-link" aria-label="Jomnenh-KH Home">
            <img
              src="/JomnenhKH.jpg"
              alt="Jomnenh-KH Logo"
              className="weshop-brand-logo-img"
            />
            <span className="weshop-logo-script">
              Jomnenh<span className="weshop-logo-accent">-KH</span>
            </span>
          </Link>

          {/* Navigation Links: Home, Products, Manage, Services, About Us, Categories */}
          <nav className="weshop-nav-links" aria-label="Main Navigation">
            <NavLink
              to="/"
              className={({ isActive }) => `weshop-nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) => `weshop-nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Products
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/products/manage"
                className={({ isActive }) => `weshop-nav-link ${isActive ? 'active' : ''}`}
              >
                Manage
              </NavLink>
            )}

            <NavLink
              to="/services"
              className={({ isActive }) => `weshop-nav-link ${isActive ? 'active' : ''}`}
            >
              Services
            </NavLink>

            <NavLink
              to="/about-us"
              className={({ isActive }) => `weshop-nav-link ${isActive ? 'active' : ''}`}
            >
              About Us
            </NavLink>

            <div className="weshop-categories-trigger-wrap">
              <button
                type="button"
                className={`weshop-nav-link weshop-dropdown-trigger ${categoriesOpen ? 'active' : ''}`}
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                aria-expanded={categoriesOpen}
              >
                <span>{t('nav.categories')}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Mega Dropdown */}
              {categoriesOpen && (
                <div 
                  className="weshop-categories-popover" 
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <div className="weshop-categories-grid">
                    {marketplaceCategories.map((cat, idx) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={idx}
                          to={cat.path}
                          className="weshop-category-popover-item"
                          onClick={() => setCategoriesOpen(false)}
                        >
                          <div className="weshop-cat-icon-box">
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="weshop-cat-name">{cat.name}</div>
                            <div className="weshop-cat-count">{cat.count}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="weshop-categories-footer">
                    <Link to="/products" className="weshop-cat-footer-link" onClick={() => setCategoriesOpen(false)}>
                      {t('nav.allCategories')} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* CENTER: Wide Rounded Search Bar */}
        <div className="weshop-nav-center">
          <WeShopSearchBar placeholder={t('nav.searchPlaceholder')} />
        </div>

        {/* RIGHT: Actions (Theme, Language, Cart, Auth) */}
        <div className="weshop-nav-right">
          <WeShopThemeToggle />
          <WeShopLanguageSelector />

          {/* Cart Icon */}
          <Link to="/cart" className="weshop-cart-action-btn" title="View Cart" aria-label="Cart">
            <ShoppingBag size={18} />
            {totalItems > 0 && <span className="weshop-cart-count-badge">{totalItems}</span>}
          </Link>
          
          <div className="weshop-nav-separator" aria-hidden="true" />

          {/* User Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/settings" className="weshop-user-pill user-pill flex items-center gap-1.5" title="My Account">
                <span className="user-name font-semibold">{user.fullName ? user.fullName.split(' ')[0] : 'Account'}</span>
                {isAdmin && <span className="role-tag admin">Admin</span>}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="weshop-user-pill" title="Admin Dashboard">
                  <LayoutDashboard size={15} />
                </Link>
              )}
              <button
                type="button"
                className="weshop-theme-toggle-btn"
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="weshop-signin-link">
                Sign In
              </Link>
              <WeShopPrimaryButton
                size="md"
                variant="primary"
                asLink={true}
                to="/register"
                className="weshop-get-started-btn"
              >
                {t('nav.getStarted')}
              </WeShopPrimaryButton>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="weshop-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="weshop-mobile-drawer">
          <div className="weshop-mobile-drawer-inner">
            <div className="weshop-mobile-search-wrap">
              <WeShopSearchBar
                placeholder={t('nav.searchPlaceholder')}
                onSearch={() => setMobileMenuOpen(false)}
              />
            </div>

            <nav className="weshop-mobile-links">
              <Link
                to="/"
                className="weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {isAdmin && (
                <Link
                  to="/products/manage"
                  className="weshop-mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Manage
                </Link>
              )}
              <Link
                to="/services"
                className="weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about-us"
                className="weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                to="/products"
                className="weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.categories')}
              </Link>
              <a
                href="#featured-stores"
                className="weshop-mobile-link"
                onClick={handleExploreStores}
              >
                {t('nav.exploreStores')}
              </a>
              <Link
                to="/cart"
                className="weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart ({totalItems})
              </Link>
            </nav>

            <div className="weshop-mobile-bottom-row">
              <div className="flex items-center gap-3">
                <WeShopThemeToggle />
                <WeShopLanguageSelector />
              </div>
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/settings"
                    className="weshop-user-pill user-pill flex items-center gap-1.5"
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
                    className="weshop-theme-toggle-btn"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="weshop-signin-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <WeShopPrimaryButton
                    size="md"
                    asLink={true}
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.getStarted')}
                  </WeShopPrimaryButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default WeShopNavbar;
