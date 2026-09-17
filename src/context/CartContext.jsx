import { createContext, useContext, useEffect, useState } from 'react';
import { fetchValidProductIds } from '../data/fetchProducts';

const CartContext = createContext(undefined);
const STORAGE_KEY = 'blend-cart';

function buildItemKey(productId, variants) {
  if (!variants || Object.keys(variants).length === 0) return productId;
  const sortedEntries = Object.entries(variants).sort(([a], [b]) => a.localeCompare(b));
  return `${productId}::${JSON.stringify(sortedEntries)}`;
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [lastAddedAt, setLastAddedAt] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable — cart just won't persist across reloads
    }
  }, [items]);

  // If the admin deletes or archives a product after it was added to a
  // cart, drop it here too — otherwise it sits there until checkout
  // rejects it. Only prune on a successful fetch; never wipe the cart
  // because of a network error.
  useEffect(() => {
    fetchValidProductIds()
      .then((validIds) => {
        setItems((prev) => prev.filter((item) => validIds.has(item.productId)));
      })
      .catch(() => {});
  }, []);

  const addItem = ({ id, name, image, price, variants }, quantity = 1) => {
    const key = buildItemKey(id, variants);
    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { key, productId: id, name, image, price, variants: variants || null, quantity }];
    });
    setLastAddedAt(Date.now());
  };

  const removeItem = (key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity <= 0) {
      removeItem(key);
      return;
    }
    setItems((prev) => prev.map((item) => (item.key === key ? { ...item, quantity } : item)));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    lastAddedAt,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
