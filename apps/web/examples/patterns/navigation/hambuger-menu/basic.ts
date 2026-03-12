import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<header>
  <button
    type="button"
    class="hamburger-toggle"
    aria-expanded="false"
    aria-controls="main-nav"
    aria-label="Open navigation menu"
  >
    <span class="hamburger-icon" aria-hidden="true"></span>
  </button>

  <nav id="main-nav" class="nav-panel" aria-label="Main navigation" hidden>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>

  <div class="nav-overlay" aria-hidden="true"></div>
</header>

<script>
  const toggle = document.querySelector('.hamburger-toggle');
  const nav = document.querySelector('#main-nav');
  const overlay = document.querySelector('.nav-overlay');

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    nav.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    nav.querySelector('a').focus();
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    nav.setAttribute('hidden', '');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });
</script>`,
	presentation: "hidden-code",
	variant: "canonical",
};
