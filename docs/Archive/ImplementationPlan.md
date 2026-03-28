# Implementation Plan: Bond Calculator Refactoring

**Objective:** Centralize bond calculation logic, remove code duplication, and move hardcoded financial constants to the backend configuration.

## Phase 1: Core Logic Extraction (Frontend)

### 1.1 Create Shared Library
*   **Target File:** `bondkonnect_web/src/lib/calculator/bond-math.ts`
*   **Content:** Extract all pure mathematical functions from `BondCalc.tsx`.
    *   `addDays`, `addBusinessDays`, `daysBetween`
    *   `calculateIndicativeRange`
    *   `calculatePreviousCoupon`, `calculateNextCouponDate`, `calculateNextCouponDays`
    *   `calculateCouponsDue`, `calculateAccruedInterest`
    *   `calculateBondPrice`, `calculateBondYield`
    *   `calculateFinancialValues` (Update signature to accept `rates` object).

### 1.2 Unit Testing
*   **Target File:** `bondkonnect_web/src/lib/calculator/bond-math.test.ts`
*   **Tool:** `vitest`
*   **Scope:**
    *   Test date calculations (leap years, weekends).
    *   Test Pricing formula against known Excel examples.
    *   Test Yield solver (Newton-Raphson) convergence.

## Phase 2: Backend Configuration (API)

### 2.1 Update Controller
*   **Target File:** `bondkonnect_api/app/Http/Controllers/V1/Bonds/BondsController.php`
*   **Method:** `getBondCalculatorDetails`
*   **Change:** Inject standard rates into the response.
    ```php
    'rates' => [
        'nseCommission' => 0.00024, // 0.024%
        'nseMinCommission' => 1000,
        'cmaLevies' => 0.00011,    // 0.011%
    ]
    ```
    *(Note: Ideally these come from the DB `tableparams` in the future, but standardizing them in the Controller is the first step away from frontend hardcoding).*

## Phase 3: Component Integration (Frontend)

### 3.1 Update Types
*   **Target File:** `bondkonnect_web/src/lib/types/calculator.ts` (Create if needed or add to `bond-math.ts`)
*   Define interfaces for `BondCalcResult` and `FinancialRates`.

### 3.2 Refactor Components
*   **Targets:**
    1.  `bondkonnect_web/src/app/(dashboard)/components/apps/dashboard/BondCalc.tsx`
    2.  `bondkonnect_web/src/app/(dashboard)/components/apps/dashboard/InlineBondCalc.tsx`
    3.  `bondkonnect_web/src/app/(dashboard)/components/apps/quote-book/quote-book-table.tsx`
*   **Action:**
    *   Remove local function definitions.
    *   Import from `@/lib/calculator/bond-math`.
    *   Update `useEffect` / `fetchData` to retrieve `rates` from API.
    *   Pass retrieved `rates` to `calculateFinancialValues`.

## Phase 4: Verification

### 4.1 Automated Tests
*   Run `npm run test` (or `npx vitest`) to ensure math library integrity.

### 4.2 Manual Validation
*   Compare "Old Calculator" results (screenshot or notes) with "New Calculator" results to ensure zero regression.
