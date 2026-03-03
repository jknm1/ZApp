# 🔧 FIX MT5 ACCOUNTS RLS POLICY ERROR

## ⚠️ ERROR: Row-Level Security Policy Violation

```
Error: new row violates row-level security policy for table "mt5_accounts"
```

This means the `mt5_accounts` table has RLS enabled but is missing the INSERT policy.

---

## 🚀 **SOLUTION: Add Missing RLS Policies**

### **Go to Supabase SQL Editor:**
```
https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/sql
```

### **Option 1: Add Missing Policies (If Table Exists)**

Run this SQL to add the missing policies:

```sql
-- Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can insert their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can update their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can delete their own MT5 accounts" ON mt5_accounts;

-- Enable RLS if not already enabled
ALTER TABLE mt5_accounts ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own MT5 accounts"
  ON mt5_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MT5 accounts"
  ON mt5_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MT5 accounts"
  ON mt5_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MT5 accounts"
  ON mt5_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

### **Option 2: Recreate Table (If Policies Don't Work)**

If the above doesn't work, drop and recreate the table:

```sql
-- Drop the existing table
DROP TABLE IF EXISTS mt5_accounts CASCADE;

-- Recreate mt5_accounts table with all columns
CREATE TABLE mt5_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  broker_server TEXT NOT NULL,
  account_number TEXT NOT NULL,
  investor_password TEXT NOT NULL,
  metaapi_account_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, account_number)
);

-- Create indexes for faster queries
CREATE INDEX idx_mt5_accounts_user_id ON mt5_accounts(user_id);
CREATE INDEX idx_mt5_accounts_status ON mt5_accounts(status);

-- Enable Row Level Security (RLS)
ALTER TABLE mt5_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own MT5 accounts
CREATE POLICY "Users can view their own MT5 accounts"
  ON mt5_accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MT5 accounts"
  ON mt5_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MT5 accounts"
  ON mt5_accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MT5 accounts"
  ON mt5_accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## ✅ **Verify the Fix**

After running the SQL:

1. **Check RLS is enabled:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'mt5_accounts';
```
Should return: `rowsecurity = true`

2. **Check policies exist:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'mt5_accounts';
```
Should show 4 policies (SELECT, INSERT, UPDATE, DELETE)

3. **Test the application:**
   - Try creating a demo MT5 account
   - Try linking a broker account
   - Both should work without errors!

---

## 📝 **What These Policies Do**

- **SELECT Policy**: Users can only view their own MT5 accounts
- **INSERT Policy**: Users can only create MT5 accounts for themselves
- **UPDATE Policy**: Users can only update their own MT5 accounts
- **DELETE Policy**: Users can only delete their own MT5 accounts

This ensures complete data isolation - users can never see or modify other users' MT5 credentials!

---

## 🆘 **Still Having Issues?**

If you still get the error:

1. Make sure you're logged in when testing
2. Check that `auth.uid()` returns a valid user ID:
```sql
SELECT auth.uid();
```

3. Verify the user exists in `auth.users`:
```sql
SELECT id, email FROM auth.users LIMIT 5;
```

4. Test inserting manually (replace with your user ID):
```sql
INSERT INTO mt5_accounts (user_id, broker_server, account_number, investor_password)
VALUES (
  'your-user-id-here',
  'ICMarkets-Demo01',
  '12345678',
  'test123456'
);
```

---

## 🎉 **Success!**

Once the policies are in place, your MT5 account creation will work perfectly! ✅
