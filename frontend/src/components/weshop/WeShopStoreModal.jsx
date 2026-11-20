import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Star, MapPin, ShieldCheck, Package,
  Clock, Award
} from 'lucide-react';
import WeShopPrimaryButton from './WeShopPrimaryButton';
import { useLanguage } from '../../context/LanguageContext';

const WeShopStoreModal = ({ store, isOpen, onClose }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isOpen || !store) return null;

  const IconComponent = store.icon;

  const handleBrowseStoreProducts = () => {
    onClose();
    navigate(`/products?category=${encodeURIComponent(store.category || store.name)}`);
  };

  return (
    <div className="weshop-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="weshop-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="weshop-modal-close-btn"
          onClick={onClose}
          aria-label="Close store dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header Banner */}
        <div className="weshop-modal-banner-wrap">
          <img
            src={store.image}
            alt={store.name}
            className="weshop-modal-banner-img"
          />
          <div className="weshop-modal-banner-overlay" />
          <div className="weshop-modal-header-content">
            <div className="weshop-modal-icon-badge">
              {IconComponent && <IconComponent size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="weshop-modal-title">{store.name}</h2>
                <span className="weshop-modal-verified-badge">
                  <ShieldCheck size={14} /> {t('modal.verifiedMaker')}
                </span>
              </div>
              <p className="weshop-modal-sub-info">
                <span>{store.productsCount}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star size={13} fill="currentColor" /> {store.rating || '4.9'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {store.location || 'Independent Workshop'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="weshop-modal-body">
          <div className="weshop-modal-section">
            <h4 className="weshop-modal-section-title">{t('modal.aboutSupplier')}</h4>
            <p className="weshop-modal-description">
              {store.description ||
                `${store.name} specializes in high-quality, sustainable production with fair wholesale conditions for boutique retailers and independent businesses worldwide.`}
            </p>
          </div>

          {/* Supplier Highlights */}
          <div className="weshop-modal-metrics-grid">
            <div className="weshop-modal-metric-card">
              <Clock size={16} className="text-indigo-600 dark:text-cyan-400" />
              <div>
                <span className="metric-val">{t('modal.leadTimeVal')}</span>
                <span className="metric-lbl">{t('modal.leadTime')}</span>
              </div>
            </div>
            <div className="weshop-modal-metric-card">
              <Award size={16} className="text-indigo-600 dark:text-cyan-400" />
              <div>
                <span className="metric-val">99.4%</span>
                <span className="metric-lbl">{t('modal.positiveReviews')}</span>
              </div>
            </div>
            <div className="weshop-modal-metric-card">
              <Package size={16} className="text-indigo-600 dark:text-cyan-400" />
              <div>
                <span className="metric-val">{t('modal.lowMoqVal')}</span>
                <span className="metric-lbl">{t('modal.lowMoq')}</span>
              </div>
            </div>
          </div>

          {/* Sample Products */}
          <div className="weshop-modal-section">
            <h4 className="weshop-modal-section-title">{t('modal.popularItems')} {store.name}</h4>
            <div className="weshop-modal-samples-row">
              {store.samples?.map((sample, idx) => (
                <div key={idx} className="weshop-sample-pill">
                  <span className="sample-name">{sample.name}</span>
                  <span className="sample-price">{sample.price}</span>
                </div>
              )) || (
                <div className="text-sm text-neutral-500">
                  Multiple collections available for immediate wholesale order.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="weshop-modal-footer">
          <WeShopPrimaryButton
            variant="outline"
            size="md"
            onClick={onClose}
          >
            {t('modal.close')}
          </WeShopPrimaryButton>

          <WeShopPrimaryButton
            variant="primary"
            size="md"
            arrow={true}
            onClick={handleBrowseStoreProducts}
          >
            {t('modal.exploreStore')}
          </WeShopPrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default WeShopStoreModal;
