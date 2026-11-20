import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import TechStoreHome from './pages/TechStoreHome';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import ProductManage from './pages/ProductManage';
import Services from './pages/Services';
import AboutUs from './pages/AboutUs';
import Settings from './pages/Settings';
import ClientPortal from './pages/ClientPortal';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

const AppLayout = () => {
  return (
    <div className="app-container">
      {/* Global Blurred Brand Watermark Background across the entire website */}
      <div className="site-global-watermark-layer" aria-hidden="true">
        <div className="site-watermark-item watermark-top-right">
          <img
            src="/jomnenhkh-icon.jpg"
            onError={(e) => {
              if (e.currentTarget.src !== '/JomnenhKH.jpg') {
                e.currentTarget.src = '/JomnenhKH.jpg';
              }
            }}
            alt=""
            className="site-watermark-img"
          />
        </div>
        <div className="site-watermark-item watermark-mid-left">
          <img
            src="/jomnenhkh-icon.jpg"
            onError={(e) => {
              if (e.currentTarget.src !== '/JomnenhKH.jpg') {
                e.currentTarget.src = '/JomnenhKH.jpg';
              }
            }}
            alt=""
            className="site-watermark-img"
          />
        </div>
        <div className="site-watermark-item watermark-bottom-right">
          <img
            src="/jomnenhkh-icon.jpg"
            onError={(e) => {
              if (e.currentTarget.src !== '/JomnenhKH.jpg') {
                e.currentTarget.src = '/JomnenhKH.jpg';
              }
            }}
            alt=""
            className="site-watermark-img"
          />
        </div>
      </div>

      <Navbar />
      <main className="main-content relative z-10">
        <Routes>
          {/* Main JomnenhKH-Shop Modern Marketplace Homepage */}
          <Route path="/" element={<Home />} />

          {/* Path Aliases */}
          <Route path="/jomnenhkh-shop" element={<Home />} />
          <Route path="/weshop" element={<Home />} />
          <Route path="/marketplace" element={<Home />} />
          <Route path="/tech-store" element={<TechStoreHome />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about-us" element={<AboutUs />} />

                  {/* Public Auth Pages - Redirect away if already signed in */}
                  <Route
                    path="/login"
                    element={
                      <PublicOnlyRoute>
                        <Login />
                      </PublicOnlyRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PublicOnlyRoute>
                        <Register />
                      </PublicOnlyRoute>
                    }
                  />

                  {/* Customer Protected Route - Sign-in required for Cart & Checkout */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />

                  {/* Customer Protected Route - Sign-in required for Account & Orders */}
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />

                  {/* Client Merchant Route */}
                  <Route
                    path="/client/deploy"
                    element={
                      <ProtectedRoute requiredRole="ROLE_CLIENT">
                        <ClientPortal />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Protected Routes */}
                  <Route
                    path="/products/manage"
                    element={
                      <ProtectedRoute requiredRole="ROLE_ADMIN">
                        <ProductManage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="ROLE_ADMIN">
                        <Admin />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <AppLayout />
            </Router>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
