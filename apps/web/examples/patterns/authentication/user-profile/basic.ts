import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="profile-page">
  <div class="profile-header">
    <div class="avatar-container">
      <img
        src="/avatars/jane-doe.jpg"
        alt="Jane Doe's profile picture"
        class="avatar"
        width="96"
        height="96"
      />
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
	presentation: "hidden-code",
	variant: "canonical",
};
