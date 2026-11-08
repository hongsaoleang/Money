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
            <h4>Fast Delivery</h4>
            <p>Direct tracking on every order</p>
          </div>
        </div>
        <div className="feature-item">
          <ShieldCheck size={24} className="feature-icon" />
          <div>
            <h4>Verified Origin</h4>
            <p>100% genuine components</p>
          </div>
        </div>
        <div className="feature-item">
          <Code size={24} className="feature-icon" />
          <div>
            <h4>Custom Software</h4>
            <p>Production web and mobile apps</p>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col brand-col">
          <div className="navbar-logo">
            <img 
              src="/JomnenhKH.jpg" 
              alt="JomnenhKH Logo" 
              className="navbar-brand-logo-img" 
            />
            <span className="logo-text">Jomnenh<span className="logo-accent">-KH</span></span>
          </div>
          <p className="footer-desc">
            Hardware &amp; bespoke software engineering.
          </p>
          <div className="footer-contact">
            <p><MapPin size={16} /> 100 Innovation Way, Suite 400, San Francisco, CA</p>
            <p><Mail size={16} /> hongsaoleang@gmail.com</p>
            <p><Phone size={16} /> +855 12 019 2834</p>
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
        <p>&copy; {new Date().getFullYear()} Jomnenh-KH Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
