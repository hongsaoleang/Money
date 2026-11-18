import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Code, Smartphone, Server, Layers, CheckCircle2, 
  ExternalLink, Send, Sparkles, Shield, Cpu, Zap, ArrowRight,
  Database, Terminal, Check
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
  cloud: [
    'Reliable PostgreSQL databases',
    'Fast caching with Redis',
    'Docker and Kubernetes hosting',
    'Safe, low-downtime releases',
    'Automated backups and recovery',
  ],
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inquiry form state
  const [inquiry, setInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Custom Web Application Development',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);

    let tgMsg = `👋 Hello Hong Saoleang (@hongsaoleang)!\n`;
    tgMsg += `I have a project inquiry for you:\n\n`;
    tgMsg += `👤 Name: ${inquiry.name}\n`;
    tgMsg += `📧 Email: ${inquiry.email}\n`;
    if (inquiry.phone) tgMsg += `📱 Phone: ${inquiry.phone}\n`;
    tgMsg += `🛠 Service Type: ${inquiry.serviceType}\n\n`;
    tgMsg += `📝 Project Details:\n${inquiry.message}\n\n`;
    tgMsg += `Looking forward to your reply. Thank you!`;

    try {
      await api.post('/api/inquiries', inquiry);
    } catch (err) {
      console.warn('Inquiry auto-sync notice:', err);
    } finally {
      setSubmitting(false);
      setInquiry({
        name: '',
        email: '',
        phone: '',
        serviceType: 'Custom Web Application Development',
        message: '',
      });

      // ALWAYS open direct Telegram chat with Hong Saoleang (@hongsaoleang)
      const telegramUrl = `https://t.me/hongsaoleang?text=${encodeURIComponent(tgMsg)}`;
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="services-page">
      {/* 1. HERO BANNER - PUNCHY & METRIC-DRIVEN */}
      <section className="services-hero section-container">
        <div className="services-hero-content text-center">
          <div className="hero-badge-row">
            <span className="section-badge">
              <Sparkles size={13} className="text-amber-400" /> Jomnenh-KH Engineering
            </span>
            <span className="hero-status-pill">
              <span className="pulse-dot green" /> Taking new projects
            </span>
          </div>

          <h1 className="hero-title">
            Software built <span className="gradient-text">to scale</span>
          </h1>



          <div className="hero-actions justify-center mb-8">
            <a href="#inquiry" className="btn-primary">
              <Send size={15} /> Start a project
            </a>
            <a href="#portfolio" className="btn-secondary">
              View our work <ArrowRight size={15} />
            </a>
          </div>

          {/* Software Metrics Bar */}
          <div className="hero-metrics-bar">
            <div className="hero-metric-item">
              <span className="metric-figure">50+</span>
              <span className="metric-caption">Platforms Shipped</span>
            </div>
            <div className="metric-v-sep" />
            <div className="hero-metric-item">
              <span className="metric-figure">100%</span>
              <span className="metric-caption">On-time delivery</span>
            </div>
            <div className="metric-v-sep" />
            <div className="hero-metric-item">
              <span className="metric-figure">99.9%</span>
              <span className="metric-caption">Production SLA</span>
            </div>
            <div className="metric-v-sep" />
            <div className="hero-metric-item">
              <span className="metric-figure">0</span>
              <span className="metric-caption">Security Breaches</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES - FEATURE FOCUS (REDUCED TEXT) */}
      <section className="section-container">
        <div className="section-header text-center">
          <span className="section-badge">Capabilities</span>
          <h2 className="section-title">Core Engineering Capabilities</h2>
        </div>

        <div className="services-grid">
          {services.map((srv) => {
            const isWeb = srv.slug?.includes('web');
            const isMobile = srv.slug?.includes('mobile');
            const featureList = isWeb 
              ? SERVICE_FEATURE_SETS.web 
              : isMobile 
              ? SERVICE_FEATURE_SETS.mobile 
              : SERVICE_FEATURE_SETS.cloud;

            return (
              <div key={srv.id} className="service-detail-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="service-icon-box">
                    {isWeb ? <Code size={24} /> : isMobile ? <Smartphone size={24} /> : <Server size={24} />}
                  </div>
                  <div>
                    <h3 className="m-0 text-base font-bold">{srv.title}</h3>
                    <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                      {isWeb ? 'Full-Stack Web' : isMobile ? 'iOS & Android' : 'Cloud Infra & DB'}
                    </span>
                  </div>
                </div>

                <p className="service-summary text-sm text-slate-300 mb-4">{srv.summary?.split(/(?<=[.!?])\s/)[0]}</p>

                {/* Specific Feature Checklist */}
                <div className="service-features-list">
                  {featureList.map((feature, idx) => (
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
      <section id="portfolio" className="section-container portfolio-section">
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
            {portfolio.map((project) => (
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
      </section>

      {/* 4. AGILE METHODOLOGY - COMPACT STEPPER */}
      <section className="section-container process-section">
        <div className="section-header text-center">
          <span className="section-badge">Methodology</span>
          <h2 className="section-title">Sprint Delivery Pipeline</h2>
          <p className="section-subtitle">Clear steps, steady progress, reliable launches.</p>
        </div>

        <div className="process-timeline-compact">
          <div className="process-step-compact">
            <div className="step-num-badge">01</div>
            <h4>System Architecture</h4>
            <p>Plan the data, system, and APIs.</p>
          </div>
          <div className="process-step-compact">
            <div className="step-num-badge">02</div>
            <h4>Figma Prototyping</h4>
            <p>Shape and test the user experience.</p>
          </div>
          <div className="process-step-compact">
            <div className="step-num-badge">03</div>
            <h4>Agile Sprints</h4>
            <p>Ship updates with reviews and checks.</p>
          </div>
          <div className="process-step-compact">
            <div className="step-num-badge">04</div>
            <h4>Production Launch</h4>
            <p>Launch with security and monitoring.</p>
          </div>
        </div>
      </section>

      {/* 5. INQUIRY FORM - CLEAN & STREAMLINED */}
      <section id="inquiry" className="section-container inquiry-section">
        <div className="inquiry-box">
          <div className="inquiry-info">
            <span className="section-badge">Get Started</span>
            <h2>Let’s build your next product</h2>
            <p className="text-sm text-slate-300 mb-4">
              Share your goals. We’ll review them and reply within one business day.
            </p>
            <div className="inquiry-perks">
              <div className="perk-item"><CheckCircle2 size={16} className="text-emerald" /> Free project estimate</div>
              <div className="perk-item"><CheckCircle2 size={16} className="text-emerald" /> Your ideas stay confidential</div>
              <div className="perk-item"><CheckCircle2 size={16} className="text-emerald" /> Reply within one business day</div>
            </div>
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
                  placeholder="jane@company.com"
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
              <select
                value={inquiry.serviceType}
                onChange={(e) => setInquiry({ ...inquiry, serviceType: e.target.value })}
              >
                <option value="Custom Web Application Development">Custom Web Application Development</option>
                <option value="Cross-Platform Mobile App Development">Cross-Platform Mobile App Development</option>
                <option value="Enterprise Cloud & Backend Systems">Enterprise Cloud & Backend Systems</option>
                <option value="Full Digital Transformation">Full digital product</option>
              </select>
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
