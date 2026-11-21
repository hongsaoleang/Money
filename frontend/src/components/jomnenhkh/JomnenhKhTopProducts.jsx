import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ShoppingBag, Check, 
  Star, MapPin, ArrowUpRight, Package
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const INITIAL_TOP_PRODUCTS = [];

const JomnenhKhTopProducts = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [addedId, setAddedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Directly load live products and categories from the database (identical to Products page)
  useEffect(() => {
    let isMounted = true;
    const loadProductsFromPage = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/categories').catch(() => ({ data: [] }))
        ]);

        if (!isMounted) return;

        if (Array.isArray(prodRes?.data)) {
          setProducts(prodRes.data);
        } else {
          setProducts([]);
        }

        if (Array.isArray(catRes?.data) && catRes.data.length > 0) {
          setCategories(catRes.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.warn('Could not load products from API:', err);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProductsFromPage();
    return () => { isMounted = false; };
  }, []);

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', {
        state: { message: 'Please sign in to add items to your cart.' },
      });
      return;
    }

    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  // Build category filter list from products & categories
  const categoryNames = [
    'ALL',
    ...Array.from(
      new Set(
        products
          .map((p) => (typeof p.category === 'object' ? p.category?.name : p.category))
          .filter(Boolean)
      )
    )
  ];

  const filteredProducts = activeCategory === 'ALL'
    ? products
    : products.filter((p) => {
        const catName = typeof p.category === 'object' ? p.category?.name : p.category;
        return catName === activeCategory;
      });

  return (
    <section className="jomnenhkh-top-products-section weshop-top-products-section jomnenhkh-feature-watermark-wrap weshop-feature-watermark-wrap" id="top-products">
      {/* Blurred Brand Icon Watermark in Section Background */}
      <div className="jomnenhkh-brand-watermark-bg weshop-brand-watermark-bg bottom-right" aria-hidden="true">
        <img
          src="/jomnenhkh-icon.jpg"
          onError={(e) => {
            if (e.currentTarget.src !== '/JomnenhKH.jpg') {
              e.currentTarget.src = '/JomnenhKH.jpg';
            }
          }}
          alt=""
          className="jomnenhkh-brand-watermark-img weshop-brand-watermark-img"
        />
      </div>

      <div className="jomnenhkh-stores-container weshop-stores-container relative z-10">
        {/* Section Header */}
        <div className="jomnenhkh-stores-header weshop-stores-header justify-end">
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              className="jomnenhkh-explore-stores-btn weshop-explore-stores-btn"
              onClick={() => navigate('/products')}
            >
              <span>{language === 'KH' ? 'មើលទំនិញទាំងអស់' : 'Explore All Products'}</span>
              <ArrowRight size={16} className="jomnenhkh-explore-arrow weshop-explore-arrow" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills Row */}
        {categoryNames.length > 2 && (
          <div className="jomnenhkh-category-pills-bar weshop-category-pills-bar no-scrollbar">
            {categoryNames.map((cat) => {
              const count = cat === 'ALL'
                ? products.length
                : products.filter((p) => (typeof p.category === 'object' ? p.category?.name : p.category) === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`jomnenhkh-category-pill weshop-category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span>{cat === 'ALL' ? (language === 'KH' ? 'ទាំងអស់' : 'All Products') : cat}</span>
                  {cat !== 'ALL' && (
                    <span className="jomnenhkh-category-count-badge weshop-category-count-badge">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Products Grid: 2 containers per row on phone view */}
        <div className="jomnenhkh-stores-grid weshop-stores-grid jomnenhkh-top-products-grid">
          {filteredProducts.map((prod) => {
            const categoryLabel = typeof prod.category === 'object' 
              ? prod.category?.name 
              : (prod.category || 'Hardware');
            const stock = prod.stockQuantity ?? 0;

            return (
              <article
                key={prod.id}
                className="jomnenhkh-store-card weshop-store-card jomnenhkh-product-card weshop-product-card"
                onClick={() => navigate(`/products`)}
                tabIndex={0}
                role="button"
                aria-label={`View ${prod.name}, price $${parseFloat(prod.price || 0).toFixed(2)}`}
              >
                {/* Cover Image Box */}
                <div className="jomnenhkh-store-img-box weshop-store-img-box">
                  <img
                    src={prod.imageUrl || 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'}
                    alt={prod.name}
                    className="jomnenhkh-store-cover-img weshop-store-cover-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80';
                    }}
                  />

                  {/* Subtle Image Bottom Shadow Overlay */}
                  <div className="jomnenhkh-store-img-gradient weshop-store-img-gradient" aria-hidden="true" />

                  {/* Category Pill Tag */}
                  <div className="jomnenhkh-store-category-chip weshop-store-category-chip">
                    {categoryLabel}
                  </div>

                  {/* Stock Indicator Badge */}
                  <div className="jomnenhkh-prod-stock-chip weshop-prod-stock-chip">
                    <span className="jomnenhkh-prod-stock-dot weshop-prod-stock-dot" />
                    <span>{stock > 0 ? `${stock} in stock` : 'Out of Stock'}</span>
                  </div>
                </div>

                {/* Product Info Box Underneath */}
                <div className="jomnenhkh-store-info-box weshop-store-info-box relative overflow-hidden">
                  {/* Subtle blurred card background watermark */}
                  <div className="jomnenhkh-card-watermark weshop-card-watermark" aria-hidden="true">
                    <img
                      src="/jomnenhkh-icon.jpg"
                      onError={(e) => {
                        if (e.currentTarget.src !== '/JomnenhKH.jpg') {
                          e.currentTarget.src = '/JomnenhKH.jpg';
                        }
                      }}
                      alt=""
                      className="jomnenhkh-card-watermark-img weshop-card-watermark-img"
                    />
                  </div>

                  <div className="w-full flex items-start justify-between gap-1.5 relative z-10">
                    <h3 className="jomnenhkh-store-name weshop-store-name truncate" title={prod.name}>
                      {prod.name}
                    </h3>
                    <div className="jomnenhkh-store-arrow-circle weshop-store-arrow-circle" aria-hidden="true">
                      <ArrowUpRight size={13} className="jomnenhkh-store-arrow-icon weshop-store-arrow-icon" />
                    </div>
                  </div>

                  <div className="jomnenhkh-prod-meta-row weshop-prod-meta-row relative z-10">
                    <span className="jomnenhkh-prod-origin weshop-prod-origin">
                      <MapPin size={11} className="jomnenhkh-meta-pin weshop-meta-pin" />
                      <span>{prod.originCountry || 'Verified Origin'}</span>
                    </span>
                    {prod.rating && (
                      <span className="jomnenhkh-prod-rating weshop-prod-rating">
                        <Star size={11} fill="currentColor" />
                        <span>{prod.rating}</span>
                      </span>
                    )}
                  </div>

                  {/* Price and Add to Cart Action */}
                  <div className="jomnenhkh-prod-footer-row weshop-prod-footer-row relative z-10">
                    <div className="jomnenhkh-prod-price-wrap weshop-prod-price-wrap">
                      <span className="jomnenhkh-price-currency weshop-price-currency">$</span>
                      <span className="jomnenhkh-price-value weshop-price-value">{parseFloat(prod.price || 0).toFixed(2)}</span>
                    </div>

                    <button
                      type="button"
                      className={`jomnenhkh-prod-quick-add-btn weshop-prod-quick-add-btn ${addedId === prod.id ? 'added' : ''}`}
                      onClick={(e) => handleQuickAdd(prod, e)}
                      title="Add to Shopping Cart"
                    >
                      {addedId === prod.id ? (
                        <>
                          <Check size={13} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={13} />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JomnenhKhTopProducts;
