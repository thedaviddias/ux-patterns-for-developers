import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="tabs">
  <div role="tablist" aria-label="Product information">
    <button
      role="tab"
      id="tab-description"
      aria-selected="true"
      aria-controls="panel-description"
      tabindex="0"
    >
      Description
    </button>
    <button
      role="tab"
      id="tab-specs"
      aria-selected="false"
      aria-controls="panel-specs"
      tabindex="-1"
    >
      Specifications
    </button>
    <button
      role="tab"
      id="tab-reviews"
      aria-selected="false"
      aria-controls="panel-reviews"
      tabindex="-1"
    >
      Reviews
    </button>
  </div>

  <div
    role="tabpanel"
    id="panel-description"
    aria-labelledby="tab-description"
    tabindex="0"
  >
    <p>Product description content goes here.</p>
  </div>

  <div
    role="tabpanel"
    id="panel-specs"
    aria-labelledby="tab-specs"
    tabindex="0"
    hidden
  >
    <p>Technical specifications go here.</p>
  </div>

  <div
    role="tabpanel"
    id="panel-reviews"
    aria-labelledby="tab-reviews"
    tabindex="0"
    hidden
  >
    <p>Customer reviews go here.</p>
  </div>
</div>

<script>
  const tablist = document.querySelector('[role="tablist"]');
  const tabs = tablist.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  function activateTab(tab) {
    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });

    panels.forEach(p => p.setAttribute('hidden', ''));

    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.focus();

    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.removeAttribute('hidden');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));

    tab.addEventListener('keydown', (e) => {
      const index = Array.from(tabs).indexOf(tab);
      let newIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      activateTab(tabs[newIndex]);
    });
  });
</script>`,
	css: `.tabs {
  display: grid;
  gap: 16px;
}

[role="tablist"] {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--preview-shadow);
}

[role="tab"] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 10px 14px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--preview-muted);
  font-weight: 700;
}

[role="tab"][aria-selected="true"] {
  background: white;
  color: var(--preview-primary-strong);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

[role="tabpanel"] {
  padding: 20px;
  border-radius: 22px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--preview-shadow);
}

[role="tabpanel"] p {
  color: var(--preview-muted);
}
`,
	presentation: "hidden-code",
	variant: "canonical",
};
