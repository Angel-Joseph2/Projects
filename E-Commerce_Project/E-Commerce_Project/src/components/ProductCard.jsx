import React from 'react';
import { useApp } from '../context/AppContext';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, setQuickViewProduct } = useApp();

  const wish = isWishlisted(product.id);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fa fa-star"></i>);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<i key={i} className="fa fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star" style={{ opacity: 0.5 }}></i>);
      }
    }
    return stars;
  };

  return (
    <div className="product-card" data-category={product.category}>
      <div 
        className="product-img" 
        style={product.image ? { cursor: 'pointer' } : { background: product.bgGradient, cursor: 'pointer' }}
        onClick={() => setQuickViewProduct(product)}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <i className={`fa ${product.iconClass}`}></i>
        )}
        <div className="product-actions">
          <button
            className="prod-action"
            onClick={() => toggleWishlist(product.id)}
            aria-label="Wishlist"
            style={{ color: wish ? '#e84545' : 'inherit' }}
          >
            <i className={wish ? 'fas fa-heart' : 'fa fa-heart'}></i>
          </button>
          <button
            className="prod-action"
            onClick={() => setQuickViewProduct(product)}
            aria-label="Quick view"
          >
            <i className="fa fa-eye"></i>
          </button>
        </div>
        {product.badge && (
          <span className={`product-badge ${product.badge.includes('%') || product.badge.includes('−') ? 'sale-badge' : ''}`}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="product-info">
        <p className="product-cat">{product.category}</p>
        <h4 className="product-name">{product.name}</h4>
        <div className="product-rating">
          {renderStars(product.rating)}
          <span>({product.reviews})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">
            ${product.price}
            {product.oldPrice && <del>${product.oldPrice}</del>}
          </span>
          <button className="btn-cart" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
