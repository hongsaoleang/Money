import React, { useEffect } from 'react';
import WeShopHeroSection from '../components/weshop/WeShopHeroSection';
import WeShopTopProducts from '../components/weshop/WeShopTopProducts';
import './WeShopHome.css';

const Home = () => {
  useEffect(() => {
    // Set document title
    const prevTitle = document.title;
    document.title = 'JomnenhKH-Shop — Modern Marketplace';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="weshop-page">
      {/* 1. Hero Section with Top In-Stock Highlights and Big Image on the Right */}
      <WeShopHeroSection />

      {/* 2. Top Products In Stock Section (Admin Configurable) */}
      <WeShopTopProducts />
    </div>
  );
};

export default Home;
