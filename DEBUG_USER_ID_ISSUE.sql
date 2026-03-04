-- =====================================================
-- 🔍 CHECK USERS TABLE & DATA TYPES
-- =====================================================
-- This will help us understand the user.id issue
-- =====================================================

-- 1. Check users table structure
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 2. Check data type match between tables
SELECT 
    'users.id' as column,
    data_type as type
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'id'
UNION ALL
SELECT 
    'funding_applications.user_id' as column,
    data_type as type
FROM information_schema.columns
WHERE table_name = 'funding_applications' AND column_name = 'user_id';

-- 3. Show sample user IDs (first 5 users)
SELECT 
    id,
    email,
    LENGTH(id) as id_length,
    pg_typeof(id) as id_type
FROM users
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check if any applications exist
SELECT 
    id,
    user_id,
    email,
    LENGTH(user_id) as user_id_length,
    status
FROM funding_applications
ORDER BY submitted_at DESC
LIMIT 5;

-- 5. Test if we can insert with a real user_id
DO $$
DECLARE
    test_user_id TEXT;
    test_user_email TEXT;
BEGIN
    -- Get a real user ID from the users table
    SELECT id, email INTO test_user_id, test_user_email
    FROM users
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Testing with real user ID: %', test_user_id;
        RAISE NOTICE 'Testing with email: %', test_user_email;
        
        -- Try to insert
        BEGIN
            INSERT INTO funding_applications (
                user_id, 
                name, 
                email, 
                account_size, 
                experience,
                status
            ) VALUES (
                test_user_id,
                'Test Insert',
                'test-debug@zynx.com',
                '$50,000',
                'intermediate',
                'pending'
            );
            
            RAISE NOTICE '✅ Insert with real user_id SUCCESSFUL!';
            
            -- Clean up
            DELETE FROM funding_applications WHERE email = 'test-debug@zynx.com';
            RAISE NOTICE '✅ Cleanup complete';
            
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE '❌ Insert FAILED: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE '❌ No users found in users table!';
    END IF;
END $$;

-- 6. Summary
DO $$
DECLARE
    user_count INTEGER;
    app_count INTEGER;
    users_id_type TEXT;
    apps_userid_type TEXT;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO app_count FROM funding_applications;
    
    SELECT data_type INTO users_id_type
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'id';
    
    SELECT data_type INTO apps_userid_type
    FROM information_schema.columns
    WHERE table_name = 'funding_applications' AND column_name = 'user_id';
    
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '📊 DIAGNOSIS SUMMARY';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '';
    RAISE NOTICE '👥 Total users in database: %', user_count;
    RAISE NOTICE '📝 Total applications: %', app_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔍 Data Types:';
    RAISE NOTICE '  users.id: %', users_id_type;
    RAISE NOTICE '  funding_applications.user_id: %', apps_userid_type;
    RAISE NOTICE '';
    
    IF users_id_type = apps_userid_type THEN
        RAISE NOTICE '✅ Data types MATCH';
    ELSE
        RAISE NOTICE '❌ Data types DO NOT MATCH!';
        RAISE NOTICE '   This is the problem!';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
END $$;
