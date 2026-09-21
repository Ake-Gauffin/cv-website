// Mobile navigation: keep visibility and accessibility state in sync.
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
const mobileLayout = window.matchMedia('(max-width: 760px)');

if (menuToggle && navigation) {
  const setMenuOpen = (open) => {
    navigation.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };

  menuToggle.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  document.addEventListener('focusin', (event) => {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });
  mobileLayout.addEventListener('change', () => setMenuOpen(false));
}

// Pointer effects use their own properties so hover and entrance motion coexist.
const pointerMotion = window.matchMedia(
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
);
const terminal = document.querySelector('.terminal');
const cards = document.querySelectorAll('.skill-card');

cards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (!pointerMotion.matches) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.removeProperty('--spot-x');
    card.style.removeProperty('--spot-y');
  });
});

if (terminal) {
  const resetTilt = () => {
    terminal.style.removeProperty('--tilt-x');
    terminal.style.removeProperty('--tilt-y');
  };
  terminal.addEventListener('pointermove', (event) => {
    if (!pointerMotion.matches) return;
    const bounds = terminal.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    terminal.style.setProperty('--tilt-x', `${-y * 10}deg`);
    terminal.style.setProperty('--tilt-y', `${x * 10}deg`);
  });
  terminal.addEventListener('pointerleave', resetTilt);
  pointerMotion.addEventListener('change', resetTilt);
}

// Preserve the visible page controls alongside navigation and motion.
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const localTime = document.getElementById('local-time');
if (localTime) {
  const updateTime = () => {
    localTime.textContent = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit'
    }).format(new Date()) + ' in Stockholm';
  };
  updateTime();
  setInterval(updateTime, 60000);
}
const copyEmail = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
const emailLink = document.querySelector('.email-link');
if (copyEmail && copyStatus && emailLink) {
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailLink.href.replace(/^mailto:/, ''));
      copyStatus.textContent = 'Email address copied!';
    } catch {
      copyStatus.textContent = 'Please copy the email address from the link.';
    }
  });
}
