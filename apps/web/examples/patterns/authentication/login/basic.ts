import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="login-container">
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

  <div class="divider"><span>or continue with</span></div>

  <div class="social-buttons">
    <button type="button" class="social-btn">Google</button>
    <button type="button" class="social-btn">GitHub</button>
  </div>

  <p class="signup-link">
    Don't have an account? <a href="/signup">Create one</a>
  </p>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
