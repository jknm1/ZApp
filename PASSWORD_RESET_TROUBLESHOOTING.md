# 🔧 PASSWORD RESET TROUBLESHOOTING GUIDE

## ❌ Problem: Password Reset Emails Not Sending

---

## ✅ STEP-BY-STEP FIX

### **Step 1: Check Browser Console for Errors**

1. Open your app: https://www.zynx.world
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Click "Forgot Password?"
5. Enter email and submit
6. **Check for red error messages**

**Common Errors:**

- ❌ `Email rate limit exceeded` → Wait 60 seconds and try again
- ❌ `Invalid email` → Check email format
- ❌ `Failed to send email` → SMTP not configured
- ❌ `Network error` → Check internet connection

---

### **Step 2: Verify SMTP is Configured in Supabase**

1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/auth

2. Scroll to **"SMTP Settings"** section

3. Check if **"Enable Custom SMTP"** toggle is **ON** (green)

4. **If toggle is OFF:**
   - You MUST configure SMTP first
   - See `/SMTP_SETUP_GUIDE.md`
   - Without SMTP, emails CANNOT be sent

5. **If toggle is ON, verify settings:**
   ```
   Host: smtp.gmail.com (or your provider)
   Port: 587
   Username: your-email@gmail.com
   Password: [Your App Password - 16 characters]
   Sender Email: your-email@gmail.com
   ```

6. Click **"Save"** button at bottom

---

### **Step 3: Check Supabase Email Rate Limiting**

Supabase has rate limits for password reset emails:

- **4 emails per hour** per email address
- **10 emails per hour** per IP address

**Fix:**
- Wait 60 minutes before trying again
- Or use a different email address
- Or use a different device/network

**Check Rate Limit Status:**
1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/logs/edge-logs
2. Filter by: `auth`
3. Look for: `rate_limit_exceeded` errors

---

### **Step 4: Verify Redirect URLs are Whitelisted**

1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/url-configuration

2. Check **"Redirect URLs"** section

3. Ensure these URLs are added (one per line):
   ```
   https://www.zynx.world
   https://www.zynx.world/reset-password
   https://zynx.world
   https://zynx.world/reset-password
   http://localhost:5173
   http://localhost:5173/reset-password
   ```

4. Click **"Save"**

---

### **Step 5: Check Site URL is Correct**

1. In same URL Configuration page, check **"Site URL"**:
   ```
   https://www.zynx.world
   ```

2. Make sure there's NO trailing slash `/`

3. Make sure it matches your live domain

4. Click **"Save"**

---

### **Step 6: Test with Supabase Default Email (No SMTP)**

If custom SMTP is causing issues, test with Supabase's default email:

1. Go to SMTP Settings
2. **Turn OFF** "Enable Custom SMTP" toggle
3. Click **"Save"**
4. Try password reset again
5. Check your email (and spam folder)

**If this works:**
- ✅ Your app code is correct
- ❌ Your SMTP configuration has an issue
- → Fix SMTP settings (see `/SMTP_SETUP_GUIDE.md`)

**If this doesn't work:**
- ❌ Issue is with Supabase project settings
- → Continue troubleshooting below

---

### **Step 7: Verify Email Template is Enabled**

1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/templates

2. Find **"Reset Password"** template

3. Make sure it's **enabled** (toggle should be green)

4. Check the template has `{{ .ConfirmationURL }}` variable

5. Click **"Save"** if you made changes

---

### **Step 8: Check User Exists in Auth**

1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/users

2. Search for the email you're testing with

3. **If user NOT found:**
   - Create an account first
   - Then try password reset

4. **If user found:**
   - Check if email is confirmed (green checkmark)
   - If not confirmed, confirm it manually first

---

### **Step 9: Test SMTP Connection Directly**

Test if your SMTP credentials work outside Supabase:

**For Gmail:**
```bash
# Use an online SMTP tester:
# https://www.gmass.co/smtp-test

Host: smtp.gmail.com
Port: 587
Username: josephndungukamau20@gmail.com
Password: [Your 16-char App Password]
From: josephndungukamau20@gmail.com
To: josephndungukamau20@gmail.com
```

**If SMTP test fails:**
- ❌ Your SMTP credentials are wrong
- → Regenerate App Password (for Gmail)
- → Check username/password are correct

---

### **Step 10: Check Supabase Auth Logs**

1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/logs/auth-logs

2. Click **"Refresh"**

3. Look for recent password reset attempts

4. Check for error messages:
   - `email_send_failed` → SMTP issue
   - `rate_limit_exceeded` → Too many requests
   - `invalid_email` → Email doesn't exist
   - `smtp_authentication_failed` → Wrong SMTP password

5. Click on error to see full details

---

## 🔍 COMMON ISSUES & FIXES

### **Issue 1: "Email rate limit exceeded"**

**Cause:** Too many password reset requests

**Fix:**
- Wait 60 minutes
- Or use different email
- Or disable rate limiting (not recommended)

**Disable Rate Limiting (Advanced):**
1. Go to: Auth Settings → Security
2. Find "Rate Limiting"
3. Adjust limits (or disable)

---

### **Issue 2: "Failed to send email via SMTP"**

**Cause:** SMTP credentials wrong or server down

**Fixes:**
1. ✅ Re-enter SMTP password (copy-paste to avoid typos)
2. ✅ Gmail: Regenerate App Password
3. ✅ SendGrid: Regenerate API Key
4. ✅ Check SMTP server is online
5. ✅ Try different SMTP provider

---

### **Issue 3: Email goes to spam folder**

**Cause:** Poor email deliverability

**Fixes:**
1. ✅ Use professional SMTP provider (SendGrid, not Gmail)
2. ✅ Verify sender email address
3. ✅ Add SPF/DKIM DNS records
4. ✅ Use custom domain email (noreply@zynx.world)
5. ✅ Whitelist sender email in your inbox

---

### **Issue 4: "User not found"**

**Cause:** Email not registered in Supabase Auth

**Fix:**
1. Create account first: https://www.zynx.world/signup
2. Verify email (if required)
3. Then try password reset

---

### **Issue 5: Reset link doesn't work**

**Cause:** Redirect URL not whitelisted

**Fix:**
1. Add all redirect URLs (see Step 4 above)
2. Make sure `/reset-password` route exists
3. Clear browser cache and try again

---

### **Issue 6: Gmail App Password not working**

**Cause:** 2-Step Verification not enabled, or wrong password

**Fix:**
1. Enable 2FA: https://myaccount.google.com/security
2. Create new App Password: https://myaccount.google.com/apppasswords
3. Select **"Mail"** and **"Other (Custom name)"**
4. Name: `Supabase SMTP`
5. Copy 16-character password (NO SPACES)
6. Use this in Supabase SMTP settings
7. **Username:** Full email address (josephndungukamau20@gmail.com)
8. **Password:** The 16-char App Password

---

## 🧪 TESTING CHECKLIST

Test password reset in this order:

- [ ] **Test 1:** Check browser console for errors
- [ ] **Test 2:** Verify SMTP is configured in Supabase
- [ ] **Test 3:** Try with Supabase default email (SMTP disabled)
- [ ] **Test 4:** Check email arrives (inbox + spam)
- [ ] **Test 5:** Click reset link in email
- [ ] **Test 6:** Verify redirect to /reset-password page
- [ ] **Test 7:** Enter new password and submit
- [ ] **Test 8:** Login with new password

---

## 📧 GMAIL SMTP SETUP (FASTEST FIX)

If nothing else works, use this exact configuration:

### **Step 1: Get Gmail App Password**

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already)
3. Go to: https://myaccount.google.com/apppasswords
4. Click **"Select app"** → Choose **"Mail"**
5. Click **"Select device"** → Choose **"Other (Custom name)"**
6. Type: `Supabase`
7. Click **"Generate"**
8. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
9. **IMPORTANT:** Remove spaces when pasting (make it `abcdefghijklmnop`)

### **Step 2: Configure in Supabase**

1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/auth

2. Scroll to **"SMTP Settings"**

3. Enable toggle: **"Enable Custom SMTP"** → ON

4. Fill in exactly:
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP Username: josephndungukamau20@gmail.com
   SMTP Password: abcdefghijklmnop (your 16-char password, NO SPACES)
   SMTP Admin Email: josephndungukamau20@gmail.com
   SMTP Sender Name: ZYNX CAPITAL
   ```

5. Click **"Save"** at bottom

6. Wait 30 seconds for changes to apply

### **Step 3: Test**

1. Go to: https://www.zynx.world
2. Click **"Forgot Password?"**
3. Enter: `josephndungukamau20@gmail.com`
4. Click **"Send Reset Link"**
5. Check your Gmail inbox (and spam)
6. ✅ Email should arrive within 1-2 minutes

---

## 🚨 EMERGENCY FIX: Bypass Email and Reset Password Manually

If emails still don't work, reset password manually via Supabase SQL:

1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/sql/new

2. Run this SQL (replace with your email and new password):

```sql
-- Update password for specific user (emergency only)
-- Replace 'your-email@example.com' with actual email
-- Replace 'new-password-here' with desired password

UPDATE auth.users
SET 
  encrypted_password = crypt('new-password-here', gen_salt('bf')),
  updated_at = now()
WHERE email = 'your-email@example.com';

-- Confirm it worked
SELECT email, updated_at 
FROM auth.users 
WHERE email = 'your-email@example.com';
```

3. Click **"Run"**

4. Login with new password

**⚠️ Warning:** This is an emergency fix only. Fix SMTP properly!

---

## 📊 DEBUG INFORMATION TO COLLECT

If you need help, provide this info:

1. **Error from browser console:**
   - Press F12 → Console tab
   - Copy full error message

2. **Supabase Auth Logs:**
   - Screenshot of error in Auth Logs

3. **SMTP Provider:**
   - Gmail? SendGrid? Other?

4. **SMTP Settings:**
   - Host, Port, Username (NOT password)

5. **Test Results:**
   - What happens when you click "Send Reset Link"?
   - Do you see success message?
   - Any error messages?

6. **Email Provider:**
   - Gmail? Outlook? Other?
   - Checked spam folder?

---

## ✅ VERIFICATION STEPS

Once you fix SMTP, verify it works:

### **Test 1: Send Reset Email**
```
1. Go to https://www.zynx.world
2. Click "Forgot Password?"
3. Enter your email
4. Click "Send Reset Link"
5. ✅ Should see "Email Sent!" success message
```

### **Test 2: Receive Email**
```
1. Check inbox (wait 1-2 minutes)
2. Check spam/junk folder
3. ✅ Should receive email from ZYNX CAPITAL
```

### **Test 3: Reset Password**
```
1. Open email
2. Click "Reset Password" button
3. ✅ Should redirect to www.zynx.world/reset-password
4. Enter new password
5. Click "Update Password"
6. ✅ Should redirect to dashboard
```

### **Test 4: Login with New Password**
```
1. Logout
2. Go to www.zynx.world
3. Click "Sign In"
4. Enter email + new password
5. ✅ Should login successfully
```

---

## 🎯 MOST LIKELY CAUSE

Based on your symptoms, the issue is probably:

### **90% Chance: SMTP Not Configured**
- ❌ Custom SMTP toggle is OFF
- ❌ Or SMTP credentials are wrong
- **Fix:** Follow "Gmail SMTP Setup" section above

### **8% Chance: Rate Limiting**
- ❌ Too many password reset attempts
- **Fix:** Wait 60 minutes, then try again

### **2% Chance: Email in Spam**
- ❌ Email was sent but went to spam
- **Fix:** Check spam/junk folder

---

## 🔑 QUICK WIN: Use This Exact Config

Copy-paste this EXACT configuration (replace password):

```
Host: smtp.gmail.com
Port: 587
Username: josephndungukamau20@gmail.com
Password: [YOUR-16-CHAR-APP-PASSWORD-HERE]
Sender Name: ZYNX CAPITAL
Sender Email: josephndungukamau20@gmail.com
```

**Redirect URLs:**
```
https://www.zynx.world
https://www.zynx.world/reset-password
http://localhost:5173
http://localhost:5173/reset-password
```

**Site URL:**
```
https://www.zynx.world
```

---

## 📞 NEXT STEPS

1. ✅ Try Gmail SMTP setup (5 minutes)
2. ✅ Test password reset
3. ✅ Check email arrives
4. ❌ Still not working? Check Auth Logs
5. ❌ Still not working? Try different email provider (SendGrid)
6. ❌ Still not working? Use manual SQL password reset (emergency)

---

## 🎉 SUCCESS!

Once emails are sending, you'll have:

✅ Password reset working  
✅ Email verification working  
✅ Magic link login working  
✅ Custom notification emails working  
✅ KYC approval emails working (future)  

**The password reset system is production-ready once SMTP is configured!** 🚀
