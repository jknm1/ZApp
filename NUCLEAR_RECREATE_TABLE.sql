-- =====================================================
-- 🔥 NUCLEAR OPTION - RECREATE FUNDING_APPLICATIONS
-- =====================================================
-- ONLY RUN THIS IF NOTHING ELSE WORKS!
-- This will DELETE ALL EXISTING APPLICATIONS!
-- =====================================================

-- Step 1: Backup existing data (just in case)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'funding_applications') THEN
        DROP TABLE IF EXISTS funding_applications_backup;
        CREATE TABLE funding_applications_backup AS 
        SELECT * FROM funding_applications;
        RAISE NOTICE '✅ Backed up existing data to funding_applications_backup';
    END IF;
END $$;

-- Step 2: Drop the table completely
DROP TABLE IF EXISTS funding_applications CASCADE;

-- Step 3: Recreate the table from scratch
CREATE TABLE funding_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,  -- Nullable, flexible
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    account_size TEXT NOT NULL,
    experience TEXT NOT NULL,
    trading_pair TEXT,
    country TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Add flexible foreign key (optional, won't block inserts)
ALTER TABLE funding_applications
ADD CONSTRAINT fk_user_applications 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE SET NULL 
ON UPDATE CASCADE
NOT VALID;  -- Don't validate existing rows

-- Step 5: Create indexes for performance
CREATE INDEX idx_funding_apps_user_id ON funding_applications(user_id);
CREATE INDEX idx_funding_apps_email ON funding_applications(email);
CREATE INDEX idx_funding_apps_status ON funding_applications(status);
CREATE INDEX idx_funding_apps_submitted_at ON funding_applications(submitted_at DESC);

-- Step 6: Enable RLS
ALTER TABLE funding_applications ENABLE ROW LEVEL SECURITY;

-- Step 7: Create simple, permissive policies
CREATE POLICY "allow_all_select" 
ON funding_applications 
FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "allow_all_insert" 
ON funding_applications 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "allow_all_update" 
ON funding_applications 
FOR UPDATE 
TO anon, authenticated 
USING (true);

CREATE POLICY "allow_all_delete" 
ON funding_applications 
FOR DELETE 
TO anon, authenticated 
USING (true);

-- Step 8: Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_funding_applications_updated_at 
BEFORE UPDATE ON funding_applications 
FOR EACH ROW 
EXECUTE PROCEDURE update_updated_at_column();

-- Step 9: Test insert
DO $$
BEGIN
    INSERT INTO funding_applications (
        user_id, 
        name, 
        email, 
        account_size, 
        experience, 
        trading_pair,
        country,
        status
    ) VALUES (
        'test-123',
        'Test Application',
        'test@zynx.com',
        '$50,000',
        'intermediate',
        'EUR/USD',
        'United States',
        'pending'
    );
    
    RAISE NOTICE '✅ Test insert successful!';
    
    -- Clean up test
    DELETE FROM funding_applications WHERE email = 'test@zynx.com';
    RAISE NOTICE '✅ Test cleanup complete';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE '❌ Test insert failed: %', SQLERRM;
END $$;

-- Step 10: Summary
DO $$
DECLARE
    column_count INTEGER;
    policy_count INTEGER;
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns
    WHERE table_name = 'funding_applications';
    
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE tablename = 'funding_applications';
    
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE tablename = 'funding_applications';
    
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '🎉 TABLE RECREATED SUCCESSFULLY!';
    RAISE NOTICE '=================================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ funding_applications table created';
    RAISE NOTICE '✅ % columns configured', column_count;
    RAISE NOTICE '✅ % RLS policies active', policy_count;
    RAISE NOTICE '✅ % indexes created', index_count;
    RAISE NOTICE '✅ Flexible foreign key added';
    RAISE NOTICE '✅ Auto-update trigger added';
    RAISE NOTICE '';
    RAISE NOTICE '🧪 READY TO TEST:';
    RAISE NOTICE '  1. Go to /challenges';
    RAISE NOTICE '  2. Submit an application';
    RAISE NOTICE '  3. Check /application-tracker';
    RAISE NOTICE '';
    RAISE NOTICE '📝 OLD DATA BACKUP:';
    RAISE NOTICE '  Table: funding_applications_backup';
    RAISE NOTICE '  (if there was any data)';
    RAISE NOTICE '';
    RAISE NOTICE '=================================================';
END $$;
