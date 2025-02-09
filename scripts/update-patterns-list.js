import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PATTERNS_DIR = path.join(path.dirname(__dirname), "content/en/patterns");
const README_PATH = path.join(path.dirname(__dirname), "README.md");
const PROD_URL = "https://uxpatterns.dev/patterns";

// Markers for the patterns section in README
const START_MARKER =
  "<!-- PATTERNS-LIST:START - Do not remove or modify this section -->";
const END_MARKER = "<!-- PATTERNS-LIST:END -->";

// Helper to get pattern metadata
function getPatternMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const { data } = matter(content);

    // Extract build effort
    const buildEffortMatch = content.match(/<BuildEffort\s+level="([^"]+)"/);
    const buildEffort = buildEffortMatch ? buildEffortMatch[1] : null;

    // Check for accessibility section
    const hasAccessibility = content.includes("### Accessibility");

    // Check for code examples
    const hasCodeExamples = content.includes("## Code Examples");

    // Check for mobile/responsive considerations
    const hasMobileConsiderations =
      content.includes("mobile") || content.includes("responsive");

    return {
      summary: data.summary || "",
      description: data.description || "",
      status: data.status || "draft",
      buildEffort,
      hasAccessibility,
      hasCodeExamples,
      hasMobileConsiderations,
    };
  } catch (error) {
    return {
      summary: "",
      description: "",
      status: "draft",
      buildEffort: null,
      hasAccessibility: false,
      hasCodeExamples: false,
      hasMobileConsiderations: false,
    };
  }
}

// Convert string to title case
function toTitleCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getImplementationComplexity(effort) {
  switch (effort) {
    case "low":
      return "⚡️ Simple implementation";
    case "medium":
      return "🔧 Moderate complexity";
    case "high":
      return "🛠️ Complex implementation";
    default:
      return null;
  }
}

function generatePatternsList() {
  // Get all pattern categories (directories)
  const categories = fs
    .readdirSync(PATTERNS_DIR)
    .filter(
      (item) =>
        fs.statSync(path.join(PATTERNS_DIR, item)).isDirectory() &&
        !item.startsWith("_")
    );

  // Generate patterns list
  let patternsContent =
    "\nThis is an updated list of available and incoming patterns.\n";

  for (const category of categories) {
    const categoryPath = path.join(PATTERNS_DIR, category);
    const patterns = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".mdx") && !file.startsWith("_"))
      .map((file) => file.replace(".mdx", ""));

    if (patterns.length > 0) {
      const categoryTitle = toTitleCase(category);
      patternsContent += `\n### ${categoryTitle}\n\n`;

      for (const pattern of patterns) {
        const patternPath = path.join(categoryPath, `${pattern}.mdx`);
        const metadata = getPatternMetadata(patternPath);
        const patternTitle = toTitleCase(pattern);

        if (
          metadata.status === "complete" ||
          metadata.status === "in-progress"
        ) {
          patternsContent += `#### [${patternTitle}](${PROD_URL}/${category}/${pattern})\n`;
          if (metadata.summary) {
            patternsContent += `> ${metadata.summary}\n\n`;
          }

          // Build features array
          const features = [];

          // Add complexity
          if (metadata.buildEffort) {
            const complexity = getImplementationComplexity(
              metadata.buildEffort
            );
            if (complexity) {
              features.push(complexity);
            }
          }

          // Always add documentation since it's complete
          features.push("📚 Full guide");

          // Add additional features if available
          if (metadata.hasAccessibility) {
            features.push("♿️ WCAG 2.1");
          }
          if (metadata.hasMobileConsiderations) {
            features.push("📱 Mobile-ready");
          }
          if (metadata.hasCodeExamples) {
            features.push("💻 Examples");
          }

          // Add features line
          if (features.length > 0) {
            patternsContent += `<sub>${features.join(" • ")}</sub>\n\n`;
          }

          if (metadata.description) {
            patternsContent += `${metadata.description}\n\n`;
          }
        } else {
          patternsContent += `#### ${patternTitle}\n`;
          patternsContent += `> Coming soon\n\n`;
        }
      }
    }
  }

  return patternsContent;
}

function updatePatternsList() {
  try {
    // Read current README
    let readme = fs.readFileSync(README_PATH, "utf8");

    // Check if markers exist
    if (!readme.includes(START_MARKER) || !readme.includes(END_MARKER)) {
      throw new Error(
        `Could not find ${START_MARKER} and ${END_MARKER} markers in README.md. Please add them around the patterns section.`
      );
    }

    // Generate new patterns list
    const patternsContent = generatePatternsList();

    // Replace content between markers
    const newReadme = readme.replace(
      new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`),
      `${START_MARKER}${patternsContent}${END_MARKER}`
    );

    // Write updated README
    fs.writeFileSync(README_PATH, newReadme);
    console.log("✅ README.md has been updated successfully!");
  } catch (error) {
    console.error("Error updating patterns list:", error);
    process.exit(1);
  }
}

// Run the update if this file is being executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  updatePatternsList();
}

export default updatePatternsList;
