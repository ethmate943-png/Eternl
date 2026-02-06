# Project Implementation Guide

This guide outlines the steps to replicate the location-based blocking, strict referrer checking, and font updates implemented in this project.

## 1. Location-Based Blocking (India & China)

**File:** `utils-backend/userLocation.ts`
*   **Action:** Update the `UserLocationData` interface and `getUserCountry` function to include `country_name`.

```typescript
// utils-backend/userLocation.ts
interface UserLocationData {
  country: string;
  country_name?: string; // Add this specific property
  // ... other existing properties
}

export async function getUserCountry(): Promise<UserLocationData | null> {
  // ... existing fetch logic ...
  // Ensure you handle the API response and map country_name if available
  return { country, country_name: country, ... };
}
```

**File:** `app/ReferrerProvider.tsx`
*   **Action:** Implement the blocking logic inside the `checkAccess` function.

```typescript
// app/ReferrerProvider.tsx

// Inside checkAccess async function:
// 1. Fetch data (fresh, no caching if you want strict immediate updates)
console.log("[ReferrerProvider] Fetching country data...");
const countryData = await getUserCountry();

if (countryData) {
  // 2. Check both 'country' and 'country_name' for robustness
  const userCountryName = countryData.country || countryData.country_name;
  
  // 3. Block specific countries
  if (userCountryName && (userCountryName === "India" || userCountryName === "China")) {
    console.log(`[ReferrerProvider] Access denied: User from ${userCountryName}.`);
    window.location.href = "/blog"; // Redirect to blog or block page
    return;
  }
}
```

## 2. Strict Referrer Checking

**File:** `app/ReferrerProvider.tsx`
*   **Action:** Enforce strict access rules. Users must come from a search engine or be on the allowed list.

```typescript
// app/ReferrerProvider.tsx

// Final render logic in the component:
const ReferrerProvider = ({ children }) => {
  // ... state and checkAccess logic ...

  if (isLoading) return <LoadingScreen />;

  // Allow access ONLY if confirmed bot or from allowed search engine
  if (isVerifiedBot || isFromSearch) {
    return <>{children}</>;
  }

  // Otherwise, show error screen
  return <ErrorScreen />;
};
```

## 3. Blog Page Font Consistency

**File:** `tailwind.config.ts`
*   **Action:** Register the font variable in Tailwind.

```typescript
// tailwind.config.ts
fontFamily: {
  // ...
  satoshi: ["var(--font-satoshi)", "sans-serif"], // Add this
},
```

**File:** `app/blog/page.tsx`
*   **Action:** Apply the font class to headers.

```tsx
// app/blog/page.tsx
<h1 className="... font-satoshi">Eternl Blog</h1>
<h3 className="... font-satoshi">Post Title</h3>
```
