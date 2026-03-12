import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="auth-container">
  <h1>Sign in</h1>

  <div class="social-login">
    <button type="button" class="social-btn google" onclick="loginWith('google')">
      <svg class="social-icon" aria-hidden="true"><!-- Google icon --></svg>
      Continue with Google
    </button>

    <button type="button" class="social-btn apple" onclick="loginWith('apple')">
      <svg class="social-icon" aria-hidden="true"><!-- Apple icon --></svg>
      Continue with Apple
    </button>

    <button type="button" class="social-btn github" onclick="loginWith('github')">
      <svg class="social-icon" aria-hidden="true"><!-- GitHub icon --></svg>
      Continue with GitHub
    </button>
  </div>

  <div class="divider"><span>or continue with email</span></div>

  <form action="/api/auth/login" method="POST">
    <!-- Email login form -->
  </form>
</div>

<script>
  function loginWith(provider) {
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: CLIENT_IDS[provider],
      redirect_uri: \`\${window.location.origin}/api/auth/\${provider}/callback\`,
      response_type: 'code',
      scope: SCOPES[provider],
      state: state
    });

    window.location.href = \`\${AUTH_URLS[provider]}?\${params}\`;
  }
</script>`,
	presentation: "hidden-code",
	variant: "canonical",
};
