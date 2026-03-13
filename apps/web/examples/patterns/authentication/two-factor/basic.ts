import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="tfa-setup preview-card">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Two-factor</span>
      <h2 class="preview-title">Set up your authenticator app</h2>
    </div>
    <span id="tfa-chip" class="preview-badge">Step 2 of 2</span>
  </div>

  <h2>Set up authenticator app</h2>
  <p>Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password).</p>

  <div class="qr-code-container">
    <div class="qr-code-placeholder" aria-label="QR code for authenticator app setup"></div>
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
  <p id="tfa-status" class="preview-help">Verification should confirm success without reloading the page.</p>
</div>`,
	css: `.tfa-setup {
  max-width: 520px;
  display: grid;
  gap: 16px;
  padding: 22px;
}

.tfa-setup > h2 {
  display: none;
}

.tfa-setup > p:first-of-type {
  color: var(--preview-muted);
}

.qr-code-container {
  display: grid;
  place-items: center;
}

.qr-code-placeholder {
  width: 152px;
  height: 152px;
  border-radius: 18px;
  border: 1px solid var(--preview-border);
  background:
    linear-gradient(90deg, #0f172a 12%, transparent 12%, transparent 24%, #0f172a 24%, #0f172a 36%, transparent 36%, transparent 48%, #0f172a 48%, #0f172a 60%, transparent 60%, transparent 72%, #0f172a 72%),
    linear-gradient(#0f172a 12%, transparent 12%, transparent 24%, #0f172a 24%, #0f172a 36%, transparent 36%, transparent 48%, #0f172a 48%, #0f172a 60%, transparent 60%, transparent 72%, #0f172a 72%);
  background-size: 42px 42px;
  background-position: center;
}

.manual-entry {
  border: 1px solid var(--preview-border);
  border-radius: 16px;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.7);
}

.manual-entry summary {
  cursor: pointer;
  font-weight: 700;
}

.secret-key {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(219, 234, 254, 0.64);
}

.copy-btn,
.verify-btn {
  min-height: 44px;
  padding: 11px 15px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  font-weight: 700;
}

.copy-btn {
  margin-left: 10px;
  background: rgba(255, 255, 255, 0.82);
}

.verify-btn {
  margin-top: 12px;
  background: linear-gradient(180deg, #2563eb, #1d4ed8);
  border-color: #1d4ed8;
  color: white;
}
`,
	js: `const tfaCopyButton = document.querySelector(".copy-btn");
const tfaSecret = document.querySelector(".secret-key").textContent;
const tfaStatus = document.getElementById("tfa-status");
const tfaForm = document.querySelector(".tfa-setup form");
const tfaCode = document.getElementById("totp-code");

tfaCopyButton.addEventListener("click", () => {
  tfaStatus.textContent = "Secret key copied for manual entry: " + tfaSecret + ".";
});

tfaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const codeValue = tfaCode.value.replace(/\\D/g, "");
  tfaStatus.textContent =
    codeValue.length === 6
      ? "Two-factor authentication enabled."
      : "Enter a valid 6-digit code.";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
