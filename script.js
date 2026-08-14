document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1) FLOATING SCROLL REVEALS — staggered, applies to more
        element types than before (cards, pub entries, quotes)
     ========================================================== */
  const revealSelectors = '.reveal, .dispatch, .pub-entry, .pullquote, .postcard';
  const els = document.querySelectorAll(revealSelectors);

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = 1;
          e.target.style.transform = 'translateY(0) scale(1)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(26px) scale(0.98)';
      const delay = (i % 4) * 90; // stagger within visible groups without huge waits
      el.style.transition = `opacity .65s ease ${delay}ms, transform .65s cubic-bezier(.2,.8,.2,1) ${delay}ms`;
      io.observe(el);
    });
  }

  /* ==========================================================
     2) SCROLL-STACKING SECTIONS — each block pins in place
        while the next one floats up and settles over it
     ========================================================== */
  const sections = document.querySelectorAll('main > section');
  if (!reduceMotion && sections.length) {
    sections.forEach((sec, i) => {
      sec.classList.add('stack-section');
      sec.style.zIndex = i + 1;
    });

    let ticking = false;
    const updatePinned = () => {
      sections.forEach(sec => {
        const r = sec.getBoundingClientRect();
        sec.classList.toggle('is-pinned', r.top <= 2);
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updatePinned); ticking = true; }
    }, { passive: true });
    updatePinned();
  }

  /* ==========================================================
     3) MAGNETIC GLOW ON BUTTONS
     ========================================================== */
  if (!reduceMotion) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--bx', `${e.clientX - r.left}px`);
        btn.style.setProperty('--by', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ==========================================================
     4) CURSOR-REACTIVE GLOW ON THE PHOTO HERO
     ========================================================== */
  const heroPhoto = document.querySelector('.hero-photo');
  if (!reduceMotion && heroPhoto) {
    heroPhoto.addEventListener('mousemove', (e) => {
      const r = heroPhoto.getBoundingClientRect();
      heroPhoto.style.setProperty('--mx', `${e.clientX - r.left}px`);
      heroPhoto.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }
});