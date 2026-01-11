# 🤖 Bingbot IP Allowlist - Setup Guide

This guide shows you how to configure Cloudflare to always allow Bingbot crawlers from their official IP ranges.

---

## Why This Matters

Search engines like Bing need to crawl your site to index it. If your Cloudflare firewall blocks Bingbot:
- ❌ Your site won't appear in Bing search results
- ❌ You'll lose organic traffic from Bing
- ❌ Your SEO ranking on Bing will suffer

This script creates a firewall rule that **explicitly allows** all traffic from official Microsoft Bingbot IP addresses.

---

## Quick Setup (3 Steps)

### Step 1: Ensure Cloudflare Credentials Are Set

Make sure your `.env` file has:
```bash
CLOUDFLARE_API_TOKEN=your-actual-token-here
CLOUDFLARE_ZONE_ID=your-actual-zone-id-here
```

If not, see the main [CLOUDFLARE_SETUP_GUIDE.md](./CLOUDFLARE_SETUP_GUIDE.md) for how to get these.

### Step 2: Run the Setup Script

```bash
npm run cloudflare:setup:bingbot
```

### Step 3: Verify in Cloudflare Dashboard

1. Go to: [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click your domain
3. Navigate to: **Security → WAF → Firewall rules**
4. Verify **"Allow Official Bingbot IP Ranges"** is at the **top** (Priority 1)

---

## What Gets Created

The script creates **1 firewall rule**:

### Allow Official Bingbot IP Ranges
- **Priority:** 1 (highest - must be first)
- **Action:** Allow
- **IP Ranges:** 28 official Microsoft Bingbot IP ranges
- **Effect:** Bingbot can always access your site, bypassing all other rules

---

## Official Bingbot IP Ranges Included

The script uses the official Microsoft Bingbot IP ranges (as of January 2024):

**Total: 28 IP ranges** including:
- `157.55.39.0/24`
- `207.46.13.0/24`
- `40.77.167.0/24`
- `13.66.139.0/24`
- `13.66.144.0/24`
- `52.167.144.0/24`
- And 22 more...

Full list: [app/scripts/bingbot-ip-ranges.json](./app/scripts/bingbot-ip-ranges.json)

---

## How It Works

1. **Reads IP Ranges**: Script loads official Bingbot IPs from `bingbot-ip-ranges.json`
2. **Builds Condition**: Creates a Cloudflare expression: `(ip.src in {ip1 ip2 ip3...})`
3. **Creates Rule**: Adds firewall rule with priority 1 to allow these IPs
4. **Updates Existing**: If a Bingbot rule already exists, it's updated with latest IPs

---

## Updating Bingbot IP Ranges

Microsoft occasionally updates their Bingbot IP ranges. To update:

### Step 1: Get Latest IP Ranges
Go to: [Microsoft's official Bingbot IP list](https://www.bing.com/toolbox/bingbot.json)

### Step 2: Update the JSON File
Edit `app/scripts/bingbot-ip-ranges.json` with the new IP ranges.

### Step 3: Re-run Setup
```bash
npm run cloudflare:setup:bingbot
```

The script will automatically delete the old rule and create a new one with updated IPs.

---

## Important Notes

> [!IMPORTANT]
> **Priority Order Matters!**
> 
> The Bingbot allowlist rule MUST have priority 1 (be at the top). Otherwise, other blocking rules might prevent Bingbot from accessing your site.

> [!TIP]
> **Works with Other Rules**
> 
> This allowlist works alongside your other Cloudflare security rules:
> - ✅ Bingbot is explicitly allowed (priority 1)
> - ✅ Other bots are still verified (priority 2+)
> - ✅ Fake bots are still blocked
> - ✅ Data center traffic is still blocked

> [!WARNING]
> **Only Use Official IPs**
> 
> Only add IP ranges from Microsoft's official Bingbot documentation. Don't add random IPs claiming to be Bingbot—that defeats the security purpose!

---

## Verifying It Works

### Method 1: Check Cloudflare Events
1. Go to **Security → Events**
2. Filter by **Action: Allow**
3. Look for requests from Bingbot IP addresses
4. Rule name should show: "Allow Official Bingbot IP Ranges"

### Method 2: Test with Bing Webmaster Tools
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site if you haven't already
3. Use the **URL Inspection** tool
4. Bingbot should successfully crawl your pages

### Method 3: Monitor Server Logs
Check your server logs for successful requests from Bingbot user-agents:
- `Mozilla/5.0 (compatible; bingbot/...)`
- `Mozilla/5.0 (compatible; BingPreview/...)`

---

## Troubleshooting

### "Expression too long" error

If you get this error, the IP list might exceed Cloudflare's expression limit (4096 chars).

**Solution:** The script automatically falls back to a user-agent based rule:
```
(http.user_agent contains "bingbot" or http.user_agent contains "BingPreview")
```

This is less precise than IP-based filtering, but it works within Cloudflare's limits.

### Rule not at priority 1

If the Bingbot rule isn't at the top:
1. Go to **Security → WAF → Firewall rules**
2. Drag **"Allow Official Bingbot IP Ranges"** to the top
3. Save changes

### Bingbot still being blocked

Check these:
1. **Rule is enabled:** Firewall rules → verify rule is not paused
2. **Priority is 1:** Rule must be at the top of the list
3. **IP ranges are current:** Run the setup script again with latest IPs
4. **Check Security Events:** See which rule is blocking Bingbot

---

## Manual Setup (If API Fails)

If the script doesn't work, create the rule manually:

1. Go to **Security → WAF → Firewall rules**
2. Click **Create firewall rule**
3. Set these values:
   - **Name:** Allow Official Bingbot IP Ranges
   - **Action:** Allow
   - **Expression:** `(ip.src in {"157.55.39.0/24" "207.46.13.0/24" "40.77.167.0/24" "13.66.139.0/24" "13.66.144.0/24" "52.167.144.0/24" "13.67.10.16/28" "13.69.66.240/28" "13.71.172.224/28" "139.217.52.0/28" "191.233.204.224/28" "20.36.108.32/28" "20.43.120.16/28" "40.79.131.208/28" "40.79.186.176/28" "52.231.148.0/28" "20.79.107.240/28" "51.105.67.0/28" "20.125.163.80/28" "40.77.188.0/22" "65.55.210.0/24" "199.30.24.0/23" "40.77.202.0/24" "40.77.139.0/25" "20.74.197.0/28" "20.15.133.160/27" "40.77.177.0/24" "40.77.178.0/23"})`
4. Click **Deploy**
5. Drag the rule to **position 1** (top of the list)

---

## Related Documentation

- [CLOUDFLARE_SETUP_GUIDE.md](./CLOUDFLARE_SETUP_GUIDE.md) - Main Cloudflare setup
- [bingbot-ip-ranges.json](./app/scripts/bingbot-ip-ranges.json) - Official IP list
- [Microsoft's Bingbot Documentation](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0) - Official Bing crawler info

---

## Summary

✅ **What you get:**
- Bingbot can always crawl your site
- Better Bing SEO and search rankings
- Official Microsoft IP ranges (28 ranges)
- Automatic priority 1 rule placement
- Easy updates when Microsoft changes IPs

✅ **Compatible with:**
- Cloudflare Free plan
- All other firewall rules
- Bot Fight Mode
- Rate limiting rules

🚀 **Run it now:**
```bash
npm run cloudflare:setup:bingbot
```
