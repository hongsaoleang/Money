import React from 'react';
import WeShopPrimaryButton from './WeShopPrimaryButton';
import WeShopHeroComposition from './WeShopHeroComposition';
import { Sparkles } from 'lucide-react';

const WeShopHeroSection = () => {
  return (
    <section className="weshop-hero-section">
      <div className="weshop-hero-container">
        {/* LEFT COLUMN: Core Brand Value Proposition */}
        <div className="weshop-hero-left">
          {/* Subtle B2B / Marketplace Pill Tag */}
          <div className="weshop-hero-tag">
            <Sparkles size={13} className="text-emerald-500" />
            <span>Modern B2B &amp; Direct Marketplace</span>
          </div>

          {/* Main 2-Line Headline */}
          <h1 className="weshop-hero-heading">
            <span className="weshop-heading-line">Source smarter.</span>
            <span className="weshop-heading-line">
              Grow <span className="weshop-brand-w">W</span> together.
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="weshop-hero-description">
            Wholesale products. Independent suppliers. New possibilities for your business.
          </p>

          {/* Green Rounded CTA Button */}
          <div className="weshop-hero-cta-group">
            <WeShopPrimaryButton
              size="lg"
              variant="primary"
              asLink={true}
              to="/products"
              arrow={true}
              className="weshop-hero-cta-btn"
            >
              Explore Products
            </WeShopPrimaryButton>

            <a href="#featured-stores" className="weshop-hero-secondary-link">
              View Featured Stores
            </a>
          </div>

          {/* Trust Highlights Row */}
          <div className="weshop-hero-stats-row">
            <div className="weshop-hero-stat-item">
              <span className="weshop-stat-num">2,400+</span>
              <span className="weshop-stat-label">Independent Makers</span>
            </div>
            <div className="weshop-stat-divider" aria-hidden="true" />
            <div className="weshop-hero-stat-item">
              <span className="weshop-stat-num">50k+</span>
              <span className="weshop-stat-label">Vetted Products</span>
            </div>
            <div className="weshop-stat-divider" aria-hidden="true" />
            <div className="weshop-hero-stat-item">
              <span className="weshop-stat-num">99.8%</span>
              <span className="weshop-stat-label">Fulfillment Rate</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Balanced Premium Product Photography */}
        <div className="weshop-hero-right">
          <WeShopHeroComposition />
        </div>
      </div>
    </section>
  );
};

export default WeShopHeroSection;
