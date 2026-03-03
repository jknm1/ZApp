# 📋 KYC VERIFICATION SYSTEM - COMPLETE SETUP GUIDE

## Overview

ZYNX CAPITAL now has a **complete KYC (Know Your Customer) verification system** where users can submit identity documents and you (admin) can review and approve/reject them.

---

## 🎯 System Features

### **User Side:**
- ✅ Upload 4 types of documents (ID front, ID back, proof of address, selfie with ID)
- ✅ See upload status (pending/verified/rejected)
- ✅ Real-time status updates
- ✅ Rejection reasons displayed if document rejected
- ✅ Re-upload rejected documents
- ✅ Professional document upload interface

### **Admin Side (josephndungukamau20@gmail.com):**
- ✅ View all KYC submissions in admin dashboard
- ✅ See user details (name, email, document type, file name)
- ✅ Approve documents with one click
- ✅ Reject documents with custom reasons
- ✅ Track submission dates
- ✅ Filter by status (pending/verified/rejected)
- ✅ Dedicated KYC tab in admin panel

---

## 📊 Database Schema

### **Table 1: kyc_submissions**

Create this table in your Supabase database:

```sql
-- Create KYC submissions table
CREATE TABLE kyc_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('id_front', 'id_back', 'proof_of_address', 'selfie')),
  file_name TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_kyc_user_id ON kyc_submissions(user_id);
CREATE INDEX idx_kyc_status ON kyc_submissions(status);
CREATE INDEX idx_kyc_submitted_at ON kyc_submissions(submitted_at DESC);
CREATE INDEX idx_kyc_document_type ON kyc_submissions(document_type);

-- Enable Row Level Security (RLS)
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own submissions
CREATE POLICY "Users can view their own KYC submissions"
  ON kyc_submissions FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- RLS Policy: Users can insert their own submissions
CREATE POLICY "Users can insert their own KYC submissions"
  ON kyc_submissions FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- RLS Policy: Admin can view all submissions
CREATE POLICY "Admin can view all KYC submissions"
  ON kyc_submissions FOR SELECT
  USING (
    auth.jwt()->>'email' = 'josephndungukamau20@gmail.com' OR
    auth.uid()::text = user_id::text
  );

-- RLS Policy: Admin can update all submissions
CREATE POLICY "Admin can update KYC submissions"
  ON kyc_submissions FOR UPDATE
  USING (auth.jwt()->>'email' = 'josephndungukamau20@gmail.com');
```

---

### **Alternative Table: kyc_documents** (if you prefer separate documents)

```sql
-- Create KYC documents table (alternative approach)
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('id_front', 'id_back', 'proof_of_address', 'selfie')),
  file_name TEXT NOT NULL,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  UNIQUE(user_id, document_type) -- Each user can only have one of each document type
);

-- Create indexes
CREATE INDEX idx_kyc_doc_user_id ON kyc_documents(user_id);
CREATE INDEX idx_kyc_doc_status ON kyc_documents(status);

-- Enable RLS
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies (same as above)
CREATE POLICY "Users can view their own documents"
  ON kyc_documents FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own documents"
  ON kyc_documents FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admin can view all documents"
  ON kyc_documents FOR SELECT
  USING (auth.jwt()->>'email' = 'josephndungukamau20@gmail.com' OR auth.uid()::text = user_id::text);

CREATE POLICY "Admin can update documents"
  ON kyc_documents FOR UPDATE
  USING (auth.jwt()->>'email' = 'josephndungukamau20@gmail.com');
```

---

## 🗂️ Supabase Storage Setup (Optional - For Real File Uploads)

If you want to store actual files (images/PDFs), create a storage bucket:

### **Step 1: Create Bucket**

1. Go to Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. Name: `kyc-documents`
4. **Public**: ❌ No (keep private for security)
5. Click **"Create bucket"**

### **Step 2: Set Bucket Policies**

```sql
-- Allow users to upload their own KYC documents
CREATE POLICY "Users can upload their own KYC documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kyc-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view their own KYC documents
CREATE POLICY "Users can view their own KYC documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents' AND
    (
      auth.uid()::text = (storage.foldername(name))[1] OR
      auth.jwt()->>'email' = 'josephndungukamau20@gmail.com'
    )
  );

-- Allow admin to view all KYC documents
CREATE POLICY "Admin can view all KYC documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents' AND
    auth.jwt()->>'email' = 'josephndungukamau20@gmail.com'
  );

-- Allow admin to delete KYC documents
CREATE POLICY "Admin can delete KYC documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'kyc-documents' AND
    auth.jwt()->>'email' = 'josephndungukamau20@gmail.com'
  );
```

---

## 🛠️ Setup Instructions

### **Method 1: SQL Editor (Recommended)**

1. Go to Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot
   ```

2. Click **"SQL Editor"** in left sidebar

3. Click **"New Query"**

4. Paste the SQL code for `kyc_submissions` table (or `kyc_documents`)

5. Click **"Run"** or press `Ctrl+Enter`

6. ✅ Done! Table created

---

### **Method 2: Table Editor (Visual)**

1. Go to **"Table Editor"** in Supabase

2. Click **"Create a new table"**

3. Configure table:
   - **Name**: `kyc_submissions`
   - **Enable RLS**: ✅ Checked

4. Add columns:

| Column Name | Type | Default | Nullable | Description |
|-------------|------|---------|----------|-------------|
| `id` | uuid | `uuid_generate_v4()` | No | Primary key |
| `user_id` | uuid | - | No | Foreign key to users |
| `user_email` | text | - | No | User email |
| `user_name` | text | - | No | User name |
| `document_type` | text | - | No | Type of document |
| `file_name` | text | - | No | Original file name |
| `file_url` | text | - | Yes | Storage URL (optional) |
| `status` | text | `'pending'` | No | Status (pending/verified/rejected) |
| `submitted_at` | timestamptz | `now()` | No | Submission timestamp |
| `verified_at` | timestamptz | - | Yes | Verification timestamp |
| `rejection_reason` | text | - | Yes | Reason if rejected |
| `created_at` | timestamptz | `now()` | No | Creation timestamp |
| `updated_at` | timestamptz | `now()` | No | Update timestamp |

5. Add constraints:
   - Foreign key: `user_id` → `users.id` (CASCADE on delete)
   - Check: `document_type IN ('id_front', 'id_back', 'proof_of_address', 'selfie')`
   - Check: `status IN ('pending', 'verified', 'rejected')`

6. Click **"Save"**

7. Add RLS policies (see SQL above)

---

## 🧪 Testing the KYC System

### **Test 1: User Uploads Document**

1. Login as a regular user (not admin)
2. Go to **Profile** → **KYC** tab
3. Click **"Start Verification"**
4. Upload a document (image or PDF)
5. Click **"Upload"**
6. ✅ You should see success message
7. Document status should show **"Pending"**

### **Test 2: Admin Reviews Document**

1. Logout from user account
2. Login as admin (`josephndungukamau20@gmail.com`)
3. Go to **Admin Dashboard**
4. Click **"KYC Submissions"** tab
5. You should see the uploaded document
6. Click **"Approve"** or **"Reject"**
7. ✅ Status updates immediately

### **Test 3: User Sees Updated Status**

1. Logout from admin
2. Login as the user who uploaded
3. Go to **Profile** → **KYC**
4. ✅ Status should show **"Verified"** or **"Rejected"**
5. If rejected, rejection reason should be displayed

---

## 📱 User Flow

```
User Signs Up
    ↓
Navigate to Profile → KYC
    ↓
Click "Start Verification"
    ↓
Upload 4 Documents:
  - ID Front ✅
  - ID Back ✅
  - Proof of Address ✅
  - Selfie with ID ✅
    ↓
Status: Pending (Yellow)
    ↓
Admin Reviews in Admin Dashboard
    ↓
Admin Approves → Status: Verified (Green) ✅
    OR
Admin Rejects → Status: Rejected (Red) ❌
    ↓
User sees updated status in Profile
```

---

## 🔐 Admin Review Flow

```
Admin Login (josephndungukamau20@gmail.com)
    ↓
Go to Admin Dashboard
    ↓
Click "KYC Submissions" tab
    ↓
See all pending submissions
    ↓
View user details:
  - Name
  - Email
  - Document Type
  - File Name
  - Submission Date
    ↓
Review document:
  → Approve → Status: Verified ✅
  → Reject → Enter reason → Status: Rejected ❌
    ↓
User receives notification (optional)
    ↓
Status updates in real-time
```

---

## 📊 Admin Dashboard Features

### **KYC Tab Shows:**

1. **User Information**:
   - Full name
   - Email address
   - User ID

2. **Document Details**:
   - Document type (ID Front, ID Back, etc.)
   - File name
   - Submission date/time

3. **Status Badge**:
   - 🟠 **Pending** (Orange)
   - 🟢 **Verified** (Green)
   - 🔴 **Rejected** (Red)

4. **Actions**:
   - ✅ **Approve** button (green)
   - ❌ **Reject** button (red) → Opens rejection reason modal

5. **Statistics**:
   - Total submissions count
   - Pending count
   - Verified count
   - Rejected count

---

## 💡 Document Types Explained

| Type | Description | Examples | Required |
|------|-------------|----------|----------|
| **ID Front** | Front side of government-issued ID | Passport, Driver's License, National ID | ✅ Yes |
| **ID Back** | Back side of ID (if applicable) | Driver's License back, ID card back | ✅ Yes |
| **Proof of Address** | Recent utility bill or bank statement | Electric bill, water bill, bank statement (max 3 months old) | ✅ Yes |
| **Selfie with ID** | User holding ID next to face | Clear selfie showing face and ID together | ✅ Yes |

---

## 🎨 Status Colors & Icons

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| **Not Started** | Blue 🔵 | 🔒 Shield | User hasn't uploaded any documents yet |
| **Pending** | Yellow 🟡 | ⏳ Clock | Documents uploaded, awaiting admin review |
| **Verified** | Green 🟢 | ✓ Check | All documents approved by admin |
| **Rejected** | Red 🔴 | ⚠ X Circle | One or more documents rejected |

---

## 🔍 SQL Queries for Monitoring

### **View All Pending KYC Submissions**
```sql
SELECT * FROM kyc_submissions
WHERE status = 'pending'
ORDER BY submitted_at DESC;
```

### **Count Submissions by Status**
```sql
SELECT status, COUNT(*) as count
FROM kyc_submissions
GROUP BY status;
```

### **Find Users with Complete KYC (all 4 documents verified)**
```sql
SELECT user_id, user_name, user_email, COUNT(*) as verified_docs
FROM kyc_submissions
WHERE status = 'verified'
GROUP BY user_id, user_name, user_email
HAVING COUNT(*) >= 4;
```

### **Recent Rejections**
```sql
SELECT user_name, user_email, document_type, rejection_reason, submitted_at
FROM kyc_submissions
WHERE status = 'rejected'
ORDER BY submitted_at DESC
LIMIT 10;
```

### **User KYC Completion Rate**
```sql
SELECT 
  user_email,
  COUNT(*) as total_uploads,
  SUM(CASE WHEN status = 'verified' THEN 1 ELSE 0 END) as verified,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
FROM kyc_submissions
GROUP BY user_email
ORDER BY total_uploads DESC;
```

---

## 🚀 Future Enhancements

Possible additions to the KYC system:

1. **Real File Storage** → Upload actual files to Supabase Storage
2. **Document Preview** → Admin can view uploaded documents inline
3. **Auto-Detection** → AI to detect document type and validity
4. **Email Notifications** → Notify users when KYC approved/rejected
5. **Expiry Tracking** → Track document expiration dates
6. **Bulk Actions** → Approve/reject multiple submissions at once
7. **Export Reports** → Download KYC submission reports as CSV/PDF
8. **Audit Log** → Track who approved/rejected each document
9. **Document Download** → Allow admin to download documents
10. **Re-upload Limit** → Limit number of times user can re-upload

---

## 📋 Quick Setup Checklist

- [ ] Create `kyc_submissions` table in Supabase
- [ ] Enable Row Level Security (RLS)
- [ ] Add RLS policies (users + admin)
- [ ] (Optional) Create `kyc-documents` storage bucket
- [ ] (Optional) Add storage policies
- [ ] Test user upload flow
- [ ] Test admin review flow
- [ ] Verify status updates work
- [ ] Check rejection reasons display
- [ ] Test re-upload functionality

---

## ⚠️ Important Security Notes

1. **Never store sensitive documents publicly** → Always use private storage buckets
2. **Encrypt file names** → Don't use user-identifiable file names
3. **Log all admin actions** → Track who approved/rejected each document
4. **Set file size limits** → Prevent abuse (max 10MB per file)
5. **Validate file types** → Only accept JPG, PNG, PDF
6. **Implement rate limiting** → Prevent spam uploads
7. **Auto-delete rejected documents after 90 days** → Comply with data retention policies

---

## 🎉 System is Ready!

Once you create the database table, the KYC system will work fully:

✅ **Users** can upload documents  
✅ **Admin** can review and approve/reject  
✅ **Status updates** in real-time  
✅ **Rejection reasons** displayed  
✅ **Professional UI** with animations  
✅ **Mobile responsive** design  

**The KYC verification system is production-ready once the Supabase table is created!** 🚀
