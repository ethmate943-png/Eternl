import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "500",
});
const satoshi = localFont({
  src: "../public/fonts/satoshi/Satoshi-Variable.woff",
  variable: "--font-satoshi",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "500",
});

const inter = Inter({
  display: "swap",
  variable: "--inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Eternl Wallet | Secure Cardano Wallet for ADA, NFTs & dApps",
  description:
    "Eternl Wallet is a non-custodial Cardano light wallet for managing ADA, native tokens, and NFTs. Learn how Eternl works, its security model, and how to safely use it within the Cardano ecosystem.",
  icons: "/brand/eternlll.ico",
  keywords: "eternl wallet, eternl, etrnl wallet, etrnl, eternal wallet",
  metadataBase: new URL("https://eternl-wallet.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Server-side bot detection
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} ${inter.variable} antialiased`}
      >
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          theme="colored"
        />

        {children}
      </body>
    </html>
  );
}
