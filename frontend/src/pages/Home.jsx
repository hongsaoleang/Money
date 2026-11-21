import React, { useEffect } from 'react';
import JomnenhKhHeroSection from '../components/jomnenhkh/JomnenhKhHeroSection';
import JomnenhKhTopProducts from '../components/jomnenhkh/JomnenhKhTopProducts';
import './JomnenhKhHome.css';

const Home = () => {
  useEffect(() => {
    // Set document title
    const prevTitle = document.title;
    document.title = 'JomnenhKh — Modern Marketplace';
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className="jomnenhkh-page weshop-page">
      {/* 1. Hero Section with Top In-Stock Highlights and Big Image on the Right */}
      <JomnenhKhHeroSection />

      {/* 2. Top Products In Stock Section (Admin Configurable) */}
      <JomnenhKhTopProducts />
    </div>
  );
};

export default Home;
