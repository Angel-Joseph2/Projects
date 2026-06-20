import React from 'react';
import { useApp } from '../context/AppContext';

export const CartDrawer = () => {
  const {
    cart,
    cartSubtotal,
    cartDrawerOpen,
    setCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    showToast,
    setQuickViewProduct
  } = useApp();

  const handleItemClick = (product) => {
    setCartDrawerOpen(false);
    setQuickViewProduct(product);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty.');
      return;
    }
    showToast('Processing order... Thank you for shopping at LUXE!');
    clearCart();
    setCartDrawerOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`drawer-overlay ${cartDrawerOpen ? 'open' : ''}`}
        onClick={() => setCartDrawerOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div className={`cart-drawer ${cartDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Your Shopping Cart</h3>
          <button className="drawer-close" onClick={() => setCartDrawerOpen(false)}>
            <i className="fa fa-times"></i>
          </button>
        </div>

        <div className="drawer-content">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <i className="fa fa-shopping-bag empty-cart-icon"></i>
              <p>Your cart is empty.</p>
              <button className="btn-primary" onClick={() => setCartDrawerOpen(false)}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.product.id} className="cart-drawer-item">
                  <div
                    className="cart-item-preview"
                    style={item.product.image ? { cursor: 'pointer' } : { background: item.product.bgGradient, cursor: 'pointer' }}
                    onClick={() => handleItemClick(item.product)}
                  >
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className={`fa ${item.product.iconClass}`}></i>
                    )}
                  </div>
                  <div className="cart-item-info">
                    <h4 
                      onClick={() => handleItemClick(item.product)} 
                      style={{ cursor: 'pointer' }}
                    >
                      {item.product.name}
                    </h4>
                    <p className="cart-item-price">${item.product.price}</p>
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >
                        <i className="fa fa-minus"></i>
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="item-remove-btn"
                    aria-label="Remove item"
                  >
                    <i className="fa fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>Subtotal:</span>
              <strong className="subtotal-price">${cartSubtotal}</strong>
            </div>
            <div className="drawer-footer-actions">
              <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                Checkout Now
              </button>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
