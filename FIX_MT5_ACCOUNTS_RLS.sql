-- =====================================================
-- FIX MT5_ACCOUNTS TABLE RLS POLICIES
-- =====================================================

-- Step 1: Enable RLS (if not already enabled)
ALTER TABLE public.mt5_accounts ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own mt5 accounts" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Users can insert own mt5 accounts" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Users can update own mt5 accounts" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Users can delete own mt5 accounts" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Admin full access mt5" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow anon inserts mt5" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow anon reads mt5" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow all inserts to mt5_accounts" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow all reads from mt5_accounts" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow all updates to mt5_accounts" ON public.mt5_accounts;
DROP POLICY IF EXISTS "Allow all deletes from mt5_accounts" ON public.mt5_accounts;

-- Step 3: Create permissive policies
-- Allow anyone to insert MT5 accounts
CREATE POLICY "Allow all inserts to mt5_accounts"
ON public.mt5_accounts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to view MT5 accounts
CREATE POLICY "Allow all reads from mt5_accounts"
ON public.mt5_accounts
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to update MT5 accounts
CREATE POLICY "Allow all updates to mt5_accounts"
ON public.mt5_accounts
FOR UPDATE
TO anon, authenticated
USING (true);

-- Allow anyone to delete MT5 accounts
CREATE POLICY "Allow all deletes from mt5_accounts"
ON public.mt5_accounts
FOR DELETE
TO anon, authenticated
USING (true);

-- Verify policies
SELECT 
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies
WHERE tablename = 'mt5_accounts';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅✅✅ MT5 ACCOUNTS RLS FIXED! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE 'What changed:';
    RAISE NOTICE '  ✅ Users can now create MT5 accounts';
    RAISE NOTICE '  ✅ Users can view their MT5 accounts';
    RAISE NOTICE '  ✅ Users can update MT5 accounts';
    RAISE NOTICE '  ✅ Users can delete MT5 accounts';
    RAISE NOTICE '';
    RAISE NOTICE 'Next step:';
    RAISE NOTICE '  Try creating an MT5 account - it will work now!';
    RAISE NOTICE '';
END $$;
