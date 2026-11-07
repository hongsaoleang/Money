import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Code, Smartphone, Server, Layers, CheckCircle, ExternalLink, Send, Sparkles, Shield, Cpu } from 'lucide-react';

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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [srvRes, portRes] = await Promise.all([
          api.get('/api/services'),
          api.get('/api/portfolio'),
        ]);
        setServices(srvRes.data);
        setPortfolio(portRes.data);
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
    try {
      await api.post('/api/inquiries', inquiry);
      setSubmitted(true);
      setInquiry({
        name: '',
        email: '',
        phone: '',
        serviceType: 'Custom Web Application Development',
        message: '',
      });
    } catch (err) {
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="services-page">
      {/* Hero Banner */}
      <section className="services-hero section-container">
        <div className="services-hero-content">
          <span className="section-badge">Custom Software Engineering</span>
          <h1 className="hero-title">
            We Engineer Enterprise <span className="gradient-text">Web & Mobile Apps</span>
          </h1>
          <div className="hero-actions">
            <a href="#portfolio" className="btn-secondary">
              Inspect Our Shipped Work
            </a>
            <a href="#inquiry" className="btn-primary">
              Request Technical Proposal
            </a>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="section-container">
        <div className="section-header text-center">
          <span className="section-badge">Capabilities</span>
          <h2 className="section-title">What We Build For Our Clients</h2>
          <p className="section-subtitle">
            Modern, resilient architectures crafted with React, Spring Boot, PostgreSQL, and native mobile frameworks.
          </p>
        </div>

        <div className="services-grid">
          {services.map((srv) => (
            <div key={srv.id} className="service-detail-card">
              <div className="service-icon-box">
                {srv.slug.includes('web') ? <Code size={30} /> : srv.slug.includes('mobile') ? <Smartphone size={30} /> : <Server size={30} />}
              </div>
              <h3>{srv.title}</h3>
              <p className="service-summary">{srv.summary}</p>
              <div className="service-desc-box">
                <p>{srv.description}</p>
              </div>
              <ul className="service-features">
                <li><CheckCircle size={15} /> Strict clean-code architecture</li>
                <li><CheckCircle size={15} /> Fully responsive Figma-to-code design</li>
                <li><CheckCircle size={15} /> Enterprise security & RBAC authentication</li>
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Proof of Capability: Portfolio of Past Work */}
      <section id="portfolio" className="section-container portfolio-section">
        <div className="section-header text-center">
          <span className="section-badge">Track Record & Proof</span>
          <h2 className="section-title">Projects We Have Done Before</h2>
          <p className="section-subtitle">
            Real proofs of our engineering capability. These platforms were built, scaled, and deployed to production by our team.
          </p>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading portfolio case studies...</div>
        ) : (
          <div className="portfolio-grid">
            {portfolio.map((project) => (
              <div key={project.id} className="portfolio-card">
                <div className="portfolio-img-container">
                  <img src={project.imageUrl} alt={project.title} className="portfolio-img" />
                  <span className="client-badge">Client: {project.clientName}</span>
                </div>
                <div className="portfolio-content">
                  <div className="portfolio-meta">
                    <span className="portfolio-date">Completed: {project.completedDate}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="portfolio-desc">{project.description}</p>

                  <div className="tech-stack-wrap">
                    <strong>Tech Stack:</strong>
                    <div className="tech-tags">
                      {project.techStack?.split(',').map((tech, idx) => (
                        <span key={idx} className="tech-tag">{tech.trim()}</span>
                      ))}
                    </div>
                  </div>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="portfolio-link"
                    >
                      View Live Case Study <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Engineering Delivery Process */}
      <section className="section-container process-section">
        <div className="section-header text-center">
          <span className="section-badge">Methodology</span>
          <h2 className="section-title">How We Build Your Software</h2>
          <p className="section-subtitle">A transparent, agile workflow ensuring quality and on-time delivery.</p>
        </div>

        <div className="process-timeline">
          <div className="process-step">
            <div className="step-num">01</div>
            <h4>Discovery & System Design</h4>
            <p>We review your business requirements, define database schemas, and map out API boundaries.</p>
          </div>
          <div className="process-step">
            <div className="step-num">02</div>
            <h4>Figma UX/UI Prototyping</h4>
            <p>High-fidelity wireframes and interactive user journeys designed to convert before writing code.</p>
          </div>
          <div className="process-step">
            <div className="step-num">03</div>
            <h4>Agile Sprint Development</h4>
            <p>Bi-weekly demo releases with continuous automated testing, code reviews, and staging previews.</p>
          </div>
          <div className="process-step">
            <div className="step-num">04</div>
            <h4>Production Deployment</h4>
            <p>CI/CD automated deployment, security hardening, cloud hosting configuration, and SLA support.</p>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="section-container inquiry-section">
        <div className="inquiry-box">
          <div className="inquiry-info">
            <span className="section-badge">Get Started</span>
            <h2>Let’s Build Your Software Solution</h2>
            <p>
              Tell us about your web platform, mobile app, or backend architecture requirements. Our lead software architect will review your project and schedule a consultation.
            </p>
            <div className="inquiry-perks">
              <div className="perk-item"><CheckCircle size={18} /> Free technical architecture estimation</div>
              <div className="perk-item"><CheckCircle size={18} /> Strict NDA and IP confidentiality guarantee</div>
              <div className="perk-item"><CheckCircle size={18} /> Response within 24 business hours</div>
            </div>
          </div>

          <form onSubmit={handleInquirySubmit} className="inquiry-form">
            {submitted && (
              <div className="alert-success">
                Thank you! Your project inquiry has been received. Our team will contact you shortly.
              </div>
            )}

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
                  placeholder="+1 (555) 012-3456"
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
                <option value="Full Digital Transformation">Full Digital Transformation (Web + App)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Project Details & Scope *</label>
              <textarea
                required
                rows={4}
                value={inquiry.message}
                onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                placeholder="Describe your vision, target users, preferred timeline, and key requirements..."
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary submit-btn">
              <Send size={16} /> {submitting ? 'Submitting...' : 'Send Project Inquiry'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Services;
