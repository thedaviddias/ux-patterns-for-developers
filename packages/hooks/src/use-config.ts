import { useEffect, useState } from "react";

type Config = {
	packageManager: "npm" | "yarn" | "pnpm" | "bun";
};

const defaultConfig: Config = {
	packageManager: "pnpm",
};

export function useConfig() {
	const [config, setConfig] = useState<Config>(defaultConfig);

	// Load config from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem("config");
		if (stored) {
			try {
				const parsedConfig = JSON.parse(stored);
				setConfig(parsedConfig);
			} catch {
				// If parsing fails, use default config
				setConfig(defaultConfig);
			}
		}
	}, []);

	// Save config to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("config", JSON.stringify(config));
	}, [config]);

	return [config, setConfig] as const;
}
