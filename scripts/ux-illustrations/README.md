# UX Illustration Tooling

This folder contains the automated tooling for generating and auditing UX pattern illustrations using Gemini's multimodal capabilities.

## Scripts

### 1. `generator.ts` (The Generator)
Automatically parses `.mdx` pattern files to create and insert Do/Don't comparison images.

- **`--scan-only`**: Scans all patterns and populates `prompts.json` with the generated prompts, but **does not** call the Gemini API or generate any images.
- **`--pattern=[name]`**: Target a specific pattern (e.g., `--pattern=modal`).
- **`--pair=[slug]`**: Target a specific bullet point pair (e.g., `--pair=do-dont-content-1`).
- **`--force`**: Regenerates images even if they already exist on disk, but **respects** the `locked: true` setting in `prompts.json`.
- **`--force-all`**: Regenerates everything, including images marked as `locked: true`.
- **`--dry-run`**: Processes only the first pattern/pair found.

**Examples:**
```bash
# Populate prompts JSON for all patterns (no generation)
npx tsx scripts/ux-illustrations/generator.ts --scan-only

# Generate only ONE specific picture for one pattern (respects lock)
npx tsx scripts/ux-illustrations/generator.ts --pattern=modal --pair=do-dont-content-1 --force

# Force regeneration of a locked image
npx tsx scripts/ux-illustrations/generator.ts --pattern=modal --pair=do-dont-content-1 --force-all

# Generate all missing images for a pattern
npx tsx scripts/ux-illustrations/generator.ts --pattern=autocomplete
```

### 2. `auditor.ts` (The Auditor)
Uses Gemini Vision to critique generated images and produce a quality report.

- **`--pattern=[name]`**: Audit images for a specific pattern.

**Output:**
- `scripts/ux-illustrations/qa-report.json`: Machine-readable audit data.
- `scripts/ux-illustrations/qa-report.md`: A visual gallery of "FAIL" and "WARNING" images with specific critiques and prompt fix suggestions.

### 3. `optimizer.ts` (The AI Prompt Engineer)
Uses a text-only LLM (`gemini-2.5-flash`) to rewrite and improve a specific prompt in `prompts.json` to be more descriptive and accurate for the image generator.

- **`--pattern=[name]`**: The pattern containing the prompt to optimize.
- **`--pair=[slug]`**: The specific image prompt to optimize.

**Examples:**
```bash
# Ask the AI to write a better prompt for this specific image
npx tsx scripts/ux-illustrations/optimizer.ts --pattern=autocomplete --pair=do-dont-content-1
```

## Configuration

- **`prompts.json`**: This is the source of truth for all prompts.
  - **`locked`: true**: Prevents regeneration via the standard `--force` flag. Use this for "perfect" images. Overridden only by `--force-all`.
  - **`prompt`**: Edit this string to tweak the illustration.

## Workflow
1. Run `npx tsx scripts/ux-illustrations/generator.ts --scan-only` to sync documentation changes to the prompt database.
2. (Optional) Tweak prompts in `prompts.json`.
3. Generate missing images: `npx tsx scripts/ux-illustrations/generator.ts`.
4. **Generate ONLY ONE image:** `npx tsx scripts/ux-illustrations/generator.ts --pattern=[name] --pair=[slug] --force`
5. Run `npx tsx scripts/ux-illustrations/auditor.ts` to review results.
