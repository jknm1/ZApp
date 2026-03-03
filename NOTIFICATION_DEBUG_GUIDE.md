# 🔧 NOTIFICATION SYSTEM - DEBUGGING GUIDE

## Current Status
You have a notification system with:
- ✅ Real-time updates (subscriptions)
- ✅ Welcome notifications on signup
- ✅ Admin broadcast notifications
- ✅ Notification history (read/unread)
- ✅ Mark as read functionality
- ✅ Delete notifications

---

## 🔍 Step-by-Step Troubleshooting

### **Step 1: Verify Database Table Exists**

Go to **Supabase Dashboard** → **Table Editor**

✅ Check if `notifications` table exists
✅ Check if it has these columns:
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key)
   - `type` (Text)
   - `title` (Text)
   - `message` (Text)
   - `read` (Boolean)
   - `created_at` (Timestamp)

If the table doesn't exist, run the SQL from your previous message.

---

### **Step 2: Create a Test Notification**

**Option A: Using SQL Editor**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open the file `/TEST_NOTIFICATION.sql` I just created
3. Copy the SQL and paste it into Supabase SQL Editor
4. Make sure to replace `josephndungukamau20@gmail.com` with your actual email
5. Click **Run**
6. You should see: "Test notification created successfully"

**Option B: Using Table Editor**

1. Go to **Supabase Dashboard** → **Table Editor** → `notifications`
2. Click **Insert** → **Insert row**
3. Fill in:
   - `user_id`: Your user UUID (get it from `auth.users` table)
   - `type`: "success"
   - `title`: "Test Notification"
   - `message`: "This is a test!"
   - `read`: false
4. Click **Save**

---

### **Step 3: Check Your User ID**

Run this SQL to find your user ID:

```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'josephndungukamau20@gmail.com';
```

Copy your `id` (UUID) - you'll need this for testing.

---

### **Step 4: Verify RLS Policies**

Go to **Supabase Dashboard** → **Authentication** → **Policies** → `notifications` table

You should see these policies:
- ✅ **Users can view own notifications** (SELECT)
- ✅ **Users can update own notifications** (UPDATE)
- ✅ **Users can delete own notifications** (DELETE)
- ✅ **Allow insert notifications** (INSERT)

If any are missing, run the SQL schema again.

---

### **Step 5: Check Browser Console**

1. Open your app at www.zynx.world
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for any errors related to:
   - "notifications"
   - "Supabase"
   - "RLS" or "policy"
   
Common errors:
- `PGRST116` = RLS policy blocking access
- `PGRST204` = Table doesn't exist
- `42501` = Insufficient privileges

---

### **Step 6: Test Real-Time Subscription**

With your app open and logged in:

1. Keep browser console open (F12)
2. Go to **Supabase Dashboard** → **Table Editor** → `notifications`
3. Manually insert a notification (see Step 2, Option B)
4. Watch the console - you should see:
   ```
   Notification change detected: {payload...}
   ```
5. The bell icon should update immediately with the new notification

---

### **Step 7: Test Welcome Notification**

1. Log out of your account
2. Open an **incognito/private window**
3. Go to www.zynx.world
4. Sign up with a NEW email (not your admin email)
5. After signup, click the bell icon
6. You should see a welcome notification

If not working, check:
- Browser console for errors
- Supabase **Table Editor** → `notifications` table for the new entry
- Make sure the `user_id` matches the new user's ID

---

### **Step 8: Test Admin Broadcast**

1. Log in as admin (josephndungukamau20@gmail.com)
2. Go to **Admin Dashboard** → **Notifications** tab
3. Fill in:
   - **Title**: "Test Broadcast"
   - **Message**: "This is a test broadcast notification"
   - **Type**: Success
4. Click **Send Notification**
5. Check:
   - Should say "Notification sent to X users!"
   - Go to **Supabase** → **Table Editor** → `notifications`
   - You should see X new rows (one for each user)

---

## 🐛 Common Issues & Fixes

### **Issue 1: No Notifications Showing**

**Symptoms**: Bell icon shows 0, no notifications in dropdown

**Fixes**:
1. Check if table exists (Step 1)
2. Create test notification manually (Step 2)
3. Verify your user_id is correct (Step 3)
4. Check RLS policies (Step 4)

---

### **Issue 2: "Row Level Security" Error**

**Symptoms**: Console shows "new row violates row-level security policy"

**Fix**: Run this SQL:

```sql
-- Temporarily disable RLS for testing
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Re-enable after confirming it works
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
```

If this fixes it, your RLS policies are wrong. Re-run the policy creation SQL.

---

### **Issue 3: Real-Time Not Working**

**Symptoms**: Notifications don't appear until page refresh

**Fix**:

1. Check if Realtime is enabled:
   - **Supabase Dashboard** → **Database** → **Replication**
   - Find `notifications` table
   - Toggle **Realtime** to ON

2. Verify subscription in browser console:
   ```
   Notification change detected: ...
   ```

---

### **Issue 4: Welcome Notification Not Created**

**Symptoms**: New users don't get welcome notification

**Check**:

1. Browser console during signup - look for errors
2. Check `notifications` table after signup
3. Verify foreign key constraint isn't blocking:

```sql
-- Check if constraint is causing issues
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'notifications' 
AND constraint_type = 'FOREIGN KEY';
```

---

## 📊 Quick Database Check

Run this to see all your notifications:

```sql
SELECT 
  n.id,
  u.email,
  n.type,
  n.title,
  n.message,
  n.read,
  n.created_at
FROM public.notifications n
LEFT JOIN auth.users u ON n.user_id = u.id
ORDER BY n.created_at DESC
LIMIT 20;
```

---

## 🎯 Expected Behavior

### When Everything Works:

1. **New Signup**:
   - User creates account
   - Welcome notification appears in bell icon
   - Badge shows "1" unread

2. **Admin Broadcast**:
   - Admin sends notification
   - All users get it instantly (or on next page load)
   - Bell badge updates for everyone

3. **Mark as Read**:
   - Click checkmark on notification
   - Badge count decreases
   - Notification stays visible but dimmed

4. **Delete**:
   - Click X on notification
   - Notification disappears
   - Removed from database

---

## 🔄 Fresh Start (If All Else Fails)

If nothing works, start completely fresh:

```sql
-- 1. Drop everything
DROP TABLE IF EXISTS public.notifications CASCADE;

-- 2. Recreate table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('success', 'info', 'warning', 'update')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 3. Create indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- 4. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 5. Create policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON public.notifications
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- 6. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- 7. Create test notification (replace with your user_id)
INSERT INTO public.notifications (user_id, type, title, message, read)
VALUES (
  'YOUR_USER_ID_HERE',
  'success',
  'System Working!',
  'If you see this, your notification system is working correctly!',
  false
);
```

---

## ✅ Next Steps

After fixing the issue:

1. **Test all 4 scenarios**:
   - ✅ Manual notification creation
   - ✅ Welcome notification on signup
   - ✅ Admin broadcast
   - ✅ Real-time updates

2. **Monitor for 24 hours**:
   - Check if notifications persist
   - Verify real-time works consistently
   - Test on mobile devices

3. **Production ready when**:
   - New users get welcome notification
   - Admin can broadcast to all users
   - Notifications update in real-time
   - No errors in browser console

---

## 💬 Need Help?

If you're still stuck, check:
1. Browser console (F12) for exact error messages
2. Supabase Logs (Dashboard → Logs → Database)
3. Network tab (F12 → Network) for failed API calls

Copy any error messages and we can debug further!
