# 🧪 Testing Your Cloudflare Setup

Follow these steps to test your Cloudflare configuration.

---

## Step 1: Test API Connection

Run the test script to verify your API token and Zone ID:

```bash
npm run cloudflare:test
```

**Expected Success Output:**
```
🧪 Testing Cloudflare API...

Token: d1COvOc2Gs...
Zone ID: 2a4f8e26de40eacffa78bc4e0d9ddda8

1️⃣ Testing API token...
✅ Token valid for: your-email@example.com

2️⃣ Testing zone access...
✅ Zone accessible: yourdomain.com (active)

3️⃣ Checking existing firewall rules...
✅ Found 0 existing firewall rules

✅ All API tests passed! Your API token is working correctly.
```

---

## Step 2: If Test Fails - Troubleshooting

### ❌ "Token invalid: Invalid API Token"

**Possible causes:**
1. Token was copied incorrectly (extra spaces, missing characters)
2. Token was revoked or expired
3. Token doesn't have correct permissions

**Fix:**
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Create a **new token** with these permissions:
   - **Zone** → **Firewall Rules** → **Edit**
   - **Zone** → **Zone** → **Read**
3. Copy the **entire token** (it's long!)
4. Update your `.env` file:
   ```bash
   CLOUDFLARE_API_TOKEN=your-new-token-here
   ```
5. Make sure there are **no spaces** around the `=` sign
6. Run test again: `npm run cloudflare:test`

---

### ❌ "Zone access failed"

**Possible causes:**
1. Zone ID is incorrect
2. Token doesn't have access to this zone
3. Zone ID has extra spaces

**Fix:**
1. Go to: https://dash.cloudflare.com
2. Click your domain
3. Scroll to **"API"** section
4. Copy the **Zone ID** (should be 32 characters)
5. Update your `.env` file:
   ```bash
   CLOUDFLARE_ZONE_ID=your-zone-id-here
   ```
6. Make sure there are **no spaces** around the `=` sign
7. Run test again: `npm run cloudflare:test`

---

## Step 3: Run the Full Setup

Once the test passes, run the setup:

```bash
npm run cloudflare:setup:free
```

**Expected Output:**
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

## Step 4: Verify in Dashboard

1. Go to: https://dash.cloudflare.com
2. Click your domain
3. Navigate to: **Security → WAF → Firewall rules**
4. You should see 3 new rules:
   - ✅ **Allow Verified Bots** (Priority 1)
   - ✅ **Block Fake Googlebots** (Priority 2)
   - ✅ **Block Data Center Traffic** (Priority 3)

---

## Step 5: Test Security Events

1. In Cloudflare Dashboard: **Security → Events**
2. Filter by: **Action = "Block"**
3. You should see blocked traffic appearing (may take a few minutes)

---

## Step 6: Test Bot Protection (Optional)

You can test if fake bots are being blocked:

```bash
# This will make a request with a fake Googlebot user agent
node app/scripts/test-fake-bot.mjs
```

Or manually test:
1. Use a tool like Postman or curl
2. Make a request to your site with header:
   ```
   User-Agent: Googlebot/2.1
   ```
3. If the rule is working, you should see it blocked in Security Events

---

## ✅ Quick Test Checklist

- [ ] API token test passes (`npm run cloudflare:test`)
- [ ] Zone access test passes
- [ ] Setup script runs successfully (`npm run cloudflare:setup:free`)
- [ ] 3 rules appear in Cloudflare Dashboard
- [ ] Rules are in correct order (Allow Verified Bots first)
- [ ] Security Events show blocked traffic

---

## 🔧 Common Issues

### Issue: "Missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID"
**Solution:** Make sure `.env` file exists in project root with both variables

### Issue: "API format error (code 10014)"
**Solution:** Free plan may have API limitations. Create rules manually in dashboard.

### Issue: "Rule limit reached"
**Solution:** Free plan allows ~5 rules. Delete old rules first.

---

**Need more help?** Check `CLOUDFLARE_SETUP_GUIDE.md` for detailed setup instructions.












