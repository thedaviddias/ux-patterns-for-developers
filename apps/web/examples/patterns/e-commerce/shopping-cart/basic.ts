import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell cart-demo">\n  <section class="card cart-items">\n    <div class="cart-row"><strong>Trail Runner</strong><span>$89</span></div>\n    <div class="cart-row"><strong>Carry Kit</strong><span>$39</span></div>\n    <button type="button">Continue to checkout</button>\n  </section>\n  <aside class="card summary">\n    <strong>Summary</strong>\n    <p class="muted">Subtotal $128 · Shipping free</p>\n  </aside>\n</div>',
	css: ".cart-demo { display: grid; gap: 16px; grid-template-columns: 1.6fr 1fr; }\n.cart-items, .summary { padding: 20px; display: grid; gap: 14px; }\n.cart-row { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }\nbutton { border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }\n@media (max-width: 720px) { .cart-demo { grid-template-columns: 1fr; } }",
	js: "",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
