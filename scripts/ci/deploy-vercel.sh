#!/usr/bin/env bash

set -euo pipefail

readonly vercel_cli_version="58.11.0"
readonly project_directory="."
readonly deployment_environment="${1:-production}"
readonly operation="${2:-}"

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
    echo "Usage: $0 [production|preview] [pull|build|deploy]" >&2
    exit 2
    ;;
esac

case "${operation}" in
  pull | deploy)
    required_variables=(VERCEL_TOKEN VERCEL_ORG_ID VERCEL_PROJECT_ID)
    ;;
  build)
    required_variables=(VERCEL_ORG_ID VERCEL_PROJECT_ID)
    ;;
  *)
    echo "Usage: $0 [production|preview] [pull|build|deploy]" >&2
    exit 2
    ;;
esac

for variable_name in "${required_variables[@]}"; do
  if [[ -z "${!variable_name:-}" ]]; then
    echo "${variable_name} is required." >&2
    exit 1
  fi
done

case "${operation}" in
  pull)
    pnpm dlx "vercel@${vercel_cli_version}" pull \
      --yes \
      --environment="${environment_flag}" \
      --token="${VERCEL_TOKEN}" \
      --cwd="${project_directory}"
    ;;
  build)
    unset VERCEL_TOKEN
    exec pnpm dlx "vercel@${vercel_cli_version}" build \
      ${deployment_flags[@]+"${deployment_flags[@]}"} \
      --cwd="${project_directory}"
    ;;
  deploy)
    deployment_output="$(mktemp)"
    readonly deployment_output
    trap 'rm -f "${deployment_output}"' EXIT

    set +e
    pnpm dlx "vercel@${vercel_cli_version}" deploy \
      --prebuilt \
      --yes \
      --no-color \
      ${deployment_flags[@]+"${deployment_flags[@]}"} \
      --token="${VERCEL_TOKEN}" \
      --cwd="${project_directory}" 2>&1 | tee "${deployment_output}"
    readonly deploy_status="${PIPESTATUS[0]}"
    set -e

    if [[ "${deploy_status}" -eq 0 ]]; then
      exit 0
    fi

    # The CLI can return a non-zero status after Vercel has accepted and completed
    # a deployment. Verify the emitted deployment URL before treating that as a
    # failed release, so a successful production deployment is not reported as a
    # failed CI job.
    deployment_url="$(grep -Eo 'https://[^[:space:]]+\.vercel\.app' "${deployment_output}" | tail -n 1 || true)"
    readonly deployment_url
    if [[ -z "${deployment_url}" ]]; then
      exit "${deploy_status}"
    fi

    pnpm dlx "vercel@${vercel_cli_version}" inspect "${deployment_url}" \
      --wait \
      --timeout=5m \
      --token="${VERCEL_TOKEN}" \
      --cwd="${project_directory}"
    ;;
esac
