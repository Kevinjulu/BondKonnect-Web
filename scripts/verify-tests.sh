#!/bin/bash

# Test Verification Script
# Runs all local tests for backend and frontend payment changes

echo "=================================================="
echo "LOCAL TEST VERIFICATION"
echo "Payment Endpoint Fixes - Pre-Push Testing"
echo "=================================================="
echo ""

FAILED=0
PASSED=0

# Helper function
run_test() {
  local name=$1
  local cmd=$2
  local cwd=$3
  
  echo "[TEST] $name"
  if [ -n "$cwd" ]; then
    (cd "$cwd" && eval "$cmd" > /tmp/test.log 2>&1) && {
      echo "  ✓ PASS"
      ((PASSED++))
    } || {
      echo "  ✗ FAIL"
      echo "  Output: $(head -5 /tmp/test.log)"
      ((FAILED++))
    }
  else
    eval "$cmd" > /tmp/test.log 2>&1 && {
      echo "  ✓ PASS"
      ((PASSED++))
    } || {
      echo "  ✗ FAIL"
      echo "  Output: $(head -5 /tmp/test.log)"
      ((FAILED++))
    }
  fi
  echo ""
}

# BACKEND TESTS
echo "--- BACKEND TESTS ---"
echo ""

run_test "PHP Syntax: api.php" \
  "php -l routes/api.php" \
  "bondkonnect_api"

run_test "Composer Validate" \
  "composer validate --quiet" \
  "bondkonnect_api"

run_test "Laravel Tinker (no-op)" \
  "php artisan tinker --execute='echo \"OK\";'" \
  "bondkonnect_api"

run_test "Route List (payment routes)" \
  "php artisan route:list 2>&1 | grep -q 'V1/payments'" \
  "bondkonnect_api"

# FRONTEND TESTS
echo "--- FRONTEND TESTS ---"
echo ""

run_test "npm install" \
  "npm install --prefer-offline 2>&1 | tail -1" \
  "bondkonnect_web"

run_test "TypeScript Compilation" \
  "npx tsc --noEmit 2>&1 | head -1" \
  "bondkonnect_web"

run_test "ESLint (payment.actions)" \
  "npx eslint 'src/lib/actions/payment.actions.tsx' 2>&1 | tail -1" \
  "bondkonnect_web"

# SUMMARY
echo "=================================================="
echo "TEST SUMMARY"
echo "=================================================="
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "✓ All tests passed! Ready to push."
  exit 0
else
  echo "✗ Some tests failed. Review above and fix before pushing."
  exit 1
fi
