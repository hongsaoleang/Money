import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, Globe, Filter, ArrowRight, CheckCircle2, Package, Plus, ShoppingBag, Check } from 'lucide-react';
import { getProductSpecs } from '../utils/productSpecs';

const Products = () => {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  useEffect(() => {
    fetchCategories();
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
          <h1 className="page-title">Products</h1>
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
      </div>

      {/* Main Grid: Products Catalog */}
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
              {products.map((product) => {
                const specs = getProductSpecs(product);
                return (
                  <div key={product.id} className="product-card">
                    <div className="product-image-wrap">
                      <img src={product.imageUrl} alt={product.name} className="product-image" />
                      <span className="origin-badge">
                        <Globe size={12} /> {product.originCountry || 'Verified'}
                      </span>
                      {product.stockQuantity > 0 ? (
                        <span className="stock-badge in-stock">{product.stockQuantity} in stock</span>
                      ) : (
                        <span className="stock-badge out-stock">Backorder</span>
                      )}
                    </div>
                    <div className="product-details">
                      <div className="spotlight-top-meta">
                        <span className="product-category">{product.category?.name}</span>
                        <span className="spotlight-sku">{specs.modelId}</span>
                      </div>
                      <h3 className="product-title">{product.name}</h3>

                      {/* Specific Hardware Attributes */}
                      <div className="spotlight-specs-row">
                        <span className="spec-feature-tag">{specs.spec1}</span>
                        <span className="spec-origin-tag"><Globe size={11} /> {specs.origin}</span>
                      </div>

                      <div className="product-footer">
                        <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
                        <div className="product-card-actions">
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
    </div>
  );
};

export default Products;
