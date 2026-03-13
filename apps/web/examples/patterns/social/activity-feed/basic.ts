import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell">\n  <div class="card list-card">\n    <ul class="list">\n      <li>\n        <div>\n          <strong>Alex commented on “Signup review”</strong>\n          <p class="muted">Raised an accessibility concern about the final step labels.</p>\n        </div>\n        <span class="badge">5m ago</span>\n      </li>\n      <li>\n        <div>\n          <strong>Design library updated</strong>\n          <p class="muted">The button tokens were refreshed for the new brand palette.</p>\n        </div>\n        <span class="badge">22m ago</span>\n      </li>\n      <li>\n        <div>\n          <strong>New pattern published</strong>\n          <p class="muted">Image Upload is now available with a basic playground demo.</p>\n        </div>\n        <span class="badge">1h ago</span>\n      </li>\n    </ul>\n  </div>\n</div>',
	css: ".list-card { padding: 8px 0; }\n.list { list-style: none; margin: 0; padding: 0; }\nli { display: flex; gap: 16px; justify-content: space-between; align-items: start; padding: 18px 20px; border-bottom: 1px solid #e2e8f0; }\nli:last-child { border-bottom: 0; }\np { margin: 6px 0 0; font-size: 14px; line-height: 1.5; }\n.badge { padding: 6px 10px; border-radius: 999px; background: #e2e8f0; font-size: 12px; font-weight: 600; }",
	js: "",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
