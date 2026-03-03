-- =====================================================
-- EMERGENCY DEBUG - Find out what's wrong
-- Copy the ENTIRE output and send it to me
-- =====================================================

-- 1. Check if notifications table exists
SELECT 
    'Table exists: ' || CASE WHEN EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'notifications'
    ) THEN '✅ YES' ELSE '❌ NO' END as status;

-- 2. Check RLS status
SELECT 
    'RLS enabled: ' || CASE WHEN rowsecurity THEN '✅ YES' ELSE '❌ NO' END as status
FROM pg_tables
WHERE tablename = 'notifications' AND schemaname = 'public';

-- 3. Show ALL notifications in database (bypass RLS)
SET ROLE postgres;
SELECT 
    id,
    user_id,
    type,
    title,
    message,
    read,
    created_at
FROM public.notifications
ORDER BY created_at DESC
LIMIT 10;
RESET ROLE;

-- 4. Count total notifications
SET ROLE postgres;
SELECT COUNT(*) as "Total Notifications in Database" FROM public.notifications;
RESET ROLE;

-- 5. Check all RLS policies
SELECT 
    policyname as "Policy Name",
    cmd as "Command",
    permissive as "Permissive",
    qual as "USING clause",
    with_check as "WITH CHECK clause"
FROM pg_policies
WHERE tablename = 'notifications';

-- 6. Show all users in auth.users
SELECT 
    id as "Auth User ID",
    email as "Email",
    created_at as "Created At"
FROM auth.users
ORDER BY created_at DESC;

-- 7. Try to select notifications as current user
SELECT 
    'Your user ID: ' || COALESCE(auth.uid()::text, 'NULL - NOT LOGGED IN!') as info;

SELECT 
    'Your email: ' || COALESCE(auth.email()::text, 'NULL - NOT LOGGED IN!') as info;

-- 8. Test if current user can see any notifications
SELECT 
    id,
    user_id,
    title,
    message,
    CASE 
        WHEN auth.uid()::text = user_id::text THEN '✅ YOURS'
        ELSE '❌ NOT YOURS (user_id=' || user_id::text || ')'
    END as ownership
FROM public.notifications
ORDER BY created_at DESC;

-- Final message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'DEBUG COMPLETE!';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Copy ALL the results above and send them to me';
    RAISE NOTICE '';
END $$;
