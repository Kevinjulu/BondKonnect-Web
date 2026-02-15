# PR: Payment endpoint fixes and compatibility cleanup
Date: 2026-02-15
Author: <your-name>

Summary
- Fixes endpoint path mismatches between frontend and backend for subscription and transaction APIs.
- Adds temporary compatibility routes under `V1/payments` to support legacy frontend clients while migrating them to the canonical `V1/financials` and `V1/services` endpoints.
- Updates frontend action calls to use backend `financials`/`services` endpoints and normalizes parameter names (`email` -> `user_email`, `transaction_id` -> `trans_id`).

Why
- Prevents 404s and 422 validation failures caused by mismatched paths and parameter names.
- Keeps production stable by adding short-lived shims while frontend deploys are coordinated.

Files changed
- `bondkonnect_api/routes/api.php` (added compatibility route shims)
- `bondkonnect_web/src/lib/actions/payment.actions.tsx` (updated endpoints and payload normalization)
- `PRs/2026-02-15-payment-endpoint-fixes.md` (this file)
- `scripts/create-pr.sh` (helper to create branch + PR)

Testing (staging)
1. Backend unit tests:
   - `cd bondkonnect_api`
   - `composer install`
   - `php artisan test --filter FinancialControllerTest` (or full test suite)

2. M-Pesa STK push smoke (staging API):
   - `curl -X POST "https://STAGING_API/V1/payments/mpesa/stk-push" -H "Content-Type: application/json" -d '{"phone":"2547XXXXXXXX","amount":1000,"plan_id":1,"user_email":"user@example.com"}'`
   - Expect a JSON `checkout_id` and a `payments` row with `status = 'pending'`.

3. Simulate M-Pesa callback (use configured signature secret or disable verification in staging):
   - `curl -X POST "https://STAGING_API/V1/payments/mpesa/callback" -H "Content-Type: application/json" -d @mpesa_callback_sample.json`
   - Expect `payments.status = 'completed'` and a new `bk_db.subscriptions` row for the user.

4. PayPal create + capture (use sandbox/mocked PaypalService):
   - `curl -X POST "https://STAGING_API/V1/payments/paypal/create-order" -H "Content-Type: application/json" -d '{"amount":10.00,"plan_id":1}'`
   - `curl -X POST "https://STAGING_API/V1/payments/paypal/capture-order" -H "Content-Type: application/json" -d '{"order_id":"<ORDER_ID>","user_email":"user@example.com","plan_id":1}'`
   - Expect payments row with `payment_method = 'paypal'` and `status = 'completed'` and subscription activation in `bk_db.subscriptions`.

Compatibility route rollback (exact block to remove)
If you decide to remove the compatibility shims after frontend rollout, delete the compatibility block introduced in `bondkonnect_api/routes/api.php` (search for "Compatibility routes for legacy frontend paths (normalize params and forward)") and remove the following closure routes verbatim:

```php
// Compatibility routes for legacy frontend paths (normalize params and forward)
Route::get('get-all-subscription-plans', function (\Illuminate\Http\Request $request) {
  return app()->call([FinancialController::class, 'getAllSubscriptionPlans'], ['request' => $request]);
});

Route::get('get-user-subscriptions', function (\Illuminate\Http\Request $request) {
  $request->merge(['user_email' => $request->input('email') ?? $request->input('user_email')]);
  return app()->call([FinancialController::class, 'getUserSubscriptions'], ['request' => $request]);
});

Route::get('get-all-features', function (\Illuminate\Http\Request $request) {
  return app()->call([FinancialController::class, 'getAllFeatures'], ['request' => $request]);
});

Route::get('get-all-feature-categories', function (\Illuminate\Http\Request $request) {
  return app()->call([FinancialController::class, 'getAllFeatureCategories'], ['request' => $request]);
});

Route::post('create-transaction', function (\Illuminate\Http\Request $request) {
  $request->merge(['user_email' => $request->input('email') ?? $request->input('user_email')]);
  return app()->call([App\Http\Controllers\V1\Bonds\BondsController::class, 'createTransaction'], ['request' => $request]);
})->middleware('broker');

Route::post('mark-transaction-status', function (\Illuminate\Http\Request $request) {
  if ($request->has('transaction_id')) {
    $request->merge(['trans_id' => $request->input('transaction_id')]);
  }
  $request->merge(['user_email' => $request->input('email') ?? $request->input('user_email')]);
  return app()->call([App\Http\Controllers\V1\Bonds\BondsController::class, 'markTransactionStatus'], ['request' => $request]);
})->middleware('broker');

Route::get('get-user-transactions', function (\Illuminate\Http\Request $request) {
  $request->merge(['user_email' => $request->input('email') ?? $request->input('user_email')]);
  return app()->call([App\Http\Controllers\V1\Bonds\BondsController::class, 'getUserTransactions'], ['request' => $request]);
});
```

After removing, run:
```bash
php artisan route:clear
php artisan config:clear
```

Notes
- Keep the compatibility routes short-lived and remove after frontend migration completes.
