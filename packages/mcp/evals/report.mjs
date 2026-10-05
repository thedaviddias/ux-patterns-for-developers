import { writeFile } from "node:fs/promises";
import { cases, corpusReport, measureFlow } from "./measure.mjs";

const flows = [];
for (const name of [...Object.keys(cases), "advisorRetry"]) {
	const { results, ...row } = await measureFlow(name);
	flows.push(row);
}
const report = {
	encoding: "o200k_base",
	scope:
		"offline native modern SDK; complete JSON including text and structured duplication; excludes host framing, chat history, model reasoning and answer tokens; not Claude billing",
	flows,
	corpus: await corpusReport(),
};
await writeFile(
	process.argv[2] ?? "/tmp/ux-mcp-token-report.json",
	JSON.stringify(report, null, 2) + "\n",
);
console.log(
	JSON.stringify(
		{ ...report, corpus: { ...report.corpus, rows: undefined } },
		null,
		2,
	),
);
