import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<aside class="sidebar" aria-label="Application navigation">
  <div class="sidebar-header">
    <a href="/" class="sidebar-logo">AppName</a>
    <button
      type="button"
      class="sidebar-collapse-toggle"
      aria-label="Collapse sidebar"
      aria-expanded="true"
    >
      <span aria-hidden="true">◀</span>
    </button>
  </div>

  <nav class="sidebar-nav">
    <div class="sidebar-section">
      <h3 class="sidebar-section-heading">Main</h3>
      <ul>
        <li><a href="/dashboard" aria-current="page">Dashboard</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/analytics">Analytics</a></li>
      </ul>
    </div>

    <div class="sidebar-section">
      <button
        type="button"
        class="sidebar-section-toggle"
        aria-expanded="true"
        aria-controls="settings-links"
      >
        <span>Settings</span>
        <span class="chevron" aria-hidden="true">▾</span>
      </button>
      <ul id="settings-links">
        <li><a href="/settings/general">General</a></li>
        <li><a href="/settings/team">Team</a></li>
        <li><a href="/settings/billing">Billing</a></li>
      </ul>
    </div>
  </nav>

  <div class="sidebar-footer">
    <a href="/settings/profile">Profile</a>
    <a href="/help">Help</a>
  </div>
</aside>

<script>
  document.querySelectorAll('.sidebar-section-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      const target = document.getElementById(toggle.getAttribute('aria-controls'));
      target.toggleAttribute('hidden');
    });
  });

  const collapseToggle = document.querySelector('.sidebar-collapse-toggle');
  const sidebar = document.querySelector('.sidebar');

  collapseToggle.addEventListener('click', () => {
    const isExpanded = collapseToggle.getAttribute('aria-expanded') === 'true';
    collapseToggle.setAttribute('aria-expanded', String(!isExpanded));
    sidebar.classList.toggle('is-collapsed');
    collapseToggle.setAttribute('aria-label',
      isExpanded ? 'Expand sidebar' : 'Collapse sidebar'
    );
  });
</script>`,
	presentation: "hidden-code",
	variant: "canonical",
};
