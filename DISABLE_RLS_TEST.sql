-- =====================================================
-- TEMPORARY FIX - DISABLE RLS TO TEST
-- This will let you see if notifications exist at all
-- =====================================================

-- Temporarily disable RLS
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Check what's in the table
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

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ RLS DISABLED TEMPORARILY';
    RAISE NOTICE '';
    RAISE NOTICE 'Now refresh your dashboard and check if notifications appear!';
    RAISE NOTICE '';
    RAISE NOTICE 'If they appear, the issue is RLS policies.';
    RAISE NOTICE 'If they still dont appear, the issue is in the frontend code.';
    RAISE NOTICE '';
END $$;
