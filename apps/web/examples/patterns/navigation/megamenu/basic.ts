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
	presentation: "hidden-code",
	variant: "canonical",
};
