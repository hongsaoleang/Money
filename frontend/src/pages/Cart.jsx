import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  ShoppingBag,
  Trash2,
  Calendar,
  ShieldCheck,
  MapPin,
  CheckCircle,
  CheckSquare,
  Square,
  ExternalLink
} from 'lucide-react';

// Custom Telegram Icon SVG for sharp branding
const TelegramIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const Cart = () => {
  const { cartItems, removeFromCart, removeItemsFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(
    user?.address || 'Street 2004, Phnom Penh, Cambodia'
  );
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Selected item IDs for checkout (default: all items selected)
  const [selectedIds, setSelectedIds] = useState(() => cartItems.map((item) => item.product.id));

  // Keep selection synchronized when items change
  useEffect(() => {
    setSelectedIds((prev) => {
      const currentIds = cartItems.map((item) => item.product.id);
      // Retain already selected items that still exist
      const retained = prev.filter((id) => currentIds.includes(id));
      // For any brand-new items added, auto-select them
      const newIds = currentIds.filter((id) => !prev.includes(id));
      return [...retained, ...newIds];
    });
  }, [cartItems]);

  const toggleSelectItem = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(cartItems.map((item) => item.product.id)); // Select all
    }
  };

  // Filter selected items
  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.product.id));

  // Calculate selected total price and quantity
  const selectedTotalPrice = selectedItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.product.price),
    0
  );
  const selectedTotalQty = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  // Delivery calculation: 4 days after order date
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);
  const deliveryDateString = estimatedDelivery.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Construct message for direct Telegram chat with Hong Saoleang (@hongsaoleang)
  const buildTelegramMessage = (orderId = null) => {
    const customerName = user?.fullName || 'Customer';
    const customerEmail = user?.email || 'N/A';
    const idText = orderId ? `#${orderId}` : '(Direct Order)';

    let msg = `👋 Hello Hong Saoleang (@hongsaoleang)!\n`;
    msg += `Here is my Order Summary:\n\n`;
    msg += `📦 Order: ${idText}\n`;
    if (customerName && customerName !== 'Customer') {
      msg += `👤 Customer: ${customerName} (${customerEmail})\n`;
    }
    if (shippingAddress) {
      msg += `📍 Destination: ${shippingAddress}\n\n`;
    }
    msg += `🛒 Products Added (${selectedItems.length} items):\n`;

    selectedItems.forEach((item, idx) => {
      const itemSubtotal = (item.quantity * parseFloat(item.product.price)).toFixed(2);
      msg += `  ${idx + 1}. ${item.product.name}\n`;
      msg += `     • Qty: ${item.quantity} unit(s) @ $${parseFloat(item.product.price).toFixed(2)}\n`;
      msg += `     • Subtotal: $${itemSubtotal}\n`;
    });

    msg += `\n💰 Total: $${selectedTotalPrice.toFixed(2)} USD\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Please confirm my order and let me know the payment details. Thank you!`;

    return msg;
  };

  // Chat via Telegram Order Summary (Submits order, alerts bot, opens @hongsaoleang)
  const handleChatViaTelegramOrderSummary = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one product to order.');
      return;
    }

    setSubmitting(true);
    let createdOrder = null;
    try {
      const orderPayload = {
        shippingAddress,
        items: selectedItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // Place order in backend (deducts stock, updates sales graph, triggers Telegram bot notification)
      const res = await api.post('/api/orders', orderPayload);
      createdOrder = res.data;

      // Remove only the ordered products from cart
      removeItemsFromCart(selectedIds);
      setOrderConfirmed(createdOrder);
    } catch (err) {
      console.warn('Backend order auto-sync notice:', err);
    } finally {
      setSubmitting(false);
      // ALWAYS open Telegram directly to Hong Saoleang (@hongsaoleang) with the order summary!
      const tgMessage = buildTelegramMessage(createdOrder ? createdOrder.id : null);
      const telegramUrl = `https://t.me/hongsaoleang?text=${encodeURIComponent(tgMessage)}`;
      window.open(telegramUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // ==========================================
  // CONFIRMATION SUCCESS VIEW
  // ==========================================
  if (orderConfirmed) {
    const tgMessage = buildTelegramMessage(orderConfirmed.id);
    const telegramOwnerUrl = `https://t.me/hongsaoleang?text=${encodeURIComponent(tgMessage)}`;

    return (
      <div className="section-container checkout-success-view">
        <div className="success-card">
          <div className="success-icon-wrap">
            <CheckCircle size={48} className="text-emerald" />
          </div>
          <span className="badge badge-success mb-2">Order Confirmed & Sent</span>
          <h1>Thank You for Your Order!</h1>
          <p className="order-number-text">
            Official Order ID: <strong>#{orderConfirmed.id}</strong>
          </p>

          {/* Direct Telegram Chat with Owner */}
          <div className="telegram-channel-card owner-card" style={{ maxWidth: '480px', margin: '20px auto', textAlign: 'center' }}>
            <div className="telegram-card-header" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <TelegramIcon size={24} className="text-sky-400" />
              <h4 style={{ fontSize: '1.1rem' }}>Chat Official Order ID: #{orderConfirmed.id}</h4>
            </div>
            <p className="telegram-card-desc" style={{ marginBottom: '14px' }}>
              Chat with @hongsaoleang on Telegram
            </p>
            <a
              href={telegramOwnerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram"
              style={{ marginTop: 0, justifyContent: 'center' }}
            >
              <TelegramIcon size={18} /> Chat Order #{orderConfirmed.id} <ExternalLink size={14} />
            </a>
          </div>

          {/* Delivery Promise */}
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
                Your order is currently being packed. Live status and tracking updates are available in your account settings.
              </p>
            </div>
          </div>

          {/* Ordered Products Breakdown */}
          {orderConfirmed.items && orderConfirmed.items.length > 0 && (
            <div className="order-items-preview-box" style={{ marginTop: '20px', textAlign: 'left' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '0.95rem', color: 'var(--text-dim)' }}>
                Products in Order #{orderConfirmed.id}:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orderConfirmed.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255,255,255,0.03)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>
                        {item.product?.name || `Product #${item.product?.id}`}
                      </strong>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        Quantity: {item.quantity} unit(s)
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                      ${(item.quantity * parseFloat(item.unitPrice || 0)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--border-color)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                }}
              >
                <span>Total Amount:</span>
                <span style={{ color: '#10b981' }}>${parseFloat(orderConfirmed.totalAmount).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="success-actions" style={{ marginTop: '28px' }}>
            <Link to="/settings" className="btn-secondary">
              View in Order History
            </Link>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART VIEW
  // ==========================================
  if (cartItems.length === 0) {
    return (
      <div className="section-container text-center empty-cart-view">
        <ShoppingBag size={54} className="text-muted" />
        <h2>Your Cart is Empty</h2>
        <p>Explore our curated catalog and add precision products to your cart.</p>
        <Link to="/products" className="btn-primary mt-4">
          Browse Products
        </Link>
      </div>
    );
  }

  // ==========================================
  // CART WITH PRODUCT SELECTION
  // ==========================================
  const allSelected = cartItems.length > 0 && selectedIds.length === cartItems.length;

  return (
    <div className="cart-page section-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Review Shopping Cart</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '4px' }}>
            Select the specific products you want to checkout or send via Telegram.
          </p>
        </div>
        <div className="cart-select-count-badge">
          {selectedItems.length} of {cartItems.length} product(s) selected
        </div>
      </div>

      <div className="cart-layout">
        {/* Left Column: Select All Bar & Items List */}
        <div className="cart-items-column">
          {/* Select All Toggle Bar */}
          <div className="cart-select-all-bar">
            <div className="cart-select-all-label" onClick={toggleSelectAll}>
              {allSelected ? (
                <CheckSquare size={20} className="text-indigo" />
              ) : (
                <Square size={20} className="text-dim" />
              )}
              <span>
                {allSelected ? 'Deselect All Products' : 'Select All Products'} ({cartItems.length})
              </span>
            </div>
            <button
              onClick={toggleSelectAll}
              className="btn-secondary text-xs"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              {allSelected ? 'Clear Selection' : 'Select All'}
            </button>
          </div>

          {/* Cart Item Cards with Selection Checkboxes */}
          {cartItems.map(({ product, quantity }) => {
            const isSelected = selectedIds.includes(product.id);
            return (
              <div
                key={product.id}
                className={`cart-item-card ${isSelected ? 'is-selected' : 'is-unselected'}`}
              >
                {/* Product Selection Checkbox */}
                <button
                  type="button"
                  className={`cart-item-checkbox ${isSelected ? 'checked' : 'unchecked'}`}
                  onClick={() => toggleSelectItem(product.id)}
                  title={isSelected ? 'Deselect this product' : 'Select this product to order'}
                >
                  {isSelected ? (
                    <CheckSquare size={22} className="text-indigo" />
                  ) : (
                    <Square size={22} />
                  )}
                </button>

                <img src={product.imageUrl} alt={product.name} className="cart-thumb" />

                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <span className="cart-item-origin">Origin: {product.originCountry || 'Verified'}</span>
                  <span className="cart-item-price">
                    ${parseFloat(product.price).toFixed(2)} each
                  </span>
                  {!isSelected && (
                    <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '2px' }}>
                      (Excluded from this checkout)
                    </span>
                  )}
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
                  title="Remove item permanently"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right Column: ORDER SUMMARY (Keeps only added products & total, Telegram only) */}
        <div className="cart-summary-column">
          <div className="summary-card">
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              Chat via Telegram Order Summary
            </h3>

            {/* List of Products Added */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700 }}>
                Products Added ({selectedItems.length}):
              </span>

              {selectedItems.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontStyle: 'italic', marginTop: '8px' }}>
                  No products selected. Please check at least one product.
                </p>
              ) : (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedItems.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>
                          {item.product.name}
                        </span>
                        {item.quantity > 1 && (
                          <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 700 }}>
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>
                        ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total Only */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderTop: '2px solid var(--border-color)',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Total
              </span>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#10b981' }}>
                ${selectedTotalPrice.toFixed(2)} USD
              </span>
            </div>

            {/* TELEGRAM ONLY: Chat via Telegram Order Summary */}
            <button
              type="button"
              onClick={handleChatViaTelegramOrderSummary}
              disabled={submitting || selectedItems.length === 0}
              className="btn-telegram"
              title="Open Telegram chat with Hong Saoleang with your order summary"
              style={{
                fontSize: '1.02rem',
                padding: '16px 20px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <TelegramIcon size={22} />
              <span>{submitting ? 'Connecting to Telegram...' : 'Chat via Telegram Order Summary'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
