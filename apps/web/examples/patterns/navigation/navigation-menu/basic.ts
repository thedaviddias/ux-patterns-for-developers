import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<header>
  <nav aria-label="Main navigation">
    <ul class="nav-list">
      <li><a href="/" aria-current="page">Home</a></li>
      <li><a href="/products">Products</a></li>
      <li class="has-dropdown">
        <button
          type="button"
          aria-expanded="false"
          aria-haspopup="true"
        >
          Services
          <span aria-hidden="true">▾</span>
        </button>
        <ul class="dropdown" hidden>
          <li><a href="/services/consulting">Consulting</a></li>
          <li><a href="/services/development">Development</a></li>
          <li><a href="/services/support">Support</a></li>
        </ul>
      </li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
</header>

<script>
  document.querySelectorAll('.has-dropdown button').forEach(trigger => {
    const dropdown = trigger.nextElementSibling;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!isOpen));
      dropdown.toggleAttribute('hidden');

      if (!isOpen) {
        dropdown.querySelector('a')?.focus();
      }
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('hidden', '');
        trigger.focus();
      }
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.has-dropdown').forEach(item => {
      if (!item.contains(e.target)) {
        const btn = item.querySelector('button');
        btn.setAttribute('aria-expanded', 'false');
        item.querySelector('.dropdown').setAttribute('hidden', '');
      }
    });
  });
</script>`,
	css: `header {
  display: grid;
  gap: 16px;
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  list-style: none;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: var(--preview-shadow);
}

.nav-list > li {
  position: relative;
}

.nav-list a,
.nav-list button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 14px;
  border-radius: 12px;
  color: var(--preview-text);
  font-weight: 600;
}

.nav-list a[aria-current="page"],
.nav-list button[aria-expanded="true"] {
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}

.dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 220px;
  list-style: none;
  padding: 10px;
  border-radius: 18px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--preview-shadow);
  display: grid;
  gap: 6px;
}

.dropdown a {
  width: 100%;
}

.dropdown a:hover {
  background: rgba(219, 234, 254, 0.7);
  text-decoration: none;
}
`,
	presentation: "hidden-code",
	variant: "canonical",
};
