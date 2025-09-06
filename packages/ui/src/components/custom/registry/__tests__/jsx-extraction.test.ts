import undent from "undent";
import { describe, expect, it } from "vitest";

// Import the actual functions from the component file
// We'll copy them here for testing and then make sure the component matches

function formatJSX(jsxCode: string): string {
	const normalized = undent(jsxCode);
	const lines = normalized.split("\n");
	const result: string[] = [];

	// Track depth by analyzing the structure
	let depth = 0;

	for (let i = 0; i < lines.length; i++) {
		const trimmed = lines[i].trim();

		if (trimmed === "") {
			result.push("");
			continue;
		}

		// Count tag changes on this line
		const openingTags = (trimmed.match(/<[A-Za-z][^>]*>/g) || []).filter(
			(tag) => !tag.endsWith("/>"),
		).length;
		const closingTags = (trimmed.match(/<\/[^>]*>/g) || []).length;
		const fragments = (trimmed.match(/<>/g) || []).length;
		const closingFragments = (trimmed.match(/<\/>/g) || []).length;

		// If line starts with closing tag, decrease depth first
		if (/^<\//.test(trimmed) || trimmed === "</>") {
			depth = Math.max(0, depth - 1);
		}

		// Add line with current depth
		const indent = "  ".repeat(depth);
		result.push(indent + trimmed);

		// Calculate net depth change for this line (only for non-closing-only lines)
		if (!(/^<\//.test(trimmed) || trimmed === "</>")) {
			const netChange =
				openingTags + fragments - closingTags - closingFragments;

			// Apply depth change for future lines
			if (netChange > 0) {
				depth += netChange;
			}
		}
	}

	return result.join("\n");
}

function extractJSXFromComponent(code: string): string | null {
	try {
		const unescapedCode = code
			.replace(/\\n/g, "\n")
			.replace(/\\t/g, "\t")
			.replace(/\\"/g, '"')
			.replace(/\\\\/g, "\\");

		const returnPattern = /return\s*(?:\([\s\S]*?\)|[\s\S]*?);?\s*}?\s*$/m;
		const returnMatch = unescapedCode.match(returnPattern);

		if (!returnMatch) {
			return null;
		}

		const content = returnMatch[0];

		const jsxMatch = content.match(
			/return\s*(?:\(\s*)?([\s\S]*?)(?:\s*\))?\s*;?\s*}?\s*$/,
		);
		if (!jsxMatch) {
			return null;
		}

		let jsxContent = jsxMatch[1].trim();
		jsxContent = jsxContent.replace(/[;}]+\s*$/, "").trim();

		const result = formatJSX(jsxContent);
		return result;
	} catch (error) {
		console.error("Error extracting JSX:", error);
		return null;
	}
}

describe("JSX Extraction and Formatting", () => {
	describe("Basic JSX extraction", () => {
		it("should extract simple single-line JSX", () => {
			const input = `import { Button } from "../ui/button";

export default function ButtonLink() {
  return <Button variant="link">Link</Button>;
}`;

			const expected = `<Button variant="link">Link</Button>`;

			const result = extractJSXFromComponent(input);
			expect(result).toBe(expected);
		});

		it("should extract multi-line JSX with proper indentation", () => {
			const input = `import { Button } from "../ui/button";
import { Settings } from "lucide-react";

export default function ButtonSizes() {
  return (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </div>
  );
}`;

			const expected = `<div className="flex items-center gap-4">
  <Button size="sm">Small</Button>
  <Button size="default">Default</Button>
  <Button size="lg">Large</Button>
  <Button size="icon">
    <Settings className="h-4 w-4" />
  </Button>
</div>`;

			const result = extractJSXFromComponent(input);
			expect(result).toBe(expected);
		});

		it("should handle JSX fragments", () => {
			const input = `export default function Fragment() {
  return (
    <>
      <Button>First</Button>
      <Button>Second</Button>
    </>
  );
}`;

			const expected = `<>
  <Button>First</Button>
  <Button>Second</Button>
</>`;

			const result = extractJSXFromComponent(input);
			expect(result).toBe(expected);
		});
	});

	describe("Complex structures", () => {
		it("should handle nested JSX with mixed content", () => {
			const input = `export default function ComplexButton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Icon on the Left</h4>
        <div className="flex flex-wrap gap-2">
          <Button>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
}`;

			const expected = `<div className="space-y-6">
  <div className="space-y-2">
    <h4 className="text-sm font-medium">Icon on the Left</h4>
    <div className="flex flex-wrap gap-2">
      <Button>
        <Plus className="h-4 w-4" />
        Add Item
      </Button>
    </div>
  </div>
</div>`;

			const result = extractJSXFromComponent(input);
			expect(result).toBe(expected);
		});

		it("should handle loading states with conditional rendering", () => {
			const input = `export default function LoadingStates() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
      <Button disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        Processing...
      </Button>
    </div>
  );
}`;

			const expected = `<div className="flex flex-wrap items-center gap-2">
  <Button onClick={handleClick} disabled={isLoading}>
    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    {isLoading ? "Saving..." : "Save Changes"}
  </Button>
  <Button disabled>
    <Loader2 className="h-4 w-4 animate-spin" />
    Processing...
  </Button>
</div>`;

			const result = extractJSXFromComponent(input);
			expect(result).toBe(expected);
		});
	});

	describe("HTML formatting", () => {
		// Copy the formatHTML function for testing
		function formatHTML(html: string): string {
			// First, add line breaks around tags and handle text content properly
			let formatted = html
				.replace(/></g, '>\n<')  // Add line breaks between adjacent tags
				.replace(/>([^<\n]+)</g, '>\n$1\n<')  // Put text content on separate lines
				.split('\n')
				.map(line => line.trim())
				.filter(line => line.length > 0);

			let depth = 0;
			const result: string[] = [];

			for (const line of formatted) {
				const trimmed = line.trim();

				// Check if this line is a closing tag
				const isClosingTag = /^<\//.test(trimmed);

				// Decrease depth for closing tags
				if (isClosingTag) {
					depth = Math.max(0, depth - 1);
				}

				// Add line with indentation
				const indent = '  '.repeat(depth);
				result.push(indent + trimmed);

				// Increase depth for opening tags that aren't self-closing or don't close on same line
				const hasOpeningTag = /<[A-Za-z]/.test(trimmed);
				const isSelfClosing = trimmed.endsWith('/>');
				const hasClosingOnSameLine = /<\//.test(trimmed);

				if (hasOpeningTag && !isSelfClosing && !hasClosingOnSameLine && !isClosingTag) {
					depth++;
				}
			}

			return result.join('\n');
		}

		it("should format simple HTML correctly", () => {
			const input = `<button class="btn btn-primary">Click me</button>`;
			const expected = `<button class="btn btn-primary">
  Click me
</button>`;

			const result = formatHTML(input);
			expect(result).toBe(expected);
		});

		it("should format nested HTML with proper indentation", () => {
			const input = `<div class="container"><button class="btn">Save</button><span class="text">Processing</span></div>`;
			const expected = `<div class="container">
  <button class="btn">
    Save
  </button>
  <span class="text">
    Processing
  </span>
</div>`;

			const result = formatHTML(input);
			expect(result).toBe(expected);
		});

		it("should handle self-closing HTML tags", () => {
			const input = `<div><img src="test.jpg" alt="test"/><br/><span>Text</span></div>`;
			const expected = `<div>
  <img src="test.jpg" alt="test"/>
  <br/>
  <span>
    Text
  </span>
</div>`;

			const result = formatHTML(input);
			expect(result).toBe(expected);
		});

		it("should handle complex nested HTML", () => {
			const input = `<div class="flex gap-2"><button class="btn"><svg class="icon"></svg>Save</button><button disabled><span>Loading</span></button></div>`;
			const expected = `<div class="flex gap-2">
  <button class="btn">
    <svg class="icon">
    </svg>
    Save
  </button>
  <button disabled>
    <span>
      Loading
    </span>
  </button>
</div>`;

			const result = formatHTML(input);
			expect(result).toBe(expected);
		});
	});
});
