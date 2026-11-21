import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `cart_${user.id || user.email}` : 'cart_guest';

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
      // Legacy fallback: check un-prefixed cart
      const legacy = localStorage.getItem('cart');
      if (legacy) {
        localStorage.removeItem('cart');
        return JSON.parse(legacy);
      }
      return [];
    } catch {
      return [];
    }
  });

  // Keep cart in sync with active user session (merges guest cart on login)
  useEffect(() => {
    try {
      if (user) {
        const guestCart = localStorage.getItem('cart_guest');
        if (guestCart) {
          try {
            const guestItems = JSON.parse(guestCart);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              const userSaved = localStorage.getItem(storageKey);
              const userItems = userSaved ? JSON.parse(userSaved) : [];
              guestItems.forEach((gItem) => {
                const match = userItems.find((u) => u.product.id === gItem.product.id);
                if (match) {
                  match.quantity += gItem.quantity;
                } else {
                  userItems.push(gItem);
                }
              });
              localStorage.setItem(storageKey, JSON.stringify(userItems));
              localStorage.removeItem('cart_guest');
              setCartItems(userItems);
              return;
            }
          } catch {}
        }
      }

      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCartItems(JSON.parse(saved));
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    }
  }, [user?.id, user?.email, storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    } catch {}
  }, [cartItems, storageKey]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    return true;
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const removeItemsFromCart = (productIds) => {
    const idSet = new Set(productIds);
    setCartItems((prev) => prev.filter((item) => !idSet.has(item.product.id)));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * parseFloat(item.product?.price || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        removeItemsFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
