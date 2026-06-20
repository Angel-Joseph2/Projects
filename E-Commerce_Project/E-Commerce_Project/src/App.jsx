import React, { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Hero } from './components/Hero';
import { MarqueeStrip } from './components/MarqueeStrip';
import { Categories } from './components/Categories';
import { ProductGrid } from './components/ProductGrid';
import { SpecialOffers } from './components/SpecialOffers';
import { TrustStrip } from './components/TrustStrip';
import { Testimonials } from './components/Testimonials';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { QuickViewModal } from './components/QuickViewModal';
import { BackToTop } from './components/BackToTop';
import { ToastContainer } from './components/ToastContainer';

const AppContent = () => {
  // Intersection Observer to trigger [data-aos] scroll entrance animations
  useEffect(() => {
    const aosEls = document.querySelectorAll('[data-aos]');

    if ('IntersectionObserver' in window && aosEls.length) {
      const aosObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              setTimeout(() => el.classList.add('aos-in'), i * 85);
              aosObserver.unobserve(el);
            }
          });
        },
        { threshold: 0.12 }
      );

      aosEls.forEach((el) => aosObserver.observe(el));
      
      return () => {
        aosObserver.disconnect();
      };
    } else {
      // Fallback if IntersectionObserver is not supported by browser
      aosEls.forEach((el) => el.classList.add('aos-in'));
    }
  }, []);

  return (
    <>
      <Loader />
      <Navbar />
      <CartDrawer />
      <Hero />
      <MarqueeStrip />
      <Categories />
      <ProductGrid />
      <SpecialOffers />
      <TrustStrip />
      <Testimonials />
      <Newsletter />
      <Footer />
      <QuickViewModal />
      <BackToTop />
      <ToastContainer />
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
