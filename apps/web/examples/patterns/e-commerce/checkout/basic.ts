import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell checkout-demo">\n  <section class="card checkout-flow">\n    <ol class="steps"><li class="active">Shipping</li><li>Payment</li><li>Review</li></ol>\n    <div class="section-block"><strong>Shipping address</strong><p class="muted">123 Pattern Street, Toronto</p></div>\n    <button type="button">Continue to payment</button>\n  </section>\n  <aside class="card summary">\n    <strong>Order summary</strong>\n    <p class="muted">2 items · Free shipping · Total $128</p>\n  </aside>\n</div>',
	css: ".checkout-demo { display: grid; gap: 16px; grid-template-columns: 1.6fr 1fr; }\n.checkout-flow, .summary { padding: 20px; display: grid; gap: 14px; }\n.steps { display: flex; gap: 8px; list-style: none; padding: 0; margin: 0; }\n.steps li { padding: 8px 12px; border-radius: 999px; background: #e2e8f0; font-size: 13px; }\n.steps li.active { background: #0f172a; color: white; }\n.section-block { padding: 14px; border-radius: 12px; background: #f8fafc; }\nbutton { border: 0; border-radius: 12px; padding: 12px 14px; background: #0f172a; color: white; }\n@media (max-width: 720px) { .checkout-demo { grid-template-columns: 1fr; } }",
	js: "",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
