import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BuildEffort } from "./build-effort";

describe("BuildEffort", () => {
	it("renders markdown links inside the description as anchors", () => {
		render(
			<BuildEffort
				level="medium"
				description="Requires [keyboard navigation](/glossary/keyboard-navigation) and [ARIA attributes](/glossary/aria-attributes)."
			/>,
		);

		expect(
			screen.getByRole("link", { name: "keyboard navigation" }),
		).toHaveAttribute("href", "/glossary/keyboard-navigation");
		expect(
			screen.getByRole("link", { name: "ARIA attributes" }),
		).toHaveAttribute("href", "/glossary/aria-attributes");
	});
});
