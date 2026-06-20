import React from 'react';
import { categories } from '../data/products';
import { useApp } from '../context/AppContext';

export const Categories = () => {
  const { setActiveFilter } = useApp();

  const handleCategoryClick = (categoryId) => {
    setActiveFilter(categoryId);
    const featuredSection = document.getElementById('featured');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="section">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Explore</p>
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="category-card" 
              data-aos="true"
              onClick={() => handleCategoryClick(cat.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="cat-img" style={cat.image ? {} : { background: cat.bgGradient }}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className={`fa ${cat.iconClass}`}></i>
                )}
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.countText}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
