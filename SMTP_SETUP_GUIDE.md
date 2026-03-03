# 📧 SMTP SETUP GUIDE - ZYNX CAPITAL

## Overview

Setting up SMTP (Simple Mail Transfer Protocol) allows Supabase to send emails for:
- ✅ Password reset requests
- ✅ Email verification
- ✅ Magic link authentication
- ✅ KYC approval/rejection notifications
- ✅ Custom transactional emails

---

## 🎯 Recommended SMTP Providers

### **Option 1: Gmail SMTP (Free - Easiest for Testing)**

**Best for:** Testing, small projects, personal use

**Limits:** 500 emails/day

**Configuration:**
```
Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: [App Password - NOT your regular password]
Sender Name: ZYNX CAPITAL
Sender Email: your-email@gmail.com
```

**Setup Steps:**
1. Go to: https://myaccount.google.com/apppasswords
2. Create an **App Password** (NOT your regular Gmail password)
3. Copy the 16-character password
4. Use this in Supabase SMTP settings

**Important:** You MUST use an App Password, not your regular Gmail password!

---

### **Option 2: SendGrid (Free - Recommended for Production)**

**Best for:** Production, high volume, professional emails

**Limits:** 100 emails/day (free tier), upgrade for more

**Configuration:**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Your SendGrid API Key]
Sender Name: ZYNX CAPITAL
Sender Email: noreply@zynx.world (or your verified email)
```

**Setup Steps:**
1. Sign up at: https://signup.sendgrid.com/
2. Verify your email
3. Go to: **Settings** → **API Keys**
4. Click **"Create API Key"**
5. Name: `Supabase SMTP`
6. Permissions: **Full Access** or **Mail Send**
7. Copy the API key (starts with `SG.`)
8. Use `apikey` as username and the API key as password

**Verify Sender Email:**
1. Go to: **Settings** → **Sender Authentication**
2. Click **"Verify a Single Sender"**
3. Add `noreply@zynx.world` or any email you control
4. Check your email and verify

---

### **Option 3: Mailgun (Free - Great for Developers)**

**Best for:** Developers, flexible API, good free tier

**Limits:** 5,000 emails/month (free for 3 months), then paid

**Configuration:**
```
Host: smtp.mailgun.org
Port: 587
Username: postmaster@mg.zynx.world (or sandbox domain)
Password: [Your Mailgun SMTP Password]
Sender Name: ZYNX CAPITAL
Sender Email: noreply@mg.zynx.world
```

**Setup Steps:**
1. Sign up at: https://signup.mailgun.com/
2. Go to: **Sending** → **Domain Settings**
3. Use sandbox domain for testing, or add your custom domain
4. Click on domain name
5. Find **SMTP Credentials** section
6. Copy username and password

---

### **Option 4: Resend (New - Developer-Friendly)**

**Best for:** Modern API, simple setup, great for SaaS

**Limits:** 3,000 emails/month (free tier)

**Configuration:**
```
Host: smtp.resend.com
Port: 587
Username: resend
Password: [Your Resend API Key]
Sender Name: ZYNX CAPITAL
Sender Email: noreply@zynx.world
```

**Setup Steps:**
1. Sign up at: https://resend.com/signup
2. Go to: **API Keys**
3. Click **"Create API Key"**
4. Copy the key
5. Add and verify your domain

---

### **Option 5: Amazon SES (Cheap - Best for Scale)**

**Best for:** High volume, low cost ($0.10 per 1,000 emails)

**Limits:** 200 emails/day (sandbox), unlimited after verification

**Configuration:**
```
Host: email-smtp.us-east-1.amazonaws.com (or your region)
Port: 587
Username: [Your SES SMTP Username]
Password: [Your SES SMTP Password]
Sender Name: ZYNX CAPITAL
Sender Email: noreply@zynx.world
```

**Setup Steps:**
1. Go to: AWS Console → SES
2. Verify your domain/email
3. Create SMTP credentials
4. Request production access (to leave sandbox)

---

## 🛠️ Supabase SMTP Configuration

### **Step 1: Navigate to SMTP Settings**

1. Go to Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/auth
   ```

2. Scroll down to **"SMTP Settings"** section

3. Click **"Enable Custom SMTP"** toggle

---

### **Step 2: Enter SMTP Details**

Fill in these fields based on your chosen provider:

| Field | Description | Example |
|-------|-------------|---------|
| **Host** | SMTP server hostname | `smtp.gmail.com` |
| **Port** | SMTP port (usually 587) | `587` |
| **Username** | SMTP username | `your-email@gmail.com` |
| **Password** | SMTP password or API key | `[App Password or API Key]` |
| **Sender Name** | Display name in emails | `ZYNX CAPITAL` |
| **Sender Email** | "From" email address | `noreply@zynx.world` |

---

### **Step 3: Test Configuration**

1. Click **"Save"** button

2. Test by sending a password reset:
   - Go to your ZYNX app
   - Click "Forgot Password?"
   - Enter your email
   - Check if you receive the email

3. ✅ If email received → SMTP working!
4. ❌ If no email → Check spam folder or SMTP logs

---

## 📋 Example Configurations

### **Gmail SMTP (Quick Setup for Testing)**

```
Host: smtp.gmail.com
Port: 587
Username: josephndungukamau20@gmail.com
Password: abcd efgh ijkl mnop (16-char App Password)
Sender Name: ZYNX CAPITAL
Sender Email: josephndungukamau20@gmail.com
```

**⚠️ Important for Gmail:**
- Must use **App Password** (not regular password)
- Enable 2-Step Verification first
- Create App Password at: https://myaccount.google.com/apppasswords

---

### **SendGrid SMTP (Recommended for Production)**

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Sender Name: ZYNX CAPITAL
Sender Email: noreply@zynx.world
```

**⚠️ Important for SendGrid:**
- Username is literally the word `apikey`
- Password is your SendGrid API key
- Must verify sender email first

---

### **Custom Domain Setup (Professional)**

If you own `zynx.world`, use:

```
Sender Email: noreply@zynx.world
```

Or:

```
Sender Email: support@zynx.world
Sender Email: team@zynx.world
Sender Email: hello@zynx.world
```

---

## 🎨 Email Template Customization

### **Customize Email Templates**

After SMTP is configured, customize email templates:

1. Go to: **Authentication** → **Email Templates**

2. Available templates:
   - **Confirm signup** - Email verification
   - **Invite user** - Team invitations
   - **Magic Link** - Passwordless login
   - **Change Email Address** - Email change confirmation
   - **Reset Password** - Password reset

3. Customize each template with your branding:

```html
<h2>Welcome to ZYNX CAPITAL</h2>
<p>Click below to reset your password:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>

<p>Best regards,<br>The ZYNX CAPITAL Team</p>
```

---

## 🔗 Redirect URLs Configuration

### **Set Redirect URLs for Password Reset**

1. Go to: **Authentication** → **URL Configuration**

2. Set these URLs:

| Field | Value |
|-------|-------|
| **Site URL** | `https://www.zynx.world` |
| **Redirect URLs** | Add these (one per line): |
| | `https://www.zynx.world` |
| | `https://www.zynx.world/reset-password` |
| | `https://www.zynx.world/auth/callback` |
| | `http://localhost:5173` (for local dev) |
| | `http://localhost:5173/reset-password` |

3. Click **"Save"**

---

## 🧪 Testing SMTP Setup

### **Test 1: Password Reset Email**

1. Go to: https://www.zynx.world
2. Click **"Forgot Password?"**
3. Enter your email: `josephndungukamau20@gmail.com`
4. Click **"Send Reset Link"**
5. Check your inbox (and spam folder)
6. ✅ Email received → SMTP working!

### **Test 2: New User Signup Email (if enabled)**

1. Go to: https://www.zynx.world/signup
2. Create a new test account
3. Check email for verification link
4. Click link to verify
5. ✅ Email received → SMTP working!

### **Test 3: Send Test Email from Supabase**

1. Go to: Supabase Dashboard → **SQL Editor**
2. Run this query:

```sql
-- Send test email to yourself
SELECT extensions.http((
  'POST',
  'https://api.sendgrid.com/v3/mail/send',
  ARRAY[extensions.http_header('Authorization', 'Bearer YOUR_API_KEY')],
  'application/json',
  '{
    "personalizations": [{"to": [{"email": "josephndungukamau20@gmail.com"}]}],
    "from": {"email": "noreply@zynx.world"},
    "subject": "ZYNX CAPITAL - Test Email",
    "content": [{"type": "text/plain", "value": "This is a test email from ZYNX CAPITAL!"}]
  }'
));
```

3. Check your inbox
4. ✅ Email received → API working!

---

## 🚨 Troubleshooting

### **Problem: No emails received**

**Solutions:**
1. ✅ Check spam/junk folder
2. ✅ Verify SMTP credentials are correct
3. ✅ Check SMTP host and port
4. ✅ Ensure sender email is verified (for SendGrid/Mailgun)
5. ✅ Check Supabase logs: **Authentication** → **Logs**
6. ✅ Test SMTP credentials outside Supabase

---

### **Problem: "Authentication failed" error**

**Solutions:**
1. ✅ Gmail: Use **App Password**, not regular password
2. ✅ SendGrid: Username must be `apikey` (literally)
3. ✅ Check password has no extra spaces
4. ✅ Regenerate API key if expired

---

### **Problem: "Sender not verified" error**

**Solutions:**
1. ✅ SendGrid: Go to **Sender Authentication** → Verify sender email
2. ✅ Mailgun: Verify domain or use sandbox
3. ✅ Amazon SES: Request production access

---

### **Problem: Emails go to spam**

**Solutions:**
1. ✅ Add SPF record to DNS
2. ✅ Add DKIM record to DNS
3. ✅ Use professional "From" address (not Gmail)
4. ✅ Warm up your sending domain
5. ✅ Avoid spam trigger words

---

## 🌐 DNS Configuration (Advanced)

To prevent emails going to spam, add these DNS records:

### **SPF Record**

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

Or for SendGrid:
```
Value: v=spf1 include:sendgrid.net ~all
```

### **DKIM Record**

Get DKIM record from your email provider:
- SendGrid: **Settings** → **Sender Authentication** → **Authenticate Your Domain**
- Mailgun: **Sending** → **Domain Settings** → **DNS Records**

### **DMARC Record**

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@zynx.world
```

---

## 📊 SMTP Provider Comparison

| Provider | Free Limit | Best For | Ease of Setup | Deliverability |
|----------|-----------|----------|---------------|----------------|
| **Gmail** | 500/day | Testing | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Good |
| **SendGrid** | 100/day | Production | ⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐⭐ Excellent |
| **Mailgun** | 5,000/month | Developers | ⭐⭐⭐⭐ Easy | ⭐⭐⭐⭐ Very Good |
| **Resend** | 3,000/month | SaaS Apps | ⭐⭐⭐⭐⭐ Very Easy | ⭐⭐⭐⭐ Very Good |
| **Amazon SES** | 200/day sandbox | High Volume | ⭐⭐ Complex | ⭐⭐⭐⭐⭐ Excellent |

---

## 🎯 My Recommendation

### **For Quick Testing (Today):**
→ Use **Gmail SMTP** with App Password
- Takes 2 minutes to setup
- Works immediately
- Free 500 emails/day

### **For Production (www.zynx.world):**
→ Use **SendGrid** or **Resend**
- Professional deliverability
- Free tier sufficient for startup
- Easy to scale
- Good analytics

---

## 📝 Quick Setup Checklist

- [ ] Choose SMTP provider (Gmail for testing, SendGrid for production)
- [ ] Create account and get credentials
- [ ] (Gmail only) Enable 2FA and create App Password
- [ ] (SendGrid/others) Verify sender email address
- [ ] Go to Supabase → Authentication → SMTP Settings
- [ ] Enable Custom SMTP
- [ ] Enter SMTP credentials
- [ ] Save configuration
- [ ] Test with password reset email
- [ ] (Optional) Customize email templates
- [ ] (Optional) Configure DNS records for better deliverability

---

## 🚀 Recommended Setup for ZYNX CAPITAL

```
Provider: SendGrid (Free 100 emails/day)
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Your SendGrid API Key]
Sender Name: ZYNX CAPITAL
Sender Email: noreply@zynx.world

Redirect URLs:
- https://www.zynx.world
- https://www.zynx.world/reset-password
- https://www.zynx.world/auth/callback
- http://localhost:5173
```

---

## 💡 Pro Tips

1. **Use Different Emails for Different Purposes:**
   - `noreply@zynx.world` - Automated emails
   - `support@zynx.world` - Customer support
   - `team@zynx.world` - Team communications
   - `alerts@zynx.world` - System alerts

2. **Monitor Email Sending:**
   - Check SendGrid/Mailgun analytics
   - Track open rates and clicks
   - Monitor bounce rates
   - Watch for spam complaints

3. **Email Best Practices:**
   - Use clear subject lines
   - Include unsubscribe link (for marketing emails)
   - Keep HTML simple
   - Test emails before sending
   - Personalize with user's name

4. **Security:**
   - Never commit SMTP passwords to git
   - Use environment variables
   - Rotate API keys regularly
   - Monitor for unauthorized use

---

## 🎉 Once SMTP is Configured:

✅ Password reset emails will work  
✅ Email verification will work  
✅ Magic link login will work  
✅ Custom notification emails will work  
✅ KYC approval/rejection emails will work  

**Your ZYNX CAPITAL app will have full email functionality!** 📧
