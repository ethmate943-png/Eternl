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
              className="p-button p-component p-button-secondary network-button p-0 h-9.5 w-full sm:w-auto rounded-full shadow-sm border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition"
            >
              <div className="flex flex-row items-center gap-3 px-1">
                <img
                  className="shrink-0 rounded-full size-9"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6xD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAyIDc5LmE2YTYzOTY4YSwgMjAyNC8wMy8wNi0xMTo1MjowNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0iOUVENTlEOTdDMzBENTFBNThCMkM3QTFEODM3REM0NDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEZCNUYyRTU2QjlFMTFFRjkxRDY5NEUwOUI4OUEwNkEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEZCNUYyRTQ2QjlFMTFFRjkxRDY5NEUwOUI4OUEwNkEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIwMjQgTWFjaW50b3NoIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZTZkOTNlYjItZGNkZC00MTQyLTlkMjQtNGU1NGFhMzBkODUxIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ODYxMTQ3ZGUtNDhkZC05YjRjLTg1ODktMDZkM2FlNmJlMWZl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"
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
              className="p-button p-component p-button-rounded ml-auto inline-flex min-h-11 min-w-[100px] items-center justify-center rounded-full bg-gradient-to-b from-rose-400 to-pink-600 px-8 text-sm font-semibold text-white shadow-inner ring-1 ring-black/30 transition hover:brightness-105"
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
          <div className="flex p-1 bg-white/[0.05] rounded-2xl border border-white/10 w-fit">
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
