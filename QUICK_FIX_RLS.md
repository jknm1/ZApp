# ⚡ QUICK FIX - Run This Now!

## 🚨 Error: Row-Level Security Policy Violation on mt5_accounts

---

## 🔧 **COPY THIS SQL AND RUN IT IN SUPABASE:**

Go to: **https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/sql**

Then paste and execute this:

```sql
-- Fix MT5 Accounts RLS Policies
ALTER TABLE mt5_accounts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Users can view their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can insert their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can update their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can delete their own MT5 accounts" ON mt5_accounts;

-- Create the INSERT policy (THIS IS THE MISSING ONE)
CREATE POLICY "Users can insert their own MT5 accounts"
  ON mt5_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create SELECT policy
CREATE POLICY "Users can view their own MT5 accounts"
  ON mt5_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create UPDATE policy
CREATE POLICY "Users can update their own MT5 accounts"
  ON mt5_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create DELETE policy
CREATE POLICY "Users can delete their own MT5 accounts"
  ON mt5_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## ✅ **Test It:**

1. Go to your app
2. Sign up or log in
3. Try creating a demo MT5 account
4. Try linking a broker account

**Both should work now!** ✨

---

## 📊 **Verify the Fix:**

Run this in Supabase SQL Editor to check policies:

```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'mt5_accounts';
```

You should see:
- ✅ Users can insert their own MT5 accounts (INSERT)
- ✅ Users can view their own MT5 accounts (SELECT)
- ✅ Users can update their own MT5 accounts (UPDATE)
- ✅ Users can delete their own MT5 accounts (DELETE)

---

## 🎯 **What This Does:**

The **INSERT policy** allows authenticated users to create MT5 accounts for themselves (`auth.uid() = user_id`). Without this policy, Supabase blocks all inserts, causing the error you saw.

---

## 💡 **Quick Explanation:**

- **RLS (Row-Level Security)** = Database-level security that controls who can read/write data
- **Policy** = Rules that define what operations users can perform
- **`auth.uid()`** = Currently logged-in user's ID
- **`WITH CHECK (auth.uid() = user_id)`** = Only allow creating records where the user_id matches the logged-in user

This ensures users can ONLY create MT5 accounts for themselves, never for other users! 🔒

---

## 🆘 **Still Getting the Error?**

If it still doesn't work:

1. **Make sure you're logged in** - RLS only works for authenticated users
2. **Check your user ID:**
```sql
SELECT auth.uid();
```
If it returns NULL, you're not logged in.

3. **Refresh your browser** and try again

4. **Check the AuthContext** is properly passing the user_id when creating accounts
