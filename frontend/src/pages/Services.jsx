import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Code, Smartphone, Server, CheckCircle2, 
  ExternalLink
} from 'lucide-react';

const TelegramIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const SERVICE_FEATURE_SETS = {
  web: [
    'React and modern frontend architecture',
    'Spring Boot APIs and microservices',
    'Fast, responsive user experiences',
    'Secure sign-in and role controls',
    'Automated testing and deployment',
  ],
  mobile: [
    'Flutter and React Native apps',
    'Smooth iOS and Android performance',
    'Biometric and NFC support',
    'Offline access to key features',
    'Notifications and live sync',
  ],
};

const HIDDEN_SAMPLE_CLIENTS = new Set([
  'Nordic Retail Group',
  'LogiFleet Express',
  'Vanguard Health Systems',
]);

const Services = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inquiry form state
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const visiblePortfolio = portfolio.filter((project) => !HIDDEN_SAMPLE_CLIENTS.has(project.clientName));
  const visibleServices = services.filter((srv) => 
    !srv.slug?.includes('cloud') && 
    !srv.title?.toLowerCase().includes('cloud')
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srvRes, portRes] = await Promise.all([
          api.get('/api/services'),
          api.get('/api/portfolio'),
        ]);
        setServices(srvRes.data || []);
        setPortfolio(portRes.data || []);
      } catch (err) {
        console.error('Error fetching services and portfolio', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in to send messages or inquiries via Telegram.',
        },
      });
      return;
    }

    let tgMsg = `👋 Hello Hong Saoleang (@hongsaoleang)!\n`;
    tgMsg += `I have a project inquiry for you:\n\n`;
    tgMsg += `👤 Name: ${inquiry.name}\n`;
    tgMsg += `📧 Email: ${inquiry.email}\n`;
    if (inquiry.phone) tgMsg += `📱 Phone: ${inquiry.phone}\n`;
    tgMsg += `🛠 Service Type: ${inquiry.serviceType}\n\n`;
    tgMsg += `📝 Project Details:\n${inquiry.message}\n\n`;
    tgMsg += `------------------------------------\n`;
    tgMsg += `Looking forward to your reply. Thank you!`;

    const telegramUrl = `https://t.me/hongsaoleang?text=${encodeURIComponent(tgMsg)}`;
    // Open Telegram immediately upon submission so browser never blocks it as an async popup
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');

    setSubmitting(true);
    const inquiryPayload = { ...inquiry };
    setInquiry({
      name: '',
      email: '',
      phone: '',
      serviceType: '',
      message: '',
    });

    try {
      await api.post('/api/inquiries', inquiryPayload);
    } catch (err) {
      console.warn('Inquiry auto-sync notice:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="services-page">
      {/* 1. HERO BANNER */}
      <section className="services-hero section-container">
        <div className="services-hero-content text-center">
          <h1 className="hero-title">
            {t('services.title', 'Software Services')}
          </h1>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES - FEATURE FOCUS (REDUCED TEXT) */}
      <section className="section-container">
        <div className="section-header text-center capabilities-header">
          <span className="section-badge capabilities-badge">Capabilities</span>
          <h2 className="section-title capabilities-title">Core Engineering Capabilities</h2>
        </div>

        <div className="services-grid">
          {visibleServices.map((srv) => {
            const isWeb = srv.slug?.includes('web');
            const isMobile = srv.slug?.includes('mobile');
            const featureList = isWeb 
              ? SERVICE_FEATURE_SETS.web 
              : SERVICE_FEATURE_SETS.mobile;

            return (
              <div key={srv.id} className="service-detail-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="service-icon-box">
                    {isWeb ? <Code size={24} /> : <Smartphone size={24} />}
                  </div>
                  <div>
                    <h3 className="m-0 text-base font-bold">{srv.title}</h3>
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                      {isWeb ? 'Full-Stack Web' : 'iOS & Android'}
                    </span>
                  </div>
                </div>

                <p className="service-summary text-sm text-slate-300 mb-4">{srv.summary?.split(/(?<=[.!?])\s/)[0]}</p>

                {/* Specific Feature Checklist */}
                <div className="service-features-list">
                  {featureList?.map((feature, idx) => (
                    <div key={idx} className="service-feature-row">
                      <CheckCircle2 size={15} className="text-emerald shrink-0" />
                      <span className="text-xs text-slate-200 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. TRACK RECORD & PROOF (CLEAN CARDS WITHOUT BLOATED IMAGES) */}
      {visiblePortfolio.length > 0 && <section id="portfolio" className="section-container portfolio-section">
        <div className="section-header text-center">
          <span className="section-badge">Track Record</span>
          <h2 className="section-title">Shipped Enterprise Case Studies</h2>
          <p className="section-subtitle">
            A few products we’ve taken from idea to launch.
          </p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading portfolio case studies...</div>
        ) : (
          <div className="portfolio-compact-grid">
            {visiblePortfolio.map((project) => (
              <div key={project.id} className="portfolio-compact-card">
                <div className="portfolio-card-header">
                  <div className="flex items-center justify-between gap-2">
                    <span className="client-badge">Client: {project.clientName}</span>
                    <span className="portfolio-date text-xs text-slate-400">{project.completedDate}</span>
                  </div>
                  <h3 className="portfolio-compact-title mt-2">{project.title}</h3>
                </div>

                <p className="portfolio-compact-desc text-xs text-slate-300">
                  {project.description?.split(/(?<=[.!?])\s/)[0]}
                </p>

                {/* Tech Stack Chips */}
                <div className="tech-stack-wrap mt-auto">
                  <div className="tech-tags">
                    {project.techStack?.split(',').map((tech, idx) => (
                      <span key={idx} className="tech-tag text-xs">{tech.trim()}</span>
                    ))}
                  </div>
                </div>

                {project.liveUrl && (
                  <div className="pt-3 border-t border-slate-800 mt-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-link text-xs inline-flex items-center gap-1.5"
                    >
                      View Live Case Study <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>}

      {/* INQUIRY FORM */}
      <section id="inquiry" className="section-container inquiry-section">
        <div className="inquiry-box">
          <div className="inquiry-info">
            <h2>Start a Project</h2>
            <p className="text-sm text-slate-300 mb-4">
              Send your project inquiry directly to Hong Saoleang on Telegram.
            </p>
          </div>

          <form onSubmit={handleInquirySubmit} className="inquiry-form">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                required
                value={inquiry.name}
                onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  value={inquiry.email}
                  onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                  placeholder="jane@gmail.com"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={inquiry.phone}
                  onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                  placeholder="+855 12 345 678"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service Type *</label>
              <input
                type="text"
                required
                value={inquiry.serviceType}
                onChange={(e) => setInquiry({ ...inquiry, serviceType: e.target.value })}
                placeholder="e.g. Website, mobile app, or custom software"
              />
            </div>

            <div className="form-group">
              <label>Project details *</label>
              <textarea
                required
                rows={3}
                value={inquiry.message}
                onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                placeholder="What would you like to build?"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-telegram"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '1rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '10px',
              }}
              title="Send project inquiry to Telegram"
            >
              <TelegramIcon size={22} />
              <span>{submitting ? 'Connecting...' : 'Send Message to Telegram'}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Services;
