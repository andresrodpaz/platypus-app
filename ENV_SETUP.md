# Environment Variables Setup Guide

## Grok AI API Key (Optional but Recommended)

The Platypus QA Lab uses xAI's Grok for AI-powered API response analysis. Without this key, the app will use fallback humorous responses.

### Required Environment Variable

\`\`\`bash
GROK_XAI_API_KEY=xai-your-grok-api-key-here
# OR
XAI_API_KEY=xai-your-grok-api-key-here
\`\`\`

**Note:** The app accepts both `GROK_XAI_API_KEY` and `XAI_API_KEY`. Use whichever is already configured in your project.

---

## How to Get Your Grok API Key

### Step 1: Create xAI Account
1. Go to https://console.x.ai
2. Sign up with your email or X (Twitter) account
3. Verify your email address

### Step 2: Generate API Key
1. Go to https://console.x.ai/api-keys
2. Click "Create API Key"
3. Give it a name (e.g., "Platypus QA Lab")
4. Copy the key immediately (you won't see it again!)
5. Store it securely

---

## Adding to v0 / Vercel

### In v0 Chat Interface:
1. Click the **Vars** section in the left sidebar
2. Click "Add Variable"
3. Enter:
   - **Name:** `GROK_XAI_API_KEY` (or `XAI_API_KEY`)
   - **Value:** Your Grok API key (starts with `xai-`)
4. Click "Save"
5. The app will automatically use the key

### In Vercel Dashboard:
1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Click "Add New"
4. Enter:
   - **Key:** `GROK_XAI_API_KEY` (or `XAI_API_KEY`)
   - **Value:** Your Grok API key
   - **Environment:** Production, Preview, Development (select all)
5. Click "Save"
6. Redeploy your project for changes to take effect

---

## Local Development

If running locally, create a `.env.local` file in your project root:

\`\`\`bash
# .env.local
GROK_XAI_API_KEY=xai-your-grok-api-key-here
# OR
XAI_API_KEY=xai-your-grok-api-key-here
\`\`\`

**Important:** 
- Never commit `.env.local` to git!
- The `.gitignore` file already excludes it
- Restart your dev server after adding the key

---

## Testing the Integration

### With API Key:
1. Go to `/playground`
2. Send any API request
3. You should see AI-powered analysis with detailed insights from Grok
4. Look for "AI Model: grok-beta" in the response
5. Grok provides witty, technically accurate analysis

### Without API Key:
1. The app will show: "Using fallback - add GROK_XAI_API_KEY for AI analysis"
2. You'll still get humorous comments, but they're predefined
3. No personalized AI insights from Grok

---

## Cost Estimates

xAI Grok pricing:
- **Grok Beta:** Competitive pricing with other AI models
- **Pay-as-you-go:** Only pay for what you use

**Typical usage:**
- Each API analysis: ~200-300 tokens
- Very affordable for testing purposes
- Check https://console.x.ai/pricing for current rates

**Recommendation:** Start with a small credit amount to test the integration.

---

## Troubleshooting

### "Grok API key not configured" or "API key is missing"
- Add `GROK_XAI_API_KEY` or `XAI_API_KEY` to your environment variables
- Restart your development server
- Check the Vars section in v0 sidebar
- Verify the key starts with `xai-`

### "Invalid API key"
- Check that your key starts with `xai-`
- Verify it's copied correctly (no extra spaces)
- Ensure the key hasn't been revoked in xAI console

### "Rate limit exceeded"
- You've hit xAI's rate limit
- Wait a few minutes and try again
- Check your usage in the xAI console

### AI analysis not showing
- Check browser console for errors (F12)
- Verify the key is set in environment variables
- Restart your development server
- Check that `/api/analyze` endpoint is working

---

## Security Best Practices

1. **Never expose your API key:**
   - Don't commit to git
   - Don't share in screenshots
   - Don't log it in console

2. **Use environment variables:**
   - Always use `process.env.GROK_XAI_API_KEY` or `process.env.XAI_API_KEY`
   - Never hardcode keys in source code

3. **Rotate keys regularly:**
   - Generate new keys every few months
   - Revoke old keys in xAI console

4. **Monitor usage:**
   - Check xAI console for unexpected usage
   - Set up usage alerts if available

5. **Limit key permissions:**
   - Use separate keys for dev/prod
   - Revoke keys when no longer needed

---

## Alternative: Use Without AI

The app works perfectly without Grok! You'll get:
- ✅ All API testing features
- ✅ Humorous predefined comments
- ✅ Status code analysis
- ✅ Performance metrics
- ❌ No personalized AI insights from Grok
- ❌ No context-aware recommendations

To use without AI, simply don't add the `GROK_XAI_API_KEY` or `XAI_API_KEY` variable.

---

## Why Grok?

Grok by xAI offers:
- 🎭 Witty and entertaining responses
- 🧠 Technically accurate analysis
- ⚡ Fast response times
- 💰 Competitive pricing
- 🔄 Regular model updates

Perfect for a QA tool that needs both humor and technical depth!

---

## Other Environment Variables

All Supabase environment variables are automatically configured in v0:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- And more...

You don't need to configure these manually.

---

## Need Help?

- xAI Console: https://console.x.ai
- xAI Documentation: https://docs.x.ai
- Vercel Support: https://vercel.com/help

**Built with ❤️ by the Platypus QA Team 🦦**
