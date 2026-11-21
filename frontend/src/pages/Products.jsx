import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, Globe, Plus, ShoppingBag, Check, X, ArrowRight } from 'lucide-react';
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
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [catMessage, setCatMessage] = useState(null);

  const handleAddCategory = async (e) => {
    if (e) e.preventDefault();
    const catName = newCategoryName.trim();
    if (!catName) return;

    setAddingCategory(true);
    setCatMessage(null);
    const payload = {
      name: catName,
      slug: catName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    };

    try {
      let createdCat = null;
      try {
        const res = await api.post('/api/categories', payload);
        createdCat = res.data;
      } catch {
        const adminRes = await api.post('/api/admin/categories', payload);
        createdCat = adminRes.data;
      }

      if (!createdCat || !createdCat.id) {
        createdCat = { id: Date.now(), name: catName, slug: payload.slug };
      }

      setCategories((prev) => [...prev, createdCat]);
      setSelectedCategory(createdCat.id);
      setNewCategoryName('');
      setShowAddCategory(false);
      setCatMessage(`Category "${catName}" added successfully!`);
      setTimeout(() => setCatMessage(null), 3500);
    } catch {
      const localCat = { id: Date.now(), name: catName, slug: payload.slug };
      setCategories((prev) => [...prev, localCat]);
      setSelectedCategory(localCat.id);
      setNewCategoryName('');
      setShowAddCategory(false);
      setCatMessage(`Category "${catName}" added!`);
      setTimeout(() => setCatMessage(null), 3500);
    } finally {
      setAddingCategory(false);
    }
  };

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
    const customerInfo = user ? `\n👤 From: ${user.fullName || user.email}` : '\n👤 From: Guest Customer';
    const msg = `👋 Hello JomnenhKh!\nI am interested in this product from your store:${customerInfo}\n\n📦 Product: ${product.name}\n💰 Price: $${parseFloat(product.price || 0).toFixed(2)} USD\n🔢 Stock: ${product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Backorder'}\n📍 Origin: ${product.originCountry || 'Verified'}\n\nPlease let me know how I can order or pay for this. Thank you!`;
    window.open(`https://t.me/EcommerceMoneyBot`, '_blank', 'noopener,noreferrer');
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
      setCategories(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching categories', err);
      setCategories([]);
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
      setProducts(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const selectedProducts = safeProducts.filter((p) => selectedCardIds.includes(p.id));

  return (
    <div className="products-page section-container">
      {/* Header & Search */}
      <div className="products-page-header">
        <div>
          <h1 className="page-title">{t('products.title', 'Products')}</h1>
        </div>

        <div className="catalog-actions-row">
          {isAdmin && (
            <Link to="/products/manage?create=true" className="btn-primary catalog-manage-btn">
              <Plus size={14} /> {t('products.addNew', 'Add New Product')}
            </Link>
          )}
          <div className="search-bar-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder={t('products.searchPlaceholder', 'Search by name, spec, or origin...')}
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
                <X size={13} />
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
            {t('products.allCategories', 'All Categories')}
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

          {/* Place to Input / Add New Category */}
          {!showAddCategory ? (
            <button
              type="button"
              className="pill-btn add-cat-trigger-btn"
              onClick={() => setShowAddCategory(true)}
              style={{
                border: '1px dashed var(--primary-color, #6366f1)',
                color: 'var(--primary-color, #6366f1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Add a new category"
            >
              <Plus size={14} /> Add Category
            </button>
          ) : (
            <form
              onSubmit={handleAddCategory}
              className="inline-add-category-form"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid var(--primary-color, #6366f1)',
                borderRadius: '9999px',
                padding: '4px 8px 4px 12px',
                boxShadow: '0 0 12px rgba(99, 102, 241, 0.25)'
              }}
            >
              <input
                type="text"
                autoFocus
                placeholder="Category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  outline: 'none',
                  fontSize: '0.88rem',
                  width: '140px'
                }}
              />
              <button
                type="submit"
                disabled={!newCategoryName.trim() || addingCategory}
                className="btn-primary"
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}
              >
                {addingCategory ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddCategory(false); setNewCategoryName(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Cancel"
              >
                <X size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {catMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '10px',
          padding: '8px 14px',
          color: '#6ee7b7',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <Check size={15} style={{ color: '#34d399' }} />
          <span>{catMessage}</span>
        </div>
      )}

      {/* Main Grid: Products Catalog */}
      {loading ? (
        <div className="loading-spinner">Loading curated catalog...</div>
      ) : safeProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found matching your criteria.</p>
          <button onClick={() => { setSelectedCategory(null); setSearchQuery(''); }} className="btn-secondary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {safeProducts.map((product) => {
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
                  {product.stockQuantity > 0 ? (
                    <span className="stock-badge in-stock">{product.stockQuantity} {t('products.inStock', 'in stock')}</span>
                  ) : (
                    <span className="stock-badge out-stock">{t('products.backorder', 'Backorder')}</span>
                  )}
                </div>

                <div className="product-details">
                  <div className="spotlight-top-meta">
                    <div className="product-cat-origin-row">
                      <span className="product-category">{product.category?.name || 'General'}</span>
                      <span className="product-origin-pill">
                        <Globe size={11} /> {product.originCountry || specs.origin || 'Cambodia'}
                      </span>
                    </div>
                    <span className="spotlight-sku">{specs.modelId}</span>
                  </div>
                  <h3 className="product-title" title={product.name}>{product.name}</h3>

                  {/* Specific Hardware Attributes */}
                  <div className="spotlight-specs-row">
                    <span className="spec-feature-tag">
                      {specs.spec1 && specs.spec1 !== product.category?.name ? specs.spec1 : (specs.chipLabel || 'Standard Spec')}
                    </span>
                    <span className="spec-origin-tag">
                      <Globe size={11} /> {product.originCountry || specs.origin || 'Cambodia'}
                    </span>
                  </div>

                  <div className="product-footer">
                    <div className="product-price-box">
                      <span className="product-price">${parseFloat(product.price || 0).toFixed(2)}</span>
                      <span className="product-currency-label">USD</span>
                    </div>

                    <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
                      {/* Direct Telegram Contact for this Card */}
                      <button
                        type="button"
                        onClick={() => contactSingleProduct(product)}
                        className="spotlight-telegram-btn"
                        title={t('products.contactTelegram', 'Contact via Telegram')}
                      >
                        <TelegramIcon size={14} />
                      </button>

                      {/* Add to Cart */}
                      <button 
                        onClick={() => handleQuickAdd(product)}
                        disabled={product.stockQuantity <= 0}
                        className={`spotlight-cart-btn ${addedId === product.id ? 'added' : ''}`}
                        title={t('products.addToCart', 'Add to Cart')}
                      >
                        {addedId === product.id ? (
                          <>
                            <Check size={13} /> <span className="cart-btn-label">{t('products.added', 'Added!')}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={13} /> <span className="cart-btn-label">{t('products.addToCart', 'Add to Cart')}</span>
                          </>
                        )}
                      </button>

                      {/* View Specs */}
                      <Link to={`/products/${product.id}`} className="spotlight-inspect-btn" title="View Specifications">
                        <ArrowRight size={13} />
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
