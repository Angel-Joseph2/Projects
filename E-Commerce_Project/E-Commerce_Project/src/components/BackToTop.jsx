import React, { useState, useEffect } from 'react';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      id="back-to-top"
      className={isVisible ? 'visible' : ''}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <i className="fa fa-arrow-up"></i>
    </button>
  );
};
