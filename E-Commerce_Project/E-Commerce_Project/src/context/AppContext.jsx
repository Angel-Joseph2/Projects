import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedDark = localStorage.getItem('luxe-dark');
    return savedDark === 'true' ? 'dark' : 'light';
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('luxe-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('luxe-wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Quick view state
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Active filter state
  const [activeFilter, setActiveFilter] = useState('all');

  // Cart Drawer open state
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Apply theme to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-dark', '');
      localStorage.setItem('luxe-dark', 'true');
    } else {
      document.documentElement.removeAttribute('data-dark');
      localStorage.setItem('luxe-dark', 'false');
    }
  }, [theme]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('luxe-cart', JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('luxe-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast(theme === 'light' ? 'Switched to Dark Mode!' : 'Switched to Light Mode!');
  };

  const showToast = (message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    const item = cart.find(i => i.product.id === productId);
    setCart(prev => prev.filter(item => item.product.id !== productId));
    if (item) {
      showToast(`${item.product.name} removed from cart.`);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    showToast('Cart cleared.');
  };

  const toggleWishlist = (productId) => {
    const isWish = wishlist.includes(productId);
    if (isWish) {
      setWishlist(prev => prev.filter(id => id !== productId));
      showToast('Removed from wishlist.');
    } else {
      setWishlist(prev => [...prev, productId]);
      showToast('Added to wishlist!');
    }
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Derive cart totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        wishlist,
        toggleWishlist,
        isWishlisted,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        cartDrawerOpen,
        setCartDrawerOpen,
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
