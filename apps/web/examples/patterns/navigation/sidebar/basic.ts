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
        <li><a href="/dashboard" aria-current="page" data-short="D">Dashboard</a></li>
        <li><a href="/projects" data-short="P">Projects</a></li>
        <li><a href="/analytics" data-short="A">Analytics</a></li>
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
        <li><a href="/settings/general" data-short="G">General</a></li>
        <li><a href="/settings/team" data-short="T">Team</a></li>
        <li><a href="/settings/billing" data-short="B">Billing</a></li>
      </ul>
    </div>
  </nav>

  <div class="sidebar-footer">
    <a href="/settings/profile" data-short="Pr">Profile</a>
    <a href="/help" data-short="H">Help</a>
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
	css: `.sidebar {
  width: min(100%, 290px);
  min-height: 420px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--preview-shadow);
}

.sidebar-header,
.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-header {
  justify-content: space-between;
}

.sidebar-logo {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--preview-text);
}

.sidebar-collapse-toggle,
.sidebar-section-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--preview-border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.78);
}

.sidebar-collapse-toggle {
  width: 42px;
  height: 42px;
}

.sidebar-nav {
  display: grid;
  gap: 16px;
  flex: 1;
}

.sidebar-section {
  display: grid;
  gap: 10px;
}

.sidebar-section-heading {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--preview-muted);
}

.sidebar-section-toggle {
  width: 100%;
  justify-content: space-between;
  padding: 10px 12px;
  font-weight: 700;
}

.sidebar-section ul {
  display: grid;
  gap: 6px;
  list-style: none;
  padding: 0;
}

.sidebar-section a,
.sidebar-footer a {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 10px 12px;
  border-radius: 12px;
  color: var(--preview-muted);
  font-weight: 600;
}

.sidebar-section a[aria-current="page"] {
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}

.sidebar-section a:hover,
.sidebar-footer a:hover,
.sidebar-section-toggle:hover {
  background: rgba(219, 234, 254, 0.5);
  text-decoration: none;
}

.sidebar-footer {
  justify-content: space-between;
}

.sidebar.is-collapsed {
  width: 96px;
}

.sidebar.is-collapsed .sidebar-logo,
.sidebar.is-collapsed .sidebar-section-heading,
.sidebar.is-collapsed .sidebar-section-toggle span:first-child {
  display: none;
}

.sidebar.is-collapsed .sidebar-section-toggle {
  justify-content: center;
}

.sidebar.is-collapsed .sidebar-section a,
.sidebar.is-collapsed .sidebar-footer a {
  justify-content: center;
  font-size: 0;
}

.sidebar.is-collapsed .sidebar-section a::before,
.sidebar.is-collapsed .sidebar-footer a::before {
  content: attr(data-short);
  font-size: 0.78rem;
  color: var(--preview-text);
  font-weight: 800;
}
`,
	presentation: "hidden-code",
	variant: "canonical",
};
