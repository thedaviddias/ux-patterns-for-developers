import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="currency-input">
  <label for="amount">Amount</label>
  <div class="currency-input__wrapper">
    <span class="currency-input__symbol" aria-hidden="true">$</span>
    <input
      type="text"
      id="amount"
      name="amount"
      inputmode="decimal"
      placeholder="0.00"
      autocomplete="transaction-amount"
      aria-label="Amount in US dollars"
      class="currency-input__field"
    />
  </div>
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
