import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ArrowRight, Code, Cpu, Smartphone, ShieldCheck, Sparkles, Clock, Globe,
  ShoppingBag, Check, Zap, Layers, Users, Terminal
} from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';

const Home = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [services, setServices] = useState([]);
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
        const [prodRes, upRes, srvRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/products/upcoming'),
          api.get('/api/services'),
        ]);
        setFeaturedProducts(prodRes.data.slice(0, 4));
        setUpcomingProducts(upRes.data);
        setServices(srvRes.data);
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
      {/* 1. TOP FEATURED PRODUCTS SHOWCASE (SEEN IMMEDIATELY ON OPEN) */}
      <section className="top-featured-section section-container">
        <div className="top-featured-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="section-badge"><Sparkles size={13} className="text-amber-400" /> Featured Store</span>
              <span className="featured-live-beacon"><span className="pulse-dot" /> Live Catalog</span>
            </div>
            <h1 className="top-featured-title">
              Featured <span className="gradient-text">Products</span>
            </h1>
          </div>

          <Link to="/products" className="view-all-pill">
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {/* Featured Showcase Cards */}
        {loading ? (
          <div className="loading-spinner">Loading featured hardware...</div>
        ) : (
          <div className="featured-showcase-grid">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="featured-spotlight-card"
              >
                {/* Visual Thumbnail Wrap */}
                <div className="spotlight-thumb-wrap">
                  <img src={product.imageUrl} alt={product.name} className="spotlight-img" />
                  <div className="spotlight-badge-row">
                    <span className={`spotlight-stock-badge ${product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
                      {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Backorder'}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="spotlight-content">
                  <span className="spotlight-category">{product.category?.name}</span>
                  <h3 className="spotlight-title">{product.name}</h3>

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
                            <Check size={16} /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} /> Add to Cart
                          </>
                        )}
                      </button>

                      <Link to={`/products/${product.id}`} className="spotlight-inspect-btn" title="View Specifications">
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. ABOUT US & DEVELOPERS SHOWCASE */}
      <section className="about-showcase-section section-container">
        <div className="about-showcase-header">
          <div>
            <span className="section-badge"><Users size={13} className="text-indigo-400" /> About Jomnenh-KH</span>
            <h2 className="section-title">
              Meet Our <span className="gradient-text">Developers</span>
            </h2>
            <p className="section-subtitle">
              The engineers and creators who developed the Jomnenh-KH platform.
            </p>
          </div>

          <Link to="/about-us" className="view-all-pill">
            About Us <ArrowRight size={14} />
          </Link>
        </div>

        <div className="dev-team-grid">
          {/* Lead Architect */}
          <div className="dev-card lead-card">
            <div className="dev-card-top">
              <div className="dev-avatar-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                  alt="Hong Saoleang" 
                  className="dev-avatar" 
                />
                <span className="dev-status-indicator" title="Lead Architect" />
              </div>
              <div className="dev-meta">
                <div className="flex items-center gap-2">
                  <h3 className="dev-name">Hong Saoleang</h3>
                  <span className="dev-pill-lead">Lead</span>
                </div>
                <span className="dev-role">Founder &amp; Full-Stack Architect</span>
              </div>
            </div>
            <p className="dev-bio">
              Architected the core system, Spring Boot REST services, JWT security, and PostgreSQL architecture.
            </p>
            <div className="dev-skills">
              <span className="dev-skill-tag">Spring Boot</span>
              <span className="dev-skill-tag">React.js</span>
              <span className="dev-skill-tag">PostgreSQL</span>
              <span className="dev-skill-tag">Docker</span>
            </div>
          </div>

          {/* Frontend Engineer */}
          <div className="dev-card">
            <div className="dev-card-top">
              <div className="dev-avatar-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" 
                  alt="Alex Rivera" 
                  className="dev-avatar" 
                />
              </div>
              <div className="dev-meta">
                <h3 className="dev-name">Alex Rivera</h3>
                <span className="dev-role">Frontend &amp; UI Systems</span>
              </div>
            </div>
            <p className="dev-bio">
              Designed responsive layout architecture, high-density smartphone ergonomics, and state management.
            </p>
            <div className="dev-skills">
              <span className="dev-skill-tag">React</span>
              <span className="dev-skill-tag">Vite</span>
              <span className="dev-skill-tag">CSS Modules</span>
              <span className="dev-skill-tag">UI/UX</span>
            </div>
          </div>

          {/* Infrastructure Engineer */}
          <div className="dev-card">
            <div className="dev-card-top">
              <div className="dev-avatar-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80" 
                  alt="Devon Vance" 
                  className="dev-avatar" 
                />
              </div>
              <div className="dev-meta">
                <h3 className="dev-name">Devon Vance</h3>
                <span className="dev-role">Database &amp; Cloud Infra</span>
              </div>
            </div>
            <p className="dev-bio">
              Engineered database query optimizations, automated deployment pipelines, and mail servers.
            </p>
            <div className="dev-skills">
              <span className="dev-skill-tag">PostgreSQL</span>
              <span className="dev-skill-tag">SMTP</span>
              <span className="dev-skill-tag">CI/CD</span>
              <span className="dev-skill-tag">Security</span>
            </div>
          </div>
        </div>

        <div className="about-showcase-bottom">
          <Link to="/about-us" className="btn-secondary flex items-center gap-2">
            <span>Learn More in About Us</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Scheduled Release Products (Upcoming) */}
      {upcomingProducts.length > 0 && (
        <section className="section-container upcoming-section">
          <div className="upcoming-banner">
            <div className="upcoming-header">
              <div className="upcoming-badge">
                <Clock size={16} /> Upcoming Scheduled Product Releases
              </div>
              <h2>Exclusive Pre-Releases Countdown</h2>
              <p>These devices are scheduled for release by our administration team. Bookmark and set your reminders.</p>
            </div>

            <div className="upcoming-grid">
              {upcomingProducts.map((product) => (
                <div key={product.id} className="upcoming-card">
                  <img src={product.imageUrl} alt={product.name} className="upcoming-thumb" />
                  <div className="upcoming-info">
                    <span className="product-category">{product.category?.name}</span>
                    <h3>{product.name}</h3>
                    <div className="countdown-wrap">
                      <span className="countdown-label">Releasing In:</span>
                      <CountdownTimer targetDate={product.releaseDate} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Software Development Capabilities Overview */}
      <section className="section-container software-agency-banner">
        <div className="section-header text-center">
          <span className="section-badge">Engineering</span>
          <h2 className="section-title">Software Development</h2>
          <p className="section-subtitle">
            Scalable web, mobile, and cloud software engineering.
          </p>
        </div>

        <div className="services-grid">
          {services.map((srv) => (
            <div key={srv.id} className="service-card">
              <div className="service-icon-box">
                {srv.slug.includes('web') ? <Code size={28} /> : srv.slug.includes('mobile') ? <Smartphone size={28} /> : <Cpu size={28} />}
              </div>
              <h3 className="service-title">{srv.title}</h3>
              <p className="service-desc">{srv.summary}</p>
              <Link to="/services" className="service-learn-more">
                Learn more <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <div className="agency-cta-box">
          <div className="cta-text">
            <h3>Have a software project in mind?</h3>
            <p>Let's build your next digital product.</p>
          </div>
          <Link to="/services#inquiry" className="btn-primary cta-btn">
            Request Discovery
          </Link>
        </div>
      </section>

      {/* Merchant / Client Deploy Callout */}
      <section className="section-container merchant-callout">
        <div className="merchant-box">
          <div className="merchant-content">
            <span className="section-badge">Partnership</span>
            <h2>Sell on Jomnenh-KH</h2>
            <p>
              List your hardware with verified origin and instant customer reach.
            </p>
            <Link to="/client/deploy" className="btn-secondary">
              Deploy Product <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
