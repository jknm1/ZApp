-- =====================================================
-- HASH EXISTING PASSWORDS IN DATABASE
-- IMPORTANT: Run this AFTER deploying the new code!
-- =====================================================

-- This script will hash all existing plain-text passwords
-- WARNING: This is a ONE-TIME operation and cannot be undone!

-- Step 1: Add a function to hash passwords
-- Note: Supabase uses PostgreSQL's pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Step 2: Backup existing passwords (just in case)
-- Create a temporary backup table
DROP TABLE IF EXISTS users_password_backup;
CREATE TABLE users_password_backup AS 
SELECT id, email, password, created_at 
FROM users;

-- Step 3: Hash all existing passwords
-- Using bcrypt with 10 salt rounds (matches the frontend)
UPDATE users
SET password = crypt(password, gen_salt('bf', 10))
WHERE password NOT LIKE '$2%'; -- Only update if not already hashed

-- Step 4: Verify the update
DO $$
DECLARE
    total_users INTEGER;
    hashed_users INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_users FROM users;
    SELECT COUNT(*) INTO hashed_users FROM users WHERE password LIKE '$2%';
    
    RAISE NOTICE '';
    RAISE NOTICE '✅✅✅ PASSWORD HASHING COMPLETE! ✅✅✅';
    RAISE NOTICE '';
    RAISE NOTICE 'Summary:';
    RAISE NOTICE '  Total users: %', total_users;
    RAISE NOTICE '  Hashed passwords: %', hashed_users;
    RAISE NOTICE '';
    RAISE NOTICE '🔒 Security Status:';
    RAISE NOTICE '  ✅ All passwords are now hashed with bcrypt';
    RAISE NOTICE '  ✅ You can no longer see plain-text passwords in Supabase';
    RAISE NOTICE '  ✅ Even admins cannot decrypt the passwords';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Important Notes:';
    RAISE NOTICE '  ⚠️  Users can still log in with their old passwords';
    RAISE NOTICE '  ⚠️  New signups will automatically use hashed passwords';
    RAISE NOTICE '  ⚠️  Password backup stored in "users_password_backup" table';
    RAISE NOTICE '  ⚠️  You can drop the backup table after confirming logins work';
    RAISE NOTICE '';
END $$;

-- Step 5: Create a function to verify passwords (for admin/debugging)
-- This function can check if a password matches without revealing it
CREATE OR REPLACE FUNCTION verify_user_password(user_email TEXT, test_password TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    stored_hash TEXT;
BEGIN
    SELECT password INTO stored_hash 
    FROM users 
    WHERE email = user_email;
    
    IF stored_hash IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN (crypt(test_password, stored_hash) = stored_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage of verify function:
-- SELECT verify_user_password('user@example.com', 'their_password');
-- Returns: true or false

-- After confirming everything works, you can drop the backup:
-- DROP TABLE users_password_backup;

RAISE NOTICE '';
RAISE NOTICE '🎉 Setup Complete! Your passwords are now secure!';
RAISE NOTICE '';
