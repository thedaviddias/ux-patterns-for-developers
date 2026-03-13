import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="profile-page">
  <div class="profile-header">
    <div class="avatar-container">
      <div class="avatar" aria-hidden="true">JD</div>
    </div>

    <div class="profile-identity">
      <h1 class="profile-name">Jane Doe</h1>
      <p class="profile-role">Senior Frontend Engineer</p>
      <p class="profile-bio">
        Building accessible web experiences. Open source contributor.
        Based in San Francisco.
      </p>
      <div class="profile-meta">
        <span>📍 San Francisco, CA</span>
        <a href="https://janedoe.dev">janedoe.dev</a>
        <span>Joined March 2022</span>
      </div>
    </div>

    <div class="profile-actions">
      <button type="button" class="edit-btn">Edit profile</button>
    </div>
  </div>

  <div class="profile-stats">
    <div class="stat">
      <span class="stat-value">142</span>
      <span class="stat-label">Posts</span>
    </div>
    <div class="stat">
      <span class="stat-value">1.2k</span>
      <span class="stat-label">Followers</span>
    </div>
    <div class="stat">
      <span class="stat-value">89</span>
      <span class="stat-label">Following</span>
    </div>
  </div>

  <div class="profile-content">
    <h2>Recent Activity</h2>
    <ul class="activity-list">
      <li class="activity-item">
        <span class="activity-icon" aria-hidden="true">📝</span>
        <div>
          <p>Published <a href="/posts/accessibility-guide">Accessibility Guide for Developers</a></p>
          <time datetime="2026-03-10">2 days ago</time>
        </div>
      </li>
    </ul>
  </div>
</div>`,
	css: `.profile-page {
  max-width: 860px;
  display: grid;
  gap: 18px;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--preview-shadow);
}

.profile-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 18px;
  align-items: start;
}

.avatar {
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
  border-radius: 28px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  font-size: 2rem;
  font-weight: 800;
}

.profile-identity,
.profile-content {
  display: grid;
  gap: 8px;
}

.profile-role,
.profile-bio,
.profile-meta,
.activity-item time {
  color: var(--preview-muted);
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.9rem;
}

.edit-btn {
  min-height: 44px;
  padding: 11px 15px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.84);
  font-weight: 700;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.stat {
  display: grid;
  gap: 4px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid var(--preview-border);
  background: rgba(248, 250, 252, 0.9);
  text-align: center;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 800;
}

.stat-label {
  color: var(--preview-muted);
  font-size: 0.88rem;
}

.activity-list {
  list-style: none;
  padding: 0;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.78);
}

@media (max-width: 720px) {
  .profile-header {
    grid-template-columns: 1fr;
  }
}
`,
	js: `const editProfileButton = document.querySelector(".edit-btn");
const profileRole = document.querySelector(".profile-role");

editProfileButton.addEventListener("click", () => {
  const isEditing = editProfileButton.getAttribute("data-editing") === "true";
  editProfileButton.setAttribute("data-editing", String(!isEditing));
  editProfileButton.textContent = isEditing ? "Edit profile" : "Save changes";
  profileRole.textContent = isEditing
    ? "Senior Frontend Engineer"
    : "Senior Frontend Engineer · editing";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
