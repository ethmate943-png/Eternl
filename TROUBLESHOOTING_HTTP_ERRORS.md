# 🔧 Troubleshooting HTTP 400-499 Errors

## Problem
Your SEO tool reports that `https://eternl-wallet.com` is returning HTTP 400-499 errors instead of 200 OK.

---

## Most Likely Causes

### 1. ⚠️ Cloudflare Firewall Rules Too Strict

**Symptoms:**
- Homepage returns 403 Forbidden
- Legitimate users/bots are blocked
- Issues started after setting up Cloudflare firewall

**How to Check:**
1. Go to [Cloudflare Dashboard → Security → Events](https://dash.cloudflare.com)
2. Filter by: Action = Block
3. Check if legitimate traffic is being blocked

**How to Fix:**

#### Option A: Adjust Rule Priority
1. Go to **Security → WAF → Firewall rules**
2. Ensure rules are in this order:
   - Priority 1: **Allow Official Bingbot IP Ranges** (or Allow Verified Bots)
   - Priority 2: Block fake googlebots
   - Priority 3+: Other blocking rules

#### Option B: Temporarily Disable Strict Rules
1. Go to **Security → WAF → Firewall rules**
2. **Pause** the "Block Data Center Traffic" rule
3. **Pause** the "Block Fake Googlebots" rule (temporarily)
4. Test if homepage loads with 200 OK
5. Re-enable rules one by one to find the culprit

---

### 2. 🔒 SSL/TLS Configuration Issue

**Symptoms:**
- Site shows "Your connection is not private"
- Mixed SSL modes
- Certificate errors

**How to Fix:**
1. Go to **SSL/TLS → Overview**
2. Set encryption mode to: **Full (strict)**
3. Wait 5-10 minutes for propagation
4. Test again

---

### 3. 🚦 Rate Limiting Too Aggressive

**Symptoms:**
- Users get 429 Too Many Requests
- Crawlers can't access site
- Error happens intermittently

**How to Fix:**
1. Go to **Security → WAF → Rate limiting rules**
2. Check if you have rules for `/` (homepage)
3. Either:
   - Increase the threshold (e.g., from 30 to 100 requests/minute)
   - Exclude homepage from rate limiting
   - Add exception for verified bots

---

### 4. 🌐 DNS/CDN Caching Issue

**Symptoms:**
- Site works on some networks but not others
- Old version of site still showing
- Intermittent errors

**How to Fix:**
1. Go to **Caching → Configuration**
2. Click **Purge Everything**
3. Wait 2-3 minutes
4. Test again

---

### 5. ❌ Hosting/Deployment Issue

**Symptoms:**
- Site doesn't load at all
- Consistent errors across all users
- Recent deployment changes

**How to Fix:**
1. Check your hosting platform (Vercel/Netlify/etc.)
2. Verify deployment succeeded
3. Check deployment logs for errors
4. Redeploy if necessary

---

## Quick Diagnostic Steps

### Step 1: Test Your Site Directly
```bash
curl -I https://eternl-wallet.com
```

**Expected Output:**
```
HTTP/2 200 OK
```

**If you see 403, 404, or other error:**
- 403 → Cloudflare is blocking
- 404 → Page not found (routing issue)
- 429 → Rate limiting
- 503 → Server/hosting issue

### Step 2: Test Without Cloudflare
1. Find your origin server IP
2. Add to hosts file (temporarily):
   ```
   123.456.789.012 eternl-wallet.com
   ```
3. Visit site
4. If it works → Cloudflare is the issue
5. If it doesn't → Hosting/server issue

### Step 3: Check Cloudflare Security Events
1. Go to **Security → Events**
2. Look for blocked requests to `/`
3. Check the reason: Firewall rule, Bot Fight Mode, etc.
4. Adjust accordingly

---

## Recommended Solution (Most Common Fix)

### If Cloudflare is blocking legitimate traffic:

1. **Update "Allow Verified Bots" rule to be FIRST:**
   ```
   Go to Security → WAF → Firewall rules
   Drag "Allow Official Bingbot IP Ranges" (or "Allow Verified Bots") to the TOP
   ```

2. **Whitelist your homepage from aggressive rules:**
   
   Create a new rule:
   - Name: `Allow Homepage Access`
   - Priority: 1 (highest)
   - Expression: `(http.request.uri.path eq "/")`
   - Action: Allow

3. **Adjust Bot Fight Mode (if enabled):**
   ```
   Go to Security → Bots
   Set "Bot Fight Mode" to "Invisible" (instead of "Definite")
   ```

4. **Add exception for SEO tools:**
   
   If you're using SEMrush, Ahrefs, Screaming Frog, etc:
   - Create allow rule for their user-agents
   - Or temporarily disable blocking while testing

---

## Verification

After making changes:

1. **Wait 2-3 minutes** for Cloudflare to propagate changes

2. **Test with curl:**
   ```bash
   curl -I https://eternl-wallet.com
   ```
   Should return: `HTTP/2 200 OK`

3. **Test with different user-agents:**
   ```bash
   # Test as Googlebot
   curl -I -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://eternl-wallet.com
   
   # Test as Bingbot
   curl -I -A "Mozilla/5.0 (compatible; bingbot/2.0)" https://eternl-wallet.com
   ```

4. **Check in browser:**
   - Open https://eternl-wallet.com in incognito mode
   - Open DevTools (F12) → Network tab
   - Reload page
   - Check status code (should be 200)

5. **Check with SEO tool:**
   - Re-run your SEO audit
   - Verify homepage now shows 200 OK

---

## Still Having Issues?

### Debug Checklist

- [ ] Cloudflare "Allow Verified Bots" rule is FIRST (priority 1)
- [ ] Homepage loads in browser
- [ ] curl shows 200 OK status
- [ ] No firewall rules blocking `/` path
- [ ] SSL/TLS is set to Full (strict)
- [ ] Latest deployment is successful
- [ ] DNS is properly configured
- [ ] No active DDoS protection blocking traffic

### Contact Support

If none of these work:
1. Take screenshots of all Cloudflare firewall rules
2. Share curl output showing error
3. Check your hosting platform's status page
4. Contact Cloudflare support with details

---

## Prevention

To avoid this in the future:

1. **Always test firewall rules** before applying to production
2. **Monitor Cloudflare Security Events** regularly
3. **Use Cloudflare's testing mode** for new rules
4. **Keep your sitemap updated** so crawlers know what pages exist
5. **Set up uptime monitoring** (e.g., UptimeRobot, Pingdom)

---

## Quick Reference

| Error Code | Meaning | Likely Cause | Quick Fix |
|------------|---------|--------------|-----------|
| 400 | Bad Request | Malformed request | Check headers/redirects |
| 401 | Unauthorized | Auth required | Remove auth from homepage |
| 403 | Forbidden | Cloudflare blocking | Adjust firewall rules |
| 404 | Not Found | Page missing | Check routing/deployment |
| 429 | Too Many Requests | Rate limiting | Increase limits |
| 451 | Legal Reasons | Geo-blocking | Update geo rules |

---

Good luck! 🚀
