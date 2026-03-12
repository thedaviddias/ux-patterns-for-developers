import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<fieldset class="otp-field">
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
</fieldset>`,
	presentation: "hidden-code",
	variant: "canonical",
};
