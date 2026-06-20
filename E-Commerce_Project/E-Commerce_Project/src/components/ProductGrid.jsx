import React from 'react';
import { products, categories } from '../data/products';
import { ProductCard } from './ProductCard';
import { useApp } from '../context/AppContext';

export const ProductGrid = () => {
  const { searchQuery, activeFilter, setActiveFilter } = useApp();
  
  const filterTabs = ['all', ...categories.map(c => c.id)];

  const filteredProducts = products.filter(product => {
    // Check tab category match
    const matchesCategory = activeFilter === 'all' || product.category === activeFilter;
    
    // Check search query match
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="featured" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Handpicked</p>
          <h2 className="section-title">Featured Products</h2>
          <div className="filter-tabs">
            {filterTabs.map(tab => (
              <button
                key={tab}
                className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
                onClick={() => setActiveFilter(tab)}
              >
                {tab === 'all' ? 'All' : categories.find(c => c.id === tab)?.name || tab}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="no-products-found" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
            <i className="fa fa-search" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block', opacity: 0.5 }}></i>
            <p>No products found matching your search criteria.</p>
          </div>
        ) : (
          <div className="products-grid" id="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
