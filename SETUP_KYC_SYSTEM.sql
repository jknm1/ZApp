-- =====================================================
-- KYC SYSTEM COMPLETE SETUP
-- Run this SQL in Supabase SQL Editor
-- =====================================================

-- Step 1: Clean up existing KYC tables and policies
DROP POLICY IF EXISTS "Users can view own submissions" ON public.kyc_submissions;
DROP POLICY IF EXISTS "Users can insert submissions" ON public.kyc_submissions;
DROP POLICY IF EXISTS "Admin can view all submissions" ON public.kyc_submissions;
DROP POLICY IF EXISTS "Admin can update submissions" ON public.kyc_submissions;

DROP TABLE IF EXISTS public.kyc_submissions CASCADE;

-- Step 2: Create kyc_submissions table
CREATE TABLE public.kyc_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('id_front', 'id_back', 'proof_of_address', 'selfie')),
    file_name TEXT NOT NULL,
    file_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    CONSTRAINT fk_user_kyc FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Step 3: Create indexes
CREATE INDEX idx_kyc_user_id ON public.kyc_submissions(user_id);
CREATE INDEX idx_kyc_status ON public.kyc_submissions(status);
CREATE INDEX idx_kyc_submitted_at ON public.kyc_submissions(submitted_at DESC);

-- Step 4: Enable Row Level Security
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON public.kyc_submissions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can insert submissions" ON public.kyc_submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin can view all submissions
CREATE POLICY "Admin can view all submissions" ON public.kyc_submissions
    FOR SELECT USING (true);

-- Admin can update all submissions
CREATE POLICY "Admin can update submissions" ON public.kyc_submissions
    FOR UPDATE USING (true);

-- Step 6: Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE kyc_submissions;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'kyc_submissions'
ORDER BY ordinal_position;

-- Check policies
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'kyc_submissions';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ KYC submissions table created successfully!';
    RAISE NOTICE '✅ RLS policies configured!';
    RAISE NOTICE '✅ Realtime enabled!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next step: Create Storage Bucket in Supabase Dashboard';
    RAISE NOTICE '  1. Go to Storage → Create bucket';
    RAISE NOTICE '  2. Name: kyc-documents';
    RAISE NOTICE '  3. Public: NO (keep private for security)';
    RAISE NOTICE '  4. File size limit: 10MB';
    RAISE NOTICE '  5. Allowed MIME types: image/*, application/pdf';
END $$;
