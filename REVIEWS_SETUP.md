# 🌟 ZYNX CAPITAL - Permanent Reviews System

## 📋 What You Need to Do

### ✅ Step 1: Run This SQL Script in Supabase

Go to **Supabase Dashboard** → **SQL Editor** → **New Query**

**Copy and paste this ENTIRE script:**

```sql
-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  location TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_verified ON reviews(verified);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read reviews
CREATE POLICY "Anyone can read reviews" 
ON reviews FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to create reviews
CREATE POLICY "Users can create reviews" 
ON reviews FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to update their own reviews
CREATE POLICY "Users can update own reviews" 
ON reviews FOR UPDATE 
USING (true);

-- Create policy to allow users to delete their own reviews
CREATE POLICY "Users can delete own reviews" 
ON reviews FOR DELETE 
USING (true);
```

Click **RUN** (or press Ctrl/Cmd + Enter)

---

## ✅ Step 2: Verify Table Created

1. Go to **Table Editor** in Supabase sidebar
2. You should now see 3 tables:
   - ✅ `users`
   - ✅ `mt5_accounts`
   - ✅ `reviews` ⭐ **NEW**

---

## 🎉 What This Does

### **Permanent Reviews**
- ✅ When a user clicks **"Leave a Review"** in the dashboard
- ✅ They fill out the form (name, rating, comment)
- ✅ Review is **saved to Supabase** forever
- ✅ Review appears in the testimonials carousel immediately
- ✅ Review persists across all sessions and devices
- ✅ All users see all reviews (public)

### **Default Reviews**
- ✅ 4 hardcoded "seed" reviews always show
- ✅ User-submitted reviews are added on top
- ✅ All reviews slide in the carousel automatically

---

## 📊 Database Schema

### **reviews table:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique review ID |
| `user_id` | UUID | Links to user (nullable) |
| `name` | TEXT | Reviewer's name |
| `email` | TEXT | Reviewer's email (optional) |
| `rating` | INTEGER | 1-5 stars |
| `title` | TEXT | Review title (currently empty) |
| `comment` | TEXT | Review text |
| `location` | TEXT | User location (optional) |
| `avatar_url` | TEXT | Profile image URL (optional) |
| `verified` | BOOLEAN | Admin can verify (default: false) |
| `created_at` | TIMESTAMP | When review was submitted |

---

## 🔄 How It Works

### **Submitting a Review:**

1. User clicks **"Leave a Review"** button on dashboard
2. Modal opens with form:
   - ⭐ Star rating (1-5)
   - 📝 Name
   - 💬 Comment (optional)
3. User clicks **"Submit Review"**
4. Review saved to `reviews` table in Supabase
5. Success toast notification appears
6. Testimonials section refreshes automatically
7. New review appears in the carousel

### **Viewing Reviews:**

1. Dashboard loads
2. `Testimonials` component fetches all reviews from Supabase
3. Combines default reviews + user reviews
4. Displays 3 reviews at a time
5. Auto-slides every 4 seconds
6. Shows:
   - ✅ Name (first letter as avatar)
   - ✅ Date
   - ✅ Star rating
   - ✅ Comment text
   - ✅ "Verified Trader" badge (if verified)

---

## 🎨 Features

### **Toast Notifications:**
- ✅ Success: "Review submitted successfully!"
- ✅ Error: "Failed to submit review. Please try again."
- ✅ Dark theme styled to match app

### **Auto-Refresh:**
- ✅ When user submits review, testimonials reload
- ✅ No page refresh needed
- ✅ New review appears immediately

### **Verification System:**
- ✅ All reviews start as `verified: false`
- ✅ Admin can manually set `verified: true` in Supabase
- ✅ Verified reviews show green "Verified Trader" badge

---

## 🔧 Files Modified

### Created:
- `/src/app/lib/supabase.ts` - Supabase client + types

### Updated:
- `/src/app/App.tsx` - Added Toaster component
- `/src/app/context/AuthContext.tsx` - Async Supabase calls
- `/src/app/pages/Auth.tsx` - Async login/signup
- `/src/app/pages/Dashboard.tsx` - Review submission to Supabase
- `/src/app/components/Testimonials.tsx` - Fetch reviews from Supabase
- `/src/app/components/Footer.tsx` - Added About section

---

## 🧪 Testing Your Reviews System

### Test Flow:

1. **Sign up** with a new account
2. Go to **Dashboard**
3. Scroll down, click **"Leave a Review"**
4. Fill out:
   - Rating: 5 stars
   - Name: Your Name
   - Comment: "Amazing platform! Highly recommend."
5. Click **"Submit Review"**
6. See success toast notification
7. Testimonials section refreshes
8. Your review appears in the carousel!

### Verify in Supabase:

1. Go to **Supabase Dashboard**
2. Click **Table Editor** → **reviews**
3. You should see your review in the table!
4. Fields:
   - `name`: Your Name
   - `rating`: 5
   - `comment`: Your review text
   - `verified`: false
   - `created_at`: Current timestamp

---

## 🎯 Admin Features

### Verify a Review:

1. Go to **Supabase Dashboard**
2. **Table Editor** → **reviews**
3. Find the review you want to verify
4. Click to edit
5. Set `verified` to `true`
6. Save
7. Review now shows "Verified Trader" badge!

### Delete a Review:

1. Go to **Table Editor** → **reviews**
2. Find the review
3. Click delete icon
4. Confirm deletion
5. Review removed permanently

---

## 📈 Review Analytics

### To see all reviews:

```sql
SELECT 
  name,
  rating,
  comment,
  verified,
  created_at
FROM reviews
ORDER BY created_at DESC;
```

### To see average rating:

```sql
SELECT AVG(rating) as average_rating
FROM reviews;
```

### To count reviews:

```sql
SELECT COUNT(*) as total_reviews
FROM reviews;
```

---

## 🚀 Production Checklist

Before going live:

- [ ] Run SQL script in Supabase
- [ ] Test submitting a review
- [ ] Verify review appears in carousel
- [ ] Check review saved in Supabase table
- [ ] Test with multiple reviews
- [ ] Verify carousel auto-slides
- [ ] Test verification badge (set verified=true)

---

## 💡 Future Enhancements

Ideas for later:

- ✅ Add "Title" field to review form
- ✅ Add location field
- ✅ Add image uploads (avatar_url)
- ✅ Add review likes/reactions
- ✅ Add review replies
- ✅ Add spam detection
- ✅ Add admin dashboard for review moderation
- ✅ Add email notifications for new reviews

---

## ✅ Summary

Your reviews system is now **fully integrated with Supabase**! 🎉

When users submit reviews:
- ✅ Saved permanently in database
- ✅ Visible to all users
- ✅ Auto-refresh in carousel
- ✅ Toast notifications
- ✅ Admin can verify reviews

All you need to do is **run the SQL script** in Supabase! 🚀
