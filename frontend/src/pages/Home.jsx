import React, { useEffect } from 'react';
import WeShopHeroSection from '../components/weshop/WeShopHeroSection';
import WeShopFeaturedStores from '../components/weshop/WeShopFeaturedStores';
import './WeShopHome.css';

const Home = () => {
  useEffect(() => {
    // Set document title
    const prevTitle = document.title;
    document.title = 'JomnenhKH-Shop — Modern Marketplace | Source Smarter. Grow Together.';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="weshop-page">
      {/* 1. Hero Section (2-Column layout, 58px bold heading, green highlight, premium photography) */}
      <WeShopHeroSection />

      {/* 2. Featured Stores Section (5 Cards in 1 Row on Desktop, cover images, info, category icons, arrow buttons) */}
      <WeShopFeaturedStores />
    </div>
  );
};

export default Home;
