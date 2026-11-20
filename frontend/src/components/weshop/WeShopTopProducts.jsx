import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Plus, ShoppingBag, Check, 
  Star, MapPin, Edit3, Trash2, Box, ArrowUpRight
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import WeShopTopProductsModal from './WeShopTopProductsModal';

export const INITIAL_TOP_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'NovaPro Ultrabook M3',
    category: 'Developer Workstations',
    price: 1899.99,
    stockQuantity: 25,
    rating: '4.95',
    originCountry: 'Germany',
    description: 'Engineered for developers and creators. Featuring an OLED 120Hz display, 64GB unified memory, and 18-hour battery longevity.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    isTopProduct: true,
  },
  {
    id: 'prod-2',
    name: 'AeroSpatial Studio Headphones',
    category: 'Audio & Acoustics',
    price: 349.50,
    stockQuantity: 40,
    rating: '4.91',
    originCountry: 'Japan',
    description: 'Audiophile planar-magnetic wireless headphones with spatial sound stage and lossless 24-bit audio streaming.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    isTopProduct: true,
  },
  {
    id: 'prod-3',
    name: 'Quantum Mech Keyboard Pro',
    category: 'Developer Workstations',
    price: 219.00,
    stockQuantity: 15,
    rating: '4.88',
    originCountry: 'Taiwan',
    description: 'Gasket-mounted hot-swappable mechanical keyboard with custom factory-lubed switches and seamless Bluetooth 5.4.',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    isTopProduct: true,
  },
  {
    id: 'prod-4',
    name: 'CyberGrip Smart Ring Titanium',
    category: 'Smart Devices',
    price: 299.00,
    stockQuantity: 50,
    rating: '4.93',
    originCountry: 'Switzerland',
    description: 'Next-gen biometric health tracking, haptic gesture controls, and NFC payment in a featherlight grade-5 titanium form factor.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    isTopProduct: true,
  },
  {
    id: 'prod-5',
    name: 'Apex Wireless Ergonomic Mouse',
    category: 'Developer Workstations',
    price: 89.99,
    stockQuantity: 100,
    rating: '4.85',
    originCountry: 'South Korea',
    description: 'Ergonomic vertical posture mouse reducing wrist strain by 70%, 4000 DPI optical sensor, and silent tactile clicks.',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    isTopProduct: true,
  },
];

const WeShopTopProducts = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isAdmin = Boolean(user && (user.role === 'admin' || user.isAdmin));

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('weshop_top_in_stock_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_TOP_PRODUCTS;
  });

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [addedId, setAddedId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('weshop_top_in_stock_products', JSON.stringify(products));
  }, [products]);

  // Attempt to fetch from backend products API to merge in real products
  useEffect(() => {
    const loadBackendProducts = async () => {
      try {
        const res = await api.get('/api/products');
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          // Merge in-stock products if user has not yet customized
          const inStockBackend = res.data.filter((p) => (p.stockQuantity ?? 0) > 0);
          if (inStockBackend.length > 0 && !localStorage.getItem('weshop_top_in_stock_products_customized')) {
            setProducts(inStockBackend.slice(0, 5));
          }
        }
      } catch {
        // Backend offline, keep curated top products
      }
    };
    loadBackendProducts();
  }, []);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', {
        state: { message: 'Please sign in to add items to your cart.' },
      });
      return;
    }

    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const handleSaveProduct = (updated) => {
    localStorage.setItem('weshop_top_in_stock_products_customized', 'true');
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  const handleDeleteProduct = (productId) => {
    localStorage.setItem('weshop_top_in_stock_products_customized', 'true');
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('weshop_top_in_stock_products_customized');
    localStorage.setItem('weshop_top_in_stock_products', JSON.stringify(INITIAL_TOP_PRODUCTS));
    setProducts(INITIAL_TOP_PRODUCTS);
  };

  // Categories list
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = activeCategory === 'ALL'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section className="weshop-top-products-section weshop-feature-watermark-wrap" id="top-products">
      {/* Blurred Brand Icon Watermark in Section Background */}
      <div className="weshop-brand-watermark-bg bottom-right" aria-hidden="true">
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

      <div className="weshop-stores-container relative z-10">
        {/* Section Header */}
        <div className="weshop-stores-header">
          <div className="weshop-stores-title-group">
            <div className="flex items-center gap-2 mb-1">
              <span className="weshop-stock-dot" aria-hidden="true" />
              <span className="text-xs font-bold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                {language === 'KH' ? 'ទំនិញមានក្នុងស្តុកពិតប្រាកដ' : 'Active Warehouse Inventory'}
              </span>
            </div>
            <h2 className="weshop-stores-heading">
              {language === 'KH' ? 'ផលិតផលលេចធ្លោមានក្នុងស្តុក' : 'Top Products in Stock'}
            </h2>
            <p className="weshop-stores-subtitle">
              {language === 'KH'
                ? 'ទំនិញគុណភាពខ្ពស់ ត្រួតពិនិត្យរួចរាល់ ដឹកជញ្ជូនភ្លាមៗពីរោងចក្រ។'
                : 'Direct from vetted makers. Physically inspected, packaged, and ready for same-day delivery.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                <button
                  type="button"
                  className="weshop-btn-admin-pill"
                  onClick={() => {
                    setEditingProduct(null);
                    setModalOpen(true);
                  }}
                  title="Admin: Add / Put Top Products"
                >
                  <Plus size={14} />
                  <span>{language === 'KH' ? 'បន្ថែមផលិតផល' : 'Add Top Product'}</span>
                </button>
                <button
                  type="button"
                  className="weshop-btn-admin-pill secondary"
                  onClick={() => {
                    setEditingProduct(null);
                    setModalOpen(true);
                  }}
                  title="Admin: Manage Top Products"
                >
                  <Box size={14} />
                  <span>{language === 'KH' ? 'គ្រប់គ្រង' : 'Manage List'}</span>
                </button>
              </>
            )}

            <button
              type="button"
              className="weshop-explore-stores-btn"
              onClick={() => navigate('/products')}
            >
              <span>{language === 'KH' ? 'មើលទំនិញទាំងអស់' : 'Explore All Products'}</span>
              <ArrowRight size={16} className="weshop-explore-arrow" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills Row */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`weshop-category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'ALL' ? (language === 'KH' ? 'ទាំងអស់' : 'All Hardware') : cat}
              </button>
            ))}
          </div>
        )}

        {/* 5 Cards Horizontally in One Row on Desktop (8px subtle rounded corners) */}
        <div className="weshop-stores-grid">
          {filteredProducts.map((prod) => (
            <article
              key={prod.id}
              className="weshop-store-card weshop-product-card"
              onClick={() => navigate(`/products`)}
              tabIndex={0}
              role="button"
              aria-label={`View ${prod.name}, price $${parseFloat(prod.price).toFixed(2)}`}
            >
              {/* Cover Image Box (Subtle 8px Radius) */}
              <div className="weshop-store-img-box">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="weshop-store-cover-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Category Pill Tag */}
                <div className="weshop-store-category-chip">
                  {prod.category}
                </div>

                {/* Stock Indicator Badge */}
                <div className="weshop-prod-stock-chip">
                  <span className="weshop-prod-stock-dot" />
                  <span>{prod.stockQuantity > 0 ? `${prod.stockQuantity} in stock` : 'Low Stock'}</span>
                </div>

                {/* Admin Quick Action Controls */}
                {isAdmin && (
                  <div className="weshop-card-admin-bar" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="weshop-card-admin-action"
                      onClick={() => {
                        setEditingProduct(prod);
                        setModalOpen(true);
                      }}
                      title="Edit this top product"
                      aria-label="Edit product"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      className="weshop-card-admin-action delete"
                      onClick={() => {
                        if (confirm(`Remove "${prod.name}" from top products?`)) {
                          handleDeleteProduct(prod.id);
                        }
                      }}
                      title="Delete from top products"
                      aria-label="Delete product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info Box Underneath */}
              <div className="weshop-store-info-box flex-col items-start gap-2 relative overflow-hidden">
                {/* Subtle blurred card background watermark */}
                <div className="weshop-card-watermark" aria-hidden="true">
                  <img
                    src="/jomnenhkh-icon.jpg"
                    onError={(e) => {
                      if (e.currentTarget.src !== '/JomnenhKH.jpg') {
                        e.currentTarget.src = '/JomnenhKH.jpg';
                      }
                    }}
                    alt=""
                    className="weshop-card-watermark-img"
                  />
                </div>

                <div className="w-full flex items-start justify-between gap-1 relative z-10">
                  <div className="weshop-store-titles min-w-0">
                    <h3 className="weshop-store-name truncate text-sm" title={prod.name}>
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={11} className="text-slate-400" />
                      <span>{prod.originCountry || 'Verified Origin'}</span>
                      {prod.rating && (
                        <>
                          <span>•</span>
                          <span className="flex items-center text-amber-500 font-semibold">
                            <Star size={10} fill="currentColor" className="mr-0.5" />
                            {prod.rating}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="weshop-store-arrow-circle" aria-hidden="true">
                    <ArrowUpRight size={14} className="weshop-store-arrow-icon" />
                  </div>
                </div>

                {/* Price and Add to Cart Action */}
                <div className="w-full flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 relative z-10">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    ${parseFloat(prod.price).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    className={`weshop-prod-quick-add-btn ${addedId === prod.id ? 'added' : ''}`}
                    onClick={(e) => handleQuickAdd(prod, e)}
                    title="Add to Shopping Cart"
                  >
                    {addedId === prod.id ? (
                      <>
                        <Check size={13} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={13} />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Admin Top Products Modal */}
      {isAdmin && modalOpen && (
        <WeShopTopProductsModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(null);
          }}
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetDefaults={handleResetDefaults}
          editingProduct={editingProduct}
        />
      )}
    </section>
  );
};

export default WeShopTopProducts;
