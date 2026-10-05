# Routed Vercel deployment

The selected `BUILD_PROVIDER` runs three isolated jobs: authenticated preparation,
validation/build without `VERCEL_TOKEN`, and authenticated deployment of prebuilt
output. Both providers use the repository root and full git history for content dates.

## Required secrets

Keep the existing `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` settings
(Gitea stores the organization/project IDs as variables).

Before enabling the updated production workflows, provision `CI_ARTIFACT_KEY` in
both GitHub and Gitea repository Actions secrets. It must be 32 cryptographically
random bytes encoded as 64 hexadecimal characters. Generate it in a trusted
operator environment and transfer it directly to secret storage; do not put it in
source, chat, logs, repository variables, or artifacts. Changing CI credentials
requires operator approval. Use the same key throughout a workflow run; rotate it
between runs once no deployments are in flight.

Configuration and prebuilt-output tar archives are encrypted with AES-256-GCM and
fresh random nonces before upload, with one-day artifact retention. The helper
verifies the authentication tag before extraction and removes temporary plaintext
archives. Missing/invalid keys, damaged archives, and missing input files fail closed.
The encryption key is scoped to artifact transfer steps and is not passed to tar
or application build commands. It is separate from the Vercel deployment token.

PR validation uses no deployment or artifact-encryption secrets. It runs shell
syntax checks, CI regression tests, type checks, and the production application build.
It does not exercise production deployment or live cross-job artifact transfer.
