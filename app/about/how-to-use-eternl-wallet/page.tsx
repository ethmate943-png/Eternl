import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "How to Use Eternl Wallet | Step-by-Step Guide",
    description:
        "A comprehensive step-by-step guide on how to use Eternl Wallet for ADA, NFTs, and DeFi.",
};

const guides = [
    {
        step: 1,
        title: "Install Eternl Wallet",
        content: (
            <>
                <p>
                    Eternl Wallet can be used as a browser extension or via its web
                    interface.
                </p>
                <p className="mt-2 font-semibold">How to install:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Visit the official Eternl Wallet website</li>
                    <li>Choose the browser extension or web version</li>
                    <li>Add the extension to your browser</li>
                </ol>
            </>
        ),
        image: "/images/how-to-use-eternl-wallet/step-1.png",
    },
    {
        step: 2,
        title: "Create a New Wallet or Restore an Existing One",
        content: (
            <>
                <p>
                    Once installed, you can either create a new wallet or restore one
                    using an existing recovery phrase.
                </p>
                <p className="mt-2 font-semibold">Creating a new wallet:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Click Create Wallet</li>
                    <li>Set a strong spending password</li>
                    <li>Write down your recovery phrase securely (offline only)</li>
                </ul>
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                        ⚠️ <strong>Warning:</strong> Never share your recovery phrase.
                        Losing it means losing access to your funds permanently.
                    </p>
                </div>
            </>
        ),
        image: "/images/how-to-use-eternl-wallet/step-2.png",
    },
    {
        step: 3,
        title: "Secure Your Eternl Wallet",
        content: (
            <>
                <p>Security is a critical part of using Eternl Wallet correctly.</p>
                <p className="mt-2 font-semibold">Recommended actions:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Store recovery phrase offline</li>
                    <li>Use a unique, strong password</li>
                    <li>Enable hardware wallet integration if available</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400">
                    Eternl supports Ledger and Trezor hardware wallets, allowing private
                    keys to remain offline while still accessing Web3 features.
                </p>
            </>
        ),
        image: "/images/how-to-use-eternl-wallet/step-3.png",
    },
    {
        step: 4,
        title: "Add ADA to Eternl Wallet",
        content: (
            <>
                <p>
                    To use Eternl Wallet, you need ADA for transactions and network fees.
                </p>
                <p className="mt-2 font-semibold">How to receive ADA:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Open your wallet</li>
                    <li>Click Receive</li>
                    <li>Copy your Cardano address</li>
                    <li>Send ADA from an exchange or another wallet</li>
                </ol>
            </>
        ),
        image: "/images/how-to-use-eternl-wallet/step-4.png",
    },
    {
        step: 5,
        title: "Send ADA or Tokens",
        content: (
            <>
                <p>Sending ADA or Cardano-native tokens is straightforward.</p>
                <p className="mt-2 font-semibold">How to send assets:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Click Send</li>
                    <li>Enter the recipient’s address</li>
                    <li>Choose amount</li>
                    <li>Review transaction details</li>
                    <li>Confirm and submit</li>
                </ol>
                <p className="mt-2 text-sm text-gray-400">
                    Always double-check addresses before confirming.
                </p>
            </>
        ),
        image: "/images/how-to-use-eternl-wallet/step-5.png",
    },
    {
        step: 6,
        title: "Stake ADA Using Eternl Wallet",
        content: (
            <>
                <p>
                    Eternl Wallet offers advanced staking controls, allowing users to
                    choose stake pools directly.
                </p>
                <p className="mt-2 font-semibold">How to stake ADA:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Open the Staking section</li>
                    <li>Browse available stake pools</li>
                    <li>Review pool performance and fees</li>
                    <li>Delegate your ADA</li>
                </ol>
                <p className="mt-2 text-sm text-gray-400">
                    Staking rewards are automatically distributed by the Cardano network.
                </p>
            </>
        ),
    },
    {
        step: 7,
        title: "Manage NFTs in Eternl Wallet",
        content: (
            <>
                <p>Eternl Wallet fully supports Cardano-native NFTs.</p>
                <p className="mt-2 font-semibold">Users can:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>View NFT collections</li>
                    <li>Send and receive NFTs</li>
                    <li>Manage metadata</li>
                </ul>
                <p className="mt-2 text-sm text-gray-400">
                    This makes Eternl ideal for NFT collectors and creators within the
                    Cardano ecosystem.
                </p>
            </>
        ),
    },
    {
        step: 8,
        title: "Connect Eternl Wallet to Cardano DeFi Apps",
        content: (
            <>
                <p>
                    Eternl Wallet acts as a gateway to Cardano Web3 and DeFi applications.
                </p>
                <p className="mt-2 font-semibold">How to connect:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Visit a Cardano dApp</li>
                    <li>Click Connect Wallet</li>
                    <li>Select Eternl</li>
                    <li>Approve the connection</li>
                </ol>
                <p className="mt-2 text-sm text-gray-400">
                    Eternl provides clear permission prompts so users understand exactly
                    what they are approving.
                </p>
            </>
        ),
    },
    {
        step: 9,
        title: "Manage Multiple Wallets",
        content: (
            <>
                <p>
                    Eternl allows users to create and manage multiple wallets within a
                    single interface.
                </p>
                <p className="mt-2 font-semibold">This is useful for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Separating long-term holdings</li>
                    <li>NFT trading wallets</li>
                    <li>DeFi activity wallets</li>
                </ul>
            </>
        ),
    },
];

export default function HowToUseEternlPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="max-w-4xl mx-auto px-4 py-16 md:px-8 lg:px-8">
                {/* Breadcrumb / Back Link */}
                <div className="mb-8">
                    <Link
                        href="/about"
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                    >
                        ← Back to About
                    </Link>
                </div>

                {/* Hero Section */}
                <header className="mb-16 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
                            How to Use Eternl Wallet
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300">
                            Step-by-Step Guide for ADA, NFTs & DeFi
                        </p>
                    </div>
                    <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                        Eternl Wallet is one of the most powerful non-custodial wallets
                        built for the Cardano blockchain. Whether you want to store ADA,
                        manage NFTs, stake tokens, or interact with Cardano DeFi
                        applications, Eternl offers advanced tools with full user control.
                    </p>
                    <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            What Is Eternl Wallet?
                        </h3>
                        <p className="text-gray-400">
                            Eternl Wallet is a Cardano-only, non-custodial crypto wallet that
                            allows users to securely manage ADA, native tokens, and NFTs while
                            connecting to decentralized applications. Formerly known as
                            CCVault, Eternl has become a preferred wallet for users who need
                            advanced features such as staking control, multi-wallet
                            management, and detailed transaction handling.
                        </p>
                    </div>
                </header>

                {/* Steps */}
                <div className="space-y-16">
                    {guides.map((guide) => (
                        <section
                            key={guide.step}
                            className="relative pl-8 md:pl-0"
                        >
                            {/* Timeline line for mobile */}
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-800 md:hidden" />

                            <div className="md:grid md:grid-cols-[1fr,1.5fr] gap-8 md:items-start">
                                <div className="relative">
                                    {/* Step Number Badge */}
                                    <div className="absolute -left-12 md:left-auto md:relative md:mb-4 flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-600 font-bold text-white z-10 border-4 border-black">
                                        {guide.step}
                                    </div>

                                    <div className="sticky top-24 pt-1 md:pt-0">
                                        <h2 className="text-2xl font-bold text-white mb-4">
                                            {guide.title}
                                        </h2>
                                        <div className="text-gray-300 leading-relaxed text-lg space-y-4">
                                            {guide.content}
                                        </div>
                                    </div>
                                </div>

                                {/* Image Placeholder */}
                                <div className="mt-8 md:mt-0 relative aspect-video bg-gray-900 rounded-xl border border-gray-800 overflow-hidden group">
                                    {guide.image ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={guide.image}
                                                alt={`Step ${guide.step}: ${guide.title}`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-gray-900 group-hover:bg-gray-800 transition-colors">
                                            <span className="text-sm">Image for Step {guide.step}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Common Mistakes */}
                <section className="mt-20 pt-16 border-t border-gray-800">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Common Mistakes to Avoid</h2>
                    <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
                        {[
                            "Sharing recovery phrases",
                            "Falling for phishing websites",
                            "Approving unknown dApp permissions",
                            "Storing recovery phrases online"
                        ].map((mistake, i) => (
                            <div key={i} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 flex items-center justify-center">
                                {mistake}
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-gray-500 text-center">Security depends on user behavior as much as wallet design.</p>
                </section>

                {/* FAQ */}
                <section className="mt-16 bg-gray-900/30 rounded-2xl p-8 border border-gray-800">
                    <h2 className="text-2xl font-bold text-white mb-6">Is Eternl Wallet Safe?</h2>
                    <div className="space-y-4">
                        <p className="text-gray-300">Yes. Eternl Wallet is:</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {["Non-custodial", "Supports hardware wallets", "Uses open-source components", "Widely trusted in the Cardano community"].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-gray-300">
                                    <span className="text-green-500">✓</span> {item}
                                </li>
                            ))}
                        </ul>
                        <p className="text-sm text-gray-500 pt-2">However, users must follow best security practices to remain protected.</p>
                    </div>
                </section>

                {/* Final Thoughts */}
                <section className="mt-16 text-center space-y-6">
                    <h2 className="text-3xl font-bold text-white">Final Thoughts</h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Eternl Wallet is one of the most feature-rich Cardano wallets available today. While it may feel advanced at first, it provides unmatched control for users who want to stake ADA, manage NFTs, and interact with Cardano DeFi safely.
                    </p>
                    <p className="text-blue-400 font-medium">
                        For users seeking flexibility, transparency, and deep Cardano integration, Eternl Wallet is an excellent choice.
                    </p>
                    <div className="pt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
                        >
                            Get Started with Eternl
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
