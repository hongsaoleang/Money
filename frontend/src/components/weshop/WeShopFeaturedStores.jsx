import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, Shirt, Leaf, Armchair, Coffee, ArrowRight
} from 'lucide-react';
import WeShopStoreCard from './WeShopStoreCard';
import WeShopStoreModal from './WeShopStoreModal';

// Five exact stores from specification with matching images, icons, and product counts
export const FEATURED_STORES = [
  {
    id: 'homestyle',
    name: 'HomeStyle',
    productsCount: '128 products',
    category: 'Home Decor',
    icon: Home,
    // Elegant home decoration and ceramic products on wooden shelves
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Elegant home decoration and ceramic products on wooden shelves',
    rating: '4.95',
    location: 'Copenhagen, Denmark',
    description: 'Bespoke ceramics, sculpted stoneware vases, and minimalist home accessories crafted from natural Nordic clay.',
    samples: [
      { name: 'Fluted Ceramic Vase', price: '$34.00' },
      { name: 'Nordic Oak Floating Shelf', price: '$58.00' },
      { name: 'Stoneware Candleholder', price: '$22.00' },
    ],
  },
  {
    id: 'trendwear',
    name: 'TrendWear',
    productsCount: '94 products',
    category: 'Apparel',
    icon: Shirt,
    // Minimalist clothing displayed on a wooden clothes rack
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Minimalist clothing displayed on a wooden clothes rack',
    rating: '4.91',
    location: 'Kyoto, Japan',
    description: 'Consciously made unisex apparel, heavyweight organic cotton basics, and relaxed linen workwear for mindful wardrobes.',
    samples: [
      { name: 'Oversized Linen Shirt', price: '$46.00' },
      { name: 'Relaxed Tailored Chino', price: '$64.00' },
      { name: 'Heavy Organic Tee', price: '$28.00' },
    ],
  },
  {
    id: 'officepro',
    name: 'OfficePro',
    productsCount: '76 products',
    category: 'Workspace',
    icon: Leaf,
    // Modern workspace with a laptop and green plant
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern workspace with a laptop and green plant',
    rating: '4.88',
    location: 'Berlin, Germany',
    description: 'Ergonomic workspace accessories, walnut laptop risers, desk pads, and biophilic office accents engineered for peak focus.',
    samples: [
      { name: 'Solid Walnut Laptop Stand', price: '$52.00' },
      { name: 'Felt Desk Mat (Large)', price: '$30.00' },
      { name: 'Magnetic Cable Hub', price: '$18.00' },
    ],
  },
  {
    id: 'comfort-living',
    name: 'Comfort Living',
    productsCount: '110 products',
    category: 'Living',
    icon: Armchair,
    // Cozy living room with a green cushion on a beige sofa
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Cozy living room with a green cushion on a beige sofa',
    rating: '4.93',
    location: 'Stockholm, Sweden',
    description: 'Tactile wool blankets, sage green cushions, and heirloom soft furnishings designed to infuse spaces with warmth and tranquility.',
    samples: [
      { name: 'Sage Linen Throw Cushion', price: '$38.00' },
      { name: 'Waffle Knit Wool Blanket', price: '$72.00' },
      { name: 'Hand-Tufted Wool Rug', price: '$120.00' },
    ],
  },
  {
    id: 'daily-goods',
    name: 'Daily Goods',
    productsCount: '132 products',
    category: 'Tableware',
    icon: Coffee,
    // Minimalist ceramic cups and a decorative vase
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Minimalist ceramic cups and a decorative vase',
    rating: '4.97',
    location: 'Portland, OR, USA',
    description: 'Everyday ritual essentials, matte glazed espresso tumblers, drippers, and sculptural vessels made to elevate daily moments.',
    samples: [
      { name: 'Matte Glazed Espresso Cup', price: '$16.00' },
      { name: 'Ceramic Pour-Over Dripper', price: '$32.00' },
      { name: 'Ribbed Stoneware Carafe', price: '$40.00' },
    ],
  },
];

const WeShopFeaturedStores = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (store) => {
    setSelectedStore(store);
    setModalOpen(true);
  };

  const handleExploreStoresClick = () => {
    navigate('/products');
  };

  return (
    <section id="featured-stores" className="weshop-featured-stores-section">
      <div className="weshop-stores-container">
        {/* Section Header */}
        <div className="weshop-stores-header">
          <div className="weshop-stores-title-group">
            <h2 className="weshop-stores-heading">Stores worth knowing</h2>
            <p className="weshop-stores-subtitle">
              Meet the people behind your next good find.
            </p>
          </div>

          {/* Explore Stores → Button */}
          <button
            type="button"
            className="weshop-explore-stores-btn"
            onClick={handleExploreStoresClick}
            aria-label="Explore all stores"
          >
            <span>Explore stores</span>
            <ArrowRight size={16} className="weshop-explore-arrow" />
          </button>
        </div>

        {/* Store Card Grid: Exactly 5 Cards Horizontally in One Row on Desktop */}
        <div className="weshop-stores-grid">
          {FEATURED_STORES.map((store) => (
            <WeShopStoreCard
              key={store.id}
              store={store}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {/* Interactive Store Detail Modal */}
      <WeShopStoreModal
        store={selectedStore}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
};

export default WeShopFeaturedStores;
