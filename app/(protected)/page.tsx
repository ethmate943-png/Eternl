"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Coins,
  Globe,
  Layers,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import {
  EternlAppSetupModal,
  EternlPinCodeModal,
  EternlWalletTypeModal,
  WalletPostOnboardingStack,
  EternlWelcomeModal,
} from "../../components/onboarding";
import EternlTermsDrawer from "../../components/onboarding/EternlTermsDrawer";
import EternlPreloader from "../../components/EternlPreloader";
import MultiSigSetup from "../../components/MultiSigSetup";
import SecondaryModal from "../../components/SecondaryModal";

type OnboardingStep =
  | "welcome"
  | "appSetup"
  | "pinCode"
  | "preloader"
  | "terms"
  | "walletType"
  | "walletFlow";

type WalletPickerKey =
  | "new"
  | "hardware"
  | "seed"
  | "multisig"
  | "more"
  | "import-backup"
  | "cli-signing-keys"
  | "account-pubkey"
  | "address-readonly"
  | "qr-import";

const gradientTextClass = "bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent";
const gradientBgClass = "bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400";
const gradientBgDiagonalClass = "bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-400";
/** Hero headline: coral → orange (matches Eternl marketing screenshot) */
const heroHeadlineGradientClass =
  "bg-gradient-to-r from-[#FF4D6D] to-[#FF9F1C] bg-clip-text text-transparent";
const heroCtaBgClass = "bg-[#FF4D6D]";

export default function ProtectedLandingPage() {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [open, setOpen] = useState(true);
  const [preloaderCounter, setPreloaderCounter] = useState(3);
  const [view, setView] = useState<"main" | "more">("main");
  const [activeSecondaryKey, setActiveSecondaryKey] = useState<WalletPickerKey | null>(null);

  useEffect(() => {
    if (step === "preloader" && open) {
      setPreloaderCounter(3);
      const timer = setInterval(() => {
        setPreloaderCounter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStep("terms");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, open]);

  const openOnboarding = () => {
    setOpen(true);
    setStep("welcome");
    setView("main");
    setActiveSecondaryKey(null);
  };

  const closeAll = () => {
    setOpen(false);
    setStep("welcome");
    setView("main");
    setActiveSecondaryKey(null);
  };

  const handleMainSelect = (key: "new" | "hardware" | "seed" | "multisig" | "more") => {
    if (key === "more") {
      setView("more");
      return;
    }
    setActiveSecondaryKey(key as WalletPickerKey);
    setStep("walletFlow");
  };

  return (
    <main className="min-h-screen bg-[#171717] text-gray-300">
      <HeroSection onOpenApp={openOnboarding} />
      <DownloadOptionsSection onOpenApp={openOnboarding} />
      <TrustSignalsSection />
      <WhyChooseSection />
      <FeaturesSection />
      <UseCasesSection />
      <HowItWorksSection />
      <SecurityTrustSection />
      <WhatIsCardanoWalletSection />
      <ComparisonSection />
      <FaqSection />
      <CtaSection onOpenApp={openOnboarding} />
      <FooterSection />
      <OnboardingFlow
        open={open}
        step={step}
        view={view}
        preloaderCounter={preloaderCounter}
        activeSecondaryKey={activeSecondaryKey}
        onClose={closeAll}
        onSetStep={setStep}
        onSetView={setView}
        onSetActiveSecondaryKey={setActiveSecondaryKey}
        onMainSelect={handleMainSelect}
      />
    </main>
  );
}

function OnboardingFlow({
  open,
  step,
  view,
  preloaderCounter,
  activeSecondaryKey,
  onClose,
  onSetStep,
  onSetView,
  onSetActiveSecondaryKey,
  onMainSelect,
}: {
  open: boolean;
  step: OnboardingStep;
  view: "main" | "more";
  preloaderCounter: number;
  activeSecondaryKey: WalletPickerKey | null;
  onClose: () => void;
  onSetStep: (step: OnboardingStep) => void;
  onSetView: (view: "main" | "more") => void;
  onSetActiveSecondaryKey: (key: WalletPickerKey | null) => void;
  onMainSelect: (key: "new" | "hardware" | "seed" | "multisig" | "more") => void;
}) {
  return (
    <>
      <EternlWelcomeModal
        open={open && step === "welcome"}
        onNext={() => onSetStep("appSetup")}
        onClose={onClose}
      />

      <EternlAppSetupModal
        open={open && step === "appSetup"}
        onBack={() => onSetStep("welcome")}
        onNext={() => onSetStep("pinCode")}
        onClose={onClose}
      />

      <EternlPinCodeModal
        open={open && step === "pinCode"}
        onBack={() => onSetStep("appSetup")}
        onNext={() => onSetStep("preloader")}
        onSkip={() => onSetStep("preloader")}
        onClose={onClose}
      />

      {open && step === "preloader" && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
          <EternlPreloader />
          <div className="mt-8 text-white/60 text-lg font-medium animate-pulse">
            Initializing secure environment... {preloaderCounter}s
          </div>
        </div>
      )}

      <EternlTermsDrawer
        open={open && step === "terms"}
        onConfirm={() => onSetStep("walletType")}
        onClose={() => onSetStep("pinCode")}
      />

      <EternlWalletTypeModal
        open={open && step === "walletType" && view === "main"}
        onClose={onClose}
        onSelect={onMainSelect}
      />

      <WalletPostOnboardingStack
        open={open && step === "walletFlow"}
        showTerms={false}
        initialSubView={
          activeSecondaryKey === "new"
            ? "mnemonic"
            : activeSecondaryKey === "seed"
              ? "seedType"
              : activeSecondaryKey === "hardware"
                ? "hardware"
                : null
        }
        onDismiss={() => onSetStep("walletType")}
        onWalletSelect={() => onClose()}
      />

      <SecondaryModal
        open={
          open &&
          step === "walletFlow" &&
          !["new", "seed", "hardware"].includes(activeSecondaryKey || "") &&
          activeSecondaryKey != null
        }
        onClose={() => {
          onSetStep("walletType");
          onSetView("main");
          onSetActiveSecondaryKey(null);
        }}
        title={activeSecondaryKey === "multisig" ? "Multi-Sig Wallet" : ""}
      >
        {activeSecondaryKey === "multisig" ? (
          <MultiSigSetup onCancel={() => onSetStep("walletType")} onConfirm={() => onClose()} />
        ) : null}
      </SecondaryModal>
    </>
  );
}

function HeroSection({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pt-10 sm:pt-14 md:pt-16 pb-20 sm:pb-28 min-h-[70vh] md:min-h-[90vh] flex flex-col items-start justify-center text-left">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.03] max-w-5xl">
        <span className={`block ${heroHeadlineGradientClass}`}>A modern Cardano wallet.</span>
        <span className={`block ${heroHeadlineGradientClass}`}>For everyone.</span>
      </h1>
      <p className="mt-4 sm:mt-8 text-xl sm:text-3xl md:text-5xl lg:text-6xl font-medium text-[#e9e9e9] tracking-[1.05]   leading-[1.05] max-w-4xl">
        <span className="block">Friendly for beginners.</span>
        <span className="block">Powerful for pro users.</span>
      </p>
      <div className="mt-4 sm:mt-8 mb-12">
        <button
          type="button"
          onClick={onOpenApp}
          className={`${heroCtaBgClass} text-black px-10 py-2.5 rounded-full text-base font-semibold hover:brightness-110 transition-[filter] active:brightness-95`}
        >
          Open app
        </button>
      </div>
    </section>
  );
}

function DownloadOptionsSection({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 pb-16 sm:pb-20 -mt-16 sm:-mt-24 md:-mt-32">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-4 sm:gap-5 max-w-[600px]">
        <AccessCard
          title="Friendly for beginners"
          subtitle="(Guided onboarding)"
          body={
            <>
              Set up in minutes, stake ADA in a click,
              <br />
              and recover safely—every step guided.
            </>
          }
          ctaLabel="Get started"
          onClick={onOpenApp}
        />
        <AccessCard
          title="Powerful for pro users"
          subtitle="(Advanced controls)"
          body={
            <>
              Multi-account, hardware wallets, and full
              <br />
              CIP-30 dApp connectivity built in.
            </>
          }
          ctaLabel="Open wallet"
          onClick={onOpenApp}
        />
      </div>
    </section>
  );
}

function AccessCard({
  title,
  subtitle,
  body,
  ctaLabel,
  onClick,
}: {
  title: string;
  subtitle: string;
  body: React.ReactNode;
  ctaLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="bg-[#1a1a1d] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center">
      <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
      <p className="text-xs sm:text-sm text-white/60 mt-1">{subtitle}</p>
      <div className="w-full h-px bg-white/10 my-4 sm:my-5" />
      <p className="text-sm text-white/80 leading-relaxed mb-5 sm:mb-6">{body}</p>
      <button
        type="button"
        onClick={onClick}
        className={`${heroCtaBgClass} text-black px-10 py-2.5 rounded-full text-base font-semibold hover:brightness-110 transition-[filter] active:brightness-95 mt-auto`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function TrustSignalsSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 border-y border-white/10 bg-black/20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-white/5">
        <TrustItem icon={<Users className="w-5 h-5" />} iconBg="bg-pink-500/10" iconColor="text-pink-400" stat="300,000+" label="Active Users" />
        <TrustItem
          icon={<Coins className="w-5 h-5" />}
          iconBg="bg-orange-400/10"
          iconColor="text-orange-400"
          stat="Billions+"
          label="Assets Managed"
        />
        <TrustItem
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-yellow-400/10"
          iconColor="text-yellow-400"
          stat="Non-Custodial"
          label="Open Ecosystem"
        />
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  iconBg,
  iconColor,
  stat,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  stat: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center mb-4`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="text-3xl font-medium tracking-tight text-white mb-1">{stat}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function WhyChooseSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="max-w-3xl mb-12">
        <span className="text-xs font-medium text-orange-300 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
          Why Choose Eternl
        </span>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mt-6 mb-6">
          A Smarter Way to Manage Your{" "}
          <span className={gradientTextClass}>Cardano Assets</span>
        </h2>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed">
          Eternl is a next-generation Cardano wallet designed for users who demand speed, control, and
          flexibility. Whether you&rsquo;re staking ADA, interacting with dApps, or managing multiple wallets,
          Eternl delivers a powerful and intuitive experience.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <BenefitItem text="Full ownership of your private keys" />
        <BenefitItem text="Lightning-fast transactions and syncing" />
        <BenefitItem text="Seamless dApp integration" />
        <BenefitItem text="Advanced multi-account support" />
      </div>
    </section>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 bg-[#121214] border border-white/5 rounded-xl p-5">
      <div className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-orange-400/10 border border-orange-400/30 flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-orange-400" />
      </div>
      <span className="text-sm md:text-base text-gray-200">{text}</span>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <span className="text-xs font-medium text-orange-300 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
          Core Features
        </span>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mt-6">
          Everything You Need in a{" "}
          <span className={gradientTextClass}>Cardano Wallet</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureItem
          icon={<Shield className="w-5 h-5 text-orange-400" />}
          title="Non-Custodial Security"
          desc="You control your keys. Your assets remain fully in your hands—always."
        />
        <FeatureItem
          icon={<Zap className="w-5 h-5 text-orange-400" />}
          title="Fast & Reliable Performance"
          desc="Built for speed with optimized syncing and transaction handling on the Cardano blockchain."
        />
        <FeatureItem
          icon={<Coins className="w-5 h-5 text-orange-400" />}
          title="Stake ADA Easily"
          desc="Delegate your ADA and earn rewards directly within the wallet—no third parties required."
        />
        <FeatureItem
          icon={<Globe className="w-5 h-5 text-orange-400" />}
          title="dApp & Web3 Ready"
          desc="Connect to Cardano dApps, NFTs, and DeFi platforms seamlessly."
        />
        <FeatureItem
          icon={<Layers className="w-5 h-5 text-orange-400" />}
          title="Multi-Wallet & Account Support"
          desc="Manage multiple wallets and accounts with ease—perfect for advanced users."
        />
      </div>
    </section>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-[#121214] border border-white/10 rounded-2xl p-6">
      <div className="w-10 h-10 bg-orange-400/10 rounded-xl border border-orange-400/20 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
      <p className="text-base text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function UseCasesSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
          Built for Every <span className={gradientTextClass}>Type of User</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <UseCaseCard
          icon={<Sparkles className="w-5 h-5 text-pink-400" />}
          title="Beginners"
          text="Easy setup and intuitive interface."
        />
        <UseCaseCard
          icon={<TrendingUp className="w-5 h-5 text-pink-400" />}
          title="Investors"
          text="Securely store and stake ADA."
        />
        <UseCaseCard
          icon={<Globe className="w-5 h-5 text-pink-400" />}
          title="DeFi Users"
          text="Access dApps and manage assets."
        />
        <UseCaseCard
          icon={<Settings className="w-5 h-5 text-pink-400" />}
          title="Power Users"
          text="Advanced controls and multi-account management."
        />
      </div>
    </section>
  );
}

function UseCaseCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
      <div className="w-10 h-10 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{text}</p>
    </div>
  );
}

function HowItWorksSection() {
  const steps = [
    { n: 1, title: "Download Eternl Wallet", text: "Install the wallet on your preferred platform." },
    { n: 2, title: "Create or import your wallet", text: "Spin up a new wallet or restore an existing one." },
    { n: 3, title: "Secure your recovery phrase", text: "Save your seed phrase in a safe, offline location." },
    { n: 4, title: "Start staking, sending, and exploring Web3", text: "Delegate ADA, send tokens, and connect to dApps." },
  ];
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 border-y border-white/10 bg-black/20">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
          Get Started in <span className={gradientTextClass}>Minutes</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => (
          <div key={s.n} className="bg-[#121214] border border-white/10 rounded-2xl p-6">
            <div className={`${gradientBgClass} w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold mb-4`}>
              {s.n}
            </div>
            <h3 className="text-base font-medium text-white mb-2">{s.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SecurityTrustSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
      <div className="relative h-[320px] flex items-center justify-center">
        <div className="relative w-32 h-32 bg-gradient-to-b from-pink-500 to-fuchsia-600 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(236,72,153,0.35)] border border-pink-400/50">
          <ShieldCheck className="w-16 h-16 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Security You Can <span className={gradientTextClass}>Trust</span>
        </h2>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-6">
          Eternl is built with a strong focus on transparency and user control:
        </p>
        <ul className="space-y-3 text-gray-300">
          <SecurityBullet text="Non-custodial architecture" />
          <SecurityBullet text="Local key storage" />
          <SecurityBullet text="No access to user funds" />
          <SecurityBullet text="Continuous updates and improvements" />
        </ul>
        <p className="text-base text-white mt-6 font-medium">Your assets remain yours—always.</p>
      </div>
    </section>
  );
}

function SecurityBullet({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
      <span className="text-sm md:text-base">{text}</span>
    </li>
  );
}

function WhatIsCardanoWalletSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-8">
        What Is a <span className={gradientTextClass}>Cardano Wallet</span>?
      </h2>
      <div className="space-y-5 text-base md:text-lg text-gray-300 leading-relaxed">
        <p>
          A Cardano wallet allows users to store, send, receive, and stake ADA securely. Unlike custodial
          solutions, non-custodial wallets like Eternl give you full ownership of your private keys and
          funds.
        </p>
        <p>
          Eternl stands out as one of the most powerful Cardano wallets due to its speed, flexibility, and
          deep integration with the Cardano ecosystem.
        </p>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const rows: { feature: string; eternl: string; typical: string }[] = [
    { feature: "Non-Custodial", eternl: "Yes", typical: "Sometimes" },
    { feature: "ADA Staking", eternl: "Yes", typical: "Limited" },
    { feature: "dApp Support", eternl: "Yes", typical: "Basic" },
    { feature: "Speed", eternl: "High", typical: "Moderate" },
    { feature: "Multi-Account", eternl: "Advanced", typical: "Limited" },
  ];
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
          Why <span className={gradientTextClass}>Eternl</span> Stands Out
        </h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121214]">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-white">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold">Feature</th>
              <th className="px-6 py-4 text-sm font-semibold">Eternl</th>
              <th className="px-6 py-4 text-sm font-semibold">Typical Wallet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => (
              <tr key={r.feature} className="text-sm md:text-base">
                <td className="px-6 py-4 text-gray-300 font-medium">{r.feature}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-2 text-orange-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    {r.eternl}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{r.typical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FaqSection() {
  const faqs: { q: string; a: string }[] = [
    {
      q: "What is Eternl Wallet?",
      a: "Eternl is a non-custodial Cardano wallet that allows users to store, stake, and manage ADA securely.",
    },
    {
      q: "Is Eternl Wallet safe?",
      a: "Yes, Eternl is non-custodial, meaning users retain full control of their private keys and funds.",
    },
    {
      q: "Can I stake ADA with Eternl?",
      a: "Yes, Eternl allows you to delegate and earn ADA rewards directly within the wallet.",
    },
    {
      q: "Does Eternl support NFTs and dApps?",
      a: "Yes, Eternl integrates with Cardano dApps and supports NFT management.",
    },
  ];
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
          Frequently Asked <span className={gradientTextClass}>Questions</span>
        </h2>
      </div>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group bg-[#121214] border border-white/5 rounded-xl p-5 hover:bg-white/[0.03] transition-colors"
          >
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <span className="text-sm md:text-base font-medium text-white">{f.q}</span>
              <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm md:text-base text-gray-400 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ onOpenApp }: { onOpenApp: () => void }) {
  return (
    <section className={`w-full ${gradientBgClass} py-20 relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">
          Take Control of Your
          <br />
          Cardano Assets Today
        </h2>
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-10">
          Join thousands of users who trust Eternl for secure, fast, and flexible wallet management.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onOpenApp}
            className="bg-white text-pink-600 px-8 py-3.5 rounded-full text-base font-semibold hover:bg-gray-50 transition-colors shadow-xl"
          >
            Download Now
          </button>
          <button
            type="button"
            onClick={onOpenApp}
            className="px-8 py-3.5 rounded-full text-base font-semibold text-white border border-white/40 hover:bg-white/10 transition-colors"
          >
            Start Staking ADA
          </button>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-[#0b0b0d] pt-16 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className={`${gradientBgDiagonalClass} w-8 h-8 rounded-md flex items-center justify-center`}>
              <span className="text-white font-semibold text-lg">E</span>
            </div>
            <span className="text-white font-medium text-xl tracking-tight">Eternl</span>
          </div>
          <p className="text-sm text-gray-500 max-w-sm">
            The most trusted Cardano wallet for secure, non-custodial asset management.
          </p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-600 pt-8 border-t border-white/5">
        © 2024 Eternl Wallet. All rights reserved.
      </div>
    </footer>
  );
}
