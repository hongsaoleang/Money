import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const WeShopHeroComposition = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // High-resolution photography of minimalist packaging and curated lifestyle goods
  const curatedFallbackImg =
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85';

  return (
    <div className="weshop-hero-visual-root">
      {/* Soft studio ambient background glow */}
      <div className="weshop-hero-ambient-glow" aria-hidden="true" />

      {/* Main Photographic Composition Container */}
      <div className="weshop-hero-stage">
        {/* Primary Photographic Product Display */}
        <div className="weshop-hero-photo-wrapper">
          <img
            src="/weshop-hero.jpg"
            onError={(e) => {
              // Seamless fallback to high-resolution commercial flatlay if local file isn't found
              if (e.currentTarget.src !== curatedFallbackImg) {
                e.currentTarget.src = curatedFallbackImg;
              }
            }}
            onLoad={() => setImageLoaded(true)}
            alt="WeShop commercial product arrangement featuring branded shipping box, cream tote bag, reusable green bottle, and folded apparel"
            className={`weshop-hero-product-img ${imageLoaded ? 'loaded' : ''}`}
          />

          {/* Natural contact ground shadow beneath the product group */}
          <div className="weshop-hero-ground-shadow" aria-hidden="true" />
        </div>

        {/* Floating Trust Verification Badge */}
        <div className="weshop-hero-floating-badge top-right">
          <div className="weshop-badge-icon-box">
            <ShieldCheck size={16} className="text-emerald-500" />
          </div>
          <div className="weshop-badge-text-box">
            <span className="weshop-badge-label">WeShop Certified</span>
            <span className="weshop-badge-sub">Quality Inspected</span>
          </div>
        </div>

        {/* Floating Order / Dispatch Pill */}
        <div className="weshop-hero-floating-badge bottom-left">
          <div className="weshop-badge-icon-box bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={16} />
          </div>
          <div className="weshop-badge-text-box">
            <span className="weshop-badge-label">Direct From Makers</span>
            <span className="weshop-badge-sub">Wholesale pricing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeShopHeroComposition;
