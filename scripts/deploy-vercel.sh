#!/usr/bin/env bash
set -euo pipefail

# Requires: npx vercel login (one-time)
# Claim DB first if using Prisma create-db (CLAIM_URL in .env)

SCOPE="${VERCEL_SCOPE:-adeel3330s-projects}"
PROJECT="bisma-asma-cosmetics"

echo "Linking project…"
npx vercel link --yes --scope "$SCOPE" --project "$PROJECT" || \
  npx vercel project add "$PROJECT" --scope "$SCOPE"

echo "Pushing env from .env (interactive if missing)…"
# Prefer setting via dashboard if prompts fail in CI
npx vercel env pull .env.vercel --yes --scope "$SCOPE" || true

echo "Deploying production…"
npx vercel --prod --yes --scope "$SCOPE"

echo "Done. Update BETTER_AUTH_URL + NEXT_APP_URL to the deployment URL, then redeploy."
