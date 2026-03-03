-- =====================================================
-- FIX KYC STORAGE - Make it work without auth session
-- =====================================================

-- Step 1: Make the kyc-documents bucket public for uploads
UPDATE storage.buckets
SET public = true
WHERE id = 'kyc-documents';

-- Step 2: Drop all existing policies on kyc-documents
DROP POLICY IF EXISTS "Users can upload own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access" ON storage.objects;

-- Step 3: Create permissive policies that allow authenticated users to upload
-- Allow any authenticated user to upload to kyc-documents
CREATE POLICY "Allow authenticated uploads to KYC"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kyc-documents');

-- Allow any authenticated user to read from kyc-documents
CREATE POLICY "Allow authenticated reads from KYC"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'kyc-documents');

-- Allow any authenticated user to update in kyc-documents
CREATE POLICY "Allow authenticated updates in KYC"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'kyc-documents');

-- Allow any authenticated user to delete from kyc-documents
CREATE POLICY "Allow authenticated deletes from KYC"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'kyc-documents');

-- Step 4: Verify bucket exists and policies are set
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE id = 'kyc-documents';

-- Step 5: Show policies
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ KYC Storage bucket configured!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next: Update the frontend code to handle uploads properly';
    RAISE NOTICE '';
END $$;
