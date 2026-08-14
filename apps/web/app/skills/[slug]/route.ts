import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import {
	getPatternSkillBySlug,
	globalPatternSkill,
	patternSkillsManifest,
} from "@/lib/pattern-skills";
import { findRepoRoot } from "@/lib/pattern-skills-config.mjs";

export const revalidate = false;
// Skill files only exist in the repo at build time, not in the deployed
// function bundle — every slug must be prerendered and unknown slugs must 404
// without invoking the handler.
export const dynamicParams = false;

export function generateStaticParams() {
	return [
		{ slug: globalPatternSkill.skillSlug },
		...patternSkillsManifest.patterns.map((pattern) => ({
			slug: pattern.skillSlug,
		})),
	];
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ slug: string }> },
) {
	const { slug } = await params;
	const skill = getPatternSkillBySlug(slug);

	if (!skill) {
		notFound();
	}

	const repoRoot = findRepoRoot();
	const filePath = path.join(repoRoot, skill.referencePath);

	try {
		const contents = await fs.readFile(filePath, "utf8");

		return new Response(contents, {
			headers: {
				"Content-Type": "text/markdown; charset=utf-8",
				"Cache-Control":
					"public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
			},
		});
	} catch {
		notFound();
	}
}
