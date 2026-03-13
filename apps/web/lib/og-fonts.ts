import { readFile } from "node:fs/promises";
import path from "node:path";

type OgFontWeight = 400 | 500 | 700 | 800;

type OgFont = {
	name: "Inter";
	data: ArrayBuffer;
	weight: OgFontWeight;
	style: "normal" | "italic";
};

let ogFontsPromise: Promise<OgFont[]> | undefined;

const OG_FONT_FILES: Array<{ weight: OgFontWeight; fileName: string }> = [
	{ weight: 400, fileName: "inter-400.ttf" },
	{ weight: 500, fileName: "inter-500.ttf" },
	{ weight: 700, fileName: "inter-700.ttf" },
	{ weight: 800, fileName: "inter-800.ttf" },
];

export async function loadOgFonts(): Promise<OgFont[]> {
	if (!ogFontsPromise) {
		ogFontsPromise = (async () => {
			const fonts = await Promise.all(
				OG_FONT_FILES.map(async (fontFile) => {
					const fontData = await readFile(
						path.join(
							process.cwd(),
							"public",
							"fonts",
							"og",
							fontFile.fileName,
						),
					);

					return {
						name: "Inter" as const,
						data: fontData.buffer.slice(
							fontData.byteOffset,
							fontData.byteOffset + fontData.byteLength,
						),
						weight: fontFile.weight,
						style: "normal" as const,
					};
				}),
			);

			return fonts.sort((left, right) => left.weight - right.weight);
		})();
	}

	return ogFontsPromise;
}
