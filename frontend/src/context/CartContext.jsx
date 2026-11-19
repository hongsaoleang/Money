import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `cart_${user.id || user.email}` : null;

  const [cartItems, setCartItems] = useState(() => {
    if (!user || !storageKey) return [];
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

  // Keep cart in sync with active user session
  useEffect(() => {
    if (!user || !storageKey) {
      setCartItems([]);
      return;
    }
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCartItems(JSON.parse(saved));
      } else {
        const legacy = localStorage.getItem('cart');
        if (legacy) {
          localStorage.removeItem('cart');
          setCartItems(JSON.parse(legacy));
        } else {
          setCartItems([]);
        }
      }
    } catch {
      setCartItems([]);
    }
  }, [user?.id, user?.email, storageKey]);

  useEffect(() => {
    if (user && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(cartItems));
    }
  }, [cartItems, user, storageKey]);

  const addToCart = (product, quantity = 1) => {
    // Only registered and logged-in customers can hold items in cart
    if (!user) {
      return false;
    }

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
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  };

  const totalItems = user ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const totalPrice = user
    ? cartItems.reduce(
        (acc, item) => acc + item.quantity * parseFloat(item.product.price),
        0
      )
    : 0;

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
