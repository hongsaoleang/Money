import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const WeShopStoreCard = ({ store, onClick }) => {
  const IconComponent = store.icon;

  return (
    <article
      className="weshop-store-card"
      onClick={() => onClick && onClick(store)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (onClick) onClick(store);
        }
      }}
      aria-label={`View store details for ${store.name}, offering ${store.productsCount}`}
    >
      {/* 1. Large Lifestyle Cover Image (occupies ~68% of card height) */}
      <div className="weshop-store-img-box">
        <img
          src={store.image}
          alt={store.imageAlt || store.name}
          className="weshop-store-cover-img"
          loading="lazy"
        />
        {/* Subtle category tag pill on the image */}
        <div className="weshop-store-category-chip">
          {store.category}
        </div>
      </div>

      {/* 2. Store Information Area Underneath */}
      <div className="weshop-store-info-box">
        <div className="weshop-store-info-left">
          {/* 3. Circular Category Icon */}
          <div className="weshop-store-icon-circle" aria-hidden="true">
            {IconComponent && <IconComponent size={18} className="weshop-cat-svg-icon" />}
          </div>

          {/* 4 & 5. Store Name & Product Count */}
          <div className="weshop-store-titles">
            <h3 className="weshop-store-name">{store.name}</h3>
            <span className="weshop-store-count">{store.productsCount}</span>
          </div>
        </div>

        {/* 6. Circular Arrow Button on the Right */}
        <div className="weshop-store-arrow-circle" aria-hidden="true">
          <ArrowUpRight size={16} className="weshop-store-arrow-icon" />
        </div>
      </div>
    </article>
  );
};

export default WeShopStoreCard;
