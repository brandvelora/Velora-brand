  // Resolve the repository's root-level assets without changing the page markup.
  // The site is static-hosted from the repository root, so the old assets/ prefix
  // caused the logo and carousel images to fail on both desktop and mobile.
  document.querySelectorAll('img[src^="assets/"]').forEach((image) => {
    const filename = image.getAttribute('src').replace(/^assets\//, '');
    image.src = filename === 'hero-3.jpg' ? 'hero-4.jpg' : filename;
  });
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) favicon.href = 'favicon.png';

  // Sticky nav
  const nav = document.getElementById('siteNav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      if (isOpen) { item.classList.remove('open'); a.style.maxHeight = null; }
      else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  // Forms — all three (Collaborate, Talent, Contact) submit live to Formspree
  function handleLiveFormSubmit(formId, successId, errorId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    const error = document.getElementById(errorId);
    const submitBtn = form.querySelector('button[type="submit"]');
    const label = submitBtn.querySelector('.btn-label');
    const originalLabel = label.textContent;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      error.classList.remove('show');
      success.classList.remove('show');
      submitBtn.disabled = true;
      label.textContent = 'Sending...';
      label.classList.add('is-submitting');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          success.classList.add('show');
          success.scrollIntoView({behavior:'smooth', block:'nearest'});
          form.reset();
        } else {
          error.classList.add('show');
          error.scrollIntoView({behavior:'smooth', block:'nearest'});
        }
      } catch (err) {
        error.classList.add('show');
        error.scrollIntoView({behavior:'smooth', block:'nearest'});
      } finally {
        submitBtn.disabled = false;
        label.textContent = originalLabel;
        label.classList.remove('is-submitting');
      }
    });
  }
  handleLiveFormSubmit('collabForm', 'collabSuccess', 'collabError');
  handleLiveFormSubmit('talentForm', 'talentSuccess', 'talentError');
  handleLiveFormSubmit('inquiryForm', 'inquirySuccess', 'inquiryError');

  // Modal system
  (function initModals(){
    let activeModal = null;
    let lastFocused = null;

    function openModal(id){
      const overlay = document.getElementById(id);
      if (!overlay) return;
      lastFocused = document.activeElement;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      activeModal = overlay;
      const firstField = overlay.querySelector('input, select, textarea');
      if (firstField) setTimeout(() => firstField.focus(), 350);
    }

    function closeModal(overlay){
      if (!overlay) return;
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      activeModal = null;
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('[data-open-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => openModal(trigger.getAttribute('data-open-modal')));
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
      });
      overlay.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(overlay));
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeModal) closeModal(activeModal);
    });
  })();

  // Scroll reveal
  const revealTargets = document.querySelectorAll('.reveal, .reveal-group');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  revealTargets.forEach(t => revealObserver.observe(t));

  // Hero carousel
  (function initCarousel(){
    const root = document.getElementById('heroCarousel');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const dots = Array.from(root.querySelectorAll('.dot'));
    const prevBtn = root.querySelector('.car-arrow.prev');
    const nextBtn = root.querySelector('.car-arrow.next');
    let current = 0;
    let autoplayTimer = null;
    const AUTOPLAY_MS = 6000;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Preserve vertical scrolling while allowing horizontal swipe navigation on phones.
    root.style.touchAction = 'pan-y';

    function goTo(index){
      const next = (index + slides.length) % slides.length;
      if (next === current) return;
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = next;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function nextSlide(){ goTo(current + 1); }
    function prevSlide(){ goTo(current - 1); }

    function startAutoplay(){
      if (reducedMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
    }
    function stopAutoplay(){ if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }

    nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
    dots.forEach(dot => {
      dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.index, 10)); startAutoplay(); });
    });

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);

    // Keyboard navigation (ignored while typing in a form field)
    document.addEventListener('keydown', (e) => {
      const tag = document.activeElement ? document.activeElement.tagName : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
      if (e.key === 'ArrowLeft') { prevSlide(); startAutoplay(); }
    });

    // Touch swipe
    let touchStartX = 0, touchDeltaX = 0;
    root.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX; touchDeltaX = 0; stopAutoplay();
    }, {passive:true});
    root.addEventListener('touchmove', (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, {passive:true});
    root.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > 40) { if (touchDeltaX < 0) nextSlide(); else prevSlide(); }
      startAutoplay();
    });

    startAutoplay();
  })();
