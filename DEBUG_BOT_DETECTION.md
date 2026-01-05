# 🐛 Debugging Bot Detection

If Googlebot is still seeing the error screen, follow these steps:

## Step 1: Check What the API Returns

Open your browser console and run:

```javascript
fetch('/api/verify-bot')
  .then(r => r.json())
  .then(data => {
    console.log('=== BOT DETECTION DEBUG ===');
    console.log('Is Bot:', data.isBot);
    console.log('Matches Bot UA:', data.matchesBotUA);
    console.log('Might Be Googlebot Smartphone:', data.mightBeGooglebotSmartphone);
    console.log('Has Cloudflare Headers:', data.hasCloudflareHeaders);
    console.log('User Agent:', data.userAgent);
    console.log('CF-Ray:', data.hasCfRay);
    console.log('========================');
  });
```

## Step 2: Check Console Logs

Look for these messages in the browser console:

```
[ReferrerProvider] Verified bot detected via API, allowing access.
```

OR

```
[ReferrerProvider] Not detected as bot. Details: { ... }
```

## Step 3: Test with Googlebot User Agent

1. Open DevTools (F12)
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Show Network conditions"
4. Check "User agent" and enter:
   ```
   Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1
   ```
5. Refresh the page
6. Check console logs

## Step 4: Check if Cloudflare is Active

In production, check if you have Cloudflare headers:

```javascript
fetch('/api/verify-bot')
  .then(r => r.json())
  .then(data => {
    if (!data.hasCloudflareHeaders) {
      console.warn('⚠️ No Cloudflare headers detected! Are you behind Cloudflare?');
    }
  });
```

## Common Issues:

### Issue 1: Testing in Development
- **Problem:** No Cloudflare headers in development
- **Solution:** The code is more permissive in production. Test in production or temporarily allow mobile browsers in dev.

### Issue 2: Cloudflare Not Active
- **Problem:** Site not behind Cloudflare
- **Solution:** Make sure your domain is proxied through Cloudflare (orange cloud in DNS settings)

### Issue 3: User Agent Not Matching
- **Problem:** Googlebot using a user agent we don't recognize
- **Solution:** Check the actual user agent in the API response and add it to patterns if needed

## Quick Fix: Temporarily Allow All Mobile Browsers (for testing only)

If you need to test quickly, you can temporarily modify the API route to be more permissive. But **remove this before production!**




