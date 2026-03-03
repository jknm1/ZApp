-- =====================================================
-- TEST NOTIFICATION CREATION
-- =====================================================
-- This SQL script creates a test notification for your account
-- Replace 'josephndungukamau20@gmail.com' with your actual email if different

-- Get your user_id and create a test notification
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get user_id from email
  SELECT id INTO v_user_id 
  FROM auth.users 
  WHERE email = 'josephndungukamau20@gmail.com';
  
  -- Check if user exists
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User not found with email: josephndungukamau20@gmail.com';
  ELSE
    -- Create test notification
    INSERT INTO public.notifications (user_id, type, title, message, read)
    VALUES (
      v_user_id,
      'success',
      '🎉 Test Notification',
      'This is a test notification to verify your notification system is working properly!',
      false
    );
    
    RAISE NOTICE 'Test notification created successfully for user: %', v_user_id;
  END IF;
END $$;

-- Verify notification was created
SELECT 
  n.id,
  n.type,
  n.title,
  n.message,
  n.read,
  n.created_at,
  u.email as user_email
FROM public.notifications n
JOIN auth.users u ON n.user_id = u.id
WHERE u.email = 'josephndungukamau20@gmail.com'
ORDER BY n.created_at DESC
LIMIT 5;
