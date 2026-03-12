import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="settings-layout">
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
	presentation: "hidden-code",
	variant: "canonical",
};
