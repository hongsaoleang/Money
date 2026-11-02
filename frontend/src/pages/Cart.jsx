import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { ShoppingBag, Trash2, ArrowRight, Truck, Calendar, ShieldCheck, MapPin, CheckCircle } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || '742 Evergreen Terrace, Springfield, OR');
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Delivery calculation: 4 days after order date
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
  const deliveryDateString = estimatedDelivery.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        shippingAddress,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post('/api/orders', orderPayload);
      setOrderConfirmed(res.data);
      clearCart();
    } catch (err) {
      alert('Checkout error: ' + (err.response?.data?.message || 'Failed to place order.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="section-container checkout-success-view">
        <div className="success-card">
          <div className="success-icon-wrap">
            <CheckCircle size={48} className="text-emerald" />
          </div>
          <h1>Order Successfully Placed!</h1>
          <p className="order-number-text">Order ID: <strong>#{orderConfirmed.id}</strong></p>

          <div className="post-order-delivery-box">
            <div className="delivery-icon-col">
              <Calendar size={28} className="text-indigo" />
            </div>
            <div>
              <h3>Estimated Arrival Date:</h3>
              <p className="delivery-big-date">
                {new Date(orderConfirmed.estimatedDeliveryDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="delivery-subtext">
                Your order is now being processed and packed. Complete origin and tracking updates will be available in your settings.
              </p>
            </div>
          </div>

          <div className="success-actions">
            <Link to="/settings" className="btn-secondary">
              View Order in Settings
            </Link>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="section-container text-center empty-cart-view">
        <ShoppingBag size={54} className="text-muted" />
        <h2>Your Cart is Empty</h2>
        <p>Explore our precision hardware devices and add items to your cart.</p>
        <Link to="/products" className="btn-primary mt-4">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page section-container">
      <h1 className="page-title">Review Shopping Cart</h1>

      <div className="cart-layout">
        {/* Items List */}
        <div className="cart-items-column">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="cart-item-card">
              <img src={product.imageUrl} alt={product.name} className="cart-thumb" />
              <div className="cart-item-details">
                <h3>{product.name}</h3>
                <span className="cart-item-origin">Origin: {product.originCountry}</span>
                <span className="cart-item-price">${parseFloat(product.price).toFixed(2)}</span>
              </div>

              <div className="cart-qty-controls">
                <button onClick={() => updateQuantity(product.id, quantity - 1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => updateQuantity(product.id, quantity + 1)}>+</button>
              </div>

              <div className="cart-line-total">
                ${(parseFloat(product.price) * quantity).toFixed(2)}
              </div>

              <button
                onClick={() => removeFromCart(product.id)}
                className="cart-remove-btn"
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout */}
        <div className="cart-summary-column">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Express Insured Shipping</span>
              <span className="text-emerald">FREE</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {/* Delivery Promise */}
            <div className="delivery-promise-banner">
              <Truck size={18} className="text-indigo" />
              <div>
                <strong>Estimated Delivery Date:</strong>
                <p>{deliveryDateString}</p>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="form-group">
                <label><MapPin size={14} /> Shipping Destination Address *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street, City, State, Country"
                />
              </div>

              {!user && (
                <div className="alert-warning text-xs">
                  You will be prompted to sign in before finalizing your order.
                </div>
              )}

              <button type="submit" disabled={submitting} className="btn-primary checkout-btn">
                {submitting ? 'Confirming Order...' : `Confirm & Pay $${totalPrice.toFixed(2)}`}
              </button>
            </form>

            <div className="checkout-trust">
              <ShieldCheck size={16} /> 256-bit SSL encrypted & secure transaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
