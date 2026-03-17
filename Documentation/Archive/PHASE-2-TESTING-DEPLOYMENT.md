# Phase 2 - Testing & Deployment Checklist

## Environment Setup

Before running migrations and tests, ensure your environment is configured:

### Database Configuration
Create/update `.env` file in `bondkonnect_api/`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bondkonnect
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Laravel Initialization
```bash
cd bondkonnect_api

# Generate app key
php artisan key:generate

# Clear cache
php artisan cache:clear
php artisan config:clear
```

---

## Database Migration & Seeding

### Step 1: Run Migrations

```bash
# Run all pending migrations
php artisan migrate

# Or run step-by-step with confirmation
php artisan migrate --step

# Verify migration status
php artisan migrate:status
```

**Expected Output:**
```
Migration Name ........................................ Batch
2026_02_17_000001_create_user_ratings_table ............. 1
2026_02_17_000002_create_user_credibility_scores_table .. 1
2026_02_17_000003_create_rating_disputes_table .......... 1
2026_02_17_000004_create_credibility_score_history_table 1
```

### Step 2: Verify Tables Created

```bash
php artisan tinker
```

Then in Tinker:
```php
// Check if tables exist
$tables = DB::select('SHOW TABLES');
print_r($tables);

// Check table structure
Schema::getColumns('user_ratings');
Schema::getColumns('user_credibility_scores');
Schema::getColumns('rating_disputes');
Schema::getColumns('credibility_score_history');
```

### Step 3: Seed Initial Data (Optional)

```bash
# Create database seeder for ratings
php artisan make:seeder RatingsSeeder
```

**File:** `database/seeders/RatingsSeeder.php`
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\UserRating;
use App\Models\UserCredibilityScore;

class RatingsSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing users (from existing seeders)
        $users = User::limit(10)->get();

        if ($users->count() < 2) {
            $this->command->warn('Need at least 2 users to seed ratings');
            return;
        }

        // Create sample ratings between users
        foreach ($users->skip(1) as $ratee) {
            $rater = $users->except($ratee->id)->random();

            UserRating::create([
                'rater_id' => $rater->id,
                'ratee_id' => $ratee->id,
                'transaction_id' => rand(1, 100),
                'quote_id' => rand(1, 100),
                'rating_professionalism' => rand(3, 5),
                'rating_communication' => rand(3, 5),
                'rating_reliability' => rand(3, 5),
                'rating_settlement' => rand(3, 5),
                'rating_compliance' => rand(3, 5),
                'review_text' => 'Great trader, very professional and responsive',
                'tags' => ['professional', 'reliable'],
                'rating_status' => 'published',
                'published_at' => now()->subDays(rand(1, 30))
            ]);

            // Create credibility score for ratee
            UserCredibilityScore::firstOrCreate(
                ['user_id' => $ratee->id],
                [
                    'credibility_index' => rand(60, 95),
                    'badge' => $this->calculateBadge(rand(60, 95)),
                    'total_ratings' => rand(5, 20),
                    'component_scores' => [
                        'rating_score' => rand(70, 95),
                        'activity_score' => rand(60, 90),
                        'verification_score' => [0, 30, 100][rand(0, 2)],
                        'settlement_score' => rand(70, 95),
                        'response_time_score' => rand(60, 90)
                    ],
                    'sentiment_distribution' => [
                        'positive' => rand(3, 15),
                        'neutral' => rand(0, 5),
                        'negative' => rand(0, 2)
                    ],
                    'total_transactions' => rand(10, 100),
                    'settlement_rate' => rand(80, 100),
                    'disputes_count' => rand(0, 3)
                ]
            );
        }

        $this->command->info('Ratings seeder completed successfully!');
    }

    private function calculateBadge(int $score): string
    {
        return match(true) {
            $score >= 90 => 'Platinum',
            $score >= 75 => 'Gold',
            $score >= 50 => 'Silver',
            $score >= 25 => 'Bronze',
            default => 'Unrated'
        };
    }
}
```

Run seeder:
```bash
php artisan db:seed --class=RatingsSeeder
```

---

## Backend API Testing

### Test 1: Unit Tests

```bash
# Run all unit tests
php artisan test --testsuite=Unit

# Run specific test class
php artisan test tests/Unit/Services/RatingServiceTest.php

# Run with verbose output
php artisan test --verbose

# Run with coverage report
php artisan test --coverage
```

**Expected Tests to Pass:**
- `RatingServiceTest` (4 tests)
- `CredibilityScoreServiceTest` (5 tests)
- `DisputeServiceTest` (4 tests)
- `UserRatingTest` (3 tests)
- `UserCredibilityScoreTest` (2 tests)
- `RatingsControllerTest` (8 tests)

### Test 2: Feature Tests

```bash
# Run feature tests
php artisan test --testsuite=Feature

# Run specific feature test
php artisan test tests/Feature/RatingsControllerTest.php
```

### Test 3: Manual API Testing with Artisan Tinker

```bash
php artisan tinker
```

**Test Submit Rating:**
```php
use App\Models\User;
use App\Models\UserRating;
use App\Services\RatingService;

$rater = User::find(1);
$ratee = User::find(2);

$ratingService = app(RatingService::class);

$rating = $ratingService->submitRating([
  'rater_id' => $rater->id,
  'ratee_id' => $ratee->id,
  'transaction_id' => 1,
  'quote_id' => 1,
  'rating_professionalism' => 5,
  'rating_communication' => 5,
  'rating_reliability' => 4,
  'rating_settlement' => 5,
  'rating_compliance' => 5,
  'review_text' => 'Excellent trader',
  'tags' => ['professional', 'reliable']
]);

// Check if rating was created
$rating->load('rater', 'ratee');
echo $rating->toJson();
```

**Test Get Credentials:**
```php
use App\Models\UserCredibilityScore;
use App\Services\CredibilityScoreService;

$credibilityService = app(CredibilityScoreService::class);

// Get credibility for user
$credibility = UserCredibilityScore::where('user_id', 2)->first();
echo $credibility->toJson();

// Recalculate if needed
$credibility = $credibilityService->calculateCredibilityIndex(2);
echo "New score: " . $credibility;
```

### Test 4: API Endpoint Testing with Postman/curl

**Base URL:** `http://localhost:8000/api`

#### Test: Submit Rating
```bash
curl -X POST http://localhost:8000/api/V1/ratings/submit-rating \
  -H "Authorization: Bearer {TOKEN}" \
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
```

#### Test: Get User Credibility
```bash
curl -X GET http://localhost:8000/api/V1/ratings/user-credibility/2 \
  -H "Authorization: Bearer {TOKEN}"
```

#### Test: Get User Ratings
```bash
curl -X GET "http://localhost:8000/api/V1/ratings/user-ratings/2?limit=10" \
  -H "Authorization: Bearer {TOKEN}"
```

---

## Frontend Testing

### Test 1: Component Rendering

```bash
# In bondkonnect_web directory
npm test

# Or run specific component tests
npm test -- RatingModal
npm test -- CredibilityBadge
npm test -- UserCredibilityProfile
```

### Test 2: Manual Testing in Browser

1. **Login** to application as test user
2. **Navigate** to Quote Book section
3. **Find** a quote with accepted transaction
4. **Click** "Rate User" button
5. **Test** RatingModal:
   - Verify 5-star inputs for each dimension
   - Verify average calculation updates
   - Add optional review text
   - Select tags
   - Submit rating
   - Verify success notification
6. **Test** CredibilityBadge display:
   - Verify badge displays for rated user
   - Hover over badge to see tooltip
   - Verify score and rating count display
7. **Test** UserCredibilityProfile:
   - View user profile after rating
   - Check updated credibility score
   - View component breakdown chart
   - Check sentiment distribution
   - Verify badges and trust indicators
8. **Test** DisputeModal:
   - Click dispute on rating
   - Verify warning message displays
   - Add dispute reason
   - Submit dispute
   - Verify confirmation

### Test 3: Integration Testing

```tsx
// Example integration test
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RatingModal } from '@/components/ratings/RatingModal'

describe('RatingModal Integration', () => {
  it('should submit rating and update credibility', async () => {
    render(<RatingModal open={true} transactionId={1} />)
    
    // Fill form
    const proInput = screen.getByLabelText(/professionalism/i)
    fireEvent.change(proInput, { target: { value: 5 } })
    
    // Submit
    const submitBtn = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitBtn)
    
    // Wait for success
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument()
    })
    
    // Verify API was called
    expect(mockSubmitRating).toHaveBeenCalledWith(
      expect.objectContaining({
        transaction_id: 1,
        rating_professionalism: 5
      })
    )
  })
})
```

---

## Performance Testing

### Load Testing

```bash
# Install Apache Bench
# On Windows: Use ApacheBench directly or use ab.exe

# Test rating submission endpoint
ab -n 100 -c 10 -p data.json -T application/json \
  -H "Authorization: Bearer {TOKEN}" \
  http://localhost:8000/api/V1/ratings/submit-rating
```

### Database Query Performance

```bash
php artisan tinker
```

```php
// Enable query logging
DB::enableQueryLog();

// Execute rating operations
$credibilityService = app(CredibilityScoreService::class);
$credibilityService->calculateCredibilityIndex(2);

// View queries executed
dd(DB::getQueryLog());
// Check: Should be < 10 queries for credential calculation
```

---

## Deployment Checklist

- [ ] All migrations executed in staging
- [ ] Seeder data created successfully
- [ ] Unit tests pass (all 54 tests)
- [ ] Feature tests pass (12 endpoint tests)
- [ ] API tested manually with Postman
- [ ] Frontend components render correctly
- [ ] Integration test passed
- [ ] Performance meets targets (< 200ms per request)
- [ ] Error handling tested
- [ ] Email notifications working
- [ ] Admin dispute panel functional
- [ ] Credibility calculation accurate
- [ ] Badge assignment correct
- [ ] Rating history tracking working
- [ ] Dispute workflow complete
- [ ] Cache invalidation working
- [ ] Logging configured
- [ ] Monitoring alerts set up

---

## Troubleshooting

### Migration Fails: "SQLSTATE[HY000]: General error"

**Solution:**
```bash
# Check database connection
php artisan db

# Clear migrations (development only)
php artisan migrate:refresh --seed

# Run specific migration
php artisan migrate --path=database/migrations/2026_02_17_000001_create_user_ratings_table.php
```

### Tests Failing with Authentication Error

**Solution:**
```bash
# Generate test token
php artisan tinker
Auth::login(User::find(1))
$user->createToken('test')->plainTextToken

# Use token in tests
```

### Rating Not Publishing After 48 Hours

**Solution:**
```bash
# Check queue worker
php artisan queue:status

# Run queue processor
php artisan queue:work

# Manually trigger scheduling
php artisan schedule:run
```

### Credibility Score Incorrect

**Solution:**
```bash
# Rebuild credibility scores
php artisan ratings:rebuild-scores

# For specific user
php artisan ratings:rebuild-scores --user=2
```

---

## Monitoring & Logging

### Enable Detailed Logging

In `.env`:
```env
LOG_CHANNEL=single
LOG_LEVEL=debug
```

**View logs:**
```bash
tail -f storage/logs/laravel.log
```

### Monitor API Performance

```bash
# Check slow queries
php artisan make:command CheckSlowQueries

# Run
php artisan check-slow-queries
```

### Monitor Rating System Health

```bash
# Verify ratings are publishing
php artisan ratings:check-pending-publications

# Verify dispute resolution
php artisan ratings:check-pending-disputes

# Generate system report
php artisan ratings:generate-report
```

---

## Production Deployment

1. **Pre-deployment:**
   - [ ] Backup production database
   - [ ] Run migrations on staging
   - [ ] Run full test suite
   - [ ] Performance test on staging

2. **Deployment:**
   ```bash
   git pull origin main
   php artisan migrate --force
   php artisan cache:clear
   php artisan optimize
   ```

3. **Post-deployment:**
   - [ ] Verify migrations created tables
   - [ ] Check API endpoints responding
   - [ ] Monitor error logs
   - [ ] Test rating submission workflow
   - [ ] Verify email notifications sent
   - [ ] Monitor database performance

4. **Rollback Plan:**
   ```bash
   # If issues occur
   php artisan migrate:rollback --step=4
   git revert HEAD
   ```

---

## Support Resources

- **Laravel Documentation:** https://laravel.com/docs
- **Database Migration:** `php artisan help migrate`
- **Testing:** `php artisan help test`
- **Tinker:** `php artisan help tinker`

---

## Summary

The rating system is ready for deployment. Follow this checklist to:
1. ✅ Set up database and run migrations
2. ✅ Seed test data (optional)
3. ✅ Run comprehensive test suite
4. ✅ Manually test API endpoints
5. ✅ Test frontend components
6. ✅ Deploy to production

Expected completion time: **2-3 hours** for full testing and deployment.
