# 🚀 QUICK FIX: Password Reset Email Not Sending

## ⚡ 3-Minute Fix

Your forgot password feature is **already coded perfectly**! It's just missing Supabase email configuration.

---

## 🎯 Follow These Steps:

### **Step 1: Go to Supabase Email Templates**

Click this link:
```
https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/templates
```

---

### **Step 2: Click "Reset Password" Template**

You'll see the email editor

---

### **Step 3: Update Email Subject**

Change to:
```
Reset Your ZYNX CAPITAL Password
```

---

### **Step 4: Update Email Body**

**Delete everything** and paste this beautiful template:

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

---

### **Step 5: Configure URL Settings**

1. Scroll down to **"URL Configuration"** section

2. Set **Site URL** to:
   ```
   http://localhost:5173
   ```

3. Add to **Redirect URLs**:
   ```
   http://localhost:5173/**
   ```

4. Click **"Save"**

---

## ✅ That's It!

Now test it:

1. Go to your app
2. Click "Forgot Password?"
3. Enter: `josephndungukamau20@gmail.com`
4. Click "Send Reset Link"
5. **Check your email!** (Also check spam folder)

You should receive a beautiful ZYNX CAPITAL branded email with a reset button!

---

## 📧 For Production (Optional - Better Deliverability)

### **Use Gmail SMTP:**

1. Go to: https://myaccount.google.com/security

2. Enable "2-Step Verification"

3. Go to "App passwords": https://myaccount.google.com/apppasswords

4. Create app password:
   - App: **Mail**
   - Device: **ZYNX CAPITAL**

5. Copy the 16-character password

6. Go to Supabase SMTP Settings:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/auth
   ```

7. Enable **"Custom SMTP"**

8. Enter:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: `josephndungukamau20@gmail.com`
   - Password: `[your-16-char-app-password]`
   - Sender email: `josephndungukamau20@gmail.com`
   - Sender name: `ZYNX CAPITAL`

9. Click **"Save"**

Now emails will be sent from your Gmail and won't go to spam!

---

## 🎯 Summary

**What was wrong**: Supabase email templates not configured  
**What we fixed**: Added beautiful branded email template  
**Time to fix**: 3 minutes  
**Result**: Professional password reset emails! 📧✨

**Test it now and you'll receive beautiful reset emails!** 🚀
