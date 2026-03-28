"use client";

import React from "react";
import { ETERNL_MODAL_BACKDROP } from "./eternlModalBackdrop";

export type EternlWelcomeModalProps = {
  open: boolean;
  onNext: () => void;
  onClose?: () => void;
  zIndexClass?: string;
};

/**
 * Welcome screen — matches the live Eternl onboarding design exactly.
 * Shows "Welcome to Eternl!", the video illustration, and a Start setup button.
 */
export default function EternlWelcomeModal({
  open,
  onNext,
  onClose,
  zIndexClass = "z-[60]",
}: EternlWelcomeModalProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 ${zIndexClass} flex items-center justify-center px-3 pb-0 sm:px-6`}
      role="presentation"
    >
      {/* Backdrop */}
      <button
        type="button"
        className={`absolute inset-0 ${ETERNL_MODAL_BACKDROP}`}
        aria-label="Close"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="et-welcome-title"
        className="relative flex max-h-[95vh] w-full max-w-[640px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#171717] shadow-[0_24px_48px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
      >
        {/* Gradient top bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 overflow-hidden rounded-t-3xl">
          <div className="absolute top-0 h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-fuchsia-500" />
        </div>

        {/* Header */}
        <header className="relative shrink-0 px-4 pt-10 pb-0 sm:px-6">
          <div className="flex flex-col items-center gap-1">
            <h1
              id="et-welcome-title"
              className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight text-white mb-1"
            >
              <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-fuchsia-500 bg-clip-text text-transparent">
                Welcome to Eternl!
              </span>
            </h1>
            <p className="text-base sm:text-lg text-center text-white/60">
              a multi-platform Cardano wallet
            </p>
          </div>
        </header>

        {/* Illustration replaced with video */}
        <div className="modal-content flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-8">
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

        {/* Footer */}
        <footer className="relative shrink-0 px-4 pb-5 pt-2 sm:px-6">
          <div className="w-full flex flex-wrap justify-center gap-4">
            <button
              autoFocus
              type="button"
              onClick={onNext}
              aria-label="Start setup"
              className="p-button p-component p-button-rounded et-button w-full sm:w-auto px-10 py-3 text-base font-semibold justify-center !bg-[#ff4081] !text-black border-none capitalize"
              data-p="rounded"
              data-pc-name="button"
              data-p-disabled="false"
              data-pc-section="root"
            >
              <span className="p-button-label px-2 !text-black" data-pc-section="label">Start setup</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
