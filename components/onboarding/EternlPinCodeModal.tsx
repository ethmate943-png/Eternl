"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import EternlModalShell from "./EternlModalShell";

export type EternlPinCodeModalProps = {
  open: boolean;
  onBack: () => void;
  onNext: (pin: string) => void;
  onSkip: () => void;
  onClose?: () => void;
  zIndexClass?: string;
};

/**
 * Step 3: Create PIN Code
 * Allows setting a security PIN or skipping.
 */
export default function EternlPinCodeModal({
  open,
  onBack,
  onNext,
  onSkip,
  onClose,
  zIndexClass = "z-[62]",
}: EternlPinCodeModalProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const handleReset = () => setPin("");

  return (
    <EternlModalShell
      open={open}
      title="Create PIN Code"
      subtitle="Set a PIN code to access Eternl. It'll be required every time you open Eternl."
      onBack={onBack}
      onClose={onClose}
      zIndexClass={zIndexClass}
      footer={
        <div className="w-full flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onSkip}
            className="p-button p-component p-button-secondary p-button-rounded p-button-outlined min-h-11 px-6 rounded-full border border-white/20 bg-transparent text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-button p-component p-button-secondary p-button-rounded p-button-outlined min-h-11 px-6 rounded-full border border-white/20 bg-transparent text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            reset
          </button>
          <button
            type="button"
            disabled={!pin}
            onClick={() => onNext(pin)}
            aria-label="next"
            className="p-button p-component p-button-rounded min-h-11 min-w-[100px] rounded-full bg-gradient-to-b from-rose-400 to-pink-600 px-8 text-sm font-semibold text-white shadow-inner ring-1 ring-black/30 transition enabled:hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            next
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center gap-6 py-4">
        <div className="text-center text-white/70">Enter your PIN Code.</div>

        <div className="relative w-full max-w-sm">
          <input
            autoFocus
            type={showPin ? "text" : "password"}
            id="passwordInput"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full h-14 rounded-full bg-white/10 px-6 text-center text-2xl tracking-[0.5em] text-white ring-1 ring-white/10 outline-none focus:ring-pink-400/40 transition-all"
            placeholder="••••••"
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
          >
            {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </EternlModalShell>
  );
}
