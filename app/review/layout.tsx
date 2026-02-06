import { headers } from "next/headers";
import ErrorScreen from "../../components/ErrorScreen";

// Strict Googlebot Protection
// "It’s only for Google bot to see"

export default async function ReviewLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";

    // Check strict Googlebot patterns
    // Using patterns matching Google's various crawlers (Search, Image, News, etc)
    const isGoogleBot = /googlebot|mediapartners-google|adsbot-google/i.test(userAgent);

    if (!isGoogleBot) {
        // If not Googlebot, deny access
        // We render the ErrorScreen or simple 404/Access Denied
        // User requested "You are not supposed to view this directly" -> ErrorScreen implies unexpected error or block
        // Or we could return null to show blank, or a dedicated "Page Not Found".
        // Reusing ErrorScreen for consistency with other blocked traffic.
        return <ErrorScreen />;
    }

    return (
        <>
            {children}
        </>
    );
}
