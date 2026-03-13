export type PatternExampleVariant = "canonical" | "advanced";

export type PatternExamplePresentation = "inline" | "collapsed" | "hidden-code";

export interface PatternExampleDefinition {
	html: string;
	css?: string;
	js?: string;
	height?: string;
	title?: string;
	description?: string;
	variant?: PatternExampleVariant;
	presentation?: PatternExamplePresentation;
}

export interface ResolvedPatternExampleDefinition
	extends PatternExampleDefinition {
	variant: PatternExampleVariant;
	presentation: PatternExamplePresentation;
}

export interface PatternExampleCodeTab {
	code: string;
	lang: "html" | "css" | "js";
	value: string;
}

export interface ComposePatternExampleDocumentOptions {
	autoResizeFrameId?: string;
}

export const PLAYGROUND_AUTO_RESIZE_SOURCE = "ux-patterns-playground";

const SHARED_PREVIEW_FOUNDATION_CSS = `
/* ux-patterns preview foundation */
:root {
	color-scheme: light;
	--preview-bg: #f3f5fb;
	--preview-bg-accent: #ffffff;
	--preview-panel: rgba(255, 255, 255, 0.82);
	--preview-panel-strong: rgba(255, 255, 255, 0.95);
	--preview-surface: rgba(255, 255, 255, 0.9);
	--preview-surface-strong: #ffffff;
	--preview-border: rgba(148, 163, 184, 0.22);
	--preview-border-strong: rgba(59, 130, 246, 0.35);
	--preview-text: #0f172a;
	--preview-text-soft: #1e293b;
	--preview-muted: #64748b;
	--preview-muted-strong: #475569;
	--preview-primary: #2563eb;
	--preview-primary-strong: #1d4ed8;
	--preview-primary-soft: rgba(37, 99, 235, 0.12);
	--preview-success: #059669;
	--preview-success-soft: rgba(5, 150, 105, 0.12);
	--preview-warning: #b45309;
	--preview-warning-soft: rgba(180, 83, 9, 0.14);
	--preview-danger: #dc2626;
	--preview-danger-soft: rgba(220, 38, 38, 0.12);
	--preview-shadow: 0 32px 90px rgba(15, 23, 42, 0.12);
	--preview-shadow-soft: 0 20px 48px rgba(15, 23, 42, 0.08);
	--preview-radius: 20px;
	--preview-radius-lg: 28px;
	--preview-grid-gap: 20px;
}

*,
*::before,
*::after {
	box-sizing: border-box;
}

html,
body {
	margin: 0;
	min-height: 100%;
}

body {
	font-family:
		"Inter",
		"Manrope",
		"Segoe UI",
		-apple-system,
		BlinkMacSystemFont,
		sans-serif;
	padding: clamp(16px, 3vw, 28px);
	background:
		radial-gradient(circle at top left, rgba(96, 165, 250, 0.14), transparent 30%),
		radial-gradient(circle at top right, rgba(14, 165, 233, 0.14), transparent 24%),
		linear-gradient(180deg, #f8fafc 0%, #eef2ff 48%, #f8fafc 100%);
	color: var(--preview-text);
	line-height: 1.5;
}

a {
	color: var(--preview-primary);
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

button,
input,
select,
textarea {
	font: inherit;
	color: inherit;
}

button {
	cursor: pointer;
}

button:disabled {
	cursor: not-allowed;
	opacity: 0.55;
}

input,
select,
textarea {
	width: 100%;
	border: 1px solid var(--preview-border);
	border-radius: 14px;
	background: var(--preview-surface-strong);
	padding: 12px 14px;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease,
		background-color 0.2s ease;
}

input:focus,
select:focus,
textarea:focus,
button:focus-visible,
summary:focus-visible,
a:focus-visible {
	outline: none;
	box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
	border-color: var(--preview-primary);
}

img {
	display: block;
	max-width: 100%;
}

table {
	width: 100%;
	border-collapse: collapse;
}

h1,
h2,
h3,
h4,
p {
	margin: 0;
}

ul,
ol {
	margin: 0;
	padding-left: 1.2rem;
}

fieldset {
	margin: 0;
	padding: 0;
	border: 0;
}

code,
kbd {
	font-family:
		"SFMono-Regular",
		"SF Mono",
		ui-monospace,
		monospace;
}

dialog {
	border: 0;
	padding: 0;
	background: transparent;
	max-width: min(540px, calc(100vw - 32px));
}

dialog::backdrop {
	background: rgba(15, 23, 42, 0.45);
}

.preview-frame {
	position: relative;
	overflow: hidden;
	border: 1px solid var(--preview-border);
	border-radius: var(--preview-radius-lg);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(248, 250, 252, 0.9)),
		var(--preview-bg);
	box-shadow: var(--preview-shadow);
}

.preview-frame::before {
	content: "";
	position: absolute;
	inset: 0;
	background:
		radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 28%),
		radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.08), transparent 32%);
	pointer-events: none;
}

.preview-frame__chrome {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 14px 18px;
	border-bottom: 1px solid var(--preview-border);
	background: rgba(255, 255, 255, 0.74);
	backdrop-filter: blur(18px);
}

.preview-frame__chrome-main {
	display: flex;
	align-items: center;
	gap: 14px;
	min-width: 0;
}

.preview-frame__traffic {
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

.preview-frame__traffic span {
	display: block;
	width: 10px;
	height: 10px;
	border-radius: 999px;
}

.preview-frame__traffic span:nth-child(1) {
	background: #fb7185;
}

.preview-frame__traffic span:nth-child(2) {
	background: #fbbf24;
}

.preview-frame__traffic span:nth-child(3) {
	background: #34d399;
}

.preview-frame__meta {
	display: grid;
	gap: 2px;
	min-width: 0;
}

.preview-frame__eyebrow {
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--preview-muted);
}

.preview-frame__title {
	font-size: 0.95rem;
	font-weight: 700;
	color: var(--preview-text-soft);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.preview-frame__chrome-end {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	color: var(--preview-muted-strong);
}

.preview-frame__status {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 7px 12px;
	border-radius: 999px;
	background: rgba(15, 23, 42, 0.06);
	font-size: 0.8rem;
	font-weight: 700;
}

.preview-frame__status::before {
	content: "";
	width: 8px;
	height: 8px;
	border-radius: 999px;
	background: var(--preview-success);
	box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.12);
}

.preview-frame__workspace {
	position: relative;
	z-index: 1;
	display: grid;
	grid-template-columns: 220px minmax(0, 1fr);
	min-height: 100%;
}

.preview-frame__rail {
	display: grid;
	align-content: start;
	gap: 18px;
	padding: 18px 16px 24px;
	border-right: 1px solid var(--preview-border);
	background:
		linear-gradient(180deg, rgba(255, 255, 255, 0.48), rgba(248, 250, 252, 0.7)),
		var(--preview-panel);
}

.preview-frame__rail-section {
	display: grid;
	gap: 8px;
}

.preview-frame__rail-label {
	font-size: 0.72rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	color: var(--preview-muted);
}

.preview-frame__nav {
	display: grid;
	gap: 8px;
}

.preview-frame__nav-item {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px 12px;
	border: 1px solid transparent;
	border-radius: 14px;
	color: var(--preview-muted-strong);
	font-size: 0.92rem;
	font-weight: 600;
}

.preview-frame__nav-item::before {
	content: "";
	width: 7px;
	height: 7px;
	border-radius: 999px;
	background: rgba(100, 116, 139, 0.28);
}

.preview-frame__nav-item--active {
	border-color: rgba(37, 99, 235, 0.16);
	background: rgba(37, 99, 235, 0.08);
	color: var(--preview-primary-strong);
}

.preview-frame__nav-item--active::before {
	background: var(--preview-primary);
}

.preview-frame__rail-card {
	display: grid;
	gap: 10px;
	padding: 14px;
	border: 1px solid var(--preview-border);
	border-radius: 16px;
	background: var(--preview-panel-strong);
	box-shadow: var(--preview-shadow-soft);
}

.preview-frame__rail-card strong {
	font-size: 0.9rem;
}

.preview-frame__rail-card p {
	font-size: 0.84rem;
	color: var(--preview-muted);
}

.preview-frame__canvas {
	display: grid;
	align-content: start;
	gap: var(--preview-grid-gap);
	padding: clamp(18px, 3vw, 30px);
	background:
		radial-gradient(circle at top right, rgba(255, 255, 255, 0.88), transparent 36%),
		linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(248, 250, 252, 0.72));
}

.preview-frame__canvas > * {
	min-width: 0;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.demo-shell {
	width: min(100%, 960px);
	margin: 0 auto;
	display: grid;
	gap: var(--preview-grid-gap);
	align-content: start;
}

.card,
.preview-card {
	background: var(--preview-surface);
	border: 1px solid var(--preview-border);
	border-radius: var(--preview-radius);
	box-shadow: var(--preview-shadow);
	backdrop-filter: blur(16px);
}

.card {
	padding: 20px;
}

.muted,
.preview-muted {
	color: var(--preview-muted);
}

.preview-grid {
	display: grid;
	gap: 16px;
}

.preview-stack {
	display: grid;
	gap: 14px;
}

.preview-shell {
	display: grid;
	gap: 18px;
	padding: 20px;
	border: 1px solid var(--preview-border);
	border-radius: 18px;
	background: var(--preview-panel-strong);
	box-shadow: var(--preview-shadow-soft);
}

.preview-toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
	flex-wrap: wrap;
}

.preview-toolbar__group {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
}

.preview-chip {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 7px 12px;
	border: 1px solid var(--preview-border);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.84);
	color: var(--preview-muted-strong);
	font-size: 0.82rem;
	font-weight: 600;
}

.preview-chip--active {
	border-color: rgba(37, 99, 235, 0.18);
	background: var(--preview-primary-soft);
	color: var(--preview-primary-strong);
}

.preview-chip--success {
	background: var(--preview-success-soft);
	color: var(--preview-success);
}

.preview-chip--warning {
	background: var(--preview-warning-soft);
	color: var(--preview-warning);
}

.preview-chip--danger {
	background: var(--preview-danger-soft);
	color: var(--preview-danger);
}

.preview-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
}

.preview-title {
	font-size: 1.1rem;
	font-weight: 700;
}

.preview-eyebrow {
	color: var(--preview-muted);
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.preview-muted {
	color: var(--preview-muted);
}

.preview-badge {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 6px 10px;
	border-radius: 999px;
	border: 1px solid rgba(37, 99, 235, 0.14);
	background: var(--preview-primary-soft);
	color: var(--preview-primary-strong);
	font-size: 0.78rem;
	font-weight: 700;
}

.preview-badge--subtle {
	border-color: var(--preview-border);
	background: rgba(255, 255, 255, 0.82);
	color: var(--preview-muted-strong);
}

.preview-note {
	border: 1px dashed var(--preview-border);
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.72);
	padding: 12px 14px;
	color: var(--preview-muted);
}

.preview-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	min-height: 44px;
	padding: 11px 15px;
	border: 1px solid var(--preview-border);
	border-radius: 14px;
	background: var(--preview-surface-strong);
	font-weight: 600;
	transition:
		transform 0.16s ease,
		border-color 0.16s ease,
		background-color 0.16s ease,
		box-shadow 0.16s ease;
}

.preview-button:hover {
	border-color: var(--preview-primary);
	transform: translateY(-1px);
	box-shadow: var(--preview-shadow-soft);
}

.preview-button--primary {
	background: linear-gradient(180deg, #2563eb, #1d4ed8);
	border-color: #1d4ed8;
	color: white;
}

.preview-button--ghost {
	background: rgba(255, 255, 255, 0.74);
}

.preview-button--danger {
	background: #fff5f5;
	border-color: #fecaca;
	color: #b91c1c;
}

.preview-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 12px;
}

.preview-divider {
	display: flex;
	align-items: center;
	gap: 12px;
	color: var(--preview-muted);
	font-size: 0.88rem;
}

.preview-divider::before,
.preview-divider::after {
	content: "";
	flex: 1;
	height: 1px;
	background: var(--preview-border);
}

.preview-list {
	list-style: none;
	padding: 0;
	display: grid;
	gap: 10px;
}

.preview-list > li {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 10px 12px;
	border-radius: 14px;
	border: 1px solid rgba(219, 228, 238, 0.9);
	background: rgba(255, 255, 255, 0.82);
}

.preview-field {
	display: grid;
	gap: 8px;
}

.preview-panel {
	display: grid;
	gap: 14px;
	padding: 16px;
	border: 1px solid var(--preview-border);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.82);
	box-shadow: var(--preview-shadow-soft);
}

.preview-panel--muted {
	background: rgba(248, 250, 252, 0.9);
}

.preview-split {
	display: grid;
	gap: 18px;
	grid-template-columns: minmax(0, 1.4fr) minmax(240px, 0.86fr);
}

.preview-table-wrap {
	overflow: auto;
	border: 1px solid var(--preview-border);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.86);
}

.preview-table thead {
	background: rgba(15, 23, 42, 0.04);
}

.preview-table th,
.preview-table td {
	padding: 12px 14px;
	border-bottom: 1px solid rgba(148, 163, 184, 0.16);
	text-align: left;
	font-size: 0.92rem;
}

.preview-table tbody tr:last-child td {
	border-bottom: 0;
}

.preview-kpi-grid {
	display: grid;
	gap: 14px;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.preview-kpi {
	display: grid;
	gap: 8px;
	padding: 16px;
	border: 1px solid var(--preview-border);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.82);
	box-shadow: var(--preview-shadow-soft);
}

.preview-kpi strong {
	font-size: 1.4rem;
	line-height: 1;
}

.preview-composer {
	display: grid;
	gap: 14px;
	padding: 16px;
	border: 1px solid var(--preview-border);
	border-radius: 20px;
	background: rgba(255, 255, 255, 0.84);
	box-shadow: var(--preview-shadow-soft);
}

.preview-response {
	display: grid;
	gap: 14px;
	padding: 18px;
	border: 1px solid var(--preview-border);
	border-radius: 20px;
	background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.9));
	box-shadow: var(--preview-shadow-soft);
}

.preview-help {
	font-size: 0.88rem;
	color: var(--preview-muted);
}

.preview-status--success {
	background: var(--preview-success-soft);
	color: var(--preview-success);
}

.preview-status--warning {
	background: var(--preview-warning-soft);
	color: var(--preview-warning);
}

.preview-status--danger {
	background: var(--preview-danger-soft);
	color: var(--preview-danger);
}

@media (max-width: 900px) {
	.preview-frame__workspace {
		grid-template-columns: 1fr;
	}

	.preview-frame__rail {
		display: none;
	}
}

@media (max-width: 720px) {
	.preview-frame {
		border-radius: 22px;
	}

	.preview-frame__chrome {
		padding: 12px 14px;
	}

	.preview-frame__chrome-end {
		display: none;
	}

	.preview-frame__canvas {
		padding: 16px;
	}

	.preview-split {
		grid-template-columns: 1fr;
	}
}
`.trim();

export function resolvePatternExample(
	example: PatternExampleDefinition,
	exampleName = "basic",
): ResolvedPatternExampleDefinition {
	const variant =
		example.variant ?? (exampleName === "basic" ? "canonical" : "advanced");
	const presentation =
		example.presentation ?? (variant === "canonical" ? "inline" : "collapsed");

	return {
		...example,
		presentation,
		variant,
	};
}

function escapeClosingTag(content: string, tagName: "script" | "style") {
	const pattern = new RegExp(`</${tagName}`, "gi");
	return content.replace(pattern, `<\\/${tagName}`);
}

function escapeHtml(content: string) {
	return content
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

function composePatternExampleHtml(example: PatternExampleDefinition) {
	const content = example.html.trim();

	if (content.includes("data-preview-root")) {
		return content;
	}

	const title = escapeHtml(example.title?.trim() || "Interactive pattern");

	return [
		'<div class="preview-frame" data-preview-root>',
		'<div class="preview-frame__chrome">',
		'<div class="preview-frame__chrome-main">',
		'<div class="preview-frame__traffic" aria-hidden="true"><span></span><span></span><span></span></div>',
		'<div class="preview-frame__meta">',
		'<span class="preview-frame__eyebrow">Product Preview</span>',
		`<span class="preview-frame__title">${title}</span>`,
		"</div>",
		"</div>",
		'<div class="preview-frame__chrome-end" aria-hidden="true">',
		'<span class="preview-frame__status">Live surface</span>',
		"</div>",
		"</div>",
		'<div class="preview-frame__workspace">',
		'<aside class="preview-frame__rail" aria-hidden="true">',
		'<div class="preview-frame__rail-section">',
		'<span class="preview-frame__rail-label">Workspace</span>',
		'<div class="preview-frame__nav">',
		'<div class="preview-frame__nav-item">Overview</div>',
		'<div class="preview-frame__nav-item preview-frame__nav-item--active">Current pattern</div>',
		'<div class="preview-frame__nav-item">States</div>',
		'<div class="preview-frame__nav-item">Usage</div>',
		"</div>",
		"</div>",
		'<div class="preview-frame__rail-card">',
		"<strong>Design system ready</strong>",
		"<p>Examples sit inside a realistic product shell so the interaction reads in context.</p>",
		"</div>",
		"</aside>",
		'<main class="preview-frame__canvas">',
		content,
		"</main>",
		"</div>",
		"</div>",
	].join("");
}

function composePatternExampleStyles(example: PatternExampleDefinition) {
	const styles = [SHARED_PREVIEW_FOUNDATION_CSS];

	if (example.css?.trim()) {
		styles.push(example.css.trim());
	}

	return styles.join("\n\n");
}

export function composePatternExampleMarkup(
	example: PatternExampleDefinition,
): string {
	const sections = [
		`<style>\n${escapeClosingTag(composePatternExampleStyles(example), "style")}\n</style>`,
		composePatternExampleHtml(example),
		example.js ? `<script>\n${example.js.trim()}\n</script>` : null,
	].filter(Boolean);

	return sections.join("\n\n");
}

export function composePatternExampleDocument(
	example: PatternExampleDefinition,
	options: ComposePatternExampleDocumentOptions = {},
): string {
	const css = `<style>${escapeClosingTag(
		composePatternExampleStyles(example),
		"style",
	)}</style>`;
	const js = example.js
		? `<script>${escapeClosingTag(example.js.trim(), "script")}</script>`
		: "";
	const autoResizeBridge = options.autoResizeFrameId
		? `<script>${escapeClosingTag(
				createAutoResizeBridgeScript(options.autoResizeFrameId),
				"script",
			)}</script>`
		: "";

	return [
		"<!doctype html>",
		'<html lang="en">',
		"<head>",
		'<meta charset="utf-8" />',
		'<meta name="viewport" content="width=device-width, initial-scale=1" />',
		css,
		"</head>",
		"<body>",
		composePatternExampleHtml(example),
		js,
		autoResizeBridge,
		"</body>",
		"</html>",
	]
		.filter(Boolean)
		.join("");
}

function createAutoResizeBridgeScript(frameId: string): string {
	return `
(() => {
	const source = ${JSON.stringify(PLAYGROUND_AUTO_RESIZE_SOURCE)};
	const frameId = ${JSON.stringify(frameId)};
	let lastHeight = 0;

	const measureHeight = () =>
		Math.max(
			document.documentElement?.scrollHeight ?? 0,
			document.body?.scrollHeight ?? 0,
		);

	const postHeight = () => {
		const height = measureHeight();
		if (!height || height === lastHeight) {
			return;
		}

		lastHeight = height;
		window.parent.postMessage({ source, frameId, height }, "*");
	};

	const schedulePostHeight = () => {
		window.requestAnimationFrame(postHeight);
	};

	document.addEventListener("DOMContentLoaded", schedulePostHeight);
	window.addEventListener("load", schedulePostHeight);

	if (typeof ResizeObserver === "function") {
		const resizeObserver = new ResizeObserver(schedulePostHeight);
		if (document.documentElement) {
			resizeObserver.observe(document.documentElement);
		}
		if (document.body) {
			resizeObserver.observe(document.body);
		}
	}

	schedulePostHeight();
})();
	`.trim();
}

export function getPatternExampleCodeTabs(
	example: PatternExampleDefinition,
): PatternExampleCodeTab[] {
	const tabs: PatternExampleCodeTab[] = [
		{
			code: example.html.trim(),
			lang: "html",
			value: "html",
		},
	];

	if (example.css) {
		tabs.push({
			code: example.css.trim(),
			lang: "css",
			value: "css",
		});
	}

	if (example.js) {
		tabs.push({
			code: example.js.trim(),
			lang: "js",
			value: "js",
		});
	}

	return tabs;
}
