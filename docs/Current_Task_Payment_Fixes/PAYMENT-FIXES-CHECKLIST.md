# Pre-Push Verification Checklist

**Status:** Ready for local testing. No pushes to GitHub until all tests pass.

## Test Execution Order

### Step 1: Backend Verification
```bash
cd bondkonnect_api

# 1a. PHP Syntax Check
php -l routes/api.php

# 1b. Composer Validation
composer validate

# 1c. Laravel Tinker (basic health check)
php artisan tinker
# Type: exit

# 1d. Verify Routes Exist
php artisan route:list | grep -E "get-all-subscription-plans|get-user-subscriptions|create-transaction"
```

**Expected Results:**
- ✓ No syntax errors
- ✓ composer.json valid
- ✓ Tinker starts without errors
- ✓ At least 3 routes matching the pattern appear

---

### Step 2: Frontend Verification
```bash
cd bondkonnect_web

# 2a. Install Dependencies
npm install --prefer-offline

# 2b. TypeScript Type Check
npx tsc --noEmit

# 2c. Lint Check (payment actions only)
npx eslint 'src/lib/actions/payment.actions.tsx' 2>&1 | head -20

# 2d. Build (full Next.js build - optional but recommended)
npm run build
```

**Expected Results:**
- ✓ No TS errors
- ✓ No ESLint errors (or only warnings)
- ✓ Build succeeds (or completes with no errors)

---

### Step 3: Code Review Checklist
Before pushing, manually verify:

#### Backend (`bondkonnect_api/routes/api.php`)
- [ ] Check that compatibility routes are registered under `Route::prefix('V1/payments')`
- [ ] Verify 7 routes exist:
  - `get-all-subscription-plans` (GET)
  - `get-user-subscriptions` (GET/POST)
  - `create-transaction` (POST)
  - `get-user-transactions` (GET/POST)
  - `mark-transaction-status` (POST)
  - `paypal/create-order` (POST)
  - `paypal/capture-order` (POST)
- [ ] Confirm parameter normalization (email → user_email, etc.)

#### Backend (`bondkonnect_api/app/Http/Controllers/V1/Financials/`)
- [ ] MpesaController: includes `user_id` when inserting payment
- [ ] PaypalController: includes `user_id` when inserting payment

#### Frontend (`bondkonnect_web/src/lib/actions/payment.actions.tsx`)
- [x] All endpoints updated to use:
  - `V1/financials` (subscriptions)
  - `V1/services` (transactions)
  - `V1/payments` (M-Pesa/PayPal only)
- [x] Parameter names normalized:
  - `email` → `user_email`
  - `transaction_id` → `trans_id`

---

## If Tests Fail

### Common Issues & Fixes

**Issue: `php artisan` command not found**
- Fix: Ensure you're in `bondkonnect_api` directory and PHP is installed
- Check: `which php` and `php --version`

**Issue: TypeScript errors in frontend**
- Fix: Run `npm install` first to ensure dependencies
- Check: `npm ls typescript`

**Issue: Routes not registered**
- Fix: Clear Laravel cache: `php artisan cache:clear`
- Check: File was correctly saved to `bondkonnect_api/routes/api.php`

**Issue: ESLint errors**
- Fix: Run `npm run lint:fix` in `bondkonnect_web`
- Check: `.eslintrc.json` or `package.json` eslint config

---

## Post-Test: Separate Branch Strategy

**Important:** Current working directory has BOTH backend and frontend changes mixed. They must be split into separate branches.

### Backend: Create Clean Backend Branch
```bash
# 1. Stash current changes
git stash

# 2. Go to backend directory
cd bondkonnect_api
git checkout main  # or master

# 3. Create feature branch
git checkout -b fix/payment-endpoint-2026-02-15

# 4. Get only backend changes (using git diff from stash)
# Or manually stage: git add routes/api.php app/Http/Controllers/V1/Financials/ database/seeders/

# 5. Commit and push
git push -u origin fix/payment-endpoint-2026-02-15
```

### Frontend: Create Clean Frontend Branch
```bash
# In bondkonnect_web directory
git checkout main  # or master

# Create feature branch
git checkout -b fix/payment-endpoint-2026-02-15

# Stage only frontend changes
git add src/lib/actions/payment.actions.tsx

# Commit and push
git push -u origin fix/payment-endpoint-2026-02-15
```

---

## Ready to Push? Answer These Questions

1. ✓ Did backend PHP syntax check pass?
2. ✓ Did frontend TypeScript check pass?
3. ✓ Did routes appear in `php artisan route:list`?
4. ✓ Did ESLint pass (or only warnings)?
5. ✓ Did you verify endpoint URLs in code?
6. ✓ Did you verify parameter normalization?

**If all ✓, proceed with Step 4 below.**

---

## Step 4: Push to Separate Repos

### Option A: Manual Push (Recommended for first time)
```bash
# Backend
cd bondkonnect_api
git checkout -b fix/payment-endpoint-2026-02-15 origin/main
git add routes/api.php app/Http/Controllers/V1/Financials/ database/seeders/
git commit -m "fix: payment endpoint compatibility routes and user_id insertions"
git push -u origin fix/payment-endpoint-2026-02-15
# Then create PR at https://github.com/Kevinjulu/BondKonnect-Backend

# Frontend
cd ../bondkonnect_web
git checkout -b fix/payment-endpoint-2026-02-15 origin/main
git add src/lib/actions/payment.actions.tsx
git commit -m "fix: update payment action endpoints to use correct API paths"
git push -u origin fix/payment-endpoint-2026-02-15
# Then create PR at https://github.com/Kevinjulu/BondKonnect-Web
```

### Option B: Use Helper Scripts
```bash
# Make scripts executable
chmod +x scripts/push-backend.sh
chmod +x scripts/push-frontend.sh

# Run backend push
scripts/push-backend.sh

# Run frontend push
scripts/push-frontend.sh
```

---

## Timeline

| Step | Task | Duration | Status |
|------|------|----------|--------|
| 1 | Backend verification | ~2 min | Pending |
| 2 | Frontend verification | ~3 min | Pending |
| 3 | Code review checklist | ~5 min | Pending |
| 4 | Create branches | ~5 min | Pending |
| 5 | Push to repos | ~2 min | Pending |
| 6 | Create PRs on GitHub | ~10 min | Pending |
| 7 | Code review & merge | 1-24 hrs | Pending |

**Total:** ~30 min (pre-push) + review time

---

## Rollback Plan (If Needed Before Merge)

### Backend Rollback
```bash
cd bondkonnect_api
git push origin --delete fix/payment-endpoint-2026-02-15  # Delete remote branch
git branch -D fix/payment-endpoint-2026-02-15             # Delete local branch
```

### Frontend Rollback
```bash
cd bondkonnect_web
git push origin --delete fix/payment-endpoint-2026-02-15  # Delete remote branch
git branch -D fix/payment-endpoint-2026-02-15             # Delete local branch
```

---

**Next Action:** Run tests listed in Step 1 and Step 2 above. Report results to proceed with push.
