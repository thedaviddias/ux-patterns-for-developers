import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<div class="demo-shell card comment-card">\n  <label for="comment-box">Add a comment</label>\n  <textarea id="comment-box" rows="4" placeholder="Share context or ask a follow-up question."></textarea>\n  <button type="button">Post comment</button>\n  <article class="thread-item">\n    <strong>Jordan</strong>\n    <p class="muted">We should show the error summary only after submit, not on every keypress.</p>\n  </article>\n</div>',
	css: ".comment-card { padding: 20px; display: grid; gap: 12px; }\nlabel { font-weight: 600; }\ntextarea { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; resize: vertical; }\nbutton { width: fit-content; border: 0; border-radius: 12px; padding: 10px 14px; background: #0f172a; color: white; }\n.thread-item { padding-top: 12px; border-top: 1px solid #e2e8f0; }\np { margin: 6px 0 0; }",
	js: "",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
