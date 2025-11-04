# Email Configuration Guide

This guide explains how to set up email notifications for the Platypus QA Lab.

## Overview

The application uses **Resend** for sending transactional emails. Resend is a modern email API that's easy to set up and has a generous free tier.

## Features

- Test failure notifications when scheduled tests fail
- Beautiful HTML email templates with test results
- Direct links to view full test reports
- Automatic email sending via cron jobs

## Setup Instructions

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Platypus QA Lab")
5. Copy the API key (it starts with `re_`)

### 3. Add the API Key to Your Project

Add the following environment variable to your project:

\`\`\`bash
RESEND_API_KEY=re_your_actual_api_key_here
\`\`\`

**In v0 (Recommended):**
- Open the left sidebar in your v0 chat
- Click on **Vars** (Variables section)
- Click **Add Variable**
- Name: `RESEND_API_KEY`
- Value: Paste your Resend API key (starts with `re_`)
- Click **Save**

**In Production (Vercel):**
- Go to your Vercel project settings
- Navigate to **Environment Variables**
- Add `RESEND_API_KEY` with your key
- Redeploy your application

### 4. Configure Your Domain (Optional but Recommended)

For production use, you should verify your domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `platypuslab.dev`)
4. Add the DNS records provided by Resend
5. Wait for verification (usually takes a few minutes)

Once verified, update the `from` address in `lib/email.ts`:

\`\`\`typescript
from: 'Platypus QA Lab <notifications@yourdomain.com>',
\`\`\`

### 5. Test Email Sending

To test if emails are working:

1. Create a test suite in the Playground
2. Go to Monitoring and create a scheduled test
3. Add your email address in the "Notification Email" field
4. Set the schedule to run soon
5. Wait for the test to run and check your inbox

## Email Templates

The application includes a professional HTML email template with:

- Gradient header with Platypus branding
- Test results summary table
- Pass/fail counts with color coding
- Direct link to view full report
- Humorous Platypus philosophy quote

## Resend Free Tier

Resend's free tier includes:

- 3,000 emails per month
- 100 emails per day
- All features included
- No credit card required

This is more than enough for most QA teams!

## Troubleshooting

### Emails Not Sending

1. **Check API Key**: Make sure `RESEND_API_KEY` is set correctly
2. **Check Logs**: Look for `[v0]` logs in your console
3. **Verify Domain**: If using a custom domain, ensure DNS is configured
4. **Check Spam**: Test emails might end up in spam folder

### Common Issues

**"Invalid API key"**
- Double-check your API key in environment variables
- Make sure there are no extra spaces or quotes

**"Domain not verified"**
- Use the default Resend domain for testing
- Or complete domain verification in Resend dashboard

**"Rate limit exceeded"**
- You've hit the daily limit (100 emails on free tier)
- Wait 24 hours or upgrade your plan

## Alternative Email Services

While we recommend Resend, you can also use:

- **SendGrid**: Popular but more complex setup
- **Mailgun**: Good for high volume
- **AWS SES**: Cost-effective for large scale
- **Postmark**: Great deliverability

To use a different service, modify `lib/email.ts` accordingly.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Rotate keys regularly** if compromised
4. **Monitor usage** in Resend dashboard
5. **Validate email addresses** before sending

## Support

For Resend-specific issues:
- Documentation: [resend.com/docs](https://resend.com/docs)
- Support: [resend.com/support](https://resend.com/support)

For Platypus QA Lab issues:
- Check the application logs
- Review the email sending code in `lib/email.ts`
- Test with the cron job endpoint directly
\`\`\`

\`\`\`json file="" isHidden
