import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "UX Patterns connector walkthrough",
	description:
		"See real UX Patterns connector requests and responses in ChatGPT.",
	alternates: { canonical: "https://uxpatterns.dev/mcp/demo" },
};

const cases = [
	[
		"Find a button for Save",
		"ChatGPT returns Button guidance and source links, including a native button, clear label and saving state.",
	],
	[
		"Retrieve accessibility guidance",
		"get_pattern returns Button guidance covering labels, keyboard interaction, focus and semantics.",
	],
	[
		"Create an implementation checklist",
		"get_implementation_checklist returns concrete checks for an accessible button.",
	],
	[
		"Review a clickable div",
		"review_code and check_accessibility identify potential keyboard and semantic issues and suggest a button. No WCAG criterion is certified as passed.",
	],
	[
		"Explain Progressive Loading",
		"get_glossary_term explains loading content gradually and returns related guidance.",
	],
	[
		"Request a deployment",
		"ChatGPT explains that the connector has no deployment or write tools. No deployment is attempted.",
	],
	[
		"Request accessibility certification",
		"ChatGPT explains that static checks cannot certify whole-site or legal compliance. Rendered and manual testing remain necessary.",
	],
	[
		"Request an unknown pattern",
		"get_pattern returns NOT_FOUND. ChatGPT identifies fallback suggestions as alternatives to the missing pattern.",
	],
];

export default function ConnectorDemo() {
	return (
		<main className="mx-auto max-w-5xl px-4 py-16 space-y-8">
			<Link href="/mcp" className="underline underline-offset-4">
				Connector setup and documentation
			</Link>
			<header className="space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight">
					UX Patterns connector walkthrough
				</h1>
				<p className="text-muted-foreground">
					Real requests and responses in ChatGPT, recorded October 5, 2026,
					using the public connector at <code>https://mcp.uxpatterns.dev</code>.
				</p>
				<p className="text-muted-foreground">
					This silent walkthrough is edited from captured screens; waiting time
					is shortened and captions explain each case. The first request runs
					separately; cases 2–8 run together in one follow-up. It demonstrates a
					custom connector, while public directory approval is pending.
				</p>
			</header>
			<video
				controls
				preload="metadata"
				poster="/videos/ux-patterns-connector-demo.jpg"
				className="w-full rounded-xl border"
				aria-label="UX Patterns in ChatGPT: five supported requests and three unsupported requests"
			>
				<source src="/videos/ux-patterns-connector-demo.mp4" type="video/mp4" />
				<track
					kind="captions"
					src="/videos/ux-patterns-connector-demo.vtt"
					srcLang="en"
					label="English"
				/>
				Your browser cannot play this video. Use the video link or read the
				transcript below.
			</video>
			<p>
				<a
					href="/videos/ux-patterns-connector-demo.mp4"
					className="underline underline-offset-4"
				>
					Open the MP4 video
				</a>
			</p>
			<section className="space-y-4" aria-labelledby="transcript-title">
				<h2 id="transcript-title" className="text-2xl font-semibold">
					Walkthrough transcript
				</h2>
				<p>
					The UX Patterns connector is selected in ChatGPT. It requires no
					account or authentication. The user asks for guidance using only this
					connector, without web search or changes to an application.
				</p>
				<ol className="list-decimal pl-6 space-y-4">
					{cases.map(([title, result]) => (
						<li key={title}>
							<h3 className="font-medium">{title}</h3>
							<p className="text-muted-foreground">{result}</p>
						</li>
					))}
				</ol>
				<p>
					All eleven connector tools are read-only. Code and accessibility
					checks use deterministic heuristics, and do not replace an
					accessibility audit.
				</p>
			</section>
		</main>
	);
}
