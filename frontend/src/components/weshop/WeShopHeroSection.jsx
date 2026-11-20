import React from 'react';
import WeShopPrimaryButton from './WeShopPrimaryButton';
import WeShopHeroComposition from './WeShopHeroComposition';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WeShopHeroSection = () => {
  const { t, language } = useLanguage();

  return (
    <section className="weshop-hero-section">
      <div className="weshop-hero-container">
        {/* LEFT COLUMN: Core Brand Value Proposition */}
        <div className="weshop-hero-left">
          {/* Subtle B2B / Marketplace Pill Tag */}
          <div className="weshop-hero-tag">
            <Sparkles size={13} className="text-indigo-600 dark:text-cyan-400" />
            <span>{t('hero.tag')}</span>
          </div>

          {/* Main 2-Line Headline */}
          <h1 className="weshop-hero-heading">
            <span className="weshop-heading-line">{t('hero.heading1')}</span>
            <span className="weshop-heading-line">
              {language === 'KH' ? (
                <>រីកចម្រើន <span className="weshop-brand-w">W</span> ជាមួយគ្នា។</>
              ) : language === 'FR' ? (
                <>Grandissez <span className="weshop-brand-w">W</span> ensemble.</>
              ) : language === 'ES' ? (
                <>Crece <span className="weshop-brand-w">W</span> juntos.</>
              ) : language === 'ZH' ? (
                <>共赢共创 <span className="weshop-brand-w">W</span> 卓越未来。</>
              ) : (
                <>Grow <span className="weshop-brand-w">W</span> together.</>
              )}
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="weshop-hero-description">
            {t('hero.description')}
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
              {t('hero.cta')}
            </WeShopPrimaryButton>

            <a href="#featured-stores" className="weshop-hero-secondary-link">
              {t('hero.secondaryCta')}
            </a>
          </div>

          {/* Trust Highlights Row */}
          <div className="weshop-hero-stats-row">
            <div className="weshop-hero-stat-item">
              <span className="weshop-stat-num">2,400+</span>
              <span className="weshop-stat-label">{t('hero.statMakers')}</span>
            </div>
            <div className="weshop-stat-divider" aria-hidden="true" />
            <div className="weshop-hero-stat-item">
              <span className="weshop-stat-num">50k+</span>
              <span className="weshop-stat-label">{t('hero.statProducts')}</span>
            </div>
            <div className="weshop-stat-divider" aria-hidden="true" />
            <div className="weshop-hero-stat-item">
              <span className="weshop-stat-num">99.8%</span>
              <span className="weshop-stat-label">{t('hero.statFulfillment')}</span>
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
