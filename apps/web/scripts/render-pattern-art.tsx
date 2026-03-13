import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import fg from "fast-glob";
import matter from "gray-matter";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
	MODAL_COVER_SIZE,
	MODAL_OG_SIZE,
	ModalCover,
	ModalScene,
	type ModalSceneVariant,
} from "../components/modal-og";
import { PATTERNS_MAP } from "../constants/patterns";
import {
	DEFAULT_PATTERN_COVER_COLOR,
	LEGACY_PATTERN_COVER_COLORS,
} from "../lib/pattern-cover-colors";

const execFileAsync = promisify(execFile);
const CHROME_BIN =
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

type Variant = "og" | "cover";
type PatternArg = "all" | string;
type SceneKind =
	| "modal"
	| "form"
	| "controls"
	| "navigation"
	| "data"
	| "auth"
	| "ai"
	| "media"
	| "feedback"
	| "commerce"
	| "social"
	| "content";

type PatternDoc = {
	categoryLabel: string;
	categorySlug: string;
	coverBackgroundColor: string;
	description: string;
	fullSlug: string;
	sceneKind: SceneKind;
	slug: string;
	status: string;
	summary: string;
	title: string;
};

type RenderArgs = {
	openPreview: boolean;
	outDir: string;
	pattern: PatternArg;
	variant: "both" | Variant;
	previewDir: string;
};

const CATEGORY_COVER_COLORS: Record<string, string> = {
	advanced: "#64748b",
	"ai-intelligence": "#80a7ff",
	authentication: "#bf6160",
	"content-management": "#ffb000",
	"data-display": "#ffb000",
	"e-commerce": "#ffb000",
	forms: "#edf3e6",
	media: "#64748b",
	navigation: "#80a7ff",
	social: "#e80058",
	"user-feedback": "#64748b",
};

const CATEGORY_ACCENT_COLORS: Record<string, string> = {
	advanced: "#98a4b7",
	"ai-intelligence": "#8c88ff",
	authentication: "#cf8078",
	"content-management": "#d7a241",
	"data-display": "#d9b64c",
	"e-commerce": "#d59a45",
	forms: "#7f9570",
	media: "#8796aa",
	navigation: "#89a7ff",
	social: "#ff5f97",
	"user-feedback": "#9aa7b6",
};

const SCENE_LAYOUTS: Record<
	SceneKind,
	{
		coverMinHeight: number;
		coverWidth: number;
		coverYOffset: number;
		ogWidth: number;
	}
> = {
	ai: { coverMinHeight: 420, coverWidth: 1360, coverYOffset: 28, ogWidth: 820 },
	auth: {
		coverMinHeight: 420,
		coverWidth: 1360,
		coverYOffset: 32,
		ogWidth: 820,
	},
	commerce: {
		coverMinHeight: 420,
		coverWidth: 1420,
		coverYOffset: 28,
		ogWidth: 820,
	},
	content: {
		coverMinHeight: 340,
		coverWidth: 1360,
		coverYOffset: 24,
		ogWidth: 800,
	},
	controls: {
		coverMinHeight: 260,
		coverWidth: 1440,
		coverYOffset: 56,
		ogWidth: 760,
	},
	data: {
		coverMinHeight: 420,
		coverWidth: 1460,
		coverYOffset: 24,
		ogWidth: 860,
	},
	feedback: {
		coverMinHeight: 320,
		coverWidth: 1360,
		coverYOffset: 28,
		ogWidth: 800,
	},
	form: {
		coverMinHeight: 420,
		coverWidth: 1360,
		coverYOffset: 32,
		ogWidth: 820,
	},
	media: {
		coverMinHeight: 430,
		coverWidth: 1460,
		coverYOffset: 22,
		ogWidth: 860,
	},
	modal: {
		coverMinHeight: 420,
		coverWidth: 1360,
		coverYOffset: 28,
		ogWidth: 820,
	},
	navigation: {
		coverMinHeight: 240,
		coverWidth: 1520,
		coverYOffset: 68,
		ogWidth: 820,
	},
	social: {
		coverMinHeight: 380,
		coverWidth: 1380,
		coverYOffset: 24,
		ogWidth: 820,
	},
};

function parseArgs(argv: string[]): RenderArgs {
	const args: RenderArgs = {
		openPreview: false,
		outDir: path.resolve(process.cwd(), "public"),
		pattern: "all",
		previewDir: path.resolve(process.cwd(), ".tmp/pattern-art"),
		variant: "both",
	};

	const positional: string[] = [];

	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];
		if (!token) continue;

		if (token === "--out-dir" && argv[index + 1]) {
			args.outDir = path.resolve(argv[index + 1] || args.outDir);
			index += 1;
			continue;
		}
		if (token === "--preview-dir" && argv[index + 1]) {
			args.previewDir = path.resolve(argv[index + 1] || args.previewDir);
			index += 1;
			continue;
		}
		if (token === "--pattern" && argv[index + 1]) {
			args.pattern = argv[index + 1] || args.pattern;
			index += 1;
			continue;
		}
		if (token === "--variant" && argv[index + 1]) {
			const value = argv[index + 1];
			if (value === "og" || value === "cover" || value === "both") {
				args.variant = value;
			}
			index += 1;
			continue;
		}
		if (token === "--open-preview") {
			args.openPreview = true;
			continue;
		}
		if (!token.startsWith("--")) {
			positional.push(token);
		}
	}

	if (positional[0]) {
		args.pattern = positional[0] || args.pattern;
	}
	if (positional[1]) {
		const value = positional[1];
		if (value === "og" || value === "cover" || value === "both") {
			args.variant = value;
		}
	}

	return args;
}

function slugToTitle(slug: string) {
	return slug
		.split("-")
		.map((part) => {
			if (part.toUpperCase() === "AI") return "AI";
			return part.charAt(0).toUpperCase() + part.slice(1);
		})
		.join(" ");
}

function trimLine(text: string, max = 48) {
	const collapsed = text.replace(/\s+/g, " ").trim();
	if (collapsed.length <= max) {
		return collapsed;
	}
	return `${collapsed.slice(0, max - 1).trimEnd()}…`;
}

async function fileToDataUrl(filePath: string, mimeType: string) {
	const buffer = await fs.readFile(filePath);
	return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

async function buildFontFaceCss(fontDir: string) {
	const fonts = [
		{ family: "Inter", fileName: "inter-400.ttf", weight: 400 },
		{ family: "Inter", fileName: "inter-500.ttf", weight: 500 },
		{ family: "Inter", fileName: "inter-700.ttf", weight: 700 },
		{ family: "Inter", fileName: "inter-800.ttf", weight: 800 },
	];

	const css = await Promise.all(
		fonts.map(async (font) => {
			const dataUrl = await fileToDataUrl(
				path.join(fontDir, font.fileName),
				"font/ttf",
			);
			return `@font-face{font-family:'${font.family}';src:url('${dataUrl}') format('truetype');font-style:normal;font-weight:${font.weight};font-display:block;}`;
		}),
	);

	return css.join("");
}

function inferSceneKind(
	doc: Pick<PatternDoc, "categorySlug" | "slug">,
): SceneKind {
	if (doc.slug === "modal") return "modal";

	if (
		[
			"button",
			"checkbox",
			"radio",
			"slider",
			"toggle",
			"rating-input",
			"color-picker",
			"signature-pad",
		].includes(doc.slug)
	) {
		return "controls";
	}

	if (
		[
			"autocomplete",
			"text-field",
			"textarea",
			"search-field",
			"password",
			"phone-number",
			"currency-input",
			"date-input",
			"time-input",
			"selection-input",
			"multi-select-input",
			"tag-input",
			"date-picker",
			"date-range",
			"file-input",
			"code-confirmation",
			"rich-text-editor",
			"prompt-input",
			"model-selector",
			"token-counter",
		].includes(doc.slug)
	) {
		return "form";
	}

	if (
		[
			"pagination",
			"tabs",
			"breadcrumb",
			"navigation-menu",
			"megamenu",
			"link",
			"back-to-top",
			"load-more",
			"sidebar",
			"hambuger-menu",
			"infinite-scroll",
		].includes(doc.slug)
	) {
		return "navigation";
	}

	if (
		[
			"table",
			"comparison-table",
			"dashboard",
			"statistics",
			"chart",
			"filter-panel",
			"list-view",
			"card-grid",
			"calendar",
			"timeline",
			"tree-view",
			"kanban-board",
			"search-results",
		].includes(doc.slug)
	) {
		return "data";
	}

	if (doc.categorySlug === "authentication") return "auth";
	if (doc.categorySlug === "ai-intelligence") return "ai";
	if (doc.categorySlug === "media") return "media";
	if (doc.categorySlug === "e-commerce") return "commerce";
	if (doc.categorySlug === "social") return "social";
	if (doc.categorySlug === "user-feedback") return "feedback";

	return "content";
}

async function getPatternDocs(): Promise<PatternDoc[]> {
	const files = await fg("content/patterns/*/*.mdx", {
		absolute: true,
		cwd: process.cwd(),
	});

	const docs = await Promise.all(
		files.map(async (filePath) => {
			const raw = await fs.readFile(filePath, "utf8");
			const { data } = matter(raw);
			const categorySlug = path.basename(path.dirname(filePath));
			const slug = path.basename(filePath, ".mdx");
			const category = PATTERNS_MAP[categorySlug as keyof typeof PATTERNS_MAP];
			const status = String(data.status || "complete");

			return {
				categoryLabel: category?.name || slugToTitle(categorySlug),
				categorySlug,
				coverBackgroundColor:
					LEGACY_PATTERN_COVER_COLORS[
						slug as keyof typeof LEGACY_PATTERN_COVER_COLORS
					] ||
					CATEGORY_COVER_COLORS[categorySlug] ||
					DEFAULT_PATTERN_COVER_COLOR,
				description: String(data.description || ""),
				fullSlug: `${categorySlug}/${slug}`,
				sceneKind: inferSceneKind({ categorySlug, slug }),
				slug,
				status,
				summary: String(data.summary || data.description || ""),
				title: String(data.title || slugToTitle(slug)),
			};
		}),
	);

	return docs.filter((doc) => {
		return doc.status === "complete" || doc.status === "published";
	});
}

function resolveRequestedDocs(pattern: PatternArg, docs: PatternDoc[]) {
	if (pattern === "all") {
		return docs;
	}

	const lowered = pattern.toLowerCase();
	const matches = docs.filter((doc) => {
		return (
			doc.slug.toLowerCase() === lowered ||
			doc.fullSlug.toLowerCase() === lowered
		);
	});

	if (matches.length === 0) {
		throw new Error(`No pattern matched "${pattern}".`);
	}

	return matches;
}

function buildDocument(params: {
	bodyMarkup: string;
	fontCss: string;
	height: number;
	width: number;
	background: string;
}) {
	return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      ${params.fontCss}
      html, body {
        margin: 0;
        width: ${params.width}px;
        height: ${params.height}px;
        overflow: hidden;
        background: ${params.background};
      }
      body, #root {
        display: flex;
        width: ${params.width}px;
        height: ${params.height}px;
      }
    </style>
  </head>
  <body>
    <div id="root">${params.bodyMarkup}</div>
  </body>
</html>`;
}

function createSurfaceCard(
	children: React.ReactNode,
	width: number,
	minHeight?: number,
) {
	return (
		<div
			style={{
				width,
				minHeight,
				display: "flex",
				flexDirection: "column",
				borderRadius: 28,
				border: "1px solid rgba(255,255,255,0.12)",
				backgroundColor: "rgba(16,16,16,0.96)",
				boxShadow:
					"0 30px 80px rgba(0,0,0,0.34), 0 0 0 1px rgba(255,255,255,0.03) inset",
				backdropFilter: "blur(14px)",
				overflow: "hidden",
			}}
		>
			{children}
		</div>
	);
}

function PlaceholderLine(props: { opacity?: number; width: string }) {
	return (
		<div
			style={{
				display: "flex",
				height: 14,
				width: props.width,
				borderRadius: 999,
				backgroundColor: `rgba(255,255,255,${props.opacity ?? 0.12})`,
			}}
		/>
	);
}

function GenericScene(props: {
	accentColor: string;
	doc: PatternDoc;
	gridDataUrl: string;
	variant: Variant;
}) {
	const isCover = props.variant === "cover";
	const layout = SCENE_LAYOUTS[props.doc.sceneKind];
	const size = isCover ? MODAL_COVER_SIZE : MODAL_OG_SIZE;
	const helperText = trimLine(
		props.doc.summary || props.doc.description || props.doc.title,
	);
	const sceneWidth = isCover ? layout.coverWidth : layout.ogWidth;

	return (
		<div
			style={{
				width: size.width,
				height: size.height,
				display: "flex",
				position: "relative",
				overflow: "hidden",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: isCover ? props.doc.coverBackgroundColor : "#050505",
				fontFamily:
					'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
				color: "#ffffff",
			}}
		>
			{isCover ? null : (
				<>
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							opacity: 0.88,
						}}
					>
						{/* biome-ignore lint/performance/noImgElement: static markup is rendered outside Next.js image optimization */}
						<img
							src={props.gridDataUrl}
							alt=""
							style={{
								display: "block",
								width: "100%",
								height: "100%",
								objectFit: "cover",
							}}
						/>
					</div>
					<div
						style={{
							position: "absolute",
							inset: 0,
							background: `radial-gradient(circle at 50% 64%, ${props.accentColor}26 0%, ${props.accentColor}14 18%, rgba(5,5,5,0) 58%)`,
						}}
					/>
				</>
			)}

			<div
				style={{
					position: "relative",
					zIndex: 1,
					display: "flex",
					width: "100%",
					height: size.height,
					boxSizing: "border-box",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: isCover ? "center" : "flex-start",
					paddingTop: isCover ? 0 : 54,
					paddingBottom: isCover ? 0 : 32,
					paddingLeft: isCover ? 132 : 48,
					paddingRight: isCover ? 132 : 48,
				}}
			>
				{isCover ? null : (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							textAlign: "center",
						}}
					>
						<div
							style={{
								display: "flex",
								fontSize: 15,
								fontWeight: 700,
								letterSpacing: "0.18em",
								textTransform: "uppercase",
								color: props.accentColor,
								marginBottom: 18,
							}}
						>
							{props.doc.categoryLabel}
						</div>
						<div
							style={{
								display: "flex",
								fontSize: 78,
								fontWeight: 800,
								letterSpacing: "-0.05em",
								lineHeight: 1,
								marginBottom: 14,
							}}
						>
							{props.doc.title}
						</div>
						<div
							style={{
								display: "flex",
								maxWidth: 760,
								fontSize: 24,
								lineHeight: 1.35,
								fontWeight: 400,
								color: "rgba(255,255,255,0.74)",
							}}
						>
							{helperText}
						</div>
					</div>
				)}

				<div
					style={{
						display: "flex",
						width: sceneWidth,
						alignItems: "center",
						justifyContent: "center",
						marginTop: isCover ? layout.coverYOffset : 20,
					}}
				>
					{renderSceneUi(props.doc, props.variant)}
				</div>
			</div>
		</div>
	);
}

function renderSceneUi(doc: PatternDoc, variant: Variant): React.ReactElement {
	const isCover = variant === "cover";
	const layout = SCENE_LAYOUTS[doc.sceneKind];
	const width = isCover ? layout.coverWidth - 120 : layout.ogWidth - 100;

	switch (doc.sceneKind) {
		case "form":
			return createSurfaceCard(
				<div style={{ display: "grid", gap: 18, padding: "34px 40px 42px" }}>
					<div
						style={{
							fontSize: isCover ? 48 : 28,
							fontWeight: 700,
							letterSpacing: "-0.04em",
						}}
					>
						{doc.title}
					</div>
					<PlaceholderLine width="92%" />
					<div
						style={{
							display: "grid",
							gap: 16,
						}}
					>
						<div
							style={{
								height: isCover ? 86 : 60,
								borderRadius: 20,
								border: "1px solid rgba(255,255,255,0.10)",
								backgroundColor: "rgba(255,255,255,0.05)",
							}}
						/>
						<div
							style={{
								height: isCover ? 86 : 60,
								borderRadius: 20,
								border: "1px solid rgba(255,255,255,0.10)",
								backgroundColor: "rgba(255,255,255,0.05)",
							}}
						/>
						<div
							style={{
								height: isCover ? 86 : 60,
								borderRadius: 20,
								border: "1px solid rgba(255,255,255,0.10)",
								backgroundColor: "rgba(255,255,255,0.05)",
							}}
						/>
					</div>
				</div>,
				width,
				isCover ? layout.coverMinHeight : undefined,
			);

		case "controls":
			return createSurfaceCard(
				<div style={{ padding: "38px 40px", display: "grid", gap: 24 }}>
					<div
						style={{
							fontSize: isCover ? 44 : 26,
							fontWeight: 700,
							letterSpacing: "-0.04em",
						}}
					>
						{doc.title}
					</div>
					<div
						style={{
							display: "flex",
							gap: isCover ? 26 : 18,
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: isCover ? 140 : 78,
								height: isCover ? 78 : 46,
								borderRadius: 999,
								backgroundColor: "#d7a241",
								boxShadow: "0 12px 28px rgba(215,162,65,0.18)",
							}}
						/>
						<div
							style={{
								width: isCover ? 92 : 54,
								height: isCover ? 92 : 54,
								borderRadius: 18,
								border: "1px solid rgba(255,255,255,0.14)",
							}}
						/>
						<div
							style={{
								width: isCover ? 92 : 54,
								height: isCover ? 92 : 54,
								borderRadius: 999,
								border: "1px solid rgba(255,255,255,0.14)",
							}}
						/>
					</div>
				</div>,
				width,
				isCover ? layout.coverMinHeight : undefined,
			);

		case "navigation":
			return createSurfaceCard(
				<div
					style={{
						padding: isCover ? "52px 56px" : "28px 32px 42px",
						display: "flex",
						flexDirection: "column",
						gap: isCover ? 30 : 0,
					}}
				>
					{!isCover &&
						["row-a", "row-b", "row-c", "row-d", "row-e"].map((rowKey) => (
							<div
								key={rowKey}
								style={{
									display: "flex",
									alignItems: "center",
									gap: 16,
									padding: "12px 0",
									borderBottom: "1px solid rgba(255,255,255,0.06)",
								}}
							>
								<div
									style={{
										width: 24,
										height: 24,
										borderRadius: 6,
										backgroundColor: "rgba(255,255,255,0.08)",
										flexShrink: 0,
									}}
								/>
								<div
									style={{
										flex: 1,
										height: 10,
										borderRadius: 999,
										backgroundColor: "rgba(255,255,255,0.10)",
									}}
								/>
								<div
									style={{
										width: "20%",
										height: 10,
										borderRadius: 999,
										backgroundColor: "rgba(255,255,255,0.07)",
									}}
								/>
							</div>
						))}
					<div
						style={{
							display: "flex",
							gap: isCover ? 18 : 10,
							alignItems: "center",
							justifyContent: "space-between",
							paddingTop: isCover ? 0 : 20,
						}}
					>
						{["←", "1", "2", "3", "...", "→"].map((item) => (
							<div
								key={item}
								style={{
									height: isCover ? 86 : 40,
									minWidth: isCover ? 86 : 40,
									padding: isCover ? "0 34px" : "0 14px",
									borderRadius: isCover ? 20 : 12,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									backgroundColor:
										item === "2" ? "rgba(255,255,255,0.92)" : "transparent",
									border:
										item === "2" ? "none" : "1px solid rgba(255,255,255,0.12)",
									color: item === "2" ? "#111111" : "rgba(255,255,255,0.6)",
									fontSize: isCover ? 34 : 16,
									fontWeight: 600,
								}}
							>
								{item}
							</div>
						))}
					</div>
				</div>,
				width,
				isCover ? layout.coverMinHeight : undefined,
			);

		case "data":
			return createSurfaceCard(
				<div style={{ padding: "28px 34px", display: "grid", gap: 16 }}>
					{["row-a", "row-b", "row-c", "row-d", "row-e"].map((rowKey) => (
						<div
							key={rowKey}
							style={{
								display: "grid",
								gridTemplateColumns: "1.2fr 1fr 1fr",
								gap: 16,
							}}
						>
							<PlaceholderLine width="100%" />
							<PlaceholderLine width="100%" />
							<PlaceholderLine width="100%" />
						</div>
					))}
				</div>,
				width,
			);

		case "auth":
			return createSurfaceCard(
				<div style={{ padding: "36px 40px", display: "grid", gap: 16 }}>
					<div
						style={{
							fontSize: isCover ? 44 : 26,
							fontWeight: 700,
							letterSpacing: "-0.04em",
						}}
					>
						Sign in
					</div>
					<div
						style={{
							height: isCover ? 78 : 58,
							borderRadius: 18,
							border: "1px solid rgba(255,255,255,0.10)",
							backgroundColor: "rgba(255,255,255,0.05)",
						}}
					/>
					<div
						style={{
							height: isCover ? 78 : 58,
							borderRadius: 18,
							border: "1px solid rgba(255,255,255,0.10)",
							backgroundColor: "rgba(255,255,255,0.05)",
						}}
					/>
					<div
						style={{
							height: isCover ? 74 : 54,
							borderRadius: 999,
							backgroundColor: "#d7a241",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "#15110a",
							fontSize: isCover ? 24 : 18,
							fontWeight: 700,
						}}
					>
						Continue
					</div>
				</div>,
				width,
			);

		case "ai":
			return createSurfaceCard(
				<div style={{ padding: "28px 34px", display: "grid", gap: 18 }}>
					<div
						style={{
							alignSelf: "flex-end",
							maxWidth: "72%",
							padding: isCover ? "22px 26px" : "16px 20px",
							borderRadius: 22,
							backgroundColor: "rgba(255,255,255,0.08)",
						}}
					>
						<PlaceholderLine width="100%" />
					</div>
					<div
						style={{
							maxWidth: "82%",
							padding: isCover ? "22px 26px" : "16px 20px",
							borderRadius: 22,
							backgroundColor: "rgba(255,255,255,0.05)",
							display: "grid",
							gap: 12,
						}}
					>
						<PlaceholderLine width="92%" />
						<PlaceholderLine width="74%" />
					</div>
					<div
						style={{
							height: isCover ? 80 : 58,
							borderRadius: 22,
							border: "1px solid rgba(255,255,255,0.10)",
							backgroundColor: "rgba(255,255,255,0.04)",
						}}
					/>
				</div>,
				width,
			);

		case "media":
			return createSurfaceCard(
				<div style={{ padding: "28px", display: "grid", gap: 16 }}>
					<div
						style={{
							height: isCover ? 280 : 180,
							borderRadius: 24,
							background:
								"linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
							border: "1px solid rgba(255,255,255,0.10)",
						}}
					/>
					<div style={{ display: "flex", gap: 12 }}>
						{["thumb-a", "thumb-b", "thumb-c", "thumb-d"].map((thumbKey) => (
							<div
								key={thumbKey}
								style={{
									flex: 1,
									height: isCover ? 70 : 46,
									borderRadius: 14,
									backgroundColor: "rgba(255,255,255,0.08)",
								}}
							/>
						))}
					</div>
				</div>,
				width,
			);

		case "feedback":
			return createSurfaceCard(
				<div style={{ padding: "34px 40px", display: "grid", gap: 18 }}>
					<div
						style={{
							padding: isCover ? "22px 24px" : "16px 18px",
							borderRadius: 20,
							backgroundColor: "rgba(255,255,255,0.06)",
							border: "1px solid rgba(255,255,255,0.10)",
							display: "grid",
							gap: 12,
						}}
					>
						<PlaceholderLine width="72%" />
						<PlaceholderLine width="92%" />
					</div>
					<div
						style={{
							height: isCover ? 18 : 12,
							borderRadius: 999,
							backgroundColor: "rgba(255,255,255,0.08)",
							overflow: "hidden",
						}}
					>
						<div
							style={{
								width: "68%",
								height: "100%",
								borderRadius: 999,
								backgroundColor: "#d7a241",
							}}
						/>
					</div>
				</div>,
				width,
			);

		case "commerce":
			return createSurfaceCard(
				<div style={{ padding: "32px", display: "grid", gap: 18 }}>
					<div
						style={{
							height: isCover ? 220 : 148,
							borderRadius: 22,
							background:
								"linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))",
						}}
					/>
					<PlaceholderLine width="54%" />
					<PlaceholderLine width="84%" />
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<PlaceholderLine width="22%" />
						<div
							style={{
								height: isCover ? 70 : 50,
								padding: isCover ? "0 28px" : "0 22px",
								borderRadius: 999,
								backgroundColor: "#d7a241",
								display: "flex",
								alignItems: "center",
								color: "#15110a",
								fontSize: isCover ? 22 : 17,
								fontWeight: 700,
							}}
						>
							Add to cart
						</div>
					</div>
				</div>,
				width,
			);

		case "social":
			return createSurfaceCard(
				<div style={{ padding: "28px 32px", display: "grid", gap: 18 }}>
					{["item-a", "item-b", "item-c"].map((itemKey) => (
						<div
							key={itemKey}
							style={{
								display: "grid",
								gridTemplateColumns: "44px 1fr",
								gap: 16,
								alignItems: "start",
							}}
						>
							<div
								style={{
									width: 44,
									height: 44,
									borderRadius: 999,
									backgroundColor: "rgba(255,255,255,0.10)",
								}}
							/>
							<div style={{ display: "grid", gap: 10 }}>
								<PlaceholderLine width="60%" />
								<PlaceholderLine width="92%" />
							</div>
						</div>
					))}
				</div>,
				width,
			);

		default:
			return createSurfaceCard(
				<div style={{ padding: "28px 32px", display: "grid", gap: 14 }}>
					{["panel-a", "panel-b", "panel-c", "panel-d"].map(
						(panelKey, panelIndex) => (
							<div
								key={panelKey}
								style={{
									height: isCover ? 78 : 54,
									borderRadius: 18,
									border: "1px solid rgba(255,255,255,0.10)",
									backgroundColor:
										panelIndex === 0
											? "rgba(255,255,255,0.08)"
											: "rgba(255,255,255,0.04)",
								}}
							/>
						),
					)}
				</div>,
				width,
			);
	}
}

async function renderVariant(options: {
	doc: PatternDoc;
	fontCss: string;
	gridDataUrl: string;
	htmlDir: string;
	outDir: string;
	variant: Variant;
}) {
	const isCover = options.variant === "cover";
	const size = isCover ? MODAL_COVER_SIZE : MODAL_OG_SIZE;
	const ogDir = path.join(options.outDir, "og", "patterns");
	const coverDir = path.join(options.outDir, "covers", "patterns");
	await fs.mkdir(ogDir, { recursive: true });
	await fs.mkdir(coverDir, { recursive: true });
	await fs.mkdir(options.htmlDir, { recursive: true });

	let element: React.ReactElement;
	if (options.doc.slug === "modal") {
		element = isCover
			? React.createElement(ModalCover, {
					coverBackgroundColor: options.doc.coverBackgroundColor,
				})
			: React.createElement(ModalScene, {
					backgroundImageUrl: options.gridDataUrl,
					variant: "og" satisfies ModalSceneVariant,
				});
	} else {
		element = React.createElement(GenericScene, {
			accentColor:
				CATEGORY_ACCENT_COLORS[options.doc.categorySlug] || "#d7a241",
			doc: options.doc,
			gridDataUrl: options.gridDataUrl,
			variant: options.variant,
		});
	}

	const htmlPath = path.join(
		options.htmlDir,
		`${options.doc.slug}-${options.variant}.html`,
	);
	const pngPath = path.join(
		isCover ? coverDir : ogDir,
		`${options.doc.slug}.png`,
	);

	const html = buildDocument({
		bodyMarkup: renderToStaticMarkup(element),
		fontCss: options.fontCss,
		height: size.height,
		width: size.width,
		background: isCover ? options.doc.coverBackgroundColor : "#050505",
	});

	await fs.writeFile(htmlPath, html, "utf8");
	await execFileAsync(CHROME_BIN, [
		"--headless",
		"--disable-gpu",
		"--hide-scrollbars",
		"--force-device-scale-factor=1",
		`--window-size=${size.width},${size.height}`,
		`--screenshot=${pngPath}`,
		`file://${htmlPath}`,
	]);

	return { htmlPath, pngPath };
}

async function buildPreviewPage(paths: {
	assetDir: string;
	docs: PatternDoc[];
	previewDir: string;
}) {
	await fs.mkdir(paths.previewDir, { recursive: true });
	const previewPath = path.join(paths.previewDir, "pattern-art-preview.html");
	const items = paths.docs
		.map((doc) => {
			const ogPath = path.join(
				paths.assetDir,
				"og",
				"patterns",
				`${doc.slug}.png`,
			);
			const coverPath = path.join(
				paths.assetDir,
				"covers",
				"patterns",
				`${doc.slug}.png`,
			);
			return `<article class="card">
  <h2>${doc.title}</h2>
  <p>${doc.categoryLabel}</p>
  <img src="file://${ogPath}" alt="${doc.slug} og" />
  <img class="cover" src="file://${coverPath}" alt="${doc.slug} cover" />
</article>`;
		})
		.join("");

	const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Pattern Art Preview</title>
    <style>
      body {
        margin: 0;
        padding: 32px;
        background: #0a0a0a;
        color: #f5f5f5;
        font-family: system-ui, sans-serif;
      }
      .grid {
        display: grid;
        gap: 28px;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }
      .card {
        display: grid;
        gap: 12px;
      }
      .card h2, .card p { margin: 0; }
      .card img {
        width: 100%;
        display: block;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.08);
      }
      .card img.cover {
        background: #111;
      }
    </style>
  </head>
  <body>
    <div class="grid">${items}</div>
  </body>
</html>`;

	await fs.writeFile(previewPath, html, "utf8");
	return previewPath;
}

async function openFile(targetPath: string) {
	await execFileAsync("open", [targetPath]);
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	const docs = await getPatternDocs();
	const selectedDocs = resolveRequestedDocs(args.pattern, docs);

	await fs.mkdir(args.outDir, { recursive: true });
	await fs.mkdir(args.previewDir, { recursive: true });

	const fontCss = await buildFontFaceCss(
		path.resolve(process.cwd(), "public/fonts/og"),
	);
	const gridDataUrl = await fileToDataUrl(
		path.resolve(process.cwd(), "public/og/modal-grid.png"),
		"image/png",
	);

	const variants: Variant[] =
		args.variant === "both" ? ["og", "cover"] : [args.variant];

	for (const doc of selectedDocs) {
		for (const variant of variants) {
			const result = await renderVariant({
				doc,
				fontCss,
				gridDataUrl,
				htmlDir: path.join(args.previewDir, "html"),
				outDir: args.outDir,
				variant,
			});
			console.log(`${doc.slug}:${variant}: ${result.pngPath}`);
		}
	}

	const previewPath = await buildPreviewPage({
		assetDir: args.outDir,
		docs: selectedDocs,
		previewDir: args.previewDir,
	});
	console.log(`preview: ${previewPath}`);

	if (args.openPreview) {
		await openFile(previewPath);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
