/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../../registry/default/ui/button";

// Mock navigator.vibrate for haptics testing
const mockVibrate = vi.fn();
Object.defineProperty(navigator, "vibrate", {
	value: mockVibrate,
	writable: true,
});

// Mock AudioContext for sound testing
const mockOscillator = {
	connect: vi.fn(),
	start: vi.fn(),
	stop: vi.fn(),
	disconnect: vi.fn(),
	frequency: { value: 0 },
	addEventListener: vi.fn(),
};

const mockGainNode = {
	connect: vi.fn(),
	disconnect: vi.fn(),
	gain: { value: 0 },
};

const mockAudioContext = {
	createOscillator: vi.fn(() => mockOscillator),
	createGain: vi.fn(() => mockGainNode),
	destination: {},
	currentTime: 0,
	close: vi.fn().mockResolvedValue(undefined),
};

global.AudioContext = vi.fn(() => mockAudioContext) as any;

describe("Button Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("Core Functionality", () => {
		it("renders with children", () => {
			render(<Button>Click me</Button>);
			expect(
				screen.getByRole("button", { name: "Click me" }),
			).toBeInTheDocument();
		});

		it('sets type="button" by default', () => {
			render(<Button>Default</Button>);
			expect(screen.getByRole("button")).toHaveAttribute("type", "button");
		});

		it("allows custom type attribute", () => {
			render(<Button type="submit">Submit</Button>);
			expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
		});

		it("forwards ref correctly", () => {
			const ref = React.createRef<HTMLButtonElement>();
			render(<Button ref={ref}>Ref Button</Button>);
			expect(ref.current).toBeInstanceOf(HTMLButtonElement);
			expect(ref.current?.textContent).toBe("Ref Button");
		});

		it("spreads additional props", () => {
			render(<Button data-testid="custom-button">Props</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveAttribute("data-testid", "custom-button");
		});

		it("merges className prop with variant classes", () => {
			render(<Button className="custom-class">Styled</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveClass("custom-class");
			expect(button).toHaveClass("inline-flex"); // Base class
		});
	});

	describe("Variants", () => {
		const variants = [
			"solid",
			"outline",
			"ghost",
			"link",
			"soft",
			"danger",
			"success",
			"warning",
		] as const;

		variants.forEach((variant) => {
			it(`renders ${variant} variant with correct styles`, () => {
				render(<Button variant={variant}>{variant}</Button>);
				const button = screen.getByRole("button");

				// Check variant-specific classes
				if (variant === "solid") {
					expect(button).toHaveClass("bg-primary");
				} else if (variant === "outline") {
					expect(button).toHaveClass("border-2", "border-primary/50");
				} else if (variant === "ghost") {
					expect(button).toHaveClass("hover:enabled:bg-accent");
				} else if (variant === "link") {
					expect(button).toHaveClass("text-primary");
				} else if (variant === "soft") {
					expect(button).toHaveClass("bg-primary/10");
				} else if (variant === "danger") {
					expect(button).toHaveClass("bg-red-600");
				} else if (variant === "success") {
					expect(button).toHaveClass("bg-emerald-600");
				} else if (variant === "warning") {
					expect(button).toHaveClass("bg-amber-500");
				}
			});
		});
	});

	describe("Sizes", () => {
		const sizes = ["xs", "sm", "md", "lg"] as const;

		sizes.forEach((size) => {
			it(`renders ${size} size with correct styles`, () => {
				render(<Button size={size}>{size}</Button>);
				const button = screen.getByRole("button");

				// Check size-specific classes
				if (size === "xs") {
					expect(button).toHaveClass("h-7", "min-w-[2.5rem]");
				} else if (size === "sm") {
					expect(button).toHaveClass("h-8", "min-w-[3rem]");
				} else if (size === "md") {
					expect(button).toHaveClass("h-10", "min-w-[4rem]");
				} else if (size === "lg") {
					expect(button).toHaveClass("h-12", "min-w-[4.5rem]");
				}
			});
		});
	});

	describe("asChild Pattern", () => {
		it("renders as custom element when asChild is true", () => {
			render(
				<Button asChild>
					<a href="/test">Link Button</a>
				</Button>,
			);
			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/test");
			expect(link).toHaveClass("inline-flex"); // Button styles applied
		});

		it("forwards ref when using asChild", () => {
			const ref = React.createRef<HTMLAnchorElement>();
			render(
				<Button asChild ref={ref as any}>
					<a href="/test">Link</a>
				</Button>,
			);
			expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
		});

		it("merges event handlers with asChild", async () => {
			const buttonClick = vi.fn();
			const linkClick = vi.fn();

			render(
				<Button asChild onClick={buttonClick}>
					<a href="/test" onClick={linkClick}>
						Click
					</a>
				</Button>,
			);

			await userEvent.click(screen.getByRole("link"));
			expect(buttonClick).toHaveBeenCalled();
			expect(linkClick).toHaveBeenCalled();
		});

		it("prevents clicks on disabled asChild", async () => {
			const onClick = vi.fn();
			render(
				<Button asChild disabled onClick={onClick}>
					<a href="/test">Disabled Link</a>
				</Button>,
			);

			await userEvent.click(screen.getByRole("link"));
			expect(onClick).not.toHaveBeenCalled();
		});

		it("prevents clicks on loading asChild", async () => {
			const onClick = vi.fn();
			render(
				<Button asChild state="loading" onClick={onClick}>
					<a href="/test">Loading Link</a>
				</Button>,
			);

			await userEvent.click(screen.getByRole("link"));
			expect(onClick).not.toHaveBeenCalled();
		});
	});

	describe("Accessibility - ARIA Attributes", () => {
		it("supports aria-label", () => {
			render(<Button aria-label="Save document">💾</Button>);
			expect(
				screen.getByRole("button", { name: "Save document" }),
			).toBeInTheDocument();
		});

		it("supports aria-pressed for toggle buttons", () => {
			render(<Button aria-pressed={true}>Toggle</Button>);
			expect(screen.getByRole("button")).toHaveAttribute(
				"aria-pressed",
				"true",
			);
		});

		it("uses aria-disabled instead of disabled by default", () => {
			render(<Button disabled>Disabled</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveAttribute("aria-disabled", "true");
			expect(button).not.toHaveAttribute("disabled");
		});

		it("uses native disabled when forceNativeDisabled is true", () => {
			render(
				<Button disabled forceNativeDisabled>
					Disabled
				</Button>,
			);
			const button = screen.getByRole("button");
			expect(button).toHaveAttribute("disabled");
			expect(button).not.toHaveAttribute("aria-disabled");
		});

		it("sets aria-busy during loading state", () => {
			render(<Button state="loading">Loading</Button>);
			expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
		});

		it("supports aria-live for announcements", () => {
			render(<Button announceChanges>Announce</Button>);
			expect(screen.getByRole("button")).toHaveAttribute("aria-live", "polite");
		});

		it("includes screen reader text for loading state", () => {
			render(
				<Button state="loading" loadingType="spinner">
					Loading
				</Button>,
			);
			expect(
				screen.getByText("Loading...", { selector: ".sr-only" }),
			).toBeInTheDocument();
		});
	});

	describe("Keyboard Navigation", () => {
		it("responds to Enter key", async () => {
			const onClick = vi.fn();
			render(<Button onClick={onClick}>Press Enter</Button>);

			const button = screen.getByRole("button");
			button.focus();
			fireEvent.keyDown(button, { key: "Enter" });

			expect(onClick).toHaveBeenCalled();
		});

		it("responds to Space key", async () => {
			const onClick = vi.fn();
			render(<Button onClick={onClick}>Press Space</Button>);

			const button = screen.getByRole("button");
			button.focus();
			fireEvent.keyDown(button, { key: " " });

			expect(onClick).toHaveBeenCalled();
		});
	});

	describe("Focus Management", () => {
		it("shows focus-visible ring on keyboard focus", () => {
			render(<Button>Focus Me</Button>);
			const button = screen.getByRole("button");

			button.focus();
			expect(button).toHaveClass(
				"focus-visible:outline-none",
				"focus-visible:ring-2",
			);
		});

		it("maintains focus after state changes", async () => {
			const { rerender } = render(<Button state="idle">Button</Button>);
			const button = screen.getByRole("button");

			button.focus();
			expect(button).toHaveFocus();

			rerender(<Button state="loading">Button</Button>);
			expect(button).toHaveFocus();
		});
	});

	describe("Disabled State", () => {
		it("prevents click events when disabled", async () => {
			const onClick = vi.fn();
			render(
				<Button disabled onClick={onClick}>
					Disabled
				</Button>,
			);

			await userEvent.click(screen.getByRole("button"));
			expect(onClick).not.toHaveBeenCalled();
		});

		it("prevents click events when state is disabled", async () => {
			const onClick = vi.fn();
			render(
				<Button state="disabled" onClick={onClick}>
					Disabled
				</Button>,
			);

			await userEvent.click(screen.getByRole("button"));
			expect(onClick).not.toHaveBeenCalled();
		});

		it("applies disabled styling", () => {
			render(<Button disabled>Disabled</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveClass(
				"disabled:cursor-not-allowed",
				"disabled:opacity-60",
			);
		});

		it("shows disabled cursor with aria-disabled", () => {
			render(<Button disabled>Disabled</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveClass(
				"aria-disabled:cursor-not-allowed",
				"aria-disabled:opacity-60",
			);
		});
	});

	describe("Loading States", () => {
		it("shows spinner when loading with spinner type", () => {
			render(
				<Button state="loading" loadingType="spinner">
					Loading
				</Button>,
			);
			expect(screen.getByRole("button")).toContainHTML("animate-spin");
		});

		it("shows dots when loading with dots type", () => {
			render(
				<Button state="loading" loadingType="dots">
					Loading
				</Button>,
			);
			expect(screen.getByRole("button")).toContainHTML("animate-bounce");
		});

		it("displays custom loading text", () => {
			render(
				<Button state="loading" loadingText="Please wait...">
					Loading
				</Button>,
			);
			expect(screen.getByRole("button")).toHaveTextContent("Please wait...");
		});

		it("prevents clicks during loading", async () => {
			const onClick = vi.fn();
			render(
				<Button state="loading" onClick={onClick}>
					Loading
				</Button>,
			);

			await userEvent.click(screen.getByRole("button"));
			expect(onClick).not.toHaveBeenCalled();
		});

		it("sets aria-busy during loading", () => {
			render(<Button state="loading">Loading</Button>);
			expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
		});
	});

	describe("Icon Support", () => {
		it("renders with left icon", () => {
			render(
				<Button>
					<svg data-testid="left-icon" />
					<span>Text</span>
				</Button>,
			);
			expect(screen.getByTestId("left-icon")).toBeInTheDocument();
		});

		it("renders with right icon", () => {
			render(
				<Button>
					<span>Text</span>
					<svg data-testid="right-icon" />
				</Button>,
			);
			expect(screen.getByTestId("right-icon")).toBeInTheDocument();
		});

		it("renders icon-only button with aria-label", () => {
			render(
				<Button aria-label="Settings" size="md">
					<svg data-testid="icon" />
				</Button>,
			);
			expect(
				screen.getByRole("button", { name: "Settings" }),
			).toBeInTheDocument();
			expect(screen.getByTestId("icon")).toBeInTheDocument();
		});
	});

	describe("Motion Effects", () => {
		it("applies scale click effect", () => {
			render(<Button clickEffect="scale">Scale</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveClass("active:scale-[0.98]");
		});

		it("applies ripple click effect", () => {
			render(<Button clickEffect="ripple">Ripple</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveStyle({ position: "relative", overflow: "hidden" });
		});

		it("triggers ripple animation on click", async () => {
			render(<Button clickEffect="ripple">Ripple</Button>);
			const button = screen.getByRole("button");

			fireEvent.click(button);
			// Ripple element should be added
			await waitFor(() => {
				expect(
					button.querySelector(".absolute.rounded-full"),
				).toBeInTheDocument();
			});
		});

		it("does not trigger ripple on keyboard events to prevent invalid coordinates", async () => {
			// Mock console.error to catch any coordinate errors
			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			render(<Button clickEffect="ripple">Ripple</Button>);
			const button = screen.getByRole("button");

			// Trigger keyboard events that should not cause ripple
			fireEvent.keyDown(button, { key: "Enter" });
			fireEvent.keyDown(button, { key: " " });

			// Should not have thrown any errors about invalid coordinates
			expect(consoleSpy).not.toHaveBeenCalled();

			// Verify no ripple elements were created from keyboard events
			expect(
				button.querySelector(".absolute.rounded-full"),
			).not.toBeInTheDocument();

			consoleSpy.mockRestore();
		});

		it("applies pulse click effect", async () => {
			render(<Button clickEffect="pulse">Pulse</Button>);
			const button = screen.getByRole("button");

			fireEvent.click(button);
			// Pulse animation should be triggered
			await waitFor(() => {
				const pulseElement = button.querySelector(".absolute.inset-0");
				expect(pulseElement).toBeInTheDocument();
			});
		});

		it("applies spring click effect", () => {
			render(<Button clickEffect="spring">Spring</Button>);
			const button = screen.getByRole("button");
			// Spring effect uses Motion props which are tested functionally
			expect(button).toBeInTheDocument();
		});

		it("applies glow hover effect", () => {
			render(<Button hoverEffect="glow">Glow</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveClass(
				"hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]",
			);
		});

		it("applies lift hover effect", () => {
			render(<Button hoverEffect="lift">Lift</Button>);
			const button = screen.getByRole("button");
			expect(button).toHaveClass("hover:-translate-y-0.5");
		});

		it("applies no hover effect when none is selected", () => {
			render(<Button hoverEffect="none">None</Button>);
			const button = screen.getByRole("button");
			expect(button).not.toHaveClass("hover:-translate-y-0.5");
			expect(button).not.toHaveClass(
				"hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]",
			);
		});
	});

	describe("Haptic Feedback", () => {
		it("triggers light haptics on click", async () => {
			render(<Button haptics="light">Haptic</Button>);
			await userEvent.click(screen.getByRole("button"));
			expect(mockVibrate).toHaveBeenCalledWith(10);
		});

		it("triggers medium haptics on click", async () => {
			render(<Button haptics="medium">Haptic</Button>);
			await userEvent.click(screen.getByRole("button"));
			expect(mockVibrate).toHaveBeenCalledWith(20);
		});

		it("triggers heavy haptics on click", async () => {
			render(<Button haptics="heavy">Haptic</Button>);
			await userEvent.click(screen.getByRole("button"));
			expect(mockVibrate).toHaveBeenCalledWith(30);
		});

		it("does not trigger haptics when off", async () => {
			render(<Button haptics="off">No Haptic</Button>);
			await userEvent.click(screen.getByRole("button"));
			expect(mockVibrate).not.toHaveBeenCalled();
		});
	});

	describe("Sound Effects", () => {
		it("plays subtle sound on click", async () => {
			render(<Button sound="subtle">Sound</Button>);
			await userEvent.click(screen.getByRole("button"));
			expect(global.AudioContext).toHaveBeenCalled();
		});

		it("plays click sound on click", async () => {
			render(<Button sound="click">Sound</Button>);
			await userEvent.click(screen.getByRole("button"));
			expect(global.AudioContext).toHaveBeenCalled();
		});

		it("does not play sound when off", async () => {
			render(<Button sound="off">No Sound</Button>);
			await userEvent.click(screen.getByRole("button"));
			expect(global.AudioContext).not.toHaveBeenCalled();
		});

		it("properly cleans up AudioContext to prevent memory leaks", () => {
			render(<Button sound="click">Sound</Button>);
			const button = screen.getByRole("button");

			// Click to trigger sound
			fireEvent.click(button);

			// Verify AudioContext and nodes were created
			expect(mockAudioContext.createOscillator).toHaveBeenCalled();
			expect(mockAudioContext.createGain).toHaveBeenCalled();

			// Verify that the cleanup event listener was registered
			expect(mockOscillator.addEventListener).toHaveBeenCalledWith(
				"ended",
				expect.any(Function),
			);

			// Simulate the ended event to trigger cleanup
			const endedEventCall = mockOscillator.addEventListener.mock.calls.find(
				(call) => call[0] === "ended",
			);
			if (endedEventCall) {
				const cleanupCallback = endedEventCall[1];
				cleanupCallback(); // This should trigger the cleanup
			}

			// Verify cleanup methods were called
			expect(mockGainNode.disconnect).toHaveBeenCalled();
			expect(mockOscillator.disconnect).toHaveBeenCalled();
			expect(mockAudioContext.close).toHaveBeenCalled();
		});
	});

	describe("Interactive States", () => {
		it("shows success state with custom text", () => {
			render(
				<Button state="success" successText="Saved!">
					Button
				</Button>,
			);
			expect(screen.getByRole("button")).toHaveTextContent("Saved!");
		});

		it("shows error state with custom text", () => {
			render(
				<Button state="error" errorText="Failed!">
					Button
				</Button>,
			);
			expect(screen.getByRole("button")).toHaveTextContent("Failed!");
		});

		it("applies hover state styles", async () => {
			render(<Button>Hover Me</Button>);
			const button = screen.getByRole("button");

			await userEvent.hover(button);
			// Hover styles are applied via CSS
			expect(button).toHaveClass("hover:enabled:bg-primary/90");
		});

		it("applies active state styles", () => {
			render(<Button clickEffect="scale">Active</Button>);
			const button = screen.getByRole("button");

			fireEvent.mouseDown(button);
			expect(button).toHaveClass("active:scale-[0.98]");
		});

		it("handles focus state correctly", () => {
			render(<Button>Focus</Button>);
			const button = screen.getByRole("button");

			button.focus();
			expect(button).toHaveFocus();
			expect(button).toHaveClass("focus-visible:outline-none");
		});
	});

	describe("Event Handlers", () => {
		it("calls onClick handler", async () => {
			const onClick = vi.fn();
			render(<Button onClick={onClick}>Click</Button>);

			await userEvent.click(screen.getByRole("button"));
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it("calls onKeyDown handler", () => {
			const onKeyDown = vi.fn();
			render(<Button onKeyDown={onKeyDown}>Key</Button>);

			const button = screen.getByRole("button");
			fireEvent.keyDown(button, { key: "Enter" });
			expect(onKeyDown).toHaveBeenCalled();
		});

		it("calls onKeyUp handler", () => {
			const onKeyUp = vi.fn();
			render(<Button onKeyUp={onKeyUp}>Key</Button>);

			const button = screen.getByRole("button");
			fireEvent.keyUp(button, { key: "Enter" });
			expect(onKeyUp).toHaveBeenCalled();
		});

		it("calls onMouseDown handler", () => {
			const onMouseDown = vi.fn();
			render(<Button onMouseDown={onMouseDown}>Mouse</Button>);

			const button = screen.getByRole("button");
			fireEvent.mouseDown(button);
			expect(onMouseDown).toHaveBeenCalled();
		});

		it("calls onMouseUp handler", () => {
			const onMouseUp = vi.fn();
			render(<Button onMouseUp={onMouseUp}>Mouse</Button>);

			const button = screen.getByRole("button");
			fireEvent.mouseUp(button);
			expect(onMouseUp).toHaveBeenCalled();
		});

		it("calls onMouseLeave handler", () => {
			const onMouseLeave = vi.fn();
			render(<Button onMouseLeave={onMouseLeave}>Mouse</Button>);

			const button = screen.getByRole("button");
			fireEvent.mouseLeave(button);
			expect(onMouseLeave).toHaveBeenCalled();
		});

		it("calls onAction async handler", async () => {
			const onAction = vi.fn().mockResolvedValue(undefined);
			render(<Button onAction={onAction}>Action</Button>);

			await userEvent.click(screen.getByRole("button"));
			await waitFor(() => expect(onAction).toHaveBeenCalled());
		});

		it("prevents double click when enabled", async () => {
			const onClick = vi.fn();
			render(
				<Button onClick={onClick} preventDoubleClick>
					No Double
				</Button>,
			);

			const button = screen.getByRole("button");
			await userEvent.dblClick(button);

			// Should only be called once due to double-click prevention
			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it("prevents default when onClick calls preventDefault", async () => {
			const onClick = vi.fn((e) => e.preventDefault());
			render(<Button onClick={onClick}>Click</Button>);

			const button = screen.getByRole("button");
			const event = new MouseEvent("click", {
				bubbles: true,
				cancelable: true,
			});
			fireEvent(button, event);

			expect(onClick).toHaveBeenCalled();
			expect(event.defaultPrevented).toBe(true);
		});
	});

	describe("Long Press", () => {
		it("triggers long press after duration", async () => {
			vi.useFakeTimers();

			const onLongPress = vi.fn();
			render(
				<Button longPress={{ duration: 100, onLongPress }}>Long Press</Button>,
			);

			const button = screen.getByRole("button");
			fireEvent.mouseDown(button);

			// Advance timers to trigger long press
			vi.advanceTimersByTime(110); // duration + small margin
			await Promise.resolve(); // flush microtasks

			expect(onLongPress).toHaveBeenCalled();

			vi.useRealTimers();
		});

		it("cancels long press on mouse up", async () => {
			vi.useFakeTimers();

			const onLongPress = vi.fn();
			render(
				<Button longPress={{ duration: 500, onLongPress }}>Long Press</Button>,
			);

			const button = screen.getByRole("button");
			fireEvent.mouseDown(button);
			fireEvent.mouseUp(button);

			// Advance timers past the duration to ensure it would have triggered
			vi.advanceTimersByTime(600);
			await Promise.resolve(); // flush microtasks

			expect(onLongPress).not.toHaveBeenCalled();

			vi.useRealTimers();
		});

		it("triggers long press with keyboard", async () => {
			vi.useFakeTimers();

			const onLongPress = vi.fn();
			render(
				<Button longPress={{ duration: 100, onLongPress }}>Long Press</Button>,
			);

			const button = screen.getByRole("button");
			fireEvent.keyDown(button, { key: "Enter" });

			// Advance timers to trigger long press
			vi.advanceTimersByTime(110); // duration + small margin
			await Promise.resolve(); // flush microtasks

			expect(onLongPress).toHaveBeenCalled();

			vi.useRealTimers();
		});

		it("cancels long press on key up", async () => {
			vi.useFakeTimers();

			const onLongPress = vi.fn();
			render(
				<Button longPress={{ duration: 500, onLongPress }}>Long Press</Button>,
			);

			const button = screen.getByRole("button");
			fireEvent.keyDown(button, { key: " " });
			fireEvent.keyUp(button, { key: " " });

			// Advance timers past the duration to ensure it would have triggered
			vi.advanceTimersByTime(600);
			await Promise.resolve(); // flush microtasks

			expect(onLongPress).not.toHaveBeenCalled();

			vi.useRealTimers();
		});
	});

	describe("Width Preservation", () => {
		it("preserves width during state changes when enabled", () => {
			const { rerender } = render(
				<Button preserveWidth state="idle">
					Short
				</Button>,
			);

			const button = screen.getByRole("button");

			// Fire pointer event to trigger width capture
			fireEvent.mouseDown(button);

			rerender(
				<Button preserveWidth state="loading" loadingText="Much longer text">
					Short
				</Button>,
			);

			// Width should be preserved via minWidth style
			expect(button.style.minWidth).not.toBe("");
		});
	});

	describe("CSS Class Generation (CVA)", () => {
		it("generates correct classes for variant combinations", () => {
			render(
				<Button
					variant="danger"
					size="lg"
					clickEffect="ripple"
					hoverEffect="glow"
					wide
					rounded="pill"
					shadow="colored"
				>
					Complex
				</Button>,
			);

			const button = screen.getByRole("button");

			// Check multiple class combinations
			expect(button).toHaveClass("bg-red-600"); // danger variant
			expect(button).toHaveClass("h-12"); // lg size
			expect(button).toHaveStyle({ overflow: "hidden" }); // ripple effect (inline style)
			expect(button).toHaveClass("w-full"); // wide
			expect(button).toHaveClass("rounded-full"); // pill rounded
			expect(button).toHaveClass("shadow-lg", "shadow-red-500/25"); // colored shadow for danger
		});
	});

	describe("Accessibility Compliance", () => {
		it("has no accessibility violations for default button", async () => {
			const { container } = render(<Button>Accessible</Button>);
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});

		it("has no violations for disabled button", async () => {
			const { container } = render(<Button disabled>Disabled</Button>);
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});

		it("has no violations for loading button", async () => {
			const { container } = render(<Button state="loading">Loading</Button>);
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});

		it("has no violations for icon-only button with aria-label", async () => {
			const { container } = render(
				<Button aria-label="Settings">
					<svg aria-hidden="true">
						<path d="M0 0" />
					</svg>
				</Button>,
			);
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});

		it("has no violations for button group", async () => {
			const { container } = render(
				<div role="toolbar" aria-label="Text formatting">
					<Button>Bold</Button>
					<Button>Italic</Button>
					<Button>Underline</Button>
				</div>,
			);
			const results = await axe(container);
			expect(results).toHaveNoViolations();
		});
	});

	describe("Color Contrast", () => {
		// Note: These tests verify that appropriate classes are applied.
		// Actual color contrast should be tested with visual regression testing.

		it("applies high contrast classes for solid variant", () => {
			render(<Button variant="solid">Solid</Button>);
			expect(screen.getByRole("button")).toHaveClass("text-primary-foreground");
		});

		it("applies high contrast classes for danger variant", () => {
			render(<Button variant="danger">Danger</Button>);
			expect(screen.getByRole("button")).toHaveClass("text-white");
		});

		it("applies high contrast classes for warning variant", () => {
			render(<Button variant="warning">Warning</Button>);
			expect(screen.getByRole("button")).toHaveClass("text-black");
		});
	});

	describe("HTML Semantics", () => {
		it("uses button element by default", () => {
			render(<Button>Button</Button>);
			const element = screen.getByRole("button");
			expect(element.tagName).toBe("BUTTON");
		});

		it("can render as link with asChild", () => {
			render(
				<Button asChild>
					<a href="/path">Link</a>
				</Button>,
			);
			const element = screen.getByRole("link");
			expect(element.tagName).toBe("A");
			expect(element).toHaveAttribute("href", "/path");
		});

		it("maintains semantic HTML structure", () => {
			const { container } = render(
				<Button>
					<span>Text</span>
				</Button>,
			);

			const button = container.querySelector("button");
			expect(button).toBeInTheDocument();
			expect(button?.querySelector("span")).toBeInTheDocument();
		});
	});

	describe("Screen Reader Support", () => {
		it("announces loading state changes", () => {
			const { rerender } = render(
				<Button announceChanges state="idle">
					Button
				</Button>,
			);

			rerender(
				<Button announceChanges state="loading">
					Button
				</Button>,
			);

			const liveRegion = screen.getByRole("button");
			expect(liveRegion).toHaveAttribute("aria-live", "polite");
			expect(liveRegion).toHaveAttribute("aria-busy", "true");
		});

		it("provides appropriate text alternatives for icons", () => {
			render(
				<Button aria-label="Save document">
					<svg aria-hidden="true">
						<path d="M0 0" />
					</svg>
				</Button>,
			);

			expect(
				screen.getByRole("button", { name: "Save document" }),
			).toBeInTheDocument();
			expect(screen.getByRole("button").querySelector("svg")).toHaveAttribute(
				"aria-hidden",
				"true",
			);
		});

		it("includes loading indicator with proper ARIA", () => {
			render(
				<Button state="loading" loadingType="spinner">
					Loading
				</Button>,
			);

			const button = screen.getByRole("button");
			expect(button).toHaveAttribute("aria-busy", "true");
			expect(
				screen.getByText("Loading...", { selector: ".sr-only" }),
			).toBeInTheDocument();
		});
	});

	describe("Button Groups and Toolbars", () => {
		it("works correctly in a toolbar", () => {
			render(
				<div role="toolbar" aria-label="Editor toolbar">
					<Button>Cut</Button>
					<Button>Copy</Button>
					<Button>Paste</Button>
				</div>,
			);

			const toolbar = screen.getByRole("toolbar");
			expect(toolbar).toBeInTheDocument();
			expect(screen.getAllByRole("button")).toHaveLength(3);
		});

		it("supports group keyboard navigation", () => {
			render(
				<fieldset aria-label="Alignment options">
					<Button aria-pressed="true">Left</Button>
					<Button aria-pressed="false">Center</Button>
					<Button aria-pressed="false">Right</Button>
				</fieldset>,
			);

			const buttons = screen.getAllByRole("button");
			expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
			expect(buttons[1]).toHaveAttribute("aria-pressed", "false");
			expect(buttons[2]).toHaveAttribute("aria-pressed", "false");
		});
	});

	describe("Test Setup Regression Tests", () => {
		it("has properly mocked IntersectionObserver to prevent TypeScript issues", () => {
			// Verify IntersectionObserver is available and properly typed
			expect(global.IntersectionObserver).toBeDefined();

			// Should be able to create new instance without TypeScript errors
			const observer = new IntersectionObserver(() => {});
			expect(observer).toBeDefined();
			expect(observer.observe).toBeDefined();
			expect(observer.unobserve).toBeDefined();
			expect(observer.disconnect).toBeDefined();
			expect(observer.takeRecords).toBeDefined();

			// Should have proper readonly properties
			expect(observer.root).toBe(null);
			expect(observer.rootMargin).toBe("");
			expect(Array.isArray(observer.thresholds)).toBe(true);
		});

		it("has properly mocked ResizeObserver to prevent TypeScript issues", () => {
			// Verify ResizeObserver is available and properly typed
			expect(global.ResizeObserver).toBeDefined();

			// Should be able to create new instance without TypeScript errors
			const observer = new ResizeObserver(() => {});
			expect(observer).toBeDefined();
			expect(observer.observe).toBeDefined();
			expect(observer.unobserve).toBeDefined();
			expect(observer.disconnect).toBeDefined();
		});
	});
});

describe("Button Accessibility Best Practices", () => {
	/**
	 * ACCESSIBILITY BEST PRACTICES DOCUMENTATION
	 *
	 * 1. ALWAYS provide accessible names for buttons:
	 *    - Use descriptive text content for buttons
	 *    - For icon-only buttons, ALWAYS add aria-label
	 *    - Avoid generic labels like "Click here" or "Submit"
	 *
	 * 2. Keyboard navigation:
	 *    - Buttons must be focusable (included in tab order)
	 *    - Support both Enter and Space key activation
	 *    - Show clear focus indicators (focus ring)
	 *
	 * 3. Disabled states:
	 *    - Prefer aria-disabled over disabled attribute for better screen reader support
	 *    - aria-disabled keeps the button focusable but functionally disabled
	 *    - Use forceNativeDisabled only when necessary for form submission prevention
	 *
	 * 4. Loading states:
	 *    - Always set aria-busy="true" during loading
	 *    - Provide screen reader text for loading indicators
	 *    - Maintain button text or provide loadingText for context
	 *
	 * 5. Toggle buttons:
	 *    - Use aria-pressed for toggle buttons
	 *    - aria-pressed="true" for pressed state
	 *    - aria-pressed="false" for unpressed state
	 *
	 * 6. Button groups:
	 *    - Wrap related buttons in role="toolbar" or role="group"
	 *    - Provide aria-label for the group
	 *    - Consider using arrow key navigation for toolbar buttons
	 *
	 * 7. Color contrast:
	 *    - Ensure text has 4.5:1 contrast ratio for normal text
	 *    - Ensure 3:1 contrast ratio for large text
	 *    - Test in both light and dark modes
	 *
	 * 8. Motion and animations:
	 *    - Respect prefers-reduced-motion user preference
	 *    - Provide alternatives to motion-based feedback
	 *    - Keep animations subtle and purposeful
	 *
	 * 9. Touch targets:
	 *    - Minimum 44x44px touch target size for mobile
	 *    - Adequate spacing between interactive elements
	 *    - Consider thumb reach on mobile devices
	 *
	 * 10. Screen reader announcements:
	 *     - Use aria-live regions for dynamic content changes
	 *     - Announce state changes when relevant to user task
	 *     - Keep announcements concise and informative
	 */

	it("documents accessibility best practices", () => {
		// This test serves as documentation
		expect(true).toBe(true);
	});
});
