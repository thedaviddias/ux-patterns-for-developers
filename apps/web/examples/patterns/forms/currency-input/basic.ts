import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card currency-input">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Currency</span>
      <h2 class="preview-title">Checkout amount</h2>
    </div>
    <span id="amount-output" class="preview-badge">$0.00</span>
  </div>

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
  <p class="preview-help">Formatting applies on blur to avoid disrupting typing.</p>
</div>`,
	css: `.currency-input {
  max-width: 420px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.currency-input__wrapper {
  position: relative;
}

.currency-input__symbol {
  position: absolute;
  inset: 12px auto auto 14px;
  color: var(--preview-muted);
  font-weight: 700;
}

.currency-input__field {
  padding-left: 34px;
}
`,
	js: `const currencyInput = document.getElementById("amount");
const amountOutput = document.getElementById("amount-output");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function parseCurrencyValue(value) {
  const numericValue = value.replace(/[^\\d.]/g, "");
  return numericValue ? Number(numericValue) : 0;
}

currencyInput.addEventListener("input", () => {
  currencyInput.value = currencyInput.value.replace(/[^\\d.]/g, "");
  amountOutput.textContent = currencyFormatter.format(parseCurrencyValue(currencyInput.value));
});

currencyInput.addEventListener("blur", () => {
  currencyInput.value = parseCurrencyValue(currencyInput.value)
    ? currencyFormatter.format(parseCurrencyValue(currencyInput.value))
    : "";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
