import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Eternl Wallet Review: Secure Cardano Wallet for ADA, NFTs & DeFi",
    description: "A comprehensive review of Eternl Wallet, a non-custodial wallet for the Cardano blockchain.",
};

export default function ReviewPage() {
    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-[#f83a00] selection:text-white pb-20">
            {/* Navbar Placeholder - assuming main layout handles it, but adding spacer if needed */}
            <div className="h-20" />

            <main className="max-w-4xl mx-auto px-6 md:px-8">
                {/* HERO SECTION */}
                <header className="mb-16 pt-10 border-b border-white/20 pb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-[#f83a00] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                            Review
                        </span>
                        <span className="text-gray-400 text-xs font-mono uppercase tracking-widest">
                            Crypto / Wallets / Cardano
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-satoshi font-black leading-[0.9] tracking-tight mb-8 text-white">
                        ETERNL WALLET <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                            REVIEW
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed max-w-2xl">
                        Secure Cardano Wallet for ADA, NFTs & DeFi. Formerly CCVault, it&apos;s the power user&apos;s choice.
                    </p>

                    <div className="flex items-center gap-6 mt-10 text-sm font-mono text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                                E
                            </div>
                            <span>By Eternl Team</span>
                        </div>
                        <span>•</span>
                        <time dateTime="2026-02-06">Feb 06, 2026</time>
                    </div>
                </header>

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
                    {/* MAIN ARTICLE */}
                    <article className="prose prose-invert prose-lg max-w-none">
                        {/* INTRO */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-satoshi font-bold mb-6 text-white border-l-4 border-[#f83a00] pl-4">
                                What Is Eternl Wallet?
                            </h2>
                            <p className="text-gray-300 leading-relaxed text-lg mb-6">
                                Eternl Wallet is a <strong className="text-white">non-custodial cryptocurrency wallet</strong> built specifically for the Cardano blockchain. It enables users to securely store, send, and receive ADA, manage Cardano-native tokens, interact with NFTs, and access decentralized finance (DeFi) applications within the Cardano ecosystem.
                            </p>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                Formerly known as <em>CCVault</em>, Eternl has evolved into one of the most features-rich Cardano wallets available today, designed primarily for experienced users and active Web3 participants.
                            </p>
                        </section>

                        {/* WHO BUILT IT */}
                        <section className="mb-16">
                            <h3 className="text-2xl font-satoshi font-bold mb-4 text-white">Who Built Eternl Wallet?</h3>
                            <p className="text-gray-300 leading-relaxed text-lg mb-6">
                                Eternl Wallet is developed by an independent Cardano-focused development team, separate from Input Output Global (IOG). Despite being independently built, Eternl has earned a strong reputation within the Cardano community due to its continuous development, transparency, and advanced feature set.
                            </p>
                            <div className="bg-[#111] border border-white/10 p-6 rounded-lg">
                                <p className="text-gray-400 text-sm uppercase tracking-widest mb-4 font-bold">Widely Used By</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {["Cardano DeFi participants", "NFT traders", "Staking-focused users", "Power users managing multiple wallets"].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-gray-200">
                                            <span className="w-1.5 h-1.5 bg-[#f83a00] rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* HOW IT WORKS */}
                        <section className="mb-16">
                            <h3 className="text-2xl font-satoshi font-bold mb-4 text-white">How Eternl Wallet Works</h3>
                            <p className="text-gray-300 leading-relaxed text-lg mb-6">
                                Eternl Wallet operates as a non-custodial wallet, meaning users retain full control over their private keys and recovery phrases.
                            </p>
                            <ul className="space-y-3 mb-6 text-gray-300 list-disc pl-5 marker:text-[#f83a00]">
                                <li><strong className="text-white">Local key storage</strong></li>
                                <li>User-approved transaction signing</li>
                                <li>No centralized account control</li>
                                <li>Support for multiple wallet profiles</li>
                            </ul>
                            <p className="text-gray-400 text-base italic border-l-2 border-gray-700 pl-4 py-1">
                                Eternl is available as a browser extension and as a web-based interface, offering flexibility across devices.
                            </p>
                        </section>

                        {/* SECURITY */}
                        <section className="mb-16">
                            <h2 className="text-3xl font-satoshi font-bold mb-6 text-white border-l-4 border-[#f83a00] pl-4">
                                Security & Transparency
                            </h2>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Non-Custodial Architecture</h4>
                                    <p className="text-gray-300">Eternl ensures that only the wallet owner can authorize transactions. The development team does not have access to user funds or recovery phrases.</p>
                                </div>

                                <div>
                                    <h4 className="text-xl font-bold text-white mb-2">Open Source Components</h4>
                                    <p className="text-gray-300">Eternl Wallet uses open-source components, allowing the Cardano community to review and validate parts of the wallet’s codebase.</p>
                                </div>

                                <div className="bg-[#111] p-6 rounded border border-white/10">
                                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#f83a00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Hardware Wallet Support
                                    </h4>
                                    <p className="text-gray-400 mb-4">Eternl supports popular hardware wallets, enabling offline private key storage while maintaining access to DeFi.</p>
                                    <div className="flex gap-4">
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm text-gray-200">Ledger</span>
                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-sm text-gray-200">Trezor</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* HOW TO USE */}
                        <section className="mb-16">
                            <h3 className="text-2xl font-satoshi font-bold mb-6 text-white">How to Use Eternl Wallet</h3>
                            <ol className="relative border-l border-gray-800 ml-3 space-y-8">
                                {[
                                    "Installing the Eternl browser extension or accessing the web version",
                                    "Creating a new wallet or restoring an existing one",
                                    "Safely storing the recovery phrase offline",
                                    "Adding ADA or Cardano-native assets",
                                    "Connecting to Cardano DeFi protocols or NFT marketplaces"
                                ].map((step, idx) => (
                                    <li key={idx} className="pl-8 relative">
                                        <span className="absolute -left-[1.06rem] top-0 w-8 h-8 rounded-full bg-[#111] border border-gray-700 flex items-center justify-center text-sm font-bold text-[#f83a00]">
                                            {idx + 1}
                                        </span>
                                        <p className="text-gray-200 text-lg pt-1">{step}</p>
                                    </li>
                                ))}
                            </ol>
                            <p className="mt-8 text-gray-400 bg-white/5 p-4 rounded text-sm">
                                💡 <strong className="text-gray-200">Note:</strong> Eternl’s interface offers deep configuration options, which may feel advanced for beginners but is highly valued by experienced users.
                            </p>
                        </section>

                        {/* ADVANCED FEATURES */}
                        <section className="mb-16">
                            <h3 className="text-2xl font-satoshi font-bold mb-6 text-white">Advanced Features for Power Users</h3>
                            <p className="text-gray-300 mb-6">Eternl Wallet stands out due to its advanced Cardano tooling, including:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "Multi-account & multi-wallet management",
                                    "Detailed staking controls",
                                    "Transaction metadata support",
                                    "dApp connector with granular permissions",
                                    "Custom network & node configurations"
                                ].map((feature) => (
                                    <div key={feature} className="p-4 border border-white/10 bg-[#0a0a0a] hover:border-[#f83a00]/50 transition-colors">
                                        <p className="text-gray-200 font-medium">{feature}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* NFT & DEFI */}
                        <section className="mb-16">
                            <h3 className="text-2xl font-satoshi font-bold mb-4 text-white">NFT & DeFi Support</h3>
                            <p className="text-gray-300 mb-4">Eternl provides robust support for Cardano-native NFTs, DeFi protocols (DEXs, staking platforms, governance apps), and advanced transaction approvals.</p>
                            <p className="text-gray-400">Users can manage large NFT collections and interact with DeFi platforms efficiently within a single interface.</p>
                        </section>

                        {/* COMPARISON TABLE */}
                        <section className="mb-16">
                            <h3 className="text-2xl font-satoshi font-bold mb-6 text-white">Eternl Wallet vs Lace Wallet</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-white">
                                            <th className="py-4 px-4 text-gray-400 font-mono text-sm uppercase">Feature</th>
                                            <th className="py-4 px-4 text-white font-bold text-lg">Eternl Wallet</th>
                                            <th className="py-4 px-4 text-gray-300 font-bold text-lg">Lace Wallet</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {[
                                            { feature: "Cardano-only", eternl: "✅", lace: "✅" },
                                            { feature: "Non-custodial", eternl: "✅", lace: "✅" },
                                            { feature: "Beginner-friendly", eternl: "⭐⭐⭐ (3/5)", lace: "⭐⭐⭐⭐⭐ (5/5)" },
                                            { feature: "Advanced features", eternl: "⭐⭐⭐⭐⭐ (5/5)", lace: "⭐⭐⭐ (3/5)" },
                                            { feature: "Hardware wallet", eternl: "✅", lace: "✅" },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-white/5">
                                                <td className="py-4 px-4 text-gray-300 font-medium">{row.feature}</td>
                                                <td className="py-4 px-4 text-white">{row.eternl}</td>
                                                <td className="py-4 px-4 text-gray-400">{row.lace}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="mt-4 text-gray-400 text-sm">
                                * Eternl Wallet is better suited for advanced users, while Lace Wallet offers a simpler onboarding experience.
                            </p>
                        </section>

                        {/* RISKS & FEES */}
                        <section className="mb-16 grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-satoshi font-bold mb-4 text-white">Risks & Limitations</h3>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li className="flex gap-2">⚠️ Advanced UI may overwhelm beginners</li>
                                    <li className="flex gap-2">⚠️ Loss of recovery phrase results in permanent asset loss</li>
                                    <li className="flex gap-2">⚠️ Users are responsible for avoiding phishing attacks</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-satoshi font-bold mb-4 text-white">Fees & Costs</h3>
                                <p className="text-white font-bold text-2xl mb-2">Free to use.</p>
                                <ul className="space-y-1 text-gray-400 text-sm">
                                    <li>• No subscription fees</li>
                                    <li>• No hidden costs</li>
                                    <li>• Standard Cardano network fees apply</li>
                                </ul>
                            </div>
                        </section>

                        {/* FAQs */}
                        <section className="mb-16 border-t border-gray-800 pt-10">
                            <h3 className="text-2xl font-satoshi font-bold mb-6 text-white">FAQs</h3>
                            <div className="space-y-6">
                                {[
                                    { q: "What is Eternl Wallet?", a: "A non-custodial Cardano wallet for managing ADA, NFTs, and DeFi applications." },
                                    { q: "Is Eternl Wallet safe?", a: "Yes. Eternl uses a non-custodial model, hardware wallet support, and open source components." },
                                    { q: "Does Eternl Wallet support NFTs?", a: "Yes. It supports Cardano-native NFTs and DeFi integrations." },
                                    { q: "Is Eternl Wallet good for beginners?", a: "It can be used by beginners, but it is best suited for advanced users." },
                                ].map((faq, i) => (
                                    <div key={i}>
                                        <h4 className="text-white font-bold mb-1">{faq.q}</h4>
                                        <p className="text-gray-400 text-sm">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </article>

                    {/* SIDEBAR / STICKY VERDICT */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
                            <div className="bg-[#111] border-t-4 border-[#f83a00] p-6 shadow-xl">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#f83a00] mb-2">
                                    The Verdict
                                </h3>
                                <h2 className="text-3xl font-satoshi font-black text-white mb-4 leading-none">
                                    WORTH IT
                                </h2>
                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    Eternl Wallet is one of the most advanced Cardano wallets available today. Its deep feature set, strong DeFi support, and non-custodial design make it an excellent choice for experienced Cardano users who want maximum control and flexibility.
                                </p>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Features</span>
                                        <span className="text-white font-bold">9.5/10</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#f83a00] h-full w-[95%]" />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Security</span>
                                        <span className="text-white font-bold">9.0/10</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#f83a00] h-full w-[90%]" />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-400">Ease of Use</span>
                                        <span className="text-white font-bold">7.0/10</span>
                                    </div>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#f83a00] h-full w-[70%]" />
                                    </div>
                                </div>

                                <Link
                                    href="https://eternl.io"
                                    target="_blank"
                                    className="block w-full text-center bg-white text-black font-bold py-3 uppercase text-sm hover:bg-gray-200 transition-colors"
                                >
                                    Visit Eternl
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
