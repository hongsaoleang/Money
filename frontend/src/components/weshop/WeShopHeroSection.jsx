import React from 'react';
import WeShopHeroComposition from './WeShopHeroComposition';

const WeShopHeroSection = () => {
  return (
    <section className="weshop-hero-section weshop-feature-watermark-wrap">
      {/* Blurred Brand Icon Watermark in Hero Background */}
      <div className="weshop-brand-watermark-bg top-left" aria-hidden="true">
        <img
          src="/jomnenhkh-icon.jpg"
          onError={(e) => {
            if (e.currentTarget.src !== '/JomnenhKH.jpg') {
              e.currentTarget.src = '/JomnenhKH.jpg';
            }
          }}
          alt=""
          className="weshop-brand-watermark-img"
        />
      </div>

      <div className="weshop-hero-container relative z-10">
        {/* Left column text cleared per user request; image kept in the exact same place on the right */}
        <div className="weshop-hero-left-spacer" aria-hidden="true" />

        {/* RIGHT COLUMN: Big Image kept in the exact same place with a little rounded */}
        <div className="weshop-hero-right">
          <WeShopHeroComposition />
        </div>
      </div>
    </section>
  );
};

export default WeShopHeroSection;
