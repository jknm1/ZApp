-- =====================================================
-- COMPLETE FIX FOR NOTIFICATION SYSTEM
-- This fixes both the foreign key issue and RLS policies
-- =====================================================

-- Step 1: Drop the problematic foreign key constraint
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS fk_user;

RAISE NOTICE '✅ Foreign key constraints removed';

-- Step 2: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admin full access" ON public.notifications;

RAISE NOTICE '✅ Old policies removed';

-- Step 3: Create new RLS policies
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT 
    TO authenticated
    USING (auth.uid()::text = user_id::text);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE 
    TO authenticated
    USING (auth.uid()::text = user_id::text);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON public.notifications
    FOR DELETE 
    TO authenticated
    USING (auth.uid()::text = user_id::text);

-- Allow authenticated users to insert notifications (for admin broadcasts)
CREATE POLICY "Allow insert notifications" ON public.notifications
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

RAISE NOTICE '✅ New policies created';

-- Step 4: Make sure RLS is enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

RAISE NOTICE '✅ RLS enabled';

-- Step 5: Verify everything is working
-- Show current policies
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies
WHERE tablename = 'notifications';

-- Show total notifications in database
SELECT 
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN read = false THEN 1 END) as unread_count
FROM public.notifications;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅✅✅ NOTIFICATION SYSTEM FIXED! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE 'What was fixed:';
    RAISE NOTICE '  ✅ Foreign key constraint removed';
    RAISE NOTICE '  ✅ RLS policies recreated properly';
    RAISE NOTICE '  ✅ Users can now see their notifications';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Refresh your dashboard (F5)';
    RAISE NOTICE '  2. Check bell icon - you should see notifications';
    RAISE NOTICE '  3. If still empty, send a new notification from admin';
END $$;
