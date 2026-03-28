"use client";

import { useEffect, useState } from "react";
import AccountPubKey from "../../../components/AccountPubKey";
import AddressReadOnly from "../../../components/AddressReadOnly";
import CLISigningKeys from "../../../components/CLISigningKeys";
import EternlPreloader from "../../../components/EternlPreloader";
import HardwareConnect from "../../../components/HardwareConnect";
import ImportBackup from "../../../components/ImportBackup";
import MultiSigSetup from "../../../components/MultiSigSetup";
import QRImport from "../../../components/QRImport";
import SecondaryModal from "../../../components/SecondaryModal";
import {
  EternlAppSetupModal,
  EternlHardwareConnectModal,
  EternlMnemonicPhraseModal,
  EternlModeSelectModal,
  EternlPinCodeModal,
  EternlRestoreMnemonicEntryModal,
  EternlSeedPhraseTypeModal,
  EternlOnboardingHeader,
  EternlWalletTypeModal,
  WalletPostOnboardingStack,
  EternlWelcomeModal,
} from "../../../components/onboarding";
import EternlTermsDrawer from "../../../components/onboarding/EternlTermsDrawer";

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

export default function OnboardingTestPage() {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [open, setOpen] = useState(true);
  const [mode, setMode] = useState<"simple" | "pro" | null>(null);
  const [lastSelection, setLastSelection] = useState<string>("");
  const [preloaderCounter, setPreloaderCounter] = useState(3);
  const [view, setView] = useState<"main" | "more">("main");
  const [activeSecondaryKey, setActiveSecondaryKey] =
    useState<WalletPickerKey | null>(null);

  // Handle transition countdown for secure environment initialization
  useEffect(() => {
    if (step === "preloader") {
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
  }, [step]);

  const closeAll = () => {
    setOpen(false);
    setStep("welcome");
    setView("main");
    setActiveSecondaryKey(null);
  };

  const confirmSelection = (key: WalletPickerKey, payload?: unknown) => {
    setActiveSecondaryKey(null);
    setLastSelection(payload != null ? `${key}: ${JSON.stringify(payload)}` : key);
    console.log("onSelect", key, payload);
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
    <div className="min-h-screen relative w-full px-4 pt-24 pb-10">
      <EternlOnboardingHeader />
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="text-lg font-semibold text-white"> Onboarding Flow Test </div>
          <div className="text-sm text-white/60">
            Current Step: <span className="font-mono text-pink-400 capitalize">{step}</span>
            {mode && <span className="ml-2 text-white/40">({mode} mode)</span>}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setStep("welcome");
                setOpen(true);
              }}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/20 transition"
            >
              Restart Flow
            </button>
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        <EternlWelcomeModal
          open={open && step === "welcome"}
          onNext={() => setStep("appSetup")}
          onClose={closeAll}
        />

        {/* STEP 2: APP SETUP */}
        <EternlAppSetupModal
          open={open && step === "appSetup"}
          onBack={() => setStep("welcome")}
          onNext={(settings) => {
            console.log("App Settings:", settings);
            setMode(settings.mode); // Sync mode selection
            setStep("pinCode");
          }}
          onClose={closeAll}
        />

        {/* STEP 3: CREATE PIN CODE */}
        <EternlPinCodeModal
          open={open && step === "pinCode"}
          onBack={() => setStep("appSetup")}
          onNext={(pin) => {
            console.log("PIN Created:", pin);
            setStep("preloader");
          }}
          onSkip={() => setStep("preloader")}
          onClose={closeAll}
        />

        {/* STEP 4: PRELOADER TRANSITION */}
        {open && step === "preloader" && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
             <EternlPreloader />
             <div className="mt-8 text-white/60 text-lg font-medium animate-pulse">
                Initializing secure environment... {preloaderCounter}s
             </div>
          </div>
        )}

        {/* STEP 5: TERMS AGREEMENT */}
        <EternlTermsDrawer
          open={open && step === "terms"}
          onConfirm={() => setStep("walletType")}
          onClose={() => setStep("pinCode")}
        />

        {/* STEP 6: WALLET TYPE PICKER */}
        <EternlWalletTypeModal
          open={open && step === "walletType" && view === "main"}
          onClose={closeAll}
          onSelect={handleMainSelect}
        />

        {/* STEP 7: WALLET FLOW (Seed phrase / Hardware) */}
        <WalletPostOnboardingStack
          open={open && step === "walletFlow"}
          showTerms={false}
          initialSubView={activeSecondaryKey === "new" ? "mnemonic" : activeSecondaryKey === "seed" ? "seedType" : activeSecondaryKey === "hardware" ? "hardware" : null}
          onDismiss={() => setStep("walletType")}
          onWalletSelect={(key, payload) => {
            confirmSelection(key as WalletPickerKey, payload);
            setStep("welcome");
            setOpen(false);
          }}
        />

        <SecondaryModal
          open={open && step === "walletFlow" && !["new", "seed", "hardware"].includes(activeSecondaryKey || "") && activeSecondaryKey != null}
          onClose={() => setStep("walletType")}
          title={ activeSecondaryKey === "multisig" ? "Multi-Sig Wallet" : "" }
        >
          {activeSecondaryKey === "multisig" ? (
            <MultiSigSetup
              onCancel={() => setStep("walletType")}
              onConfirm={(data) => confirmSelection("multisig", data)}
            />
          ) : null}
        </SecondaryModal>
      </div>
    </div>
  );
}
