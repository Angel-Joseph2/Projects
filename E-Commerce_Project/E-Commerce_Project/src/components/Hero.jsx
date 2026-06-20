import React from 'react';

export const Hero = () => {
  return (
    <section id="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">New Season · 2025 Collection</p>
        <h1 className="hero-headline">
          Style is<br />
          <em>what you wear</em><br />
          when you arrive.
        </h1>
        <p className="hero-sub">Discover curated fashion, electronics, and lifestyle essentials — all in one place.</p>
        <div className="hero-ctas">
          <a href="#featured" className="btn-primary">Shop Now</a>
          <a href="#categories" className="btn-ghost">Browse Categories</a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">50K+</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat">
            <span className="stat-num">4.9★</span>
            <span className="stat-label">Rating</span>
          </div>
          <div className="stat">
            <span className="stat-num">Free</span>
            <span className="stat-label">Shipping $50+</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-card card-1">
          <div className="hero-card-img">
            <img src="/images/wool_coat_1781936631647.png" alt="Merino Wool Coat" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="hero-card-info">
            <span>Merino Wool Coat</span>
            <strong>$345</strong>
          </div>
        </div>
        <div className="hero-card card-2">
          <div className="hero-card-img">
            <img src="/images/headphones_1781936619495.png" alt="Noise-Cancelling Headphones" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="hero-card-info">
            <span>Noise-Cancelling Headphones</span>
            <strong>$249</strong>
          </div>
        </div>
        <div className="hero-card card-3">
          <div className="hero-card-img">
            <img src="/images/japandi_chair_1781936642841.png" alt="Japandi Lounge Chair" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="hero-card-info">
            <span>Japandi Lounge Chair</span>
            <strong>$599</strong>
          </div>
        </div>
        <div className="hero-badge">
          <span>UP TO</span>
          <strong>40%</strong>
          <span>OFF</span>
        </div>
      </div>
    </section>
  );
};
