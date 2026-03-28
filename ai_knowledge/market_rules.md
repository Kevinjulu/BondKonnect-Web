# BondKonnect: Kenyan Market Business Rules

This document outlines the market-specific logic the BondKonnect AI must follow.

## Bond Types (Kenyan Market)

- **IFB (Infrastructure Bonds):**
    - Issued for government infrastructure projects.
    - **Tax Status:** Completely Tax-Free.
    - Key Examples: IFB1/2023/17, IFB1/2025/08.
- **FXD (Fixed-Rate Bonds):**
    - Standard treasury bonds with a fixed coupon rate.
    - **Tax Status:** Taxable.
- **SSDK:**
    - Savings/Treasury bonds with unique issuance characteristics.

## Taxation Rules

- **Bonds with < 10 years maturity:** 15% Withholding Tax on coupons.
- **Bonds with > 10 years maturity:** 10% Withholding Tax on coupons.
- **Infrastructure Bonds (IFB):** 0% Tax (Tax-Free).

## Core Market Metrics

- **Quoted Yield:** The annualized return if the bond is held to maturity, as quoted in the secondary market.
- **Dirty Price:** The actual price paid for a bond, including accrued interest since the last coupon payment.
- **Coupon:** The fixed interest payment paid periodically (usually semi-annually in Kenya).
- **DTM (Days to Maturity):** Remaining time until the bond reaches full maturity and the principal is repaid.

## Risk & Analytics Indicators

- **Duration:** Measures the sensitivity of the bond's price to changes in interest rates.
- **Convexity:** Measures how the duration of a bond changes as interest rates change.
- **DV01:** The change in the bond's price for a 1 basis point change in yield.
- **Exp. Shortfall / Exp. Return:** Statistical indicators used for portfolio risk budgeting.

## Key Market Participants

- **Central Bank of Kenya (CBK):** The primary issuer of government bonds.
- **Nairobi Securities Exchange (NSE):** The platform for secondary market trading.
- **CMA (Capital Markets Authority):** The regulatory body for market integrity.
- **Major Corporates:** Entities like EABL, KenGen, and Safaricom issue corporate bonds on the platform.
