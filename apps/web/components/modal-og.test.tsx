import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LEGACY_PATTERN_COVER_COLORS } from "@/lib/pattern-cover-colors";
import { ModalScene } from "./modal-og";

describe("ModalScene", () => {
	it("renders editorial chrome for the og variant", () => {
		render(<ModalScene variant="og" />);

		expect(screen.getByTestId("modal-scene-chrome")).toBeInTheDocument();
		expect(screen.getByTestId("modal-scene-ui-slot")).toHaveStyle({
			overflow: "hidden",
		});
		expect(screen.getByText("Content Management")).toBeInTheDocument();
		expect(screen.getByText("Modal")).toBeInTheDocument();
		expect(
			screen.getByText("Focused dialogs for critical actions"),
		).toBeInTheDocument();
		expect(screen.queryByText("Esc to close")).not.toBeInTheDocument();
	});

	it("renders a ui-only cover variant with the mapped legacy background", () => {
		render(
			<ModalScene
				coverBackgroundColor={LEGACY_PATTERN_COVER_COLORS.modal}
				variant="cover"
			/>,
		);

		expect(screen.queryByTestId("modal-scene-chrome")).not.toBeInTheDocument();
		expect(screen.queryByText("Content Management")).not.toBeInTheDocument();
		expect(
			screen.queryByText("Focused dialogs for critical actions"),
		).not.toBeInTheDocument();
		expect(screen.getByTestId("modal-scene-root")).toHaveStyle({
			backgroundColor: LEGACY_PATTERN_COVER_COLORS.modal,
		});
		expect(screen.getByText("Edit profile")).toBeInTheDocument();
		expect(screen.getByText("Save changes")).toBeInTheDocument();
	});
});
