-- =====================================================
-- COMPLETE NOTIFICATION SYSTEM SETUP
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- Step 1: Clean up existing policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Allow insert notifications" ON public.notifications;

-- Step 2: Create notifications table (if doesn't exist)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('success', 'info', 'warning', 'update')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Step 4: Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
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

-- Allow anyone authenticated to insert notifications (for admin broadcasts)
CREATE POLICY "Allow insert notifications" ON public.notifications
    FOR INSERT 
    TO authenticated
    WITH CHECK (true);

-- Additional admin policy for full access
CREATE POLICY "Admin full access" ON public.notifications
    FOR ALL USING (
        auth.jwt() ->> 'email' = 'josephndungukamau20@gmail.com'
    );

-- Step 6: Enable Realtime (this makes notifications update instantly)
-- First, try to remove from publication if it already exists
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS notifications;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- Now add it fresh
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if table was created successfully
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'notifications'
ORDER BY ordinal_position;

-- Check policies
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'notifications';

-- Count existing notifications
SELECT COUNT(*) as total_notifications FROM public.notifications;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Notifications table setup complete!';
    RAISE NOTICE '✅ RLS policies created!';
    RAISE NOTICE '✅ Realtime enabled!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next step: Run TEST_NOTIFICATION.sql to create a test notification';
END $$;