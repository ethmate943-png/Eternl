# 🚀 Cloudflare Security Rules - Quick Setup Guide

Follow these steps to set up your Cloudflare firewall rules.

---

## Step 1: Get Your Cloudflare API Token

1. Go to: **https://dash.cloudflare.com/profile/api-tokens**
2. Click **"Create Token"**
3. Click **"Edit zone DNS"** template (or create custom)
4. Set these permissions:
   - **Zone** → **Firewall Rules** → **Edit**
   - **Zone** → **Zone** → **Read**
5. Select your domain in **Zone Resources**
6. Click **"Continue to summary"** → **"Create Token"**
7. **Copy the token** (you won't see it again!)

---

## Step 2: Get Your Zone ID

1. Go to: **https://dash.cloudflare.com**
2. Click on **your domain**
3. Scroll down to **"API"** section (right sidebar)
4. Find **"Zone ID"** and **copy it**

---

## Step 3: Create Your .env File

1. In your project root, create a file named `.env`
2. Add these two lines (replace with your actual values):

```bash
CLOUDFLARE_API_TOKEN=your-actual-token-here
CLOUDFLARE_ZONE_ID=your-actual-zone-id-here
```

**Example:**
```bash
CLOUDFLARE_API_TOKEN=abc123xyz789...
CLOUDFLARE_ZONE_ID=def456uvw012...
```

⚠️ **Important:** Never commit `.env` to git! It's already in `.gitignore`.

---

## Step 4: Run the Setup Script

Open your terminal in the project directory and run:

```bash
npm run cloudflare:setup:free
```

**Expected output:**
```
✅ Zone verified: yourdomain.com
✅ Created: Allow Verified Bots
✅ Created: Block Fake Googlebots
✅ Created: Block Data Center Traffic

==================================================
✅ Setup complete! 3/3 rules created.
==================================================
```

---

## Step 5: Verify in Cloudflare Dashboard

1. Go to: **https://dash.cloudflare.com**
2. Click your domain
3. Navigate to: **Security → WAF → Firewall rules**
4. You should see 3 rules:
   - ✅ **Allow Verified Bots** (Priority 1 - at the top)
   - ✅ **Block Fake Googlebots** (Priority 2)
   - ✅ **Block Data Center Traffic** (Priority 3)

---

## Step 6: Enable Bot Fight Mode (Optional but Recommended)

1. In Cloudflare Dashboard: **Security → Bots**
2. Enable **"Bot Fight Mode"** (free feature)
3. This adds extra protection

---

## ✅ You're Done!

Your site is now protected with:
- ✅ Real search engine bots allowed (Google, Bing, etc.)
- ✅ Fake bots blocked
- ✅ Data center traffic blocked

---

## 🔧 Troubleshooting

### "Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID"
- Make sure `.env` file exists in project root
- Check that both variables are set correctly
- No spaces around the `=` sign

### "Cannot access zone"
- Verify your API token has correct permissions
- Check that Zone ID is correct
- Make sure token hasn't expired

### "API format error (code 10014)"
- Free plan may have API limitations
- **Solution:** Create rules manually in dashboard:
  1. Security → WAF → Firewall rules → Create rule
  2. Use the conditions from the script
  3. Set priorities: 1, 2, 3

### Rules not showing up
- Wait 2-3 minutes for propagation
- Refresh the dashboard
- Check Security → Events for activity

---

## 📝 Manual Rule Creation (If API Fails)

If the script doesn't work, create rules manually:

### Rule 1: Allow Verified Bots
- **Name:** Allow Verified Bots
- **Priority:** 1
- **Action:** Allow
- **Condition:** `(cf.client.bot)`

### Rule 2: Block Fake Googlebots
- **Name:** Block Fake Googlebots
- **Priority:** 2
- **Action:** Block
- **Condition:** `(http.user_agent contains "Googlebot" and not cf.client.bot)`

### Rule 3: Block Data Center Traffic
- **Name:** Block Data Center Traffic
- **Priority:** 3
- **Action:** Block
- **Condition:** `(ip.geoip.asnum in {16509 14061 8075 16276})`

---

**Need help?** Check the main checklist document for more details.


