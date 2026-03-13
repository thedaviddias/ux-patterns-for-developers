import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="reset-container preview-card">
  <h1>Reset your password</h1>
  <p>Enter your email address and we'll send you a link to reset your password.</p>

  <form action="/api/auth/forgot-password" method="POST" novalidate>
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

    <button type="submit" class="reset-btn">Send reset link</button>
  </form>
  <p id="reset-status" class="preview-help">The reset link should explain what happens next.</p>

  <a href="/login" class="back-link">Back to sign in</a>
</div>`,
	css: `.reset-container {
  max-width: 460px;
  display: grid;
  gap: 16px;
  padding: 22px;
}

.reset-container h1 {
  font-size: 1.55rem;
}

.reset-container > p:first-of-type,
.back-link {
  color: var(--preview-muted);
}

.reset-container form,
.form-field {
  display: grid;
  gap: 8px;
}

.reset-btn {
  min-height: 44px;
  padding: 11px 15px;
  border-radius: 14px;
  border: 1px solid #1d4ed8;
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
  color: white;
  font-weight: 700;
}
`,
	js: `const resetForm = document.querySelector(".reset-container form");
const resetEmail = document.getElementById("email");
const resetStatus = document.getElementById("reset-status");

resetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resetStatus.textContent = "Reset link queued for " + resetEmail.value + ".";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
