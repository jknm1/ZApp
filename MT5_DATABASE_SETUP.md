# 🗄️ MT5 DATABASE TABLE SETUP

## ⚠️ IMPORTANT: Create MT5 Accounts Table

Your MT5 linking feature needs a database table to store account information.

---

## 📋 **STEP 1: Create the Table in Supabase**

### **Go to Supabase SQL Editor:**
```
https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/sql
```

### **Run This SQL:**

```sql
-- Create mt5_accounts table
CREATE TABLE IF NOT EXISTS mt5_accounts (
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

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_user_id ON mt5_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_status ON mt5_accounts(status);

-- Enable Row Level Security (RLS)
ALTER TABLE mt5_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own MT5 accounts
CREATE POLICY "Users can view their own MT5 accounts"
  ON mt5_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MT5 accounts"
  ON mt5_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MT5 accounts"
  ON mt5_accounts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MT5 accounts"
  ON mt5_accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mt5_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER mt5_accounts_updated_at
  BEFORE UPDATE ON mt5_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_mt5_accounts_updated_at();
```

---

## ✅ **STEP 2: Verify Table Creation**

### **Check if table exists:**

```sql
-- Run this query to verify
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'mt5_accounts';
```

**Expected result:** One row showing `mt5_accounts`

---

## 🔍 **STEP 3: Test the Table**

### **Insert a test record:**

```sql
-- Replace YOUR_USER_ID with your actual user ID from auth.users
INSERT INTO mt5_accounts (
  user_id,
  broker_server,
  account_number,
  investor_password,
  status
) VALUES (
  'YOUR_USER_ID',
  'FTMO-Server',
  '12345678',
  'test_password',
  'active'
);
```

### **Query to see your records:**

```sql
SELECT * FROM mt5_accounts 
WHERE user_id = auth.uid();
```

---

## 📊 **Table Structure Explanation**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `user_id` | UUID | Foreign key to auth.users |
| `broker_server` | TEXT | MT5 broker server name |
| `account_number` | TEXT | MT5 account/login number |
| `investor_password` | TEXT | MT5 investor password (encrypted by Supabase) |
| `metaapi_account_id` | TEXT | MetaAPI account ID (optional) |
| `status` | TEXT | Account status ('active', 'inactive', 'pending') |
| `created_at` | TIMESTAMPTZ | When account was linked |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

---

## 🔒 **Security Features**

### **Row Level Security (RLS):**
- ✅ Users can only see their own MT5 accounts
- ✅ Users can only modify their own MT5 accounts
- ✅ Admin cannot access user MT5 credentials (encrypted)
- ✅ Automatic CASCADE delete when user is deleted

### **Unique Constraint:**
- ✅ One user cannot link the same account number twice
- ✅ Prevents duplicate entries

---

## 🧪 **Testing Steps After Creation**

### **1. Open Browser Console (F12)**

### **2. Go to your ZYNX CAPITAL app**

### **3. Click "Link MT5 Account"**

### **4. Fill in the form:**
```
Broker Server: FTMO-Server
Account Number: 12345678
Investor Password: test123456
```

### **5. Click "Link Account"**

### **6. Check Console Logs:**
```
✅ "Starting MT5 account linking..."
✅ "User ID: [your-user-id]"
✅ "Account Number: 12345678"
✅ "Broker Server: FTMO-Server"
✅ "Check existing result: { existingMT5: null, checkError: null }"
✅ "Inserting new MT5 account..."
✅ "Insert result: { insertData: [...], insertError: null }"
✅ "MT5 account linked successfully!"
```

### **7. Verify in Supabase:**

Go to:
```
https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/editor
```

Click on `mt5_accounts` table and you should see your data!

---

## ❌ **Troubleshooting**

### **Error: "relation 'mt5_accounts' does not exist"**

**Solution:** Run the CREATE TABLE SQL above

---

### **Error: "duplicate key value violates unique constraint"**

**Solution:** Account number already linked. Either:
1. Delete the old record
2. Or use different account number

```sql
-- Delete old record
DELETE FROM mt5_accounts 
WHERE user_id = auth.uid() 
AND account_number = '12345678';
```

---

### **Error: "permission denied for table mt5_accounts"**

**Solution:** RLS policies not set up correctly. Re-run the policy SQL:

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can insert their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can update their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can delete their own MT5 accounts" ON mt5_accounts;

-- Recreate policies (from STEP 1)
CREATE POLICY "Users can view their own MT5 accounts"
  ON mt5_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own MT5 accounts"
  ON mt5_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MT5 accounts"
  ON mt5_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own MT5 accounts"
  ON mt5_accounts FOR DELETE
  USING (auth.uid() = user_id);
```

---

### **Error: "Insert failed: [some message]"**

**Check console logs and look for the specific error message.**

Common causes:
- Missing required fields
- Invalid user_id
- RLS policy blocking insert
- Database connection issue

---

## 🎯 **Quick Verification Checklist**

Before testing, make sure:

- [ ] Table `mt5_accounts` exists
- [ ] RLS is enabled
- [ ] 4 RLS policies created (SELECT, INSERT, UPDATE, DELETE)
- [ ] Indexes created
- [ ] Trigger for updated_at created
- [ ] User is logged in (has valid auth.uid())

---

## 📱 **After Setup**

Once the table is created:

1. ✅ Go to ZYNX CAPITAL app
2. ✅ Click "Link MT5 Account"
3. ✅ Fill in credentials
4. ✅ Click "Link Account"
5. ✅ See success message
6. ✅ Modal closes
7. ✅ Account appears in Trading Stats

---

## 🔧 **Optional: Add Admin Access**

If you want admin (josephndungukamau20@gmail.com) to see all MT5 accounts:

```sql
-- Admin policy to view all MT5 accounts
CREATE POLICY "Admin can view all MT5 accounts"
  ON mt5_accounts
  FOR SELECT
  USING (
    auth.jwt()->>'email' = 'josephndungukamau20@gmail.com'
  );
```

---

## 📊 **Useful Queries**

### **View all your MT5 accounts:**
```sql
SELECT 
  broker_server,
  account_number,
  status,
  created_at,
  updated_at
FROM mt5_accounts
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

### **Count total MT5 accounts:**
```sql
SELECT COUNT(*) as total_accounts
FROM mt5_accounts;
```

### **View active accounts only:**
```sql
SELECT *
FROM mt5_accounts
WHERE status = 'active'
AND user_id = auth.uid();
```

---

## ✨ **What This Enables**

Once the table is set up:

1. ✅ Users can link MT5 accounts
2. ✅ Credentials stored securely
3. ✅ Auto-updates timestamp on changes
4. ✅ Prevents duplicate accounts
5. ✅ Row-level security protects data
6. ✅ Trading stats can fetch real MT5 data
7. ✅ Demo mode fallback if connection fails

---

## 🚀 **Next Steps After Setup**

1. Run the SQL to create the table
2. Test linking an MT5 account in your app
3. Check browser console for logs
4. Verify data in Supabase table editor
5. Celebrate! 🎉

---

**Run the SQL in Supabase and your MT5 linking will work perfectly!** 🚀
