import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: '<form class="demo-shell card validation-form" id="validation-form">\n  <label>Email<input id="email" type="email" placeholder="you@example.com" /></label>\n  <p class="helper">Use the address you want to sign in with.</p>\n  <label>Password<input id="password" type="password" placeholder="At least 8 characters" /></label>\n  <p id="form-status" class="helper" role="status" aria-live="polite"></p>\n  <button type="submit">Create account</button>\n</form>',
	css: ".validation-form { padding: 24px; display: grid; gap: 12px; }\nlabel { display: grid; gap: 8px; font-weight: 600; }\ninput { border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px 14px; }\nbutton { border: 0; border-radius: 12px; padding: 12px 16px; background: #0f172a; color: white; font-weight: 700; }\n.helper { margin: 0; font-size: 14px; color: #64748b; }\n.error { color: #b91c1c; }\n.success { color: #0f766e; }",
	js: "const form = document.getElementById('validation-form');\nconst status = document.getElementById('form-status');\nform.addEventListener('submit', (event) => {\n  event.preventDefault();\n  const email = document.getElementById('email').value.trim();\n  const password = document.getElementById('password').value;\n  if (!email.includes('@')) { status.textContent = 'Enter a valid email address.'; status.className = 'helper error'; return; }\n  if (password.length < 8) { status.textContent = 'Password must be at least 8 characters.'; status.className = 'helper error'; return; }\n  status.textContent = 'Everything looks good. You can continue safely.'; status.className = 'helper success';\n});",
	height: "460px",
	presentation: "hidden-code",
	variant: "canonical",
};
