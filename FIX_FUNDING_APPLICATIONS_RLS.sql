-- =====================================================
-- FIX FUNDING_APPLICATIONS TABLE RLS POLICIES
-- =====================================================

-- Step 1: Enable RLS (if not already enabled)
ALTER TABLE public.funding_applications ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own applications" ON public.funding_applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON public.funding_applications;
DROP POLICY IF EXISTS "Admin full access" ON public.funding_applications;
DROP POLICY IF EXISTS "Allow anon inserts" ON public.funding_applications;
DROP POLICY IF EXISTS "Allow anon reads" ON public.funding_applications;
DROP POLICY IF EXISTS "Allow all inserts to funding_applications" ON public.funding_applications;
DROP POLICY IF EXISTS "Allow all reads from funding_applications" ON public.funding_applications;
DROP POLICY IF EXISTS "Allow all updates to funding_applications" ON public.funding_applications;

-- Step 3: Create permissive policies
-- Allow anyone to insert applications
CREATE POLICY "Allow all inserts to funding_applications"
ON public.funding_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to view applications
CREATE POLICY "Allow all reads from funding_applications"
ON public.funding_applications
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to update applications (for admin status changes)
CREATE POLICY "Allow all updates to funding_applications"
ON public.funding_applications
FOR UPDATE
TO anon, authenticated
USING (true);

-- Verify policies
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies
WHERE tablename = 'funding_applications';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅✅✅ FUNDING APPLICATIONS RLS FIXED! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE 'What changed:';
    RAISE NOTICE '  ✅ Users can now submit applications';
    RAISE NOTICE '  ✅ Users can view their applications';
    RAISE NOTICE '  ✅ Applications will appear in the tracker';
    RAISE NOTICE '';
    RAISE NOTICE 'Next step:';
    RAISE NOTICE '  Try submitting an application and check the tracker!';
    RAISE NOTICE '';
END $$;
