"use client";

import { useState } from "react";
import EternlModalShell from "./EternlModalShell";

export type EternlAppSetupModalProps = {
  open: boolean;
  onBack: () => void;
  onNext: (settings: { language: string; currency: string; mode: "simple" | "pro" }) => void;
  onClose?: () => void;
  zIndexClass?: string;
};

/**
 * Step 2: App setup (Settings)
 * Allows choosing Language, Currency, and Mode (Simple/Pro).
 */
export default function EternlAppSetupModal({
  open,
  onBack,
  onNext,
  onClose,
  zIndexClass = "z-[61]",
}: EternlAppSetupModalProps) {
  const [language, setLanguage] = useState("English");
  const [region, setRegion] = useState("United States");
  const [currency, setCurrency] = useState("USD");
  const [mode, setMode] = useState<"simple" | "pro">("simple");

  return (
    <EternlModalShell
      open={open}
      title="App setup"
      subtitle="Update your settings to your personal preferences, or just stick with the defaults."
      onBack={onBack}
      onClose={onClose}
      zIndexClass={zIndexClass}
      footer={
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex items-center justify-between sm:justify-start gap-3">
             {/* Network Button - Flush Left */}
            <button
              type="button"
              className="p-button p-component p-button-secondary network-button p-0 h-9.5 w-fit sm:w-auto !rounded-full shadow-sm border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition"
            >
              <div className="flex flex-row items-center gap-3 px-1">
                <img
                  className="shrink-0 rounded-full size-9"
                  src="/brand/cardano.svg"
                  alt="Network Icon"
                />
                <div className="flex flex-col pr-6">
                  <div className="leading-tight whitespace-nowrap text-white text-sm font-medium">
                    Cardano mainnet
                  </div>
                </div>
              </div>
            </button>

            {/* Next Button - Pill Shape, Gradient */}
            <button
              autoFocus
              id="modelSetupSettingsBtnNext"
              type="button"
              onClick={() => onNext({ language, currency, mode })}
              aria-label="next"
              className="p-button p-component p-button-rounded ml-auto inline-flex min-h-11 min-w-[100px] items-center justify-center !rounded-full bg-brand-red px-8 text-sm font-semibold text-black shadow-inner ring-1 ring-black/30 transition hover:brightness-105"
            >
              next
            </button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        {/* Language Selection */}
        <button
          type="button"
          className="p-button p-component p-button-secondary p-button-outlined w-full pl-4 pr-2 py-3 flex flex-row items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition"
        >
          <div className="flex flex-col items-start">
            <span className="text-white font-medium">{language}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/50">{region}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 512 512"
              className="h-6 w-6 rounded-full"
            >
              <path fill="#bd3d44" d="M0 0h512v512H0" />
              <path
                stroke="#fff"
                strokeWidth="40"
                d="M0 58h512M0 137h512M0 216h512M0 295h512M0 374h512M0 453h512"
              />
              <path fill="#192f5d" d="M0 0h390v275H0z" />
              <path
                fill="#fff"
                d="m15 0l9.3 28.6L0 11h30L5.7 28.6"
                transform="scale(5)"
                opacity="0.2"
              />
              {/* Note: Simplified flag SVG for demo/placeholder as the full star pattern is complex */}
            </svg>
          </div>
        </button>

        {/* Currency Selection */}
        <button
          type="button"
          className="p-button p-component p-button-secondary p-button-outlined w-full pl-4 pr-2 py-3 flex flex-row items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition"
        >
          <div className="flex flex-col items-start">
            <span className="text-white font-medium">Currency</span>
          </div>
          <div className="shrink-0 flex flex-row items-center text-white/70 uppercase">
            $&nbsp;<span className="text-white/40"> ({currency.toLowerCase()})</span>
          </div>
        </button>

        {/* Mode Toggle */}
        <div className="w-full mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center p-1 bg-white/[0.05] rounded-2xl border border-white/10 w-fit">
            <div className="pl-3 pr-2 flex items-center justify-center">
              <img src="/brand/cardano.svg" className="size-5 rounded-full opacity-80" alt="Cardano" />
            </div>
            <button
              type="button"
              onClick={() => setMode("simple")}
              className={`px-6 py-2 rounded-2xl text-sm font-semibold transition ${
                mode === "simple"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Simple Mode
            </button>
            <button
              type="button"
              onClick={() => setMode("pro")}
              className={`px-6 py-2 rounded-2xl text-sm font-semibold transition ${
                mode === "pro"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Pro Mode
            </button>
          </div>
        </div>

      </div>
    </EternlModalShell>
  );
}
