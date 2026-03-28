# Bond Calculator System Review & Analysis Report

**Date:** 30 January 2026
**Project:** BondKonnect
**Scope:** Bond Calculator (Backend & Frontend)

## 1. Executive Summary
The Bond Calculator system is primarily a **client-side** engine built with React/Next.js, relying on the Laravel backend mainly for configuration parameters (`ValueDate`, `DailyBasis`) and bond market data. While the system is functional, it suffers from significant **code duplication** and **hardcoded financial constants** on the frontend, which poses maintenance risks and potential consistency issues.

## 2. Architecture & Components

### 2.1 Component Map
| Component | Location | Responsibility |
|-----------|----------|----------------|
| **BondCalc.tsx** | `bondkonnect_web/.../dashboard/BondCalc.tsx` | Main comprehensive calculator UI & Logic. |
| **InlineBondCalc.tsx** | `bondkonnect_web/.../dashboard/InlineBondCalc.tsx` | Simplified calculator embedded in dashboards. |
| **Quote Book** | `bondkonnect_web/.../quote-book-table.tsx` | Uses calculator logic for real-time quote pricing. |
| **Portfolio Scorecard** | `bondkonnect_web/.../PortfolioScorecard.tsx` | Uses calculator logic for portfolio valuation (WAP, P&L). |
| **BondsController.php** | `bondkonnect_api/.../Bonds/BondsController.php` | API: Provides market data (`statstable`) & global params. |

### 2.2 Data Flow
1.  **Initialization:**
    *   Frontend requests `getBondCalculatorDetails` from Backend.
    *   Backend returns global params: `DailyBasis`, `ValueDate`, `IfbFiveYrs` (Tax Rate).
    *   Frontend requests `getSecondaryMarketBonds` / `getPrimaryMarketBonds` for bond list.
2.  **User Input:**
    *   User selects a Bond -> App fills static details (Coupon, Maturity).
    *   User enters `Settlement Date`, `Face Value`, and either `Yield` OR `Price`.
3.  **Calculation (Client-Side):**
    *   React state triggers `handleCalculate`.
    *   **Algorithms:**
        *   `calculateBondPrice`: Uses standard PV of Cash Flows formula.
        *   `calculateBondYield`: Uses **Newton-Raphson** iteration to solve for yield.
        *   `calculateFinancialValues`: Computes Consideration, Commission (NSE), Levies (CMA), and Taxes.
4.  **Output:**
    *   Results displayed to user (Clean Price, Dirty Price, Total Payable/Receivable).

## 3. Weaknesses & Critical Issues

### 3.1 Code Duplication (High Severity)
The mathematical core of the calculator is copy-pasted across multiple files. Any bug fix or logic update (e.g., a change in day count convention) must be manually applied to all 3 locations.
*   **Locations:** `BondCalc.tsx`, `InlineBondCalc.tsx`, `quote-book-table.tsx`.
*   **Risk:** Inconsistent calculations across the platform (e.g., Quote Book showing a different price than the Calculator).

### 3.2 Hardcoded Financial Constants (Medium Severity)
Key financial constants are hardcoded in JavaScript:
*   **NSE Commission:** `0.00024` (0.024%) with a minimum of `1000`.
*   **CMA Levies:** `0.00011` (0.011%).
*   **Risk:** Regulatory changes require code changes and redeployment. These should be managed via the Backend Database.

### 3.3 Tax Logic Clarity (Medium Severity)
The current tax logic in `calculateFinancialValues` appears specific to "Infrastructure Bonds" (IFB) discount tax.
*   It explicitly checks `bondIssueNo.startsWith('IFB')`.
*   It sets `withholdingTax = 0` for other cases in this specific function.
*   **Risk:** If this calculator is intended to show *full* settlement costs for all bond types, missing Withholding Tax on coupons for standard bonds might be misleading.

### 3.4 Client-Side "Truth" (Architectural)
Since pricing happens purely on the client:
*   **Pros:** Fast, responsive UI.
*   **Cons:** Malicious users could theoretically bypass frontend validation if this logic were used for submission (though current analysis suggests it's mostly for display/estimation).
*   **Risk:** If `createQuote` in the backend blindly accepts the "Price" sent from the frontend without re-verifying against the "Yield", there could be data integrity issues.

## 4. Performance Assessment
*   **Calculation Speed:** excellent. Client-side math is negligible for modern browsers (<1ms).
*   **Network:** Initial load fetches all bonds. If the bond list grows to thousands, `getSecondaryMarketBonds` (returning all rows) will become a bottleneck.
    *   *Current:* Selects `*` from `statstable`.
    *   *Recommendation:* Implement pagination or search-on-type if bond count > 500.

## 5. Recommendations & Roadmap

### 5.1 Immediate Refactoring (The "Perfect Calculator" Plan)
1.  **Create Shared Math Library:**
    *   Create `src/lib/calculator/bond-math.ts`.
    *   Move `calculateBondPrice`, `calculateBondYield`, `calculateAccruedInterest`, etc., into this pure function module.
    *   Import this module in `BondCalc`, `InlineBondCalc`, and `QuoteBook`.
2.  **Centralize Configuration:**
    *   Update `BondsController::getBondCalculatorDetails` to include `NseCommissionRate`, `NseMinCommission`, `CmaLevyRate`.
    *   Fetch these on app load and pass them into the calculation functions.
3.  **Unit Testing:**
    *   Create `src/lib/calculator/bond-math.test.ts`.
    *   Add test cases for known bonds (e.g., "IFB1/2023/17") to ensure price/yield accuracy against an Excel benchmark.

### 5.2 Future Enhancements
*   **Backend Verification:** Implement a matching `calculateBondPrice` method in PHP/Laravel (Trait or Service) to validate quotes submitted to the API.
*   **Historical Analysis:** Allow the calculator to accept a "Historical Date" and fetch the yield curve from that day for comparison.

## 6. Actionable Next Steps
1.  **Refactor:** Extract logic to `src/lib/bond-math.ts`.
2.  **Verify:** Write Jest tests for the new library.
3.  **Integrate:** Replace hardcoded logic in components with library calls.
