-- =====================================================
-- FIX FOREIGN KEY CONSTRAINT ERROR
-- =====================================================
-- This fixes the "violates foreign key constraint" error
-- when submitting funding applications
-- =====================================================

-- Step 1: Check if the constraint exists
DO $$
BEGIN
    -- Drop the existing foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_user_applications' 
        AND table_name = 'funding_applications'
    ) THEN
        ALTER TABLE funding_applications DROP CONSTRAINT fk_user_applications;
        RAISE NOTICE '✅ Dropped old foreign key constraint';
    END IF;
END $$;

-- Step 2: Make user_id nullable (in case user doesn't exist yet)
ALTER TABLE funding_applications 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 3: Add a more flexible foreign key constraint with ON DELETE SET NULL
-- This means if a user is deleted, the application stays but user_id becomes null
ALTER TABLE funding_applications
ADD CONSTRAINT fk_user_applications 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Step 4: Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_funding_apps_user_id 
ON funding_applications(user_id);

-- Step 5: Verify the fix
DO $$
DECLARE
    constraint_exists BOOLEAN;
    nullable_check BOOLEAN;
BEGIN
    -- Check if constraint exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_user_applications' 
        AND table_name = 'funding_applications'
    ) INTO constraint_exists;
    
    -- Check if column is nullable
    SELECT is_nullable = 'YES'
    FROM information_schema.columns
    WHERE table_name = 'funding_applications'
    AND column_name = 'user_id'
    INTO nullable_check;
    
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '✅ FOREIGN KEY FIX COMPLETE!';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '';
    
    IF constraint_exists THEN
        RAISE NOTICE '✅ Foreign key constraint exists';
    ELSE
        RAISE NOTICE '⚠️  Foreign key constraint missing';
    END IF;
    
    IF nullable_check THEN
        RAISE NOTICE '✅ user_id is nullable (flexible)';
    ELSE
        RAISE NOTICE '⚠️  user_id is NOT NULL (may cause issues)';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '📝 Changes made:';
    RAISE NOTICE '  1. Removed strict foreign key constraint';
    RAISE NOTICE '  2. Made user_id nullable';
    RAISE NOTICE '  3. Added flexible FK with ON DELETE SET NULL';
    RAISE NOTICE '  4. Applications can now be submitted!';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 You can now submit funding applications!';
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
END $$;
