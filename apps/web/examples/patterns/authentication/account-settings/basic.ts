import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="settings-layout preview-card">
  <nav class="settings-nav" aria-label="Account settings">
    <ul>
      <li><a href="#general" aria-current="true">General</a></li>
      <li><a href="#security">Security</a></li>
      <li><a href="#notifications">Notifications</a></li>
      <li><a href="#danger">Danger zone</a></li>
    </ul>
  </nav>

  <main class="settings-content">
    <section id="general" class="settings-section">
      <h2>General</h2>

      <form class="settings-form" data-section="general">
        <div class="form-field">
          <label for="display-name">Display name</label>
          <input type="text" id="display-name" name="name" value="Jane Doe" autocomplete="name" />
        </div>

        <div class="form-field">
          <label for="email">Email address</label>
          <input type="email" id="email" name="email" value="jane@example.com" autocomplete="email" />
          <p class="field-hint">Changing your email requires verification.</p>
        </div>

        <div class="form-field">
          <label for="language">Language</label>
          <select id="language" name="language">
            <option value="en" selected>English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="save-btn" disabled>Save changes</button>
          <span class="save-status" role="status" aria-live="polite"></span>
        </div>
      </form>
    </section>

    <section id="security" class="settings-section">
      <h2>Security</h2>

      <div class="settings-item">
        <div class="settings-item-info">
          <h3>Password</h3>
          <p>Last changed 3 months ago</p>
        </div>
        <button type="button" class="action-btn">Change password</button>
      </div>

      <div class="settings-item">
        <div class="settings-item-info">
          <h3>Two-factor authentication</h3>
          <p class="status-badge enabled">Enabled</p>
        </div>
        <button type="button" class="action-btn">Manage</button>
      </div>
    </section>

    <section id="danger" class="settings-section danger-zone">
      <h2>Danger zone</h2>
      <div class="settings-item">
        <div class="settings-item-info">
          <h3>Delete account</h3>
          <p>Permanently delete your account and all associated data.</p>
        </div>
        <button type="button" class="danger-btn">Delete account</button>
      </div>
    </section>
  </main>
</div>`,
	css: `.settings-layout {
  max-width: 900px;
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 20px;
  padding: 20px;
}

.settings-nav ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 8px;
}

.settings-nav a {
  display: flex;
  padding: 10px 12px;
  border-radius: 12px;
  color: var(--preview-muted);
  font-weight: 700;
}

.settings-nav a[aria-current="true"] {
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}

.settings-content {
  display: grid;
  gap: 16px;
}

.settings-section {
  display: grid;
  gap: 14px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.72);
}

.settings-form,
.form-field {
  display: grid;
  gap: 8px;
}

.field-hint {
  color: var(--preview-muted);
  font-size: 0.88rem;
}

.form-actions,
.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.save-btn,
.action-btn,
.danger-btn {
  min-height: 44px;
  padding: 11px 15px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  font-weight: 700;
  background: rgba(255, 255, 255, 0.9);
}

.save-btn:not(:disabled) {
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
  color: white;
  border-color: #1d4ed8;
}

.danger-btn {
  background: #fff5f5;
  color: #b91c1c;
  border-color: #fecaca;
}

.settings-item {
  padding: 14px;
  border-radius: 16px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.7);
}

.settings-item-info {
  display: grid;
  gap: 4px;
}

.status-badge.enabled {
  color: var(--preview-success);
  font-weight: 700;
}

@media (max-width: 720px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }
}
`,
	js: `const settingsForm = document.querySelector(".settings-form");
const saveButton = settingsForm.querySelector(".save-btn");
const saveStatus = settingsForm.querySelector(".save-status");

settingsForm.querySelectorAll("input, select").forEach((field) => {
  field.addEventListener("input", () => {
    saveButton.disabled = false;
    saveStatus.textContent = "Unsaved changes";
  });

  field.addEventListener("change", () => {
    saveButton.disabled = false;
    saveStatus.textContent = "Unsaved changes";
  });
});

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveStatus.textContent = "Changes saved";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
