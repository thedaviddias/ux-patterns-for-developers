import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<fieldset class="otp-field preview-card">
  <legend>Enter your 4-digit code</legend>
  <div class="otp-field__group" role="group" aria-label="4-digit verification code">
    <input
      class="otp-field__digit"
      type="text"
      inputmode="numeric"
      pattern="[0-9]"
      maxlength="1"
      autocomplete="one-time-code"
      aria-label="Digit 1 of 4"
    />
    <input class="otp-field__digit" type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" aria-label="Digit 2 of 4" />
    <input class="otp-field__digit" type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" aria-label="Digit 3 of 4" />
    <input class="otp-field__digit" type="text" inputmode="numeric" pattern="[0-9]" maxlength="1" aria-label="Digit 4 of 4" />
  </div>
  <p id="otp-status" class="preview-help">Digits advance automatically as you type.</p>
</fieldset>`,
	css: `.otp-field {
  max-width: 420px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.otp-field legend {
  padding: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.otp-field__group {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.otp-field__digit {
  text-align: center;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}
`,
	js: `const otpInputs = Array.from(document.querySelectorAll(".otp-field__digit"));
const otpStatus = document.getElementById("otp-status");

otpInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\\D/g, "").slice(0, 1);

    if (input.value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }

    const value = otpInputs.map((item) => item.value).join("");
    otpStatus.textContent =
      value.length === otpInputs.length
        ? "Code ready: " + value
        : "Digits advance automatically as you type.";
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && !input.value && index > 0) {
      otpInputs[index - 1].focus();
    }
  });
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
