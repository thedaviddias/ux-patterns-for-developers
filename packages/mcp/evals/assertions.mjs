const responseBudgets = {
	categories: 700,
	list: 700,
	listMax: 9500,
	searchMax: 10000,
	referenceMax: 10000,
	search: 800,
	retrieve: 8500,
	targeted: 2200,
	glossary: 250,
	reference: 5000,
	compare: 800,
	review: 400,
	accessibility: 700,
	advisor: 300,
	checklist: 1200,
	missing: 300,
	searchRetrieve: 9500,
	searchTargeted: 2800,
	snippetReview: 1100,
	advisorRetry: 1200,
};
export function validate(row) {
	if (row.name === "corpus")
		return row.count >= 90 && row.worst.responseTokens <= 18000;
	if (
		!Object.hasOwn(responseBudgets, row.name) ||
		!Number.isFinite(row.totalTokens) ||
		row.discoveryTokens > 2100 ||
		row.requestTokens > 250 ||
		row.totalTokens > 2100 + 250 + responseBudgets[row.name] ||
		row.responseTokens > responseBudgets[row.name]
	)
		return false;
	const structured = row.results.map((r) => r.structuredContent);
	if (
		row.name === "listMax" &&
		(!Array.isArray(structured[0]?.patterns) ||
			structured[0].patterns.length < 90)
	)
		return false;
	if (
		row.name === "searchMax" &&
		(!Array.isArray(structured[0]?.results) ||
			structured[0].results.length < 80)
	)
		return false;
	if (
		row.name === "referenceMax" &&
		(structured[0] ||
			!JSON.stringify(row.results[0].content).includes("response truncated"))
	)
		return false;
	if (
		["retrieve", "targeted", "searchRetrieve", "searchTargeted"].includes(
			row.name,
		) &&
		!structured.some((r) => typeof r?.body === "string" && r.body.length > 0)
	)
		return false;
	if (
		["accessibility", "snippetReview"].includes(row.name) &&
		!structured.some((r) => Array.isArray(r?.notVerified))
	)
		return false;
	if (row.name === "missing")
		return (
			row.results[0].isError === true && structured[0]?.error === "NOT_FOUND"
		);
	if (row.results.some((r) => r.isError)) return false;
	for (const r of structured) {
		if (r?.body) {
			if (
				r.body.includes("function _createMdxContent") ||
				r.url !== "https://uxpatterns.dev/patterns/forms/search-field"
			)
				return false;
			if (
				["targeted", "searchTargeted"].includes(row.name) &&
				(!r.body.includes("## Accessibility") ||
					!r.body.includes("## Examples") ||
					!r.body.includes("<input") ||
					r.body.includes("## Drawbacks"))
			)
				return false;
		}
		if (r?.notVerified) {
			if (
				r.passed.length !== 0 ||
				!r.limitations ||
				!r.notVerified.includes("1.4.3 (Level AA)") ||
				!r.notVerified.includes("2.4.7 (Level AA)")
			)
				return false;
			if (
				!r.issues.some((i) => i.criterion === "2.1.1") ||
				!r.issues.some((i) => i.criterion === "4.1.2")
			)
				return false;
		}
	}
	return true;
}
export default (output) => {
	try {
		return validate(JSON.parse(output));
	} catch {
		return false;
	}
};
