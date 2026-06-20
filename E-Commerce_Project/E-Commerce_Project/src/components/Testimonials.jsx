import React from 'react';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Happy Customers</p>
          <h2 className="section-title">What People Are Saying</h2>
        </div>
        <div className="testimonials-grid">
          {/* Card 1 */}
          <div className="testimonial-card">
            <div className="t-avatar" style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
              S
            </div>
            <div className="t-stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
            </div>
            <p className="t-text">
              "The quality of the merino coat blew me away. Arrived in two days, packaging was beautiful, and it fits perfectly."
            </p>
            <div className="t-name">
              Sophia M. <span>Fashion buyer, London</span>
            </div>
          </div>

          {/* Card 2 (Featured) */}
          <div className="testimonial-card t-featured">
            <div className="t-avatar" style={{ background: 'linear-gradient(135deg,#f5a623,#e08a00)' }}>
              A
            </div>
            <div className="t-stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
            </div>
            <p className="t-text">
              "I've ordered from a dozen online stores and LUXE is the only one I come back to every time. The curation is just different — feels personal."
            </p>
            <div className="t-name">
              Alex K. <span>Tech enthusiast, NY</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="testimonial-card">
            <div className="t-avatar" style={{ background: 'linear-gradient(135deg,#6b8f71,#4a6b50)' }}>
              P
            </div>
            <div className="t-stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star-half-alt"></i>
            </div>
            <p className="t-text">
              "The espresso maker is a game changer. Customer support helped me set it up over chat — incredible service."
            </p>
            <div className="t-name">
              Priya R. <span>Coffee addict, Toronto</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
