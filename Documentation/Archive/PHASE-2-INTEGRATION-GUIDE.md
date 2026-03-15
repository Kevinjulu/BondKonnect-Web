# Rating System Integration Guide - Phase 2

## Overview
This guide walks through integrating the ratings system into the BondKonnect application. The rating system allows users to rate each other based on transaction completion, building credibility and trust in the platform.

## Component Status

### ✅ Completed Components
1. **RatingModal.tsx** - Multi-step modal for rating submission
2. **CredibilityBadge.tsx** - Display badge with credibility score tooltip
3. **RatingSummary.tsx** - Show rating statistics with charts
4. **UserCredibilityProfile.tsx** - Full credibility dashboard with component breakdown
5. **DisputeModal.tsx** - File disputes for unfair ratings

### Backend Models & Services
- ✅ Database migrations (4 tables: ratings, credibility_scores, disputes, history)
- ✅ Eloquent models with relationships
- ✅ Service layer (RatingService, CredibilityScoreService, DisputeService)
- ✅ API Controller with 12 endpoints
- ✅ API routes configured at `/V1/ratings`
- ✅ Frontend types and API action functions
- ✅ Comprehensive tests (54 test cases)

---

## Database Migration

### Step 1: Run Migrations

```bash
# Navigate to API directory
cd bondkonnect_api

# Run all pending migrations
php artisan migrate

# Verify migrations
php artisan migrate:status
```

### Expected Tables
- `user_ratings` - Stores individual user ratings
- `user_credibility_scores` - Denormalized cache for credibility metrics
- `rating_disputes` - Track disputes and resolution
- `credibility_score_history` - Audit log of score changes

### Step 2: Seed Test Data (Optional)

```bash
# Create test users and data
php artisan tinker
```

Then in Tinker:
```php
// Create test users
$user1 = User::create(['email' => 'user1@test.com', 'name' => 'User One']);
$user2 = User::create(['email' => 'user2@test.com', 'name' => 'User Two']);

// Create sample ratings
\App\Models\UserRating::create([
  'rater_id' => $user1->id,
  'ratee_id' => $user2->id,
  'transaction_id' => 1,
  'quote_id' => 1,
  'rating_professionalism' => 5,
  'rating_communication' => 4,
  'rating_reliability' => 5,
  'rating_settlement' => 5,
  'rating_compliance' => 5,
  'overall_rating' => 5,
  'review_text' => 'Excellent trader, very professional',
  'rating_status' => 'published'
]);
```

---

## Frontend Integration

### Step 1: Add Rating Button to Quote-Book

**File:** `bondkonnect_web/src/app/(dashboard)/components/apps/quote-book/quote-book-table.tsx`

After the main imports (around line 25), add:
```tsx
import { RatingModal } from '@/components/ratings/RatingModal'
import { DisputeModal } from '@/components/ratings/DisputeModal'
import { CredibilityBadge } from '@/components/ratings/CredibilityBadge'
```

**In QuoteTable component state (around line 1744), add:**
```tsx
const [ratingModalOpen, setRatingModalOpen] = useState(false)
const [selectedTransactionForRating, setSelectedTransactionForRating] = useState<Transaction | null>(null)
const [disputeModalOpen, setDisputeModalOpen] = useState(false)
const [selectedRatingForDispute, setSelectedRatingForDispute] = useState<number | null>(null)
```

**After the action buttons TableCell (around line 1988), add Rating button:**
```tsx
{/* Rate User Button - Show for accepted transactions */}
{quote.transactions?.some(t => t.is_accepted) && (
  <Button 
    size="sm" 
    onClick={() => {
      const acceptedTransaction = quote.transactions?.find(t => t.is_accepted)
      if (acceptedTransaction) {
        setSelectedTransactionForRating(acceptedTransaction)
        setRatingModalOpen(true)
      }
    }}
    className="h-8 bg-green-600 text-white hover:bg-green-700 font-black text-[10px] uppercase tracking-widest rounded-lg shadow-lg transition-all active:scale-90"
  >
    <Star className="h-3 w-3 mr-1" />
    Rate User
  </Button>
)}
```

### Step 2: Add Rating Modals to QuoteTable Return

**At the end of QuoteTable component, before the closing fragment (around line 2070), add:**

```tsx
{/* Rating Modal */}
{selectedTransactionForRating && (
  <RatingModal
    open={ratingModalOpen}
    onOpenChange={setRatingModalOpen}
    transactionId={selectedTransactionForRating.id}
    counterpartyId={selectedTransactionForRating.counterparty_id}
    counterpartyName={selectedTransactionForRating.counterparty_name}
    onSuccess={() => {
      setSelectedTransactionForRating(null)
      // Refresh quotes to update any credibility badges
      onEdit(quotes[0], 'id', quotes[0].id)
    }}
  />
)}

{/* Dispute Modal */}
<DisputeModal
  open={disputeModalOpen}
  onOpenChange={setDisputeModalOpen}
  ratingId={selectedRatingForDispute || 0}
  onSuccess={() => {
    setSelectedRatingForDispute(null)
    // Refresh data
  }}
/>
```

### Step 3: Display Credibility Badges

In the TableRow where counterparty information is displayed, add:

```tsx
{/* Counterparty name with badge */}
<div className="flex items-center gap-2">
  <span className="font-bold text-black">{counterpartyName}</span>
  <CredibilityBadge 
    userId={counterpartyId}
    size="sm"
  />
</div>
```

---

## API Testing

### Step 1: Test with Postman

**Base URL:** `http://localhost:8000/api/V1/ratings`

#### 1. Submit Rating
```
POST /submit-rating
Content-Type: application/json
Authorization: Bearer {token}

{
  "transaction_id": 1,
  "quote_id": 1,
  "ratee_id": 2,
  "rating_professionalism": 5,
  "rating_communication": 4,
  "rating_reliability": 5,
  "rating_settlement": 5,
  "rating_compliance": 5,
  "review_text": "Great trader!",
  "tags": ["professional", "reliable"]
}
```

**Expected Response (201):**
```json
{
  "message": "Rating submitted successfully",
  "rating": {
    "id": 1,
    "rater_id": 1,
    "ratee_id": 2,
    "overall_rating": 5,
    "rating_status": "pending",
    "published_at": null
  }
}
```

#### 2. Get User Credibility
```
GET /user-credibility/{userId}
Authorization: Bearer {token}
```

**Expected Response (200):**
```json
{
  "credibility_index": 85,
  "badge": "Gold",
  "total_ratings": 5,
  "component_scores": {
    "rating_score": 90,
    "activity_score": 80,
    "verification_score": 100,
    "settlement_score": 85,
    "response_time_score": 70
  },
  "sentiment_distribution": {
    "positive": 4,
    "neutral": 1,
    "negative": 0
  }
}
```

#### 3. Get User Ratings
```
GET /user-ratings/{userId}?limit=10&offset=0
Authorization: Bearer {token}
```

#### 4. File Dispute
```
POST /dispute
Content-Type: application/json
Authorization: Bearer {token}

{
  "rating_id": 1,
  "dispute_reason": "This rating is inaccurate. I completed the transaction as agreed."
}
```

#### 5. Admin: Get Disputes
```
GET /admin/disputes?status=pending
Authorization: Bearer {admin-token}
```

#### 6. Admin: Resolve Dispute
```
POST /admin/disputes/{disputeId}/resolve
Content-Type: application/json
Authorization: Bearer {admin-token}

{
  "resolution": "upheld",
  "notes": "Rating verified as legitimate"
}
```

---

## Frontend Testing

### Step 1: Manual Testing Checklist

- [ ] Navigate to Quote Book
- [ ] Find a quote with accepted transaction
- [ ] Click "Rate User" button
- [ ] Fill in rating form across all 5 dimensions
- [ ] Check average calculation updates
- [ ] Add optional review and tags
- [ ] Submit rating
- [ ] Verify success toast notification
- [ ] Refresh page and verify rating appears in credibility score
- [ ] View user's credibility profile to see breakdown
- [ ] File a dispute for a rating
- [ ] Verify dispute appears in admin panel

### Step 2: Test Rating Display

View user credibility profile:
```tsx
import { UserCredibilityProfile } from '@/components/ratings/UserCredibilityProfile'

// In component
<UserCredibilityProfile userId={userId} userName="John Doe" />
```

This will show:
- Credibility index (0-100)
- Badge tier (Platinum/Gold/Silver/Bronze/Unrated)
- Component score breakdown with charts
- Rating distribution
- Sentiment analysis
- Trust indicators

### Step 3: Test Badge Display

```tsx
import { CredibilityBadge } from '@/components/ratings/CredibilityBadge'

// Inline in counterparty list
<CredibilityBadge userId={userId} size="sm" />

// Large standalone
<CredibilityBadge userId={userId} size="lg" />
```

---

## Rating Workflow

### User Flow for Rating
1. User completes transaction (both parties accept)
2. "Rate User" button appears on transaction
3. User clicks button → RatingModal opens
4. User rates 5 dimensions (1-5 stars each)
5. User adds optional review text and tags
6. System calculates average rating
7. Rating submitted and set to "pending" status
8. After 48 hours, automatically published
9. Ratee receives notification
10. Credibility score updates for ratee

### Rating Status Lifecycle
- **pending** → Rating submitted, waiting for 48-hour delay
- **published** → Rating visible (after delay)
- **disputed** → Temporarily hidden, under admin review
- **removed** → Dispute upheld, rating deleted

### Credibility Calculation
```
Credibility Index = 
  (50% × Rating Score) +
  (20% × Activity Score) +
  (15% × Verification Score) +
  (10% × Settlement Score) +
  (5% × Response Time Score)

Where:
- Rating Score: Average of all 5 rating dimensions (1-5 → 0-100 scale)
- Activity Score: Based on total transactions and volume
- Verification Score: 0/30/100 based on KYC status
- Settlement Score: % of transactions settled without dispute
- Response Time Score: Average message response time
```

### Badge Tiers
| Badge | Score Range | Requirements |
|-------|-----------|---|
| Platinum | 90-100 | Exceptional credibility, 10+ ratings |
| Gold | 75-89 | Excellent performance, 5+ ratings |
| Silver | 50-74 | Reliable trader, 3+ ratings |
| Bronze | 25-49 | Developing history, 1+ ratings |
| Unrated | 0-24 | Insufficient data for rating |

---

## Dispute Management

### Filing a Dispute
1. User views rating they disagree with
2. Clicks "Dispute" button
3. InteractionModal opens with warning about false reports
4. User provides detailed reason (min 20 chars)
5. Dispute submitted for admin review
6. Rating temporarily hidden

### Admin Review Process
1. Admin views pending disputes
2. Examines rating and dispute reason
3. Contacts parties if needed
4. Makes resolution decision
5. Either upholds (keeps rating) or reverses (removes rating)
6. Both parties notified of resolution

---

## Performance Considerations

### Caching Strategy
- Credibility scores cached and updated after each rating
- Cache invalidated when:
  - New rating submitted
  - Rating disputed
  - Dispute resolved
  - Score calculation runs

### Database Optimization
- Indexes on: rater_id, ratee_id, transaction_id, quote_id
- Unique constraint on (transaction_id, rater_id)
- Foreign key constraints for data integrity

### Frontend Optimization
- RatingModal lazy-loads component data
- UserCredibilityProfile uses React.memo
- CredibilityBadge uses Tooltip for performance
- Infinite scroll on rating history

---

## Troubleshooting

### Issue: No rating button appears
- Check transaction has `is_accepted: true`
- Verify user is authenticated
- Check RatingModal component imports

### Issue: Credibility badge shows incorrect score
- Clear browser cache
- Run migration: `php artisan cache:clear`
- Rebuild credibility via service: `php artisan ratings:rebuild-scores`

### Issue: Rating not publishing after 48 hours
- Check queue worker running: `php artisan queue:work`
- Verify job scheduled: `php artisan schedule:run`
- Check logs: `storage/logs/laravel.log`

### Issue: Dispute email not received
- Verify user email verified
- Check mail configuration in `.env`
- Test email with: `php artisan tinker` → `Mail::send(...)`

---

## API Endpoint Reference

### Public Endpoints
- `POST /submit-rating` - Submit new rating
- `PUT /rating/{id}/edit` - Edit rating (within 30 days)
- `GET /user-credibility/{userId}` - Get user credibility  
- `GET /user-ratings/{userId}` - Get user's ratings received
- `GET /user-stats/{userId}` - Get rating statistics
- `POST /dispute` - File dispute

### Admin Endpoints (require admin middleware)
- `GET /admin/disputes` - List disputes
- `GET /admin/disputes/{id}` - Get dispute details
- `POST /admin/disputes/{id}/resolve` - Resolve dispute
- `GET /admin/users/{userId}/credibility` - Full credibility audit

---

## Next Steps

1. Test database migrations in development env
2. Add rating button integration to quote-book-table
3. Test end-to-end rating flow manually
4. Deploy to staging environment
5. Run API tests against staging
6. Configure email notifications
7. Deploy to production
8. Monitor and collect feedback

---

## Support & Resources

- Backend Models: `bondkonnect_api/app/Models/`
- Services: `bondkonnect_api/app/Services/`
- Controller: `bondkonnect_api/app/Http/Controllers/V1/Ratings/RatingsController.php`
- Frontend Components: `bondkonnect_web/src/components/ratings/`
- API Actions: `bondkonnect_web/src/lib/actions/ratings.actions.ts`
- Types: `bondkonnect_web/src/lib/types/ratings.ts`
- Tests: `bondkonnect_api/tests/Feature/RatingsControllerTest.php`
