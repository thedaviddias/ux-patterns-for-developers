#!/usr/bin/env bash

set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable
fi
if [[ -n "${PNPM_STORE_DIR:-}" ]]; then
  pnpm config set --global store-dir "${PNPM_STORE_DIR}"
fi
pnpm install --frozen-lockfile
node scripts/ci/validate-deploy-workflows.mjs
node --test scripts/ci/*.test.mjs
# Generate the real corpus and workspace exports before connector integration tests.
pnpm --filter web exec velite build
pnpm --filter web exec fumadocs-mdx
pnpm --filter @ux-patterns/mcp build
pnpm check:type
pnpm test
pnpm --filter @ux-patterns/mcp test:coverage --runInBand
