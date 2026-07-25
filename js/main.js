// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.classList.add('hidden');
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
