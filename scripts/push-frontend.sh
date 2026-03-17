#!/bin/bash

# Frontend Push Script for BondKonnect-Web Repo
# This script creates a feature branch and pushes payment action fixes to frontend repo

set -e

echo "=================================================="
echo "Frontend Payment Fix: Branch & Push"
echo "=================================================="

cd bondkonnect_web || exit 1

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $CURRENT_BRANCH"

# Create feature branch from main/master
echo "Checking out main/master..."
git fetch origin
git checkout main 2>/dev/null || git checkout master 2>/dev/null || echo "Could not checkout main/master, staying on $CURRENT_BRANCH"

# Create feature branch
BRANCH_NAME="fix/payment-endpoint-2026-02-15"
echo "Creating branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Stage changes
echo "Staging frontend payment changes..."
git add \
  src/lib/actions/payment.actions.tsx \
  2>/dev/null || true

# Commit
echo "Committing changes..."
git commit -m "fix: update payment action endpoints to use correct API paths

- getAllSubscriptionPlans: V1/payments → V1/financials/get-all-sub-plans
- getUserSubscriptions: change to POST with user_email parameter
- createTransaction: V1/payments → V1/services/create-transaction
- getUserTransactions: V1/payments → V1/services/get-user-transactions
- markTransactionStatus: V1/payments → V1/services/mark-transaction-status
- Normalize parameter names: email → user_email, transaction_id → trans_id

Aligns with backend endpoint reorganization for payment/subscription logic.
Backward compatibility maintained via backend compatibility routes.

Related to: https://github.com/Kevinjulu/BondKonnect-Backend/pull/*" || echo "No new changes to commit"

# Show what will be pushed
echo ""
echo "Changes to push:"
git log --oneline origin/main.."$BRANCH_NAME" 2>/dev/null || echo "(local branch, compare manually)"
git status

echo ""
echo "=================================================="
echo "Ready to push branch: $BRANCH_NAME"
echo "To push, run:"
echo ""
echo "  git push -u origin $BRANCH_NAME"
echo ""
echo "Then create a PR at:"
echo "  https://github.com/Kevinjulu/BondKonnect-Web"
echo "=================================================="
