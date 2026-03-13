import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="login-container preview-card">
  <h1>Sign in</h1>
  <p>Welcome back. Enter your credentials to access your account.</p>

  <form action="/api/auth/login" method="POST" novalidate>
    <div class="form-field">
      <label for="email">Email address</label>
      <input
        type="email"
        id="email"
        name="email"
        autocomplete="email"
        required
        aria-describedby="email-error"
      />
      <span id="email-error" class="field-error" role="alert" hidden></span>
    </div>

    <div class="form-field">
      <label for="password">Password</label>
      <div class="password-wrapper">
        <input
          type="password"
          id="password"
          name="password"
          autocomplete="current-password"
          required
          aria-describedby="password-error"
        />
        <button type="button" class="password-toggle" aria-label="Show password">
          <span aria-hidden="true">👁</span>
        </button>
      </div>
      <span id="password-error" class="field-error" role="alert" hidden></span>
    </div>

    <div class="form-options">
      <label class="remember-me">
        <input type="checkbox" name="remember" />
        Remember me
      </label>
      <a href="/forgot-password">Forgot password?</a>
    </div>

    <button type="submit" class="login-btn">Sign in</button>
  </form>
  <p id="login-status" class="preview-help">Use the password toggle to confirm what you typed.</p>

  <div class="divider"><span>or continue with</span></div>

  <div class="social-buttons">
    <button type="button" class="social-btn">Google</button>
    <button type="button" class="social-btn">GitHub</button>
  </div>

  <p class="signup-link">
    Don't have an account? <a href="/signup">Create one</a>
  </p>
</div>`,
	css: `.login-container {
  max-width: 460px;
  display: grid;
  gap: 16px;
  padding: 22px;
}

.login-container h1 {
  font-size: 1.6rem;
}

.login-container > p:first-of-type {
  color: var(--preview-muted);
}

.login-container form,
.form-field {
  display: grid;
  gap: 8px;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 56px;
}

.password-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.86);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 0.92rem;
}

.remember-me {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.remember-me input {
  width: auto;
}

.login-btn,
.social-btn {
  min-height: 44px;
  padding: 11px 15px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  font-weight: 700;
}

.login-btn {
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
  border-color: #1d4ed8;
  color: white;
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.social-btn {
  background: rgba(255, 255, 255, 0.8);
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
	js: `const loginForm = document.querySelector(".login-container form");
const loginEmail = document.getElementById("email");
const loginPassword = document.getElementById("password");
const loginToggle = document.querySelector(".password-toggle");
const loginStatus = document.getElementById("login-status");

loginToggle.addEventListener("click", () => {
  const isPassword = loginPassword.type === "password";
  loginPassword.type = isPassword ? "text" : "password";
  loginToggle.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginStatus.textContent = "Signing in as " + loginEmail.value + ".";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
