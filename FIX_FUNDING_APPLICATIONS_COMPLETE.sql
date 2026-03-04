-- =====================================================
-- COMPLETE FIX FOR FUNDING APPLICATIONS
-- =====================================================
-- This script:
-- 1. Fixes foreign key constraint
-- 2. Ensures user_id column type matches users.id
-- 3. Makes the constraint flexible
-- =====================================================

-- Step 1: Drop existing constraint
ALTER TABLE funding_applications DROP CONSTRAINT IF EXISTS fk_user_applications;
ALTER TABLE funding_applications DROP CONSTRAINT IF EXISTS funding_applications_user_id_fkey;

-- Step 2: Check and fix column types
DO $$
DECLARE
    users_id_type TEXT;
    funding_apps_user_id_type TEXT;
BEGIN
    -- Get the type of users.id
    SELECT data_type INTO users_id_type
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'id';
    
    -- Get the type of funding_applications.user_id
    SELECT data_type INTO funding_apps_user_id_type
    FROM information_schema.columns
    WHERE table_name = 'funding_applications' AND column_name = 'user_id';
    
    RAISE NOTICE 'users.id type: %', users_id_type;
    RAISE NOTICE 'funding_applications.user_id type: %', funding_apps_user_id_type;
    
    -- If types don't match, fix it
    IF users_id_type != funding_apps_user_id_type THEN
        RAISE NOTICE 'Types do not match! Fixing...';
        EXECUTE format('ALTER TABLE funding_applications ALTER COLUMN user_id TYPE %s USING user_id::%s', users_id_type, users_id_type);
        RAISE NOTICE '✅ Column types now match!';
    ELSE
        RAISE NOTICE '✅ Column types already match';
    END IF;
END $$;

-- Step 3: Make user_id nullable (flexible)
ALTER TABLE funding_applications ALTER COLUMN user_id DROP NOT NULL;

-- Step 4: Add flexible foreign key constraint
ALTER TABLE funding_applications
ADD CONSTRAINT fk_user_applications 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE
NOT VALID; -- Don't validate existing rows

-- Step 5: Validate the constraint (this will check all existing rows)
ALTER TABLE funding_applications VALIDATE CONSTRAINT fk_user_applications;

-- Step 6: Ensure RLS policies allow inserts
DROP POLICY IF EXISTS "Allow all inserts to funding_applications" ON funding_applications;
DROP POLICY IF EXISTS "Users can insert applications" ON funding_applications;

CREATE POLICY "Allow all inserts to funding_applications" 
ON funding_applications 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow all reads from funding_applications" 
ON funding_applications 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow all updates to funding_applications" 
ON funding_applications 
FOR UPDATE 
TO anon, authenticated 
USING (true);

-- Summary
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '✅ FUNDING APPLICATIONS - FULLY FIXED!';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Foreign key constraint updated';
    RAISE NOTICE '✅ Column types matched';
    RAISE NOTICE '✅ user_id is now nullable';
    RAISE NOTICE '✅ RLS policies allow all operations';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 You can now submit applications!';
    RAISE NOTICE '';
    RAISE NOTICE 'Test by:';
    RAISE NOTICE '1. Go to /challenges page';
    RAISE NOTICE '2. Click "Apply for Funding"';
    RAISE NOTICE '3. Fill out and submit form';
    RAISE NOTICE '4. Check /application-tracker';
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
END $$;
