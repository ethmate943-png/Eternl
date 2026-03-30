"use client";

import React from "react";
import EternlModalShell from "./EternlModalShell";

export type EternlWelcomeModalProps = {
  open: boolean;
  onNext: () => void;
  onClose?: () => void;
  zIndexClass?: string;
};

/**
 * Welcome screen — matches the live Eternl onboarding design exactly.
 * Shows "Welcome to Eternl!", the video illustration, and a Start setup button.
 * Now uses EternlModalShell for consistency across the onboarding flow.
 */
export default function EternlWelcomeModal({
  open,
  onNext,
  onClose,
  zIndexClass = "z-[60]",
}: EternlWelcomeModalProps) {
  return (
    <EternlModalShell
      open={open}
      title=""
      onClose={onClose}
      zIndexClass={zIndexClass}
      footer={
        <div className="w-full flex flex-wrap justify-center gap-4">
          <button
            autoFocus
            type="button"
            onClick={onNext}
            aria-label="Start setup"
            className="p-button p-component p-button-rounded et-button w-fit px-12 py-3 text-base font-semibold justify-center bg-brand-red !text-black border-none capitalize shadow-lg !rounded-full"
          >
            <span className="p-button-label px-2 !text-black">Start setup</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center">
        {/* Custom Header within the content area for more control */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight text-white mb-1">
            <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
              Welcome to Eternl!
            </span>
          </h1>
          <p className="text-base sm:text-lg text-center text-white/60">
            a multi-platform Cardano wallet
          </p>
        </div>

        {/* Video Container */}
        <div className="w-full max-w-[360px] aspect-[4/5] mx-auto flex justify-center bg-black/20 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
          <video
            src="/video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </EternlModalShell>
  );
}
