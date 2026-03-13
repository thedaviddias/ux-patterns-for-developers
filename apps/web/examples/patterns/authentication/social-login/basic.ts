import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="auth-container preview-card">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Social login</span>
      <h1 class="preview-title">Continue with your preferred identity provider</h1>
    </div>
    <span id="social-login-chip" class="preview-badge">No provider chosen</span>
  </div>

  <h1>Sign in</h1>

  <div class="social-login">
    <button type="button" class="social-btn google" data-provider="Google">
      <span class="social-icon" aria-hidden="true">G</span>
      Continue with Google
    </button>

    <button type="button" class="social-btn apple" data-provider="Apple">
      <span class="social-icon" aria-hidden="true"></span>
      Continue with Apple
    </button>

    <button type="button" class="social-btn github" data-provider="GitHub">
      <span class="social-icon" aria-hidden="true">GH</span>
      Continue with GitHub
    </button>
  </div>

  <div class="divider"><span>or continue with email</span></div>

  <form action="/api/auth/login" method="POST" class="auth-form">
    <label for="social-login-email">Email address</label>
    <input type="email" id="social-login-email" autocomplete="email" placeholder="name@company.com" />
    <button type="submit" class="preview-button preview-button--primary">Continue with email</button>
  </form>
  <p id="social-login-status" class="preview-help">Choosing a provider should clearly communicate where the user is headed next.</p>
</div>`,
	css: `.auth-container {
  max-width: 520px;
  display: grid;
  gap: 16px;
  padding: 22px;
}

.auth-container > h1 {
  display: none;
}

.social-login {
  display: grid;
  gap: 10px;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-start;
  min-height: 48px;
  padding: 0 14px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.82);
  font-weight: 700;
}

.social-icon {
  width: 28px;
  height: 28px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(219, 234, 254, 0.7);
  color: var(--preview-primary-strong);
  font-size: 0.8rem;
}

.auth-form {
  display: grid;
  gap: 10px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--preview-muted);
  font-size: 0.88rem;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--preview-border);
}
`,
	js: `const socialLoginChip = document.getElementById("social-login-chip");
const socialLoginStatus = document.getElementById("social-login-status");

document.querySelectorAll(".social-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const provider = button.getAttribute("data-provider");
    socialLoginChip.textContent = provider;
    socialLoginStatus.textContent = "Would redirect to " + provider + " OAuth consent.";
  });
});

document.querySelector(".auth-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("social-login-email").value;
  socialLoginChip.textContent = "Email";
  socialLoginStatus.textContent = "Would continue with passwordless email for " + email + ".";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
