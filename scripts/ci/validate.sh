#!/usr/bin/env bash

set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable
fi
if [[ -n "${PNPM_STORE_DIR:-}" ]]; then
  pnpm config set --global store-dir "${PNPM_STORE_DIR}"
fi
pnpm install --frozen-lockfile
pnpm check:type
