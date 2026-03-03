# 📧 SUPABASE EMAIL CONFIGURATION FOR PASSWORD RESET

## 🔍 Current Issue

The "Forgot Password" feature is implemented correctly in code, but **Supabase email is not configured** yet. This causes password reset emails to not be sent.

---

## ✅ Solution: Configure Supabase Email Templates

### **Step 1: Enable Email Confirmations** (2 minutes)

1. Go to Supabase Authentication Settings:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/users
   ```

2. Click on **"Settings"** in the left sidebar (under Authentication)

3. Scroll to **"Auth Providers"** section

4. Make sure **"Email"** is enabled

---

### **Step 2: Configure Email Templates** (3 minutes)

1. Go to Email Templates:
   ```
   https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/auth/templates
   ```

2. Click on **"Reset Password"** template

3. **Subject Line** - Change to:
   ```
   Reset Your ZYNX CAPITAL Password
   ```

4. **Email Body** - Copy and paste this beautiful template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header with Logo -->
                    <tr>
                        <td style="background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%); padding: 40px 40px 30px; text-align: center;">
                            <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                <span style="font-size: 32px; font-weight: 900; color: #ffffff;">Z</span>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">ZYNX CAPITAL</h1>
                            <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">Premium Prop Trading Firm</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                            
                            <p style="margin: 0 0 20px; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                                We received a request to reset your password for your ZYNX CAPITAL account. Click the button below to create a new password.
                            </p>
                            
                            <p style="margin: 0 0 30px; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                                If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.
                            </p>
                            
                            <!-- Reset Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(90deg, #ec4899 0%, #f43f5e 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-size: 16px; font-weight: 600; box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3); transition: all 0.3s;">
                                            Reset My Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Alternative Link -->
                            <div style="margin-top: 40px; padding: 20px; background: rgba(15, 23, 42, 0.5); border: 1px solid #334155; border-radius: 12px;">
                                <p style="margin: 0 0 12px; color: #94a3b8; font-size: 13px; font-weight: 500;">
                                    Button not working? Copy and paste this link into your browser:
                                </p>
                                <a href="{{ .ConfirmationURL }}" style="color: #ec4899; text-decoration: none; font-size: 13px; word-break: break-all;">
                                    {{ .ConfirmationURL }}
                                </a>
                            </div>
                            
                            <!-- Security Notice -->
                            <div style="margin-top: 30px; padding: 16px; background: rgba(59, 130, 246, 0.1); border-left: 3px solid #3b82f6; border-radius: 8px;">
                                <p style="margin: 0; color: #93c5fd; font-size: 13px; line-height: 1.5;">
                                    <strong style="color: #60a5fa;">Security Tip:</strong> This link will expire in 1 hour. Never share this link with anyone. ZYNX CAPITAL will never ask for your password via email.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #0f172a; padding: 30px 40px; border-top: 1px solid #334155;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0 0 16px; color: #64748b; font-size: 14px; line-height: 1.6;">
                                            Need help? Contact us at<br>
                                            <a href="mailto:josephndungukamau20@gmail.com" style="color: #ec4899; text-decoration: none;">josephndungukamau20@gmail.com</a>
                                        </p>
                                        
                                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e293b;">
                                            <p style="margin: 0; color: #475569; font-size: 12px;">
                                                © 2026 ZYNX CAPITAL. All rights reserved.
                                            </p>
                                            <p style="margin: 8px 0 0; color: #475569; font-size: 12px;">
                                                Professional Prop Trading • Funded Accounts • No Fees
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                
                <!-- Bottom Spacer -->
                <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                    <tr>
                        <td align="center">
                            <p style="margin: 0; color: #475569; font-size: 11px;">
                                You received this email because you requested a password reset for your ZYNX CAPITAL account.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

5. Click **"Save"**

---

### **Step 3: Configure URL Configuration** (1 minute)

1. Still in Email Templates, scroll to **"URL Configuration"**

2. Set **"Site URL"** to your app URL:
   ```
   http://localhost:5173
   ```
   
   OR if deployed:
   ```
   https://your-domain.com
   ```

3. Set **"Redirect URLs"** - Add both:
   ```
   http://localhost:5173/**
   https://your-domain.com/**
   ```

4. Click **"Save"**

---

### **Step 4: Email Provider Setup** (Optional - For Production)

#### **During Development:**
- Supabase automatically sends emails using their SMTP
- Emails may go to spam folder
- Limited to 3 emails per hour per user in free tier

#### **For Production (Recommended):**

**Option 1: Use Custom SMTP (Free)**

Services like:
- **Gmail SMTP** (Free, 500 emails/day)
- **SendGrid** (Free, 100 emails/day)
- **Mailgun** (Free, 5000 emails/month)
- **AWS SES** (Free, 62,000 emails/month)

**Setup Custom SMTP:**

1. Go to: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/settings/auth

2. Scroll to **"SMTP Settings"**

3. Enable **"Enable Custom SMTP"**

4. Enter your SMTP details:
   - **Host**: smtp.gmail.com (for Gmail)
   - **Port**: 587
   - **Username**: your-email@gmail.com
   - **Password**: your-app-password
   - **Sender email**: noreply@zynxcapital.com
   - **Sender name**: ZYNX CAPITAL

5. Click **"Save"**

---

### **For Gmail SMTP (Recommended for Testing):**

1. Go to Google Account: https://myaccount.google.com/security

2. Enable **"2-Step Verification"**

3. Go to **"App passwords"**: https://myaccount.google.com/apppasswords

4. Create an app password:
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Name: **ZYNX CAPITAL**
   - Click **"Generate"**

5. Copy the 16-character password

6. Use in Supabase SMTP settings:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: `josephndungukamau20@gmail.com`
   - Password: `[16-character-app-password]`
   - Sender: `josephndungukamau20@gmail.com`
   - Sender name: `ZYNX CAPITAL`

---

## 🧪 Testing

### **Test Password Reset Flow:**

1. Go to your app login page

2. Click **"Forgot Password?"**

3. Enter your email: `josephndungukamau20@gmail.com`

4. Click **"Send Reset Link"**

5. **Check your email** (also spam folder!)

6. You should receive a beautiful branded email

7. Click **"Reset My Password"** button

8. Enter new password

9. You're redirected back to app with success message!

---

## ✅ Checklist

- [ ] Enabled Email provider in Supabase Auth
- [ ] Configured "Reset Password" email template
- [ ] Set Site URL in URL Configuration
- [ ] Added Redirect URLs
- [ ] (Optional) Setup Custom SMTP for production
- [ ] Tested password reset flow
- [ ] Verified email received (check spam!)
- [ ] Successfully reset password

---

## 🐛 Troubleshooting

### **Email Not Receiving**

**Check:**
1. ✅ Email provider is enabled in Supabase Auth settings
2. ✅ Site URL is correct (no trailing slash)
3. ✅ Redirect URLs include your domain
4. ✅ Check spam/junk folder
5. ✅ Wait 1-2 minutes (emails can be delayed)

**Solutions:**
- Use a different email to test
- Check Supabase logs for errors
- Verify email template is saved
- Try with custom SMTP (Gmail)

### **Email Goes to Spam**

**Solutions:**
- Use custom SMTP with your domain
- Setup SPF/DKIM records
- Use professional email service (SendGrid)

### **Link Doesn't Work**

**Check:**
1. ✅ URL in email matches your app URL
2. ✅ Reset password page exists at `/reset-password`
3. ✅ Link hasn't expired (1 hour limit)

---

## 🎯 What Happens After Setup

### **User Experience:**

1. **User clicks "Forgot Password"**
   - Modal opens with email input

2. **User enters email**
   - System checks if email exists
   - If not, shows error
   - If yes, sends reset email

3. **User receives email**
   - Beautiful branded ZYNX CAPITAL email
   - Clear "Reset My Password" button
   - Alternative link if button doesn't work
   - Security notice about 1-hour expiration

4. **User clicks reset button**
   - Opens app at `/reset-password`
   - Token automatically captured from URL
   - User enters new password
   - Password updated immediately
   - Redirected to dashboard

5. **Success!**
   - User can login with new password
   - Old password no longer works

---

## 🔒 Security Features

✅ **Email Validation**: Only registered emails can reset  
✅ **1-Hour Expiration**: Links expire automatically  
✅ **One-Time Use**: Each link works only once  
✅ **Secure Tokens**: Cryptographically secure reset tokens  
✅ **No Password in Email**: Only secure link sent  
✅ **Rate Limiting**: Prevents spam/abuse  

---

## 📧 Default Email Settings (Free Tier)

**Supabase Default SMTP:**
- ✅ 3 emails per hour per user
- ✅ 30 emails per hour total
- ✅ Automatic retry on failure
- ✅ Good for development/testing

**Recommended for Production:**
- Use custom SMTP (Gmail, SendGrid, etc.)
- Higher limits (500-5000+ emails/day)
- Better deliverability
- Custom sender domain

---

## 🎊 Summary

**Setup Time**: 5-10 minutes  
**Cost**: FREE (Supabase default or Gmail)  
**Result**: Professional password reset system!

After configuration:
1. Users can reset forgotten passwords
2. Receive beautiful branded emails
3. Secure 1-hour expiration links
4. Seamless user experience
5. Production-ready security

---

## 📞 Need Help?

If emails still don't work after setup:

1. Check Supabase logs: https://supabase.com/dashboard/project/muhztdszuirjqyujsaot/logs/explorer
2. Verify email template is saved
3. Test with different email address
4. Setup custom SMTP (Gmail recommended)
5. Contact Supabase support if needed

---

**Created for**: ZYNX CAPITAL Password Reset System  
**Author**: Joseph Ndungu (josephndungukamau20@gmail.com)  
**Project**: muhztdszuirjqyujsaot.supabase.co
