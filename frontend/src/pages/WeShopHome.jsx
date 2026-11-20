import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import WeShopNavbar from '../components/weshop/WeShopNavbar';
import WeShopHeroSection from '../components/weshop/WeShopHeroSection';
import WeShopFeaturedStores from '../components/weshop/WeShopFeaturedStores';
import './WeShopHome.css';

const WeShopHome = () => {
  useEffect(() => {
    // Set document title
    const prevTitle = document.title;
    document.title = 'WeShop — Modern Marketplace | Source Smarter. Grow Together.';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handleExploreStoresScroll = () => {
    const el = document.getElementById('featured-stores');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="weshop-page">
      {/* 0. Convenient Switcher Banner between the two homepages */}
      <div className="weshop-switcher-bar">
        <div className="weshop-switcher-info">
          <span className="weshop-switcher-badge">Alternate Homepage</span>
          <span>WeShop Modern Marketplace View</span>
        </div>
        <div className="weshop-switcher-actions">
          <Link to="/" className="weshop-switcher-link">
            <ArrowLeft size={14} /> Back to Tech Store Home
          </Link>
        </div>
      </div>

      {/* 1. WeShop Dedicated Navigation Bar (90px height, script logo, search bar, language, theme, Get Started) */}
      <WeShopNavbar onExploreStoresClick={handleExploreStoresScroll} />

      {/* 2. Hero Section (2-Column layout, 58px bold heading, green 'W', premium photography) */}
      <WeShopHeroSection />

      {/* 3. Featured Stores Section (5 Cards in 1 Row on Desktop, cover images, info, category icons, arrow buttons) */}
      <WeShopFeaturedStores />

      {/* 4. WeShop Modern Minimalist Footer */}
      <footer className="weshop-footer">
        <div className="weshop-footer-container">
          <div className="weshop-footer-top">
            <div className="weshop-footer-brand">
              <span className="weshop-logo-script">
                We<span className="weshop-logo-accent">Shop</span>
              </span>
              <p className="weshop-footer-tagline">
                The premier independent maker &amp; wholesale marketplace.
              </p>
            </div>

            <div className="weshop-footer-links-grid">
              <div className="weshop-footer-col">
                <span className="weshop-footer-col-title">Marketplace</span>
                <Link to="/products" className="weshop-footer-link">All Products</Link>
                <a href="#featured-stores" onClick={handleExploreStoresScroll} className="weshop-footer-link">Featured Stores</a>
                <Link to="/products?category=Home" className="weshop-footer-link">Home &amp; Decor</Link>
                <Link to="/products?category=Apparel" className="weshop-footer-link">Apparel &amp; Linen</Link>
              </div>

              <div className="weshop-footer-col">
                <span className="weshop-footer-col-title">Suppliers</span>
                <Link to="/register" className="weshop-footer-link">Apply as Maker</Link>
                <Link to="/about-us" className="weshop-footer-link">Wholesale Standards</Link>
                <Link to="/services" className="weshop-footer-link">Logistics Support</Link>
              </div>

              <div className="weshop-footer-col">
                <span className="weshop-footer-col-title">Platform</span>
                <Link to="/" className="weshop-footer-link">Switch to Tech Store</Link>
                <Link to="/about-us" className="weshop-footer-link">About Jomnenh-KH</Link>
                <Link to="/settings" className="weshop-footer-link">Account &amp; Orders</Link>
              </div>
            </div>
          </div>

          <div className="weshop-footer-bottom">
            <p className="weshop-copyright">
              © 2026 WeShop Marketplace · Independent Suppliers Worldwide.
            </p>
            <div className="weshop-footer-meta">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-500" /> Buyer Protection Guaranteed
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WeShopHome;
