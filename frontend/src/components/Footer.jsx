import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

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
            {t('footer.tagline', 'Hardware & Software Services · Phnom Penh, Cambodia.')}
          </p>
          <div className="footer-contact">
            <p><MapPin size={16} /> {t('footer.location', 'Phnom Penh, Cambodia')}</p>
            <p><Mail size={16} /> hongsaoleang@gmail.com</p>
            <p><Phone size={16} /> +855 12 019 2834</p>
          </div>
        </div>

        <div className="footer-col">
          <h4>{t('footer.marketplace', 'Marketplace')}</h4>
          <ul>
            <li><Link to="/products">{t('footer.allProducts', 'All Products')}</Link></li>
            <li><Link to="/cart">{t('footer.shoppingCart', 'Shopping Cart')}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('footer.services', 'Services')}</h4>
          <ul>
            <li><Link to="/services">{t('footer.softwareServices', 'Software Services')}</Link></li>
            <li><Link to="/services#inquiry">{t('footer.contactUs', 'Contact Us')}</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('footer.company', 'Company')}</h4>
          <ul>
            <li><Link to="/about-us">{t('footer.aboutUs', 'About Us')}</Link></li>
            <li><Link to="/settings">{t('footer.myAccount', 'My Account')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright', '© 2026 Jomnenh-KH · All rights reserved.')}</p>
      </div>
    </footer>
  );
};

export default Footer;
