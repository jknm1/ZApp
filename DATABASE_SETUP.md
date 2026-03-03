# ZYNX CAPITAL - Database Setup Guide

This document contains all the SQL commands needed to create the database tables for the new features.

## Prerequisites
- Access to your Supabase project dashboard
- SQL Editor in Supabase

## Setup Instructions

1. Go to your Supabase project: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot
2. Navigate to **SQL Editor** from the left sidebar
3. Copy and paste each SQL block below and run them one by one

---

## 1. Withdrawals Table

```sql
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  method VARCHAR(50) NOT NULL,
  crypto_type VARCHAR(10),
  wallet_address TEXT,
  paypal_email TEXT,
  neteller_email TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own withdrawals"
  ON public.withdrawals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own withdrawals"
  ON public.withdrawals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin can view and update all withdrawals (optional - you'll need to set up admin role)
```

---

## 2. Payout History Table

```sql
CREATE TABLE IF NOT EXISTS public.payout_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  transaction_id VARCHAR(100) NOT NULL UNIQUE,
  method VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(12, 2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.payout_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own payout history"
  ON public.payout_history FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 3. Applications Table

```sql
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  interview_date TIMESTAMP WITH TIME ZONE,
  documents TEXT[],
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 4. Achievements Table

```sql
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type VARCHAR(100) NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  shared BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, badge_type)
);

-- Enable Row Level Security
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON public.achievements FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 5. KYC Documents Table

```sql
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT
);

-- Enable Row Level Security
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own KYC documents"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC documents"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KYC documents"
  ON public.kyc_documents FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 6. Create Indexes for Better Performance

```sql
-- Withdrawals indexes
CREATE INDEX idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX idx_withdrawals_created_at ON public.withdrawals(created_at DESC);

-- Payout history indexes
CREATE INDEX idx_payout_history_user_id ON public.payout_history(user_id);
CREATE INDEX idx_payout_history_created_at ON public.payout_history(created_at DESC);

-- Applications indexes
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_applications_submitted_at ON public.applications(submitted_at DESC);

-- Achievements indexes
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);

-- KYC documents indexes
CREATE INDEX idx_kyc_documents_user_id ON public.kyc_documents(user_id);
CREATE INDEX idx_kyc_documents_status ON public.kyc_documents(status);
```

---

## 7. Verify Setup

After running all the SQL commands, verify that all tables were created successfully:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'withdrawals',
  'payout_history',
  'applications',
  'achievements',
  'kyc_documents'
)
ORDER BY table_name;
```

You should see all 5 tables listed.

---

## Next Steps

1. **Test the features** - Navigate to each new page in the app and test functionality
2. **Admin Access** - Set up admin access to manage withdrawals, applications, and KYC documents
3. **Storage Bucket** - Create a Supabase Storage bucket called "kyc-documents" for file uploads
4. **Notifications** - The withdrawal and application submissions automatically create notifications

---

## Storage Setup for KYC Documents

To enable file uploads for KYC verification:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `kyc-documents`
3. Set the bucket to **Private** (only authenticated users can access)
4. Add this policy:

```sql
-- Allow users to upload their own KYC documents
CREATE POLICY "Users can upload their own KYC documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view their own KYC documents
CREATE POLICY "Users can view their own KYC documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Support

If you encounter any issues:
- Check the Supabase logs for errors
- Verify RLS policies are enabled
- Ensure your auth.users table exists and is properly configured

All features are now ready to use! 🎉
