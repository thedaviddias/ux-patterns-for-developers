import { ImageResponse } from "next/og";
import { MODAL_COVER_SIZE, ModalCover } from "@/components/modal-og";
import { loadOgFonts } from "@/lib/og-fonts";
import { LEGACY_PATTERN_COVER_COLORS } from "@/lib/pattern-cover-colors";

export const runtime = "nodejs";

export async function GET() {
	try {
		const fonts = await loadOgFonts();

		return new ImageResponse(
			<ModalCover coverBackgroundColor={LEGACY_PATTERN_COVER_COLORS.modal} />,
			{
				...MODAL_COVER_SIZE,
				fonts,
			},
		);
	} catch {
		return new ImageResponse(
			<ModalCover coverBackgroundColor={LEGACY_PATTERN_COVER_COLORS.modal} />,
			MODAL_COVER_SIZE,
		);
	}
}
