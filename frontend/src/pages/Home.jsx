import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ArrowRight, Sparkles, Globe,
  ShoppingBag, Check, Package, BarChart3, Filter,
  ShieldCheck, Truck, Code, Users, ChevronRight, Zap
} from 'lucide-react';
import ProductGraphDashboard from '../components/ProductGraphDashboard';
import { getProductSpecs } from '../utils/productSpecs';

const Home = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
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

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="home-hero-section section-container">
        <div className="hero-content-wrap text-center">
          <div className="hero-badge-row">
            <span className="section-badge">
              <Sparkles size={13} className="text-amber-400" /> Jomnenh-KH Platform
            </span>
            <span className="hero-status-pill">
              <span className="pulse-dot green" /> System Operational
            </span>
          </div>

          <h1 className="hero-main-title">
            Precision Hardware &amp; <span className="gradient-text">Bespoke Software Systems</span>
          </h1>

          <p className="hero-main-subtitle">
            Direct-from-factory audited provenance, aerospace micro-engineering, and mission-critical cloud software systems crafted for modern enterprises.
          </p>

          <div className="hero-actions-row">
            <Link to="/products" className="btn-primary hero-btn">
              Browse Hardware Catalog <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn-secondary hero-btn">
              Custom Software Services <Code size={16} />
            </Link>
            <Link to="/about-us" className="btn-outline hero-btn">
              Meet Our Engineers <Users size={16} />
            </Link>
          </div>

          {/* Quick Metrics & SLA Bar */}
          <div className="hero-metrics-bar">
            <div className="hero-metric-item">
              <span className="metric-figure">100%</span>
              <span className="metric-caption">Audited Provenance</span>
            </div>
            <div className="metric-v-sep" />
            <div className="hero-metric-item">
              <span className="metric-figure">50+</span>
              <span className="metric-caption">Platforms Shipped</span>
            </div>
            <div className="metric-v-sep" />
            <div className="hero-metric-item">
              <span className="metric-figure">99.9%</span>
              <span className="metric-caption">Production SLA</span>
            </div>
            <div className="metric-v-sep" />
            <div className="hero-metric-item">
              <span className="metric-figure">&lt; 4-Day</span>
              <span className="metric-caption">Express Delivery</span>
            </div>
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
            <div className="flex items-center gap-2 mb-2">
              <span className="section-badge"><Package size={13} className="text-indigo-400" /> Curated Store</span>
              <span className="featured-live-beacon"><span className="pulse-dot" /> In Stock &amp; Ready</span>
            </div>
            <h2 className="top-featured-title">
              Available <span className="gradient-text">Hardware</span> Products
            </h2>
            <p className="section-subtitle">
              Engineered with audited origin ledgers, warranty certificates, and instant checkout.
            </p>
          </div>

          <Link to="/products" className="view-all-pill">
            Full Catalog ({products.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4-Column Product Grid with Specific Specs */}
        {loading ? (
          <div className="loading-spinner">Loading product catalog...</div>
        ) : (
          <div className="featured-showcase-grid">
            {products.map((product) => {
              const specs = getProductSpecs(product);
              return (
                <div 
                  key={product.id} 
                  className="featured-spotlight-card"
                >
                  {/* Visual Thumbnail Wrap */}
                  <div className="spotlight-thumb-wrap">
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

                      <div className="spotlight-actions">
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

      {/* 4. PLATFORM VALUE PILLARS */}
      <section className="section-container home-pillars-section">
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon-box">
              <ShieldCheck size={24} className="text-emerald" />
            </div>
            <h3>100% Audited Sourcing</h3>
            <p>Every product originates from verified ethical factories in Germany, Japan, Taiwan, and Switzerland with zero conflict minerals.</p>
            <Link to="/about-us" className="pillar-link">
              Read Provenance Charter <ChevronRight size={14} />
            </Link>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">
              <Truck size={24} className="text-indigo" />
            </div>
            <h3>Guaranteed 4-Day Delivery</h3>
            <p>Direct express courier routing with air waybill tracking and signature receipt guaranteed for every customer.</p>
            <Link to="/about-us#delivery" className="pillar-link">
              Calculate Delivery Date <ChevronRight size={14} />
            </Link>
          </div>

          <div className="pillar-card">
            <div className="pillar-icon-box">
              <Code size={24} className="text-cyan" />
            </div>
            <h3>Engineering Division</h3>
            <p>Need custom enterprise software? Our team designs and deploys scalable Spring Boot backends and React web apps.</p>
            <Link to="/services" className="pillar-link">
              Explore Shipped Work <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
