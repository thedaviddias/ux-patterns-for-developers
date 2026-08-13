#!/usr/bin/env bash

set -euo pipefail

readonly vercel_cli_version="58.11.0"
readonly project_directory="apps/web"
readonly deployment_environment="${1:-production}"

case "${deployment_environment}" in
  production)
    readonly environment_flag="production"
    readonly -a deployment_flags=(--prod)
    ;;
  preview)
    readonly environment_flag="preview"
    readonly -a deployment_flags=()
    ;;
  *)
    echo "Usage: $0 [production|preview]" >&2
    exit 2
    ;;
esac

for variable_name in VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID; do
  if [[ -z "${!variable_name:-}" ]]; then
    echo "${variable_name} is required." >&2
    exit 1
  fi
done

pnpm dlx "vercel@${vercel_cli_version}" pull \
  --yes \
  --environment="${environment_flag}" \
  --token="${VERCEL_TOKEN}" \
  --cwd="${project_directory}"

pnpm dlx "vercel@${vercel_cli_version}" build \
  "${deployment_flags[@]}" \
  --token="${VERCEL_TOKEN}" \
  --cwd="${project_directory}"

pnpm dlx "vercel@${vercel_cli_version}" deploy \
  --prebuilt \
  "${deployment_flags[@]}" \
  --token="${VERCEL_TOKEN}" \
  --cwd="${project_directory}"
