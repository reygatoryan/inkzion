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
          if (cat === 'all' || item.dataset.category.split(' ').includes(cat)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ---- Horizontal Strip ----
  const strip = document.getElementById('galleryStrip');
  const prevBtn = document.querySelector('.strip-arrow-prev');
  const nextBtn = document.querySelector('.strip-arrow-next');

  if (strip && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      const item = strip.querySelector('.strip-item');
      if (item) {
        strip.scrollBy({ left: -item.offsetWidth - 12, behavior: 'smooth' });
      }
    });
    nextBtn.addEventListener('click', () => {
      const item = strip.querySelector('.strip-item');
      if (item) {
        strip.scrollBy({ left: item.offsetWidth + 12, behavior: 'smooth' });
      }
    });

    strip.querySelectorAll('.strip-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        if (!isNaN(idx)) openLightbox(idx);
      });
    });
  }

  // ---- Lightbox ----
  let currentIndex = 0;
  const items = Array.from(galleryItems);

  function updateCounter(lightbox) {
    const counter = lightbox.querySelector('.lightbox-counter');
    if (counter) {
      const visible = items.filter(i => i.style.display !== 'none');
      const total = visible.length;
      const pos = visible.indexOf(items[currentIndex]) + 1;
      counter.textContent = `${pos} / ${total}`;
    }
  }

  function openLightbox(index) {
    currentIndex = index;
    const item = items[currentIndex];
    if (item.style.display === 'none') return;
    const caption = item.querySelector('.gallery-overlay span');
    const text = caption ? caption.textContent : '';

    const imgEl = item.querySelector('img');
    const videoEl = item.querySelector('video');
    if (!imgEl && !videoEl) return;

    const existing = document.querySelector('.lightbox');
    if (existing) existing.remove();

    let mediaHtml;
    if (videoEl) {
      const src = videoEl.querySelector('source')?.getAttribute('src') || '';
      mediaHtml = `<video class="lightbox-video" controls autoplay muted loop playsinline><source src="${src}" type="video/mp4"></video>`;
    } else {
      const src = imgEl.getAttribute('src');
      const alt = imgEl.getAttribute('alt');
      mediaHtml = `<div class="lightbox-spinner"></div><img class="lightbox-img" src="${src}" alt="${alt}">`;
    }

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-nav lightbox-nav-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
      <button class="lightbox-nav lightbox-nav-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      ${mediaHtml}
      <div class="lightbox-caption">${text}</div>
      <div class="lightbox-counter"></div>
    `;

    document.body.appendChild(lightbox);

    // Spinner for images
    const lbImg = lightbox.querySelector('.lightbox-img');
    const spinner = lightbox.querySelector('.lightbox-spinner');
    if (lbImg && spinner) {
      function imgLoaded() {
        lbImg.classList.add('loaded');
        spinner.style.display = 'none';
      }
      if (lbImg.complete) {
        imgLoaded();
      } else {
        lbImg.onload = imgLoaded;
        lbImg.onerror = () => {
          spinner.style.display = 'none';
          lbImg.style.opacity = '1';
        };
      }
    }

    updateCounter(lightbox);

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        navigateLightbox(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

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
    item.addEventListener('click', () => {
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

// ===== SIZE GUIDE VIEWER =====
function openSizeViewer(imgEl) {
  const overlay = document.createElement('div');
  overlay.className = 'size-viewer';
  overlay.innerHTML = `
    <button class="size-viewer-close" aria-label="Close">&times;</button>
    <img src="${imgEl.getAttribute('src')}" alt="${imgEl.getAttribute('alt') || ''}">
  `;
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.size-viewer-close')) {
      overlay.classList.remove('open');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      document.body.style.overflow = '';
    }
  });
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      overlay.classList.remove('open');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      document.body.style.overflow = '';
      document.removeEventListener('keydown', escHandler);
    }
  });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('open'));
}
