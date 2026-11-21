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
  ExternalLink,
  Copy,
  Check
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
  const [telegramChatId, setTelegramChatId] = useState(
    () => user?.telegramChatId || localStorage.getItem('user_tg_chat_id') || ''
  );
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  // Validate cart items against live catalog to prune old deleted items
  useEffect(() => {
    api.get('/api/products')
      .then((res) => {
        const liveProducts = res.data || [];
        const liveIds = new Set(liveProducts.map((p) => p.id));
        const deadIds = cartItems
          .filter((item) => !liveIds.has(item.product.id))
          .map((item) => item.product.id);
        if (deadIds.length > 0) {
          removeItemsFromCart(deadIds);
        }
      })
      .catch((err) => console.warn('Cart product validation notice:', err));
  }, []);

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

  // Construct message for direct Telegram chat with Hong Saoleang (@hongsaoleang)
  const buildTelegramMessage = (order = null, fallbackItems = selectedItems, fallbackTotal = selectedTotalPrice, fallbackAddress = shippingAddress) => {
    const customerName = user?.fullName || 'Customer';
    const customerEmail = user?.email || '';
    const orderId = order?.id;
    const idText = orderId ? `#${orderId}` : '';
    const destination = order?.shippingAddress || fallbackAddress || '';

    // If order has items from backend response, use them; otherwise use fallback
    const itemsList = order?.items && order.items.length > 0
      ? order.items.map((it) => ({
          name: it.product?.name || `Product #${it.product?.id}`,
          quantity: it.quantity,
          price: parseFloat(it.unitPrice || it.product?.price || 0),
        }))
      : fallbackItems.map((it) => ({
          name: it.product.name,
          quantity: it.quantity,
          price: parseFloat(it.product.price || 0),
        }));

    const total = order?.totalAmount != null
      ? parseFloat(order.totalAmount)
      : fallbackTotal;

    let msg = `👋 Hello Hong Saoleang (@hongsaoleang)!\n`;
    msg += `Here is my Order Summary:\n\n`;
    if (idText) {
      msg += `📦 Order: ${idText}\n`;
    }
    if (customerName && customerName !== 'Customer') {
      msg += `👤 Customer: ${customerName}${customerEmail ? ` (${customerEmail})` : ''}\n`;
    }
    if (destination) {
      msg += `📍 Destination: ${destination}\n\n`;
    }
    msg += `🛒 Products Added (${itemsList.length} item${itemsList.length > 1 ? 's' : ''}):\n`;

    itemsList.forEach((it, idx) => {
      const itemSubtotal = (it.quantity * it.price).toFixed(2);
      msg += `  ${idx + 1}. ${it.name}\n`;
      msg += `     • Qty: ${it.quantity} unit(s) @ $${it.price.toFixed(2)}\n`;
      msg += `     • Subtotal: $${itemSubtotal}\n`;
    });

    msg += `\n💰 Total: $${total.toFixed(2)} USD\n`;
    msg += `------------------------------------\n`;
    msg += `Please confirm my order and let me know the payment details. Thank you!`;

    return msg;
  };

  // Chat via Telegram Order Summary (Submits order, alerts Telegram bot @EcommerceMoneyBot, opens bot for user)
  const handleChatViaTelegramOrderSummary = async () => {
    if (!user) {
      navigate('/login', {
        state: {
          message: 'Please sign in to place orders or send messages via Telegram.',
        },
      });
      return;
    }

    if (selectedItems.length === 0) {
      alert('Please select at least one product to order.');
      return;
    }

    const itemsSnapshot = [...selectedItems];
    const totalSnapshot = selectedTotalPrice;
    const addressSnapshot = shippingAddress;
    const cleanTgChatId = telegramChatId ? telegramChatId.trim() : '';

    if (cleanTgChatId) {
      localStorage.setItem('user_tg_chat_id', cleanTgChatId);
    }

    // Pre-open Telegram bot tab to prevent browser async popup block
    const botInitialUrl = 'https://t.me/EcommerceMoneyBot';
    const tgWindow = window.open(botInitialUrl, '_blank', 'noopener,noreferrer');

    setSubmitting(true);
    let createdOrder = null;
    try {
      const orderPayload = {
        shippingAddress: addressSnapshot,
        telegramChatId: cleanTgChatId || null,
        items: itemsSnapshot.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // Place order in backend (deducts stock, triggers @EcommerceMoneyBot notification to user and admin)
      const res = await api.post('/api/orders', orderPayload);
      createdOrder = res.data;

      // Update opened Telegram tab to deep-link directly into the bot with their specific order ID
      if (createdOrder && createdOrder.id && tgWindow && !tgWindow.closed) {
        tgWindow.location.href = `https://t.me/EcommerceMoneyBot?start=order_${createdOrder.id}`;
      }

      // Remove only the ordered products from cart
      removeItemsFromCart(selectedIds);
      setOrderConfirmed(createdOrder);
    } catch (err) {
      console.warn('Backend order auto-sync notice:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyReceipt = (textToCopy) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2400);
  };

  // ==========================================
  // CONFIRMATION SUCCESS VIEW
  // ==========================================
  if (!user) {
    return (
      <div className="section-container text-center" style={{ padding: '80px 20px', minHeight: '50vh' }}>
        <div className="settings-empty-orders-card max-w-md mx-auto">
          <div className="empty-orders-icon-wrap" style={{ margin: '0 auto 16px' }}>
            <ShoppingBag size={38} className="text-indigo-400" />
          </div>
          <h3>Authentication Required</h3>
          <p>Please sign in to access your shopping cart and place orders.</p>
          <Link to="/login" state={{ message: 'Please sign in to access your shopping cart.' }} className="btn-primary mt-4">
            Sign In to Your Account
          </Link>
        </div>
      </div>
    );
  }

  if (orderConfirmed) {
    const tgMessage = buildTelegramMessage(orderConfirmed);
    const telegramOwnerUrl = `https://t.me/hongsaoleang?text=${encodeURIComponent(tgMessage)}`;
    const telegramBotUrl = `https://t.me/EcommerceMoneyBot?start=order_${orderConfirmed.id}`;

    return (
      <div className="section-container checkout-success-view">
        <div className="success-card">
          <div className="success-icon-wrap">
            <CheckCircle size={48} className="text-emerald" />
          </div>
          <span className="badge badge-success mb-2">Order Confirmed &amp; Sent</span>
          <h1>Thank You for Your Order!</h1>
          <p className="order-number-text">
            Official Order ID: <strong>#{orderConfirmed.id}</strong>
          </p>

          {/* TELEGRAM BOT & OWNER NOTIFICATION HUB */}
          <div className="telegram-confirmation-box" style={{ maxWidth: '520px', margin: '20px auto', textAlign: 'center' }}>
            {/* Primary Telegram Bot Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(99, 102, 241, 0.1))',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                <TelegramIcon size={24} className="text-sky-400" />
                <h4 style={{ margin: 0, fontSize: '1.08rem', color: '#38bdf8', fontWeight: 700 }}>
                  Order Sent to Telegram Bot (@EcommerceMoneyBot)
                </h4>
              </div>
              <p style={{ margin: '0 0 14px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Your order #<strong>{orderConfirmed.id}</strong> was registered. Tap below to see your order receipt in Telegram:
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={telegramBotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-telegram"
                  style={{ marginTop: 0, padding: '10px 18px', fontSize: '0.88rem', justifyContent: 'center' }}
                >
                  <TelegramIcon size={18} /> View in Telegram Bot <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopyReceipt(tgMessage)}
                  className="btn-secondary"
                  style={{ padding: '10px 14px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {copiedReceipt ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                  <span>{copiedReceipt ? 'Receipt Copied!' : 'Copy Summary'}</span>
                </button>
              </div>
            </div>

            {/* Direct Chat with Store Owner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              fontSize: '0.82rem'
            }}>
              <span style={{ color: 'var(--text-dim)' }}>Need personal help with order #{orderConfirmed.id}?</span>
              <a
                href={telegramOwnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38bdf8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                Chat @hongsaoleang <ExternalLink size={12} />
              </a>
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
          <h1 className="page-title" style={{ margin: 0 }}>Shopping Cart</h1>
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

            {/* Telegram Bot Notification Option */}
            <div className="cart-telegram-chat-config" style={{
              margin: '16px 0',
              padding: '12px 14px',
              background: 'rgba(56, 189, 248, 0.05)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <TelegramIcon size={15} /> Your Telegram Chat ID
                </label>
                <a
                  href="https://t.me/EcommerceMoneyBot"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                  title="Open @EcommerceMoneyBot to get your Chat ID"
                >
                  Get Chat ID <ExternalLink size={10} />
                </a>
              </div>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="e.g. 1263944701 or @username"
                className="form-control"
                style={{
                  width: '100%',
                  fontSize: '0.82rem',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Enter your Telegram ID to receive your order receipt directly via <strong>@EcommerceMoneyBot</strong>.
              </span>
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

            {/* Primary Order Action: Submits & Dispatches to Telegram Bot */}
            <button
              type="button"
              onClick={handleChatViaTelegramOrderSummary}
              disabled={submitting || selectedItems.length === 0}
              className="btn-telegram"
              title="Click to place order and see your order in Telegram Bot @EcommerceMoneyBot"
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
              <span>{submitting ? 'Placing Order...' : 'Order Now & View in Telegram Bot'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
