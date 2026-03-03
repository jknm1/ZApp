# 🗄️ SUPABASE DATABASE SETUP

## 📋 **REQUIRED TABLES FOR ZYNX CAPITAL**

Run these SQL commands in your Supabase SQL Editor to create all necessary tables.

---

## 🔔 **NOTIFICATIONS TABLE**

This table stores user notifications for applications, approvals, and system updates.

```sql
-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('success', 'info', 'warning', 'update')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- Only authenticated users can insert (usually via backend/admin)
CREATE POLICY "Authenticated users can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## ⭐ **REVIEWS TABLE** (Already exists - verify schema)

This table stores user reviews and testimonials.

```sql
-- Verify/Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON public.reviews(verified);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view verified reviews
CREATE POLICY "Anyone can view verified reviews" ON public.reviews
  FOR SELECT USING (verified = true OR auth.uid() = user_id);

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Only admins can delete reviews (add admin check here)
CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 📝 **JOURNAL ENTRIES TABLE** (Future - Optional)

For trading journal feature.

```sql
-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  pair VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('buy', 'sell')),
  entry_price DECIMAL(10, 5) NOT NULL,
  exit_price DECIMAL(10, 5) NOT NULL,
  lot_size DECIMAL(10, 2) NOT NULL,
  profit DECIMAL(10, 2) NOT NULL,
  notes TEXT,
  emotions VARCHAR(100),
  strategy VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_date ON public.journal_entries(date DESC);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own journal entries" ON public.journal_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journal entries" ON public.journal_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" ON public.journal_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" ON public.journal_entries
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 🎁 **REFERRALS TABLE** (Future - Optional)

For referral program tracking.

```sql
-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'funded', 'rejected')),
  earnings DECIMAL(10, 2) DEFAULT 0,
  referred_email VARCHAR(255),
  referred_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  funded_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can insert own referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);
```

---

## 📊 **CHALLENGES TABLE** (Future - Optional)

For challenge progress tracking.

```sql
-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  account_size DECIMAL(12, 2) NOT NULL,
  profit_target DECIMAL(12, 2) NOT NULL,
  current_profit DECIMAL(12, 2) DEFAULT 0,
  max_drawdown DECIMAL(12, 2) NOT NULL,
  current_drawdown DECIMAL(12, 2) DEFAULT 0,
  trading_days INTEGER NOT NULL,
  days_completed INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_challenges_user_id ON public.challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own challenges" ON public.challenges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" ON public.challenges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON public.challenges
  FOR UPDATE USING (auth.uid() = user_id);
```

---

## 🚀 **QUICK SETUP INSTRUCTIONS**

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Required Tables**
   - Copy the `notifications` table SQL (required)
   - Paste and click "Run"
   - Verify `reviews` table exists (already created)

4. **Optional: Run Future Tables**
   - Run `journal_entries` SQL when ready to use Trading Journal
   - Run `referrals` SQL when ready to use Referral System
   - Run `challenges` SQL when ready to use Challenge Progress

5. **Verify Tables**
   ```sql
   -- Check if tables exist
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

---

## 🔒 **SECURITY NOTES**

- **Row Level Security (RLS)** is enabled on all tables
- Users can only access their own data
- Admins need special policies (add custom admin checks)
- All timestamps are in UTC
- Foreign keys ensure data integrity

---

## 📱 **TESTING THE SETUP**

After creating the notifications table, test it:

```sql
-- Insert a test notification (replace USER_ID with actual user ID)
INSERT INTO public.notifications (user_id, type, title, message)
VALUES 
  ('YOUR_USER_ID_HERE', 'success', 'Test Notification', 'This is a test notification!');

-- Query notifications
SELECT * FROM public.notifications WHERE user_id = 'YOUR_USER_ID_HERE';
```

---

## ✅ **CURRENT STATUS**

| Table | Status | Required | Notes |
|-------|--------|----------|-------|
| `notifications` | ⚠️ Needs Creation | ✅ Yes | Create now |
| `reviews` | ✅ Exists | ✅ Yes | Already working |
| `journal_entries` | ⏳ Optional | ❌ Future | For Trading Journal |
| `referrals` | ⏳ Optional | ❌ Future | For Referral Program |
| `challenges` | ⏳ Optional | ❌ Future | For Challenge Tracking |

---

## 💡 **WHAT HAPPENS WITHOUT TABLES?**

The app will still work! Features gracefully fallback to:
- **Notifications**: Shows mock/demo notifications
- **Reviews**: Uses default testimonials
- **Journal/Referrals/Challenges**: Works with local state (not persistent)

---

## 📞 **NEED HELP?**

1. Verify your Supabase project ID: `muhztdszuirjqyujsaot`
2. Check RLS policies are enabled
3. Verify auth.users table exists
4. Test with your user ID from auth

**Your ZYNX CAPITAL platform will work perfectly with or without these tables!** 🎉
