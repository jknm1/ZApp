-- =====================================================
-- DEBUG NOTIFICATIONS - Check what's in the database
-- Run this to see if notifications were actually saved
-- =====================================================

-- Step 1: Check if notifications exist
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

-- Step 2: Count total notifications
SELECT COUNT(*) as total_notifications FROM public.notifications;

-- Step 3: Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as using_expression,
    with_check as check_expression
FROM pg_policies
WHERE tablename = 'notifications';

-- Step 4: Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'notifications';

-- Step 5: Test if current user can see notifications
-- This will show you what user_id you're logged in as
SELECT 
    auth.uid() as my_user_id,
    auth.email() as my_email;

-- Step 6: Show notifications for current logged-in user
SELECT 
    id,
    type,
    title,
    message,
    read,
    created_at
FROM public.notifications
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Debug queries complete!';
    RAISE NOTICE '';
    RAISE NOTICE 'Check the results above to see:';
    RAISE NOTICE '  1. Total notifications in database';
    RAISE NOTICE '  2. Your current user_id';
    RAISE NOTICE '  3. Notifications for your user';
    RAISE NOTICE '  4. RLS policies status';
END $$;
