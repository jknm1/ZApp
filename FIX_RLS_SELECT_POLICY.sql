-- =====================================================
-- 🔐 FIX RLS SELECT POLICY FOR APPLICATIONS
-- =====================================================

-- 1. First, let's see what's currently blocking SELECT
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'funding_applications';

-- 2. Drop existing SELECT policy if it exists
DROP POLICY IF EXISTS "Users can view their own applications" ON funding_applications;
DROP POLICY IF EXISTS "Enable read access for all users" ON funding_applications;
DROP POLICY IF EXISTS "Allow users to view applications" ON funding_applications;

-- 3. Create NEW SELECT policy that allows ANYONE to read applications
-- (Since we're using localStorage auth, not Supabase auth)
CREATE POLICY "Allow anonymous read access to funding applications"
ON funding_applications
FOR SELECT
TO anon, authenticated
USING (true);

-- This allows ALL users to SELECT from funding_applications
-- We filter by user_id or email in the frontend query

-- 4. Verify the policy was created
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'funding_applications'
  AND cmd = 'SELECT';

-- 5. Test the policy
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '✅ TESTING NEW SELECT POLICY';
    RAISE NOTICE '=================================================';
    
    -- Test as anon user
    SET LOCAL ROLE anon;
    SELECT COUNT(*) INTO test_count FROM funding_applications;
    RAISE NOTICE 'Applications visible as anon user: %', test_count;
    
    RESET ROLE;
    
    IF test_count > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE '✅ SUCCESS! Anon users can now SELECT applications';
        RAISE NOTICE '✅ Your Application Tracker should now work!';
    ELSE
        RAISE NOTICE '';
        RAISE NOTICE '⚠️ No applications found. Submit a test application.';
    END IF;
    
    RAISE NOTICE '=================================================';
END $$;

-- 6. Show all applications (to confirm they exist)
SELECT 
    id,
    user_id,
    name,
    email,
    account_size,
    status,
    submitted_at
FROM funding_applications
ORDER BY submitted_at DESC;
