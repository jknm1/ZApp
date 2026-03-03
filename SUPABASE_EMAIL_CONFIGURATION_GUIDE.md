# 🔧 SUPABASE EMAIL CONFIGURATION GUIDE

## ⚠️ IMPORTANT: Password Reset Emails Require Supabase Email Setup

Your password reset feature is now properly coded, but **Supabase needs to be configured** to actually send emails.

---

## 📋 WHY EMAILS AREN'T SENDING

By default, Supabase uses **rate-limited** default SMTP that:
- ✅ Works for initial testing (very limited)
- ❌ Often fails in production
- ❌ Has strict rate limits (3-4 emails per hour)
- ❌ May be blocked by email providers

**You MUST configure custom SMTP for reliable email delivery.**

---

## 🚀 SOLUTION: Configure Custom SMTP in Supabase

### **Step 1: Go to Supabase Dashboard**

1. Visit: https://supabase.com/dashboard
2. Select your project: **muhztdszuirjqyujsaot**
3. Click on **Settings** (gear icon in sidebar)
4. Click on **Authentication** section

---

### **Step 2: Enable Email Confirmations**

1. In **Authentication Settings**, scroll to **Email Auth**
2. Make sure these are enabled:
   - ✅ **Enable email provider**
   - ✅ **Enable email confirmations**
   - ✅ **Secure email change**

---

### **Step 3: Configure SMTP Settings**

Scroll down to **SMTP Settings** and configure one of the following providers:

---

## 📧 OPTION 1: Gmail SMTP (Easiest)

### **Setup Gmail App Password:**

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. Click "Select app" → Choose **Mail**
4. Click "Select device" → Choose **Other (Custom name)**
5. Enter name: **ZYNX CAPITAL Supabase**
6. Click **Generate**
7. Copy the 16-character app password

### **Enter in Supabase:**

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-gmail@gmail.com
SMTP Password: [paste 16-character app password]
Sender Email: your-gmail@gmail.com
Sender Name: ZYNX CAPITAL

Enable TLS: ✅ YES
```

---

## 📧 OPTION 2: SendGrid (Best for Production)

### **Setup SendGrid:**

1. Sign up: https://sendgrid.com/
2. Create API Key:
   - Go to **Settings** → **API Keys**
   - Click **Create API Key**
   - Name: **ZYNX CAPITAL Supabase**
   - Permissions: **Full Access**
   - Copy the API key

3. Verify Domain (Important):
   - Go to **Settings** → **Sender Authentication**
   - Verify your domain or single sender

### **Enter in Supabase:**

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Password: [paste your SendGrid API key]
Sender Email: noreply@yourdomain.com
Sender Name: ZYNX CAPITAL

Enable TLS: ✅ YES
```

---

## 📧 OPTION 3: AWS SES (Most Reliable)

### **Setup AWS SES:**

1. Sign in to AWS Console: https://console.aws.amazon.com/ses/
2. Verify email address or domain
3. Create SMTP credentials:
   - Go to **SMTP Settings**
   - Click **Create My SMTP Credentials**
   - Copy the username and password

### **Enter in Supabase:**

```
SMTP Host: email-smtp.us-east-1.amazonaws.com (use your region)
SMTP Port: 587
SMTP User: [AWS SMTP username]
SMTP Password: [AWS SMTP password]
Sender Email: noreply@yourdomain.com
Sender Name: ZYNX CAPITAL

Enable TLS: ✅ YES
```

---

## 📧 OPTION 4: Mailgun

### **Setup Mailgun:**

1. Sign up: https://www.mailgun.com/
2. Add and verify your domain
3. Get SMTP credentials from **Sending** → **Domain Settings**

### **Enter in Supabase:**

```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: postmaster@yourdomain.com
SMTP Password: [Mailgun SMTP password]
Sender Email: noreply@yourdomain.com
Sender Name: ZYNX CAPITAL

Enable TLS: ✅ YES
```

---

## 📧 OPTION 5: Resend (Modern Alternative)

### **Setup Resend:**

1. Sign up: https://resend.com/
2. Add and verify domain
3. Create API Key

### **Enter in Supabase:**

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: [Your Resend API Key]
Sender Email: noreply@yourdomain.com
Sender Name: ZYNX CAPITAL

Enable TLS: ✅ YES
```

---

## 🎨 STEP 4: Customize Email Templates

In Supabase Dashboard → **Authentication** → **Email Templates**:

### **Password Reset Email Template:**

```html
<h2>Reset Your Password</h2>
<p>Hi there!</p>
<p>We received a request to reset your password for your ZYNX CAPITAL account.</p>
<p>Click the button below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}" style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
<p>Best regards,<br>ZYNX CAPITAL Team</p>
```

---

## ✅ STEP 5: Test the Setup

1. Save all SMTP settings in Supabase
2. Go to your ZYNX CAPITAL app
3. Click "Forgot Password"
4. Enter your email
5. Click "Send Reset Link"
6. Check your inbox (and spam folder)

---

## 🔍 TROUBLESHOOTING

### **Problem: "Email sending failed"**

**Solution:**
1. Check SMTP credentials are correct
2. Verify sender email is authenticated
3. Check Supabase logs: **Project Settings** → **Logs**

### **Problem: "Emails going to spam"**

**Solution:**
1. Verify your domain with SPF/DKIM records
2. Use a custom domain (not Gmail for production)
3. Warm up your email sending reputation

### **Problem: "No error but email not received"**

**Solution:**
1. Check spam folder
2. Verify email is confirmed in Supabase (users table)
3. Check Supabase rate limits
4. Test with different email provider

### **Problem: "Rate limit exceeded"**

**Solution:**
1. Configure custom SMTP (default SMTP has strict limits)
2. Wait 1 hour and try again
3. Use production-grade SMTP (SendGrid, AWS SES)

---

## 📊 VERIFICATION CHECKLIST

Before testing, verify:

- [ ] SMTP settings configured in Supabase
- [ ] Sender email verified/authenticated
- [ ] Email Auth enabled in Supabase
- [ ] Redirect URL is correct: `https://yourdomain.com/reset-password`
- [ ] User's email is confirmed in Supabase
- [ ] Not hitting rate limits

---

## 🎯 RECOMMENDED SETUP FOR PRODUCTION

**For ZYNX CAPITAL production:**

1. **Use SendGrid** or **AWS SES** (most reliable)
2. **Verify your domain** (adds trust, avoids spam)
3. **Use custom domain email**: `noreply@zynxcapital.com`
4. **Set up SPF/DKIM** records for your domain
5. **Monitor email delivery** in provider dashboard

---

## 📝 CURRENT CODE STATUS

✅ **ForgotPassword.tsx** - Fixed and working
✅ **ResetPassword.tsx** - Properly handles password reset
✅ **Supabase integration** - Correctly configured
✅ **Error handling** - Comprehensive logging
✅ **User experience** - Shows proper success/error messages

**The ONLY thing missing is Supabase SMTP configuration!**

---

## 🚨 QUICK START (5 Minutes)

**Fastest way to test:**

1. Use **Gmail SMTP** (easiest)
2. Create app password: https://myaccount.google.com/apppasswords
3. Enter in Supabase SMTP settings
4. Test immediately

**For production:**

1. Sign up for **SendGrid** (free tier: 100 emails/day)
2. Verify your sender email
3. Get API key
4. Configure in Supabase
5. Done!

---

## 📧 NEED HELP?

**Supabase Email Docs:**
- https://supabase.com/docs/guides/auth/auth-smtp

**SendGrid Setup:**
- https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api

**Gmail App Passwords:**
- https://support.google.com/accounts/answer/185833

---

## ✨ AFTER CONFIGURATION

Once SMTP is configured, your users will:

1. Click "Forgot Password"
2. Enter their email
3. Receive reset link within seconds
4. Click link → redirected to `/reset-password`
5. Enter new password
6. Successfully reset!

**The app code is 100% ready. Just need to configure Supabase SMTP!** 🚀
