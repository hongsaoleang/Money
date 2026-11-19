import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Globe, ArrowLeft, ShoppingBag } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const isUpcoming = Boolean(product?.isUpcoming || (product?.releaseDate && new Date(product.releaseDate) > new Date()));

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


  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in to add items to your cart.',
        },
      });
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in to add items to your cart and proceed to checkout.',
        },
      });
      return;
    }
    addToCart(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="product-detail-page section-container">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="product-detail-layout">
        {/* Left: Product Image */}
        <div className="product-media-column">
          <div className="main-image-container">
            <img src={product.imageUrl} alt={product.name} className="detail-image" />
            {product.originCountry && (
              <span className="origin-badge large">
                <Globe size={16} /> {product.originCountry}
              </span>
            )}
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

            {/* Direct Telegram Chat & Purchase Button */}
            <a
              href={`https://t.me/hongsaoleang?text=${encodeURIComponent(
                `👋 Hello Hong Saoleang (@hongsaoleang)!\nI want to purchase this product:\n\n📦 Product: ${product.name}\n💰 Price: $${parseFloat(product.price).toFixed(2)} USD\n🔢 Quantity: ${quantity} unit(s)\n📍 Origin: ${product.originCountry || 'Verified'}\n\nPlease confirm availability and payment details. Thank you!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram"
              style={{ marginTop: '12px', textDecoration: 'none' }}
              title="Purchase or chat directly with Hong Saoleang on Telegram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              Chat on Telegram
            </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
