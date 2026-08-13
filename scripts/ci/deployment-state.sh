#!/usr/bin/env bash

set -euo pipefail

readonly operation="${1:-}"
: "${GITHUB_SHA:?GITHUB_SHA is required}"
: "${VERCEL_TOKEN:?VERCEL_TOKEN is required}"
: "${VERCEL_ORG_ID:?VERCEL_ORG_ID is required}"
: "${VERCEL_PROJECT_ID:?VERCEL_PROJECT_ID is required}"

case "${operation}" in
  check)
    deployments_file="$(mktemp)"
    trap 'rm -f "${deployments_file}"' EXIT
    curl --fail --silent --show-error --retry 3 \
      --header "Authorization: Bearer ${VERCEL_TOKEN}" \
      "https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&teamId=${VERCEL_ORG_ID}&target=production&limit=10" \
      > "${deployments_file}"
    deployed_sha="$(node -e '
      const fs = require("node:fs");
      const response = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      const deployment = response.deployments?.find((candidate) => candidate.state === "READY");
      process.stdout.write(deployment?.meta?.gitCommitSha ?? "");
    ' "${deployments_file}")"
    if [[ "${deployed_sha}" == "${GITHUB_SHA}" ]]; then
      echo "required=false" >> "${GITHUB_OUTPUT}"
      echo "Commit ${GITHUB_SHA} is already deployed."
    else
      echo "required=true" >> "${GITHUB_OUTPUT}"
      echo "Commit ${GITHUB_SHA} needs deployment."
    fi
    ;;
  *)
    echo "Usage: $0 check" >&2
    exit 2
    ;;
esac
