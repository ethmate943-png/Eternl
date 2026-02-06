# Task: Implement Location Blocking and Strict Access Control

Please implement the following security and design features in the Next.js application.

## 1. Location-Based Blocking (India & China)

**Objective:** Block access for users located in India or China.

*   **File:** `utils-backend/userLocation.ts` (or equivalent location utility)
    *   Ensure the `getUserCountry` function returns both `country` and `country_name` to handle API inconsistencies.
    *   Interface update:
        ```typescript
        interface UserLocationData {
          country: string;
          country_name?: string; // Add this
          // ...
        }
        ```

*   **File:** `app/ReferrerProvider.tsx` (or main access control component)
    *   In the access check logic:
        1.  Fetch user location (do NOT cache in localStorage, fetch fresh each time).
        2.  Check if `country` OR `country_name` equals "India" or "China".
        3.  If matched, redirect to `/blog` immediately.
        ```typescript
        // Logic snippet
        const countryData = await getUserCountry();
        if (countryData) {
            const countryName = countryData.country || countryData.country_name;
            if (countryName === "India" || countryName === "China") {
                window.location.href = "/blog";
                return;
            }
        }
        ```

## 2. Strict Referrer Checking

**Objective:** Only allow traffic from search engines or valid referrers; block direct access or unknown sources.

*   **File:** `app/ReferrerProvider.tsx`
    *   Maintain a whitelist of search engine domains (Google, Bing, Yahoo, etc.).
    *   Check `document.referrer` against this list.
    *   **Logic:**
        *   If `isVerifiedBot` (Googlebot, etc.) -> **Allow**.
        *   If `isFromSearch` (referrer matches whitelist) -> **Allow**.
        *   Otherwise -> **Block** (render `<ErrorScreen />`).

## 3. Font Updates

*   **File:** `tailwind.config.ts`
    *   Add `satoshi` to the font family: `satoshi: ["var(--font-satoshi)", "sans-serif"]`.
*   **File:** `app/blog/page.tsx`
    *   Update `h1` and `h3` headers to use the `font-satoshi` class.

## 4. Verification
*   Ensure users from blocked countries are redirected.
*   Ensure users accessing directly (no referrer) see the Error Screen.
*   Ensure valid search traffic works normally.
