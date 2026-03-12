import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="reset-container">
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

  <a href="/login" class="back-link">Back to sign in</a>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
