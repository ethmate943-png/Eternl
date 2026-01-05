# 🧪 Testing Bot Detection

Here are several ways to test if bot detection is working correctly.

---

## Method 1: Test API Endpoint Directly

### Using Browser DevTools

1. Open your site in the browser
2. Open DevTools (F12)
3. Go to **Console** tab
4. Run this command:

```javascript
fetch('/api/verify-bot')
  .then(r => r.json())
  .then(data => console.log('Bot Detection Result:', data));
```

**Expected Output:**
- If you're a regular user: `{ isBot: false, ... }`
- If you're a bot: `{ isBot: true, matchesBotUA: true, ... }`

---

## Method 2: Simulate Googlebot with curl

Open your terminal and run:

```bash
# Test as Googlebot
curl -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" http://localhost:3000/api/verify-bot

# Test as regular browser
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" http://localhost:3000/api/verify-bot
```

**Expected:**
- Googlebot request should return `"isBot": true`
- Regular browser should return `"isBot": false`

---

## Method 3: Test in Browser with User-Agent Override

### Chrome/Edge:
1. Open DevTools (F12)
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Show Network conditions"
4. Check "User agent" and select "Googlebot" or enter custom:
   ```
   Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
   ```
5. Refresh the page
6. Check console logs for bot detection messages

### Firefox:
1. Open DevTools (F12)
2. Go to **Settings** (gear icon)
3. Check "Enable user agent override"
4. Enter custom user agent:
   ```
   Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
   ```
5. Refresh the page

**What to look for:**
- Console should show: `[ReferrerProvider] Verified bot detected via API, allowing access.`
- You should see the main page content, not the error screen

---

## Method 4: Check Console Logs

1. Open your site
2. Open DevTools Console (F12)
3. Look for these log messages:

**For Regular Users:**
```
[ReferrerProvider] Current URL: ...
[ReferrerProvider] Referrer URL: ...
[ReferrerProvider] User did NOT come from a search engine or allowed referrer.
[ReferrerProvider] Bot verification API failed, using UA fallback: ...
[ReferrerProvider] Access denied: showing error screen.
```

**For Bots:**
```
[ReferrerProvider] Current URL: ...
[ReferrerProvider] Referrer URL: ...
[ReferrerProvider] Verified bot detected via API, allowing access.
[ReferrerProvider] Bot details: { isCloudflareVerified: ..., matchesBotUA: true, ... }
[ReferrerProvider] Access allowed.
```

---

## Method 5: Test Script (Node.js)

Create a test file and run it:

```bash
node test-bot-detection.mjs
```

---

## Method 6: Test with Postman/Insomnia

1. Create a GET request to: `http://localhost:3000/api/verify-bot`
2. Add header:
   - **Key:** `User-Agent`
   - **Value:** `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`
3. Send request
4. Check response - should return `"isBot": true`

---

## Method 7: Test Production (if deployed)

### Using curl:
```bash
# Replace with your actual domain
curl -H "User-Agent: Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://yourdomain.com/api/verify-bot
```

### Using Google Search Console:
1. Go to Google Search Console
2. Use **URL Inspection Tool**
3. Enter your URL
4. Click "Test Live URL"
5. This will show you what Googlebot actually sees

---

## ✅ Expected Results

### ✅ Bot Should See Main Page:
- User-Agent matches bot patterns
- API returns `isBot: true`
- Console shows "Verified bot detected"
- Main page content is displayed

### ❌ Regular User Should See Error Screen:
- User-Agent doesn't match bot patterns
- No valid referrer from search engine
- API returns `isBot: false`
- Console shows "Access denied"
- ErrorScreen component is displayed

---

## 🔍 Debugging Tips

1. **Check API Response:**
   ```javascript
   // In browser console
   fetch('/api/verify-bot').then(r => r.json()).then(console.log)
   ```

2. **Check User Agent:**
   ```javascript
   // In browser console
   console.log('User Agent:', navigator.userAgent);
   ```

3. **Check Referrer:**
   ```javascript
   // In browser console
   console.log('Referrer:', document.referrer);
   ```

4. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for `/api/verify-bot` request
   - Check request headers (especially User-Agent)
   - Check response body

---

## 🐛 Common Issues

### Issue: Bot still seeing error screen
**Solution:**
- Check console logs for bot detection messages
- Verify API endpoint is working: `fetch('/api/verify-bot').then(r => r.json()).then(console.log)`
- Make sure User-Agent is being sent correctly

### Issue: API returns `isBot: false` for real bots
**Solution:**
- Check if User-Agent pattern matches
- Verify the API route is accessible
- Check server logs for errors

### Issue: Regular users can access the site
**Solution:**
- This is expected if they come from a search engine
- Check referrer in console logs
- Verify ErrorScreen is showing for direct visits

---

**Need more help?** Check the console logs - they provide detailed information about what's happening!





