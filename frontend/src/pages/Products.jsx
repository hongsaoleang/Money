import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Search, Globe, Clock, Filter, ArrowRight, CheckCircle2, Package, Plus } from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';

const Products = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [upcomingProducts, setUpcomingProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'upcoming'

  useEffect(() => {
    fetchCategories();
    fetchUpcoming();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const fetchUpcoming = async () => {
    try {
      const res = await api.get('/api/products/upcoming');
      setUpcomingProducts(res.data);
    } catch (err) {
      console.error('Error fetching upcoming products', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (params.toString()) url += `?${params.toString()}`;

      const res = await api.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="products-page section-container">
      {/* Header & Search */}
      <div className="products-page-header">
        <div>
          <span className="section-badge">Catalog</span>
          <h1 className="page-title">Curated Hardware</h1>
          <p className="page-desc">Verified origin and direct delivery tracking.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {isAdmin && (
            <Link to="/products/manage" className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
              <Package size={16} /> Manage Products (CRUD)
            </Link>
          )}
          <div className="search-bar-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, spec, or origin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Category Pills & Tab Switcher */}
      <div className="catalog-toolbar">
        <div className="category-pills">
          <button
            className={`pill-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="tab-switch">
          <button
            className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Now ({products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            <Clock size={14} /> Scheduled Releases ({upcomingProducts.length})
          </button>
        </div>
      </div>

      {/* Main Grid: Available Products */}
      {activeTab === 'available' && (
        <>
          {loading ? (
            <div className="loading-spinner">Loading curated catalog...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found matching your criteria.</p>
              <button onClick={() => { setSelectedCategory(null); setSearchQuery(''); }} className="btn-secondary">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-wrap">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                    <span className="origin-badge">
                      <Globe size={13} /> {product.originCountry || 'Verified'}
                    </span>
                    {product.stockQuantity > 0 ? (
                      <span className="stock-badge in-stock">In Stock ({product.stockQuantity})</span>
                    ) : (
                      <span className="stock-badge out-stock">Backorder</span>
                    )}
                  </div>
                  <div className="product-details">
                    <span className="product-category">{product.category?.name}</span>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-desc">{product.description?.substring(0, 95)}...</p>

                    <div className="provenance-chip">
                      <strong>Origin:</strong> {product.provenanceDetails?.substring(0, 65)}...
                    </div>

                    <div className="product-footer">
                      <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
                      <Link to={`/products/${product.id}`} className="btn-secondary btn-sm">
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Scheduled Releases Tab */}
      {activeTab === 'upcoming' && (
        <div className="upcoming-catalog-grid">
          {upcomingProducts.length === 0 ? (
            <div className="empty-state">
              <p>No scheduled future releases at this moment. Check back soon!</p>
            </div>
          ) : (
            upcomingProducts.map((product) => (
              <div key={product.id} className="upcoming-item-card">
                <div className="upcoming-img-wrap">
                  <img src={product.imageUrl} alt={product.name} />
                  <span className="origin-badge">
                    <Globe size={13} /> Origin: {product.originCountry}
                  </span>
                </div>
                <div className="upcoming-details">
                  <span className="product-category">{product.category?.name}</span>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>

                  <div className="provenance-box">
                    <h4>Manufacturing & Provenance:</h4>
                    <p>{product.provenanceDetails}</p>
                  </div>

                  <div className="release-countdown-container">
                    <div className="release-meta">
                      <Clock size={16} /> Scheduled Release: {new Date(product.releaseDate).toLocaleDateString()} at {new Date(product.releaseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <CountdownTimer targetDate={product.releaseDate} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
