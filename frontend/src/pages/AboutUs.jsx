import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Truck, Calendar, MapPin, CheckCircle, PackageCheck, Box, Clock, ArrowRight, Sparkles, Code, Cpu, UserCheck } from 'lucide-react';
import InteractiveLanyardBadge from '../components/InteractiveLanyardBadge';

const DEVELOPERS = [
  {
    id: 'hong',
    name: 'Hong Saoleang',
    role: 'Full-Stack Architect & System Designer',
    badgeRole: 'Founder & Full-Stack Architect',
    pill: 'Founder & Lead',
    avatar: '/JomnenhKH.jpg',
    tier: 0,
    isLead: true,
    bio: 'Built the platform architecture, APIs, authentication, and data models.',
    skills: ['Spring Boot 3', 'React.js', 'PostgreSQL', 'REST APIs', 'JWT Security'],
  },
  {
    id: 'alex',
    name: 'Alex Rivera',
    role: 'Frontend & UI Systems Lead',
    badgeRole: 'Frontend & UI Systems Lead',
    pill: 'Frontend Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    tier: 1,
    isLead: false,
    bio: 'Built the responsive interface, navigation, and shopping experience.',
    skills: ['Vite', 'Responsive CSS', 'State Management', 'UI/UX'],
  },
  {
    id: 'devon',
    name: 'Devon Vance',
    role: 'Database & Infrastructure Engineer',
    badgeRole: 'Database & Infrastructure Engineer',
    pill: 'Database & Cloud',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    tier: 2,
    isLead: false,
    bio: 'Maintains the database, cloud infrastructure, and platform security.',
    skills: ['PostgreSQL', 'Docker', 'Mail Servers', 'DevOps'],
  },
];

const AboutUs = () => {
  // Interactive delivery date preview
  const [selectedOrderDayOffset, setSelectedOrderDayOffset] = useState(0);
  const [selectedDevId, setSelectedDevId] = useState('hong');

  const activeDev = DEVELOPERS.find(d => d.id === selectedDevId) || DEVELOPERS[0];

  const getCalculatedDates = (offsetDays) => {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() + offsetDays);

    const packDate = new Date(orderDate);
    packDate.setDate(packDate.getDate() + 1);

    const dispatchDate = new Date(orderDate);
    dispatchDate.setDate(dispatchDate.getDate() + 2);

    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 4);

    return {
      orderFormatted: orderDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      packFormatted: packDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      dispatchFormatted: dispatchDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      deliveryFormatted: deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    };
  };

  const dates = getCalculatedDates(selectedOrderDayOffset);

  return (
    <div className="about-us-page">
      {/* Hero */}
      <section className="about-hero section-container">
        <span className="section-badge">Company & Philosophy</span>
        <h1 className="hero-title">
          Know where it’s made. <span className="gradient-text">Know when it arrives.</span>
        </h1>
        <p className="hero-subtitle">
          Clear product origins and delivery dates, from checkout to your door.
        </p>
      </section>

      {/* Sourcing & Provenance Detail Section */}
      <section id="provenance" className="section-container">
        <div className="section-header text-center">
          <span className="section-badge">Product Provenance</span>
          <h2 className="section-title">Made with care, sourced with clarity</h2>
          <p className="section-subtitle">
            We review our suppliers for quality and responsible manufacturing.
          </p>
        </div>

        <div className="provenance-cards-grid">
          <div className="provenance-country-card">
            <div className="country-flag-icon"><Globe size={28} /></div>
            <h3>Germany</h3>
            <span className="provenance-focus">Precision engineering</span>
            <p>
              Recycled aluminum components from audited German suppliers.
            </p>
          </div>

          <div className="provenance-country-card">
            <div className="country-flag-icon"><Globe size={28} /></div>
            <h3>Japan</h3>
            <span className="provenance-focus">Audio components</span>
            <p>
              Carefully tuned drivers and acoustic components from Japan.
            </p>
          </div>

          <div className="provenance-country-card">
            <div className="country-flag-icon"><Globe size={28} /></div>
            <h3>Taiwan</h3>
            <span className="provenance-focus">Electronics</span>
            <p>
              Semiconductors, controllers, and precision keyboard parts.
            </p>
          </div>

          <div className="provenance-country-card">
            <div className="country-flag-icon"><Globe size={28} /></div>
            <h3>Switzerland</h3>
            <span className="provenance-focus">Medical-Grade Micro-Sensors</span>
            <p>
              Smart ring sensors and biometric hardware crafted in Neuchâtel, featuring grade-5 titanium and hypoallergenic ceramic interiors.
            </p>
          </div>
        </div>

        {/* Quality Audit Checklist */}
        <div className="audit-checklist-box">
          <div className="checklist-col">
            <div className="check-row">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <strong>Zero Conflict Minerals</strong>
                <p>Suppliers verify responsible mineral sourcing.</p>
              </div>
            </div>
            <div className="check-row">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <strong>Factory Audit Certification</strong>
                <p>Factories are reviewed for quality and environmental standards.</p>
              </div>
            </div>
          </div>
          <div className="checklist-col">
            <div className="check-row">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <strong>Third-Party Merchant Review</strong>
                <p>Every partner product is reviewed before it goes live.</p>
              </div>
            </div>
            <div className="check-row">
              <ShieldCheck size={20} className="text-emerald" />
              <div>
                <strong>Full Provenance Ledger</strong>
                <p>Product pages show origin details and key specifications.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Purchase Order-to-Delivery Timeline */}
      <section id="delivery" className="section-container delivery-timeline-section">
        <div className="section-header text-center">
          <span className="section-badge">Post-Order Logistics</span>
          <h2 className="section-title">Your order, step by step</h2>
          <p className="section-subtitle">
            See each delivery stage and your estimated arrival date.
          </p>
        </div>

        {/* Interactive Order Date Picker */}
        <div className="interactive-delivery-tester">
          <div className="tester-header">
              <h4>When will you order?</h4>
            <div className="date-selector-buttons">
              <button
                className={`date-pill ${selectedOrderDayOffset === 0 ? 'active' : ''}`}
                onClick={() => setSelectedOrderDayOffset(0)}
              >
                Order Today
              </button>
              <button
                className={`date-pill ${selectedOrderDayOffset === 1 ? 'active' : ''}`}
                onClick={() => setSelectedOrderDayOffset(1)}
              >
                Order Tomorrow
              </button>
              <button
                className={`date-pill ${selectedOrderDayOffset === 3 ? 'active' : ''}`}
                onClick={() => setSelectedOrderDayOffset(3)}
              >
                Order in 3 Days
              </button>
            </div>
          </div>

          {/* Timeline Display */}
          <div className="order-progress-stepper">
            <div className="step-point completed">
              <div className="point-icon"><Calendar size={20} /></div>
              <span className="step-title">1. Order Placed</span>
              <span className="step-date">{dates.orderFormatted}</span>
              <p className="step-desc">Payment confirmed and order received.</p>
            </div>

            <div className="step-connector" />

            <div className="step-point">
              <div className="point-icon"><Box size={20} /></div>
              <span className="step-title">2. Processing & QA</span>
              <span className="step-date">{dates.packFormatted}</span>
              <p className="step-desc">Your item is checked and packed.</p>
            </div>

            <div className="step-connector" />

            <div className="step-point">
              <div className="point-icon"><Truck size={20} /></div>
              <span className="step-title">3. Express Dispatch</span>
              <span className="step-date">{dates.dispatchFormatted}</span>
              <p className="step-desc">Your package is dispatched with tracking.</p>
            </div>

            <div className="step-connector" />

            <div className="step-point arrival">
              <div className="point-icon"><PackageCheck size={20} /></div>
              <span className="step-title">4. Doorstep Delivery</span>
              <span className="step-date delivery-highlight">{dates.deliveryFormatted}</span>
              <p className="step-desc">Delivered to your address.</p>
            </div>
          </div>

          <div className="delivery-summary-banner">
            <Clock size={20} className="text-indigo" />
            <div>
              Most orders arrive within <strong>4 days</strong>.
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Developers Who Built Jomnenh-KH */}
      <section id="developers" className="section-container developers-section">
        <div className="section-header text-center">
          <span className="section-badge"><Code size={13} className="text-indigo-400" /> Engineering Division</span>
          <h2 className="section-title">The Developers Who Built Jomnenh-KH</h2>
          <p className="section-subtitle">
            Meet the team behind our products and platform.
          </p>
        </div>

        {/* 3D Interactive Identity Pass & Physics Lanyard */}
        <div className="interactive-lanyard-wrapper mb-10">
          <div className="text-center mb-4">
            <span className="section-badge"><Sparkles size={12} className="text-amber-400" /> Real-Time 3D Physics</span>
            <h3 className="text-lg font-bold text-slate-200 mt-1">Meet the team</h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto mb-3">
              Select a profile to see it on the interactive 3D badge.
            </p>

            {/* Quick Switcher Dock */}
            <div className="dev-switcher-dock">
              {DEVELOPERS.map((dev) => {
                const isActive = selectedDevId === dev.id;
                return (
                  <button
                    key={dev.id}
                    className={`dev-dock-btn ${isActive ? 'active' : ''}`}
                    onMouseEnter={() => setSelectedDevId(dev.id)}
                    onClick={() => setSelectedDevId(dev.id)}
                    type="button"
                  >
                    <img 
                      src={dev.avatar} 
                      alt={dev.name} 
                      className="dev-dock-img" 
                      style={dev.avatar.includes('JomnenhKH') ? { objectFit: 'contain', background: '#0a0f1d' } : { objectFit: 'cover' }}
                    />
                    <div className="dev-dock-text">
                      <span className="dev-dock-name">{dev.name}</span>
                      <span className="dev-dock-role">{dev.pill}</span>
                    </div>
                    {isActive && <span className="dev-active-dot" title="Active on 3D Pass" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lanyard-stage-box">
            <InteractiveLanyardBadge 
              initialName={activeDev.name}
              initialRole={activeDev.badgeRole}
              initialAvatar={activeDev.avatar}
              initialTier={activeDev.tier}
              stageHeight={580}
            />
          </div>
        </div>

        {/* Developer Profiles Grid with Hover Linking to 3D Pass */}
        <div className="dev-team-grid">
          {DEVELOPERS.map((dev) => {
            const isSelected = selectedDevId === dev.id;
            return (
              <div 
                key={dev.id}
                className={`dev-card ${dev.isLead ? 'lead-card' : ''} ${isSelected ? 'is-active-inspected' : ''}`}
                onMouseEnter={() => setSelectedDevId(dev.id)}
                onClick={() => setSelectedDevId(dev.id)}
                style={{ cursor: 'pointer', transition: 'all 0.25s ease' }}
              >
                <div className="dev-card-top">
                  <div className="dev-avatar-wrap">
                    <img 
                      src={dev.avatar} 
                      alt={dev.name} 
                      className="dev-avatar" 
                      style={dev.avatar.includes('JomnenhKH') ? { objectFit: 'contain', background: '#0a0f1d', padding: '3px' } : { objectFit: 'cover' }}
                    />
                    <span className="dev-status-indicator" title={isSelected ? 'Active on 3D Pass' : dev.pill} />
                  </div>
                  <div className="dev-meta">
                    <div className="flex items-center gap-2">
                      <h3 className="dev-name">{dev.name}</h3>
                      <span className="dev-pill-lead">{dev.pill}</span>
                    </div>
                    <span className="dev-role">{dev.role}</span>
                  </div>
                </div>

                <p className="dev-bio">{dev.bio}</p>

                <div className="dev-skills">
                  {dev.skills.map((skill, idx) => (
                    <span key={idx} className="dev-skill-tag">{skill}</span>
                  ))}
                </div>

                <div className="dev-card-pass-status">
                  <span className={`pass-status-indicator ${isSelected ? 'active' : ''}`}>
                    <span className={`status-dot ${isSelected ? 'pulsing' : ''}`} />
                    {isSelected ? 'Viewing on 3D Pass' : 'Hover to load into 3D Pass'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="section-container text-center about-cta">
        <h2>Ready to explore?</h2>
        <p>Shop our products or talk with our software team.</p>
        <div className="hero-actions justify-center">
          <Link to="/products" className="btn-primary">Browse Products</Link>
          <Link to="/services" className="btn-secondary">Explore services</Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
