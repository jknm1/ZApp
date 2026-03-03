# 🔧 PASSWORD RESET - COMPLETE FIX GUIDE

## ❌ PROBLEM: "Can't Send Reset Link"

## ✅ ROOT CAUSES FOUND:

### 1. **WRONG SUPABASE ANON KEY** 🔑
Your current key in `/src/app/lib/supabase.ts`:
```
sb_publishable_eE-67PETmOR4yS8B1OLxdA_l0NSaJ_Y
```
This is **NOT VALID**! Real Supabase keys start with `eyJ...`

### 2. **SMTP NOT CONFIGURED** 📧
Supabase can't send emails without SMTP setup!

### 3. **EMAIL TEMPLATE URL ISSUES** 🔗

---

## 🛠️ COMPLETE FIX - FOLLOW IN ORDER:

### **STEP 1: Get Real Supabase Keys**

1. Go here (copy-paste this URL):
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/api
   ```

2. You'll see:
   - **Project URL**: `https://muhztdszuirjqyujsaot.supabase.co` ✅ (this is correct)
   - **Project API keys** section with two keys:
     - `anon` `public` key (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...`)
     - `service_role` `secret` key (don't use this one!)

3. **Copy the ANON/PUBLIC key** (the one that starts with `eyJ...`)

4. **IMPORTANT**: Replace line 4 in `/src/app/lib/supabase.ts` with your REAL key!

---

### **STEP 2: Enable Email Provider**

1. Go here:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/providers
   ```

2. Find **"Email"** in the list

3. Make sure the toggle is **GREEN (enabled)**

4. If it's off, click it ON

5. Click **"Save"** at the bottom

---

### **STEP 3: Enable SMTP (CRITICAL!)** 🔥

**This is the most important step!**

1. Go here:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/auth
   ```

2. Scroll down to find **"SMTP Settings"** section

3. You'll see **"Enable Custom SMTP"** toggle

4. **OPTION A - Use Supabase's Built-in SMTP (RECOMMENDED):**
   - Make sure **"Enable Custom SMTP"** is **OFF** (gray/disabled)
   - This uses Supabase's own email service
   - **No configuration needed!**
   - Supabase automatically sends emails from `noreply@mail.app.supabase.io`

5. **OPTION B - Use Your Own Email (Advanced):**
   - Toggle **"Enable Custom SMTP"** to **ON** (green)
   - Fill in these fields:
     - **Sender email**: `noreply@zynx.world` (or any email you control)
     - **Sender name**: `ZYNX CAPITAL`
     - **Host**: `smtp.gmail.com` (if using Gmail)
     - **Port**: `587`
     - **Username**: Your email address
     - **Password**: Your app-specific password
   - For Gmail: Use an [App Password](https://myaccount.google.com/apppasswords), NOT your regular password!

6. Click **"Save"** at the bottom

---

### **STEP 4: Configure Email Template & URLs**

#### **4A: Set up Email Template**

1. Go here:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/templates
   ```

2. Click **"Reset Password"**

3. **Subject Line** (paste this):
   ```
   Reset Your ZYNX CAPITAL Password
   ```

4. **Message Body** (select ALL existing HTML and replace with this):
   ```html
   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; overflow: hidden; border: 1px solid #334155;">
     
     <!-- Header -->
     <div style="background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%); padding: 40px; text-align: center;">
       <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 16px; display: inline-block; line-height: 60px; margin-bottom: 16px;">
         <span style="font-size: 32px; font-weight: 900; color: #ffffff;">Z</span>
       </div>
       <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">ZYNX CAPITAL</h1>
       <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">Premium Prop Trading Firm</p>
     </div>
     
     <!-- Content -->
     <div style="padding: 50px 40px;">
       <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
       
       <p style="margin: 0 0 20px; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
         We received a request to reset your password for your ZYNX CAPITAL account. Click the button below to create a new password.
       </p>
       
       <p style="margin: 0 0 30px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
         If you didn't request this password reset, you can safely ignore this email.
       </p>
       
       <!-- Reset Button -->
       <div style="text-align: center; padding: 20px 0;">
         <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-size: 16px; font-weight: 600;">
           Reset My Password
         </a>
       </div>
       
       <!-- Alternative Link -->
       <div style="margin-top: 40px; padding: 20px; background: rgba(15, 23, 42, 0.5); border: 1px solid #334155; border-radius: 12px;">
         <p style="margin: 0 0 12px; color: #94a3b8; font-size: 13px;">
           Button not working? Copy this link:
         </p>
         <a href="{{ .ConfirmationURL }}" style="color: #ec4899; text-decoration: none; font-size: 13px; word-break: break-all;">
           {{ .ConfirmationURL }}
         </a>
       </div>
       
       <!-- Security Notice -->
       <div style="margin-top: 30px; padding: 16px; background: rgba(59, 130, 246, 0.1); border-left: 3px solid #3b82f6; border-radius: 8px;">
         <p style="margin: 0; color: #93c5fd; font-size: 13px;">
           <strong>Security:</strong> This link expires in 1 hour. Never share it with anyone.
         </p>
       </div>
     </div>
     
     <!-- Footer -->
     <div style="background: #0f172a; padding: 30px 40px; border-top: 1px solid #334155; text-align: center;">
       <p style="margin: 0 0 16px; color: #64748b; font-size: 14px;">
         Need help? Contact us at<br>
         <a href="mailto:josephndungukamau20@gmail.com" style="color: #ec4899; text-decoration: none;">josephndungukamau20@gmail.com</a>
       </p>
       
       <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e293b;">
         <p style="margin: 0; color: #475569; font-size: 12px;">
           © 2026 ZYNX CAPITAL. All rights reserved.
         </p>
       </div>
     </div>
   </div>
   ```

5. Click **"Save"** (usually top-right)

#### **4B: Configure URLs**

1. Go here:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/url-configuration
   ```

2. **Site URL** (paste this):
   ```
   https://www.zynx.world
   ```

3. **Redirect URLs** (click "Add URL" for each):
   ```
   https://www.zynx.world/**
   ```
   ```
   https://zynx.world/**
   ```
   ```
   http://localhost:5173/**
   ```

4. Click **"Save"**

---

### **STEP 5: Update Supabase Key in Code**

**After you get your REAL anon key from Step 1**, replace it in your code:

```typescript
// /src/app/lib/supabase.ts
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // YOUR REAL KEY HERE
```

---

## 🧪 TEST IT:

1. Open Chrome DevTools Console (F12)

2. Go to: `https://www.zynx.world` or `http://localhost:5173`

3. Click **"Forgot Password?"**

4. Enter your email: `josephndungukamau20@gmail.com`

5. Click **"Send Reset Link"**

6. **Check Console for errors:**
   - If you see `"Email Sent!"` success message ✅
   - If you see errors, copy them and send to me ❌

7. **Check your email:**
   - Check inbox
   - Check spam/junk folder
   - Check "Promotions" tab (Gmail)

8. **If email arrived:**
   - Click "Reset My Password" button
   - Should redirect to `https://www.zynx.world/reset-password`
   - Enter new password
   - Click "Update Password"
   - Success! ✅

---

## 🐛 STILL NOT WORKING? DEBUG CHECKLIST:

### ✅ Checklist:

- [ ] Copied REAL anon key (starts with `eyJ...`) from Supabase dashboard
- [ ] Updated `/src/app/lib/supabase.ts` with the real key
- [ ] Email provider is ENABLED in Auth Providers
- [ ] SMTP is configured (either Supabase's or custom)
- [ ] Email template is saved with the HTML above
- [ ] Site URL is set to `https://www.zynx.world`
- [ ] Redirect URLs include `https://www.zynx.world/**`
- [ ] No errors in browser console
- [ ] Checked spam folder

### 🔍 Common Issues:

**❌ "Failed to send reset email"**
- SMTP not configured → Go back to Step 3

**❌ "This email is not registered"**
- User doesn't exist in Supabase Auth
- Create account first or check Auth → Users

**❌ "Invalid API key"**
- Wrong anon key → Copy from Step 1 again

**❌ Email arrives but link doesn't work**
- URL configuration wrong → Check Step 4B
- User clicking old/expired link → Links expire in 1 hour

**❌ Email not arriving**
- Check spam folder
- SMTP not enabled → Go back to Step 3
- Wait 2-3 minutes (emails can be delayed)
- Check Supabase Dashboard → Authentication → Logs for errors

---

## 📊 HOW TO CHECK SUPABASE LOGS:

1. Go to:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/logs/explorer
   ```

2. Run this query:
   ```sql
   SELECT timestamp, event_message, metadata
   FROM auth.audit_log_entries
   WHERE event_type = 'user_recovery_requested'
   ORDER BY created_at DESC
   LIMIT 10;
   ```

3. This shows all password reset attempts!

---

## 🎯 QUICK VERIFICATION:

Open browser console and run:
```javascript
// Test if Supabase is connected
const { data, error } = await supabase.auth.resetPasswordForEmail('josephndungukamau20@gmail.com', {
  redirectTo: 'https://www.zynx.world/reset-password'
});
console.log('Success:', !error);
console.log('Error:', error);
```

If `Success: true` → Email should arrive!
If `Error:` shows something → Send me that error message!

---

## 📞 NEED MORE HELP?

Send me:
1. Screenshot of Supabase Auth Settings
2. Browser console errors (F12 → Console)
3. Your current anon key (first 20 characters only: `eyJhbGciOiJIUzI1NiIsInR5...`)

---

**Most common fix: Just enable Supabase's built-in SMTP in Step 3! 🚀**
