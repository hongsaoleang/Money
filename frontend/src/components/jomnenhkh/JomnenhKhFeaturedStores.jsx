import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Plus, RotateCcw
} from 'lucide-react';
import JomnenhKhStoreCard from './JomnenhKhStoreCard';
import JomnenhKhStoreModal from './JomnenhKhStoreModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const DEFAULT_STORES = [
  {
    id: 'homestyle',
    name: 'HomeStyle',
    countNum: '128',
    category: 'Home Decor',
    categoryKey: 'store.homestyle.category',
    descKey: 'store.homestyle.desc',
    description: 'Specializing in Scandinavian stoneware, handcrafted ceramic dinnerware, fluted decorative vessels, and solid oak wall furnishings for serene domestic spaces.',
    iconName: 'Home',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Elegant home decoration and ceramic products on wooden shelves',
    rating: '4.95',
    location: 'Copenhagen, Denmark',
    leadTime: '3–5 Days',
    positiveReviews: '99.6%',
    lowMoq: '10 Units Min',
    samples: [
      { name: 'Fluted Ceramic Vase', price: '$34.00' },
      { name: 'Nordic Oak Floating Shelf', price: '$58.00' },
      { name: 'Stoneware Candleholder', price: '$22.00' },
    ],
  },
  {
    id: 'trendwear',
    name: 'TrendWear',
    countNum: '94',
    category: 'Apparel',
    categoryKey: 'store.trendwear.category',
    descKey: 'store.trendwear.desc',
    description: 'Ethically spun organic cotton basics, structured heavyweight tees, and breathable relaxed linen trousers designed for longevity and effortless layering.',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Minimalist clothing displayed on a wooden clothes rack',
    rating: '4.91',
    location: 'Kyoto, Japan',
    leadTime: '2–4 Days',
    positiveReviews: '99.2%',
    lowMoq: '8 Units Min',
    samples: [
      { name: 'Oversized Linen Shirt', price: '$46.00' },
      { name: 'Relaxed Tailored Chino', price: '$64.00' },
      { name: 'Heavy Organic Tee', price: '$28.00' },
    ],
  },
  {
    id: 'officepro',
    name: 'OfficePro',
    countNum: '76',
    category: 'Workspace',
    categoryKey: 'store.officepro.category',
    descKey: 'store.officepro.desc',
    description: 'Ergonomic workspace accessories, walnut laptop risers, desk pads, and biophilic office accents engineered for peak focus.',
    iconName: 'Leaf',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern workspace with a laptop and green plant',
    rating: '4.88',
    location: 'Berlin, Germany',
    leadTime: '2–4 Days',
    positiveReviews: '99.4%',
    lowMoq: '5 Units Min',
    samples: [
      { name: 'Solid Walnut Laptop Stand', price: '$52.00' },
      { name: 'Felt Desk Mat (Large)', price: '$30.00' },
      { name: 'Magnetic Cable Hub', price: '$18.00' },
    ],
  },
  {
    id: 'comfort-living',
    name: 'Comfort Living',
    countNum: '110',
    category: 'Living',
    categoryKey: 'store.comfort.category',
    descKey: 'store.comfort.desc',
    description: 'Tactile wool blankets, sage green cushions, and heirloom soft furnishings designed to infuse spaces with warmth and tranquility.',
    iconName: 'Armchair',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Cozy living room with a green cushion on a beige sofa',
    rating: '4.93',
    location: 'Stockholm, Sweden',
    leadTime: '3–6 Days',
    positiveReviews: '99.5%',
    lowMoq: '12 Units Min',
    samples: [
      { name: 'Sage Linen Throw Cushion', price: '$38.00' },
      { name: 'Waffle Knit Wool Blanket', price: '$72.00' },
      { name: 'Hand-Tufted Wool Rug', price: '$120.00' },
    ],
  },
  {
    id: 'daily-goods',
    name: 'Daily Goods',
    countNum: '132',
    category: 'Tableware',
    categoryKey: 'store.daily.category',
    descKey: 'store.daily.desc',
    description: 'Hand-thrown matte espresso cups, ribbed carafes, and heat-retaining ceramic drippers calibrated for coffee purists and culinary studios.',
    iconName: 'Coffee',
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Minimalist ceramic cups and a decorative vase',
    rating: '4.97',
    location: 'Portland, OR, USA',
    leadTime: '1–3 Days',
    positiveReviews: '99.8%',
    lowMoq: '6 Units Min',
    samples: [
      { name: 'Matte Glazed Espresso Cup', price: '$16.00' },
      { name: 'Ceramic Pour-Over Dripper', price: '$32.00' },
      { name: 'Ribbed Stoneware Carafe', price: '$40.00' },
    ],
  },
];

const STORAGE_KEY = 'jomnenhkh_featured_stores';

const JomnenhKhFeaturedStores = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load stores from localStorage', e);
    }
    return DEFAULT_STORES;
  });

  const [selectedStore, setSelectedStore] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialEdit, setModalInitialEdit] = useState(false);

  // Sync stores state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
    } catch (e) {
      console.warn('Failed to save stores to localStorage', e);
    }
  }, [stores]);

  const handleCardClick = (store) => {
    setSelectedStore(store);
    setModalInitialEdit(false);
    setModalOpen(true);
  };

  const handleAdminEdit = (store) => {
    setSelectedStore(store);
    setModalInitialEdit(true);
    setModalOpen(true);
  };

  const handleAdminAddStore = () => {
    const newStoreTemplate = {
      id: `store_${Date.now()}`,
      isNew: true,
      name: 'New Independent Store',
      category: 'Workspace',
      countNum: '50',
      rating: '4.90',
      location: 'Phnom Penh, Cambodia',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'New store featured collection',
      description: 'Crafted wholesale goods and custom supply services.',
      leadTime: '2–4 Days',
      positiveReviews: '99.5%',
      lowMoq: '5 Units Min',
      iconName: 'Store',
      samples: [
        { name: 'Signature Product', price: '$35.00' },
        { name: 'Boutique Collection Item', price: '$48.00' },
      ],
    };
    setSelectedStore(newStoreTemplate);
    setModalInitialEdit(true);
    setModalOpen(true);
  };

  const handleSaveStore = (updatedStore) => {
    setStores((prev) => {
      const exists = prev.some((s) => s.id === updatedStore.id);
      if (exists) {
        return prev.map((s) => (s.id === updatedStore.id ? updatedStore : s));
      }
      return [updatedStore, ...prev];
    });
    setSelectedStore(updatedStore);
  };

  const handleDeleteStore = (storeId) => {
    setStores((prev) => prev.filter((s) => s.id !== storeId));
    if (selectedStore?.id === storeId) {
      setSelectedStore(null);
      setModalOpen(false);
    }
  };

  const handleResetStores = () => {
    if (window.confirm('Reset all featured stores back to default factory settings? Any custom stores will be restored.')) {
      setStores(DEFAULT_STORES);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExploreStoresClick = () => {
    navigate('/products');
  };

  // Localize store categories & product count suffixes dynamically
  const localizedStores = stores.map((s) => {
    const localizedCategory = s.categoryKey ? t(s.categoryKey, s.category) : s.category;
    const localizedDesc = s.descKey ? t(s.descKey, s.description) : s.description;
    const count = s.countNum || (s.productsCount ? s.productsCount.split(' ')[0] : '50');
    return {
      ...s,
      category: localizedCategory || s.category,
      description: localizedDesc || s.description,
      productsCount: `${count} ${t('stores.productsSuffix', 'products')}`,
    };
  });

  return (
    <section id="featured-stores" className="jomnenhkh-featured-stores-section weshop-featured-stores-section">
      <div className="jomnenhkh-stores-container weshop-stores-container">
        {/* Section Header */}
        <div className="jomnenhkh-stores-header weshop-stores-header">
          <div className="jomnenhkh-stores-title-group weshop-stores-title-group">
            <h2 className="jomnenhkh-stores-heading weshop-stores-heading">{t('stores.heading', 'Stores worth knowing')}</h2>
            <p className="jomnenhkh-stores-subtitle weshop-stores-subtitle">
              {t('stores.subtitle', 'Meet the people behind your next good find.')}
            </p>
          </div>

          {/* Action Buttons: Non-admin vs Admin */}
          <div className="jomnenhkh-stores-header-actions weshop-stores-header-actions">
            {isAdmin && (
              <>
                <button
                  type="button"
                  className="jomnenhkh-admin-pill-btn weshop-admin-pill-btn primary"
                  onClick={handleAdminAddStore}
                  title="Add new featured store"
                >
                  <Plus size={15} /> Add Store
                </button>
                <button
                  type="button"
                  className="jomnenhkh-admin-pill-btn weshop-admin-pill-btn"
                  onClick={handleResetStores}
                  title="Reset to default 5 stores"
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </>
            )}

            <button
              type="button"
              className="jomnenhkh-explore-stores-btn weshop-explore-stores-btn"
              onClick={handleExploreStoresClick}
              aria-label={t('stores.explore', 'Explore stores →')}
            >
              <span>{t('stores.explore', 'Explore stores')}</span>
              <ArrowRight size={16} className="jomnenhkh-explore-arrow weshop-explore-arrow" />
            </button>
          </div>
        </div>

        {/* Store Card Grid: Horizontally laid out on Desktop with Reduced Rounded Corners */}
        <div className="jomnenhkh-stores-grid weshop-stores-grid">
          {localizedStores.map((store) => (
            <JomnenhKhStoreCard
              key={store.id}
              store={store}
              onClick={handleCardClick}
              isAdmin={isAdmin}
              onEdit={handleAdminEdit}
              onDelete={handleDeleteStore}
            />
          ))}
        </div>
      </div>

      {/* Interactive Store Detail & Admin Edit Modal */}
      <JomnenhKhStoreModal
        store={selectedStore}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedStore(null);
        }}
        isAdmin={isAdmin}
        onSave={handleSaveStore}
        onDelete={handleDeleteStore}
        initialEditMode={modalInitialEdit}
      />
    </section>
  );
};

export default JomnenhKhFeaturedStores;
