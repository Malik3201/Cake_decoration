import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'db_cart';

// Helper to get consistent product ID
const getProductId = (product) => product._id || product.id;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        // ignore parse errors
      }
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = product => {
    const productId = getProductId(product);
    setItems(prev => {
      const existing = prev.find(i => getProductId(i) === productId);
      if (existing) {
        return prev.map(i =>
          getProductId(i) === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Store with _id for consistency with backend
      return [...prev, { ...product, _id: productId, quantity: 1 }];
    });
  };

  const updateQuantity = (id, qty) => {
    setItems(prev =>
      prev
        .map(i => (getProductId(i) === id ? { ...i, quantity: Math.max(1, qty) } : i))
        .filter(i => i.quantity > 0)
    );
  };

  const removeFromCart = id => {
    setItems(prev => prev.filter(i => getProductId(i) !== id));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.salePrice ?? item.price;
      return sum + price * item.quantity;
    }, 0);
    return { subtotal };
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totals,
    }),
    [items, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
