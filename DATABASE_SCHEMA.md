# AutoBits Database Schema

This file documents the database structure needed for AutoBits. Follow the steps below to set up in Supabase.

## Setup Instructions

1. **Connect Supabase**: [Connect to Supabase](#open-mcp-popover) and create a new project
2. **Run the SQL scripts below** in your Supabase SQL editor
3. **Enable Row Level Security (RLS)** for each table
4. **Set up Auth** in Supabase dashboard (Email/Password, OAuth: Google, GitHub)

---

## Tables

### 1. Users Table

Stores user account information.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('buyer', 'creator', 'admin')),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TODO: Add RLS policy so users can only read/update their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 2. Automations Table

Stores automation workflow listings.

```sql
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  price DECIMAL(10, 2) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('json', 'yaml', 'zip')),
  preview_image_url TEXT,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_purchases INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TODO: Add RLS policies for read (public), create (auth), update (creator only), delete (creator/admin)
CREATE POLICY "Automations are viewable by everyone" ON automations
  FOR SELECT USING (status = 'published');

CREATE POLICY "Creators can create automations" ON automations
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own automations" ON automations
  FOR UPDATE USING (auth.uid() = creator_id);
```

### 3. Reviews Table

Stores ratings and reviews.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(automation_id, reviewer_id)
);

-- TODO: Add RLS policies (users can only review once, only update own review)
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);
```

### 4. Purchases Table

Stores transaction records.

```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  creator_earnings DECIMAL(10, 2) NOT NULL,
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TODO: Add RLS policies (buyers can see own purchases, creators can see own earnings, admins see all)
CREATE POLICY "Buyers can see own purchases" ON purchases
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = creator_id);
```

### 5. Payouts Table

Tracks creator payouts.

```sql
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_payout_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'paid', 'failed')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP
);

-- TODO: Add RLS policies (creators can only see own payouts)
CREATE POLICY "Creators can see own payouts" ON payouts
  FOR SELECT USING (auth.uid() = creator_id);
```

### 6. Creator Subscriptions Table

Stores creator subscription tier information.

```sql
CREATE TABLE creator_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  stripe_subscription_id VARCHAR(255),
  unlimited_uploads BOOLEAN DEFAULT FALSE,
  featured_listing_slots INTEGER DEFAULT 0,
  analytics_enabled BOOLEAN DEFAULT FALSE,
  early_feature_access BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Storage Buckets (for Supabase Storage)

Create the following storage buckets in Supabase:

1. **automations** - Store uploaded automation files (.json, .yaml, .zip)
   - TODO: Set up RLS so users can only upload to their own folder
2. **avatars** - Store user profile pictures
   - TODO: Set up RLS so users can only upload to their own avatar
3. **previews** - Store automation preview images
   - TODO: Set up RLS for public read, creator write

---

## API Endpoints to Implement

### Authentication

- `POST /api/auth/signup` - Register new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/oauth/google` - Google OAuth
- `POST /api/auth/oauth/github` - GitHub OAuth
- `GET /api/auth/me` - Get current user

### Marketplace

- `GET /api/automations` - List all automations (with filters: category, search, price range, rating)
- `GET /api/automations/:id` - Get automation details
- `GET /api/automations/:id/reviews` - Get reviews for an automation
- `GET /api/categories` - List all categories

### Purchases

- `POST /api/purchases/intent` - Create Stripe payment intent
- `POST /api/purchases/confirm` - Confirm purchase after Stripe payment
- `GET /api/purchases` - Get user's purchases
- `GET /api/purchases/:id/download` - Download purchased automation file

### Creator

- `POST /api/creator/automations` - Upload new automation
- `GET /api/creator/automations` - List creator's automations
- `PATCH /api/creator/automations/:id` - Update automation
- `DELETE /api/creator/automations/:id` - Delete automation
- `GET /api/creator/stats` - Get sales analytics
- `POST /api/creator/subscription/upgrade` - Upgrade subscription tier

### Reviews

- `POST /api/reviews` - Create review/rating
- `PATCH /api/reviews/:id` - Update own review
- `DELETE /api/reviews/:id` - Delete own review

### Admin

- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/status` - Ban/unban user
- `GET /api/admin/automations` - List all automations
- `PATCH /api/admin/automations/:id/status` - Approve/reject automation
- `GET /api/admin/analytics` - Platform analytics

---

## Environment Variables to Set

```
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (server-only)

# Stripe
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key (server-only)

# File Storage
MAX_FILE_SIZE_MB=50
ALLOWED_FILE_TYPES=json,yaml,zip
```

---

## Notes

- **TODO**: All database queries should be replaced with actual Supabase client calls
- **TODO**: All Stripe operations need your actual Stripe keys and webhook handlers
- **TODO**: Implement proper error handling and validation in all API endpoints
- **TODO**: Set up automated emails for order confirmations, payouts, etc.
- **TODO**: Add rate limiting to prevent abuse
- **TODO**: Implement caching for frequently accessed data (automations, categories)
