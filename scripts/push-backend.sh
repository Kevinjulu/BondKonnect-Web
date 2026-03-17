#!/bin/bash

# Backend Push Script for BondKonnect-Backend Repo
# This script creates a feature branch and pushes payment endpoint fixes to backend repo

set -e

echo "=================================================="
echo "Backend Payment Fix: Branch & Push"
echo "=================================================="

cd bondkonnect_api || exit 1

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
echo "Staging backend payment changes..."
git add \
  routes/api.php \
  app/Http/Controllers/V1/Financials/MpesaController.php \
  app/Http/Controllers/V1/Financials/PaypalController.php \
  database/seeders/Phase4FinancialSeeder.php \
  2>/dev/null || true

# Commit
echo "Committing changes..."
git commit -m "fix: payment endpoint compatibility routes and user_id insertions

- Adds compatibility routes under V1/payments for legacy frontend paths
- Updates MpesaController and PaypalController to insert user_id
- Normalizes parameter names and request validation in seeder

Related to: https://github.com/Kevinjulu/BondKonnect-Web/pull/*" || echo "No new changes to commit"

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
echo "  https://github.com/Kevinjulu/BondKonnect-Backend"
echo "=================================================="
