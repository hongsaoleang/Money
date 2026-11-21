import React from 'react';
import JomnenhKhHeroComposition from './JomnenhKhHeroComposition';

const JomnenhKhHeroSection = () => {
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
        {/* Left column text cleared per user request; image kept in the exact same place on the right */}
        <div className="jomnenhkh-hero-left-spacer weshop-hero-left-spacer" aria-hidden="true" />

        {/* RIGHT COLUMN: Big Image kept in the exact same place with a little rounded */}
        <div className="jomnenhkh-hero-right weshop-hero-right">
          <JomnenhKhHeroComposition />
        </div>
      </div>
    </section>
  );
};

export default JomnenhKhHeroSection;
