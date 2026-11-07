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
              <Sparkles size={16} /> Premium Hardware & Software Engineering
            </div>
            <h1 className="hero-title">
              Where Precision <span className="gradient-text">Hardware</span> Meets Enterprise <span className="gradient-text">Software</span>.
            </h1>
            <p className="hero-subtitle">
              Explore meticulously crafted electronic devices with verified global provenance, or partner with our senior engineering team to design, build, and deploy high-performance web & mobile applications.
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
                <span className="metric-lbl">Traceable Provenance</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-val">50+</span>
                <span className="metric-lbl">Apps & Platforms Shipped</span>
              </div>
              <div className="metric-divider" />
              <div className="metric-item">
                <span className="metric-val">99.98%</span>
                <span className="metric-lbl">Uptime SLA Guaranteed</span>
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
            <span className="section-badge">Flagship Store</span>
            <h2 className="section-title">Engineered For Professionals</h2>
            <p className="section-subtitle">Transparent origins, sustainable aerospace alloys, and precision calibrated.</p>
          </div>
          <Link to="/products" className="view-all-link">
            View All Products <ArrowRight size={16} />
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
          <span className="section-badge">Engineering Division</span>
          <h2 className="section-title">We Build Software For Forward-Thinking Businesses</h2>
          <p className="section-subtitle">
            Need a scalable web application or mobile app? Our in-house engineering team crafts bespoke software tailored to your workflows.
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
                Explore capabilities & case studies <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <div className="agency-cta-box">
          <div className="cta-text">
            <h3>Have a software project in mind?</h3>
            <p>Review our portfolio of shipped client projects and receive a technical proposal.</p>
          </div>
          <Link to="/services#inquiry" className="btn-primary cta-btn">
            Request Technical Discovery
          </Link>
        </div>
      </section>

      {/* Merchant / Client Deploy Callout */}
      <section className="section-container merchant-callout">
        <div className="merchant-box">
          <div className="merchant-content">
            <span className="section-badge">Client Partnership</span>
            <h2>Sell Your Hardware & Products On Our Platform</h2>
            <p>
              Are you a manufacturer, inventor, or brand? You can deploy your products directly on our website! Submit your product specs, provenance, and pricing for our review process to get approved and featured.
            </p>
            <Link to="/client/deploy" className="btn-secondary">
              Deploy Your Product <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
