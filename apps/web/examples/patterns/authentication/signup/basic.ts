import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="signup-container">
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

  <div class="divider"><span>or sign up with</span></div>

  <div class="social-buttons">
    <button type="button" class="social-btn">Google</button>
    <button type="button" class="social-btn">GitHub</button>
  </div>

  <p class="login-link">
    Already have an account? <a href="/login">Sign in</a>
  </p>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
