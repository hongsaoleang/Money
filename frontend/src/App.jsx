import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import WeShopHome from './pages/WeShopHome';
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
import { useAuth } from './context/AuthContext';

const HomeRoute = () => {
  const { user } = useAuth();
  return user ? <Home /> : <Navigate to="/products" replace />;
};

const AppLayout = () => {
  const location = useLocation();
  const isJomnenhShop =
    location.pathname === '/jomnenhkh-shop' ||
    location.pathname === '/weshop' ||
    location.pathname === '/marketplace';

  return (
    <div className={`app-container ${isJomnenhShop ? 'weshop-standalone' : ''}`}>
      {!isJomnenhShop && <Navbar />}
      <main className={`main-content ${isJomnenhShop ? 'weshop-main-content' : ''}`}>
        <Routes>
          {/* Home Route: Registered users see Home, unregistered visitors go straight to Products */}
          <Route path="/" element={<HomeRoute />} />

          {/* JomnenhKH-Shop Modern Marketplace Homepage */}
          <Route path="/jomnenhkh-shop" element={<WeShopHome />} />
          <Route path="/weshop" element={<WeShopHome />} />
          <Route path="/marketplace" element={<WeShopHome />} />

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
              {!isJomnenhShop && <Footer />}
            </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppLayout />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
