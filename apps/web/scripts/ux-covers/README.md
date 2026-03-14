# AI Cover Tooling

This folder contains the prompt-driven cover image workflow for pattern cover assets.

## Files

- `prompts.json`: Shared base prompt plus per-pattern prompt overrides.
- `generator.ts`: Seeds prompt entries and generates `public/covers/patterns/*.png`.
- `optimizer.ts`: Rewrites the pattern-specific prompt fields for one cover entry.

## Commands

```bash
# Seed missing prompt entries without generating images
pnpm --filter web exec tsx scripts/ux-covers/generator.ts --scan-only

# Generate all missing AI covers
pnpm --filter web exec tsx scripts/ux-covers/generator.ts

# Regenerate one specific cover
pnpm --filter web exec tsx scripts/ux-covers/generator.ts --pattern=modal --force

# Regenerate a locked cover
pnpm --filter web exec tsx scripts/ux-covers/generator.ts --pattern=modal --force-all

# Ask Gemini to improve one pattern's subjectPrompt and promptAddon
pnpm --filter web exec tsx scripts/ux-covers/optimizer.ts --pattern=modal
```

## Workflow

1. Run the generator with `--scan-only` to seed missing entries in `prompts.json`.
2. Edit `subjectPrompt` and `promptAddon` for the patterns you want to customize.
3. Generate covers with the generator.
4. Lock strong covers with `"locked": true` to prevent accidental regeneration.

## Fallback Renderer

The deterministic React cover renderer still exists as a manual fallback:

```bash
pnpm --filter web art:render
```
