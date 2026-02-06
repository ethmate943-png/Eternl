import { headers } from "next/headers";
import Navbar from "../../components/Navbar";
import ReffererProvider from "./ReffererProvider";

export default async function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Server-side bot detection (moved from root layout)
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";

    // Check for common bots
    const isBot = /googlebot|bingbot|msnbot|bingpreview|adidxbot|slurp|duckduckbot|baiduspider|yandexbot/i.test(userAgent);

    return (
        <ReffererProvider isBot={isBot}>
            <Navbar />
            {children}
        </ReffererProvider>
    );
}
