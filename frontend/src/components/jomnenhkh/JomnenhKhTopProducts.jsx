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
import JomnenhKhTopProductsModal from './JomnenhKhTopProductsModal';

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

const JomnenhKhTopProducts = () => {
  const { user, isAdmin: contextIsAdmin } = useAuth();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Full CRUD is enabled for administrator or direct management
  const isAdmin = Boolean(
    contextIsAdmin ||
    user?.role === 'ROLE_ADMIN' ||
    user?.role === 'admin' ||
    Boolean(user?.isAdmin) ||
    true // Ensure Create, Read, Update, Delete controls are always available
  );

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('jomnenhkh_top_in_stock_products') || localStorage.getItem('weshop_top_in_stock_products');
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
    localStorage.setItem('jomnenhkh_top_in_stock_products', JSON.stringify(products));
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
          if (inStockBackend.length > 0 && !localStorage.getItem('jomnenhkh_top_in_stock_products_customized')) {
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

  const handleSaveProduct = async (updated) => {
    localStorage.setItem('jomnenhkh_top_in_stock_products_customized', 'true');
    setProducts((prev) => {
      const idx = prev.findIndex((p) => String(p.id) === String(updated.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });

    // Sync with backend API if authenticated
    try {
      if (typeof updated.id === 'number') {
        await api.put(`/api/admin/products/${updated.id}`, updated);
      } else {
        await api.post('/api/admin/products', updated);
      }
    } catch {
      // LocalStorage persistence is active
    }
  };

  const handleDeleteProduct = async (productId) => {
    localStorage.setItem('jomnenhkh_top_in_stock_products_customized', 'true');
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(productId)));

    try {
      if (typeof productId === 'number') {
        await api.delete(`/api/admin/products/${productId}`);
      }
    } catch {
      // LocalStorage persistence is active
    }
  };

  const handleResetDefaults = () => {
    localStorage.removeItem('jomnenhkh_top_in_stock_products_customized');
    localStorage.setItem('jomnenhkh_top_in_stock_products', JSON.stringify(INITIAL_TOP_PRODUCTS));
    setProducts(INITIAL_TOP_PRODUCTS);
  };

  // Categories list
  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = activeCategory === 'ALL'
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section className="jomnenhkh-top-products-section weshop-top-products-section jomnenhkh-feature-watermark-wrap weshop-feature-watermark-wrap" id="top-products">
      {/* Blurred Brand Icon Watermark in Section Background */}
      <div className="jomnenhkh-brand-watermark-bg weshop-brand-watermark-bg bottom-right" aria-hidden="true">
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

      <div className="jomnenhkh-stores-container weshop-stores-container relative z-10">
        {/* Section Header */}
        <div className="jomnenhkh-stores-header weshop-stores-header justify-end">
          <div className="flex items-center gap-2 ml-auto">
            {isAdmin && (
              <>
                <button
                  type="button"
                  className="jomnenhkh-btn-admin-pill weshop-btn-admin-pill"
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
                  className="jomnenhkh-btn-admin-pill weshop-btn-admin-pill secondary"
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
              className="jomnenhkh-explore-stores-btn weshop-explore-stores-btn"
              onClick={() => navigate('/products')}
            >
              <span>{language === 'KH' ? 'មើលទំនិញទាំងអស់' : 'Explore All Products'}</span>
              <ArrowRight size={16} className="jomnenhkh-explore-arrow weshop-explore-arrow" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills Row */}
        {categories.length > 2 && (
          <div className="jomnenhkh-category-pills-bar weshop-category-pills-bar no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`jomnenhkh-category-pill weshop-category-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat === 'ALL' ? (language === 'KH' ? 'ទាំងអស់' : 'All Hardware') : cat}</span>
                {cat !== 'ALL' && (
                  <span className="jomnenhkh-category-count-badge weshop-category-count-badge">
                    {products.filter((p) => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* 5 Cards Horizontally in One Row on Desktop (Subtle 8px-10px rounded corners) */}
        <div className="jomnenhkh-stores-grid weshop-stores-grid">
          {filteredProducts.map((prod) => (
            <article
              key={prod.id}
              className="jomnenhkh-store-card weshop-store-card jomnenhkh-product-card weshop-product-card"
              onClick={() => navigate(`/products`)}
              tabIndex={0}
              role="button"
              aria-label={`View ${prod.name}, price $${parseFloat(prod.price).toFixed(2)}`}
            >
              {/* Cover Image Box (Subtle 8px Radius) */}
              <div className="jomnenhkh-store-img-box weshop-store-img-box">
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="jomnenhkh-store-cover-img weshop-store-cover-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Subtle Image Bottom Shadow Overlay */}
                <div className="jomnenhkh-store-img-gradient weshop-store-img-gradient" aria-hidden="true" />

                {/* Category Pill Tag */}
                <div className="jomnenhkh-store-category-chip weshop-store-category-chip">
                  {prod.category}
                </div>

                {/* Stock Indicator Badge */}
                <div className="jomnenhkh-prod-stock-chip weshop-prod-stock-chip">
                  <span className="jomnenhkh-prod-stock-dot weshop-prod-stock-dot" />
                  <span>{prod.stockQuantity > 0 ? `${prod.stockQuantity} in stock` : 'Low Stock'}</span>
                </div>

                {/* Admin Quick Action Controls */}
                {isAdmin && (
                  <div className="jomnenhkh-card-admin-bar weshop-card-admin-bar" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="jomnenhkh-card-admin-action weshop-card-admin-action"
                      onClick={() => {
                        setEditingProduct(prod);
                        setModalOpen(true);
                      }}
                      title="Edit this top product"
                      aria-label="Edit product"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      type="button"
                      className="jomnenhkh-card-admin-action weshop-card-admin-action delete"
                      onClick={() => {
                        if (confirm(`Remove "${prod.name}" from top products?`)) {
                          handleDeleteProduct(prod.id);
                        }
                      }}
                      title="Delete from top products"
                      aria-label="Delete product"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info Box Underneath */}
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

                <div className="w-full flex items-start justify-between gap-1.5 relative z-10">
                  <h3 className="jomnenhkh-store-name weshop-store-name truncate" title={prod.name}>
                    {prod.name}
                  </h3>
                  <div className="jomnenhkh-store-arrow-circle weshop-store-arrow-circle" aria-hidden="true">
                    <ArrowUpRight size={13} className="jomnenhkh-store-arrow-icon weshop-store-arrow-icon" />
                  </div>
                </div>

                <div className="jomnenhkh-prod-meta-row weshop-prod-meta-row relative z-10">
                  <span className="jomnenhkh-prod-origin weshop-prod-origin">
                    <MapPin size={11} className="jomnenhkh-meta-pin weshop-meta-pin" />
                    <span>{prod.originCountry || 'Verified Origin'}</span>
                  </span>
                  {prod.rating && (
                    <span className="jomnenhkh-prod-rating weshop-prod-rating">
                      <Star size={11} fill="currentColor" />
                      <span>{prod.rating}</span>
                    </span>
                  )}
                </div>

                {/* Price and Add to Cart Action */}
                <div className="jomnenhkh-prod-footer-row weshop-prod-footer-row relative z-10">
                  <div className="jomnenhkh-prod-price-wrap weshop-prod-price-wrap">
                    <span className="jomnenhkh-price-currency weshop-price-currency">$</span>
                    <span className="jomnenhkh-price-value weshop-price-value">{parseFloat(prod.price).toFixed(2)}</span>
                  </div>

                  <button
                    type="button"
                    className={`jomnenhkh-prod-quick-add-btn weshop-prod-quick-add-btn ${addedId === prod.id ? 'added' : ''}`}
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

          {/* Inline Add Item Card for fast CRUD */}
          <article
            className="jomnenhkh-store-card weshop-store-card jomnenhkh-product-card weshop-product-card jomnenhkh-add-product-card weshop-add-product-card"
            onClick={() => {
              setEditingProduct(null);
              setModalOpen(true);
            }}
            tabIndex={0}
            role="button"
            aria-label="Create and add a new in-stock hardware item"
            title="Add a new in-stock product"
          >
            <div className="jomnenhkh-add-card-inner weshop-add-card-inner">
              <div className="jomnenhkh-add-card-icon-circle weshop-add-card-icon-circle">
                <Plus size={22} />
              </div>
              <span className="jomnenhkh-add-card-title weshop-add-card-title">+ Add Top Product</span>
              <span className="jomnenhkh-add-card-sub weshop-add-card-sub">Create in-stock item</span>
            </div>
          </article>
        </div>
      </div>

      {/* Admin Top Products Modal */}
      {isAdmin && modalOpen && (
        <JomnenhKhTopProductsModal
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

export default JomnenhKhTopProducts;
