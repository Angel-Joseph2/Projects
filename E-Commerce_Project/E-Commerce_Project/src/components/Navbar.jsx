import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    cartCount,
    setCartDrawerOpen,
    searchQuery,
    setSearchQuery,
    setActiveFilter,
    showToast
  } = useApp();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setActiveFilter('all');
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll height to make navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmed = searchQuery.trim();
      if (trimmed) {
        showToast(`Searching for "${trimmed}"…`);
      }
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
      <div className="nav-container">
        <a href="#" className="nav-logo" onClick={closeMobileMenu}>LUXE</a>

        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} id="nav-links">
          <li><a href="#hero" onClick={closeMobileMenu}>Home</a></li>
          <li><a href="#categories" onClick={closeMobileMenu}>Categories</a></li>
          <li><a href="#featured" onClick={closeMobileMenu}>Deals</a></li>
          <li><a href="#testimonials" onClick={closeMobileMenu}>About</a></li>
          <li><a href="#newsletter" onClick={closeMobileMenu}>Contact</a></li>
        </ul>

        <div className="nav-actions">
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search products…"
              className="search-input"
              id="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
            <button className="search-btn" aria-label="Search">
              <i className="fa fa-search"></i>
            </button>
          </div>
          <button
            className="icon-btn"
            id="dark-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <i className={theme === 'dark' ? 'fa fa-sun' : 'fa fa-moon'}></i>
          </button>
          <button
            className="icon-btn cart-btn"
            onClick={() => setCartDrawerOpen(true)}
            aria-label="Cart"
          >
            <i className="fa fa-shopping-bag"></i>
            <span className="cart-count" id="cart-count">{cartCount}</span>
          </button>
          <button
            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
            id="hamburger"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};
