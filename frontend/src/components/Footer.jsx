import React from 'react';
import { Link } from 'react-router-dom';
import { Code, MapPin, Mail, Phone, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-features-bar">
        <div className="feature-item">
          <Truck size={24} className="feature-icon" />
          <div>
            <h4>Global Direct Shipping</h4>
            <p>Transparent order-to-doorstep tracking with accurate delivery dates</p>
          </div>
        </div>
        <div className="feature-item">
          <ShieldCheck size={24} className="feature-icon" />
          <div>
            <h4>Verified Provenance</h4>
            <p>100% genuine origin traceability for all electronics and hardware</p>
          </div>
        </div>
        <div className="feature-item">
          <Code size={24} className="feature-icon" />
          <div>
            <h4>Engineering Excellence</h4>
            <p>Bespoke web and mobile applications delivered by senior engineers</p>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col brand-col">
          <div className="navbar-logo">
            <div className="logo-icon"><Code size={20} /></div>
            <span className="logo-text">Nexus<span className="logo-accent">Tech</span></span>
          </div>
          <p className="footer-desc">
            A dual-engine platform delivering flagship engineering hardware with complete origin transparency, alongside enterprise custom software development.
          </p>
          <div className="footer-contact">
            <p><MapPin size={16} /> 100 Innovation Way, Suite 400, San Francisco, CA</p>
            <p><Mail size={16} /> contact@nexustech.io</p>
            <p><Phone size={16} /> +1 (555) 019-2834</p>
          </div>
        </div>

        <div className="footer-col">
          <h4>Marketplace</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products?category=smart-devices">Smart Devices</Link></li>
            <li><Link to="/products?category=audio-acoustics">Audio & Acoustics</Link></li>
            <li><Link to="/products?category=developer-workstations">Workstations</Link></li>
            <li><Link to="/client/deploy">Merchant Listing Request</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Software Services</h4>
          <ul>
            <li><Link to="/services">Custom Web Development</Link></li>
            <li><Link to="/services">Mobile Apps (iOS & Android)</Link></li>
            <li><Link to="/services">Cloud & Backend Systems</Link></li>
            <li><Link to="/services#portfolio">Client Portfolio & Proofs</Link></li>
            <li><Link to="/services#inquiry">Request a Technical Quote</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about-us">About Us & Our Mission</Link></li>
            <li><Link to="/about-us#provenance">Origin & Manufacturing Transparency</Link></li>
            <li><Link to="/about-us#delivery">Delivery Timeline Estimator</Link></li>
            <li><Link to="/settings">My Account & Orders</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NexusTech Inc. All rights reserved. Built with React.js, Spring Boot, PostgreSQL & Spring Security.</p>
      </div>
    </footer>
  );
};

export default Footer;
