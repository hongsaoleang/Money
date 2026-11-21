import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, X, Check, MessageSquare, ExternalLink } from 'lucide-react';

const TelegramIcon = ({ size = 18 }) => (
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

const ProductTelegramSelectionBar = ({ selectedProducts = [], onClear, onAddToCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!selectedProducts || selectedProducts.length === 0) return null;

  const totalAmount = selectedProducts.reduce(
    (acc, p) => acc + parseFloat(p.price || 0),
    0
  );

  const handleContactTelegram = () => {
    let msg = `👋 Hello JomnenhKh Support!\n`;
    msg += `👤 Customer: ${user ? (user.fullName || user.email) : 'Guest Customer'}\n`;
    msg += `I have selected the following product(s) on your store and would like to contact you:\n\n`;

    selectedProducts.forEach((p, idx) => {
      msg += `📦 ${idx + 1}. ${p.name}\n`;
      msg += `   • Price: $${parseFloat(p.price).toFixed(2)} USD\n`;
      msg += `   • Stock: ${p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : 'Backorder'}\n`;
      if (p.originCountry) {
        msg += `   • Origin: ${p.originCountry}\n`;
      }
    });

    msg += `\n💰 Total: $${totalAmount.toFixed(2)} USD\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Please let me know availability and how to proceed with my order. Thank you!`;

    const url = `https://t.me/EcommerceMoneyBot?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="floating-telegram-bar-wrap">
      <div className="floating-telegram-selection-bar">
        {/* Left: Selected count & items preview */}
        <div className="selection-bar-info">
          <div className="selection-count-pill">
            <Check size={14} className="text-emerald" />
            <span>{selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected</span>
          </div>

          <div className="selection-thumbs-row">
            {selectedProducts.slice(0, 4).map((p) => (
              <img
                key={p.id}
                src={p.imageUrl}
                alt={p.name}
                className="selection-mini-thumb"
                title={p.name}
              />
            ))}
            {selectedProducts.length > 4 && (
              <span className="selection-more-badge">+{selectedProducts.length - 4}</span>
            )}
          </div>

          <div className="selection-total-wrap">
            <span className="selection-total-label">Subtotal:</span>
            <span className="selection-total-num">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="selection-bar-actions">
          <button
            onClick={handleContactTelegram}
            className="btn-telegram-compact"
            title="Open Telegram chat with Hong Saoleang with selected products"
          >
            <TelegramIcon size={17} />
            <span>Chat on Telegram</span>
            <ExternalLink size={13} />
          </button>

          {onAddToCart && (
            <button
              onClick={() => onAddToCart(selectedProducts)}
              className="btn-secondary-compact"
              title="Add all selected products to shopping cart"
            >
              <ShoppingBag size={15} />
              <span>Add to Cart</span>
            </button>
          )}

          <button
            onClick={onClear}
            className="btn-clear-selection"
            title="Deselect all cards"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductTelegramSelectionBar;
