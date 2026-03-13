import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="signup-container preview-card">
  <h1>Create your account</h1>
  <p>Start your free trial. No credit card required.</p>

  <form action="/api/auth/register" method="POST" novalidate>
    <div class="form-field">
      <label for="name">Full name</label>
      <input
        type="text"
        id="name"
        name="name"
        autocomplete="name"
        aria-describedby="name-error"
      />
      <span id="name-error" class="field-error" role="alert" hidden></span>
    </div>

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
      <input
        type="password"
        id="password"
        name="password"
        autocomplete="new-password"
        required
        minlength="8"
        aria-describedby="password-hint password-error"
      />
      <div id="password-hint" class="password-requirements">
        At least 8 characters
      </div>
      <div class="password-strength" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="4" aria-label="Password strength">
        <div class="strength-bar"></div>
      </div>
      <span id="password-error" class="field-error" role="alert" hidden></span>
    </div>

    <div class="form-field terms">
      <label>
        <input type="checkbox" name="terms" required />
        I agree to the <a href="/terms" target="_blank">Terms of Service</a> and
        <a href="/privacy" target="_blank">Privacy Policy</a>
      </label>
    </div>

    <button type="submit" class="signup-btn">Create account</button>
  </form>
  <p id="signup-status" class="preview-help">Password strength updates as you type.</p>

  <div class="divider"><span>or sign up with</span></div>

  <div class="social-buttons">
    <button type="button" class="social-btn">Google</button>
    <button type="button" class="social-btn">GitHub</button>
  </div>

  <p class="login-link">
    Already have an account? <a href="/login">Sign in</a>
  </p>
</div>`,
	css: `.signup-container {
  max-width: 480px;
  display: grid;
  gap: 16px;
  padding: 22px;
}

.signup-container h1 {
  font-size: 1.6rem;
}

.signup-container > p:first-of-type {
  color: var(--preview-muted);
}

.signup-container form,
.form-field {
  display: grid;
  gap: 8px;
}

.password-requirements,
.terms {
  font-size: 0.9rem;
  color: var(--preview-muted);
}

.terms label {
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
  font-weight: 500;
}

.terms input {
  width: auto;
  margin-top: 3px;
}

.password-strength {
  height: 10px;
  border-radius: 999px;
  background: rgba(219, 228, 238, 0.9);
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  width: 0%;
  border-radius: inherit;
  background: linear-gradient(90deg, #f59e0b, #2563eb);
  transition: width 0.2s ease;
}

.signup-btn,
.social-btn {
  min-height: 44px;
  padding: 11px 15px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  font-weight: 700;
}

.signup-btn {
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
	js: `const signupForm = document.querySelector(".signup-container form");
const signupPassword = document.getElementById("password");
const signupStatus = document.getElementById("signup-status");
const strengthBar = document.querySelector(".strength-bar");
const strengthMeter = document.querySelector(".password-strength");

signupPassword.addEventListener("input", () => {
  const passwordValue = signupPassword.value;
  const passwordScore = [
    passwordValue.length >= 8,
    /\\d/.test(passwordValue),
    /[A-Z]/.test(passwordValue),
    /[^A-Za-z0-9]/.test(passwordValue)
  ].filter(Boolean).length;

  strengthBar.style.width = passwordScore * 25 + "%";
  strengthMeter.setAttribute("aria-valuenow", String(passwordScore));
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  signupStatus.textContent = "Account details look ready to submit.";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
