import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(() => {
    return localStorage.getItem('luxe-newsletter-subscribed') === 'true';
  });
  const { showToast } = useApp();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      localStorage.setItem('luxe-newsletter-subscribed', 'true');
      localStorage.setItem('luxe-newsletter-email', email);
      setSubmitted(true);
      showToast('Successfully subscribed!');
    }
  };

  return (
    <section id="newsletter" className="section newsletter-section">
      <div className="container newsletter-inner">
        <div className="newsletter-text">
          <p className="section-eyebrow">Stay in the Loop</p>
          <h2>Get Early Access to<br /><em>Deals & Drops</em></h2>
          <p className="newsletter-sub">Join 80,000+ subscribers. No spam — ever.</p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          {!submitted ? (
            <div className="newsletter-input-group">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="nl-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn-primary">Subscribe</button>
            </div>
          ) : (
            <div className="newsletter-success" id="nl-success">
              <i className="fa fa-check-circle"></i> You're in! Check your inbox.
            </div>
          )}
          <p className="newsletter-note">By subscribing you agree to our Privacy Policy.</p>
        </form>
      </div>
    </section>
  );
};
