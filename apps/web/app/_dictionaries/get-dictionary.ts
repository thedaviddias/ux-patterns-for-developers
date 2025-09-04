import "server-only";

import type { Dictionaries, Dictionary } from "./i18n-config";

const dictionaries: Dictionaries = {
	en: async () => ({ default: (await import("./en")).default }),
};

export async function getDictionary(locale: string): Promise<Dictionary> {
	const { default: dictionary } = await (
		dictionaries[locale] || dictionaries.en
	)();

	return dictionary;
}
