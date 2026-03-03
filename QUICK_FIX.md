# ⚡ QUICK FIX - Password Reset Not Working

## 🎯 THE PROBLEM:
Can't send password reset emails from ZYNX CAPITAL app.

## 🔧 THE FIX (5 Minutes):

---

### ✅ **STEP 1: Fix Your Supabase Key** (MOST IMPORTANT!)

**Your current key is WRONG:**
```
sb_publishable_eE-67PETmOR4yS8B1OLxdA_l0NSaJ_Y  ❌
```

**Get the real key:**

1. Click: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/api

2. Copy the **"anon public"** key (it starts with `eyJ...`)

3. Edit `/src/app/lib/supabase.ts` line 4:
   ```typescript
   const supabaseAnonKey = 'eyJ...'; // Paste your real key here
   ```

---

### ✅ **STEP 2: Enable SMTP** (CRITICAL!)

1. Click: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/auth

2. Scroll to **"SMTP Settings"**

3. Make sure **"Enable Custom SMTP"** is **OFF** (use Supabase's email service)

4. Click **"Save"**

---

### ✅ **STEP 3: Enable Email Auth**

1. Click: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/providers

2. Find **"Email"**

3. Toggle it **ON** (green)

4. Click **"Save"**

---

### ✅ **STEP 4: Set Up Email Template**

1. Click: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/templates

2. Click **"Reset Password"**

3. **Subject:** `Reset Your ZYNX CAPITAL Password`

4. **Message:** Paste the HTML from `RESET_PASSWORD_DEBUG.md` (the big HTML block)

5. Click **"Save"**

---

### ✅ **STEP 5: Configure URLs**

1. Click: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/url-configuration

2. **Site URL:**
   ```
   https://www.zynx.world
   ```

3. **Redirect URLs** (add each):
   ```
   https://www.zynx.world/**
   https://zynx.world/**
   http://localhost:5173/**
   ```

4. Click **"Save"**

---

## 🧪 TEST IT:

1. Go to your app: https://www.zynx.world

2. Click **"Forgot Password?"**

3. Enter: `josephndungukamau20@gmail.com`

4. Click **"Send Reset Link"**

5. ✅ Check your email (including spam folder!)

---

## 📊 VISUAL CHECKLIST:

```
┌─────────────────────────────────────────┐
│ ☐ Step 1: Fixed Supabase key (eyJ...)  │
│ ☐ Step 2: SMTP enabled                 │
│ ☐ Step 3: Email Auth ON                │
│ ☐ Step 4: Email template saved         │
│ ☐ Step 5: URLs configured              │
│ ☐ Tested: Email received!              │
└─────────────────────────────────────────┘
```

---

## 🔍 STILL NOT WORKING?

### **Use the diagnostic tool:**

1. Open `/test-password-reset.html` in your browser

2. Paste your real anon key

3. Click **"✅ Validate Configuration"**

4. Click **"📧 Send Reset Email"**

5. Check what error appears

---

## 🐛 COMMON ERRORS & FIXES:

| Error | Fix |
|-------|-----|
| "Invalid API key" | Wrong anon key → Go back to Step 1 |
| "Failed to send email" | SMTP not configured → Go to Step 2 |
| "Email rate limit exceeded" | Wait 60 seconds and try again |
| "User not found" | Create account first |
| Email not arriving | Check spam folder + wait 2 minutes |

---

## 📞 NEED MORE HELP?

1. Read: `RESET_PASSWORD_DEBUG.md` (detailed guide)
2. Read: `WRONG_SUPABASE_KEY.md` (key troubleshooting)
3. Check: Browser console (F12) for errors
4. Check: Supabase logs for email delivery status

---

## 🚀 THE #1 FIX:

**90% of the time, the issue is:**

1. ❌ Wrong Supabase anon key format
2. ❌ SMTP not enabled

**Fix these two first!** Then test again.

---

**After fixing, password reset emails should arrive in 10-30 seconds!** ⚡
