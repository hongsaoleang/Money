import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Code, Cpu, Smartphone, ShieldCheck, Sparkles, Clock, Globe } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import InteractiveLanyardBadge from '../components/InteractiveLanyardBadge';

const Home = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, upRes, srvRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/products/upcoming'),
          api.get('/api/services'),
        ]);
        setFeaturedProducts(prodRes.data.slice(0, 3));
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
      {/* Hero Section */}
      <section className="hero-section hero-section-split">
        <div className="hero-grid">
          <div className="hero-content hero-content-split">
            <div className="hero-badge">
              <Sparkles size={14} /> Hardware &amp; Software
            </div>
            <h1 className="hero-title">
              Where Precision <span className="gradient-text">Hardware</span> Meets Enterprise <span className="gradient-text">Software</span>.
            </h1>
            <p className="hero-subtitle">
              Curated tech hardware and bespoke software engineering.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-primary hero-btn">
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link to="/services" className="btn-outline hero-btn">
                Hire Software Team <Code size={18} />
              </Link>
            </div>

            <div className="hero-metrics">
              <div className="metric-item">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">Provenance</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-val">50+</span>
                <span className="metric-lbl">Apps Shipped</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-val">99.9%</span>
                <span className="metric-lbl">Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Interactive Hanging Lanyard ID Badge Showcase */}
          <div className="hero-badge-container">
            <div className="hero-badge-ambient-glow" />
            <InteractiveLanyardBadge 
              initialName={user?.fullName || 'Alex Rivera'}
              initialRole={user?.role === 'ROLE_ADMIN' ? 'Chief Systems Architect' : 'Lead Hardware & AI Engineer'}
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <span className="section-badge">Store</span>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link to="/products" className="view-all-link">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                  <span className="origin-badge">
                    <Globe size={13} /> {product.originCountry || 'Imported'}
                  </span>
                </div>
                <div className="product-details">
                  <span className="product-category">{product.category?.name}</span>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-provenance-snippet">
                    <strong>Origin:</strong> {product.provenanceDetails?.substring(0, 75)}...
                  </p>
                  <div className="product-footer">
                    <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
                    <Link to={`/products/${product.id}`} className="btn-secondary btn-sm">
                      Inspect Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                    <p className="upcoming-origin">Provenance: {product.originCountry} &bull; {product.provenanceDetails?.substring(0, 60)}...</p>
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
