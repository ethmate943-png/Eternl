import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Imprint / Legal Notice | Eternl",
    description: "Legal information and imprint for Eternl.",
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white px-4 py-12 md:px-8 lg:px-16 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <section className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-500">
                        IMPRINT / LEGAL NOTICE
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Information pursuant to Digital Services Act
                    </p>
                </section>
                {/* Company Info */}
                <section className="space-y-6 border-b border-gray-800 pb-12">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-white">
                            Archway Technology LLC
                        </h2>
                        <p className="text-gray-300">
                            1818 Linn st
                            <br />
                            North Kansas City Missouri 64116
                        </p>
                        <p className="text-gray-300">
                            <span className="font-semibold text-gray-400">EIN:</span> 82-2978660
                        </p>
                    </div>
                </section>

                {/* Resources */}
                <section className="space-y-6 border-b border-gray-800 pb-12">
                    <h2 className="text-2xl font-semibold text-blue-400">
                        Resources
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link
                            href="/about/how-to-use-eternl-wallet"
                            className="block p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500 transition-colors group"
                        >
                            <h3 className="text-xl font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                                How to Use Eternl Wallet
                            </h3>
                            <p className="text-gray-400">
                                A step-by-step guide for beginners and experienced users on setting up and using Eternl.
                            </p>
                        </Link>
                    </div>
                </section>

                {/* Scope of Application */}
                <section className="space-y-6 border-b border-gray-800 pb-12">
                    <h2 className="text-2xl font-semibold text-blue-400">
                        Scope of Application
                    </h2>
                    <p className="text-gray-300">
                        This legal notice applies to all services and websites of Archway
                        Technology LLC, in particular for:
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        <div className="space-y-3">
                            <h3 className="text-xl font-medium text-white">Websites</h3>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                                <li>eternl.io</li>
                                <li>www.tastenkunst.com</li>
                                <li>www.titanstaking.io</li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-xl font-medium text-white">Software</h3>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                                <li>Eternl Mobile App for iOS</li>
                                <li>Eternl Mobile App for Android</li>
                                <li>Eternl Browser Extension</li>
                                <li>Eternl Beta Browser Extension</li>
                                <li>Eternl Desktop App (not available yet)</li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-3 mt-6">
                        <h3 className="text-xl font-medium text-white">Social Networks</h3>
                        <p className="text-gray-400 mb-2">
                            This legal notice also applies to our profiles on the following
                            social networks:
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-400">
                            <div>
                                <strong className="block text-gray-300 mb-1">X (Twitter)</strong>
                                <ul className="space-y-1">
                                    <li>
                                        <a
                                            href="https://x.com/eternalwallet"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            x.com/eternalwallet
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://x.com/tastenkunst"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            x.com/tastenkunst
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://x.com/titanstaking"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            x.com/titanstaking
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <strong className="block text-gray-300 mb-1">Telegram</strong>
                                <ul className="space-y-1">
                                    <li>
                                        <a
                                            href="https://t.me/eternlio"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            t.me/eternlio
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://t.me/titanstakingio"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            t.me/titanstakingio
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="https://t.me/ccwalletio"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-blue-400 transition-colors"
                                        >
                                            t.me/ccwalletio
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <strong className="block text-gray-300 mb-1">Discord</strong>
                                <a
                                    href="https://discord.gg/eternlwallet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    discord.gg/eternlwallet
                                </a>
                            </div>
                            <div>
                                <strong className="block text-gray-300 mb-1">Linktree</strong>
                                <a
                                    href="http://linktr.ee/eternlwallet"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    linktr.ee/eternlwallet
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Legal Disclaimers */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Legal Notice (Legal Disclaimers)
                    </h2>

                    <article className="space-y-3">
                        <h3 className="text-xl font-semibold text-blue-400">
                            Liability for Content
                        </h3>
                        <div className="text-gray-400 space-y-4 leading-relaxed">
                            <p>
                                As a service provider, we are responsible for our own content on
                                these pages in accordance with Section 7 Paragraph 1 of the German
                                Data Protection Act (DDG). However, according to Sections 8 to 10
                                of the DDG, we are not obligated as a service provider to monitor
                                transmitted or stored third-party information or to investigate
                                circumstances that indicate illegal activity. Obligations to
                                remove or block the use of information under general law remain
                                unaffected. However, liability in this respect is only possible
                                from the point at which we become aware of a specific legal
                                infringement. Upon becoming aware of such legal infringements, we
                                will remove this content immediately.
                            </p>
                        </div>
                    </article>

                    <article className="space-y-3">
                        <h3 className="text-xl font-semibold text-blue-400">
                            Liability for Links
                        </h3>
                        <div className="text-gray-400 space-y-4 leading-relaxed">
                            <p>
                                Our website contains links to external websites of third parties,
                                over whose content we have no control. Therefore, we cannot assume
                                any liability for this external content. The respective provider
                                or operator of the linked pages is always responsible for their
                                content. The linked pages were checked for possible legal
                                violations at the time the links were created. Illegal content was
                                not identified at the time the links were created. However,
                                continuous monitoring of the content of linked pages is not
                                reasonable without concrete evidence of a legal violation. Upon
                                notification of legal violations, we will remove such links
                                immediately.
                            </p>
                        </div>
                    </article>

                    <article className="space-y-3">
                        <h3 className="text-xl font-semibold text-blue-400">Copyright</h3>
                        <div className="text-gray-400 space-y-4 leading-relaxed">
                            <p>
                                The content and works created by the site operators on these pages
                                are subject to German copyright law. Reproduction, processing,
                                distribution, and any form of exploitation beyond the limits of
                                copyright law require the written consent of the respective author
                                or creator. Downloads and copies of this page are only permitted
                                for private, non-commercial use. Insofar as the content on this
                                page was not created by the operator, the copyrights of third
                                parties are respected. In particular, third-party content is
                                identified as such. Should you nevertheless become aware of a
                                copyright infringement, please inform us accordingly. Upon
                                notification of legal violations, we will remove such content
                                immediately.
                            </p>
                        </div>
                    </article>

                    <article className="space-y-3">
                        <h3 className="text-xl font-semibold text-blue-400">
                            Consumer Dispute Resolution
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                            We are neither willing nor obliged to participate in dispute
                            resolution proceedings before a consumer arbitration board.
                        </p>
                    </article>

                    <article className="space-y-3">
                        <h3 className="text-xl font-semibold text-blue-400">Accessibility</h3>
                        <p className="text-gray-400 leading-relaxed">
                            We strive to make our digital services accessible in accordance with
                            the provisions of the Accessibility Strengthening Act (BFSG). Should
                            you encounter any barriers, please contact us at:
                        </p>
                        <p className="text-gray-400">
                            Email:{" "}
                            <a
                                href="mailto:info@tastenkunst.io"
                                className="text-white hover:text-blue-400 transition-colors"
                            >
                                info@archway-technology.io
                            </a>
                        </p>
                    </article>
                </section>
            </div>
        </main>
    );
}
