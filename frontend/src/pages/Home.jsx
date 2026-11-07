import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ArrowRight, Sparkles, Globe,
  ShoppingBag, Check, Package, BarChart3, Filter
} from 'lucide-react';
import ProductGraphDashboard from '../components/ProductGraphDashboard';
import { getProductSpecs } from '../utils/productSpecs';

const Home = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await api.get('/api/products');
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error('Failed to fetch home page data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* 1. PRODUCT INTELLIGENCE & INTERACTIVE LINE GRAPH DASHBOARD */}
      <section className="section-container product-dashboard-section">
        <ProductGraphDashboard products={products} />
      </section>

      {/* 2. PRODUCTS CATALOG SHOWCASE (4 COLUMNS - SPECIFIC DETAILS) */}
      <section className="top-featured-section section-container">
        <div className="top-featured-header">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="section-badge"><Sparkles size={13} className="text-amber-400" /> Curated Store</span>
              <span className="featured-live-beacon"><span className="pulse-dot" /> In Stock &amp; Ready</span>
            </div>
            <h1 className="top-featured-title">
              Available <span className="gradient-text">Hardware</span> Products
            </h1>
          </div>

          <Link to="/products" className="view-all-pill">
            Full Catalog ({products.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4-Column Product Grid with Specific Specs */}
        {loading ? (
          <div className="loading-spinner">Loading product catalog...</div>
        ) : (
          <div className="featured-showcase-grid">
            {products.map((product) => {
              const specs = getProductSpecs(product);
              return (
                <div 
                  key={product.id} 
                  className="featured-spotlight-card"
                >
                  {/* Visual Thumbnail Wrap */}
                  <div className="spotlight-thumb-wrap">
                    <img src={product.imageUrl} alt={product.name} className="spotlight-img" />
                    <div className="spotlight-badge-row">
                      <span className={`spotlight-stock-badge ${product.stockQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Backorder'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body with Specific Specs */}
                  <div className="spotlight-content">
                    <div className="spotlight-top-meta">
                      <span className="spotlight-category">{product.category?.name}</span>
                      <span className="spotlight-sku">{specs.modelId}</span>
                    </div>

                    <h3 className="spotlight-title">{product.name}</h3>

                    {/* Specific Hardware Attributes */}
                    <div className="spotlight-specs-row">
                      <span className="spec-feature-tag">{specs.spec1}</span>
                      <span className="spec-origin-tag"><Globe size={11} /> {specs.origin}</span>
                    </div>

                    <div className="spotlight-footer">
                      <span className="spotlight-price">${parseFloat(product.price).toFixed(2)}</span>

                      <div className="spotlight-actions">
                        <button 
                          onClick={() => handleQuickAdd(product)}
                          disabled={product.stockQuantity <= 0}
                          className={`spotlight-cart-btn ${addedId === product.id ? 'added' : ''}`}
                          title="Add to shopping cart"
                        >
                          {addedId === product.id ? (
                            <>
                              <Check size={15} /> Added!
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={15} /> Add to Cart
                            </>
                          )}
                        </button>

                        <Link to={`/products/${product.id}`} className="spotlight-inspect-btn" title="View Specifications">
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
