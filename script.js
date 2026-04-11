const navToggle = document.querySelector('.nav-toggle');
const globalNav = document.querySelector('.global-nav');
const navLinks = document.querySelectorAll('.global-nav a');
const yearEl = document.getElementById('current-year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navToggle && globalNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = globalNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      globalNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'メニューを開く');
    });
  });
}
