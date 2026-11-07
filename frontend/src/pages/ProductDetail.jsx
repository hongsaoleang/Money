import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { Globe, Truck, ShieldCheck, ArrowLeft, ShoppingBag, CheckCircle2, Calendar, Clock, MapPin, Package } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading-spinner section-container">Loading product specifications...</div>;
  }

  if (!product) {
    return (
      <div className="section-container text-center">
        <h2>Product not found</h2>
        <Link to="/products" className="btn-primary mt-4">Back to Catalog</Link>
      </div>
    );
  }

  // Calculate estimated delivery date: 4 days from today
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
  const deliveryDateString = estimatedDelivery.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="product-detail-page section-container">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="product-detail-layout">
        {/* Left: Gallery & Provenance Badges */}
        <div className="product-media-column">
          <div className="main-image-container">
            <img src={product.imageUrl} alt={product.name} className="detail-image" />
            <span className="origin-badge large">
              <Globe size={16} /> Manufactured in: {product.originCountry || 'Verified Global Sourcing'}
            </span>
          </div>

          {/* Sourcing & Provenance Section */}
          <div className="provenance-detail-card">
            <div className="provenance-header">
              <ShieldCheck size={22} className="text-emerald" />
              <div>
                <h3>Authentic Origin & Traceability</h3>
                <p>Where this product is made and sourced</p>
              </div>
            </div>
            <div className="provenance-body">
              <div className="provenance-item">
                <MapPin size={18} className="provenance-icon" />
                <div>
                  <strong>Country of Manufacture:</strong>
                  <p>{product.originCountry || 'Audited International Facility'}</p>
                </div>
              </div>
              <div className="provenance-item">
                <Package size={18} className="provenance-icon" />
                <div>
                  <strong>Materials & Craftsmanship:</strong>
                  <p>{product.provenanceDetails || 'Crafted using certified zero-conflict alloys, sustainable packaging, and passed strict ISO quality verification.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase actions */}
        <div className="product-info-column">
          <span className="product-category-pill">{product.category?.name}</span>
          <h1 className="detail-product-title">{product.name}</h1>

          <div className="price-stock-row">
            <span className="detail-price">${parseFloat(product.price).toFixed(2)}</span>
            {isUpcoming ? (
              <span className="badge badge-warning">Scheduled Release</span>
            ) : product.stockQuantity > 0 ? (
              <span className="badge badge-success">In Stock ({product.stockQuantity} units available)</span>
            ) : (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>

          <div className="detail-description">
            <h3>Overview</h3>
            <p>{product.description}</p>
          </div>

          {/* Delivery Date Tracker Information */}
          <div className="delivery-estimator-card">
            <div className="delivery-header">
              <Truck size={20} className="text-indigo" />
              <div>
                <h4>Expected Delivery Timeline</h4>
                <p>If you order today, your estimated delivery date is:</p>
              </div>
            </div>
            <div className="delivery-date-highlight">
              <Calendar size={18} />
              <span>{deliveryDateString}</span>
              <span className="delivery-subtext">(Includes priority dispatch & express courier)</span>
            </div>
          </div>

          {/* Purchase Actions */}
          <div className="purchase-controls">
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className="btn-secondary add-cart-btn"
              >
                <ShoppingBag size={18} />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="btn-primary buy-now-btn"
              >
                Buy Now
              </button>
            </div>

          {/* Platform Trust Highlights */}
          <div className="trust-features-list">
            <div className="trust-item">
              <CheckCircle2 size={16} /> 30-Day Hassle-Free Returns
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} /> Official 2-Year Hardware Warranty
            </div>
            <div className="trust-item">
              <CheckCircle2 size={16} /> Encrypted Checkout & Secure Payments
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
