// ===== AOS INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
  // Load AOS from CDN
  const aosScript = document.createElement('script');
  aosScript.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
  aosScript.onload = function () {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-out-cubic'
    });
  };
  document.head.appendChild(aosScript);

  // Load AOS CSS
  const aosLink = document.createElement('link');
  aosLink.rel = 'stylesheet';
  aosLink.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
  document.head.appendChild(aosLink);
});

// ===== INTERSECTION OBSERVER FOR COUNT-UP =====
function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count) || 0;
        animateCount(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCount(el, target) {
  let current = 0;
  const increment = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + (target >= 1000 ? '+' : '');
  }, 25);
}

document.addEventListener('DOMContentLoaded', initCountUp);

// ===== PARALLAX HERO PARTICLES =====
function initHeroParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDuration = (15 + Math.random() * 20) + 's';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
    container.appendChild(particle);
  }
}

document.addEventListener('DOMContentLoaded', initHeroParticles);


