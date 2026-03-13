import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<header class="mobile-nav-shell">
  <div class="mobile-topbar">
  <button
    type="button"
    class="hamburger-toggle"
    aria-expanded="false"
    aria-controls="main-nav"
    aria-label="Open navigation menu"
  >
    <span class="hamburger-icon" aria-hidden="true"></span>
  </button>
    <strong>Spring Store</strong>
    <span class="preview-badge">Mobile nav</span>
  </div>

  <main class="mobile-content preview-grid">
    <div class="preview-note">
      Use a hamburger menu when space is constrained and secondary destinations
      should stay hidden until requested.
    </div>
    <section class="preview-card mobile-card">
      <h2 class="preview-title">Featured drop</h2>
      <p class="preview-muted">Fresh arrivals and curated picks for this week.</p>
    </section>
  </main>

  <nav id="main-nav" class="nav-panel" aria-label="Main navigation" hidden>
    <p class="preview-eyebrow">Menu</p>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/services">Services</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>

  <button type="button" class="nav-overlay" aria-hidden="true" tabindex="-1"></button>
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
	css: `.mobile-nav-shell {
  position: relative;
  min-height: 380px;
  overflow: hidden;
  display: grid;
  gap: 18px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid var(--preview-border);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(241, 245, 249, 0.92)),
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.12), transparent 40%);
  box-shadow: var(--preview-shadow);
}

.mobile-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.hamburger-toggle {
  position: relative;
  z-index: 3;
  width: 44px;
  height: 44px;
  border: 1px solid var(--preview-border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
}

.hamburger-icon,
.hamburger-icon::before,
.hamburger-icon::after {
  position: absolute;
  left: 11px;
  width: 20px;
  height: 2px;
  border-radius: 999px;
  background: var(--preview-text);
  transition: transform 0.2s ease, opacity 0.2s ease;
  content: "";
}

.hamburger-icon {
  top: 20px;
}

.hamburger-icon::before {
  transform: translateY(-6px);
}

.hamburger-icon::after {
  transform: translateY(6px);
}

.hamburger-toggle[aria-expanded="true"] .hamburger-icon {
  background: transparent;
}

.hamburger-toggle[aria-expanded="true"] .hamburger-icon::before {
  transform: rotate(45deg);
}

.hamburger-toggle[aria-expanded="true"] .hamburger-icon::after {
  transform: rotate(-45deg);
}

.mobile-content {
  align-content: start;
}

.mobile-card {
  padding: 18px;
}

.nav-panel {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 2;
  width: min(78%, 280px);
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 78px 18px 18px;
  background: rgba(255, 255, 255, 0.98);
  border-right: 1px solid var(--preview-border);
  box-shadow: 20px 0 40px rgba(15, 23, 42, 0.18);
}

.nav-panel ul {
  display: grid;
  gap: 10px;
  list-style: none;
  padding: 0;
}

.nav-panel a {
  display: flex;
  padding: 10px 12px;
  border-radius: 12px;
  color: var(--preview-text);
  font-weight: 600;
}

.nav-panel a:hover {
  background: var(--preview-primary-soft);
  text-decoration: none;
}

.nav-overlay {
  position: absolute;
  inset: 0;
  border: 0;
  border-radius: inherit;
  background: rgba(15, 23, 42, 0.34);
  opacity: 0;
  pointer-events: none;
}

.hamburger-toggle[aria-expanded="true"] ~ .nav-overlay {
  opacity: 1;
  pointer-events: auto;
}
`,
	presentation: "hidden-code",
	variant: "canonical",
};
