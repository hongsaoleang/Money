import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, Globe, Filter, ArrowRight, CheckCircle2, Package, Plus, ShoppingBag, Check, X, Sparkles, CheckSquare, Square } from 'lucide-react';
import { getProductSpecs } from '../utils/productSpecs';
import ProductTelegramSelectionBar from '../components/ProductTelegramSelectionBar';

const TelegramIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const Products = () => {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const [selectedCardIds, setSelectedCardIds] = useState([]);

  const handleQuickAdd = (product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const toggleSelectCard = (productId) => {
    setSelectedCardIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const contactSingleProduct = (product) => {
    const msg = `👋 Hello Hong Saoleang (@hongsaoleang)!\nI am interested in this product from your store:\n\n📦 Product: ${product.name}\n💰 Price: $${parseFloat(product.price).toFixed(2)} USD\n🔢 Stock: ${product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Backorder'}\n📍 Origin: ${product.originCountry || 'Verified'}\n\nPlease let me know how I can order or pay for this. Thank you!`;
    window.open(`https://t.me/hongsaoleang?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
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

  const selectedProducts = products.filter((p) => selectedCardIds.includes(p.id));

  return (
    <div className="products-page section-container">
      {/* Header & Search */}
      <div className="products-page-header">
        <div>
          <span className="section-badge"><Sparkles size={13} className="text-amber-400" /> Curated Store</span>
          <h1 className="page-title">Hardware Catalog</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '4px' }}>
            Click on any product card to select it and contact <strong>Hong Saoleang (@hongsaoleang)</strong> directly on Telegram.
          </p>
        </div>

        <div className="catalog-actions-row">
          {isAdmin && (
            <Link to="/products/manage?create=true" className="btn-primary catalog-manage-btn">
              <Plus size={17} /> Add New Product
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear-btn"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
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
            const isSelected = selectedCardIds.includes(product.id);

            return (
              <div
                key={product.id}
                className={`product-card ${isSelected ? 'card-selected' : ''}`}
                onClick={() => toggleSelectCard(product.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-image-wrap">
                  {/* Card Selection Toggle Button */}
                  <button
                    type="button"
                    className={`card-select-checkbox ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelectCard(product.id);
                    }}
                    title={isSelected ? 'Deselect this product' : 'Select product card'}
                  >
                    {isSelected ? (
                      <Check size={16} />
                    ) : (
                      <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.6)' }} />
                    )}
                  </button>

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

                    <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
                      {/* Direct Telegram Contact for this Card */}
                      <button
                        type="button"
                        onClick={() => contactSingleProduct(product)}
                        className="spotlight-telegram-btn"
                        title="Contact Hong Saoleang on Telegram for this product"
                      >
                        <TelegramIcon size={16} />
                      </button>

                      {/* Add to Cart */}
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

                      {/* View Specs */}
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

      {/* Floating Telegram Selection Bar (appears when any card is selected) */}
      <ProductTelegramSelectionBar
        selectedProducts={selectedProducts}
        onClear={() => setSelectedCardIds([])}
        onAddToCart={(items) => {
          items.forEach((p) => addToCart(p, 1));
          setSelectedCardIds([]);
        }}
      />
    </div>
  );
};

export default Products;
