-- =====================================================
-- 🔍 DEBUG APPLICATION TRACKER ISSUE
-- =====================================================

-- 1. Show ALL applications in the database
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

-- 2. Check if email matches
DO $$
DECLARE
    your_email TEXT := 'josephndungukamau1975@gmail.com';
    app_count INTEGER;
    matching_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '🔍 CHECKING EMAIL MATCH';
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'Looking for email: %', your_email;
    RAISE NOTICE '';
    
    -- Count total applications
    SELECT COUNT(*) INTO app_count
    FROM funding_applications;
    
    -- Count matching applications
    SELECT COUNT(*) INTO matching_count
    FROM funding_applications
    WHERE email = your_email;
    
    RAISE NOTICE 'Total applications in DB: %', app_count;
    RAISE NOTICE 'Applications with your email: %', matching_count;
    RAISE NOTICE '';
    
    IF matching_count = 0 THEN
        RAISE NOTICE '❌ NO APPLICATIONS FOUND FOR YOUR EMAIL!';
        RAISE NOTICE '';
        RAISE NOTICE 'This means you submitted with a different email.';
        RAISE NOTICE 'Check what emails are in the database:';
    ELSE
        RAISE NOTICE '✅ Found % applications for your email', matching_count;
    END IF;
    
    RAISE NOTICE '=================================================';
END $$;

-- 3. Show what emails exist
SELECT DISTINCT 
    email,
    COUNT(*) as application_count
FROM funding_applications
GROUP BY email
ORDER BY application_count DESC;

-- 4. Check RLS policies on funding_applications
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'funding_applications';

-- 5. Test if RLS is blocking SELECT
DO $$
DECLARE
    test_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '🔐 TESTING RLS POLICIES';
    RAISE NOTICE '=================================================';
    
    -- Count without RLS
    SET LOCAL row_security = off;
    SELECT COUNT(*) INTO test_count FROM funding_applications;
    RAISE NOTICE 'Applications visible without RLS: %', test_count;
    
    -- Count with RLS (as anon user)
    SET LOCAL row_security = on;
    SET LOCAL ROLE anon;
    SELECT COUNT(*) INTO test_count FROM funding_applications;
    RAISE NOTICE 'Applications visible with RLS (anon): %', test_count;
    
    RESET ROLE;
    
    RAISE NOTICE '';
    RAISE NOTICE 'If these numbers differ, RLS is blocking SELECT!';
    RAISE NOTICE '=================================================';
END $$;
