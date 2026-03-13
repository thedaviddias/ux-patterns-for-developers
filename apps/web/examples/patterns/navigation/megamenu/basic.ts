import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<nav aria-label="Main navigation">
  <ul class="nav-bar" role="menubar">
    <li role="none">
      <button
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded="false"
        aria-controls="mega-products"
        class="nav-trigger"
      >
        Products
        <span class="chevron" aria-hidden="true">▾</span>
      </button>

      <div id="mega-products" class="megamenu-panel" role="menu" hidden>
        <div class="megamenu-columns">
          <div class="megamenu-column">
            <h3 class="megamenu-heading">Electronics</h3>
            <ul role="none">
              <li role="none"><a role="menuitem" href="/phones">Phones</a></li>
              <li role="none"><a role="menuitem" href="/laptops">Laptops</a></li>
              <li role="none"><a role="menuitem" href="/tablets">Tablets</a></li>
            </ul>
          </div>
          <div class="megamenu-column">
            <h3 class="megamenu-heading">Clothing</h3>
            <ul role="none">
              <li role="none"><a role="menuitem" href="/men">Men</a></li>
              <li role="none"><a role="menuitem" href="/women">Women</a></li>
              <li role="none"><a role="menuitem" href="/kids">Kids</a></li>
            </ul>
          </div>
          <div class="megamenu-column">
            <h3 class="megamenu-heading">Home & Garden</h3>
            <ul role="none">
              <li role="none"><a role="menuitem" href="/furniture">Furniture</a></li>
              <li role="none"><a role="menuitem" href="/decor">Decor</a></li>
              <li role="none"><a role="menuitem" href="/garden">Garden</a></li>
            </ul>
          </div>
        </div>
      </div>
    </li>
  </ul>
</nav>

<script>
  const triggers = document.querySelectorAll('.nav-trigger');
  let hoverTimeout;

  triggers.forEach(trigger => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));

    function open() {
      clearTimeout(hoverTimeout);
      trigger.setAttribute('aria-expanded', 'true');
      panel.removeAttribute('hidden');
    }

    function close() {
      trigger.setAttribute('aria-expanded', 'false');
      panel.setAttribute('hidden', '');
    }

    function delayedClose() {
      hoverTimeout = setTimeout(close, 300);
    }

    trigger.addEventListener('mouseenter', open);
    trigger.addEventListener('mouseleave', delayedClose);
    panel.addEventListener('mouseenter', () => clearTimeout(hoverTimeout));
    panel.addEventListener('mouseleave', delayedClose);

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
        panel.querySelector('a')?.focus();
      }
      if (e.key === 'Escape') {
        close();
        trigger.focus();
      }
    });
  });
</script>`,
	css: `nav[aria-label="Main navigation"] {
  display: grid;
  gap: 16px;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  list-style: none;
  padding: 12px;
  border-radius: 18px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: var(--preview-shadow);
}

.nav-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  font-weight: 700;
}

.nav-trigger[aria-expanded="true"] {
  border-color: var(--preview-border-strong);
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}

.megamenu-panel {
  border: 1px solid var(--preview-border);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--preview-shadow);
  padding: 20px;
}

.megamenu-columns {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.megamenu-column {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.9);
  border: 1px solid rgba(219, 228, 238, 0.8);
}

.megamenu-heading {
  font-size: 1rem;
  font-weight: 700;
}

.megamenu-column ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 10px;
}

.megamenu-column a {
  display: flex;
  padding: 8px 10px;
  border-radius: 12px;
  color: var(--preview-text);
  font-weight: 600;
}

.megamenu-column a:hover {
  background: white;
  text-decoration: none;
}

@media (max-width: 680px) {
  .megamenu-columns {
    grid-template-columns: 1fr;
  }
}
`,
	presentation: "hidden-code",
	variant: "canonical",
};
