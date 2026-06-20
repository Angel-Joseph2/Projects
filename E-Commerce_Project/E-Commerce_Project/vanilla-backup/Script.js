/* ============================================================
   LUXE — E-Commerce JavaScript
   Corrected & cleaned — all logic in JS, no inline handlers
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ */
  /* LOADER                                                               */
  /* ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('done'), 1500);
  });


  /* ------------------------------------------------------------------ */
  /* NAVBAR — sticky on scroll                                           */
  /* ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (navbar)   navbar.classList.toggle('scrolled', window.scrollY > 60);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  });


  /* ------------------------------------------------------------------ */
  /* HAMBURGER MENU                                                       */
  /* ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }


  /* ------------------------------------------------------------------ */
  /* BACK TO TOP                                                          */
  /* ------------------------------------------------------------------ */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ------------------------------------------------------------------ */
  /* DARK MODE TOGGLE                                                     */
  /* ------------------------------------------------------------------ */
  const darkBtn  = document.getElementById('dark-toggle');

  if (darkBtn) {
    // Restore saved preference
    if (localStorage.getItem('luxe-dark') === 'true') {
      document.documentElement.setAttribute('data-dark', '');
      darkBtn.querySelector('i').className = 'fa fa-sun';
    }

    darkBtn.addEventListener('click', () => {
      const isDark = document.documentElement.hasAttribute('data-dark');
      const darkIcon = darkBtn.querySelector('i');
      if (isDark) {
        document.documentElement.removeAttribute('data-dark');
        darkIcon.className = 'fa fa-moon';
        localStorage.setItem('luxe-dark', 'false');
      } else {
        document.documentElement.setAttribute('data-dark', '');
        darkIcon.className = 'fa fa-sun';
        localStorage.setItem('luxe-dark', 'true');
      }
    });
  }


  /* ------------------------------------------------------------------ */
  /* TOAST NOTIFICATION                                                   */
  /* ------------------------------------------------------------------ */
  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');

    Object.assign(t.style, {
      position:     'fixed',
      bottom:       '5rem',
      left:         '50%',
      transform:    'translateX(-50%) translateY(20px)',
      background:   '#0D1B2A',
      color:        '#fff',
      padding:      '.65rem 1.5rem',
      borderRadius: '50px',
      fontSize:     '.88rem',
      fontFamily:   "'DM Sans', sans-serif",
      fontWeight:   '500',
      zIndex:       '3000',
      boxShadow:    '0 8px 28px rgba(0,0,0,.25)',
      opacity:      '0',
      transition:   'opacity .3s ease, transform .3s ease',
      pointerEvents:'none',
    });

    document.body.appendChild(t);

    // Double rAF ensures the element is painted before the transition starts
    requestAnimationFrame(() => requestAnimationFrame(() => {
      t.style.opacity   = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    }));

    setTimeout(() => {
      t.style.opacity   = '0';
      t.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => t.remove(), 350);
    }, 2300);
  }


  /* ------------------------------------------------------------------ */
  /* CART                                                                 */
  /* ------------------------------------------------------------------ */
  let cartCount = 0;
  const cartEl  = document.getElementById('cart-count');

  function addToCart() {
    cartCount++;
    if (cartEl) {
      cartEl.textContent = cartCount;
      cartEl.style.transform = 'scale(1.5)';
      setTimeout(() => { cartEl.style.transform = 'scale(1)'; }, 250);
    }
    showToast('Item added to cart!');
  }

  // "Add to Cart" buttons on product cards
  document.querySelectorAll('.btn-cart').forEach(btn => {
    btn.addEventListener('click', addToCart);
  });

  // "Add to Cart" button inside the modal
  const modalCartBtn = document.querySelector('.modal-box .btn-primary');
  if (modalCartBtn) {
    modalCartBtn.addEventListener('click', () => {
      addToCart();
      closeModal();
    });
  }


  /* ------------------------------------------------------------------ */
  /* QUICK VIEW MODAL                                                     */
  /* ------------------------------------------------------------------ */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalTitle   = document.getElementById('modal-title');
  const modalPrice   = document.getElementById('modal-price');
  const modalDesc    = document.getElementById('modal-desc');

  function openModal(title, price, desc) {
    if (!modalOverlay) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalPrice) modalPrice.textContent = price;
    if (modalDesc)  modalDesc.textContent  = desc;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Close on overlay click (but not on the box itself)
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // Close button inside modal
  const modalCloseBtn = document.querySelector('.modal-close');
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Wire up all "Quick view" buttons using their data attributes
  document.querySelectorAll('.prod-action[aria-label="Quick view"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card  = btn.closest('.product-card');
      const title = card.querySelector('.product-name')?.textContent  || '';
      const price = card.querySelector('.product-price')?.textContent || '';
      // data-desc is the optional description stored on the button
      const desc  = btn.dataset.desc || 'Premium quality product from LUXE.';
      openModal(title, price, desc);
    });
  });


  /* ------------------------------------------------------------------ */
  /* PRODUCT FILTER TABS                                                  */
  /* ------------------------------------------------------------------ */
  const filterTabs   = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter || 'all';

      productCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });


  /* ------------------------------------------------------------------ */
  /* COUNTDOWN TIMER                                                      */
  /* ------------------------------------------------------------------ */
  const cdH = document.getElementById('cd-h');
  const cdM = document.getElementById('cd-m');
  const cdS = document.getElementById('cd-s');

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  function updateCountdown() {
    const now      = new Date();
    const midnight = new Date();
    midnight.setHours(23, 59, 59, 999);

    const diff = midnight - now;

    if (diff <= 0) {
      if (cdH) cdH.textContent = '00';
      if (cdM) cdM.textContent = '00';
      if (cdS) cdS.textContent = '00';
      return;
    }

    if (cdH) cdH.textContent = pad(Math.floor(diff / 3_600_000));
    if (cdM) cdM.textContent = pad(Math.floor((diff % 3_600_000) / 60_000));
    if (cdS) cdS.textContent = pad(Math.floor((diff % 60_000) / 1_000));
  }

  if (cdH || cdM || cdS) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }


  /* ------------------------------------------------------------------ */
  /* NEWSLETTER                                                           */
  /* ------------------------------------------------------------------ */
  const newsletterForm = document.querySelector('.newsletter-form');
  const nlSuccess      = document.getElementById('nl-success');
  const nlInputGroup   = document.querySelector('.newsletter-input-group');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      if (nlInputGroup) nlInputGroup.style.display = 'none';
      if (nlSuccess)    nlSuccess.style.display    = 'block';
      showToast('Successfully subscribed!');
    });
  }


  /* ------------------------------------------------------------------ */
  /* SCROLL ANIMATIONS (lightweight IntersectionObserver)                */
  /* ------------------------------------------------------------------ */
  const aosEls = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window && aosEls.length) {
    const aosObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('aos-in'), i * 80);
          aosObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    aosEls.forEach(el => aosObserver.observe(el));
  } else {
    // Fallback: show immediately if observer not supported
    aosEls.forEach(el => el.classList.add('aos-in'));
  }


  /* ------------------------------------------------------------------ */
  /* SEARCH INPUT                                                         */
  /* ------------------------------------------------------------------ */
  const searchInput = document.getElementById('search-input');

  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
          showToast(`Searching for "${query}"…`);
          e.target.value = '';
        }
      }
    });
  }


  /* ------------------------------------------------------------------ */
  /* WISHLIST TOGGLE                                                      */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('.prod-action[aria-label="Wishlist"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const btnIcon = btn.querySelector('i');
      if (!btnIcon) return;

      const isWishlisted = btnIcon.classList.contains('fas');

      if (isWishlisted) {
        btnIcon.className  = 'fa fa-heart';
        btnIcon.style.color = '';
        showToast('Removed from wishlist');
      } else {
        btnIcon.className  = 'fas fa-heart';
        btnIcon.style.color = '#e84545';
        showToast('Added to wishlist!');
      }
    });
  });


}); // end DOMContentLoaded