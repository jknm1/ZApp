-- =====================================================
-- 🔍 DEBUG - CHECK DATABASE STATUS
-- =====================================================
-- Run this to see what's happening in the database
-- =====================================================

-- 1. Check if funding_applications table exists
SELECT 
    'funding_applications table' as check_type,
    CASE 
        WHEN EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'funding_applications') 
        THEN '✅ EXISTS' 
        ELSE '❌ DOES NOT EXIST' 
    END as status;

-- 2. Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'funding_applications'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN '✅ RLS Enabled' ELSE '❌ RLS Disabled' END as rls_status
FROM pg_tables 
WHERE tablename = 'funding_applications';

-- 4. Check policies
SELECT 
    policyname,
    cmd as command,
    permissive,
    roles,
    qual as using_expression
FROM pg_policies 
WHERE tablename = 'funding_applications';

-- 5. Count total applications
SELECT 
    'Total Applications' as metric,
    COUNT(*) as count
FROM funding_applications;

-- 6. Check applications by email (replace with your test email)
-- IMPORTANT: Replace 'your-email@example.com' with the email you're testing with
SELECT 
    id,
    user_id,
    name,
    email,
    account_size,
    experience,
    status,
    submitted_at,
    created_at
FROM funding_applications
ORDER BY submitted_at DESC
LIMIT 10;

-- 7. Check foreign key constraint
SELECT
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'funding_applications';

-- 8. Check if user_id column matches users.id type
SELECT 
    'users.id type' as check_item,
    data_type
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'id'
UNION ALL
SELECT 
    'funding_applications.user_id type' as check_item,
    data_type
FROM information_schema.columns
WHERE table_name = 'funding_applications' AND column_name = 'user_id';

-- 9. Test insert (with a fake user_id)
-- This will tell us if RLS is blocking inserts
DO $$
DECLARE
    test_result TEXT;
BEGIN
    BEGIN
        INSERT INTO funding_applications (
            user_id, name, email, account_size, experience, status, submitted_at
        ) VALUES (
            'test-user-id-123', 'Test User', 'test@example.com', '$50,000', 'intermediate', 'pending', NOW()
        );
        
        test_result := '✅ Test insert SUCCESSFUL - RLS is allowing inserts';
        
        -- Clean up test data
        DELETE FROM funding_applications WHERE email = 'test@example.com';
        
    EXCEPTION WHEN OTHERS THEN
        test_result := '❌ Test insert FAILED: ' || SQLERRM;
    END;
    
    RAISE NOTICE '%', test_result;
END $$;

-- 10. Final summary
DO $$
DECLARE
    table_exists BOOLEAN;
    rls_enabled BOOLEAN;
    policy_count INTEGER;
    app_count INTEGER;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '📊 FUNDING APPLICATIONS DEBUG SUMMARY';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '';
    
    -- Check table
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'funding_applications'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Table exists';
        
        -- Check RLS
        SELECT rowsecurity INTO rls_enabled
        FROM pg_tables 
        WHERE tablename = 'funding_applications';
        
        IF rls_enabled THEN
            RAISE NOTICE '✅ RLS is enabled';
        ELSE
            RAISE NOTICE '⚠️  RLS is disabled';
        END IF;
        
        -- Count policies
        SELECT COUNT(*) INTO policy_count
        FROM pg_policies 
        WHERE tablename = 'funding_applications';
        
        RAISE NOTICE '📋 Total policies: %', policy_count;
        
        -- Count applications
        SELECT COUNT(*) INTO app_count
        FROM funding_applications;
        
        RAISE NOTICE '📝 Total applications: %', app_count;
        
    ELSE
        RAISE NOTICE '❌ Table does not exist!';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
END $$;
