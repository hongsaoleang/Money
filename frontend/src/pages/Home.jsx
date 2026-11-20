import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ArrowRight, Globe,
  ShoppingBag, Check, Package, Code
} from 'lucide-react';
import ProductGraphDashboard from '../components/ProductGraphDashboard';
import { getProductSpecs } from '../utils/productSpecs';
import ProductTelegramSelectionBar from '../components/ProductTelegramSelectionBar';

const TelegramIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const Home = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  const handleQuickAdd = (product) => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in to add items to your cart.',
        },
      });
      return;
    }
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const toggleSelectCard = (productId) => {
    setSelectedCardIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const contactSingleProduct = (product) => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in to send messages or contact via Telegram.',
        },
      });
      return;
    }
    const msg = `👋 Hello Hong Saoleang (@hongsaoleang)!\nI am interested in this product from your store:\n\n📦 Product: ${product.name}\n💰 Price: $${parseFloat(product.price).toFixed(2)} USD\n🔢 Stock: ${product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Backorder'}\n📍 Origin: ${product.originCountry || 'Verified'}\n\nPlease let me know how I can order or pay for this. Thank you!`;
    window.open(`https://t.me/hongsaoleang?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/api/products');
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error('Failed to fetch home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  const selectedProducts = safeProducts.filter((p) => selectedCardIds.includes(p.id));

  return (
    <div className="home-page">
      {/* 0. NEW ALTERNATE HOMEPAGE BANNER */}
      <div className="section-container" style={{ paddingTop: '16px', paddingBottom: '0' }}>
        <Link 
          to="/jomnenhkh-shop" 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(0, 200, 83, 0.14) 0%, rgba(16, 185, 129, 0.06) 100%)',
            border: '1px solid rgba(0, 200, 83, 0.35)',
            borderRadius: '16px',
            padding: '12px 20px',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 14px rgba(0, 200, 83, 0.08)',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🌱</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>
                JomnenhKH-Shop Modern Marketplace Homepage is now available!
              </div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>
                Explore the JomnenhKH-Shop homepage recreation with 5 featured store cards, clean minimalism, and independent suppliers.
              </div>
            </div>
          </div>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            background: '#00C853', 
            color: '#ffffff', 
            padding: '6px 16px', 
            borderRadius: '9999px',
            fontWeight: 600,
            fontSize: '13px'
          }}>
            Open JomnenhKH-Shop Home <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      {/* 1. HERO SECTION */}
      <section className="home-hero-section section-container">
        <div className="hero-content-wrap text-center">
          <h1 className="hero-main-title">
            Hardware &amp; <span className="gradient-text">Software Services</span>
          </h1>

          <div className="hero-actions-row">
            <Link to="/products" className="btn-primary hero-btn">
              Browse Products <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn-secondary hero-btn">
              Services <Code size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT INTELLIGENCE & INTERACTIVE LINE GRAPH DASHBOARD */}
      <section className="section-container product-dashboard-section">
        <ProductGraphDashboard products={products} />
      </section>

      {/* 3. HARDWARE PRODUCTS CATALOG SHOWCASE */}
      <section className="top-featured-section section-container">
        <div className="top-featured-header">
          <div>
            <h2 className="top-featured-title">
              Available <span className="gradient-text">Products</span>
            </h2>
          </div>

          <Link to="/products" className="view-all-pill">
            Full Catalog ({safeProducts.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4-Column Product Grid with Specific Specs */}
        {loading ? (
          <div className="loading-spinner">Loading product catalog...</div>
        ) : (
          <div className="featured-showcase-grid">
            {safeProducts.map((product) => {
              const specs = getProductSpecs(product);
              const isSelected = selectedCardIds.includes(product.id);

              return (
                <div 
                  key={product.id} 
                  className={`featured-spotlight-card ${isSelected ? 'card-selected' : ''}`}
                  onClick={() => toggleSelectCard(product.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Visual Thumbnail Wrap */}
                  <div className="spotlight-thumb-wrap">
                    {/* Card Selection Toggle Button */}
                    <button
                      type="button"
                      className={`card-select-checkbox ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectCard(product.id);
                      }}
                      title={isSelected ? 'Deselect this product' : 'Select product card'}
                    >
                      {isSelected ? (
                        <Check size={16} />
                      ) : (
                        <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.6)' }} />
                      )}
                    </button>

                    <img src={product.imageUrl} alt={product.name} className="spotlight-img" />
                    <div className="spotlight-badge-row">
                      <span className={`spotlight-stock-badge ${product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Backorder'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body with Specific Specs */}
                  <div className="spotlight-content">
                    <div className="spotlight-top-meta">
                      <span className="spotlight-category">{product.category?.name}</span>
                      <span className="spotlight-sku">{specs.modelId}</span>
                    </div>

                    <h3 className="spotlight-title">{product.name}</h3>

                    {/* Specific Hardware Attributes */}
                    <div className="spotlight-specs-row">
                      <span className="spec-feature-tag">{specs.spec1}</span>
                      <span className="spec-origin-tag"><Globe size={11} /> {specs.origin}</span>
                    </div>

                    <div className="spotlight-footer">
                      <span className="spotlight-price">${parseFloat(product.price).toFixed(2)}</span>

                      <div className="spotlight-actions" onClick={(e) => e.stopPropagation()}>
                        {/* Direct Telegram Contact for this Card */}
                        <button
                          type="button"
                          onClick={() => contactSingleProduct(product)}
                          className="spotlight-telegram-btn"
                          title="Contact Hong Saoleang on Telegram for this product"
                        >
                          <TelegramIcon size={16} />
                        </button>

                        {/* Add to Cart */}
                        <button 
                          onClick={() => handleQuickAdd(product)}
                          disabled={product.stockQuantity <= 0}
                          className={`spotlight-cart-btn ${addedId === product.id ? 'added' : ''}`}
                          title="Add to shopping cart"
                        >
                          {addedId === product.id ? (
                            <>
                              <Check size={15} /> Added!
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={15} /> Add to Cart
                            </>
                          )}
                        </button>

                        <Link to={`/products/${product.id}`} className="spotlight-inspect-btn" title="View Specifications">
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>


      {/* Floating Telegram Selection Bar (appears when any card is selected) */}
      <ProductTelegramSelectionBar
        selectedProducts={selectedProducts}
        onClear={() => setSelectedCardIds([])}
        onAddToCart={(items) => {
          if (!user) {
            navigate('/login', {
              state: {
                from: location,
                message: 'Please sign in to add items to your cart.',
              },
            });
            return;
          }
          items.forEach((p) => addToCart(p, 1));
          setSelectedCardIds([]);
        }}
      />
    </div>
  );
};

export default Home;
