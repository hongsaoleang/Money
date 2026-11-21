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
        {/* Left column: Brand Icon pushed to top-right & scaled */}
        <div className="jomnenhkh-hero-left weshop-hero-left jomnenhkh-hero-left-spacer weshop-hero-left-spacer jomnenhkh-hero-icon-container">
          <div className="jomnenhkh-hero-icon-wrapper">
            <img
              src="/jomnenhkh-icon.jpg"
              onError={(e) => {
                if (e.currentTarget.src !== '/JomnenhKH.jpg') {
                  e.currentTarget.src = '/JomnenhKH.jpg';
                }
              }}
              alt="Jomnenh-Kh Icon"
              className="jomnenhkh-hero-brand-icon"
            />
          </div>
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
