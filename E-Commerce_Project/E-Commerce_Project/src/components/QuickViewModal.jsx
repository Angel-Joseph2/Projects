import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useApp();

  // Handle locking body scroll when modal is active
  useEffect(() => {
    if (quickViewProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Close modal on Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setQuickViewProduct(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  return (
    <div className="modal-overlay open" onClick={() => setQuickViewProduct(null)}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setQuickViewProduct(null)} aria-label="Close modal">
          <i className="fa fa-times"></i>
        </button>
        <div className="modal-body">
          <div className="modal-img" style={quickViewProduct.image ? {} : { background: quickViewProduct.bgGradient }}>
            {quickViewProduct.image ? (
              <img src={quickViewProduct.image} alt={quickViewProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <i className={`fa ${quickViewProduct.iconClass}`}></i>
            )}
          </div>
          <div className="modal-info">
            <h3>{quickViewProduct.name}</h3>
            <p className="modal-price">${quickViewProduct.price}</p>
            <p>{quickViewProduct.description}</p>
            <button
              className="btn-primary"
              onClick={() => {
                addToCart(quickViewProduct);
                setQuickViewProduct(null);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
