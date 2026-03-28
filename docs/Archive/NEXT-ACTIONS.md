# QUICK REFERENCE: Payment Endpoint Fixes - Ready for Testing

## 🎯 What Was Done (Session Summary)

### Backend Changes ✅
1. **Compatibility Routes** (`bondkonnect_api/routes/api.php`)
   - Added 7 new routes under `/V1/payments` prefix
   - These routes forward to `/V1/financials` and `/V1/services` controllers
   - Parameter normalization: `email` → `user_email`, `transaction_id` → `trans_id`
   - All middleware preserved (auth, broker)

2. **Controllers Updated** 
   - `MpesaController.php`: Now inserts `user_id` when recording payments
   - `PaypalController.php`: Now inserts `user_id` when recording payments
   - Both maintain backward compatibility

3. **Database Migrations** (3 new)
   - Add `portal_id` to users table for identity mapping
   - Add `user_id` to payments table
   - Add foreign key constraint (with backfill command)

4. **Backfill Command**
   - `app/Console/Commands/BackfillPaymentsUserId.php`
   - Matches legacy payments to users via email
   - Supports dry-run and chunked execution

### Frontend Changes ✅
1. **Payment Actions** (`bondkonnect_web/src/lib/actions/payment.actions.tsx`)
   - Updated 8 endpoints to use correct API paths
   - All subscription calls now → `/V1/financials`
   - All transaction calls now → `/V1/services`
   - M-Pesa/PayPal remain → `/V1/payments`
   - Payloads normalized to match backend expectations

---

## 📋 Files to Push

### For Backend Repo (`BondKonnect-Backend`)
```
boundkonnect_api/routes/api.php
bondkonnect_api/app/Http/Controllers/V1/Financials/MpesaController.php
bondkonnect_api/app/Http/Controllers/V1/Financials/PaypalController.php
bondkonnect_api/database/seeders/Phase4FinancialSeeder.php
bondkonnect_api/app/Console/Commands/BackfillPaymentsUserId.php
bondkonnect_api/database/migrations/2026_02_14_*.php (all 3 migrations)
```

### For Frontend Repo (`BondKonnect-Web`)
```
bondkonnect_web/src/lib/actions/payment.actions.tsx
```

---

## ✅ Pre-Push Checklist

- [ ] **Backend PHP Syntax**: `php -l routes/api.php` → No errors ✅
- [ ] **Frontend TypeScript**: `cd bondkonnect_web && npx tsc --noEmit` → Run (pending)
- [ ] **Code Review**: Verify endpoint URLs in `payment.actions.tsx` → Pending
- [ ] **Branch Separation**: Split mixed changes into separate backend/frontend branches → Not done yet
- [ ] **Git Staging**: Clean stage with only relevant files for each repo → Not done yet

---

## 🚀 How to Push (Step-by-Step)

### Step 1: Verify Changes Locally (Critical!)

```bash
# Backend
cd bondkonnect_api
php -l routes/api.php
php artisan route:list | grep "V1/payments"

# Frontend
cd ../bondkonnect_web
npx tsc --noEmit
npx eslint 'src/lib/actions/payment.actions.tsx'
```

### Step 2: Create Backend Feature Branch

```bash
cd bondkonnect_api
git checkout -b fix/payment-endpoint-2026-02-15 origin/main

# Stage only backend payment files
git add routes/api.php \
  app/Http/Controllers/V1/Financials/MpesaController.php \
  app/Http/Controllers/V1/Financials/PaypalController.php \
  database/seeders/Phase4FinancialSeeder.php \
  app/Console/Commands/BackfillPaymentsUserId.php \
  database/migrations/2026_02_14_*.php

# Commit
git commit -m "fix: payment endpoint compatibility routes and user_id insertions

- Adds compatibility routes under V1/payments for legacy frontend paths
- Updates MpesaController and PaypalController to insert user_id
- Includes backfill command for existing payments
- Includes 3 migrations for user_id and portal_id setup"

# Push
git push -u origin fix/payment-endpoint-2026-02-15
```

### Step 3: Create Frontend Feature Branch

```bash
cd ../bondkonnect_web
git checkout -b fix/payment-endpoint-2026-02-15 origin/main

# Stage only frontend payment file
git add src/lib/actions/payment.actions.tsx

# Commit
git commit -m "fix: update payment action endpoints to use correct API paths

- getAllSubscriptionPlans: V1/payments → V1/financials/get-all-sub-plans
- getUserSubscriptions: change to POST with user_email parameter
- createTransaction: V1/payments → V1/services/create-transaction
- getUserTransactions: V1/payments → V1/services/get-user-transactions
- markTransactionStatus: V1/payments → V1/services/mark-transaction-status
- Normalize email → user_email, transaction_id → trans_id

Aligns with backend endpoint reorganization. Backward compatibility
maintained via backend compatibility routes."

# Push
git push -u origin fix/payment-endpoint-2026-02-15
```

### Step 4: Create PRs on GitHub

1. **Backend PR**: https://github.com/Kevinjulu/BondKonnect-Backend/pulls
   - Base: `main` or `master`
   - Compare: `fix/payment-endpoint-2026-02-15`
   - Description: Use commit message above

2. **Frontend PR**: https://github.com/Kevinjulu/BondKonnect-Web/pulls
   - Base: `main` or `master`
   - Compare: `fix/payment-endpoint-2026-02-15`
   - Description: Use commit message above

---

## 🧪 Testing During Review

### Manual Smoke Tests (if staging environment available)

```bash
# Test M-Pesa subscription flow
curl -X GET "https://api.bondkonnect.com/api/V1/payments/get-all-subscription-plans"

# Test PayPal flow
curl -X POST "https://api.bondkonnect.com/api/V1/payments/paypal/create-order" \
  -H "Content-Type: application/json" \
  -d '{"amount":10,"plan_id":1}'

# Test transaction endpoint
curl -X POST "https://api.bondkonnect.com/api/V1/payments/create-transaction" \
  -H "Content-Type: application/json" \
  -d '{"user_email":"test@example.com","amount":100}'
```

### Verify Endpoint Compatibility

```
Old Frontend Path          →    New Backend Path         →    Method
V1/payments/get-all...     →    V1/financials/get-all-sub-plans   GET
V1/payments/get-user-sub...→    V1/financials/get-user-subscriptions POST
V1/payments/create-trans...→    V1/services/create-transaction     POST
V1/payments/paypal/...     →    V1/payments/paypal/...             POST (unchanged)
```

---

## 📚 Documentation Created

Located in workspace root:
- `TEST-AND-DEPLOY-PLAN.md` — Detailed testing instructions
- `PRE-PUSH-CHECKLIST.md` — Full verification checklist
- `STATUS-REPORT.md` — Current status with issue tracking
- `scripts/push-backend.sh` — Backend push helper
- `scripts/push-frontend.sh` — Frontend push helper
- `scripts/verify-tests.sh` — Test verification script

In backend folder:
- `bondkonnect_api/DB-MIGRATION-RUNBOOK.md` — Migration instructions for DBA
- `bondkonnect_api/DB-FK-PAYMENTS-SQL.sql` — Reference SQL for DBA

---

## ❌ If Something Goes Wrong

### Rollback Before Merge
```bash
# Delete remote branch
git push origin --delete fix/payment-endpoint-2026-02-15

# Delete local branch
git branch -D fix/payment-endpoint-2026-02-15
```

### Rollback After Merge
```bash
# Revert commits
git revert <commit-hash>
git push origin main
```

---

## ⏭️ Next Actions (Immediate)

1. **Run verification tests** (see Pre-Push Checklist above)
2. **Report test results** - let me know if they all pass
3. **If tests pass**, proceed with branch separation and push using Step-by-Step instructions above
4. **Create PRs** on both repos with provided commit messages
5. **Request review** from team leads

---

## 💡 Key Notes

- ✅ Backward compatibility maintained via compatibility routes
- ✅ All changes are additive (no breaking changes to existing routes)
- ✅ Payment data will be backfilled with migrations
- ⚠️ Frontend and backend repos are separate - need separate branches and PRs
- ⚠️ Test before push (critical requirement from user)

---

**Status:** READY FOR TESTING - No push until tests pass and branches are separated!
