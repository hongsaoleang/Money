import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import WeShopNavbar from '../components/weshop/WeShopNavbar';
import WeShopHeroSection from '../components/weshop/WeShopHeroSection';
import WeShopFeaturedStores from '../components/weshop/WeShopFeaturedStores';
import { useLanguage } from '../context/LanguageContext';
import './WeShopHome.css';

const Home = () => {
  const { t } = useLanguage();

  useEffect(() => {
    // Set document title
    const prevTitle = document.title;
    document.title = 'JomnenhKH-Shop — Modern Marketplace | Source Smarter. Grow Together.';
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
      {/* 1. JomnenhKH-Shop Dedicated Navigation Bar (90px height, script logo, search bar, language, theme, Get Started) */}
      <WeShopNavbar onExploreStoresClick={handleExploreStoresScroll} />

      {/* 2. Hero Section (2-Column layout, 58px bold heading, green highlight, premium photography) */}
      <WeShopHeroSection />

      {/* 3. Featured Stores Section (5 Cards in 1 Row on Desktop, cover images, info, category icons, arrow buttons) */}
      <WeShopFeaturedStores />

      {/* 4. JomnenhKH-Shop Modern Minimalist Footer */}
      <footer className="weshop-footer">
        <div className="weshop-footer-container">
          <div className="weshop-footer-top">
            <div className="weshop-footer-brand">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="/JomnenhKH.jpg"
                  alt="Jomnenh-KH Logo"
                  className="weshop-brand-logo-img !h-8 !w-8"
                />
                <span className="weshop-logo-script">
                  Jomnenh<span className="weshop-logo-accent">-KH</span>
                </span>
              </div>
              <p className="weshop-footer-tagline">
                {t('footer.tagline')}
              </p>
            </div>

            <div className="weshop-footer-links-grid">
              <div className="weshop-footer-col">
                <span className="weshop-footer-col-title">{t('footer.marketplace')}</span>
                <Link to="/products" className="weshop-footer-link">{t('footer.allProducts')}</Link>
                <a href="#featured-stores" onClick={handleExploreStoresScroll} className="weshop-footer-link">{t('footer.featuredStores')}</a>
                <Link to="/products?category=Home" className="weshop-footer-link">{t('cat.home')}</Link>
                <Link to="/products?category=Apparel" className="weshop-footer-link">{t('cat.apparel')}</Link>
              </div>

              <div className="weshop-footer-col">
                <span className="weshop-footer-col-title">{t('footer.suppliers')}</span>
                <Link to="/register" className="weshop-footer-link">{t('footer.applyMaker')}</Link>
                <Link to="/about-us" className="weshop-footer-link">{t('footer.wholesaleStandards')}</Link>
                <Link to="/services" className="weshop-footer-link">{t('footer.logistics')}</Link>
              </div>

              <div className="weshop-footer-col">
                <span className="weshop-footer-col-title">{t('footer.platform')}</span>
                <Link to="/products" className="weshop-footer-link">{t('nav.browseProducts')}</Link>
                <Link to="/about-us" className="weshop-footer-link">{t('footer.about')}</Link>
                <Link to="/settings" className="weshop-footer-link">{t('footer.account')}</Link>
              </div>
            </div>
          </div>

          <div className="weshop-footer-bottom">
            <p className="weshop-copyright">
              {t('footer.copyright')}
            </p>
            <div className="weshop-footer-meta">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-indigo-600 dark:text-cyan-400" /> {t('footer.buyerProtection')}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
