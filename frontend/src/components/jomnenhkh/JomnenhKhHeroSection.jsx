import React from 'react';
import JomnenhKhHeroComposition from './JomnenhKhHeroComposition';
import { useLanguage } from '../../context/LanguageContext';

const JomnenhKhHeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="jomnenhkh-hero-section weshop-hero-section jomnenhkh-feature-watermark-wrap weshop-feature-watermark-wrap">
      {/* Blurred Brand Icon Watermark in Hero Background */}
      <div className="jomnenhkh-brand-watermark-bg weshop-brand-watermark-bg top-left" aria-hidden="true">
        <img
          src="/jomnenhkh-icon.jpg"
          onError={(e) => {
            if (e.currentTarget.src !== '/JomnenhKH.jpg') {
              e.currentTarget.src = '/JomnenhKH.jpg';
            }
          }}
          alt=""
          className="jomnenhkh-brand-watermark-img weshop-brand-watermark-img"
        />
      </div>

      <div className="jomnenhkh-hero-container weshop-hero-container relative z-10">
        {/* Left column: Welcome / Home Heading */}
        <div className="jomnenhkh-hero-left weshop-hero-left jomnenhkh-hero-left-spacer weshop-hero-left-spacer">
          <h1 className="jomnenhkh-hero-heading weshop-hero-heading">
            <span className="jomnenhkh-heading-line weshop-heading-line">
              {t('nav.home', 'Home')}
            </span>
          </h1>
        </div>

        {/* RIGHT COLUMN: Big Image kept in the exact same place with a little rounded */}
        <div className="jomnenhkh-hero-right weshop-hero-right">
          <JomnenhKhHeroComposition />
        </div>
      </div>
    </section>
  );
};

export default JomnenhKhHeroSection;
