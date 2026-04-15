const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.global-nav');
const header = document.querySelector('.site-header');

const closeNav = () => {
  if (!toggle || !nav) return;
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
};

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  document.addEventListener('click', (event) => {
    if (window.innerWidth > 960) return;
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeNav();
    }
  });
}

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};

const updateAge = () => {
  const ageEl = document.getElementById('age-display');
  if (!ageEl) return;

  const birthText = ageEl.dataset.birth;
  if (!birthText) return;

  const parts = birthText.split('-').map((value) => Number(value));
  if (parts.length !== 3 || parts.some((value) => Number.isNaN(value))) return;

  const [year, month, day] = parts;
  const today = new Date();
  let age = today.getFullYear() - year;

  const hasHadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthday) age -= 1;
  ageEl.textContent = String(age);
};

const setupReveal = () => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  targets.forEach((el) => observer.observe(el));
};

const initSite = () => {
  updateHeader();
  updateAge();
  setupReveal();
  setupSpirConfirm();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite);
} else {
  initSite();
}

window.addEventListener('scroll', updateHeader, { passive: true });


const setupSpirConfirm = () => {
  const spirLinks = document.querySelectorAll('a[href*="spirinc.com"]');
  if (!spirLinks.length) return;

  spirLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const ok = window.confirm('Spirサイトに遷移しますが、よろしいですか？');
      if (!ok) {
        event.preventDefault();
      }
    });
  });
};
