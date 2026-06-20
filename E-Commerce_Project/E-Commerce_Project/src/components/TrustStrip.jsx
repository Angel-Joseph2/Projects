import React from 'react';

export const TrustStrip = () => {
  return (
    <div className="trust-strip">
      <div className="container trust-grid">
        <div className="trust-item">
          <i className="fa fa-shipping-fast"></i>
          <div>
            <strong>Free Shipping</strong>
            <span>On orders over $50</span>
          </div>
        </div>
        <div className="trust-item">
          <i className="fa fa-undo-alt"></i>
          <div>
            <strong>Easy Returns</strong>
            <span>30-day return policy</span>
          </div>
        </div>
        <div className="trust-item">
          <i className="fa fa-lock"></i>
          <div>
            <strong>Secure Payment</strong>
            <span>256-bit SSL encryption</span>
          </div>
        </div>
        <div className="trust-item">
          <i className="fa fa-headset"></i>
          <div>
            <strong>24/7 Support</strong>
            <span>Chat, email, or phone</span>
          </div>
        </div>
      </div>
    </div>
  );
};
