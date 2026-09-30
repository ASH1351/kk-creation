/**
 * KK CREATIONS – Main Application Logic
 * Integrates Lenis Smooth Scroll, GSAP, Preloader, Product Grid, Modals, Lightbox, Audio & Custom Cursor
 */

(function () {
  'use strict';

  // State Management
  const AppState = {
    activeCategory: 'all',
    soundEnabled: false,
    mobileMenuOpen: false
  };

  // 1. Web Audio API Luxury Chime Synthesis (Zero external audio file dependencies)
  let audioCtx = null;
  function playLuxuryChime(freq = 880, type = 'sine', duration = 0.45) {
    if (!AppState.soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio not initialized:", e);
    }
  }

  // Sound toggle button setup
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      AppState.soundEnabled = !AppState.soundEnabled;
      soundToggleBtn.classList.toggle('active', AppState.soundEnabled);
      soundToggleBtn.setAttribute('aria-pressed', AppState.soundEnabled);
      if (AppState.soundEnabled) {
        playLuxuryChime(587.33); // D5
        setTimeout(() => playLuxuryChime(880), 120); // A5
      }
    });
  }

  // 2. Initialize Lenis Smooth Scroll & Sync with GSAP ScrollTrigger
  let lenis = null;
  function initSmoothScroll() {
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.8
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    }
  }

  // 3. Preloader Animation Sequence
  function runPreloader() {
    const loader = document.getElementById('boutique-loader');
    if (!loader) return;

    // Check if user has already visited in this session
    const hasVisited = sessionStorage.getItem('kk_visited');
    const delayTime = hasVisited ? 1200 : 2400;

    const wreathSvg = loader.querySelector('.loader-wreath-svg');
    const brandTitle = loader.querySelector('.loader-title');
    const brandSub = loader.querySelector('.loader-subtitle');
    const progressLine = loader.querySelector('.loader-progress-bar');

    // Trigger stroke drawing via CSS / GSAP
    if (progressLine) {
      progressLine.style.transition = `width ${delayTime}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      setTimeout(() => { progressLine.style.width = '100%'; }, 50);
    }

    setTimeout(() => {
      loader.classList.add('loader-fadeout');
      sessionStorage.setItem('kk_visited', 'true');

      // Animate Hero typography entrance
      if (typeof gsap !== 'undefined') {
        gsap.from('.hero-stagger-text', {
          opacity: 0,
          y: 40,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }

      setTimeout(() => {
        loader.style.display = 'none';
      }, 700);
    }, delayTime);
  }

  // 4. Custom Luxury Cursor (Desktop)
  function initCustomCursor() {
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorRing = document.querySelector('.custom-cursor-ring');
    const cursorLabel = document.querySelector('.custom-cursor-label');

    if (!cursorDot || !cursorRing || window.innerWidth < 1024) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand cursor over interactive elements
    const interactiveElements = 'a, button, .product-card, .swatch-btn, input, select, textarea, [data-interactive]';
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest(interactiveElements);
      if (target) {
        cursorRing.classList.add('hovering');
        if (target.dataset.cursor) {
          cursorLabel.textContent = target.dataset.cursor;
          cursorRing.classList.add('has-label');
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest(interactiveElements);
      if (target) {
        cursorRing.classList.remove('hovering', 'has-label');
        cursorLabel.textContent = '';
      }
    });
  }

  // 5. Sticky Smart Glass-Blur Navbar
  function initNavbar() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Hide on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 240) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }
      lastScroll = currentScroll;
    }, { passive: true });

    // Mobile Hamburger Menu
    const menuBtn = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuBtn && mobileDrawer) {
      menuBtn.addEventListener('click', () => {
        AppState.mobileMenuOpen = !AppState.mobileMenuOpen;
        menuBtn.classList.toggle('open', AppState.mobileMenuOpen);
        mobileDrawer.classList.toggle('open', AppState.mobileMenuOpen);
        document.body.classList.toggle('no-scroll', AppState.mobileMenuOpen);
        playLuxuryChime(440);
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          AppState.mobileMenuOpen = false;
          menuBtn.classList.remove('open');
          mobileDrawer.classList.remove('open');
          document.body.classList.remove('no-scroll');
        });
      });
    }
  }

  // 6. Collection Grid Rendering & Category Filtering
  function initCollectionGrid() {
    const gridContainer = document.getElementById('products-grid');
    if (!gridContainer || typeof PRODUCTS_DATA === 'undefined') return;

    function renderCards(category = 'all') {
      gridContainer.innerHTML = '';

      const filtered = category === 'all'
        ? PRODUCTS_DATA
        : PRODUCTS_DATA.filter(p => p.category === category);

      filtered.forEach((product, idx) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('data-id', product.id);
        card.setAttribute('data-interactive', 'true');

        card.innerHTML = `
          <div class="product-card-inner">
            <div class="product-badge">${product.tag}</div>
            
            <div class="product-image-wrap" data-cursor="VIEW">
              <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
              <div class="product-hover-overlay">
                <button class="btn-quick-view" data-product-id="${product.id}" aria-label="Quick view details for ${product.name}">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  Quick View
                </button>
              </div>
            </div>

            <div class="product-info">
              <div class="product-meta">
                <span class="product-category">${product.categoryLabel}</span>
                <span class="product-weight">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  ${product.weight}
                </span>
              </div>

              <h3 class="product-title">${product.name}</h3>

              <div class="product-specs-snippet">
                <span>${product.metal}</span> • <span>${product.stone}</span>
              </div>

              <div class="product-card-footer">
                <div class="product-pricing">
                  <span class="product-price">${formatCurrency(product.price)}</span>
                  <span class="product-original-price">${formatCurrency(product.originalPrice)}</span>
                </div>

                <a href="${createWhatsAppEnquiryLink(product.name, product.price)}" target="_blank" rel="noopener noreferrer" class="btn-card-whatsapp" aria-label="Enquire about ${product.name} on WhatsApp" data-cursor="ENQUIRE">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Enquire</span>
                </a>
              </div>
            </div>
          </div>
        `;

        gridContainer.appendChild(card);

        // 3D Card Tilt Interaction
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -9;
          const rotateY = ((x - centerX) / centerX) * 9;

          card.querySelector('.product-card-inner').style.transform = 
            `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
        });

        card.addEventListener('mouseleave', () => {
          card.querySelector('.product-card-inner').style.transform = 
            'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
      });

      // Attach Quick View Modal Handlers
      gridContainer.querySelectorAll('.btn-quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const pId = btn.getAttribute('data-product-id');
          openProductModal(pId);
        });
      });
    }

    // Category Tabs Filtering
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-category');
        AppState.activeCategory = cat;
        playLuxuryChime(523.25); // C5
        renderCards(cat);
      });
    });

    // Initial render
    renderCards('all');
  }

  // 7. Product Details Modal
  function openProductModal(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    if (!modal) return;

    modal.querySelector('.modal-product-img').src = product.image;
    modal.querySelector('.modal-product-img').alt = product.name;
    modal.querySelector('.modal-category').textContent = product.categoryLabel;
    modal.querySelector('.modal-title').textContent = product.name;
    modal.querySelector('.modal-price').textContent = formatCurrency(product.price);
    modal.querySelector('.modal-original-price').textContent = formatCurrency(product.originalPrice);
    modal.querySelector('.modal-description').textContent = product.description;
    modal.querySelector('.modal-weight').textContent = product.weight;
    modal.querySelector('.modal-metal').textContent = product.metal;
    modal.querySelector('.modal-stone').textContent = product.stone;
    modal.querySelector('.modal-dimensions').textContent = product.dimensions;
    modal.querySelector('.modal-closure').textContent = product.closure;

    // Feature bullet points
    const featuresList = modal.querySelector('.modal-features-list');
    featuresList.innerHTML = product.features.map(f => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4B36A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ${f}</li>`).join('');

    // WhatsApp CTA inside modal
    const whatsappBtn = modal.querySelector('.modal-whatsapp-cta');
    whatsappBtn.href = createWhatsAppEnquiryLink(product.name, product.price);

    modal.classList.add('active');
    document.body.classList.add('modal-open');
    playLuxuryChime(659.25); // E5
  }

  // Close modal logic
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalCloseBtn && modalBackdrop) {
    function closeModal() {
      const modal = document.getElementById('product-modal');
      if (modal) modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
    modalCloseBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // 8. Lookbook / Editorial Lightbox
  function initLookbookLightbox() {
    const lightbox = document.getElementById('lookbook-lightbox');
    if (!lightbox) return;

    const lbImg = lightbox.querySelector('.lightbox-img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbEnquireBtn = lightbox.querySelector('.lightbox-whatsapp-enquire');
    const lbCloseBtn = lightbox.querySelector('.lightbox-close-btn');

    document.querySelectorAll('.lookbook-item').forEach(item => {
      item.addEventListener('click', () => {
        const fullImg = item.getAttribute('data-full-img') || item.querySelector('img').src;
        const caption = item.getAttribute('data-caption') || 'KK Creations Editorial Collection';
        const productName = item.getAttribute('data-product-name') || 'Bespoke Editorial Look';

        lbImg.src = fullImg;
        lbCaption.textContent = caption;
        lbEnquireBtn.href = createWhatsAppEnquiryLink(productName, 3950, 'Referenced from Lookbook Editorial');

        lightbox.classList.add('active');
        document.body.classList.add('modal-open');
        playLuxuryChime(587.33);
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.classList.remove('modal-open');
    }

    if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // 9. Testimonials Carousel
  function initTestimonialsSlider() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    // Create pagination dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `testimonial-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      document.querySelectorAll('.testimonial-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      updateSlider();
      playLuxuryChime(784); // G5
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Auto-advance every 6.5 seconds
    let autoInterval = setInterval(() => goToSlide(currentIndex + 1), 6500);

    const sliderContainer = document.querySelector('.testimonials-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => clearInterval(autoInterval));
      sliderContainer.addEventListener('mouseleave', () => {
        autoInterval = setInterval(() => goToSlide(currentIndex + 1), 6500);
      });
    }
  }

  // 10. Custom Bespoke WhatsApp Order Form
  function initBespokeForm() {
    const form = document.getElementById('custom-order-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('order-name').value.trim();
      const phone = document.getElementById('order-phone').value.trim();
      const type = document.getElementById('order-type').value;
      const metal = document.getElementById('order-metal').value;
      const budget = document.getElementById('order-budget').value;
      const message = document.getElementById('order-message').value.trim();

      if (!name || !phone) {
        alert('Please provide your name and contact phone number.');
        return;
      }

      // Build personalized bespoke inquiry text
      let waText = `Hello KK Creations Atelier! ✨🌿\n\nI would love to commission a *Custom Earring Design*:\n\n`;
      waText += `👤 *Client Name:* ${name}\n`;
      waText += `📱 *Phone:* ${phone}\n`;
      waText += `💎 *Desired Category:* ${type}\n`;
      waText += `✨ *Preferred Metal:* ${metal}\n`;
      if (budget) waText += `💰 *Target Budget:* ${budget}\n`;
      if (message) waText += `📝 *Design Vision:* ${message}\n\n`;
      waText += `Looking forward to consulting with your jewellery designer! Thank you.`;

      const whatsappURL = `https://wa.me/919876543210?text=${encodeURIComponent(waText)}`;
      window.open(whatsappURL, '_blank');
      playLuxuryChime(880);
    });
  }

  // 11. Magnetic Button Physics (Desktop)
  function initMagneticButtons() {
    if (window.innerWidth < 1024) return;
    const magneticBtns = document.querySelectorAll('.btn-magnetic');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 400);
      });
    });
  }

  // DOMContentLoaded Entrypoint
  document.addEventListener('DOMContentLoaded', () => {
    runPreloader();
    initSmoothScroll();
    initCustomCursor();
    initNavbar();
    initCollectionGrid();
    initLookbookLightbox();
    initTestimonialsSlider();
    initBespokeForm();
    initMagneticButtons();
  });

})();
