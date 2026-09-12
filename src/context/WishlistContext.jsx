import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(undefined);
const STORAGE_KEY = 'blend-wishlist';

function loadWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadWishlist);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable — wishlist just won't persist across reloads
    }
  }, [items]);

  const isWishlisted = (id) => items.some((item) => item.id === id);

  const toggle = ({ id, name, image, price }) => {
    setItems((prev) =>
      prev.some((item) => item.id === id)
        ? prev.filter((item) => item.id !== id)
        : [...prev, { id, name, image, price }]
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const value = {
    items,
    isWishlisted,
    toggle,
    removeItem,
    wishlistCount: items.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
