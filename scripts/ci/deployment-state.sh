#!/usr/bin/env bash

set -euo pipefail

readonly operation="${1:-}"
: "${CI_DEPLOYMENT_STATE_DIR:?CI_DEPLOYMENT_STATE_DIR is required}"
: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${GITHUB_SHA:?GITHUB_SHA is required}"

readonly repository_key="${GITHUB_REPOSITORY//\//_}"
readonly state_file="${CI_DEPLOYMENT_STATE_DIR}/${repository_key}.sha"

mkdir -p "${CI_DEPLOYMENT_STATE_DIR}"

case "${operation}" in
  check)
    deployed_sha=""
    if [[ -f "${state_file}" ]]; then
      deployed_sha="$(<"${state_file}")"
    fi
    if [[ "${deployed_sha}" == "${GITHUB_SHA}" ]]; then
      echo "required=false" >> "${GITHUB_OUTPUT}"
      echo "Commit ${GITHUB_SHA} is already deployed."
    else
      echo "required=true" >> "${GITHUB_OUTPUT}"
      echo "Commit ${GITHUB_SHA} needs deployment."
    fi
    ;;
  mark)
    temporary_file="${state_file}.tmp.$$"
    printf '%s\n' "${GITHUB_SHA}" > "${temporary_file}"
    mv "${temporary_file}" "${state_file}"
    echo "Recorded deployed commit ${GITHUB_SHA}."
    ;;
  *)
    echo "Usage: $0 check|mark" >&2
    exit 2
    ;;
esac
