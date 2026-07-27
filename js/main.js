// ===== PAGE FADE =====
window.addEventListener('load', () => {
  const fade = document.querySelector('.page-fade');
  if (fade) {
    fade.classList.add('hidden');
  }
});

// ===== NAVBAR =====
const header = document.querySelector('.header');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
  hamburger.classList.toggle('active');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

if (hamburger) {
  hamburger.addEventListener('click', toggleMenu);
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      toggleMenu();
    }
  });
});

// ===== SCROLL EFFECTS =====
function handleScroll() {
  const scrollY = window.scrollY;

  if (header) {
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    if (scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  // Viber float button
  const viber = document.querySelector('.viber-float');
  if (viber) {
    if (scrollY > 200) {
      viber.classList.add('visible');
    } else {
      viber.classList.remove('visible');
    }
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// ===== BACK TO TOP =====
document.addEventListener('click', (e) => {
  if (e.target.closest('.back-to-top')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// ===== TESTIMONIAL CAROUSEL =====
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || !dots.length) return;

  let current = 0;
  const total = dots.length;
  let interval;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() {
    goTo((current + 1) % total);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      clearInterval(interval);
      interval = setInterval(next, 5000);
    });
  });

  interval = setInterval(next, 5000);
}

document.addEventListener('DOMContentLoaded', initTestimonials);

// ===== FAQ ACCORDION =====
document.addEventListener('click', (e) => {
  const question = e.target.closest('.faq-question');
  if (question) {
    const item = question.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));

    // Toggle clicked
    if (!isActive) {
      item.classList.add('active');
    }
  }
});

// ===== ACTIVE NAV LINK =====
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
});

// ===== GALLERY LIGHTBOX & FILTERS =====
document.addEventListener('DOMContentLoaded', () => {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // ---- Filter Tabs ----
  const filters = document.querySelectorAll('.gallery-filter');
  if (filters.length) {
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        galleryItems.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Lightbox ----
  let currentIndex = 0;
  const items = Array.from(galleryItems);

  function openLightbox(index) {
    currentIndex = index;
    const item = items[currentIndex];
    if (item.style.display === 'none') return;
    const img = item.querySelector('img');
    if (!img) return;
    const caption = item.querySelector('.gallery-overlay span');
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    const text = caption ? caption.textContent : alt;

    const existing = document.querySelector('.lightbox');
    if (existing) existing.remove();

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-nav lightbox-nav-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
      <button class="lightbox-nav lightbox-nav-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      <img class="lightbox-img" src="${src}" alt="${alt}">
      <div class="lightbox-caption">${text}</div>
    `;

    document.body.appendChild(lightbox);

    requestAnimationFrame(() => {
      lightbox.classList.add('open');
    });

    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
      lightbox.classList.remove('open');
      lightbox.addEventListener('transitionend', () => {
        lightbox.remove();
      }, { once: true });
      document.body.style.overflow = '';
    }
  }

  function navigateLightbox(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = items.length - 1;
    if (currentIndex >= items.length) currentIndex = 0;
    const item = items[currentIndex];
    if (item.style.display === 'none') {
      navigateLightbox(direction);
      return;
    }
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      if (item.querySelector('video')) return;
      openLightbox(index);
    });
  });

  document.addEventListener('click', (e) => {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    if (e.target.closest('.lightbox-close')) {
      closeLightbox();
    } else if (e.target.closest('.lightbox-nav-next')) {
      navigateLightbox(1);
    } else if (e.target.closest('.lightbox-nav-prev')) {
      navigateLightbox(-1);
    } else if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!document.querySelector('.lightbox.open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
  });
});
