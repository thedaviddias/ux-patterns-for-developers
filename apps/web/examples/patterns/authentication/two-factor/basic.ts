import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="tfa-setup">
  <h2>Set up authenticator app</h2>
  <p>Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password).</p>

  <div class="qr-code-container">
    <img src="/api/auth/2fa/qr" alt="QR code for authenticator app setup" />
  </div>

  <details class="manual-entry">
    <summary>Can't scan? Enter the code manually</summary>
    <code class="secret-key">JBSW Y3DP EHPK 3PXP</code>
    <button type="button" class="copy-btn" aria-label="Copy secret key">Copy</button>
  </details>

  <form action="/api/auth/2fa/verify-setup" method="POST">
    <label for="totp-code">Enter the 6-digit code from your app</label>
    <div class="code-input-group">
      <input
        type="text"
        id="totp-code"
        name="code"
        inputmode="numeric"
        pattern="[0-9]{6}"
        maxlength="6"
        autocomplete="one-time-code"
        required
        aria-describedby="code-error"
      />
      <span id="code-error" class="field-error" role="alert" hidden></span>
    </div>
    <button type="submit" class="verify-btn">Verify and enable</button>
  </form>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
