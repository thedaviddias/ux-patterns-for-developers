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
	presentation: "hidden-code",
	variant: "canonical",
};
