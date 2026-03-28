"use client";

import { useState } from "react";
import EternlModalShell from "./EternlModalShell";

export type SeedPhraseLengthOption = "24" | "15" | "12";

const OPTIONS: {
  key: SeedPhraseLengthOption;
  title: string;
  desc: string;
}[] = [
  {
    key: "24",
    title: "24-word phrase",
    desc: "A Shelley wallet created by, say, Eternl or Daedalus.",
  },
  {
    key: "15",
    title: "15-word phrase",
    desc: "Like a Yoroi Shelley wallet.",
  },
  {
    key: "12",
    title: "12-word phrase",
    desc: "A 12-word Shelley wallet.",
  },
];

export type EternlSeedPhraseTypeModalProps = {
  open: boolean;
  onBack: () => void;
  onNext: (length: SeedPhraseLengthOption) => void;
  onClose?: () => void;
  zIndexClass?: string;
};

/**
 * Restore flow: choose 24 / 15 / 12 word seed phrase type.
 */
export default function EternlSeedPhraseTypeModal({
  open,
  onBack,
  onNext,
  onClose,
  zIndexClass = "z-[66]",
}: EternlSeedPhraseTypeModalProps) {
  const [selected, setSelected] = useState<SeedPhraseLengthOption | null>(
    null
  );

  return (
    <EternlModalShell
      open={open}
      title="Seed phrase type"
      subtitle="What kind of wallet would you like to restore?"
      onBack={onBack}
      onClose={onClose}
      zIndexClass={zIndexClass}
      dialogClassName="max-h-[min(85vh,720px)] max-w-4xl"
      footer={
        <div className="flex w-full flex-wrap justify-end gap-2">
          <button
            type="button"
            id="modelSeedPhraseTypeBtnNext"
            disabled={selected === null}
            onClick={() => selected && onNext(selected)}
            aria-label="next"
            className="min-h-11 min-w-[100px] grow rounded-full bg-gradient-to-b from-rose-400 to-pink-600 px-6 text-sm font-semibold text-white shadow-inner ring-1 ring-black/30 transition enabled:hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40 sm:grow-0"
          >
            next
          </button>
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {OPTIONS.map((opt) => {
          const isActive = selected === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelected(opt.key)}
              className={`flex w-full flex-row items-center rounded-2xl border px-3 py-3 text-left shadow-sm transition sm:px-4 sm:py-4 ${
                isActive
                  ? "border-pink-500/50 bg-white/[0.08]"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                <div className="text-base font-semibold capitalize text-white">
                  {opt.title}
                </div>
                <div className="text-sm text-white/50">{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </EternlModalShell>
  );
}
