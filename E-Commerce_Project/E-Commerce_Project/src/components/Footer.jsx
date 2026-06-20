import React from 'react';

export const Footer = () => {
  return (
    <footer id="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a href="#" className="footer-logo">LUXE</a>
          <p>Modern shopping for modern lives. Curated products, effortless delivery, genuine care.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="Pinterest"><i className="fab fa-pinterest-p"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#hero">Home</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#featured">Products</a></li>
            <li><a href="#offers">Deals</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Customer Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Track Order</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">Size Guide</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul>
            <li><i className="fa fa-envelope"></i> hello@luxe.shop</li>
            <li><i className="fa fa-phone"></i> +1 (800) 555-LUXE</li>
            <li><i className="fa fa-map-marker-alt"></i> 42 Design St, NY</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 LUXE. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};
