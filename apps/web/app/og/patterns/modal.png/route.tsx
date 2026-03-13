import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { MODAL_OG_SIZE, ModalScene } from "@/components/modal-og";
import { loadOgFonts } from "@/lib/og-fonts";

export const runtime = "nodejs";

let modalGridDataUrlPromise: Promise<string> | undefined;

async function loadModalGridDataUrl() {
	if (!modalGridDataUrlPromise) {
		modalGridDataUrlPromise = (async () => {
			const image = await readFile(
				path.join(process.cwd(), "public", "og", "modal-grid.png"),
			);

			return `data:image/png;base64,${image.toString("base64")}`;
		})();
	}

	return modalGridDataUrlPromise;
}

export async function GET() {
	try {
		const [backgroundImageUrl, fonts] = await Promise.all([
			loadModalGridDataUrl(),
			loadOgFonts(),
		]);

		return new ImageResponse(
			<ModalScene backgroundImageUrl={backgroundImageUrl} variant="og" />,
			{
				...MODAL_OG_SIZE,
				fonts,
			},
		);
	} catch {
		return new ImageResponse(<ModalScene variant="og" />, MODAL_OG_SIZE);
	}
}
