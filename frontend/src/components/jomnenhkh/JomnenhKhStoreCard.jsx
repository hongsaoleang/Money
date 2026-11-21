import React from 'react';
import { 
  ArrowUpRight, Edit3, Trash2,
  Home, Shirt, Leaf, Armchair, Coffee, Package, Store 
} from 'lucide-react';

const ICON_MAP = {
  Home,
  Shirt,
  Leaf,
  Armchair,
  Coffee,
  Package,
  Store,
};

const JomnenhKhStoreCard = ({ store, onClick, isAdmin, onEdit, onDelete }) => {
  const IconComponent = (store.iconName && ICON_MAP[store.iconName]) || store.icon || Store;

  return (
    <article
      className="jomnenhkh-store-card weshop-store-card"
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
      <div className="jomnenhkh-store-img-box weshop-store-img-box">
        <img
          src={store.image}
          alt={store.imageAlt || store.name}
          className="jomnenhkh-store-cover-img weshop-store-cover-img"
          loading="lazy"
        />
        {/* Subtle category tag pill on the image */}
        <div className="jomnenhkh-store-category-chip weshop-store-category-chip">
          {store.category}
        </div>

        {/* Admin Quick Action Controls */}
        {isAdmin && (
          <div className="jomnenhkh-card-admin-bar weshop-card-admin-bar" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="jomnenhkh-card-admin-action weshop-card-admin-action"
              onClick={() => onEdit && onEdit(store)}
              title="Edit store and image"
              aria-label="Edit store"
            >
              <Edit3 size={14} />
            </button>
            <button
              type="button"
              className="jomnenhkh-card-admin-action weshop-card-admin-action delete"
              onClick={() => onDelete && onDelete(store)}
              title="Delete this store"
              aria-label="Delete store"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* 2. Store Information Area Underneath */}
      <div className="jomnenhkh-store-info-box weshop-store-info-box relative overflow-hidden">
        {/* Subtle blurred card background watermark */}
        <div className="jomnenhkh-card-watermark weshop-card-watermark" aria-hidden="true">
          <img
            src="/jomnenhkh-icon.jpg"
            onError={(e) => {
              if (e.currentTarget.src !== '/JomnenhKH.jpg') {
                e.currentTarget.src = '/JomnenhKH.jpg';
              }
            }}
            alt=""
            className="jomnenhkh-card-watermark-img weshop-card-watermark-img"
          />
        </div>

        <div className="jomnenhkh-store-info-left weshop-store-info-left relative z-10">
          {/* 3. Circular Category Icon */}
          <div className="jomnenhkh-store-icon-circle weshop-store-icon-circle" aria-hidden="true">
            {IconComponent && <IconComponent size={18} className="jomnenhkh-cat-svg-icon weshop-cat-svg-icon" />}
          </div>

          {/* 4 & 5. Store Name & Product Count */}
          <div className="jomnenhkh-store-titles weshop-store-titles">
            <h3 className="jomnenhkh-store-name weshop-store-name">{store.name}</h3>
            <span className="jomnenhkh-store-count weshop-store-count">{store.productsCount}</span>
          </div>
        </div>

        {/* 6. Circular Arrow Button on the Right */}
        <div className="jomnenhkh-store-arrow-circle weshop-store-arrow-circle" aria-hidden="true">
          <ArrowUpRight size={16} className="jomnenhkh-store-arrow-icon weshop-store-arrow-icon" />
        </div>
      </div>
    </article>
  );
};

export default JomnenhKhStoreCard;
