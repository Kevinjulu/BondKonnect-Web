# Phase 2 - Environment Setup & Deployment Guide

## Prerequisites

Before starting, ensure you have:
- PHP 8.1+ installed
- MySQL/MariaDB running
- Node.js 18+ installed
- Composer installed
- Git installed

---

## Part 1: Backend Environment Setup

### Step 1: Configure .env File

**File:** `bondkonnect_api/.env`

If not present, copy from example:
```bash
cd bondkonnect_api
cp .env.example .env
```

**Update these values:**

```env
# Application
APP_NAME=BondKonnect
APP_ENV=local
APP_DEBUG=true
APP_KEY=base64:YOUR_KEY_HERE

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bondkonnect_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

# Cache
CACHE_DRIVER=file

# Queue
QUEUE_CONNECTION=sync

# Mail (for notifications)
MAIL_DRIVER=log
MAIL_FROM_ADDRESS=noreply@bondkonnect.com
MAIL_FROM_NAME="BondKonnect"
```

### Step 2: Generate Application Key

```bash
cd bondkonnect_api
php artisan key:generate
```

Should output: `Application key set successfully.`

### Step 3: Install PHP Dependencies

```bash
cd bondkonnect_api
composer install
```

Expected: All packages installed successfully

### Step 4: Create MySQL Database

**Option A: Via MySQL CLI**
```bash
mysql -u root -p

# Enter password, then:
CREATE DATABASE bondkonnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

**Option B: Via Laravel Tinker**
```bash
php artisan tinker
DB::statement('CREATE DATABASE bondkonnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
exit;
```

### Step 5: Run Migrations

```bash
cd bondkonnect_api
php artisan migrate --step
```

**Expected Output:**
```
Migrating: 2026_02_17_000001_create_user_ratings_table
Migrated:  2026_02_17_000001_create_user_ratings_table (0.45s)

Migrating: 2026_02_17_000002_create_user_credibility_scores_table
Migrated:  2026_02_17_000002_create_user_credibility_scores_table (0.38s)

Migrating: 2026_02_17_000003_create_rating_disputes_table
Migrated:  2026_02_17_000003_create_rating_disputes_table (0.42s)

Migrating: 2026_02_17_000004_create_credibility_score_history_table
Migrated:  2026_02_17_000004_create_credibility_score_history_table (0.41s)
```

### Step 6: Verify Tables Created

```bash
php artisan tinker
```

Then:
```php
// Check tables
Schema::hasTable('user_ratings'); // should be true
Schema::hasTable('user_credibility_scores'); // should be true
Schema::hasTable('rating_disputes'); // should be true
Schema::hasTable('credibility_score_history'); // should be true

// Exit
exit;
```

---

## Part 2: Frontend Environment Setup

### Step 1: Install Node Dependencies

```bash
cd bondkonnect_web
npm install
```

### Step 2: Verify TypeScript

```bash
npm run build
```

Should show no errors. Output will show: `Done in X.XXs`

### Step 3: Start Development Server

```bash
npm run dev
```

**Expected Output:**
```
 ▲ Next.js 13.4.0
 - Local:        http://localhost:3000
```

Open browser to: `http://localhost:3000`

---

## Part 3: Backend Server

### Start Backend

In new terminal:
```bash
cd bondkonnect_api
php artisan serve
```

**Expected Output:**
```
INFO  Server running on [http://127.0.0.1:8000]
```

---

## Part 4: Verify Integration

### Check Files Modified

```bash
# Verify quote-book-table.tsx has rating integrations
grep -c "RatingModal\|DisputeModal\|CredibilityBadge" \
  bondkonnect_web/src/app/\(dashboard\)/components/apps/quote-book/quote-book-table.tsx

# Should output: 3 (three component imports)
```

### Check Database Tables

```bash
cd bondkonnect_api
php artisan tinker

# Verify tables
DB::select('SHOW TABLES LIKE "user_%"')

# Should show all 4 rating tables
exit
```

---

## Part 5: Test Rating System

### Manual UI Test

1. Open `http://localhost:3000` in browser
2. Login as test user
3. Navigate to **Quote Book**
4. Find a quote with **accepted transaction**
5. **Look for green "⭐ Rate User" button**
6. Click button to open RatingModal
7. Fill rating form:
   - Rate each dimension 1-5 stars
   - Add optional review
   - Select tags
   - Click Submit
8. Verify success notification

### API Test

Get auth token first, then:

```bash
TOKEN="your_token_here"

# Test: Submit Rating
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
    "review_text": "Great trader!",
    "tags": ["professional", "reliable"]
  }'

# Should return 201 with rating data

# Test: Get Credibility
curl -X GET http://localhost:8000/api/V1/ratings/user-credibility/2 \
  -H "Authorization: Bearer $TOKEN"

# Should return 200 with credibility data
```

---

## Part 6: Run Test Suite

### Unit Tests

```bash
cd bondkonnect_api
php artisan test --testsuite=Unit
```

Expected: 54 tests pass, ~2 seconds

### Feature Tests

```bash
cd bondkonnect_api
php artisan test --testsuite=Feature
```

Expected: All feature tests pass

### Full Test Suite

```bash
cd bondkonnect_api
php artisan test
```

Expected: 54+ tests pass, 0 failures

---

## Troubleshooting

### Database Connection Error

**Error:** `SQLSTATE[HY000]: General error: 1030 Got error...`

**Solution:**
```bash
# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'bondkonnect%';"

# If not exists, create it:
mysql -u root -p -e "CREATE DATABASE bondkonnect_db CHARACTER SET utf8mb4;"

# Try migrations again
php artisan migrate
```

### Migration Not Found

**Error:** `Migration not found!`

**Solution:**
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear

# Verify migration files exist
ls -la database/migrations/ | grep "2026_02_17"

# Try again
php artisan migrate
```

### Frontend Won't Start

**Error:** `Module not found` or similar

**Solution:**
```bash
cd bondkonnect_web

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

### Import Errors in quote-book-table.tsx

**Error:** `Module not found: Can't resolve '@/components/ratings/RatingModal'`

**Solution:**
```bash
# Verify component files exist
ls -la src/components/ratings/

# Should exist:
# - RatingModal.tsx
# - DisputeModal.tsx
# - CredibilityBadge.tsx
# - RatingSummary.tsx
# - UserCredibilityProfile.tsx

# Run build to check TypeScript
npm run build
```

### API Endpoints Not Responding

**Error:** `404 Not Found` on `/V1/ratings/...`

**Solution:**
```bash
# Verify backend is running
# Should see: INFO  Server running on [http://127.0.0.1:8000]

# Check routes are registered
php artisan route:list | grep ratings

# Should show all rating routes with /V1/ratings prefix
```

---

## Environment Checklist

- [ ] MySQL running and accessible
- [ ] Database `bondkonnect_db` created
- [ ] `.env` file configured
- [ ] `php artisan key:generate` completed
- [ ] `composer install` completed
- [ ] All 4 migrations executed
- [ ] Database tables verified
- [ ] `npm install` completed
- [ ] Component files exist in `src/components/ratings/`
- [ ] `quote-book-table.tsx` integration complete (no TypeScript errors)
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] Can access `http://localhost:3000` in browser
- [ ] Can see "Rate User" button in Quote Book
- [ ] Rating API endpoint responds

---

## Quick Verification Command

Run this to verify everything:

```bash
# Backend check
cd bondkonnect_api && \
php artisan migrate:status && \
echo "Migrations OK" && \
php artisan tinker <<< "Schema::hasTable('user_ratings') ? \
  dd('✓ Tables created') : \
  dd('✗ Tables missing')" && \
cd ..

# Frontend check
cd bondkonnect_web && \
npm run build 2>&1 | grep -E "(error|success|done)" && \
echo "Frontend OK" && \
cd ..

# File check
grep -q "RatingModal\|DisputeModal" \
  bondkonnect_web/src/app/\(dashboard\)/components/apps/quote-book/quote-book-table.tsx && \
  echo "✓ Integration complete" || \
  echo "✗ Integration incomplete"
```

---

## Next Steps

1. ✅ **Environment Setup** - Follow this guide
2. ⏳ **Run Tests** - `php artisan test`
3. ⏳ **Manual Testing** - Test rating flow in UI
4. ⏳ **API Testing** - Test endpoints with curl/Postman
5. ⏳ **Deployment** - Follow PHASE-2-TESTING-DEPLOYMENT.md

---

## Support Files

- **Quick Start**: QUICK-START.md (5-step overview)
- **Integration Checklist**: INTEGRATION-CHECKLIST.md
- **Detailed Testing**: PHASE-2-TESTING-DEPLOYMENT.md
- **Integration Guide**: PHASE-2-INTEGRATION-GUIDE.md
- **Architecture**: PHASE-2-SUMMARY.md

---

## Time Estimate

| Step | Time |
|------|------|
| .env configuration | 2 min |
| Database setup | 5 min |
| Composer install | 2 min |
| Migrations | 5 min |
| npm install frontend | 5 min |
| Start servers | 2 min |
| Verification | 5 min |
| **TOTAL** | **~26 minutes** |

Then:
- Tests: ~5 minutes
- Manual testing: ~10 minutes
- Deployment: ~5 minutes

**Total path to production: ~46 minutes**

---

Ready to deploy? Start with:

```bash
cd bondkonnect_api
# Edit .env with database credentials
php artisan migrate --step
```
