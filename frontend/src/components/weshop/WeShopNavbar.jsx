import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, ArrowRight, Home, Shirt, Laptop, Armchair, Coffee
} from 'lucide-react';
import WeShopSearchBar from './WeShopSearchBar';
import WeShopThemeToggle from './WeShopThemeToggle';
import WeShopLanguageSelector from './WeShopLanguageSelector';
import WeShopPrimaryButton from './WeShopPrimaryButton';

const MARKETPLACE_CATEGORIES = [
  { name: 'Home & Living', count: '450+ items', icon: Home, path: '/products?category=Home' },
  { name: 'Apparel & Textiles', count: '320+ items', icon: Shirt, path: '/products?category=Apparel' },
  { name: 'Office & Tech', count: '180+ items', icon: Laptop, path: '/products?category=Hardware' },
  { name: 'Furniture & Decor', count: '210+ items', icon: Armchair, path: '/products?category=Furniture' },
  { name: 'Ceramics & Tableware', count: '140+ items', icon: Coffee, path: '/products?category=Kitchen' },
];

const WeShopNavbar = ({ onExploreStoresClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();

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
          {/* Green Script-style Logo */}
          <Link to="/weshop" className="weshop-logo-link" aria-label="WeShop Home">
            <span className="weshop-logo-script">
              We<span className="weshop-logo-accent">Shop</span>
            </span>
            <span className="weshop-logo-leaf" aria-hidden="true">🌱</span>
          </Link>

          {/* Navigation Links */}
          <nav className="weshop-nav-links" aria-label="Main Navigation">
            <NavLink
              to="/products"
              className={({ isActive }) => `weshop-nav-link ${isActive ? 'active' : ''}`}
            >
              Browse Products
            </NavLink>

            <a
              href="#featured-stores"
              onClick={handleExploreStores}
              className="weshop-nav-link"
            >
              Explore Stores
            </a>

            <div className="weshop-categories-trigger-wrap">
              <button
                type="button"
                className={`weshop-nav-link weshop-dropdown-trigger ${categoriesOpen ? 'active' : ''}`}
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                aria-expanded={categoriesOpen}
              >
                <span>Categories</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Mega Dropdown */}
              {categoriesOpen && (
                <div 
                  className="weshop-categories-popover" 
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <div className="weshop-categories-grid">
                    {MARKETPLACE_CATEGORIES.map((cat, idx) => {
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
                      View All 24+ Marketplace Categories <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* CENTER: Wide Rounded Search Bar */}
        <div className="weshop-nav-center">
          <WeShopSearchBar placeholder="Search products or suppliers" />
        </div>

        {/* RIGHT: Actions (Theme, Language, Separator, Get Started) */}
        <div className="weshop-nav-right">
          <WeShopThemeToggle />
          <WeShopLanguageSelector />
          
          <div className="weshop-nav-separator" aria-hidden="true" />

          <WeShopPrimaryButton
            size="md"
            variant="primary"
            asLink={true}
            to="/register"
            className="weshop-get-started-btn"
          >
            Get Started
          </WeShopPrimaryButton>

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
                placeholder="Search products or suppliers"
                onSearch={() => setMobileMenuOpen(false)}
              />
            </div>

            <nav className="weshop-mobile-links">
              <Link
                to="/products"
                className="weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Products
              </Link>
              <a
                href="#featured-stores"
                className="weshop-mobile-link"
                onClick={handleExploreStores}
              >
                Explore Stores
              </a>
              <Link
                to="/products"
                className="weshop-mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Categories
              </Link>
            </nav>

            <div className="weshop-mobile-bottom-row">
              <div className="flex items-center gap-3">
                <WeShopThemeToggle />
                <WeShopLanguageSelector />
              </div>
              <WeShopPrimaryButton
                size="md"
                asLink={true}
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </WeShopPrimaryButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default WeShopNavbar;
