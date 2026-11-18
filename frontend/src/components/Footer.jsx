import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
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
            Hardware &amp; Software Services.
          </p>
          <div className="footer-contact">
            <p><MapPin size={16} /> Phnom Penh, Cambodia</p>
            <p><Mail size={16} /> hongsaoleang@gmail.com</p>
            <p><Phone size={16} /> +855 12 019 2834</p>
          </div>
        </div>

        <div className="footer-col">
          <h4>Marketplace</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">Software Services</Link></li>
            <li><Link to="/services#inquiry">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/settings">My Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Jomnenh-KH. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
