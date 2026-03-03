-- =====================================================
-- FIX NOTIFICATION BROADCAST ISSUE
-- Run this if admin can't send notifications
-- =====================================================

-- Step 1: Check current policies
SELECT 
    policyname,
    cmd as command,
    permissive,
    roles,
    qual as using_expression,
    with_check as check_expression
FROM pg_policies
WHERE tablename = 'notifications';

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin full access" ON public.notifications;

-- Step 3: Recreate policies with correct permissions
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.notifications
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- THIS IS THE KEY POLICY - Allows anyone authenticated to insert notifications for anyone
CREATE POLICY "Allow insert notifications" ON public.notifications
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Step 4: Verify RLS is enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 5: Test insert (replace USER_ID with an actual user ID from your auth.users table)
-- This should work without errors
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get first user ID
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Try to insert a test notification
        INSERT INTO public.notifications (user_id, type, title, message, read)
        VALUES (
            test_user_id,
            'info',
            'Test Notification',
            'This is a test to verify notification system works',
            false
        );
        
        RAISE NOTICE '✅ Test notification inserted successfully for user: %', test_user_id;
        
        -- Clean up test notification
        DELETE FROM public.notifications 
        WHERE title = 'Test Notification' 
        AND user_id = test_user_id;
        
        RAISE NOTICE '✅ Test notification cleaned up';
    ELSE
        RAISE NOTICE '⚠️ No users found in auth.users table. Create a user first.';
    END IF;
END $$;

-- Step 6: Verify policies are working
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as using_status,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has CHECK clause'
        ELSE 'No CHECK clause'
    END as check_status
FROM pg_policies
WHERE tablename = 'notifications';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Notification policies fixed!';
    RAISE NOTICE '';
    RAISE NOTICE 'Now try sending a broadcast notification from Admin Dashboard';
    RAISE NOTICE 'If it still fails, check browser console (F12) for specific error';
END $$;
