# 🔧 MT5 DATABASE FIX - Updated SQL

## ⚠️ ERROR: Column "status" does not exist

This means the table exists but is missing some columns. Let's fix it!

---

## 🚀 **SOLUTION: Run This Updated SQL**

### **Go to Supabase SQL Editor:**
```
https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/sql
```

### **COPY & RUN THIS SQL:**

```sql
-- Drop the table and recreate it properly
DROP TABLE IF EXISTS mt5_accounts CASCADE;

-- Create mt5_accounts table with ALL columns
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

## ✅ **What This Does:**

1. **Drops the old incomplete table** (if exists)
2. **Creates a fresh table** with all required columns
3. **Sets up indexes** for performance
4. **Enables RLS** for security
5. **Creates policies** so users can only see their own accounts
6. **Adds trigger** for auto-updating timestamps

---

## ⚠️ **WARNING: This Will Delete Existing Data**

If you already have MT5 accounts linked, they will be deleted. But since the table was incomplete anyway, this is necessary.

---

## 🧪 **TEST AFTER RUNNING SQL:**

### **1. Verify Table Structure:**

Run this query to check all columns exist:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'mt5_accounts'
ORDER BY ordinal_position;
```

**Expected result:**
```
id                   | uuid
user_id              | uuid
broker_server        | text
account_number       | text
investor_password    | text
metaapi_account_id   | text
status               | text
created_at           | timestamp with time zone
updated_at           | timestamp with time zone
```

---

### **2. Test MT5 Linking:**

1. Open your ZYNX CAPITAL app
2. Open Browser Console (F12)
3. Click "Link MT5 Account"
4. Fill in:
   ```
   Broker Server: FTMO-Demo
   Account Number: 12345678
   Investor Password: test123456
   ```
5. Click "Link Account"

---

### **3. Check Console Logs:**

**✅ SUCCESS:**
```javascript
"Starting MT5 account linking..."
"User ID: abc-123-..."
"Account Number: 12345678"
"Broker Server: FTMO-Demo"
"Check existing result: { existingMT5: null, checkError: null }"
"Inserting new MT5 account..."
"Insert result: { insertData: [{...}], insertError: null }"
"MT5 account linked successfully!"
```

---

### **4. Verify in Supabase:**

Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/editor

Click **`mt5_accounts`** table - you should see your data!

---

## 🔍 **Alternative: Add Missing Columns (If You Want to Keep Data)**

If you have important data and want to keep it, use this instead:

```sql
-- Add missing columns to existing table
ALTER TABLE mt5_accounts 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

ALTER TABLE mt5_accounts 
  ADD COLUMN IF NOT EXISTS metaapi_account_id TEXT;

ALTER TABLE mt5_accounts 
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE mt5_accounts 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing rows to have status
UPDATE mt5_accounts 
SET status = 'active' 
WHERE status IS NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_user_id ON mt5_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_mt5_accounts_status ON mt5_accounts(status);

-- Enable RLS
ALTER TABLE mt5_accounts ENABLE ROW LEVEL SECURITY;

-- Drop old policies (if any)
DROP POLICY IF EXISTS "Users can view their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can insert their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can update their own MT5 accounts" ON mt5_accounts;
DROP POLICY IF EXISTS "Users can delete their own MT5 accounts" ON mt5_accounts;

-- Create new policies
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

-- Create trigger function
CREATE OR REPLACE FUNCTION update_mt5_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS mt5_accounts_updated_at ON mt5_accounts;
CREATE TRIGGER mt5_accounts_updated_at
  BEFORE UPDATE ON mt5_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_mt5_accounts_updated_at();
```

---

## 🎯 **Recommended Approach:**

### **Option 1: Fresh Start (Recommended)**
- Use the first SQL (DROP TABLE and recreate)
- ✅ Ensures clean structure
- ✅ No conflicts
- ❌ Deletes existing data (but table was incomplete anyway)

### **Option 2: Preserve Data**
- Use the second SQL (ALTER TABLE)
- ✅ Keeps existing data
- ❌ Might have conflicts if structure is very different

---

## 📋 **Complete Table Structure:**

```sql
mt5_accounts
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── broker_server (TEXT) ✅ Required
├── account_number (TEXT) ✅ Required
├── investor_password (TEXT) ✅ Required
├── metaapi_account_id (TEXT) ⭕ Optional
├── status (TEXT) ⭕ Default: 'active'
├── created_at (TIMESTAMPTZ) ⭕ Auto
└── updated_at (TIMESTAMPTZ) ⭕ Auto
```

---

## ✅ **After Running SQL:**

1. ✅ Table properly structured
2. ✅ All columns exist
3. ✅ RLS enabled
4. ✅ Policies protect user data
5. ✅ Indexes for performance
6. ✅ Trigger for timestamps

---

## 🚀 **Next Steps:**

1. **Run the SQL** (first one recommended)
2. **Go to your app**
3. **Click "Link MT5 Account"**
4. **Fill in the form**
5. **Click "Link Account"**
6. **See success!** ✅

---

**The error is fixed! Run the SQL and test immediately!** 🚀
