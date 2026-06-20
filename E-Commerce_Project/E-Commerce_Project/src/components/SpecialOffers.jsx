import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const SpecialOffers = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const { setActiveFilter } = useApp();

  const handleOfferClick = (e, categoryId) => {
    e.preventDefault();
    setActiveFilter(categoryId);
    const featuredSection = document.getElementById('featured');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);

      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const pad = (n) => String(Math.max(0, n)).padStart(2, '0');

      setTimeLeft({
        hours: pad(Math.floor(diff / 3_600_000)),
        minutes: pad(Math.floor((diff % 3_600_000) / 60_000)),
        seconds: pad(Math.floor((diff % 60_000) / 1_000))
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="offers" className="section">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Limited Time</p>
          <h2 className="section-title">Special Offers</h2>
        </div>
        <div className="offers-grid">
          {/* Flash Sale Card */}
          <div className="offer-card offer-flash">
            <div className="offer-content">
              <span className="offer-label">
                <i className="fa fa-bolt"></i> Flash Sale
              </span>
              <h3>Electronics<br />Up to 40% Off</h3>
              <p>Today only — ends midnight</p>
              <a href="#featured" className="btn-primary" onClick={(e) => handleOfferClick(e, 'electronics')}>Shop Electronics</a>
            </div>
            <div className="offer-countdown" id="countdown">
              <div className="cd-block">
                <span>{timeLeft.hours}</span>
                <small>Hours</small>
              </div>
              <div className="cd-sep">:</div>
              <div className="cd-block">
                <span>{timeLeft.minutes}</span>
                <small>Mins</small>
              </div>
              <div className="cd-sep">:</div>
              <div className="cd-block">
                <span>{timeLeft.seconds}</span>
                <small>Secs</small>
              </div>
            </div>
          </div>

          {/* Seasonal Sale Card */}
          <div className="offer-card offer-seasonal">
            <div className="offer-content">
              <span className="offer-label">Summer Edit</span>
              <h3>Fashion<br />New In</h3>
              <p>200+ fresh styles added</p>
              <a href="#featured" className="btn-ghost-light" onClick={(e) => handleOfferClick(e, 'fashion')}>Browse Fashion</a>
            </div>
          </div>

          {/* Bundle Sale Card */}
          <div className="offer-card offer-bundle">
            <div className="offer-content">
              <span className="offer-label">Bundle Deal</span>
              <h3>Home Starter<br />Kit — $299</h3>
              <p>Worth $480 individually</p>
              <a href="#featured" className="btn-ghost-light" onClick={(e) => handleOfferClick(e, 'home')}>Get Bundle</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
