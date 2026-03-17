#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/create-pr.sh "branch-name" "Commit message title" "Commit body (optional)"
# Defaults:
#   branch: pr/2026-02-15-payment-endpoint-fixes
#   title: fix: payment endpoint mismatches and compatibility routes

DEFAULT_BRANCH="pr/2026-02-15-payment-endpoint-fixes"
BRANCH="${1:-$DEFAULT_BRANCH}"
COMMIT_TITLE="${2:-'fix: payment endpoint mismatches and compatibility routes'}"
COMMIT_BODY="${3:-'Updates frontend action endpoints to use V1/financials and V1/services endpoints; adds temporary compatibility routes in backend for migration window.'}"

# Ensure we're in git repo
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Not in a git repository. Exiting."
  exit 1
fi

# Fetch latest
git fetch origin

# Create or switch to branch
if git rev-parse --verify --quiet "$BRANCH" >/dev/null 2>&1; then
  echo "Branch '$BRANCH' already exists locally."
  git checkout "$BRANCH"
else
  echo "Creating branch '$BRANCH'..."
  git checkout -b "$BRANCH"
fi

# Stage all changes
git add -A

# Commit
if git diff --staged --quiet; then
  echo "No staged changes to commit; skipping commit."
else
  if git commit -m "$COMMIT_TITLE" -m "$COMMIT_BODY"; then
    echo "Committed changes."
  else
    echo "Commit failed or nothing to commit; continuing..."
  fi
fi

# Push
echo "Pushing branch '$BRANCH' to origin..."
git push -u origin "$BRANCH"

# Try to open PR
if command -v gh >/dev/null 2>&1; then
  echo "Opening PR using gh CLI..."
  gh pr create --fill --head "$BRANCH" || {
    echo "gh failed; try creating PR manually at the URL below."
  }
  exit 0
fi

# Fallback: print URL
REMOTE_URL=$(git remote get-url origin)

# Parse owner/repo from URL
if [[ "$REMOTE_URL" =~ ^git@github\.com:(.+)/(.+)\.git$ ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
elif [[ "$REMOTE_URL" =~ ^https://github\.com/(.+)/(.+)\.git$ ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
elif [[ "$REMOTE_URL" =~ ^https://github\.com/(.+)/(.+)$ ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
else
  echo "Unable to parse GitHub URL from origin: $REMOTE_URL"
  echo "Create PR manually: https://github.com/<owner>/<repo>/pull/new/$BRANCH"
  exit 1
fi

DEFAULT_BRANCH="$(git remote show origin | sed -n 's/.*HEAD branch: //p')"
: "${DEFAULT_BRANCH:=main}"

PR_URL="https://github.com/${OWNER}/${REPO}/compare/${DEFAULT_BRANCH}...${BRANCH}?expand=1"

echo ""
echo "================================================"
echo "Branch pushed! Open PR at:"
echo "$PR_URL"
echo "================================================"
echo ""
echo "Attempting to open in browser..."

# Cross-platform open
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$PR_URL" || true
elif command -v open >/dev/null 2>&1; then
  open "$PR_URL" || true
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
  start "$PR_URL" || true
else
  echo "Could not auto-open browser; visit the URL above manually."
fi
