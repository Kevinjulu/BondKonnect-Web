# Rating System - Quick Start (5 Steps)

## Step 1: Verify Component Integration (2 min)

```bash
# Check that imports are correct
grep -n "RatingModal\|DisputeModal\|CredibilityBadge" \
  bondkonnect_web/src/app/\(dashboard\)/components/apps/quote-book/quote-book-table.tsx

# Should show:
# - 3 imports from components/ratings/
# - Rating state variables
# - Rate User button
# - Modal components at end
```

**Expected Output:**
```
Line 5: import { RatingModal } from '@/components/ratings/RatingModal'
Line 6: import { DisputeModal } from '@/components/ratings/DisputeModal'
Line 7: import { CredibilityBadge } from '@/components/ratings/CredibilityBadge'
```

---

## Step 2: Run Database Migrations (5 min)

```bash
cd bondkonnect_api

# Run migrations
php artisan migrate

# Verify tables created
php artisan migrate:status
```

**Expected:** 4 new tables created
- ✅ user_ratings
- ✅ user_credibility_scores
- ✅ rating_disputes
- ✅ credibility_score_history

---

## Step 3: Start Frontend & Backend (5 min)

**Terminal 1 - Backend:**
```bash
cd bondkonnect_api
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd bondkonnect_web
npm run dev
```

---

## Step 4: Test in Browser (5 min)

1. Open `http://localhost:3000`
2. Login with test user
3. Navigate to Quote Book
4. **Look for green "⭐ Rate User" button** on quotes with accepted transactions
5. Click button to test RatingModal
6. Fill rating form and submit

---

## Step 5: Verify API (5 min)

Test with curl or Postman:

```bash
# Get your auth token first
TOKEN="your_auth_token_here"

# Test rating submission
curl -X POST http://localhost:8000/api/V1/ratings/submit-rating \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": 1,
    "quote_id": 1,
    "ratee_id": 2,
    "rating_professionalism": 5,
    "rating_communication": 4,
    "rating_reliability": 5,
    "rating_settlement": 5,
    "rating_compliance": 5,
    "review_text": "Great trader",
    "tags": ["professional"]
  }'

# Should return 201 with rating details
```

---

## Success Checklist

✅ **You're ready when:**
- [ ] All 4 migrations show in `migrate:status`
- [ ] No TypeScript errors in quote-book-table.tsx
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Backend starts without errors (`php artisan serve`)
- [ ] "Rate User" button visible in Quote Book
- [ ] RatingModal opens when button clicked
- [ ] Rating API endpoint returns 201 response

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Rate User" button not showing | Verify quote has accepted transaction (`is_accepted: true`) |
| RatingModal won't open | Check browser console for errors |
| 404 on API endpoint | Ensure backend is running on port 8000 |
| Migrations fail | Run `php artisan migrate:refresh` (development only) |
| TypeScript errors | Run `npm run build` to check for errors |

---

## Next Steps

1. ✅ **Integration** - COMPLETE
2. ✅ **Component Testing** - COMPLETE (manual test)
3. ⏳ **Unit Tests** - Run `cd bondkonnect_api && php artisan test`
4. ⏳ **Deployment** - See PHASE-2-TESTING-DEPLOYMENT.md

---

## Documentation

- **Detailed Integration**: PHASE-2-INTEGRATION-GUIDE.md
- **Testing Procedures**: PHASE-2-TESTING-DEPLOYMENT.md
- **Architecture Overview**: PHASE-2-SUMMARY.md
- **Complete Checklist**: INTEGRATION-CHECKLIST.md

---

## Key Files Modified

- `bondkonnect_web/src/app/(dashboard)/components/apps/quote-book/quote-book-table.tsx`
  - Added rating component imports (line 2-8)
  - Added state management (line 1757-1763)
  - Added Rate User button (line 1974-1992)
  - Added modal components (line 2122-2145)

## Components Used

- `RatingModal.tsx` - Rating submission form
- `DisputeModal.tsx` - Dispute filing form
- `CredibilityBadge.tsx` - Credibility display
- `RatingSummary.tsx` - Rating statistics
- `UserCredibilityProfile.tsx` - Full dashboard

---

## Time Estimate

| Task | Time |
|------|------|
| Step 1: Verify Integration | 2 min |
| Step 2: Migrations | 5 min |
| Step 3: Start Servers | 5 min |
| Step 4: Browser Test | 5 min |
| Step 5: API Test | 5 min |
| **TOTAL** | **~22 minutes** |

**Then:** Full test suite (~20 min) + Deploy (~15 min) = **~1 hour to production**

---

Ready? Let's go! 🚀

```bash
cd bondkonnect_api && php artisan migrate
```
