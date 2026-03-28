"use client";

import EternlModalShell from "./EternlModalShell";

export type EternlMode = "simple" | "expert";

export type EternlModeSelectModalProps = {
  open: boolean;
  onBack: () => void;
  onSelect: (mode: EternlMode) => void;
  onClose?: () => void;
  zIndexClass?: string;
};

const MODES: Array<{
  key: EternlMode;
  title: string;
  desc: string;
  icon: string;
}> = [
  {
    key: "simple",
    title: "Simple",
    desc: "Recommended for most users. A clean, streamlined experience focused on standard wallet features.",
    icon: "✨",
  },
  {
    key: "expert",
    title: "Expert",
    desc: "Full control. Advanced staking, multi-sig support, and granular transaction details.",
    icon: "🛠️",
  },
];

/**
 * Step 2: Choose between Simple and Expert mode.
 */
export default function EternlModeSelectModal({
  open,
  onBack,
  onSelect,
  onClose,
  zIndexClass = "z-[62]",
}: EternlModeSelectModalProps) {
  return (
    <EternlModalShell
      open={open}
      title="Choose your mode"
      subtitle="Select how you'd like to use Eternl"
      onBack={onBack}
      onClose={onClose}
      zIndexClass={zIndexClass}
    >
      <div className="flex flex-col gap-4 py-2">
        {MODES.map(({ key, title, desc, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className="group relative flex w-full flex-row items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06] hover:border-white/20"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-2xl transition group-hover:scale-110">
              {icon}
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">{title}</span>
              <span className="text-sm text-white/50 leading-snug">
                {desc}
              </span>
            </div>
            <div className="ml-auto opacity-0 transition group-hover:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-pink-500"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </EternlModalShell>
  );
}
