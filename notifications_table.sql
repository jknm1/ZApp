-- ========================================
-- 🔔 NOTIFICATIONS TABLE - QUICK SETUP
-- ========================================
-- Run this in Supabase SQL Editor
-- Project: muhztdszuirjqyujsaot
-- ========================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('success', 'info', 'warning', 'update')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their notifications
CREATE POLICY "Users can view own notifications" 
  ON public.notifications FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to update their notifications
CREATE POLICY "Users can update own notifications" 
  ON public.notifications FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their notifications
CREATE POLICY "Users can delete own notifications" 
  ON public.notifications FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow inserting notifications
CREATE POLICY "Authenticated users can insert notifications" 
  ON public.notifications FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- ✅ DONE! Your notifications table is ready
-- ========================================

-- Optional: Insert a test notification
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
-- INSERT INTO public.notifications (user_id, type, title, message)
-- VALUES ('YOUR_USER_ID', 'success', 'Welcome!', 'Your account is ready.');
