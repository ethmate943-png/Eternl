 "use client";

import { useEffect, useState } from "react";
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

const bgPatternStyle = {
  backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

export default function ProtectedLandingPage() {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [open, setOpen] = useState(false);
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
    <main className="min-h-screen bg-[#0a0a0a] text-gray-300" style={bgPatternStyle}>
      <NavigationSection onLaunchApp={openOnboarding} />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <TimelineSection />
      <MythsRealitySection />
      <SecurityStackSection />
      <HowItWorksSection />
      <UseCasesSection />
      <MembershipSection />
      <FaqSection />
      <CtaSection />
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

function NavigationSection({ onLaunchApp }: { onLaunchApp: () => void }) {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
            <span className="text-white font-semibold text-lg">E</span>
          </div>
          <span className="text-white font-medium text-lg tracking-tight">Eternl</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="text-white">
            Features
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Security
          </a>
          <a href="#" className="hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Use Cases
          </a>
          <a href="#" className="hover:text-white transition-colors">
            FAQ
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Wallet
          </a>
        </div>
        <button
          onClick={onLaunchApp}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          Launch App
          <i data-lucide="external-link" className="w-4 h-4" />
        </button>
      </div>
    </nav>
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

function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-40 pb-24 grid lg:grid-cols-2 gap-16 items-center relative">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] -z-10" />
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm mb-6 text-gray-400">
          <i data-lucide="shield-check" className="w-4 h-4 text-orange-400" />
          The Most Trusted Cardano Wallet
        </div>
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white leading-[1.1] mb-6">
          Your Gateway
          <br />
          to the
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Cardano
            <br />
            Ecosystem
          </span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 mb-8 max-w-md leading-relaxed">
          Next-gen non-custodial wallet. Stake, transact, and explore Cardano dApps securely.
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-base font-medium hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-2">
            Get Started Free
            <i data-lucide="arrow-right" className="w-4 h-4" />
          </button>
          <button className="px-6 py-3 rounded-full text-base font-medium text-white border border-white/10 hover:bg-white/5 transition-colors">
            Explore Features
          </button>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <i data-lucide="check-circle-2" className="w-4 h-4 text-gray-400" />
            Non-Custodial
          </span>
          <span className="flex items-center gap-2">
            <i data-lucide="zap" className="w-4 h-4 text-orange-400" />
            Instant Staking
          </span>
          <span className="flex items-center gap-2">
            <i data-lucide="layers" className="w-4 h-4 text-blue-400" />
            Multi-Account
          </span>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-2xl blur-xl" />
        <div className="bg-[#121214] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg" />
              <div>
                <div className="text-sm font-medium text-white">Main Account</div>
                <div className="text-xs text-gray-500">addr1...x7k2</div>
              </div>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="text-sm text-gray-400 mb-1">Total Balance</div>
              <div className="text-4xl font-medium tracking-tight text-white">
                24,847.52
                <span className="text-base text-gray-500">ADA</span>
              </div>
              <div className="text-sm text-green-400 mt-1">+12.4% this month</div>
            </div>
            <div className="flex items-center gap-2 bg-[#1a1a1d] px-3 py-1.5 rounded-md border border-white/5">
              <i data-lucide="lock" className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-white">Secured</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#1a1a1d] p-4 rounded-xl border border-white/5">
              <div className="text-sm text-gray-400 mb-1">Staked</div>
              <div className="text-base font-medium text-white">18,500 ADA</div>
            </div>
            <div className="bg-[#1a1a1d] p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-400 mb-1">Rewards</div>
                <div className="text-base font-medium text-orange-400">+847 ADA</div>
              </div>
              <i data-lucide="trending-up" className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-medium border border-white/10 transition-colors">
              Send
            </button>
            <button className="bg-[#2a2a2d] hover:bg-[#333336] text-white py-3 rounded-xl text-sm font-medium transition-colors border border-white/5">
              Receive
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 border-y border-white/5 bg-black/20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
        <div className="flex flex-col items-center text-center px-4">
          <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <i data-lucide="users" className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-3xl font-medium tracking-tight text-white mb-1">300K+</div>
          <div className="text-sm text-gray-500">Active Users</div>
        </div>
        <div className="flex flex-col items-center text-center px-4">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
            <i data-lucide="coins" className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-medium tracking-tight text-white mb-1">$2.5B+</div>
          <div className="text-sm text-gray-500">Assets Managed</div>
        </div>
        <div className="flex flex-col items-center text-center px-4">
          <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
            <i data-lucide="activity" className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-3xl font-medium tracking-tight text-white mb-1">1M+</div>
          <div className="text-sm text-gray-500">Transactions</div>
        </div>
        <div className="flex flex-col items-center text-center px-4">
          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <i data-lucide="trending-up" className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-3xl font-medium tracking-tight text-white mb-1">99.9%</div>
          <div className="text-sm text-gray-500">Uptime</div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-32">
      <div className="text-center mb-24">
        <span className="text-xs font-medium text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full border border-orange-400/20">
          Powerful Features
        </span>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mt-6 mb-6">
          Everything You Need to
          <br />
          <span className="text-orange-500">Master Cardano</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <FeatureItem icon="shield" title="Non-Custodial Security" desc="Complete control over private keys. We never access your recovery phrases." />
        <FeatureItem icon="layers" title="Multi-Account Support" desc="Unlimited accounts and sub-addresses for organized asset management." />
        <FeatureItem icon="zap" title="One-Click Staking" desc="Delegate to pools instantly and earn passive ADA without complexity." />
        <FeatureItem icon="globe" title="dApp Connector" desc="Seamless connection to Cardano DeFi, NFT markets, and decentralized apps." />
      </div>
    </section>
  );
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-6">
      <div className="w-12 h-12 bg-orange-500/10 rounded-xl border border-orange-500/20 flex items-center justify-center mb-6">
        <i data-lucide={icon} className="w-6 h-6 text-orange-400" />
      </div>
      <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
      <p className="text-base text-gray-400">{desc}</p>
    </div>
  );
}

function TimelineSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-medium tracking-tight text-white">
          What Is <span className="text-orange-500">Eternl Wallet</span>?
        </h2>
      </div>
      <div className="space-y-8">
        <TimelineRow title="A Cardano-Native Web Wallet" text="Feature-rich browser wallet designed exclusively for Cardano." />
        <TimelineRow title="True Self-Custody" text="You hold your keys and stay in complete control." />
        <TimelineRow title="Gateway to dApps" text="Connect to DEXes, NFT markets, and lending protocols." />
        <TimelineRow title="Built for Security" text="Encryption, hardware support, and verification by default." />
      </div>
    </section>
  );
}

function TimelineRow({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-[#121214] border border-white/5 rounded-xl p-6">
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}

function MythsRealitySection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 bg-[#0d0d0f] rounded-3xl border border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-medium tracking-tight text-white">
          Why You Should Consider <span className="text-orange-500">Eternl Wallet</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <MythCard type="COMMON MYTH" text='"Crypto wallets are confusing and hard to use."' negative />
        <MythCard type="ETERNL REALITY" text="Intuitive interface designed for both beginners and power users." />
        <MythCard type="COMMON MYTH" text='"My funds could be stolen if the company shuts down."' negative />
        <MythCard type="ETERNL REALITY" text="Non-custodial: you own keys, ensuring access anytime." />
      </div>
    </section>
  );
}

function MythCard({ type, text, negative }: { type: string; text: string; negative?: boolean }) {
  return (
    <div className={`${negative ? "bg-[#0d0d0f]" : "bg-[#121214]"} p-8`}>
      <div className={`text-xs font-medium mb-2 ${negative ? "text-red-400" : "text-orange-400"}`}>{type}</div>
      <p className={`text-sm ${negative ? "text-gray-300 italic" : "text-gray-300"}`}>{text}</p>
    </div>
  );
}

function SecurityStackSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
      <div className="relative h-[400px] flex items-center justify-center">
        <div className="relative w-32 h-32 bg-gradient-to-b from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.3)] border border-orange-400/50">
          <i data-lucide="shield" className="w-16 h-16 text-white" />
        </div>
      </div>
      <div>
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">
          Multi-Layer <span className="text-orange-500">Security Stack</span>
        </h2>
        <div className="space-y-4 text-gray-400">
          <p>Layer 1: Local key storage</p>
          <p>Layer 2: Password encryption</p>
          <p>Layer 3: Biometric authentication</p>
          <p>Layer 4: Hardware wallet support</p>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 border-y border-white/5 bg-black/20">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-medium tracking-tight text-white">
          How <span className="text-orange-500">Eternl</span> Works
        </h2>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {["Launch App", "Create or Import", "Secure Wallet", "Add Your ADA", "Start Using", "Earn Rewards"].map((step) => (
          <div key={step} className="bg-[#121214] border border-white/10 rounded-xl p-4 text-center text-sm text-gray-300">
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}

function UseCasesSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
          What You Can Do with <span className="text-orange-500">Eternl Wallet</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UseCaseCard title="Staking & Rewards" text="Delegate ADA to pools and earn rewards while keeping custody." />
        <UseCaseCard title="Governance Voting" text="Participate in proposals and shape Cardano's future." />
        <UseCaseCard title="NFT Management" text="View, manage, and send native Cardano NFTs." />
      </div>
    </section>
  );
}

function UseCaseCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-8">
      <h3 className="text-2xl font-medium text-white mb-4">{title}</h3>
      <p className="text-base text-gray-400">{text}</p>
    </div>
  );
}

function MembershipSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-white">
          Unlock Exclusive <span className="text-orange-500">Membership Cards</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MembershipCard rarity="Common" title="Pioneer" />
        <MembershipCard rarity="Rare" title="Staker Elite" />
        <MembershipCard rarity="Epic" title="Security Guardian" />
        <MembershipCard rarity="Legendary" title="Founding Member" />
      </div>
    </section>
  );
}

function MembershipCard({ rarity, title }: { rarity: string; title: string }) {
  return (
    <div className="bg-[#121214] border border-white/10 rounded-2xl p-6">
      <div className="text-xs text-orange-400 mb-3">{rarity}</div>
      <h3 className="text-lg font-medium text-white">{title}</h3>
    </div>
  );
}

function FaqSection() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-medium tracking-tight text-white">
          Frequently Asked <span className="text-orange-500">Questions</span>
        </h2>
      </div>
      <div className="space-y-3">
        {[
          "Is Eternl Wallet free to use?",
          "How do I keep my wallet secure?",
          "Can I stake my ADA with Eternl?",
          "Can I use Eternl on mobile?",
        ].map((q) => (
          <div
            key={q}
            className="bg-[#121214] border border-white/5 rounded-xl p-5 flex justify-between items-center hover:bg-white/5 transition-colors"
          >
            <span className="text-sm font-medium text-gray-300">{q}</span>
            <i data-lucide="chevron-down" className="w-4 h-4 text-gray-500" />
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px]" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">
          Ready to Take Control
          <br />
          of Your ADA?
        </h2>
        <button className="bg-white text-orange-600 px-8 py-4 rounded-full text-base font-medium hover:bg-gray-50 transition-colors shadow-xl">
          Get Eternl Now
        </button>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="bg-[#0a0a0a] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
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
