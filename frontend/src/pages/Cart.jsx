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
  Check,
  User,
  MessageCircle,
  Phone
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

  const [guestName, setGuestName] = useState('');
  const [customerPhone, setCustomerPhone] = useState(() => user?.phone || '');
  const [guestContact, setGuestContact] = useState('');
  const [phoneError, setPhoneError] = useState(false);
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
    const customerName = user?.fullName || guestName.trim() || 'Guest Customer';
    const phone = (customerPhone || user?.phone || '').trim();
    const customerContactInfo = user?.email || guestContact.trim() || '';
    const orderId = order?.id;
    const formattedId = orderId ? `#JH-${String(orderId).padStart(4, '0')}` : '';
    const idText = formattedId;
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

    let msg = `👋 Hello JomnenhKh Support!\n`;
    msg += `Here is my Order Summary:\n\n`;
    if (idText) {
      msg += `📦 Order: ${idText}\n`;
    }
    msg += `👤 Customer: ${customerName}\n`;
    if (phone) {
      msg += `📞 Phone Number: ${phone}\n`;
    }
    if (customerContactInfo && customerContactInfo !== phone) {
      msg += `💬 Telegram/Contact: ${customerContactInfo}\n`;
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

  // Option 1: Direct Chat & Order with Store Owner (@hongsaoleang) - Available for both guests & signed in
  const handleChatWithOwner = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one product to order.');
      return;
    }

    const phoneToUse = (customerPhone || user?.phone || '').trim();
    if (!phoneToUse) {
      setPhoneError(true);
      alert('Please enter your Phone Number so the store owner can contact you and confirm your delivery.');
      return;
    }

    const itemsSnapshot = [...selectedItems];
    const totalSnapshot = selectedTotalPrice;
    const addressSnapshot = shippingAddress;
    const cleanTgChatId = telegramChatId ? telegramChatId.trim() : '';

    // Pre-create direct Telegram URL with JomnenhKh
    const directInitialMsg = buildTelegramMessage(null, itemsSnapshot, totalSnapshot, addressSnapshot);
    const ownerInitialUrl = `https://t.me/EcommerceMoneyBot?start=order`;

    // Open chat tab immediately to prevent popup blocker
    const tgWindow = window.open(ownerInitialUrl, '_blank', 'noopener,noreferrer');

    setSubmitting(true);
    try {
      const orderPayload = {
        shippingAddress: addressSnapshot,
        telegramChatId: cleanTgChatId || null,
        customerName: user?.fullName || guestName.trim() || 'Guest Customer',
        customerContact: cleanTgChatId || guestContact.trim() || user?.email || null,
        phoneNumber: phoneToUse,
        items: itemsSnapshot.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // Submit to backend to track stock and log order
      const res = await api.post('/api/orders', orderPayload);
      const createdOrder = res.data;

      if (createdOrder && (createdOrder.telegramLinkUrl || createdOrder.id)) {
        // Upgrade telegram link in open window with secure link token or created Order ID
        if (tgWindow && !tgWindow.closed) {
          tgWindow.location.href = createdOrder.telegramLinkUrl || `https://t.me/EcommerceMoneyBot?start=order_${createdOrder.id}`;
        }
        removeItemsFromCart(selectedIds);
        setOrderConfirmed(createdOrder);
      } else {
        removeItemsFromCart(selectedIds);
      }
    } catch (err) {
      console.warn('Backend order auto-sync notice:', err);
      // Even if backend fails, guest/user was connected to JomnenhKh bot
      removeItemsFromCart(selectedIds);
      setOrderConfirmed({
        id: 'JH-' + Date.now().toString().slice(-4),
        items: itemsSnapshot.map((it) => ({ product: it.product, quantity: it.quantity, unitPrice: it.product.price })),
        totalAmount: totalSnapshot,
        shippingAddress: addressSnapshot,
        customerName: user?.fullName || guestName.trim() || 'Guest Customer',
        phoneNumber: phoneToUse,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Option 2: Order & Track via Telegram Bot (@EcommerceMoneyBot) - Available for both guests & signed in
  const handleChatViaTelegramOrderSummary = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one product to order.');
      return;
    }

    const phoneToUse = (customerPhone || user?.phone || '').trim();
    if (!phoneToUse) {
      setPhoneError(true);
      alert('Please enter your Phone Number so the store owner can contact you and confirm your delivery.');
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
        customerName: user?.fullName || guestName.trim() || 'Guest Customer',
        customerContact: cleanTgChatId || guestContact.trim() || user?.email || null,
        phoneNumber: phoneToUse,
        items: itemsSnapshot.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      // Place order in backend (deducts stock, triggers @EcommerceMoneyBot notification)
      const res = await api.post('/api/orders', orderPayload);
      createdOrder = res.data;

      // Update opened Telegram tab to deep-link directly into the bot with their specific secure token or order ID
      if (createdOrder && tgWindow && !tgWindow.closed) {
        tgWindow.location.href = createdOrder.telegramLinkUrl || `https://t.me/EcommerceMoneyBot?start=order_${createdOrder.id}`;
      }

      // Remove only the ordered products from cart
      removeItemsFromCart(selectedIds);
      setOrderConfirmed(createdOrder);
    } catch (err) {
      console.warn('Backend order auto-sync notice:', err);
      // Fallback: direct to bot if error
      if (tgWindow && !tgWindow.closed) {
        tgWindow.location.href = `https://t.me/EcommerceMoneyBot`;
      }
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
  if (orderConfirmed) {
    const tgMessage = buildTelegramMessage(orderConfirmed);
    const orderFormattedId = orderConfirmed.id ? (String(orderConfirmed.id).startsWith('JH-') ? orderConfirmed.id : `JH-${String(orderConfirmed.id).padStart(4, '0')}`) : 'JH-0001';
    const telegramBotUrl = orderConfirmed.telegramLinkUrl || (orderConfirmed.id ? `https://t.me/EcommerceMoneyBot?start=order_${orderConfirmed.id}` : 'https://t.me/EcommerceMoneyBot');

    return (
      <div className="section-container checkout-success-view">
        <div className="success-card">
          <div className="success-icon-wrap">
            <CheckCircle size={48} className="text-emerald" />
          </div>
          <span className="badge badge-success mb-2">Order Confirmed &amp; Sent</span>
          <h1>Thank You for Your Order!</h1>
          <p className="order-number-text">
            Official Order ID: <strong>#{orderFormattedId}</strong>
          </p>

          {/* TELEGRAM BOT NOTIFICATION HUB */}
          <div className="telegram-confirmation-box" style={{ maxWidth: '520px', margin: '20px auto', textAlign: 'center' }}>
            {/* Primary Action: View in Telegram Bot */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(56, 189, 248, 0.1))',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '12px',
              padding: '18px 20px',
              marginBottom: '14px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                <TelegramIcon size={24} className="text-sky-400" />
                <h4 style={{ margin: 0, fontSize: '1.08rem', color: '#38bdf8', fontWeight: 700 }}>
                  Order Dispatched to JomnenhKh (@EcommerceMoneyBot)
                </h4>
              </div>
              <p style={{ margin: '0 0 14px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Your order #{orderFormattedId} was registered. Tap below to view your order receipt in Telegram:
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href={telegramBotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-telegram"
                  style={{ marginTop: 0, padding: '10px 20px', fontSize: '0.9rem', justifyContent: 'center', background: '#0284c7' }}
                >
                  <TelegramIcon size={18} /> Track Your Order on Telegram <ExternalLink size={14} />
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

            {/* Secondary Action: View in Telegram Bot */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              fontSize: '0.84rem'
            }}>
              <span style={{ color: 'var(--text-dim)' }}>Order tracking bot:</span>
              <a
                href={telegramBotUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#818cf8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
              >
                View in @EcommerceMoneyBot <ExternalLink size={12} />
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
            {user ? (
              <Link to="/settings" className="btn-secondary">
                View in Order History
              </Link>
            ) : (
              <Link to="/login" className="btn-secondary">
                Sign In to Save History
              </Link>
            )}
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

            {/* Customer Details & Delivery Info (No sign-in required) */}
            <div style={{
              margin: '14px 0',
              padding: '12px 14px',
              background: user ? 'rgba(99, 102, 241, 0.05)' : 'rgba(16, 185, 129, 0.05)',
              border: `1px solid ${user ? 'rgba(99, 102, 241, 0.25)' : 'rgba(16, 185, 129, 0.3)'}`,
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: user ? '#818cf8' : '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} /> {user ? `Signed in as ${user.fullName || user.email}` : 'Guest Checkout (No sign-in required)'}
                </span>
                {!user && (
                  <Link to="/login" style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'none' }}>
                    Have an account?
                  </Link>
                )}
              </div>

              {!user && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>
                      Your Name:
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Guest Customer"
                      className="form-control"
                      style={{
                        width: '100%',
                        fontSize: '0.8rem',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>
                      Telegram @username (Optional):
                    </label>
                    <input
                      type="text"
                      value={guestContact}
                      onChange={(e) => setGuestContact(e.target.value)}
                      placeholder="e.g. @username"
                      className="form-control"
                      style={{
                        width: '100%',
                        fontSize: '0.8rem',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-main)',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Required Phone Number Field */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{
                  fontSize: '0.74rem',
                  color: phoneError ? '#ef4444' : 'var(--text-dim)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginBottom: '3px'
                }}>
                  <Phone size={13} className={phoneError ? 'text-red-400' : 'text-sky-400'} />
                  <span>Phone Number *</span>
                  <span style={{ fontSize: '0.68rem', color: phoneError ? '#ef4444' : '#10b981', fontWeight: 500 }}>
                    {phoneError ? '(Required to order & chat)' : '(Required for delivery confirmation)'}
                  </span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (phoneError && e.target.value.trim()) setPhoneError(false);
                  }}
                  placeholder="e.g. 012 345 678 or +855 12 345 678"
                  className="form-control"
                  style={{
                    width: '100%',
                    fontSize: '0.82rem',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: phoneError ? '2px solid #ef4444' : '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    boxSizing: 'border-box'
                  }}
                />
                {phoneError && (
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#ef4444', marginTop: '2px', fontWeight: 600 }}>
                    ⚠️ Please input your phone number so the owner can contact you.
                  </span>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>
                  Delivery Address / Location:
                </label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street / City / Phnom Penh, Cambodia"
                  className="form-control"
                  style={{
                    width: '100%',
                    fontSize: '0.8rem',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Optional Telegram Bot Notification */}
            <div className="cart-telegram-chat-config" style={{
              margin: '12px 0 16px',
              padding: '10px 14px',
              background: 'rgba(56, 189, 248, 0.04)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 600, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <TelegramIcon size={14} /> Telegram Chat ID (Optional)
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
                  fontSize: '0.8rem',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Total Only */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0',
                borderTop: '2px solid var(--border-color)',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Total
              </span>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#10b981' }}>
                ${selectedTotalPrice.toFixed(2)} USD
              </span>
            </div>

            {/* ORDER OPTION 1: Chat & Order with JomnenhKh */}
            <button
              type="button"
              onClick={handleChatWithOwner}
              disabled={submitting || selectedItems.length === 0}
              className="btn-telegram"
              title="Directly chat and place order with JomnenhKh on Telegram"
              style={{
                fontSize: '0.98rem',
                fontWeight: 700,
                padding: '13px 18px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                marginBottom: '10px',
                borderRadius: '10px',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <TelegramIcon size={20} />
              <span>{submitting ? 'Connecting...' : 'Chat & Order via JomnenhKh'}</span>
            </button>

            {/* ORDER OPTION 2: Submit & Track via Telegram Bot */}
            <button
              type="button"
              onClick={handleChatViaTelegramOrderSummary}
              disabled={submitting || selectedItems.length === 0}
              className="btn-secondary"
              title="Submit order directly and view receipt in Telegram Bot @EcommerceMoneyBot"
              style={{
                fontSize: '0.86rem',
                fontWeight: 600,
                padding: '11px 16px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '10px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.08)',
                cursor: 'pointer'
              }}
            >
              <TelegramIcon size={16} />
              <span>{submitting ? 'Placing Order...' : 'Order & Track via Bot (@EcommerceMoneyBot)'}</span>
            </button>

            <p style={{
              margin: '12px 0 0',
              fontSize: '0.74rem',
              color: 'var(--text-dim)',
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              ✓ No sign-in required. Chat with owner anytime for custom deals or queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
