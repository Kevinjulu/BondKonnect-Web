# Test & Deploy Plan: Payment Endpoint Fixes

**Date:** 2026-02-15

## Overview
Changes have been made to both backend (`bondkonnect_api`) and frontend (`bondkonnect_web`). They must be tested locally BEFORE pushing to their respective repos:
- Backend → `https://github.com/Kevinjulu/BondKonnect-Backend`
- Frontend → `https://github.com/Kevinjulu/BondKonnect-Web`

---

## Part 1: Local Testing (NO PUSH YET)

### Backend Changes to Test
**Files Modified:**
- `bondkonnect_api/routes/api.php` — added compatibility routes under `V1/payments`
- `bondkonnect_api/app/Http/Controllers/V1/Financials/MpesaController.php` — includes `user_id` in payment insert
- `bondkonnect_api/app/Http/Controllers/V1/Financials/PaypalController.php` — includes `user_id` in payment insert
- `bondkonnect_api/database/seeders/Phase4FinancialSeeder.php` — includes `user_id` when seeding

**Test Steps (Local Dev):**

1. **PHP Syntax & Validation**
   ```bash
   cd bondkonnect_api
   php -l routes/api.php                                    # Check syntax
   composer validate                                         # Validate composer.json
   php artisan route:list | grep "V1/payments"            # List payment routes
   ```

2. **Laravel Artisan Check**
   ```bash
   php artisan tinker                                        # Start tinker, check if no errors
   exit                                                      # Exit tinker
   ```

3. **Unit Tests (if available)**
   ```bash
   php artisan test --filter FinancialControllerTest         # Run payment tests
   # or full suite:
   php artisan test
   ```

4. **Verify Compatibility Routes Are Registered**
   ```bash
   php artisan route:list | grep -E "get-all-subscription-plans|get-user-subscriptions|create-transaction"
   # Should show routes like:
   # GET|HEAD        V1/payments/get-all-subscription-plans
   # GET|HEAD        V1/payments/get-user-subscriptions
   # POST             V1/payments/create-transaction
   ```

### Frontend Changes to Test
**Files Modified:**
- `bondkonnect_web/src/lib/actions/payment.actions.tsx` — updated endpoints and payload normalization

**Test Steps (Local Dev):**

1. **TypeScript Compilation**
   ```bash
   cd bondkonnect_web
   npm run build                                             # Full Next.js build
   # or just TypeScript check:
   npx tsc --noEmit
   ```

2. **Linting**
   ```bash
   npm run lint 2>&1 | head -50                             # Check for linting errors
   ```

3. **Unit Tests**
   ```bash
   npm test -- payment.actions --run                        # Run payment-related tests (if they exist)
   ```

4. **Visual Inspection**
   - Open `src/lib/actions/payment.actions.tsx` in editor
   - Verify endpoints:
     - `getAllSubscriptionPlans()` calls `V1/financials/get-all-sub-plans` (not `/V1/payments/...`)
     - `getUserSubscriptions()` calls `V1/financials/get-user-subscriptions` with POST and `user_email` payload
     - `createTransaction()` calls `V1/services/create-transaction`
     - `getUserTransactions()` calls `V1/services/get-user-transactions` with POST
     - M-Pesa and PayPal endpoints remain unchanged under `V1/payments`

---

## Part 2: Verify Integration Points

**Q: Do the paths match?**
- ✅ Backend route defined: `Route::get('get-all-subscription-plans', ...)` under `V1/payments` group
- ✅ Frontend calls: `${BASE_URL}/V1/financials/get-all-sub-plans` OR uses compatibility route
- ✅ Parameter normalization: frontend sends `user_email`, backend compat routes forward it

**Q: Are request payloads correct?**
- ✅ M-Pesa: frontend includes `phone`, `amount`, `plan_id`, `user_email` → matches backend validator
- ✅ PayPal: frontend includes `amount`, `plan_id` or `order_id`, `user_email` → matches backend validator
- ✅ Transaction: frontend sends `user_email`, `quote_id`, bid/offer fields → backend compat merges `email` → `user_email`

**Q: Are status codes expected?**
- ✅ Validation errors: expect `422` (Unprocessable Entity)
- ✅ Payment created: expect `200 OK` with transaction details
- ✅ Not found: expect `404`

---

## Part 3: Manual Smoke Tests (Optional, if Staging DB Available)

**Prerequisites:**
- Local Laravel server running: `php artisan serve` (default: http://localhost:8000)
- Local Next.js server running: `npm run dev` (default: http://localhost:3000)

**Test M-Pesa Compatibility Route:**
```bash
curl -X GET "http://localhost:8000/api/V1/payments/get-all-subscription-plans" \
  -H "Content-Type: application/json"
# Expect: 200 OK with subscription plans array
```

**Test PayPal Flow:**
```bash
# Create order
curl -X POST "http://localhost:8000/api/V1/payments/paypal/create-order" \
  -H "Content-Type: application/json" \
  -d '{"amount":10,"plan_id":1}'
# Expect: 200 OK with order_id

# Capture order (replace ORDER_ID)
curl -X POST "http://localhost:8000/api/V1/payments/paypal/capture-order" \
  -H "Content-Type: application/json" \
  -d '{"order_id":"ORDER_ID","user_email":"test@example.com","plan_id":1}'
# Expect: 200 OK with success message
```

---

## Part 4: Ready to Push (After Tests Pass)

### Backend Push
```bash
cd bondkonnect_api
git checkout -b fix/payment-endpoint-2026-02-15 origin/main
git add routes/api.php app/Http/Controllers/V1/Financials/ database/seeders/ 
git commit -m "fix: payment endpoint compatibility routes and user_id insertions

- Adds compatibility routes under V1/payments for legacy frontend paths
- Updates MpesaController and PaypalController to insert user_id
- Normalizes parameter names in seeder"
git push origin fix/payment-endpoint-2026-02-15
# Then open PR on https://github.com/Kevinjulu/BondKonnect-Backend
```

### Frontend Push
```bash
cd bondkonnect_web
git checkout -b fix/payment-endpoint-2026-02-15 origin/main
git add src/lib/actions/payment.actions.tsx
git commit -m "fix: update payment action endpoints to use V1/financials and V1/services

- getAllSubscriptionPlans: V1/payments → V1/financials/get-all-sub-plans
- getUserSubscriptions: change to POST with user_email param
- createTransaction: V1/payments → V1/services
- markTransactionStatus: V1/payments → V1/services
- Normalize email → user_email and transaction_id → trans_id"
git push origin fix/payment-endpoint-2026-02-15
# Then open PR on https://github.com/Kevinjulu/BondKonnect-Web
```

---

## Next Steps

1. **Run all local tests above** (no push yet)
2. **Report results** — if all pass, proceed to push
3. **Push backend first**, then frontend (maintain order for compatibility)
4. **Create PRs** on respective repos for code review
5. **Merge & Deploy** once reviewed

---

**Status:** Ready for testing. Do not push until all tests pass locally.
