import { corpusReport, measureFlow } from "./measure.mjs";
export default class OfflineMcpProvider {
	id() {
		return "offline-native-mcp";
	}
	async callApi(prompt) {
		return {
			output: JSON.stringify(
				prompt.trim() === "corpus"
					? { name: "corpus", ...(await corpusReport()) }
					: await measureFlow(prompt.trim()),
			),
		};
	}
}
